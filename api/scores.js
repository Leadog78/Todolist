// Vercel serverless function: global top-10 leaderboard for PERFECT SEASON.
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

const KEY = "perfectSeason:scores";
const MAX_KEEP = 50; // stored entries; responses return the top 10

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
async function storeGet(be) {
  let raw;
  if (be.type === "url") {
    [raw] = await redisUrlCommands(be.url, [["GET", KEY]]);
  } else {
    const r = await fetch(`${be.url}/get/${KEY}`, {
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

async function storeSet(be, value) {
  if (be.type === "url") {
    await redisUrlCommands(be.url, [["SET", KEY, JSON.stringify(value)]]);
    return;
  }
  const r = await fetch(`${be.url}/set/${KEY}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${be.token}` },
    body: JSON.stringify(value),
  });
  if (!r.ok) throw new Error(`redis set ${r.status}`);
}

// Same ranking as the in-game board: wins, then longest streak, then ring,
// then earliest achiever.
function sortScores(a, b) {
  return (
    b.wins - a.wins ||
    b.streak - a.streak ||
    (b.ring ? 1 : 0) - (a.ring ? 1 : 0) ||
    a.ts - b.ts
  );
}

// Strict shape check — the endpoint is public, so trust nothing.
function sanitize(body) {
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
    mode: body.mode === "daily" ? "daily" : "endless",
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
      const scores = (await storeGet(be)).sort(sortScores);
      return res.status(200).json({ scores: scores.slice(0, 10) });
    }

    if (req.method === "POST") {
      const entry = sanitize(req.body || {});
      if (!entry) return res.status(400).json({ error: "Invalid score" });
      const scores = await storeGet(be);
      // (ini, ts) identifies a season — a resubmit (ring upgrade) replaces it.
      const i = scores.findIndex((s) => s.ts === entry.ts && s.ini === entry.ini);
      if (i >= 0) scores[i] = entry;
      else scores.push(entry);
      scores.sort(sortScores);
      const kept = scores.slice(0, MAX_KEEP);
      await storeSet(be, kept);
      return res.status(200).json({ scores: kept.slice(0, 10) });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch {
    return res.status(502).json({ error: "Storage unavailable" });
  }
}
