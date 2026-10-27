import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, InfoCircle, Sparkles } from 'reicon-react-native';

import { generateNutritionPlan, getNutritionPlan, isNutritionAiStatus } from '../../api/nutrition';
import { getPet } from '../../api/pets';
import { deviceKeys, nutritionKeys, petKeys } from '../../api/query-keys';
import { getPetTracking } from '../../api/subscriptions';
import type { NutritionAiStatus, NutritionPlan } from '../../api/types';
import { ScreenHeader } from '../../components/screen-header';
import { useAuth } from '../../providers/auth-provider';
import { useLocale, useTranslate } from '../../providers/language-provider';
import { useChunkyLip } from '../../theme/chunky-lip';
import { CONTINUOUS_CORNER, KEEP_OPACITY } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { CATEGORY_SLOTS } from '../../utils/category-palette';
import { isoToLocalDate, timeToHhmm } from '../../utils/civil-date';
import { engineMealGrams, mealPortionGrams } from '../../utils/meal-portion';
import { aiExplanationPlainText, parseAiExplanation } from '../food/parse-ai-explanation';

export type PlanView = 'ai' | 'engine' | 'no-collar' | 'rejected' | 'limit';

export function planView(plan: NutritionPlan, status: NutritionAiStatus | null, tracked: boolean | null): PlanView {
  if (status === 'limit_reached') return 'limit';
  if (status === 'rejected') return 'rejected';
  if (status === 'not_tracked') return 'no-collar';
  if (plan.aiProposal) return 'ai';
  if (status === null && tracked === false) return 'no-collar';
  return 'engine';
}

const DATE_FORMAT = { day: 'numeric', month: 'short', year: 'numeric' } as const;

