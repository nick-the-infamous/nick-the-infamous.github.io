# Nick The Infamous

Static GitHub Pages site for `nick-the-infamous.github.io`.

The site has three top-level pages:

- `index.html`: homepage with quick links and channel overview
- `builds.html`: low intensity builds browser
- `about.html`: background, channel context, and build philosophy

The builds browser renders profession content from JSON in `professions/` and loads the welcome section from `sections/welcome.html`.

## Project Layout

- `css/`: shared tokens, layout, accordion styles, and responsive overrides
- `images/favicon.png`: shared site mark used for the browser tab icon and header brand
- `js/main.js`: page bootstrap
- `js/section-browser.js`: section loading, routing, and navigation state
- `js/render-*.js`: focused renderers for navigation, sections, and build items
- `js/nav-interactions.js`: current-page link guards and drag-scroll behavior
- `js/motion.js` and `js/motion-tokens.js`: shared animation hooks and timing tokens
- `js/video-embeds.js`: iframe poster and load-state behavior
- `js/accordion.js`: accordion behavior and lazy iframe loading
- `js/dom-utils.js`: small shared DOM/string utilities
- `professions/*.json`: structured profession build content
- `scripts/validate-content.mjs`: profession JSON validation
- `sections/welcome.html`: hand-authored welcome section content

## Local Development

Because `builds.html` fetches HTML fragments and JSON, do not open it directly from disk. Run a local server instead:

```bash
npx serve .
```

Then open the local URL from `serve` in your browser.

## Validation

Validate profession JSON before publishing:

```bash
node scripts/validate-content.mjs
```

If you change JavaScript, syntax-check the edited module:

```bash
node --check js/main.js
```

You can replace the path above with whichever JS file you edited.

## Content Notes

- Keep profession entries in `professions/*.json` when the shared renderer can handle the content.
- Keep one-off markup in `sections/` only when the content does not fit the shared JSON-driven build renderer.
- Reuse the shared page shell and component classes before introducing new page-specific markup or styles.

## Deployment

This repo is a static site intended for GitHub Pages. There is no build step.
