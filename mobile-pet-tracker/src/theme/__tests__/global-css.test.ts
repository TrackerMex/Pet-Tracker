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
