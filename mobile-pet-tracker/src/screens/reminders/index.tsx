import { router, type Href } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { listPets } from '../../api/pets';
import { listReminders, type RemindersState } from '../../api/reminders';
import { PetSwitcher } from '../../components/pet-switcher';
import { useApi } from '../../hooks/use-api';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';

function isRemindersError(state: RemindersState): boolean {
  return ['error', 'unreachable', 'missing-config', 'not-found'].includes(
    state.kind,
  );
}

export function RemindersScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const { selectedPetId, selectPet } = useSelectedPet();
  const insets = useSafeAreaInsets();
  const petsFn = useCallback(
    () => listPets(baseUrl, token ?? ''),
    [baseUrl, token],
  );
  const pets = useApi(petsFn);
  const remindersFn = useMemo(
    () =>
      selectedPetId
        ? () => listReminders(baseUrl, token ?? '', selectedPetId)
        : null,
    [baseUrl, selectedPetId, token],
  );
  const reminders = useApi(remindersFn);

  useEffect(() => {
    if (pets.data?.kind !== 'ok' || pets.data.pets.length === 0) return;
    const selectionExists = pets.data.pets.some(
      ({ id }) => id === selectedPetId,
    );
    if (!selectionExists) selectPet(pets.data.pets[0].id);
  }, [pets.data, selectPet, selectedPetId]);

  return (
    <ScrollView
      testID="screen-reminders"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-2xl font-black text-foreground">Reminders</Text>
        <Button
          testID="reminders-add-link"
          className="rounded-xl bg-accent"
          onPress={() => router.push('/add-reminder' as Href)}
        >
          <Button.Label className="font-bold text-accent-foreground">
            New
          </Button.Label>
        </Button>
      </View>

      {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
        <PetSwitcher
          pets={pets.data.pets}
          selectedPetId={selectedPetId}
          onSelect={selectPet}
        />
      ) : null}

      {selectedPetId && reminders.data === undefined ? (
        <View testID="reminders-loading" className="gap-3">
          {[0, 1, 2].map((index) => (
            <Skeleton
              key={index}
              testID={`reminder-row-skeleton-${index + 1}`}
              className="h-20 w-full rounded-2xl"
            />
          ))}
        </View>
      ) : null}

      {reminders.data && isRemindersError(reminders.data) ? (
        <View className="items-start gap-3">
          <Text testID="reminders-error" className="text-danger">
            Something went wrong
          </Text>
          <Button testID="reminders-retry" onPress={reminders.refetch}>
            <Button.Label>Retry</Button.Label>
          </Button>
        </View>
      ) : null}

      {reminders.data?.kind === 'ok' &&
      reminders.data.reminders.length === 0 ? (
        <Text testID="reminders-empty" className="font-normal text-muted">
          No reminders yet
        </Text>
      ) : null}
    </ScrollView>
  );
}
