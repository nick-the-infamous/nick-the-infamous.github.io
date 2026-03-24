import { escapeHtml } from './dom-utils.js';

export function renderSectionNav(sections) {
  return [
    '<div class="section-nav-list">',
    ...sections.map(
      (section) =>
        `  <button type="button" class="section-nav-button" data-section-id="${escapeHtml(section.id)}" data-shell-text aria-pressed="false">${escapeHtml(section.title)}</button>`,
    ),
    '</div>',
  ].join('\n');
}
