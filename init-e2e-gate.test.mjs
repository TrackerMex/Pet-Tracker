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

function corre(env) {
  const fixtureDir = mkdtempSync(join(tmpdir(), 'init-e2e-gate-'));
  writeFileSync(join(fixtureDir, '.env'), env);
  const script = [
    'set -e',
    'ok(){ echo "OK:$1"; }',
    'warn(){ echo "WARN:$1"; }',
    'fail(){ echo "FAIL:$1"; exit 1; }',
    'port_open(){ echo "PROBE:$1:$2"; return 0; }',
    'E2E_PORT_SOURCES=("DATABASE_URL" "AWS_ENDPOINT_URL")',
    'E2E_CMD=\'echo E2E\'',
    `cd ${JSON.stringify(fixtureDir)}`,
    e2eBlock(),
  ].join('\n');

  return execFileSync('bash', ['-c', script], { encoding: 'utf8' });
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
  it('usa LocalStack sin credenciales ni configuracion de AWS real', () => {
    assert.match(workflow, /^\s+AWS_MODE:\s*local\s*$/m);
    assert.doesNotMatch(workflow, /AWS_MODE:\s*aws\b/);
    assert.doesNotMatch(workflow, /configure-aws-credentials/);
    assert.doesNotMatch(workflow, /secrets\.AWS_(?:ACCESS_KEY_ID|SECRET_ACCESS_KEY)/);
  });
});

describe('R3 (harness-e2e-nunca-corre-en-ci #96): los puertos se derivan del .env', () => {
  it('sondea el host y puerto de cada URL, incluso con @ en la contrasena', () => {
    const local = corre(
      'DATABASE_URL=postgresql://pet_tracker:pet_tracker@localhost:5433/pet_tracker_wt\n' +
        'AWS_ENDPOINT_URL=http://localhost:4566\n',
    );
    const ci = corre(
      'DATABASE_URL=postgresql://pet_tracker:pet_tracker@localhost:5432/pet_tracker\n' +
        'AWS_ENDPOINT_URL=http://localhost:4566\n',
    );
    const atInPassword = corre(
      'DATABASE_URL=postgresql://u:p@ss@localhost:5433/db\n' +
        'AWS_ENDPOINT_URL=http://localhost:4566\n',
    );

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
