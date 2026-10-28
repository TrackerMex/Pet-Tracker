import { useEffect, type ReactNode } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { MOTION_ORBIT_FLOAT_OFFSET_Y, MOTION_ORBIT_FLOAT_TIMING } from '../theme/motion';

export function OrbitFloat({ testID, children }: { testID: string; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!reduceMotion) {
      translateY.set(withRepeat(withTiming(-MOTION_ORBIT_FLOAT_OFFSET_Y, MOTION_ORBIT_FLOAT_TIMING), -1, true));
    }
    return () => cancelAnimation(translateY);
  }, [reduceMotion, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
  }));

  return <Animated.View testID={testID} style={animatedStyle}>{children}</Animated.View>;
}
