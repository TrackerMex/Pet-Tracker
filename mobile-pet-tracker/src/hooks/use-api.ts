import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '../providers/auth-provider';

export interface ApiResult<T> {
  data: T | undefined;
  refetch: () => void;
}

export function useApi<T extends { kind: string }>(
  fn: (() => Promise<T>) | null,
): ApiResult<T> {
  const { signOut } = useAuth();
  const [data, setData] = useState<T>();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    setData(undefined);

    if (fn) {
      void fn().then((result) => {
        if (!active) return;
        setData(result);
        if (result.kind === 'unauthorized') void signOut();
      });
    }

    return () => {
      active = false;
    };
  }, [fn, signOut, tick]);

  const refetch = useCallback(() => {
    setData(undefined);
    setTick((value) => value + 1);
  }, []);

  return { data, refetch };
}
