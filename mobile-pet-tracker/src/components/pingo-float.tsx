import { useEffect, type ReactNode } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { MOTION_PINGO_FLOAT_OFFSET_Y, MOTION_PINGO_FLOAT_TIMING } from '../theme/motion';

export function PingoFloat({ testID, children }: { testID: string; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!reduceMotion) {
      translateY.set(withRepeat(withTiming(-MOTION_PINGO_FLOAT_OFFSET_Y, MOTION_PINGO_FLOAT_TIMING), -1, true));
    }
    return () => cancelAnimation(translateY);
  }, [reduceMotion, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
  }));

  return <Animated.View testID={testID} style={animatedStyle}>{children}</Animated.View>;
}
