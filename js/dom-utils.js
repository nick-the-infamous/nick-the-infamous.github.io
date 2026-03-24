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

export function formatTextBlock(value) {
  return escapeHtml(value).replaceAll(/\r?\n/g, '<br>');
}

export function indentHtml(html, spaces) {
  const indent = ' '.repeat(spaces);
  return html
    .split('\n')
    .map((line) => `${indent}${line}`)
    .join('\n');
}
