/* ============================================================
   SILICON RELICS — data file
   This is the ONLY file content sweeps need to touch.
   Sweep 1 (2026-07-17): all published GitHub repos.
   ============================================================ */

const SITE = {
  tagline: "A living codex of homebrew, reverse engineering and porting quests across retro consoles — from the famous to the forgotten. A human + LLM collaboration, named openly.",
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
  "released":       { icon: "🏆", label: "Released",               desc: "Shipped as a finished, usable release." },
  "world-first":    { icon: "🌍", label: "World First",            desc: "A documented first — nobody had done this before." },
};

/* Console generation labels for the "By Generation" view.
   Gen 0 is the Timeless Forge — tools that serve the other relics. */
const GENERATIONS = {
  0: { num: "0", title: "The Timeless Forge", era: "tools that serve the relics" },
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
    name: "Tandy / Memorex VIS",
    maker: "Tandy · Memorex",
    year: 1992,
    gen: 4,
    rarity: "legendary",
    blurb: "The Video Information System: a CD console running Microsoft Modular Windows 3.1 on a 12 MHz 80286, with OPL3 FM synthesis. So forgotten even its ghosts need directions — now it runs raycasters.",
  },
  {
    id: "hyperscan",
    name: "Mattel HyperScan",
    maker: "Mattel",
    year: 2006,
    gen: 7,
    rarity: "legendary",
    blurb: "RFID trading cards, an S+Core CPU with an unmaintained compiler, zero storage, no SDK, no scene, discontinued within a year. The deepest public documentation of this machine lives in these quests.",
  },
  {
    id: "pippin",
    name: "Bandai Pippin @WORLD",
    maker: "Apple · Bandai",
    year: 1996,
    gen: 5,
    rarity: "legendary",
    blurb: "A stripped-down Macintosh sold as a console — PowerPC 603, Mac OS 7.5 fork, a GeoPort modem as its only road to the Internet. Barely documented, barely emulated.",
  },
  {
    id: "ngpc",
    name: "Neo Geo Pocket Color",
    maker: "SNK",
    year: 1999,
    gen: 5,
    rarity: "rare",
    blurb: "SNK's fierce 16-bit handheld (TLCS-900/H), with a proprietary Toshiba toolchain held together by decades-old links — and a link cable no emulator had ever spoken, on either side.",
  },
  {
    id: "3do",
    name: "Panasonic 3DO",
    maker: "The 3DO Company · Panasonic",
    year: 1993,
    gen: 5,
    rarity: "epic",
    blurb: "The ambitious 1993 CD console of coded CELs, 32-colour PLUTs and no float runtime. A small modern devkit keeps the forge lit.",
  },
  {
    id: "dreamcast",
    name: "Sega Dreamcast",
    maker: "Sega",
    year: 1998,
    gen: 6,
    rarity: "uncommon",
    blurb: "Sega's swan song and homebrew's favourite harbour — KallistiOS territory, VMU saves, and an SH4 that rewards careful code.",
  },
  {
    id: "wiiu",
    name: "Nintendo Wii U",
    maker: "Nintendo",
    year: 2012,
    gen: 8,
    rarity: "uncommon",
    blurb: "The dual-screen underdog: big-endian PowerPC, a GamePad with a touch panel, and a homebrew scene that never gave up on it.",
  },
  {
    id: "snes",
    name: "Super Nintendo",
    maker: "Nintendo",
    year: 1990,
    gen: 4,
    rarity: "common",
    blurb: "The 16-bit king — common as relics go, but its Japanese text engines and sound drivers still guard secrets worth deciphering.",
  },
  {
    id: "forge",
    name: "The Chip Forge",
    maker: "Browser-based · no install",
    year: 2026,
    gen: 0,
    rarity: "common",
    blurb: "Not a console: the workbench. Tools forged in the browser to serve the other relics — and the musicians who write for them.",
  },
];

/* ---------- Projects (the Quests) ---------- */

