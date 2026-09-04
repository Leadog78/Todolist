// Vercel serverless function: global top-10 leaderboards for PERFECT SEASON
// (basketball) and THE INVINCIBLES (football, /soccer).
//
// Works with either kind of Redis you can attach in Vercel's Storage tab:
//  - "Redis" (Redis Cloud marketplace) — injects REDIS_URL, spoken here over
//    the plain Redis protocol with a tiny built-in zero-dependency client;
//  - "Upstash for Redis" — injects KV_REST_API_* / UPSTASH_REDIS_REST_*,
//    spoken over Upstash's HTTPS REST API.
// Connect the store to the project and redeploy. Without any of these env
// vars the endpoint returns 503 and the game silently falls back to its
// device-local board, so the static game keeps working everywhere.

import net from "node:net";
import tls from "node:tls";

const MAX_KEEP = 50; // stored entries; responses return the top 10

// Four boards: the basketball pair keeps its original keys, the football
// pair lives under its own namespace. Anything unrecognized is classic.
const KEYS = {
  classic: "perfectSeason:scores",
  cap: "perfectSeason:scores:cap",
  soccer: "invincibles:scores",
  "soccer-cap": "invincibles:scores:cap",
};
function boardKey(board) {
  return KEYS[board] || KEYS.classic;
}
function isSoccer(board) {
  return board === "soccer" || board === "soccer-cap";
}

function backend() {
  if (process.env.REDIS_URL) return { type: "url", url: process.env.REDIS_URL };
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return { type: "rest", url, token };
  return null;
}

/* ---- minimal RESP client (GET/SET/AUTH only) for REDIS_URL stores ------- */
function respEncode(args) {
  return (
    `*${args.length}\r\n` +
    args.map((a) => `$${Buffer.byteLength(String(a))}\r\n${a}\r\n`).join("")
  );
}

// Parse one RESP reply from buf at offset. Returns {value, next} or null if
// the reply is still incomplete. Errors come back as Error instances.
function respParse(buf, offset) {
  const nl = buf.indexOf("\r\n", offset);
  if (nl < 0) return null;
  const head = buf.toString("utf8", offset + 1, nl);
  const type = buf.toString("utf8", offset, offset + 1);
  if (type === "+") return { value: head, next: nl + 2 };
  if (type === "-") return { value: new Error(head), next: nl + 2 };
  if (type === ":") return { value: parseInt(head, 10), next: nl + 2 };
  if (type === "$") {
    const len = parseInt(head, 10);
    if (len === -1) return { value: null, next: nl + 2 };
    const end = nl + 2 + len;
    if (buf.length < end + 2) return null;
    return { value: buf.toString("utf8", nl + 2, end), next: end + 2 };
  }
  if (type === "*") {
    const n = parseInt(head, 10);
    let at = nl + 2;
    const items = [];
    for (let i = 0; i < n; i++) {
      const r = respParse(buf, at);
      if (!r) return null;
      items.push(r.value);
      at = r.next;
    }
    return { value: items, next: at };
  }
  return { value: new Error("bad RESP type " + type), next: nl + 2 };
}

function redisUrlCommands(rawUrl, commands) {
  return new Promise((resolve, reject) => {
    const u = new URL(rawUrl);
    const port = Number(u.port) || 6379;
    const pipeline = [];
    if (u.password)
      pipeline.push(u.username && u.username !== "default" ? ["AUTH", u.username, u.password] : ["AUTH", u.password]);
    pipeline.push(...commands);

    const sock =
      u.protocol === "rediss:"
        ? tls.connect({ host: u.hostname, port, servername: u.hostname })
        : net.connect({ host: u.hostname, port });
    const done = (err, replies) => {
      sock.destroy();
      err ? reject(err) : resolve(replies);
    };
    sock.setTimeout(4000, () => done(new Error("redis timeout")));
    sock.on("error", (e) => done(e));
    sock.on(u.protocol === "rediss:" ? "secureConnect" : "connect", () => {
      sock.write(pipeline.map(respEncode).join(""));
    });

    let buf = Buffer.alloc(0);
    const replies = [];
    sock.on("data", (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      let at = 0;
      let r;
      while ((r = respParse(buf, at))) {
        if (r.value instanceof Error) return done(r.value);
        replies.push(r.value);
        at = r.next;
        if (replies.length === pipeline.length) {
          // Drop AUTH's reply so callers see only their commands' replies.
          return done(null, u.password ? replies.slice(1) : replies);
        }
      }
      buf = buf.subarray(at);
    });
  });
}

