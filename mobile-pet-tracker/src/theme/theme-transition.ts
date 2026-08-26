import { useReducedMotion } from 'react-native-reanimated';
import { Uniwind } from 'uniwind';

import {
  setStoredTheme,
  type ThemePreference,
} from '../utils/theme-preference';
import { hasNitroModules } from './nitro-availability';

export const THEME_FADE = {
  kind: 'fade',
  durationMs: 400,
  settleFrames: 4,
} as const;

type WithThemeTransition =
  typeof import('react-native-nitro-theme-transition').withThemeTransition;

// El import de react-native-nitro-modules lanza cuando el módulo nativo no
// existe (Expo Go, web, jest): la garantía "applyTheme runs exactly once in
// every path" de la librería empieza en withThemeTransition, no en su import.
// Y capturar aquí no basta: fuera del arranque Metro guarda el require y
// reporta el throw a LogBox igualmente — por eso la sonda hasNitroModules
// decide ANTES de evaluar el paquete (R4).
let nativeTransition: WithThemeTransition | null | undefined;

function getWithThemeTransition(): WithThemeTransition | null {
  if (!hasNitroModules()) {
    return null;
  }
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
