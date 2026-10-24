import { useChunkyLip } from '../../theme/chunky-lip';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Button, Input, Label, Skeleton, Slider, TextField } from 'heroui-native';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

import { createGeofence, deleteGeofence, listGeofences, setGeofenceActive, updateGeofence, type Geofence, type GeofenceSaveState, type GeofenceWriteState } from '../../api/geofences';
import { getPet } from '../../api/pets';
import { getLastPosition } from '../../api/positions';
import { geofenceKeys, petKeys, positionKeys } from '../../api/query-keys';
import { Card } from '../../components/card';
import { ScreenHeader } from '../../components/screen-header';
import { RiseIn } from '../../components/rise-in';
import { BackButton } from '../../components/back-button';
import { ConfirmDialog } from '../../components/confirm-dialog';
import { ToggleSwitch } from '../../components/toggle-switch';
import { DEFAULT_CENTER, PetMap, type MapCoordinates } from '../../components/pet-map';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { CONTINUOUS_CORNER, KEEP_OPACITY, TABULAR_NUMS } from '../../theme/native-styles';
import { useShadows } from '../../theme/shadows';
import { zoomForRadius } from '../../utils/zoom-for-radius';

const MIN_RADIUS = 20;
const MAX_RADIUS = 2000;
const STATE_TEXT = 'text-center text-15 leading-body text-muted';

function messageFor(t: ReturnType<typeof useTranslate>, kind: GeofenceSaveState['kind']): string {
  switch (kind) {
    case 'not-found': return t('geofenceEditor.notFound');
    case 'no-tracking': return t('geofences.needsCollar');
    case 'name-taken': return t('geofenceEditor.nameTaken');
    case 'limit-reached': return t('geofenceEditor.limitReached');
    case 'invalid': return t('geofenceEditor.invalid');
    case 'unreachable': return t('common.cannotReachServer');
    default: return t('common.somethingWentWrong');
  }
}

export function GeofenceEditorScreen({ petId, geofenceId }: { petId: string; geofenceId?: string }) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const list = useQuery({
    queryKey: geofenceKeys.list(petId),
    queryFn: () => listGeofences(baseUrl, token ?? '', petId),
  });
  const position = useQuery({
    queryKey: positionKeys.last(petId),
    queryFn: () => getLastPosition(baseUrl, token ?? '', petId),
    enabled: !geofenceId,
  });
  const pet = useQuery({ queryKey: petKeys.detail(petId), queryFn: () => getPet(baseUrl, token ?? '', petId) });
  const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';
  const zone = list.data?.kind === 'ok' ? list.data.geofences.find(({ id }) => id === geofenceId) : undefined;
  let content;
  if (list.data === undefined || (!geofenceId && position.data === undefined) || pet.data === undefined) {
    content = <View testID="geofence-editor-loading" className="gap-2.5" accessibilityLabel={t('geofenceEditor.loadingLabel')} accessibilityState={{ busy: true }}>
      <Skeleton testID="geofence-editor-loading-bar-0" className="h-12 w-full rounded-xl" />
      <Skeleton testID="geofence-editor-loading-bar-1" className="h-2 w-full rounded-full" />
      <Skeleton testID="geofence-editor-loading-bar-2" className="h-12 w-full rounded-16" />
    </View>;
  } else if (list.data.kind === 'no-tracking') {
    content = <Card testID="geofence-editor-no-tracking" className="items-center px-4 py-6">
      <Text className={STATE_TEXT}>{messageFor(t, 'no-tracking')}</Text>
    </Card>;
  } else if (list.data.kind === 'unauthorized') {
    content = null;
  } else if (list.data.kind !== 'ok') {
    content = <>
      <Text testID="geofence-editor-load-error" selectable className="text-danger">{messageFor(t, list.data.kind)}</Text>
      <Button testID="geofence-editor-retry" className="min-h-11" onPress={() => void list.refetch()}>
        <Button.Label>{t('common.retry')}</Button.Label>
      </Button>
    </>;
  } else if (geofenceId && !zone) {
    content = <Card testID="geofence-editor-not-found" className="items-center px-4 py-6">
      <Text className={STATE_TEXT}>{messageFor(t, 'not-found')}</Text>
    </Card>;
  } else if (!geofenceId && !isOwner) {
    content = <Card testID="geofence-editor-owner-only" className="items-center px-4 py-6">
      <Text className={STATE_TEXT}>{t('geofenceEditor.ownerOnly')}</Text>
    </Card>;
  } else {
    const last = position.data?.kind === 'ok' ? position.data.position : null;
    return <GeofenceEditorForm
      petId={petId} readOnly={!isOwner} zone={zone} geofences={list.data.geofences}
      initialName={zone?.name ?? ''} initialRadius={zone?.radiusM ?? 150}
      initialCenter={zone ? { latitude: zone.centerLat, longitude: zone.centerLng } : last ? { latitude: last.lat, longitude: last.lng } : DEFAULT_CENTER}
    />;
  }
  return <ScrollView testID="screen-geofence-editor" className="flex-1 bg-background"
    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40, gap: 12 }}>
    <ScreenHeader testID="geofence-editor-header" backFallback={{ pathname: '/pets/[petId]/geofences', params: { petId } }} title={t('geofenceEditor.title')} />
    {content}
  </ScrollView>;
}

