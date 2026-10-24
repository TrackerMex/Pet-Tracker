import { useChunkyLip } from '../../theme/chunky-lip';
import { Redirect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Button,
  Input,
  Label,
  Skeleton,
  TextField,
} from 'heroui-native';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Check, Minus, TrendDown, TrendUp } from 'reicon-react-native';

import {
  createWeight,
  listWeights,
  type WeightsState,
} from '../../api/health-records';
import { healthKeys, userKeys } from '../../api/query-keys';
import { getMe } from '../../api/users';
import { Card } from '../../components/card';
import { ScreenHeader } from '../../components/screen-header';
import { RiseIn } from '../../components/rise-in';
import { WeightChart } from '../../components/weight-chart';
import { FieldErrorMessage } from '../../components/field-error-message';
import type { FieldIssues } from '../../utils/account-rules';
import { parseDecimal, validateWeight } from '../../utils/form-rules';
import { useAuth } from '../../providers/auth-provider';
import { useLocale, useTranslate } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import {
  CONTINUOUS_CORNER,
  TABULAR_NUMS,
} from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { MOTION_FEEDBACK_MS, MOTION_TRANSITION_MS } from '../../theme/motion';
import { civilTodayIso } from '../../utils/civil-today-iso';
import { monthlyWeightDelta } from '../../utils/monthly-weight-delta';
import { CATEGORY_SLOTS } from '../../utils/category-palette';
import { fmtDayMonth } from '../home/format';

const MEASURED_AT_IN_FUTURE_MESSAGE =
  'measuredAt is too far in the future';
const WEIGHT_TOAST_MS = 2500;
const DELTA_TONE = {
  up: { tile: CATEGORY_SLOTS.rose.surface, text: 'text-danger', color: 'danger' },
  down: { tile: CATEGORY_SLOTS.green.surface, text: 'text-accent-strong', color: 'accent-strong' },
  flat: { tile: 'bg-default', text: 'text-muted', color: 'muted' },
} as const;

function fmtVariation(variation: number | null): string {
  if (variation === null) return '—';
  return variation > 0 ? `+${variation} kg` : `${variation} kg`;
}

function weightTone(variation: number | null) {
  const direction = variation !== null && variation > 0 ? 'up' : variation !== null && variation < 0 ? 'down' : 'flat';
  return {
    ...DELTA_TONE[direction],
    Icon: direction === 'up' ? TrendUp : direction === 'down' ? TrendDown : Minus,
  };
}

