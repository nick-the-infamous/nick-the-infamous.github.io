const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function animateSectionEntrance(container) {
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

export function animatePageShell(root) {
  document.body.classList.remove('motion-pending');

  if (prefersReducedMotion) {
    return;
  }

  root.querySelectorAll('[data-shell-reveal]').forEach((element, index) => {
    element.style.setProperty('--shell-reveal-index', String(index));
  });

  root.querySelectorAll('[data-shell-text]').forEach((element, index) => {
    element.style.setProperty('--shell-text-index', String(index));
  });

  document.body.classList.remove('shell-visible');
  void document.body.offsetHeight;
  document.body.classList.add('shell-visible');
}
