import { router } from 'expo-router';
import { Button, Card as HeroUICard, Skeleton, Spinner } from 'heroui-native';
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
import { Card } from '../../components/card';
import { PetAvatar } from '../../components/pet-avatar';
import { PetSwitcher } from '../../components/pet-switcher';
import { useApi } from '../../hooks/use-api';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { useThemeColors } from '../../theme/use-theme-colors';

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
  const [accent, success, warning, muted] = useThemeColors([
    'accent',
    'success',
    'warning',
    'muted',
  ]);
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
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <Text className="text-2xl font-black text-foreground">Home</Text>

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
        <PetSwitcher
          pets={pets.data.pets}
          selectedPetId={selectedPetId}
          onSelect={selectPet}
        />
      ) : null}

      {selectedPetId && detail.data === undefined ? (
        <Skeleton testID="pet-card-skeleton" className="h-32 w-full rounded-2xl" />
      ) : null}

      {detail.data?.kind === 'error' || detail.data?.kind === 'unreachable' ? (
        <HeroUICard testID="pet-card-error" className="items-start gap-3 p-4">
          <Text className="text-danger">Something went wrong</Text>
          <Button testID="pet-card-retry" onPress={detail.refetch}>
            Retry
          </Button>
        </HeroUICard>
      ) : null}

      {detail.data?.kind === 'ok' ? (
        <>
          <Card testID="pet-card">
            <View className="flex-row items-center gap-4">
              <PetAvatar
                name={detail.data.pet.name}
                photoUrl={detail.data.pet.photoUrl}
                size={72}
                testID="pet-card-photo"
              />
              <View className="flex-1 gap-1">
                <Text
                  testID="pet-card-name"
                  className="text-xl font-bold text-foreground"
                >
                  {detail.data.pet.name}
                </Text>
                <Text testID="pet-card-breed" className="font-normal text-muted">
                  {detail.data.pet.breed ?? '—'}
                </Text>
              </View>
            </View>
          </Card>

          <HeroUICard
            testID="collar-card"
            className="gap-3 rounded-2xl bg-default p-4"
          >
            <View className="flex-row items-center gap-3">
              <View className="size-9 items-center justify-center rounded-full bg-accent-soft">
                {detail.data.pet.device === null ? (
                  <Moon size={20} color={accent} />
                ) : detail.data.pet.device.connectivity === 'online' ? (
                  <Wifi size={20} color={accent} />
                ) : (
                  <WifiOff size={20} color={accent} />
                )}
              </View>
              <Text
                testID="collar-status"
                className="text-base font-bold text-foreground"
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
                <Battery
                  size={18}
                  color={
                    detail.data.pet.device.batteryPct === null
                      ? muted
                      : detail.data.pet.device.batteryPct > 60
                        ? success
                        : warning
                  }
                />
                <Text
                  testID="collar-battery"
                  className={
                    detail.data.pet.device.batteryPct === null
                      ? 'font-normal text-muted'
                      : detail.data.pet.device.batteryPct > 60
                        ? 'font-semibold text-success'
                        : 'font-semibold text-warning'
                  }
                >
                  {detail.data.pet.device.batteryPct === null
                    ? '—'
                    : `${detail.data.pet.device.batteryPct}%`}
                </Text>
              </View>
            ) : (
              <Text className="font-normal text-muted">
                No collar — health only
              </Text>
            )}
          </HeroUICard>
        </>
      ) : null}

      {selectedPetId ? (
        <Card testID="summary-card" className="gap-4">
          <Text className="text-lg font-bold text-foreground">
            Today&apos;s Summary
          </Text>

          {activity.data === undefined ? (
            <Skeleton testID="summary-skeleton" className="h-16 w-full rounded-xl" />
          ) : null}

          {activity.data?.kind === 'no-tracking' ? (
            <Text testID="summary-note" className="font-normal text-muted">
              Activity tracking requires a collar
            </Text>
          ) : null}

          {activity.data?.kind === 'error' ||
          activity.data?.kind === 'unreachable' ||
          activity.data?.kind === 'missing-config' ? (
            <Text testID="summary-note" className="font-normal text-muted">
              Could not load activity
            </Text>
          ) : null}

          {activity.data?.kind === 'ok' ? (
            <View className="flex-row justify-between gap-3">
              <View className="flex-1 items-center gap-1 border-r border-border">
                <Walk size={20} color={muted} />
                <Text
                  testID="summary-activity"
                  className="text-sm font-bold text-foreground"
                >
                  {fmtMinutes(today?.activeMinutes ?? null)}
                </Text>
                <Text className="text-2xs font-normal text-muted">
                  Activity
                </Text>
              </View>
              <View className="flex-1 items-center gap-1 border-r border-border">
                <Moon size={20} color={muted} />
                <Text
                  testID="summary-sleep"
                  className="text-sm font-bold text-foreground"
                >
                  {fmtMinutes(today?.restMinutes ?? null)}
                </Text>
                <Text className="text-2xs font-normal text-muted">Sleep</Text>
              </View>
              <View className="flex-1 items-center gap-1">
                <Map size={20} color={muted} />
                <Text
                  testID="summary-distance"
                  className="text-sm font-bold text-foreground"
                >
                  {fmtKm(today?.distanceM ?? null)}
                </Text>
                <Text className="text-2xs font-normal text-muted">
                  Distance
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
          className="gap-2 rounded-2xl bg-default p-4"
          onPress={() => router.push('/map')}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="size-9 items-center justify-center rounded-full bg-accent-soft">
                <Map size={20} color={accent} />
              </View>
              <Text className="font-semibold text-accent">View on map</Text>
            </View>
            <ChevronRight size={20} color={accent} />
          </View>
          <Text testID="last-position-time" className="font-normal text-muted">
            {fmtLastSeen(detail.data.pet.lastCommunicationAt)}
          </Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}
