import * as motion from '../theme/motion';
import { en, es } from '../i18n/catalog';
import { chartMonths } from '../components/weight-chart';
import { fmtDate, fmtDayMonthLong } from '../screens/home/format';

declare function require(moduleName: 'fs'): { readFileSync: (path: string, encoding: 'utf8') => string };
declare function require(moduleName: 'path'): { join: (...paths: string[]) => string };

const { readFileSync } = require('fs');
const { join } = require('path');

jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual<typeof import('react-native-reanimated')>('react-native-reanimated');
  return {
    ...actual,
    __esModule: true,
    default: actual.default,
    Easing: { bezier: (...points: number[]) => ({ bezier: points }) },
  };
});

function source(file: string): string {
  return readFileSync(join(process.cwd(), 'src', file), 'utf8');
}

describe('#199 R27: guardas', () => {
  it('#199 R27 global.css declara --text-34: 34px', () => {
    expect(source('theme/global.css')).toContain('--text-34: 34px;');
  });

  it('#199 R27 motion.ts exporta las siete constantes con sus valores', () => {
    expect(motion).toMatchObject({
      MOTION_DRAW_TIMING: { duration: 1200, easing: { bezier: [0, 0, 0.58, 1] }, reduceMotion: 'system' },
      MOTION_DRAW_DELAY_FULL_MS: 200,
      MOTION_DRAW_DELAY_MINI_MS: 300,
      MOTION_POINT_POP_MS: 400,
      MOTION_POINT_POP_DELAY_MS: 1300,
      MOTION_TOAST_FADE_MS: 300,
      MOTION_TOAST_DELAY_MS: 400,
    });
  });
});


describe('#199 R25: copy nuevo', () => {
  it.each([
    ['weightLog.history', 'Historial', 'History'],
    ['health.appliedOn', 'Aplicada {{date}}', 'Given {{date}}'],
    ['health.nextOn', 'Próxima {{date}}', 'Next {{date}}'],
    ['health.nextDoseToday', 'hoy', 'due today'],
    ['health.nextDoseTomorrow', 'mañana', 'tomorrow'],
    ['health.nextDoseInDays', 'en {{days}} días', 'in {{days}} days'],
    ['weightChart.lastSixMonths', 'Peso de los últimos 6 meses', 'Weight over the last 6 months'],
  ] as const)('#199 R25 %s dice %s en es y %s en en', (key, spanish, english) => {
    expect(es[key]).toBe(spanish);
    expect(en[key]).toBe(english);
  });
});


