import * as ts from 'typescript';

import { en, es, type TranslationKey } from '../i18n/catalog';
import {
  ALL_USES,
  R1_AUTH,
  R2_TABS,
  R3_HOME,
  R4_MAP,
  R5_HEALTH,
  R6_FOOD,
  R7_PROFILE,
  R8_REMINDERS,
  R9_ADD_PET,
  R10_PAIRING,
  R11_RESET,
  type UseRow,
} from './ui-copy-table';

declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');

const SOURCE_ROOT = process.cwd();

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function checkUses(uses: UseRow[]) {
  const expectedCounts = new Map<string, number>();

  for (const { file, key } of uses) {
    const id = `${file}\0${key}`;
    expectedCounts.set(id, (expectedCounts.get(id) ?? 0) + 1);
  }

  for (const [id, expected] of expectedCounts) {
    const [file, key] = id.split('\0');
    const source = readFileSync(join(SOURCE_ROOT, file), 'utf8');
    const directCalls = source.match(
      new RegExp(`\\bt\\(\\s*['"]${escapeRegExp(key)}['"]`, 'g'),
    );
    const keyedConstants = source.match(
      new RegExp(`\\blabelKey:\\s*['"]${escapeRegExp(key)}['"]`, 'g'),
    );
    const resolvedUses =
      (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);

    expect({ file, key, uses: resolvedUses }).toEqual({
      file,
      key,
      uses: expected,
    });
  }
}

describe('#65 R1: el grupo (auth) resuelve su copy por clave', () => {
  it('resuelve las 29 ocurrencias normativas', () => {
    expect(R1_AUTH).toHaveLength(29);
    checkUses(R1_AUTH);
  });
});

describe('#65 R2: la barra de pestañas resuelve su copy por clave', () => {
  it('resuelve las 5 ocurrencias normativas', () => {
    expect(R2_TABS).toHaveLength(5);
    checkUses(R2_TABS);
  });
});

describe('#65 R3: Home resuelve su copy por clave', () => {
  // 20 en `303fc19` + 1 de `home.walks` (#67 R7b, delta declarado en su R9b).
  // #68 añade el delta medido de weekly-activity-chart, sin recontar la base.
  it('resuelve las ocurrencias normativas y el delta de actividad semanal', () => {
    expect(R3_HOME).toHaveLength(21 + 15);
    checkUses(R3_HOME);
  });
});

describe('#65 R4: Map resuelve su copy por clave', () => {
  it('resuelve las 20 ocurrencias normativas', () => {
    expect(R4_MAP).toHaveLength(20);
    checkUses(R4_MAP);
  });
});

describe('#65 R5: Health resuelve su copy por clave', () => {
  it('resuelve las 32 ocurrencias normativas', () => {
    expect(R5_HEALTH).toHaveLength(32);
    checkUses(R5_HEALTH);
  });
});

describe('#65 R6: Food resuelve su copy por clave', () => {
  it('resuelve las 35 ocurrencias normativas', () => {
    expect(R6_FOOD).toHaveLength(35);
    checkUses(R6_FOOD);
  });
});

describe('#65 R7: Profile resuelve su copy por clave', () => {
  it('resuelve las 35 ocurrencias normativas', () => {
    expect(R7_PROFILE).toHaveLength(35);
    checkUses(R7_PROFILE);
  });
});

describe('#65 R8: Recordatorios resuelve su copy por clave', () => {
  it('resuelve las 50 ocurrencias normativas', () => {
    expect(R8_REMINDERS).toHaveLength(50);
    checkUses(R8_REMINDERS);
  });
});

describe('#65 R9: el alta de mascota resuelve su copy por clave', () => {
  it('resuelve las 42 ocurrencias normativas', () => {
    expect(R9_ADD_PET).toHaveLength(42);
    checkUses(R9_ADD_PET);
  });
});

describe('#65 R10: el emparejado del collar resuelve su copy por clave', () => {
  it('resuelve las ocurrencias normativas y el delta de conectividad', () => {
    expect(R10_PAIRING).toHaveLength(42 + 2);
    checkUses(R10_PAIRING);
  });
});

describe('#65 R11: restablecer contraseña resuelve su copy por clave', () => {
  it('resuelve las 15 ocurrencias normativas', () => {
    expect(R11_RESET).toHaveLength(15);
    checkUses(R11_RESET);
  });
});

const REPOSITORY_ROOT = join(SOURCE_ROOT, '..');

const SIGNATURE_LINE = '- [ ] Enmienda aprobada por humano';

