import { Redirect, router } from 'expo-router';
import {
  Button,
  Card as HeroUICard,
  Input,
  Label,
  Skeleton,
  TextField,
} from 'heroui-native';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Minus, TrendDown, TrendUp } from 'reicon-react-native';

import {
  createWeight,
  listWeights,
  type WeightsState,
} from '../../api/health-records';
import { healthKeys } from '../../api/query-keys';
import { Card } from '../../components/card';
import { WeightChart } from '../../components/weight-chart';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import {
  CONTINUOUS_CORNER,
  TABULAR_NUMS,
} from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { TOUCH_SLOP } from '../../theme/touch-target';

function fmtVariation(variation: number | null): string {
  if (variation === null) return '—';
  return variation > 0 ? `+${variation} kg` : `${variation} kg`;
}

function localTodayIso(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

function isWeightsError(state: WeightsState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function WeightLogContent({ petId }: { petId: string }) {
  const [success, danger, muted, foreground] = useThemeColors([
    'success',
    'danger',
    'muted',
    'foreground',
  ]);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const [weightText, setWeightText] = useState('');
  const [measuredAt, setMeasuredAt] = useState(localTodayIso);
  const [bodyConditionText, setBodyConditionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const weights = useQuery({
    queryKey: healthKeys.weights(petId, undefined),
    queryFn: () => listWeights(baseUrl, token ?? '', petId),
  });

  async function handleSubmit() {
    const weightKg = parseFloat(weightText);
    if (Number.isNaN(weightKg)) {
      setFormError(t('weightLog.enterValidWeight'));
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const result = await createWeight(baseUrl, token ?? '', petId, {
        weightKg,
        measuredAt,
        ...(bodyConditionText.trim()
          ? { bodyCondition: Number(bodyConditionText) }
          : {}),
      });

      switch (result.kind) {
        case 'ok':
          setWeightText('');
          setMeasuredAt(localTodayIso());
          setBodyConditionText('');
          weights.refetch();
          return;
        case 'validation':
          setFormError(result.errors.map(({ message }) => message).join('\n'));
          return;
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
    <ScrollView
      testID="screen-weight-log"
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
          accessibilityLabel={t('weightLog.backToHealth')}
          testID="weight-log-back"
          hitSlop={TOUCH_SLOP}
          className="rounded-full bg-default p-2"
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={foreground} />
        </Pressable>
        <Text className="text-2xl font-black text-foreground">
          {t('weightLog.weightLog')}
        </Text>
      </View>

      {weights.data?.kind === 'ok' ? (
        <Card testID="weight-chart-card">
          <WeightChart entries={weights.data.weights} />
        </Card>
      ) : null}

      {weights.data?.kind === 'ok' ? (
        <Card className="gap-4">
          <TextField>
            <Label className="text-2xs font-semibold text-foreground">
              {t('weightLog.weight')}
            </Label>
            <Input
              testID="weight-input"
              className="rounded-xl bg-default"
              keyboardType="decimal-pad"
              placeholder={t('weightLog.weightKg')}
              value={weightText}
              onChangeText={setWeightText}
            />
          </TextField>
          <TextField>
            <Label className="text-2xs font-semibold text-foreground">
              {t('weightLog.measuredAt')}
            </Label>
            <Input
              testID="weight-date-input"
              className="rounded-xl bg-default"
              placeholder={t('weightLog.yyyyMmDd')}
              value={measuredAt}
              onChangeText={setMeasuredAt}
            />
          </TextField>
          <TextField>
            <Label className="text-2xs font-semibold text-foreground">
              {t('weightLog.bodyCondition')}
            </Label>
            <Input
              testID="weight-bc-input"
              className="rounded-xl bg-default"
              keyboardType="number-pad"
              placeholder={t('weightLog.bodyConditionPlaceholder')}
              value={bodyConditionText}
              onChangeText={setBodyConditionText}
            />
          </TextField>

          {formError ? (
            <Text testID="weight-form-error" className="text-danger">
              {formError}
            </Text>
          ) : null}

          <Button
            testID="weight-submit"
            className="rounded-xl bg-accent"
            isDisabled={submitting}
            onPress={() => void handleSubmit()}
          >
            <Button.Label className="font-bold text-accent-foreground">
              {t('weightLog.logWeight')}
            </Button.Label>
          </Button>
        </Card>
      ) : null}

      {weights.data === undefined ? (
        <Skeleton
          testID="weight-log-loading"
          className="h-40 w-full rounded-card"
        />
      ) : null}

      {weights.data && isWeightsError(weights.data) ? (
        <View className="items-start gap-3">
          <Text testID="weight-log-error" className="text-danger">
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
        <Text testID="weight-log-empty" className="text-muted">
          {t('weightLog.noWeightEntriesYet')}
        </Text>
      ) : null}

      {weights.data?.kind === 'ok'
        ? weights.data.weights.map((entry) => {
            const tileClassName =
              entry.variation === null || entry.variation === 0
                ? 'bg-default'
                : entry.variation > 0
                  ? 'bg-danger-soft'
                  : 'bg-success-soft';
            const variationClassName =
              entry.variation === null || entry.variation === 0
                ? 'text-muted'
                : entry.variation > 0
                  ? 'text-danger'
                  : 'text-success';

            return (
              <HeroUICard
                key={entry.id}
                testID={`weight-row-${entry.id}`}
                className="flex-row items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 shadow-sm"
              >
                <View
                  className={`size-8 shrink-0 items-center justify-center rounded-xl ${tileClassName}`}
                  style={CONTINUOUS_CORNER}
                >
                  {entry.variation === null || entry.variation === 0 ? (
                    <Minus size={15} color={muted} />
                  ) : entry.variation > 0 ? (
                    <TrendUp size={15} color={danger} />
                  ) : (
                    <TrendDown size={15} color={success} />
                  )}
                </View>
                <View className="min-w-0 flex-1 gap-1">
                  <View className="flex-row items-baseline gap-1.5">
                    <Text
                      className="font-bold text-foreground"
                      style={TABULAR_NUMS}
                    >
                      {entry.weightKg} kg
                    </Text>
                    <Text
                      className={`text-xs font-semibold ${variationClassName}`}
                      style={TABULAR_NUMS}
                    >
                      {fmtVariation(entry.variation)}
                    </Text>
                  </View>
                  {entry.bodyCondition !== null ? (
                    <Text className="text-xs font-normal text-muted">
                      {t('weightLog.bodyConditionValue', {
                        value: entry.bodyCondition,
                      })}
                    </Text>
                  ) : null}
                </View>
                <Text className="shrink-0 text-xs font-normal text-muted">
                  {entry.measuredAt}
                </Text>
              </HeroUICard>
            );
          })
        : null}
    </ScrollView>
  );
}

export default function WeightLogScreen() {
  const { selectedPetId } = useSelectedPet();

  if (selectedPetId === null) {
    return <Redirect href="/health" />;
  }

  return <WeightLogContent petId={selectedPetId} />;
}
