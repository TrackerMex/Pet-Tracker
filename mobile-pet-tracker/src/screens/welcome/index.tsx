import { Image } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { Button } from 'heroui-native';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ForkKnife, Map, Stethoscope } from 'reicon-react-native';

import { Card } from '../../components/card';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { MOTION_FADE_TIMING, MOTION_SETTLE_SPRING, MOTION_ENTRANCE_OFFSET_Y } from '../../theme/motion';
import { useThemeColors } from '../../theme/use-theme-colors';

const WELCOME_CHIPS = [
  { testID: 'welcome-chip-gps', Icon: Map, labelKey: 'welcome.chipGps' },
  { testID: 'welcome-chip-health', Icon: Stethoscope, labelKey: 'welcome.chipHealth' },
  { testID: 'welcome-chip-nutrition', Icon: ForkKnife, labelKey: 'welcome.chipNutrition' },
] as const;

export function WelcomeScreen() {
  const { status } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const [chipInk] = useThemeColors(['accent-strong']);
  const reduceMotion = useReducedMotion();
  const pingoBlink = useSharedValue(0);
  const blinkStyle = useAnimatedStyle(() => ({ opacity: pingoBlink.get() }));
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(reduceMotion ? 0 : MOTION_ENTRANCE_OFFSET_Y);
  const entranceStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateY: translateY.get() }],
  }));

  useEffect(() => {
    opacity.set(withTiming(1, MOTION_FADE_TIMING));
    if (!reduceMotion) {
      translateY.set(withSpring(0, MOTION_SETTLE_SPRING));
    }
  }, [opacity, translateY, reduceMotion]);

  if (status === 'authenticated') return <Redirect href="/home" />;

  return (
    <ScrollView
      testID="screen-welcome"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16,
        paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24,
      }}
    >
      <Animated.View testID="welcome-content" style={[entranceStyle, { alignItems: 'center', gap: 16 }]}>
        <Card testID="welcome-scene" variant="secondary" className="w-full items-center gap-3 py-6">
          <Card testID="welcome-bubble" variant="surface" className="px-4 py-3">
            <Text testID="welcome-bubble-text" className="text-center text-sm font-semibold text-foreground">{t('welcome.pingoGreeting')}</Text>
          </Card>
          <Animated.View testID="welcome-pingo" style={{ width: 200, height: 200 }}>
            <Image testID="welcome-pingo-wave" source={require('../../../assets/images/pingo-wave.webp')} style={{ width: 200, height: 200 }} contentFit="contain" />
            <Animated.View testID="welcome-pingo-blink" style={[blinkStyle, { position: 'absolute', top: 0, left: 0 }]}>
              <Image testID="welcome-pingo-blink-image" source={require('../../../assets/images/pingo-wave-blink.webp')} style={{ width: 200, height: 200 }} contentFit="contain" />
            </Animated.View>
          </Animated.View>
        </Card>
        <View testID="welcome-chips" className="flex-row justify-center gap-2">
          {WELCOME_CHIPS.map(({ testID, Icon, labelKey }) => (
            <View key={testID} testID={testID} className="flex-row items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1.5">
              <Icon size={14} color={chipInk} />
              <Text className="text-xs font-semibold text-accent-strong">{t(labelKey)}</Text>
            </View>
          ))}
        </View>
        <Text testID="welcome-brand" className="text-3xl font-bold text-foreground">{t('welcome.brand')}</Text>
        <Text testID="welcome-tagline" className="text-center text-base text-muted">{t('welcome.tagline')}</Text>
        <Button testID="welcome-get-started" className="w-full rounded-xl bg-accent border-b-4 border-black/25" onPress={() => router.push('/register')}>
          <Button.Label className="font-bold text-accent-foreground">{t('welcome.getStarted')}</Button.Label>
        </Button>
        <Button testID="welcome-have-account" className="w-full rounded-xl border border-accent bg-transparent" onPress={() => router.push('/login')}>
          <Button.Label className="font-semibold text-accent-strong">{t('welcome.haveAccount')}</Button.Label>
        </Button>
        <Text testID="welcome-legal" className="text-center text-xs text-muted">{t('welcome.legalNotice')}</Text>
      </Animated.View>
    </ScrollView>
  );
}
