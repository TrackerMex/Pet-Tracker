import { en, es } from '../i18n/catalog';

declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
declare function require(moduleName: 'path'): { join: (...paths: string[]) => string };

const { readFileSync } = require('fs');
const { join } = require('path');
const sourceRoot = join(process.cwd(), 'src');
const readSource = (path: string) => readFileSync(join(sourceRoot, path), 'utf8');

it('#223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una', () => {
  const copy = [
    ['alerts.sectionOpen', 'Abiertas', 'Open'],
    ['alerts.attended', 'Atendidas', 'Attended'],
    ['alerts.attendedMore', 'Ver más', 'Show more'],
    ['alerts.attendedShowing', 'Mostrando {{shown}} de {{total}}', 'Showing {{shown}} of {{total}}'],
    ['alerts.calmTitle', 'Todo en calma', 'All calm'],
    ['alerts.calmBody', 'No tienes alertas abiertas. {{petName}} está tranquilo.', 'You have no open alerts. {{petName}} is calm.'],
  ] as const;
  const spanish: Record<string, string> = es;
  const english: Record<string, string> = en;
  const source = readSource('screens/alerts/index.tsx');
  for (const [key, literalEs, literalEn] of copy) {
    expect(spanish[key]).toBe(literalEs);
    expect(english[key]).toBe(literalEn);
    expect(source.split(`t('${key}'`).length - 1).toBe(1);
  }
  for (const key of ['alerts.statusAcked', 'alerts.statusClosed']) {
    expect(source.split(`t('${key}'`).length - 1).toBe(1);
  }
});


it('#223 R17: el encabezado de Atendidas', () => {
  const source = readSource('screens/alerts/index.tsx');
  for (const literal of ['mt-1.5 h-10 w-full flex-row items-center gap-2', 'hitSlop={TOUCH_SLOP}', 'accessibilityRole="button"', 'accessibilityState={{ expanded']) expect(source).toContain(literal);
});
it('#223 R17: la etiqueta', () => {
  expect(readSource('screens/alerts/index.tsx')).toContain('text-13 font-extrabold uppercase tracking-caps text-muted');
  expect(readSource('screens/alerts/index.tsx')).toContain('testID="alerts-attended-label"');
});
it('#223 R17: el contador', () => {
  expect(readSource('screens/alerts/index.tsx')).toContain('rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted');
});
it('#223 R17: el disco del chevron', () => {
  const source = readSource('screens/alerts/index.tsx');
  for (const literal of ['size-8 items-center justify-center rounded-full bg-default', 'ChevronDown', 'ChevronUp', 'size={18}']) expect(source).toContain(literal);
});

it('#223 R17: la lista de atendidas', () => {
  expect(readSource('screens/alerts/index.tsx')).toContain('testID="alerts-attended-list" className="gap-1.5"');
});

it("#223 R17: la fila atendida", () => {
  const source = readSource('screens/alerts/index.tsx');
  expect(source).toContain("flex-row items-center gap-3 rounded-16 border border-border bg-surface px-3.5 py-2.5");
  expect(source).toContain("style={CONTINUOUS_CORNER}");
});

it("#223 R17: el disco del icono", () => {
  const source = readSource('screens/alerts/index.tsx');
  expect(source).toContain("size-9 items-center justify-center rounded-full ${meta.disc}");
  expect(source).toContain("size={18}");
});

it("#223 R17: el enlace", () => {
  const source = readSource('screens/alerts/index.tsx');
  expect(source).toContain("min-h-11 min-w-0 flex-1 justify-center gap-px");
});

it("#223 R17: el título", () => {
  const source = readSource('screens/alerts/index.tsx');
  expect(source).toContain("text-sm font-extrabold text-foreground");
});

it("#223 R17: el subtítulo", () => {
  const source = readSource('screens/alerts/index.tsx');
  expect(source).toContain("text-xs font-normal text-muted");
});

it("#223 R17: la píldora", () => {
  const source = readSource('screens/alerts/index.tsx');
  expect(source).toContain("rounded-full bg-default px-2.5 py-1 text-xs font-bold text-muted");
  expect(source).toContain("rounded-full ${CATEGORY_SLOTS.green.surface} px-2.5 py-1 text-xs font-extrabold ${CATEGORY_SLOTS.green.ink}");
});

it('#223 R17: Ver más', () => {
  const source = readSource('screens/alerts/index.tsx');
  for (const literal of ['h-11 rounded-14 border-2 border-lip-gray bg-surface px-5.5', 'style={chunkyLip.neutralCompact}', 'text-sm font-extrabold text-foreground', 'items-center gap-1.5 pt-1.5']) expect(source).toContain(literal);
});
it('#223 R17: el pie', () => {
  expect(readSource('screens/alerts/index.tsx')).toContain('testID="alerts-attended-footer" className="text-xs text-muted"');
});

it("#223 R17: el encabezado Abiertas", () => {
  const source = readSource('screens/alerts/index.tsx');
  expect(source).toContain("testID=\"alerts-open-heading\"");
  expect(source).toContain("mt-1.5 text-13 font-extrabold uppercase tracking-caps text-muted");
  expect(source).toContain("accessibilityRole=\"header\"");
});

it("#223 R17: la tarjeta de calma", () => {
  const source = readSource('screens/alerts/index.tsx');
  expect(source).toContain("variant=\"secondary\"");
  expect(source).toContain("flex-row items-center gap-3.5 border-0 px-4 py-4.5");
});

it("#223 R17: el disco de calma", () => {
  const source = readSource('screens/alerts/index.tsx');
  expect(source).toContain("size-11 items-center justify-center rounded-full bg-surface");
  expect(source).toContain("size={22}");
  expect(source).toContain("strokeWidth={2.2}");
  expect(source).toContain("category-green-strong");
});

it("#223 R17: el título de calma", () => {
  const source = readSource('screens/alerts/index.tsx');
  expect(source).toContain("text-base font-extrabold text-foreground");
});

it("#223 R17: el cuerpo de calma", () => {
  const source = readSource('screens/alerts/index.tsx');
  expect(source).toContain("text-13 text-muted");
});
