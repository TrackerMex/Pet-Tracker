import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import * as envDrift from './env-drift.mjs';

const { parseEnvKeys } = envDrift;
const scriptPath = fileURLToPath(new URL('./env-drift.mjs', import.meta.url));

describe('R1 (init-env-drift-warning #23): parseEnvKeys aplica las reglas de parseo', () => {
  it('trata CRLF y LF igual', () => {
    assert.deepEqual(parseEnvKeys('A=1\r\nB=2\r\n'), parseEnvKeys('A=1\nB=2\n'));
  });

  it('ignora comentarios y lineas vacias', () => {
    assert.deepEqual(parseEnvKeys('# COMENTADA=1\n   # CON_ESPACIOS=1\n\n'), []);
  });

  it('acepta espacios alrededor de la clave', () => {
    assert.deepEqual(parseEnvKeys('KEY = valor\n KEY2=v'), ['KEY', 'KEY2']);
  });

  it('ignora lineas sin igual y export', () => {
    assert.deepEqual(parseEnvKeys('SIN_IGUAL\nexport KEY3=v'), []);
  });

  it('elimina el BOM inicial', () => {
    assert.deepEqual(parseEnvKeys('\uFEFFA=1'), ['A']);
  });

  it('elimina claves duplicadas', () => {
    assert.deepEqual(parseEnvKeys('A=1\nA=2'), ['A']);
  });
});

describe('R2 (init-env-drift-warning #23): missingKeys solo reporta example → env', () => {
  it('devuelve las claves faltantes en orden alfabetico', () => {
    assert.deepEqual(envDrift.missingKeys('C=1\nA=1\nB=1', 'B=2'), ['A', 'C']);
  });

  it('ignora la deriva inversa', () => {
    assert.deepEqual(envDrift.missingKeys('A=1', 'A=2\nSOLO_MIA=1'), []);
  });

  it('devuelve una lista vacia si el ejemplo esta vacio', () => {
    assert.deepEqual(envDrift.missingKeys('', 'A=1'), []);
  });
});

describe('R3 (init-env-drift-warning #23): formatDriftLines separa gates de configuración', () => {
  it('formatea el inventario actual en cuatro lineas literales', () => {
    const missing = [
      'ACTIVITY_AGGREGATOR_ENABLED',
      'ALERTS_ENGINE_ENABLED',
      'AWS_MODE',
      'EMAIL_ENABLED',
      'PUSH_ENABLED',
      'SIM_HOME_LAT',
      'SIM_HOME_LNG',
      'SIM_SEED',
    ];

    assert.deepEqual(envDrift.formatDriftLines(missing), [
      '.env desactualizado: faltan 8 claves de .env.example',
      '  gates ausentes (apagan features enteras en silencio): ACTIVITY_AGGREGATOR_ENABLED, ALERTS_ENGINE_ENABLED, EMAIL_ENABLED, PUSH_ENABLED',
      '  configuración ausente: AWS_MODE, SIM_HOME_LAT, SIM_HOME_LNG, SIM_SEED',
      '  init.sh no modifica .env — añade a mano las que necesites desde .env.example',
    ]);
  });

  it('omite configuracion cuando solo faltan gates', () => {
    assert.deepEqual(envDrift.formatDriftLines(['ALERTS_ENGINE_ENABLED']), [
      '.env desactualizado: falta 1 clave de .env.example',
      '  gates ausentes (apagan features enteras en silencio): ALERTS_ENGINE_ENABLED',
      '  init.sh no modifica .env — añade a mano las que necesites desde .env.example',
    ]);
  });

  it('omite gates cuando solo falta configuracion', () => {
    assert.deepEqual(envDrift.formatDriftLines(['AWS_MODE', 'SIM_SEED']), [
      '.env desactualizado: faltan 2 claves de .env.example',
      '  configuración ausente: AWS_MODE, SIM_SEED',
      '  init.sh no modifica .env — añade a mano las que necesites desde .env.example',
    ]);
  });

  it('usa singular para una sola clave', () => {
    assert.deepEqual(envDrift.formatDriftLines(['AWS_MODE']), [
      '.env desactualizado: falta 1 clave de .env.example',
      '  configuración ausente: AWS_MODE',
      '  init.sh no modifica .env — añade a mano las que necesites desde .env.example',
    ]);
  });
});

