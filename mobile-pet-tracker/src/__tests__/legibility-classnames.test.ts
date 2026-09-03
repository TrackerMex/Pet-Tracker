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

/** Bloque JSX que abre en el `testID` dado y cierra en `closingTag`. */
function elementWithTestId(
  source: string,
  testId: string,
  closingTag: string,
): string {
  const start = source.indexOf(`testID="${testId}"`);

  expect(start).toBeGreaterThan(-1);

  const end = source.indexOf(closingTag, start);

  expect(end).toBeGreaterThan(start);

  return source.slice(start, end);
}

describe('#61 R1: la etiqueta destructiva usa el token de danger', () => {
  const deleteConfirm = elementWithTestId(
    readSource(join('screens', 'reminders', 'index.tsx')),
    'reminders-delete-confirm',
    '</Button>',
  );

  it('resuelve el Button.Label con text-danger-foreground', () => {
    expect(deleteConfirm).toContain(
      '<Button.Label className="font-bold text-danger-foreground">',
    );
  });

  it('no deja el token del acento en un botón destructivo', () => {
    expect(deleteConfirm).not.toContain('text-accent-foreground');
  });

  it('conserva variant, testID y texto del botón', () => {
    expect(deleteConfirm).toContain('variant="danger"');
    expect(deleteConfirm).toContain('bg-danger');
    expect(deleteConfirm).toContain('Delete');
  });
});

describe('#61 R3: ningún texto sobre bg-accent se compone con opacidad', () => {
  const accentCards = [
    join('app', '(tabs)', 'food.tsx'),
    join('app', '(tabs)', 'meal-schedule.tsx'),
  ];

  it.each(accentCards)('%s no compone su texto con opacidad', (path) => {
    const source = readSource(path);

    expect(source).not.toContain('opacity-70');
    expect(source).not.toContain('opacity-80');
  });

  it.each(accentCards)(
    '%s conserva las dos etiquetas de la card de acento a opacidad plena',
    (path) => {
      const source = readSource(path);

      expect(source).toContain(
        'className="text-xs font-semibold uppercase tracking-widest text-accent-foreground"',
      );
      expect(source).toContain(
        'className="font-semibold text-accent-foreground"',
      );
    },
  );
});

describe('#61 R4: el acento como tinta usa accent-strong', () => {
  const inkSites: [string, number][] = [
    [join('components', 'floating-tab-bar.tsx'), 1],
    [join('app', '(auth)', 'login.tsx'), 2],
    [join('app', '(auth)', 'forgot.tsx'), 1],
    [join('screens', 'reset-password', 'index.tsx'), 2],
    [join('app', '(tabs)', 'home.tsx'), 1],
    [join('app', '(tabs)', 'health.tsx'), 1],
    [join('app', '(tabs)', 'food.tsx'), 1],
    [join('app', '(tabs)', 'map.tsx'), 2],
    [join('screens', 'profile', 'index.tsx'), 1],
    [join('screens', 'add-pet', 'index.tsx'), 1],
  ];

  it.each(inkSites)('%s pinta con text-accent-strong (%i)', (path, sites) => {
    expect(readSource(path).match(/text-accent-strong\b/g)).toHaveLength(sites);
  });

  it('suma las trece ocurrencias que enumera la spec', () => {
    expect(
      inkSites.reduce((total, [, sites]) => total + sites, 0),
    ).toBe(13);
  });

  it('no deja ningún text-accent suelto en las fuentes', () => {
    expect(filesMatching(/text-accent(?![-\w])/)).toEqual([]);
  });

  it('no deja ninguna llamada a useThemeColors pidiendo accent', () => {
    const requestsAccent = /useThemeColors\(\s*\[[^\]]*'accent'[^\]]*\]/;

    expect(filesMatching(requestsAccent)).toEqual([]);
  });
});
