import { useQuery } from '@tanstack/react-query';
import { Button, Skeleton } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { listGeofences } from '../../api/geofences';
import { getPet } from '../../api/pets';
import { geofenceKeys, petKeys } from '../../api/query-keys';
import { Card } from '../../components/card';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';

export function GeofencesScreen({ petId }: { petId: string }) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const pet = useQuery({
    queryKey: petKeys.detail(petId),
    queryFn: () => getPet(baseUrl, token ?? '', petId),
  });
  const geofences = useQuery({
    queryKey: geofenceKeys.list(petId),
    queryFn: () => listGeofences(baseUrl, token ?? '', petId),
  });

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
          <Card testID="geofences-empty" className="items-center py-8">
            <Text className="text-center font-normal text-muted">{t('geofences.empty')}</Text>
          </Card>
        ) : geofences.data.geofences.map((geofence) => (
          <Card key={geofence.id} testID={`geofence-${geofence.id}`} className="flex-row items-center gap-3">
            <View className="min-w-0 flex-1 gap-1">
              <Text testID={`geofence-${geofence.id}-name`} selectable className="font-bold text-foreground">
                {geofence.name}
              </Text>
              <Text testID={`geofence-${geofence.id}-radius`} className="text-sm font-normal text-muted">
                {t('geofences.radius', { meters: Math.round(geofence.radiusM) })}
              </Text>
            </View>
          </Card>
        ))
      ) : geofences.data.kind === 'no-tracking' ? (
        <Card testID="geofences-no-tracking" className="items-center py-8">
          <Text>{t('geofences.needsCollar')}</Text>
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
    </ScrollView>
  );
}
