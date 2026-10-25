import { useChunkyLip } from '../../theme/chunky-lip';
import { Image } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { Button } from 'heroui-native';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ForkKnife, Map, Stethoscope } from 'reicon-react-native';

import { PingoFloat } from '@/components/pingo-float';
import { PingRing } from '@/components/ping-ring';
import { PopIn } from '@/components/pop-in';
import { RiseIn } from '@/components/rise-in';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { MOTION_SETTLE_SPRING, MOTION_ENTRANCE_SCALE, MOTION_BLINK_INTERVAL_MS, MOTION_BLINK_TIMING, MOTION_FEEDBACK_MS, MOTION_PING_TIMING } from '../../theme/motion';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { useShadows } from '../../theme/shadows';
import { useThemeColors } from '../../theme/use-theme-colors';

const WELCOME_CHIPS = [
  { testID: 'welcome-chip-gps', Icon: Map, labelKey: 'welcome.chipGps' },
  { testID: 'welcome-chip-health', Icon: Stethoscope, labelKey: 'welcome.chipHealth' },
  { testID: 'welcome-chip-nutrition', Icon: ForkKnife, labelKey: 'welcome.chipNutrition' },
] as const;

export function WelcomeScreen() {
  const chunkyLip = useChunkyLip();
  const { status } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const shadows = useShadows();
  const [chipInk] = useThemeColors(['accent-strong']);
  const reduceMotion = useReducedMotion();
  const pingoScale = useSharedValue(reduceMotion ? 1 : MOTION_ENTRANCE_SCALE);
  const pingoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pingoScale.get() }],
  }));
  const pingoBlink = useSharedValue(0);
  const blinkStyle = useAnimatedStyle(() => ({ opacity: pingoBlink.get() }));

  useEffect(() => {
    if (!reduceMotion) {
      pingoScale.set(withSpring(1, MOTION_SETTLE_SPRING));
      pingoBlink.set(
        withRepeat(
          withSequence(
            withDelay(MOTION_BLINK_INTERVAL_MS, withTiming(1, MOTION_BLINK_TIMING)),
            withDelay(MOTION_FEEDBACK_MS, withTiming(0, MOTION_BLINK_TIMING)),
          ),
          -1,
        ),
      );
    }
  }, [reduceMotion, pingoScale, pingoBlink]);

  if (status === 'authenticated') return <Redirect href="/home" />;

  return (
    <ScrollView
      testID="screen-welcome"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        flexGrow: 1, paddingHorizontal: 16,
        paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24,
      }}
    >
      <View testID="welcome-content" className="flex-1">
        <RiseIn testID="welcome-rise-scene" delayMs={0}>
          <View testID="welcome-scene" className="h-95 w-full items-center justify-center overflow-hidden rounded-32 bg-surface-secondary" style={CONTINUOUS_CORNER}>
            <View testID="welcome-ground" className="absolute bottom-7.5 h-3.5 w-30 rounded-full bg-border" />
            <View testID="welcome-stage" className="items-center justify-center">
              {reduceMotion ? null : [0, 1, 2].map((index) => <PingRing key={index} testID={`welcome-ring-${index}`} delay={index * (MOTION_PING_TIMING.duration / 3)} className="size-65 rounded-full border-2 border-accent" />)}
              <PingoFloat testID="welcome-pingo-float">
                <Animated.View testID="welcome-pingo" style={[pingoStyle, { width: 220, height: 220 }]}>
                  <Image testID="welcome-pingo-wave" source={require('../../../assets/images/pingo-wave.webp')} style={{ width: 220, height: 220 }} contentFit="contain" />
                  <Animated.View testID="welcome-pingo-blink" style={[blinkStyle, { position: 'absolute', top: 0, left: 0 }]}>
                    <Image testID="welcome-pingo-blink-image" source={require('../../../assets/images/pingo-wave-blink.webp')} style={{ width: 220, height: 220 }} contentFit="contain" />
                  </Animated.View>
                </Animated.View>
              </PingoFloat>
            </View>
            <PopIn testID="welcome-bubble-pop" className="absolute top-7 right-5.5">
              <View testID="welcome-bubble" className="rounded-tl-16 rounded-tr-16 rounded-bl-16 rounded-br-4 bg-surface px-3.5 py-2.5" style={[CONTINUOUS_CORNER, shadows.card]}>
                <Text testID="welcome-bubble-text" className="text-sm font-bold text-foreground">{t('welcome.pingoGreeting')}</Text>
              </View>
            </PopIn>
          </View>
        </RiseIn>
        <RiseIn testID="welcome-rise-chips" delayMs={120} className="mt-6">
          <View testID="welcome-chips" className="flex-row justify-center gap-2">
            {WELCOME_CHIPS.map(({ testID, Icon, labelKey }) => (
              <View key={testID} testID={testID} className="flex-row items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1.5">
                <Icon size={14} color={chipInk} />
                <Text className="text-xs font-semibold text-accent-strong">{t(labelKey)}</Text>
              </View>
            ))}
          </View>
        </RiseIn>
        <RiseIn testID="welcome-rise-heading" delayMs={200} className="mt-4.5 items-center gap-2">
          <Text testID="welcome-brand" className="text-34 leading-10 font-black tracking-display text-foreground">{t('welcome.brand')}</Text>
          <Text testID="welcome-tagline" className="max-w-75 text-center text-base text-muted">{t('welcome.tagline')}</Text>
        </RiseIn>
        <View testID="welcome-spacer" className="flex-1" />
        <RiseIn testID="welcome-rise-actions" delayMs={280} className="gap-3.5">
          <Button testID="welcome-get-started" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={() => router.push('/register')}>
            <Text className="text-17 font-extrabold text-accent-foreground">{t('welcome.getStarted')}</Text>
          </Button>
          <Button testID="welcome-have-account" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
            <Text className="text-17 font-bold text-accent-strong">{t('welcome.haveAccount')}</Text>
          </Button>
        </RiseIn>
        <Text testID="welcome-legal" className="mt-4 text-center text-xs text-muted">{t('welcome.legalNotice')}</Text>
      </View>
    </ScrollView>
  );
}
