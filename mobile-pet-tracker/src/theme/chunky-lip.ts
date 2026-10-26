import { useMemo } from 'react';
import type { ViewStyle } from 'react-native';

import { useThemeColors } from './use-theme-colors';

export type ChunkyLip = Record<'danger' | 'hero' | 'neutral' | 'neutralCompact' | 'primary' | 'primaryCompact' | 'summary' | 'tileAmber' | 'tileBlue' | 'tileViolet' | 'violet', ViewStyle>;

function lipStyle(shadow: { offsetY: number; color: string; inset?: true }): ViewStyle {
  return { boxShadow: [{ offsetX: 0, blurRadius: 0, spreadDistance: 0, ...shadow }] };
}

export function useChunkyLip(): ChunkyLip {
  const [lip, lipGray, lipDanger, lipViolet, lipTileViolet, lipTileAmber, lipTileBlue] = useThemeColors([
    'lip', 'lip-gray', 'lip-danger', 'lip-violet', 'lip-tile-violet', 'lip-tile-amber', 'lip-tile-blue',
  ]);

  return useMemo(() => ({
    danger: lipStyle({ offsetY: 4, color: lipDanger }),
    hero: lipStyle({ offsetY: 6, color: lip }),
    neutral: lipStyle({ offsetY: 4, color: lipGray }),
    neutralCompact: lipStyle({ offsetY: 3, color: lipGray }),
    primary: lipStyle({ offsetY: 4, color: lip }),
    primaryCompact: lipStyle({ offsetY: 3, color: lip }),
    summary: lipStyle({ offsetY: 5, color: lip }),
    tileAmber: lipStyle({ offsetY: -4, color: lipTileAmber, inset: true }),
    tileBlue: lipStyle({ offsetY: -4, color: lipTileBlue, inset: true }),
    tileViolet: lipStyle({ offsetY: -4, color: lipTileViolet, inset: true }),
    violet: lipStyle({ offsetY: 4, color: lipViolet }),
  }), [lip, lipGray, lipDanger, lipViolet, lipTileViolet, lipTileAmber, lipTileBlue]);
}