describe('#199 R24: Enmienda #199', () => {
  const heading = '## Enmienda #199: Salud y Peso al canvas (2026-10-23)';
  const rule2 = 'Tamaños fuera de la escala, por fidelidad al canvas (#199): `--text-34` (34 px), cifra de Peso.';
  const rule12 = 'Fuera de la escala, por fidelidad al canvas (#199): `rounded-24` (24 px), tarjeta de la gráfica de Peso, panel de la próxima dosis y tarjeta de peso de Salud, que son `View` con `CONTINUOUS_CORNER`; `rounded-16` (16 px), tile del panel de la próxima dosis; `rounded-14` (14 px), enlace al registro de peso de Salud.';
  it('#199 R24 la carta lleva la Enmienda #199 una sola vez con sus frases', () => {
    const charter = readFileSync(join(process.cwd(), '..', 'docs/ui-guidelines.md'), 'utf8');
    expect(charter.split(heading)).toHaveLength(2);
    for (const phrase of [
      '- **`rise` en Salud y Peso (#199).** `RiseIn` (`components/rise-in.tsx`) aplica `MOTION_RISE_TIMING` y `MOTION_RISE_OFFSET_Y` a tarjetas y filas con los retrasos del canvas: Salud 0 (próxima dosis), `80 + 60 · min(i, 2)` (vacunas) y 260 (peso); Peso 0 (gráfica), 80 (formulario), `140 + 60 · min(i, 2)` (historial) y `60 · i` (esqueletos). Con reduce motion no hay entrada.',
      '- **`draw` y `pop` de la gráfica de peso (#199).** La línea se dibuja con `MOTION_DRAW_TIMING` (1200 ms, `Easing.bezier(0, 0, 0.58, 1)`) tras `MOTION_DRAW_DELAY_FULL_MS` (200) en Peso o `MOTION_DRAW_DELAY_MINI_MS` (300) en Salud; el último punto de Peso hace `pop` (0.6 → 1.08 → 1 en `MOTION_POINT_POP_MS`, 400) a los `MOTION_POINT_POP_DELAY_MS` (1300). Con reduce motion salen completos.',
      '- **Fundido del toast de Peso (#199).** `FadeIn` de `MOTION_TOAST_FADE_MS` (300) tras `MOTION_TOAST_DELAY_MS` (400), con la sombra `useShadows().toast`.',
      rule2, rule12,
    ]) expect(charter).toContain(phrase);
    expect(charter.slice(charter.indexOf('2. **Tokens obligatorios**'), charter.indexOf('3. **Grep-clean permanente**'))).toContain(rule2);
    expect(charter.slice(charter.indexOf('12. **Escala de radios**'), charter.indexOf('13. **Botón con cuerpo**'))).toContain(rule12);
  });
  it('#199 R24 la spec lleva la casilla de la enmienda', () => {
    const requirements = readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-health-weight/requirements.md'), 'utf8');
    expect(requirements).toMatch(/- \[[ xX]\] Enmienda #199 aprobada por humano/);
  });
});


describe('#199 R26: fidelidad de Salud y Peso al canvas', () => {
  const canvas: Record<string, string> = Object.fromEntries([
    'Peso', 'PesoEstados', 'PesoRegistrado', 'Salud', 'SaludEstados', 'SaludSinMascota',
  ].map(name => [name, readFileSync(join(process.cwd(), '..', `specs/mobile-canvas-health-weight/canvas/${name}.dc.html`), 'utf8')]));
  const rows: [string, () => void][] = [
    ['viewBox completo', () => {
      expect(canvas.Peso).toContain('viewBox="0 0 310 110"');
      expect(source('components/weight-chart.tsx')).toContain('viewBox="0 0 310 110"');
    }],
    ['viewBox mini', () => {
      expect(canvas.Salud).toContain('height="56" viewBox="0 0 310 56"');
      expect(source('components/weight-chart.tsx')).toContain('viewBox="0 0 310 56"');
    }],
    ['rejilla', () => {
      expect(canvas.Peso).toContain('M0 20H310M0 55H310M0 90H310');
      expect(source('components/weight-chart.tsx')).toContain('d="M0 20H310M0 55H310M0 90H310"');
    }],
    ['draw completo', () => {
      expect(canvas.Peso).toContain('draw 1200ms ease-out 200ms');
      expect(motion.MOTION_DRAW_TIMING.duration).toBe(1200);
      expect(motion.MOTION_DRAW_DELAY_FULL_MS).toBe(200);
    }],
    ['draw mini', () => {
      expect(canvas.Salud).toContain('draw 1200ms ease-out 300ms');
      expect(motion.MOTION_DRAW_DELAY_MINI_MS).toBe(300);
    }],
    ['pop', () => {
      expect(canvas.Peso).toContain('pop 400ms ease-out 1300ms');
      expect(canvas.Peso).toContain('0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08)');
      expect(motion.MOTION_POINT_POP_MS).toBe(400);
      expect(motion.MOTION_POINT_POP_DELAY_MS).toBe(1300);
      expect(motion.MOTION_POP_SCALE).toBe(0.6);
      expect(motion.MOTION_CELEBRATION_POP_PEAK).toBe(1.08);
    }],
    ['fade del toast', () => {
      expect(canvas.PesoRegistrado).toContain('fade 300ms ease-out 400ms');
      expect(motion.MOTION_TOAST_FADE_MS).toBe(300);
      expect(motion.MOTION_TOAST_DELAY_MS).toBe(400);
    }],
    ['top del toast', () => {
      expect(canvas.PesoRegistrado).toContain('top: 98px');
      expect(canvas.Peso).toContain('padding: 56px 20px 32px');
      expect(source('screens/weight-log/index.tsx')).toContain('insets.top + 42');
    }],
    ['cifra 34', () => {
      expect(canvas.Peso).toContain('font-size: 34px');
      expect(source('theme/global.css')).toContain('--text-34: 34px');
    }],
    ['rise de Salud', () => {
      for (const delay of [80, 140, 200, 260]) expect(canvas.Salud).toContain(`rise 400ms ease-out ${delay}ms`);
      expect(source('screens/health/index.tsx')).toContain('80 + 60 * Math.min(');
      expect(source('screens/health/index.tsx')).toContain('delayMs={260}');
    }],
    ['rise de Peso', () => {
      expect(canvas.Peso).toContain('rise 400ms ease-out 80ms');
      expect(canvas.Peso).toContain('rise 400ms ease-out 140ms');
      expect(source('screens/weight-log/index.tsx')).toContain('delayMs={80}');
      expect(source('screens/weight-log/index.tsx')).toContain('140 + 60 * Math.min(');
    }],
    ['etiqueta de la gráfica', () => {
      expect(canvas.Peso).toContain('aria-label="Peso de los últimos 6 meses"');
      expect(es['weightChart.lastSixMonths']).toBe('Peso de los últimos 6 meses');
    }],
    ['Historial', () => {
      expect(canvas.Peso).toContain('>Historial<');
      expect(es['weightLog.history']).toBe('Historial');
    }],
    ['fecha de dosis', () => {
      expect(canvas.Salud).toContain('12 de octubre · en 6 días');
      expect(fmtDayMonthLong('2026-10-12', 'es') + ' · ' + es['health.nextDoseInDays'].replace('{{days}}', '6')).toBe('12 de octubre · en 6 días');
    }],
    ['subtítulo', () => {
      expect(canvas.Salud).toContain('Aplicada 3 mar 2026 · Próxima 3 mar 2027');
      const applied = es['health.appliedOn'].replace('{{date}}', fmtDate('2026-03-03', 'es'));
      const next = es['health.nextOn'].replace('{{date}}', fmtDate('2027-03-03', 'es'));
      expect(applied + ' · ' + next).toBe('Aplicada 3 mar 2026 · Próxima 3 mar 2027');
    }],
    ['toast', () => {
      expect(canvas.PesoRegistrado).toContain('Anotado. Ya lo puse en la gráfica.');
      expect(es['weightLog.weightLogged']).toBe('Anotado. Ya lo puse en la gráfica.');
    }],
    ['meses', () => {
      expect(canvas.Peso).toContain('<span>may</span><span>jun</span><span>jul</span><span>ago</span><span>sep</span><span>oct</span>');
      expect(chartMonths('2026-10-01')).toHaveLength(6);
    }],
  ];
  it.each(rows)('#199 R26 %s', (_name, verify) => { verify(); });
});
