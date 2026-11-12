# Silicon Relics

A catalogue of every public repository on [vs-sr-dev](https://github.com/vs-sr-dev): static recompilations, ports, emulators, homebrew, platform research and format documentation. There is one room per machine, ordered by the year it came out, plus the pieces still in the workshop that are not published yet.

Live at **https://vs-sr-dev.github.io/silicon-relics/**

The site is fully static: vanilla HTML, CSS and JS, with no build step for the page itself and no dependencies.

## Structure

| File | Role |
|---|---|
| `index.html` | Page shell |
| `style.css` | The museum-catalogue theme, light and dark |
| `app.js` | Rendering, filters, search, the card dialog. Content changes never touch it |
| `data.js` | **Generated.** The only file the page reads (`window.SR`) |
| `content/github.json` | `gh repo list` metadata, public repositories only |
| `content/catalog.json` | One curated entry per repository: title, tagline, summary, highlights, status, bar, and the evidence for the bar |
| `content/overrides.json` | Hand corrections applied on top of the catalogue, plus each entry's screenshots and icon |
| `content/workshop.json` | Work not yet on GitHub, kept spoiler-free: one neutral line each |
| `tools/build-data.mjs` | Builds `data.js` from `content/`; holds the machine table and the repository → machine map |
| `assets/` | Optimised screenshots |

## Updating

```sh
# 1. refresh the GitHub metadata (public repos only; Bash, not PowerShell)
gh repo list vs-sr-dev --limit 400 --json name,description,isPrivate,isFork,isArchived,createdAt,pushedAt,stargazerCount \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const a=JSON.parse(s).filter(r=>!r.isPrivate).map(({isPrivate,...r})=>r).sort((x,y)=>x.name.localeCompare(y.name));require("fs").writeFileSync("content/github.json",JSON.stringify(a,null,1)+"\n")})'

# 2. see what changed
node tools/build-data.mjs --check
#    NEW  public but not catalogued → add an entry to content/catalog.json
#    GONE catalogued but no longer public
#    MACH no machine → add the repository to MACHINE in tools/build-data.mjs

# 3. build and preview (open index.html in a browser)
node tools/build-data.mjs
```

A status change is a small edit: change `status`, `progress` and `progress_basis` for the entry in `content/catalog.json`, or add a correction to `content/overrides.json`. When two sources about a repository disagree, the most recent note counts.

## The bars

Every bar measures how close the object is to the finish line its own repository declares, and every card says what 100 % means. Ports follow a fixed ladder (5 analysis · 15 builds · 25 first picture · 35 title · 50 in-game · 65 a long stretch plays · 80 most of the game · 90 finished with rough edges · 100 finished and verified). Whole-library kits count the cartridges that run identically. Game-driven kits weigh their subsystems and their furthest port. Emulators count the library that plays. Write-ups measure how much of the object is accounted for. The full table is on the page, under "How to read the bars".

## Hosting

GitHub Pages, served from the root of the `main` branch. Every path is relative.
