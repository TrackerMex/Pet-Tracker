import { Button, Spinner } from 'heroui-native';
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
    </View>
  );
}
