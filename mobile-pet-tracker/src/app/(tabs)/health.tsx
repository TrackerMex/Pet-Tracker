import { router } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useCallback, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, HeartPulse, Syringe } from 'reicon-react-native';

import { listVaccines, listWeights } from '../../api/health-records';
import { listPets, type PetsState } from '../../api/pets';
import { Card } from '../../components/card';
import { PetSwitcher } from '../../components/pet-switcher';
import { useApi } from '../../hooks/use-api';
import { usePetSelection } from '../../hooks/use-pet-selection';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { useThemeColors } from '../../theme/use-theme-colors';

function isPetsError(state: PetsState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function localTodayIso(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

function fmtVariation(variation: number | null): string {
  if (variation === null) return '—';
  return variation > 0 ? `+${variation} kg` : `${variation} kg`;
}

export default function HealthScreen() {
  const [warning, muted] = useThemeColors(['warning', 'muted']);
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
  const vaccines = useApi(vaccinesFn);
  const weight = useApi(weightFn);
  const today = localTodayIso();
  const nextVaccine =
    vaccines.data?.kind === 'ok'
      ? [...vaccines.data.vaccines]
          .filter(
            ({ nextDoseAt }) => nextDoseAt !== null && nextDoseAt >= today,
          )
          .sort((a, b) =>
            (a.nextDoseAt ?? '').localeCompare(b.nextDoseAt ?? ''),
          )[0]
      : undefined;

  return (
    <ScrollView
      testID="screen-health"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <Text className="text-2xl font-black text-foreground">Health</Text>

      {pets.data === undefined ? (
        <Skeleton testID="health-loading" className="h-12 w-full rounded-card" />
      ) : null}

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
        <PetSwitcher
          pets={pets.data.pets}
          selectedPetId={selectedPetId}
          onSelect={selectPet}
        />
      ) : null}

      {selectedPetId ? (
        <View testID="vaccines-section" className="gap-3">
          <View className="flex-row items-center gap-2">
            <HeartPulse size={20} color={muted} />
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
              Vaccines
            </Text>
          </View>

          {vaccines.data === undefined || vaccines.isRefreshing ? (
            <Skeleton
              testID="vaccines-skeleton"
              className="h-24 w-full rounded-2xl"
            />
          ) : null}

          {nextVaccine ? (
            <Card
              testID="next-vaccine-card"
              className="flex-row items-center gap-3"
            >
              <View className="size-11 items-center justify-center rounded-xl bg-warning-soft">
                <Syringe size={22} color={warning} />
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-2xs font-semibold text-warning-strong">
                  Next due
                </Text>
                <Text className="font-bold text-foreground">
                  {nextVaccine.name}
                </Text>
                <Text className="font-normal text-muted">
                  {nextVaccine.nextDoseAt}
                </Text>
              </View>
            </Card>
          ) : null}

          {vaccines.data?.kind === 'ok' && vaccines.data.vaccines.length === 0 ? (
            <Text testID="vaccines-empty" className="font-normal text-muted">
              No vaccines yet
            </Text>
          ) : null}

          {vaccines.data?.kind === 'error' ||
          vaccines.data?.kind === 'unreachable' ? (
            <View className="items-start gap-3">
              <Text testID="vaccines-error" className="text-danger">
                Could not load vaccines
              </Text>
              <Button testID="vaccines-retry" onPress={vaccines.refetch}>
                Retry
              </Button>
            </View>
          ) : null}

          {vaccines.data?.kind === 'ok'
            ? vaccines.data.vaccines.map((vaccine) => (
                <Card
                  key={vaccine.id}
                  testID={`vaccine-row-${vaccine.id}`}
                  className="gap-1"
                >
                  <Text className="font-bold text-foreground">
                    {vaccine.name}
                  </Text>
                  <Text className="font-normal text-muted">
                    {vaccine.appliedAt}
                  </Text>
                  {vaccine.nextDoseAt ? (
                    <Text
                      className={
                        vaccine.nextDoseAt < today
                          ? 'font-normal text-danger'
                          : 'font-normal text-muted'
                      }
                    >
                      {vaccine.nextDoseAt}
                    </Text>
                  ) : null}
                </Card>
              ))
            : null}
        </View>
      ) : null}

      {selectedPetId ? (
        <Card
          testID="weight-card"
          className="gap-3"
        >
          <View className="flex-row items-baseline justify-between gap-3">
            <Text className="text-sm font-bold text-foreground">Weight</Text>
            {weight.data?.kind === 'ok' && weight.data.weights.length > 0 ? (
              <Text
                testID="weight-current"
                className="text-xl font-black text-accent-strong"
              >
                {weight.data.weights[0].weightKg} kg
              </Text>
            ) : null}
          </View>

          {weight.data?.kind === 'ok' && weight.data.weights.length > 0 ? (
            <View className="flex-row justify-end">
              <Text
                testID="weight-variation"
                className="font-normal text-muted"
              >
                {fmtVariation(weight.data.weights[0].variation)}
              </Text>
            </View>
          ) : null}

          {weight.data?.kind === 'ok' && weight.data.weights.length === 0 ? (
            <Text testID="weight-card-empty" className="font-normal text-muted">
              No weight entries yet
            </Text>
          ) : null}

          {weight.data?.kind === 'error' || weight.data?.kind === 'unreachable' ? (
            <Text testID="weight-card-error" className="text-danger">
              Could not load weight
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            testID="weight-log-link"
            className="flex-row items-center justify-between rounded-xl bg-default px-3 py-2"
            onPress={() => router.push('/weight-log')}
          >
            <Text className="font-semibold text-foreground">Weight log</Text>
            <ChevronRight size={20} color={muted} />
          </Pressable>
        </Card>
      ) : null}
    </ScrollView>
  );
}
