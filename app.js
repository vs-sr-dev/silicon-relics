/* ============================================================
   SILICON RELICS — rendering engine
   Reads PLATFORMS / PROJECTS from data.js and renders the codex.
   This file should not need edits during content sweeps.
   ============================================================ */

(function () {
  "use strict";

  const state = { sort: "gen", type: "all", query: "" };

  const $ = (sel, root) => (root || document).querySelector(sel);

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  /* ---------- Header ---------- */

  function renderHero() {
    $("#tagline").textContent = SITE.tagline;

    const total = PROJECTS.length;
    const completed = PROJECTS.filter(p => p.status === "completed").length;
    const legendary = PLATFORMS.filter(p => p.rarity === "legendary").length;

    $("#hero-stats").innerHTML = [
      [PLATFORMS.length, "Relics"],
      [total, "Quests"],
      [completed, "Completed"],
      [legendary, "Legendary"],
    ].map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join("");

    $("#footer-updated").textContent = "Codex last inscribed on " + SITE.updated;
  }

  /* ---------- Filters ---------- */

  function renderTypeChips() {
    const group = $("#type-group");
    const chips = [["all", "All Quests"]].concat(Object.entries(TYPES));
    group.innerHTML = chips.map(([key, label]) =>
      `<button class="chip chip-type${key === "all" ? " active" : ""}" data-type="${key}">${esc(label)}</button>`
    ).join("");
  }

  function matchesFilters(q, platform) {
    if (state.type !== "all" && q.type !== state.type) return false;
    if (state.query) {
      const hay = [q.title, q.summary, platform.name, platform.maker, TYPES[q.type] || ""]
        .join(" ").toLowerCase();
      if (!hay.includes(state.query)) return false;
    }
    return true;
  }

  /* ---------- Rendering ---------- */

  function questCard(q) {
    const st = STATUSES[q.status] || STATUSES.accepted;
    const badges = (q.badges || [])
      .map(id => BADGES[id])
      .filter(Boolean)
      .map(b => `<span class="badge" title="${esc(b.label)} — ${esc(b.desc)}">${b.icon} ${esc(b.label)}</span>`)
      .join("");

    const milestones = (q.milestones || []).length ? `
      <details class="milestones">
        <summary>Milestones (${q.milestones.filter(m => m.done).length}/${q.milestones.length})</summary>
        <ul>${q.milestones.map(m => `<li class="${m.done ? "done" : ""}">${esc(m.label)}</li>`).join("")}</ul>
      </details>` : "";

    const shots = (q.screenshots || []).length ? `
      <div class="shots">${q.screenshots.map(s =>
        `<img src="${esc(s)}" alt="Screenshot of ${esc(q.title)}" loading="lazy" data-lightbox>`
      ).join("")}</div>` : "";

    const repo = q.repo ? `<div class="quest-links"><a href="${esc(q.repo)}" target="_blank" rel="noopener">⟡ View on GitHub</a></div>` : "";

    return `
      <article class="quest${q.status === "completed" ? " completed-glow" : ""}">
        <div class="quest-top">
          <h4>${esc(q.title)}</h4>
          <span class="type-tag">${esc(TYPES[q.type] || q.type)}</span>
        </div>
        <div class="status-line ${st.cls}"><span class="status-dot"></span>${esc(st.label)}</div>
        <div class="xp">
          <div class="xp-fill" data-progress="${Math.max(0, Math.min(100, q.progress || 0))}"></div>
          <div class="xp-label">${Math.max(0, Math.min(100, q.progress || 0))}%</div>
        </div>
        <p class="quest-summary">${esc(q.summary)}</p>
        ${milestones}
        ${badges ? `<div class="badges">${badges}</div>` : ""}
        ${shots}
        ${repo}
      </article>`;
  }

  function platformSection(p, quests) {
    const rar = RARITIES[p.rarity] || RARITIES.common;
    const questHtml = quests.length
      ? quests.map(questCard).join("")
      : `<div class="quests-empty">No quests inscribed for this relic yet.</div>`;

    return `
      <section class="platform" style="--rarity: var(--r-${esc(p.rarity)})">
        <header class="platform-crest">
          <h3>${esc(p.name)}</h3>
          <span class="platform-meta">${esc(p.maker)} · ${p.year}</span>
          <span class="rarity-tag">${esc(rar.label)}</span>
        </header>
        ${p.blurb ? `<div class="platform-blurb">${esc(p.blurb)}</div>` : ""}
        <div class="quests">${questHtml}</div>
      </section>`;
  }

  function render() {
    const codex = $("#codex");
    const filtering = state.type !== "all" || state.query !== "";

    const visible = PLATFORMS.map(p => ({
      platform: p,
      quests: PROJECTS.filter(q => q.platform === p.id && matchesFilters(q, p)),
    })).filter(entry => filtering ? entry.quests.length > 0 : true);

    if (!visible.length) {
      codex.innerHTML = `<div class="codex-empty">The codex holds no such quest… try another incantation.</div>`;
      return;
    }

    let html = "";

    if (state.sort === "alpha") {
      visible
        .sort((a, b) => a.platform.name.localeCompare(b.platform.name))
        .forEach(e => { html += platformSection(e.platform, e.quests); });
    } else {
      const byGen = new Map();
      visible.forEach(e => {
        if (!byGen.has(e.platform.gen)) byGen.set(e.platform.gen, []);
        byGen.get(e.platform.gen).push(e);
      });
      [...byGen.keys()].sort((a, b) => a - b).forEach(gen => {
        const info = GENERATIONS[gen] || { num: gen, era: "" };
        html += `
          <div class="gen-header">
            <h2>Generation ${esc(info.num)}</h2>
            <div class="rule"></div>
            ${info.era ? `<span class="era">${esc(info.era)}</span>` : ""}
          </div>`;
        byGen.get(gen)
          .sort((a, b) => a.platform.name.localeCompare(b.platform.name))
          .forEach(e => { html += platformSection(e.platform, e.quests); });
      });
    }

    codex.innerHTML = html;
    animateBars();
  }

  /* XP bars fill when they scroll into view. */
  function animateBars() {
    const bars = document.querySelectorAll(".xp-fill");
    if (!("IntersectionObserver" in window)) {
      bars.forEach(b => { b.style.width = b.dataset.progress + "%"; });
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.width = en.target.dataset.progress + "%";
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(b => io.observe(b));
  }

  /* ---------- Events ---------- */

  function wireEvents() {
    $("#sort-group").addEventListener("click", e => {
      const btn = e.target.closest(".chip-sort");
      if (!btn) return;
      state.sort = btn.dataset.sort;
      document.querySelectorAll(".chip-sort").forEach(c => c.classList.toggle("active", c === btn));
      render();
    });

    $("#type-group").addEventListener("click", e => {
      const btn = e.target.closest(".chip-type");
      if (!btn) return;
      state.type = btn.dataset.type;
      document.querySelectorAll(".chip-type").forEach(c => c.classList.toggle("active", c === btn));
      render();
    });

    let debounce;
    $("#search").addEventListener("input", e => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        state.query = e.target.value.trim().toLowerCase();
        render();
      }, 150);
    });

    const lightbox = $("#lightbox");
    document.addEventListener("click", e => {
      const img = e.target.closest("[data-lightbox]");
      if (img) {
        $("#lightbox-img").src = img.src;
        lightbox.hidden = false;
      } else if (e.target.closest("#lightbox")) {
        lightbox.hidden = true;
      }
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") lightbox.hidden = true;
    });
  }

  renderHero();
  renderTypeChips();
  wireEvents();
  render();
})();
