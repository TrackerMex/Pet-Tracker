interface DirectoryEntry {
  name: string;
  isDirectory: () => boolean;
}
declare function require(name: 'fs'): {
  readdirSync: (path: string, options: { withFileTypes: true }) => DirectoryEntry[];
  readFileSync: (path: string, encoding: 'utf8') => string;
};
declare function require(name: 'path'): { join: (...paths: string[]) => string };

const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const sourceRoot = join(process.cwd(), 'src');
function sourceFiles(directory = sourceRoot): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sourceFiles(path);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
  }).sort();
}
const sources = Object.fromEntries(sourceFiles().map(path => [path.slice(sourceRoot.length + 1), readFileSync(path, 'utf8')]));
const readSource = (path: string) => sources[path];
function openingTagWithTestId(source: string, anchor: string): string {
  const index = source.indexOf(anchor);
  expect(index).toBeGreaterThan(-1);
  expect(source.lastIndexOf(anchor)).toBe(index);
  return source.slice(source.lastIndexOf('<', index), source.indexOf('<', index)).split('/>')[0];
}
function elementWithTestId(source: string, anchor: string): string {
  const tag = openingTagWithTestId(source, anchor);
  const start = source.indexOf(tag);
  return source.slice(start, source.indexOf('</Button>', start) + '</Button>'.length);
}
const literalId = (id: string) => `testID="${id}"`;
const idOf = (tag: string) => {
  const match = tag.match(/testID=(?:"([^"]+)"|\{`([^`]+)`\}|\{([^}]+)\})/);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? '<sin testID>';
};
const buttons = Object.entries(sources).flatMap(([path, source]) => source.split(/<Button(?=[\s>])/).slice(1).map(part => ({ path, tag: part.split('<')[0] })));
const idsWhere = (predicate: (tag: string) => boolean) => buttons.filter(({ tag }) => predicate(tag)).map(({ tag }) => idOf(tag)).sort();
function inventory(pattern: RegExp): Record<string, number> {
  return Object.fromEntries(Object.entries(sources).flatMap(([path, source]) => {
    const count = (source.match(pattern) ?? []).length;
    return count ? [[path, count]] : [];
  }));
}
const count = (pattern: RegExp) => Object.values(inventory(pattern)).reduce((sum, n) => sum + n, 0);