/* ---- unified storage ---------------------------------------------------- */
async function storeGet(be, key) {
  let raw;
  if (be.type === "url") {
    [raw] = await redisUrlCommands(be.url, [["GET", key]]);
  } else {
    const r = await fetch(`${be.url}/get/${key}`, {
      headers: { Authorization: `Bearer ${be.token}` },
    });
    if (!r.ok) throw new Error(`redis get ${r.status}`);
    raw = (await r.json()).result;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function storeSet(be, key, value) {
  if (be.type === "url") {
    await redisUrlCommands(be.url, [["SET", key, JSON.stringify(value)]]);
    return;
  }
  const r = await fetch(`${be.url}/set/${key}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${be.token}` },
    body: JSON.stringify(value),
  });
  if (!r.ok) throw new Error(`redis set ${r.status}`);
}

// Same rankings as the in-game boards. Basketball: wins, then longest streak,
// then ring, then earliest achiever.
function sortHoops(a, b) {
  return (
    b.wins - a.wins ||
    b.streak - a.streak ||
    (b.ring ? 1 : 0) - (a.ring ? 1 : 0) ||
    a.ts - b.ts
  );
}
// Football: points, then longest unbeaten run, then trophy, then earliest.
function sortSoccer(a, b) {
  return (
    b.pts - a.pts ||
    b.streak - a.streak ||
    (b.ring ? 1 : 0) - (a.ring ? 1 : 0) ||
    a.ts - b.ts
  );
}
function sortFor(board) {
  return isSoccer(board) ? sortSoccer : sortHoops;
}

// Strict shape checks — the endpoint is public, so trust nothing.
function sanitizeHoops(body) {
  const ini = String(body.ini || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 3);
  const wins = Math.round(Number(body.wins));
  const losses = Math.round(Number(body.losses));
  const streak = Math.round(Number(body.streak));
  const ts = Math.round(Number(body.ts));
  if (!ini) return null;
  if (!Number.isFinite(wins) || wins < 0 || wins > 82) return null;
  if (!Number.isFinite(losses) || losses !== 82 - wins) return null;
  if (!Number.isFinite(streak) || streak < 0 || streak > wins) return null;
  return {
    ini,
    wins,
    losses,
    streak,
    ring: body.ring === true,
    mode: body.mode === "cap" ? "cap" : "endless",
    ts: Number.isFinite(ts) && ts > 0 ? ts : Date.now(),
  };
}

// Football seasons: 38 matches, 3 pts a win, 1 a draw; streak is the longest
// unbeaten run (draws count, so it may exceed wins).
function sanitizeSoccer(body) {
  const ini = String(body.ini || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 3);
  const wins = Math.round(Number(body.wins));
  const draws = Math.round(Number(body.draws));
  const losses = Math.round(Number(body.losses));
  const pts = Math.round(Number(body.pts));
  const streak = Math.round(Number(body.streak));
  const ts = Math.round(Number(body.ts));
  if (!ini) return null;
  if (!Number.isFinite(wins) || wins < 0) return null;
  if (!Number.isFinite(draws) || draws < 0) return null;
  if (!Number.isFinite(losses) || losses < 0) return null;
  if (wins + draws + losses !== 38) return null;
  if (!Number.isFinite(pts) || pts !== 3 * wins + draws) return null;
  if (!Number.isFinite(streak) || streak < 0 || streak > 38) return null;
  return {
    ini,
    wins,
    draws,
    losses,
    pts,
    streak,
    ring: body.ring === true,
    mode: body.mode === "cap" ? "cap" : "endless",
    ts: Number.isFinite(ts) && ts > 0 ? ts : Date.now(),
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const be = backend();
  if (!be) return res.status(503).json({ error: "Leaderboard storage not configured" });

  try {
    if (req.method === "GET") {
      // Vercel populates req.query; fall back to parsing the raw URL when a
      // barer runtime hands us only req.url.
      const query =
        req.query || Object.fromEntries(new URL(req.url || "/", "http://x").searchParams);
      const key = boardKey(query.board);
      const scores = (await storeGet(be, key)).sort(sortFor(query.board));
      return res.status(200).json({ scores: scores.slice(0, 10) });
    }

    if (req.method === "POST") {
      const board = (req.body || {}).board;
      const key = boardKey(board);
      const entry = (isSoccer(board) ? sanitizeSoccer : sanitizeHoops)(req.body || {});
      if (!entry) return res.status(400).json({ error: "Invalid score" });
      const scores = await storeGet(be, key);
      // (ini, ts) identifies a season — a resubmit (ring/trophy upgrade)
      // replaces it.
      const i = scores.findIndex((s) => s.ts === entry.ts && s.ini === entry.ini);
      if (i >= 0) scores[i] = entry;
      else scores.push(entry);
      scores.sort(sortFor(board));
      const kept = scores.slice(0, MAX_KEEP);
      await storeSet(be, key, kept);
      return res.status(200).json({ scores: kept.slice(0, 10) });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch {
    return res.status(502).json({ error: "Storage unavailable" });
  }
}
