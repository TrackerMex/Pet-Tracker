import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const initSh = readFileSync(new URL('./init.sh', import.meta.url), 'utf8');
const initConfig = readFileSync(new URL('./init.config.sh', import.meta.url), 'utf8');
const workflow = readFileSync(new URL('./.github/workflows/ci.yml', import.meta.url), 'utf8');
const START = '# >>> bloque e2e (#96) >>>';
const END = '# <<< bloque e2e (#96) <<<';

function e2eBlock() {
  const a = initSh.indexOf(START);
  const b = initSh.indexOf(END);
  assert.ok(a !== -1 && b > a, 'init.sh debe delimitar el bloque e2e con los marcadores de #96');
  return initSh.slice(a, b);
}

function corre({ env, portOpen = true, setup = 'echo SETUP' }) {
  const fixtureDir = mkdtempSync(join(tmpdir(), 'init-e2e-gate-'));
  writeFileSync(join(fixtureDir, '.env'), env);
  const script = [
    'set -e',
    'ok(){ echo "OK:$1"; }',
    'warn(){ echo "WARN:$1"; }',
    'fail(){ echo "FAIL:$1"; exit 1; }',
    `port_open(){ echo "PROBE:$1:$2"; return ${portOpen ? 0 : 1}; }`,
    'E2E_PORT_SOURCES=("DATABASE_URL" "AWS_ENDPOINT_URL")',
    `E2E_SETUP_CMD=${JSON.stringify(setup)}`,
    'E2E_CMD=\'echo E2E\'',
    `cd ${JSON.stringify(fixtureDir)}`,
    e2eBlock(),
    'echo FIN',
  ].join('\n');

  try {
    return {
      status: 0,
      stdout: execFileSync('bash', ['-c', script], { encoding: 'utf8' }),
    };
  } catch (error) {
    return { status: error.status, stdout: `${error.stdout ?? ''}${error.stderr ?? ''}` };
  }
}

describe('R1 (harness-e2e-nunca-corre-en-ci #96): CI levanta la infra antes de init.sh', () => {
  it('arranca el compose versionado antes del gate sin duplicar imagenes', () => {
    const infraIndex = workflow.indexOf('docker compose up -d --wait');
    const initIndex = workflow.indexOf('bash ./init.sh');

    assert.notEqual(infraIndex, -1);
    assert.ok(infraIndex < initIndex);
    assert.doesNotMatch(workflow, /localstack\/localstack|postgres:17/);
  });
});

