import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const professionsDir = path.join(repoRoot, 'professions');
const allowedItemKeys = new Set([
  'title',
  'videoUrl',
  'build',
  'rotation',
  'explanation',
  'cleaned_transcript',
  'contentHtml',
]);

let hasErrors = false;

const entries = (await readdir(professionsDir)).filter((entry) => entry.endsWith('.json')).sort();
for (const entry of entries) {
  await validateProfessionFile(path.join(professionsDir, entry));
}

if (hasErrors) {
  process.exitCode = 1;
} else {
  console.log(`Validated ${entries.length} profession files successfully.`);
}

async function validateProfessionFile(filePath) {
  const raw = await readFile(filePath, 'utf8');
  const relativePath = path.relative(repoRoot, filePath);
  const fileName = path.basename(filePath, '.json');

  let data;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    reportError(relativePath, `Invalid JSON: ${error.message}`);
    return;
  }

  if (!isPlainObject(data)) {
    reportError(relativePath, 'Root value must be an object.');
    return;
  }

  requireNonEmptyString(data.id, relativePath, 'id');
  requireNonEmptyString(data.title, relativePath, 'title');

  if (typeof data.id === 'string' && data.id !== fileName) {
    reportError(relativePath, `Root id "${data.id}" must match filename "${fileName}".`);
  }

  if (!Array.isArray(data.items)) {
    reportError(relativePath, 'items must be an array.');
    return;
  }

  const seenTitles = new Set();
  data.items.forEach((item, index) => validateItem(item, relativePath, index, seenTitles));
}

function validateItem(item, relativePath, index, seenTitles) {
  const label = `items[${index}]`;

  if (!isPlainObject(item)) {
    reportError(relativePath, `${label} must be an object.`);
    return;
  }

  Object.keys(item).forEach((key) => {
    if (!allowedItemKeys.has(key)) {
      reportError(relativePath, `${label} has unexpected key "${key}".`);
    }
  });

  requireNonEmptyString(item.title, relativePath, `${label}.title`);

  if (typeof item.title === 'string') {
    if (seenTitles.has(item.title)) {
      reportError(relativePath, `${label}.title "${item.title}" is duplicated within the file.`);
    }

    seenTitles.add(item.title);
  }

  if (item.contentHtml) {
    requireString(item.contentHtml, relativePath, `${label}.contentHtml`);
  } else {
    requireNonEmptyString(item.videoUrl, relativePath, `${label}.videoUrl`);

    if ('build' in item) {
      requireString(item.build, relativePath, `${label}.build`);
    }

    if ('rotation' in item) {
      requireString(item.rotation, relativePath, `${label}.rotation`);
    }

    if ('explanation' in item) {
      requireString(item.explanation, relativePath, `${label}.explanation`);
    }
  }

  if (item.videoUrl && !isValidUrl(item.videoUrl)) {
    reportError(relativePath, `${label}.videoUrl must be a valid URL.`);
  }

  if (item.build && !isValidUrl(item.build)) {
    reportError(relativePath, `${label}.build must be a valid URL.`);
  }

  if ('cleaned_transcript' in item) {
    requireString(item.cleaned_transcript, relativePath, `${label}.cleaned_transcript`);
  }
}

function requireNonEmptyString(value, relativePath, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    reportError(relativePath, `${fieldName} must be a non-empty string.`);
  }
}

function requireString(value, relativePath, fieldName) {
  if (typeof value !== 'string') {
    reportError(relativePath, `${fieldName} must be a string.`);
  }
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function reportError(relativePath, message) {
  hasErrors = true;
  console.error(`${relativePath}: ${message}`);
}
