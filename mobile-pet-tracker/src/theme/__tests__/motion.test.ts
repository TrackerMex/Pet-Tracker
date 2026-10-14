import { ReduceMotion } from 'react-native-reanimated';
import {
  MOTION_FEEDBACK_MS,
  MOTION_TRANSITION_MS,
  MOTION_SURFACE_MS,
  MOTION_STAGGER_MS,
  MOTION_ENTRANCE_OFFSET_Y,
  MOTION_SETTLE_SPRING,
  MOTION_FADE_TIMING,
  MOTION_FILL_TIMING,
  MOTION_ENTRANCE_SCALE,
  MOTION_FLOAT_OFFSET_Y,
  MOTION_FLOAT_TIMING,
  MOTION_BLINK_INTERVAL_MS,
  MOTION_BLINK_TIMING,
  MOTION_PING_FROM,
  MOTION_PING_TIMING,
  MOTION_PING_TO_SCALE,
  MOTION_POP_SPRING,
} from '../motion';

declare function require(moduleName: '../motion'): Record<string, unknown>;
declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  Easing: {
    bezier: (...points: number[]) => ({ bezier: points }),
  },
}));

describe('#152 R1: las duraciones y el preset de movimiento viven en un solo sitio', () => {
  it('declara las tres duraciones de la carta', () => {
    expect(MOTION_FEEDBACK_MS).toBe(150);
    expect(MOTION_TRANSITION_MS).toBe(250);
    expect(MOTION_SURFACE_MS).toBe(400);
  });

  it('declara el escalonado y el desplazamiento de la entrada', () => {
    expect(MOTION_STAGGER_MS).toBe(60);
    expect(MOTION_ENTRANCE_OFFSET_Y).toBe(12);
  });

  it('declara un muelle de asentamiento sin rebote', () => {
    expect(MOTION_SETTLE_SPRING).toEqual({
      duration: 250,
      dampingRatio: 1,
      reduceMotion: 'system',
    });
  });

  it('declara un fundido ease-out que sobrevive a reduce motion', () => {
    expect(MOTION_FADE_TIMING).toEqual({
      duration: 250,
      easing: { bezier: [0.23, 1, 0.32, 1] },
      reduceMotion: 'never',
    });
  });

  it('declara el relleno de barra ease-in-out', () => {
    expect(MOTION_FILL_TIMING).toEqual({
      duration: 250,
      easing: { bezier: [0.77, 0, 0.175, 1] },
      reduceMotion: 'system',
    });
  });

  it('no exporta nada más', () => {
    expect(Object.keys(require('../motion')).sort()).toEqual([
      'MOTION_BLINK_INTERVAL_MS',
      'MOTION_BLINK_TIMING',
      'MOTION_CELEBRATION_BADGE_DELAY_MS',
      'MOTION_CELEBRATION_BADGE_POP_MS',
      'MOTION_CELEBRATION_EASE_OUT',
      'MOTION_CELEBRATION_POP_MS',
      'MOTION_CELEBRATION_POP_PEAK',
      'MOTION_CONFETTI_FALL_TIMING',
      'MOTION_ENTRANCE_OFFSET_Y',
      'MOTION_ENTRANCE_SCALE',
      'MOTION_FADE_TIMING',
      'MOTION_FEEDBACK_MS',
      'MOTION_FILL_TIMING',
      'MOTION_FLOAT_OFFSET_Y',
      'MOTION_FLOAT_TIMING',
      'MOTION_PING_FROM',
      'MOTION_PING_TIMING',
      'MOTION_PING_TO_SCALE',
      'MOTION_POP_SCALE',
      'MOTION_POP_SPRING',
      'MOTION_SETTLE_SPRING',
      'MOTION_STAGGER_MS',
      'MOTION_SURFACE_MS',
      'MOTION_TRANSITION_MS',
    ]);
  });
});

const { readFileSync } = require('fs');
const { join } = require('path');

