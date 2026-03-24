import { SECTION_SOURCES } from './config.js';
import { renderSection } from './render-build-section.js';
import { renderSectionNav } from './render-nav.js';

const DEFAULT_SECTION_ID = 'welcome';
const sectionMarkupCache = new Map();
let activeSectionId = '';

export async function initializeSectionBrowser(navContainer, sectionContainer, onSectionRendered = () => {}) {
  navContainer.innerHTML = renderSectionNav(SECTION_SOURCES);
  navContainer.hidden = false;
  navContainer.addEventListener('click', (event) => handleSectionNavClick(event, navContainer));
  window.addEventListener('hashchange', () => void syncSectionFromLocation(sectionContainer, navContainer, onSectionRendered));

  await syncSectionFromLocation(sectionContainer, navContainer, onSectionRendered);
}

async function syncSectionFromLocation(container, navContainer, onSectionRendered) {
  const sectionId = getSectionIdFromHash();
  updateSectionNavState(navContainer, sectionId);
  const didRender = await renderActiveSection(container, sectionId);

  if (didRender) {
    await onSectionRendered(container, sectionId);
  }
}

function handleSectionNavClick(event, navContainer) {
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

function updateSectionNavState(navContainer, targetSectionId) {
  navContainer.querySelectorAll('[data-section-id]').forEach((button) => {
    const isActive = button.dataset.sectionId === targetSectionId;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

async function renderActiveSection(container, sectionId) {
  if (activeSectionId === sectionId && container.firstElementChild?.id === sectionId) {
    return false;
  }

  container.setAttribute('aria-busy', 'true');

  try {
    container.innerHTML = await getSectionMarkup(sectionId);
    activeSectionId = sectionId;
    return true;
  } catch (error) {
    console.error(error);
    activeSectionId = '';
    container.innerHTML =
      '<p class="loading-message">The selected section could not be loaded. Refresh the page and try again.</p>';
    return false;
  } finally {
    container.removeAttribute('aria-busy');
  }
}

async function getSectionMarkup(sectionId) {
  if (!sectionMarkupCache.has(sectionId)) {
    const markupPromise = loadSectionMarkup(sectionId).catch((error) => {
      sectionMarkupCache.delete(sectionId);
      throw error;
    });
    sectionMarkupCache.set(sectionId, markupPromise);
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
