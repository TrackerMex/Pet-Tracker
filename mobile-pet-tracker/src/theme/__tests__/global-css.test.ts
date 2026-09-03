declare const require: (moduleName: 'fs') => {
  readFileSync: (path: string, encoding: 'utf8') => string;
};

const { readFileSync } = require('fs');
const globalCss = readFileSync(`${process.cwd()}/src/theme/global.css`, 'utf8');

function extractVariant(name: 'light' | 'dark'): string {
  const marker = `@variant ${name} {`;
  const start = globalCss.indexOf(marker);

  if (start === -1) return '';

  const bodyStart = start + marker.length;
  let depth = 1;

  for (let index = bodyStart; index < globalCss.length; index += 1) {
    if (globalCss[index] === '{') depth += 1;
    if (globalCss[index] === '}') depth -= 1;
    if (depth === 0) return globalCss.slice(bodyStart, index);
  }

  return '';
}

function extractTheme(): string {
  const marker = '@theme {';
  const start = globalCss.indexOf(marker);

  if (start === -1) return '';

  const bodyStart = start + marker.length;
  let depth = 1;

  for (let index = bodyStart; index < globalCss.length; index += 1) {
    if (globalCss[index] === '{') depth += 1;
    if (globalCss[index] === '}') depth -= 1;
    if (depth === 0) return globalCss.slice(bodyStart, index);
  }

  return '';
}

function parseVariables(block: string): Record<string, string> {
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((match) => [
      match[1],
      match[2].trim(),
    ]),
  );
}

describe('R1: tokens rounded-card y text-2xs', () => {
  it('define sus valores exactos dentro de @theme', () => {
    expect(parseVariables(extractTheme())).toMatchObject({
      'radius-card': '20px',
      'text-2xs': '10px',
    });
  });
});

describe('R1: global.css define los tokens light exactos del diseño', () => {
  it('incluye el código de la app en el escaneo de utilidades de Tailwind', () => {
    expect(globalCss).toMatch(/@source\s+['"]\.\.\/['"];?/);
  });

  it('mapea la paleta Figma Make a los tokens de heroui-native', () => {
    expect(parseVariables(extractVariant('light'))).toMatchObject({
      background: '#FFFFFF',
      foreground: '#0D1117',
      surface: '#FFFFFF',
      'surface-foreground': '#0D1117',
      'surface-secondary': '#F0FBF6',
      default: '#F5F6F8',
      muted: '#6B7280',
      border: 'rgba(13,17,23,0.07)',
      separator: 'rgba(13,17,23,0.07)',
      accent: '#2AB87C',
      'accent-foreground': '#FFFFFF',
      danger: '#EF4444',
      warning: '#F59E0B',
      success: '#0F9B5A',
      focus: '#2AB87C',
      'field-radius': '0.75rem',
    });
  });

  it('no sobreescribe --radius (base de la escala rounded-* de heroui-native)', () => {
    expect(globalCss).not.toMatch(/--radius:/);
  });
});

describe('R2: global.css define la paleta dark derivada del diseño', () => {
  it.each([
    ['light', '#2AB87C', '#FFFFFF', '#6B7280', '#0F9B5A', '#F59E0B', '#EF4444'],
    ['dark', '#2AB87C', '#FFFFFF', '#9CA3AF', '#34D399', '#FBBF24', '#F87171'],
  ] as const)(
    'materializa los colores semánticos para el resolver JS en %s',
    (theme, accent, accentForeground, muted, success, warning, danger) => {
      expect(parseVariables(extractVariant(theme))).toMatchObject({
        'color-accent': accent,
        'color-accent-foreground': accentForeground,
        'color-muted': muted,
        'color-success': success,
        'color-warning': warning,
        'color-danger': danger,
      });
    },
  );

  it('usa neutros oscuros con el accent verde y sin copiar oklch del Make', () => {
    const darkVariant = extractVariant('dark');

    expect(darkVariant).not.toContain('oklch(');
    expect(parseVariables(darkVariant)).toMatchObject({
      background: '#0D1117',
      foreground: '#F7F8FA',
      surface: '#161B22',
      'surface-foreground': '#F7F8FA',
      'surface-secondary': '#12231B',
      default: '#1F242B',
      muted: '#9CA3AF',
      border: 'rgba(255,255,255,0.08)',
      separator: 'rgba(255,255,255,0.08)',
      accent: '#2AB87C',
      'accent-foreground': '#FFFFFF',
      danger: '#F87171',
      warning: '#FBBF24',
      success: '#34D399',
      focus: '#2AB87C',
    });
  });
});

describe('R2: tokens glass-surface y tab-pill en light y dark', () => {
  it.each([
    ['light', 'rgba(255,255,255,0.60)', 'rgba(42,184,124,0.14)'],
    ['dark', 'rgba(22,27,34,0.60)', 'rgba(42,184,124,0.22)'],
  ] as const)(
    'define los pares visual e imperativo exactos en %s',
    (theme, glassSurface, tabPill) => {
      expect(parseVariables(extractVariant(theme))).toMatchObject({
        'glass-surface': glassSurface,
        'color-glass-surface': glassSurface,
        'tab-pill': tabPill,
        'color-tab-pill': tabPill,
      });
    },
  );
});

/**
 * Contraste WCAG 2.1 sobre luminancia relativa sRGB. Fórmula y método en
 * specs/mobile-ui-legibility-polish/design.md §1; el ancla de verificación
 * (#FFFFFF sobre #2AB87C = 2,547:1) se afirma en el primer describe de #61.
 */
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

describe('#61 R2: el relleno de acento pasa AA con etiqueta blanca', () => {
  const accent = '#178255';

  it('reproduce el ancla de contraste verificada a mano', () => {
    expect(contrast('#FFFFFF', '#2AB87C')).toBeCloseTo(2.547, 3);
  });

  it.each(['light', 'dark'] as const)(
    'oscurece acento y foco sin tocar la etiqueta blanca en %s',
    (theme) => {
      expect(parseVariables(extractVariant(theme))).toMatchObject({
        accent,
        'color-accent': accent,
        focus: accent,
        'accent-foreground': '#FFFFFF',
        'color-accent-foreground': '#FFFFFF',
      });
    },
  );

  it.each([
    ['light', 'rgba(23,130,85,0.14)'],
    ['dark', 'rgba(23,130,85,0.22)'],
  ] as const)(
    'arrastra --tab-pill al valor del acento nuevo en %s',
    (theme, tabPill) => {
      expect(parseVariables(extractVariant(theme))).toMatchObject({
        'tab-pill': tabPill,
        'color-tab-pill': tabPill,
      });
    },
  );

  it('deja la etiqueta blanca sobre el relleno por encima de AA', () => {
    expect(contrast('#FFFFFF', accent)).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#FFFFFF', accent)).toBeCloseTo(4.816, 3);
  });

  it('conserva el relleno visible sobre el fondo de página en dark', () => {
    expect(contrast(accent, '#0D1117')).toBeGreaterThanOrEqual(3);
    expect(contrast(accent, '#161B22')).toBeGreaterThanOrEqual(3);
  });
});
