import { useMemo } from 'react';
import type { ViewStyle } from 'react-native';

import { useThemeColors } from './use-theme-colors';

export type Shadows = Record<'card' | 'dialog' | 'floating' | 'label' | 'marker' | 'ring' | 'segment' | 'sheet' | 'tabBar' | 'toast', ViewStyle>;

function layer(offsetY: number, blurRadius: number, spreadDistance: number, color: string) {
  return { offsetX: 0, offsetY, blurRadius, spreadDistance, color };
}

export function useShadows(): Shadows {
  const [near, far, ten, twelve, fourteen, twentyFive, background, accent] = useThemeColors([
    'shadow-near', 'shadow-far', 'shadow-10', 'shadow-12', 'shadow-14', 'shadow-25', 'background', 'accent',
  ]);
  return useMemo(() => ({
    card: { boxShadow: [layer(1, 2, 0, near), layer(8, 24, 0, far)] },
    dialog: { boxShadow: [layer(12, 40, 0, twentyFive)] },
    floating: { boxShadow: [layer(12, 32, 0, fourteen)] },
    label: { boxShadow: [layer(2, 8, 0, twelve)] },
    marker: { boxShadow: [layer(4, 12, 0, twentyFive)] },
    ring: { boxShadow: [layer(0, 0, 3, background), layer(0, 0, 5, accent)] },
    segment: { boxShadow: [layer(2, 6, 0, ten)] },
    sheet: { boxShadow: [layer(-8, 24, 0, ten)] },
    tabBar: { boxShadow: [layer(10, 30, 0, twelve)] },
    toast: { boxShadow: [layer(2, 8, 0, ten)] },
  }), [near, far, ten, twelve, fourteen, twentyFive, background, accent]);
}
