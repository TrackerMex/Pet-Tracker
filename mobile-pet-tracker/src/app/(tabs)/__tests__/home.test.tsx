import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';

import {
  getDailyActivity,
  type DailyActivityState,
} from '../../../api/activity';
import { getPet, listPets, type PetState, type PetsState } from '../../../api/pets';
import type { PetProfile } from '../../../api/types';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import { SelectedPetProvider } from '../../../providers/selected-pet-provider';
import HomeScreen from '../home';

jest.mock('../../../api/pets', () => ({
  getPet: jest.fn(),
  listPets: jest.fn(),
}));

jest.mock('../../../api/activity', () => ({
  getDailyActivity: jest.fn(),
}));

jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 24, left: 0 }),
}));

const apiUrl = 'http://example.test/v1';
const mockGetDailyActivity = jest.mocked(getDailyActivity);
const mockGetPet = jest.mocked(getPet);
const mockListPets = jest.mocked(listPets);
const mockUseAuth = jest.mocked(useAuth);

function makePet(overrides: Partial<PetProfile> = {}): PetProfile {
  return {
    id: 'pet-1',
    name: 'Luna',
    species: 'dog',
    breed: 'Mixed',
    sex: 'female',
    birthDate: null,
    approxAgeMonths: 30,
    ageMonths: 30,
    currentWeightKg: 12,
    size: 'medium',
    color: 'black',
    sterilized: true,
    microchip: null,
    photoUrl: null,
    lostMode: false,
    lastPosition: null,
    lastCommunicationAt: null,
    myRole: 'owner',
    device: null,
    nextVaccine: null,
    nextReminder: null,
    activitySummary: null,
    createdAt: '2026-08-20T00:00:00.000Z',
    updatedAt: '2026-08-21T00:00:00.000Z',
    ...overrides,
  };
}

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

function HomeWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <SelectedPetProvider>{children}</SelectedPetProvider>
    </HeroUINativeProvider>
  );
}

async function renderHome() {
  await render(<HomeScreen />, { wrapper: HomeWrapper });
}

describe('R6: home carga pets y selecciona', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockGetPet.mockReturnValue(pending<PetState>());
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());
  });

  it('shows a loading state while pets are pending', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderHome();

    expect(screen.getByTestId('screen-home')).toBeVisible();
    expect(screen.getByTestId('home-loading')).toBeVisible();
  });

  it('shows an error and retries the pet list', async () => {
    mockListPets
      .mockResolvedValueOnce({ kind: 'unreachable', message: 'network down' })
      .mockResolvedValueOnce({ kind: 'ok', pets: [] });

    await renderHome();
    await waitFor(() => expect(screen.getByTestId('home-error')).toBeVisible());

    await fireEvent.press(screen.getByTestId('home-retry'));

    await waitFor(() => expect(screen.getByTestId('home-empty')).toBeVisible());
    expect(mockListPets).toHaveBeenCalledTimes(2);
  });

  it('shows the empty state when the account has no pets', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('home-empty')).toHaveTextContent('No pets yet'));
  });

  it('keeps API order and selects the first pet by default', async () => {
    const pets = [
      makePet(),
      makePet({ id: 'pet-2', name: 'Milo' }),
    ];
    mockListPets.mockResolvedValue({ kind: 'ok', pets });

    await renderHome();

    await waitFor(() => {
      expect(screen.getAllByTestId(/^pet-chip-/).map(({ props }) => props.testID)).toEqual([
        'pet-chip-pet-1',
        'pet-chip-pet-2',
      ]);
      expect(screen.getByTestId('pet-chip-pet-1').props.accessibilityState).toEqual({
        selected: true,
      });
    });
    expect(mockListPets).toHaveBeenCalledWith(apiUrl, 'jwt-token');
    expect(mockGetPet).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1');
    expect(mockGetDailyActivity).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1');
  });

  it('selects a pressed pet and reloads its detail and activity', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })],
    });

    await renderHome();
    await waitFor(() => expect(screen.getByTestId('pet-chip-pet-1')).toBeVisible());
    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));

    await waitFor(() => {
      expect(screen.getByTestId('pet-chip-pet-2').props.accessibilityState).toEqual({
        selected: true,
      });
      expect(mockGetPet).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-2');
      expect(mockGetDailyActivity).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-2');
    });
  });
});

describe('R7: pet card muestra el perfil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());
  });

  it('shows a skeleton while pet detail is pending', async () => {
    mockGetPet.mockReturnValue(pending<PetState>());

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('pet-card-skeleton')).toBeVisible());
  });

  it('shows the pet photo, name, and breed', async () => {
    const pet = makePet({ photoUrl: 'http://example.test/luna.jpg' });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('pet-card')).toBeVisible());
    expect(screen.getByTestId('pet-card-photo').props.source).toEqual([
      { uri: pet.photoUrl },
    ]);
    expect(screen.getByTestId('pet-card-name')).toHaveTextContent('Luna');
    expect(screen.getByTestId('pet-card-breed')).toHaveTextContent('Mixed');
  });

  it('uses the name initial and a dash when optional profile data is absent', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ breed: null, photoUrl: null }),
    });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('pet-card')).toBeVisible());
    expect(screen.getByTestId('pet-card-photo')).toHaveTextContent('L');
    expect(screen.getByTestId('pet-card-breed')).toHaveTextContent('—');
  });

  it('shows an error and retries pet detail', async () => {
    mockGetPet
      .mockResolvedValueOnce({ kind: 'unreachable', message: 'network down' })
      .mockResolvedValueOnce({ kind: 'ok', pet: makePet() });

    await renderHome();
    await waitFor(() => expect(screen.getByTestId('pet-card-error')).toBeVisible());
    await fireEvent.press(screen.getByTestId('pet-card-retry'));

    await waitFor(() => expect(screen.getByTestId('pet-card-name')).toHaveTextContent('Luna'));
    expect(mockGetPet).toHaveBeenCalledTimes(2);
  });
});