// Las 9 specs que ratificaron el inglés, con el marcador de la edición (a) de
// design.md §6.2 que cada una debe llevar en su línea de ratificación.
const AMENDED_SPECS: { file: string; feature: string; marker: string }[] = [
  { file: 'specs/mobile-auth/requirements.md', feature: 'mobile-auth', marker: '(ver §Enmienda #65)' },
  { file: 'specs/mobile-home-dashboard/requirements.md', feature: 'mobile-home-dashboard', marker: '(ver §Enmienda #65)' },
  { file: 'specs/mobile-map-live/requirements.md', feature: 'mobile-map-live', marker: '(ver §Enmienda #65)' },
  { file: 'specs/mobile-health/requirements.md', feature: 'mobile-health', marker: '(ver §Enmienda #65)' },
  { file: 'specs/mobile-food/design.md', feature: 'mobile-food', marker: '(ver §Enmienda #65)' },
  { file: 'specs/mobile-food/requirements.md', feature: 'mobile-food', marker: '(ver §Enmienda #65)' },
  { file: 'specs/mobile-reminders/requirements.md', feature: 'mobile-reminders', marker: '(ver §Enmienda #65)' },
  { file: 'specs/auth-reset-deep-link/design.md', feature: 'auth-reset-deep-link', marker: '(ver §Enmienda #65)' },
  {
    file: 'specs/mobile-device-pairing/design.md',
    feature: 'mobile-device-pairing',
    marker: '### D7 — Copy: strings exactos, ahora en dos idiomas (enmendado por #65)',
  },
];

// El bloque canónico vive en design.md §6.2: se lee de ahí en vez de
// duplicarlo, para que la spec siga siendo la única fuente del literal.
function canonicalAmendment(feature: string): string {
  const design = readFileSync(
    join(REPOSITORY_ROOT, 'specs', 'mobile-ui-language', 'design.md'),
    'utf8',
  );
  const fence = '```markdown\n## Enmienda #65 — idioma de la UI';
  const start = design.indexOf(fence);

  expect(start).toBeGreaterThan(-1);

  const body = design.slice(start + '```markdown\n'.length);
  const block = body.slice(0, body.indexOf('\n```')).replace('<FEATURE>', feature);

  // La línea de firma la marca el humano y por eso NO forma parte del bloque
  // que entrega el agente: se comprueba aparte, marcada o no. Incluirla aquí
  // ataba el candado a que el humano no hubiera firmado todavía.
  return block.slice(0, block.indexOf(SIGNATURE_LINE)).trimEnd();
}

describe('#65 R19: las 9 specs aprobadas llevan su enmienda de idioma', () => {
  it('inserta el bloque literal de §6.2 en las 9 specs y marca su línea de ratificación', () => {
    expect(AMENDED_SPECS).toHaveLength(9);

    for (const { file, feature, marker } of AMENDED_SPECS) {
      const source = readFileSync(join(REPOSITORY_ROOT, file), 'utf8');

      expect({ file, hasAmendment: source.includes(canonicalAmendment(feature)) }).toEqual({
        file,
        hasAmendment: true,
      });
      // El marcador se inserta en prosa que el markdown reparte en varias
      // líneas: se compara con los espacios colapsados, no byte a byte.
      const flowed = source.replace(/\s+/g, ' ');

      expect({ file, hasMarker: flowed.includes(marker.replace(/\s+/g, ' ')) }).toEqual({
        file,
        hasMarker: true,
      });
    }
  });

  // R19 exige que la implementación DEJE la casilla sin marcar al entregar, no
  // que siga sin marcar para siempre. Medir lo segundo hacía el requisito
  // imposible: pedía 9 casillas firmables y prohibía que se firmaran. Que esté
  // firmada o no es del humano y lo registra git; aquí solo se comprueba que
  // el bloque llega completo, con su línea de firma.
  it('deja en las 9 enmiendas su línea de firma, marcada o no', () => {
    for (const { file } of AMENDED_SPECS) {
      const source = readFileSync(join(REPOSITORY_ROOT, file), 'utf8');

      expect({
        file,
        hasSignatureLine: new RegExp(`- \\[[ xX]\\] ${SIGNATURE_LINE.slice(6)}`).test(source),
      }).toEqual({ file, hasSignatureLine: true });
    }
  });
});

// El punto 6 canónico vive en design.md §6.3, misma política que R19.
function canonicalArtDirectionRule(): string {
  const design = readFileSync(
    join(REPOSITORY_ROOT, 'specs', 'mobile-ui-language', 'design.md'),
    'utf8',
  );
  const fence =
    '```markdown\n**6. Idioma: catálogo de dos idiomas, español por defecto.**';
  const start = design.indexOf(fence);

  expect(start).toBeGreaterThan(-1);

  const body = design.slice(start + '```markdown\n'.length);

  return body.slice(0, body.indexOf('\n```'));
}

