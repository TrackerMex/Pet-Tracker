// #152 R8: barra de batería del collar
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { MOTION_FILL_TIMING } from '../../theme/motion';

export function CollarBatteryBar({ pct }: { pct: number }) {
  const reducedMotion = useReducedMotion();
  const fillPct = useSharedValue(reducedMotion ? pct : 0);
  const fillStyle = useAnimatedStyle(() => ({
    width: `${fillPct.get()}%` as `${number}%`,
  }));

  useEffect(() => {
    fillPct.set(reducedMotion ? pct : withTiming(pct, MOTION_FILL_TIMING));
  }, [fillPct, pct, reducedMotion]);

  return (
    <View
      testID="collar-battery-track"
      className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface"
    >
      <Animated.View
        testID="collar-battery-fill"
        className={pct > 60
          ? 'h-full rounded-full bg-success'
          : 'h-full rounded-full bg-warning-strong'}
        style={fillStyle}
      />
    </View>
  );
}
