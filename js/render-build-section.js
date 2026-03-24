import { escapeHtml } from './dom-utils.js';
import { renderSectionItem } from './render-build-item.js';

export function renderSection(section) {
  const buildCountLabel = `${section.items.length} ${section.items.length === 1 ? 'build' : 'builds'}`;

  return [
    `<section class="build-section" id="${escapeHtml(section.id)}">`,
    '  <div class="build-section-header">',
    '    <div class="build-section-heading-group">',
    `      <h2 class="build-section-title">${escapeHtml(section.title)}</h2>`,
    `      <p class="build-section-meta">${escapeHtml(buildCountLabel)}</p>`,
    '    </div>',
    '  </div>',
    '  <div class="build-section-items">',
    section.items.map((item, index) => renderSectionItem(section.id, item, index)).join('\n'),
    '  </div>',
    '</section>',
  ].join('\n');
}
