import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { useApi, type ApiResult } from '../use-api';

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = jest.mocked(useAuth);
const mockSignOut = jest.fn<Promise<void>, []>();

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });

  return { promise, resolve };
}

describe('R4: useApi ejecuta, refetch y expulsa 401', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignOut.mockResolvedValue();
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: mockSignOut,
    } satisfies AuthContextValue);
  });

  it('exposes undefined while loading and the result after it resolves', async () => {
    const request = deferred<{ kind: 'ok'; value: number }>();
    const fn = jest.fn(() => request.promise);
    const { result } = await renderHook(() => useApi(fn));

    expect(result.current.data).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(1);

    await act(async () => request.resolve({ kind: 'ok', value: 7 }));

    expect(result.current.data).toEqual({ kind: 'ok', value: 7 });
  });

  it('keeps the previous data and flags refreshing during refetch', async () => {
    const nextRequest = deferred<{ kind: 'ok'; value: number }>();
    const fn = jest
      .fn<Promise<{ kind: 'ok'; value: number }>, []>()
      .mockResolvedValueOnce({ kind: 'ok', value: 1 })
      .mockReturnValueOnce(nextRequest.promise);
    const { result } = await renderHook(() => useApi(fn));

    await waitFor(() => expect(result.current.data).toEqual({ kind: 'ok', value: 1 }));
    expect(result.current.isRefreshing).toBe(false);

    await act(() => result.current.refetch());
    expect(result.current.data).toEqual({ kind: 'ok', value: 1 });
    expect(result.current.isRefreshing).toBe(true);

    await act(async () => nextRequest.resolve({ kind: 'ok', value: 2 }));
    await waitFor(() => expect(result.current.data).toEqual({ kind: 'ok', value: 2 }));
    expect(result.current.isRefreshing).toBe(false);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('clears previous data while a new fn identity is loading', async () => {
    type SwapResult = { kind: 'ok'; value: string };
    type SwapProps = { fn: () => Promise<SwapResult> };
    const newRequest = deferred<SwapResult>();
    const oldFn = jest
      .fn<Promise<SwapResult>, []>()
      .mockResolvedValue({ kind: 'ok', value: 'pet-1' });
    const newFn = jest.fn(() => newRequest.promise);
    const { result, rerender } = await renderHook<ApiResult<SwapResult>, SwapProps>(
      ({ fn }) => useApi(fn),
      { initialProps: { fn: oldFn } },
    );

    await waitFor(() => expect(result.current.data).toEqual({ kind: 'ok', value: 'pet-1' }));

    await rerender({ fn: newFn });
    expect(result.current.data).toBeUndefined();
    expect(result.current.isRefreshing).toBe(false);

    await act(async () => newRequest.resolve({ kind: 'ok', value: 'pet-2' }));
    await waitFor(() => expect(result.current.data).toEqual({ kind: 'ok', value: 'pet-2' }));
    expect(result.current.isRefreshing).toBe(false);
  });

  it('discards an old response when fn changes identity', async () => {
    type RaceResult = { kind: 'ok'; value: string };
    type RaceProps = { fn: () => Promise<RaceResult> };
    const oldRequest = deferred<RaceResult>();
    const newRequest = deferred<RaceResult>();
    const oldFn = jest.fn(() => oldRequest.promise);
    const newFn = jest.fn(() => newRequest.promise);
    const { result, rerender } = await renderHook<ApiResult<RaceResult>, RaceProps>(
      ({ fn }) => useApi(fn),
      { initialProps: { fn: oldFn } },
    );

    await rerender({ fn: newFn });
    await act(async () => oldRequest.resolve({ kind: 'ok', value: 'old' }));
    expect(result.current.data).toBeUndefined();

    await act(async () => newRequest.resolve({ kind: 'ok', value: 'new' }));
    expect(result.current.data).toEqual({ kind: 'ok', value: 'new' });
  });

  it('does not execute while fn is null', async () => {
    const { result } = await renderHook(() => useApi(null));

    expect(result.current.data).toBeUndefined();
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it('signs out after an unauthorized result', async () => {
    const fn = jest.fn().mockResolvedValue({ kind: 'unauthorized' as const });
    const { result } = await renderHook(() => useApi(fn));

    await waitFor(() => expect(result.current.data).toEqual({ kind: 'unauthorized' }));
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
