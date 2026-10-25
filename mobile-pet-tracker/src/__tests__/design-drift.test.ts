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

describe('#178 R2: enmienda de fidelidad al canvas en Recordatorios', () => {
  const charter = readFileSync(join(process.cwd(), '..', 'docs', 'ui-guidelines.md'), 'utf8');
  const heading = '## Enmienda de fidelidad al canvas (2026-10-13)';

  it('A: conserva la sección, su firma, las directivas y el tamaño text-11', () => {
    expect(charter.split(heading)).toHaveLength(2);
    const section = charter.slice(charter.indexOf(heading) + heading.length);
    expect(section).toMatch(/- \[[ xX]\] Enmienda de fidelidad al canvas aprobada por humano/);
    expect(charter).toContain("- **Título en contenido (D-H).** El título de pantalla va dentro del contenido (eyebrow opcional y título); la cabecera nativa del stack queda con `title: ''` y solo aporta el botón de volver.");
    expect(charter).toContain('- **Iconos reicon (D-I).** Los iconos de la interfaz son componentes de `reicon-react-native` coloreados con un token vía `useThemeColors`; ningún emoji hace de icono. La superficie de categoría acompaña a un icono y a un texto.');
    expect(charter).toContain('- **Medidas del artboard.** Donde la escala no llega al valor del artboard se usa un token del `@theme` nombrado por su valor y listado en la regla 2 (tamaños y tracking) o en la regla 12 (radios); las clases con corchetes (regla 3) y los radios `2xl`, `lg`, `md` y `sm` (regla 12) siguen prohibidos, y las esquinas que no son cápsula siguen llevando `CONTINUOUS_CORNER`.');
    expect(charter).not.toContain('- Títulos de pantalla: header del stack cuando exista, no Text suelto.');
    expect(charter).not.toContain('la superficie siempre acompaña a un emoji y a un texto.');
    expect(charter.split("- Títulos de pantalla: título en contenido y cabecera nativa con `title: ''` (Enmienda de fidelidad al canvas).")).toHaveLength(2);
    expect(charter.split('la superficie siempre acompaña a un icono de reicon-react-native y a un texto.')).toHaveLength(2);
    const sizes = charter.split('\n').find((line) => line.trimStart().startsWith('Tamaños de letra fuera de la escala de Tailwind'));
    expect(sizes).toContain('`--text-11: 11px`');
  });

  it('B: enumera el tracking y los tres radios en sus reglas', () => {
    const tracking = charter.split('\n').find((line) => line.trimStart().startsWith('Tracking fuera de la escala de Tailwind'));
    expect(tracking).toContain('`--tracking-title: -0.02em`');
    const radios = charter.slice(charter.indexOf('12. **Escala de radios**'), charter.indexOf('13. **Botón con cuerpo**'));
    expect(radios).toContain('`rounded-14` (14 px)');
    expect(radios).toContain('`rounded-16` (16 px)');
    expect(radios).toContain('`rounded-22` (22 px)');
  });

  it('C: coloca la receta del chip seleccionado antes de Sin labio (enmendado por #197 R21)', () => {
    const buttons = charter.slice(charter.indexOf('13. **Botón con cuerpo**'));
    const chip = '    - **Chip seleccionado** (fidelidad al canvas, #178; labio por estilo, #197): cápsula `rounded-full bg-accent` con `style={chunkyLip.primaryCompact}`, un labio de 3 px que cuelga fuera del alto; el chip sin seleccionar no lleva labio.';
    expect(buttons.split(chip)).toHaveLength(2);
    expect(buttons.indexOf(chip)).toBeLessThan(buttons.indexOf('- **Sin labio**:'));
  });
});

describe('#179 R2: enmienda de fidelidad al canvas en Horario e Historial', () => {
  const charter = readFileSync(join(process.cwd(), '..', 'docs', 'ui-guidelines.md'), 'utf8');
  const heading = '## Enmienda de fidelidad al canvas (2026-10-13)';
  const radiusRule = 'Fuera de la escala, por fidelidad al canvas (#179): `rounded-10` (10 px), «Editar» de la fila de Horario; `rounded-14` (14 px), mosaico de la fila y botones de acción de Horario y horas del panel del día de Historial; `rounded-24` (24 px), resumen de Horario y calendario y panel del día de Historial, que son `View` y no `Card` porque `twMerge` no sustituye `rounded-card` por un radio con nombre de valor.';
  const actionRule = '    - **Secundarios de Horario** (fidelidad al canvas, #179; labio por estilo, #197): «Editar» `h-9 rounded-10 border-2 border-lip-gray bg-surface` con `style={chunkyLip.neutralCompact}` y «Añadir comida» `h-12.5 rounded-14 border-2 border-lip-gray bg-surface` con `style={chunkyLip.neutral}`, con el labio colgando fuera del alto; el resumen verde lleva `chunkyLip.summary`; «Generar plan» es tonal de la categoría violeta con `style={chunkyLip.violet}` (#200 R14).';

  it('conserva las directivas, las frases y los tres tamaños de Horario', () => {
    expect(charter.split(heading)).toHaveLength(2);
    expect(charter.slice(charter.indexOf(heading) + heading.length)).toMatch(/- \[[ xX]\] Enmienda de fidelidad al canvas aprobada por humano/);
    expect(charter).toContain("- **Título en contenido (D-H).** El título de pantalla va dentro del contenido (eyebrow opcional y título); la cabecera nativa del stack queda con `title: ''` y solo aporta el botón de volver.");
    expect(charter).toContain('- **Iconos reicon (D-I).** Los iconos de la interfaz son componentes de `reicon-react-native` coloreados con un token vía `useThemeColors`; ningún emoji hace de icono. La superficie de categoría acompaña a un icono y a un texto.');
    expect(charter).toContain('- **Medidas del artboard.** Donde la escala no llega al valor del artboard se usa un token del `@theme` nombrado por su valor y listado en la regla 2 (tamaños y tracking) o en la regla 12 (radios); las clases con corchetes (regla 3) y los radios `2xl`, `lg`, `md` y `sm` (regla 12) siguen prohibidos, y las esquinas que no son cápsula siguen llevando `CONTINUOUS_CORNER`.');
    expect(charter).not.toContain('- Títulos de pantalla: header del stack cuando exista, no Text suelto.');
    expect(charter).not.toContain('la superficie siempre acompaña a un emoji y a un texto.');
    expect(charter.split("- Títulos de pantalla: título en contenido y cabecera nativa con `title: ''` (Enmienda de fidelidad al canvas).")).toHaveLength(2);
    expect(charter.split('la superficie siempre acompaña a un icono de reicon-react-native y a un texto.')).toHaveLength(2);
    const sizes = charter.split('\n').find((line) => line.trimStart().startsWith('Tamaños de letra fuera de la escala de Tailwind'));
    expect(sizes).toContain('`--text-15: 15px`');
    expect(sizes).toContain('`--text-17: 17px`');
    expect(sizes).toContain('`--text-22: 22px`');
  });

  it('enumera el tracking y los radios exactos dentro de su regla', () => {
    const tracking = charter.split('\n').find((line) => line.trimStart().startsWith('Tracking fuera de la escala de Tailwind'));
    expect(tracking).toContain('`--tracking-title: -0.02em`');
    expect(tracking).toContain('`--tracking-caps: 0.06em`');
    const radios = charter.slice(charter.indexOf('12. **Escala de radios**'), charter.indexOf('13. **Botón con cuerpo**'));
    expect(radios).toContain('`rounded-10` (10 px)');
    expect(radios).toContain('`rounded-14` (14 px)');
    expect(radios).toContain('`rounded-24` (24 px)');
    expect(radios.split(radiusRule)).toHaveLength(2);
  });

  it('sitúa la receta de secundarios de Horario antes de Sin labio (enmendado por #197 R21) (enmendado por #200 R16)', () => {
    const actions = charter.slice(charter.indexOf('13. **Botón con cuerpo**'));
    expect(actions.split(actionRule)).toHaveLength(2);
    expect(actions.indexOf(actionRule)).toBeLessThan(actions.indexOf('- **Sin labio**:'));
  });
});

