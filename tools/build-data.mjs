#!/usr/bin/env node
/* ============================================================
   SILICON RELICS — data builder
   Reads content/*.json and writes data.js (the only file the
   page reads). Run from the repository root:

     node tools/build-data.mjs            # build data.js
     node tools/build-data.mjs --check    # report only, write nothing

   content/github.json   gh repo list output (public repos only)
   content/catalog.json  one curated entry per repository
   content/overrides.json  hand corrections, applied on top
   content/workshop.json pieces not yet published (no repository)
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";

const read = p => JSON.parse(readFileSync(new URL("../" + p, import.meta.url), "utf8"));
const CHECK = process.argv.includes("--check");

/* ---------- configuration ---------- */

const SITE = {
  title: "Silicon Relics",
  owner: "vs-sr-dev",
  since: "2026-03",
  updated: new Date().toISOString().slice(0, 10),
  kofi: "https://ko-fi.com/samuelevoltan",
};

/* Repositories that are not showcase entries. */
const EXCLUDE = new Set(["mame", "vs-sr-dev", "silicon-relics"]);

/* Machines: id → name, maker, year of release. The rooms are ordered by year. */
const PLATFORMS = {
  channelf: ["Fairchild Channel F", "Fairchild", 1976],
  apple2: ["Apple II", "Apple", 1977],
  pc: ["PC — DOS & Windows", "IBM PC & compatibles", 1981],
  coleco: ["ColecoVision", "Coleco", 1982],
  loopy: ["Casio PV-1000 / Loopy", "Casio", 1983],
  arcade: ["Arcade", "Konami", 1984],
  smaky: ["Smaky 100", "Epsitec, Lausanne", 1984],
  a7800: ["Atari 7800", "Atari", 1986],
  pce: ["PC Engine / TurboGrafx-16", "NEC / Hudson", 1987],
  x68000: ["Sharp X68000", "Sharp", 1987],
  fmtowns: ["FM Towns / Marty", "Fujitsu", 1989],
  lynx: ["Atari Lynx", "Atari / Epyx", 1989],
  gx4000: ["Amstrad GX4000", "Amstrad", 1990],
  gamegear: ["Sega Game Gear", "Sega", 1990],
  snes: ["Super Nintendo", "Nintendo", 1990],
  cdi: ["Philips CD-i", "Philips", 1991],
  vis: ["Tandy / Memorex VIS", "Tandy / Microsoft", 1992],
  watara: ["Watara Supervision", "Watara", 1992],
  a3do: ["3DO", "Panasonic / The 3DO Company", 1993],
  cd32: ["Amiga CD32 / CDTV", "Commodore", 1993],
  jaguar: ["Atari Jaguar / CD", "Atari", 1993],
  playdia: ["Bandai Playdia", "Bandai", 1994],
  ps1: ["PlayStation", "Sony", 1994],
  s32x: ["Sega 32X", "Sega", 1994],
  saturn: ["Sega Saturn", "Sega", 1994],
  n64: ["Nintendo 64", "Nintendo", 1996],
  pasogo: ["Koei PasoGo", "Koei", 1996],
  pippin: ["Bandai Pippin", "Bandai / Apple", 1996],
  gamecom: ["Tiger Game.com", "Tiger Electronics", 1997],
  dc: ["Dreamcast", "Sega", 1998],
  ngpc: ["Neo Geo Pocket Color", "SNK", 1999],
  ws: ["WonderSwan / Color", "Bandai", 1999],
  ps2: ["PlayStation 2", "Sony", 2000],
  gba: ["Game Boy Advance", "Nintendo", 2001],
  gc: ["GameCube", "Nintendo", 2001],
  keitai: ["i-appli keitai", "NTT DoCoMo", 2001],
  bpc: ["Pocket Challenge V2", "Benesse", 2002],
  zodiac: ["Tapwave Zodiac", "Tapwave", 2003],
  nds: ["Nintendo DS", "Nintendo", 2004],
  gamewave: ["ZAPiT Game Wave", "ZAPiT", 2005],
  x360: ["Xbox 360", "Microsoft", 2005],
  hyperscan: ["Mattel HyperScan", "Mattel", 2006],
  ps3: ["PlayStation 3", "Sony", 2006],
  wii: ["Wii", "Nintendo", 2006],
  android: ["Android", "Google", 2008],
  didj: ["LeapFrog Didj", "LeapFrog", 2008],
  mobigo: ["VTech MobiGo", "VTech", 2010],
  wiiu: ["Wii U", "Nintendo", 2012],
  multi: ["Many machines", "Work that spans platforms", null],
  original: ["Original work", "Not a relic: a game of its own", null],
};

/* Repository → machine, where the name prefix does not say it. A ported game
   lives in the room of the machine it comes from; a kit in its console's. */
