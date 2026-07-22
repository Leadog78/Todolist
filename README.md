# 🏀 PERFECT SEASON

**Draft five basketball legends, build chemistry, and simulate an 82-game season. Can your roster go a perfect 82–0?**

A fast, polished, fully self-contained web game inspired by [82-0.com](https://www.82-0.com) — but rebuilt to be deeper, more transparent, and more replayable. The **entire game is one file** (`index.html`) — no backend, no build step, no dependencies, nothing to install.

> This is a non-commercial fan project. Player ratings are subjective approximations on a "legend scale" and are meant for fun.

## Play

**Just double-click `index.html`** — it opens in any browser and runs completely offline. Everything (styles, game logic, the full player database) is baked into that single file, so it works even if you open it straight out of a download folder.

> Downloaded the repo as a ZIP? You don't even need to unzip everything — `index.html` is fully standalone. (To serve it instead: `python3 -m http.server 8000`.)

### Play online

The game is live on **GitHub Pages**: <https://leadog78.github.io/Todolist/> (auto-republishes on every push to `main`).

### Deploy to Vercel

The repo is Vercel-ready (`vercel.json` marks it as a plain static site — no framework, no build step):

1. Go to [vercel.com/new](https://vercel.com/new) and **Import** this GitHub repo.
2. Leave every setting as detected — Framework Preset: **Other**, no Build Command, no Output Directory.
3. Click **Deploy**. Done — you'll get a `*.vercel.app` URL, and every push to `main` redeploys automatically.

Or from the CLI: `npx vercel --prod` from the repo root.

## How it works

1. **Spin the era + franchise.** Each round the slot machine rolls a random **decade and team** (e.g. `1990s · Bulls`, `2020s · Nuggets`). Draft **one** of the legends who played there.
2. **Fill all five spots** — PG, SG, SF, PF, C. Play someone out of position and they lose effectiveness.
3. **Build chemistry.** Spacing, a real playmaker, and a rim protector all matter. Stacking ball-dominant scorers backfires.
4. **Spend your tokens.** **Reroll** (×3) deals a new era+team; the one-time **Wildcard** (×1) lets you draft *any* legend.
5. **Simulate 82 games** and see your record, letter grade, MVP, best win streak, and biggest weakness.
6. **Run the playoffs.** Make the cut and your record sets your **seed**, then you battle through a 4-round best-of-7 bracket (Round 1 → Conf. Semis → Conf. Finals → Finals) against progressively tougher opponents, with home-court for high seeds. Survive all four rounds to win a **ring** 🏆 — even an 82–0 juggernaut still has to earn it.

### Modes & options
- **Daily Challenge** — seeded so everyone gets the same draft each day.
- **Endless Mode** — fresh random draft every time.
- **🕶️ Pro Scout Mode** (toggle) — hides all stats *and* the archetype label. You draft on **name, team, era, position and listed height** alone. For players who actually know their hoops history.

### About the database
**~600 players across 58 real team-eras**, spanning the **1960s–2020s** — each team-era is a believable 10–14-man rotation (stars *and* genuine role players), every one with a listed height. Because most of a roster is role players, picking well is genuinely hard, especially in Pro Mode. Many stars appear as multiple **era-specific versions** — 2000s Cavs LeBron, 2010s Heat LeBron and 2020s Lakers LeBron are different cards with different ratings — so which era you roll matters. You can only draft a given name once.

## How it's different from / better than 82-0

| | 82-0.com | **Perfect Season** |
|---|---|---|
| Roster scoring | Black-box number | **Transparent chemistry breakdown** — every bonus & penalty shown |
| Result | Instant record | **Animated game-by-game season** with hot-hand momentum & streaks |
| Skips | 2 plain skips | **Reroll tokens + a one-time Wildcard** for any legend |
| Replay hook | — | **Daily Challenge** (everyone drafts the same teams) + **Endless mode** |
| Sharing | — | **Wordle-style shareable result** (🟢🟡🔴 fit grid) |
| Progress | — | Local **best record / perfect-season / games-played** tracking |

The chemistry engine is the heart of it: even an all-GOAT lineup (Magic / Jordan / LeBron / Duncan / Hakeem) has a flaw — *spacing* — so chasing a perfect season is about **construction**, not just collecting stars.

## Project structure

The whole game ships as a **single self-contained `index.html`** — markup, all styling (dark theme, responsive, mobile-first), the ~600-player database, the seeded RNG + chemistry + season-simulation engine, and the UI controller (including Pro Scout Mode) are all inlined into that one file. That's what makes it openable anywhere with zero setup.

The simulation is **seeded** (`mulberry32`), so the Daily Challenge is identical for everyone on a given date and results are reproducible.

## Balance

Tuned so the curve rewards smart construction (validated over thousands of simulated seasons):

- A theoretically perfect, balanced GOAT lineup → ~80 wins, with a rare **~12%** shot at 82–0.
- A great-but-flawed lineup → ~70 wins, but **won't** run the table without fixing its weakness.
- Redundant, defense-light rosters → ~15–30 wins.

Going 82–0 is meant to be a genuine, hard-earned achievement. 🏆
