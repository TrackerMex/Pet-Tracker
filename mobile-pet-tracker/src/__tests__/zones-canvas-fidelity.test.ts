declare function require(name: 'fs'): { readFileSync: (path: string, encoding: 'utf8') => string };
declare function require(name: 'path'): { join: (...paths: string[]) => string };
const { readFileSync } = require('fs');
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
