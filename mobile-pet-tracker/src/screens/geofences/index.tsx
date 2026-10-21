import { useChunkyLip } from '../../theme/chunky-lip';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Button, Skeleton, Switch } from 'heroui-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Map, Trash } from 'reicon-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GEOFENCE_MAX_PER_PET, deleteGeofence, listGeofences, setGeofenceActive, type Geofence, type GeofenceWriteState } from '../../api/geofences';
import { getPet } from '../../api/pets';
import { geofenceKeys, petKeys } from '../../api/query-keys';
import { Card } from '../../components/card';
import { EmptyState } from '../../components/empty-state';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { CATEGORY_SLOTS, zoneCategory } from '../../utils/category-palette';
import { HomeEntrance } from '../home/home-entrance';

export function GeofencesScreen({ petId }: { petId: string }) {
  const chunkyLip = useChunkyLip();
  const categoryColors = useThemeColors(['category-green-strong', 'category-blue-strong', 'category-amber-strong', 'category-violet-strong', 'category-rose-strong']);
  const [danger] = useThemeColors(['danger']);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { signOut, token } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const pet = useQuery({
    queryKey: petKeys.detail(petId),
    queryFn: () => getPet(baseUrl, token ?? '', petId),
  });
  const geofences = useQuery({
    queryKey: geofenceKeys.list(petId),
    queryFn: () => listGeofences(baseUrl, token ?? '', petId),
  });

  const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';
  const zoneCount = geofences.data?.kind === 'ok' ? geofences.data.geofences.length : 0;
  const atLimit = geofences.data?.kind === 'ok' && geofences.data.geofences.length >= GEOFENCE_MAX_PER_PET;

  async function write(request: () => Promise<GeofenceWriteState>) {
    setBusy(true);
    setActionError(null);
    try {
      const result = await request();
      switch (result.kind) {
        case 'ok':
        case 'not-found':
        case 'no-tracking':
          await geofences.refetch();
          break;
        case 'unauthorized':
          await signOut();
          break;
        case 'unreachable':
          setActionError(t('common.cannotReachServer'));
          break;
        case 'error':
        case 'missing-config':
          setActionError(t('common.somethingWentWrong'));
      }
    } catch {
      setActionError(t('common.somethingWentWrong'));
    } finally {
      setBusy(false);
    }
  }

  function confirmDelete(geofence: Geofence) {
    Alert.alert(
      t('geofences.deleteTitle', { name: geofence.name }),
      t('geofences.deleteBody'),
      [
        { text: t('geofences.cancel'), style: 'cancel' },
        {
          text: t('geofences.delete'), style: 'destructive',
          onPress: () => void write(() => deleteGeofence(baseUrl, token ?? '', petId, geofence.id)),
        },
      ],
    );
  }

  return (
    <ScrollView
      testID="screen-geofences"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: insets.bottom + 40, gap: 12, flexGrow: 1 }}
    >
      <View testID="geofences-header" className="flex-row items-center gap-2">
        <Text testID="geofences-title" accessibilityRole="header" className="flex-1 text-26 font-black tracking-title text-foreground">{t('geofences.title')}</Text>
        {geofences.data?.kind === 'ok' ? <Text testID="geofences-counter" className="text-sm font-extrabold text-muted">{t('geofences.counter', { count: geofences.data.geofences.length, max: GEOFENCE_MAX_PER_PET })}</Text> : null}
      </View>
      {geofences.data?.kind === 'ok' ? <View testID="geofences-progress" accessibilityRole="progressbar" className="flex-row gap-1"
        accessibilityLabel={t('geofences.progressLabel', { count: zoneCount, max: GEOFENCE_MAX_PER_PET })}
        accessibilityValue={{ min: 0, max: GEOFENCE_MAX_PER_PET, now: zoneCount }}>
        {Array.from({ length: GEOFENCE_MAX_PER_PET }, (_, index) => <View key={index} testID={`geofences-progress-segment-${index}`}
          className={index < zoneCount ? 'h-1.5 flex-1 rounded-full bg-accent' : 'h-1.5 flex-1 rounded-full bg-default'} />)}
      </View> : null}
      {geofences.data === undefined || pet.data === undefined ? (
        <Skeleton testID="geofences-loading" className="h-24 w-full rounded-card" />
      ) : geofences.data.kind === 'ok' ? (
        geofences.data.geofences.length === 0 ? (
          <EmptyState
            testID="geofences-empty"
            pose="collar"
            title={t('geofences.empty')}
            body={t('geofences.emptyBody')}
          />
        ) : geofences.data.geofences.map((geofence, position) => {
          const slot = zoneCategory(position);
          const tile = <View testID={`geofence-${geofence.id}-tile`} className={`size-11 items-center justify-center rounded-14 ${CATEGORY_SLOTS[slot].surface}`}
            style={CONTINUOUS_CORNER} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
            <Map size={22} color={categoryColors[position % 5]} />
          </View>;
          const nameAndRadius = <View className="min-w-0 flex-1">
            <Text testID={`geofence-${geofence.id}-name`} selectable={!isOwner} className="text-base font-extrabold text-foreground">{geofence.name}</Text>
            <Text testID={`geofence-${geofence.id}-radius`} className="text-xs font-normal text-muted">{t('geofences.radius', { meters: Math.round(geofence.radiusM) })}</Text>
          </View>;
          return <HomeEntrance key={geofence.id} testID={`geofence-${geofence.id}-entrance`} index={position}><Card testID={`geofence-${geofence.id}`} className="flex-row items-center gap-3 px-3.5 py-3 shadow-none">
            {isOwner ? (
              <Pressable testID={`geofence-${geofence.id}-edit`} accessibilityRole="button"
                accessibilityLabel={t('geofenceEditor.editLabel', { name: geofence.name })} disabled={busy}
                className="min-h-11 min-w-0 flex-1 flex-row items-center gap-3" style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                onPress={() => router.push({ pathname: '/pets/[petId]/geofence-editor', params: { petId, geofenceId: geofence.id } })}>
                {tile}{nameAndRadius}
              </Pressable>
            ) : <View testID={`geofence-${geofence.id}-text-row`} className="min-h-11 min-w-0 flex-1 flex-row items-center gap-3">{tile}{nameAndRadius}</View>}
            {isOwner ? (
              <>
              <Switch
                testID={`geofence-${geofence.id}-active`}
                isSelected={geofence.active}
                hitSlop={10}
                isDisabled={busy}
                accessibilityLabel={t('geofences.activeLabel', { name: geofence.name })}
                onSelectedChange={(active) => void write(() => setGeofenceActive(baseUrl, token ?? '', petId, geofence.id, active))}
              />
              <Pressable
                testID={`geofence-${geofence.id}-delete`} accessibilityRole="button"
                accessibilityLabel={t('geofences.deleteLabel', { name: geofence.name })}
                className="size-11 items-center justify-center rounded-xl bg-danger-soft"
                style={CONTINUOUS_CORNER} disabled={busy}
                onPress={() => confirmDelete(geofence)}
              >
                <Trash size={20} color={danger} />
              </Pressable>
              </>
            ) : (
              <Text testID={`geofence-${geofence.id}-status`} className="self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted">
                {geofence.active ? t('geofences.statusActive') : t('geofences.statusInactive')}
              </Text>
            )}
          </Card></HomeEntrance>;
        })
      ) : geofences.data.kind === 'no-tracking' ? (
        <EmptyState testID="geofences-no-tracking" pose="collar" title={t('geofences.noTrackingTitle')} body={t('geofences.noTrackingBody')} />
      ) : geofences.data.kind === 'unauthorized' ? null : (
        <>
          <Text testID="geofences-error" selectable className="text-danger">
            {geofences.data.kind === 'unreachable'
              ? t('common.cannotReachServer')
              : t('common.somethingWentWrong')}
          </Text>
          <Button testID="geofences-retry" className="min-h-11" onPress={() => void geofences.refetch()}>
            <Button.Label>{t('common.retry')}</Button.Label>
          </Button>
        </>
      )}
      {isOwner && geofences.data?.kind === 'ok' ? (
        <>
        {atLimit ? <HomeEntrance testID="geofences-limit-entrance" index={zoneCount}><Text testID="geofences-limit" className="text-sm font-normal text-muted">{t('geofenceEditor.limitNotice', { max: GEOFENCE_MAX_PER_PET })}</Text></HomeEntrance> : null}
        <Button testID="geofences-add" className="h-14 rounded-16 bg-accent" style={chunkyLip.primary} isDisabled={busy || atLimit}
          onPress={() => router.push({ pathname: '/pets/[petId]/geofence-editor', params: { petId } })}>
          <Text className="text-17 font-extrabold text-accent-foreground">{t('geofenceEditor.add')}</Text>
        </Button>

        </>
      ) : null}
      {actionError ? (
        <Text testID="geofences-action-error" selectable className="text-danger">{actionError}</Text>
      ) : null}
    </ScrollView>
  );
}
