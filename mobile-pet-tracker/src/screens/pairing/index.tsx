import { router, useFocusEffect } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { claimDevice } from '../../api/devices';
import { listPets, type PetsState } from '../../api/pets';
import { Card } from '../../components/card';
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
  const [code, setCode] = useState('');
  const [claiming, setClaiming] = useState(false);
  const selectedPet =
    pets.data?.kind === 'ok'
      ? pets.data.pets.find(({ id }) => id === selectedPetId)
      : undefined;

  useFocusEffect(
    useCallback(() => {
      refetchPets();
    }, [refetchPets]),
  );

  async function handleClaim() {
    const activationCode = code.trim();
    if (!selectedPetId || !activationCode || claiming) return;

    setClaiming(true);
    await claimDevice(baseUrl, token ?? '', {
      petId: selectedPetId,
      activationCode,
    });
    setClaiming(false);
  }

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

      {selectedPet?.device === null ? (
        <View className="gap-4">
          <Text className="text-2xl font-black text-foreground">
            Pair collar
          </Text>

          <Card variant="secondary">
            <Text
              testID="pairing-plan-free"
              className="text-sm font-normal text-foreground"
              selectable
            >
              Free plan — health only. Pair a collar with an active plan to see
              the map.
            </Text>
          </Card>

          <View className="gap-2">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
              Activation code
            </Text>
            <TextInput
              testID="activation-code-input"
              className="min-h-12 rounded-xl border border-border bg-default px-4 py-3 text-foreground"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={64}
              value={code}
              onChangeText={setCode}
            />
            <Text className="text-sm font-normal text-muted">
              Printed on the collar box
            </Text>
          </View>

          <Button
            testID="pairing-submit"
            className="min-h-11 w-full rounded-xl bg-accent"
            isDisabled={code.trim() === '' || claiming}
            onPress={() => void handleClaim()}
          >
            <Button.Label className="font-bold text-accent-foreground">
              Pair collar
            </Button.Label>
          </Button>
        </View>
      ) : null}
    </ScrollView>
  );
}
