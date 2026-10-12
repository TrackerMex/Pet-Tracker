import { useEffect } from 'react';
import { Image } from 'expo-image';
import { Button } from 'heroui-native';
import { Modal, Text, View, useWindowDimensions } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MOTION_CONFETTI_FALL_TIMING, MOTION_CONFETTI_MIN_MS, MOTION_CONFETTI_SPREAD_MS, MOTION_FADE_TIMING, MOTION_POP_SCALE, MOTION_POP_SPRING, MOTION_SURFACE_MS } from '../theme/motion';
import { CONFETTI_FILLS } from '../utils/category-palette';

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
  const pingoScale = useSharedValue(reduceMotion ? 1 : MOTION_POP_SCALE);
  const pingoOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(reduceMotion ? 1 : MOTION_POP_SCALE);
  const badgeOpacity = useSharedValue(0);
  const pingoStyle = useAnimatedStyle(() => ({
    opacity: pingoOpacity.get(), transform: [{ scale: pingoScale.get() }],
  }));
  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.get(), transform: [{ scale: badgeScale.get() }],
  }));

  useEffect(() => {
    pingoOpacity.set(withTiming(1, MOTION_FADE_TIMING));
    badgeOpacity.set(withDelay(MOTION_SURFACE_MS, withTiming(1, MOTION_FADE_TIMING)));
    if (!reduceMotion) {
      pingoScale.set(withSpring(1, MOTION_POP_SPRING));
      badgeScale.set(withDelay(MOTION_SURFACE_MS, withSpring(1, MOTION_POP_SPRING)));
    }
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
        className="flex-1 items-center gap-4 bg-surface-secondary px-6"
        style={{ paddingTop: insets.top + 80, paddingBottom: insets.bottom + 24 }}
      >
        {!reduceMotion ? (
          <View
            testID={`${testID}-confetti`}
            className="absolute inset-0"
            pointerEvents="none"
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden
          >
            {Array.from({ length: CONFETTI_COUNT }, (_, index) => (
              <ConfettiPiece key={index} testID={`${testID}-confetti-${index}`} index={index} height={height} />
            ))}
          </View>
        ) : null}
        <View testID={`${testID}-hero`} style={{ width: 200, height: 200 }}>
          <Animated.View testID={`${testID}-pingo`} style={[pingoStyle, { width: 200, height: 200 }]}>
            <Image
              testID={`${testID}-pose`}
              source={require('../../assets/images/pingo-celebrate.webp')}
              style={{ width: 200, height: 200 }}
              contentFit="contain"
              accessible={false}
            />
          </Animated.View>
          <Animated.View
            testID={`${testID}-badge`}
            style={[badgeStyle, { position: 'absolute', right: 0, bottom: 0 }]}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden
          >
            <View className="size-14 items-center justify-center rounded-full border-4 border-surface-secondary bg-accent">
              <Text className="text-2xl font-black text-accent-foreground">✓</Text>
            </View>
          </Animated.View>
        </View>
        <Text testID={`${testID}-title`} className="text-center text-3xl font-black text-foreground">{title}</Text>
        <Text testID={`${testID}-body`} className="text-center text-base text-muted" selectable>{body}</Text>
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

const CONFETTI_COUNT = 24;
const COLORS = ['bg-accent', ...CONFETTI_FILLS];
const SHAPES = ['h-1.5 w-2 rounded-full', 'h-3.5 w-2.5', 'h-4 w-3'];

function ConfettiPiece({ testID, index, height }: { testID: string; index: number; height: number }) {
  const progress = useSharedValue(0);
  const left = `${(index * 41 + 7) % 100}%` as const;
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
      (index * 53) % MOTION_CONFETTI_SPREAD_MS,
      withTiming(1, {
        ...MOTION_CONFETTI_FALL_TIMING,
        duration: MOTION_CONFETTI_MIN_MS + (index * 137) % MOTION_CONFETTI_SPREAD_MS,
      }),
    ));
  }, [index, progress]);

  return (
    <Animated.View testID={testID} style={pieceStyle}>
      <View className={`${SHAPES[Math.floor(index / 8)]} ${COLORS[index % 6]}`} />
    </Animated.View>
  );
}
