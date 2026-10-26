import { useLocalSearchParams } from 'expo-router';
import { VaccineCreateScreen } from '../../../../screens/vaccine-create';

export default function VaccineCreateRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  return <VaccineCreateScreen petId={petId} />;
}
