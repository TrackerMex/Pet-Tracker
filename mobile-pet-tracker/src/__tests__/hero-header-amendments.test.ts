declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');

const REPOSITORY_ROOT = join(process.cwd(), '..');

const SIGNATURE_LINE = '- [ ] Enmienda aprobada por humano';

/**
 * Los cinco documentos que la tabla A1–A9 de [[requirements]] §R10 enmienda,
 * con el marcador de la edición en prosa que cada uno debe llevar además del
 * bloque de firma.
 */
const AMENDED_DOCS: {
  file: string;
  feature: string;
  change: string;
  marker: string;
}[] = [
  {
    file: 'specs/mobile-figma-polish/design.md',
    feature: 'mobile-figma-polish',
    change: 'enmiendas A1, A3, A4 y A6 de la tabla de #67 §R10',
    marker: '### 5. Sin gradientes ni headers hero — restricción de alcance (§5 enmendada por #67)',
  },
  {
    file: 'specs/mobile-figma-polish/requirements.md',
    feature: 'mobile-figma-polish',
    change: 'enmiendas A2 y A5 de la tabla de #67 §R10',
    marker: '**Resuelto por #67 (A2)**',
  },
  {
    file: 'specs/mobile-pets-profile/requirements.md',
    feature: 'mobile-pets-profile',
    change: 'enmienda A7 de la tabla de #67 §R10',
    marker: '**Enmendado por #67 (A7)**',
  },
  {
    file: 'docs/ui-guidelines.md',
    feature: 'docs/ui-guidelines.md',
    change: 'enmiendas A8 y A9 de la tabla de #67 §R10',
    marker: '**Enmendado por #67 (A8) — corrección de un hecho falso.**',
  },
  {
    file: 'docs/conventions.md',
    feature: 'docs/conventions.md',
    change: 'enmienda A9 de la tabla de #67 §R10',
    marker: '**Excepción nombrada (enmienda A9 de #67, 2026-09-07)**',
  },
];

/**
 * El literal vive en `specs/mobile-pet-hero-header/design.md` §9 y se lee de
 * ahí, no de una copia: la spec sigue siendo la única fuente. Misma técnica que
 * `ui-language.test.ts`.
 */
function canonicalAmendment(feature: string, change: string): string {
  const design = readFileSync(
    join(REPOSITORY_ROOT, 'specs', 'mobile-pet-hero-header', 'design.md'),
    'utf8',
  );
  const fence = '```markdown\n## Enmienda #67 — cabecera fotográfica compartida';
  const start = design.indexOf(fence);

  expect(start).toBeGreaterThan(-1);

  const body = design.slice(start + '```markdown\n'.length);
  const block = body
    .slice(0, body.indexOf('\n```'))
    .replace('<FEATURE>', feature)
    .replace('<QUÉ CAMBIA>', change);

  // La línea de firma la marca el humano, así que no forma parte del bloque
  // que entrega el agente: se comprueba aparte, marcada o no.
  return block.slice(0, block.indexOf(SIGNATURE_LINE)).trimEnd();
}

describe('R10: las specs enmendadas por #67 llevan su bloque', () => {
  it('inserta el bloque literal de design.md §9 en los cinco documentos', () => {
    expect(AMENDED_DOCS).toHaveLength(5);

    for (const { file, feature, change } of AMENDED_DOCS) {
      const source = readFileSync(join(REPOSITORY_ROOT, file), 'utf8');

      expect({
        file,
        hasAmendment: source.includes(canonicalAmendment(feature, change)),
      }).toEqual({ file, hasAmendment: true });
    }
  });

  it('deja en cada documento su línea de firma, marcada o no', () => {
    for (const { file } of AMENDED_DOCS) {
      const source = readFileSync(join(REPOSITORY_ROOT, file), 'utf8');
      const signed = source.includes('- [X] Enmienda aprobada por humano');

      expect({
        file,
        hasSignatureLine: source.includes(SIGNATURE_LINE) || signed,
      }).toEqual({ file, hasSignatureLine: true });
    }
  });

  it('aplica además la edición en prosa que la tabla A1–A9 prescribe', () => {
    for (const { file, marker } of AMENDED_DOCS) {
      // El markdown reparte la prosa en varias líneas: se compara con los
      // espacios colapsados, no byte a byte.
      const flowed = readFileSync(join(REPOSITORY_ROOT, file), 'utf8').replace(
        /\s+/g,
        ' ',
      );

      expect({
        file,
        hasMarker: flowed.includes(marker.replace(/\s+/g, ' ')),
      }).toEqual({ file, hasMarker: true });
    }
  });
});
