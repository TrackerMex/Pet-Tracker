import { useEffect, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  MOTION_ENTRANCE_SCALE,
  MOTION_FADE_TIMING,
  MOTION_POP_SPRING,
  MOTION_TRANSITION_MS,
} from '../theme/motion';

export function PopIn({ testID, className, style, children }: {
  testID?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(reduceMotion ? 1 : MOTION_ENTRANCE_SCALE);

  useEffect(() => {
    opacity.set(withDelay(MOTION_TRANSITION_MS, withTiming(1, MOTION_FADE_TIMING), ReduceMotion.Never));
    if (!reduceMotion) {
      scale.set(withDelay(MOTION_TRANSITION_MS, withSpring(1, MOTION_POP_SPRING)));
    }
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
