import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const initShPath = fileURLToPath(new URL('./init.sh', import.meta.url));
const initSh = readFileSync(initShPath, 'utf8');

// El entorno que rompia init.sh: Claude Code exporta FORCE_COLOR=3, y con el
// Node colorea los valores no-string de console.log. Los tests de abajo lo
// fuerzan para no depender de si quien los corre lo tiene puesto.
const brokenEnv = { ...process.env, FORCE_COLOR: '3' };

function bash(script) {
  return execFileSync('bash', ['-c', script], { env: brokenEnv }).toString();
}

const helper = initSh
  .split('\n')
  .find((line) => line.startsWith('nodeq()'));

describe('R1 (harness-init-force-color #75): las consultas de init.sh no heredan color', () => {
  it('init.sh define el wrapper nodeq', () => {
    assert.ok(helper, 'init.sh debe definir nodeq() para las consultas a node');
  });

  it('nodeq imprime un numero sin secuencias ANSI', () => {
    const out = bash(`${helper}; nodeq -e 'console.log([].length)'`);
    assert.equal(out.trim(), '0');
  });

  it('sin el wrapper el mismo comando sale coloreado (el defecto que #75 arregla)', () => {
    const out = bash(`node -e 'console.log([].length)'`);
    assert.match(
      out,
      /\[/,
      'si esto deja de colorear, el entorno cambio y el test ya no discrimina',
    );
    assert.notEqual(out.trim(), '0');
  });

  it('una cadena coloreada no sobrevive a la comparacion de bash', () => {
    // Es exactamente lo que hacia init.sh:137 antes del arreglo.
    const out = bash(
      `V=$(node -e 'console.log([].length)'); if [ "$V" = "0" ]; then echo igual; else echo distinto; fi`,
    );
    assert.equal(out.trim(), 'distinto');
  });
});

describe('R2 (harness-init-force-color #75): ninguna captura de node se queda fuera del wrapper', () => {
  it('init.sh no invoca node directamente en una sustitucion de comando', () => {
    const sinComentarios = initSh
      .split('\n')
      .filter((line) => !line.trimStart().startsWith('#'))
      .join('\n');

    const directas = [...sinComentarios.matchAll(/<?\(\s*node\s/g)];
    assert.deepEqual(
      directas.map((m) => m[0]),
      [],
      'usa nodeq en vez de node: su salida se compara como cadena y el color la rompe',
    );
  });
});
