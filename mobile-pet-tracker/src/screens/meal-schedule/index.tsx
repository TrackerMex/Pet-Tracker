import { Host } from '@expo/ui';
import ExpoDateTimePicker from '@expo/ui/community/datetime-picker';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock } from 'reicon-react-native';

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
import { TOUCH_SLOP } from '../../theme/touch-target';
import { useThemeColors } from '../../theme/use-theme-colors';
import { CATEGORY_SLOTS } from '../../utils/category-palette';
import { HomeEntrance } from '../home/home-entrance';

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
  const [amberStrong] = useThemeColors(['category-amber-strong', 'category-violet-strong']);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [editError, setEditError] = useState<string | null>(null);
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
    setEditError(null);
    try {
      const result = await request();
      switch (result.kind) {
        case 'ok':
          await plan.refetch();
          await queryClient.refetchQueries({ queryKey: petKeys.detail(petId) });
          return;
        case 'invalid':
          setEditError(t('mealSchedule.errorInvalidTime'));
          return;
        case 'forbidden':
          setEditError(t('mealSchedule.errorEditForbidden'));
          return;
        case 'unprocessable':
          switch (result.code) {
            case 'NUTRITION_PLAN_REQUIRED':
              setEditError(t('mealSchedule.errorPlanRequired'));
              break;
            case 'MEAL_TIME_NOT_IN_PLAN':
              setEditError(t('mealSchedule.errorTimeNotInPlan'));
              break;
            case 'MEAL_TIME_DUPLICATE':
              setEditError(t('mealSchedule.errorDuplicateTime'));
              break;
            case 'MEAL_TIMES_LIMIT_REACHED':
              setEditError(t('mealSchedule.errorMealLimit'));
              break;
          }
          return;
        case 'unauthorized':
          await signOut();
          return;
        case 'unreachable':
          setEditError(t('common.cannotReachServer'));
          return;
        case 'error':
        case 'missing-config':
          setEditError(t('common.somethingWentWrong'));
      }
    } catch {
      setEditError(t('common.somethingWentWrong'));
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
        paddingHorizontal: 20,
        paddingTop: 24,
        gap: 14,
        paddingBottom: insets.bottom + 24,
      }}
    >
      <Text
        testID="meal-schedule-heading"
        accessibilityRole="header"
        className="text-2xl font-black tracking-title text-foreground"
      >
        {t('mealSchedule.mealSchedule')}
      </Text>
      <View testID={loading ? 'meal-schedule-loading' : undefined} className="gap-3.5">
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
          <HomeEntrance testID="meal-schedule-summary-entry" index={0}>
            <View
              testID="meal-schedule-summary"
              className="gap-2 rounded-24 bg-accent border-b-5 border-black/25 p-4"
              style={CONTINUOUS_CORNER}
            >
              <Text className="text-xs font-extrabold uppercase tracking-caps text-accent-foreground">
                {t('mealSchedule.dailyTarget')}
              </Text>
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Text className="text-22 font-black text-accent-foreground">
                    {loadedPlan.merKcal}
                  </Text>
                  <Text className="text-xs font-normal text-accent-foreground">
                    kcal
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-22 font-black text-accent-foreground">
                    {`${loadedPlan.dailyGrams} g`}
                  </Text>
                  <Text className="text-xs font-normal text-accent-foreground">
                    {t('mealSchedule.perDay')}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-22 font-black text-accent-foreground">
                    {loadedPlan.mealsPerDay}
                  </Text>
                  <Text className="text-xs font-normal text-accent-foreground">
                    {t('mealSchedule.mealsPerDayUnit')}
                  </Text>
                </View>
              </View>
            </View>
          </HomeEntrance>

          <View testID="meal-times-section" className="gap-3.5">
            <Text className="mt-1 text-17 font-extrabold text-foreground">
              {t('mealSchedule.timesAndPortions')}
            </Text>
            {loadedPlan.mealTimes.map((mealTime, index) => {
              const portionGrams = Math.round(
                loadedPlan.dailyGrams / loadedPlan.mealsPerDay,
              );

              return (
                <HomeEntrance key={mealTime} testID={`meal-time-entry-${index}`} index={index + 1}>
                  <Card
                    testID={`meal-time-row-${index}`}
                    variant="flat"
                    className="flex-row items-center gap-3 py-3"
                  >
                    <View
                      className={`size-10.5 items-center justify-center rounded-14 ${CATEGORY_SLOTS.amber.surface}`}
                      style={CONTINUOUS_CORNER}
                    >
                      <Clock size={20} color={amberStrong} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-black text-foreground">
                        {mealTime}
                      </Text>
                      <Text className="text-13 font-semibold text-muted">
                        {portionGrams} g
                      </Text>
                    </View>
                    {isOwner ? (
                      <Button
                        testID={`meal-time-edit-${index}`}
                        accessibilityLabel={t('mealSchedule.editTimeLabel', { time: mealTime })}
                        variant="secondary"
                        size="sm"
                        isDisabled={editing}
                        hitSlop={TOUCH_SLOP}
                        className="h-9.75 rounded-10 border-2 border-b-5 border-lip-gray bg-surface px-3.5"
                        onPress={() => setPicker({ from: mealTime })}
                      >
                        <Text className="text-13 font-extrabold text-foreground">
                          {t('mealSchedule.editTime')}
                        </Text>
                      </Button>
                    ) : null}
                  </Card>
                </HomeEntrance>
              );
            })}
            {isOwner && editError !== null ? (
              <Text testID="meal-time-error" selectable className="text-danger">
                {editError}
              </Text>
            ) : null}
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
            className="rounded-xl bg-accent border-b-4 border-black/25"
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
