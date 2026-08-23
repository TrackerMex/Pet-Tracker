import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import { Uniwind } from 'uniwind';

import { fetchHealth, type HealthState } from '../../../api/health';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import ProfileScreen from '../profile';

jest.mock('../../../api/health', () => ({
  fetchHealth: jest.fn(),
}));

jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('uniwind', () => ({
  ...jest.requireActual('uniwind'),
  useUniwind: () => ({ theme: 'light', hasAdaptiveThemes: false }),
}));

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

  it('keeps profile title and sign-out action', async () => {
    mockFetchHealth.mockResolvedValue({ kind: 'ok' });

    await render(<ProfileScreen />, { wrapper: HeroUINativeProvider });

    expect(screen.getByText('Profile')).toBeVisible();
    expect(screen.getByTestId('profile-sign-out')).toBeVisible();
    await fireEvent.press(screen.getByTestId('profile-sign-out'));
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
