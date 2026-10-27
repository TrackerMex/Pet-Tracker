import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { Button, Skeleton, Spinner } from 'heroui-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedProps, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Check, ChevronRight, Clock, Sparkles } from 'reicon-react-native';
import Svg, { Circle } from 'react-native-svg';

import {
  getNutritionPlan,
  getNutritionProfile,
  serveMeal,
  unserveMeal,
} from '../../api/nutrition';
import { listPets, type PetsState } from '../../api/pets';
import { nutritionKeys, petKeys } from '../../api/query-keys';
import { RiseIn } from '../../components/rise-in';
import { EmptyState } from '../../components/empty-state';
import { PetSwitcher } from '../../components/pet-switcher';
import { PingoFloat } from '../../components/pingo-float';
import { usePetSelection } from '../../hooks/use-pet-selection';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { useChunkyLip } from '../../theme/chunky-lip';
import { MOTION_RING_DELAY_MS, MOTION_RING_TIMING } from '../../theme/motion';
import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { CATEGORY_SLOTS } from '../../utils/category-palette';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const KCAL_RING_CIRCUMFERENCE = 2 * Math.PI * 44;

function isPetsError(state: PetsState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

export function FoodScreen() {
  const chunkyLip = useChunkyLip();
  const [muted, foreground, accentForeground, greenStrong, violetStrong] = useThemeColors([
    'muted',
    'foreground',
    'accent-foreground',
    'category-green-strong',
    'category-violet-strong',
  ]);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const t = useTranslate();
  const { selectedPetId, selectPet } = useSelectedPet();
  const queryClient = useQueryClient();
  const [pendingMealTime, setPendingMealTime] = useState<string | null>(null);
  const [mealError, setMealError] = useState<string | null>(null);
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
  const loadedPlan = plan.data?.kind === 'ok' ? plan.data.plan : null;
  const planNotFound = plan.data?.kind === 'not-found';
  const profile = useQuery({
    queryKey: nutritionKeys.profile(selectedPetId ?? ''),
    queryFn: () => getNutritionProfile(baseUrl, token ?? '', selectedPetId!),
    enabled: planNotFound,
  });
  const activePet = pets.data?.kind === 'ok' ? pets.data.pets.find((pet) => pet.id === selectedPetId) : undefined;
  const profilePending = planNotFound && profile.data === undefined;
  const showProfileEmpty = planNotFound && profile.data?.kind === 'not-found' && activePet?.myRole === 'owner';
  const waitingForPetSelection =
    selectedPetId === null &&
    (pets.data === undefined ||
      (pets.data.kind === 'ok' && pets.data.pets.length > 0));
  const showPlanSkeletons =
    waitingForPetSelection ||
    (selectedPetId !== null && plan.data === undefined) ||
    profilePending;
  const servedMeals = loadedPlan?.servedToday.length ?? 0;
  const kcalPct =
    loadedPlan !== null && loadedPlan.merKcal > 0
      ? Math.round((loadedPlan.kcalConsumedToday / loadedPlan.merKcal) * 100)
      : 0;
  const kcalRingPct = useSharedValue(0);
  const kcalRingProps = useAnimatedProps(() => ({
    strokeDashoffset: KCAL_RING_CIRCUMFERENCE * (1 - kcalRingPct.get() / 100),
  }));
  useEffect(() => {
    kcalRingPct.set(withDelay(MOTION_RING_DELAY_MS, withTiming(Math.min(kcalPct, 100), MOTION_RING_TIMING)));
  }, [kcalPct, kcalRingPct]);

  async function toggleMeal(mealTime: string, served: boolean) {
    if (pendingMealTime !== null || selectedPetId === null) {
      return;
    }

    setPendingMealTime(mealTime);
    setMealError(null);
    try {
      const result = await (served ? unserveMeal : serveMeal)(
        baseUrl,
        token ?? '',
        selectedPetId,
        mealTime,
      );
      const failed = !['ok', 'already-served', 'not-served'].includes(
        result.kind,
      );
      if (failed) {
        setMealError(t('food.couldNotUpdateMeal'));
      }
      await plan.refetch();
      await queryClient.refetchQueries({
        queryKey: petKeys.detail(selectedPetId),
      });
      void Haptics.notificationAsync(
        failed
          ? Haptics.NotificationFeedbackType.Error
          : Haptics.NotificationFeedbackType.Success,
      );
    } finally {
      setPendingMealTime(null);
    }
  }

  function openNutritionProfile() {
    router.push({ pathname: '/nutrition-profile', params: { petId: selectedPetId! } });
  }

  const links = (
    <View testID="food-links" className="gap-2">
      <Pressable
        testID="meal-schedule-link"
        className="flex-row items-center gap-3 rounded-16 bg-default px-3.5 py-3"
        style={CONTINUOUS_CORNER}
        accessibilityRole="button"
        onPress={() => router.push('/meal-schedule' as Href)}
      >
        <View className="flex-1 gap-0.5">
          <Text testID="meal-schedule-link-title" className="text-15 font-extrabold text-foreground">
            {t('food.mealSchedule')}
          </Text>
          <Text className="text-xs text-muted">{t('food.mealScheduleLinkSubtitle')}</Text>
        </View>
        <ChevronRight size={18} strokeWidth={2.4} color={foreground} />
      </Pressable>
      <Pressable
        testID="meals-history-link"
        className="flex-row items-center gap-3 rounded-16 bg-default px-3.5 py-3"
        style={CONTINUOUS_CORNER}
        accessibilityRole="button"
        onPress={() => router.push('/meals-history' as Href)}
      >
        <View className="flex-1 gap-0.5">
          <Text testID="meals-history-link-title" className="text-15 font-extrabold text-foreground">
            {t('food.mealsHistory')}
          </Text>
          <Text className="text-xs text-muted">{t('food.mealsHistoryLinkSubtitle')}</Text>
        </View>
        <ChevronRight size={18} strokeWidth={2.4} color={foreground} />
      </Pressable>
    </View>
  );

  return (
    <ScrollView
      testID="screen-food"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingHorizontal: 20,
        gap: 14,
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <View testID="food-title-row" className="flex-row items-center justify-between">
        <Text testID="food-title" className="text-3xl font-black tracking-title text-foreground">
          {t('food.food')}
        </Text>
        {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
          <PetSwitcher
            variant="avatars"
            pets={pets.data.pets}
            selectedPetId={selectedPetId}
            onSelect={selectPet}
          />
        ) : null}
      </View>

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
        <EmptyState
          testID="food-empty"
          pose="talk"
          title={t('common.noPetsYet')}
          body={t('common.noPetsBody')}
          action={{
            label: t('profile.addPet'),
            onPress: () => router.push('/pets/add'),
          }}
        />
      ) : null}

      {showPlanSkeletons ? (
        <View className="gap-4">
          <Skeleton
            testID="food-plan-skeleton"
            className="h-40 w-full rounded-card"
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
        <View className="gap-3.5">
          {loadedPlan !== null ? (
            <>
              <RiseIn delayMs={0}>
                <View
                  testID="food-plan-card"
                  className="rounded-hero bg-accent p-4.5"
                  style={[CONTINUOUS_CORNER, chunkyLip.hero]}
                >
                  <View testID="food-plan-summary" className="flex-row items-center gap-4">
                    <View
                      testID="food-plan-progress"
                      className="size-26 items-center justify-center"
                      accessible
                      accessibilityRole="progressbar"
                      accessibilityLabel={t('food.kcalConsumedOfTarget', {
                        consumed: loadedPlan.kcalConsumedToday,
                        target: loadedPlan.merKcal,
                      })}
                      accessibilityValue={{ min: 0, max: 100, now: kcalPct }}
                    >
                      <View testID="food-plan-ring" className="absolute inset-0">
                        <Svg width={104} height={104} viewBox="0 0 104 104">
                          <Circle
                            testID="food-plan-ring-track"
                            cx={52} cy={52} r={44} fill="none"
                            stroke={accentForeground} strokeOpacity={0.22} strokeWidth={12}
                          />
                          <AnimatedCircle
                            testID="food-plan-ring-fill"
                            cx={52} cy={52} r={44} fill="none"
                            stroke={accentForeground} strokeWidth={12} strokeLinecap="round"
                            strokeDasharray={KCAL_RING_CIRCUMFERENCE} transform="rotate(-90 52 52)"
                            animatedProps={kcalRingProps}
                          />
                        </Svg>
                      </View>
                      <Text
                        testID="food-plan-percent"
                        className="text-24 font-black text-accent-foreground"
                        style={TABULAR_NUMS}
                      >
                        {kcalPct}%
                      </Text>
                      <Text
                        testID="food-plan-consumed"
                        className="text-11 font-bold text-accent-foreground"
                        style={TABULAR_NUMS}
                      >
                        {loadedPlan.kcalConsumedToday} kcal
                      </Text>
                    </View>
                    <View className="flex-1 gap-1">
                      <Text className="text-xs font-extrabold uppercase tracking-caps text-accent-foreground">
                        {t('food.dailyTarget')}
                      </Text>
                      <Text
                        testID="food-plan-kcal"
                        className="text-24 font-black text-accent-foreground"
                      >
                        {t('food.dailyKcal', { kcal: loadedPlan.merKcal })}
                      </Text>
                      <Text
                        testID="food-plan-grams"
                        className="text-sm font-semibold text-accent-foreground"
                      >
                        {t('food.dailyGrams', { grams: loadedPlan.dailyGrams })}
                      </Text>
                    </View>
                  </View>
                </View>
              </RiseIn>

              <RiseIn delayMs={80}>
                <View
                  testID="food-meals-section"
                  className="gap-2 rounded-24 border border-border bg-surface p-3.5"
                  style={CONTINUOUS_CORNER}
                >
                  <View className="flex-row items-center justify-between gap-3">
                    <Text
                      testID="food-meals-title"
                      className="text-17 font-extrabold text-foreground"
                    >
                      {t('food.mealsToday')}
                    </Text>
                    <Text
                      testID="food-meals-progress"
                      className="text-15 font-black text-accent-strong"
                      style={TABULAR_NUMS}
                    >
                      {servedMeals}/{loadedPlan.mealsPerDay}
                    </Text>
                  </View>

                  {loadedPlan.mealTimes.map((mealTime, index) => {
                    const served = loadedPlan.servedToday.includes(mealTime);
                    const portionGrams = Math.round(
                      loadedPlan.dailyGrams / loadedPlan.mealsPerDay,
                    );

                    return (
                      <View
                        key={`${mealTime}-${index}`}
                        testID={`meal-row-${index}`}
                        className={index === 0
                          ? 'flex-row items-center gap-3 py-2'
                          : 'flex-row items-center gap-3 border-t border-border py-2'}
                      >
                        <View
                          testID={`meal-tile-${index}`}
                          style={CONTINUOUS_CORNER}
                          className={served
                            ? `size-9 items-center justify-center rounded-xl ${CATEGORY_SLOTS.green.surface}`
                            : 'size-9 items-center justify-center rounded-xl bg-default'}
                        >
                          {served
                            ? <Check size={18} strokeWidth={2.6} color={greenStrong} />
                            : <Clock size={18} strokeWidth={2.4} color={muted} />}
                        </View>
                        <View className="flex-1">
                          <Text className="text-15 font-extrabold text-foreground" style={TABULAR_NUMS}>
                            {mealTime} <Text testID={`meal-portion-${index}`} className="font-semibold text-muted">· {portionGrams} g</Text>
                          </Text>
                        </View>
                        <Pressable
                          testID={`meal-toggle-${index}`}
                          accessibilityRole="button"
                          accessibilityLabel={
                            served
                              ? t('food.undoServed', { time: mealTime })
                              : t('food.markServed', { time: mealTime })
                          }
                          disabled={pendingMealTime === mealTime}
                          className="min-h-11 justify-center"
                          style={({ pressed }) => ({
                            opacity: pressed ? 0.8 : 1,
                          })}
                          onPress={() => void toggleMeal(mealTime, served)}
                        >
                          {served ? (
                            <View testID={`meal-served-${index}`} className={`rounded-full px-2.5 py-1 ${CATEGORY_SLOTS.green.surface}`}>
                              <Text className={`text-xs font-extrabold ${CATEGORY_SLOTS.green.ink}`}>{t('food.served')}</Text>
                            </View>
                          ) : (
                            <View testID={`meal-pending-${index}`} className="h-8 justify-center rounded-full bg-accent px-3" style={chunkyLip.primaryCompact}>
                              <Text className="text-xs font-extrabold text-accent-foreground">{t('food.markServedAction')}</Text>
                            </View>
                          )}
                        </Pressable>
                      </View>
                    );
                  })}

                  {mealError !== null ? (
                    <Text
                      testID="food-meal-error"
                      selectable
                      className="text-danger"
                    >
                      {mealError}
                    </Text>
                  ) : null}
                </View>
              </RiseIn>

              {loadedPlan.warnings.length > 0 ? (
                <View testID="food-warnings" className="gap-2">
                  {loadedPlan.warnings.map((warning, index) => (
                    <RiseIn key={warning.code} delayMs={110 + 30 * index}>
                      <View
                        testID={`warning-card-${warning.code}`}
                        className="rounded-card bg-default p-3.5"
                        style={CONTINUOUS_CORNER}
                      >
                        <Text
                          testID={`plan-warning-${warning.code}`}
                          className="text-sm font-medium leading-note text-foreground"
                        >
                          {warning.message}
                        </Text>
                      </View>
                    </RiseIn>
                  ))}
                </View>
              ) : null}

              {loadedPlan.aiExplanation !== null ? (
                <RiseIn delayMs={140}>
                  <View
                    testID="food-ai-card"
                    className={`flex-row gap-3 rounded-card ${CATEGORY_SLOTS.violet.surface} p-3.5`}
                    style={CONTINUOUS_CORNER}
                  >
                    <Sparkles size={22} strokeWidth={2.2} color={violetStrong} />
                    <View className="flex-1 gap-0.5">
                      <Text testID="food-ai-title" className={`text-sm font-extrabold ${CATEGORY_SLOTS.violet.ink}`}>
                        {t('food.aiRecommendation')}
                      </Text>
                      <Text testID="food-ai-body" className="text-13 leading-body text-foreground">
                        {loadedPlan.aiExplanation}
                      </Text>
                    </View>
                  </View>
                </RiseIn>

              ) : null}
            </>
          ) : null}

          {showProfileEmpty ? (
            <View testID="food-profile-empty" className="items-center gap-3">
              <View className="h-50 w-55 items-center justify-center">
                <View className="absolute size-47.5 rounded-full bg-surface-secondary" />
                <PingoFloat testID="food-profile-pingo">
                  <Image source={require('../../../assets/images/pingo-food.webp')} className="size-37.5" />
                </PingoFloat>
              </View>
              <Text className="text-center text-24 font-black tracking-title">
                {t('mealSchedule.noNutritionProfileYet')}
              </Text>
              <Text className="text-center text-15 font-medium leading-normal text-muted">
                {t('nutritionQuestionnaire.profileEmptyBody', { name: activePet.name })}
              </Text>
              <Button testID="food-create-profile" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={openNutritionProfile}>
                <Text className="text-17 font-extrabold text-accent-foreground">{t('nutritionQuestionnaire.createProfile')}</Text>
              </Button>
              <Text className="text-center text-13 font-semibold text-muted">
                {t('nutritionQuestionnaire.profileEmptyNote')}
              </Text>
            </View>
          ) : null}

          {planNotFound && !profilePending && !showProfileEmpty ? (
            <EmptyState
              testID="food-plan-empty"
              pose="food"
              title={t('food.noMealPlanYet')}
              body={t('food.noMealPlanBody')}
            />
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

          {loadedPlan !== null ? <RiseIn delayMs={200}>{links}</RiseIn> : links}
        </View>
      ) : null}
    </ScrollView>
  );
}
