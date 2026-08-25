import { useLocalSearchParams } from 'expo-router';
import { DocsScreen } from '../../../../screens/docs';

export default function DocsRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  return <DocsScreen petId={petId} />;
}