function GeofenceEditorForm({ petId, readOnly, zone, geofences, initialName, initialCenter, initialRadius }: {
  petId: string; readOnly: boolean; zone?: Geofence; geofences: Geofence[]; initialName: string; initialCenter: MapCoordinates; initialRadius: number;
}) {
  const chunkyLip = useChunkyLip();
  const shadows = useShadows();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const { theme } = useUniwind();
  const queryClient = useQueryClient();
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(initialName);
  const [center, setCenter] = useState(initialCenter);
  const [radius, setRadius] = useState(initialRadius);
  const [camera, setCamera] = useState({ center: initialCenter, zoom: zoomForRadius(initialRadius) });
  const circles = geofences.map(({ id, centerLat, centerLng, radiusM }) => ({
    id, center: id === zone?.id && !readOnly ? center : { latitude: centerLat, longitude: centerLng },
    radius: id === zone?.id && !readOnly ? radius : radiusM,
  }));
  if (!zone) circles.push({ id: 'draft', center, radius });

  async function run(request: () => Promise<GeofenceSaveState | GeofenceWriteState>, onOk: () => unknown) {
    setBusy(true); setError(null);
    try {
      const result = await request();
      if (result.kind === 'ok') await onOk();
      else if (result.kind === 'unauthorized') await signOut();
      else setError(messageFor(t, result.kind));
    } catch { setError(messageFor(t, 'error')); } finally { setBusy(false); }
  }
  const refresh = () => queryClient.invalidateQueries({ queryKey: geofenceKeys.list(petId) });
  const leave = () => { void refresh(); router.back(); };
  const save = () => {
    const draft = { name: name.trim(), centerLat: center.latitude, centerLng: center.longitude, radiusM: radius };
    return run(() => zone
      ? updateGeofence(baseUrl, token ?? '', petId, zone.id, draft)
      : createGeofence(baseUrl, token ?? '', petId, draft), leave);
  };

  const deleteConfirmed = () => {
    if (!zone) return;
    setDeleteVisible(false);
    void run(() => deleteGeofence(baseUrl, token ?? '', petId, zone.id), leave);
  };

  const radiusValue = <Text testID="geofence-editor-radius-value" selectable style={TABULAR_NUMS} className={readOnly ? 'text-15 font-bold text-foreground' : 'text-sm font-extrabold text-accent-strong'}>{t('geofences.radius', { meters: Math.round(readOnly ? initialRadius : radius) })}</Text>;

  return <KeyboardAvoidingView testID="screen-geofence-editor" className="flex-1" behavior="padding" keyboardVerticalOffset={0}>
    <View testID="geofence-editor-map" className="flex-1">
      <PetMap onPress={readOnly ? undefined : setCenter} center={readOnly ? initialCenter : camera.center} zoom={readOnly ? zoomForRadius(initialRadius) : camera.zoom} marker={null} polylines={[]} circles={circles} colorScheme={theme === 'dark' ? 'dark' : 'light'} />
      <View testID="geofence-editor-title-row" className="absolute left-4 right-4 flex-row items-center gap-2.5" pointerEvents="box-none" style={{ top: insets.top + 8 }}>
      <BlurView testID="geofence-editor-back-blur" intensity={48} blurMethod="dimezisBlurViewSdk31Plus" tint={theme === 'dark' ? 'dark' : 'light'} className="size-11 items-center justify-center overflow-hidden rounded-full bg-glass-surface-strong" style={shadows.card}>
        <BackButton testID="geofence-editor-back" strokeWidth={2.4} fallback={{ pathname: '/pets/[petId]/geofences', params: { petId } }} />
      </BlurView>
      <BlurView testID="geofence-editor-title-blur" intensity={48} blurMethod="dimezisBlurViewSdk31Plus" tint={theme === 'dark' ? 'dark' : 'light'} className="self-start overflow-hidden rounded-full" style={shadows.card}>
        <Text testID="geofence-editor-title" accessibilityRole="header" className="bg-glass-surface-strong px-4 py-2.5 text-base font-extrabold text-foreground">{t('geofenceEditor.title')}</Text>
      </BlurView>
      </View>
      {readOnly ? null : <BlurView testID="geofence-editor-map-hint-blur" intensity={48} blurMethod="dimezisBlurViewSdk31Plus" tint={theme === 'dark' ? 'dark' : 'light'} className="absolute bottom-9 self-center overflow-hidden rounded-full">
        <Text testID="geofence-editor-map-hint" className="bg-glass-surface-strong px-3 py-1.5 text-xs font-bold text-foreground">{t('geofenceEditor.mapHint')}</Text>
      </BlurView>}
    </View>
    <RiseIn testID="geofence-editor-form-entrance" delayMs={0} className="-mt-6.5 shrink">
    <ScrollView testID="geofence-editor-form" className="rounded-t-hero bg-surface"
      style={[CONTINUOUS_CORNER, { flexGrow: 0, flexShrink: 1 }, shadows.sheet]} keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, gap: 14, paddingBottom: insets.bottom + 36 }}>
      <View testID="geofence-editor-grabber" className="h-1.25 w-10 self-center rounded-full bg-lip-gray" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden />
      {readOnly ? <Text testID="geofence-editor-name-text" selectable className="text-base font-extrabold text-foreground">{zone?.name}</Text> : <>
      <TextField>
        <Label><Label.Text className="text-sm font-extrabold text-foreground">{t('geofenceEditor.nameLabel')}</Label.Text></Label>
        <Input testID="geofence-editor-name" className="text-base font-semibold h-12.5 rounded-xl bg-default px-3.5" maxLength={120} value={name} onChangeText={setName} />
      </TextField>
      </>}
      {readOnly ? <>{radiusValue}<Text testID="geofence-editor-read-only" className="text-sm font-normal leading-body text-muted">{t('geofenceEditor.ownerOnly')}</Text></> : <>
      <View testID="geofence-editor-radius-block" className="gap-2">
      <View className="flex-row justify-between">
        <Text testID="geofence-editor-radius-label" className="text-sm font-extrabold text-foreground">{t('geofenceEditor.radiusTitle')}</Text>
        {radiusValue}
      </View>
      <Slider testID="geofence-editor-radius" value={radius} minValue={MIN_RADIUS} maxValue={MAX_RADIUS} step={10}
        onChange={(v) => setRadius(Array.isArray(v) ? v[0] : v)}
        onChangeEnd={(v) => setCamera({ center, zoom: zoomForRadius(Array.isArray(v) ? v[0] : v) })}>
        <Slider.Track><Slider.Fill /><Slider.Thumb testID="geofence-editor-radius-thumb" accessibilityLabel={t('geofenceEditor.radiusLabel')}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={({ nativeEvent: { actionName } }) => {
            if (actionName !== 'increment' && actionName !== 'decrement') return;
            const next = actionName === 'increment' ? Math.min(MAX_RADIUS, radius + 10) : Math.max(MIN_RADIUS, radius - 10);
            setRadius(next);
            setCamera({ center, zoom: zoomForRadius(next) });
          }} /></Slider.Track>
      </Slider>
      <View className="flex-row justify-between">
        <Text testID="geofence-editor-radius-min" className="text-11 font-semibold text-muted">{t('geofenceEditor.meters', { meters: MIN_RADIUS })}</Text>
        <Text testID="geofence-editor-radius-max" className="text-11 font-semibold text-muted">{t('geofenceEditor.meters', { meters: MAX_RADIUS })}</Text>
      </View>
      </View>
      {zone ? <View testID="geofence-editor-active-row" className="flex-row items-center justify-between gap-3">
        <Text className="text-15 font-bold text-foreground">{t('geofences.statusActive')}</Text>
        <ToggleSwitch testID="geofence-editor-active" isSelected={zone.active} hitSlop={10} isDisabled={busy} style={KEEP_OPACITY}
          accessibilityLabel={t('geofences.activeLabel', { name: zone.name })}
          onSelectedChange={(active) => void run(() => setGeofenceActive(baseUrl, token ?? '', petId, zone.id, active), refresh)} />
      </View> : null}
      {zone ? <Text testID="geofence-editor-reset-note" className="text-sm font-normal leading-body text-muted">{t('geofenceEditor.resetNote')}</Text> : null}
      <View testID="geofence-editor-actions" className="flex-row gap-2.5">
      {zone ? <Button testID="geofence-editor-delete" variant="outline" className="flex-1 h-13.5 rounded-16 border-2 border-lip-gray bg-surface" style={[chunkyLip.neutral, KEEP_OPACITY]} isDisabled={busy} onPress={() => setDeleteVisible(true)}>
        <Text className="text-base font-extrabold text-danger">{t('geofences.delete')}</Text>
      </Button> : null}
      <Button testID="geofence-editor-save" className={name.trim() === '' ? 'flex-2 h-13.5 rounded-16 bg-default' : 'flex-2 h-13.5 rounded-16 bg-accent'} style={name.trim() === '' ? KEEP_OPACITY : [chunkyLip.primary, KEEP_OPACITY]} isDisabled={busy || name.trim() === ''} onPress={() => void save()}>
        <Text className={name.trim() === '' ? 'text-17 font-extrabold text-muted' : 'text-17 font-extrabold text-accent-foreground'}>{t('geofenceEditor.save')}</Text>
      </Button>
      </View>
      {error ? <Text testID="geofence-editor-error" selectable className="text-sm leading-body text-danger">{error}</Text> : null}
      </>}
    </ScrollView>
    </RiseIn>
    <ConfirmDialog testID="geofence-editor-delete-dialog" visible={deleteVisible}
      title={t('geofences.deleteTitle', { name: zone?.name ?? '' })} body={t('geofences.deleteBody')}
      cancelLabel={t('geofences.cancel')} confirmLabel={t('geofences.delete')}
      onCancel={() => setDeleteVisible(false)} onConfirm={deleteConfirmed} />
  </KeyboardAvoidingView>;
}
