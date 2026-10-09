import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Button, Skeleton, Switch } from 'heroui-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GEOFENCE_MAX_PER_PET, deleteGeofence, listGeofences, setGeofenceActive, type Geofence, type GeofenceWriteState } from '../../api/geofences';
import { getPet } from '../../api/pets';
import { geofenceKeys, petKeys } from '../../api/query-keys';
import { Card } from '../../components/card';
import { EmptyState } from '../../components/empty-state';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';

export function GeofencesScreen({ petId }: { petId: string }) {
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
      contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}
    >
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
        ) : geofences.data.geofences.map((geofence) => {
          const nameAndRadius = <>
            <Text testID={`geofence-${geofence.id}-name`} selectable={!isOwner} className="font-bold text-foreground">{geofence.name}</Text>
            <Text testID={`geofence-${geofence.id}-radius`} className="text-sm font-normal text-muted">{t('geofences.radius', { meters: Math.round(geofence.radiusM) })}</Text>
          </>;
          return <Card key={geofence.id} testID={`geofence-${geofence.id}`} className="flex-row items-center gap-3">
            {isOwner ? (
              <Pressable testID={`geofence-${geofence.id}-edit`} accessibilityRole="button"
                accessibilityLabel={t('geofenceEditor.editLabel', { name: geofence.name })} disabled={busy}
                className="min-h-11 min-w-0 flex-1 gap-1" style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                onPress={() => router.push({ pathname: '/pets/[petId]/geofence-editor', params: { petId, geofenceId: geofence.id } })}>
                {nameAndRadius}
              </Pressable>
            ) : <View className="min-w-0 flex-1 gap-1">{nameAndRadius}</View>}
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
              <Button
                testID={`geofence-${geofence.id}-delete`}
                variant="danger-soft"
                size="sm"
                className="min-h-11 rounded-xl bg-danger-soft"
                isDisabled={busy}
                onPress={() => confirmDelete(geofence)}
              >
                <Button.Label className="font-semibold text-danger">{t('geofences.delete')}</Button.Label>
              </Button>
              </>
            ) : (
              <Text testID={`geofence-${geofence.id}-status`} className="self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted">
                {geofence.active ? t('geofences.statusActive') : t('geofences.statusInactive')}
              </Text>
            )}
          </Card>;
        })
      ) : geofences.data.kind === 'no-tracking' ? (
        <Card testID="geofences-no-tracking" className="items-center py-8">
          <Text className="text-center font-normal text-muted">{t('geofences.needsCollar')}</Text>
        </Card>
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
        <Button testID="geofences-add" className="rounded-xl bg-accent" isDisabled={busy || atLimit}
          onPress={() => router.push({ pathname: '/pets/[petId]/geofence-editor', params: { petId } })}>
          <Button.Label className="font-bold text-accent-foreground">{t('geofenceEditor.add')}</Button.Label>
        </Button>
        {atLimit ? <Text testID="geofences-limit" className="text-sm font-normal text-muted">{t('geofenceEditor.limitNotice', { max: GEOFENCE_MAX_PER_PET })}</Text> : null}
        </>
      ) : null}
      {actionError ? (
        <Text testID="geofences-action-error" selectable className="text-danger">{actionError}</Text>
      ) : null}
    </ScrollView>
  );
}
