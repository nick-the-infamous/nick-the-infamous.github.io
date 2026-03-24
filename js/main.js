import { initializeAccordions } from './accordion.js';
import { SECTION_SOURCES } from './config.js';
import { enhanceExternalLinks, initializeIframeReveals } from './dom-utils.js';
import { renderSection, renderSectionNav } from './render-sections.js';

const DEFAULT_SECTION_ID = 'welcome';
const sectionMarkupCache = new Map();
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let activeSectionId = '';

document.addEventListener('DOMContentLoaded', async () => {
  const sectionNav = document.querySelector('[data-section-nav]');
  const sectionRoot = document.querySelector('[data-section-root]');

  initializeCurrentPageLinkGuards(document);

  if (sectionRoot && sectionNav) {
    sectionNav.innerHTML = renderSectionNav(SECTION_SOURCES);
    sectionNav.hidden = false;
    sectionNav.addEventListener('click', (event) => handleSectionNavClick(event, sectionRoot, sectionNav));
    enablePointerDragScroll(sectionNav);
    window.addEventListener('hashchange', () => void syncSectionFromLocation(sectionRoot, sectionNav));

    await syncSectionFromLocation(sectionRoot, sectionNav);
  }

  enhanceExternalLinks(document);
  initializeIframeReveals(document);
  applyPageShellMotion(document);
});

async function syncSectionFromLocation(container, navContainer) {
  const sectionId = getSectionIdFromHash();
  updateSectionNavState(navContainer, sectionId);
  await renderActiveSection(container, sectionId);
  enhanceExternalLinks(document);
  initializeIframeReveals(container);
  initializeAccordions(document);
}

function handleSectionNavClick(event, container, navContainer) {
  const button = event.target.closest('[data-section-id]');
  if (!button) {
    return;
  }

  const sectionId = button.dataset.sectionId;
  if (!sectionId) {
    return;
  }

  if (getSectionIdFromHash() === sectionId) {
    updateSectionNavState(navContainer, sectionId);
    return;
  }

  window.location.hash = sectionId;
}

