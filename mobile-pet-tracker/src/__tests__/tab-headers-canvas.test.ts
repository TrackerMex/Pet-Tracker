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

/** Fuentes de producción de `src/`: sin `__tests__/` y sin tests colocados. */
function sourceFiles(directory: string = sourceRoot): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return entry.name === '__tests__' ? [] : sourceFiles(path);
    }

    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
      ? [path]
      : [];
  });
}

function filesMatching(pattern: RegExp): string[] {
  return sourceFiles()
    .filter((path) => pattern.test(readFileSync(path, 'utf8')))
    .map((path) => path.slice(sourceRoot.length + 1));
}

function readSource(relativePath: string): string {
  return readFileSync(join(sourceRoot, relativePath), 'utf8');
}


const TAB_SCREENS_168 = [
  'screens/health/index.tsx',
  'screens/profile/index.tsx',
  'screens/food/index.tsx',
];
const SCREEN_AND_TEST_FILES_168 = [
  ...TAB_SCREENS_168,
  'screens/health/index.test.tsx',
  'screens/profile/index.test.tsx',
  'screens/food/index.test.tsx',
];
const TAB_TITLE_168 = 'text-3xl font-black tracking-title text-foreground';

describe('#168 R1: el título grande vive en las tres pestañas', () => {
  it('pinta una ocurrencia del literal en cada fichero de pestaña (enmendado por #197 R4) (enmendado por #200 R1) (enmendado por #222 R9)', () => {
    const expectedOccurrences: Record<string, number> = { 'screens/health/index.tsx': 0, 'screens/food/index.tsx': 0, 'screens/profile/index.tsx': 1 };
    for (const file of TAB_SCREENS_168) {
      expect({ file, occurrences: readSource(file).split(TAB_TITLE_168).length - 1 })
        .toEqual({ file, occurrences: expectedOccurrences[file] });
    }
  });

  it('limita el literal a las tres pestañas y a la celebración (enmendado por #197 R4) (enmendado por #200 R1) (enmendado por #222 R9)', () => {
    expect(filesMatching(/text-3xl font-black tracking-title text-foreground/).sort()).toEqual([
      'components/celebration.tsx',
      'screens/profile/index.tsx',
    ]);
  });
});

describe('#168 R12: alcance cerrado', () => {
  it('veta clases con corchetes en las pantallas y sus tests (enmendado por #200 R1)', () => {
    for (const file of SCREEN_AND_TEST_FILES_168) {
      expect(readSource(file)).not.toMatch(/[A-Za-z0-9_-]+-\[[^\]]+\]/);
    }
  });

  it('veta StyleSheet en las pantallas y sus tests (enmendado por #200 R1)', () => {
    for (const file of SCREEN_AND_TEST_FILES_168) {
      expect(readSource(file)).not.toContain('StyleSheet');
    }
  });

  it('veta text-accent suelto en las pantallas y sus tests (enmendado por #200 R1)', () => {
    for (const file of SCREEN_AND_TEST_FILES_168) {
      expect(readSource(file)).not.toMatch(/\btext-accent(?![-\w])/);
    }
  });

  it('veta hex solo en las tres pantallas de producción (enmendado por #200 R1)', () => {
    for (const file of TAB_SCREENS_168) {
      expect(readSource(file)).not.toMatch(new RegExp(String.raw`#(?!\d{2,3} R\d)[\da-f]{3,8}\b`, 'i'));
    }
  });
});


describe('#196 R11: alcance de la cabecera a sangre', () => {
  it('#196 R11: PetHeroHeader solo en Inicio y Perfil', () => {
    expect(filesMatching(/<PetHeroHeader/).sort()).toEqual(['screens/home/index.tsx', 'screens/profile/index.tsx']);
  });

  it('#196 R11: la carta recoge la enmienda N1 de #196', () => {
    const charter = readFileSync(join(process.cwd(), '..', 'docs/ui-guidelines.md'), 'utf8');
    expect(charter).toContain('**Regla N1 (enmienda #196)**');
    expect(charter).not.toContain('Inicio es la única pestaña con PetHeroHeader');
  });
});
