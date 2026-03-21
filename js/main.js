import { initializeAccordions } from './accordion.js';
import { SECTION_SOURCES } from './config.js';
import { enhanceExternalLinks } from './dom-utils.js';
import { renderSection, upgradeLegacyAccordionMarkup } from './render-sections.js';

document.addEventListener('DOMContentLoaded', async () => {
  const sectionRoot = document.querySelector('[data-section-root]');

  if (sectionRoot) {
    await loadSectionContent(sectionRoot);
  }

  enhanceExternalLinks(document);
  initializeAccordions(document);
});

async function loadSectionContent(container) {
  container.setAttribute('aria-busy', 'true');

  try {
    const sections = await Promise.all(
      SECTION_SOURCES.map(async (source) => {
        const response = await fetch(source.path);
        if (!response.ok) {
          throw new Error(`Failed to load ${source.path}: ${response.status}`);
        }

        if (source.type === 'html') {
          return response.text();
        }

        const data = await response.json();
        return renderSection(data);
      }),
    );

    container.innerHTML = sections.join('\n');
    upgradeLegacyAccordionMarkup(container);
  } catch (error) {
    console.error(error);
    container.innerHTML =
      '<p class="loading-message">The build sections could not be loaded. Refresh the page and try again.</p>';
  } finally {
    container.removeAttribute('aria-busy');
  }
}
