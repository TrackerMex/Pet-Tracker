import { Button, Skeleton } from 'heroui-native';
import { useFocusEffect } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

import { listPets, setLostMode, type PetsState } from '../../api/pets';
import { getLastPosition, listPositions } from '../../api/positions';
import { getDayRoute } from '../../api/trips';
import { Card } from '../../components/card';
import { useApi } from '../../hooks/use-api';
import { usePetSelection } from '../../hooks/use-pet-selection';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import mapStyleDark from '../../theme/map-style-dark.json';

function isPetsError(state: PetsState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function fmtKm(meters: number | null): string {
  return meters === null ? '—' : `${(meters / 1000).toFixed(1)} km`;
}

function fmtSpeed(kmh: number | null | undefined): string {
  return kmh == null ? '—' : `${kmh.toFixed(1)} km/h`;
}

function fmtAgo(seconds: number): string {
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

const DEFAULT_REGION = {
  latitude: 19.4326,
  longitude: -99.1332,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};
const STALE_SECONDS = 120;
const POLL_MS = 15000;

export default function MapScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const { selectedPetId } = useSelectedPet();
  const insets = useSafeAreaInsets();
  const { theme } = useUniwind();
  const petsFn = useCallback(
    () => listPets(baseUrl, token ?? ''),
    [baseUrl, token],
  );
  const pets = useApi(petsFn);
  usePetSelection(pets);
  const [lostModeBusy, setLostModeBusy] = useState(false);
  const [lostModeFailed, setLostModeFailed] = useState(false);
  const lastFn = useMemo(
    () =>
      selectedPetId
        ? () => getLastPosition(baseUrl, token ?? '', selectedPetId)
        : null,
    [baseUrl, selectedPetId, token],
  );
  const positionsFn = useMemo(
    () =>
      selectedPetId
        ? () => listPositions(baseUrl, token ?? '', selectedPetId)
        : null,
    [baseUrl, selectedPetId, token],
  );
  const routeFn = useMemo(
    () =>
      selectedPetId
        ? () => getDayRoute(baseUrl, token ?? '', selectedPetId)
        : null,
    [baseUrl, selectedPetId, token],
  );
  const last = useApi(lastFn);
  const positions = useApi(positionsFn);
  const route = useApi(routeFn);
  const refetchLast = last.refetch;
  const refetchPositions = positions.refetch;
  const refetchRoute = route.refetch;
  const lastKind = last.data?.kind;
  const selectedPet =
    pets.data?.kind === 'ok'
      ? pets.data.pets.find(({ id }) => id === selectedPetId)
      : undefined;
  const canSetLostMode = selectedPet?.myRole === 'owner';
  const refetchPets = pets.refetch;
  const handleLostMode = useCallback(async () => {
    if (!selectedPet || selectedPet.myRole !== 'owner' || lostModeBusy) return;

    setLostModeFailed(false);
    setLostModeBusy(true);
    try {
      const result = await setLostMode(
        baseUrl,
        token ?? '',
        selectedPet.id,
        !selectedPet.lostMode,
      );
      if (result.kind === 'ok') {
        refetchPets();
      } else {
        setLostModeFailed(true);
      }
    } finally {
      setLostModeBusy(false);
    }
  }, [baseUrl, lostModeBusy, refetchPets, selectedPet, token]);

  useFocusEffect(
    useCallback(() => {
      if (!selectedPetId || lastKind === 'no-tracking') return;

      refetchRoute();
      const intervalId = setInterval(() => {
        refetchLast();
        refetchPositions();
      }, POLL_MS);

      return () => clearInterval(intervalId);
    }, [
      lastKind,
      refetchLast,
      refetchPositions,
      refetchRoute,
      selectedPetId,
    ]),
  );

  const isLoading =
    pets.data === undefined ||
    (pets.data.kind === 'ok' &&
      pets.data.pets.length > 0 &&
      last.data === undefined);
  const position = last.data?.kind === 'ok' ? last.data.position : undefined;
  const initialRegion = position
    ? {
        latitude: position.lat,
        longitude: position.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : DEFAULT_REGION;
  const latestSpeed =
    positions.data?.kind === 'ok'
      ? positions.data.items[positions.data.items.length - 1]?.speedKmh
      : undefined;
  const distanceM =
    route.data?.kind === 'ok'
      ? route.data.trips.reduce((total, trip) => total + trip.distanceM, 0)
      : null;
  const updated = position ? fmtAgo(position.staleSeconds) : '—';
  const gps =
    position === null
      ? 'No signal'
      : position && position.staleSeconds <= STALE_SECONDS
        ? 'Live'
        : 'Stale';

  return (
    <View testID="screen-map" className="flex-1 bg-background">
      {isLoading ? (
        <Skeleton testID="map-loading" className="flex-1" />
      ) : null}

      {pets.data && isPetsError(pets.data) ? (
        <View className="flex-1 items-center justify-center gap-3 p-6">
          <Text testID="map-error" className="text-danger">
            Something went wrong
          </Text>
          <Button testID="map-retry" onPress={pets.refetch}>
            Retry
          </Button>
        </View>
      ) : null}

      {pets.data?.kind === 'ok' && pets.data.pets.length === 0 ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text testID="map-no-pets" className="text-muted">
            No pets yet
          </Text>
        </View>
      ) : null}

      {last.data?.kind === 'no-tracking' ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text testID="map-no-tracking" className="text-center text-muted">
            Live tracking requires a collar
          </Text>
        </View>
      ) : null}

      {last.data?.kind === 'ok' ? (
        <>
          <MapView
            key={selectedPetId}
            testID="map-view"
            style={{ flex: 1 }}
            initialRegion={initialRegion}
            customMapStyle={theme === 'dark' ? mapStyleDark : undefined}
          >
            {position ? (
              <Marker
                testID="map-marker"
                coordinate={{
                  latitude: position.lat,
                  longitude: position.lng,
                }}
              />
            ) : null}
            {route.data?.kind === 'ok'
              ? route.data.trips.map((trip) => (
                  <Polyline
                    key={trip.index}
                    testID={`map-route-${trip.index}`}
                    coordinates={trip.path.map(({ lat, lng }) => ({
                      latitude: lat,
                      longitude: lng,
                    }))}
                  />
                ))
              : null}
          </MapView>
          {position === null ? (
            <View
              testID="map-empty-overlay"
              style={{
                position: 'absolute',
                top: insets.top + 12,
                left: 16,
                right: 16,
              }}
              className="items-center rounded-2xl bg-surface p-3"
            >
              <Text testID="map-empty" className="text-muted">
                No location data yet
              </Text>
            </View>
          ) : null}
          <View
            testID="map-stats"
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              bottom: insets.bottom + 96,
            }}
            className="gap-2"
          >
            <Card className="p-3">
              <View className="flex-row gap-2">
                <View className="flex-1 items-center rounded-xl bg-default p-3">
                  <Text
                    testID="stat-speed"
                    className="text-base font-black text-accent"
                  >
                    {fmtSpeed(latestSpeed)}
                  </Text>
                  <Text className="mt-1 text-2xs font-normal text-muted">
                    Speed
                  </Text>
                </View>
                <View className="flex-1 items-center rounded-xl bg-default p-3">
                  <Text
                    testID="stat-distance"
                    className="text-base font-black text-accent"
                  >
                    {fmtKm(distanceM)}
                  </Text>
                  <Text className="mt-1 text-2xs font-normal text-muted">
                    Distance
                  </Text>
                </View>
                <View className="flex-1 items-center rounded-xl bg-default p-3">
                  <Text
                    testID="stat-updated"
                    className="text-base font-black text-muted"
                  >
                    {updated}
                  </Text>
                  <Text className="mt-1 text-2xs font-normal text-muted">
                    Updated
                  </Text>
                </View>
                <View className="flex-1 items-center rounded-xl bg-default p-3">
                  <Text
                    testID="stat-gps"
                    className="text-base font-black text-muted"
                  >
                    {gps}
                  </Text>
                  <Text className="mt-1 text-2xs font-normal text-muted">
                    GPS
                  </Text>
                </View>
              </View>
            </Card>
            <Button
              testID="lost-mode-button"
              isDisabled={!canSetLostMode || lostModeBusy}
              onPress={handleLostMode}
              variant="danger-soft"
              accessibilityState={{
                disabled: !canSetLostMode || lostModeBusy,
              }}
              className="rounded-xl border border-danger/20 bg-danger-soft"
            >
              <Button.Label className="font-bold text-danger">
                {selectedPet?.lostMode
                  ? 'Deactivate Lost Mode'
                  : 'Activate Lost Mode'}
              </Button.Label>
            </Button>
            {lostModeFailed ? (
              <Text
                selectable
                testID="lost-mode-error"
                className="text-center text-xs font-normal text-danger"
              >
                Could not update Lost Mode
              </Text>
            ) : null}
          </View>
        </>
      ) : null}
    </View>
  );
}
