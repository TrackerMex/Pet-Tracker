declare function require(name: 'fs'): { readFileSync: (path: string, encoding: 'utf8') => string; existsSync: (path: string) => boolean; readdirSync: (path: string) => string[]; statSync: (path: string) => { isDirectory: () => boolean } };
declare function require(name: 'path'): { join: (...paths: string[]) => string };
const { readFileSync, existsSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

function artboard(name: string): string {
  return readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-zones/canvas', `${name}.dc.html`), 'utf8');
}
function source(path: string): string {
  return readFileSync(join(process.cwd(), 'src', path), 'utf8');
}
function contains(content: string, literal: string, count = 1) {
  expect(content.split(literal).length - 1).toBeGreaterThanOrEqual(count);
}

it('#202 R7: el canvas dibuja el diálogo de borrado', () => {
  const canvas = artboard('ZonasEliminar');
  for (const literal of ['padding: 0 28px', 'role="alertdialog"', 'border-radius: 28px;', '0 12px 40px rgba(13,17,23,0.25)', 'rgba(13,17,23,0.4)', '@keyframes fade{from{opacity:0}to{opacity:1}']) contains(canvas, literal);
  contains(canvas, 'height: 48px', 2);
  const dialog = source('components/confirm-dialog.tsx');
  for (const literal of ['FadeIn.duration(MOTION_TRANSITION_MS)', "'rgba(13,17,23,0.4)'", 'RiseIn', 'rounded-hero', 'shadows.dialog', 'min-h-12']) contains(dialog, literal);
});

it('#202 R3: el canvas dibuja el glifo de zona', () => {
  const canvas = artboard('Zonas');
  contains(canvas, '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"');
  contains(canvas, '<circle cx="12" cy="12" r="9" stroke-dasharray="3 3">', 5);
  contains(canvas, '<circle cx="12" cy="12" r="2.5">', 5);
  const production = source('screens/geofences/index.tsx');
  for (const literal of ['react-native-svg', '<Svg ', 'width={22}', 'height={22}', 'strokeWidth={2.2}', '<Circle cx={12} cy={12} r={9} strokeDasharray="3 3"', '<Circle cx={12} cy={12} r={2.5}']) contains(production, literal);
});

it('#202 R4: el canvas dibuja el interruptor 48x28', () => {
  contains(artboard('Zonas'), 'width: 48px; height: 28px', 5);
  contains(artboard('EditorZona'), 'width: 48px; height: 28px');
  for (const path of ['screens/geofences/index.tsx', 'screens/geofence-editor/index.tsx']) {
    contains(source(path), '<ToggleSwitch');
    expect(source(path)).not.toMatch(/import \{[^}]*\bSwitch\b[^}]*\} from 'heroui-native'/);
  }
});

it('#202 R5: el canvas pinta el aviso a 13/1.45', () => {
  contains(artboard('Zonas'), 'font-size: 13px; line-height: 1.45');
  contains(source('screens/geofences/index.tsx'), '<AlertTriangle size={20} color={warning}');
  contains(source('screens/geofences/index.tsx'), 'flex-1 text-13 leading-note ${CATEGORY_SLOTS.amber.ink}');
});

it('#202 R6: el canvas pinta la papelera sobre rose', () => {
  contains(artboard('Zonas'), 'var(--rose)', 5);
  contains(source('screens/geofences/index.tsx'), 'rounded-xl ${CATEGORY_SLOTS.rose.surface}');
});

it('#202 R10: el canvas dibuja la fila esqueleto', () => {
  contains(artboard('ZonasEstados'), 'width: 55%; height: 14px; border-radius: 7px');
  contains(artboard('ZonasEstados'), 'width: 35%');
  const production = source('screens/geofences/index.tsx');
  expect(production.split('<Skeleton').length - 1).toBe(5);
  for (const literal of ['[0, 1].map', 'size-11 rounded-14', 'h-3.5 rounded-full', "style={{ width: '55%' }}", 'h-2.5 rounded-full', "style={{ width: '35%' }}", 'h-7 w-12 rounded-full', 'size-11 rounded-xl']) contains(production, literal);
});

it('#202 R11: el canvas pinta los errores a 15/1.4', () => {
  contains(artboard('ZonasEstados'), 'font-size: 15px; line-height: 1.4', 2);
  contains(source('screens/geofences/index.tsx'), 'className="text-15 leading-body text-danger"', 2);
});

it('#202 R12: el canvas dibuja la fila flotante', () => {
  contains(artboard('EditorZona'), 'top: 52px');
  contains(artboard('EditorZona'), 'stroke-width="2.4"');
  const production = source('screens/geofence-editor/index.tsx');
  contains(production, 'style={{ top: insets.top + 8 }}');
  contains(production, '<BackButton testID="geofence-editor-back" strokeWidth={2.4}');
  contains(production, 'style={shadows.card}', 2);
});

it('#202 R13: el canvas dibuja la hoja con sombra y rise', () => {
  contains(artboard('EditorZona'), '0 -8px 24px rgba(13,17,23,0.10)');
  contains(artboard('EditorZona'), '@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}');
  contains(source('screens/geofence-editor/index.tsx'), '<RiseIn testID="geofence-editor-form-entrance" delayMs={0} className="-mt-6.5 shrink"');
  contains(source('screens/geofence-editor/index.tsx'), 'style={[CONTINUOUS_CORNER, { flexGrow: 0, flexShrink: 1 }, shadows.sheet]}');
});

