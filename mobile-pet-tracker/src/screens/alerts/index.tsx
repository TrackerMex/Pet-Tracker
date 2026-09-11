import { useInfiniteQuery } from '@tanstack/react-query';
import { Button, Skeleton } from 'heroui-native';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { listAlerts } from '../../api/alerts';
import { alertKeys } from '../../api/query-keys';
import type { Alert } from '../../api/types';
import { Card } from '../../components/card';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';

export function AlertsScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const alerts = useInfiniteQuery({
    queryKey: alertKeys.list(),
    queryFn: ({ pageParam }) =>
      listAlerts(baseUrl, token ?? '', undefined, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.kind === 'ok' && lastPage.nextCursor !== null
        ? lastPage.nextCursor
        : undefined,
  });
  const items =
    alerts.data?.pages.flatMap((page) =>
      page.kind === 'ok' ? page.items : [],
    ) ?? [];
  const firstPage = alerts.data?.pages[0];
  const firstPageFailed =
    firstPage !== undefined &&
    ['error', 'unreachable', 'missing-config'].includes(firstPage.kind);

  const empty = alerts.isPending ? (
    <View testID="alerts-loading" className="gap-3">
      {[1, 2, 3].map((number) => (
        <Skeleton
          key={number}
          testID={`alert-row-skeleton-${number}`}
          className="h-20 w-full rounded-card"
        />
      ))}
    </View>
  ) : firstPageFailed ? (
    <View className="items-start gap-3">
      <Text testID="alerts-error" className="text-danger">
        {t('common.somethingWentWrong')}
      </Text>
      <Button testID="alerts-retry" onPress={() => void alerts.refetch()}>
        <Button.Label>{t('common.retry')}</Button.Label>
      </Button>
    </View>
  ) : firstPage?.kind === 'ok' && items.length === 0 ? (
    <Text testID="alerts-empty" className="font-normal text-muted">
      {t('alerts.empty')}
    </Text>
  ) : null;

  return (
    <View testID="screen-alerts" className="flex-1 bg-background">
      <FlatList<Alert>
        testID="alerts-list"
        className="flex-1 bg-background"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          padding: 24,
          gap: 16,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 96,
        }}
        data={items}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text className="text-2xl font-black text-foreground">
            {t('alerts.title')}
          </Text>
        }
        ListEmptyComponent={empty}
        renderItem={({ item }) => <Card testID={`alert-row-${item.id}`} />}
      />
    </View>
  );
}
