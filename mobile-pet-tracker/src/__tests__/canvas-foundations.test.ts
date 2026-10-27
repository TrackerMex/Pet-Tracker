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
  try {
    return readFileSync(join(sourceRoot, relativePath), 'utf8');
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return '';
    throw error;
  }
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
  it('#197 R4: ningún fichero de producción usa tracking-tight (enmendado por #200 R1)', () => {
    expect(filesMatching(/(?<![\w-])tracking-tight\b/)).toEqual([]);
    for (const file of ['screens/food/index.tsx', 'components/celebration.tsx', 'screens/health/index.tsx', 'screens/profile/index.tsx']) {
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

describe('#197 R10: labios fuera del cuerpo', () => {
  it('#197 R10: ningún labio vive dentro del alto', () => {
    for (const token of ['border-b-3', 'border-b-5', 'border-b-6', 'border-black/25']) {
      expect(filesMatching(new RegExp(`(?<![\\w-])${token}\\b`))).toEqual([]);
    }
    for (const file of ['screens/alerts/index.tsx', 'screens/meal-schedule/index.tsx']) {
      expect(readSource(file)).toContain('const chunkyLip = useChunkyLip();');
    }
  });
});

describe('#197 R11: entrada rise', () => {
  it('#197 R11: el rise es el del canvas', () => {
    expect(artboard('Inicio')).toContain('@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}');
    expect(artboard('Inicio')).toContain('animation: rise 400ms ease-out');
    const motion = readSource('theme/motion.ts');
    expect(motion).toContain('export const MOTION_RISE_OFFSET_Y = 14;');
    expect(motion).toContain('export const MOTION_RISE_TIMING = {');
    const timing = motion.split('export const MOTION_RISE_TIMING = {')[1]?.split('}')[0] ?? '';
    expect(timing).toContain('duration: MOTION_SURFACE_MS');
    expect(motion).toContain('export const MOTION_SURFACE_MS = 400;');
    expect(timing).toContain('easing: Easing.bezier(0, 0, 0.58, 1)');
    expect(timing).toContain('reduceMotion: ReduceMotion.System');
  });
});

describe('#197 R14: colores de sombra del canvas', () => {
  it.each([
    ['shadow-near', 'rgba(13,17,23,0.04)', 'rgba(0,0,0,0.4)', 'Inicio', '--shadow:0 1px 2px rgba(13,17,23,0.04),0 8px 24px rgba(13,17,23,0.06)'],
    ['shadow-far', 'rgba(13,17,23,0.06)', 'rgba(0,0,0,0)', 'Inicio', '--shadow:0 1px 2px rgba(13,17,23,0.04),0 8px 24px rgba(13,17,23,0.06)'],
    ['shadow-10', 'rgba(13,17,23,0.10)', 'rgba(13,17,23,0.10)', 'EditorZona', '0 -8px 24px rgba(13,17,23,0.10)'],
    ['shadow-12', 'rgba(13,17,23,0.12)', 'rgba(13,17,23,0.12)', 'Inicio', '0 10px 30px rgba(13,17,23,0.12)'],
    ['shadow-14', 'rgba(13,17,23,0.14)', 'rgba(13,17,23,0.14)', 'Mapa', '0 12px 32px rgba(13,17,23,0.14)'],
    ['shadow-25', 'rgba(13,17,23,0.25)', 'rgba(13,17,23,0.25)', 'ZonasEliminar', '0 12px 40px rgba(13,17,23,0.25)'],
  ])('#197 R14: cada color de sombra es el del canvas %s', (token, light, dark, board, literal) => {
    expect(artboard(board)).toContain(literal);
    expect(artboard('Inicio')).toContain('--shadow:0 1px 2px rgba(0,0,0,0.4)}');
    expect(variables(variant('light'))[`color-${token}`]).toBe(light);
    expect(variables(variant('dark'))[`color-${token}`]).toBe(dark);
  });
});

describe('#197 R15: catálogo de sombras', () => {
  it.each([
    ['card', 'Inicio', '--shadow:0 1px 2px rgba(13,17,23,0.04),0 8px 24px rgba(13,17,23,0.06)', 'card: { boxShadow: [layer(1, 2, 0, near), layer(8, 24, 0, far)] }'],
    ['dialog', 'ZonasEliminar', '0 12px 40px rgba(13,17,23,0.25)', 'dialog: { boxShadow: [layer(12, 40, 0, twentyFive)] }'],
    ['floating', 'Mapa', '0 12px 32px rgba(13,17,23,0.14)', 'floating: { boxShadow: [layer(12, 32, 0, fourteen)] }'],
    ['label', 'Mapa', '0 2px 8px rgba(13,17,23,0.12)', 'label: { boxShadow: [layer(2, 8, 0, twelve)] }'],
    ['marker', 'Mapa', '0 4px 12px rgba(13,17,23,0.25)', 'marker: { boxShadow: [layer(4, 12, 0, twentyFive)] }'],
    ['ring', 'Nutricion', '0 0 0 3px var(--bg), 0 0 0 5px var(--accent)', 'ring: { boxShadow: [layer(0, 0, 3, background), layer(0, 0, 5, accent)] }'],
    ['segment', 'NuevaMascota', '0 2px 6px rgba(13,17,23,0.10)', 'segment: { boxShadow: [layer(2, 6, 0, ten)] }'],
    ['sheet', 'EditorZona', '0 -8px 24px rgba(13,17,23,0.10)', 'sheet: { boxShadow: [layer(-8, 24, 0, ten)] }'],
    ['tabBar', 'Inicio', '0 10px 30px rgba(13,17,23,0.12)', 'tabBar: { boxShadow: [layer(10, 30, 0, twelve)] }'],
    ['toast', 'PesoRegistrado', '0 2px 8px rgba(13,17,23,0.10)', 'toast: { boxShadow: [layer(2, 8, 0, ten)] }'],
  ])('#197 R15: cada sombra sale de su artboard %s', (_key, board, literal, production) => {
    expect(artboard(board)).toContain(literal);
    expect(readSource('theme/shadows.ts')).toContain(production);
  });
});

describe('#197 R16: geometría del interruptor', () => {
  it('#197 R16: el interruptor es el del canvas', () => {
    const canvas = artboard('Zonas');
    expect(canvas).toContain('width: 48px; height: 28px; border-radius: 999px; background: var(--lip-gray)');
    expect(canvas).toContain('left: 3px; top: 3px; width: 22px; height: 22px; border-radius: 50%; background: #FFFFFF');
    expect(canvas).toContain('background: var(--accent)');
    const source = readSource('components/toggle-switch.tsx');
    for (const literal of ['h-7 w-12', 'h-5.5 w-5.5', 'left: { value: 3 }']) expect(source).toContain(literal);
  });
});

describe('#197 R19: cabecera del canvas', () => {
  it('#197 R19: la cabecera es la del canvas', () => {
    const canvas = artboard('Documentos');
    for (const literal of ['margin-left: -10px', 'stroke-width="2.4"', 'font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--muted)', 'font-size: 26px; font-weight: 900; letter-spacing: -0.02em']) expect(canvas).toContain(literal);
    const source = readSource('components/screen-header.tsx');
    expect(source).toContain('-ml-2.5');
    expect(source).toContain('strokeWidth={2.4}');
  });
});

const charter = readFileSync(join(process.cwd(), '..', 'docs/ui-guidelines.md'), 'utf8');
const design = readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-foundations/design.md'), 'utf8');
function canonicalBlock(label: string): string {
  const block = design.split(`### Bloque «${label}»`)[1]?.split('```markdown\n')[1]?.split('```')[0] ?? '';
  expect(block.length).toBeGreaterThan(0);
  return block;
}
describe('#197 R21: carta canónica', () => {
  it('#197 R21: la carta declara los tokens de tipografía', () => {
    expect(charter.split(canonicalBlock('Línea de tracking'))).toHaveLength(2);
  });
  it('#197 R21: la carta declara el interlineado', () => {
    expect(charter.split(canonicalBlock('Línea de interlineado'))).toHaveLength(2);
  });
  it('#197 R21: el punto 13 describe los labios por estilo (enmendado por #200 R16)', () => {
    const expected = canonicalBlock('Punto 13').replace(
      '«Generar plan» es tonal de la categoría violeta y sigue sin labio hasta #200.',
      '«Generar plan» es tonal de la categoría violeta con `style={chunkyLip.violet}` (#200 R14).',
    );
    expect(charter.split(expected)).toHaveLength(2);
  });
  it('#197 R21: la enmienda está una sola vez y con su casilla', () => {
    const normalized = charter.replace(/- \[[ xX]\] Enmienda #197 aprobada por humano/g, '- [ ] Enmienda #197 aprobada por humano');
    expect(normalized.split(canonicalBlock('Enmienda'))).toHaveLength(2);
    expect(charter.match(/## Enmienda #197/g)).toHaveLength(1);
    expect(charter).toMatch(/- \[[ xX]\] Enmienda #197 aprobada por humano/);
  });
  it('#197 R21: D-H sigue intacta', () => {
    const expected = "- **Título en contenido (D-H).** El título de pantalla va dentro del contenido (eyebrow opcional y título); la cabecera nativa del stack queda con `title: ''` y solo aporta el botón de volver.";
    expect(charter.split('\n').filter(line => line.includes('Título en contenido (D-H)'))).toEqual([expected]);
  });
});

describe('#197 R22: fuentes limpias', () => {
  it.each([
    'components/rise-in.tsx',
    'components/toggle-switch.tsx', 'components/screen-header.tsx', 'theme/shadows.ts',
    'theme/chunky-lip.ts', 'theme/motion.ts', 'screens/home/home-entrance.tsx',
    'components/back-button.tsx', 'screens/add-reminder/index.tsx',
    'screens/alerts/index.tsx', 'screens/meal-schedule/index.tsx',
  ])('#197 R22: %s es grep-limpio', file => {
    const source = readSource(file);
    expect(source.length).toBeGreaterThan(0);
    if (!file.startsWith('theme/')) expect(source).not.toMatch(/#(?!\d{2,3} R\d)[\da-f]{3,8}\b/i);
    expect(source).not.toMatch(/StyleSheet\.create/);
    expect(source).not.toMatch(/[A-Za-z0-9_-]+-\[[^\]]+\]/);
    expect(source).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(source).not.toMatch(/\b(?:shadowColor|shadowOffset|shadowOpacity|shadowRadius|elevation)\s*:/);
  });
  it('#197 R22: no añade dependencias (enmendado por #217 R8)', () => {
    const manifest = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
    expect(Object.keys(manifest.dependencies)).toHaveLength(42);
    expect(Object.keys(manifest.devDependencies)).toHaveLength(8);
  });
});
