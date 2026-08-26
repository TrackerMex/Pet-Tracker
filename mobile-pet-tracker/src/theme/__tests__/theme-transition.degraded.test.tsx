// R4 sin mock del paquete nitro: reproduce Expo Go/jest reales, donde el
// import de react-native-nitro-modules lanza por falta del módulo nativo.
import { renderHook } from '@testing-library/react-native';
import { Uniwind } from 'uniwind';

import { setStoredTheme } from '../../utils/theme-preference';
import { useThemeTransition } from '../theme-transition';

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

const mockSetTheme = jest.mocked(Uniwind.setTheme);
const mockSetStoredTheme = jest.mocked(setStoredTheme);

describe('R4: runtime sin módulo nativo (paquete real, sin mock)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('cambia y persiste el tema sin lanzar aunque el import nativo falle', async () => {
    const { result } = await renderHook(() => useThemeTransition());

    expect(() => result.current('dark')).not.toThrow();

    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockSetStoredTheme).toHaveBeenCalledTimes(1);
    expect(mockSetStoredTheme).toHaveBeenCalledWith('dark');
  });
});
