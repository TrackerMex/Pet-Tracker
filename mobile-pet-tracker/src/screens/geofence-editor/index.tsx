import { useChunkyLip } from '../../theme/chunky-lip';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { router, Stack } from 'expo-router';
import { Button, Input, Label, Skeleton, Slider, Switch, TextField } from 'heroui-native';
import { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

import { createGeofence, deleteGeofence, listGeofences, setGeofenceActive, updateGeofence, type Geofence, type GeofenceSaveState, type GeofenceWriteState } from '../../api/geofences';
import { getPet } from '../../api/pets';
import { getLastPosition } from '../../api/positions';
import { geofenceKeys, petKeys, positionKeys } from '../../api/query-keys';
import { Card } from '../../components/card';
import { DEFAULT_CENTER, PetMap, type MapCoordinates } from '../../components/pet-map';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { EDITOR_PILL_LEFT, HEADER_BAR_HEIGHT, TRANSPARENT_HEADER_OPTIONS } from '../../theme/header-layout';
import { CONTINUOUS_CORNER, KEEP_OPACITY, TABULAR_NUMS } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { zoomForRadius } from '../../utils/zoom-for-radius';

const MIN_RADIUS = 20;
const MAX_RADIUS = 2000;

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
  const [background] = useThemeColors(['background']);
  const opaqueHeader = useMemo(() => ({ headerTransparent: false, headerStyle: { backgroundColor: background } }), [background]);
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
    content = <Skeleton testID="geofence-editor-loading" className="h-24 w-full rounded-card" />;
  } else if (list.data.kind === 'no-tracking') {
    content = <Card testID="geofence-editor-no-tracking" className="items-center py-8">
      <Text className="text-center font-normal text-muted">{messageFor(t, 'no-tracking')}</Text>
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
    content = <Card testID="geofence-editor-not-found" className="items-center py-8">
      <Text className="text-center font-normal text-muted">{messageFor(t, 'not-found')}</Text>
    </Card>;
  } else if (!geofenceId && !isOwner) {
    content = <Card testID="geofence-editor-owner-only" className="items-center py-8">
      <Text className="text-center font-normal text-muted">{t('geofenceEditor.ownerOnly')}</Text>
    </Card>;
  } else {
    const last = position.data?.kind === 'ok' ? position.data.position : null;
    return <GeofenceEditorForm
      petId={petId} readOnly={!isOwner} zone={zone} geofences={list.data.geofences}
      initialName={zone?.name ?? ''} initialRadius={zone?.radiusM ?? 150}
      initialCenter={zone ? { latitude: zone.centerLat, longitude: zone.centerLng } : last ? { latitude: last.lat, longitude: last.lng } : DEFAULT_CENTER}
    />;
  }
  return <>
    <Stack.Screen options={opaqueHeader} />
    <ScrollView testID="screen-geofence-editor" className="flex-1 bg-background"
    contentInsetAdjustmentBehavior="automatic"
    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: insets.bottom + 40, gap: 12 }}>
    <Text testID="geofence-editor-title" accessibilityRole="header" className="text-26 font-black tracking-title text-foreground">{t('geofenceEditor.title')}</Text>
    {content}
  </ScrollView></>;
}