describe('#175 R2: enmienda de fidelidad al canvas', () => {
  const charter = readFileSync(join(process.cwd(), '..', 'docs', 'ui-guidelines.md'), 'utf8');
  const heading = '## Enmienda de fidelidad al canvas (2026-10-13)';

  it('incluye una sola sección de fidelidad al canvas', () => {
    expect(charter.split(heading)).toHaveLength(2);
  });

  it('conserva la casilla humana vacía o firmada bajo la sección', () => {
    const section = charter.slice(charter.indexOf(heading) + heading.length);
    expect(section).toMatch(/- \[[ xX]\] Enmienda de fidelidad al canvas aprobada por humano/);
  });

  it('incluye las tres directivas literales de fidelidad', () => {
    expect(charter).toContain("- **Título en contenido (D-H).** El título de pantalla va dentro del contenido (eyebrow opcional y título); la cabecera nativa del stack queda con `title: ''` y solo aporta el botón de volver.");
    expect(charter).toContain('- **Iconos reicon (D-I).** Los iconos de la interfaz son componentes de `reicon-react-native` coloreados con un token vía `useThemeColors`; ningún emoji hace de icono. La superficie de categoría acompaña a un icono y a un texto.');
    expect(charter).toContain('- **Medidas del artboard.** Donde la escala no llega al valor del artboard se usa un token del `@theme` nombrado por su valor y listado en la regla 2 (tamaños y tracking) o en la regla 12 (radios); las clases con corchetes (regla 3) y los radios `2xl`, `lg`, `md` y `sm` (regla 12) siguen prohibidos, y las esquinas que no son cápsula siguen llevando `CONTINUOUS_CORNER`.');
  });

  it('sustituye una sola vez las frases de títulos y paleta', () => {
    expect(charter).not.toContain('- Títulos de pantalla: header del stack cuando exista, no Text suelto.');
    expect(charter).not.toContain('la superficie siempre acompaña a un emoji y a un texto.');
    expect(charter.split("- Títulos de pantalla: título en contenido y cabecera nativa con `title: ''` (Enmienda de fidelidad al canvas).")).toHaveLength(2);
    expect(charter.split('la superficie siempre acompaña a un icono de reicon-react-native y a un texto.')).toHaveLength(2);
  });

  it('enumera text-11 y text-15 en la línea de tamaños', () => {
    const line = charter.split('\n').find((value) => value.trimStart().startsWith('Tamaños de letra fuera de la escala de Tailwind'));
    expect(line).toContain('`--text-11: 11px`');
    expect(line).toContain('`--text-15: 15px`');
  });

  it('enumera los dos tokens en la línea de tracking', () => {
    const line = charter.split('\n').find((value) => value.trimStart().startsWith('Tracking fuera de la escala de Tailwind'));
    expect(line).toContain('`--tracking-title: -0.02em`');
    expect(line).toContain('`--tracking-eyebrow: 0.08em`');
  });

  it('añade rounded-24 dentro de la regla de radios', () => {
    const radios = charter.slice(charter.indexOf('12. **Escala de radios**'), charter.indexOf('13. **Botón con cuerpo**'));
    expect(radios).toContain('`rounded-24` (24 px)');
  });
});

const HEX_LITERAL = String.raw`#(?!\d{2,3} R\d)[\da-f]{3,8}\b`;
const ARBITRARY_CLASS = String.raw`[A-Za-z0-9_-]+-\[[^\]]+\]`;
const SHADOW_ESCAPES = String.raw`shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:`;
const FEATURE_STYLE_ESCAPES = new RegExp(
  String.raw`text-\[10px\]|${HEX_LITERAL}|StyleSheet`,
  'i',
);
const PAIRING_STYLE_ESCAPES = new RegExp(
  String.raw`${HEX_LITERAL}|${ARBITRARY_CLASS}|StyleSheet\.create|${SHADOW_ESCAPES}`,
  'i',
);

