import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseEnvKeys } from './env-drift.mjs';

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
