import { THEME_FADE } from '../theme-transition';

describe('R5: THEME_FADE options', () => {
  it('exports the exact fade shape from the UI charter', () => {
    expect(THEME_FADE).toEqual({
      kind: 'fade',
      durationMs: 400,
      settleFrames: 4,
    });
  });
});
