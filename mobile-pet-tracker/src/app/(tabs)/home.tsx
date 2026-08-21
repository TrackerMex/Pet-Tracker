import { Image } from 'expo-image';
import { Button, Card, Skeleton, Spinner } from 'heroui-native';
import { useCallback, useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getDailyActivity } from '../../api/activity';
import { getPet, listPets, type PetsState } from '../../api/pets';
import { useApi } from '../../hooks/use-api';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';

function isPetsError(state: PetsState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
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
  useApi(activityFn);

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
      ) : null}
    </ScrollView>
  );
}
