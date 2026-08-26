import { renderHook } from '@testing-library/react-native';
import {
  isThemeTransitionAvailable,
  withThemeTransition,
} from 'react-native-nitro-theme-transition';
import { Uniwind } from 'uniwind';

import { setStoredTheme } from '../../utils/theme-preference';
import { THEME_FADE, useThemeTransition } from '../theme-transition';

const mockUseReducedMotion = jest.fn<boolean, []>(() => false);
const mockHasNitroModules = jest.fn<boolean, []>(() => true);

jest.mock('../nitro-availability', () => ({
  hasNitroModules: () => mockHasNitroModules(),
}));

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual<typeof import('react-native-reanimated')>(
    'react-native-reanimated',
  ),
  useReducedMotion: () => mockUseReducedMotion(),
}));

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
const mockIsAvailable = jest.mocked(isThemeTransitionAvailable);
const mockSetTheme = jest.mocked(Uniwind.setTheme);
const mockSetStoredTheme = jest.mocked(setStoredTheme);

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
    mockUseReducedMotion.mockReturnValue(false);
  });

  it('invoca withThemeTransition con callback síncrono y THEME_FADE', async () => {
    const { result } = await renderHook(() => useThemeTransition());

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

describe('R3: reduced motion salta la animación', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReducedMotion.mockReturnValue(true);
  });

  it('aplica el tema directo sin invocar withThemeTransition', async () => {
    const { result } = await renderHook(() => useThemeTransition());

    result.current('light');

    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
    expect(mockWithThemeTransition).not.toHaveBeenCalled();
  });
});

describe('R4: degradación sin módulo nativo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReducedMotion.mockReturnValue(false);
    mockHasNitroModules.mockReturnValue(true);
  });

  it('sin módulo nativo ni evalúa el paquete: cambio directo', async () => {
    mockHasNitroModules.mockReturnValue(false);
    const { result } = await renderHook(() => useThemeTransition());

    result.current('dark');

    expect(mockWithThemeTransition).not.toHaveBeenCalled();
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockSetStoredTheme).toHaveBeenCalledWith('dark');
  });

  it('aplica el tema exactamente una vez, persiste y no consulta availability', async () => {
    const { result } = await renderHook(() => useThemeTransition());

    expect(() => result.current('dark')).not.toThrow();

    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockSetStoredTheme).toHaveBeenCalledTimes(1);
    expect(mockSetStoredTheme).toHaveBeenCalledWith('dark');
    expect(mockIsAvailable).not.toHaveBeenCalled();
  });

  it('persiste también en el camino reduced motion', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    const { result } = await renderHook(() => useThemeTransition());

    result.current('light');

    expect(mockSetStoredTheme).toHaveBeenCalledWith('light');
  });
});
