import { fireEvent, render, screen } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ComponentType, ReactNode } from 'react';

import { getPet, listPets } from '../../../api/pets';
import { getMe } from '../../../api/users';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import { SelectedPetProvider } from '../../../providers/selected-pet-provider';
import ProfileScreen from '../profile';

jest.mock('../../../api/pets', () => ({ getPet: jest.fn(), listPets: jest.fn() }));
jest.mock('../../../api/users', () => ({ getMe: jest.fn() }));
jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn() },
  useFocusEffect: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const mockUseAuth = jest.mocked(useAuth);
const mockGetPet = jest.mocked(getPet);
const mockListPets = jest.mocked(listPets);
const mockGetMe = jest.mocked(getMe);
const mockSignOut = jest.fn<Promise<void>, []>();

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

function ProfileWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <SelectedPetProvider>{children}</SelectedPetProvider>
    </HeroUINativeProvider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockSignOut.mockResolvedValue();
  mockUseAuth.mockReturnValue({
    status: 'authenticated',
    token: 'jwt-token',
    signIn: jest.fn(),
    signOut: mockSignOut,
  } satisfies AuthContextValue);
  mockGetMe.mockReturnValue(pending());
  mockListPets.mockReturnValue(pending());
  mockGetPet.mockReturnValue(pending());
});

describe('R5: placeholders de tabs', () => {
  it.each<{
    Screen: ComponentType;
    testID: string;
    title: string;
  }>([
    { Screen: ProfileScreen, testID: 'screen-profile', title: 'Profile' },
  ])('renders the $title placeholder', async ({ Screen, testID, title }) => {
    await render(<Screen />, { wrapper: ProfileWrapper });

    expect(screen.getByTestId(testID)).toBeVisible();
    expect(screen.getByText(title)).toBeVisible();
  });
});

describe('R6: profile permite cerrar sesión', () => {
  it('signs out from the profile placeholder', async () => {
    await render(<ProfileScreen />, { wrapper: ProfileWrapper });

    await fireEvent.press(screen.getByTestId('profile-sign-out'));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
