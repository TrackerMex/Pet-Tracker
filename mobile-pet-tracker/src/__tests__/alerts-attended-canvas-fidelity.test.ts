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

it('#223 R17: grep-limpio', () => {
  const source = readSource('screens/alerts/index.tsx');
  expect(source).not.toMatch(/\p{Extended_Pictographic}/u);
  expect(source).not.toMatch(new RegExp(String.raw`#(?!\d{2,3} R\d)[\da-f]{3,8}\b`, 'i'));
  expect(source).not.toContain('StyleSheet.create');
  const classes = [...source.matchAll(/className=(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/g)]
    .map((match) => match[1] ?? match[2] ?? match[3]);
  for (const value of classes) expect(value).not.toMatch(/\[[^\]]*\]/);
  expect(source).not.toMatch(/(?<![\w-])(?:shadow(?!-none\b)[\w-]*|elevation)\b/);
});
it('#223 R17: las dianas táctiles llegan a 44 pt', () => {
  const source = readSource('screens/alerts/index.tsx');
  const openingTag = (id: string) => {
    const index = source.indexOf(`testID="${id}"`);
    expect(index).toBeGreaterThan(-1);
    return source.slice(source.lastIndexOf('<', index), source.indexOf('>', index));
  };
  const header = openingTag('alerts-attended-toggle');
  expect(header).toContain('h-10');
  expect(header).toContain('hitSlop={TOUCH_SLOP}');
  expect(40 + 6 + 6).toBeGreaterThanOrEqual(44);
  const attendedRow = source.slice(source.indexOf('function AttendedRow'), source.indexOf('export function AlertsScreen'));
  expect(attendedRow).toContain('min-h-11');
  expect(Number(attendedRow.match(/\bmin-h-(\d+(?:\.\d+)?)\b/)?.[1]) * 4).toBeGreaterThanOrEqual(44);
  const more = openingTag('alerts-attended-more');
  expect(Number(more.match(/\bh-(\d+(?:\.\d+)?)\b/)?.[1]) * 4).toBeGreaterThanOrEqual(44);
});

const amendedTitles = [
  [
    "screens/alerts/index.test.tsx",
    "alterna el tercer hijo entre ack y la píldora traducida"
  ],
  [
    "screens/alerts/index.test.tsx",
    "particiona por el status descargado y conserva el orden de cada grupo"
  ],
  [
    "screens/alerts/index.test.tsx",
    "no mueve la fila abierta al pulsar su ack"
  ],
  [
    "screens/alerts/index.test.tsx",
    "pide el cursor siguiente y conserva las filas de ambas páginas"
  ],
  [
    "screens/alerts/index.test.tsx",
    "no pide otra página cuando nextCursor es null"
  ],
  [
    "screens/alerts/index.test.tsx",
    "no pide otra página mientras la anterior está en vuelo"
  ],
  [
    "screens/alerts/index.test.tsx",
    "conserva la primera página y muestra error si falla la segunda"
  ],
  [
    "screens/alerts/index.test.tsx",
    "da prioridad al status cerrado descargado en el siguiente foco"
  ],
  [
    "screens/alerts/index.test.tsx",
    "ordena las abiertas por sección y en el orden del servidor"
  ],
  [
    "screens/alerts/index.test.tsx",
    "omite la cabecera de %s cuando la sección queda vacía"
  ],
  [
    "screens/alerts/index.test.tsx",
    "pinta cada cabecera una sola vez al cargar la página siguiente"
  ],
  [
    "screens/alerts/index.test.tsx",
    "no reordena al marcar leída una fila abierta"
  ],
  [
    "screens/alerts/index.test.tsx",
    "no pinta el contador con 0 nuevas: %s"
  ],
  [
    "screens/alerts/index.test.tsx",
    "suma las abiertas de todas las páginas cargadas"
  ],
  [
    "screens/alerts/index.test.tsx",
    "%s: sin borde de severidad"
  ],
  [
    "screens/alerts/index.test.tsx",
    "#203 R8: sin nuevas la cabecera no lleva accesorio"
  ],
  [
    "screens/alerts/index.test.tsx",
    "#223 R8: el encabezado alterna la sección y recuerda cuántas filas había"
  ],
  [
    "__tests__/chunky-cta-canvas-fidelity.test.ts",
    "#177 R7.5:"
  ],
  [
    "__tests__/chunky-cta-canvas-fidelity.test.ts",
    "#177 R7.1:"
  ],
  [
    "__tests__/chunky-cta-canvas-fidelity.test.ts",
    "#177 R7.3:"
  ],
  [
    "__tests__/chunky-cta-canvas-fidelity.test.ts",
    "#177 R4.3:"
  ],
  [
    "__tests__/chunky-cta-canvas-fidelity.test.ts",
    "#177 R6.2:"
  ],
  [
    "__tests__/chunky-cta-canvas-fidelity.test.ts",
    "#177 R8.3:"
  ],
  [
    "__tests__/design-drift.test.ts",
    "reserva los radios 14, 16 y 22 a Recordatorios"
  ],
  [
    "__tests__/alerts-canvas-fidelity.test.ts",
    "cada tracking-* va con su text-*"
  ],
  [
    "__tests__/consistency-classnames.test.ts",
    "%s importa y aplica sus %i esquinas"
  ],
  [
    "__tests__/consistency-classnames.test.ts",
    "fusiona la esquina una vez y la entrega a las dos ramas de Card"
  ],
  [
    "__tests__/consistency-classnames.test.ts",
    "deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban"
  ],
  [
    "__tests__/consistency-classnames.test.ts",
    "inventaría los cinco secundarios neutros de toda la app"
  ],
  [
    "providers/__tests__/language-provider.test.tsx",
    "#194 R1: mantiene la base más las claves de #68"
  ],
  [
    "app/__tests__/alert-detail.navigation.test.tsx",
    "abre la fila de la segunda página, la marca leída y la ve leída al volver"
  ]
] as const;

it('#223 R18: los candados enmendados nombran su enmienda', () => {
  for (const [file, prefix] of amendedTitles) {
    const title = readSource(file).split('\n').find((line) => line.includes("('" + prefix) || line.includes('("' + prefix));
    expect({ file, prefix, title }).toEqual({ file, prefix, title: expect.any(String) });
    expect(title).toContain(file === 'providers/__tests__/language-provider.test.tsx'
      ? '(enmendado por #223 R16)' : '(enmendado por #223 R18)');
  }
});
