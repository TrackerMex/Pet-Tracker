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

/**
 * #120 R1: tag de apertura del elemento con el `testID` dado, sin sus hijos:
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

describe('#62 R1: la escala de radios está declarada y el botón primario tiene un solo radio', () => {
  const primaryButtons = [
    [join('app', '(auth)', 'login.tsx'), 'login-submit'],
    [join('screens', 'forgot', 'index.tsx'), 'forgot-submit'], // #117 R10
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

  it.each(primaryButtons)('%s aplica rounded-xl a %s en su tag de apertura (#120 R1)', (path, testId) => {
    const button = openingTagWithTestId(readSource(path), testId);

    expect(button).toContain('rounded-xl bg-accent');
    expect(button).not.toContain('rounded-2xl');
  });

  it('deja todos los botones primarios sólidos en un único radio', () => {
    const primaryRadius = sourceFiles().flatMap((path) =>
      readFileSync(path, 'utf8').match(/rounded-xl bg-accent(?=[\s'"`])/g) ?? [],
    );

    expect(primaryRadius).toHaveLength(13 + 1 + 1 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7; #155 R3 // #158 R3: docs-upload
    expect(filesMatching(/rounded-2xl bg-accent(?=[\s'"`])/)).toEqual([]);
  });
});

describe('#62 R2: cada skeleton tiene la forma del contenido que sustituye', () => {
  it.each([
    [
      join('screens', 'health', 'index.tsx'),
      'vaccines-skeleton',
      'h-24 w-full rounded-card',
    ],
  ])('%s conserva dimensión y usa el radio de Card en su tag de apertura (#120 R1)', (path, testId, classes) => {
    const skeleton = openingTagWithTestId(readSource(path), testId);

    expect(skeleton).toContain(`className="${classes}"`);
  });

  // Enmienda #67: el skeleton de Home se muda al hero compartido. Reserva el
  // alto de la fotografía por `style` —260 no tiene utilidad de Tailwind y la
  // clase arbitraria está prohibida— y no lleva radio, porque va a sangre.
  it('el skeleton del hero reserva el alto de la foto y no lleva radio en su tag de apertura (#120 R1)', () => {
    const skeleton = openingTagWithTestId(
      readSource(join('components', 'pet-hero-header.tsx')),
      'pet-hero-skeleton',
    );

    expect(skeleton).toContain('className="w-full"');
    expect(skeleton).toContain('style={{ height: PET_HERO_MEDIA_HEIGHT }}');
    expect(skeleton).not.toContain('rounded-');
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

  it('lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1)', () => {
    const reminders = readSource(join('screens', 'reminders', 'index.tsx'));

    for (const testId of ['pill-active', 'pill-week', 'pill-inactive']) {
      const pill = openingTagWithTestId(reminders, testId);

      expect(pill).toContain('rounded-xl');
    }
  });

  it('lleva los tres tiles restantes a rounded-xl', () => {
    expect(readSource(join('app', '(tabs)', 'food.tsx'))).toContain(
      'size-14 items-center justify-center rounded-xl bg-surface-secondary',
    );
    expect(readSource(join('screens', 'forgot', 'index.tsx'))).toContain( // #117 R10
      'size-16 items-center justify-center rounded-xl bg-accent-soft',
    );
    expect(readSource(join('screens', 'weight-log', 'index.tsx'))).toContain(
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
  it('elimina las siete flechas tipográficas de producción', () => {
    expect(filesMatching(/[←›]/)).toEqual([]);
  });

  it('profile usa cuatro ChevronRight de reicon', () => {
    const profile = readSource(join('screens', 'profile', 'index.tsx'));

    expect(profile).toContain(
      "import { ChevronRight } from 'reicon-react-native';",
    );
    expect(
      profile.match(/<ChevronRight size=\{20\} color=\{muted\} \/>/g),
    ).toHaveLength(3 + 1); // #41 R9
  });
});

describe('#62 R12: los TextInput crudos comparten una sola receta', () => {
  const textInputs = sourceFiles().flatMap((path) =>
    [...readFileSync(path, 'utf8').matchAll(/<TextInput\b[\s\S]*?\/>/g)].map(
      ([source]) => ({ path: path.slice(sourceRoot.length + 1), source }),
    ),
  );

  it('da color temático a los cinco placeholders', () => {
    const withPlaceholder = textInputs.filter(({ source }) =>
      /\bplaceholder=/.test(source),
    );

    expect(textInputs).toHaveLength(6);
    expect(withPlaceholder).toHaveLength(5);
    expect(
      withPlaceholder
        .filter(
          ({ source }) => !/\bplaceholderTextColor=\{muted\}/.test(source),
        )
        .map(({ path }) => path),
    ).toEqual([]);
  });

  it('elimina el borde duplicado de los seis campos', () => {
    expect(
      textInputs
        .filter(({ source }) => /\bborder border-border\b/.test(source))
        .map(({ path }) => path),
    ).toEqual([]);
  });
});

describe('#62 R13: el color imperativo sale siempre de useThemeColors del repo', () => {
  it('elimina useThemeColor de heroui en producción', () => {
    expect(filesMatching(/\buseThemeColor\b/)).toEqual([]);
  });

  it('resuelve el Lock de Forgot con accent-strong', () => {
    const forgot = readSource(join('screens', 'forgot', 'index.tsx')); // #117 R10

    expect(forgot).toContain(
      "import { useThemeColors } from '../../theme/use-theme-colors';",
    );
    expect(forgot).toContain(
      "const [accentStrong] = useThemeColors(['accent-strong']);",
    );
    expect(forgot).toContain('<Lock size={28} color={accentStrong} />');
  });
});

describe('#62 R14: toda esquina no-cápsula que dibuja el repo es continua', () => {
  const directUses = [
    [join('screens', 'forgot', 'index.tsx'), 1], // #117 R10
    [join('components', 'pet-hero-header.tsx'), 1],
    // #136 R3 and #138 R3: the quick action tiles and collar-pair-link spread
    // the corner inside their pressed style, so the Home keeps no direct use.
    // The row stays at 0 to lock that and the import.
    [join('screens', 'home', 'index.tsx'), 0],
    [join('screens', 'home', 'weekly-activity-chart.tsx'), 1],
    [join('screens', 'health', 'index.tsx'), 2],
    [join('app', '(tabs)', 'food.tsx'), 2],
    [join('screens', 'map', 'index.tsx'), 4],
    [join('screens', 'meal-schedule', 'index.tsx'), 1],
    [join('screens', 'weight-log', 'index.tsx'), 1],
    [join('screens', 'docs', 'index.tsx'), 1],
    [join('screens', 'profile', 'index.tsx'), 3 + 1], // #41 R9
    [join('screens', 'reminders', 'index.tsx'), 4],
    [join('screens', 'add-pet', 'index.tsx'), 5],
    [join('screens', 'add-reminder', 'index.tsx'), 3],
    [join('screens', 'pairing', 'index.tsx'), 2],
  ] as const;

  it('declara las dos constantes nativas compartidas', () => {
    const nativeStyles = readSource(join('theme', 'native-styles.ts'));

    expect(nativeStyles).toContain(
      "export const CONTINUOUS_CORNER = { borderCurve: 'continuous' } as const;",
    );
    expect(nativeStyles).toContain(
      "export const TABULAR_NUMS = {\n  fontVariant: ['tabular-nums'] as ['tabular-nums'],\n} as const;",
    );
  });

  it.each(directUses)('%s importa y aplica sus %i esquinas', (path, count) => {
    const source = readSource(path);
    const uses = [...source.matchAll(/style=\{CONTINUOUS_CORNER\}/g)];

    expect(source).toMatch(
      /import \{[^}]*\bCONTINUOUS_CORNER\b[^}]*\} from ['"].*theme\/native-styles['"];/,
    );
    expect(uses).toHaveLength(count);

    for (const use of uses) {
      const openingTag = source.slice(
        source.lastIndexOf('<', use.index),
        use.index,
      );

      expect(openingTag).not.toContain('rounded-full');
    }
  });

  it('fusiona la esquina una vez y la entrega a las dos ramas de Card', () => {
    const card = readSource(join('components', 'card.tsx'));

    expect(card).toContain(
      "import { CONTINUOUS_CORNER } from '../theme/native-styles';",
    );
    expect(card).toContain(
      'StyleSheet.flatten([CONTINUOUS_CORNER, style])',
    );
    expect(card.match(/style=\{mergedStyle\}/g)).toHaveLength(2);
    // #136 R3: minus one, the tiles' corner now travels in their pressed style.
    // #138 R3: minus one more, collar-pair-link's corner travels in its own.
    expect(
      directUses.reduce((total, [, count]) => total + count, 2),
    ).toBe(33 + 1 + 1 - 1 - 1 + 1); // #41 R9: geofences-link
  });
});

describe('#62 R15: todo contador usa cifras tabulares', () => {
  const HOME_TABULAR_AT_9358CC7 = 4;
  const HOME_TABULAR_DELTA_69 = 1;
  const HOME_TABULAR_DELTA_70 = 1;
  const HOME_TABULAR_DELTA_85 = 1;
  const HOME_TABULAR_DELTA_98 = 1;
  const counters = [
    [join('screens', 'map', 'index.tsx'), 3 + 1], // #116 R5
    [
      join('screens', 'home', 'index.tsx'),
      HOME_TABULAR_AT_9358CC7 +
        HOME_TABULAR_DELTA_69 +
        HOME_TABULAR_DELTA_70 +
        HOME_TABULAR_DELTA_85 +
        HOME_TABULAR_DELTA_98,
    ],
    [join('screens', 'home', 'weekly-activity-chart.tsx'), 4],
    [join('screens', 'health', 'index.tsx'), 2 + 1], // #115 R6
    [join('screens', 'weight-log', 'index.tsx'), 2],
    [join('screens', 'reminders', 'index.tsx'), 3],
    [join('screens', 'geofence-editor', 'index.tsx'), 1],
    [join('screens', 'meals-history', 'index.tsx'), 2], // #105 R11
  ] as const;

  it.each(counters)('%s aplica TABULAR_NUMS a sus %i valores', (path, count) => {
    const source = readSource(path);

    expect(source).toMatch(
      /import \{[^}]*\bTABULAR_NUMS\b[^}]*\} from ['"].*theme\/native-styles['"];/,
    );
    expect(source.match(/style=\{TABULAR_NUMS\}/g)).toHaveLength(count);
  });

  it('#69 R10: mantiene la base cerrada más los deltas medidos', () => {
    expect(counters.reduce((total, [, count]) => total + count, 0)).toBe(
      14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6
    );
  });

  it('#69 R14: conserva el único delta tabular declarado contra 9358cc7', () => {
    const home = readSource(join('screens', 'home', 'index.tsx'));
    const measured = home.match(/style=\{TABULAR_NUMS\}/g)?.length ?? 0;

    expect(measured - HOME_TABULAR_AT_9358CC7).toBe(
      HOME_TABULAR_DELTA_69 +
        HOME_TABULAR_DELTA_70 +
        HOME_TABULAR_DELTA_85 +
        HOME_TABULAR_DELTA_98,
    );
  });

  it('#70 R18: registra el delta tabular de la sección de recordatorios', () => {
    const home = readSource(join('screens', 'home', 'index.tsx'));
    const measured = home.match(/style=\{TABULAR_NUMS\}/g)?.length ?? 0;

    expect(
      measured - HOME_TABULAR_AT_9358CC7 - HOME_TABULAR_DELTA_69,
    ).toBe(
      HOME_TABULAR_DELTA_70 + HOME_TABULAR_DELTA_85 + HOME_TABULAR_DELTA_98,
    );
  });
});

describe('#98 R10: los candados que esta feature no mueve', () => {
  it('deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban', () => {
    const home = readSource(join('screens', 'home', 'index.tsx'));
    const food = readSource(join('app', '(tabs)', 'food.tsx'));
    const count = (pattern: RegExp) =>
      sourceFiles().reduce(
        (total, path) =>
          total + (readFileSync(path, 'utf8').match(pattern) ?? []).length,
        0,
      );

    // #136 R3: the tiles' corner moved into their pressed style, one direct
    // use less in the Home and in the repo.
    // #138 R3: collar-pair-link's corner moved too, so the Home has none left.
    // With no match, match() returns null: the ?? [] keeps the count readable.
    expect(home.match(/style=\{CONTINUOUS_CORNER\}/g) ?? []).toHaveLength(0);
    expect(food.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(2);
    expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1); // #41 R9: geofences-link
    expect(count(/rounded-xl bg-accent(?=[\s'"`])/g)).toBe(13 + 1 + 1 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7; #155 R3 // #158 R3: docs-upload
    expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1); // #147 R4: meal-time-edit y add-meal-time-button; #105 R11
    expect(home.match(/text-accent-strong\b/g)).toHaveLength(2);
    expect(food.match(/text-accent-strong\b/g)).toHaveLength(1);
    expect(filesMatching(/\brounded-(?:2xl|lg|md|sm)\b/)).toEqual([]);
  });
});

describe('#64 R9: el color categórico solo se nombra en el módulo de paleta', () => {
  function categoryClassInventory(): {
    files: string[];
    interpolatedFiles: string[];
    classes: string[];
  } {
    const palettePath = join('utils', 'category-palette.ts');
    const interpolatedFiles = sourceFiles()
      .filter((path) => {
        const executableSource = readFileSync(path, 'utf8')
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\/\/.*$/gm, '');

        return /(?:bg|text)-category-\$\{/.test(executableSource);
      })
      .map((path) => path.slice(sourceRoot.length + 1));
    const classes = [
      ...readSource(palettePath).matchAll(
        /['"]((?:bg|text)-category-[^'"]+)['"]/g,
      ),
    ].map(([, className]) => className);

    return {
      files: filesMatching(/bg-category-|text-category-/),
      interpolatedFiles,
      classes,
    };
  }

  it('centraliza las diez clases completas y prohíbe interpolarlas', () => {
    const inventory = categoryClassInventory();

    expect(inventory.files).toEqual([join('utils', 'category-palette.ts')]);
    expect(inventory.interpolatedFiles).toEqual([]);
    expect(inventory.classes).toEqual([
      'bg-category-blue',
      'text-category-blue-strong',
      'bg-category-amber',
      'text-category-amber-strong',
      'bg-category-green',
      'text-category-green-strong',
      'bg-category-violet',
      'text-category-violet-strong',
      'bg-category-rose',
      'text-category-rose-strong',
    ]);
  });

  // 17 en `303fc19` − 1 el que vivía en el `PetHero` local de Profile (#67 R6).
  // + 2 de #147 R4: meal-time-edit y add-meal-time-button.
  it('conserva los usos de bg-accent-soft que sí son acento', () => {
    const accentSoftCount = sourceFiles().reduce(
      (total, path) =>
        total + (readFileSync(path, 'utf8').match(/bg-accent-soft/g) ?? []).length,
      0,
    );
    const reminders = readSource(join('screens', 'reminders', 'index.tsx'));
    const docs = readSource(join('screens', 'docs', 'index.tsx'));

    expect(accentSoftCount).toBe(16 + 2 + 1); // #147 R4, #105 R11
    expect(reminders.match(/bg-accent-soft/g)).toHaveLength(1);
    expect(docs.match(/bg-accent-soft/g)).toBeNull();
  });
});

describe('#64 R10: la carta declara la paleta categórica y su tabla de huecos', () => {
  it('fija los seis huecos y el único módulo que escribe sus clases', () => {
    const guidelines = readFileSync(
      join(process.cwd(), '..', 'docs', 'ui-guidelines.md'),
      'utf8',
    );

    expect(guidelines).toContain(
      '| Hueco | Superficie | Tinta | Tipos que lo ocupan |',
    );
    expect(guidelines).toContain(
      '| azul | `bg-category-blue` | `text-category-blue-strong` | recordatorio `vaccine`; documento de vacunación |',
    );
    expect(guidelines).toContain(
      '| ámbar | `bg-category-amber` | `text-category-amber-strong` | recordatorio `medication`; documento de desparasitación |',
    );
    expect(guidelines).toContain(
      '| verde | `bg-category-green` | `text-category-green-strong` | recordatorio `appointment`; documento de consulta |',
    );
    expect(guidelines).toContain(
      '| violeta | `bg-category-violet` | `text-category-violet-strong` | recordatorio `deworming`; documento de análisis |',
    );
    expect(guidelines).toContain(
      '| rosa | `bg-category-rose` | `text-category-rose-strong` | recordatorio `food` |',
    );
    expect(guidelines).toContain(
      '| neutral | `bg-default` | `text-muted` | recordatorio `weight` y `custom`; cualquier tipo de documento desconocido |',
    );
    expect(guidelines).toContain(
      'El reparto vive en `src/utils/category-palette.ts` y es el **único** sitio donde',
    );
    expect(guidelines).toContain(
      'se escriben esos nombres de clase. El color nunca es el único portador de la',
    );
  });
});

describe('#98 R11: la carta y la spec de Food registran la enmienda', () => {
  it('declara la barra de comidas en la carta y retira D7 de mobile-food', () => {
    const amendments = [
      [
        readFileSync(
          join(process.cwd(), '..', 'docs', 'ui-guidelines.md'),
          'utf8',
        ),
        '## Enmienda #98 — la barra de comidas de la Home',
      ],
      [
        readFileSync(
          join(process.cwd(), '..', 'specs', 'mobile-food', 'requirements.md'),
          'utf8',
        ),
        '## Enmienda #98 — la comida servida deja de derivarse del reloj',
      ],
    ] as const;

    for (const [source, heading] of amendments) {
      expect(source).toContain(heading);
      expect(source.slice(source.indexOf(heading))).toMatch(
        /- \[[ xX]\] Enmienda aprobada por humano/,
      );
    }
  });
});
