# Repository Guidelines

## Project Overview

This repository is a small static GitHub Pages site for `nick-the-infamous.github.io`.

The site uses a shared page shell across the top-level pages:

- fixed header with `site-brand` and `main-nav`
- `main.page-content` as the outer page wrapper
- `section.page-hero.page-hero--wide` for the page intro
- `section.page-panel` for main content blocks

There is no build pipeline. HTML, CSS, JSON, and modular JavaScript are served directly.

## Project Structure

- `index.html`: homepage with overview cards and platform links
- `builds.html`: low intensity builds browser page
- `about.html`: static about page
- `sections/welcome.html`: hand-authored welcome section loaded into the builds browser
- `professions/*.json`: structured profession build data
- `images/favicon.png`: shared site icon and header brand mark
- `js/main.js`: page bootstrap
- `js/section-browser.js`: section routing, fetching, and render orchestration
- `js/render-*.js`: focused renderers for nav, sections, and build items
- `js/nav-interactions.js`: drag-scroll and current-page link guards
- `js/motion.js` and `js/motion-tokens.js`: shared motion hooks and timing tokens
- `js/video-embeds.js`: iframe poster/loading behavior
- `js/accordion.js`: accordion behavior and iframe lazy loading
- `js/dom-utils.js`: small shared DOM/string helpers
- `css/base.css`: core tokens and global element styles
- `css/layout.css`: shared page shell and component layout rules
- `css/accordion.css`: accordion-specific styling
- `css/responsive.css`: responsive adjustments
- `scripts/validate-content.mjs`: profession content validation

Keep profession content in `professions/*.json`. Only use `sections/` for content that does not fit the shared JSON renderer.

## Shared UI Patterns

When creating or editing pages, preserve the existing site system.

- Reuse the shared header pattern: `site-header`, `header-content`, `site-brand`, `site-brand-mark`, `site-title`, and `main-nav`.
- Reuse the shared page shell: `page-content`, `page-hero page-hero--wide`, `page-title`, `page-intro`, and `page-panel`.
- Use `panel-copy`, `page-panel--centered`, and `page-panel-title` when they match the content instead of inventing near-duplicates.
- Reuse existing cards and blocks before adding new patterns: `home-info-card`, `social-link-card`, `welcome-block`, `welcome-card`, `browser-*`, and accordion components.
- Keep the dark theme, gold accent, soft borders, panel gradients, and restrained motion already established in `css/base.css` and `css/layout.css`.
- Prefer small, readable hero copy and scannable content blocks. Avoid oversized marketing-style hero sections unless explicitly requested.
- Use the existing navigation labels: `Home`, `Low Intensity Builds`, and `About Me`.

## Architecture Rules

- Structure in HTML: use semantic elements and keep markup focused on content hierarchy.
- Presentation in CSS: reuse shared classes and tokens before adding new selectors.
- Behavior in JavaScript: keep interactions in focused modules instead of inline handlers.
- Prefer composition over one-off styling: extend existing shells, panels, cards, and accordions before creating page-specific variants.
- Keep naming role-based: class and module names should describe responsibility, not appearance alone.
- Keep UI state explicit with classes and attributes such as `active`, `open`, `hidden`, `loading`, and `busy`.
- Preserve accessibility by default: semantic headings, keyboard-usable controls, visible focus states, and appropriate ARIA usage.

## Content and Style Conventions

- Use 2-space indentation in HTML, CSS, JSON, and JavaScript.
- Keep copy practical, compact, and informational rather than promotional.
- JSON files should use lowercase profession names, for example `professions/warrior.json`.
- JS modules should use kebab-case or simple lowercase names, for example `render-build-section.js`.
- CSS files should be role-based, for example `accordion.css` and `responsive.css`.
- Profession JSON should keep explicit fields such as `title`, `videoUrl`, `build`, `rotation`, and `explanation`.

## Development Commands

- `npx serve .`: run a local preview server
- `node --check js/main.js`: syntax-check a JS entrypoint
- `node --check js/render-build-section.js`: syntax-check a renderer module
- `node scripts/validate-content.mjs`: validate profession JSON structure and URLs

Because the builds browser loads section fragments with `fetch`, do not test `builds.html` by opening it directly from disk.

## Testing Expectations

There is no formal test framework yet. For changes:

- run `node --check` on any edited JavaScript modules
- preview the site locally through a web server
- verify section loading, accordion behavior, profession links, and any affected responsive layout

If a UI change affects layout or interaction, leave a short note describing what you checked. A screenshot is useful when practical.

## Security and Repo Hygiene

- Do not commit secrets.
- Keep external links hardened with `target="_blank"` plus `rel="noopener noreferrer"`.
- `.idea/` should remain untracked.
