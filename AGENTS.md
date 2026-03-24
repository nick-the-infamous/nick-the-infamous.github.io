# Repository Guidelines

## Project Structure & Module Organization

This repository is a small GitHub Pages static site.

- `index.html`: homepage / landing page
- `builds.html`: low-intensity builds browser page
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

## Visual Style & New Pages

When creating or updating pages, follow the existing site style instead of introducing a new visual direction.

- Reuse the shared page shell: fixed header, `.page-content` main wrapper, `.page-hero` intro section, and `.page-panel` content panels.
- Keep the current dark theme, gold accent, soft borders, and subtle panel gradients already defined in `css/base.css` and `css/layout.css`.
- Prefer simple page heroes with a small kicker line and a short intro paragraph. Do not introduce oversized marketing-style hero sections unless explicitly requested.
- Use the existing navigation pattern and labels: `Home`, `Low Intensity Builds`, and `About Me`.
- Keep panels and cards consistent with the current site: rounded corners, thin borders, low-contrast backgrounds, and restrained hover motion.
- New content sections should usually be built from existing patterns such as `.page-panel`, `.home-info-card`, `.social-link-card`, `.welcome-block`, and the accordion components before adding new one-off styles.
- Keep copy practical and compact. The site tone is straightforward and informational, not promotional.
- Prefer the same content width as the existing pages. Avoid creating narrow one-off layouts unless the page specifically needs it.
- For external profile/platform links, use the existing card/link treatment rather than plain link dumps when the page already uses cards.
- If a new page needs custom styles, add only the minimum necessary rules and keep them aligned with the existing spacing, border, and typography scale.

## Frontend Architecture Principles

This site should follow a small component-based frontend structure with clear separation of structure, presentation, and behavior.

- Structure in HTML: page markup should describe content and hierarchy clearly using semantic elements such as `header`, `main`, `section`, headings, paragraphs, lists, buttons, and nav.
- Presentation in CSS: visual decisions should live in `css/` and reuse shared classes and tokens before adding page-specific styles.
- Behavior in JavaScript: interaction logic should stay in focused JS modules instead of being embedded into HTML.
- Reuse existing patterns first: prefer shared shells, panels, cards, accordions, and nav patterns before creating new UI structures.
- Keep content and rendering separate: structured content belongs in `professions/*.json` when possible, while rendering logic belongs in the `render-*.js` modules.
- Prefer composition over one-off styling: build new pages from existing layout and component classes rather than inventing isolated page-specific markup and CSS.
- Keep naming descriptive and role-based: classes and modules should describe responsibility, not appearance alone.
- Keep state explicit: use clear classes and attributes for UI state such as active, open, loading, hidden, and busy.
- Design for scanning: keep headings, intros, cards, and sections easy to scan quickly.
- Responsive behavior should simplify, not reinvent: layouts should collapse cleanly on smaller screens instead of becoming a different design.
- Accessibility is a default requirement: preserve semantic HTML, keyboard-usable controls, visible focus states, and appropriate ARIA attributes where needed.
- Keep the system small: add new abstractions only when they will actually be reused or reduce confusion.

## Build, Test, and Development Commands

- `npx serve .`: run a local web server for previewing the site
- `node --check js/main.js`: syntax-check the main JS entrypoint
- `node --check js/render-build-section.js`: syntax-check section renderer changes
- `node scripts/validate-content.mjs`: validate profession JSON structure and URLs

Because the builds browser loads section fragments with `fetch`, do not open `builds.html` directly from disk for testing.

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