function GeofenceEditorForm({ petId, readOnly, zone, geofences, initialName, initialCenter, initialRadius }: {
  petId: string; readOnly: boolean; zone?: Geofence; geofences: Geofence[]; initialName: string; initialCenter: MapCoordinates; initialRadius: number;
}) {
  const chunkyLip = useChunkyLip();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const { theme } = useUniwind();
  const queryClient = useQueryClient();
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
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

  const confirmDelete = () => {
    if (!zone) return;
    Alert.alert(t('geofences.deleteTitle', { name: zone.name }), t('geofences.deleteBody'), [
      { text: t('geofences.cancel'), style: 'cancel' },
      { text: t('geofences.delete'), style: 'destructive',
        onPress: () => void run(() => deleteGeofence(baseUrl, token ?? '', petId, zone.id), leave) },
    ]);
  };

  const radiusValue = <Text testID="geofence-editor-radius-value" selectable style={TABULAR_NUMS} className={readOnly ? 'font-bold text-foreground' : 'text-sm font-extrabold text-accent-strong'}>{t('geofences.radius', { meters: Math.round(readOnly ? initialRadius : radius) })}</Text>;

  return <>
    <Stack.Screen options={TRANSPARENT_HEADER_OPTIONS} />
    <KeyboardAvoidingView testID="screen-geofence-editor" className="flex-1" behavior="padding" keyboardVerticalOffset={0}>
    <View testID="geofence-editor-map" className="flex-1">
      <PetMap onPress={readOnly ? undefined : setCenter} center={readOnly ? initialCenter : camera.center} zoom={readOnly ? zoomForRadius(initialRadius) : camera.zoom} marker={null} polylines={[]} circles={circles} colorScheme={theme === 'dark' ? 'dark' : 'light'} />
      <View testID="geofence-editor-title-row" className="absolute justify-center" pointerEvents="box-none" style={{ top: insets.top, left: EDITOR_PILL_LEFT, height: HEADER_BAR_HEIGHT }}>
      <BlurView testID="geofence-editor-title-blur" intensity={48} blurMethod="dimezisBlurViewSdk31Plus" tint={theme === 'dark' ? 'dark' : 'light'} className="self-start overflow-hidden rounded-full">
        <Text testID="geofence-editor-title" accessibilityRole="header" className="bg-glass-surface-strong px-4 py-2.5 text-base font-extrabold text-foreground">{t('geofenceEditor.title')}</Text>
      </BlurView>
      </View>
      {readOnly ? null : <BlurView testID="geofence-editor-map-hint-blur" intensity={48} blurMethod="dimezisBlurViewSdk31Plus" tint={theme === 'dark' ? 'dark' : 'light'} className="absolute bottom-9 self-center overflow-hidden rounded-full">
        <Text testID="geofence-editor-map-hint" className="bg-glass-surface-strong px-3 py-1.5 text-xs font-bold text-foreground">{t('geofenceEditor.mapHint')}</Text>
      </BlurView>}
    </View>
    <ScrollView testID="geofence-editor-form" className="-mt-6.5 rounded-t-hero bg-surface"
      style={[CONTINUOUS_CORNER, { flexGrow: 0, flexShrink: 1 }]} keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, gap: 14, paddingBottom: insets.bottom + 36 }}>
      <View testID="geofence-editor-grabber" className="h-1.25 w-10 self-center rounded-full bg-lip-gray" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden />
      {readOnly ? <Text testID="geofence-editor-name-text" selectable className="text-base font-extrabold text-foreground">{zone?.name}</Text> : <>
      <TextField>
        <Label><Label.Text className="text-sm font-extrabold text-foreground">{t('geofenceEditor.nameLabel')}</Label.Text></Label>
        <Input testID="geofence-editor-name" className="h-12.5 rounded-xl bg-default px-3.5" maxLength={120} value={name} onChangeText={setName} />
      </TextField>
      </>}
      {readOnly ? <>{radiusValue}<Text testID="geofence-editor-read-only" className="text-sm font-normal text-muted">{t('geofenceEditor.ownerOnly')}</Text></> : <>
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
        <Switch testID="geofence-editor-active" isSelected={zone.active} hitSlop={10} isDisabled={busy} style={KEEP_OPACITY}
          accessibilityLabel={t('geofences.activeLabel', { name: zone.name })}
          onSelectedChange={(active) => void run(() => setGeofenceActive(baseUrl, token ?? '', petId, zone.id, active), refresh)} />
      </View> : null}
      {zone ? <Text testID="geofence-editor-reset-note" className="text-sm font-normal text-muted">{t('geofenceEditor.resetNote')}</Text> : null}
      <View testID="geofence-editor-actions" className="flex-row gap-2.5">
      {zone ? <Button testID="geofence-editor-delete" variant="outline" className="flex-1 h-14 rounded-16 border-2 border-lip-gray bg-surface" style={[chunkyLip.neutral, KEEP_OPACITY]} isDisabled={busy} onPress={confirmDelete}>
        <Text className="text-base font-extrabold text-danger">{t('geofences.delete')}</Text>
      </Button> : null}
      <Button testID="geofence-editor-save" className={name.trim() === '' ? 'flex-2 h-14 rounded-16 bg-default' : 'flex-2 h-14 rounded-16 bg-accent'} style={name.trim() === '' ? KEEP_OPACITY : [chunkyLip.primary, KEEP_OPACITY]} isDisabled={busy || name.trim() === ''} onPress={() => void save()}>
        <Text className={name.trim() === '' ? 'text-17 font-extrabold text-muted' : 'text-17 font-extrabold text-accent-foreground'}>{t('geofenceEditor.save')}</Text>
      </Button>
      </View>
      {error ? <Text testID="geofence-editor-error" selectable className="text-danger">{error}</Text> : null}
      </>}
    </ScrollView>
  </KeyboardAvoidingView></>;
}
