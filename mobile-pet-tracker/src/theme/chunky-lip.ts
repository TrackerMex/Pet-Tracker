import { useMemo } from 'react';
import type { ViewStyle } from 'react-native';

import { useThemeColors } from './use-theme-colors';

export type ChunkyLip = Record<'primary' | 'primaryCompact' | 'neutral', ViewStyle>;

export function useChunkyLip(): ChunkyLip {
  const [lip, lipGray] = useThemeColors(['lip', 'lip-gray']);

  return useMemo(() => ({
    primary: {
      boxShadow: [{ offsetX: 0, offsetY: 4, blurRadius: 0, spreadDistance: 0, color: lip }],
    },
    primaryCompact: {
      boxShadow: [{ offsetX: 0, offsetY: 3, blurRadius: 0, spreadDistance: 0, color: lip }],
    },
    neutral: {
      boxShadow: [{ offsetX: 0, offsetY: 4, blurRadius: 0, spreadDistance: 0, color: lipGray }],
    },
  }), [lip, lipGray]);
}
