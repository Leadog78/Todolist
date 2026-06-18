/* ============================================================================
 * PERFECT SEASON — UI controller / game state machine
 * ==========================================================================*/
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const STORE_KEY = "perfectSeason.v1";

  // -------- persistent records --------
  function loadStore() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch {
      return {};
    }
  }
  function saveStore(s) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(s));
    } catch {}
  }

  // -------- screen routing --------
  function show(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $(id).classList.add("active");
  }

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  // ====================== game state ======================
  let state = null;

  function newGame(mode) {
    const isDaily = mode === "daily";
    const seedStr = isDaily ? "daily:" + todayKey() : "endless:" + Date.now() + ":" + Math.random();
    const seed = hashString(seedStr);
    state = {
      mode,
      seedStr,
      seed,
      rng: makeRNG(seed),
      roster: [null, null, null, null, null], // indexed by POSITIONS
      pick: 0,
      rerolls: 3,
      wild: 1,
      current: null, // { team, candidates }
      openPos: null, // currently expanded card index
    };
    state.current = spinTeam(state);
    renderDraft(true);
    show("screen-draft");
  }

  function openSlots() {
    return POSITIONS.map((p, i) => (state.roster[i] ? null : i)).filter((i) => i !== null);
  }

  // ====================== draft rendering ======================
  function renderCourt(targetIdxs) {
    const court = $("court");
    court.innerHTML = "";
    POSITIONS.forEach((pos, i) => {
      const slot = document.createElement("div");
      slot.className = "slot";
      const r = state.roster[i];
      if (r) {
        slot.classList.add("filled");
        slot.innerHTML = `<span class="slot-pos">${pos}</span>
          <span class="slot-name">${r.player.n}</span>
          <span class="slot-era">${r.player.d}</span>`;
      } else {
        if (targetIdxs && targetIdxs.includes(i)) slot.classList.add("target");
        slot.innerHTML = `<span class="slot-pos">${pos}</span><span class="slot-empty">open</span>`;
      }
      court.appendChild(slot);
    });
  }

  function ratingCell(key, label, val) {
    const cls = val >= 86 ? "hi" : val < 68 ? "lo" : "";
    return `<div class="rbar"><span class="rk">${label}</span><span class="rv ${cls}">${Math.round(val)}</span></div>`;
  }

  function candidateCard(player) {
    const open = openSlots();
    const card = document.createElement("div");
    card.className = "pcard";
    card.innerHTML = `
      <div class="pcard-top">
        <div>
          <div class="pcard-name">${player.n}</div>
          <div class="pcard-meta">${player.t} · ${player.d} · <span class="pcard-arch">${player.a}</span></div>
        </div>
        <div class="pcard-pos">${player.p.map((p) => `<span class="pos-pill">${p}</span>`).join("")}</div>
      </div>
      <div class="ratings">
        ${ratingCell("o", "OFF", player.o)}
        ${ratingCell("df", "DEF", player.df)}
        ${ratingCell("pm", "PLY", player.pm)}
        ${ratingCell("rb", "REB", player.rb)}
        ${ratingCell("sh", "SHO", player.sh)}
      </div>
      <div class="pos-choose">
        ${POSITIONS.map((pos, i) => {
          const filled = !!state.roster[i];
          const natural = player.p.includes(pos);
          const cls = natural ? "natural" : "off";
          return `<button class="pc-btn ${cls}" data-pos="${i}" ${filled ? "disabled" : ""}>${pos}</button>`;
        }).join("")}
      </div>`;

    card.querySelector(".pcard-top").addEventListener("click", () => {
      const wasOpen = card.classList.contains("open");
      document.querySelectorAll(".pcard.open").forEach((c) => c.classList.remove("open"));
      if (!wasOpen) {
        card.classList.add("open");
        renderCourt(open); // highlight where they can go
      } else {
        renderCourt();
      }
    });

    card.querySelectorAll(".pc-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.pos, 10);
        if (state.roster[idx]) return;
        draftPlayer(player, idx);
      });
    });

    return card;
  }

  function renderCandidates() {
    const wrap = $("candidates");
    wrap.innerHTML = "";
    state.current.candidates.forEach((p) => wrap.appendChild(candidateCard(p)));
  }

  function renderTokens() {
    $("reroll-count").textContent = state.rerolls;
    $("wild-count").textContent = state.wild;
    $("btn-reroll").disabled = state.rerolls <= 0;
    $("btn-wild").disabled = state.wild <= 0;
    $("pick-label").textContent = `Pick ${Math.min(state.pick + 1, 5)} / 5`;
  }

  function renderDraft(animate) {
    renderCourt();
    renderTokens();
    $("btn-sim").disabled = state.pick < 5;
    if (animate) {
      animateSpin(() => {
        $("spinner-team").textContent = state.current.team;
        renderCandidates();
      });
    } else {
      $("spinner-team").textContent = state.current.team;
      renderCandidates();
    }
  }

  function animateSpin(done) {
    const spinner = $("spinner");
    const teamEl = $("spinner-team");
    spinner.classList.add("spinning");
    let ticks = 0;
    const iv = setInterval(() => {
      teamEl.textContent = TEAMS[Math.floor(Math.random() * TEAMS.length)];
      if (++ticks > 10) {
        clearInterval(iv);
        spinner.classList.remove("spinning");
        done();
      }
    }, 70);
  }

  // ====================== draft actions ======================
  function draftPlayer(player, posIdx) {
    state.roster[posIdx] = { player, pos: POSITIONS[posIdx] };
    state.pick++;
    if (state.pick >= 5) {
      renderCourt();
      renderTokens();
      $("candidates").innerHTML = "";
      $("spinner-team").textContent = "Lineup set!";
      $("btn-sim").disabled = false;
      $("btn-reroll").disabled = true;
      $("btn-wild").disabled = true;
    } else {
      state.current = spinTeam(state);
      renderDraft(true);
    }
  }

  function reroll() {
    if (state.rerolls <= 0 || state.pick >= 5) return;
    state.rerolls--;
    state.current = spinTeam(state);
    renderDraft(true);
  }

  // ---- wildcard ----
  function openWild() {
    if (state.wild <= 0 || state.pick >= 5) return;
    renderWildList("");
    $("wild-search").value = "";
    show("screen-wild");
    setTimeout(() => $("wild-search").focus(), 100);
  }

  function renderWildList(query) {
    const taken = new Set(state.roster.filter(Boolean).map((r) => r.player.n));
    const q = query.trim().toLowerCase();
    const list = PLAYERS.filter(
      (p) => !taken.has(p.n) && (!q || p.n.toLowerCase().includes(q) || p.t.toLowerCase().includes(q))
    ).sort((a, b) => b.o + b.df - (a.o + a.df));

    const wrap = $("wild-list");
    wrap.innerHTML = "";
    list.forEach((player) => {
      const card = candidateCard(player);
      // In wildcard mode, picking spends the token and closes the picker.
      // Clone each button to strip the default draft handler, then re-bind.
      card.querySelectorAll(".pc-btn").forEach((btn) => {
        btn.replaceWith(btn.cloneNode(true));
      });
      card.querySelectorAll(".pc-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.pos, 10);
          if (state.roster[idx]) return;
          state.wild--;
          draftPlayer(player, idx);
          show("screen-draft");
        });
      });
      wrap.appendChild(card);
    });
    if (!list.length) wrap.innerHTML = `<p style="color:var(--muted);text-align:center">No legends match.</p>`;
  }

  // ====================== simulation ======================
  function runSimulation() {
    const slots = state.roster.filter(Boolean);
    const result = simulateSeason(slots, state.seed);
    state.result = result;
    show("screen-sim");

    // build empty grid
    const grid = $("sim-grid");
    grid.innerHTML = "";
    const cells = [];
    for (let i = 0; i < 82; i++) {
      const c = document.createElement("div");
      c.className = "gcell";
      grid.appendChild(c);
      cells.push(c);
    }
    $("sim-bar-fill").style.width = "0%";
    $("sim-wins").textContent = "0";
    $("sim-losses").textContent = "0";

    let w = 0,
      l = 0,
      i = 0;
    const total = result.games.length;
    const statuses = ["Tip-off…", "Early season grind…", "Midseason form…", "Playoff push…", "Down the stretch…"];

    const iv = setInterval(() => {
      const win = result.games[i];
      const cell = cells[i];
      cell.classList.add("show", win ? "w" : "l");
      if (win) w++;
      else l++;
      $("sim-wins").textContent = w;
      $("sim-losses").textContent = l;
      $("sim-bar-fill").style.width = (w / total) * 100 + "%";
      $("sim-status").textContent = statuses[Math.min(statuses.length - 1, Math.floor((i / total) * statuses.length))];
      i++;
      if (i >= total) {
        clearInterval(iv);
        setTimeout(showResult, 650);
      }
    }, 26);
  }

  // ====================== results ======================
  function fitEmoji(fit) {
    if (fit >= 1.0) return "🟢";
    if (fit >= 0.94) return "🟡";
    return "🔴";
  }

  function showResult() {
    const r = state.result;
    const slots = state.roster.filter(Boolean);

    // records
    const store = loadStore();
    store.bestWins = Math.max(store.bestWins || 0, r.wins);
    if (r.wins === 82) store.perfects = (store.perfects || 0) + 1;
    store.played = (store.played || 0) + 1;
    saveStore(store);

    $("grade-badge").className = "grade-badge " + r.grade.cls;
    $("grade-badge").textContent = r.grade.letter;
    $("result-record").textContent = `${r.wins}–${r.losses}`;
    $("result-title").textContent = r.grade.title;

    // lineup with fit emoji
    const lu = $("result-lineup");
    lu.innerHTML = "";
    POSITIONS.forEach((pos, i) => {
      const slot = state.roster[i];
      const ap = slot ? adjustedPlayer(slot) : null;
      const div = document.createElement("div");
      div.className = "rl-slot";
      div.innerHTML = `<div class="rl-pos">${pos}</div>
        <div class="rl-name">${slot.player.n}</div>
        <div class="rl-fit">${fitEmoji(ap.fit)}</div>`;
      lu.appendChild(div);
    });

    $("result-mvp").textContent = r.mvp.name;
    $("result-chem").textContent = Math.round(r.chem.mult * 100) + "%";
    $("result-streak").textContent = r.longestWin + " wins";
    $("result-weak").textContent = r.weakness;

    const cl = $("chem-list");
    cl.innerHTML = "";
    r.chem.breakdown
      .slice()
      .sort((a, b) => b.delta - a.delta)
      .forEach((b) => {
        const li = document.createElement("li");
        li.className = b.kind;
        const sign = b.delta >= 0 ? "+" : "";
        li.innerHTML = `<span>${b.label}</span><span class="cd">${sign}${Math.round(b.delta * 100)}%</span>`;
        cl.appendChild(li);
      });

    $("share-toast").textContent = "";
    show("screen-result");
    if (r.wins === 82) confetti();
  }

  function buildShareText() {
    const r = state.result;
    const fits = POSITIONS.map((pos, i) => fitEmoji(adjustedPlayer(state.roster[i]).fit)).join("");
    const tag = state.mode === "daily" ? `Daily ${todayKey()}` : "Endless";
    return (
      `🏀 PERFECT SEASON — ${tag}\n` +
      `${r.wins}–${r.losses}  ·  Grade ${r.grade.letter} (${r.grade.title})\n` +
      `Starting 5: ${fits}\n` +
      `Chemistry ${Math.round(r.chem.mult * 100)}%  ·  Best streak ${r.longestWin}\n` +
      `Can you go 82–0?`
    );
  }

  async function share() {
    const text = buildShareText();
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(text);
      $("share-toast").textContent = "Copied to clipboard!";
    } catch {
      $("share-toast").textContent = text;
    }
  }

  function confetti() {
    const colors = ["#ffd24a", "#ff7a18", "#34d399", "#60a5fa", "#f87171"];
    for (let i = 0; i < 80; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animation = `fall ${1.4 + Math.random() * 1.6}s ${Math.random()}s ease-in forwards`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3600);
    }
  }

  // ====================== home ======================
  function renderHome() {
    const store = loadStore();
    const chips = [
      ["Best record", store.bestWins ? `${store.bestWins}–${82 - store.bestWins}` : "—"],
      ["Perfect 82–0", store.perfects || 0],
      ["Seasons", store.played || 0],
    ];
    $("home-records").innerHTML = chips
      .map((c) => `<div class="record-chip"><div class="rc-v">${c[1]}</div><div class="rc-k">${c[0]}</div></div>`)
      .join("");
    $("daily-label").textContent = `Today · ${todayKey()}`;
  }

  // ====================== wiring ======================
  $("btn-daily").addEventListener("click", () => newGame("daily"));
  $("btn-endless").addEventListener("click", () => newGame("endless"));
  $("btn-how").addEventListener("click", () => show("screen-how"));
  $("btn-how-back").addEventListener("click", () => { renderHome(); show("screen-home"); });
  $("btn-quit").addEventListener("click", () => { renderHome(); show("screen-home"); });
  $("btn-reroll").addEventListener("click", reroll);
  $("btn-wild").addEventListener("click", openWild);
  $("btn-wild-cancel").addEventListener("click", () => show("screen-draft"));
  $("wild-search").addEventListener("input", (e) => renderWildList(e.target.value));
  $("btn-sim").addEventListener("click", runSimulation);
  $("btn-share").addEventListener("click", share);
  $("btn-again").addEventListener("click", () => newGame(state.mode));
  $("btn-home").addEventListener("click", () => { renderHome(); show("screen-home"); });

  renderHome();
})();
