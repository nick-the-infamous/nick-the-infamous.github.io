import { escapeHtml, formatTextBlock, indentHtml } from './dom-utils.js';

export function renderSectionItem(sectionId, item, index) {
  const panelId = `${sectionId}-item-panel-${index + 1}`;
  const label = escapeHtml(item.title);

  return [
    '    <div class="accordion-item nested">',
    `      <button type="button" class="accordion-header nested" aria-controls="${panelId}" aria-expanded="false" data-accordion-label="${label}">`,
    `        <span class="accordion-label">${label}</span>`,
    '        <span class="arrow" aria-hidden="true">&#9656;</span>',
    '      </button>',
    `      <div class="accordion-content nested" id="${panelId}" hidden>`,
    renderSectionItemBody(item),
    '      </div>',
    '    </div>',
  ].join('\n');
}

function renderSectionItemBody(item) {
  const parts = [];

  if (item.videoUrl) {
    parts.push(
      '        <div class="video-wrapper">',
      `          <iframe data-src="${escapeHtml(item.videoUrl)}" title="${escapeHtml(item.title)} video" loading="lazy" allowfullscreen></iframe>`,
      '        </div>',
    );
  }

  if (item.contentHtml) {
    parts.push(indentHtml(item.contentHtml, 8));
    return parts.join('\n');
  }

  if (item.build) {
    parts.push(
      `        <p class="build-description build-field"><strong>BUILD:</strong> <a href="${escapeHtml(item.build)}" target="_blank" rel="noopener noreferrer">link</a></p>`,
    );
  }

  if (item.rotation) {
    parts.push(
      `        <div class="build-description build-field"><strong>ROTATION:</strong> ${formatTextBlock(item.rotation)}</div>`,
    );
  }

  if (item.explanation) {
    parts.push(
      `        <div class="build-description build-field"><strong>EXPLANATION:</strong> ${formatTextBlock(item.explanation)}</div>`,
    );
  }

  if (item.cleaned_transcript && item.cleaned_transcript.trim()) {
    parts.push(
      `        <div class="build-description build-field build-transcript-inline"><strong>CLEANED TRANSCRIPT:</strong> ${escapeHtml(item.cleaned_transcript)}</div>`,
    );
  }

  return parts.join('\n');
}
