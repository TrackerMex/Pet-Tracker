interface DirectoryEntry {
  name: string;
  isDirectory: () => boolean;
}

declare function require(moduleName: 'fs'): {
  existsSync: (path: string) => boolean;
  readdirSync: (
    path: string,
    options: { withFileTypes: true },
  ) => DirectoryEntry[];
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { existsSync, readdirSync, readFileSync } = require('fs');
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

function allTypeScriptFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    return entry.isDirectory()
      ? allTypeScriptFiles(path)
      : /\.tsx?$/.test(entry.name)
        ? [path]
        : [];
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
      screen === 'profile' || screen === 'home'
        ? join(sourceRoot, 'screens', screen, 'index.tsx')
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
    'components/pet-hero-header.tsx',
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

  it('keeps the four Expo Router entrypoints thin', () => {
    const routes = [
      'app/(tabs)/home.tsx',
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

  it('contains the approved dependencies', () => {
    const packageJson = JSON.parse(
      readFileSync(join(projectRoot, 'package.json'), 'utf8'),
    ) as { dependencies: Record<string, string> };

    expect(packageJson.dependencies.blobatar).toBe('^2.5.0');
    expect(packageJson.dependencies['expo-image-picker']).toBe('~57.0.13');
    expect(packageJson.dependencies['@blobatar/react']).toBeUndefined();
    expect(packageJson.dependencies['@gorhom/bottom-sheet']).toBe('^5.2.14');
    expect(packageJson.dependencies['react-native-chart-kit']).toBe('7.0.4');
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

describe('R11 (mobile-device-pairing): pairing usa el Card compartido y las dimensiones uniformes', () => {
  const pairingSource = readFileSync(
    join(sourceRoot, 'screens', 'pairing', 'index.tsx'),
    'utf8',
  );

  it('imports the shared Card and PetSwitcher', () => {
    expect(pairingSource).toContain("from '../../components/card'");
    expect(pairingSource).toContain("from '../../components/pet-switcher'");
  });

  it.each([
    'padding: 24',
    'gap: 16',
    'insets.top + 12',
    'insets.bottom + 96',
  ])('keeps the uniform screen metric %s', (metric) => {
    expect(pairingSource).toContain(metric);
  });

  it('keeps pairing free of forbidden styling escapes', () => {
    expect(pairingSource).not.toMatch(
      /#[\da-f]{3,8}\b|[A-Za-z0-9_-]+-\[[^\]]+\]|StyleSheet\.create|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:/i,
    );
  });
});

describe('#68 R18: la actividad semanal no mete drift de estilo', () => {
  const featureFiles = [
    'app/(tabs)/home.tsx',
    'i18n/catalog.ts',
    'screens/home/format.ts',
    'screens/home/index.test.tsx',
    'screens/home/index.tsx',
    'screens/home/weekly-activity-chart.test.tsx',
    'screens/home/weekly-activity-chart.tsx',
    'screens/pairing/index.test.tsx',
    'screens/pairing/index.tsx',
    'utils/device-connectivity.test.ts',
    'utils/device-connectivity.ts',
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

  it('keeps the resolved token theme and rejects chart presets', () => {
    const chartSource = readFileSync(
      join(sourceRoot, 'screens', 'home', 'weekly-activity-chart.tsx'),
      'utf8',
    );

    expect(chartSource).toContain('series: [accentStrong]');
    expect(chartSource).toContain('grid: border');
    expect(chartSource).toContain('axis: border');
    expect(chartSource).toContain('text: foreground');
    expect(chartSource).toContain('mutedText: muted');
    expect(chartSource).toContain('background: surface');
    expect(chartSource).toContain('plotBackground: surface');
    expect(chartSource).toContain(
      'typography: { axisLabelSize: CHART_AXIS_LABEL_SIZE }',
    );
    expect(chartSource).not.toMatch(/\bpreset=/);
  });
});

describe('#69 R13: la tira de estadísticas no mete drift de estilo', () => {
  const featureFiles = [
    'i18n/catalog.ts',
    'screens/home/format.ts',
    'screens/home/format.test.ts',
    'screens/home/index.test.tsx',
    'screens/home/index.tsx',
  ];

  it('mantiene sus cinco ficheros sin escapes de estilo literales', () => {
    const violations = featureFiles.flatMap((relativePath) => {
      const contents = readFileSync(join(sourceRoot, relativePath), 'utf8');
      return /text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i.test(contents)
        ? [relativePath]
        : [];
    });

    expect(violations).toEqual([]);
  });
});

describe('#71 R13: la rejilla de accesos rápidos no mete drift de estilo', () => {
  const featureFiles = [
    'i18n/catalog.ts',
    'screens/home/index.test.tsx',
    'screens/home/index.tsx',
  ];

  it('mantiene sus tres ficheros sin escapes de estilo literales', () => {
    const violations = featureFiles.flatMap((relativePath) => {
      const contents = readFileSync(join(sourceRoot, relativePath), 'utf8');
      return /text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i.test(contents)
        ? [relativePath]
        : [];
    });

    expect(violations).toEqual([]);
  });
});

describe('#70 R17: la sección de recordatorios no mete drift de estilo', () => {
  const featureFiles = [
    'api/types.ts',
    'i18n/catalog.ts',
    'screens/home/format.test.ts',
    'screens/home/format.ts',
    'screens/home/index.test.tsx',
    'screens/home/index.tsx',
  ];

  it('mantiene sus ficheros sin escapes de estilo literales', () => {
    const violations = featureFiles.flatMap((relativePath) => {
      const contents = readFileSync(join(sourceRoot, relativePath), 'utf8');
      return /text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i.test(contents)
        ? [relativePath]
        : [];
    });

    expect(violations).toEqual([]);
  });
});

describe('#85 R12: la sección de recordatorios reales no mete drift de estilo', () => {
  const featureFiles = [
    'i18n/catalog.ts',
    'screens/home/format.test.ts',
    'screens/home/format.ts',
    'screens/home/index.test.tsx',
    'screens/home/index.tsx',
  ];

  it('mantiene sus ficheros sin escapes de estilo literales', () => {
    const violations = featureFiles.flatMap((relativePath) => {
      const contents = readFileSync(join(sourceRoot, relativePath), 'utf8');
      return /text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i.test(contents)
        ? [relativePath]
        : [];
    });

    expect(violations).toEqual([]);
  });
});

describe('#68 E1: la carta retira connectivity de los enum crudos', () => {
  const charter = readFileSync(
    join(projectRoot, '..', 'docs', 'ui-guidelines.md'),
    'utf8',
  );
  const start = charter.indexOf(
    '- **Los valores de enum que la API devuelve se pintan crudos**:',
  );
  const end = charter.indexOf('\n\n## Checklist de autocrítica', start);
  const corollary = charter.slice(start, end);
  const rawEnumList = corollary.slice(0, corollary.indexOf('. Siguen'));

  it('conserva crudos solo los cuatro ámbitos aún pendientes', () => {
    expect(rawEnumList).toContain('`pet.sex`');
    expect(rawEnumList).toContain('`document.type`');
    expect(rawEnumList).toContain('`foodType`');
    expect(rawEnumList).toContain('`activityLevel`');
    expect(rawEnumList).not.toContain('`device.connectivity`');
  });

  it('registra que connectivity se resuelve por catálogo desde R16', () => {
    expect(corollary).toContain(
      '`device.connectivity` dejó de pintarse crudo en la feature #68 (R16)',
    );
    expect(corollary).toContain('`src/utils/device-connectivity.ts`');
  });
});

describe('#87 R1: la dependencia queda declarada y fijada', () => {
  const packageJson = JSON.parse(
    readFileSync(join(projectRoot, 'package.json'), 'utf8'),
  ) as {
    dependencies: Record<string, string>;
    jest: { transformIgnorePatterns: string[] };
  };
  const version = packageJson.dependencies['@tanstack/react-query'];

  it('declares exactly version 5.102.8', () => {
    expect(version).toBe('5.102.8');
  });

  it('does not use a semver range', () => {
    expect(version).not.toMatch(/^[\^~]/);
  });

  it('keeps TanStack out of transformIgnorePatterns', () => {
    expect(packageJson.jest.transformIgnorePatterns[0]).not.toContain(
      '@tanstack',
    );
  });
});

describe('#87 R19: use-' + 'api no deja huella', () => {
  const legacyModule = ['use', 'api'].join('-');
  const legacyIdentifier = ['use', 'Api'].join('');
  const screenSignOutCalls: Record<string, number> = {
    'app/(tabs)/food.tsx': 0,
    'app/(tabs)/health.tsx': 0,
    'app/(tabs)/map.tsx': 0,
    'app/(tabs)/meal-schedule.tsx': 1,
    'app/(tabs)/weight-log.tsx': 1,
    'screens/docs/index.tsx': 0,
    'screens/home/index.tsx': 0,
    'screens/pairing/index.tsx': 2,
    'screens/profile/index.tsx': 2,
    'screens/reminders/index.tsx': 1,
  };

  it('removes both legacy hook files', () => {
    expect(
      existsSync(join(sourceRoot, 'hooks', `${legacyModule}.ts`)),
    ).toBe(false);
    expect(
      existsSync(
        join(sourceRoot, 'hooks', '__tests__', `${legacyModule}.test.tsx`),
      ),
    ).toBe(false);
  });

  it('leaves only the weekly activity guard mentioning the legacy hook', () => {
    const testRoot = join(projectRoot, 'test');
    const files = [
      ...allTypeScriptFiles(sourceRoot).map((path) => ({
        path,
        relativePath: path.slice(sourceRoot.length + 1),
      })),
      ...allTypeScriptFiles(testRoot).map((path) => ({
        path,
        relativePath: `test/${path.slice(testRoot.length + 1)}`,
      })),
    ];
    const footprints = files
      .filter(({ path }) => {
        const contents = readFileSync(path, 'utf8');

        return (
          contents.includes(legacyModule) ||
          contents.includes(legacyIdentifier)
        );
      })
      .map(({ relativePath }) => relativePath);

    expect(footprints).toEqual([
      'screens/home/weekly-activity-chart.test.tsx',
    ]);
  });

  it('keeps literal query keys out of every migrated screen', () => {
    const violations = Object.keys(screenSignOutCalls).filter((relativePath) =>
      /queryKey:\s*\[/.test(
        readFileSync(join(sourceRoot, relativePath), 'utf8'),
      ),
    );

    expect(violations).toEqual([]);
  });

  it('preserves every mutation sign-out with zero delta', () => {
    const actual = Object.fromEntries(
      Object.keys(screenSignOutCalls).map((relativePath) => {
        const contents = readFileSync(
          join(sourceRoot, relativePath),
          'utf8',
        );

        return [relativePath, contents.split('signOut(').length - 1];
      }),
    );

    expect(actual).toEqual(screenSignOutCalls);
  });
});
