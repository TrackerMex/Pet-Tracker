import { en, es } from '../i18n/catalog';
import { R8_REMINDERS } from './ui-copy-table';

declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
declare function require(moduleName: 'path'): { join: (...paths: string[]) => string };

const { readFileSync } = require('fs');
const { join } = require('path');
const sourceRoot = join(process.cwd(), 'src');
const readSource = (path: string) => readFileSync(join(sourceRoot, path), 'utf8');
const canvas = (file: string) => readFileSync(join(process.cwd(), '..', 'specs', 'mobile-reminders-upcoming-past', 'canvas', file), 'utf8');
const uiLanguageDesign = () => readFileSync(join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md'), 'utf8');

it('#227 R1: las cuatro claves existen en es y en con su literal, una invocación cada una y su fila en §2.40', () => {
  const copy = [
    ['reminders.sectionUpcoming', 'Próximos', 'Upcoming', '| — | `reminders.sectionUpcoming` | `Upcoming` | `Próximos` | ← añadida por #227 (R1) |'],
    ['reminders.sectionPast', 'Pasados', 'Past', '| — | `reminders.sectionPast` | `Past` | `Pasados` | ← añadida por #227 (R1) |'],
    ['reminders.upcomingEmptyTitle', 'Nada pendiente por ahora', 'Nothing pending for now', '| — | `reminders.upcomingEmptyTitle` | `Nothing pending for now` | `Nada pendiente por ahora` | ← añadida por #227 (R1) |'],
    ['reminders.upcomingEmptyBody', 'Los recordatorios nuevos aparecerán aquí.', 'New reminders will show up here.', '| — | `reminders.upcomingEmptyBody` | `New reminders will show up here.` | `Los recordatorios nuevos aparecerán aquí.` | ← añadida por #227 (R1) |'],
  ] as const;
  const spanish: Record<string, string> = es;
  const english: Record<string, string> = en;
  const source = readSource('screens/reminders/index.tsx');
  const design = uiLanguageDesign();
  const section = design.split('### §2.40 — Añadidos por #227')[1]?.split('\n### ')[0] ?? '';
  for (const [key, literalEs, literalEn, row] of copy) {
    expect(spanish[key]).toBe(literalEs);
    expect(english[key]).toBe(literalEn);
    expect(source.split(`t('${key}'`).length - 1).toBe(1);
    expect(R8_REMINDERS).toContainEqual({ file: 'src/screens/reminders/index.tsx', key });
    expect(section).toContain(row);
  }
});

it.each([
  ['Cabecera (`reminders-upcoming-heading`)', 'RecordatoriosProximosPasados.dc.html', '.sec{margin: 4px 0 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: var(--muted)}', 'className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"'],
  ['Encabezado (`reminders-past-toggle`)', 'RecordatoriosProximosPasados.dc.html', '.tog{margin: 4px 0 0; padding: 0; border: 0; background: none; color: inherit; font: inherit; width: 100%; height: 40px; flex: none; display: flex; align-items: center; gap: 8px; text-align: left}', 'className="mt-1 h-10 w-full flex-row items-center gap-2"'],
  ['Etiqueta (`reminders-past-label`)', 'RecordatoriosProximosPasados.dc.html', '.sec{margin: 4px 0 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: var(--muted)}', 'className="text-13 font-extrabold uppercase tracking-caps text-muted"'],
  ['Contador (`reminders-past-count`)', 'RecordatoriosProximosPasados.dc.html', '.cnt{padding: 2px 8px; border-radius: 999px; background: var(--default); color: var(--muted); font-size: 12px; font-weight: 800}', 'className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted"'],
  ['Disco del chevron', 'RecordatoriosProximosPasados.dc.html', '.chev{width: 32px; height: 32px; border-radius: 50%; background: var(--default); color: var(--muted); display: flex; align-items: center; justify-content: center}', 'className="size-8 items-center justify-center rounded-full bg-default"'],
  ['Fila pasada', 'RecordatoriosPasadosExpandida.dc.html', '.past{opacity: .5}', "${past ? ' opacity-50' : ''}"],
  ['Paso de las pasadas', 'RecordatoriosPasadosExpandida.dc.html', '<article class="card past" style="animation-delay: 30ms">', 'delayMs={index * MOTION_REMINDERS_PAST_STAGGER_MS}'],
  ['Caja sin próximos (`reminders-upcoming-empty`)', 'RecordatoriosSinProximos.dc.html', 'border-radius: 22px; background: var(--default); padding: 20px 16px; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center', 'className="items-center gap-1 rounded-22 bg-default px-4 py-5"'],
  ['Título de la caja', 'RecordatoriosSinProximos.dc.html', '<span style="font-size: 15px; font-weight: 800">Nada pendiente por ahora</span>', 'className="text-center text-15 font-extrabold text-foreground"'],
  ['Cuerpo de la caja', 'RecordatoriosSinProximos.dc.html', '<span style="font-size: 13px; color: var(--muted)">Los recordatorios nuevos aparecerán aquí.</span>', 'className="text-center text-13 text-muted"'],
])('#227 R11: %s', (_name, file, canvasLiteral, productionLiteral) => {
  expect(canvas(file).split(canvasLiteral).length - 1).toBe(1);
  expect(readSource('screens/reminders/index.tsx').split(productionLiteral).length - 1).toBe(1);
});

it('#227 R11: inventario del fuente', () => {
  const source = readSource('screens/reminders/index.tsx');
  for (const [literal, count] of [
    ['style={CONTINUOUS_CORNER}', 6 + 1], // #228 R2
    ['style={TABULAR_NUMS}', 4],
    ['hitSlop={TOUCH_SLOP}', 1],
    ['delayMs={i * MOTION_REMINDERS_STAGGER_MS}', 1],
    ['delayMs={index * MOTION_REMINDERS_PAST_STAGGER_MS}', 1],
    ["${inactive ? ' opacity-50' : ''}", 0],
    ['splitReminders(', 1],
  ] as const) expect(source.split(literal).length - 1).toBe(count);
});

const AMENDED: readonly (readonly [string, string])[] = [
  ['screens/reminders/index.test.tsx', 'renders summaries and reminder rows by section'],
  ['screens/reminders/index.test.tsx', 'distingue las recetas de fila próxima, lejana e inactiva'],
  ['screens/reminders/index.test.tsx', 'ordena mosaico, columna y borrar con la anatomía exacta de cada fila'],
  ['screens/reminders/index.test.tsx', 'da a cada mosaico su único icono, tamaño, superficie y tinta'],
  ['screens/reminders/index.test.tsx', 'pinta tipo y título con sus tintas y pesos propios'],
  ['screens/reminders/index.test.tsx', 'formatea la hora lejana y la meta inactiva con su estado'],
  ['screens/reminders/index.test.tsx', 'sustituye los emoji de todas las filas por iconos'],
  ['screens/reminders/index.test.tsx', 'asigna a cada entrada su índice dentro de su sección'],
  ['screens/reminders/index.test.tsx', 'envuelve cada fila en su propia entrada'],
  ['screens/reminders/index.test.tsx', "describe('#178 R8: sheet de borrado del canvas"],
  ['screens/reminders/index.test.tsx', "describe('#218 R1: el cajón de borrar pinta su contenedor con el token surface"],
  ['screens/reminders/index.test.tsx', '#204 R6: escalona las filas próximas cada 70 ms y la pasada desde 0'],
  ['screens/reminders/index.test.tsx', "describe('#204 R8: Eliminar de la fila"],
  ['screens/reminders/index.test.tsx', "describe('#204 R9: Eliminar de la hoja"],
  ['screens/reminders/index.test.tsx', 'shows a delete action for reminders in every status'],
  ['screens/reminders/index.test.tsx', '08:00 del 10 de septiembre: ayer a las 09:00 no es de esta semana ni próximo'],
  ['screens/reminders/index.test.tsx', '#213 R14: sin línea de repetición si no hay recurrencia o la serie no está programada'],
  ['screens/reminders/index.test.tsx', '#213 R15: una serie cancelada o enviada conserva Eliminar (%s)'],
  ['screens/reminders/index.test.tsx', '#213 R16: el badge Hoy y el borde ámbar solo marcan el día de hoy'],
  ['providers/__tests__/language-provider.test.tsx', '#194 R1: mantiene la base más las claves de #68'],
  ['__tests__/ui-language.test.ts', '#186 R5: resuelve las 113 ocurrencias normativas'],
  ['__tests__/design-drift.test.ts', 'importa exactamente los iconos prescritos desde un único import de reicon'],
  ['__tests__/design-drift.test.ts', 'reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto'],
  ['__tests__/consistency-classnames.test.ts', '%s importa y aplica sus %i esquinas'],
  ['__tests__/consistency-classnames.test.ts', 'fusiona la esquina una vez y la entrega a las dos ramas de Card'],
  ['__tests__/consistency-classnames.test.ts', 'deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban'],
  ['__tests__/consistency-classnames.test.ts', '%s aplica TABULAR_NUMS a sus %i valores'],
  ['__tests__/consistency-classnames.test.ts', '#69 R10: mantiene la base cerrada más los deltas medidos'],
  ['__tests__/alerts-canvas-fidelity.test.ts', 'limita $token a su inventario de producción'],
  ['theme/__tests__/motion.test.ts', 'no exporta nada más'],
];

it('#227 R13: los candados enmendados nombran su enmienda y las specs enmendadas llevan su casilla', () => {
  for (const [path, locator] of AMENDED) {
    const lines = readSource(path).split('\n').filter((line) => line.includes(locator));
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('(enmendado por #227 R13)');
  }
  for (const feature of ['mobile-reminders', 'mobile-routine-canvas-fidelity', 'mobile-canvas-routine']) {
    const spec = readFileSync(join(process.cwd(), '..', 'specs', feature, 'requirements.md'), 'utf8');
    expect(spec.split('## Enmienda #227 — Recordatorios próximos y pasados').length - 1).toBe(1);
    expect(spec).toMatch(/- \[[ xX]\] Enmienda #227 aprobada por humano/);
  }
});
