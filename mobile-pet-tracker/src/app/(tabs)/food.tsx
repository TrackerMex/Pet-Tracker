import { router, type Href } from 'expo-router';
import { Button, Card, Skeleton, Spinner } from 'heroui-native';
import { useCallback, useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Clock, ForkKnife } from 'reicon-react-native';

import { getNutritionPlan } from '../../api/nutrition';
import { listPets, type PetsState } from '../../api/pets';
import { useApi } from '../../hooks/use-api';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { useThemeColors } from '../../theme/use-theme-colors';

function isPetsError(state: PetsState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function localTimeHhmm(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export default function FoodScreen() {
  const [muted, accent, foreground] = useThemeColors([
    'muted',
    'accent',
    'foreground',
  ]);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const { selectedPetId, selectPet } = useSelectedPet();
  const insets = useSafeAreaInsets();
  const petsFn = useCallback(
    () => listPets(baseUrl, token ?? ''),
    [baseUrl, token],
  );
  const pets = useApi(petsFn);
  const planFn = useMemo(
    () =>
      selectedPetId
        ? () => getNutritionPlan(baseUrl, token ?? '', selectedPetId)
        : null,
    [baseUrl, selectedPetId, token],
  );
  const plan = useApi(planFn);
  const hhmm = localTimeHhmm();
  const loadedPlan = plan.data?.kind === 'ok' ? plan.data.plan : null;
  const servedMeals =
    loadedPlan !== null
      ? loadedPlan.mealTimes.filter((mealTime) => mealTime <= hhmm).length
      : 0;

  useEffect(() => {
    if (pets.data?.kind !== 'ok' || pets.data.pets.length === 0) return;
    const selectionExists = pets.data.pets.some(({ id }) => id === selectedPetId);
    if (!selectionExists) selectPet(pets.data.pets[0].id);
  }, [pets.data, selectPet, selectedPetId]);

  return (
    <ScrollView
      testID="screen-food"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <Text className="text-2xl font-black text-foreground">Food</Text>

      {pets.data === undefined ? <Spinner testID="food-loading" /> : null}

      {pets.data && isPetsError(pets.data) ? (
        <View className="items-start gap-3">
          <Text testID="food-error" className="text-danger">
            Something went wrong
          </Text>
          <Button testID="food-retry" onPress={pets.refetch}>
            Retry
          </Button>
        </View>
      ) : null}

      {pets.data?.kind === 'ok' && pets.data.pets.length === 0 ? (
        <Text testID="food-empty" className="text-muted">
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
                      : 'rounded-full bg-default px-4 py-2'
                  }
                  onPress={() => selectPet(pet.id)}
                >
                  <Text
                    className={
                      selected
                        ? 'font-semibold text-accent-foreground'
                        : 'font-semibold text-foreground'
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

      {selectedPetId ? (
        <View className="gap-4">
          {plan.data === undefined || plan.isRefreshing ? (
            <Skeleton
              testID="food-plan-skeleton"
              className="h-32 w-full rounded-[20px]"
            />
          ) : null}

          {loadedPlan !== null ? (
            <>
              <Card
                testID="food-plan-card"
                className="gap-4 rounded-[20px] bg-accent p-5 shadow-sm"
              >
                <View className="flex-row items-center justify-between gap-4">
                  <View className="flex-1 gap-1">
                    <Text className="text-xs font-semibold uppercase tracking-widest text-accent-foreground opacity-70">
                      Daily target
                    </Text>
                    <Text
                      testID="food-plan-kcal"
                      className="text-3xl font-black text-accent-foreground"
                    >
                      {loadedPlan.merKcal} kcal / day
                    </Text>
                    <Text
                      testID="food-plan-grams"
                      className="font-semibold text-accent-foreground opacity-80"
                    >
                      {loadedPlan.dailyGrams} g / day
                    </Text>
                  </View>
                  <View className="size-14 items-center justify-center rounded-2xl bg-surface-secondary">
                    <ForkKnife size={26} color={accent} />
                  </View>
                </View>
              </Card>

              <Card
                testID="food-meals-section"
                className="gap-3 rounded-[20px] border border-border bg-surface p-4 shadow-sm"
              >
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="font-bold text-foreground">Meals today</Text>
                  <Text
                    testID="food-meals-progress"
                    className="text-xs font-semibold text-muted"
                  >
                    {servedMeals}/{loadedPlan.mealsPerDay}
                  </Text>
                </View>

                {loadedPlan.mealTimes.map((mealTime, index) => {
                  const served = mealTime <= hhmm;
                  const portionGrams = Math.round(
                    loadedPlan.dailyGrams / loadedPlan.mealsPerDay,
                  );

                  return (
                    <View
                      key={`${mealTime}-${index}`}
                      testID={`meal-row-${index}`}
                      className={
                        served
                          ? 'flex-row items-center gap-3 rounded-xl bg-surface-secondary p-3'
                          : 'flex-row items-center gap-3 rounded-xl bg-default p-3'
                      }
                    >
                      <View className="size-9 items-center justify-center rounded-full bg-surface">
                        <Clock size={17} color={served ? accent : muted} />
                      </View>
                      <View className="flex-1 gap-0.5">
                        <Text className="font-bold text-foreground">
                          {mealTime}
                        </Text>
                        <Text className="text-xs font-normal text-muted">
                          {portionGrams} g
                        </Text>
                      </View>
                      <Text
                        testID={
                          served
                            ? `meal-served-${index}`
                            : `meal-pending-${index}`
                        }
                        className={
                          served
                            ? 'rounded-full bg-surface px-2 py-1 text-[10px] font-bold text-accent'
                            : 'rounded-full bg-surface px-2 py-1 text-[10px] font-bold text-muted'
                        }
                      >
                        {served ? 'Served' : 'Pending'}
                      </Text>
                    </View>
                  );
                })}
              </Card>

              {loadedPlan.warnings.length > 0 ? (
                <View className="gap-2">
                  {loadedPlan.warnings.map((warning) => (
                    <Card
                      key={warning.code}
                      className="rounded-2xl border border-border bg-default p-4"
                    >
                      <Text
                        testID={`plan-warning-${warning.code}`}
                        className="text-sm font-medium text-foreground"
                      >
                        {warning.message}
                      </Text>
                    </Card>
                  ))}
                </View>
              ) : null}
            </>
          ) : null}

          {plan.data?.kind === 'not-found' ? (
            <Text testID="food-plan-empty" className="font-normal text-muted">
              No meal plan yet
            </Text>
          ) : null}

          {plan.data?.kind === 'error' ||
          plan.data?.kind === 'unreachable' ||
          plan.data?.kind === 'missing-config' ? (
            <View className="items-start gap-3">
              <Text testID="food-plan-error" className="text-danger">
                Could not load meal plan
              </Text>
              <Button testID="food-plan-retry" onPress={plan.refetch}>
                Retry
              </Button>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            testID="meal-schedule-link"
            className="flex-row items-center justify-between rounded-[20px] border border-border bg-surface p-4 shadow-sm"
            onPress={() => router.push('/meal-schedule' as Href)}
          >
            <View className="gap-1">
              <Text className="font-bold text-foreground">Meal schedule</Text>
              <Text className="text-xs font-normal text-muted">
                View nutrition profile and times
              </Text>
            </View>
            <ChevronRight size={20} color={foreground} />
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}