describe('R2 (harness-e2e-nunca-corre-en-ci #96): el workflow fija AWS_MODE local y nunca toca AWS real', () => {
  it('declara una sola vez AWS_MODE local y nunca lo reasigna desde run', () => {
    const awsModeLines = workflow.match(/^\s*AWS_MODE\s*:[^\n]*$/gm) ?? [];

    assert.equal(awsModeLines.length, 1);
    assert.match(awsModeLines[0], /^\s*AWS_MODE\s*:\s*(["']?)local\1\s*$/);
    assert.doesNotMatch(workflow, /^\s*(?:-\s*)?run\s*:[^\n]*\bAWS_MODE\s*=/m);
    assert.doesNotMatch(workflow, /configure-aws-credentials/);
    assert.doesNotMatch(workflow, /secrets\.AWS_(?:ACCESS_KEY_ID|SECRET_ACCESS_KEY)/);
  });
});

describe('R3 (harness-e2e-nunca-corre-en-ci #96): los puertos se derivan del .env', () => {
  it('sondea el host y puerto de cada URL, incluso con @ en la contrasena', () => {
    const local = corre({
      env:
        'DATABASE_URL=postgresql://pet_tracker:pet_tracker@localhost:5433/pet_tracker_wt\n' +
        'AWS_ENDPOINT_URL=http://localhost:4566\n',
    }).stdout;
    const ci = corre({
      env:
        'DATABASE_URL=postgresql://pet_tracker:pet_tracker@localhost:5432/pet_tracker\n' +
        'AWS_ENDPOINT_URL=http://localhost:4566\n',
    }).stdout;
    const atInPassword = corre({
      env:
        'DATABASE_URL=postgresql://u:p@ss@localhost:5433/db\n' +
        'AWS_ENDPOINT_URL=http://localhost:4566\n',
    }).stdout;

    assert.match(local, /PROBE:localhost:5433/);
    assert.match(local, /PROBE:localhost:4566/);
    assert.match(ci, /PROBE:localhost:5432/);
    assert.match(ci, /PROBE:localhost:4566/);
    assert.match(atInPassword, /PROBE:localhost:5433/);
  });

  it('no conserva puertos ni la lista antigua en init.config.sh', () => {
    assert.doesNotMatch(initConfig, /E2E_REQUIRED_PORTS|5432|5433|4566/);
  });
});

describe('R4 (harness-e2e-nunca-corre-en-ci #96): la infra caida aborta init.sh con codigo 1', () => {
  it('sale 1 sin setup, e2e ni fin cuando un puerto no responde', () => {
    const result = corre({
      env:
        'DATABASE_URL=postgresql://pet_tracker:pet_tracker@localhost:5433/pet_tracker\n' +
        'AWS_ENDPOINT_URL=http://localhost:4566\n',
      portOpen: false,
    });

    assert.equal(result.status, 1);
    assert.doesNotMatch(result.stdout, /\b(?:SETUP|E2E|FIN)\b/);
  });

  it('sale 1 sin ejecutar nada cuando falta DATABASE_URL', () => {
    const result = corre({ env: 'AWS_ENDPOINT_URL=http://localhost:4566\n' });

    assert.equal(result.status, 1);
    assert.doesNotMatch(result.stdout, /\b(?:SETUP|E2E|FIN)\b/);
  });

  it('usa fail en la guarda y no crea una rama especial para CI', () => {
    const block = e2eBlock();
    const probeIndex = block.indexOf('port_open');
    const guard = block.slice(probeIndex, block.indexOf('done', probeIndex));

    assert.match(guard, /\|\|\s*fail/);
    assert.doesNotMatch(guard, /\bwarn\b/);
    assert.doesNotMatch(block, /if\s+\[\s+-n\s+["']?\$CI/);
  });
});

describe('R5 (harness-e2e-nunca-corre-en-ci #96): el fallo nombra host, puerto y clave de origen', () => {
  it('explica que destino fallo y de que clave se derivo', () => {
    const result = corre({
      env:
        'DATABASE_URL=postgresql://pet_tracker:pet_tracker@localhost:5433/pet_tracker\n' +
        'AWS_ENDPOINT_URL=http://localhost:4566\n',
      portOpen: false,
    });
    const failLine = result.stdout.split('\n').find((line) => line.startsWith('FAIL:')) ?? '';

    assert.match(failLine, /localhost:5433.*DATABASE_URL/);
  });
});

describe('R6 (harness-e2e-nunca-corre-en-ci #96): migraciones y provisioning antes de los e2e', () => {
  it('ejecuta setup antes de la suite', () => {
    const result = corre({
      env:
        'DATABASE_URL=postgresql://pet_tracker:pet_tracker@localhost:5433/pet_tracker\n' +
        'AWS_ENDPOINT_URL=http://localhost:4566\n',
    });

    assert.ok(result.stdout.indexOf('SETUP') !== -1);
    assert.ok(result.stdout.indexOf('SETUP') < result.stdout.indexOf('E2E'));
  });

  it('no ejecuta la suite si setup falla', () => {
    const result = corre({
      env:
        'DATABASE_URL=postgresql://pet_tracker:pet_tracker@localhost:5433/pet_tracker\n' +
        'AWS_ENDPOINT_URL=http://localhost:4566\n',
      setup: 'echo SETUP; exit 7',
    });

    assert.notEqual(result.status, 0);
    assert.doesNotMatch(result.stdout, /\bE2E\b/);
  });

  it('configura migraciones y provisioning sin psql', () => {
    const setupLine = initConfig
      .split('\n')
      .find((line) => line.startsWith('E2E_SETUP_CMD=')) ?? '';

    assert.match(setupLine, /db:migrate/);
    assert.match(setupLine, /provision:local/);
    assert.doesNotMatch(initConfig, /\bpsql\b/);
  });
});

describe('R8 (harness-e2e-nunca-corre-en-ci #96): ningun comentario describe ya el agujero', () => {
  it('documenta el gate vigente en init.sh y en CI', () => {
    assert.doesNotMatch(initSh, /pasa de largo sin verificar nada/);
    assert.doesNotMatch(workflow, /anadir services aqui|añadir services aquí/i);
    assert.match(e2eBlock(), /^# .*docker compose up -d/m);
  });
});

describe('R9 (harness-e2e-nunca-corre-en-ci #96): docs/verification.md documenta el gate', () => {
  it('incluye la verificacion manual de la feature', () => {
    const verification = readFileSync(new URL('./docs/verification.md', import.meta.url), 'utf8');

    assert.ok(
      verification.includes('### Feature 96 — harness-e2e-nunca-corre-en-ci'),
      'docs/verification.md debe incluir la seccion de la feature 96',
    );
  });
});

describe('R7 (harness-e2e-nunca-corre-en-ci #96): la suite entra en TEST_CMD y en el mapa del repo', () => {
  it('cablea la suite sin reemplazar los candados existentes', () => {
    assert.ok(initConfig.includes('node --test init-e2e-gate.test.mjs'));
    assert.ok(initConfig.includes('node --test env-drift.test.mjs'));
    assert.ok(initConfig.includes('node --test init-color.test.mjs'));
  });

  it('lista el candado en AGENTS.md', () => {
    const agents = readFileSync(new URL('./AGENTS.md', import.meta.url), 'utf8');

    assert.ok(agents.includes('init-e2e-gate.test.mjs'));
  });
});
