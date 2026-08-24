import { Redirect, router } from 'expo-router';
import {
  Button,
  Card as HeroUICard,
  Input,
  Label,
  Spinner,
  TextField,
} from 'heroui-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Minus, TrendDown, TrendUp } from 'reicon-react-native';

import {
  createWeight,
  listWeights,
  type WeightsState,
} from '../../api/health-records';
import { Card } from '../../components/card';
import { WeightChart } from '../../components/weight-chart';
import { useApi } from '../../hooks/use-api';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { useThemeColors } from '../../theme/use-theme-colors';

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
  const insets = useSafeAreaInsets();
  const [weightText, setWeightText] = useState('');
  const [measuredAt, setMeasuredAt] = useState(localTodayIso);
  const [bodyConditionText, setBodyConditionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const weightsFn = useMemo(
    () => () => listWeights(baseUrl, token ?? '', petId),
    [baseUrl, petId, token],
  );
  const weights = useApi(weightsFn);

  async function handleSubmit() {
    const weightKg = parseFloat(weightText);
    if (Number.isNaN(weightKg)) {
      setFormError('Enter a valid weight');
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
          setFormError('Only the owner can log weights');
          return;
        case 'unreachable':
          setFormError('Cannot reach server');
          return;
        case 'unauthorized':
          await signOut();
          return;
        case 'error':
        case 'missing-config':
          setFormError('Something went wrong');
      }
    } catch {
      setFormError('Something went wrong');
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
          accessibilityLabel="Back to health"
          testID="weight-log-back"
          className="rounded-full bg-default p-2"
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={foreground} />
        </Pressable>
        <Text className="text-2xl font-black text-foreground">Weight log</Text>
      </View>

      {weights.data?.kind === 'ok' ? (
        <WeightChart entries={weights.data.weights} />
      ) : null}

      {weights.data?.kind === 'ok' ? (
        <Card className="gap-4">
          <TextField>
            <Label className="text-2xs font-semibold text-foreground">
              Weight
            </Label>
            <Input
              testID="weight-input"
              className="rounded-xl bg-default"
              keyboardType="decimal-pad"
              placeholder="Weight (kg)"
              value={weightText}
              onChangeText={setWeightText}
            />
          </TextField>
          <TextField>
            <Label className="text-2xs font-semibold text-foreground">
              Measured at
            </Label>
            <Input
              testID="weight-date-input"
              className="rounded-xl bg-default"
              placeholder="YYYY-MM-DD"
              value={measuredAt}
              onChangeText={setMeasuredAt}
            />
          </TextField>
          <TextField>
            <Label className="text-2xs font-semibold text-foreground">
              Body condition
            </Label>
            <Input
              testID="weight-bc-input"
              className="rounded-xl bg-default"
              keyboardType="number-pad"
              placeholder="Body condition 1-9 (optional)"
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
              Log weight
            </Button.Label>
          </Button>
        </Card>
      ) : null}

      {weights.data === undefined ? (
        <Spinner testID="weight-log-loading" />
      ) : null}

      {weights.data && isWeightsError(weights.data) ? (
        <View className="items-start gap-3">
          <Text testID="weight-log-error" className="text-danger">
            Something went wrong
          </Text>
          <Button testID="weight-log-retry" onPress={weights.refetch}>
            Retry
          </Button>
        </View>
      ) : null}

      {weights.data?.kind === 'ok' && weights.data.weights.length === 0 ? (
        <Text testID="weight-log-empty" className="text-muted">
          No weight entries yet
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
                  className={`size-8 shrink-0 items-center justify-center rounded-lg ${tileClassName}`}
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
                    <Text className="font-bold text-foreground">
                      {entry.weightKg} kg
                    </Text>
                    <Text
                      className={`text-xs font-semibold ${variationClassName}`}
                    >
                      {fmtVariation(entry.variation)}
                    </Text>
                  </View>
                  {entry.bodyCondition !== null ? (
                    <Text className="text-xs font-normal text-muted">
                      BC {entry.bodyCondition}/9
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
