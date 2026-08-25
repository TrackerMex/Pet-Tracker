interface DirectoryEntry {
  name: string;
  isDirectory: () => boolean;
}

declare function require(moduleName: 'fs'): {
  readdirSync: (
    path: string,
    options: { withFileTypes: true },
  ) => DirectoryEntry[];
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');

const sourceRoot = join(process.cwd(), 'src');

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return entry.name === '__tests__' ? [] : sourceFiles(path);
    }

    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

function filesContaining(value: string): string[] {
  return sourceFiles(sourceRoot)
    .filter((path) => readFileSync(path, 'utf8').includes(value))
    .map((path) => path.slice(sourceRoot.length + 1));
}

function filesMatching(pattern: RegExp): string[] {
  return sourceFiles(sourceRoot)
    .filter((path) => pattern.test(readFileSync(path, 'utf8')))
    .map((path) => path.slice(sourceRoot.length + 1));
}

describe('C8: la UI no usa clases arbitrarias', () => {
  it('no deja ninguna clase Tailwind con valores entre corchetes', () => {
    expect(filesMatching(/[A-Za-z0-9_-]+-\[[^\]]+\]/)).toEqual([]);
  });
});

describe('R3: Card compartido elimina rounded arbitrario', () => {
  it('no deja rounded-[20px] en código de producción', () => {
    const roundedArbitrary = ['rounded-', '[20px]'].join('');

    expect(filesContaining(roundedArbitrary)).toEqual([]);
  });

  it.each([
    'home',
    'food',
    'meal-schedule',
    'health',
    'weight-log',
    'profile',
    'map',
  ])('%s importa el Card compartido', (screen) => {
    const contents = readFileSync(
      join(sourceRoot, 'app', '(tabs)', `${screen}.tsx`),
      'utf8',
    );

    expect(contents).toContain("from '../../components/card'");
  });
});

describe('R4: token text-2xs elimina tamaño arbitrario', () => {
  it('no deja text-[10px] en código de producción', () => {
    const textArbitrary = ['text-', '[10px]'].join('');

    expect(filesContaining(textArbitrary)).toEqual([]);
  });
});
