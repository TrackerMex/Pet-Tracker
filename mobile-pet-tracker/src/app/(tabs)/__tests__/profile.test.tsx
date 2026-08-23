import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import { Uniwind } from 'uniwind';

import { fetchHealth, type HealthState } from '../../../api/health';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import ProfileScreen from '../profile';

let mockTheme: 'light' | 'dark' = 'light';

jest.mock('../../../api/health', () => ({
  fetchHealth: jest.fn(),
}));

jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('uniwind', () => ({
  ...jest.requireActual('uniwind'),
  useUniwind: () => ({ theme: mockTheme, hasAdaptiveThemes: false }),
}));

jest.mock('reicon-react-native', () => {
  const { View } = jest.requireActual('react-native');
  const icon = (testID: string) =>
    function MockIcon({ color }: { color?: string }) {
      return <View testID={testID} style={{ color }} />;
    };

  return {
    Moon: icon('theme-icon-moon'),
    Sun: icon('theme-icon-sun'),
  };
});

jest.mock(
  '../../../theme/use-theme-colors',
  () => ({
    useThemeColors: (tokens: string[]) =>
      tokens.map((token) => {
        if (token !== 'foreground') return 'invalid';
        return mockTheme === 'dark' ? '#F7F8FA' : '#0D1117';
      }),
  }),
  { virtual: true },
);

const apiUrl = 'http://example.test/v1';
const mockFetchHealth = jest.mocked(fetchHealth);
const mockUseAuth = jest.mocked(useAuth);
const mockSignOut = jest.fn<Promise<void>, []>();
const states: HealthState[] = [
  { kind: 'ok' },
  { kind: 'error' },
  { kind: 'unreachable', message: 'network down' },
  { kind: 'missing-config' },
];

describe('R10: profile aloja health-check y theme toggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTheme = 'light';
    mockSignOut.mockResolvedValue();
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: mockSignOut,
    } satisfies AuthContextValue);
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(states)('renders backend health $kind', async (state) => {
    mockFetchHealth.mockResolvedValueOnce(state);

    await render(<ProfileScreen />, { wrapper: HeroUINativeProvider });

    await waitFor(() => {
      expect(screen.getByTestId('backend-health-state')).toHaveTextContent(
        state.kind,
      );
    });
    expect(mockFetchHealth).toHaveBeenCalledWith(apiUrl);
  });

  it('rechecks backend health when retry is pressed', async () => {
    mockFetchHealth
      .mockResolvedValueOnce({ kind: 'error' })
      .mockResolvedValueOnce({ kind: 'ok' });

    await render(<ProfileScreen />, { wrapper: HeroUINativeProvider });

    await waitFor(() => {
      expect(screen.getByTestId('backend-health-state')).toHaveTextContent(
        'error',
      );
    });
    await fireEvent.press(screen.getByTestId('backend-health-retry'));

    await waitFor(() => {
      expect(screen.getByTestId('backend-health-state')).toHaveTextContent('ok');
      expect(mockFetchHealth).toHaveBeenCalledTimes(2);
    });
  });

  it('switches from light to dark', async () => {
    mockFetchHealth.mockResolvedValue({ kind: 'ok' });
    const setThemeSpy = jest
      .spyOn(Uniwind, 'setTheme')
      .mockImplementation(() => undefined);

    await render(<ProfileScreen />, { wrapper: HeroUINativeProvider });
    await fireEvent.press(screen.getByTestId('theme-toggle'));

    expect(setThemeSpy).toHaveBeenCalledWith('dark');
  });

  it('colors the dark theme toggle glyph with the foreground token', async () => {
    mockTheme = 'dark';
    mockFetchHealth.mockResolvedValue({ kind: 'ok' });

    await render(<ProfileScreen />, { wrapper: HeroUINativeProvider });

    expect(screen.getByTestId('theme-icon-sun')).toHaveStyle({
      color: '#F7F8FA',
    });
  });

  it('keeps profile title and sign-out action', async () => {
    mockFetchHealth.mockResolvedValue({ kind: 'ok' });

    await render(<ProfileScreen />, { wrapper: HeroUINativeProvider });

    expect(screen.getByText('Profile')).toBeVisible();
    expect(screen.getByTestId('profile-sign-out')).toBeVisible();
    await fireEvent.press(screen.getByTestId('profile-sign-out'));
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
