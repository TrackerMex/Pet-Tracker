import { useQuery } from '@tanstack/react-query';
import { Redirect, router } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, ForkKnife } from 'reicon-react-native';

import {
  generateNutritionPlan,
  getNutritionPlan,
  getNutritionProfile,
  type NutritionPlanState,
  type NutritionProfileState,
} from '../../api/nutrition';
import { nutritionKeys } from '../../api/query-keys';
import { Card } from '../../components/card';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { TOUCH_SLOP } from '../../theme/touch-target';

function isPlanError(state: NutritionPlanState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function isProfileError(state: NutritionProfileState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function MealScheduleContent({ petId }: { petId: string }) {
  const [foreground, accent, accentForeground] = useThemeColors([
    'foreground',
    'accent-strong',
    'accent-foreground',
  ]);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const [submitting, setSubmitting] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const plan = useQuery({
    queryKey: nutritionKeys.plan(petId),
    queryFn: () => getNutritionPlan(baseUrl, token ?? '', petId),
  });
  const profile = useQuery({
    queryKey: nutritionKeys.profile(petId),
    queryFn: () => getNutritionProfile(baseUrl, token ?? '', petId),
  });
  const loadedPlan = plan.data?.kind === 'ok' ? plan.data.plan : null;
  const loadedProfile =
    profile.data?.kind === 'ok' ? profile.data.profile : null;
  const hasError =
    (plan.data !== undefined && isPlanError(plan.data)) ||
    (profile.data !== undefined && isProfileError(profile.data));
  const loading =
    !hasError && (plan.data === undefined || profile.data === undefined);
  const canGenerate = loadedPlan !== null || plan.data?.kind === 'not-found';

  function retryAll() {
    plan.refetch();
    profile.refetch();
  }

  async function handleGenerate() {
    setSubmitting(true);
    setGenerateError(null);

    try {
      const result = await generateNutritionPlan(
        baseUrl,
        token ?? '',
        petId,
      );

      switch (result.kind) {
        case 'ok':
          plan.refetch();
          return;
        case 'forbidden':
          setGenerateError(t('mealSchedule.errorForbidden'));
          return;
        case 'unprocessable':
          if (result.code === 'NUTRITION_PROFILE_REQUIRED') {
            setGenerateError(t('mealSchedule.errorProfileRequired'));
          } else if (result.code === 'PET_WEIGHT_REQUIRED') {
            setGenerateError(t('mealSchedule.registerWeightFirst'));
          } else {
            setGenerateError(t('common.somethingWentWrong'));
          }
          return;
        case 'unreachable':
          setGenerateError(t('common.cannotReachServer'));
          return;
        case 'unauthorized':
          await signOut();
          return;
        case 'error':
        case 'missing-config':
          setGenerateError(t('common.somethingWentWrong'));
      }
    } catch {
      setGenerateError(t('common.somethingWentWrong'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView
      testID="screen-meal-schedule"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('mealSchedule.backToFood')}
          testID="meal-schedule-back"
          hitSlop={TOUCH_SLOP}
          className="rounded-full bg-default p-2"
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={foreground} />
        </Pressable>
        <Text className="text-2xl font-black text-foreground">
          {t('mealSchedule.mealSchedule')}
        </Text>
      </View>

      <View testID={loading ? 'meal-schedule-loading' : undefined} className="gap-4">
        {!hasError && plan.data === undefined ? (
          <>
            <Skeleton
              testID="meal-schedule-summary-skeleton"
              className="h-32 w-full rounded-card"
            />
            <Skeleton
              testID="meal-schedule-meals-skeleton"
              className="h-56 w-full rounded-card"
            />
            <Skeleton
              testID="meal-schedule-action-skeleton"
              className="h-12 w-full rounded-xl"
            />
          </>
        ) : null}

        {hasError ? (
          <View className="items-start gap-3">
            <Text testID="meal-schedule-error" className="text-danger">
              {t('common.somethingWentWrong')}
            </Text>
            <Button testID="meal-schedule-retry" onPress={retryAll}>
              {t('common.retry')}
            </Button>
          </View>
        ) : null}

      {!hasError && loadedPlan !== null ? (
        <>
          <Card
            testID="meal-schedule-summary"
            variant="accent"
            className="gap-4"
          >
            <View className="flex-row items-center justify-between gap-4">
              <View className="flex-1 gap-1">
                <Text className="text-xs font-semibold uppercase tracking-widest text-accent-foreground">
                  {t('mealSchedule.dailyTarget')}
                </Text>
                <Text className="text-3xl font-black text-accent-foreground">
                  {loadedPlan.merKcal} kcal
                </Text>
                <Text className="font-semibold text-accent-foreground">
                  {t('mealSchedule.dailyGrams', {
                    grams: loadedPlan.dailyGrams,
                  })}
                </Text>
              </View>
              <View className="items-end gap-1">
                <ForkKnife size={24} color={accentForeground} />
                <Text className="font-bold text-accent-foreground">
                  {t('mealSchedule.mealsPerDay', {
                    meals: loadedPlan.mealsPerDay,
                  })}
                </Text>
              </View>
            </View>
          </Card>

          <View className="gap-3">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
              {t('mealSchedule.timesAndPortions')}
            </Text>
            {loadedPlan.mealTimes.map((mealTime, index) => {
              const portionGrams = Math.round(
                loadedPlan.dailyGrams / loadedPlan.mealsPerDay,
              );

              return (
                <Card
                  key={`${mealTime}-${index}`}
                  testID={`meal-time-row-${index}`}
                  className="flex-row items-center gap-3"
                >
                  <View
                    className="size-10 items-center justify-center rounded-xl bg-default"
                    style={CONTINUOUS_CORNER}
                  >
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
          {t('mealSchedule.noMealPlanYet')}
        </Text>
      ) : null}

      {!hasError && canGenerate ? (
        <View className="gap-2">
          {generateError ? (
            <Text testID="generate-plan-error" className="text-danger">
              {generateError}
            </Text>
          ) : null}
          <Button
            testID="generate-plan-button"
            className="rounded-xl bg-accent"
            isDisabled={submitting}
            onPress={() => void handleGenerate()}
          >
            <Button.Label className="font-bold text-accent-foreground">
              {t('mealSchedule.generatePlan')}
            </Button.Label>
          </Button>
        </View>
      ) : null}

        {!hasError && profile.data === undefined ? (
          <Skeleton
            testID="meal-schedule-profile-skeleton"
            className="h-32 w-full rounded-card"
          />
        ) : null}

        {!hasError && loadedProfile !== null ? (
          <Card
            testID="nutrition-profile-section"
            className="gap-3"
          >
            <Text
              testID="nutrition-profile-title"
              className="text-base font-bold text-foreground"
            >
              {t('mealSchedule.nutritionProfile')}
            </Text>
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
            {t('mealSchedule.noNutritionProfileYet')}
          </Text>
        ) : null}
      </View>
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
