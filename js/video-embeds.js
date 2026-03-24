import { getMotionDurationMs } from './motion-tokens.js';

const DEFAULT_IFRAME_HANDOFF_DELAY_MS = 220;

export function initializeIframeReveals(root) {
  root.querySelectorAll('iframe').forEach((iframe) => {
    bindIframeReveal(iframe);
    ensureIframePoster(iframe);
  });
}

export function prepareIframeReveal(iframe) {
  bindIframeReveal(iframe);
  ensureIframePoster(iframe);
  clearIframeRevealTimeout(iframe);
  iframe.classList.remove('is-loaded');
  iframe.classList.add('is-loading');
  iframe.closest('.video-wrapper')?.classList.add('is-loading');
  iframe.closest('.video-wrapper')?.classList.remove('is-loaded', 'is-ready');
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
      clearIframeRevealTimeout(iframe);
      iframe.classList.remove('is-loading');
      iframe.classList.add('is-loaded');
      wrapper?.classList.remove('is-loading');
      iframe.dataset.posterRevealTimeout = String(
        window.setTimeout(() => {
          wrapper?.classList.add('is-ready', 'is-loaded');
          delete iframe.dataset.posterRevealTimeout;
        }, getMotionDurationMs('--motion-iframe-handoff-delay', DEFAULT_IFRAME_HANDOFF_DELAY_MS)),
      );
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

  const image = document.createElement('img');
  image.src = posterUrl;
  image.alt = '';
  image.loading = 'lazy';

  const overlay = document.createElement('span');
  overlay.className = 'video-poster-overlay';

  const loader = document.createElement('span');
  loader.className = 'video-poster-loader';
  loader.setAttribute('aria-hidden', 'true');

  poster.append(image, overlay, loader);
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

function clearIframeRevealTimeout(iframe) {
  const timeoutId = Number(iframe.dataset.posterRevealTimeout || '0');
  if (!timeoutId) {
    return;
  }

  window.clearTimeout(timeoutId);
  delete iframe.dataset.posterRevealTimeout;
}
