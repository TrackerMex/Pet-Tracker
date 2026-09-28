import { useInfiniteQuery } from '@tanstack/react-query';

import { listAlerts } from '../api/alerts';
import { alertKeys } from '../api/query-keys';
import { useAuth } from '../providers/auth-provider';

export function useAlertsList() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  return useInfiniteQuery({
    queryKey: alertKeys.list(),
    queryFn: ({ pageParam }) =>
      listAlerts(baseUrl, token ?? '', undefined, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.kind === 'ok' && lastPage.nextCursor !== null
        ? lastPage.nextCursor
        : undefined,
  });
}
