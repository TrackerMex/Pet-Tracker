import * as motion from '../theme/motion';

declare function require(moduleName: 'fs'): { readFileSync: (path: string, encoding: 'utf8') => string };
declare function require(moduleName: 'path'): { join: (...paths: string[]) => string };

const { readFileSync } = require('fs');
const { join } = require('path');

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  Easing: { bezier: (...points: number[]) => ({ bezier: points }) },
}));

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
