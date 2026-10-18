import { useLocalSearchParams } from 'expo-router';
import { DocsScreen } from '../../../screens/docs';

export default function DocsRoute() {
  const { petId, uploaded } = useLocalSearchParams<{ petId: string; uploaded?: string }>();
  return <DocsScreen petId={petId} uploaded={uploaded} />;
}