const MACHINE = {
  wiikit: "wii", saturnkit: "saturn", ndskit: "nds", "3dokit": "a3do", ps2kit: "ps2", ps3kit: "ps3",
  fmtownskit: "fmtowns", watarakit: "watara", "7800kit": "a7800", tg16kit: "pce", wskit: "ws",
  casiolator: "loopy", undertow: "gamewave", ecliptic: "zodiac", flick: "hyperscan", mobigoemu: "mobigo",
  didjemu: "didj", "bpc-emu": "bpc", "pasogo-emu": "pasogo", cdipc: "cdi", cdinet: "cdi",
  "ngpc-dreamcast-link-cable": "ngpc", chiproll: "multi", "pc-mediacatalog": "pc",
  "hyperscan-homebrew": "hyperscan", "ngpc-homebrew-notes": "ngpc", "pippin-homebrew": "pippin",
  "fcf-quest": "channelf", "fcf-bufo": "channelf", "psx-lba": "ps1", "ds-lba": "nds", "jag-lba": "jaguar",
  "hs-lba": "hyperscan", "coleco-ff": "coleco", "gamewave-doom": "gamewave", "3do-omf2097": "a3do",
  "pc-highlander": "jaguar", "pc-rpgmaker3": "ps2", "pc-ragnarokodysseyace": "ps3", "pc-3ddotgameheroes": "ps3",
  "pc-infiniteundiscovery": "x360", "pc-mikie": "arcade", "pc-megamanxcm": "gc",
  "pc-extermination": "ps2", "pc-dynastywarriors2": "ps2",
  "pc-thequeenofduellist": "fmtowns", "pc-4ddriving": "fmtowns", "pc-abelsmt": "fmtowns",
};
const PREFIX = { "3do": "a3do", cd32: "cd32", cdi: "cdi", dc: "dc", vis: "vis", apple2: "apple2",
  android: "android", keitai: "keitai", gc: "gc", nds: "nds", ps1: "ps1", ps2: "ps2", ps3: "ps3",
  snes: "snes", wii: "wii", wiiu: "wiiu", n64: "n64", xbox360: "x360", dos: "pc", tales: "multi" };
const KIT_MACHINE = { wiikit: "wii", saturnkit: "saturn", ndskit: "nds", "3dokit": "a3do",
  ps2kit: "ps2", ps3kit: "ps3", fmtownskit: "fmtowns" };

const SECTION = { kit: "recomp", "recomp-port": "recomp", "source-port": "ports", reimplementation: "ports",
  homebrew: "homebrew", emulator: "tools", tool: "tools", research: "research", "re-notes": "research" };

function machineOf(e) {
  if (e.machine) return e.machine;
  if (MACHINE[e.repo]) return MACHINE[e.repo];
  const pre = e.repo.split("-")[0];
  if (e.category.startsWith("doc")) return pre === "pc" ? "pc" : (PREFIX[pre] || "multi");
  if (e.kit && KIT_MACHINE[e.kit]) return KIT_MACHINE[e.kit];
  return PREFIX[pre] || null;
}
function familyOf(e) {
  if (!e.category.startsWith("doc")) return null;
  if (/tales/.test(e.repo)) return "tales";
  const pre = e.repo.split("-")[0];
  return pre === "dos" ? "pc" : pre;
}

/* ---------- build ---------- */

const github = read("content/github.json");
const catalog = read("content/catalog.json");
const overrides = read("content/overrides.json");
const workshop = read("content/workshop.json");

const meta = new Map(github.map(r => [r.name, r]));
const problems = [];

const entries = catalog.map(e => Object.assign({}, e, overrides[e.repo] || {}));
const known = new Set(entries.map(e => e.repo));

for (const r of github) if (!EXCLUDE.has(r.name) && !known.has(r.name))
  problems.push(`NEW   ${r.name} is public but not in content/catalog.json — catalogue it`);
for (const e of entries) if (!meta.has(e.repo))
  problems.push(`GONE  ${e.repo} is in the catalogue but not public on GitHub`);
for (const k of Object.keys(overrides)) if (!k.startsWith("_") && !known.has(k))
  problems.push(`OVR   override for unknown repository ${k}`);

const repos = entries.filter(e => meta.has(e.repo)).map(e => {
  const m = meta.get(e.repo);
  const p = machineOf(e);
  if (!p || !PLATFORMS[p]) problems.push(`MACH  ${e.repo}: no machine (${p})`);
  return {
    r: e.repo, t: e.title, c: e.category, sec: e.category.startsWith("doc") ? "docs" : SECTION[e.category],
    p, fam: familyOf(e), y: e.subject_year, mk: e.maker, k: e.kit,
    g: e.tagline, su: e.summary, h: e.highlights || [], s: e.status, v: Math.max(0, Math.min(100, e.progress | 0)),
    m: e.measure, b: e.progress_basis, f: e.first || null,
    shots: e.shots || [], icon: e.icon || null, px: !!e.pixel,
    cr: m.createdAt, pu: m.pushedAt.slice(0, 10),
  };
});

for (const w of workshop.items) if (!PLATFORMS[w.p]) problems.push(`MACH  workshop ${w.id}: unknown machine ${w.p}`);

const used = new Set(repos.map(r => r.p).concat(workshop.items.map(w => w.p)));
const platforms = Object.fromEntries(Object.entries(PLATFORMS).filter(([k]) => used.has(k))
  .map(([k, [n, mk, y]]) => [k, { n, mk, y }]));

const out = { site: SITE, platforms, repos, workshop };

const by = {};
for (const r of repos) by[r.sec] = (by[r.sec] || 0) + 1;
console.log(`${repos.length} repositories, ${workshop.items.length} workshop pieces, ${Object.keys(platforms).length} machines`);
console.log(Object.entries(by).map(([k, v]) => `${k} ${v}`).join(" · "));
problems.forEach(p => console.log(p));

if (!CHECK) {
  const js = "/* Generated by tools/build-data.mjs — do not edit by hand.\n" +
    "   Edit content/*.json and run: node tools/build-data.mjs */\n" +
    "window.SR = " + JSON.stringify(out) + ";\n";
  writeFileSync(new URL("../data.js", import.meta.url), js);
  console.log(`data.js written (${Math.round(js.length / 1024)} KB)`);
}
