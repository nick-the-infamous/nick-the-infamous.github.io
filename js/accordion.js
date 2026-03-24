import { prepareIframeReveal } from './dom-utils.js';

const HEIGHT_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const OPEN_DURATION_MS = 220;
const CLOSE_DURATION_MS = 180;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  const isOpen = button.getAttribute('aria-expanded') === 'true';
  if (isOpen === shouldOpen) {
    return;
  }

  if (!shouldOpen) {
    closeNestedAccordions(content);
  }

  button.setAttribute('aria-expanded', String(shouldOpen));

  if (shouldOpen) {
    openAccordion(content);
    lazyLoadPanelIframes(content);
  } else {
    closeAccordion(content);
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
    prepareIframeReveal(iframe);
    iframe.src = iframe.dataset.src;
    iframe.removeAttribute('data-src');
  });
}

function openAccordion(content) {
  if (prefersReducedMotion) {
    content.hidden = false;
    content.classList.add('open');
    content.classList.remove('is-expanding', 'is-collapsing', 'is-revealing');
    content.style.height = '';
    content.style.opacity = '';
    content.style.overflow = '';
    content.style.transition = '';
    return;
  }

  const animationId = String((Number(content.dataset.animationId || '0') + 1));
  content.dataset.animationId = animationId;

  content.hidden = false;
  content.classList.add('open', 'is-expanding', 'is-revealing');
  content.classList.remove('is-collapsing');
  content.style.paddingTop = '';
  content.style.paddingBottom = '';
  content.style.overflow = 'hidden';
  content.style.height = '0px';
  content.style.opacity = '0';
  content.style.transition = 'none';

  void content.offsetHeight;

  const targetHeight = content.scrollHeight;
  content.style.transition = [
    `height ${OPEN_DURATION_MS}ms ${HEIGHT_EASE}`,
    `opacity ${Math.round(OPEN_DURATION_MS * 0.8)}ms ease`,
  ].join(', ');
  content.style.height = `${targetHeight}px`;
  content.style.opacity = '1';

  window.setTimeout(() => {
    if (content.dataset.animationId !== animationId) {
      return;
    }

    content.style.height = '';
    content.style.opacity = '';
    content.style.overflow = '';
    content.style.transition = '';
    content.classList.remove('is-expanding');
  }, OPEN_DURATION_MS + 20);
}

function closeAccordion(content) {
  if (prefersReducedMotion) {
    content.hidden = true;
    content.classList.remove('open', 'is-expanding', 'is-collapsing', 'is-revealing');
    content.style.height = '';
    content.style.opacity = '';
    content.style.overflow = '';
    content.style.transition = '';
    return;
  }

  const animationId = String((Number(content.dataset.animationId || '0') + 1));
  content.dataset.animationId = animationId;
  const currentHeight = content.getBoundingClientRect().height;
  const computedStyles = window.getComputedStyle(content);

  content.classList.add('open', 'is-collapsing');
  content.classList.remove('is-expanding', 'is-revealing');
  content.style.height = `${currentHeight}px`;
  content.style.opacity = '1';
  content.style.paddingTop = computedStyles.paddingTop;
  content.style.paddingBottom = computedStyles.paddingBottom;
  content.style.overflow = 'hidden';
  content.style.transition = 'none';

  void content.offsetHeight;

  content.style.transition = [
    `height ${CLOSE_DURATION_MS}ms ${HEIGHT_EASE}`,
    `opacity ${Math.round(CLOSE_DURATION_MS * 0.7)}ms ease`,
    `padding-top ${CLOSE_DURATION_MS}ms ${HEIGHT_EASE}`,
    `padding-bottom ${CLOSE_DURATION_MS}ms ${HEIGHT_EASE}`,
  ].join(', ');
  content.style.height = '0px';
  content.style.opacity = '0';
  content.style.paddingTop = '0px';
  content.style.paddingBottom = '0px';

  window.setTimeout(() => {
    if (content.dataset.animationId !== animationId) {
      return;
    }

    content.hidden = true;
    content.classList.remove('open', 'is-collapsing');
    content.style.height = '';
    content.style.opacity = '';
    content.style.paddingTop = '';
    content.style.paddingBottom = '';
    content.style.overflow = '';
    content.style.transition = '';
  }, CLOSE_DURATION_MS + 20);
}
