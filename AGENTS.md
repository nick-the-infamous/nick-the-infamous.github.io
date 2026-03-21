# Repository Guidelines

## Project Structure & Module Organization

This repository is a small GitHub Pages static site.

- `index.html`: home page shell for the low-intensity builds page
- `about.html`: static about page
- `sections/welcome.html`: unique welcome section loaded as raw HTML
- `professions/`: JSON data for profession build entries
- `js/`: ES modules for configuration, rendering, accordion behavior, and DOM utilities
- `css/`: split styles for base tokens, layout, accordion UI, and responsive overrides

Keep profession content in `professions/*.json`. Keep one-off markup in `sections/` only when the content does not fit the shared JSON renderer.

## Build, Test, and Development Commands

- `npx serve .`: run a local web server for previewing the site
- `node --check js/main.js`: syntax-check the main JS entrypoint
- `node --check js/render-sections.js`: syntax-check renderer changes

Because the site loads JSON and HTML fragments with `fetch`, do not open `index.html` directly from disk for testing.

## Coding Style & Naming Conventions

Use 2-space indentation in HTML, CSS, JSON, and JavaScript. Prefer small, single-purpose ES modules in `js/` and group styles by responsibility in `css/`.

Naming conventions:

- JSON files: lowercase profession names, e.g. `professions/warrior.json`
- JS modules: kebab-case or simple lowercase names, e.g. `render-sections.js`
- CSS files: role-based names, e.g. `accordion.css`, `responsive.css`

Keep profession JSON structured with explicit fields like `title`, `videoUrl`, `build`, `rotation`, and `explanation`.

## Testing Guidelines

There is no formal test framework in this repository yet. For changes, do two things:

- run `node --check` on edited JS modules
- preview the site locally and verify accordion behavior, section loading, and profession links

If a UI change affects layout or interaction, include a screenshot or short note describing what you checked.

## Commit & Pull Request Guidelines

Recent commits use short, direct subjects such as `update herald` and `Add condi ele`. Follow that style: concise, imperative, and specific to the content changed.

For pull requests, include:

- a brief summary of what changed
- any affected paths, such as `professions/guardian.json` or `js/render-sections.js`
- screenshots for visible UI changes
- notes on local verification performed

## Security & Configuration Tips

Do not commit secrets. Keep external links hardened with `target="_blank"` plus `rel="noopener noreferrer"`. `.idea/` is ignored and should stay untracked.
