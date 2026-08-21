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
  const [resolved, setResolved] = useState<{
    fn: typeof fn;
    tick: number;
    value: T;
  }>();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;

    if (fn) {
      void fn().then((result) => {
        if (!active) return;
        setResolved({ fn, tick, value: result });
        if (result.kind === 'unauthorized') void signOut();
      });
    }

    return () => {
      active = false;
    };
  }, [fn, signOut, tick]);

  const refetch = useCallback(() => {
    setTick((value) => value + 1);
  }, []);

  const data =
    resolved?.fn === fn && resolved.tick === tick ? resolved.value : undefined;

  return { data, refetch };
}