describe('#65 R20: la carta de UI fija el catálogo y el español por defecto', () => {
  it('inserta el punto 6 literal de §6.3 en §Dirección de arte', () => {
    const charter = readFileSync(
      join(REPOSITORY_ROOT, 'docs', 'ui-guidelines.md'),
      'utf8',
    );

    expect(charter).toContain(canonicalArtDirectionRule());
  });

  it('lo coloca tras el punto 5 y antes del checklist de autocrítica', () => {
    const charter = readFileSync(
      join(REPOSITORY_ROOT, 'docs', 'ui-guidelines.md'),
      'utf8',
    );

    const fifth = charter.indexOf('**5. Fidelidad no es pérdida de información.**');
    const sixth = charter.indexOf('**6. Idioma: catálogo de dos idiomas, español por defecto.**');
    const checklist = charter.indexOf('## Checklist de autocrítica');

    expect(fifth).toBeGreaterThan(-1);
    expect(sixth).toBeGreaterThan(fifth);
    expect(checklist).toBeGreaterThan(sixth);
  });
});

const norm = (value: string) => value.replace(/\s+/g, ' ').trim();

const SCREEN_FILES = ALL_USES.map((use) => use.file).filter(
  (file, index, all) => all.indexOf(file) === index,
);

// Enmienda (3): el escaneo recorre el catálogo tal como está. Las 11 entradas
// con parámetro quedan cubiertas por (a), porque su plantilla desaparece del
// fuente por completo.
const FIXED_KEYS = (Object.keys(en) as TranslationKey[]).filter(
  (key) => !en[key].includes('{{'),
);

const FIXED_COPY = [
  ...FIXED_KEYS.map((key) => ({ key, language: 'en', value: en[key] })),
  ...FIXED_KEYS.map((key) => ({ key, language: 'es', value: es[key] })),
];

// Cadenas completas y nodos de texto JSX completos, extraídos del AST de
// TypeScript (`typescript` ya es devDependency; no se añade ninguna).
//
// Fue un lexer a regex hasta el 2026-09-06, y tenía regiones ciegas: la
// alternativa de plantilla excluía `$`, así que ninguna plantilla con `${…}`
// casaba, el motor tomaba la backtick de cierre como de apertura y se tragaba
// todo hasta la siguiente — ~52 KB ciegos en 10 de las 19 pantallas, con falso
// verde demostrado. El AST no tiene esa clase de fallo: no hay que emparejar
// delimitadores a mano.
//
// La comparación posterior es de igualdad, no de subcadena: por eso el escaneo
// no necesita lista de excepciones (design.md §4.1). Las plantillas CON
// interpolación no pueden ser iguales a un valor fijo, y sus 11 entradas con
// parámetro las cubre R18(a).
function wholeLiterals(source: string): Set<string> {
  const literals = new Set<string>();
  const tree = ts.createSourceFile(
    'scan.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const visit = (node: ts.Node) => {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isJsxText(node)
    ) {
      const value = norm(node.text);
      if (value) literals.add(value);
    }

    ts.forEachChild(node, visit);
  };

  visit(tree);

  return literals;
}

describe('#65 R18: los sitios resuelven por clave y no queda copy suelta', () => {
  // Regresión del falso verde que destapó el reviewer el 2026-09-06: una
  // plantilla con `${…}` descuadraba el lexer y cegaba el resto del fichero.
  it('extrae los literales que siguen a una plantilla con interpolación', () => {
    const fixture = [
      'const km = `${(meters / 1000).toFixed(1)} km`;',
      "const stray = 'Resumen de hoy';",
      'const label = `${count} items`;',
      '<Text>Horario de comidas</Text>',
    ].join('\n');

    const literals = wholeLiterals(fixture);

    expect([...literals]).toEqual(
      expect.arrayContaining(['Resumen de hoy', 'Horario de comidas']),
    );
  });

  it('mantiene el catálogo consistente entre los dos idiomas', () => {
    expect(Object.keys(es)).toHaveLength(Object.keys(en).length);
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
  });

  it('resuelve cada ocurrencia de la tabla contra la clave exacta', () => {
    checkUses(ALL_USES);
  });

  it('no deja ningún valor fijo del catálogo como literal entero en las pantallas', () => {
    expect(SCREEN_FILES).toHaveLength(19 + 2);

    for (const file of SCREEN_FILES) {
      const literals = wholeLiterals(readFileSync(join(SOURCE_ROOT, file), 'utf8'));
      const looseCopy = FIXED_COPY.filter((entry) =>
        literals.has(norm(entry.value)),
      ).map((entry) => `${entry.language}:${entry.key} = ${entry.value}`);

      expect({ file, looseCopy }).toEqual({ file, looseCopy: [] });
    }
  });
});
