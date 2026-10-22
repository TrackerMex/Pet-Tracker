import { useEffect, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  MOTION_CELEBRATION_EASE_OUT,
  MOTION_CELEBRATION_POP_PEAK,
  MOTION_HERO_BUBBLE_POP_DELAY_MS,
  MOTION_POP_SCALE,
  MOTION_SURFACE_MS,
} from '../../theme/motion';

export function BubblePop({ testID, className, style, children }: {
  testID?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const scale = useSharedValue(reduceMotion ? 1 : MOTION_POP_SCALE);

  useEffect(() => {
    if (reduceMotion) return;
    const rise = { ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_SURFACE_MS * 0.6 };
    const settle = { ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_SURFACE_MS * 0.4 };
    opacity.set(withDelay(MOTION_HERO_BUBBLE_POP_DELAY_MS, withTiming(1, rise)));
    scale.set(withDelay(MOTION_HERO_BUBBLE_POP_DELAY_MS, withSequence(
      withTiming(MOTION_CELEBRATION_POP_PEAK, rise),
      withTiming(1, settle),
    )));
  }, [opacity, reduceMotion, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ scale: scale.get() }],
  }));

  return (
    <Animated.View testID={testID} className={className} style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
