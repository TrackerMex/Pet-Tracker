import { readFileSync } from 'fs';
import { join } from 'path';

import { MOTION_RING_DELAY_MS, MOTION_RING_TIMING } from '../theme/motion';

const FOOD = 'screens/food/index.tsx';
const SCHEDULE = 'screens/meal-schedule/index.tsx';
const HISTORY = 'screens/meals-history/index.tsx';
const MOTION = 'theme/motion.ts';
const source = (file: string) => readFileSync(join(process.cwd(), 'src', file), 'utf8');
const charter = () => readFileSync(join(process.cwd(), '..', 'docs/ui-guidelines.md'), 'utf8');
const GENERATE_PLAN_RULE = '«Generar plan» es tonal de la categoría violeta con `style={chunkyLip.violet}` (#200 R14).';

const canvasRows: [string, string, string, string[]][] = [
  ['Nutricion', 'padding: 60px 20px 120px', FOOD, ['paddingHorizontal: 20', 'paddingBottom: insets.bottom + 96']],
  ['Nutricion', 'animation: rise 400ms ease-out both', FOOD, ['delayMs={0}']],
  ['Nutricion', 'animation: rise 400ms ease-out 80ms both', FOOD, ['delayMs={80}']],
  ['Nutricion', 'animation: rise 400ms ease-out 140ms both', FOOD, ['delayMs={140}']],
  ['Nutricion', 'animation: rise 400ms ease-out 200ms both', FOOD, ['delayMs={200}']],
  ['Nutricion', 'animation: ring 1100ms ease-out 200ms both', MOTION, []],
  ['Nutricion', 'box-shadow: 0 6px 0 var(--lip)', FOOD, ['chunkyLip.hero']],
  ['Nutricion', 'box-shadow: 0 3px 0 var(--lip)', FOOD, ['chunkyLip.primaryCompact']],
  ['Nutricion', 'rgba(255,255,255,0.22)', FOOD, ['strokeOpacity={0.22}']],
  ['Nutricion', 'line-height: 1.4', FOOD, ['leading-body']],
  ['NutricionAvisos', 'animation: rise 400ms ease-out 110ms both', FOOD, ['110 + 30 * index']],
  ['NutricionAvisos', 'line-height: 1.45', FOOD, ['leading-note']],
  ['HorarioComidas', 'padding: 56px 20px 32px', SCHEDULE, ['paddingBottom: insets.bottom + 32']],
  ['HorarioComidas', 'box-shadow: 0 4px 0 rgba(91,63,163,0.35)', SCHEDULE, ['chunkyLip.violet']],
  ['HorarioComidas', 'animation: rise 400ms ease-out 80ms both', SCHEDULE, ['80 + 60 * index']],
  ['HistorialComidas', 'padding: 56px 20px 32px', HISTORY, ['paddingBottom: insets.bottom + 32']],
  ['HistorialComidas', 'animation: rise 400ms ease-out 100ms both', HISTORY, ['delayMs={100}']],
];

it.each(canvasRows)('#200 R16: cada literal del canvas tiene su valor en producción (%s: %s)', (board, literal, file, values) => {
  const artboard = readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-nutrition/canvas/' + board + '.dc.html'), 'utf8');
  expect(artboard).toContain(literal);
  for (const value of values) expect(source(file)).toContain(value);
  if (file === MOTION) {
    expect(MOTION_RING_TIMING.duration).toBe(1100);
    expect(MOTION_RING_DELAY_MS).toBe(200);
  }
});

it.each([
  [SCHEDULE, `<ScreenHeader testID="meal-schedule-header" size={24} backFallback="/food" title={t('mealSchedule.mealSchedule')} />`],
  [HISTORY, `<ScreenHeader testID="meals-history-header" size={24} backFallback="/food" title={t('mealsHistory.mealsHistory')} />`],
])('#200 R16: las cabeceras declaran su vuelta a Nutrición (%s)', (file, line) => {
  expect(source(file)).toContain(line);
});

it('#200 R16: la carta recoge la enmienda', () => {
  const section = charter().split('## Enmienda #200 (mobile-canvas-nutrition)')[1] ?? '';
  for (const literal of ['rounded-24', 'rounded-16', 'RiseIn', '110 + 30 * index', '80 + 60 * index', 'MOTION_RING_TIMING', 'MOTION_RING_DELAY_MS', 'View', 'Pressable', '- [X] Enmienda #200 aprobada por humano']) {
    expect(section).toContain(literal);
  }
});

it('#200 R16: la carta da a «Generar plan» su labio violeta', () => {
  expect(charter()).toContain(GENERATE_PLAN_RULE);
  expect(charter()).not.toContain('sigue sin labio hasta #200');
});
