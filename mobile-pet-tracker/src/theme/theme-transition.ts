import { withThemeTransition } from 'react-native-nitro-theme-transition';
import { Uniwind } from 'uniwind';

import type { ThemePreference } from '../utils/theme-preference';

export const THEME_FADE = {
  kind: 'fade',
  durationMs: 400,
  settleFrames: 4,
} as const;

export function useThemeTransition(): (next: ThemePreference) => void {
  return (next) => {
    withThemeTransition(() => {
      Uniwind.setTheme(next);
    }, THEME_FADE);
  };
}
