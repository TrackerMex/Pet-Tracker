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
const canvas = (file: string) => readFileSync(join(process.cwd(), '..', 'specs', 'mobile-reminder-swipe-actions', 'canvas', file), 'utf8');
const count = (text: string, literal: string) => text.split(literal).length - 1;

it('#228 R1: el panel reutiliza las tres claves con su literal y sus invocaciones', () => {
  const spanish: Record<string, string> = es;
  const english: Record<string, string> = en;
  const source = readSource('screens/reminders/index.tsx');
  for (const [key, literalEs, literalEn, invocation, occurrences] of [
    ['reminders.delete', 'Eliminar', 'Delete', "t('reminders.delete')", 2],
    ['reminders.cancelSeries', 'Cancelar\nserie', 'Cancel\nseries', "t('reminders.cancelSeries')", 1],
    ['reminders.cancelSeriesA11y', 'Cancelar la serie {{title}}', 'Cancel the {{title}} series', "t('reminders.cancelSeriesA11y'", 1],
  ] as const) {
    expect(spanish[key]).toBe(literalEs);
    expect(english[key]).toBe(literalEn);
    expect(count(source, invocation)).toBe(occurrences);
    expect(R8_REMINDERS).toContainEqual({ file: 'src/screens/reminders/index.tsx', key });
  }
});

it.each([
  ['Panel', 'RecordatoriosDeslizarEliminar.dc.html', '.swa{position: absolute; top: 0; right: 0; bottom: 0; width: 96px; border: 0; background: none; color: var(--danger); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font: 800 13px Inter, system-ui, sans-serif; text-align: center; line-height: 1.15}', 'w-24 items-center justify-center gap-1 ${CATEGORY_SLOTS.rose.surface}'],
  ['Etiqueta', 'RecordatoriosDeslizarEliminar.dc.html', '.swa{position: absolute; top: 0; right: 0; bottom: 0; width: 96px; border: 0; background: none; color: var(--danger); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font: 800 13px Inter, system-ui, sans-serif; text-align: center; line-height: 1.15}', 'text-center text-13 font-extrabold text-danger'],
  ['Etiqueta en dos líneas', 'RecordatoriosDeslizarSerie.dc.html', 'Cancelar<br>serie</a>', "t('reminders.cancelSeries')"],
  ['Contenedor', 'RecordatoriosDeslizarEliminar.dc.html', '.sw{position: relative; flex: none; border-radius: 22px; overflow: hidden; background: var(--rose); animation: rise 400ms ease-out 70ms both}', '<View className="overflow-hidden rounded-22" style={CONTINUOUS_CORNER}>'],
  ['Franja rosa', 'RecordatoriosDeslizarSerie.dc.html', '.sw{position: relative; flex: none; border-radius: 22px; overflow: hidden; background: var(--rose); animation: rise 400ms ease-out both}', 'absolute inset-y-0 -left-6 w-6 ${CATEGORY_SLOTS.rose.surface}'],
  ['Icono de borrar', 'RecordatoriosDeslizarEliminar.dc.html', 'aria-label="Eliminar Refuerzo de rabia"><svg aria-hidden="true" width="20" height="20"', '<Trash size={20} color={danger} />'],
  ['Icono de serie', 'RecordatoriosDeslizarSerie.dc.html', 'aria-label="Cancelar la serie Antibiótico"><svg aria-hidden="true" width="20" height="20"', '<Repeat size={20} color={danger} />'],
])('#228 R10: %s sigue al artboard %s', (_name, artboard, canvasLiteral, productionLiteral) => {
  expect(count(canvas(artboard), canvasLiteral)).toBe(1);
  expect(count(readSource('screens/reminders/index.tsx'), productionLiteral)).toBe(1);
});

it('#228 R10: los tokens rosa y danger del canvas son los de global.css', () => {
  for (const artboard of ['RecordatoriosDeslizarEliminar.dc.html', 'RecordatoriosDeslizarSerie.dc.html']) {
    for (const [canvasLiteral, productionLiteral] of [
      ['--rose:#FFF0F3;', '--color-category-rose: #FFF0F3;'],
      ['--rose:#39131A;', '--color-category-rose: #39131A;'],
      ['--danger:#D92D20;', '--color-danger: #D92D20;'],
      ['--danger:#F87171;', '--color-danger: #F87171;'],
    ]) {
      expect(count(canvas(artboard), canvasLiteral)).toBe(1);
      expect(count(readSource('theme/global.css'), productionLiteral)).toBe(1);
    }
  }
});

