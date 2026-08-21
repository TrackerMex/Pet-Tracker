import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const TOKEN_KEY = 'auth_token';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthContextValue {
  status: AuthStatus;
  token: string | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthState {
  status: AuthStatus;
  token: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
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

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setState({ status: 'unauthenticated', token: null });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, signIn, signOut }),
    [signIn, signOut, state],
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
