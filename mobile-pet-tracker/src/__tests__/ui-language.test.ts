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
