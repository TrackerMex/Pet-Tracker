import { useLocalSearchParams } from 'expo-router';
import { DocsUploadFormScreen } from '../../../screens/docs-upload-form';

export default function DocsUploadRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  return <DocsUploadFormScreen petId={petId} />;
}
