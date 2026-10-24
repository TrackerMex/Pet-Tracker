import { useQuery } from '@tanstack/react-query';
import { Button, Skeleton } from 'heroui-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

import { listGeofences } from '../../api/geofences';
import {
  getPet,
  listPets,
  setLostMode,
  type PetsState,
} from '../../api/pets';
import {
  getLastPosition,
  listPositions,
  type LastPositionState,
} from '../../api/positions';
import { geofenceKeys, petKeys, positionKeys, tripKeys } from '../../api/query-keys';
import { getDayRoute } from '../../api/trips';
import { Card } from '../../components/card';
import { EmptyState } from '../../components/empty-state';
import { PetAvatar } from '../../components/pet-avatar';
import {
  STATUS_TONE_CLASSES,
  type PetHeroStatusTone,
} from '../../components/pet-hero-header';
import { DEFAULT_CENTER, PetMap } from '../../components/pet-map';
import { usePetSelection } from '../../hooks/use-pet-selection';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { MOTION_RISE_OFFSET_Y } from '../../theme/motion';
import {
  CONTINUOUS_CORNER,
  TABULAR_NUMS,
} from '../../theme/native-styles';
import { useShadows } from '../../theme/shadows';
import {
  deviceConnectionState,
  MAP_CONNECTION_LABEL_KEY,
  type DeviceConnectionState,
} from '../../utils/device-connectivity';
import { homeEntering } from '../home/home-entrance';

function isPetsError(state: PetsState): boolean {
  switch (state.kind) {
    case 'ok':
      return false;
    case 'unauthorized':
    case 'error':
    case 'unreachable':
    case 'missing-config':
      return true;
  }
}

function isLastError(state: LastPositionState): boolean {
  switch (state.kind) {
    case 'ok':
    case 'no-tracking':
      return false;
    case 'error':
    case 'unauthorized':
    case 'unreachable':
    case 'missing-config':
      return true;
  }
}

function fmtKm(meters: number | null): string {
  return meters === null ? '—' : `${(meters / 1000).toFixed(1)} km`;
}

function fmtSpeed(kmh: number | null | undefined): string {
  return kmh == null ? '—' : `${kmh.toFixed(1)} km/h`;
}

function fmtAgo(
  seconds: number,
  t: ReturnType<typeof useTranslate>,
): string {
  if (seconds < 60) return t('map.justNow');
  if (seconds < 3600) {
    return t('map.agoMinutes', { minutes: Math.floor(seconds / 60) });
  }
  return t('map.agoHours', { hours: Math.floor(seconds / 3600) });
}

const POLL_MS = 15000;

// #201 R6
const STAT_DASH = 'text-xl font-black text-muted';

const MAP_CONNECTION_TONE: Record<DeviceConnectionState, PetHeroStatusTone> = {
  none: 'muted',
  unknown: 'muted',
  offline: 'warning',
  online: 'success',
};

