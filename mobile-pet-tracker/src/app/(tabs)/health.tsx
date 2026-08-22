import { Button, Spinner } from 'heroui-native';
import { useCallback, useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { listVaccines, listWeights } from '../../api/health-records';
import { listPets, type PetsState } from '../../api/pets';
import { useApi } from '../../hooks/use-api';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';

function isPetsError(state: PetsState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

export default function HealthScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const { selectedPetId, selectPet } = useSelectedPet();
  const insets = useSafeAreaInsets();
  const petsFn = useCallback(
    () => listPets(baseUrl, token ?? ''),
    [baseUrl, token],
  );
  const pets = useApi(petsFn);
  const vaccinesFn = useMemo(
    () =>
      selectedPetId
        ? () => listVaccines(baseUrl, token ?? '', selectedPetId)
        : null,
    [baseUrl, selectedPetId, token],
  );
  const weightFn = useMemo(
    () =>
      selectedPetId
        ? () => listWeights(baseUrl, token ?? '', selectedPetId, fetch, 1)
        : null,
    [baseUrl, selectedPetId, token],
  );
  useApi(vaccinesFn);
  useApi(weightFn);

  useEffect(() => {
    if (pets.data?.kind !== 'ok' || pets.data.pets.length === 0) return;
    const selectionExists = pets.data.pets.some(({ id }) => id === selectedPetId);
    if (!selectionExists) selectPet(pets.data.pets[0].id);
  }, [pets.data, selectPet, selectedPetId]);

  return (
    <ScrollView
      testID="screen-health"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <Text className="text-2xl font-semibold text-foreground">Health</Text>

      {pets.data === undefined ? <Spinner testID="health-loading" /> : null}

      {pets.data && isPetsError(pets.data) ? (
        <View className="items-start gap-3">
          <Text testID="health-error" className="text-danger">
            Something went wrong
          </Text>
          <Button testID="health-retry" onPress={pets.refetch}>
            Retry
          </Button>
        </View>
      ) : null}

      {pets.data?.kind === 'ok' && pets.data.pets.length === 0 ? (
        <Text testID="health-empty" className="text-muted">
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
    </ScrollView>
  );
}
