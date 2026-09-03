import { router, useFocusEffect } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { listPets, type PetsState } from '../../api/pets';
import { PetSwitcher } from '../../components/pet-switcher';
import { useApi } from '../../hooks/use-api';
import { usePetSelection } from '../../hooks/use-pet-selection';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';

function isPetsError(state: PetsState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

export function PairingScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const { selectedPetId, selectPet } = useSelectedPet();
  const insets = useSafeAreaInsets();
  const petsFn = useCallback(
    () => listPets(baseUrl, token ?? ''),
    [baseUrl, token],
  );
  const pets = useApi(petsFn);
  usePetSelection(pets);
  const refetchPets = pets.refetch;

  useFocusEffect(
    useCallback(() => {
      refetchPets();
    }, [refetchPets]),
  );

  return (
    <ScrollView
      testID="screen-pairing"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <Pressable
        accessibilityLabel="Back"
        accessibilityRole="button"
        testID="pairing-back"
        className="size-11 items-center justify-center rounded-full bg-default"
        onPress={() => router.back()}
      >
        <Text className="text-lg font-bold text-foreground">←</Text>
      </Pressable>

      {pets.data === undefined ? (
        <View testID="pairing-skeleton" className="gap-3">
          <Skeleton
            testID="pairing-content-skeleton-1"
            className="h-11 w-36 rounded-full"
          />
          <Skeleton
            testID="pairing-content-skeleton-2"
            className="h-32 w-full rounded-card"
          />
          <Skeleton
            testID="pairing-content-skeleton-3"
            className="h-12 w-full rounded-xl"
          />
        </View>
      ) : null}

      {pets.data && isPetsError(pets.data) ? (
        <View className="items-start gap-3">
          <Text testID="pairing-error-pets" className="text-danger" selectable>
            Something went wrong
          </Text>
          <Button testID="pairing-retry" onPress={pets.refetch}>
            <Button.Label>Retry</Button.Label>
          </Button>
        </View>
      ) : null}

      {pets.data?.kind === 'ok' && pets.data.pets.length === 0 ? (
        <Text testID="pairing-no-pets" className="font-normal text-muted">
          Add a pet first
        </Text>
      ) : null}

      {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
        <PetSwitcher
          pets={pets.data.pets}
          selectedPetId={selectedPetId}
          onSelect={selectPet}
        />
      ) : null}
    </ScrollView>
  );
}
