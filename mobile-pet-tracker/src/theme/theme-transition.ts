import { withThemeTransition } from 'react-native-nitro-theme-transition';
import { useReducedMotion } from 'react-native-reanimated';
import { Uniwind } from 'uniwind';

import {
  setStoredTheme,
  type ThemePreference,
} from '../utils/theme-preference';

export const THEME_FADE = {
  kind: 'fade',
  durationMs: 400,
  settleFrames: 4,
} as const;

export function useThemeTransition(): (next: ThemePreference) => void {
  const reducedMotion = useReducedMotion();

  return (next) => {
    const apply = () => {
      Uniwind.setTheme(next);
    };

    if (reducedMotion) {
      apply();
    } else {
      withThemeTransition(apply, THEME_FADE);
    }
    void setStoredTheme(next);
  };
}
