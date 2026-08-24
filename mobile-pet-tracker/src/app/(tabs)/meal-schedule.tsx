import { Redirect, router } from 'expo-router';
import { Button, Card, Spinner } from 'heroui-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, ForkKnife } from 'reicon-react-native';

import {
  getNutritionPlan,
  getNutritionProfile,
  type NutritionPlanState,
  type NutritionProfileState,
} from '../../api/nutrition';
import { useApi } from '../../hooks/use-api';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { useThemeColors } from '../../theme/use-theme-colors';

function isPlanError(state: NutritionPlanState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function isProfileError(state: NutritionProfileState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function MealScheduleContent({ petId }: { petId: string }) {
  const [foreground, accent, muted, accentForeground] = useThemeColors([
    'foreground',
    'accent',
    'muted',
    'accent-foreground',
  ]);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const planFn = useMemo(
    () => () => getNutritionPlan(baseUrl, token ?? '', petId),
    [baseUrl, petId, token],
  );
  const profileFn = useMemo(
    () => () => getNutritionProfile(baseUrl, token ?? '', petId),
    [baseUrl, petId, token],
  );
  const plan = useApi(planFn);
  const profile = useApi(profileFn);
  const loadedPlan = plan.data?.kind === 'ok' ? plan.data.plan : null;
  const loadedProfile =
    profile.data?.kind === 'ok' ? profile.data.profile : null;
  const loading =
    plan.data === undefined ||
    profile.data === undefined ||
    plan.isRefreshing ||
    profile.isRefreshing;
  const hasError =
    (plan.data !== undefined && isPlanError(plan.data)) ||
    (profile.data !== undefined && isProfileError(profile.data));

  function retryAll() {
    plan.refetch();
    profile.refetch();
  }

  return (
    <ScrollView
      testID="screen-meal-schedule"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to food"
          testID="meal-schedule-back"
          className="rounded-full bg-default p-2"
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={foreground} />
        </Pressable>
        <Text className="text-2xl font-black text-foreground">
          Meal schedule
        </Text>
      </View>

      {loading ? <Spinner testID="meal-schedule-loading" /> : null}

      {hasError ? (
        <View className="items-start gap-3">
          <Text testID="meal-schedule-error" className="text-danger">
            Something went wrong
          </Text>
          <Button testID="meal-schedule-retry" onPress={retryAll}>
            Retry
          </Button>
        </View>
      ) : null}

      {!hasError && loadedPlan !== null ? (
        <>
          <Card
            testID="meal-schedule-summary"
            className="gap-4 rounded-[20px] bg-accent p-5 shadow-sm"
          >
            <View className="flex-row items-center justify-between gap-4">
              <View className="flex-1 gap-1">
                <Text className="text-xs font-semibold uppercase tracking-widest text-accent-foreground opacity-70">
                  Daily target
                </Text>
                <Text className="text-3xl font-black text-accent-foreground">
                  {loadedPlan.merKcal} kcal
                </Text>
                <Text className="font-semibold text-accent-foreground opacity-80">
                  {loadedPlan.dailyGrams} g / day
                </Text>
              </View>
              <View className="items-end gap-1">
                <ForkKnife size={24} color={accentForeground} />
                <Text className="font-bold text-accent-foreground">
                  {loadedPlan.mealsPerDay} meals / day
                </Text>
              </View>
            </View>
          </Card>

          <View className="gap-3">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
              Times and portions
            </Text>
            {loadedPlan.mealTimes.map((mealTime, index) => {
              const portionGrams = Math.round(
                loadedPlan.dailyGrams / loadedPlan.mealsPerDay,
              );

              return (
                <Card
                  key={`${mealTime}-${index}`}
                  testID={`meal-time-row-${index}`}
                  className="flex-row items-center gap-3 rounded-[20px] border border-border bg-surface p-4 shadow-sm"
                >
                  <View className="size-10 items-center justify-center rounded-xl bg-default">
                    <Clock size={18} color={accent} />
                  </View>
                  <Text className="flex-1 font-bold text-foreground">
                    {mealTime}
                  </Text>
                  <Text className="font-semibold text-muted">
                    {portionGrams} g
                  </Text>
                </Card>
              );
            })}
          </View>
        </>
      ) : null}

      {!hasError && plan.data?.kind === 'not-found' ? (
        <Text testID="meal-schedule-empty" className="font-normal text-muted">
          No meal plan yet
        </Text>
      ) : null}

      {!hasError && loadedProfile !== null ? (
        <Card
          testID="nutrition-profile-section"
          className="gap-3 rounded-[20px] border border-border bg-surface p-4 shadow-sm"
        >
          <Text className="font-bold text-foreground">Nutrition profile</Text>
          <View className="flex-row flex-wrap gap-2">
            <Text className="rounded-full bg-default px-3 py-1 text-sm font-semibold text-foreground">
              {loadedProfile.foodType}
            </Text>
            <Text className="rounded-full bg-default px-3 py-1 text-sm font-semibold text-foreground">
              {loadedProfile.kcalPer100g} kcal / 100 g
            </Text>
            <Text className="rounded-full bg-default px-3 py-1 text-sm font-semibold text-foreground">
              {loadedProfile.activityLevel}
            </Text>
          </View>
          {loadedProfile.allergies.length > 0 ? (
            <Text testID="profile-allergies" className="text-sm text-muted">
              {loadedProfile.allergies.join(', ')}
            </Text>
          ) : null}
          {loadedProfile.diseases.length > 0 ? (
            <Text testID="profile-diseases" className="text-sm text-muted">
              {loadedProfile.diseases.join(', ')}
            </Text>
          ) : null}
        </Card>
      ) : null}

      {!hasError && profile.data?.kind === 'not-found' ? (
        <Text testID="nutrition-profile-empty" className="font-normal text-muted">
          No nutrition profile yet
        </Text>
      ) : null}
    </ScrollView>
  );
}

export default function MealScheduleScreen() {
  const { selectedPetId } = useSelectedPet();

  if (selectedPetId === null) {
    return <Redirect href="/food" />;
  }

  return <MealScheduleContent petId={selectedPetId} />;
}