const CTA_ROWS = [
  ['screens/edit-profile/index.tsx', literalId('edit-profile-save'), 'w-full h-14 rounded-16 bg-accent', ['onPress={() => void handleSubmit()}', 'isDisabled={submitting}']], // #194 R7
  ['screens/login/index.tsx', literalId('login-submit'), 'w-full h-14 rounded-16 bg-accent', ['isDisabled={submitting}', 'onPress={() => void handleSubmit()}']],
  ['screens/register/index.tsx', literalId('register-submit'), 'w-full h-14 rounded-16 bg-accent', ['isDisabled={!terms || submitting}', 'onPress={() => void handleSubmit()}']],
  ['screens/forgot/index.tsx', literalId('forgot-submit'), 'w-full h-14 rounded-16 bg-accent', ["isDisabled={email.trim() === '' || submitting}", 'onPress={() => void submit()}']],
  ['screens/reset-password/index.tsx', literalId('reset-submit'), 'w-full h-14 rounded-16 bg-accent', ['isDisabled={submitting}', 'onPress={() => void handleSubmit()}']],
  ['screens/alert-detail/index.tsx', literalId('alert-detail-ack'), 'w-full h-14 rounded-16 bg-accent', ['accessibilityRole="button"', 'isDisabled={acking}', 'onPress={() => void handleAck()}']],
  ['screens/welcome/index.tsx', literalId('welcome-get-started'), 'w-full h-14 rounded-16 bg-accent', ["onPress={() => router.push('/register')}"]],
  ['screens/pairing/index.tsx', literalId('pairing-submit'), 'w-full h-14 rounded-16 bg-accent', ["isDisabled={code.trim() === '' || claiming}", 'onPress={() => void handleClaim()}']],
  ['screens/home/index.tsx', literalId('weekly-activity-day-map'), 'w-full h-14 rounded-16 bg-accent', ["onPress={() => router.push('/map')}"]],
  ['components/celebration.tsx', 'testID={primary.testID}', 'w-full h-14 rounded-16 bg-accent', ['onPress={primary.onPress}']],
  ['components/empty-state.tsx', 'testID={`${testID}-action`}', 'h-14 rounded-16 bg-accent', ['onPress={action.onPress}']],
  ['screens/add-pet/index.tsx', literalId('add-pet-continue'), 'h-14 rounded-16 bg-accent', ['onPress={() => handleContinue()}']], // #191 R11
  ['screens/add-pet/index.tsx', literalId('add-pet-submit'), 'h-14 rounded-16 bg-accent', ['isDisabled={submitting}', 'onPress={() => void handleSubmit()}']],
  ['screens/add-reminder/index.tsx', literalId('add-reminder-submit'), 'mt-auto h-14 rounded-16 bg-accent', ['isDisabled={submitting}', 'onPress={() => void handleSubmit()}']],
  ['screens/docs-upload-form/index.tsx', literalId('docs-upload-submit'), 'h-14 rounded-16 bg-accent', ['isDisabled={uploading}', 'onPress={() => void submitDocument()}']],
  ['screens/geofence-editor/index.tsx', literalId('geofence-editor-save'), 'flex-2 h-13.5 rounded-16 bg-accent', ["isDisabled={busy || name.trim() === ''}", 'onPress={() => void save()}']],
  ['screens/geofences/index.tsx', literalId('geofences-add'), 'mt-auto h-14 rounded-16 bg-accent', ['isDisabled={busy || atLimit}']],
  ['screens/weight-log/index.tsx', literalId('weight-submit'), 'h-14 rounded-16 bg-accent', ['isDisabled={submitting}', 'onPress={() => void handleSubmit()}']],
] as const;
const NEUTRAL_ROWS = [
  ['screens/geofence-editor/index.tsx', literalId('geofence-editor-delete'), 'flex-1 h-13.5 rounded-16 border-2 border-lip-gray bg-surface', 'outline', 'Text', 'text-base font-extrabold text-danger', ['isDisabled={busy}', 'onPress={() => setDeleteVisible(true)}']], // #189 R13
  ['screens/welcome/index.tsx', literalId('welcome-have-account'), 'w-full h-14 rounded-16 border-2 border-lip-gray bg-surface', null, 'Text', 'text-17 font-bold text-accent-strong', ["onPress={() => router.push('/login')}"]],
  ['screens/forgot/index.tsx', literalId('forgot-resend'), 'w-full h-14 rounded-16 border-2 border-lip-gray bg-surface', 'secondary', 'Text', 'text-17 font-extrabold text-foreground', ['isDisabled={submitting}', 'onPress={() => void send(submittedEmail)}']],
  ['components/celebration.tsx', 'testID={secondary.testID}', 'w-full h-14 rounded-16 border-2 border-lip-gray bg-surface', null, 'Text', 'text-17 font-extrabold text-foreground', ['onPress={secondary.onPress}']],
  ['screens/docs-upload-form/index.tsx', literalId('docs-upload-cancel'), 'h-14 rounded-16 border-2 border-lip-gray bg-surface', 'outline', 'Text', 'text-17 font-extrabold text-foreground', ['isDisabled={uploading}', 'onPress={() => router.back()}']],
  ['screens/reminders/index.tsx', literalId('reminders-delete-cancel'), 'w-full h-14 rounded-16 border-2 border-lip-gray bg-surface', 'outline', 'Text', 'text-17 font-extrabold text-foreground', ['onPress={dismissDeleteSheet}']],
  ['screens/alert-detail/index.tsx', literalId('alert-detail-view-map'), 'h-13 rounded-16 border-2 border-lip-gray bg-surface', 'secondary', 'Button.Label', 'text-base font-extrabold text-foreground', ['accessibilityRole="button"']],
] as const;
const primaryIds = CTA_ROWS.map(([, anchor]) => idOf(anchor)).sort();
const neutralIds = NEUTRAL_ROWS.map(([, anchor]) => idOf(anchor)).sort();
const ctaFiles = [...new Set(CTA_ROWS.map(([path]) => path))].sort(); // #191 R11
const consumers = [...ctaFiles, 'screens/reminders/index.tsx', 'screens/alerts/index.tsx', 'screens/meal-schedule/index.tsx', 'screens/food/index.tsx', 'screens/profile/index.tsx', 'screens/map/index.tsx'].sort(); // #201 R13
const neutralInventory = ['${rowId}-ack', 'add-meal-time-button', 'alert-detail-view-map', 'docs-upload-cancel', 'forgot-resend', 'geofence-editor-delete', 'meal-time-edit-${index}', 'reminders-delete-cancel', 'secondary.testID', 'welcome-have-account'];
const radii = {
  'screens/edit-profile/index.tsx': 1, // #194 R6
  'components/celebration.tsx': 2,
  'components/empty-state.tsx': 1,
  'screens/add-pet/index.tsx': 2, // #191 R11
  'screens/add-reminder/index.tsx': 1,
  'screens/alert-detail/index.tsx': 2,
  'screens/docs-upload-form/index.tsx': 2,
  'screens/food/index.tsx': 2,
  'screens/forgot/index.tsx': 3,
  'screens/geofence-editor/index.tsx': 4, // #189 R13; #202 R18: +1
  'screens/geofences/index.tsx': 2, // #189 R7
  'screens/health/index.tsx': 1, // #199 R14
  'screens/home/index.tsx': 1,
  'screens/home/weekly-activity-chart.tsx': 1, // #198 R9
  'screens/login/index.tsx': 1,
  'screens/map/index.tsx': 1, // #201 R13
  'screens/pairing/index.tsx': 1,
  'screens/register/index.tsx': 1,
  'screens/reminders/index.tsx': 5, // #204 R9
  'screens/reset-password/index.tsx': 1,
  'screens/weight-log/index.tsx': 1,
  'screens/welcome/index.tsx': 2,
};

