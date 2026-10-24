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

it('#206 R3: la sombra copia 0 10px 30px rgba(13,17,23,0.12)', () => {
  for (const s of artboards) expect(tabNav(s)).toContain('box-shadow: 0 10px 30px rgba(13,17,23,0.12)');
  const shadows = readFileSync(join(process.cwd(), 'src/theme/shadows.ts'), 'utf8');
  const css = readFileSync(join(process.cwd(), 'src/theme/global.css'), 'utf8');
  expect(shadows).toContain('tabBar: { boxShadow: [layer(10, 30, 0, twelve)] }');
  expect(css).toContain('--color-shadow-12: rgba(13,17,23,0.12);');
  expect(source).toContain('useShadows()');
  expect(source).toContain('shadows.tabBar');
  for (const forbidden of ['shadow-lg', 'shadowColor', 'elevation']) expect(source).not.toContain(forbidden);
});

it('#206 R4: la celda copia flex 1, alto 52, columna centrada y hueco 2', () => {
  const cells = tabNav(artboards[0]).match(/<a [^>]+>/g)!;
  expect(cells).toHaveLength(5);
  for (const cell of cells) {
    expect(cell).toContain('flex: 1; height: 52px');
    expect(cell).toContain('flex-direction: column; align-items: center; justify-content: center; gap: 2px');
  }
  expect(source).toContain('"h-13 flex-1 items-center justify-center gap-0.5"');
});

it('#206 R5: la píldora copia alto 52, radio 999 y var(--pill)', () => {
  const active = tabNav(artboards[0]).match(/<a [^>]*aria-current[^>]*>/)![0];
  for (const literal of ['height: 52px', 'background: var(--pill)', 'border-radius: 999px']) expect(active).toContain(literal);
  for (const s of artboards) {
    expect(s).toContain('--pill:rgba(23,130,85,0.14)');
    expect(s).toContain('--pill:rgba(23,130,85,0.22)');
  }
  for (const literal of ['(containerWidth - 30) / TABS.length', 'activeTabIndex * (tabWidth + 4)', 'left: 6', 'top: 6', 'height: 52']) expect(source).toContain(literal);
  expect(source).not.toContain('left: 8');
  expect(source).not.toContain('bottom: 6');
});