it('#228 R11: inventario del fuente', () => {
  const source = readSource('screens/reminders/index.tsx');
  for (const [literal, occurrences] of [
    ['react-native-gesture-handler/ReanimatedSwipeable', 1],
    ['<ReanimatedSwipeable', 1],
    ['overshootRight={false}', 1],
    ['renderRightActions=', 1],
    ['swipeable.close()', 1],
    ['accessibilityActions=', 1],
    ['onAccessibilityAction=', 1],
    ['accessibilityElementsHidden', 1],
    ['importantForAccessibility="no-hide-descendants"', 1],
    ['disabled={deleting}', 1],
    ['if (!isOwner) return row;', 1],
    ['renderLeftActions', 0],
    ['variant="danger-soft"', 0],
    ['h-11 rounded-14 px-2.5', 0],
    ['isDisabled=', 0],
    ['expo-haptics', 0],
    ["from 'react-native-gesture-handler'", 0],
    ['CATEGORY_SLOTS.rose.surface', 4],
    ['<Button', 8],
    ['opacity: pressed', 2],
    ['size={20} color={danger}', 2],
  ] as const) expect(count(source, literal)).toBe(occurrences);
});

const AMENDED: readonly (readonly [string, string])[] = [
  ['screens/reminders/index.test.tsx', 'ordena mosaico, columna y borrar con la anatomía exacta de cada fila'],
  ['screens/reminders/index.test.tsx', 'shows a delete action for reminders in every status'],
  ['screens/reminders/index.test.tsx', 'closes the confirmation sheet on cancel and native dismiss'],
  ['screens/reminders/index.test.tsx', 'refetches and removes the row after $kind'],
  ['screens/reminders/index.test.tsx', 'shows the action error for $state.kind'],
  ['screens/reminders/index.test.tsx', 'disables only the row being deleted while the request is pending'],
  ['screens/reminders/index.test.tsx', 'cierra el sheet y elimina su contenido accesible al perder foco'],
  ['screens/reminders/index.test.tsx', 'borra el error visible al perder foco'],
  ['screens/reminders/index.test.tsx', 'mantiene deshabilitada solo la fila cuyo delete sigue pendiente'],
  ['screens/reminders/index.test.tsx', 'pinta reminders-delete-confirm con la variante danger y bg-danger'],
  ['screens/reminders/index.test.tsx', "describe('#178 R8: sheet de borrado del canvas"],
  ['screens/reminders/index.test.tsx', '#218 R1: backgroundStyle del BottomSheet de borrar es exactamente el token surface'],
  ['screens/reminders/index.test.tsx', 'queda en el sitio del vacío que sustituye'],
  ['screens/reminders/index.test.tsx', 'limpia %s tras cambiar la selección a null'],
  ['screens/reminders/index.test.tsx', '#204 R5: la cabecera encabeza el estado %s'],
  ['screens/reminders/index.test.tsx', '#204 R8: Eliminar de fila usa la receta rosa del canvas'],
  ['screens/reminders/index.test.tsx', '#204 R9: Eliminar de la hoja lleva cuerpo de 56 y labio danger'],
  ['screens/reminders/index.test.tsx', '#213 R15: la serie programada ofrece Cancelar serie y el puntual Eliminar'],
  ['screens/reminders/index.test.tsx', '#213 R15: una serie cancelada o enviada conserva Eliminar (%s)'],
  ['screens/reminders/index.test.tsx', '#213 R17: Cancelar serie abre la hoja con su copy'],
  ['screens/reminders/index.test.tsx', '#213 R17: sin nombre de mascota el cuerpo omite la mascota'],
  ['screens/reminders/index.test.tsx', '#213 R17: las dos hojas comparten un solo BottomSheet'],
  ['screens/reminders/index.test.tsx', '#213 R18: Mantener la serie cierra sin llamar a la API'],
  ['screens/reminders/index.test.tsx', '#216 R5 con el rol %s cada fila tiene %i hijos'],
  ['screens/reminders/index.test.tsx', '#227 R12: Eliminar y Cancelar serie siguen en su fila en las dos secciones y solo para el dueño'],
  ['__tests__/reminders-upcoming-past-canvas-fidelity.test.ts', '#227 R11: inventario del fuente'],
  ['__tests__/consistency-classnames.test.ts', '%s importa y aplica sus %i esquinas'],
  ['__tests__/consistency-classnames.test.ts', 'fusiona la esquina una vez y la entrega a las dos ramas de Card'],
  ['__tests__/consistency-classnames.test.ts', 'deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban'],
  ['__tests__/design-drift.test.ts', 'reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto'],
  ['__tests__/routine-canvas-fidelity.test.ts', '#204 R15: %s sigue al canvas'],
];

