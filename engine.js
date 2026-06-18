/* ============================================================================
 * PERFECT SEASON — game engine
 * Seeded RNG, draft pool generation, transparent chemistry, and the
 * game-by-game season simulation.
 * ==========================================================================*/

/* ---- Seeded RNG (mulberry32) ----------------------------------------------
 * Deterministic so the Daily Challenge is identical for everyone on a date,
 * and so a finished season can be re-simulated/shared reliably. */
function makeRNG(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---- Spin: pick a franchise and offer its undrafted legends --------------*/
function spinTeam(state) {
  // Teams that still have at least one undrafted player.
  const taken = new Set(state.roster.filter(Boolean).map((r) => r.player.n));
  const available = TEAMS.filter((t) =>
    PLAYERS.some((p) => p.t === t && !taken.has(p.n))
  );
  const team = available[Math.floor(state.rng() * available.length)];
  const candidates = PLAYERS.filter((p) => p.t === team && !taken.has(p.n));
  return { team, candidates: shuffle(candidates, state.rng) };
}

/* ---- Position fit ---------------------------------------------------------
 * Players placed at a non-natural position lose some effectiveness. */
function positionFit(player, pos) {
  if (player.p[0] === pos) return 1.0; // primary spot
  if (player.p.includes(pos)) return 0.94; // secondary spot
  // Off-position: how far away on the PG..C spectrum?
  const idx = (x) => POSITIONS.indexOf(x);
  const dist = Math.min(...player.p.map((np) => Math.abs(idx(np) - idx(pos))));
  return Math.max(0.74, 1.0 - dist * 0.09);
}

function adjustedPlayer(slot) {
  const { player, pos } = slot;
  const fit = positionFit(player, pos);
  const pace = ERA_PACE[player.d] || 1.0;
  return {
    name: player.n,
    pos,
    fit,
    o: player.o * fit * pace,
    df: player.df * fit,
    pm: player.pm * fit,
    rb: player.rb * fit,
    sh: player.sh,
    raw: player,
  };
}

/* ---- Transparent chemistry ------------------------------------------------
 * Returns { mult, breakdown:[{label, delta, kind}] } where mult multiplies
 * overall team strength. Everything here is shown to the player. */
function computeChemistry(slots) {
  const ap = slots.map(adjustedPlayer);
  const breakdown = [];
  const add = (label, delta) =>
    breakdown.push({ label, delta, kind: delta >= 0 ? "good" : "bad" });

  // Position coverage — reward a true 5-position lineup.
  const distinctNatural = new Set();
  ap.forEach((p) => {
    if (p.raw.p[0] === p.pos) distinctNatural.add(p.pos);
  });
  if (distinctNatural.size === 5) add("Balanced lineup — every spot is a natural fit", 0.05);

  // Off-position penalties.
  const offPos = ap.filter((p) => p.fit < 0.95);
  if (offPos.length)
    add(`${offPos.length} player(s) out of position`, -0.03 * offPos.length);

  // Spacing — modern game needs shooting.
  const shooters = ap.filter((p) => p.sh >= 80).length;
  if (shooters >= 2) add(`Elite floor spacing (${shooters} shooters)`, 0.05);
  else if (shooters === 0) add("No outside shooting — defenses pack the paint", -0.08);

  // Primary facilitator.
  const bestPm = Math.max(...ap.map((p) => p.pm));
  if (bestPm >= 90) add("Elite floor general distributes the ball", 0.05);
  else if (bestPm < 74) add("No real playmaker — stagnant offense", -0.06);

  // Rim protection.
  const anchor = ap.some((p) => (p.pos === "C" || p.pos === "PF") && p.df >= 86);
  if (anchor) add("Anchored defense with a rim protector", 0.05);
  else add("No rim protector — soft interior defense", -0.05);

  // Usage clash — too many ball-dominant scorers.
  const highUsage = ap.filter((p) => p.o >= 88 && p.pm < 80).length;
  if (highUsage >= 4) add("Too many ball-dominant scorers — only one ball", -0.07);
  else if (highUsage === 3) add("Crowded shot diet", -0.02);

  // Two-way versatility bonus.
  const twoWay = ap.filter((p) => p.o >= 80 && p.df >= 84).length;
  if (twoWay >= 2) add(`Two-way versatility (${twoWay} two-way players)`, 0.04);

  // Era cohesion — same-era stacks gel; five different eras takes time.
  const decades = ap.map((p) => p.raw.d);
  const counts = {};
  decades.forEach((d) => (counts[d] = (counts[d] || 0) + 1));
  const topEra = Math.max(...Object.values(counts));
  if (topEra >= 3) add("Same-era core — instant chemistry", 0.04);
  else if (new Set(decades).size === 5) add("Five different eras — slow to gel", -0.04);

  const sum = breakdown.reduce((s, b) => s + b.delta, 0);
  const mult = Math.max(0.78, Math.min(1.14, 1 + sum));
  return { mult, breakdown };
}

/* ---- Team strength categories --------------------------------------------*/
function teamMetrics(slots) {
  const ap = slots.map(adjustedPlayer);
  const avg = (k) => ap.reduce((s, p) => s + p[k], 0) / ap.length;
  const bestPm = Math.max(...ap.map((p) => p.pm));

  const offense = avg("o") * 0.62 + bestPm * 0.18 + avg("sh") * 0.20;
  const defense = avg("df") * 0.72 + avg("rb") * 0.28;
  const playmaking = bestPm * 0.6 + avg("pm") * 0.4;
  const rebounding = avg("rb");
  const spacing = avg("sh");

  return { offense, defense, playmaking, rebounding, spacing, ap };
}

/* ---- Per-game win probability --------------------------------------------*/
function baseWinProb(metrics, chemMult) {
  const overall = (metrics.offense * 0.5 + metrics.defense * 0.5) * chemMult;
  // Tuned so a strong balanced legend roster wins ~75-88% of games, and a
  // near-perfectly constructed elite team can flirt with 82-0.
  const LEAGUE = 84.5;
  const SCALE = 5.2;
  const p = 1 / (1 + Math.exp(-(overall - LEAGUE) / SCALE));
  return Math.max(0.06, Math.min(0.985, p));
}

/* ---- Simulate an 82-game season with hot-hand momentum -------------------*/
function simulateSeason(slots, seed) {
  const metrics = teamMetrics(slots);
  const chem = computeChemistry(slots);
  const p0 = baseWinProb(metrics, chem.mult);
  const rng = makeRNG(seed ^ 0x9e3779b9);

  const games = [];
  let wins = 0,
    losses = 0,
    streak = 0,
    longestWin = 0,
    longestLoss = 0,
    curLoss = 0;

  for (let g = 0; g < 82; g++) {
    // Momentum: confidence rides a win streak (and dips on a skid). Kept small
    // so it adds drama without turning a perfect season into a coin flip.
    const momentum = Math.max(-0.02, Math.min(0.012, streak * 0.002));
    const p = Math.max(0.04, Math.min(0.99, p0 + momentum));
    const win = rng() < p;
    if (win) {
      wins++;
      streak = streak >= 0 ? streak + 1 : 1;
      longestWin = Math.max(longestWin, streak);
      curLoss = 0;
    } else {
      losses++;
      streak = streak <= 0 ? streak - 1 : -1;
      curLoss++;
      longestLoss = Math.max(longestLoss, curLoss);
    }
    games.push(win);
  }

  // MVP — biggest all-around contribution.
  const contrib = metrics.ap.map((p) => ({
    name: p.name,
    pos: p.pos,
    score: p.o * 0.4 + p.df * 0.25 + p.pm * 0.2 + p.rb * 0.15,
  }));
  contrib.sort((a, b) => b.score - a.score);

  // Weakness — lowest category relative to a soft baseline.
  const cats = [
    ["Offense", metrics.offense, 84],
    ["Defense", metrics.defense, 84],
    ["Playmaking", metrics.playmaking, 84],
    ["Rebounding", metrics.rebounding, 80],
    ["Spacing", metrics.spacing, 78],
  ];
  cats.sort((a, b) => a[1] - a[2] - (b[1] - b[2]));
  const weakness = cats[0][0];

  return {
    wins,
    losses,
    games,
    longestWin,
    longestLoss,
    perGame: p0,
    chem,
    metrics,
    mvp: contrib[0],
    weakness,
    grade: gradeFor(wins),
  };
}

function gradeFor(wins) {
  if (wins === 82) return { letter: "82-0", title: "PERFECT", cls: "perfect" };
  if (wins >= 73) return { letter: "S", title: "All-Time Great", cls: "s" };
  if (wins >= 64) return { letter: "A", title: "Title Contender", cls: "a" };
  if (wins >= 54) return { letter: "B", title: "Playoff Team", cls: "b" };
  if (wins >= 41) return { letter: "C", title: "Play-In Hopeful", cls: "c" };
  if (wins >= 28) return { letter: "D", title: "Lottery Bound", cls: "d" };
  return { letter: "F", title: "Tank Commander", cls: "f" };
}
