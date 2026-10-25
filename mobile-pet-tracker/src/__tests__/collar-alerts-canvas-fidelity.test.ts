import { es } from '../i18n/catalog';
import { ALERT_ROW_RISE_DELAYS } from '../screens/alerts/rise-delays';

declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');

const canvas = (artboard: string) =>
  readFileSync(
    join(process.cwd(), '..', `specs/mobile-canvas-collar-alerts/canvas/${artboard}.dc.html`),
    'utf8',
  );
const source = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');

// Opening tag that holds testID="<testId>": from the previous "<" to the first
// ">" after it that is not the one of an "=>".
function tagOf(file: string, testId: string): string {
  const at = file.indexOf(`testID="${testId}"`);
  if (at < 0) throw new Error(`testID="${testId}" not found`);
  const start = file.lastIndexOf('<', at);
  let end = at;
  do {
    end = file.indexOf('>', end + 1);
  } while (end > 0 && file[end - 1] === '=');
  return file.slice(start, end + 1);
}

const pairing = source('src/screens/pairing/index.tsx');
const alerts = source('src/screens/alerts/index.tsx');
const alertDetail = source('src/screens/alert-detail/index.tsx');
const celebration = source('src/components/celebration.tsx');
const lipDanger = /--color-lip-danger:\s*(#[0-9A-Fa-f]{6})/.exec(source('src/theme/global.css'))?.[1];
const rise = (delay: number) => `rise 400ms ease-out ${delay}ms both`;

const rows: [string, () => void][] = [
  [
    'título 28',
    () => {
      expect(canvas('VincularVinculado')).toContain('font-size: 28px');
      expect(tagOf(pairing, 'device-title')).toContain('text-28 font-black tracking-title');
    },
  ],
  [
    'radio 22',
    () => {
      expect(canvas('VincularVinculado')).toContain('border-radius: 22px');
      expect(tagOf(pairing, 'device-status-card')).toContain('rounded-22');
    },
  ],
  [
    'píldora',
    () => {
      const board = canvas('VincularVinculado');
      expect(board).toContain('height: 36px');
      expect(board).toContain('var(--pill)');
      const tag = tagOf(pairing, 'plan-tracked');
      expect(tag).toMatch(/(?<![\w.-])h-9(?![\w.])/);
      expect(tag).toContain('bg-tab-pill');
    },
  ],
  [
    'labio rojo',
    () => {
      expect(lipDanger).toBeDefined();
      expect(canvas('VincularVinculado')).toContain(`0 4px 0 ${lipDanger}`);
      expect(canvas('VincularDesvincular')).toContain(`0 4px 0 ${lipDanger}`);
      expect(tagOf(pairing, 'device-unpair')).toContain('style={chunkyLip.danger}');
      expect(tagOf(pairing, 'pairing-unpair-confirm')).toContain('style={chunkyLip.danger}');
    },
  ],
  [
    'copy de la hoja',
    () => {
      const title = es['pairing.unpairAlertTitle'];
      const bodyStart = es['pairing.unpairAlertBody'].split(',')[0];
      expect(title.length).toBeGreaterThan(0);
      expect(bodyStart.length).toBeGreaterThan(0);
      const board = canvas('VincularDesvincular');
      expect(board).toContain(title);
      expect(board).toContain(bodyStart);
    },
  ],
  [
    'retardos de Alertas',
    () => {
      expect(ALERT_ROW_RISE_DELAYS).toHaveLength(5);
      const board = canvas('Alertas');
      for (const delay of ALERT_ROW_RISE_DELAYS) {
        expect(board).toContain(`rise 400ms ease-out ${delay}ms`);
      }
      expect(alerts).toContain("from './rise-delays'");
    },
  ],
  [
    'retardo del detalle',
    () => {
      expect(canvas('DetalleAlerta')).toContain(rise(80));
      expect(tagOf(alertDetail, 'alert-detail-map-entrance')).toContain('delayMs={80}');
    },
  ],
  [
    'retardos de Vincular',
    () => {
      const board = canvas('Vincular');
      expect(board).toContain(rise(80));
      expect(board).toContain(rise(140));
      expect(tagOf(pairing, 'pairing-plan-rise')).toContain('delayMs={80}');
      expect(tagOf(pairing, 'pairing-code-rise')).toContain('delayMs={140}');
    },
  ],
  [
    'retardos de la vista con collar',
    () => {
      const board = canvas('VincularVinculado');
      expect(board).toContain(rise(80));
      expect(board).toContain(rise(140));
      expect(tagOf(pairing, 'device-status-rise')).toContain('delayMs={80}');
      expect(tagOf(pairing, 'device-plan-rise')).toContain('delayMs={140}');
    },
  ],
  [
    'margen superior',
    () => {
      for (const artboard of ['VincularVinculado', 'Alertas', 'DetalleAlerta']) {
        expect(canvas(artboard)).toContain('padding: 56px 20px');
      }
      for (const file of [pairing, alerts, alertDetail]) {
        expect(file).toContain('insets.top + 8');
      }
    },
  ],
  [
    'Celebración título',
    () => {
      expect(canvas('Celebracion')).toContain('font-size: 30px');
      expect(celebration).toContain('text-3xl font-black tracking-title');
    },
  ],
  [
    'Celebración cuerpo',
    () => {
      expect(canvas('Celebracion')).toContain('max-width: 300px');
      expect(celebration).toContain('max-w-75');
    },
  ],
];

describe('#203 R12: fidelidad contra los artboards congelados', () => {
  it.each(rows)('#203 R12: %s', (_name, check) => {
    check();
  });
});
