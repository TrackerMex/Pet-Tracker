import {
  MOTION_FEEDBACK_MS,
  MOTION_TRANSITION_MS,
  MOTION_SURFACE_MS,
  MOTION_STAGGER_MS,
  MOTION_ENTRANCE_OFFSET_Y,
  MOTION_SETTLE_SPRING,
  MOTION_FADE_TIMING,
  MOTION_FILL_TIMING,
} from '../motion';

declare function require(moduleName: '../motion'): Record<string, unknown>;

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
      'MOTION_ENTRANCE_OFFSET_Y',
      'MOTION_FADE_TIMING',
      'MOTION_FEEDBACK_MS',
      'MOTION_FILL_TIMING',
      'MOTION_SETTLE_SPRING',
      'MOTION_STAGGER_MS',
      'MOTION_SURFACE_MS',
      'MOTION_TRANSITION_MS',
    ]);
  });
});
