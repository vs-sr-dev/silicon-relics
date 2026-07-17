# Silicon Relics

A living codex of retro console **homebrew**, **reverse engineering** and **porting** quests by Samuele Voltan — from the famous to the forgotten.

This is a fully static, dependency-free site (vanilla HTML/CSS/JS). No build step.

## Structure

| File | Role |
|------|------|
| `index.html` | Page shell — written once |
| `style.css` | Dark-fantasy codex theme — written once |
| `app.js` | Rendering, sorting, filters, search, lightbox — written once |
| `data.js` | **The only file content updates touch.** Platforms (Relics) and projects (Quests) |
| `assets/` | Optimized screenshots |

## Updating content

Edit `data.js`:

- Add a platform to `PLATFORMS` (id, name, maker, year, gen, rarity, blurb).
- Add a project to `PROJECTS` (id, title, platform id, type, status, progress %, summary, milestones, badges, screenshots, repo link).
- Bump `SITE.updated`.

Open `index.html` directly in a browser to preview (no server needed), then push.

## Hosting

GitHub Pages, served from the `main` branch root. The site uses only relative paths, so it works both as a project site and as a user-site root.