export function NutritionPlanScreen() {
  const { petId, aiStatus } = useLocalSearchParams<{ petId: string; aiStatus?: string }>();
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const t = useTranslate();
  const locale = useLocale();
  const insets = useSafeAreaInsets();
  const chunkyLip = useChunkyLip();
  const [muted, violetStrong] = useThemeColors(['muted', 'category-violet-strong']);
  const [status, setStatus] = useState<NutritionAiStatus | null>(isNutritionAiStatus(aiStatus) ? aiStatus : null);
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const plan = useQuery({
    queryKey: nutritionKeys.plan(petId),
    queryFn: () => getNutritionPlan(baseUrl, token ?? '', petId),
  });
  const pet = useQuery({
    queryKey: petKeys.detail(petId),
    queryFn: () => getPet(baseUrl, token ?? '', petId),
  });
  const tracking = useQuery({
    queryKey: deviceKeys.tracking(petId),
    queryFn: () => getPetTracking(baseUrl, token ?? '', petId),
  });
  const loadedPet = pet.data?.kind === 'ok' ? pet.data.pet : null;
  const name = loadedPet?.name ?? '';
  const isOwner = loadedPet?.myRole === 'owner';
  const loadedPlan = plan.data?.kind === 'ok' ? plan.data.plan : null;
  const loadError = plan.data !== undefined && plan.data.kind !== 'ok' && plan.data.kind !== 'not-found';
  const tracked = tracking.data?.kind === 'ok' ? tracking.data.tracked : null;
  const view = loadedPlan ? planView(loadedPlan, status, tracked) : null;
  const isAi = view === 'ai';
  const proposal = isAi ? loadedPlan?.aiProposal ?? null : null;
  const whyText = isAi ? aiExplanationPlainText(parseAiExplanation(loadedPlan?.aiExplanation)) : '';
  const reviewDate = proposal ? isoToLocalDate(proposal.reviewDate) : null;
  const rows = loadedPlan
    ? loadedPlan.mealTimes.map((mealTime) => ({
        mealTime,
        grams: isAi ? mealPortionGrams(loadedPlan, mealTime) : engineMealGrams(loadedPlan),
      }))
    : [];
  const totalGrams = isAi ? rows.reduce((total, row) => total + row.grams, 0) : loadedPlan?.dailyGrams ?? 0;

  function badgeText(current: NutritionPlan): string {
    if (!isAi) return t('nutritionPlan.engineBadge', { grams: current.dailyGrams });
    const generated = new Date(current.generatedAt);
    const time = timeToHhmm(generated);
    return generated.toDateString() === new Date(plan.dataUpdatedAt).toDateString()
      ? t('nutritionPlan.aiBadgeToday', { time })
      : t('nutritionPlan.aiBadgeDated', { date: generated.toLocaleDateString(locale, DATE_FORMAT), time });
  }

  function openPairing() {
    router.push('/pairing');
  }

  async function handleRequest() {
    setSubmitting(true);
    setRequestError(null);

    try {
      const result = await generateNutritionPlan(baseUrl, token ?? '', petId);

      switch (result.kind) {
        case 'ok':
          setStatus(result.aiStatus ?? null);
          plan.refetch();
          return;
        case 'forbidden':
          setRequestError(t('mealSchedule.errorForbidden'));
          return;
        case 'unprocessable':
          if (result.code === 'NUTRITION_PROFILE_REQUIRED') {
            setRequestError(t('mealSchedule.errorProfileRequired'));
          } else if (result.code === 'PET_WEIGHT_REQUIRED') {
            setRequestError(t('mealSchedule.registerWeightFirst'));
          } else {
            setRequestError(t('common.somethingWentWrong'));
          }
          return;
        case 'unreachable':
          setRequestError(t('common.cannotReachServer'));
          return;
        case 'unauthorized':
          await signOut();
          return;
        case 'error':
        case 'missing-config':
          setRequestError(t('common.somethingWentWrong'));
      }
    } catch {
      setRequestError(t('common.somethingWentWrong'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View testID="screen-nutrition-plan" className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 8, gap: 12, paddingBottom: 16 }}
      >
        <ScreenHeader
          testID="nutrition-plan-header"
          size={24}
          backFallback="/meal-schedule"
          title={loadedPet ? t('nutritionPlan.title', { name }) : undefined}
        />

        {plan.data === undefined ? (
          <Skeleton testID="nutrition-plan-skeleton" className="h-56 w-full rounded-card" />
        ) : null}

        {loadError ? (
          <View className="items-start gap-3">
            <Text testID="nutrition-plan-load-error" selectable className="text-danger">
              {t('common.somethingWentWrong')}
            </Text>
            <Button testID="nutrition-plan-retry" onPress={() => void plan.refetch()}>
              {t('common.retry')}
            </Button>
          </View>
        ) : null}

        {plan.data?.kind === 'not-found' ? (
          <Text testID="nutrition-plan-empty" className="font-normal text-muted">
            {t('mealSchedule.noMealPlanYet')}
          </Text>
        ) : null}

        {loadedPlan ? (
          <>
            <View
              testID="nutrition-plan-badge"
              className={isAi
                ? `h-7 flex-row items-center gap-1.5 self-start rounded-full ${CATEGORY_SLOTS.violet.surface} px-2.5`
                : 'h-7 flex-row items-center gap-1.5 self-start rounded-full bg-default px-2.5'}
            >
              {isAi ? <Sparkles size={14} color={violetStrong} /> : null}
              <Text
                testID="nutrition-plan-badge-text"
                className={isAi ? `text-xs font-extrabold ${CATEGORY_SLOTS.violet.ink}` : 'text-xs font-extrabold text-muted'}
              >
                {badgeText(loadedPlan)}
              </Text>
            </View>

            <View
              testID="nutrition-plan-meals"
              className="rounded-card border border-border bg-surface px-3.5 py-1"
              style={CONTINUOUS_CORNER}
            >
              {rows.map((row, index) => (
                <View
                  key={row.mealTime}
                  testID={`nutrition-plan-row-${index}`}
                  className={index === 0 ? 'min-h-13 flex-row items-center gap-3' : 'min-h-13 flex-row items-center gap-3 border-t border-border'}
                >
                  <Text className="flex-1 text-15 font-bold text-foreground">{row.mealTime}</Text>
                  <View className="items-end">
                    <Text testID={`nutrition-plan-grams-${index}`} className="text-17 font-black text-foreground">
                      {t('nutritionPlan.grams', { grams: row.grams })}
                    </Text>
                    {isAi ? (
                      <Text testID={`nutrition-plan-before-${index}`} className="text-11 font-semibold text-muted">
                        {t('nutritionPlan.before', { grams: engineMealGrams(loadedPlan) })}
                      </Text>
                    ) : null}
                  </View>
                </View>
              ))}
              <View testID="nutrition-plan-total" className="min-h-13 flex-row items-center gap-3 border-t border-border">
                <Text className="flex-1 text-15 font-extrabold text-muted">{t('nutritionPlan.total')}</Text>
                <Text testID="nutrition-plan-total-grams" className="text-17 font-black text-foreground">
                  {t('nutritionPlan.perDay', { grams: totalGrams })}
                </Text>
              </View>
            </View>

            {whyText !== '' ? (
              <View
                testID="nutrition-plan-why"
                className={`gap-1.5 rounded-tile ${CATEGORY_SLOTS.violet.surface} px-3.5 py-3`}
                style={CONTINUOUS_CORNER}
              >
                <Text accessibilityRole="header" className={`text-sm font-black ${CATEGORY_SLOTS.violet.ink}`}>
                  {t('nutritionPlan.whyTitle')}
                </Text>
                <Text testID="nutrition-plan-why-text" className="text-13 font-semibold leading-note text-foreground">
                  {whyText}
                </Text>
              </View>
            ) : null}

            {proposal && proposal.recommendations.length > 0 ? (
              <>
                <Text
                  testID="nutrition-plan-recommendations-title"
                  accessibilityRole="header"
                  className="mt-0.5 text-base font-black text-foreground"
                >
                  {t('nutritionPlan.recommendationsTitle')}
                </Text>
                <View testID="nutrition-plan-recommendations" className="gap-2">
                  {proposal.recommendations.map((recommendation, index) => (
                    <View key={recommendation} testID={`nutrition-plan-recommendation-${index}`} className="flex-row gap-2.5">
                      <View className={`size-5.5 items-center justify-center rounded-full ${CATEGORY_SLOTS.violet.surface}`}>
                        <Text className={`text-xs font-black ${CATEGORY_SLOTS.violet.ink}`}>{String(index + 1)}</Text>
                      </View>
                      <Text className="flex-1 text-13 font-semibold leading-body text-foreground">{recommendation}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : null}

            {reviewDate ? (
              <View testID="nutrition-plan-review" className="flex-row items-center gap-2.5">
                <Calendar size={18} color={muted} />
                <Text className="text-13 font-bold text-foreground">
                  {t('nutritionPlan.nextReview', { date: reviewDate.toLocaleDateString(locale, DATE_FORMAT) })}
                </Text>
              </View>
            ) : null}

            {isAi ? (
              <Text testID="nutrition-plan-disclaimer" className="text-xs font-semibold leading-body text-muted">
                {t('nutritionPlan.disclaimer')}
              </Text>
            ) : null}

            {view === 'no-collar' || view === 'rejected' ? (
              <View
                testID="nutrition-plan-note"
                className="flex-row items-start gap-2.5 rounded-tile bg-default px-3.5 py-3"
                style={CONTINUOUS_CORNER}
              >
                <InfoCircle size={20} color={muted} />
                <Text testID="nutrition-plan-note-text" className="flex-1 text-13 font-semibold leading-note text-foreground">
                  {view === 'no-collar' ? t('nutritionPlan.noCollarNote', { name }) : t('nutritionPlan.rejectedNote', { name })}
                </Text>
              </View>
            ) : null}
          </>
        ) : null}
      </ScrollView>

      {isOwner && loadedPlan ? (
        <View
          testID="nutrition-plan-footer"
          className="gap-2 bg-background px-5 pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          {requestError !== null ? (
            <Text testID="nutrition-plan-error" selectable className="text-danger">
              {requestError}
            </Text>
          ) : null}
          {view === 'limit' ? (
            <>
              <Text
                testID="nutrition-plan-limit"
                accessibilityLiveRegion="polite"
                className="text-center text-13 font-bold leading-body text-foreground"
              >
                {t('nutritionPlan.limitReached', { name })}
              </Text>
              <Button testID="nutrition-plan-request" className="h-14 gap-2 rounded-16 bg-default" style={KEEP_OPACITY} isDisabled>
                <Sparkles size={18} color={muted} />
                <Text className="text-17 font-extrabold text-muted">{t('nutritionPlan.requestAnother')}</Text>
              </Button>
            </>
          ) : view === 'no-collar' ? (
            <Button testID="nutrition-plan-pair" className="h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={openPairing}>
              <Text className="text-17 font-extrabold text-accent-foreground">{t('home.pairCollar')}</Text>
            </Button>
          ) : (
            <Button
              testID="nutrition-plan-request"
              variant="tertiary"
              className={`h-14 gap-2 rounded-16 ${CATEGORY_SLOTS.violet.surface}`}
              style={chunkyLip.violet}
              isDisabled={submitting}
              onPress={() => void handleRequest()}
            >
              <Sparkles size={18} color={violetStrong} />
              <Text className={`text-17 font-extrabold ${CATEGORY_SLOTS.violet.ink}`}>{t('nutritionPlan.requestAnother')}</Text>
            </Button>
          )}
        </View>
      ) : null}
    </View>
  );
}
