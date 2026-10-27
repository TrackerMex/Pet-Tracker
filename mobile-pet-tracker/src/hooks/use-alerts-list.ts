import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { listAlerts } from '../api/alerts';
import { alertKeys } from '../api/query-keys';
import { useAuth } from '../providers/auth-provider';

export function useAlertsList({ drain = false } = {}) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const query = useInfiniteQuery({
    queryKey: alertKeys.list(),
    queryFn: ({ pageParam }) =>
      listAlerts(baseUrl, token ?? '', undefined, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.kind === 'ok' && lastPage.nextCursor !== null
        ? lastPage.nextCursor
        : undefined,
  });
  const { fetchNextPage, hasNextPage, isFetching, isError } = query;
  useEffect(() => {
    if (drain && hasNextPage && !isFetching && !isError) void fetchNextPage();
  }, [drain, fetchNextPage, hasNextPage, isFetching, isError]);
  return query;
}
