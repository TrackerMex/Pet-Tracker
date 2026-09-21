import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { Button, Text } from 'react-native';

import { deletePushToken } from '../../api/push-tokens';
import { AuthProvider, useAuth } from '../auth-provider';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));
jest.mock('../../api/push-tokens', () => ({
  deletePushToken: jest.fn(),
}));

const getItemAsync = jest.mocked(SecureStore.getItemAsync);
const setItemAsync = jest.mocked(SecureStore.setItemAsync);
const deleteItemAsync = jest.mocked(SecureStore.deleteItemAsync);
const deletePushTokenMock = jest.mocked(deletePushToken);
const observeAuthProbe = jest.fn();

interface AuthProbeObservation {
  setPushToken?: (expoToken: string | null) => void;
  signOut: () => Promise<void>;
}

function latestAuthProbeObservation(): AuthProbeObservation | undefined {
  const calls = observeAuthProbe.mock.calls;
  return calls[calls.length - 1]?.[0] as AuthProbeObservation | undefined;
}

function AuthProbe() {
  const { status, token, signIn, signOut, setPushToken } = useAuth() as ReturnType<
    typeof useAuth
  > & {
    setPushToken?: (expoToken: string | null) => void;
  };
  useEffect(() => {
    observeAuthProbe({ setPushToken, signOut });
  });

  return (
    <>
      <Text testID="auth-status">{status}</Text>
      <Text testID="auth-token">{token ?? 'none'}</Text>
      <Button title="Sign in" onPress={() => void signIn('new-token')} />
      <Button
        title="Set push token"
        onPress={() => setPushToken?.('ExpoPushToken[xxx]')}
      />
      <Button title="Sign out" onPress={() => void signOut()} />
    </>
  );
}

describe('R3: restaura la sesión desde secure store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setItemAsync.mockResolvedValue();
    deleteItemAsync.mockResolvedValue();
  });

  it('stays loading until storage resolves, then restores a token', async () => {
    let resolveStoredToken: (token: string | null) => void = () => undefined;
    getItemAsync.mockReturnValue(
      new Promise((resolve) => {
        resolveStoredToken = resolve;
      }),
    );

    await render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('loading');
    expect(screen.getByTestId('auth-token')).toHaveTextContent('none');

    await act(async () => {
      resolveStoredToken('stored-token');
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    expect(screen.getByTestId('auth-token')).toHaveTextContent('stored-token');
    expect(getItemAsync).toHaveBeenCalledWith('auth_token');
  });

  it('becomes unauthenticated when no token is stored', async () => {
    getItemAsync.mockResolvedValue(null);

    await render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
      expect(screen.getByTestId('auth-token')).toHaveTextContent('none');
    });
  });

  it('falls back to unauthenticated when storage cannot be read', async () => {
    getItemAsync.mockRejectedValue(new Error('keychain unavailable'));

    await render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
      expect(screen.getByTestId('auth-token')).toHaveTextContent('none');
    });
  });
});

describe('R4: signIn y signOut', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getItemAsync.mockResolvedValue(null);
    setItemAsync.mockResolvedValue();
    deleteItemAsync.mockResolvedValue();
  });

  it('persists sign-in and deletes sign-out state', async () => {
    await render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    });

    await act(async () => {
      fireEvent.press(screen.getByText('Sign in'));
    });

    await waitFor(() => {
      expect(setItemAsync).toHaveBeenCalledWith('auth_token', 'new-token');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('auth-token')).toHaveTextContent('new-token');
    });

    await act(async () => {
      fireEvent.press(screen.getByText('Sign out'));
    });

    await waitFor(() => {
      expect(deleteItemAsync).toHaveBeenCalledWith('auth_token');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
      expect(screen.getByTestId('auth-token')).toHaveTextContent('none');
    });
  });
});

describe('#79 R5: signOut borra el push token antes que la sesión', () => {
  const originalApiUrl = process.env.EXPO_PUBLIC_API_URL;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    getItemAsync.mockResolvedValue('jwt-token');
    setItemAsync.mockResolvedValue();
    deleteItemAsync.mockResolvedValue();
    deletePushTokenMock.mockResolvedValue({ kind: 'ok' });
  });

  afterAll(() => {
    if (originalApiUrl === undefined) {
      delete process.env.EXPO_PUBLIC_API_URL;
    } else {
      process.env.EXPO_PUBLIC_API_URL = originalApiUrl;
    }
  });

  it('hace DELETE con el JWT vigente antes de borrar SecureStore', async () => {
    await render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });
    const observation = latestAuthProbeObservation();

    await act(() => observation?.setPushToken?.('ExpoPushToken[xxx]'));
    await act(async () => {
      await observation?.signOut();
    });

    await waitFor(() => {
      expect(deletePushTokenMock).toHaveBeenCalledWith(
        'http://example.test/v1',
        'jwt-token',
        'ExpoPushToken[xxx]',
      );
      expect(deleteItemAsync).toHaveBeenCalledWith('auth_token');
      expect(deletePushTokenMock.mock.invocationCallOrder[0]).toBeLessThan(
        deleteItemAsync.mock.invocationCallOrder[0]!,
      );
    });
  });

  it('sin token publicado cierra sesión sin hacer DELETE remoto', async () => {
    await render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });
    const observation = latestAuthProbeObservation();

    await act(async () => {
      await observation?.signOut();
    });

    await waitFor(() => {
      expect(deletePushTokenMock).not.toHaveBeenCalled();
      expect(deleteItemAsync).toHaveBeenCalledWith('auth_token');
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'unauthenticated',
      );
    });
  });

  it('cierra sesión aunque falle el DELETE remoto', async () => {
    deletePushTokenMock.mockResolvedValueOnce({
      kind: 'unreachable',
      message: 'offline',
    });
    await render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });
    const observation = latestAuthProbeObservation();

    await act(() => observation?.setPushToken?.('ExpoPushToken[xxx]'));
    await act(async () => {
      await observation?.signOut();
    });

    await waitFor(() => {
      expect(deletePushTokenMock).toHaveBeenCalledTimes(1);
      expect(deleteItemAsync).toHaveBeenCalledWith('auth_token');
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'unauthenticated',
      );
    });
  });

  it('publicar el token no re-renderiza y conserva una función estable', async () => {
    await render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });
    const rendersBefore = observeAuthProbe.mock.calls.length;
    const setterBefore = latestAuthProbeObservation()?.setPushToken;

    await act(() => setterBefore?.('ExpoPushToken[xxx]'));

    expect(observeAuthProbe).toHaveBeenCalledTimes(rendersBefore);
    expect(latestAuthProbeObservation()?.setPushToken).toBe(setterBefore);
    expect(setterBefore).toEqual(expect.any(Function));
  });
});
