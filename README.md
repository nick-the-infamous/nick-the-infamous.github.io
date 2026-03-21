# nick-the-infamous.github.io

Static site for the `nick-the-infamous.github.io` GitHub Pages site.

## Structure

- `index.html`: landing page shell for the low intensity builds page
- `sections/welcome.html`: unique welcome section loaded into the home page
- `professions/`: profession JSON files used to render the class build sections
- `about.html`: static about page
- `css/`: split styles for base tokens, layout, accordion UI, and responsive rules
- `js/`: split modules for configuration, rendering, accordion behavior, and shared DOM utilities

## Local Preview

Because the home page now loads section fragments with `fetch`, preview it through a local web server instead of
opening `index.html` directly from disk.

One simple option:

```bash
npx serve .
```
