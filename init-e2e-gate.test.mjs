import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const workflow = readFileSync(new URL('./.github/workflows/ci.yml', import.meta.url), 'utf8');

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
