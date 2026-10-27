import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { listAlerts, type AlertsState } from '../api/alerts';
import { useAuth } from '../providers/auth-provider';
import { createQueryClient } from '../providers/query-provider';
import { useAlertsList } from './use-alerts-list';

jest.mock('../api/alerts', () => ({ listAlerts: jest.fn() }));
jest.mock('../providers/auth-provider', () => ({ useAuth: jest.fn() }));

const baseUrl = 'http://example.test/v1';
const mockListAlerts = jest.mocked(listAlerts);

function deferred() {
  let resolve!: (page: AlertsState) => void;
  const promise = new Promise<AlertsState>((finish) => { resolve = finish; });
  return { promise, resolve };
}

function queryWrapper() {
  const queryClient = createQueryClient(undefined, 0);
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return { queryClient, wrapper: Wrapper };
}

beforeEach(() => {
  mockListAlerts.mockReset();
  process.env.EXPO_PUBLIC_API_URL = baseUrl;
  jest.mocked(useAuth).mockReturnValue({
    status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
  });
});

it('#223 R1: con drain pide cada página con su cursor, de una en una, hasta nextCursor null', async () => {
  const first = deferred();
  const second = deferred();
  const third = deferred();
  mockListAlerts.mockReturnValueOnce(first.promise)
    .mockReturnValueOnce(second.promise).mockReturnValueOnce(third.promise);
  const { wrapper } = queryWrapper();
  const { result } = await renderHook(() => useAlertsList({ drain: true }), { wrapper });
  expect(mockListAlerts).toHaveBeenCalledTimes(1);
  expect(mockListAlerts).toHaveBeenNthCalledWith(1, baseUrl, 'jwt-token', undefined, undefined);
  expect(result.current.data).toBeUndefined();

  await act(async () => first.resolve({ kind: 'ok', items: [], nextCursor: 'c1' }));
  await waitFor(() => {
    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.isFetchingNextPage).toBe(true);
  });
  expect(mockListAlerts).toHaveBeenCalledTimes(2);
  expect(mockListAlerts).toHaveBeenNthCalledWith(2, baseUrl, 'jwt-token', undefined, 'c1');

  await act(async () => second.resolve({ kind: 'ok', items: [], nextCursor: 'c2' }));
  await waitFor(() => {
    expect(result.current.data?.pages).toHaveLength(2);
    expect(result.current.isFetchingNextPage).toBe(true);
  });
  expect(mockListAlerts).toHaveBeenCalledTimes(3);
  expect(mockListAlerts).toHaveBeenNthCalledWith(3, baseUrl, 'jwt-token', undefined, 'c2');

  await act(async () => third.resolve({ kind: 'ok', items: [], nextCursor: null }));
  await waitFor(() => {
    expect(result.current.data?.pages).toHaveLength(3);
    expect(result.current.isFetching).toBe(false);
  });
  expect(mockListAlerts).toHaveBeenCalledTimes(3);
});

it("#223 R2: sin drain pide una sola página aunque haya nextCursor y usa la clave ['alerts','list']", async () => {
  for (const options of [undefined, { drain: false }]) {
    mockListAlerts.mockReset()
      .mockResolvedValueOnce({ kind: 'ok', items: [], nextCursor: 'c1' })
      .mockResolvedValueOnce({ kind: 'ok', items: [], nextCursor: null });
    const { queryClient, wrapper } = queryWrapper();
    const { result, unmount } = await renderHook(() => useAlertsList(options), { wrapper });
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(1));
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 20)); });
    expect(mockListAlerts).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryData(['alerts', 'list'])).toBeDefined();
    await unmount();
  }
});

it.each(['error', 'unreachable', 'missing-config', 'unauthorized'] as const)(
  '#223 R3: %s corta el drenado y conserva las páginas previas', async (kind) => {
    const first: AlertsState = { kind: 'ok', items: [], nextCursor: 'c1' };
    const failure: AlertsState = kind === 'unreachable' ? { kind, message: 'offline' } : { kind };
    const second = deferred();
    mockListAlerts.mockReturnValue(deferred().promise)
      .mockResolvedValueOnce(first).mockReturnValueOnce(second.promise);
    const { wrapper } = queryWrapper();
    const { result, rerender } = await renderHook(() => useAlertsList({ drain: true }), { wrapper });
    await waitFor(() => {
      expect(result.current.data?.pages).toEqual([first]);
      expect(result.current.isFetchingNextPage).toBe(true);
    });
    await act(async () => second.resolve(failure));
    await waitFor(() => {
      expect(result.current.data?.pages).toEqual([first, failure]);
      expect(result.current.isFetching).toBe(false);
    });
    await rerender(undefined);
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 20)); });
    expect(result.current.data?.pages).toHaveLength(2);
    expect(mockListAlerts).toHaveBeenCalledTimes(2);
  },
);
