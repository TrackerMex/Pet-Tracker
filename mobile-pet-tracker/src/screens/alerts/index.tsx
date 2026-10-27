import { router, useFocusEffect } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useCallback, useRef, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ackAlert } from '../../api/alerts';
import type { Alert } from '../../api/types';
import { Card } from '../../components/card';
import { EmptyState } from '../../components/empty-state';
import { PopIn } from '../../components/pop-in';
import { RiseIn } from '../../components/rise-in';
import { ScreenHeader } from '../../components/screen-header';
import { useAlertsList } from '../../hooks/use-alerts-list';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { TABULAR_NUMS } from '../../theme/native-styles';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { useChunkyLip } from '../../theme/chunky-lip';
import { useThemeColors } from '../../theme/use-theme-colors';
import { settleAlertAck } from '../../utils/alert-ack-outcome';
import { alertTypeMeta } from '../../utils/alert-meta';
import { alertSection } from '../../utils/alert-sections';
import { CATEGORY_SLOTS } from '../../utils/category-palette';
import { ALERT_ROW_RISE_DELAYS } from './rise-delays';

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
  const days = Math.floor(hours / 24);
  return days === 1 ? t('alerts.dayAgo') : t('alerts.daysAgo', { days });
}

function StatusPill({ item, rowId }: { item: Alert; rowId: string }) {
  const t = useTranslate();
  return (
    <Text
      testID={`${rowId}-status`}
      className={item.status === 'acked'
        ? 'rounded-full bg-default px-2.5 py-1 text-xs font-bold text-muted'
        : `rounded-full ${CATEGORY_SLOTS.green.surface} px-2.5 py-1 text-xs font-extrabold ${CATEGORY_SLOTS.green.ink}`}
    >
      {item.status === 'acked'
        ? t('alerts.statusAcked')
        : t('alerts.statusClosed')}
    </Text>
  );
}

