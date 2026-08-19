import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fetchHealth, type HealthState } from '../api/health';

const stateColors: Record<HealthState['kind'], string> = {
  ok: '#15803d',
  error: '#b91c1c',
  unreachable: '#c2410c',
  'missing-config': '#6d28d9',
};

export default function Index() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [state, setState] = useState<HealthState>();

  useEffect(() => {
    void fetchHealth(apiUrl).then(setState);
  }, [apiUrl]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backend health</Text>
      <Text
        testID="health-state"
        style={[styles.state, { color: state ? stateColors[state.kind] : '#475569' }]}
      >
        {state?.kind ?? 'checking'}
      </Text>
      <Text style={styles.url}>API: {apiUrl ?? 'not configured'}</Text>
      <Pressable
        accessibilityRole="button"
        testID="health-retry"
        onPress={() => void fetchHealth(apiUrl).then(setState)}
        style={styles.retry}
      >
        <Text style={styles.retryText}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  state: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
  url: {
    color: '#475569',
    marginTop: 8,
  },
  retry: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
