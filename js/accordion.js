export function initializeAccordions(root) {
  root.querySelectorAll('.accordion-header[aria-controls]').forEach((button) => {
    if (button.dataset.accordionBound === 'true') {
      return;
    }

    button.dataset.accordionBound = 'true';
    button.addEventListener('click', () => {
      const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
      setAccordionState(button, shouldOpen);
    });
  });
}

function setAccordionState(button, shouldOpen) {
  const panelId = button.getAttribute('aria-controls');
  if (!panelId) {
    return;
  }

  const content = document.getElementById(panelId);
  if (!content) {
    return;
  }

  if (!shouldOpen) {
    closeNestedAccordions(content);
  }

  button.setAttribute('aria-expanded', String(shouldOpen));
  content.classList.toggle('open', shouldOpen);
  content.hidden = !shouldOpen;

  if (shouldOpen) {
    lazyLoadPanelIframes(content);
  }
}

function closeNestedAccordions(parentElement) {
  const openButtons = [...parentElement.querySelectorAll('.accordion-header[aria-expanded="true"]')].reverse();
  openButtons.forEach((button) => setAccordionState(button, false));
}

function lazyLoadPanelIframes(content) {
  const iframes = [...content.querySelectorAll('iframe[data-src]')].filter(
    (iframe) => iframe.closest('.accordion-content') === content,
  );

  iframes.forEach((iframe) => {
    iframe.src = iframe.dataset.src;
    iframe.removeAttribute('data-src');
  });
}
