import { Redirect, router } from 'expo-router';
import { Button, Card, Input, Label, Spinner, TextField } from 'heroui-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'reicon-react-native';

import {
  createWeight,
  listWeights,
  type WeightsState,
} from '../../api/health-records';
import { WeightChart } from '../../components/weight-chart';
import { useApi } from '../../hooks/use-api';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';

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
        paddingBottom: insets.bottom + 96,
      }}
    >
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to health"
          testID="weight-log-back"
          className="rounded-full bg-surface p-2"
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} />
        </Pressable>
        <Text className="text-2xl font-semibold text-foreground">Weight log</Text>
      </View>

      {weights.data?.kind === 'ok' ? (
        <WeightChart entries={weights.data.weights} />
      ) : null}

      {weights.data?.kind === 'ok' ? (
        <Card className="gap-4 p-4">
          <TextField>
            <Label>Weight</Label>
            <Input
              testID="weight-input"
              keyboardType="decimal-pad"
              placeholder="Weight (kg)"
              value={weightText}
              onChangeText={setWeightText}
            />
          </TextField>
          <TextField>
            <Label>Measured at</Label>
            <Input
              testID="weight-date-input"
              placeholder="YYYY-MM-DD"
              value={measuredAt}
              onChangeText={setMeasuredAt}
            />
          </TextField>
          <TextField>
            <Label>Body condition</Label>
            <Input
              testID="weight-bc-input"
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
            isDisabled={submitting}
            onPress={() => void handleSubmit()}
          >
            Log weight
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
        ? weights.data.weights.map((entry) => (
            <Card
              key={entry.id}
              testID={`weight-row-${entry.id}`}
              className="gap-1 p-4"
            >
              <Text className="font-semibold text-foreground">
                {entry.weightKg} kg
              </Text>
              <Text className="text-muted">{entry.measuredAt}</Text>
              <Text className="text-muted">{fmtVariation(entry.variation)}</Text>
              {entry.bodyCondition !== null ? (
                <Text className="text-muted">BC {entry.bodyCondition}/9</Text>
              ) : null}
            </Card>
          ))
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
