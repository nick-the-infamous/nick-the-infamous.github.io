export function initializeCurrentPageLinkGuards(root) {
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

export function enablePointerDragScroll(container) {
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

  container.addEventListener(
    'click',
    (event) => {
      if (!suppressClick) {
        return;
      }

      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );
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
  const normalizedPath = pathname.replace(/\/index\.html$/i, '/');

  if (normalizedPath === '/') {
    return normalizedPath;
  }

  return normalizedPath.replace(/\/+$/, '');
}

function resetPointerDragState(container) {
  container.classList.remove('is-drag-ready');
  container.classList.remove('is-dragging');
}
