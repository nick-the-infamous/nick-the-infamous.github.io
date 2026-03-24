import { initializeAccordions } from './accordion.js';
import { enhanceExternalLinks } from './dom-utils.js';
import { animatePageShell, animateSectionEntrance } from './motion.js';
import { enablePointerDragScroll, initializeCurrentPageLinkGuards } from './nav-interactions.js';
import { initializeSectionBrowser } from './section-browser.js';
import { initializeIframeReveals } from './video-embeds.js';

document.addEventListener('DOMContentLoaded', async () => {
  const sectionNav = document.querySelector('[data-section-nav]');
  const sectionRoot = document.querySelector('[data-section-root]');

  initializeCurrentPageLinkGuards(document);
  enhanceExternalLinks(document);
  initializeIframeReveals(document);

  if (sectionRoot && sectionNav) {
    enablePointerDragScroll(sectionNav);
    await initializeSectionBrowser(sectionNav, sectionRoot, (container) => {
      enhanceExternalLinks(container);
      initializeIframeReveals(container);
      initializeAccordions(container);
      animateSectionEntrance(container);
    });
  }

  animatePageShell(document);
});
