import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
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
