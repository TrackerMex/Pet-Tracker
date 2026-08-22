import { Redirect, router } from 'expo-router';
import { Button, Card, Spinner } from 'heroui-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'reicon-react-native';

import { listWeights, type WeightsState } from '../../api/health-records';
import { WeightChart } from '../../components/weight-chart';
import { useApi } from '../../hooks/use-api';
import { useAuth } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';

function fmtVariation(variation: number | null): string {
  if (variation === null) return '—';
  return variation > 0 ? `+${variation} kg` : `${variation} kg`;
}

function isWeightsError(state: WeightsState): boolean {
  return ['error', 'unreachable', 'missing-config'].includes(state.kind);
}

function WeightLogContent({ petId }: { petId: string }) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const weightsFn = useMemo(
    () => () => listWeights(baseUrl, token ?? '', petId),
    [baseUrl, petId, token],
  );
  const weights = useApi(weightsFn);

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
