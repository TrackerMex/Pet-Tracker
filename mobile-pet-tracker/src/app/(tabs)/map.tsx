import { Button, Spinner } from 'heroui-native';
import MapView, { Marker } from 'react-native-maps';
import { useCallback, useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';

import { listPets, type PetsState } from '../../api/pets';
import { getLastPosition, listPositions } from '../../api/positions';
import { getDayRoute } from '../../api/trips';
import { useApi } from '../../hooks/use-api';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';

function isPetsError(state: PetsState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

const DEFAULT_REGION = {
  latitude: 19.4326,
  longitude: -99.1332,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function MapScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const { selectedPetId, selectPet } = useSelectedPet();
  const petsFn = useCallback(
    () => listPets(baseUrl, token ?? ''),
    [baseUrl, token],
  );
  const pets = useApi(petsFn);
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
  useApi(positionsFn);
  useApi(routeFn);

  useEffect(() => {
    if (pets.data?.kind !== 'ok' || pets.data.pets.length === 0) return;
    const selectionExists = pets.data.pets.some(({ id }) => id === selectedPetId);
    if (!selectionExists) selectPet(pets.data.pets[0].id);
  }, [pets.data, selectPet, selectedPetId]);

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

  return (
    <View testID="screen-map" className="flex-1 bg-background">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner testID="map-loading" />
        </View>
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
          </MapView>
          {position === null ? (
            <View
              style={{ position: 'absolute', top: 64, left: 16, right: 16 }}
              className="items-center rounded-2xl bg-surface p-3"
            >
              <Text testID="map-empty" className="text-muted">
                No location data yet
              </Text>
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}
