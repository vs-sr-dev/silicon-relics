/* ============================================================
   SILICON RELICS — rendering engine
   Reads PLATFORMS / PROJECTS from data.js and renders the codex.
   This file should not need edits during content sweeps.
   ============================================================ */

(function () {
  "use strict";

  const state = { sort: "gen", type: "all", query: "", lang: "en" };

  const $ = (sel, root) => (root || document).querySelector(sel);

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  /* ---------- i18n ----------
     Translation tables live in data.js (I18N[lang]); English is the base,
     and any missing string falls back to the source. Content is keyed by the
     platform/project id; chrome strings by their English text. */

  function L() {
    return (typeof I18N !== "undefined" && I18N[state.lang]) || null;
  }
  /* Chrome string: look up the English source in ui, else return it. */
  function tUI(s) {
    const l = L();
    return (l && l.ui && l.ui[s] != null) ? l.ui[s] : s;
  }
  /* Simple table (types/statuses/rarities): key → string. */
  function tr(cat, key, fallback) {
    const l = L();
    return (l && l[cat] && l[cat][key] != null) ? l[cat][key] : fallback;
  }
  /* Content field on a platform/project, by id. milestones/links come back
     as parallel arrays of translated strings (indexed like the source). */
  function tContent(bag, obj, field) {
    const l = L();
    const t = l && l[bag] && l[bag][obj.id];
    return (t && t[field] != null) ? t[field] : obj[field];
  }
  const tPlatform = (p, f) => tContent("platforms", p, f);
  const tProject = (q, f) => tContent("projects", q, f);

  /* ---------- Header ---------- */

  function renderHero() {
    const l = L();
    $("#tagline").textContent = (l && l.site && l.site.tagline) || SITE.tagline;

    const total = PROJECTS.length;
    const completed = PROJECTS.filter(p => p.status === "completed").length;
    const legendary = PLATFORMS.filter(p => p.rarity === "legendary").length;

    $("#hero-stats").innerHTML = [
      [PLATFORMS.length, "Relics"],
      [total, "Quests"],
      [completed, "Completed"],
      [legendary, "Legendary"],
    ].map(([n, key]) => `<div class="stat"><b>${n}</b><span>${esc(tUI(key))}</span></div>`).join("");

    $("#footer-updated").textContent = tUI("Codex last inscribed on") + " " + SITE.updated;
    renderSupport();
  }

  /* ---------- Support links (understated, footer) ---------- */

  function renderSupport() {
    const el = $("#footer-support");
    if (!el || !SITE.support) return;
    const s = SITE.support;
    const btns = [];
    if (s.kofi)   btns.push(`<a class="support-btn" href="${esc(s.kofi)}" target="_blank" rel="noopener noreferrer">☕ Ko-fi</a>`);
    if (s.paypal) btns.push(`<a class="support-btn" href="${esc(s.paypal)}" target="_blank" rel="noopener noreferrer">PayPal</a>`);
    el.innerHTML = btns.length
      ? `<span class="support-label">${esc(tUI("If a tale here was worth a coin"))}</span>${btns.join("")}`
      : "";
  }

  /* ---------- Language switcher ----------
     The control persists a choice and re-renders the whole codex. Language
     names are themselves localized (English → "Inglese" when Italian is on). */

  /* Little inline SVG flags — self-contained so they render everywhere,
     including Windows (which does not draw flag emoji). */
  const FLAGS = {
    en: `<svg class="flag" viewBox="0 0 60 30" aria-hidden="true"><rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="3"/><rect x="25" width="10" height="30" fill="#fff"/><rect y="10" width="60" height="10" fill="#fff"/><rect x="27" width="6" height="30" fill="#C8102E"/><rect y="12" width="60" height="6" fill="#C8102E"/></svg>`,
    it: `<svg class="flag" viewBox="0 0 60 30" aria-hidden="true"><rect width="20" height="30" fill="#009246"/><rect x="20" width="20" height="30" fill="#fff"/><rect x="40" width="20" height="30" fill="#CE2B37"/></svg>`,
    ja: `<svg class="flag" viewBox="0 0 60 30" aria-hidden="true"><rect width="60" height="30" fill="#fff"/><circle cx="30" cy="15" r="9" fill="#BC002D"/></svg>`,
  };
  const flag = code => FLAGS[code] || "";

  function langLabel(l) {
    if (l.label && typeof l.label === "object") {
      return l.label[state.lang] || l.label.en || l.code;
    }
    return l.label || l.code;
  }

  function langByCode(code) {
    return LANGUAGES.find(l => l.code === code);
  }

  function buildLangButton() {
    const btn = $("#lang-btn");
    if (!btn) return;
    const cur = langByCode(state.lang) || LANGUAGES[0];
    btn.innerHTML =
      `${flag(cur.code)}<span class="lang-name">${esc(langLabel(cur))}</span><span class="caret" aria-hidden="true">▾</span>`;
  }

  function buildLangMenu() {
    const menu = $("#lang-menu");
    if (!menu) return;
    menu.innerHTML = LANGUAGES.map(l =>
      `<li role="option" data-code="${esc(l.code)}" aria-selected="${l.code === state.lang}">` +
      `${flag(l.code)}<span class="lang-name">${esc(langLabel(l))}</span></li>`
    ).join("");
  }

  function closeLangMenu() {
    const menu = $("#lang-menu"), btn = $("#lang-btn");
    if (menu) menu.hidden = true;
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function renderLangSwitch() {
    const btn = $("#lang-btn"), menu = $("#lang-menu");
    if (!btn || !menu || typeof LANGUAGES === "undefined") return;
    const saved = localStorage.getItem("sr-lang");
    if (saved && LANGUAGES.some(l => l.code === saved)) state.lang = saved;
    document.documentElement.lang = state.lang;
    buildLangButton();
    buildLangMenu();

    btn.addEventListener("click", () => {
      const open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", e => {
      const li = e.target.closest("li[data-code]");
      if (!li) return;
      state.lang = li.getAttribute("data-code");
      localStorage.setItem("sr-lang", state.lang);
      closeLangMenu();
      renderAll();
    });
    document.addEventListener("click", e => {
      if (!e.target.closest("#lang-switch")) closeLangMenu();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeLangMenu();
    });
  }

  /* Static chrome carried in the HTML: swap textContent / placeholder by the
     English source string stored in data-i18n / data-i18n-ph. */
  function applyChrome() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = tUI(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => {
      el.setAttribute("placeholder", tUI(el.getAttribute("data-i18n-ph")));
    });
  }

  /* Re-render everything that carries language (used on a language change). */
  function renderAll() {
    applyChrome();
    renderLangSwitchLabels();
    renderHero();
    renderTypeChips();
    render();
  }

  /* Refresh the switcher's button + option labels (not the listeners). */
  function renderLangSwitchLabels() {
    if (typeof LANGUAGES === "undefined") return;
    buildLangButton();
    buildLangMenu();
  }

  /* ---------- Filters ---------- */

  function renderTypeChips() {
    const group = $("#type-group");
    const chips = [["all", tUI("All Quests")]]
      .concat(Object.keys(TYPES).map(key => [key, tr("types", key, TYPES[key])]));
    group.innerHTML = chips.map(([key, label]) =>
      `<button class="chip chip-type${key === state.type ? " active" : ""}" data-type="${key}">${esc(label)}</button>`
    ).join("");
  }

  function matchesFilters(q, platform) {
    if (state.type !== "all" && q.type !== state.type) return false;
    if (state.query) {
      const hay = [tProject(q, "title"), tProject(q, "summary"), platform.name,
                   platform.maker, tr("types", q.type, TYPES[q.type] || "")]
        .join(" ").toLowerCase();
      if (!hay.includes(state.query)) return false;
    }
    return true;
  }

  /* ---------- Rendering ---------- */

  function questCard(q) {
    const st = STATUSES[q.status] || STATUSES.accepted;
    const stLabel = tr("statuses", q.status, st.label);
    const title = tProject(q, "title");

    const badges = (q.badges || [])
      .filter(id => BADGES[id])
      .map(id => {
        const b = BADGES[id];
        const tb = (L() && L().badges && L().badges[id]) || {};
        const label = tb.label || b.label;
        const desc = tb.desc || b.desc;
        return `<span class="badge" title="${esc(label)} — ${esc(desc)}">${b.icon} ${esc(label)}</span>`;
      })
      .join("");

    const mLabels = tProject(q, "milestones"); // parallel array of strings, or source objects
    const milestones = (q.milestones || []).length ? `
      <details class="milestones">
        <summary>${esc(tUI("Milestones"))} (${q.milestones.filter(m => m.done).length}/${q.milestones.length})</summary>
        <ul>${q.milestones.map((m, i) => {
          const label = (Array.isArray(mLabels) && typeof mLabels[i] === "string") ? mLabels[i] : m.label;
          return `<li class="${m.done ? "done" : ""}">${esc(label)}</li>`;
        }).join("")}</ul>
      </details>` : "";

    const shots = (q.screenshots || []).length ? `
      <div class="shots">${q.screenshots.map(s =>
        `<img src="${esc(s)}" alt="${esc(tUI("Screenshot of"))} ${esc(title)}" loading="lazy" data-lightbox>`
      ).join("")}</div>` : "";

    const tLinks = tProject(q, "links"); // parallel array of translated labels, or source objects
    const linkItems = [];
    if (q.repo) linkItems.push(`<a href="${esc(q.repo)}" target="_blank" rel="noopener">⟡ ${esc(tUI("View on GitHub"))}</a>`);
    (q.links || []).forEach((l, i) => {
      const label = (Array.isArray(tLinks) && typeof tLinks[i] === "string") ? tLinks[i] : l.label;
      linkItems.push(`<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(label)}</a>`);
    });
    const repo = linkItems.length ? `<div class="quest-links">${linkItems.join(" &nbsp;·&nbsp; ")}</div>` : "";

    return `
      <article class="quest${q.status === "completed" ? " completed-glow" : ""}">
        <div class="quest-top">
          <h4>${esc(title)}</h4>
          <span class="type-tag">${esc(tr("types", q.type, TYPES[q.type] || q.type))}</span>
        </div>
        <div class="status-line ${st.cls}"><span class="status-dot"></span>${esc(stLabel)}</div>
        <div class="xp">
          <div class="xp-fill" data-progress="${Math.max(0, Math.min(100, q.progress || 0))}"></div>
          <div class="xp-label">${Math.max(0, Math.min(100, q.progress || 0))}%</div>
        </div>
        <p class="quest-summary">${esc(tProject(q, "summary"))}</p>
        ${milestones}
        ${badges ? `<div class="badges">${badges}</div>` : ""}
        ${shots}
        ${repo}
      </article>`;
  }

  function platformSection(p, quests) {
    const rar = RARITIES[p.rarity] || RARITIES.common;
    const rarLabel = tr("rarities", p.rarity, rar.label);
    const blurb = tPlatform(p, "blurb");
    const questHtml = quests.length
      ? quests.map(questCard).join("")
      : `<div class="quests-empty">${esc(tUI("No quests inscribed for this relic yet."))}</div>`;

    return `
      <section class="platform" style="--rarity: var(--r-${esc(p.rarity)})">
        <header class="platform-crest">
          <h3>${esc(p.name)}</h3>
          <span class="platform-meta">${esc(p.maker)} · ${p.year}</span>
          <span class="rarity-tag">${esc(rarLabel)}</span>
        </header>
        ${blurb ? `<div class="platform-blurb">${esc(blurb)}</div>` : ""}
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
      codex.innerHTML = `<div class="codex-empty">${esc(tUI("The codex holds no such quest… try another incantation."))}</div>`;
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
        const tg = (L() && L().generations && L().generations[gen]) || {};
        const heading = tg.title || info.title ||
          (tUI("Generation") + " " + info.num);
        const era = tg.era != null ? tg.era : info.era;
        html += `
          <div class="gen-header">
            <h2>${esc(heading)}</h2>
            <div class="rule"></div>
            ${era ? `<span class="era">${esc(era)}</span>` : ""}
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

  renderLangSwitch();
  applyChrome();
  renderHero();
  renderTypeChips();
  wireEvents();
  render();
})();
