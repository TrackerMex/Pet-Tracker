export function parseEnvKeys(text) {
  const keys = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=/)?.[1])
    .filter(Boolean);

  return [...new Set(keys)];
}

export function missingKeys(exampleText, envText) {
  const envKeys = new Set(parseEnvKeys(envText));

  return parseEnvKeys(exampleText)
    .filter((key) => !envKeys.has(key))
    .sort();
}