describe('R4 (init-env-drift-warning #23): sin deriva no hay salida', () => {
  it('no formatea lineas sin claves faltantes', () => {
    assert.deepEqual(envDrift.formatDriftLines([]), []);
  });

  it('escribe cero bytes y sale 0 con todas las claves presentes', () => {
    const fixtureDir = mkdtempSync(join(tmpdir(), 'env-drift-'));
    const envPath = join(fixtureDir, '.env');
    const examplePath = join(fixtureDir, '.env.example');
    writeFileSync(envPath, 'A=local\nB=local\nSOLO_MIA=1\n');
    writeFileSync(examplePath, 'A=example\nB=example\n');

    const stdout = execFileSync(process.execPath, [scriptPath, envPath, examplePath], {
      encoding: 'utf8',
    });

    assert.equal(stdout, '');
  });
});

describe('R5 (init-env-drift-warning #23): sin .env.example el script calla y sale 0', () => {
  it('calla si falta .env.example', () => {
    const fixtureDir = mkdtempSync(join(tmpdir(), 'env-drift-'));
    const envPath = join(fixtureDir, '.env');
    writeFileSync(envPath, 'A=1\n');

    const stdout = execFileSync(
      process.execPath,
      [scriptPath, envPath, join(fixtureDir, '.env.example')],
      { encoding: 'utf8' },
    );

    assert.equal(stdout, '');
  });

  it('calla si falta .env', () => {
    const fixtureDir = mkdtempSync(join(tmpdir(), 'env-drift-'));
    const examplePath = join(fixtureDir, '.env.example');
    writeFileSync(examplePath, 'A=1\n');

    const stdout = execFileSync(
      process.execPath,
      [scriptPath, join(fixtureDir, '.env'), examplePath],
      { encoding: 'utf8' },
    );

    assert.equal(stdout, '');
  });

  it('calla si faltan ambos archivos', () => {
    const fixtureDir = mkdtempSync(join(tmpdir(), 'env-drift-'));
    const stdout = execFileSync(
      process.execPath,
      [scriptPath, join(fixtureDir, '.env'), join(fixtureDir, '.env.example')],
      { encoding: 'utf8' },
    );

    assert.equal(stdout, '');
  });
});

describe('R6 (init-env-drift-warning #23): el script nunca escribe en disco', () => {
  it('conserva el contenido y mtime de .env cuando hay deriva', () => {
    const fixtureDir = mkdtempSync(join(tmpdir(), 'env-drift-'));
    const envPath = join(fixtureDir, '.env');
    const examplePath = join(fixtureDir, '.env.example');
    writeFileSync(envPath, 'A=local\n');
    writeFileSync(examplePath, 'A=example\nB=example\n');
    const contentBefore = readFileSync(envPath, 'utf8');
    const mtimeBefore = statSync(envPath).mtimeMs;

    execFileSync(process.execPath, [scriptPath, envPath, examplePath]);

    assert.equal(readFileSync(envPath, 'utf8'), contentBefore);
    assert.equal(statSync(envPath).mtimeMs, mtimeBefore);
  });

  it('solo importa readFileSync para acceder al filesystem', () => {
    const source = readFileSync(scriptPath, 'utf8');

    assert.match(source, /import \{ readFileSync \} from 'node:fs';/);
    assert.doesNotMatch(source, /write|append|copyFile|rmSync|unlink|mkdir/);
  });
});