it('#202 R14: el canvas pinta el nombre a 600 16px', () => {
  contains(artboard('EditorZona'), '600 16px');
  contains(source('screens/geofence-editor/index.tsx'), 'className="text-base font-semibold h-12.5 rounded-xl bg-default px-3.5"');
});

it('#202 R15: el canvas dibuja las acciones a 54', () => {
  contains(artboard('EditorZona'), 'height: 54px', 2);
  contains(source('screens/geofence-editor/index.tsx'), 'h-13.5 rounded-16', 3);
});

function openingTag(path: string, id: string): string {
  const content = source(path);
  const needle = `testID="${id}"`;
  const anchor = content.indexOf(needle);
  expect(anchor).toBeGreaterThanOrEqual(0);
  expect(content.lastIndexOf(needle)).toBe(anchor);
  const next = content.indexOf('<', anchor + needle.length);
  const block = content.slice(content.lastIndexOf('<', anchor), next < 0 ? content.length : next);
  const selfClosing = block.indexOf('/>');
  return selfClosing < 0 ? block : block.slice(0, selfClosing + 2);
}

it('#202 R16: el canvas pinta las notas a 14/1.4', () => {
  for (const board of ['EditorZona', 'EditorZonaSoloLectura']) contains(artboard(board), 'font-size: 14px; line-height: 1.4');
  for (const id of ['geofence-editor-reset-note', 'geofence-editor-read-only']) contains(openingTag('screens/geofence-editor/index.tsx', id), 'className="text-sm font-normal leading-body text-muted"');
  contains(openingTag('screens/geofence-editor/index.tsx', 'geofence-editor-error'), 'className="text-sm leading-body text-danger"');
  contains(openingTag('screens/geofence-editor/index.tsx', 'geofence-editor-radius-value'), "'text-15 font-bold text-foreground'");
});

it('#202 R17: el canvas dibuja las tarjetas de estado', () => {
  contains(artboard('EditorZonaEstados'), 'padding: 24px 16px', 3);
  contains(artboard('EditorZonaEstados'), 'font-size: 15px; line-height: 1.4', 4);
  const production = source('screens/geofence-editor/index.tsx');
  contains(production, 'className="items-center px-4 py-6"', 3);
  contains(production, "STATE_TEXT = 'text-center text-15 leading-body text-muted'");
  contains(production, '<ScreenHeader testID="geofence-editor-header"');
  expect(production).not.toContain('Stack.Screen');
});

it('#202 R18: el canvas dibuja las tres barras', () => {
  contains(artboard('EditorZonaEstados'), 'height: 48px');
  contains(artboard('EditorZonaEstados'), 'height: 8px');
  const production = source('screens/geofence-editor/index.tsx');
  expect(production.split('<Skeleton').length - 1).toBe(3);
  for (const [i, classes] of ['h-12 w-full rounded-xl', 'h-2 w-full rounded-full', 'h-12 w-full rounded-16'].entries()) contains(openingTag('screens/geofence-editor/index.tsx', `geofence-editor-loading-bar-${i}`), `className="${classes}"`);
});


it('#202 R2: header-layout.ts no existe ni se importa', () => {
  expect(existsSync(join(process.cwd(), 'src', 'theme', 'header-layout.ts'))).toBe(false);
  const needle = ['theme', 'header-layout'].join('/');
  function filesUnder(directory: string): string[] {
    return readdirSync(directory).flatMap(name => {
      const path = join(directory, name);
      return statSync(path).isDirectory() ? filesUnder(path) : [path];
    });
  }
  const references = filesUnder(join(process.cwd(), 'src'))
    .filter(path => /\.tsx?$/.test(path) && readFileSync(path, 'utf8').includes(needle));
  expect(references).toEqual([]);
});


it('#202 R20: la carta ya no describe la cabecera transparente de Zonas', () => {
  const charter = readFileSync(join(process.cwd(), '..', 'docs/ui-guidelines.md'), 'utf8');
  expect(charter).not.toContain('Cabecera nativa transparente (#189 E4)');
  expect(charter).not.toContain("bg-danger-soft`)");
  expect(charter).toContain('Cabecera en contenido (#202)');
});


it.each(['screens/geofences/index.tsx', 'screens/geofence-editor/index.tsx', 'components/confirm-dialog.tsx'])('#202 R25: %s no usa StyleSheet.create, clases arbitrarias ni hex', (path) => {
  const content = source(path);
  expect(content).not.toContain('StyleSheet.create');
  expect(content).not.toMatch(/\b[\w-]+-\[[^\]]+\]/);
  expect(content).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
});

it('#202 R25: package.json no añade dependencias (enmendado por #214 R23)', () => {
  const content = readFileSync(join(process.cwd(), 'package.json'), 'utf8');
  const manifest = JSON.parse(content) as { dependencies: Record<string, string> };
  expect(content).not.toContain('expo-linear-gradient');
  expect(Object.keys(manifest.dependencies)).toHaveLength(44 + 1); // #214 R23: expo-clipboard
});
