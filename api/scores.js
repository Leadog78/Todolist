// Vercel serverless function: global top-10 leaderboard for PERFECT SEASON.
//
// Storage is any Upstash-compatible Redis REST endpoint. On Vercel, add the
// free "Upstash for Redis" integration (Marketplace → Storage) to the project
// and redeploy — it injects the env vars read below automatically. Without
// them this endpoint returns 503 and the game silently falls back to its
// device-local board, so the static game keeps working everywhere.

const KEY = "perfectSeason:scores";
const MAX_KEEP = 50; // stored entries; responses return the top 10

function redisEnv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function redisGet(env) {
  const r = await fetch(`${env.url}/get/${KEY}`, {
    headers: { Authorization: `Bearer ${env.token}` },
  });
  if (!r.ok) throw new Error(`redis get ${r.status}`);
  const data = await r.json();
  try {
    const parsed = JSON.parse(data.result);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function redisSet(env, value) {
  const r = await fetch(`${env.url}/set/${KEY}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.token}` },
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

  const env = redisEnv();
  if (!env) return res.status(503).json({ error: "Leaderboard storage not configured" });

  try {
    if (req.method === "GET") {
      const scores = (await redisGet(env)).sort(sortScores);
      return res.status(200).json({ scores: scores.slice(0, 10) });
    }

    if (req.method === "POST") {
      const entry = sanitize(req.body || {});
      if (!entry) return res.status(400).json({ error: "Invalid score" });
      const scores = await redisGet(env);
      // (ini, ts) identifies a season — a resubmit (ring upgrade) replaces it.
      const i = scores.findIndex((s) => s.ts === entry.ts && s.ini === entry.ini);
      if (i >= 0) scores[i] = entry;
      else scores.push(entry);
      scores.sort(sortScores);
      const kept = scores.slice(0, MAX_KEEP);
      await redisSet(env, kept);
      return res.status(200).json({ scores: kept.slice(0, 10) });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch {
    return res.status(502).json({ error: "Storage unavailable" });
  }
}
