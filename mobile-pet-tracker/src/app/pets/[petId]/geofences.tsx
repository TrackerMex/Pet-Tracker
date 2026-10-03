import { useLocalSearchParams } from 'expo-router';
import { GeofencesScreen } from '../../../screens/geofences';
export default function GeofencesRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  return <GeofencesScreen petId={petId} />;
}
