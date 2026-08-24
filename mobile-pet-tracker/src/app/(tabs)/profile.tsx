import { Button, Chip } from 'heroui-native';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Moon, Sun } from 'reicon-react-native';
import { Uniwind, useUniwind } from 'uniwind';

import { fetchHealth, type HealthState } from '../../api/health';
import { Card } from '../../components/card';
import { useAuth } from '../../providers/auth-provider';
import { useThemeColors } from '../../theme/use-theme-colors';

const stateClassNames: Record<HealthState['kind'], string> = {
  ok: 'bg-success-soft text-success',
  error: 'bg-danger-soft text-danger',
  unreachable: 'bg-danger-soft text-danger',
  'missing-config': 'bg-danger-soft text-danger',
};

export default function ProfileScreen() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut } = useAuth();
  const [health, setHealth] = useState<HealthState>();
  const { theme } = useUniwind();
  const [foreground] = useThemeColors(['foreground']);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    void fetchHealth(apiUrl).then(setHealth);
  }, [apiUrl]);

  return (
    <ScrollView
      testID="screen-profile"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <Text className="text-2xl font-black text-foreground">Profile</Text>

      <Card className="overflow-hidden">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
          App
        </Text>
        <View className="flex-row items-center justify-between gap-3 border-b border-separator py-3">
          <Text className="text-sm font-normal text-muted">Backend health</Text>
          <Chip
            testID="backend-health-state"
            className={
              health ? stateClassNames[health.kind] : 'bg-default text-muted'
            }
          >
            {health?.kind ?? 'checking'}
          </Chip>
        </View>
        <View className="border-b border-separator py-3">
          <Text className="text-sm font-semibold text-foreground">
            API: {apiUrl ?? 'not configured'}
          </Text>
        </View>
        <View className="flex-row items-center gap-3 pt-4">
          <Button
            accessibilityLabel={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="rounded-xl bg-default"
            isIconOnly
            testID="theme-toggle"
            variant="secondary"
            onPress={() => Uniwind.setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun size={20} color={foreground} />
            ) : (
              <Moon size={20} color={foreground} />
            )}
          </Button>
          <Button
            testID="backend-health-retry"
            className="rounded-xl bg-accent"
            onPress={() => void fetchHealth(apiUrl).then(setHealth)}
          >
            <Button.Label className="font-bold text-accent-foreground">
              Retry
            </Button.Label>
          </Button>
        </View>
      </Card>

      <Button
        testID="profile-sign-out"
        className="rounded-xl bg-danger-soft"
        variant="danger-soft"
        onPress={() => {
          void signOut();
        }}
      >
        <Button.Label className="font-bold text-danger">Sign out</Button.Label>
      </Button>
    </ScrollView>
  );
}
