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
