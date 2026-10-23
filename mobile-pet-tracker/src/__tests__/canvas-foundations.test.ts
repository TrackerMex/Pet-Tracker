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


const css = readSource('theme/global.css');
function variant(name: 'light' | 'dark'): string {
  return css.split(`@variant ${name} {`)[1].split('\n    }')[0];
}
function variables(block: string): Record<string, string> {
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
}
function artboard(name: string): string {
  return readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-foundations/canvas', `${name}.dc.html`), 'utf8');
}

describe('#197 R1: colores del canvas', () => {
  it.each([
    ['border', 'rgba(13,17,23,0.08)', ['border', 'separator']],
    ['danger', '#D92D20', ['danger', 'color-danger']],
    ['warning', '#B54708', ['warning', 'color-warning']],
  ])('#197 R1: cada color claro es el literal del canvas %s', (token, value, keys) => {
    expect(artboard('Alertas')).toContain(`--${token}:${value}`);
    for (const key of keys) {
      expect(variables(variant('light'))[key]).toBe(value);
      expect(variant('light').match(new RegExp(`--${key}:`, 'g'))).toHaveLength(1);
    }
    expect(variables(variant('light'))['warning-strong']).toBe('#93370D');
  });
  it('#197 R1: el tema oscuro no cambia', () => {
    expect(variables(variant('dark'))).toMatchObject({
      danger: '#F87171', 'color-danger': '#F87171', warning: '#FBBF24',
      'color-warning': '#FBBF24', 'warning-strong': '#FBBF24',
      border: 'rgba(255,255,255,0.08)', separator: 'rgba(255,255,255,0.08)',
    });
  });
});

function channel(value: number): number {
  const ratio = value / 255;

  return ratio <= 0.04045 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const value = Number.parseInt(hex.slice(1), 16);

  return (
    0.2126 * channel((value >> 16) & 255) +
    0.7152 * channel((value >> 8) & 255) +
    0.0722 * channel(value & 255)
  );
}

function contrast(first: string, second: string): number {
  const [lighter, darker] = [luminance(first), luminance(second)].sort(
    (left, right) => right - left,
  );

  return (lighter + 0.05) / (darker + 0.05);
}


describe('#197 R2: contraste de los colores claros', () => {
  it('#197 R2: el ámbar fuerte pasa AA sobre surface y sobre el warning-soft compuesto', () => {
    const light = variables(variant('light'));
    expect(contrast(light['warning-strong'], light.surface)).toBeGreaterThanOrEqual(7.5);
    expect(contrast(light['warning-strong'], '#F4E3DA')).toBeGreaterThanOrEqual(6.0);
    expect(contrast(light.danger, light.surface)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('#197 R3: tipografía del canvas', () => {
  it.each([
    ['tracking-display', '-0.5px', 'Inicio', 'letter-spacing: -0.5px'],
    ['tracking-section', '1.5px', 'Inicio', 'letter-spacing: 1.5px'],
    ['tracking-mono', '0.04em', 'VincularVinculado', 'letter-spacing: .04em'],
    ['tracking-dialog', '-0.01em', 'ZonasEliminar', 'letter-spacing: -0.01em'],
    ['leading-body', '1.4', 'EditorZona', 'line-height: 1.4'],
    ['leading-note', '1.45', 'Zonas', 'line-height: 1.45'],
  ])('#197 R3: cada tracking e interlineado nuevo es el literal del canvas %s', (token, value, board, literal) => {
    expect(artboard(board)).toContain(literal);
    const theme = css.split('@theme {')[1].split('}')[0];
    expect(variables(theme)[token]).toBe(value);
    expect(theme.indexOf(`--${token}:`)).toBeGreaterThan(theme.indexOf('--tracking-code: 0.14em;'));
    expect(css).not.toMatch(/--text-[\w-]+--line-height/);
  });
});

describe('#197 R4: tracking de títulos', () => {
  it('#197 R4: ningún fichero de producción usa tracking-tight', () => {
    expect(filesMatching(/(?<![\w-])tracking-tight\b/)).toEqual([]);
    for (const file of ['app/(tabs)/food.tsx', 'components/celebration.tsx', 'screens/health/index.tsx', 'screens/profile/index.tsx']) {
      expect(readSource(file)).toContain('text-3xl font-black tracking-title text-foreground');
    }
  });
});

describe('#197 R5: labios del canvas', () => {
  it.each([
    ['lip-danger', '#9F1F15', 'Recordatorios', '0 4px 0 #9F1F15'],
    ['lip-violet', 'rgba(91,63,163,0.35)', 'HorarioComidas', '0 4px 0 rgba(91,63,163,0.35)'],
    ['lip-tile-violet', 'rgba(117,73,247,0.18)', 'Inicio', 'inset 0 -4px 0 rgba(117,73,247,0.18)'],
    ['lip-tile-amber', 'rgba(165,94,7,0.16)', 'Inicio', 'inset 0 -4px 0 rgba(165,94,7,0.16)'],
    ['lip-tile-blue', 'rgba(7,104,224,0.16)', 'Inicio', 'inset 0 -4px 0 rgba(7,104,224,0.16)'],
  ])('#197 R5: cada labio nuevo es el literal del canvas %s', (token, value, board, literal) => {
    expect(artboard(board)).toContain(literal);
    for (const theme of ['light', 'dark'] as const) {
      expect(variables(variant(theme))[`color-${token}`]).toBe(value);
    }
  });
});

describe('#197 R6: variantes del canvas', () => {
  it.each([
    ['danger', 4, 'Recordatorios', '0 4px 0 #9F1F15'],
    ['hero', 6, 'Nutricion', '0 6px 0 var(--lip)'],
    ['neutral', 4, 'HorarioComidas', '0 4px 0 var(--lip-gray)'],
    ['neutralCompact', 3, 'Alertas', '0 3px 0 var(--lip-gray)'],
    ['primary', 4, 'Inicio', '0 4px 0 var(--lip)'],
    ['primaryCompact', 3, 'NuevoRecordatorio', '0 3px 0 var(--lip)'],
    ['summary', 5, 'HorarioComidas', '0 5px 0 var(--lip)'],
    ['tileAmber', -4, 'Inicio', 'inset 0 -4px 0 rgba(165,94,7,0.16)'],
    ['tileBlue', -4, 'Inicio', 'inset 0 -4px 0 rgba(7,104,224,0.16)'],
    ['tileViolet', -4, 'Inicio', 'inset 0 -4px 0 rgba(117,73,247,0.18)'],
    ['violet', 4, 'HorarioComidas', '0 4px 0 rgba(91,63,163,0.35)'],
  ] as const)('#197 R6: cada variante de labio sale de su artboard %s', (key, offset, board, literal) => {
    expect(artboard(board)).toContain(literal);
    const declaration = readSource('theme/chunky-lip.ts').split(new RegExp(`\\b${key}: `))[1]?.split(/\n    \w+:/)[0] ?? '';
    expect(declaration).toMatch(new RegExp(`offsetY: ${offset}\\b`));
  });
});