it('#228 R13: los candados enmendados nombran su enmienda y las specs enmendadas llevan su casilla', () => {
  for (const [path, locator] of AMENDED) {
    const lines = readSource(path).split('\n').filter((line) => line.includes(locator));
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('(enmendado por #228 R13)');
  }
  for (const feature of [
    'mobile-reminders-recurrence',
    'mobile-reminders-upcoming-past',
    'mobile-canvas-routine',
    'mobile-reminders',
    'mobile-role-aware-actions',
    'mobile-routine-canvas-fidelity',
  ]) {
    const spec = readFileSync(join(process.cwd(), '..', 'specs', feature, 'requirements.md'), 'utf8');
    // \x23 permite citar el encabezado sin que el guard lo confunda con un color.
    expect(count(spec, '## Enmienda \x23228 — Acciones de deslizar en Recordatorios')).toBe(1);
    expect(spec).toMatch(/- \[[ xX]\] Enmienda \x23228 aprobada/);
  }
});

describe('#228 R12: enmienda de la carta', () => {
  it('#228 R12: la carta lleva una vez el bloque de su enmienda', () => {
    // \x23 es el signo de número: la carta lo escribe literal y la fuente no lleva el número de feature desnudo.
    const checkbox = /- \[[ xX]\] Enmienda \x23228 aprobada por humano/g;
    const normalize = (text: string) => text.replace(checkbox, '- [ ] Enmienda \x23228 aprobada por humano');
    const design = readFileSync(join(process.cwd(), '..', 'specs/mobile-reminder-swipe-actions/design.md'), 'utf8');
    const canonical = /### Bloque «Enmienda \x23228»[\s\S]*?```markdown\n([\s\S]*?)\n```/.exec(design)?.[1];
    expect(canonical).toBeDefined();
    const charter = readFileSync(join(process.cwd(), '..', 'docs/ui-guidelines.md'), 'utf8');
    expect(normalize(charter).split(normalize(canonical ?? '')).length - 1).toBe(1);
    expect(charter.match(/^## Enmienda \x23228\b/gm)).toHaveLength(1);
    expect(charter).toMatch(/- \[[ xX]\] Enmienda \x23228 aprobada por humano/);
  });
});

it('#239 R6: inventario del fuente', () => {
  const source = readSource('screens/reminders/index.tsx');
  for (const [literal, occurrences] of [
    ['<View className="rounded-22 bg-background" style={CONTINUOUS_CORNER}>', 1],
    ['{past ? (', 1],
    [') : row}', 1],
    ["${past ? ' opacity-50' : ''}", 1],
    [' opacity-50', 1],
    ['bg-background', 4],
    ['absolute inset-y-0 -left-6 w-6 ${CATEGORY_SLOTS.rose.surface}', 1],
    ['<View className="overflow-hidden rounded-22" style={CONTINUOUS_CORNER}>', 1],
    ['testID=', 48],
    ['needsOffscreenAlphaCompositing', 0],
    ['renderToHardwareTextureAndroid', 0],
    ['childrenContainerStyle', 0],
  ] as const) expect(count(source, literal)).toBe(occurrences);
});

const AMENDED_PAST_ROW_BASE: readonly (readonly [string, string])[] = [
  ['__tests__/reminders-upcoming-past-canvas-fidelity.test.ts', '#227 R11: inventario del fuente'],
  ['__tests__/consistency-classnames.test.ts', '%s importa y aplica sus %i esquinas'],
  ['__tests__/consistency-classnames.test.ts', 'fusiona la esquina una vez y la entrega a las dos ramas de Card'],
  ['__tests__/consistency-classnames.test.ts', 'deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban'],
  ['__tests__/design-drift.test.ts', 'reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto'],
];

it('#239 R7: los candados enmendados nombran su enmienda y la spec enmendada lleva su casilla', () => {
  for (const [path, locator] of AMENDED_PAST_ROW_BASE) {
    const lines = readSource(path).split('\n').filter((line) => line.includes(locator));
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('(enmendado por #239 R7)');
  }
  const spec = readFileSync(join(process.cwd(), '..', 'specs', 'mobile-reminders-upcoming-past', 'requirements.md'), 'utf8');
  expect(count(spec, '## Enmienda \x23239 — Base opaca de la fila pasada')).toBe(1);
  expect(spec).toMatch(/- \[[ xX]\] Enmienda \x23239 aprobada/);
});
