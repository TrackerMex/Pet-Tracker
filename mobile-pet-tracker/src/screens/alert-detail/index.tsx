import { useChunkyLip } from '../../theme/chunky-lip';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Button, Skeleton } from 'heroui-native';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';
import { Map } from 'reicon-react-native';

import { AlertPingRing } from './ping-ring';
import { HomeEntrance } from '../home/home-entrance';

import { ackAlert } from '../../api/alerts';
import { listGeofences } from '../../api/geofences';
import { geofenceKeys } from '../../api/query-keys';
import type { Alert } from '../../api/types';
import { Card } from '../../components/card';
import { PetMap, type MapCoordinates } from '../../components/pet-map';
import { ScreenHeader } from '../../components/screen-header';
import { useAlertsList } from '../../hooks/use-alerts-list';
import { useAuth } from '../../providers/auth-provider';
import { useLocale, useTranslate } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { settleAlertAck } from '../../utils/alert-ack-outcome';
import { alertTypeMeta } from '../../utils/alert-meta';
import { CATEGORY_SLOTS } from '../../utils/category-palette';
import { alertPosition, distanceMeters, formatDistance } from '../../utils/alert-location';
import { zoomForRadius } from '../../utils/zoom-for-radius';

function AlertDetailMap({ alert, position }: { alert: Alert; position: MapCoordinates }) {
  const { theme } = useUniwind();
  const { token } = useAuth();
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const t = useTranslate();
  const zones = useQuery({
    queryKey: geofenceKeys.list(alert.petId),
    queryFn: () => listGeofences(baseUrl, token ?? '', alert.petId),
    enabled: alert.geofenceId !== null,
  });
  const zone = zones.data?.kind === 'ok'
    ? zones.data.geofences.find((zona) => zona.id === alert.geofenceId)
    : undefined;
  const d = zone ? distanceMeters(position, { latitude: zone.centerLat, longitude: zone.centerLng }) : 0;
  const zoneName = typeof alert.payload.geofenceName === 'string' && alert.payload.geofenceName
    ? alert.payload.geofenceName : zone?.name;
  return (
    <View testID="alert-detail-map" className="h-52.5 overflow-hidden rounded-24" style={CONTINUOUS_CORNER}
      accessible={Boolean(zoneName)} accessibilityLabel={zoneName ? t('alerts.mapLabel', { zone: zoneName }) : undefined}>
      <PetMap
        center={position}
        marker={position}
        polylines={[]}
        circles={zone ? [{ id: zone.id, center: { latitude: zone.centerLat, longitude: zone.centerLng }, radius: zone.radiusM }] : []}
        zoom={zone ? zoomForRadius(d + zone.radiusM) : undefined}
        colorScheme={theme === 'dark' ? 'dark' : 'light'}
      />
      {zone && Math.round(d - zone.radiusM) >= 1 ? (
        <BlurView testID="alert-detail-distance-blur" intensity={48} blurMethod="dimezisBlurViewSdk31Plus"
          tint={theme === 'dark' ? 'dark' : 'light'} className="absolute bottom-3 left-3 overflow-hidden rounded-full">
          <Text testID="alert-detail-distance" className="bg-glass-surface-strong px-2.5 py-1.5 text-xs font-bold text-foreground" style={TABULAR_NUMS}>
            {t('alerts.distanceFromZone', { distance: formatDistance(d - zone.radiusM), zone: zone.name })}
          </Text>
        </BlurView>
      ) : null}
    </View>
  );
}

