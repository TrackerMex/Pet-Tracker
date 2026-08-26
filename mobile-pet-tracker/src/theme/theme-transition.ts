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

type WithThemeTransition =
  typeof import('react-native-nitro-theme-transition').withThemeTransition;

// El import top-level de react-native-nitro-modules lanza cuando el módulo
// nativo no existe (Expo Go, web, jest): la garantía "applyTheme runs exactly
// once in every path" de la librería empieza en withThemeTransition, no en su
// import. Require perezoso con fallback a cambio instantáneo (R4).
let nativeTransition: WithThemeTransition | null | undefined;

function getWithThemeTransition(): WithThemeTransition | null {
  if (nativeTransition === undefined) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      nativeTransition = (require('react-native-nitro-theme-transition') as {
        withThemeTransition: WithThemeTransition;
      }).withThemeTransition;
    } catch {
      nativeTransition = null;
    }
  }

  return nativeTransition;
}

export function useThemeTransition(): (next: ThemePreference) => void {
  const reducedMotion = useReducedMotion();

  return (next) => {
    const apply = () => {
      Uniwind.setTheme(next);
    };

    const withThemeTransition = reducedMotion ? null : getWithThemeTransition();
    if (withThemeTransition) {
      withThemeTransition(apply, THEME_FADE);
    } else {
      apply();
    }
    void setStoredTheme(next);
  };
}
