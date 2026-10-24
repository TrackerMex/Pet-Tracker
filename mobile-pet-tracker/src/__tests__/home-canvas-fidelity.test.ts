import { readFileSync } from 'fs';
import { join } from 'path';

describe('#198 R12: sombras locales de Inicio', () => {
  it('#198 R12 solo Inicio y su gráfica importan las sombras en esta feature', () => {
    for (const file of ['src/screens/home/index.tsx', 'src/screens/home/weekly-activity-chart.tsx']) {
      const source = readFileSync(join(process.cwd(), file), 'utf8');
      expect(source).toContain("import { useShadows } from '../../theme/shadows';");
    }
  });
});


describe('#198 R17: contraste literal con los artboards congelados', () => {
  it.each([
    { artboard: 'Inicio', canvas: 'border-radius: 20px; background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow); padding: 14px 8px', file: 'src/screens/home/index.tsx', production: 'gap-3 px-2 py-3.5 shadow-none' },
    { artboard: 'Inicio', canvas: 'padding: 0 8px; font-size: 16px; font-weight: 800', file: 'src/screens/home/index.tsx', production: 'px-2 text-base font-extrabold text-foreground' },
    { artboard: 'Inicio', canvas: 'width: 36px; height: 36px; border-radius: 12px', file: 'src/screens/home/index.tsx', production: 'size-9 items-center justify-center rounded-xl ${CATEGORY_SLOTS[' },
    { artboard: 'Inicio', canvas: 'font-size: 11px; font-weight: 600; color: var(--muted)', file: 'src/screens/home/index.tsx', production: 'text-11 font-semibold text-muted' },
    { artboard: 'Inicio', canvas: 'border-radius: 20px; background: var(--default); padding: 12px 14px', file: 'src/screens/home/index.tsx', production: 'flex-row items-center gap-3 border-0 bg-default px-3.5 py-3 shadow-none' },
    { artboard: 'Inicio', canvas: 'width: 40px; height: 40px; border-radius: 50%; background: var(--pill)', file: 'src/screens/home/index.tsx', production: 'size-10 items-center justify-center rounded-full bg-tab-pill' },
    { artboard: 'Inicio', canvas: 'font-size: 15px; font-weight: 800; color: var(--accent-strong)', file: 'src/screens/home/index.tsx', production: 'text-15 font-extrabold' },
    { artboard: 'Inicio', canvas: 'height: 8px; border-radius: 999px; background: var(--bg)', file: 'src/screens/home/collar-battery-bar.tsx', production: 'h-2 w-full overflow-hidden rounded-full bg-background' },
    { artboard: 'Inicio', canvas: 'letter-spacing: 1.5px; text-transform: uppercase', file: 'src/screens/home/index.tsx', production: 'text-xs font-bold uppercase tracking-section text-muted' },
    { artboard: 'Inicio', canvas: 'height: 92px; border-radius: 20px', file: 'src/screens/home/index.tsx', production: 'h-23 flex-1 items-center justify-center gap-2 rounded-card ${CATEGORY_SLOTS[' },
    { artboard: 'Inicio', canvas: 'inset 0 -4px 0 rgba(117,73,247,0.18)', file: 'src/screens/home/index.tsx', production: '\'tileViolet\'' },
    { artboard: 'Inicio', canvas: 'inset 0 -4px 0 rgba(165,94,7,0.16)', file: 'src/screens/home/index.tsx', production: '\'tileAmber\'' },
    { artboard: 'Inicio', canvas: 'inset 0 -4px 0 rgba(7,104,224,0.16)', file: 'src/screens/home/index.tsx', production: '\'tileBlue\'' },
    { artboard: 'Inicio', canvas: 'animation: rise 400ms ease-out 120ms both', file: 'src/screens/home/index.tsx', production: '<HomeEntrance index={2}' },
    { artboard: 'Inicio', canvas: 'animation: rise 400ms ease-out 180ms both', file: 'src/screens/home/index.tsx', production: '<HomeEntrance index={3}' },
    { artboard: 'Inicio', canvas: 'animation: rise 400ms ease-out 240ms both', file: 'src/screens/home/index.tsx', production: '<HomeEntrance index={4}' },
    { artboard: 'Inicio', canvas: 'animation: rise 400ms ease-out 300ms both', file: 'src/screens/home/index.tsx', production: '<HomeEntrance index={5}' },
    { artboard: 'Inicio', canvas: 'animation: rise 400ms ease-out 360ms both', file: 'src/screens/home/index.tsx', production: '<HomeEntrance index={6}' },
    { artboard: 'Inicio', canvas: 'animation: rise 400ms ease-out 420ms both', file: 'src/screens/home/index.tsx', production: '<HomeEntrance index={7}' },
    { artboard: 'Inicio', canvas: 'box-shadow: var(--shadow); padding: 14px 16px', file: 'src/screens/home/weekly-activity-chart.tsx', production: 'gap-2 px-4 py-3.5 shadow-none' },
    { artboard: 'Inicio', canvas: 'font-size: 11px; color: var(--muted)">últimos 7 días', file: 'src/screens/home/weekly-activity-chart.tsx', production: 'text-11 text-muted' },
    { artboard: 'Inicio', canvas: 'border-radius: 6px', file: 'src/screens/home/weekly-activity-chart.tsx', production: 'Math.min(6, height / 2)' },
    { artboard: 'Inicio', canvas: 'opacity: .35', file: 'src/screens/home/weekly-activity-chart.tsx', production: '0.35' },
    { artboard: 'Inicio', canvas: 'padding: 12px; border-radius: 16px; border: 1px solid var(--border); background: var(--default)', file: 'src/screens/home/weekly-activity-chart.tsx', production: 'gap-3 rounded-16 border border-border bg-default p-3' },
    { artboard: 'Inicio', canvas: 'font-size: 15px; font-weight: 800">Miércoles', file: 'src/screens/home/weekly-activity-chart.tsx', production: 'text-15 font-extrabold text-foreground' },
    { artboard: 'Inicio', canvas: 'box-shadow: var(--shadow); padding: 12px 14px', file: 'src/screens/home/index.tsx', production: 'flex-row items-center gap-3 px-3.5 py-3 shadow-none' },
    { artboard: 'Inicio', canvas: 'font-size: 12px; font-weight: 700; color: var(--accent-strong)">Ver todos', file: 'src/screens/home/index.tsx', production: 'text-xs font-bold text-accent-strong' },
    { artboard: 'Inicio', canvas: 'border-radius: 20px; background: var(--default); padding: 14px 16px', file: 'src/screens/home/index.tsx', production: 'gap-2 border-0 bg-default px-4 py-3.5 shadow-none' },
    { artboard: 'Inicio', canvas: 'font-size: 15px; font-weight: 700; color: var(--accent-strong)">Ver en el mapa', file: 'src/screens/home/index.tsx', production: 'text-15 font-bold text-accent-strong' },
    { artboard: 'Inicio', canvas: 'font-size: 13px; color: var(--muted)">Última señal', file: 'src/screens/home/index.tsx', production: 'text-13 font-normal text-muted' },
    { artboard: 'InicioActividad', canvas: 'margin-top: -751px', file: 'src/screens/home/weekly-activity-chart.tsx', production: 'gap-2 px-4 py-3.5 shadow-none' },
    { artboard: 'InicioRecordatorios', canvas: 'margin-top: -1064px', file: 'src/screens/home/index.tsx', production: 'flex-row items-center gap-3 px-3.5 py-3 shadow-none' },
    { artboard: 'InicioSinCollar', canvas: 'align-self: center; padding-left: 12px; font-size: 14px; line-height: 20px; color: var(--muted)', file: 'src/screens/home/index.tsx', production: 'flex-3 self-center pl-3 text-sm leading-5 font-normal text-muted' },
    { artboard: 'InicioSinCollar', canvas: 'font-size: 16px; font-weight: 800">Sin collar', file: 'src/screens/home/index.tsx', production: 'text-base font-extrabold text-foreground' },
    { artboard: 'InicioSinCollar', canvas: 'font-size: 14px; color: var(--muted)">Sin collar — solo salud', file: 'src/screens/home/index.tsx', production: 'text-sm font-normal text-muted' },
    { artboard: 'InicioSinCollar', canvas: 'height: 44px; border-radius: 12px; background: var(--pill)', file: 'src/screens/home/index.tsx', production: 'h-11 items-center justify-center rounded-xl bg-tab-pill' },
    { artboard: 'InicioCarga', canvas: 'height: 64px', file: 'src/screens/home/index.tsx', production: 'h-16 w-full rounded-card' },
    { artboard: 'InicioCarga', canvas: 'height: 92px; border-radius: 20px', file: 'src/screens/home/index.tsx', production: 'h-23 flex-1 rounded-card' },
    { artboard: 'InicioCarga', canvas: 'height: 408px', file: 'src/screens/home/index.tsx', production: 'h-102 w-full rounded-card' },
    { artboard: 'InicioError', canvas: 'font-size: 26px; font-weight: 900; letter-spacing: -0.02em', file: 'src/screens/home/index.tsx', production: 'text-26 font-black tracking-title text-foreground' },
    { artboard: 'InicioError', canvas: 'background: var(--rose)', file: 'src/components/empty-state.tsx', production: 'CATEGORY_SLOTS.rose.surface' },
    { artboard: 'InicioError', canvas: 'top: 26px; right: 42px; width: 44px; height: 44px', file: 'src/screens/home/index.tsx', production: 'absolute right-10.5 top-6.5 size-11' },
    { artboard: 'InicioError', canvas: 'font-size: 22px; font-weight: 900; letter-spacing: -0.02em', file: 'src/components/empty-state.tsx', production: 'text-center text-22 font-black tracking-title text-foreground' },
    { artboard: 'InicioError', canvas: 'No pude cargar a tus mascotas', file: 'src/i18n/catalog.ts', production: 'No pude cargar a tus mascotas' },
    { artboard: 'InicioError', canvas: 'Revisa tu conexión y vuelve a intentarlo.', file: 'src/i18n/catalog.ts', production: 'Revisa tu conexión y vuelve a intentarlo.' },
    { artboard: 'InicioVacio', canvas: 'Aún no tienes mascotas', file: 'src/i18n/catalog.ts', production: 'Aún no tienes mascotas' },
  ])('#198 R17 $artboard dibuja «$canvas» y $file lo aplica', ({ artboard, canvas, file, production }) => {
    const board = readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-home/canvas', `${artboard}.dc.html`), 'utf8');
    const source = readFileSync(join(process.cwd(), file), 'utf8');
    expect(board).toContain(canvas);
    expect(source).toContain(production);
  });
});
