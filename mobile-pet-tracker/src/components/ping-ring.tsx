import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { MOTION_PING_FROM, MOTION_PING_TO_SCALE, MOTION_PING_TIMING } from '@/theme/motion';

export function PingRing({ testID, delay, className }: { testID: string; delay: number; className: string }) {
  const scale = useSharedValue(MOTION_PING_FROM);
  const opacity = useSharedValue(MOTION_PING_FROM);

  useEffect(() => {
    scale.set(withDelay(delay, withRepeat(withTiming(MOTION_PING_TO_SCALE, MOTION_PING_TIMING), -1, false)));
    opacity.set(withDelay(delay, withRepeat(withTiming(0, MOTION_PING_TIMING), -1, false)));
    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [delay, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ scale: scale.get() }],
  }));

  return <Animated.View testID={testID} className={`absolute ${className}`} style={animatedStyle} />;
}
