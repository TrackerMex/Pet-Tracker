import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getMealsHistory } from '../../api/nutrition';
import { nutritionKeys } from '../../api/query-keys';
import { Card } from '../../components/card';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { currentMonth, monthRange } from '../../utils/month-grid';

function MealsHistoryContent({ petId }: { petId: string }) {
  const { token, signOut } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const visibleMonth = currentMonth(new Date());
  const { from, to } = monthRange(visibleMonth);
  const { data, refetch } = useQuery({
    queryKey: nutritionKeys.mealsHistory(petId, from, to),
    queryFn: async () => {
      const result = await getMealsHistory(process.env.EXPO_PUBLIC_API_URL, token ?? '', petId, from, to);
      switch (result.kind) {
        case 'unauthorized':
          await signOut();
      }
      return result;
    },
    placeholderData: keepPreviousData,
  });

  let content;
  if (data === undefined) {
    content = <Skeleton testID="meals-history-skeleton" className="h-80 w-full rounded-card" />;
  } else {
    switch (data.kind) {
      case 'unauthorized':
        content = null;
        break;
      case 'error':
      case 'unreachable':
      case 'not-found':
      case 'missing-config':
        content = (
          <View className="items-start gap-3">
            <Text testID="meals-history-error" className="text-danger">
              {t('common.somethingWentWrong')}
            </Text>
            <Button testID="meals-history-retry" onPress={() => refetch()}>
              {t('common.retry')}
            </Button>
          </View>
        );
        break;
      case 'ok':
        content = (
          <Card className="gap-4">
            <View testID="meals-history-grid" className="gap-1" />
            {data.history.days.every(day => day.mealTimes.length === 0) ? (
              <Text testID="meals-history-empty" className="text-sm text-muted">
                {t('mealsHistory.emptyMonth')}
              </Text>
            ) : null}
          </Card>
        );
    }
  }

  return (
    <ScrollView
      testID="screen-meals-history"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}
    >
      {content}
    </ScrollView>
  );
}

export function MealsHistoryScreen() {
  const { selectedPetId } = useSelectedPet();
  if (selectedPetId === null) {
    return <Redirect href="/food" />;
  }
  return <MealsHistoryContent petId={selectedPetId} />;
}
