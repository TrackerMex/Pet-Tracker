import type { ReactNode } from 'react';
import Animated, {
  ReduceMotion,
  useReducedMotion,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import {
  MOTION_RISE_OFFSET_Y,
  MOTION_RISE_TIMING,
  MOTION_STAGGER_MS,
} from '../../theme/motion';

export function homeEntering(delayMs: number, offsetY: number) {
  return (_values: unknown) => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ translateY: offsetY }] },
      animations: {
        opacity: withDelay(delayMs, withTiming(1, MOTION_RISE_TIMING), ReduceMotion.System),
        transform: [{
          translateY: withDelay(delayMs, withTiming(0, MOTION_RISE_TIMING), ReduceMotion.System),
        }],
      },
    };
  };
}


export function HomeEntrance({ index, testID, className, children }: {
  index: number;
  testID: string;
  className?: string;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <Animated.View
      testID={testID}
      className={className}
      entering={homeEntering(index * MOTION_STAGGER_MS, reducedMotion ? 0 : MOTION_RISE_OFFSET_Y)}
    >
      {children}
    </Animated.View>
  );
}
