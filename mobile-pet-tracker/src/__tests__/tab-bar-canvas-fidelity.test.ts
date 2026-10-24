import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ARTBOARDS = ['Inicio', 'Mapa', 'Salud', 'Nutricion', 'Perfil'] as const;
const artboards = ARTBOARDS.map((name) => readFileSync(
  join(process.cwd(), '..', 'specs/mobile-canvas-tab-bar/canvas', `${name}.dc.html`), 'utf8',
));
const source = readFileSync(join(process.cwd(), 'src/components/floating-tab-bar.tsx'), 'utf8');

function tabNav(s: string) {
  const i = s.indexOf('<nav aria-label="Pestañas"');
  expect(i).toBeGreaterThanOrEqual(0);
  return s.slice(i, s.indexOf('</nav>', i));
}

it('#206 R1: la cápsula y la fila copian alto, relleno y hueco del canvas', () => {
  for (const { canvas, production } of [
    { canvas: 'height: 64px', production: 'h-16' },
    { canvas: 'padding: 6px', production: 'p-1.5' },
    { canvas: 'gap: 4px', production: 'gap-1' },
  ]) {
    for (const s of artboards) expect(tabNav(s).split('>')[0]).toContain(canvas);
    expect(source).toContain(production);
  }
  expect(source).toContain('className="flex-row gap-1 p-1.5"');
});

it('#206 R2: el velo copia var(--glass) a .86 en claro y en oscuro', () => {
  const css = readFileSync(join(process.cwd(), 'src/theme/global.css'), 'utf8');
  for (const s of artboards) {
    expect(s).toContain('--glass:rgba(255,255,255,0.86)');
    expect(s).toContain('--glass:rgba(22,27,34,0.86)');
    expect(tabNav(s)).toContain('background: var(--glass)');
  }
  expect(css).toContain('--glass-surface-strong: rgba(255,255,255,0.86);');
  expect(css).toContain('--glass-surface-strong: rgba(22,27,34,0.86);');
  expect(source).toContain('"flex-1 bg-glass-surface-strong"');
  expect(source).not.toContain('"flex-1 bg-glass-surface"');
});
