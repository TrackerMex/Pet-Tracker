import { DefaultTheme, type Theme } from 'expo-router';
import { useUniwind } from 'uniwind';

import { useThemeColors } from './use-theme-colors';

export function useNavigationTheme(): Theme {
  const { theme } = useUniwind();
  const [primary, background, card, text, border, notification] = useThemeColors([
    'accent',
    'background',
    'surface',
    'foreground',
    'border',
    'danger',
  ]);

  return {
    dark: theme === 'dark',
    fonts: DefaultTheme.fonts,
    colors: { primary, background, card, text, border, notification },
  };
}