export function AlertDetailScreen({ alertId }: { alertId: string }) {
  const chunkyLip = useChunkyLip();
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const { selectPet } = useSelectedPet();
  const alerts = useAlertsList();
  const t = useTranslate();
  const locale = useLocale();
  const insets = useSafeAreaInsets();
  const [dangerForeground, background, foreground] = useThemeColors(['danger-foreground', 'background', 'foreground']);
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
  const position = alert ? alertPosition(alert.payload) : null;

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
      await settleAlertAck(() => ackAlert(baseUrl, token ?? '', alertId), alert, {
        t,
        signOut,
        showError: setActionError,
        onAcked: setAcked,
        onNotFound: () => {
          if (!leavingRef.current) {
            leavingRef.current = true;
            router.dismissTo('/alerts');
          }
        },
      });
    } finally {
      ackingRef.current = false;
      setAcking(false);
    }
  }

  const card = alert ? (() => {
    const meta = alertTypeMeta(alert.type);
    const Icon = meta.Icon;
    const color = { 'danger-foreground': dangerForeground, background }[meta.onSolid];
    const statusClass = alert.status === 'acked'
      ? 'rounded-full bg-default px-2.5 py-1 text-xs font-bold text-muted'
      : alert.status === 'closed'
        ? `rounded-full ${CATEGORY_SLOTS.green.surface} px-2.5 py-1 text-xs font-extrabold ${CATEGORY_SLOTS.green.ink}`
        : `rounded-full px-2.5 py-0.75 text-xs font-extrabold ${meta.solid} ${meta.onSolidText}`;
    return (
      <Card variant="hero" testID="alert-detail-card" className={`${meta.disc} items-center gap-2 px-4.5 py-5.5`}>
        <View testID="alert-detail-disc" className={`size-18 items-center justify-center rounded-full ${meta.solid}`}>
          {alert.status === 'open' ? <AlertPingRing ring={meta.ring} /> : null}
          <View className={`size-18 items-center justify-center rounded-full ${meta.solid}`}>
            <Icon testID="alert-detail-icon" size={34} color={color} />
          </View>
        </View>
        <Text testID="alert-detail-status" className={statusClass}>
          {alert.status === 'acked' ? t('alerts.statusAcked') : alert.status === 'closed' ? t('alerts.statusClosed') : t('alerts.statusOpen')}
        </Text>
        <Text testID="alert-detail-type" className="text-22 font-black text-foreground text-center">
          {t(meta.labelKey)}
        </Text>
        <Text selectable testID="alert-detail-pet" className={'text-15 font-bold ' + meta.heroInk}>
          {alert.petName}
        </Text>
        <Text selectable testID="alert-detail-opened-at" className={'text-13 font-normal ' + meta.heroInk}>
          {t('alerts.openedAt', { date: new Date(alert.openedAt).toLocaleString(locale, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) })}
        </Text>
      </Card>
    );
  })() : null;

  return (
    <ScrollView
      testID="screen-alert-detail"
      className={position ? 'flex-1' : 'flex-1 bg-background'}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 40, gap: 14, flexGrow: 1 }}
    >
      <ScreenHeader testID="alert-detail" backFallback="/alerts" title={t('alerts.detailTitle')} />
      {alert ? (
        <>
          <HomeEntrance index={0} testID="alert-detail-card-entrance">{card}</HomeEntrance>
          {position ? <HomeEntrance index={1} testID="alert-detail-map-entrance"><AlertDetailMap alert={alert} position={position} /></HomeEntrance> : null}
          <Button
            testID="alert-detail-view-map"
            variant="secondary"
            accessibilityRole="button"
            className="h-13 rounded-16 border-2 border-lip-gray bg-surface" style={chunkyLip.neutral}
            onPress={() => {
              selectPet(alert.petId);
              router.dismissTo('/map');
            }}
          >
            <Map size={18} color={foreground} />
            <Button.Label className="text-base font-extrabold text-foreground">{t('alerts.viewOnMap')}</Button.Label>
          </Button>
          <View testID="alert-detail-spacer" className="flex-1" />
          {actionError ? (
            <Text selectable testID="alert-detail-action-error" className="text-danger">
              {actionError}
            </Text>
          ) : null}
          {alert.status === 'open' ? (
            <Button
              testID="alert-detail-ack"
              accessibilityRole="button"
              className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary}
              isDisabled={acking}
              onPress={() => void handleAck()}
            >
              <Text className="text-17 font-extrabold text-accent-foreground">{t('alerts.ack')}</Text>
            </Button>
          ) : null}
        </>
      ) : alerts.isPending || alerts.isFetching ? (
        <Skeleton testID="alert-detail-loading" className="h-58 w-full rounded-hero" />
      ) : firstPage && ['error', 'unreachable', 'missing-config'].includes(firstPage.kind) ? (
        <>
          <Text selectable testID="alert-detail-error" className="text-danger">
            {t('common.somethingWentWrong')}
          </Text>
          <Button testID="alert-detail-retry" className="h-13" onPress={() => void alerts.refetch()}>
            <Button.Label>{t('common.retry')}</Button.Label>
          </Button>
        </>
      ) : null}
    </ScrollView>
  );
}
