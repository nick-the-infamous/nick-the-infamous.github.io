const DEFAULT_DURATION_FALLBACK_MS = 0;

export function getMotionDurationMs(propertyName, fallbackMs = DEFAULT_DURATION_FALLBACK_MS) {
  return parseCssTimeToMs(getMotionToken(propertyName), fallbackMs);
}

export function getMotionString(propertyName, fallbackValue = '') {
  const value = getMotionToken(propertyName);
  return value || fallbackValue;
}

function getMotionToken(propertyName) {
  if (typeof window === 'undefined') {
    return '';
  }

  return getComputedStyle(document.documentElement).getPropertyValue(propertyName).trim();
}

function parseCssTimeToMs(value, fallbackMs) {
  if (!value) {
    return fallbackMs;
  }

  if (value.endsWith('ms')) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallbackMs;
  }

  if (value.endsWith('s')) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed * 1000 : fallbackMs;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallbackMs;
}