describe('#193 R11: grep-clean de Inicio, Perfil y Recordatorios', () => {
  const featureFiles = [
    'screens/home/index.tsx',
    'screens/profile/index.tsx',
    'screens/reminders/index.tsx',
  ];

  it('mantiene las tres pantallas sin escapes de estilo literales', () => {
    const violations = featureFiles.flatMap((relativePath) => {
      const contents = readFileSync(join(sourceRoot, relativePath), 'utf8');
      return PAIRING_STYLE_ESCAPES.test(contents) ? [relativePath] : [];
    });

    expect(violations).toEqual([]);
  });
});

const MEALS_BAR_STYLE_ESCAPES = new RegExp(
  String.raw`${HEX_LITERAL}|${ARBITRARY_CLASS}|StyleSheet(?:\.create)?|${SHADOW_ESCAPES}`,
  'i',
);

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
    'meal-schedule',
    'health',
    'weight-log',
    'profile',
    'map',
  ])('%s importa el Card compartido (enmendado por #200 R1 y #200 R9)', (screen) => {
    const contents = readFileSync(
      join(sourceRoot, 'screens', screen, 'index.tsx'),
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
    'components/segmented-control.tsx', // #191 R11
    'screens/add-pet/index.tsx',
    'screens/docs/index.tsx',
    'screens/profile/index.tsx',
    'utils/theme-preference.ts',
  ];

  it('keeps arbitrary text, hex colors, and StyleSheet out of feature sources', () => {
    const violations = featureFiles.flatMap((relativePath) => {
      const contents = readFileSync(join(sourceRoot, relativePath), 'utf8');
      return FEATURE_STYLE_ESCAPES.test(contents)
        ? [relativePath]
        : [];
    });

    expect(violations).toEqual([]);
  });

  it('keeps the four Expo Router entrypoints thin', () => {
    const routes = [
      'app/(tabs)/home.tsx',
      'app/(tabs)/profile.tsx',
      'app/pets/add.tsx',
      'app/pets/[petId]/docs.tsx',
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
    'paddingHorizontal: 20',
    'insets.top + 8',
    'gap: 16',
    'insets.bottom + 24',
  ])('keeps the uniform screen metric %s (enmendado por #203 R2)', (metric) => {
    expect(pairingSource).toContain(metric);
  });

  it('#95 R6: pairing no reserva el inset superior ni la banda del FloatingTabBar', () => {
    expect(pairingSource).not.toContain('insets.top + 12');
    expect(pairingSource).not.toContain('insets.bottom + 96');
  });

  it('keeps pairing free of forbidden styling escapes', () => {
    expect(pairingSource).not.toMatch(PAIRING_STYLE_ESCAPES);
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
      return FEATURE_STYLE_ESCAPES.test(contents)
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
      return FEATURE_STYLE_ESCAPES.test(contents)
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
      return FEATURE_STYLE_ESCAPES.test(contents)
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
      return FEATURE_STYLE_ESCAPES.test(contents)
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
      return FEATURE_STYLE_ESCAPES.test(contents)
        ? [relativePath]
        : [];
    });

    expect(violations).toEqual([]);
  });
});

