import { en, es } from '../i18n/catalog';
import { R5_HEALTH } from './ui-copy-table';

declare function require(moduleName: 'fs'): { readFileSync: (path: string, encoding: 'utf8') => string };
declare function require(moduleName: 'path'): { join: (...paths: string[]) => string };
const { readFileSync } = require('fs');
const { join } = require('path');

const sourceRoot = join(process.cwd(), 'src');
const readSource = (path: string) => readFileSync(join(sourceRoot, path), 'utf8');
const uiLanguageDesign = () => readFileSync(join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md'), 'utf8');

it('#241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41', () => {
  const spanish: Record<string, string> = es;
  const english: Record<string, string> = en;
  const source = readSource('screens/health/index.tsx');
  const section = uiLanguageDesign().split('### §2.41 — Añadidos por #241')[1]?.split('\n### ')[0] ?? '';
  for (const [key, literalEs, literalEn, row] of [
    ['health.sectionUpcoming', 'Próximas', 'Upcoming', '| — | `health.sectionUpcoming` | `Upcoming` | `Próximas` | ← añadida por #241 (R1) |'],
    ['health.sectionPast', 'Pasadas', 'Past', '| — | `health.sectionPast` | `Past` | `Pasadas` | ← añadida por #241 (R1) |'],
  ] as const) {
    expect(spanish[key]).toBe(literalEs);
    expect(english[key]).toBe(literalEn);
    expect(source.split(`t('${key}'`).length - 1).toBe(1);
    expect(R5_HEALTH).toContainEqual({ file: 'src/screens/health/index.tsx', key });
    expect(section).toContain(row);
  }
});

it.each([
  'className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"',
  'className="mt-1 h-10 w-full flex-row items-center gap-2"',
  'className="flex-1 flex-row items-center gap-2"',
  'className="text-13 font-extrabold uppercase tracking-caps text-muted"',
  'className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}',
  'className="size-8 items-center justify-center rounded-full bg-default"',
  '<PastChevron size={18} color={muted} />',
  'accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}',
  'const PastChevron = pastExpanded ? ChevronUp : ChevronDown;',
  'const [pastExpanded, setPastExpanded] = useState(false);',
])('#241 R11: %s', literal => {
  expect(readSource('screens/health/index.tsx').split(literal).length - 1).toBe(1);
  expect(readSource('screens/reminders/index.tsx')).toContain(literal);
});

it('#241 R11: inventario del fuente', () => {
  const source = readSource('screens/health/index.tsx');
  for (const [literal, count] of [
    ['style={TABULAR_NUMS}', 4],
    ['hitSlop={TOUCH_SLOP}', 2],
    ['style={CONTINUOUS_CORNER}', 7],
    ['accessibilityRole="header"', 3],
    ['className="gap-2.5"', 4],
    ['tracking-caps', 3],
    ['uppercase', 3],
    ['bg-default', 3],
    ['<Pressable', 3],
    ['rounded-full', 6],
    ["t('", 32],
    ['useState(false)', 1],
    ["import { useState } from 'react';", 1],
    ['splitVaccines(', 1],
    ['sections.upcoming.map(renderVaccineRow)', 1],
    ['sections.past.map(renderVaccineRow)', 1],
    ['vaccines.data.vaccines.map(', 0],
    ['delayMs={80 + 60 * Math.min(index, 2)}', 1],
    ['nextDoseAt >= today', 1],
    ['accessibilityState', 1],
  ] as const) expect(source.split(literal).length - 1).toBe(count);
});

const AMENDED: readonly (readonly [string, string])[] = [
  ['screens/health/index.test.tsx', 'highlights the nearest future dose and sorts upcoming rows by next dose'],
  ['screens/health/index.test.tsx', 'omits the next card when every dose is past or null'],
  ['screens/health/index.test.tsx', 'marks an overdue next-dose date with the danger token'],
  ['screens/health/index.test.tsx', 'pinta el estado de $id con su icono y textos'],
  ['screens/health/index.test.tsx', "describe('#199 R16: filas de vacunas"],
  ['screens/health/index.test.tsx', "describe('#199 R17: subtítulo de vacunas"],
  ['__tests__/consistency-classnames.test.ts', '%s aplica TABULAR_NUMS a sus %i valores'],
  ['__tests__/consistency-classnames.test.ts', '#69 R10: mantiene la base cerrada más los deltas medidos'],
  ['providers/__tests__/language-provider.test.tsx', '#194 R1: mantiene la base más las claves de #68'],
  ['__tests__/ui-language.test.ts', '#186 R7: resuelve las 43 ocurrencias normativas'],
];

it('#241 R12: los candados enmendados nombran su enmienda y la spec enmendada lleva su casilla', () => {
  for (const [path, locator] of AMENDED) {
    const lines = readSource(path).split('\n').filter(line => line.includes(locator));
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('(enmendado por #241 R12)');
  }
  const spec = readFileSync(join(process.cwd(), '..', 'specs', 'mobile-health', 'requirements.md'), 'utf8');
  expect(spec.split('## Enmienda #241 — Salud: vacunas próximas y pasadas').length - 1).toBe(1);
  expect(spec).toMatch(/- \[[ xX]\] Enmienda #241 aprobada por humano/);
});
