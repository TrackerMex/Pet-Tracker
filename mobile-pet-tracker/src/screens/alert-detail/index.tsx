import { router } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ackAlert } from '../../api/alerts';
import type { Alert } from '../../api/types';
import { Card } from '../../components/card';
import { useAlertsList } from '../../hooks/use-alerts-list';
import { useAuth } from '../../providers/auth-provider';
import { useLocale, useTranslate } from '../../providers/language-provider';
import { useThemeColors } from '../../theme/use-theme-colors';
import { alertTypeMeta } from '../../utils/alert-meta';

export function AlertDetailScreen({ alertId }: { alertId: string }) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const alerts = useAlertsList();
  const t = useTranslate();
  const locale = useLocale();
  const insets = useSafeAreaInsets();
  const [danger, warningStrong, muted] = useThemeColors([
    'danger',
    'warning-strong',
    'muted',
  ]);
  const [acked, setAcked] = useState<Alert | null>(null);
  const [acking, setAcking] = useState(false);
  const ackingRef = useRef(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const leavingRef = useRef(false);
  const found = alerts.data?.pages
    .flatMap((page) => (page.kind === 'ok' ? page.items : []))
    .find((alert) => alert.id === alertId);
  const alert = found?.status === 'open' ? (acked ?? found) : found;
  const firstPage = alerts.data?.pages[0];

  useEffect(() => {
    if (found === undefined && firstPage?.kind === 'ok' && !alerts.isFetching && !leavingRef.current) {
      leavingRef.current = true;
      router.dismissTo('/alerts');
    }
  }, [found, firstPage, alerts.isFetching]);

  async function handleAck() {
    if (!alert || alert.status !== 'open' || ackingRef.current) return;
    ackingRef.current = true;
    setAcking(true);
    setActionError(null);
    try {
      const result = await ackAlert(baseUrl, token ?? '', alertId);
      switch (result.kind) {
        case 'ok':
          setAcked(result.alert);
          return;
        case 'already-closed':
          setAcked({ ...alert, status: 'closed' });
          return;
        case 'not-found':
          if (!leavingRef.current) {
            leavingRef.current = true;
            router.dismissTo('/alerts');
          }
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
      ackingRef.current = false;
      setAcking(false);
    }
  }

  const card = alert ? (() => {
    const meta = alertTypeMeta(alert.type);
    const Icon = meta.Icon;
    const color = { danger, 'warning-strong': warningStrong, muted }[meta.ink];
    return (
      <Card testID="alert-detail-card" className="min-h-44 gap-3">
        <View testID="alert-detail-header" className="flex-row items-center gap-3">
          <View className={`size-11 items-center justify-center rounded-full ${meta.surface}`}>
            <Icon testID="alert-detail-icon" size={20} color={color} />
          </View>
          <Text testID="alert-detail-type" className="text-lg font-bold text-foreground">
            {t(meta.labelKey)}
          </Text>
        </View>
        <Text selectable testID="alert-detail-pet" className="text-sm font-semibold text-muted">
          {alert.petName}
        </Text>
        <Text selectable testID="alert-detail-opened-at" className="text-sm font-normal text-muted">
          {t('alerts.openedAt', { date: new Date(alert.openedAt).toLocaleString(locale) })}
        </Text>
        <Text testID="alert-detail-status" className="self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted">
          {alert.status === 'acked'
            ? t('alerts.statusAcked')
            : alert.status === 'closed'
              ? t('alerts.statusClosed')
              : t('alerts.statusOpen')}
        </Text>
      </Card>
    );
  })() : null;

  return (
    <ScrollView
      testID="screen-alert-detail"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}
    >
      {alert ? (
        <>
          {card}
          {alert.status === 'open' ? (
            <Button testID="alert-detail-ack" accessibilityRole="button" className="min-h-11" isDisabled={acking} onPress={() => void handleAck()}>
              <Button.Label>{t('alerts.ack')}</Button.Label>
            </Button>
          ) : null}
          {actionError ? (
            <Text selectable testID="alert-detail-action-error" className="text-danger">
              {actionError}
            </Text>
          ) : null}
        </>
      ) : alerts.isPending || alerts.isFetching ? (
        <Skeleton testID="alert-detail-loading" className="h-44 w-full rounded-card" />
      ) : firstPage && ['error', 'unreachable', 'missing-config'].includes(firstPage.kind) ? (
        <>
          <Text selectable testID="alert-detail-error" className="text-danger">
            {t('common.somethingWentWrong')}
          </Text>
          <Button testID="alert-detail-retry" className="min-h-11" onPress={() => void alerts.refetch()}>
            <Button.Label>{t('common.retry')}</Button.Label>
          </Button>
        </>
      ) : null}
    </ScrollView>
  );
}
