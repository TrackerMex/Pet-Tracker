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
