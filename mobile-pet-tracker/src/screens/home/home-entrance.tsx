import type { ReactNode } from 'react';
import Animated, {
  ReduceMotion,
  useReducedMotion,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  MOTION_ENTRANCE_OFFSET_Y,
  MOTION_FADE_TIMING,
  MOTION_SETTLE_SPRING,
  MOTION_STAGGER_MS,
} from '../../theme/motion';

export function homeEntering(delayMs: number, offsetY: number) {
  return (_values: unknown) => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ translateY: offsetY }] },
      animations: {
        opacity: withDelay(delayMs, withTiming(1, MOTION_FADE_TIMING), ReduceMotion.Never),
        transform: [{
          translateY: withDelay(delayMs, withSpring(0, MOTION_SETTLE_SPRING), ReduceMotion.Never),
        }],
      },
    };
  };
}


export function HomeEntrance({ index, testID, children }: {
  index: number;
  testID: string;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <Animated.View
      testID={testID}
      entering={homeEntering(index * MOTION_STAGGER_MS, reducedMotion ? 0 : MOTION_ENTRANCE_OFFSET_Y)}
    >
      {children}
    </Animated.View>
  );
}
