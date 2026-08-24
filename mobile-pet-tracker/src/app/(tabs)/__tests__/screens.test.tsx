import { fireEvent, render, screen } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ComponentType } from 'react';

import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import ProfileScreen from '../profile';

jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const mockUseAuth = jest.mocked(useAuth);
const mockSignOut = jest.fn<Promise<void>, []>();

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

describe('R5: placeholders de tabs', () => {
  it.each<{
    Screen: ComponentType;
    testID: string;
    title: string;
  }>([
    { Screen: ProfileScreen, testID: 'screen-profile', title: 'Profile' },
  ])('renders the $title placeholder', async ({ Screen, testID, title }) => {
    await render(<Screen />, { wrapper: HeroUINativeProvider });

    expect(screen.getByTestId(testID)).toBeVisible();
    expect(screen.getByText(title)).toBeVisible();
  });
});

describe('R6: profile permite cerrar sesión', () => {
  it('signs out from the profile placeholder', async () => {
    await render(<ProfileScreen />, { wrapper: HeroUINativeProvider });

    await fireEvent.press(screen.getByTestId('profile-sign-out'));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
