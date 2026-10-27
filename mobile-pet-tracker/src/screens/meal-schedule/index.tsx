import { Host } from '@expo/ui';
import ExpoDateTimePicker from '@expo/ui/community/datetime-picker';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Redirect, router } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, Sparkles } from 'reicon-react-native';

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
import { ScreenHeader } from '../../components/screen-header';
import { Card } from '../../components/card';
import type { TranslationKey } from '../../i18n/catalog';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { useChunkyLip } from '../../theme/chunky-lip';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { useThemeColors } from '../../theme/use-theme-colors';
import { CATEGORY_SLOTS } from '../../utils/category-palette';
import { RiseIn } from '../../components/rise-in';
import { mealPortionGrams } from '../../utils/meal-portion';

type ProfileLabels = Partial<Record<string, { labelKey: TranslationKey }>>;

const ACTIVITY_LABEL: ProfileLabels = {
  low: { labelKey: 'nutritionQuestionnaire.activityLow' },
  medium: { labelKey: 'nutritionQuestionnaire.activityMedium' },
  high: { labelKey: 'nutritionQuestionnaire.activityHigh' },
};

const FOOD_LABEL: ProfileLabels = {
  dry: { labelKey: 'nutritionQuestionnaire.foodDry' },
  wet: { labelKey: 'nutritionQuestionnaire.foodWet' },
  mixed: { labelKey: 'nutritionQuestionnaire.foodMixed' },
  homemade: { labelKey: 'nutritionQuestionnaire.foodHomemade' },
};

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
  const chunkyLip = useChunkyLip();
  const [amberStrong, violetStrong] = useThemeColors(['category-amber-strong', 'category-violet-strong']);
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
  const canGenerate =
    isOwner && (loadedPlan !== null || plan.data?.kind === 'not-found');

  function retryAll() {
    plan.refetch();
    profile.refetch();
  }

  function profileLabel(labels: ProfileLabels, value: string) {
    const label = labels[value];
    return label ? t(label.labelKey) : value;
  }

  function openNutritionProfile() {
    router.push({ pathname: '/nutrition-profile', params: { petId } });
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
          router.push({ pathname: '/nutrition-plan', params: result.aiStatus === undefined ? { petId } : { petId, aiStatus: result.aiStatus } });
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
        paddingTop: insets.top + 8,
        gap: 14,
        paddingBottom: insets.bottom + 32,
      }}
    >
      <ScreenHeader testID="meal-schedule-header" size={24} backFallback="/food" title={t('mealSchedule.mealSchedule')} />
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
          <RiseIn testID="meal-schedule-summary-entry" delayMs={0}>
            <View
              testID="meal-schedule-summary"
              className="gap-2 rounded-24 bg-accent p-4"
              style={[CONTINUOUS_CORNER, chunkyLip.summary]}
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
          </RiseIn>

          <View testID="meal-times-section" className="gap-3.5">
            <Text className="mt-1 text-17 font-extrabold text-foreground">
              {t('mealSchedule.timesAndPortions')}
            </Text>
            {loadedPlan.mealTimes.map((mealTime, index) => {
              const portionGrams = mealPortionGrams(loadedPlan, mealTime);

              return (
                <RiseIn key={mealTime} testID={`meal-time-entry-${index}`} delayMs={80 + 60 * index}>
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
                        className="h-9 rounded-10 border-2 border-lip-gray bg-surface px-3.5"
                        style={chunkyLip.neutralCompact}
                        onPress={() => setPicker({ from: mealTime })}
                      >
                        <Text className="text-13 font-extrabold text-foreground">
                          {t('mealSchedule.editTime')}
                        </Text>
                      </Button>
                    ) : null}
                  </Card>
                </RiseIn>
              );
            })}
            {isOwner && editError !== null ? (
              <Text testID="meal-time-error" selectable className="text-danger">
                {editError}
              </Text>
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
          <View testID="meal-schedule-actions" className="flex-row gap-2.5">
            {isOwner && loadedPlan !== null ? (
              <Button
                testID="add-meal-time-button"
                isDisabled={editing}
                variant="secondary"
                className="h-12.5 flex-1 rounded-14 border-2 border-lip-gray bg-surface"
                style={chunkyLip.neutral}
                onPress={() => setPicker({ from: null })}
              >
                <Text className="text-15 font-extrabold text-foreground">
                  {t('mealSchedule.addMeal')}
                </Text>
              </Button>
            ) : null}
            <Button
              testID="generate-plan-button"
              style={chunkyLip.violet}
              variant="tertiary"
              className={`h-12.5 flex-1 gap-1.5 rounded-14 ${CATEGORY_SLOTS.violet.surface}`}
              isDisabled={submitting}
              onPress={() => void handleGenerate()}
            >
              <Sparkles size={16} color={violetStrong} />
              <Text className={`text-15 font-extrabold ${CATEGORY_SLOTS.violet.ink}`}>
                {t('mealSchedule.generatePlan')}
              </Text>
            </Button>
          </View>
        </View>
      ) : null}

        {!hasError && profile.data === undefined ? (
          <Skeleton
            testID="meal-schedule-profile-skeleton"
            className="h-32 w-full rounded-card"
          />
        ) : null}

        {!hasError && loadedProfile !== null ? (
          <View testID="nutrition-profile-section" className="gap-2.5">
            <View className="flex-row items-center justify-between">
              <Text
                testID="nutrition-profile-title"
                className="mt-1 text-17 font-extrabold text-foreground"
              >
                {t('mealSchedule.nutritionProfile')}
              </Text>
              {isOwner ? (
                <Pressable testID="nutrition-profile-edit" accessibilityLabel={t('nutritionQuestionnaire.editProfileLabel')} hitSlop={TOUCH_SLOP} className="h-9 flex-row items-center justify-center rounded-xl border-2 border-lip-gray bg-surface px-3" style={chunkyLip.neutralCompact} onPress={openNutritionProfile}>
                  <Text className="text-13 font-extrabold text-foreground">{t('profile.editProfile')}</Text>
                </Pressable>
              ) : null}
            </View>
            <View testID="nutrition-profile-pills" className="flex-row flex-wrap gap-1.5">
              <Text testID="nutrition-profile-activity" className="rounded-full bg-default px-2.5 py-1.5 text-xs font-bold text-foreground">
                <Text className="text-muted">{`${t('mealSchedule.activity')} `}</Text>
                {profileLabel(ACTIVITY_LABEL, loadedProfile.activityLevel)}
              </Text>
              {loadedProfile.bodyCondition !== null ? (
                <Text testID="nutrition-profile-condition" className="rounded-full bg-default px-2.5 py-1.5 text-xs font-bold text-foreground">
                  <Text className="text-muted">{`${t('mealSchedule.condition')} `}</Text>
                  {`${loadedProfile.bodyCondition}/9`}
                </Text>
              ) : null}
              <Text testID="nutrition-profile-food" className="rounded-full bg-default px-2.5 py-1.5 text-xs font-bold text-foreground">
                <Text className="text-muted">{`${t('mealSchedule.food')} `}</Text>
                {`${profileLabel(FOOD_LABEL, loadedProfile.foodType)} ${loadedProfile.kcalPer100g} kcal/100 g`}
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
          </View>
        ) : null}

        {!hasError && profile.data?.kind === 'not-found' ? (
          <Text testID="nutrition-profile-empty" className="font-normal text-muted">
            {t('mealSchedule.noNutritionProfileYet')}
          </Text>
        ) : null}

        {!hasError && profile.data?.kind === 'not-found' && isOwner ? (
          <Pressable testID="nutrition-profile-create" hitSlop={TOUCH_SLOP} className="h-9 flex-row items-center justify-center rounded-xl border-2 border-lip-gray bg-surface px-3" style={chunkyLip.neutralCompact} onPress={openNutritionProfile}>
            <Text className="text-13 font-extrabold text-foreground">{t('nutritionQuestionnaire.createProfile')}</Text>
          </Pressable>
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
