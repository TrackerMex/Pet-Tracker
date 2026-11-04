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
