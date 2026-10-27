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

/**
 * #120 R2: tag de apertura del elemento con el `testID` dado, sin sus hijos:
 * del `<` que lo abre al siguiente `<`, cortado en `/>` si se cierra solo, para
 * que el hueco hasta el siguiente elemento no entre. El ancla es única en el
 * fichero; con dos copias, `indexOf` podría recortar la que no se vigila.
 */
function openingTagWithTestId(source: string, testId: string): string {
  const anchor = source.indexOf(`testID="${testId}"`);

  expect(anchor).toBeGreaterThan(-1);
  expect(source.lastIndexOf(`testID="${testId}"`)).toBe(anchor);

  return source
    .slice(source.lastIndexOf('<', anchor), source.indexOf('<', anchor))
    .split('/>')[0];
}

describe('#61 R1: la etiqueta destructiva usa el token de danger', () => {
  // #120 R2: este bloque va del ancla al `</Button>` con los hijos dentro, a
  // propósito: la etiqueta y su texto son hijos del Button, y el token del
  // acento no puede aparecer en ninguna parte del botón.
  const deleteConfirm = elementWithTestId(
    readSource(join('screens', 'reminders', 'index.tsx')),
    'reminders-delete-confirm',
    '</Button>',
  );

  it('resuelve el Button.Label con text-danger-foreground (enmendado por #204 R9)', () => {
    expect(deleteConfirm).toContain(
      '<Text className="text-17 font-extrabold text-danger-foreground">',
    );
  });

  it('no deja el token del acento en un botón destructivo', () => {
    expect(deleteConfirm).not.toContain('text-accent-foreground');
  });

  it('conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2)', () => {
    // #120 R2: variant y bg-danger son props del propio Button y se leen en su
    // tag; el texto es un hijo y se lee en el bloque entero.
    const deleteConfirmTag = openingTagWithTestId(
      readSource(join('screens', 'reminders', 'index.tsx')),
      'reminders-delete-confirm',
    );

    expect(deleteConfirmTag).toContain('variant="danger"');
    expect(deleteConfirmTag).toContain('bg-danger');
    expect(deleteConfirm).toContain("t('reminders.delete')");
  });
});

describe('#61 R3: ningún texto sobre bg-accent se compone con opacidad', () => {
  const accentCards = [
    join('screens', 'food', 'index.tsx'),
    join('screens', 'meal-schedule', 'index.tsx'),
  ];

  it.each(accentCards)('%s no compone su texto con opacidad (enmendado por #200 R1)', (path) => {
    const source = readSource(path);

    expect(source).not.toContain('opacity-70');
    expect(source).not.toContain('opacity-80');
  });

  it.each([accentCards[0]])(
    '%s conserva las dos etiquetas de la card de acento a opacidad plena (enmendado por #200 R1 y #200 R3)',
    (path) => {
      const source = readSource(path);

      expect(source).toContain(
        'className="text-xs font-extrabold uppercase tracking-caps text-accent-foreground"',
      );
      expect(source).toContain(
        'className="text-sm font-semibold text-accent-foreground"',
      );
    },
  );
});

describe('#179 R5: Horario conserva sus etiquetas del resumen a opacidad plena', () => {
  it('Horario conserva sus etiquetas del resumen a opacidad plena', () => {
    const source = readSource(join('screens', 'meal-schedule', 'index.tsx'));

    expect(source).toContain('className="text-xs font-extrabold uppercase tracking-caps text-accent-foreground"');
    expect(source).toContain('className="text-22 font-black text-accent-foreground"');
    expect(source).toContain('className="text-xs font-normal text-accent-foreground"');
  });
});

