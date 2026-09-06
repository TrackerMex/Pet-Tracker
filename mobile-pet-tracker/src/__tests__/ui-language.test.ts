declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');

import { R1_AUTH, type UseRow } from './ui-copy-table';

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
    const calls = source.match(
      new RegExp(`\\bt\\(\\s*['"]${escapeRegExp(key)}['"]`, 'g'),
    );

    expect({ file, key, uses: calls?.length ?? 0 }).toEqual({
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
