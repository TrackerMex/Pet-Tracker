import { Image } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { Button } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ForkKnife, Map, Stethoscope } from 'reicon-react-native';

import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
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
      <Animated.View testID="welcome-content" style={{ alignItems: 'center', gap: 16 }}>
        <Image
          testID="welcome-hero"
          source={require('../../../assets/images/splash-icon.png')}
          style={{ width: 160, height: 160 }}
          contentFit="contain"
        />
        <Text testID="welcome-brand" className="text-3xl font-bold text-foreground">{t('welcome.brand')}</Text>
        <View testID="welcome-chips" className="flex-row justify-center gap-2">
          {WELCOME_CHIPS.map(({ testID, Icon, labelKey }) => (
            <View key={testID} testID={testID} className="flex-row items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1.5">
              <Icon size={14} color={chipInk} />
              <Text className="text-xs font-semibold text-accent-strong">{t(labelKey)}</Text>
            </View>
          ))}
        </View>
        <Text testID="welcome-tagline" className="text-center text-base text-muted">{t('welcome.tagline')}</Text>
        <Button testID="welcome-get-started" className="w-full rounded-xl bg-accent" onPress={() => router.push('/register')}>
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
