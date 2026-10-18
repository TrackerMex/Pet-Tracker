interface DirectoryEntry {
  name: string;
  isDirectory: () => boolean;
}

declare function require(moduleName: 'fs'): {
  readdirSync: (path: string, options: { withFileTypes: true }) => DirectoryEntry[];
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const repositoryRoot = join(process.cwd(), '..');
const readRepository = (path: string) => readFileSync(join(repositoryRoot, path), 'utf8');
const collapse = (value: string) => value.replace(/\s+/g, ' ');

const AMENDED_DOCS = [
  {
    "file": "docs/ui-guidelines.md",
    "feature": "ui-guidelines",
    "change": "ver «Cambios en la carta» de #174 R11.2",
    "anchors": []
  },
  {
    "file": "specs/mobile-alerts-center/requirements.md",
    "feature": "mobile-alerts-center",
    "change": "#78 R3: alerts.daysAgo con palabra completa y alerts.dayAgo nueva; #78 R4: título en el contenido, padding lateral 20 y gap 12; #78 R6: la fila toma las medidas del artboard (disco de categoría, icono 22, subtítulo en una línea, ack compacto con labio)",
    "anchors": [
      "### R3 — catálogo: las catorce claves nuevas, en los dos idiomas",
      "### R4 — pantalla: cuerpo, dimensiones y estados",
      "### R6 — anatomía de la fila (elemento repetido: todas sus decisiones, candadas)"
    ]
  },
  {
    "file": "specs/mobile-reminders-alerts-to-stack/requirements.md",
    "feature": "mobile-reminders-alerts-to-stack",
    "change": "#114 R4: alerts declara title vacío; #114 R5: en Alertas el título vuelve al contenido como Text de peso 900; #114 R6: Alertas usa padding lateral 20 y gap 12",
    "anchors": [
      "### R4 — Cabecera nativa con el look de #95",
      "### R5 — El título sale del cuerpo",
      "### R6 — Métricas bajo cabecera nativa (A11)"
    ]
  },
  {
    "file": "specs/mobile-alerts-grouped-and-detail-map/requirements.md",
    "feature": "mobile-alerts-grouped-and-detail-map",
    "change": "#170 R3: secciones con gap-3 y cabecera text-13 extrabold con tracking-caps; #170 R4: el contador entra en la fila del título con PopIn; #170 R5: el disco de la fila toma la superficie de categoría",
    "anchors": [
      "- **R3 — Secciones en la lista.**",
      "- **R4 — Contador «N nuevas».**",
      "- **R5 — Severidad en la fila.**"
    ]
  },
  {
    "file": "specs/mobile-alert-detail-screen/requirements.md",
    "feature": "mobile-alert-detail-screen",
    "change": "#100 R6: la columna de texto de la fila pasa a dos hijos (tipo y subtítulo) con justify-center y gap-0.5",
    "anchors": [
      "### R6 — La columna de texto de cada fila abre su detalle"
    ]
  },
  {
    "file": "specs/mobile-chunky-cta/requirements.md",
    "feature": "mobile-chunky-cta",
    "change": "#166 R3: el ack de fila de Alertas es secundario compacto (h-8.5, rounded-10, border-b-5) y entra en el inventario de secundarios neutros",
    "anchors": [
      "### R3. El secundario neutro lleva el labio gris"
    ]
  }
] as const;


function canonicalAmendment(feature: string, change: string): string {
  const design = readRepository('specs/mobile-alerts-canvas-fidelity/design.md');
  const fence = '```markdown\n## Enmienda #174 — Alertas fieles al canvas';
  const start = design.indexOf(fence);
  expect(start).toBeGreaterThan(-1);
  const body = design.slice(start + '```markdown\n'.length);
  const block = body.slice(0, body.indexOf('\n```'))
    .replace('<FEATURE>', feature).replace('<QUÉ CAMBIA>', change);
  return block.slice(0, block.indexOf('\n- [ ] Enmienda #174 aprobada por humano')).trimEnd();
}

describe('#174 R11: enmiendas', () => {
  it.each(AMENDED_DOCS)('$file contiene su bloque canónico y firma', ({ file, feature, change }) => {
    const source = readRepository(file);
    expect(source).toContain(canonicalAmendment(feature, change));
    expect(source).toMatch(/- \[[ xX]\] Enmienda #174 aprobada por humano/);
  });

  it.each(AMENDED_DOCS.filter(({ anchors }) => anchors.length > 0))('$file marca cada requisito enmendado', ({ file, feature, anchors }) => {
    const source = collapse(readRepository(file));
    const marker = feature === 'mobile-alerts-grouped-and-detail-map'
      ? '_(Enmendado por #174.)_'
      : '> Enmendado por #174 (ver «Enmienda #174» al final).';
    for (const anchor of anchors) expect(source).toContain(`${anchor} ${marker}`);
  });
});

describe('#174 R11: la carta declara los cambios', () => {
  const guidelines = readRepository('docs/ui-guidelines.md');
  const flat = collapse(guidelines);

  it('declara una sola sección de fidelidad y su firma', () => {
    expect(guidelines.split('## Enmienda de fidelidad al canvas (2026-10-13)').length - 1).toBe(1);
    expect(guidelines).toMatch(/- \[[ xX]\] Enmienda de fidelidad al canvas aprobada por humano/);
  });

  it('declara D-H y D-I y retira los textos sustituidos', () => {
    for (const phrase of [
      "- Títulos de pantalla: título en contenido y cabecera nativa con `title: ''` (Enmienda de fidelidad al canvas).",
      'la superficie siempre acompaña a un icono de reicon-react-native y a un texto.',
    ]) expect(flat.split(phrase).length - 1).toBe(1);
    expect(flat).not.toContain('Títulos de pantalla: header del stack cuando exista, no Text suelto.');
    expect(flat).not.toContain('categoría: la superficie siempre acompaña a un emoji y a un texto.');
    expect(flat).not.toContain('confirmar alerta).');
  });

  it('declara los tres tamaños numéricos de Alertas', () => {
    const line = guidelines.split('\n').find((line) => line.trimStart().startsWith('Tamaños de letra fuera de la escala de Tailwind'));
    for (const token of ['`--text-13: 13px`', '`--text-26: 26px`', '`--text-15: 15px`']) expect(line).toContain(token);
  });

  it('declara tracking-title y tracking-caps', () => {
    const line = guidelines.split('\n').find((line) => line.trimStart().startsWith('Tracking fuera de la escala de Tailwind'));
    expect(line).toContain('`--tracking-title: -0.02em`');
    expect(line).toContain('`--tracking-caps: 0.06em`');
  });

  it('declara el radio compacto dentro de la escala de radios', () => {
    const start = guidelines.indexOf('12. **Escala de radios**');
    const end = guidelines.indexOf('13. **Botón con cuerpo**');
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    expect(collapse(guidelines.slice(start, end))).toContain('Fuera de la escala, por fidelidad al canvas (#174): `rounded-10` (10 px), ack compacto de fila de Alertas.');
  });

  it('declara el secundario compacto y limita la primaria sin labio al detalle', () => {
    expect(flat).toContain('- **Secundario compacto de fila** (#174): el ack de cada fila abierta de Alertas lleva `h-8.5 rounded-10 border-2 border-b-5 border-lip-gray bg-surface px-3`, etiqueta `text-xs font-extrabold text-foreground` y `hitSlop={TOUCH_SLOP}` (34 + 12 = 46 de diana). Es la única excepción a la receta del secundario neutro; el inventario de #166 R3 lo lista por su `testID`.');
    expect(flat).toContain('confirmar alerta en el detalle).');
  });
});


const sourceRoot = join(process.cwd(), 'src');

function sourceFiles(directory: string = sourceRoot): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return entry.name === '__tests__' ? [] : sourceFiles(path);
    }
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

function filesMatching(pattern: RegExp): string[] {
  return sourceFiles()
    .filter((path) => pattern.test(readFileSync(path, 'utf8')))
    .map((path) => path.slice(sourceRoot.length + 1))
    .sort();
}

function readSource(relativePath: string): string {
  return readFileSync(join(sourceRoot, relativePath), 'utf8');
}

function classNames(source: string): string[] {
  return [...source.matchAll(/className=(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/g)]
    .map((match) => match[1] ?? match[2] ?? match[3]);
}

describe('#174 R12: inventarios', () => {
  it.each([
    {
      token: 'rounded-10',
      pattern: /(?<![\w-])rounded-10\b/,
      files: ['screens/alerts/index.tsx', 'screens/meal-schedule/index.tsx'], // #179 R6; #174 R12
    },
    {
      token: 'border-b-5',
      pattern: /(?<![\w-])border-b-5\b/,
      files: ['screens/alerts/index.tsx', 'screens/meal-schedule/index.tsx'], // #179 R5; #174 R12
    },
    {
      token: 'tracking-caps',
      pattern: /(?<![\w-])tracking-caps\b/,
      files: ['screens/alerts/index.tsx', 'screens/meal-schedule/index.tsx'], // #179 R5; #174 R12
    },
    {
      token: 'text-15',
      pattern: /(?<![\w-])text-15\b/,
      files: [
        'components/celebration.tsx',
        'screens/alerts/index.tsx', // #174 R12: delta sobre la lista medida en H0
        'screens/docs/index.tsx', // #175 R6
        'screens/forgot/index.tsx',
        'screens/login/index.tsx',
        'screens/meal-schedule/index.tsx', // #179 R7
        'screens/meals-history/index.tsx', // #179 R11
        'screens/register/index.tsx',
        'screens/reset-password/index.tsx',
      ],
    },
    {
      token: 'tracking-title',
      pattern: /(?<![\w-])tracking-title\b/,
      files: [
        'screens/add-reminder/index.tsx', // #178 R10
        'screens/alert-detail/index.tsx', // #180 R1
        'screens/alerts/index.tsx', // #174 R12: H0 sin consumidores
        'screens/docs/index.tsx', // #175 R5
        'screens/meal-schedule/index.tsx', // #179 R4
        'screens/meals-history/index.tsx', // #179 R9
        'screens/reminders/index.tsx', // #178 R4
      ],
    },
  ])('limita $token a su inventario de producción', ({ pattern, files }) => {
    expect(filesMatching(pattern)).toEqual(files);
  });

  it('declara border-b-5 una sola vez', () => {
    const count = sourceFiles().reduce((total, path) => (
      total + (readFileSync(path, 'utf8').match(/(?<![\w-])border-b-5\b/g)?.length ?? 0)
    ), 0);
    expect(count).toBe(1 + 1 + 1); // #179 R5, R6
  });
});

describe('#174 R12: grep-limpio', () => {
  it.each(['screens/alerts/index.tsx', 'utils/alert-meta.ts'])('%s no introduce escapes de estilo ni emoji', (file) => {
    const source = readSource(file);
    expect(source).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(source).not.toMatch(new RegExp(String.raw`#(?!\d{2,3} R\d)[\da-f]{3,8}\b`, 'i'));
    expect(source).not.toContain('StyleSheet.create');
    for (const classes of classNames(source)) expect(classes).not.toMatch(/\[[^\]]*\]/);
  });

  it('retira las clases salientes de las filas', () => {
    expect(readSource('screens/alerts/index.tsx')).not.toMatch(/(?<![\w-])(?:min-h-20|text-2xs|shadow-sm)\b/);
  });

  it('cada tracking-* va con su text-*', () => {
    const tracked = classNames(readSource('screens/alerts/index.tsx'))
      .filter((classes) => /(?<![\w-])tracking-/.test(classes));
    expect(tracked).toHaveLength(2);
    for (const classes of tracked) expect(classes).toMatch(/(?<![\w-])text-(?:13|15|26)\b/);
  });
});
