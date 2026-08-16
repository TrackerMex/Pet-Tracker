import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as envDrift from './env-drift.mjs';

const { parseEnvKeys } = envDrift;

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
