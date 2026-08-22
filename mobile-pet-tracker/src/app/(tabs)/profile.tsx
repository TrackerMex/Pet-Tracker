import { Button, Card, Chip } from 'heroui-native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Moon, Sun } from 'reicon-react-native';
import { Uniwind, useUniwind } from 'uniwind';

import { fetchHealth, type HealthState } from '../../api/health';
import { useAuth } from '../../providers/auth-provider';

const stateClassNames: Record<HealthState['kind'], string> = {
  ok: 'bg-success text-success-foreground',
  error: 'bg-danger text-danger-foreground',
  unreachable: 'bg-warning text-warning-foreground',
  'missing-config': 'bg-muted text-background',
};

export default function ProfileScreen() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut } = useAuth();
  const [health, setHealth] = useState<HealthState>();
  const { theme } = useUniwind();

  useEffect(() => {
    void fetchHealth(apiUrl).then(setHealth);
  }, [apiUrl]);

  return (
    <View testID="screen-profile" className="flex-1 gap-6 bg-background p-6">
      <Text className="text-2xl font-semibold text-foreground">Profile</Text>

      <Card className="gap-4 p-4">
        <Text className="text-lg font-semibold text-foreground">App</Text>
        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-foreground">Backend health</Text>
          <Chip
            testID="backend-health-state"
            className={
              health ? stateClassNames[health.kind] : 'bg-muted text-background'
            }
          >
            {health?.kind ?? 'checking'}
          </Chip>
        </View>
        <Text className="text-muted">API: {apiUrl ?? 'not configured'}</Text>
        <View className="flex-row items-center gap-3">
          <Button
            accessibilityLabel={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            isIconOnly
            testID="theme-toggle"
            variant="secondary"
            onPress={() => Uniwind.setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button
            testID="backend-health-retry"
            onPress={() => void fetchHealth(apiUrl).then(setHealth)}
          >
            Retry
          </Button>
        </View>
      </Card>

      <Button
        testID="profile-sign-out"
        onPress={() => {
          void signOut();
        }}
      >
        Sign out
      </Button>
    </View>
  );
}