export function MapScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const t = useTranslate();
  const { selectedPetId } = useSelectedPet();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const shadows = useShadows();
  const { theme } = useUniwind();
  const pets = useQuery({
    queryKey: petKeys.list(),
    queryFn: () => listPets(baseUrl, token ?? ''),
  });
  usePetSelection({ data: pets.data, isRefreshing: pets.isRefetching });
  const [lostModeBusy, setLostModeBusy] = useState(false);
  const [lostModeFailed, setLostModeFailed] = useState(false);
  const detail = useQuery({
    queryKey: petKeys.detail(selectedPetId ?? ''),
    queryFn: () => getPet(baseUrl, token ?? '', selectedPetId!),
    enabled: selectedPetId !== null,
  });
  const last = useQuery({
    queryKey: positionKeys.last(selectedPetId ?? ''),
    queryFn: () => getLastPosition(baseUrl, token ?? '', selectedPetId!),
    enabled: selectedPetId !== null,
  });
  const positions = useQuery({
    queryKey: positionKeys.list(selectedPetId ?? ''),
    queryFn: () => listPositions(baseUrl, token ?? '', selectedPetId!),
    enabled: selectedPetId !== null,
  });
  const route = useQuery({
    queryKey: tripKeys.dayRoute(selectedPetId ?? ''),
    queryFn: () => getDayRoute(baseUrl, token ?? '', selectedPetId!),
    enabled: selectedPetId !== null,
  });
  const geofences = useQuery({
    queryKey: geofenceKeys.list(selectedPetId ?? ''),
    queryFn: () => listGeofences(baseUrl, token ?? '', selectedPetId!),
    enabled: selectedPetId !== null,
  });
  const refetchDetail = detail.refetch;
  const refetchLast = last.refetch;
  const refetchPositions = positions.refetch;
  const refetchRoute = route.refetch;
  const lastKind = last.data?.kind;
  const selectedPet =
    pets.data?.kind === 'ok'
      ? pets.data.pets.find(({ id }) => id === selectedPetId)
      : undefined;
  const canSetLostMode = selectedPet?.myRole === 'owner';
  const canPairCollar =
    detail.data?.kind === 'ok' &&
    detail.data.pet.myRole === 'owner' &&
    detail.data.pet.device === null;
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
        refetchDetail();
        refetchLast();
        refetchPositions();
      }, POLL_MS);

      return () => clearInterval(intervalId);
    }, [
      lastKind,
      refetchDetail,
      refetchLast,
      refetchPositions,
      refetchRoute,
      selectedPetId,
    ]),
  );

  const petsReady = pets.data?.kind === 'ok' && pets.data.pets.length > 0;
  const isLoading =
    pets.data === undefined || (petsReady && last.data === undefined);
  const position = last.data?.kind === 'ok' ? last.data.position : undefined;
  const center = position
    ? {
        latitude: position.lat,
        longitude: position.lng,
      }
    : DEFAULT_CENTER;
  const marker = position
    ? { latitude: position.lat, longitude: position.lng }
    : null;
  const polylines =
    route.data?.kind === 'ok'
      ? route.data.trips.map((trip) => ({
          id: `trip-${trip.index}`,
          coordinates: trip.path.map(({ lat, lng }) => ({
            latitude: lat,
            longitude: lng,
          })),
        }))
      : [];
  const circles = geofences.data?.kind === 'ok'
    ? geofences.data.geofences
        .filter(({ active }) => active)
        .map(({ id, centerLat, centerLng, radiusM }) => ({ id, center: { latitude: centerLat, longitude: centerLng }, radius: radiusM }))
    : [];
  const latestSpeed =
    positions.data?.kind === 'ok'
      ? positions.data.items[positions.data.items.length - 1]?.speedKmh
      : undefined;
  const distanceM =
    route.data?.kind === 'ok'
      ? route.data.trips.reduce((total, trip) => total + trip.distanceM, 0)
      : null;
  const updated = position ? fmtAgo(position.staleSeconds, t) : '—';
  const connection =
    detail.data?.kind === 'ok'
      ? deviceConnectionState(detail.data.pet.device)
      : null;
  const gps = connection
      ? t(MAP_CONNECTION_LABEL_KEY[connection].labelKey)
      : '—';
  const gpsTone = STATUS_TONE_CLASSES[
    connection ? MAP_CONNECTION_TONE[connection] : 'muted'
  ];
  const batteryPct = detail.data?.kind === 'ok'
    ? detail.data.pet.device?.batteryPct ?? null
    : null;
  const battery = batteryPct === null ? '—' : `${batteryPct}%`;
  const batteryTone = STATUS_TONE_CLASSES[
    batteryPct === null ? 'muted' : batteryPct > 60 ? 'success' : 'warning'
  ];

  return (
    <View testID="screen-map" className="flex-1">
      {isLoading ? (
        <Skeleton testID="map-loading" className="flex-1 bg-background" />
      ) : null}

      {pets.data && isPetsError(pets.data) ? (
        <View className="flex-1 items-center justify-center gap-3 p-6 bg-background">
          <Text testID="map-error" className="text-danger">
            {t('common.somethingWentWrong')}
          </Text>
          <Button
            testID="map-retry"
            onPress={() => void pets.refetch()}
          >
            {t('common.retry')}
          </Button>
        </View>
      ) : null}

      {pets.data?.kind === 'ok' && pets.data.pets.length === 0 ? (
        <View className="flex-1 items-center justify-center p-6 bg-background">
          <EmptyState
            testID="map-no-pets"
            pose="talk"
            title={t('common.noPetsYet')}
            body={t('common.noPetsBody')}
            action={{
              label: t('profile.addPet'),
              onPress: () => router.push('/pets/add'),
            }}
          />
        </View>
      ) : null}

      {petsReady && last.data?.kind === 'no-tracking' ? (
        <View className="flex-1 items-center justify-center p-6 bg-background">
          <EmptyState
            testID="map-no-tracking"
            pose="collar"
            title={t('map.noTrackingTitle')}
            body={t('map.noTrackingBody')}
            action={canPairCollar ? { label: t('home.pairCollar'), onPress: () => router.push('/pairing') } : undefined}
          />
        </View>
      ) : null}

      {petsReady && last.data && isLastError(last.data) ? (
        <View
          testID="map-last-error-state"
          className="flex-1 items-center justify-center gap-3 p-6 bg-background"
        >
          <Text selectable testID="map-last-error" className="text-danger">
            {t('common.somethingWentWrong')}
          </Text>
          <Button
            testID="map-last-retry"
            onPress={() => void refetchLast()}
          >
            {t('common.retry')}
          </Button>
        </View>
      ) : null}

      {petsReady && last.data?.kind === 'ok' ? (
        <>
          <PetMap
            key={selectedPetId}
            center={center}
            marker={marker}
            polylines={polylines}
            polylineWidth={5}
            circles={circles}
            colorScheme={theme === 'dark' ? 'dark' : 'light'}
          />
          {position === null ? (
            <Card
              testID="map-empty-overlay"
              style={{
                position: 'absolute',
                top: insets.top + 12,
                left: 16,
                right: 16,
              }}
              className="items-center p-3"
            >
              <Text testID="map-empty" className="text-muted">
                {t('map.noLocationDataYet')}
              </Text>
            </Card>
          ) : null}
          <Animated.View
            testID="map-stats"
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              bottom: insets.bottom + 96,
            }}
            className="gap-2.5"
            entering={
              reducedMotion
                ? undefined
                : homeEntering(0, MOTION_RISE_OFFSET_Y)
            }
          >
            {selectedPet ? (
              <View
                testID="map-pet-pill"
                accessible
                accessibilityLabel={`${selectedPet.name}, ${gps}`}
                className="flex-row items-center gap-2 self-start rounded-full border border-border bg-glass-surface-strong py-1.5 pl-1.5 pr-3.5"
                style={shadows.card}
              >
                <PetAvatar
                  testID="map-pet-pill-avatar"
                  size={28}
                  name={selectedPet.name}
                  photoUrl={selectedPet.photoUrl}
                  cacheKey={selectedPet.id}
                />
                <Text
                  testID="map-pet-pill-name"
                  className="shrink text-15 font-extrabold text-foreground"
                  numberOfLines={1}
                >
                  {selectedPet.name}
                </Text>
                <View
                  testID="map-pet-pill-gps"
                  className="flex-row items-center gap-1.25"
                >
                  <View
                    testID="map-pet-pill-dot"
                    className={`size-1.75 rounded-full ${
                      connection === 'online' ? 'bg-accent' : gpsTone.dot
                    }`}
                  />
                  <Text
                    testID="map-pet-pill-status"
                    className={`text-xs font-bold ${gpsTone.text}`}
                    numberOfLines={1}
                  >
                    {gps}
                  </Text>
                </View>
              </View>
            ) : null}
            <View
              testID="map-stats-card"
              className="gap-2.5 rounded-24 bg-surface p-3"
              style={shadows.floating}
            >
              <View className="gap-2">
                <View className="flex-row gap-2">
                  <View
                    className="flex-1 gap-0.5 rounded-14 bg-default px-3 py-2.5"
                    style={CONTINUOUS_CORNER}
                  >
                    <Text className="text-11 font-semibold text-muted">
                      {t('map.speed')}
                    </Text>
                    <Text
                      testID="stat-speed"
                      className={latestSpeed == null ? STAT_DASH : 'text-xl font-black text-accent-strong'}
                      numberOfLines={1}
                      style={TABULAR_NUMS}
                    >
                      {fmtSpeed(latestSpeed)}
                    </Text>
                  </View>
                  <View
                    className="flex-1 gap-0.5 rounded-14 bg-default px-3 py-2.5"
                    style={CONTINUOUS_CORNER}
                  >
                    <Text className="text-11 font-semibold text-muted">
                      {t('map.distance')}
                    </Text>
                    <Text
                      testID="stat-distance"
                      className={distanceM === null ? STAT_DASH : 'text-xl font-black text-foreground'}
                      numberOfLines={1}
                      style={TABULAR_NUMS}
                    >
                      {fmtKm(distanceM)}
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-2">
                  <View
                    className="flex-1 gap-0.5 rounded-14 bg-default px-3 py-2.5"
                    style={CONTINUOUS_CORNER}
                  >
                    <Text className="text-11 font-semibold text-muted">
                      {t('map.updated')}
                    </Text>
                    <Text
                      testID="stat-updated"
                      className={position ? 'text-base font-bold text-muted' : STAT_DASH}
                      numberOfLines={1}
                      style={TABULAR_NUMS}
                    >
                      {updated}
                    </Text>
                  </View>
                  <View
                    className="flex-1 gap-0.5 rounded-14 bg-default px-3 py-2.5"
                    style={CONTINUOUS_CORNER}
                  >
                    <Text className="text-11 font-semibold text-muted">
                      {t('pairing.battery')}
                    </Text>
                    <Text
                      testID="stat-battery"
                      className={`text-xl font-black ${batteryTone.text}`}
                      numberOfLines={1}
                      style={TABULAR_NUMS}
                    >
                      {battery}
                    </Text>
                  </View>
                </View>
              </View>
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
                    ? t('map.deactivateLostMode')
                    : t('map.activateLostMode')}
                </Button.Label>
              </Button>
            </View>
            {lostModeFailed ? (
              <Text
                selectable
                testID="lost-mode-error"
                className="text-center text-xs font-normal text-danger"
              >
                {t('map.couldNotUpdateLostMode')}
              </Text>
            ) : null}
          </Animated.View>
        </>
      ) : null}
    </View>
  );
}
