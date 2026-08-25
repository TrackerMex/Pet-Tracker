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
const projectRoot = process.cwd();

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
      screen === 'profile'
        ? join(sourceRoot, 'screens', 'profile', 'index.tsx')
        : join(sourceRoot, 'app', '(tabs)', `${screen}.tsx`),
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

describe('R9: mobile-pets-profile sin drift', () => {
  const featureFiles = [
    'api/media.ts',
    'api/users.ts',
    'components/pet-avatar.tsx',
    'screens/add-pet/index.tsx',
    'screens/docs/index.tsx',
    'screens/profile/index.tsx',
    'utils/theme-preference.ts',
  ];

  it('keeps arbitrary text, hex colors, and StyleSheet out of feature sources', () => {
    const violations = featureFiles.flatMap((relativePath) => {
      const contents = readFileSync(join(sourceRoot, relativePath), 'utf8');
      return /text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i.test(contents)
        ? [relativePath]
        : [];
    });

    expect(violations).toEqual([]);
  });

  it('keeps the three Expo Router entrypoints thin', () => {
    const routes = [
      'app/(tabs)/profile.tsx',
      'app/(tabs)/pets/add.tsx',
      'app/(tabs)/pets/[petId]/docs.tsx',
    ];

    const routeLengths = routes.map((relativePath) => ({
      relativePath,
      lines: readFileSync(join(sourceRoot, relativePath), 'utf8')
        .trim()
        .split('\n').length,
    }));

    expect(routeLengths).toEqual(
      routes.map((relativePath) => ({
        relativePath,
        lines: expect.any(Number),
      })),
    );
    routeLengths.forEach(({ lines }) => expect(lines).toBeLessThan(10));
  });

  it('contains dependencies to the two approved additions', () => {
    const packageJson = JSON.parse(
      readFileSync(join(projectRoot, 'package.json'), 'utf8'),
    ) as { dependencies: Record<string, string> };

    expect(packageJson.dependencies.blobatar).toBe('^2.5.0');
    expect(packageJson.dependencies['expo-image-picker']).toBe('~57.0.13');
    expect(packageJson.dependencies['@blobatar/react']).toBeUndefined();
    expect(packageJson.dependencies['@gorhom/bottom-sheet']).toBe('^5.2.14');
  });

  it('has an implementation trace instead of a pending R9 row', () => {
    const traceability = readFileSync(
      join(projectRoot, '..', 'specs', 'mobile-pets-profile', 'traceability.md'),
      'utf8',
    );
    const r9Row = traceability
      .split('\n')
      .find((line) => line.startsWith('| R9 |'));

    expect(r9Row).toBeDefined();
    expect(r9Row).not.toContain('pendiente');
  });
});
