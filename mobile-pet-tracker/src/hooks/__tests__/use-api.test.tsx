import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { useApi } from '../use-api';

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
    const { result } = renderHook(() => useApi(fn));

    expect(result.current.data).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(1);

    await act(async () => request.resolve({ kind: 'ok', value: 7 }));

    expect(result.current.data).toEqual({ kind: 'ok', value: 7 });
  });

  it('resets loading state and executes again on refetch', async () => {
    const fn = jest
      .fn<Promise<{ kind: 'ok'; value: number }>, []>()
      .mockResolvedValueOnce({ kind: 'ok', value: 1 })
      .mockResolvedValueOnce({ kind: 'ok', value: 2 });
    const { result } = renderHook(() => useApi(fn));

    await waitFor(() => expect(result.current.data).toEqual({ kind: 'ok', value: 1 }));

    act(() => result.current.refetch());
    expect(result.current.data).toBeUndefined();

    await waitFor(() => expect(result.current.data).toEqual({ kind: 'ok', value: 2 }));
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('discards an old response when fn changes identity', async () => {
    const oldRequest = deferred<{ kind: 'ok'; value: string }>();
    const newRequest = deferred<{ kind: 'ok'; value: string }>();
    const oldFn = jest.fn(() => oldRequest.promise);
    const newFn = jest.fn(() => newRequest.promise);
    const { result, rerender } = renderHook(
      ({ fn }) => useApi(fn),
      { initialProps: { fn: oldFn } },
    );

    rerender({ fn: newFn });
    await act(async () => oldRequest.resolve({ kind: 'ok', value: 'old' }));
    expect(result.current.data).toBeUndefined();

    await act(async () => newRequest.resolve({ kind: 'ok', value: 'new' }));
    expect(result.current.data).toEqual({ kind: 'ok', value: 'new' });
  });

  it('does not execute while fn is null', () => {
    const { result } = renderHook(() => useApi(null));

    expect(result.current.data).toBeUndefined();
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it('signs out after an unauthorized result', async () => {
    const fn = jest.fn().mockResolvedValue({ kind: 'unauthorized' as const });
    const { result } = renderHook(() => useApi(fn));

    await waitFor(() => expect(result.current.data).toEqual({ kind: 'unauthorized' }));
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