export function AlertsScreen() {
  const chunkyLip = useChunkyLip();
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
  const alerts = useAlertsList({ drain: true });
  const refetchAlerts = alerts.refetch;

  useFocusEffect(
    useCallback(() => {
      void refetchAlerts();
      return () => {
        setActionError(null);
      };
    }, [refetchAlerts]),
  );

  const fetched =
    alerts.data?.pages.flatMap((page) =>
      page.kind === 'ok' ? page.items : [],
    ) ?? [];
  const now = new Date(alerts.dataUpdatedAt);
  const ordered = (['today', 'week', 'earlier'] as const).flatMap((section) => {
    return fetched.filter((alert) => alert.status === 'open' && alertSection(alert.openedAt, now) === section);
  });
  const rows = ordered.map((alert) =>
    alert.status === 'open' ? (acked[alert.id] ?? alert) : alert,
  );
  const count = rows.filter((alert) => alert.status === 'open').length;
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
  const sectionLabels = {
    today: t('alerts.sectionToday'),
    week: t('alerts.sectionThisWeek'),
    earlier: t('alerts.sectionEarlier'),
  };

  async function handleAck(alert: Alert) {
    if (ackingIdRef.current !== null) return;
    ackingIdRef.current = alert.id;
    setAckingId(alert.id);
    setActionError(null);

    try {
      await settleAlertAck(() => ackAlert(baseUrl, token ?? '', alert.id), alert, {
        t,
        signOut,
        showError: setActionError,
        onAcked: (next) => {
          setAcked((current) => ({
            ...current,
            [alert.id]: next,
          }));
        },
        onNotFound: () => setActionError(t('common.somethingWentWrong')),
      });
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
    <EmptyState
      testID="alerts-empty"
      pose="sleep"
      title={t('alerts.empty')}
      body={t('alerts.emptyBody')}
    />
  ) : null;

  return (
    <View testID="screen-alerts" className="flex-1 bg-background">
      <FlatList<Alert>
        testID="alerts-list"
        className="flex-1 bg-background"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 24,
          gap: 12,
        }}
        data={rows}
        keyExtractor={(item) => item.id}
        onEndReached={() => {
          if (!alerts.hasNextPage || alerts.isFetchingNextPage) return;
          void alerts.fetchNextPage();
        }}
        ListHeaderComponent={(
          <View testID="alerts-header" className="gap-3">
            <ScreenHeader
              testID="alerts"
              backFallback="/"
              title={t('alerts.title')}
              accessory={count > 0 ? (
                <PopIn testID="alerts-new-count" className="rounded-full bg-danger px-2.5 py-1">
                  <Text testID="alerts-new-count-text" className="text-13 font-extrabold text-danger-foreground" style={TABULAR_NUMS}>
                    {count === 1 ? t('alerts.newOne') : t('alerts.newMany', { count })}
                  </Text>
                </PopIn>
              ) : undefined}
            />
            {displayedActionError ? (
              <Text testID="alerts-action-error" className="text-danger">
                {displayedActionError}
              </Text>
            ) : null}
          </View>
        )}
        ListEmptyComponent={empty}
        renderItem={({ item, index }) => {
          const rowId = `alert-row-${item.id}`;
          const meta = alertTypeMeta(item.type);
          const Icon = meta.Icon;
          const color = {
            danger,
            'warning-strong': warningStrong,
            muted,
          }[meta.ink];

          const card = (
            <Card
              testID={rowId}
              className={`flex-row items-center gap-3 px-3.5 py-3 shadow-none${item.status === 'open' ? ` border-2 ${meta.border}` : ''}`}
            >
              <View
                className={`size-11 items-center justify-center rounded-full ${meta.disc}`}
              >
                <Icon testID={`${rowId}-icon`} size={22} color={color} />
              </View>
              <Pressable
                testID={`${rowId}-link`}
                accessibilityRole="button"
                className="min-h-11 min-w-0 flex-1 justify-center gap-0.5"
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                onPress={() =>
                  router.push({ pathname: '/alerts/[alertId]', params: { alertId: item.id } })
                }
              >
                <Text
                  testID={`${rowId}-type`}
                  className="text-15 font-extrabold text-foreground"
                >
                  {t(meta.labelKey)}
                </Text>
                <Text testID={`${rowId}-subtitle`} className="text-xs font-normal text-muted">
                  <Text testID={`${rowId}-pet`}>{item.petName}</Text>
                  {' · '}
                  <Text testID={`${rowId}-time`}>{fmtOpenedAt(item.openedAt, now, t)}</Text>
                </Text>
              </Pressable>
              {item.status === 'open' ? (
                <Button
                  testID={`${rowId}-ack`}
                  accessibilityRole="button"
                  variant="secondary"
                  className="h-8.5 rounded-10 border-2 border-lip-gray bg-surface px-3"
                  style={chunkyLip.neutralCompact}
                  hitSlop={TOUCH_SLOP}
                  isDisabled={ackingId !== null}
                  onPress={() => void handleAck(item)}
                >
                  <Button.Label className="text-xs font-extrabold text-foreground">{t('alerts.ack')}</Button.Label>
                </Button>
              ) : (
                <StatusPill item={item} rowId={rowId} />
              )}
            </Card>
          );
          const row = index < ALERT_ROW_RISE_DELAYS.length ? (
            <RiseIn delayMs={ALERT_ROW_RISE_DELAYS[index]} testID={`${rowId}-entrance`}>
              {card}
            </RiseIn>
          ) : card;
          const section = alertSection(item.openedAt, now);
          const firstInSection = index === 0 || alertSection(rows[index - 1].openedAt, now) !== section;
          return firstInSection ? (
            <View className="gap-3">
              <Text testID={`alerts-section-${section}`} accessibilityRole="header" className="mt-1.5 text-13 font-extrabold uppercase tracking-caps text-muted">
                {sectionLabels[section]}
              </Text>
              {row}
            </View>
          ) : row;
        }}
      />
    </View>
  );
}
