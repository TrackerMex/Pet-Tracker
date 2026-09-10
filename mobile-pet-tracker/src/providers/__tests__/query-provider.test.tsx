import {
  cleanup,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {
  type QueryClient,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Text } from 'react-native';

import { useAuth, type AuthContextValue } from '../auth-provider';
import { createQueryClient, QueryProvider } from '../query-provider';

jest.mock('../auth-provider', () => ({ useAuth: jest.fn() }));

const mockUseAuth = jest.mocked(useAuth);
const mockSignOut = jest.fn<Promise<void>, []>();
let mountedClient: QueryClient | undefined;

function QueryProbe({ result }: { result: { kind: string; message?: string } }) {
  mountedClient = useQueryClient();
  const query = useQuery({
    queryKey: ['unauthorized-probe'],
    queryFn: async () => result,
  });

  return <Text testID="query-result">{query.data?.kind ?? 'loading'}</Text>;
}

describe('#87 R2: el QueryClient fija sus cinco mandos', () => {
  const queries = createQueryClient().getDefaultOptions().queries;

  it('keeps every query immediately stale', () => {
    expect(queries?.staleTime).toBe(0);
  });

  it('keeps unused data for five minutes', () => {
    expect(queries?.gcTime).toBe(5 * 60 * 1000);
  });

  it('does not retry resolved API result kinds', () => {
    expect(queries?.retry).toBe(false);
  });

  it('does not promise browser focus refetching in React Native', () => {
    expect(queries?.refetchOnWindowFocus).toBe(false);
  });

  it('does not promise reconnect refetching without NetInfo', () => {
    expect(queries?.refetchOnReconnect).toBe(false);
  });

  it('does not carry data between query keys', () => {
    expect(queries?.placeholderData).toBeUndefined();
  });
});

describe('#87 R5: unauthorized expulsa desde un único sitio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignOut.mockResolvedValue();
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'test-token',
      signIn: jest.fn(),
      signOut: mockSignOut,
    } satisfies AuthContextValue);
  });

  afterEach(async () => {
    await cleanup();
    mountedClient?.clear();
    mountedClient = undefined;
  });

  it('signs out once for an unauthorized result', async () => {
    await render(
      <QueryProvider>
        <QueryProbe result={{ kind: 'unauthorized' }} />
      </QueryProvider>,
    );

    await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
  });

  it('does not sign out for an ok result', async () => {
    await render(
      <QueryProvider>
        <QueryProbe result={{ kind: 'ok' }} />
      </QueryProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('query-result')).toHaveTextContent('ok'),
    );
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it('does not sign out for an unreachable result', async () => {
    await render(
      <QueryProvider>
        <QueryProbe result={{ kind: 'unreachable', message: 'x' }} />
      </QueryProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('query-result')).toHaveTextContent(
        'unreachable',
      ),
    );
    expect(mockSignOut).not.toHaveBeenCalled();
  });
});
