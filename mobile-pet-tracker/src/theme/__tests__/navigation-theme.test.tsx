import { renderHook } from '@testing-library/react-native';
import { DefaultTheme } from 'expo-router';

import { useNavigationTheme } from '../navigation-theme';

let mockTheme: 'light' | 'dark' = 'light';

jest.mock('standard-navigation', () => ({}));
jest.mock('uniwind', () => ({
  Uniwind: {
    getCSSVariable: (name: string) => `token:${name.replace(/^--color-/, '')}`,
  },
  useUniwind: () => ({ theme: mockTheme, hasAdaptiveThemes: false }),
}));

describe('#217 R1: tema de navegación desde los tokens', () => {
  beforeEach(() => {
    mockTheme = 'light';
  });

  it('#217 R1: mapea los seis colores del tema desde los tokens', async () => {
    const { result } = await renderHook(() => useNavigationTheme());

    expect(result.current.colors).toEqual({
      primary: 'token:accent',
      background: 'token:background',
      card: 'token:surface',
      text: 'token:foreground',
      border: 'token:border',
      notification: 'token:danger',
    });
  });

  it('#217 R1: dark sigue al tema de uniwind y fonts es la de DefaultTheme', async () => {
    const { result, rerender } = await renderHook(() => useNavigationTheme());

    expect(result.current.dark).toBe(false);
    expect(result.current.fonts).toBe(DefaultTheme.fonts);

    mockTheme = 'dark';
    await rerender({});

    expect(result.current.dark).toBe(true);
    expect(result.current.fonts).toBe(DefaultTheme.fonts);
  });
});
