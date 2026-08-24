import { router, type Href } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getMe } from '../../api/users';
import { Card } from '../../components/card';
import { useApi } from '../../hooks/use-api';
import { useAuth } from '../../providers/auth-provider';

export function ProfileScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const insets = useSafeAreaInsets();
  const meFn = useCallback(
    () => getMe(baseUrl, token ?? ''),
    [baseUrl, token],
  );
  const me = useApi(meFn);

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

      <Card testID="me-card" className="gap-2">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
          Account
        </Text>
        {me.data === undefined ? (
          <Skeleton testID="me-card-skeleton" className="h-12 w-full rounded-xl" />
        ) : null}
        {me.data?.kind === 'ok' ? (
          <View className="gap-1">
            <Text className="text-lg font-bold text-foreground">
              {`${me.data.me.firstName} ${me.data.me.lastName}`}
            </Text>
            <Text className="font-normal text-muted">{me.data.me.email}</Text>
          </View>
        ) : null}
        {me.data && me.data.kind !== 'ok' && me.data.kind !== 'unauthorized' ? (
          <Text testID="me-card-state" className="font-normal text-muted">
            Account unavailable
          </Text>
        ) : null}
      </Card>

      <Pressable
        accessibilityRole="button"
        testID="reminders-link"
        className="flex-row items-center justify-between rounded-xl bg-default px-3 py-2"
        onPress={() => router.push('/reminders' as Href)}
      >
        <Text className="font-semibold text-foreground">Reminders</Text>
        <Text className="text-lg font-semibold text-muted">›</Text>
      </Pressable>

      <Button
        testID="profile-sign-out"
        className="rounded-xl bg-danger-soft"
        variant="danger-soft"
        onPress={() => void signOut()}
      >
        <Button.Label className="font-bold text-danger">Sign out</Button.Label>
      </Button>
    </ScrollView>
  );
}
