# Repository Guidelines

## Project Structure & Module Organization

This repository is a small GitHub Pages static site.

- `index.html`: home page shell for the low-intensity builds page
- `about.html`: static about page
- `sections/welcome.html`: unique welcome section loaded as raw HTML
- `professions/`: JSON data for profession build entries
- `js/main.js`: page bootstrap
- `js/section-browser.js`: section routing and content loading
- `js/render-*.js`: focused renderers for nav, sections, and build items
- `js/nav-interactions.js`: drag-scroll and current-page link guards
- `js/motion.js` / `js/motion-tokens.js`: shared motion hooks and timing tokens
- `js/video-embeds.js`: iframe poster/loading behavior
- `js/accordion.js`: accordion behavior and iframe lazy loading
- `js/dom-utils.js`: small shared DOM/string helpers
- `css/`: split styles for base tokens, layout, accordion UI, and responsive overrides

Keep profession content in `professions/*.json`. Keep one-off markup in `sections/` only when the content does not fit the shared JSON renderer.

## Build, Test, and Development Commands

- `npx serve .`: run a local web server for previewing the site
- `node --check js/main.js`: syntax-check the main JS entrypoint
- `node --check js/render-build-section.js`: syntax-check section renderer changes
- `node scripts/validate-content.mjs`: validate profession JSON structure and URLs

Because the site loads JSON and HTML fragments with `fetch`, do not open `index.html` directly from disk for testing.

## Coding Style & Naming Conventions

Use 2-space indentation in HTML, CSS, JSON, and JavaScript. Prefer small, single-purpose ES modules in `js/` and group styles by responsibility in `css/`.

Naming conventions:

- JSON files: lowercase profession names, e.g. `professions/warrior.json`
- JS modules: kebab-case or simple lowercase names, e.g. `render-build-section.js`
- CSS files: role-based names, e.g. `accordion.css`, `responsive.css`

Keep profession JSON structured with explicit fields like `title`, `videoUrl`, `build`, `rotation`, and `explanation`.

## Testing Guidelines

There is no formal test framework in this repository yet. For changes, do two things:

- run `node --check` on edited JS modules
- preview the site locally and verify accordion behavior, section loading, and profession links

If a UI change affects layout or interaction, include a screenshot or short note describing what you checked.

## Security & Configuration Tips

Do not commit secrets. Keep external links hardened with `target="_blank"` plus `rel="noopener noreferrer"`. `.idea/` is ignored and should stay untracked.