describe('#152 R2: la carta apunta a motion.ts', () => {
  const charter = readFileSync(
    join(process.cwd(), '..', 'docs', 'ui-guidelines.md'),
    'utf8',
  );

  it('la carta nombra motion.ts en §Animación y ya no promete tokens --motion-*', () => {
    expect(charter).toContain('`src/theme/motion.ts` (enmienda A21 de #152)');
    expect(charter).not.toContain('promueven a tokens');
  });

  it('la carta declara la enmienda #152 con su casilla', () => {
    const heading = '## Enmienda #152 — el movimiento vive en src/theme/motion.ts';
    expect(charter).toContain(heading);
    expect(charter.slice(charter.indexOf(heading))).toMatch(
      /^- \[.*Enmienda aprobada por humano/m,
    );
  });

  it('global.css no declara tokens de movimiento', () => {
    expect(readFileSync(join(process.cwd(), 'src/theme/global.css'), 'utf8'))
      .not.toContain('--motion');
  });
});


describe('#153 R4: las constantes de Pingo viven en motion.ts', () => {
  it('declara la escala de entrada y el recorrido de la flotación', () => {
    expect(MOTION_ENTRANCE_SCALE).toBe(0.9);
    expect(MOTION_FLOAT_OFFSET_Y).toBe(4);
  });

  it('declara medio ciclo de flotación ease-in-out', () => {
    expect(MOTION_FLOAT_TIMING).toEqual({
      duration: 1200,
      easing: { bezier: [0.37, 0, 0.63, 1] },
      reduceMotion: ReduceMotion.System,
    });
  });

  it('declara el intervalo y el cambio instantáneo del parpadeo', () => {
    expect(MOTION_BLINK_INTERVAL_MS).toBe(4000);
    expect(MOTION_BLINK_TIMING).toEqual({ duration: 0, reduceMotion: ReduceMotion.System });
  });
});

describe('#167 R2: los tokens de pop y ping viven en motion.ts', () => {
  it('#167 R2: MOTION_POP_SPRING es un muelle de 400 ms con dampingRatio 0.6', () => {
    expect(MOTION_POP_SPRING).toEqual({
      duration: 400,
      dampingRatio: 0.6,
      reduceMotion: ReduceMotion.System,
    });
  });

  it('#167 R2: MOTION_PING_FROM vale 0.55', () => {
    expect(MOTION_PING_FROM).toEqual(0.55);
  });

  it('#167 R2: MOTION_PING_TO_SCALE vale 1.5', () => {
    expect(MOTION_PING_TO_SCALE).toEqual(1.5);
  });

  it('#167 R2: MOTION_PING_TIMING dura 2400 ms con la curva de salida', () => {
    expect(MOTION_PING_TIMING).toEqual({
      duration: 2400,
      easing: { bezier: [0.23, 1, 0.32, 1] },
      reduceMotion: ReduceMotion.System,
    });
  });
});

describe('#171 R6: las constantes de confeti viven en motion.ts', () => {
  it('declara MOTION_CONFETTI_FALL_TIMING', () => {
    expect(require('../motion').MOTION_CONFETTI_FALL_TIMING).toEqual({
      easing: { bezier: [0.2, 0.6, 0.4, 1] }, reduceMotion: 'system',
    });
  });
});

describe('#171 R7: las constantes de pop viven en motion.ts', () => {
  it('declara MOTION_POP_SCALE', () => {
    expect(require('../motion').MOTION_POP_SCALE).toBe(0.6);
  });
});

describe('#171 E4: las constantes de la celebración viven en motion.ts', () => {
  it('declara la curva ease-out de CSS', () => {
    expect(require('../motion').MOTION_CELEBRATION_EASE_OUT).toEqual({ easing: { bezier: [0, 0, 0.58, 1] }, reduceMotion: ReduceMotion.System });
  });

  it('declara los pops de Pingo y de la insignia', () => {
    const m = require('../motion');
    expect([m.MOTION_CELEBRATION_POP_MS, m.MOTION_CELEBRATION_POP_PEAK, m.MOTION_CELEBRATION_BADGE_POP_MS, m.MOTION_CELEBRATION_BADGE_DELAY_MS]).toEqual([600, 1.08, 500, 450]);
  });
});
