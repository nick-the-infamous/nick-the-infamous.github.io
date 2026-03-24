export function enhanceExternalLinks(root) {
  root.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('noreferrer');
    link.setAttribute('rel', [...rel].join(' '));
  });
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function indentHtml(html, spaces) {
  const indent = ' '.repeat(spaces);
  return html
    .split('\n')
    .map((line) => `${indent}${line}`)
    .join('\n');
}

export function initializeIframeReveals(root) {
  root.querySelectorAll('iframe').forEach((iframe) => {
    bindIframeReveal(iframe);
    ensureIframePoster(iframe);
  });
}

export function prepareIframeReveal(iframe) {
  bindIframeReveal(iframe);
  ensureIframePoster(iframe);
  iframe.classList.remove('is-loaded');
  iframe.classList.add('is-loading');
  iframe.closest('.video-wrapper')?.classList.add('is-loading');
  iframe.closest('.video-wrapper')?.classList.remove('is-loaded');
}

function bindIframeReveal(iframe) {
  if (iframe.dataset.iframeRevealBound === 'true') {
    return;
  }

  iframe.dataset.iframeRevealBound = 'true';
  const wrapper = iframe.closest('.video-wrapper');

  if (iframe.hasAttribute('src')) {
    iframe.classList.add('is-loading');
    wrapper?.classList.add('is-loading');
  }

  iframe.addEventListener(
    'load',
    () => {
      iframe.classList.remove('is-loading');
      iframe.classList.add('is-loaded');
      wrapper?.classList.remove('is-loading');
      wrapper?.classList.add('is-loaded');
    },
    { once: true },
  );
}

function ensureIframePoster(iframe) {
  const wrapper = iframe.closest('.video-wrapper');
  if (!wrapper || wrapper.querySelector('.video-poster')) {
    return;
  }

  const posterUrl = getYoutubePosterUrl(iframe.dataset.src || iframe.getAttribute('src') || '');
  if (!posterUrl) {
    return;
  }

  const poster = document.createElement('div');
  poster.className = 'video-poster';
  poster.setAttribute('aria-hidden', 'true');
  poster.innerHTML = [
    `<img src="${posterUrl}" alt="" loading="lazy">`,
    '<span class="video-poster-overlay"></span>',
    '<span class="video-poster-loader" aria-hidden="true"></span>',
  ].join('');

  wrapper.prepend(poster);
}

function getYoutubePosterUrl(url) {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) {
    return '';
  }

  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function getYoutubeVideoId(url) {
  if (!url) {
    return '';
  }

  try {
    const parsed = new URL(url, window.location.origin);

    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace(/^\/+/, '').split('/')[0];
    }

    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.replace('/embed/', '').split('/')[0];
      }

      return parsed.searchParams.get('v') || '';
    }
  } catch {
    return '';
  }

  return '';
}
