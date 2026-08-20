import { useEffect, useState } from 'react';
import { Button, Chip } from 'heroui-native';
import { Text, View } from 'react-native';
import { Moon, Sun } from 'reicon-react-native';
import { Uniwind, useUniwind } from 'uniwind';

import { fetchHealth, type HealthState } from '../api/health';

const stateClassNames: Record<HealthState['kind'], string> = {
  ok: 'bg-success text-success-foreground',
  error: 'bg-danger text-danger-foreground',
  unreachable: 'bg-warning text-warning-foreground',
  'missing-config': 'bg-muted text-background',
};

export default function Index() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [state, setState] = useState<HealthState>();
  const { theme } = useUniwind();

  useEffect(() => {
    void fetchHealth(apiUrl).then(setState);
  }, [apiUrl]);

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
      <Text className="text-2xl font-semibold text-foreground">Backend health</Text>
      <Chip
        testID="health-state"
        className={state ? stateClassNames[state.kind] : 'bg-muted text-background'}
      >
        {state?.kind ?? 'checking'}
      </Chip>
      <Text className="text-muted">API: {apiUrl ?? 'not configured'}</Text>
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
        testID="health-retry"
        onPress={() => void fetchHealth(apiUrl).then(setState)}
      >
        Retry
      </Button>
    </View>
  );
}
