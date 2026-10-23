import type { ReactNode } from 'react';
import Animated, { useReducedMotion, withDelay, withTiming } from 'react-native-reanimated';

import { MOTION_RISE_OFFSET_Y, MOTION_RISE_TIMING } from '../theme/motion';

export function RiseIn({ delayMs, testID, className, children }: {
  delayMs: number;
  testID?: string;
  className?: string;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const entering = () => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ translateY: MOTION_RISE_OFFSET_Y }] },
      animations: {
        opacity: withDelay(delayMs, withTiming(1, MOTION_RISE_TIMING)),
        transform: [{ translateY: withDelay(delayMs, withTiming(0, MOTION_RISE_TIMING)) }],
      },
    };
  };
  return (
    <Animated.View testID={testID} className={className} entering={reducedMotion ? undefined : entering}>
      {children}
    </Animated.View>
  );
}