describe('R7 (init-env-drift-warning #23): init.sh invoca el chequeo con warn()', () => {
  it('ubica el bloque portable en la seccion 2', () => {
    const source = readFileSync(new URL('./init.sh', import.meta.url), 'utf8');
    const requiredLoopIndex = source.indexOf('for var in "${REQUIRED_ENV_VARS[@]}"');
    const driftBlockIndex = source.indexOf('# Deriva de claves entre .env y .env.example (#23)');
    const dependenciesIndex = source.indexOf('# ── 3. DEPENDENCIAS');

    assert.match(source, /node env-drift\.mjs \|\| true/);
    assert.match(source, /warn "\$drift_line"/);
    assert.ok(driftBlockIndex > requiredLoopIndex);
    assert.ok(driftBlockIndex < dependenciesIndex);

    const fragment = source.slice(driftBlockIndex, dependenciesIndex);
    assert.doesNotMatch(fragment, /\b(?:comm|sort|awk|sed|jq)\s/);
  });
});

describe('R8 (init-env-drift-warning #23): el aviso no aborta', () => {
  it('no llama fail ni exit', () => {
    const source = readFileSync(new URL('./init.sh', import.meta.url), 'utf8');
    const driftBlockIndex = source.indexOf('# Deriva de claves entre .env y .env.example (#23)');
    const dependenciesIndex = source.indexOf('# ── 3. DEPENDENCIAS');

    assert.notEqual(driftBlockIndex, -1);
    assert.doesNotMatch(source.slice(driftBlockIndex, dependenciesIndex), /\b(?:fail|exit)\b/);
  });

  it('sobrevive a set -e', () => {
    const stdout = execFileSync(
      'bash',
      [
        '-c',
        `set -e; OUT="$(node "${scriptPath}" /no/existe /tampoco || true)"; echo "rc=$?"`,
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );

    assert.match(stdout, /rc=0/);
  });
});

describe('R9 (init-env-drift-warning #23): sin deriva la seccion 2 no cambia', () => {
  it('solo imprime dentro de la guarda de salida no vacia', () => {
    const source = readFileSync(new URL('./init.sh', import.meta.url), 'utf8');
    const driftBlockIndex = source.indexOf('# Deriva de claves entre .env y .env.example (#23)');
    const dependenciesIndex = source.indexOf('# ── 3. DEPENDENCIAS');

    assert.notEqual(driftBlockIndex, -1);
    const fragment = source.slice(driftBlockIndex, dependenciesIndex);
    assert.match(fragment, /if \[ -n "\$ENV_DRIFT" \]; then/);
    assert.doesNotMatch(fragment, /\b(?:ok|echo)\b/);
  });
});

describe('R10 (init-env-drift-warning #23): init.config.sh mantiene REQUIRED_ENV_VARS y ejecuta la suite', () => {
  it('incluye la suite nueva sin reemplazar el chequeo existente', () => {
    const configSource = readFileSync(new URL('./init.config.sh', import.meta.url), 'utf8');
    const initSource = readFileSync(new URL('./init.sh', import.meta.url), 'utf8');

    assert.match(configSource, /node --test env-drift\.test\.mjs/);
    assert.match(configSource, /REQUIRED_ENV_VARS=\("DATABASE_URL"\)/);
    assert.ok(initSource.includes('check_env() {'));
    assert.ok(initSource.includes('grep -q "^${var}=" .env'));
    assert.ok(initSource.includes('cp .env.example .env'));
  });
});

describe('R11 (init-env-drift-warning #23): documentacion y cero variables nuevas', () => {
  it('documenta la verificacion manual', () => {
    const source = readFileSync(new URL('./docs/verification.md', import.meta.url), 'utf8');

    assert.match(source, /### Feature 23 — init-env-drift-warning/);
  });

  it('añade env-drift.mjs al mapa del repositorio', () => {
    const source = readFileSync(new URL('./AGENTS.md', import.meta.url), 'utf8');

    assert.match(source, /env-drift\.mjs/);
  });

  it('no añade variables de entorno', () => {
    const exampleText = readFileSync(new URL('./.env.example', import.meta.url), 'utf8');
    const keys = parseEnvKeys(exampleText);

    assert.equal(keys.length, 24);
    assert.equal(keys.some((key) => key.startsWith('DRIFT') || key.startsWith('ENV_DRIFT')), false);
  });
});
