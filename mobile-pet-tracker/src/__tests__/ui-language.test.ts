declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');

import {
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
  it('resuelve las 20 ocurrencias normativas', () => {
    expect(R3_HOME).toHaveLength(20);
    checkUses(R3_HOME);
  });
});

describe('#65 R4: Map resuelve su copy por clave', () => {
  it('resuelve las 19 ocurrencias normativas', () => {
    expect(R4_MAP).toHaveLength(19);
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
  it('resuelve las 40 ocurrencias normativas', () => {
    expect(R9_ADD_PET).toHaveLength(40);
    checkUses(R9_ADD_PET);
  });
});

describe('#65 R10: el emparejado del collar resuelve su copy por clave', () => {
  it('resuelve las 40 ocurrencias normativas', () => {
    expect(R10_PAIRING).toHaveLength(40);
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

  return body.slice(0, body.indexOf('\n```')).replace('<FEATURE>', feature);
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
      expect({ file, hasMarker: source.includes(marker) }).toEqual({
        file,
        hasMarker: true,
      });
    }
  });

  it('deja la casilla de firma de las 9 enmiendas sin marcar', () => {
    for (const { file } of AMENDED_SPECS) {
      const source = readFileSync(join(REPOSITORY_ROOT, file), 'utf8');

      expect({ file, unsigned: source.includes('- [ ] Enmienda aprobada por humano') }).toEqual({
        file,
        unsigned: true,
      });
      expect({
        file,
        signed: /- \[[xX]\] Enmienda aprobada por humano/.test(source),
      }).toEqual({ file, signed: false });
    }
  });
});
