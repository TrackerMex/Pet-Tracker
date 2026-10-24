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

it('#206 R6: los cinco iconos copian los trazados del canvas', () => {
  for (const d of [
    'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
    'M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3z', 'M9 3v15M15 6v15',
    'M20.4 13.4 12 21l-8.4-7.6A5 5 0 0 1 12 6.6a5 5 0 0 1 8.4 6.8z', 'M3.5 12h4l2-3 3 6 2-3h5.5',
    'M7 3v18M4 3v5a3 3 0 0 0 6 0V3', 'M18 21V3c-2.5 1-4 3.5-4 7 0 2 1.5 3 4 3',
    'M4 21a8 8 0 0 1 16 0',
  ]) {
    expect(tabNav(artboards[0])).toContain(`d="${d}"`);
    expect(source).toContain(`d="${d}"`);
  }
  expect(tabNav(artboards[0])).toContain('<circle cx="12" cy="8" r="4"');
  expect(source).toContain('cx="12" cy="8" r="4"');
  for (const literal of ['viewBox="0 0 24 24"', 'strokeLinecap="round"', 'strokeLinejoin="round"']) expect(source).toContain(literal);
  expect(source).toContain("from 'react-native-svg'");
  expect(source).not.toContain('reicon-react-native');
});

it.each(['Inicio', 'Mapa', 'Salud', 'Nutricion', 'Perfil'])('#206 R7: el artboard %s marca su pestaña con aria-current y trazo 2.4', (artboard) => {
  const s = readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-tab-bar/canvas', `${artboard}.dc.html`), 'utf8');
  const nav = tabNav(s);
  expect(nav.match(/aria-current/g)).toHaveLength(1);
  expect(nav.match(/stroke-width="2.4"/g)).toHaveLength(1);
  expect(nav.match(/stroke-width="2"/g)).toHaveLength(4);
  expect(nav.match(/<svg/g)).toHaveLength(5);
  expect(nav.match(/<a /g)).toHaveLength(5);
  const active = nav.match(/<a [^>]*aria-current[^>]*>/)![0];
  const label = artboard === 'Nutricion' ? 'Nutrición' : artboard;
  expect(active).toContain(`aria-label="${label}"`);
  expect(source).toContain('strokeWidth={active ? 2.4 : 2}');
});

it('#206 R8: el nombre de la fila es el aria-label del canvas', () => {
  for (const s of artboards) expect(s).toContain('<nav aria-label="Pestañas"');
  const catalog = readFileSync(join(process.cwd(), 'src/i18n/catalog.ts'), 'utf8');
  expect(catalog).toContain("'tabs.bar': 'Tabs'");
  expect(catalog).toContain("'tabs.bar': 'Pestañas'");
  expect(source).toContain('accessibilityRole="tablist"');
  expect(source).toContain("t('tabs.bar')");
});

const BLOQUE = [
  '## Enmienda #206 — barra de pestañas fiel al canvas',
  '',
  'Fecha: 2026-10-23. Feature #206 `mobile-canvas-tab-bar`. Excepción nombrada a D-I.',
  '',
  '1. **Iconos de la barra.** Los cinco iconos de `FloatingTabBar` se dibujan con `react-native-svg` copiando los trazados del `<nav aria-label="Pestañas">` del canvas (24 x 24, `fill="none"`, trazo redondeado de 2,4 en la pestaña activa y de 2 en las demás) y se colorean con `accent-strong` o `muted` vía `useThemeColors`. Excepción a D-I limitada a los iconos de esta barra: ningún otro icono de navegación o de acción cambia, y siguen siendo de `reicon-react-native`.',
  '2. **Barra.** Cápsula de 64 con relleno de 6 y hueco de 4, celdas de 52, velo `bg-glass-surface-strong` y sombra `useShadows().tabBar`. Flota a 16 de cada lado y a 12 por encima del inset inferior.',
  '',
  'Detalle y tests en `specs/mobile-canvas-tab-bar/requirements.md` (R1 a R10).',
  '',
  '- [ ] Enmienda #206 aprobada por humano',
].join('\n');

it('#206 R9: la carta nombra la excepción de iconos de la barra una sola vez y con su casilla', () => {
  const charter = readFileSync(join(process.cwd(), '..', 'docs/ui-guidelines.md'), 'utf8');
  expect(charter.match(/## Enmienda #206/g)).toHaveLength(1);
  expect(charter).toMatch(/- \[[ xX]\] Enmienda #206 aprobada por humano/);
  const normalized = charter.replace(/- \[[ xX]\] Enmienda #206 aprobada por humano/, '- [ ] Enmienda #206 aprobada por humano');
  expect(normalized.split(BLOQUE)).toHaveLength(2);
  expect(normalized.endsWith(`${BLOQUE}\n`)).toBe(true);
  expect(charter.split('- **Iconos reicon (D-I).**')).toHaveLength(2);
});

it('#206 R10: la barra no lleva hex, clases arbitrarias, StyleSheet ni sombras de React Native', () => {
  for (const forbidden of ['#', '-[', 'StyleSheet', 'shadowColor', 'elevation', 'text-13', 'text-15', 'text-17']) expect(source).not.toContain(forbidden);
  expect(source.match(/text-accent-strong/g)).toHaveLength(1);
});
