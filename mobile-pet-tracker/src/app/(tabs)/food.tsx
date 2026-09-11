import { useQuery } from '@tanstack/react-query';
import { router, type Href } from 'expo-router';
import { Button, Skeleton, Spinner } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Clock, ForkKnife, Sparkles } from 'reicon-react-native';

import { getNutritionPlan } from '../../api/nutrition';
import { listPets, type PetsState } from '../../api/pets';
import { nutritionKeys, petKeys } from '../../api/query-keys';
import { Card } from '../../components/card';
import { PetSwitcher } from '../../components/pet-switcher';
import { usePetSelection } from '../../hooks/use-pet-selection';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
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
    'accent-strong',
    'foreground',
  ]);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const t = useTranslate();
  const { selectedPetId, selectPet } = useSelectedPet();
  const insets = useSafeAreaInsets();
  const pets = useQuery({
    queryKey: petKeys.list(),
    queryFn: () => listPets(baseUrl, token ?? ''),
  });
  usePetSelection({ data: pets.data, isRefreshing: pets.isRefetching });
  const plan = useQuery({
    queryKey: nutritionKeys.plan(selectedPetId ?? ''),
    queryFn: () => getNutritionPlan(baseUrl, token ?? '', selectedPetId!),
    enabled: selectedPetId !== null,
  });
  const hhmm = localTimeHhmm();
  const loadedPlan = plan.data?.kind === 'ok' ? plan.data.plan : null;
  const waitingForPetSelection =
    selectedPetId === null &&
    (pets.data === undefined ||
      (pets.data.kind === 'ok' && pets.data.pets.length > 0));
  const showPlanSkeletons =
    waitingForPetSelection ||
    (selectedPetId !== null && plan.data === undefined);
  const servedMeals =
    loadedPlan !== null
      ? loadedPlan.mealTimes.filter((mealTime) => mealTime <= hhmm).length
      : 0;

  return (
    <ScrollView
      testID="screen-food"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <Text className="text-2xl font-black text-foreground">
        {t('food.food')}
      </Text>

      {pets.data === undefined ? (
        <View className="h-10 items-center justify-center">
          <Spinner testID="food-loading" />
        </View>
      ) : null}

      {pets.data && isPetsError(pets.data) ? (
        <View className="items-start gap-3">
          <Text testID="food-error" className="text-danger">
            {t('common.somethingWentWrong')}
          </Text>
          <Button
            testID="food-retry"
            onPress={() => void pets.refetch()}
          >
            {t('common.retry')}
          </Button>
        </View>
      ) : null}

      {pets.data?.kind === 'ok' && pets.data.pets.length === 0 ? (
        <Text testID="food-empty" className="text-muted">
          {t('common.noPetsYet')}
        </Text>
      ) : null}

      {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
        <PetSwitcher
          pets={pets.data.pets}
          selectedPetId={selectedPetId}
          onSelect={selectPet}
        />
      ) : null}

      {showPlanSkeletons ? (
        <View className="gap-4">
          <Skeleton
            testID="food-plan-skeleton"
            className="h-32 w-full rounded-card"
          />
          <Skeleton
            testID="food-meals-skeleton"
            className="h-56 w-full rounded-card"
          />
          {waitingForPetSelection ? (
            <Skeleton
              testID="food-schedule-skeleton"
              className="h-20 w-full rounded-card"
            />
          ) : null}
        </View>
      ) : null}

      {selectedPetId ? (
        <View className="gap-4">
          {loadedPlan !== null ? (
            <>
              <Card
                testID="food-plan-card"
                variant="accent"
                className="gap-4"
              >
                <View className="flex-row items-center justify-between gap-4">
                  <View className="flex-1 gap-1">
                    <Text className="text-xs font-semibold uppercase tracking-widest text-accent-foreground">
                      {t('food.dailyTarget')}
                    </Text>
                    <Text
                      testID="food-plan-kcal"
                      className="text-3xl font-black text-accent-foreground"
                    >
                      {t('food.dailyKcal', { kcal: loadedPlan.merKcal })}
                    </Text>
                    <Text
                      testID="food-plan-grams"
                      className="font-semibold text-accent-foreground"
                    >
                      {t('food.dailyGrams', {
                        grams: loadedPlan.dailyGrams,
                      })}
                    </Text>
                  </View>
                  <View
                    className="size-14 items-center justify-center rounded-xl bg-surface-secondary"
                    style={CONTINUOUS_CORNER}
                  >
                    <ForkKnife size={26} color={accent} />
                  </View>
                </View>
              </Card>

              <Card
                testID="food-meals-section"
                className="gap-3"
              >
                <View className="flex-row items-center justify-between gap-3">
                  <Text
                    testID="food-meals-title"
                    className="text-base font-bold text-foreground"
                  >
                    {t('food.mealsToday')}
                  </Text>
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
                      style={CONTINUOUS_CORNER}
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
                            ? 'rounded-full bg-surface px-2 py-1 text-2xs font-bold text-accent-strong'
                            : 'rounded-full bg-surface px-2 py-1 text-2xs font-bold text-muted'
                        }
                      >
                        {served ? t('food.served') : t('food.pending')}
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
                      testID={`warning-card-${warning.code}`}
                      className="bg-default"
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

              {loadedPlan.aiExplanation !== null ? (
                <Card
                  testID="food-ai-card"
                  variant="secondary"
                  className="gap-3"
                >
                  <View className="flex-row items-center gap-2">
                    <Sparkles size={18} color={accent} />
                    <Text
                      testID="food-ai-title"
                      className="text-base font-bold text-foreground"
                    >
                      {t('food.aiRecommendation')}
                    </Text>
                  </View>
                  <Text className="text-sm font-normal leading-5 text-muted">
                    {loadedPlan.aiExplanation}
                  </Text>
                </Card>
              ) : null}
            </>
          ) : null}

          {plan.data?.kind === 'not-found' ? (
            <Text testID="food-plan-empty" className="font-normal text-muted">
              {t('food.noMealPlanYet')}
            </Text>
          ) : null}

          {plan.data?.kind === 'error' ||
          plan.data?.kind === 'unreachable' ||
          plan.data?.kind === 'missing-config' ? (
            <View className="items-start gap-3">
              <Text testID="food-plan-error" className="text-danger">
                {t('food.couldNotLoadPlan')}
              </Text>
              <Button
                testID="food-plan-retry"
                onPress={() => void plan.refetch()}
              >
                {t('common.retry')}
              </Button>
            </View>
          ) : null}

          <Card
            testID="meal-schedule-link"
            className="flex-row items-center justify-between"
            onPress={() => router.push('/meal-schedule' as Href)}
          >
            <View className="gap-1">
              <Text
                testID="meal-schedule-link-title"
                className="text-base font-bold text-foreground"
              >
                {t('food.mealSchedule')}
              </Text>
              <Text className="text-xs font-normal text-muted">
                {t('food.mealScheduleLinkSubtitle')}
              </Text>
            </View>
            <ChevronRight size={20} color={foreground} />
          </Card>
        </View>
      ) : null}
    </ScrollView>
  );
}
