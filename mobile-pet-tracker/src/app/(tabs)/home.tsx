import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Button, Card, Skeleton, Spinner } from 'heroui-native';
import { useCallback, useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Battery,
  ChevronRight,
  Map,
  Moon,
  Walk,
  Wifi,
  WifiOff,
} from 'reicon-react-native';

import { getDailyActivity } from '../../api/activity';
import { getPet, listPets, type PetsState } from '../../api/pets';
import { useApi } from '../../hooks/use-api';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';

function isPetsError(state: PetsState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function fmtMinutes(minutes: number | null): string {
  if (minutes === null) return '—';
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function fmtKm(meters: number | null): string {
  return meters === null ? '—' : `${(meters / 1000).toFixed(1)} km`;
}

function fmtLastSeen(iso: string | null): string {
  return iso === null
    ? 'No location data yet'
    : `Last seen ${new Date(iso).toLocaleString()}`;
}

export default function HomeScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const { selectedPetId, selectPet } = useSelectedPet();
  const insets = useSafeAreaInsets();
  const petsFn = useCallback(
    () => listPets(baseUrl, token ?? ''),
    [baseUrl, token],
  );
  const pets = useApi(petsFn);
  const detailFn = useMemo(
    () =>
      selectedPetId
        ? () => getPet(baseUrl, token ?? '', selectedPetId)
        : null,
    [baseUrl, selectedPetId, token],
  );
  const activityFn = useMemo(
    () =>
      selectedPetId
        ? () => getDailyActivity(baseUrl, token ?? '', selectedPetId)
        : null,
    [baseUrl, selectedPetId, token],
  );
  const detail = useApi(detailFn);
  const activity = useApi(activityFn);
  const today =
    activity.data?.kind === 'ok'
      ? activity.data.days[activity.data.days.length - 1]
      : undefined;

  useEffect(() => {
    if (pets.data?.kind !== 'ok' || pets.data.pets.length === 0) return;
    const selectionExists = pets.data.pets.some(({ id }) => id === selectedPetId);
    if (!selectionExists) selectPet(pets.data.pets[0].id);
  }, [pets.data, selectPet, selectedPetId]);

  return (
    <ScrollView
      testID="screen-home"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <Text className="text-2xl font-semibold text-foreground">Home</Text>

      {pets.data === undefined ? <Spinner testID="home-loading" /> : null}

      {pets.data && isPetsError(pets.data) ? (
        <View className="items-start gap-3">
          <Text testID="home-error" className="text-danger">
            Something went wrong
          </Text>
          <Button testID="home-retry" onPress={pets.refetch}>
            Retry
          </Button>
        </View>
      ) : null}

      {pets.data?.kind === 'ok' && pets.data.pets.length === 0 ? (
        <Text testID="home-empty" className="text-muted">
          No pets yet
        </Text>
      ) : null}

      {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {pets.data.pets.map((pet) => {
              const selected = pet.id === selectedPetId;

              return (
                <Pressable
                  key={pet.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  testID={`pet-chip-${pet.id}`}
                  className={
                    selected
                      ? 'rounded-full bg-accent px-4 py-2'
                      : 'rounded-full bg-surface px-4 py-2'
                  }
                  onPress={() => selectPet(pet.id)}
                >
                  <Text
                    className={
                      selected ? 'text-accent-foreground' : 'text-foreground'
                    }
                  >
                    {pet.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      ) : null}

      {selectedPetId && detail.data === undefined ? (
        <Skeleton testID="pet-card-skeleton" className="h-32 w-full rounded-2xl" />
      ) : null}

      {detail.data?.kind === 'error' || detail.data?.kind === 'unreachable' ? (
        <Card testID="pet-card-error" className="items-start gap-3 p-4">
          <Text className="text-danger">Something went wrong</Text>
          <Button testID="pet-card-retry" onPress={detail.refetch}>
            Retry
          </Button>
        </Card>
      ) : null}

      {detail.data?.kind === 'ok' ? (
        <>
          <Card testID="pet-card" className="p-4">
            <View className="flex-row items-center gap-4">
              {detail.data.pet.photoUrl ? (
                <Image
                  testID="pet-card-photo"
                  className="size-[72px] rounded-full"
                  contentFit="cover"
                  source={detail.data.pet.photoUrl}
                />
              ) : (
                <View
                  testID="pet-card-photo"
                  className="size-[72px] items-center justify-center rounded-full bg-surface"
                >
                  <Text className="text-2xl font-semibold text-foreground">
                    {detail.data.pet.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="flex-1 gap-1">
                <Text
                  testID="pet-card-name"
                  className="text-xl font-semibold text-foreground"
                >
                  {detail.data.pet.name}
                </Text>
                <Text testID="pet-card-breed" className="text-muted">
                  {detail.data.pet.breed ?? '—'}
                </Text>
              </View>
            </View>
          </Card>

          <Card testID="collar-card" className="gap-3 p-4">
            <View className="flex-row items-center gap-2">
              {detail.data.pet.device === null ? (
                <Moon size={20} />
              ) : detail.data.pet.device.connectivity === 'online' ? (
                <Wifi size={20} />
              ) : (
                <WifiOff size={20} />
              )}
              <Text
                testID="collar-status"
                className="text-lg font-semibold text-foreground"
              >
                {detail.data.pet.device === null
                  ? 'Free'
                  : detail.data.pet.device.connectivity === 'online'
                    ? 'Online'
                    : 'Offline'}
              </Text>
            </View>
            {detail.data.pet.device ? (
              <View className="flex-row items-center gap-2">
                <Battery size={18} />
                <Text testID="collar-battery" className="text-muted">
                  {detail.data.pet.device.batteryPct === null
                    ? '—'
                    : `${detail.data.pet.device.batteryPct}%`}
                </Text>
              </View>
            ) : (
              <Text className="text-muted">No collar — health only</Text>
            )}
          </Card>
        </>
      ) : null}

      {selectedPetId ? (
        <Card testID="summary-card" className="gap-4 p-4">
          <Text className="text-lg font-semibold text-foreground">
            Today&apos;s Summary
          </Text>

          {activity.data === undefined ? (
            <Skeleton testID="summary-skeleton" className="h-16 w-full rounded-xl" />
          ) : null}

          {activity.data?.kind === 'no-tracking' ? (
            <Text testID="summary-note" className="text-muted">
              Activity tracking requires a collar
            </Text>
          ) : null}

          {activity.data?.kind === 'error' ||
          activity.data?.kind === 'unreachable' ||
          activity.data?.kind === 'missing-config' ? (
            <Text testID="summary-note" className="text-muted">
              Could not load activity
            </Text>
          ) : null}

          {activity.data?.kind === 'ok' ? (
            <View className="flex-row justify-between gap-3">
              <View className="flex-1 items-center gap-1">
                <Walk size={20} />
                <Text className="text-xs text-muted">Activity</Text>
                <Text
                  testID="summary-activity"
                  className="font-semibold text-foreground"
                >
                  {fmtMinutes(today?.activeMinutes ?? null)}
                </Text>
              </View>
              <View className="flex-1 items-center gap-1">
                <Moon size={20} />
                <Text className="text-xs text-muted">Sleep</Text>
                <Text
                  testID="summary-sleep"
                  className="font-semibold text-foreground"
                >
                  {fmtMinutes(today?.restMinutes ?? null)}
                </Text>
              </View>
              <View className="flex-1 items-center gap-1">
                <Map size={20} />
                <Text className="text-xs text-muted">Distance</Text>
                <Text
                  testID="summary-distance"
                  className="font-semibold text-foreground"
                >
                  {fmtKm(today?.distanceM ?? null)}
                </Text>
              </View>
            </View>
          ) : null}
        </Card>
      ) : null}

      {detail.data?.kind === 'ok' && detail.data.pet.device ? (
        <Pressable
          accessibilityRole="button"
          testID="last-position-card"
          className="gap-2 rounded-2xl bg-surface p-4"
          onPress={() => router.push('/map')}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Map size={20} />
              <Text className="font-semibold text-foreground">View on map</Text>
            </View>
            <ChevronRight size={20} />
          </View>
          <Text testID="last-position-time" className="text-muted">
            {fmtLastSeen(detail.data.pet.lastCommunicationAt)}
          </Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}
