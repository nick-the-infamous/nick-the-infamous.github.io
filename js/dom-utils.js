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

export function formatLinkedTextBlock(value) {
  const text = String(value);
  const urlPattern = /https?:\/\/[^\s<>"']+/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = urlPattern.exec(text)) !== null) {
    const rawUrl = match[0];
    const { url, trailingText } = splitTrailingPunctuation(rawUrl);

    parts.push(escapeHtml(text.slice(lastIndex, match.index)));
    parts.push(
      `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">link</a>${escapeHtml(trailingText)}`,
    );

    lastIndex = match.index + rawUrl.length;
  }

  parts.push(escapeHtml(text.slice(lastIndex)));
  return parts.join('').replaceAll(/\r?\n/g, '<br>');
}

function splitTrailingPunctuation(value) {
  const match = value.match(/[),.;!?]+$/);

  if (!match) {
    return { url: value, trailingText: '' };
  }

  return {
    url: value.slice(0, -match[0].length),
    trailingText: match[0],
  };
}

export function indentHtml(html, spaces) {
  const indent = ' '.repeat(spaces);
  return html
    .split('\n')
    .map((line) => `${indent}${line}`)
    .join('\n');
}
