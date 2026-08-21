import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { Button, Text } from 'react-native';

import { AuthProvider, useAuth } from '../auth-provider';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const getItemAsync = jest.mocked(SecureStore.getItemAsync);
const setItemAsync = jest.mocked(SecureStore.setItemAsync);
const deleteItemAsync = jest.mocked(SecureStore.deleteItemAsync);

function AuthProbe() {
  const { status, token, signIn, signOut } = useAuth();

  return (
    <>
      <Text testID="auth-status">{status}</Text>
      <Text testID="auth-token">{token ?? 'none'}</Text>
      <Button title="Sign in" onPress={() => void signIn('new-token')} />
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

    render(
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

    render(
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

    render(
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
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    });

    fireEvent.press(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(setItemAsync).toHaveBeenCalledWith('auth_token', 'new-token');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('auth-token')).toHaveTextContent('new-token');
    });

    fireEvent.press(screen.getByText('Sign out'));

    await waitFor(() => {
      expect(deleteItemAsync).toHaveBeenCalledWith('auth_token');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
      expect(screen.getByTestId('auth-token')).toHaveTextContent('none');
    });
  });
});
