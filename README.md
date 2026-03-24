# nick-the-infamous.github.io

Static site for the `nick-the-infamous.github.io` GitHub Pages site.

## Structure

- `index.html`: landing page shell for the low intensity builds page
- `sections/welcome.html`: unique welcome section loaded into the home page
- `professions/`: profession JSON files used to render the class build sections
- `about.html`: static about page
- `css/`: split styles for base tokens, layout, accordion UI, and responsive rules
- `js/main.js`: top-level page bootstrap
- `js/section-browser.js`: section nav, hash routing, and section fetching/rendering
- `js/render-*.js`: focused renderers for nav, sections, and build items
- `js/nav-interactions.js`: drag-scroll and current-page link guards
- `js/motion.js` / `js/motion-tokens.js`: entrance animation hooks and shared timing tokens
- `js/video-embeds.js`: iframe thumbnail/loading behavior
- `js/accordion.js`: accordion open/close and lazy iframe loading
- `js/dom-utils.js`: small shared string/DOM helpers

## Local Preview

Because the home page now loads section fragments with `fetch`, preview it through a local web server instead of
opening `index.html` directly from disk.

One simple option:

```bash
npx serve .
```

## Validation

Validate profession JSON before publishing:

```bash
node scripts/validate-content.mjs
```