describe('#98 R10: la barra de comidas no mete drift de estilo', () => {
  const featureFiles = [
    'api/nutrition.ts',
    'api/types.ts',
    'i18n/catalog.ts',
    'screens/food/index.tsx',
    'screens/home/index.tsx',
  ];

  it('mantiene sus ficheros sin escapes de estilo literales (enmendado por #200 R1)', () => {
    const violations = featureFiles.flatMap((relativePath) => {
      const contents = readFileSync(join(sourceRoot, relativePath), 'utf8');
      return MEALS_BAR_STYLE_ESCAPES.test(contents)
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

  it('conserva crudos solo los tres ámbitos aún pendientes', () => {
    expect(rawEnumList).not.toContain('`pet.sex`');
    expect(rawEnumList).toContain('`document.type`');
    expect(rawEnumList).toContain('`foodType`');
    expect(rawEnumList).toContain('`activityLevel`');
    expect(rawEnumList).not.toContain('`device.connectivity`');
    expect(corollary).toContain('`pet.sex` se localiza desde #173 con `addPet.male` / `addPet.female`');
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

describe('#79 R1: expo-notifications queda declarada y fijada', () => {
  const packageJson = JSON.parse(
    readFileSync(join(projectRoot, 'package.json'), 'utf8'),
  ) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    jest?: { transformIgnorePatterns?: string[] };
  };

  it('declara la versión compatible con Expo SDK 57 como dependencia de producción', () => {
    expect(packageJson.dependencies?.['expo-notifications']).toBe('~57.0.19');
  });

  it('no duplica la dependencia ni añade una excepción literal de transformación', () => {
    expect(packageJson.devDependencies?.['expo-notifications']).toBeUndefined();
    expect(packageJson.jest?.transformIgnorePatterns?.join(' ')).not.toContain(
      'expo-notifications',
    );
  });
});

describe('#87 R19: use-' + 'api no deja huella', () => {
  const legacyModule = ['use', 'api'].join('-');
  const legacyIdentifier = ['use', 'Api'].join('');
  const screenSignOutCalls: Record<string, number> = {
    'screens/food/index.tsx': 0,
    'screens/health/index.tsx': 0,
    'screens/map/index.tsx': 0,
    'screens/meal-schedule/index.tsx': 2, // #147 R8: el 401 de la edición de franjas
    'screens/meals-history/index.tsx': 1, // #105 R15
    'screens/weight-log/index.tsx': 1,
    'screens/docs/index.tsx': 0, // #185 R10: solo selector y lectura
    'screens/docs-upload-form/index.tsx': 1, // #185 R10: la mutación conserva signOut
    'screens/alerts/index.tsx': 0,
    'screens/alert-detail/index.tsx': 0,
    'utils/alert-ack-outcome.ts': 1, // #134 R6
    'screens/geofences/index.tsx': 1,
    'screens/geofence-editor/index.tsx': 1,
    'screens/home/index.tsx': 0,
    'screens/pairing/index.tsx': 2,
    'screens/profile/index.tsx': 2,
    'screens/edit-profile/index.tsx': 1, // #194 R8
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

  it('keeps literal query keys out of every migrated screen (enmendado por #200 R1)', () => {
    const violations = Object.keys(screenSignOutCalls).filter((relativePath) =>
      /queryKey:\s*\[/.test(
        readFileSync(join(sourceRoot, relativePath), 'utf8'),
      ),
    );

    expect(violations).toEqual([]);
  });

  it('preserves every mutation sign-out with zero delta (enmendado por #200 R1)', () => {
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

describe('#94 R5: el umbral de frescura no vive en el móvil', () => {
  const productionFilesMatching = (pattern: RegExp) =>
    filesMatching(pattern).filter((path) => !/\.test\.tsx?$/.test(path));

  it('no declara el identificador STALE_SECONDS en producción', () => {
    expect(productionFilesMatching(/\bSTALE_SECONDS\b/)).toEqual([]);
  });

  it('no compara staleSeconds con ningún umbral', () => {
    expect(
      productionFilesMatching(
        /\bstaleSeconds\s*(?:<=|>=|<|>)|(?:<=|>=|<|>)\s*\bstaleSeconds\b/,
      ),
    ).toEqual([]);
  });
});

describe('#94 R10: la antigüedad de la posición se lee en un solo sitio', () => {
  const staleSecondsReads: Record<string, number> = {
    'api/types.ts': 1,
    'screens/map/index.tsx': 1,
  };

  it('inventaría cada lectura de staleSeconds en producción', () => {
    const actual = Object.fromEntries(
      allTypeScriptFiles(sourceRoot)
        .map((path) => ({
          path,
          relativePath: path
            .slice(sourceRoot.length + 1)
            .replace(/\\/g, '/'),
        }))
        .filter(
          ({ relativePath }) =>
            !/(^|\/)__tests__\//.test(relativePath) &&
            !/\.test\.tsx?$/.test(relativePath),
        )
        .map(({ path, relativePath }) => {
          const contents = readFileSync(path, 'utf8');

          return [
            relativePath,
            (contents.match(/\bstaleSeconds\b/g) ?? []).length,
          ] as const;
        })
        .filter(([, count]) => count >= 1),
    );

    expect(actual).toEqual(staleSecondsReads);
  });
});

describe('#108 R1: los patrones compartidos se declaran una sola vez', () => {
  const source = readFileSync(
    join(sourceRoot, '__tests__', 'design-drift.test.ts'),
    'utf8',
  );

  it.each([
    ['[\\d', 'a-f]{3,8}'].join(''),
    ['shadowColor|shadowOffset', '|shadowOpacity|shadowRadius'].join(''),
  ])('declara una sola vez %s', (needle) => {
    expect(source.split(needle).length - 1).toBe(1);
  });
});

describe('#108 R2: el guard de estilo distingue un R-id de un color hex', () => {
  it.each([
    [
      "describe('#106 R2: la barra de comidas transiciona su ancho', () => {",
      false,
    ],
    [
      "describe('#98 R10: la barra de comidas no mete drift de estilo', () => {",
      false,
    ],
    ['#fff', true],
    ['#1DA868', true],
    ['#000', true],
    ['backgroundColor: #1DA868;', true],
    ['ver el hilo #106, gracias', true],
    ['#106 R2 usa el token y no #fff', true],
  ])('%s', (sample, expected) => {
    expect(FEATURE_STYLE_ESCAPES.test(sample)).toBe(expected);
    expect(PAIRING_STYLE_ESCAPES.test(sample)).toBe(expected);
    expect(MEALS_BAR_STYLE_ESCAPES.test(sample)).toBe(expected);
  });
});

describe('#108 R3: los títulos de #106 vuelven a ser literales enteros', () => {
  const homeTestSource = readFileSync(
    join(sourceRoot, 'screens', 'home', 'index.test.tsx'),
    'utf8',
  );

  it.each([
    "describe('#106 R2: la barra de comidas transiciona su ancho'",
    "describe('#106 R3: reduce motion deja la barra sin animación'",
  ])('contiene %s', (title) => {
    expect(homeTestSource).toContain(title);
  });

  it('no parte el prefijo de #106', () => {
    const splitTitlePrefix = ["'#' + '", '106'].join('');

    expect(homeTestSource).not.toContain(splitTitlePrefix);
  });
});

describe('#108 R4: la convención de cita del guard está documentada', () => {
  const conventions = readFileSync(
    join(projectRoot, '..', 'docs', 'conventions.md'),
    'utf8',
  );
  const start = conventions.indexOf(
    '### Prefijo de feature cuando un fichero acumula R-ids de dos specs',
  );
  const end = conventions.indexOf('\n### ', start + 1);
  const section = conventions.slice(start, end);

  it('documenta el guard y la forma canónica', () => {
    expect(section).toContain('design-drift.test.ts');
    expect(section).toContain('`#108 R1`');
  });
});

describe('#146 R17: el centro por defecto del mapa vive en un solo sitio', () => {
  const productionFilesMatching = (pattern: RegExp) =>
    filesMatching(pattern).filter((path) => !/\.test\.tsx?$/.test(path));

  it('declara DEFAULT_CENTER solo en el componente del mapa', () => {
    expect(productionFilesMatching(/\bconst DEFAULT_CENTER\b/)).toEqual([join('components', 'pet-map.tsx')]);
  });
  it('escribe las coordenadas por defecto solo en el componente del mapa', () => {
    expect(productionFilesMatching(/19\.4326|-99\.1332/)).toEqual([join('components', 'pet-map.tsx')]);
  });
});


describe('#105 R15: meals history keeps the approved styling boundaries', () => {
  const featureFiles = [
    'app/meals-history.tsx',
    'screens/meals-history/index.tsx',
    'utils/month-grid.ts',
  ];

  it('keeps the three new sources free of styling escapes', () => {
    const violations = featureFiles.flatMap(relativePath =>
      MEALS_BAR_STYLE_ESCAPES.test(readFileSync(join(sourceRoot, relativePath), 'utf8'))
        ? [relativePath]
        : [],
    );
    expect(violations).toEqual([]);
  });
});

describe('#118 R11: la bienvenida no mete drift de estilo', () => {
  const featureFiles = ['src/app/welcome.tsx', 'src/screens/welcome/index.tsx'];

  it('mantiene sus ficheros sin escapes de estilo literales', () => {
    const violations = featureFiles.flatMap((relativePath) => {
      const source = readFileSync(join(projectRoot, relativePath), 'utf8');
      expect(source).not.toMatch(/expo-linear-gradient|expo-symbols/);
      expect(source).not.toMatch(/\buseThemeColor\b|\p{Extended_Pictographic}/u);
      return MEALS_BAR_STYLE_ESCAPES.test(source) ||
        /\brounded-(?:2xl|lg|md|sm)\b|text-accent(?![-\w])/.test(source)
        ? [relativePath]
        : [];
    });
    expect(violations).toEqual([]);
  });
});

describe('#149 R4: solo cuatro ficheros de producción navegan a login', () => {
  const loginRoutes: Record<string, number> = {
    'screens/register/index.tsx': 1,
    'screens/forgot/index.tsx': 2, // #172 R17: forgot-back
    'screens/reset-password/index.tsx': 3, // #172 R19: link-login del formulario
    'screens/welcome/index.tsx': 1,
  };

  it('#149 R4: inventaría cada ruta a login en producción', () => {
    const actual = Object.fromEntries(
      allTypeScriptFiles(sourceRoot)
        .map((path) => ({
          path,
          relativePath: path
            .slice(sourceRoot.length + 1)
            .replace(/\\/g, '/'),
        }))
        .filter(
          ({ relativePath }) =>
            !/(^|\/)__tests__\//.test(relativePath) &&
            !/\.test\.tsx?$/.test(relativePath),
        )
        .map(({ path, relativePath }) => {
          const contents = readFileSync(path, 'utf8');

          return [
            relativePath,
            (contents.match(/['"`]\/(?:\(auth\)\/)?login\b/g) ?? []).length,
          ] as const;
        })
        .filter(([, count]) => count >= 1),
    );

    expect(actual).toEqual(loginRoutes);
  });
});


describe('#152 R9: el movimiento de la Home no mete drift de estilo', () => {
  const featureFiles = [
    'theme/motion.ts',
    'screens/home/home-entrance.tsx',
    'screens/home/collar-battery-bar.tsx',
    'screens/home/index.tsx',
  ];

  it('mantiene sus ficheros sin escapes de estilo literales', () => {
    const violations = featureFiles.flatMap((relativePath) => {
      const contents = readFileSync(join(sourceRoot, relativePath), 'utf8');
      return MEALS_BAR_STYLE_ESCAPES.test(contents)
        ? [relativePath]
        : [];
    });

    expect(violations).toEqual([]);
  });
});

describe('#134 R6: el resultado del ack se clasifica en un solo sitio', () => {
  it.each([
    'screens/alerts/index.tsx',
    'screens/alert-detail/index.tsx',
  ])('%s delega la clasificación del ack', (file) => {
    const source = readFileSync(join(sourceRoot, file), 'utf8');

    expect({
      file,
      cases: source.split("case '").length - 1,
      unreachable: source.split("t('common.cannotReachServer')").length - 1,
      signOut: source.split('signOut(').length - 1,
      settle: source.split('settleAlertAck(').length - 1,
      request: source.split('ackAlert(baseUrl').length - 1,
    }).toEqual({ file, cases: 0, unreachable: 0, signOut: 0, settle: 1, request: 1 });
  });
});

describe('#134 R7: el ack no toca la caché de la lista', () => {
  it('mantiene cero referencias a la caché en el helper y las pantallas', () => {
    for (const file of [
      'utils/alert-ack-outcome.ts',
      'screens/alerts/index.tsx',
      'screens/alert-detail/index.tsx',
    ]) {
      const source = readFileSync(join(sourceRoot, file), 'utf8');

      expect({
        file,
        refs: source.match(/alertKeys|invalidateQueries|setQueryData|useQueryClient|queryClient/g) ?? [],
      }).toEqual({ file, refs: [] });
    }
  });
});

describe('#167 R1: las rutas de login y registro son delgadas', () => {
  it('#167 R1: cada ruta solo renderiza su pantalla', () => {
    expect(readFileSync(join(sourceRoot, 'app', '(auth)', 'login.tsx'), 'utf8')).toBe(
      `import { LoginScreen } from '../../screens/login';

export default function LoginRoute() {
  return <LoginScreen />;
}
`,
    );
    expect(readFileSync(join(sourceRoot, 'app', '(auth)', 'register.tsx'), 'utf8')).toBe(
      `import { RegisterScreen } from '../../screens/register';

export default function RegisterRoute() {
  return <RegisterScreen />;
}
`,
    );
  });
});

describe('#167 R14: las pantallas de cuenta no traen deriva', () => {
  const featureFiles = [
    'app/(auth)/login.tsx',
    'app/(auth)/register.tsx',
    'screens/login/index.tsx',
    'screens/register/index.tsx',
    'screens/forgot/index.tsx',
    'screens/reset-password/index.tsx',
    'screens/welcome/index.tsx',
    'screens/home/home-entrance.tsx',
    'components/pop-in.tsx',
    'theme/motion.ts',
    'components/back-button.tsx',
    'components/form-error.tsx',
    'components/pingo-float.tsx',
    'components/password-input.tsx',
  ];

  it('#167 R14: sin hex, clases arbitrarias, StyleSheet ni sombras sueltas', () => {
    expect(featureFiles.filter((file) =>
      MEALS_BAR_STYLE_ESCAPES.test(readFileSync(join(sourceRoot, file), 'utf8')),
    )).toEqual([]);
  });

  it('#167 R14: sin radios fuera de la escala', () => {
    expect(featureFiles.filter((file) =>
      /\brounded-(?:2xl|lg|md|sm)\b/.test(readFileSync(join(sourceRoot, file), 'utf8')),
    )).toEqual([]);
  });

  it('#167 R14: sin text-accent suelto', () => {
    expect(featureFiles.filter((file) =>
      /text-accent(?![-\w])/.test(readFileSync(join(sourceRoot, file), 'utf8')),
    )).toEqual([]);
  });

  it('#167 R14: sin dependencias vetadas, useThemeColor ni emoji', () => {
    expect(featureFiles.filter((file) =>
      /expo-linear-gradient|expo-symbols|lottie-react-native|@rive-app|\buseThemeColor\b|\p{Extended_Pictographic}/u
        .test(readFileSync(join(sourceRoot, file), 'utf8')),
    )).toEqual([]);
  });
});

describe('#171 R13: sin drift en la celebración', () => {
  it.each([
    'src/components/celebration.tsx',
    'src/components/__tests__/celebration.test.tsx',
    'src/theme/motion.ts',
  ])('R13.1 %s no deja escapes de estilo', (relativePath) => {
    const source = readFileSync(join(projectRoot, relativePath), 'utf8');
    expect(source).not.toMatch(MEALS_BAR_STYLE_ESCAPES);
  });

  it('R13.2 la fuente no usa LayoutAnimation ni entering/exiting', () => {
    const source = readFileSync(join(projectRoot, 'src/components/celebration.tsx'), 'utf8');
    expect(source).not.toMatch(/LayoutAnimation|entering=|exiting=/);
  });
});

describe('#175 R10: Documentos sin deriva', () => {
  const featureFiles = ['screens/docs/index.tsx', 'screens/docs-upload-form/index.tsx']; // #185 R10

  it('no deja hex, clases arbitrarias, StyleSheet ni sombras sueltas', () => {
    expect(featureFiles.filter((file) =>
      MEALS_BAR_STYLE_ESCAPES.test(readFileSync(join(sourceRoot, file), 'utf8')),
    )).toEqual([]);
  });

  it('usa solo los radios card, xl, full, 24 y 16', () => {
    expect(featureFiles.filter((file) =>
      /\brounded-(?!(?:card|xl|full|24|16)\b)[\w-]+/.test(readFileSync(join(sourceRoot, file), 'utf8')), // #177 R10
    )).toEqual([]);
  });

  it('no deja text-accent suelto', () => {
    expect(featureFiles.filter((file) =>
      /text-accent(?![-\w])/.test(readFileSync(join(sourceRoot, file), 'utf8')),
    )).toEqual([]);
  });

  it('no trae dependencias vetadas, useThemeColor ni emoji', () => {
    expect(featureFiles.filter((file) =>
      /expo-linear-gradient|expo-symbols|lottie-react-native|@rive-app|\buseThemeColor\b|\p{Extended_Pictographic}/u
        .test(readFileSync(join(sourceRoot, file), 'utf8')),
    )).toEqual([]);
  });

  it('importa exactamente los tres iconos desde un único import de reicon', () => {
    const source = readFileSync(join(sourceRoot, featureFiles[0]), 'utf8');
    const imports = [...source.matchAll(/import\s*\{([^}]+)\}\s*from ['"]reicon-react-native['"]/g)];
    expect(source.match(/from ['"]reicon-react-native['"]/g)).toHaveLength(1);
    expect(imports).toHaveLength(1);
    expect(imports[0][1].split(',').map((name) => name.trim()).sort()).toEqual([
      'ChevronRight', 'FileText', 'Upload',
    ]);
  });
});

describe('#178 R13: Recordatorios sin deriva', () => {
  const featureFiles = [
    'screens/reminders/index.tsx',
    'screens/add-reminder/index.tsx',
    'utils/reminder-meta.ts',
  ];
  const reminders = readFileSync(join(sourceRoot, featureFiles[0]), 'utf8');
  const addReminder = readFileSync(join(sourceRoot, featureFiles[1]), 'utf8');

  it('no deja emoji en las dos pantallas ni en los metadatos', () => {
    expect(featureFiles.filter((file) =>
      /\p{Extended_Pictographic}/u.test(readFileSync(join(sourceRoot, file), 'utf8')),
    )).toEqual([]);
  });

  it('importa exactamente los iconos prescritos desde un único import de reicon', () => {
    const expected: Record<string, string[]> = {
      'screens/reminders/index.tsx': ['Plus', 'Trash'],
      'screens/add-reminder/index.tsx': ['Bell', 'Calendar', 'Clock'],
      'utils/reminder-meta.ts': ['Drop', 'ForkKnife', 'Pill', 'PinTack', 'Stethoscope', 'Syringe', 'Weight'],
    };
    for (const [file, icons] of Object.entries(expected)) {
      const source = readFileSync(join(sourceRoot, file), 'utf8');
      const imports = [...source.matchAll(/import\s*\{([^}]+)\}\s*from ['"]reicon-react-native['"]/g)];
      expect(source.match(/from ['"]reicon-react-native['"]/g)).toHaveLength(1);
      expect(imports).toHaveLength(1);
      expect(imports[0][1].split(',').map((name) => name.trim()).filter((name) => !name.startsWith('type ')).sort()).toEqual(icons);
    }
  });

  it('no deja escapes de estilo, radios vetados ni text-accent suelto', () => {
    expect(featureFiles.filter((file) => {
      const source = readFileSync(join(sourceRoot, file), 'utf8');
      return MEALS_BAR_STYLE_ESCAPES.test(source)
        || /\brounded-(?:2xl|lg|md|sm)\b|text-accent(?![-\w])/.test(source);
    })).toEqual([]);
  });

  it('reutiliza HomeEntrance y PopIn sin Card en Recordatorios (enmendado por #204 R6)', () => {
    expect(reminders).toContain("from '../../components/rise-in'");
    expect(reminders).not.toContain('home-entrance');
    expect(reminders).toContain("from '../../components/pop-in'");
    expect(reminders).not.toContain('<Card');
    expect(reminders).not.toContain('components/card');
  });

  it('conserva una sola etiqueta Nuevo con su receta de texto', () => {
    expect(reminders.split('<Button.Label className="text-sm font-extrabold text-accent-foreground">')).toHaveLength(2);
  });

  it('sitúa la vista previa después de Aviso y antes de Guardar', () => {
    const alert = addReminder.indexOf("t('addReminder.alert')");
    const preview = addReminder.indexOf('testID="add-reminder-preview"');
    const submit = addReminder.indexOf('testID="add-reminder-submit"');
    expect(alert).toBeGreaterThanOrEqual(0);
    expect(preview).toBeGreaterThan(alert);
    expect(preview).toBeLessThan(submit);
  });

  it('no recupera uppercase ni tracking-widest en Nuevo recordatorio', () => {
    expect(addReminder).not.toMatch(/uppercase|tracking-widest/);
  });

  it('reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto (enmendado por #177 R10) (enmendado por #200 R9) (enmendado por #199 R14) (enmendado por #199 R18) (enmendado por #198 R9) (enmendado por #203 R4) (enmendado por #203 R6) (enmendado por #203 R7) (enmendado por #204 R8) (enmendado por #204 R9) (enmendado por #202 R18) (enmendado por #196 R5) (enmendado por #201 R5, R13)', () => {
    for (const [pattern, count] of [
      [/\brounded-14\b/g, 2], [/\brounded-16\b/g, 5], [/\brounded-22\b/g, 1],
    ] as const) {
      expect(reminders.match(pattern) ?? []).toHaveLength(count);
    }
    const outsideReminders = (pattern: RegExp) => sourceFiles(sourceRoot).filter((file) =>
      file !== join(sourceRoot, featureFiles[0])
      && !/\.test\.tsx?$/.test(file)
      && pattern.test(readFileSync(file, 'utf8')),
    ).map((file) => file.slice(sourceRoot.length + 1));
    expect(outsideReminders(/\brounded-22\b/)).toEqual(['screens/pairing/index.tsx']); // #203 R4
    const rounded16 = Object.fromEntries(sourceFiles(sourceRoot).filter(file => file !== join(sourceRoot, featureFiles[0]) && !/\.test\.tsx?$/.test(file)).flatMap(file => {
      const count = (readFileSync(file, 'utf8').match(/\brounded-16\b/g) ?? []).length;
      return count ? [[file.slice(sourceRoot.length + 1), count]] : [];
    }));
    expect(rounded16).toEqual({
      'components/celebration.tsx': 2,
      'components/empty-state.tsx': 1,
      'screens/add-pet/index.tsx': 2, // #191 R11
      'screens/add-reminder/index.tsx': 1,
      'screens/alert-detail/index.tsx': 2,
      'screens/docs-upload-form/index.tsx': 2,
      'screens/edit-profile/index.tsx': 1, // #194 R6
      'screens/food/index.tsx': 2, // #200 R9
      'screens/forgot/index.tsx': 3,
      'screens/geofence-editor/index.tsx': 4, // #189 R13; #202 R18: +1
      'screens/geofences/index.tsx': 2, // #189 R7
      'screens/health/index.tsx': 1, // #199 R14
      'screens/home/index.tsx': 1,
      'screens/home/weekly-activity-chart.tsx': 1, // #198 R9
      'screens/login/index.tsx': 1,
      'screens/map/index.tsx': 1, // #201 R13
      'screens/pairing/index.tsx': 4, // #203 R6; #203 R7
      'screens/register/index.tsx': 1,
      'screens/reset-password/index.tsx': 1,
      'screens/weight-log/index.tsx': 1,
      'screens/welcome/index.tsx': 2,
    });
    expect(outsideReminders(/\brounded-14\b/)).toEqual([
      join('components', 'segmented-control.tsx'), // #191 R11
      join('screens', 'geofences', 'index.tsx'), // #189 R5
      join('screens', 'health', 'index.tsx'), // #199 R18
      join('screens', 'map', 'index.tsx'), // #201 R5
      join('screens', 'meal-schedule', 'index.tsx'), // #179 R13 comparte rounded-14
      join('screens', 'meals-history', 'index.tsx'), // #179 R13 comparte rounded-14
      join('screens', 'pairing', 'index.tsx'), // #188 R20 comparte rounded-14
      join('screens', 'profile', 'index.tsx'), // #196 R5
    ]);
  });
});

describe('#179 R13: Horario e Historial fieles al canvas', () => {
  const readSource = (name: string) => readFileSync(join(sourceRoot, 'screens', name, 'index.tsx'), 'utf8');
  const schedule = readSource('meal-schedule');
  const history = readSource('meals-history');
  const sources = [schedule, history];

  it('mantiene ambas pantallas sin emojis', () => {
    for (const source of sources) expect(source).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('importa exactamente los iconos reicon del artboard', () => {
    expect(schedule.match(/^import \{.*\} from 'reicon-react-native';$/gm)).toEqual([
      "import { Clock, Sparkles } from 'reicon-react-native';",
    ]);
    expect(history.match(/^import \{.*\} from 'reicon-react-native';$/gm)).toEqual([
      "import { ChevronLeft, ChevronRight } from 'reicon-react-native';",
    ]);
  });

  it('no permite escapes de estilo, sombras, radios prohibidos ni acento sin contraste', () => {
    const forbidden = new RegExp(
      String.raw`${HEX_LITERAL}|${ARBITRARY_CLASS}|StyleSheet|shadow|elevation|\brounded-(?:2xl|lg|md|sm)\b|\btext-accent\b(?!-)`,
      'i',
    );
    for (const source of sources) expect(source).not.toMatch(forbidden);
  });

  it('reutiliza entrada, paleta, esquinas y margen táctil compartidos (enmendado por #200 R15)', () => {
    expect(schedule).toContain("import { RiseIn } from '../../components/rise-in';");
    expect(schedule).toContain("import { CATEGORY_SLOTS } from '../../utils/category-palette';");
    expect(schedule).toContain("import { TOUCH_SLOP } from '../../theme/touch-target';");
    expect(history).toContain("import { RiseIn } from '../../components/rise-in';");
    expect(history).toContain("import { TOUCH_SLOP } from '../../theme/touch-target';");
    expect(history).toContain("import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../../theme/native-styles';");
  });

  it('limita los márgenes táctiles a Editar y las dos flechas', () => {
    expect(schedule.match(/hitSlop=\{TOUCH_SLOP\}/g)).toHaveLength(1);
    expect(history.match(/hitSlop=\{TOUCH_SLOP\}/g)).toHaveLength(2);
  });

  it('reserva Card flat para la fila y evita la variante accent', () => {
    expect(history).not.toContain('<Card');
    expect(history).not.toContain('components/card');
    expect(schedule.match(/variant="flat"/g)).toHaveLength(1);
    expect(schedule).not.toContain('variant="accent"');
  });

  it('reserva mayúsculas para el eyebrow sin tracking-widest', () => {
    expect(schedule.match(/\buppercase\b/g)).toHaveLength(1);
    expect(schedule).not.toContain('tracking-widest');
  });

  it('sitúa el título antes del resumen y los errores antes de las acciones (enmendado por #200 R12)', () => {
    for (const anchor of ['testID="generate-plan-error"', 'testID="meal-schedule-actions"', 'testID="meal-schedule-header"', 'testID="meal-schedule-summary"']) {
      expect(schedule).toContain(anchor);
    }
    expect(schedule.indexOf('testID="generate-plan-error"')).toBeLessThan(schedule.indexOf('testID="meal-schedule-actions"'));
    expect(schedule.indexOf('testID="meal-schedule-header"')).toBeLessThan(schedule.indexOf('testID="meal-schedule-summary"'));
  });

  it('limita text-22 a Horario y text-17 al inventario de E1.2 (enmendado por #177 R10) (enmendado por #200 R5) (enmendado por #198 R15)', () => {
    const productionFilesMatching = (pattern: RegExp) => filesMatching(pattern).filter(path => !/\.test\.tsx?$/.test(path)).sort();
    expect(productionFilesMatching(/\btext-22\b/)).toEqual([
      'components/empty-state.tsx', // #198 R15
      join('screens', 'alert-detail', 'index.tsx'), // #180 R3
      join('screens', 'meal-schedule', 'index.tsx'),
    ]);
    expect(productionFilesMatching(/\btext-17\b/)).toEqual([
      'components/celebration.tsx',
      'components/empty-state.tsx',
      'screens/add-pet/index.tsx',
      'screens/add-reminder/index.tsx',
      'screens/alert-detail/index.tsx',
      'screens/docs-upload-form/index.tsx',
      'screens/edit-profile/index.tsx',
      'screens/food/index.tsx',
      'screens/forgot/index.tsx',
      'screens/geofence-editor/index.tsx',
      'screens/geofences/index.tsx',
      'screens/home/index.tsx',
      'screens/login/index.tsx',
      'screens/meal-schedule/index.tsx',
      'screens/pairing/index.tsx',
      'screens/register/index.tsx',
      'screens/reminders/index.tsx',
      'screens/reset-password/index.tsx',
      'screens/weight-log/index.tsx',
      'screens/welcome/index.tsx',
    ]);
  });

  it('fija el número de radios del resumen, mosaico, acciones y paneles', () => {
    for (const [pattern, count] of [[/\brounded-24\b/g, 1], [/\brounded-14\b/g, 3], [/\brounded-10\b/g, 1]] as const) {
      expect(schedule.match(pattern)).toHaveLength(count);
    }
    expect(history.match(/\brounded-24\b/g)).toHaveLength(2);
    expect(history.match(/\brounded-14\b/g)).toHaveLength(1);
  });

  it('ancla las tres etiquetas Text con los literales de E2.3', () => {
    for (const label of [
      '<Text className="text-13 font-extrabold text-foreground">',
      '<Text className="text-15 font-extrabold text-foreground">',
      '<Text className={`text-15 font-extrabold ${CATEGORY_SLOTS.violet.ink}`}>',
    ]) {
      expect(schedule.split(label)).toHaveLength(2);
    }
  });
});

it('#180 R7.4: el detalle usa rounded-16 dos veces y ningún rounded-22 ni rounded-14', () => {
  const source = readFileSync(join(sourceRoot, 'screens', 'alert-detail', 'index.tsx'), 'utf8');
  expect(source.match(/\brounded-16\b/g) ?? []).toHaveLength(2);
  expect(source.match(/\brounded-22\b/g) ?? []).toHaveLength(0);
  expect(source.match(/\brounded-14\b/g) ?? []).toHaveLength(0);
});

describe('#185 R10: el formulario pertenece a la lista A11', () => {
  it.each(['conventions.md', 'ui-guidelines.md'])('%s declara docs-upload bajo cabecera nativa', (file) => {
    const source = readFileSync(join(projectRoot, '..', 'docs', file), 'utf8');
    const start = source.indexOf('Excepción nombrada (enmienda A11');
    const end = source.indexOf('Su', start);
    expect(start).toBeGreaterThan(-1);
    expect(source.slice(start, end)).toContain('`pets/[petId]/docs-upload`');
  });
});
