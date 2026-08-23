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

function parseVariables(block: string): Record<string, string> {
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((match) => [
      match[1],
      match[2].trim(),
    ]),
  );
}

describe('R1: global.css define los tokens light exactos del diseño', () => {
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
      radius: '1.25rem',
      'field-radius': '0.75rem',
    });
  });
});
