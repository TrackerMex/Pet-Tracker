import { renderHook } from '@testing-library/react-native';
import { withThemeTransition } from 'react-native-nitro-theme-transition';
import { Uniwind } from 'uniwind';

import { THEME_FADE, useThemeTransition } from '../theme-transition';

jest.mock('react-native-nitro-theme-transition', () => ({
  withThemeTransition: jest.fn((apply: () => void) => {
    apply();
  }),
  isThemeTransitionAvailable: jest.fn(() => false),
}));

jest.mock('uniwind', () => {
  const actual = jest.requireActual<typeof import('uniwind')>('uniwind');

  return {
    ...actual,
    Uniwind: { ...actual.Uniwind, setTheme: jest.fn() },
  };
});

jest.mock('../../utils/theme-preference', () => ({
  setStoredTheme: jest.fn(),
}));

const mockWithThemeTransition = jest.mocked(withThemeTransition);
const mockSetTheme = jest.mocked(Uniwind.setTheme);

describe('R5: THEME_FADE options', () => {
  it('exports the exact fade shape from the UI charter', () => {
    expect(THEME_FADE).toEqual({
      kind: 'fade',
      durationMs: 400,
      settleFrames: 4,
    });
  });
});

describe('R1: fade nativo en el toggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('invoca withThemeTransition con callback síncrono y THEME_FADE', () => {
    const { result } = renderHook(() => useThemeTransition());

    result.current('dark');

    expect(mockWithThemeTransition).toHaveBeenCalledTimes(1);
    const [apply, options] = mockWithThemeTransition.mock.calls[0];
    expect(options).toBe(THEME_FADE);

    mockSetTheme.mockClear();
    apply();
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
