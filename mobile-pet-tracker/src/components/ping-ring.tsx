import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type WithTimingConfig,
} from 'react-native-reanimated';

import { MOTION_PING_FROM, MOTION_PING_TO_SCALE, MOTION_PING_TIMING } from '@/theme/motion';

export function PingRing({ testID, delay, className, timing = MOTION_PING_TIMING }: { testID: string; delay: number; className: string; timing?: WithTimingConfig }) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(reduceMotion ? 1 : MOTION_PING_FROM);
  const opacity = useSharedValue(reduceMotion ? 0.3 : MOTION_PING_FROM);

  useEffect(() => {
    if (!reduceMotion) {
      scale.set(withDelay(delay, withRepeat(withTiming(MOTION_PING_TO_SCALE, timing), -1, false)));
      opacity.set(withDelay(delay, withRepeat(withTiming(0, timing), -1, false)));
    }
    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [delay, opacity, reduceMotion, scale, timing]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ scale: scale.get() }],
  }));

  return <Animated.View testID={testID} className={`absolute ${className}`} style={animatedStyle} />;
}
