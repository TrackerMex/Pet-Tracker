import { Host } from '@expo/ui';
import ExpoDateTimePicker from '@expo/ui/community/datetime-picker';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, ForkKnife } from 'reicon-react-native';

import {
  addMealTime,
  moveMealTime,
  generateNutritionPlan,
  getNutritionPlan,
  getNutritionProfile,
  type EditMealTimeState,
  type NutritionPlanState,
  type NutritionProfileState,
} from '../../api/nutrition';
import { getPet } from '../../api/pets';
import { nutritionKeys, petKeys } from '../../api/query-keys';
import { Card } from '../../components/card';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';

function isPlanError(state: NutritionPlanState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function isProfileError(state: NutritionProfileState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function pickerValue(mealTime: string): Date {
  const [hours, minutes] = mealTime.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function toMealTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function MealScheduleContent({ petId }: { petId: string }) {
  const [accent, accentForeground] = useThemeColors([
    'accent-strong',
    'accent-foreground',
  ]);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [picker, setPicker] = useState<{ from: string | null } | null>(null);
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
  const pet = useQuery({
    queryKey: petKeys.detail(petId),
    queryFn: () => getPet(baseUrl, token ?? '', petId),
  });
  const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';
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

  async function runMealTimeEdit(request: () => Promise<EditMealTimeState>) {
    setEditing(true);
    try {
      const result = await request();
      if (result.kind === 'ok') {
        await plan.refetch();
        await queryClient.refetchQueries({ queryKey: petKeys.detail(petId) });
      }
    } finally {
      setEditing(false);
    }
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
        paddingBottom: insets.bottom + 24,
      }}
    >
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

          <View testID="meal-times-section" className="gap-3">
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
                  {isOwner ? (
                    <Button
                      testID={`meal-time-edit-${index}`}
                      accessibilityLabel={t('mealSchedule.editTimeLabel', { time: mealTime })}
                      variant="secondary"
                      size="sm"
                      isDisabled={editing}
                      className="min-h-11 rounded-xl bg-accent-soft"
                      onPress={() => setPicker({ from: mealTime })}
                    >
                      <Button.Label className="font-semibold text-accent-strong">
                        {t('mealSchedule.editTime')}
                      </Button.Label>
                    </Button>
                  ) : null}
                </Card>
              );
            })}
            {isOwner ? (
              <Button
                testID="add-meal-time-button"
                isDisabled={editing}
                variant="secondary"
                className="rounded-xl bg-accent-soft"
                onPress={() => setPicker({ from: null })}
              >
                <Button.Label className="font-bold text-accent-strong">
                  {t('mealSchedule.addMeal')}
                </Button.Label>
              </Button>
            ) : null}
          </View>
          {picker !== null ? (
            <Host matchContents>
              <ExpoDateTimePicker
                testID="meal-time-picker"
                mode="time"
                presentation="dialog"
                value={pickerValue(picker.from ?? '12:00')}
                onValueChange={(_event, selected) => {
                  const { from } = picker;
                  setPicker(null);
                  const mealTime = toMealTime(selected);
                  if (from === null) {
                    void runMealTimeEdit(() => addMealTime(baseUrl, token ?? '', petId, mealTime));
                  } else if (mealTime !== from) {
                    void runMealTimeEdit(() => moveMealTime(baseUrl, token ?? '', petId, from, mealTime));
                  }
                }}
                onDismiss={() => setPicker(null)}
              />
            </Host>
          ) : null}
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

export function MealScheduleScreen() {
  const { selectedPetId } = useSelectedPet();

  if (selectedPetId === null) {
    return <Redirect href="/food" />;
  }

  return <MealScheduleContent petId={selectedPetId} />;
}