function isWeightsError(state: WeightsState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function WeightLogContent({ petId }: { petId: string }) {
  const chunkyLip = useChunkyLip();
  const [success, danger, muted, accentStrong] = useThemeColors([
    'success',
    'danger',
    'muted',
    'accent-strong',
  ]);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const t = useTranslate();
  const locale = useLocale();
  const insets = useSafeAreaInsets();
  const [weightText, setWeightText] = useState('');
  const [measuredAtDraft, setMeasuredAtDraft] = useState<string | null>(null);
  const [bodyConditionText, setBodyConditionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldIssues<'weight' | 'measuredAt' | 'bodyCondition'>>({});
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (toastTimer.current !== null) clearTimeout(toastTimer.current);
  }, []);
  const me = useQuery({
    queryKey: userKeys.me(),
    queryFn: () => getMe(baseUrl, token ?? ''),
  });
  const profileTimeZone =
    me.data?.kind === 'ok' ? me.data.me.timezone : undefined;
  const measuredAt = measuredAtDraft ?? civilTodayIso(profileTimeZone);
  const weights = useQuery({
    queryKey: healthKeys.weights(petId, undefined),
    queryFn: () => listWeights(baseUrl, token ?? '', petId),
  });
  const entries = weights.data?.kind === 'ok' ? weights.data.weights : [];
  const monthDelta = monthlyWeightDelta(entries, civilTodayIso(profileTimeZone));
  const monthTone = weightTone(monthDelta);
  const toneColors = { danger, muted, 'accent-strong': accentStrong };

  async function handleSubmit() {
    setFormError(null);
    const issues = validateWeight({ weight: weightText, measuredAt, bodyCondition: bodyConditionText });
    setFieldErrors(issues);
    if (Object.keys(issues).length > 0) return;
    const weightKg = parseDecimal(weightText);

    setSubmitting(true);

    try {
      const result = await createWeight(baseUrl, token ?? '', petId, {
        weightKg,
        measuredAt: measuredAt.trim(),
        ...(bodyConditionText.trim()
          ? { bodyCondition: Number(bodyConditionText.trim()) }
          : {}),
      });

      switch (result.kind) {
        case 'ok':
          setWeightText('');
          setMeasuredAtDraft(null);
          setBodyConditionText('');
          if (toastTimer.current !== null) clearTimeout(toastTimer.current);
          setToastVisible(true);
          toastTimer.current = setTimeout(() => {
            setToastVisible(false);
            toastTimer.current = null;
          }, WEIGHT_TOAST_MS);
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          weights.refetch();
          return;
        case 'validation': {
          const futureErrors = result.errors.filter(({ path, message }) =>
            path === 'measuredAt' && message === MEASURED_AT_IN_FUTURE_MESSAGE,
          );
          if (futureErrors.length > 0) {
            setFieldErrors({ measuredAt: { labelKey: 'weightLog.dateCannotBeAfterToday' } });
          }
          if (futureErrors.length < result.errors.length) {
            setFormError(t('validation.checkDetails'));
          }
          return;
        }
        case 'forbidden':
          setFormError(t('weightLog.errorForbidden'));
          return;
        case 'unreachable':
          setFormError(t('common.cannotReachServer'));
          return;
        case 'unauthorized':
          await signOut();
          return;
        case 'error':
        case 'missing-config':
          setFormError(t('common.somethingWentWrong'));
      }
    } catch {
      setFormError(t('common.somethingWentWrong'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      testID="screen-weight-log"
      className="flex-1"
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <ScrollView
        testID="weight-log-form"
        className="flex-1 bg-background"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 32,
          gap: 14,
        }}
      >
        <ScreenHeader testID="weight-log-header" size={24} backFallback="/health" title={t('weightLog.weightLog')} />
        {weights.data?.kind === 'ok' && entries.length > 0 ? (
          <RiseIn delayMs={0}>
          <View testID="weight-chart-card" className="gap-2 rounded-24 bg-surface-secondary p-4" style={CONTINUOUS_CORNER}>
            {entries.length > 0 ? (
              <View testID="weight-summary" className="flex-row items-baseline gap-2">
                <Text
                  testID="weight-current"
                  className="text-34 font-black text-foreground"
                  style={TABULAR_NUMS}
                >
                  {`${entries[0].weightKg} kg`}
                </Text>
                {monthDelta !== null ? (
                    <Text
                      testID="weight-month-delta-text"
                      className={`text-sm font-extrabold ${monthTone.text}`}
                      style={TABULAR_NUMS}
                    >
                      {t('weightLog.monthDelta', { value: fmtVariation(monthDelta) })}
                    </Text>
                ) : null}
              </View>
            ) : null}
            <WeightChart entries={weights.data.weights} />
          </View>
          </RiseIn>
        ) : null}

        <RiseIn delayMs={80}>
          <Card testID="weight-form" variant="flat" className="gap-2.5 py-3.5">
            <View className="flex-row gap-2.5">
              <TextField className="flex-1 gap-1.5" isInvalid={Boolean(fieldErrors.weight)}>
              <Label><Text className="text-13 font-extrabold text-foreground">
                {t('weightLog.weight')}
              </Text></Label>
              <Input
                testID="weight-input"
                className="h-12 rounded-xl bg-default"
                keyboardType="decimal-pad"
                placeholder={t('weightLog.weightKg')}
                value={weightText}
                onChangeText={setWeightText}
              />
              <FieldErrorMessage testID="weight-input" issue={fieldErrors.weight} />
            </TextField>
              <TextField className="flex-1 gap-1.5" isInvalid={Boolean(fieldErrors.measuredAt)}>
              <Label><Text className="text-13 font-extrabold text-foreground">
                {t('weightLog.measuredAt')}
              </Text></Label>
              <Input
                testID="weight-date-input"
                className="h-12 rounded-xl bg-default"
                placeholder={t('weightLog.yyyyMmDd')}
                value={measuredAt}
                onChangeText={setMeasuredAtDraft}
              />
              <FieldErrorMessage testID="weight-date-input" issue={fieldErrors.measuredAt} />
            </TextField>
            </View>
            <TextField className="gap-1.5" isInvalid={Boolean(fieldErrors.bodyCondition)}>
              <Label><Text className="text-13 font-extrabold text-foreground">
                {t('weightLog.bodyCondition')}
              </Text></Label>
              <Input
                testID="weight-bc-input"
                className="h-12 rounded-xl bg-default"
                keyboardType="number-pad"
                placeholder={t('weightLog.bodyConditionPlaceholder')}
                value={bodyConditionText}
                onChangeText={setBodyConditionText}
              />
              <FieldErrorMessage testID="weight-bc-input" issue={fieldErrors.bodyCondition} />
            </TextField>

            {formError ? (
              <Text testID="weight-form-error" className="text-danger">
                {formError}
              </Text>
            ) : null}

            <Button
              testID="weight-submit"
              className="h-14 rounded-16 bg-accent" style={chunkyLip.primary}
              isDisabled={submitting}
              onPress={() => void handleSubmit()}
            >
              <Text className="text-17 font-extrabold text-accent-foreground">
                {t('weightLog.logWeight')}
              </Text>
            </Button>
          </Card>
        </RiseIn>

        {weights.data === undefined ? (
          <View testID="weight-log-loading">
            {[0, 1, 2].map(index => (
              <RiseIn key={index} delayMs={60 * index}>
                <View testID={`weight-log-skeleton-row-${index}`} className="flex-row items-center gap-3 border-t border-border py-2.5">
                  <Skeleton className="size-9 rounded-xl" />
                  <View className="flex-1 gap-1.5">
                    <Skeleton className="h-3.5 w-2/5 rounded-full" />
                    <Skeleton className="h-2.5 w-1/5 rounded-full" />
                  </View>
                  <Skeleton className="h-3 w-9.5 rounded-full" />
                </View>
              </RiseIn>
            ))}
          </View>
        ) : null}

        {weights.data && isWeightsError(weights.data) ? (
          <View className="items-start gap-3">
            <Text testID="weight-log-error" className="text-15 leading-body text-danger" accessibilityRole="alert">
              {t('common.somethingWentWrong')}
            </Text>
            <Button
              testID="weight-log-retry"
              onPress={() => void weights.refetch()}
            >
              {t('common.retry')}
            </Button>
          </View>
        ) : null}

        {weights.data?.kind === 'ok' && weights.data.weights.length === 0 ? (
          <Text testID="weight-log-empty" className="text-15 leading-body text-muted">
            {t('weightLog.noWeightEntriesYet')}
          </Text>
        ) : null}

        {entries.length > 0 ? <Text testID="weight-history-title" accessibilityRole="header" className="mb-1 text-17 font-extrabold text-foreground">{t('weightLog.history')}</Text> : null}

        {weights.data?.kind === 'ok'
          ? weights.data.weights.map((entry, index) => {
              const { tile: tileClassName, text, Icon, color } = weightTone(entry.variation);
              const rowClassName = `text-13 ${text}`;

              return (
                <RiseIn key={entry.id} delayMs={140 + 60 * Math.min(index, 2)}>
                <View
                  testID={`weight-row-${entry.id}`}
                  className="flex-row items-center gap-3 border-t border-border py-2.5"
                >
                  <View
                    testID={`weight-row-${entry.id}-tone`}
                    className={`size-9 shrink-0 items-center justify-center rounded-xl ${tileClassName}`}
                    style={CONTINUOUS_CORNER}
                  >
                    <Icon size={18} color={toneColors[color]} />
                  </View>
                  <View className="min-w-0 flex-1 gap-1">
                    <Text className="text-15 font-extrabold text-foreground" style={TABULAR_NUMS}>
                      {`${entry.weightKg} kg `}
                      <Text testID={`weight-row-${entry.id}-delta`} className={rowClassName} style={TABULAR_NUMS}>
                        {fmtVariation(entry.variation)}
                      </Text>
                    </Text>
                    {entry.bodyCondition !== null ? (
                      <Text className="text-xs text-muted">
                        {t('weightLog.bodyConditionValue', {
                          value: entry.bodyCondition,
                        })}
                      </Text>
                    ) : null}
                  </View>
                  <Text testID={`weight-row-${entry.id}-date`} className="text-13 font-semibold text-muted">
                    {fmtDayMonth(entry.measuredAt, locale)}
                  </Text>
                </View>
                </RiseIn>
              );
            })
          : null}
      </ScrollView>
      {toastVisible ? (
        <Animated.View
          testID="weight-toast"
          entering={FadeIn.duration(MOTION_TRANSITION_MS)}
          exiting={FadeOut.duration(MOTION_FEEDBACK_MS)}
          className="absolute top-4 flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm"
          pointerEvents="none"
          accessibilityLiveRegion="polite"
        >
          <Check size={16} color={success} />
          <Text className="text-sm font-semibold text-foreground">
            {t('weightLog.weightLogged')}
          </Text>
        </Animated.View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

export function WeightLogScreen() {
  const { selectedPetId } = useSelectedPet();

  if (selectedPetId === null) {
    return <Redirect href="/health" />;
  }

  return <WeightLogContent petId={selectedPetId} />;
}
