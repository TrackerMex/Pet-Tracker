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
