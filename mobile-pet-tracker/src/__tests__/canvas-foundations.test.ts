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