function getSectionIdFromHash() {
  const hashId = window.location.hash.replace(/^#/, '');
  const source = SECTION_SOURCES.find((entry) => entry.id === hashId);

  if (source) {
    return source.id;
  }

  const url = new URL(window.location.href);
  url.hash = DEFAULT_SECTION_ID;
  window.history.replaceState(null, '', url);
  return DEFAULT_SECTION_ID;
}

function updateSectionNavState(navContainer, activeSectionId) {
  navContainer.querySelectorAll('[data-section-id]').forEach((button) => {
    const isActive = button.dataset.sectionId === activeSectionId;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

async function renderActiveSection(container, sectionId) {
  if (activeSectionId === sectionId && container.firstElementChild?.id === sectionId) {
    return;
  }

  container.setAttribute('aria-busy', 'true');

  try {
    container.innerHTML = await getSectionMarkup(sectionId);
    activeSectionId = sectionId;
    applySectionEntranceMotion(container);
  } catch (error) {
    console.error(error);
    activeSectionId = '';
    container.innerHTML =
      '<p class="loading-message">The selected section could not be loaded. Refresh the page and try again.</p>';
  } finally {
    container.removeAttribute('aria-busy');
  }
}

async function getSectionMarkup(sectionId) {
  if (!sectionMarkupCache.has(sectionId)) {
    sectionMarkupCache.set(sectionId, loadSectionMarkup(sectionId));
  }

  return sectionMarkupCache.get(sectionId);
}

async function loadSectionMarkup(sectionId) {
  const source = SECTION_SOURCES.find((entry) => entry.id === sectionId);
  if (!source) {
    throw new Error(`Unknown section id: ${sectionId}`);
  }

  const response = await fetch(source.path);
  if (!response.ok) {
    throw new Error(`Failed to load ${source.path}: ${response.status}`);
  }

  if (source.type === 'html') {
    return response.text();
  }

  const data = await response.json();
  return renderSection(data);
}

function initializeCurrentPageLinkGuards(root) {
  root.querySelectorAll('.main-nav a[href]').forEach((link) => {
    if (link.dataset.currentLinkGuardBound === 'true') {
      return;
    }

    link.dataset.currentLinkGuardBound = 'true';
    link.addEventListener('click', (event) => {
      if (isCurrentPageLink(link)) {
        event.preventDefault();
      }
    });
  });
}

function isCurrentPageLink(link) {
  const linkUrl = new URL(link.href, window.location.href);
  const currentUrl = new URL(window.location.href);

  return (
    linkUrl.origin === currentUrl.origin &&
    normalizePathname(linkUrl.pathname) === normalizePathname(currentUrl.pathname) &&
    linkUrl.search === currentUrl.search
  );
}

function normalizePathname(pathname) {
  if (pathname === '/') {
    return pathname;
  }

  return pathname.replace(/\/+$/, '');
}

function enablePointerDragScroll(container) {
  let isPointerDown = false;
  let isDragging = false;
  let suppressClick = false;
  let startX = 0;
  let startScrollLeft = 0;

  container.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    isPointerDown = true;
    isDragging = false;
    startX = event.clientX;
    startScrollLeft = container.scrollLeft;
    container.classList.add('is-drag-ready');
  });

  container.addEventListener('pointermove', (event) => {
    if (!isPointerDown) {
      return;
    }

    const deltaX = event.clientX - startX;
    if (!isDragging && Math.abs(deltaX) > 6) {
      isDragging = true;
      container.classList.add('is-dragging');
    }

    if (!isDragging) {
      return;
    }

    container.scrollLeft = startScrollLeft - deltaX;
  });

  container.addEventListener('pointerup', () => {
    suppressClick = isDragging;
    resetPointerDragState(container);
    isPointerDown = false;
    isDragging = false;
  });

  container.addEventListener('pointercancel', () => {
    suppressClick = isDragging;
    resetPointerDragState(container);
    isPointerDown = false;
    isDragging = false;
  });

  container.addEventListener('pointerleave', () => {
    if (!isPointerDown) {
      return;
    }

    suppressClick = isDragging;
    resetPointerDragState(container);
    isPointerDown = false;
    isDragging = false;
  });

  container.addEventListener('click', (event) => {
    if (!suppressClick) {
      return;
    }

    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }, true);
}

function resetPointerDragState(container) {
  container.classList.remove('is-drag-ready');
  container.classList.remove('is-dragging');
}

function applySectionEntranceMotion(container) {
  if (prefersReducedMotion) {
    return;
  }

  const root = container.firstElementChild;
  if (!root) {
    return;
  }

  const revealTargets = [
    root.querySelector('.build-section-header'),
    ...root.querySelectorAll('.welcome-block'),
    ...root.querySelectorAll('.accordion-item.nested'),
  ].filter(Boolean);

  revealTargets.forEach((element, index) => {
    element.style.setProperty('--reveal-index', String(index));
  });

  const textTargets = root.querySelectorAll(
    [
      '.build-section-title',
      '.build-section-meta',
      '.section-intro',
      '.welcome-block-title',
      '.welcome-block-intro',
      '.welcome-subheading',
      '.welcome-card p',
      '.welcome-list li',
      '.build-description',
      '.build-field',
    ].join(', '),
  );

  textTargets.forEach((element, index) => {
    element.style.setProperty('--text-reveal-index', String(index));
  });

  root.classList.remove('is-visible');
  void root.offsetHeight;
  root.classList.add('is-visible');
}

function applyPageShellMotion(root) {
  document.body.classList.remove('motion-pending');

  if (prefersReducedMotion) {
    return;
  }

  const shellTargets = [
    ...root.querySelectorAll('[data-shell-reveal]'),
  ];

  shellTargets.forEach((element, index) => {
    element.style.setProperty('--shell-reveal-index', String(index));
  });

  const textTargets = root.querySelectorAll('[data-shell-text]');
  textTargets.forEach((element, index) => {
    element.style.setProperty('--shell-text-index', String(index));
  });

  document.body.classList.remove('shell-visible');
  void document.body.offsetHeight;
  document.body.classList.add('shell-visible');
}
