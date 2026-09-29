import { useLocalSearchParams } from 'expo-router';

import { AlertDetailScreen } from '../../screens/alert-detail';

export default function AlertDetailRoute() {
  const { alertId } = useLocalSearchParams<{ alertId: string }>();
  return <AlertDetailScreen alertId={alertId} />;
}
