import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { deletePushToken } from '../api/push-tokens';

const TOKEN_KEY = 'auth_token';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthContextValue {
  status: AuthStatus;
  token: string | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  setPushToken?: (expoToken: string | null) => void;
}

interface AuthState {
  status: AuthStatus;
  token: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const pushTokenRef = useRef<string | null>(null);
  const [state, setState] = useState<AuthState>({
    status: 'loading',
    token: null,
  });

  useEffect(() => {
    let mounted = true;

    void SecureStore.getItemAsync(TOKEN_KEY)
      .then((token) => {
        if (mounted) {
          setState({
            status: token ? 'authenticated' : 'unauthenticated',
            token,
          });
        }
      })
      .catch(() => {
        if (mounted) {
          setState({ status: 'unauthenticated', token: null });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    setState({ status: 'authenticated', token });
  }, []);

  const setPushToken = useCallback((expoToken: string | null) => {
    pushTokenRef.current = expoToken;
  }, []);

  const signOut = useCallback(async () => {
    if (
      process.env.EXPO_PUBLIC_API_URL &&
      state.token &&
      pushTokenRef.current
    ) {
      await deletePushToken(
        process.env.EXPO_PUBLIC_API_URL,
        state.token,
        pushTokenRef.current,
      );
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    pushTokenRef.current = null;
    setState({ status: 'unauthenticated', token: null });
  }, [state.token]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, signIn, signOut, setPushToken }),
    [setPushToken, signIn, signOut, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return value;
}
