import { useEffect } from 'react';
import { NotificationFeedbackType, notificationAsync } from 'expo-haptics';
import { Image } from 'expo-image';
import { Button } from 'heroui-native';
import { Modal, Text, View, useWindowDimensions } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { MOTION_CELEBRATION_BADGE_DELAY_MS, MOTION_CELEBRATION_BADGE_POP_MS, MOTION_CELEBRATION_EASE_OUT, MOTION_CELEBRATION_POP_MS, MOTION_CELEBRATION_POP_PEAK, MOTION_CONFETTI_FALL_TIMING, MOTION_FADE_TIMING, MOTION_POP_SCALE } from '../theme/motion';
import { useThemeColors } from '../theme/use-theme-colors';

type CelebrationProps = {
  testID: string;
  title: string;
  body: string;
  details?: { testID: string; label: string; value: string }[];
  primary: { testID: string; label: string; onPress: () => void };
  secondary: { testID: string; label: string; onPress: () => void };
};

export function Celebration({ testID, title, body, details, primary, secondary }: CelebrationProps) {
  const insets = useSafeAreaInsets();
  const height = useWindowDimensions().height;
  const reduceMotion = useReducedMotion();
  const [check] = useThemeColors(['accent-foreground']);
  const pingoScale = useSharedValue(reduceMotion ? 1 : MOTION_POP_SCALE);
  const pingoOpacity = useSharedValue(0);
  const pingoTranslateY = useSharedValue(0);
  const badgeScale = useSharedValue(reduceMotion ? 1 : MOTION_POP_SCALE);
  const badgeOpacity = useSharedValue(0);
  const pingoStyle = useAnimatedStyle(() => ({
    opacity: pingoOpacity.get(), transform: [{ translateY: pingoTranslateY.get() }, { scale: pingoScale.get() }],
  }));
  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.get(), transform: [{ scale: badgeScale.get() }],
  }));

  useEffect(() => { void notificationAsync(NotificationFeedbackType.Success); }, []);

  useEffect(() => {
    if (reduceMotion) {
      pingoOpacity.set(withTiming(1, MOTION_FADE_TIMING));
      badgeOpacity.set(withDelay(MOTION_CELEBRATION_BADGE_DELAY_MS, withTiming(1, MOTION_FADE_TIMING)));
      return;
    }
    pingoOpacity.set(withTiming(1, { ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_CELEBRATION_POP_MS * 0.6 }));
    pingoScale.set(withSequence(
      withTiming(MOTION_CELEBRATION_POP_PEAK, { ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_CELEBRATION_POP_MS * 0.6 }),
      withTiming(1, { ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_CELEBRATION_POP_MS * 0.4 }),
    ));
    badgeOpacity.set(withDelay(MOTION_CELEBRATION_BADGE_DELAY_MS,
      withTiming(1, { ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_CELEBRATION_BADGE_POP_MS * 0.6 }),
    ));
    badgeScale.set(withDelay(MOTION_CELEBRATION_BADGE_DELAY_MS, withSequence(
      withTiming(MOTION_CELEBRATION_POP_PEAK, { ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_CELEBRATION_BADGE_POP_MS * 0.6 }),
      withTiming(1, { ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_CELEBRATION_BADGE_POP_MS * 0.4 }),
    )));
  }, [badgeOpacity, badgeScale, pingoOpacity, pingoScale, reduceMotion]);

  return (
    <Modal
      testID={`${testID}-modal`}
      visible
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={secondary.onPress}
    >
      <View
        testID={testID}
        className="flex-1 items-center gap-3.5 bg-surface-secondary px-6"
        style={{ paddingTop: insets.top + 80, paddingBottom: insets.bottom + 40 }}
      >
        {!reduceMotion ? (
          <View
            testID={`${testID}-confetti`}
            className="absolute inset-0"
            pointerEvents="none"
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden
          >
            {CONFETTI.map((_, index) => (
              <ConfettiPiece key={index} testID={`${testID}-confetti-${index}`} index={index} height={height} />
            ))}
          </View>
        ) : null}
        <View testID={`${testID}-hero`} className="mt-10 items-center justify-center" style={{ width: 220, height: 220 }}>
          <Animated.View testID={`${testID}-pingo`} style={[pingoStyle, { width: 170, height: 170 }]}>
            <Image
              testID={`${testID}-pose`}
              source={require('../../assets/images/pingo-celebrate.webp')}
              style={{ width: 170, height: 170 }}
              contentFit="contain"
              accessible={false}
            />
          </Animated.View>
          <Animated.View
            testID={`${testID}-badge`}
            style={[badgeStyle, { position: 'absolute', right: 18, bottom: 26 }]}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden
          >
            <View className="size-14 items-center justify-center rounded-full border-4 border-surface-secondary bg-accent">
              <Svg testID={`${testID}-check`} width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path d="M20 6 9 17l-5-5" stroke={check} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          </Animated.View>
        </View>
        <Text testID={`${testID}-title`} className="mt-2 text-center text-3xl font-black tracking-tight text-foreground">{title}</Text>
        <Text testID={`${testID}-body`} className="max-w-75 text-center text-15 leading-5.5 text-muted" selectable>{body}</Text>
        {details?.length ? (
          <View testID={`${testID}-details`} className="flex-row flex-wrap justify-center gap-2">
            {details.map((detail) => (
              <View key={detail.testID} className="flex-row items-center gap-1.5 rounded-full bg-surface px-3 py-1.5">
                <Text className="text-xs font-bold text-muted">{detail.label}</Text>
                <Text testID={detail.testID} className="text-xs font-bold text-foreground" selectable>{detail.value}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <View testID={`${testID}-actions`} className="mt-auto w-full gap-3">
          <Button testID={primary.testID} className="min-h-11 w-full rounded-xl bg-accent border-b-4 border-black/25" onPress={primary.onPress}>
            <Button.Label className="font-bold text-accent-foreground">{primary.label}</Button.Label>
          </Button>
          <Button testID={secondary.testID} className="min-h-11 w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface" onPress={secondary.onPress}>
            <Button.Label className="font-bold text-foreground">{secondary.label}</Button.Label>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const CONFETTI = [
  [42, 'h-1.5 w-3 rounded-full bg-accent', 3008, 308],
  [9, 'h-4.5 w-2.5 rounded-xs bg-confetti-amber', 2392, 1097],
  [7, 'h-1.5 w-2 rounded-full bg-confetti-violet', 2639, 1039],
  [57, 'h-1.5 w-2 rounded-full bg-confetti-blue', 2343, 856],
  [72, 'h-1.5 w-3 rounded-full bg-confetti-rose', 2321, 869],
  [29, 'h-1.5 w-3 rounded-full bg-confetti-green', 3484, 1291],
  [76, 'h-1.5 w-2 rounded-full bg-accent', 3012, 1199],
  [6, 'h-3.5 w-2.5 rounded-xs bg-confetti-amber', 2472, 1140],
  [19, 'h-3.5 w-3 rounded-xs bg-confetti-violet', 2441, 1107],
  [73, 'h-4.5 w-2 rounded-xs bg-confetti-blue', 2570, 1396],
  [75, 'h-1.5 w-2.5 rounded-full bg-confetti-rose', 2584, 1308],
  [72, 'h-4.5 w-2 rounded-xs bg-confetti-green', 3355, 128],
  [27, 'h-3.5 w-3 rounded-xs bg-accent', 3593, 1016],
  [41, 'h-3.5 w-2.5 rounded-xs bg-confetti-amber', 3399, 953],
  [39, 'h-1.5 w-3 rounded-full bg-confetti-violet', 2568, 508],
  [11, 'h-3.5 w-3 rounded-xs bg-confetti-blue', 2814, 1176],
  [45, 'h-1.5 w-3 rounded-full bg-confetti-rose', 2789, 919],
  [15, 'h-3.5 w-2 rounded-xs bg-confetti-green', 3056, 1048],
  [20, 'h-4.5 w-2 rounded-xs bg-accent', 3063, 1001],
  [10, 'h-3.5 w-2.5 rounded-xs bg-confetti-amber', 3373, 1142],
  [91, 'h-4.5 w-2.5 rounded-xs bg-confetti-violet', 3417, 717],
  [60, 'h-3.5 w-2.5 rounded-xs bg-confetti-blue', 2391, 140],
  [91, 'h-4.5 w-2 rounded-xs bg-confetti-rose', 2333, 1360],
  [92, 'h-4.5 w-3 rounded-xs bg-confetti-green', 3525, 634],
  [58, 'h-3.5 w-3 rounded-xs bg-accent', 2990, 582],
  [3, 'h-4.5 w-2 rounded-xs bg-confetti-amber', 2927, 945],
  [15, 'h-3.5 w-2 rounded-xs bg-confetti-violet', 2320, 1011],
  [17, 'h-3.5 w-2.5 rounded-xs bg-confetti-blue', 3014, 507],
  [11, 'h-4.5 w-2.5 rounded-xs bg-confetti-rose', 3119, 340],
  [36, 'h-3.5 w-3 rounded-xs bg-confetti-green', 3081, 280],
  [93, 'h-3.5 w-3 rounded-xs bg-accent', 2934, 850],
  [30, 'h-1.5 w-2 rounded-full bg-confetti-amber', 2369, 309],
  [30, 'h-3.5 w-2 rounded-xs bg-confetti-violet', 2677, 1348],
  [77, 'h-1.5 w-2.5 rounded-full bg-confetti-blue', 2738, 373],
  [19, 'h-4.5 w-2.5 rounded-xs bg-confetti-rose', 3294, 858],
  [74, 'h-4.5 w-3 rounded-xs bg-confetti-green', 2457, 652],
] as const;

function ConfettiPiece({ testID, index, height }: { testID: string; index: number; height: number }) {
  const progress = useSharedValue(0);
  const [leftPercent, className, duration, delay] = CONFETTI[index];
  const left = `${leftPercent}%` as const;
  const pieceStyle = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      position: 'absolute', top: 0, left,
      opacity: interpolate(p, [0, 0.1, 1], [0, 1, 0]),
      transform: [{ translateY: -40 + p * (height + 80) }, { rotate: `${p * 540}deg` }],
    };
  });

  useEffect(() => {
    progress.set(withDelay(
      delay,
      withRepeat(withTiming(1, { ...MOTION_CONFETTI_FALL_TIMING, duration }), -1, false),
    ));
  }, [delay, duration, progress]);

  return (
    <Animated.View testID={testID} style={pieceStyle}>
      <View className={className} />
    </Animated.View>
  );
}
