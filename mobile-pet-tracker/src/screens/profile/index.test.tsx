import { render, screen, waitFor } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';

import { getMe, type MeState } from '../../api/users';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { ProfileScreen } from '.';

jest.mock('../../api/users', () => ({
  getMe: jest.fn(),
}));

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const apiUrl = 'http://example.test/v1';
const mockGetMe = jest.mocked(getMe);
const mockUseAuth = jest.mocked(useAuth);

function renderProfile() {
  return render(<ProfileScreen />, { wrapper: HeroUINativeProvider });
}

describe('R1: me card', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
  });

  it('shows the real account name and email', async () => {
    mockGetMe.mockResolvedValue({
      kind: 'ok',
      me: {
        id: 'user-1',
        email: 'ada@example.test',
        firstName: 'Ada',
        lastName: 'Lovelace',
        phone: '+525500000000',
        country: 'MX',
        timezone: 'America/Mexico_City',
        createdAt: '2026-08-20T00:00:00.000Z',
        updatedAt: '2026-08-21T00:00:00.000Z',
      },
    });

    renderProfile();

    await waitFor(() => expect(screen.getByTestId('me-card')).toBeVisible());
    expect(screen.getByText('Ada Lovelace')).toBeVisible();
    expect(screen.getByText('ada@example.test')).toBeVisible();
    expect(mockGetMe).toHaveBeenCalledWith(apiUrl, 'jwt-token');
  });

  it.each([
    { kind: 'error' },
    { kind: 'unreachable', message: 'offline' },
    { kind: 'missing-config' },
  ] as MeState[])('degrades the account card for $kind', async (state) => {
    mockGetMe.mockResolvedValue(state);

    renderProfile();

    await waitFor(() =>
      expect(screen.getByTestId('me-card-state')).toHaveTextContent(
        'Account unavailable',
      ),
    );
    expect(screen.getByTestId('screen-profile')).toBeVisible();
  });
});
