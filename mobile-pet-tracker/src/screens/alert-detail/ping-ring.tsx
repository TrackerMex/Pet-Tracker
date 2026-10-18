import { useEffect } from 'react';
import Animated, { cancelAnimation, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { MOTION_ALERT_PING_MS, MOTION_CELEBRATION_EASE_OUT, MOTION_PING_FROM, MOTION_PING_TO_SCALE } from '../../theme/motion';

export function AlertPingRing({ ring }: { ring: string }) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(MOTION_PING_FROM);
  const opacity = useSharedValue(MOTION_PING_FROM);
  useEffect(() => {
    if (reduced) return;
    scale.set(withRepeat(withTiming(MOTION_PING_TO_SCALE, { duration: MOTION_ALERT_PING_MS, ...MOTION_CELEBRATION_EASE_OUT }), -1, false));
    opacity.set(withRepeat(withTiming(0, { duration: MOTION_ALERT_PING_MS, ...MOTION_CELEBRATION_EASE_OUT }), -1, false));
    return () => { cancelAnimation(scale); cancelAnimation(opacity); };
  }, [reduced, scale, opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.get(), transform: [{ scale: scale.get() }] }));
  return reduced ? null : (
    <Animated.View testID="alert-detail-ping" pointerEvents="none" accessible={false} className={'absolute size-23 rounded-full ' + ring} style={style} />
  );
}
