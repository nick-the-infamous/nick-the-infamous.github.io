import { escapeHtml, indentHtml } from './dom-utils.js';

export function upgradeLegacyAccordionMarkup(root) {
  let nextPanelId = 1;

  root.querySelectorAll('div.accordion-header').forEach((header) => {
    const content = header.nextElementSibling;
    if (!content || !content.classList.contains('accordion-content')) {
      return;
    }

    const labelContainer = header.cloneNode(true);
    labelContainer.querySelectorAll('.arrow').forEach((arrow) => arrow.remove());

    const labelMarkup = labelContainer.innerHTML.trim();
    const labelText = labelContainer.textContent.trim().replace(/\s+/g, ' ');
    const panelId = content.id || `legacy-panel-${nextPanelId++}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = header.className;
    button.setAttribute('aria-controls', panelId);
    button.setAttribute('aria-expanded', 'false');
    button.dataset.accordionLabel = labelText;
    button.innerHTML = [
      `<span class="accordion-label">${labelMarkup}</span>`,
      '<span class="arrow" aria-hidden="true">&#9656;</span>',
    ].join('');

    content.id = panelId;
    content.hidden = true;
    header.replaceWith(button);
  });
}

export function renderSection(section) {
  const panelId = `section-panel-${section.id}`;

  return [
    `<section class="accordion-item" id="${escapeHtml(section.id)}">`,
    `  <button type="button" class="accordion-header" aria-controls="${panelId}" aria-expanded="false" data-accordion-label="${escapeHtml(section.title)}">`,
    `    <span class="accordion-label">${escapeHtml(section.title)}</span>`,
    '    <span class="arrow" aria-hidden="true">&#9656;</span>',
    '  </button>',
    `  <div class="accordion-content" id="${panelId}" hidden>`,
    section.items.map((item, index) => renderSectionItem(section.id, item, index)).join('\n'),
    '  </div>',
    '</section>',
  ].join('\n');
}

function renderSectionItem(sectionId, item, index) {
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
      `        <iframe data-src="${escapeHtml(item.videoUrl)}" title="${escapeHtml(item.title)} video" loading="lazy" allowfullscreen></iframe>`,
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
      `        <div class="build-description build-field"><strong>ROTATION:</strong> ${item.rotation}</div>`,
    );
  }

  if (item.explanation) {
    parts.push(
      `        <div class="build-description build-field"><strong>EXPLANATION:</strong> ${item.explanation}</div>`,
    );
  }

  return parts.join('\n');
}
