import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import { useAuth } from './auth-provider';

function isUnauthorized(data: unknown): boolean {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as { kind?: unknown }).kind === 'unauthorized'
  );
}

export function createQueryClient(
  onUnauthorized: () => void = () => undefined,
  gcTime = 5 * 60 * 1000,
): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onSuccess: (data) => {
        if (isUnauthorized(data)) onUnauthorized();
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 0,
        gcTime,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const { signOut, status } = useAuth();
  const signOutRef = useRef(signOut);
  /* eslint-disable react-hooks/refs -- QueryCache invokes this callback after render; the ref keeps the latest auth action. */
  signOutRef.current = signOut;
  const [client] = useState(() =>
    createQueryClient(() => void signOutRef.current()),
  );
  /* eslint-enable react-hooks/refs */

  useEffect(() => {
    if (status === 'unauthenticated') client.clear();
  }, [status, client]);

  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}
