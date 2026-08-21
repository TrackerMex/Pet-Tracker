import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '../providers/auth-provider';

export interface ApiResult<T> {
  data: T | undefined;
  isRefreshing: boolean;
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

  // Stale-while-revalidate: al cambiar fn o refetch se conserva el último
  // valor resuelto (evita desmontar las cards) y se señala isRefreshing.
  const isCurrent =
    resolved !== undefined && resolved.fn === fn && resolved.tick === tick;
  const data = fn === null ? undefined : resolved?.value;
  const isRefreshing = fn !== null && resolved !== undefined && !isCurrent;

  return { data, isRefreshing, refetch };
}
