/* ============================================================
   SILICON RELICS — data file
   This is the ONLY file future sweep sessions need to touch.
   All entries below marked [PLACEHOLDER] are scaffolding demos
   and will be replaced by real sweep data.
   ============================================================ */

const SITE = {
  tagline: "A living codex of homebrew, reverse engineering and porting quests across retro consoles — from the famous to the forgotten.",
  updated: "2026-07-17",
};

/* Rarity reflects how obscure / undocumented the platform is.
   common → well-trodden ground … legendary → almost nobody has walked here. */
const RARITIES = {
  common:    { label: "Common Relic" },
  uncommon:  { label: "Uncommon Relic" },
  rare:      { label: "Rare Relic" },
  epic:      { label: "Epic Relic" },
  legendary: { label: "Legendary Relic" },
};

const TYPES = {
  homebrew: "Homebrew",
  porting:  "Porting",
  re:       "Reverse Eng.",
  tooling:  "Tooling",
};

const STATUSES = {
  accepted:  { label: "Quest Accepted", cls: "st-accepted" },
  ongoing:   { label: "In Progress",    cls: "st-ongoing" },
  bossfight: { label: "Boss Fight",     cls: "st-bossfight" },
  completed: { label: "Quest Complete", cls: "st-completed" },
};

const BADGES = {
  "first-boot":     { icon: "🕯️", label: "First Boot",            desc: "The relic drew breath: first successful boot of custom code." },
  "real-hardware":  { icon: "⚙️", label: "Runs on Real Hardware", desc: "Verified on the physical machine, not just emulation." },
  "audio-unlocked": { icon: "🎵", label: "Audio Unlocked",         desc: "Sound is alive on the platform." },
  "disasm":         { icon: "📜", label: "Scrolls Deciphered",     desc: "Significant disassembly / reverse engineering milestone." },
  "toolchain":      { icon: "🔨", label: "Forge Built",            desc: "A working toolchain / build pipeline was forged." },
  "released":       { icon: "🏆", label: "Released",               desc: "Published for the world to see." },
};

/* Console generation labels for the "By Generation" view. */
const GENERATIONS = {
  2: { num: "II",   era: "1976 – 1983" },
  3: { num: "III",  era: "1983 – 1987" },
  4: { num: "IV",   era: "1987 – 1993" },
  5: { num: "V",    era: "1993 – 1998" },
  6: { num: "VI",   era: "1998 – 2005" },
  7: { num: "VII",  era: "2005 – 2012" },
  8: { num: "VIII", era: "2012 – 2020" },
};

/* ---------- Platforms (the Relics) ---------- */

const PLATFORMS = [
  {
    id: "vis",
    name: "Tandy VIS",
    maker: "Tandy / Memorex",
    year: 1992,
    gen: 4,
    rarity: "legendary",
    blurb: "[PLACEHOLDER] The Video Information System — a CD-based curiosity so forgotten even its ghosts need directions.",
  },
  {
    id: "hyperscan",
    name: "Mattel HyperScan",
    maker: "Mattel",
    year: 2006,
    gen: 7,
    rarity: "legendary",
    blurb: "[PLACEHOLDER] RFID cards, a CD drive, and one of the shortest lifespans in console history.",
  },
  {
    id: "ngpc",
    name: "Neo Geo Pocket Color",
    maker: "SNK",
    year: 1999,
    gen: 5,
    rarity: "rare",
    blurb: "[PLACEHOLDER] SNK's beloved handheld — a small relic with a fierce heart.",
  },
];

/* ---------- Projects (the Quests) ---------- */

const PROJECTS = [
  {
    id: "vis-pipeline",
    title: "VIS Homebrew Pipeline",
    platform: "vis",
    type: "homebrew",
    status: "ongoing",
    progress: 60,
    summary: "[PLACEHOLDER] Custom code running on the Tandy VIS. Real details arriving with the first sweep.",
    milestones: [
      { label: "Toolchain forged", done: true },
      { label: "First boot", done: true },
      { label: "Final demo", done: false },
    ],
    badges: ["toolchain", "first-boot"],
    screenshots: [],
    repo: null,
  },
  {
    id: "hyperscan-quest",
    title: "HyperScan Explorations",
    platform: "hyperscan",
    type: "re",
    status: "bossfight",
    progress: 45,
    summary: "[PLACEHOLDER] Emulation experiments and test cards for Mattel's strangest child.",
    milestones: [
      { label: "Format understood", done: true },
      { label: "Test cards built", done: true },
      { label: "Full pipeline", done: false },
    ],
    badges: ["disasm"],
    screenshots: [],
    repo: null,
  },
  {
    id: "ngpc-hello-link",
    title: "NGPC hello_link",
    platform: "ngpc",
    type: "homebrew",
    status: "completed",
    progress: 100,
    summary: "[PLACEHOLDER] A completed quest, shown here to demo the golden 'Quest Complete' card style.",
    milestones: [
      { label: "Toolchain forged", done: true },
      { label: "First boot", done: true },
      { label: "Done", done: true },
    ],
    badges: ["toolchain", "first-boot", "real-hardware"],
    screenshots: [],
    repo: null,
  },
  {
    id: "demo-accepted",
    title: "A Freshly Accepted Quest",
    platform: "ngpc",
    type: "porting",
    status: "accepted",
    progress: 5,
    summary: "[PLACEHOLDER] Demo of the 'Quest Accepted' state — a journey that has just begun.",
    milestones: [
      { label: "Scouting the territory", done: false },
    ],
    badges: [],
    screenshots: [],
    repo: null,
  },
];
