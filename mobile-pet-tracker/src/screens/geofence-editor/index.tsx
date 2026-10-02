import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { Button, Input, Label, Skeleton, Slider, Switch, TextField } from 'heroui-native';
import { useContext, useState } from 'react';
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
import { TABULAR_NUMS } from '../../theme/native-styles';
import { zoomForRadius } from '../../utils/zoom-for-radius';

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
  return <ScrollView testID="screen-geofence-editor" className="flex-1 bg-background"
    contentInsetAdjustmentBehavior="automatic"
    contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}>
    {content}
  </ScrollView>;
}

function GeofenceEditorForm({ petId, readOnly, zone, geofences, initialName, initialCenter, initialRadius }: {
  petId: string; readOnly: boolean; zone?: Geofence; geofences: Geofence[]; initialName: string; initialCenter: MapCoordinates; initialRadius: number;
}) {
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const headerHeight = useContext(HeaderHeightContext);
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

  return <KeyboardAvoidingView testID="screen-geofence-editor" className="flex-1" behavior="padding" keyboardVerticalOffset={headerHeight}>
    <View testID="geofence-editor-map" className="flex-1">
      <PetMap onPress={readOnly ? undefined : setCenter} center={readOnly ? initialCenter : camera.center} zoom={readOnly ? zoomForRadius(initialRadius) : camera.zoom} marker={null} polylines={[]} circles={circles} colorScheme={theme === 'dark' ? 'dark' : 'light'} />
    </View>
    <ScrollView testID="geofence-editor-form" className="bg-background"
      style={{ flexGrow: 0, flexShrink: 1 }} keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}>
      {readOnly ? <Text testID="geofence-editor-name-text" selectable className="font-bold text-foreground">{zone?.name}</Text> : <>
      <TextField>
        <Label className="text-xs font-semibold text-foreground">{t('geofenceEditor.nameLabel')}</Label>
        <Input testID="geofence-editor-name" className="rounded-xl bg-default" maxLength={120} value={name} onChangeText={setName} />
      </TextField>
      <Text testID="geofence-editor-map-hint" className="text-sm font-normal text-muted">{t('geofenceEditor.mapHint')}</Text>
      </>}
      <Text testID="geofence-editor-radius-value" selectable style={TABULAR_NUMS} className="font-bold text-foreground">{t('geofences.radius', { meters: Math.round(readOnly ? initialRadius : radius) })}</Text>
      {readOnly ? <Text testID="geofence-editor-read-only" className="text-sm font-normal text-muted">{t('geofenceEditor.ownerOnly')}</Text> : <>
      <Slider testID="geofence-editor-radius" value={radius} minValue={20} maxValue={2000} step={10}
        onChange={(v) => setRadius(Array.isArray(v) ? v[0] : v)}
        onChangeEnd={(v) => setCamera({ center, zoom: zoomForRadius(Array.isArray(v) ? v[0] : v) })}>
        <Slider.Track><Slider.Fill /><Slider.Thumb testID="geofence-editor-radius-thumb" accessibilityLabel={t('geofenceEditor.radiusLabel')}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={({ nativeEvent: { actionName } }) => {
            if (actionName !== 'increment' && actionName !== 'decrement') return;
            const next = actionName === 'increment' ? Math.min(2000, radius + 10) : Math.max(20, radius - 10);
            setRadius(next);
            setCamera({ center, zoom: zoomForRadius(next) });
          }} /></Slider.Track>
      </Slider>
      {zone ? <View testID="geofence-editor-active-row" className="flex-row items-center justify-between gap-3">
        <Text className="font-semibold text-foreground">{t('geofences.statusActive')}</Text>
        <Switch testID="geofence-editor-active" isSelected={zone.active} hitSlop={10} isDisabled={busy}
          accessibilityLabel={t('geofences.activeLabel', { name: zone.name })}
          onSelectedChange={(active) => void run(() => setGeofenceActive(baseUrl, token ?? '', petId, zone.id, active), refresh)} />
      </View> : null}
      {zone ? <Text testID="geofence-editor-reset-note" className="text-sm font-normal text-muted">{t('geofenceEditor.resetNote')}</Text> : null}
      <Button testID="geofence-editor-save" className="rounded-xl bg-accent" isDisabled={busy || name.trim() === ''} onPress={() => void save()}>
        <Button.Label className="font-bold text-accent-foreground">{t('geofenceEditor.save')}</Button.Label>
      </Button>
      {zone ? <Button testID="geofence-editor-delete" variant="danger-soft" className="rounded-xl bg-danger-soft" isDisabled={busy} onPress={confirmDelete}>
        <Button.Label className="font-semibold text-danger">{t('geofences.delete')}</Button.Label>
      </Button> : null}
      {error ? <Text testID="geofence-editor-error" selectable className="text-danger">{error}</Text> : null}
      </>}
    </ScrollView>
  </KeyboardAvoidingView>;
}