const PROJECTS = [

  /* ---- Tandy VIS ---- */
  {
    id: "vis-wolf3d",
    title: "Wolfenstein 3D on the VIS",
    platform: "vis",
    type: "porting",
    status: "ongoing",
    progress: 85,
    summary: "A from-scratch Wolfenstein 3D port running natively as a Win16 app on the VIS: textured raycaster, enemy AI, combat, pickups — and a full 3-channel audio stack (FM music, AdLib SFX, digitized voices via raw DMA on the VIS DAC). 14–18 fps on a 12 MHz 286, and genuinely playable.",
    milestones: [
      { label: "Win16 toolchain + bootable VIS CD forged", done: true },
      { label: "Textured raycaster with doors, sprites and HUD", done: true },
      { label: "Enemy AI, hitscan combat, pickups, ammo economy", done: true },
      { label: "Full audio: IMF music + AdLib SFX + DAC digitized voices", done: true },
      { label: "Full-episode polish and stereo pan", done: false },
    ],
    badges: ["toolchain", "first-boot", "audio-unlocked"],
    screenshots: ["https://raw.githubusercontent.com/vs-sr-dev/vis-wolf3d/main/wolfvis_demo.gif"],
    repo: "https://github.com/vs-sr-dev/vis-wolf3d",
  },
  {
    id: "vis-synth",
    title: "VIS Synth — an OPL3 instrument",
    platform: "vis",
    type: "homebrew",
    status: "completed",
    progress: 100,
    summary: "The VIS as a musical instrument: an 8-voice OPL3 polyphonic synth played on the hand controller, an SMF MIDI file player, and live MIDI from a real hardware keyboard via a custom MAME ISA-bridge card. All three modes verified — by a musician.",
    milestones: [
      { label: "Hand-controller polyphonic instrument (v0)", done: true },
      { label: "SMF MIDI file player with PIT-µs scheduler (v2)", done: true },
      { label: "Live MIDI from host hardware via custom MAME bridge (v3)", done: true },
    ],
    badges: ["audio-unlocked", "first-boot"],
    screenshots: [],
    repo: "https://github.com/vs-sr-dev/vis-synth",
  },
  {
    id: "vis-fileviewer",
    title: "VIS File Viewer",
    platform: "vis",
    type: "homebrew",
    status: "completed",
    progress: 100,
    summary: "A media browser the VIS never shipped with: photos, WAV/MIDI audio and Autodesk FLC video played the native Modular Windows way — including a from-scratch FLC player with direct video-RAM writes, because that's how VIS video actually worked (spoiler: it was never AVI).",
    milestones: [
      { label: "Hand-controller file browser as CD shell", done: true },
      { label: "BMP photos + WAV/MIDI via native MCI", done: true },
      { label: "From-scratch FLC video player via DISPDIB DVA", done: true },
    ],
    badges: ["first-boot", "audio-unlocked"],
    screenshots: [],
    repo: "https://github.com/vs-sr-dev/vis-fileviewer",
  },

  /* ---- Mattel HyperScan ---- */
  {
    id: "hyperscan-homebrew",
    title: "HyperScan: Charting the Uncharted",
    platform: "hyperscan",
    type: "re",
    status: "ongoing",
    progress: 85,
    summary: "The deepest public documentation of the HyperScan: 16+ reproducible bugs in the unmaintained score-elf GCC backend with verified workarounds, PPU register maps, a from-scratch RFID/NFC bit-banging driver — and the first HyperScan audio ever emulated, A/B-matched against a real-hardware capture.",
    milestones: [
      { label: "16+ GCC score-elf compiler bugs root-caused", done: true },
      { label: "PPU register map + I²C controller driver", done: true },
      { label: "From-scratch RFID/NFC card driver via raw GPIO", done: true },
      { label: "First emulated HyperScan audio (MAME SPU work)", done: true },
      { label: "Further pipeline branches", done: false },
    ],
    badges: ["world-first", "disasm", "toolchain", "audio-unlocked", "first-boot"],
    screenshots: [],
    repo: "https://github.com/vs-sr-dev/hyperscan-homebrew",
    links: [
      { label: "▶ First emulated HyperScan audio", url: "https://www.youtube.com/watch?v=1vh_27eTpfc" },
    ],
  },

  /* ---- Bandai Pippin ---- */
  {
    id: "pippin-homebrew",
    title: "Pippin Online — Networking the @WORLD",
    platform: "pippin",
    type: "re",
    status: "completed",
    progress: 100,
    summary: "The emulated Pippin brought onto the real Internet for the first time: DingusPPC serial/DBDMA fixes (upstreamable), a virtual modem + PPP host stack, Netscape 1.1N loading a live web page — plus a homebrew thin-client browser, and an honest falsification of the image-loading mystery.",
    milestones: [
      { label: "DingusPPC serial/DBDMA fixes (upstreamable)", done: true },
      { label: "Virtual Hayes modem + PPP/NAT host chain", done: true },
      { label: "Netscape loads a live web page from the real Internet", done: true },
      { label: "Thin-client homebrew browser architecture (PPF format)", done: true },
    ],
    badges: ["world-first", "disasm", "first-boot"],
    screenshots: [],
    repo: "https://github.com/vs-sr-dev/pippin-homebrew",
  },

  /* ---- Neo Geo Pocket Color ---- */
  {
    id: "ngpc-homebrew-notes",
    title: "NGPC ↔ Dreamcast Link Bridge",
    platform: "ngpc",
    type: "re",
    status: "ongoing",
    progress: 80,
    summary: "The NGPC link cable had retail use in 1999 but had never been emulated on either side — until this three-ring bridge connected an NGPC emulator to a Dreamcast emulator, verified on video with both homebrew and retail games. Plus a rescued, fully-documented cc900 toolchain path.",
    milestones: [
      { label: "cc900 toolchain rescued and documented (dead-link-proof)", done: true },
      { label: "First NGPC↔DC link-cable bridge in emulation", done: true },
      { label: "Verified with retail games on video", done: true },
      { label: "Further pipeline branches", done: false },
    ],
    badges: ["world-first", "disasm", "toolchain", "first-boot"],
    screenshots: [],
    repo: "https://github.com/vs-sr-dev/ngpc-homebrew-notes",
    links: [
      { label: "▶ First working bridge (homebrew)", url: "https://www.youtube.com/watch?v=x2IV3T3Z0oM" },
      { label: "▶ Retail-software bridge test", url: "https://www.youtube.com/watch?v=mmxnnkZzu-s" },
    ],
  },

  /* ---- Panasonic 3DO ---- */
  {
    id: "3do-omf2097",
    title: "One Must Fall: 2097 on the 3DO",
    platform: "3do",
    type: "porting",
    status: "ongoing",
    progress: 40,
    summary: "Can a 3DO run OMF's CEL engine at a playable rate? Yes: a complete 1-v-1 match vs the AI — pilot select, real movesets, throws, knockback, per-arena music, KO — built on OpenOMF and squeezed under the 32-colour PLUT cap. Version 0.1, 'playable 1v1'.",
    milestones: [
      { label: "Playable 1v1 vs AI with full scene flow", done: true },
      { label: "Data-driven movesets, throws, damage, SFX + music", done: true },
      { label: "All 10 HARs wired as fighters (2/10 so far)", done: false },
      { label: "Rounds, stun bar, arena hazards, victory poses", done: false },
    ],
    badges: ["first-boot", "toolchain"],
    screenshots: [],
    repo: "https://github.com/vs-sr-dev/3do-omf2097",
  },

  /* ---- Sega Dreamcast ---- */
  {
    id: "dc-lba2",
    title: "Little Big Adventure 2 — Dreamcast",
    platform: "dreamcast",
    type: "porting",
    status: "bossfight",
    progress: 75,
    summary: "The original 1997 Adeline engine compiled for the Dreamcast via KallistiOS: first island playable to completion on Flycast with FMV, music, voices, VMU saves. The boss fight: on real hardware boot stalls after the EA logo — first UART capture has pinned a render-side crash, diagnosis underway.",
    milestones: [
      { label: "Engine boots: intro FMV, menu, gameplay on Flycast", done: true },
      { label: "First island completable; second island loads", done: true },
      { label: "Audio streams + VMU save/load", done: true },
      { label: "BOSS: real-Dreamcast boot blocker (UART diagnosis)", done: false },
      { label: "Full playthrough validation", done: false },
    ],
    badges: ["first-boot", "toolchain"],
    screenshots: [],
    repo: "https://github.com/vs-sr-dev/dc-lba2",
  },

  /* ---- Nintendo Wii U ---- */
  {
    id: "wiiu-lba2",
    title: "Little Big Adventure 2 — Wii U",
    platform: "wiiu",
    type: "porting",
    status: "completed",
    progress: 100,
    summary: "V1.0: the original 1997 Adeline source running natively on the Wii U — completed start to finish on real hardware, full story, all cutscenes and FMVs, 50–80 fps, native AX audio, GamePad touch panel for behaviours and spells, saves with on-screen keyboard. ~99.9% parity with the original.",
    milestones: [
      { label: "Big-endian PowerPC port of the DOS/Win95 engine", done: true },
      { label: "FMV streaming, AX audio, saves, full GamePad + touch", done: true },
      { label: "Complete playthrough validated on real hardware", done: true },
      { label: "Post-release polish (controls tuning, touch labels)", done: false },
    ],
    badges: ["released", "real-hardware", "first-boot", "toolchain"],
    screenshots: [],
    repo: "https://github.com/vs-sr-dev/wiiu-lba2",
  },

  /* ---- Super Nintendo ---- */
  {
    id: "snes-rudra-re",
    title: "Rudra no Hihō — Text & Sound RE",
    platform: "snes",
    type: "re",
    status: "ongoing",
    progress: 45,
    summary: "Decoding the Japanese text system of Square's Treasure of the Rudras: custom 2-byte kanji encoding, DTE dictionaries, inline furigana — ~286 of ~730 kanji codes identified. A second track cracked the AKAO sound engine, ending in a fully static SPC extractor that rips every song from ROM tables alone, no emulator needed.",
    milestones: [
      { label: "Kana layout, control codes, DTE dictionary decoded", done: true },
      { label: "AKAO sound engine + emulator-free static SPC ripper", done: true },
      { label: "Kanji table: 286 / ~730 codes identified", done: false },
    ],
    badges: ["disasm", "audio-unlocked"],
    screenshots: [],
    repo: "https://github.com/vs-sr-dev/snes-rudranohihou-re",
  },

  /* ---- The Chip Forge ---- */
  {
    id: "chiproll",
    title: "ChipRoll — Piano Roll for Chip Music",
    platform: "forge",
    type: "tooling",
    status: "ongoing",
    progress: 85,
    summary: "A browser piano roll that lets musicians write for the NES, Atari TIA and POKEY the way they'd write anything else: DAW-style grid, MIDI import with auto BPM stretch, live MIDI recording, chip-accurate intonation feedback, and song-aware exports straight to FamiTracker text and ca65 assembly.",
    milestones: [
      { label: "NES + TIA + POKEY engines with pattern/song sequencing", done: true },
      { label: "MIDI import pipeline + Web MIDI live recording", done: true },
      { label: "Song-aware exports: FamiTracker, ca65, chip-native", done: true },
      { label: "POKEY v2 (16-bit joins, alt clocks), MusicXML import", done: false },
    ],
    badges: ["released", "audio-unlocked"],
    screenshots: [],
    repo: "https://github.com/vs-sr-dev/chiproll",
  },
];