describe('#61 R4: el acento como tinta usa accent-strong', () => {
  const inkSites: [string, number][] = [
    [join('components', 'floating-tab-bar.tsx'), 1],
    [join('screens', 'login', 'index.tsx'), 2],
    [join('screens', 'forgot', 'index.tsx'), 1], // #117 R10
    [join('screens', 'reset-password', 'index.tsx'), 4], // #172 R19: link-login del formulario
    [join('screens', 'home', 'index.tsx'), 3], // #198 R4
    [join('screens', 'health', 'index.tsx'), 0], // #199 R18
    [join('screens', 'food', 'index.tsx'), 1 + 1 - 1], // #200 R5; #200 R6
    [join('screens', 'map', 'index.tsx'), 2 - 1], // #201 R5
    [join('screens', 'profile', 'index.tsx'), 1 + 1 - 1 + 1 + 1], // #173 R5; #173 R6; #173 R8; #173 R11
    [join('screens', 'add-pet', 'index.tsx'), 1],
    [join('components', 'pet-hero-header.tsx'), 1],
    [join('screens', 'weight-log', 'index.tsx'), 1], // #199 R4
    [join('screens', 'welcome', 'index.tsx'), 2],
  ];

  it.each(inkSites)('%s pinta con text-accent-strong (%i) (enmendado por #200 R1 y #200 R5 y #200 R6) (enmendado por #199 R4) (enmendado por #199 R18) (enmendado por #198 R4) (enmendado por #201 R5)', (path, sites) => {
    expect(readSource(path).match(/text-accent-strong\b/g) ?? []).toHaveLength(sites);
  });

  it('suma las trece ocurrencias que enumera la spec (enmendado por #200 R5 y #200 R6) (enmendado por #199 R4) (enmendado por #199 R18) (enmendado por #198 R4) (enmendado por #201 R5)', () => {
    expect(inkSites.reduce((total, [path]) => total + (readSource(path).match(/text-accent-strong\b/g) ?? []).length, 0)).toBe(
      inkSites.reduce((total, [, sites]) => total + sites, 0),
    );
    expect(
      inkSites.reduce((total, [path]) => total + (readSource(path).match(/text-accent-strong\b/g)?.length ?? 0), 0),
    ).toBe(
      13 + 1 + 1
        + 2 // #118 R11
        + 1 // #167 R10
        + 1 // #172 R19
        + 1 // #173 R5
        - 1 // #173 R6
        + 1 // #173 R8
        + 1 // #173 R11
        + 1 // #200 R5
        - 1 // #200 R6
        + 1 // #199 R4
        - 1 // #199 R18
        - 1 // #201 R5
        + 1, // #198 R4: +1 Inicio
    );
  });

  it('no deja ningún text-accent suelto en las fuentes', () => {
    expect(filesMatching(/text-accent(?![-\w])/)).toEqual([]);
  });

  it('reserva las peticiones de accent a las huellas de EmptyState (enmendado por #176 R5) (enmendado por #197 R20) (enmendado por #220 R6) (enmendado por #217 R1)', () => {
    const requestsAccent = /useThemeColors\(\s*\[[^\]]*'accent'[^\]]*\]/;

    expect(filesMatching(requestsAccent)).toEqual(['components/date-field.tsx', 'components/empty-state.tsx', 'components/toggle-switch.tsx', 'theme/navigation-theme.ts', 'theme/shadows.ts']); // (enmendado por #176 R5) // (enmendado por #220 R6)
  });
});

describe('#61 R5: text-warning deja de usarse como color de texto', () => {
  const warningSites = [ // #199 R14: Salud sale del inventario; tinta categórica.
    join('screens', 'home', 'index.tsx'),
  ];

  it.each(warningSites)('%s pinta su texto con text-warning-strong (enmendado por #199 R14) (enmendado por #204 R7)', (path) => {
    expect(readSource(path)).toContain('text-warning-strong');
    expect(readSource(join('screens', 'health', 'index.tsx'))).not.toContain('text-warning-strong'); // #199 R14
  });

  it('no deja ningún text-warning suelto en las fuentes', () => {
    expect(filesMatching(/text-warning(?![-\w])/)).toEqual([]);
  });

  it('conserva el ámbar puro como relleno de badge (enmendado por #204 R7)', () => {
    expect(readSource(join('screens', 'reminders', 'index.tsx'))).toContain(
      'CATEGORY_SLOTS.amber.surface',
    );
  });
});
