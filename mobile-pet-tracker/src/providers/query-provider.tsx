import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { type ReactNode, useRef, useState } from 'react';

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
        gcTime: 5 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const { signOut } = useAuth();
  const signOutRef = useRef(signOut);
  signOutRef.current = signOut;
  const [client] = useState(() =>
    createQueryClient(() => void signOutRef.current()),
  );

  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}
