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

export function formatDriftLines(missing) {
  const gates = missing.filter((key) => key.endsWith('_ENABLED'));
  const config = missing.filter((key) => !key.endsWith('_ENABLED'));
  const lines = [
    missing.length === 1
      ? '.env desactualizado: falta 1 clave de .env.example'
      : `.env desactualizado: faltan ${missing.length} claves de .env.example`,
  ];

  if (gates.length) {
    lines.push(`  gates ausentes (apagan features enteras en silencio): ${gates.join(', ')}`);
  }
  if (config.length) {
    lines.push(`  configuración ausente: ${config.join(', ')}`);
  }
  lines.push('  init.sh no modifica .env — añade a mano las que necesites desde .env.example');

  return lines;
}