const disabledCtas: Record<string, string> = { 'screens/geofences/index.tsx': 'atLimit', 'screens/geofence-editor/index.tsx': "name.trim() === ''" }; // #189 R7; #189 R13

it.each(CTA_ROWS)('#177 R3.1: %s pinta la receta cta de %s (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por E4 R19) (enmendado por E4 R20) (enmendado por #204 R11) (enmendado por #202 R15)', (path, anchor, classes, keeps) => {
  const tag = openingTagWithTestId(readSource(path), anchor);
  const condition = disabledCtas[path];
  expect(tag).toContain(condition ? `className={${condition} ? '${classes.replace('bg-accent', 'bg-default')}' : '${classes}'}` : `className="${classes}"`);
  expect(tag).toContain(condition ? `style={${condition} ? KEEP_OPACITY : [chunkyLip.primary, KEEP_OPACITY]}` : 'style={chunkyLip.primary}');
  for (const keep of keeps) expect(tag).toContain(keep);
  for (const forbidden of ['border-b-4', 'border-black', 'rounded-xl', 'min-h-11']) expect(tag).not.toContain(forbidden);
});
it.each(CTA_ROWS)('#177 R3.2: %s pinta la etiqueta Text 17/800 de %s (enmendado por #189 R7) (enmendado por #189 R13)', (path, anchor) => {
  const element = elementWithTestId(readSource(path), anchor);
  const condition = disabledCtas[path];
  expect(element).toContain(condition ? `<Text className={${condition} ? 'text-17 font-extrabold text-muted' : 'text-17 font-extrabold text-accent-foreground'}>` : '<Text className="text-17 font-extrabold text-accent-foreground">');
  expect(element).not.toContain('Button.Label');
  expect(readSource(path)).toMatch(/import \{[^}]*\bText\b[^}]*\} from 'react-native';/);
});
it('#177 R3.3: el inventario de Button con bg-accent está cerrado', () => {
  expect(idsWhere(tag => /\bbg-accent(?=[\s'"`])/.test(tag))).toEqual([...primaryIds, 'reminders-add-link'].sort());
});
it.each(NEUTRAL_ROWS)('#177 R4.1: %s pinta la receta neutra de %s (enmendado por E4 R19) (enmendado por #202 R9) (enmendado por #202 R15)', (path, anchor, classes, variant, _label, _labelClasses, keeps) => {
  const tag = openingTagWithTestId(readSource(path), anchor);
  expect(tag).toContain(`className="${classes}"`);
  expect(tag).toContain(path === 'screens/geofence-editor/index.tsx' ? 'style={[chunkyLip.neutral, KEEP_OPACITY]}' : 'style={chunkyLip.neutral}');
  if (variant === null) expect(tag).not.toContain('variant=');
  else expect(tag).toContain(`variant="${variant}"`);
  for (const keep of keeps) expect(tag).toContain(keep);
  for (const forbidden of ['border-b-6', 'border-b-4', 'border-black', 'border-accent', 'bg-transparent', 'rounded-xl']) expect(tag).not.toContain(forbidden);
});
it.each(NEUTRAL_ROWS)('#177 R4.2: %s pinta la etiqueta de %s', (path, anchor, _classes, _variant, label, classes) => {
  const element = elementWithTestId(readSource(path), anchor);
  expect(element).toContain(`<${label} className="${classes}">`);
  if (label === 'Text') {
    expect(element).not.toContain('Button.Label');
    expect(readSource(path)).toMatch(/import \{[^}]*\bText\b[^}]*\} from 'react-native';/);
  } else expect(element).toContain('<Map size={18} color={foreground} />');
});
it('#177 R4.3: conserva los nueve secundarios neutros (enmendado por #189 R13)', () => {
  expect(idsWhere(tag => ((tag.includes('variant="outline"') || tag.includes('variant="secondary"')) && !tag.includes('bg-accent-soft') && !tag.includes('bg-default')) || tag.includes('border-lip-gray'))).toEqual(neutralInventory);
});
it('#177 R5.1: el compacto conserva talla, etiqueta e icono con labio de tres', () => {
  const source = readSource('screens/reminders/index.tsx');
  const tag = openingTagWithTestId(source, literalId('reminders-add-link'));
  expect(tag).toContain('className="rounded-xl bg-accent h-10 gap-1.5 px-3.5"');
  expect(tag).toContain('style={chunkyLip.primaryCompact}');
  expect(tag).not.toMatch(/border-b-4|border-black\/25/);
  const element = elementWithTestId(source, literalId('reminders-add-link'));
  expect(element).toContain('<Button.Label className="text-sm font-extrabold text-accent-foreground">');
  expect(element).toContain('<Plus size={16} color={accentForeground} />');
});
it('#177 R5.2: el tile conserva la esquina y recibe el labio con el orden exacto', () => {
  const tag = openingTagWithTestId(readSource('screens/forgot/index.tsx'), literalId('forgot-lock-tile'));
  expect(tag).toContain('className="size-13 items-center justify-center bg-accent rounded-16"');
  expect(tag).toContain('style={[CONTINUOUS_CORNER, chunkyLip.primary]}');
  expect(tag).not.toMatch(/border-b-4|border-black\/25/);
});
it('#177 R6.2: recuentos de etiquetas (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por #200 R5) (enmendado por #199 R9) (enmendado por #204 R8) (enmendado por #204 R9) (enmendado por #196 R6)', () => {
  // #177 R6
  expect(count(/<Button\.Label/g)).toBe(35 - 15 - 1 - 1 - 1 - 1 - 1 - 1); // #191 R11 // #189 R5; #189 R13; // #196 R6: -1 // #204 R8; #204 R9
  expect(count(/Button\.Label/g)).toBe(82 - 30 - 2 - 2 - 2 - 2 - 2 - 2); // #191 R11 // #189 R5; #189 R13; // #196 R6: -2 // #204 R8; #204 R9
  expect(count(/text-17/g)).toBe(8 + 15 + 1 + 1 + 1 + 1 + 1 + 1 + 1); // #200 R5; #199 R9 // #194 R6 // #191 R11 // #189 R7; #189 R13 // #204 R9
  expect(count(/<Text className="text-17 font-extrabold text-accent-foreground">/g)).toBe(5 + 11 + 1 + 1 - 1 - 1); // #194 R6 // #191 R11 // #189 R7; #189 R13
  expect(count(/text-17 font-extrabold text-foreground/g)).toBe(3 + 3 + 1 + 1); // #200 R5; #199 R9
  expect(count(/<Text className="text-17 font-bold text-accent-strong">/g)).toBe(0 + 1);
});
it('#177 R7.1: inventarios de los labios de borde restantes (enmendado por #189 R13) (enmendado por #197 R10)', () => {
  expect(inventory(/border-b-4/g)).toEqual({});
  expect(inventory(/border-black\/25/g)).toEqual({});
  expect(inventory(/\bborder-b-6\b/g)).toEqual({});
  expect(count(/border-lip-gray/g)).toBe(10 + 1); // #189 R13
});
it('#177 R7.2: inventarios de las dos recetas de primario (enmendado por #201 R13)', () => {
  expect(inventory(/rounded-16 bg-accent(?=[\s'"`])/g)).toEqual({ ...Object.fromEntries(ctaFiles.map(path => [path, path === 'screens/add-pet/index.tsx' ? 2 : 1])), 'screens/map/index.tsx': 1 }); // #201 R13
  expect(inventory(/rounded-xl bg-accent(?=[\s'"`])/g)).toEqual({ 'screens/reminders/index.tsx': 1 });
});
it('#177 R7.3: inventario de los veintisiete radios de dieciséis (enmendado por #191 R11) (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por #200 R9) (enmendado por #199 R14) (enmendado por #198 R9) (enmendado por #204 R9) (enmendado por #202 R18) (enmendado por #201 R13)', () => {
  expect(inventory(/\brounded-16\b/g)).toEqual(radii);
  expect(count(/\brounded-16\b/g)).toBe(26 + 1 + 1 + 1 + 2 + 2 + 1 + 1 + 1 + 1 + 1); // #204 R9 (+1) // #202 R18 (+1) // #200 R9 (+2); #198 R9 (+1); #199 R14 (+1); #201 R13 (+1) // #194 R6 // #191 R11 // #189 R7; #189 R13
});
it('#177 R7.4: solo la definición y los dieciocho consumidores usan el hook (enmendado por #197 R10) (enmendado por #200 R3) (enmendado por #196 R4) (enmendado por #201 R13)', () => {
  expect(Object.keys(inventory(/useChunkyLip/g)).sort()).toEqual([...consumers, 'theme/chunky-lip.ts'].sort());
  for (const path of consumers) expect((readSource(path).match(/const chunkyLip = useChunkyLip\(\);/g) ?? []).length).toBe(1);
});
it('#177 R7.5: inventario de los tres estilos y el tile (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por E4 R19) (enmendado por E4 R20) (enmendado por #197 R10) (enmendado por #200 R6) (enmendado por #196 R4, R5) (enmendado por #201 R13)', () => {
  expect(inventory(/style=\{(?:chunkyLip\.primary|(?:atLimit|name\.trim\(\) === '') \? KEEP_OPACITY : \[chunkyLip\.primary, KEEP_OPACITY\])\}/g)).toEqual(Object.fromEntries([...ctaFiles.map(path => [path, path === 'screens/add-pet/index.tsx' ? 2 : 1]), ['screens/profile/index.tsx', 2], ['screens/map/index.tsx', 1]].sort())); // #201 R13
  expect(inventory(/style=\{(?:chunkyLip\.neutral|\[chunkyLip\.neutral, KEEP_OPACITY\])\}/g)).toEqual(Object.fromEntries([...NEUTRAL_ROWS.map(([path]) => [path, 1]), ['screens/meal-schedule/index.tsx', 1]].sort()));
  expect(inventory(/style=\{chunkyLip\.primaryCompact\}/g)).toEqual({ 'screens/food/index.tsx': 1, 'screens/reminders/index.tsx': 1 });
  expect(inventory(/chunkyLip\.primary\b/g)).toEqual(Object.fromEntries([...ctaFiles.map(path => [path, path === 'screens/forgot/index.tsx' || path === 'screens/add-pet/index.tsx' ? 2 : 1]), ['screens/profile/index.tsx', 2], ['screens/map/index.tsx', 1]].sort())); // #201 R13
  expect(inventory(/style=\{chunkyLip\.neutralCompact\}/g)).toEqual({ 'screens/alerts/index.tsx': 1, 'screens/meal-schedule/index.tsx': 1 });
  expect(inventory(/chunkyLip\.summary/g)).toEqual({ 'screens/meal-schedule/index.tsx': 1 });
});
it.each([
  ['primary', [...primaryIds, 'notifications-open-settings'].sort()], ['neutral', [...neutralIds, 'add-meal-time-button'].sort()], ['primaryCompact', ['reminders-add-link']],
] as const)('#177 R8.1: solo la tabla recibe chunkyLip.%s (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por E4 R19) (enmendado por E4 R20) (enmendado por #197 R10) (enmendado por #196 R5)', (style, ids) => {
  expect(idsWhere(tag => tag.includes(`style={chunkyLip.${style}}`) || (style === 'primary' && /style=\{(?:atLimit|name\.trim\(\) === '') \? KEEP_OPACITY : \[chunkyLip\.primary, KEEP_OPACITY\]\}/.test(tag)) || (style === 'neutral' && tag.includes('style={[chunkyLip.neutral, KEEP_OPACITY]}')))).toEqual(ids);
});
it('#197 R10: Alertas y Horario usan useChunkyLip', () => {
  for (const path of ['screens/alerts/index.tsx', 'screens/meal-schedule/index.tsx']) expect(readSource(path)).toContain('const chunkyLip = useChunkyLip();');
});
it.each([
  ['screens/alerts/index.tsx', 'h-8.5 rounded-10 border-2 border-lip-gray bg-surface px-3'],
  ['screens/meal-schedule/index.tsx', 'h-12.5 flex-1 rounded-14 border-2 border-lip-gray bg-surface'],
  ['screens/meal-schedule/index.tsx', 'h-9 rounded-10 border-2 border-lip-gray bg-surface px-3.5'],
  ['screens/add-reminder/index.tsx', "const SELECTED_CHIP = 'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent';"],
  ['screens/meal-schedule/index.tsx', 'gap-2 rounded-24 bg-accent p-4'],
  ['screens/meal-schedule/index.tsx', 'variant="tertiary"'],
])('#177 R8.3: %s conserva el ancla positiva %s (enmendado por #197 R10)', (path, anchor) => {
  expect(readSource(path).split(anchor).length - 1).toBe(1);
});
it('#177 R8.4: destructivos, tonales y reintentos no reciben labio (enmendado por #189 R13) (enmendado por #204 R9)', () => {
  const excluded = ['device-unpair', 'profile-sign-out', 'lost-mode-button'];
  const tags = buttons.filter(({ tag }) => excluded.includes(idOf(tag)) || /-retry$/.test(idOf(tag)));
  for (const id of excluded) expect(tags.some(({ tag }) => idOf(tag) === id)).toBe(true);
  for (const { tag } of tags) expect(tag).not.toMatch(/chunkyLip|border-b-/);
  const photo = openingTagWithTestId(readSource('screens/add-pet/index.tsx'), literalId('add-pet-photo')); // #191 R11
  expect(photo.trimStart().startsWith('<Pressable')).toBe(true);
  expect(photo).not.toMatch(/chunkyLip|border-b-/);
});

const preservedLines = [
  "    - **Chip seleccionado** (fidelidad al canvas, #178; labio por estilo, #197): cápsula `rounded-full bg-accent` con `style={chunkyLip.primaryCompact}`, un labio de 3 px que cuelga fuera del alto; el chip sin seleccionar no lleva labio.",
  "    - **Secundarios de Horario** (fidelidad al canvas, #179; labio por estilo, #197): «Editar» `h-9 rounded-10 border-2 border-lip-gray bg-surface` con `style={chunkyLip.neutralCompact}` y «Añadir comida» `h-12.5 rounded-14 border-2 border-lip-gray bg-surface` con `style={chunkyLip.neutral}`, con el labio colgando fuera del alto; el resumen verde lleva `chunkyLip.summary`; «Generar plan» es tonal de la categoría violeta con `style={chunkyLip.violet}` (#200 R14).",
  "    - **Sin labio**: los tonales (`bg-accent-soft`, `bg-default`), los",
  "    - **Secundario compacto de fila** (#174; labio por estilo, #197): el ack de cada fila abierta de Alertas lleva `h-8.5 rounded-10 border-2 border-lip-gray bg-surface px-3` con `style={chunkyLip.neutralCompact}`, etiqueta `text-xs font-extrabold text-foreground` y `hitSlop={TOUCH_SLOP}` (34 + 12 = 46 de diana). Es la única excepción a la receta del secundario neutro; el inventario de #166 R3 lo lista por su `testID`.",
  "    - Primario del detalle de alerta (#180): ack con labio, h-14 rounded-16, etiqueta text-17 font-extrabold; el secundario «Ver en el mapa» es h-13 rounded-16 con el icono Map."
];
const guidelines = readFileSync(join(process.cwd(), '..', 'docs/ui-guidelines.md'), 'utf8');
const bodyRule = guidelines.split('13. **Botón con cuerpo**')[1].split('## Animación (decisiones por defecto)')[0];
it('#177 R11.1: la carta declara la receta global y conserva sus excepciones (enmendado por #197 R21) (enmendado por #200 R16)', () => {
  for (const literal of [
    'sombra sólida sin desenfoque', '`--lip`', '`--color-lip`', '`--color-lip-gray`', 'fuera del cuerpo',
    '`h-14 rounded-16 bg-accent`', '`style={chunkyLip.primary}`', '`text-17 font-extrabold text-accent-foreground`',
    '`h-14 rounded-16 border-2 border-lip-gray bg-surface`', '`style={chunkyLip.neutral}`',
    '**Compacto**', '`reminders-add-link`', '`chunkyLip.primaryCompact`', '**Tile con labio**', '`forgot-lock-tile`',
    '**Deshabilitado**', '`h-14 rounded-16 bg-default`', '`text-17 font-extrabold text-muted`', '#189', 'Text', 'Enmienda #187',
    'El tile del candado lleva `bg-accent` antes de `rounded-16` para no contar como primario',
  ]) expect(bodyRule).toContain(literal);
  for (const line of preservedLines) expect(bodyRule).toContain(line);
});
it('#177 R11.2: la carta nombra el radio global fuera de la escala', () => {
  const rule = guidelines.split('\n').find(line => line.includes('Fuera de la escala, por fidelidad al canvas (#177):')) ?? '';
  for (const literal of ['rounded-16', '56', 'tile del candado', '40', 'rounded-xl']) expect(rule).toContain(literal);
  expect(guidelines).toContain('**Control, tile, input, botón y píldora de dato** → `rounded-xl`');
});
it('#177 R11.3: la enmienda de cuenta actualiza el tile y retira la receta vieja', () => {
  const paragraph = guidelines.split('**El candado lleva labio.**')[1].split('**La CTA va al pie.**')[0];
  expect(paragraph).toContain('`bg-accent rounded-16`');
  expect(paragraph).toContain('`style={[CONTINUOUS_CORNER, chunkyLip.primary]}`');
  expect(paragraph).not.toContain('border-b-4');
  for (const section of guidelines.split(/(?=^## )/m)) {
    if (/^## Enmienda #(?:172|174|180)\b/.test(section)) continue;
    const lines = section.split('\n').filter(line => !line.includes('**Chip seleccionado**'));
    expect(lines.join('\n')).not.toContain('border-b-4');
  }
});
it('#177 R11.4: la carta añade la enmienda sin autoaprobarla', () => {
  const section = guidelines.split('## Enmienda #177 — Receta global de botones')[1] ?? '';
  expect(section).toContain('Directiva del humano');
  expect(section).toContain('**Qué cambia**');
  expect(section).toContain('specs/mobile-chunky-cta-canvas-fidelity/requirements.md');
  expect(section).toMatch(/^- \[[ xX]\] Enmienda #177 aprobada por humano/m);
});
it('#177 R11.5: la spec de #166 añade el bloque de sustitución', () => {
  const oldSpec = readFileSync(join(process.cwd(), '..', 'specs/mobile-chunky-cta/requirements.md'), 'utf8');
  const section = oldSpec.split('## Enmienda #177 — Receta global de botones')[1] ?? '';
  for (const literal of ['R2', 'R3', 'reemplaza', 'consistency-classnames.test.ts', 'en su sitio', 'mobile-chunky-cta-canvas-fidelity']) expect(section).toContain(literal);
  expect(section).toMatch(/^- \[[ xX]\] Enmienda #177 aprobada por humano/m);
});
it('#177 R12.1/R12.2: los diecinueve ficheros respetan los guards de la carta (enmendado por #197 R10) (enmendado por #200 R3) (enmendado por #201 R13)', () => {
  for (const path of [...consumers, 'theme/chunky-lip.ts']) {
    const source = readSource(path);
    expect(source).not.toMatch(/(?:bg|text|border|rounded|h|w|size|p|m|gap)-\[[^\]]+\]/);
    expect(source).not.toMatch(/#[\dA-Fa-f]{3,8}\b(?! R\d)/);
    expect(source).not.toMatch(/StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|elevation\s*:/);
  }
  expect('chunky-lip.ts useChunkyLip').not.toContain('shadow');
});
it('#177 R12.3: cada comentario de la feature nombra su requisito (enmendado por #197 R10) (enmendado por #200 R3) (enmendado por #201 R13)', () => {
  for (const path of [...consumers, 'theme/chunky-lip.ts']) expect(readSource(path)).not.toMatch(/#177(?! R\d)/);
  expect((readSource('screens/welcome/index.tsx').match(/text-accent-strong/g) ?? []).length).toBe(2);
});
