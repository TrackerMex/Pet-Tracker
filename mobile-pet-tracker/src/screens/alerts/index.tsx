import { useInfiniteQuery } from '@tanstack/react-query';
import { Button, Skeleton } from 'heroui-native';
import { useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BatteryLow, Bell, LocationSlash } from 'reicon-react-native';

import { ackAlert, listAlerts } from '../../api/alerts';
import { alertKeys } from '../../api/query-keys';
import type { Alert } from '../../api/types';
import { Card } from '../../components/card';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { useThemeColors } from '../../theme/use-theme-colors';

const ALERT_TYPE_META = {
  geofence_exit: {
    Icon: LocationSlash,
    labelKey: 'alerts.typeGeofenceExit',
    surface: 'bg-danger-soft',
    ink: 'danger',
  },
  battery_low: {
    Icon: BatteryLow,
    labelKey: 'alerts.typeBatteryLow',
    surface: 'bg-warning-soft',
    ink: 'warning-strong',
  },
} as const;

const UNKNOWN_ALERT_META = {
  Icon: Bell,
  labelKey: 'alerts.typeUnknown',
  surface: 'bg-default',
  ink: 'muted',
} as const;

function fmtOpenedAt(
  iso: string,
  now: Date,
  t: ReturnType<typeof useTranslate>,
): string {
  const minutes = Math.floor(
    Math.max(0, now.getTime() - new Date(iso).getTime()) / 60_000,
  );
  if (minutes < 1) return t('alerts.justNow');
  if (minutes < 60) return t('alerts.minutesAgo', { minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t('alerts.hoursAgo', { hours });
  return t('alerts.daysAgo', { days: Math.floor(hours / 24) });
}

export function AlertsScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const [danger, warningStrong, muted] = useThemeColors([
    'danger',
    'warning-strong',
    'muted',
  ]);
  const [acked, setAcked] = useState<Record<string, Alert>>({});
  const [ackingId, setAckingId] = useState<string | null>(null);
  const ackingIdRef = useRef<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
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
  const fetched =
    alerts.data?.pages.flatMap((page) =>
      page.kind === 'ok' ? page.items : [],
    ) ?? [];
  const ordered = [
    ...fetched.filter((alert) => alert.status === 'open'),
    ...fetched.filter((alert) => alert.status !== 'open'),
  ];
  const rows = ordered.map((alert) => acked[alert.id] ?? alert);
  const firstPage = alerts.data?.pages[0];
  const firstPageFailed =
    firstPage !== undefined &&
    ['error', 'unreachable', 'missing-config'].includes(firstPage.kind);
  const laterPageFailed =
    alerts.data?.pages
      .slice(1)
      .some((page) => page.kind !== 'ok') ?? false;
  const displayedActionError =
    actionError ??
    (laterPageFailed ? t('common.somethingWentWrong') : null);
  const now = new Date(Date.now());

  async function handleAck(alert: Alert) {
    if (ackingIdRef.current !== null) return;
    ackingIdRef.current = alert.id;
    setAckingId(alert.id);
    setActionError(null);

    try {
      const result = await ackAlert(baseUrl, token ?? '', alert.id);

      switch (result.kind) {
        case 'ok':
          setAcked((current) => ({
            ...current,
            [alert.id]: result.alert,
          }));
          return;
        case 'already-closed':
          setAcked((current) => ({
            ...current,
            [alert.id]: { ...alert, status: 'closed' },
          }));
          return;
        case 'not-found':
          setActionError(t('common.somethingWentWrong'));
          return;
        case 'unreachable':
          setActionError(t('common.cannotReachServer'));
          return;
        case 'unauthorized':
          await signOut();
          return;
        case 'error':
        case 'missing-config':
          setActionError(t('common.somethingWentWrong'));
      }
    } catch {
      setActionError(t('common.somethingWentWrong'));
    } finally {
      ackingIdRef.current = null;
      setAckingId(null);
    }
  }

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
  ) : firstPage?.kind === 'ok' && rows.length === 0 ? (
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
        data={rows}
        keyExtractor={(item) => item.id}
        onEndReached={() => {
          if (!alerts.hasNextPage || alerts.isFetchingNextPage) return;
          void alerts.fetchNextPage();
        }}
        ListHeaderComponent={
          <View className="gap-3">
            <Text className="text-2xl font-black text-foreground">
              {t('alerts.title')}
            </Text>
            {displayedActionError ? (
              <Text testID="alerts-action-error" className="text-danger">
                {displayedActionError}
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={empty}
        renderItem={({ item }) => {
          const rowId = `alert-row-${item.id}`;
          const meta =
            item.type in ALERT_TYPE_META
              ? ALERT_TYPE_META[
                  item.type as keyof typeof ALERT_TYPE_META
                ]
              : UNKNOWN_ALERT_META;
          const Icon = meta.Icon;
          const color = {
            danger,
            'warning-strong': warningStrong,
            muted,
          }[meta.ink];

          return (
            <Card
              testID={rowId}
              className="min-h-20 flex-row items-center gap-3"
            >
              <View
                className={`size-11 items-center justify-center rounded-full ${meta.surface}`}
              >
                <Icon testID={`${rowId}-icon`} size={20} color={color} />
              </View>
              <View className="min-w-0 flex-1 gap-1">
                <Text
                  testID={`${rowId}-type`}
                  className="text-sm font-bold text-foreground"
                >
                  {t(meta.labelKey)}
                </Text>
                <Text
                  testID={`${rowId}-pet`}
                  className="text-xs font-semibold text-muted"
                >
                  {item.petName}
                </Text>
                <Text
                  testID={`${rowId}-time`}
                  className="text-xs font-normal text-muted"
                >
                  {fmtOpenedAt(item.openedAt, now, t)}
                </Text>
              </View>
              {item.status === 'open' ? (
                <Button
                  testID={`${rowId}-ack`}
                  accessibilityRole="button"
                  className="min-h-11"
                  isDisabled={ackingId !== null}
                  onPress={() => void handleAck(item)}
                >
                  <Button.Label>{t('alerts.ack')}</Button.Label>
                </Button>
              ) : (
                <Text
                  testID={`${rowId}-status`}
                  className="rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted"
                >
                  {item.status === 'acked'
                    ? t('alerts.statusAcked')
                    : t('alerts.statusClosed')}
                </Text>
              )}
            </Card>
          );
        }}
      />
    </View>
  );
}
