import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Alert } from '../../api/types';
import { Card } from '../../components/card';
import { useAlertsList } from '../../hooks/use-alerts-list';
import { useLocale, useTranslate } from '../../providers/language-provider';
import { useThemeColors } from '../../theme/use-theme-colors';
import { alertTypeMeta } from '../../utils/alert-meta';

export function AlertDetailScreen({ alertId }: { alertId: string }) {
  const alerts = useAlertsList();
  const t = useTranslate();
  const locale = useLocale();
  const insets = useSafeAreaInsets();
  const [danger, warningStrong, muted] = useThemeColors([
    'danger',
    'warning-strong',
    'muted',
  ]);
  const [acked] = useState<Alert | null>(null);
  const found = alerts.data?.pages
    .flatMap((page) => (page.kind === 'ok' ? page.items : []))
    .find((alert) => alert.id === alertId);
  const alert = found?.status === 'open' ? (acked ?? found) : found;

  if (!alert) return null;

  const meta = alertTypeMeta(alert.type);
  const Icon = meta.Icon;
  const color = { danger, 'warning-strong': warningStrong, muted }[meta.ink];

  return (
    <ScrollView
      testID="screen-alert-detail"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}
    >
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
    </ScrollView>
  );
}
