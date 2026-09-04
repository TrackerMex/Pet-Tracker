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

describe('#62 R1: la escala de radios está declarada y el botón primario tiene un solo radio', () => {
  const primaryButtons = [
    [join('app', '(auth)', 'login.tsx'), 'login-submit'],
    [join('app', '(auth)', 'forgot.tsx'), 'forgot-submit'],
    [join('app', '(auth)', 'register.tsx'), 'register-submit'],
    [join('screens', 'reset-password', 'index.tsx'), 'reset-submit'],
  ] as const;

  it('declara en la carta los tres radios y prohíbe el drift', () => {
    const guidelines = readFileSync(
      join(process.cwd(), '..', 'docs', 'ui-guidelines.md'),
      'utf8',
    );

    expect(guidelines).toContain('12. **Escala de radios** (feature #62');
    expect(guidelines).toContain('**Superficie de card** → `rounded-card`');
    expect(guidelines).toContain(
      '**Control, tile, input, botón y píldora de dato** → `rounded-xl`',
    );
    expect(guidelines).toContain('**Cápsula** (chip, avatar');
    expect(guidelines).toContain(
      '`rounded-2xl`, `rounded-lg`, `rounded-md` y `rounded-sm` quedan',
    );
  });

  it.each(primaryButtons)('%s aplica rounded-xl a %s', (path, testId) => {
    const button = elementWithTestId(readSource(path), testId, '</Button>');

    expect(button).toContain('rounded-xl bg-accent');
    expect(button).not.toContain('rounded-2xl');
  });

  it('deja los doce botones primarios sólidos en un único radio', () => {
    const primaryRadius = sourceFiles().flatMap((path) =>
      readFileSync(path, 'utf8').match(/rounded-xl bg-accent(?=[\s'"`])/g) ?? [],
    );

    expect(primaryRadius).toHaveLength(12);
    expect(filesMatching(/rounded-2xl bg-accent(?=[\s'"`])/)).toEqual([]);
  });
});

describe('#62 R2: cada skeleton tiene la forma del contenido que sustituye', () => {
  it.each([
    [
      join('app', '(tabs)', 'home.tsx'),
      'pet-card-skeleton',
      'h-32 w-full rounded-card',
    ],
    [
      join('app', '(tabs)', 'health.tsx'),
      'vaccines-skeleton',
      'h-24 w-full rounded-card',
    ],
  ])('%s conserva dimensión y usa el radio de Card', (path, testId, classes) => {
    const skeleton = elementWithTestId(
      readSource(path),
      testId,
      '/>',
    );

    expect(skeleton).toContain(`className="${classes}"`);
  });

  it('da al skeleton repetido de reminders la forma de sus filas Card', () => {
    const reminders = readSource(join('screens', 'reminders', 'index.tsx'));

    expect(reminders).toContain(
      'testID={`reminder-row-skeleton-${index + 1}`}',
    );
    expect(reminders).toContain('className="h-20 w-full rounded-card"');
  });
});

describe('#62 R4: la app solo usa los radios de la escala declarada', () => {
  it.each(['rounded-2xl', 'rounded-lg', 'rounded-md', 'rounded-sm'])(
    'no deja la clase fuera de escala %s en producción',
    (className) => {
      expect(filesMatching(new RegExp(`\\b${className}\\b`))).toEqual([]);
    },
  );

  it('lleva las tres píldoras de resumen de reminders a rounded-xl', () => {
    const reminders = readSource(join('screens', 'reminders', 'index.tsx'));

    for (const testId of ['pill-active', 'pill-week', 'pill-inactive']) {
      const pill = elementWithTestId(reminders, testId, '</View>');

      expect(pill).toContain('rounded-xl');
    }
  });

  it('lleva los tres tiles restantes a rounded-xl', () => {
    expect(readSource(join('app', '(tabs)', 'food.tsx'))).toContain(
      'size-14 items-center justify-center rounded-xl bg-surface-secondary',
    );
    expect(readSource(join('app', '(auth)', 'forgot.tsx'))).toContain(
      'size-16 items-center justify-center rounded-xl bg-accent-soft',
    );
    expect(readSource(join('app', '(tabs)', 'weight-log.tsx'))).toContain(
      'size-8 shrink-0 items-center justify-center rounded-xl ${tileClassName}',
    );
  });
});

describe('#62 R6: la última fila de pet-info-card no cuelga su separador', () => {
  it('no deja variantes de posición que uniwind no implementa', () => {
    expect(filesMatching(/\b(?:last|first|odd|even):/)).toEqual([]);
  });
});

describe('#62 R7: ningún glifo tipográfico hace de icono', () => {
  const backScreens = [
    join('screens', 'docs', 'index.tsx'),
    join('screens', 'add-pet', 'index.tsx'),
    join('screens', 'add-reminder', 'index.tsx'),
    join('screens', 'pairing', 'index.tsx'),
  ];

  it('elimina las siete flechas tipográficas de producción', () => {
    expect(filesMatching(/[←›]/)).toEqual([]);
  });

  it.each(backScreens)('%s usa ArrowLeft de reicon', (path) => {
    const source = readSource(path);

    expect(source).toContain(
      "import { ArrowLeft } from 'reicon-react-native';",
    );
    expect(source).toContain('<ArrowLeft size={20} color={foreground} />');
  });

  it('profile usa tres ChevronRight de reicon', () => {
    const profile = readSource(join('screens', 'profile', 'index.tsx'));

    expect(profile).toContain(
      "import { ChevronRight } from 'reicon-react-native';",
    );
    expect(
      profile.match(/<ChevronRight size=\{20\} color=\{muted\} \/>/g),
    ).toHaveLength(3);
  });
});
