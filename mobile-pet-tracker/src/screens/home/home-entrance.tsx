import { ReduceMotion, withDelay, withSpring, withTiming } from 'react-native-reanimated';

import { MOTION_FADE_TIMING, MOTION_SETTLE_SPRING } from '../../theme/motion';

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
