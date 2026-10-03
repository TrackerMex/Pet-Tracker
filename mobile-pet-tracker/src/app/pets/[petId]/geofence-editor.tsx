import { useLocalSearchParams } from 'expo-router';
import { GeofenceEditorScreen } from '../../../screens/geofence-editor';

export default function GeofenceEditorRoute() {
  const { petId, geofenceId } = useLocalSearchParams<{ petId: string; geofenceId?: string }>();
  return <GeofenceEditorScreen petId={petId} geofenceId={geofenceId} />;
}
