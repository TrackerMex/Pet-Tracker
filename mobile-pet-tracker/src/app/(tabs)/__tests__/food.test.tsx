import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';

import { getNutritionPlan, type NutritionPlanState } from '../../../api/nutrition';
import { listPets, type PetsState } from '../../../api/pets';
import type { PetProfile } from '../../../api/types';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import { SelectedPetProvider } from '../../../providers/selected-pet-provider';
import FoodScreen from '../food';

jest.mock('../../../api/pets', () => ({
  listPets: jest.fn(),
}));

jest.mock('../../../api/nutrition', () => ({
  getNutritionPlan: jest.fn(),
}));

jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

jest.mock('reicon-react-native', () => {
  const { View } = jest.requireActual('react-native');
  const icon = (testID: string) =>
    function MockIcon({ color }: { color?: string }) {
      return <View testID={testID} style={{ color }} />;
    };

  return {
    ChevronRight: icon('food-icon-chevron-right'),
    Clock: icon('food-icon-clock'),
    ForkKnife: icon('food-icon-fork-knife'),
    Sparkles: icon('food-icon-sparkles'),
  };
});

jest.mock(
  '../../../theme/use-theme-colors',
  () => ({
    useThemeColors: (tokens: string[]) => tokens.map(() => '#000000'),
  }),
  { virtual: true },
);

const apiUrl = 'http://example.test/v1';
const mockGetNutritionPlan = jest.mocked(getNutritionPlan);
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

function FoodWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <SelectedPetProvider>{children}</SelectedPetProvider>
    </HeroUINativeProvider>
  );
}

async function renderFood() {
  return render(<FoodScreen />, { wrapper: FoodWrapper });
}

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

describe('R4: food resuelve la mascota seleccionada', () => {
  beforeEach(() => {
    mockGetNutritionPlan.mockReturnValue(pending<NutritionPlanState>());
  });

  it('shows the hub and a loading state while pets are pending', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderFood();

    expect(screen.getByTestId('screen-food')).toBeVisible();
    expect(screen.getByText('Food')).toBeVisible();
    expect(screen.getByTestId('food-loading')).toBeVisible();
    expect(screen.getByTestId('screen-food').props.contentContainerStyle).toEqual(
      expect.objectContaining({ padding: 24, paddingBottom: 120 }),
    );
  });

  it.each([
    { kind: 'error' } as const,
    { kind: 'unreachable', message: 'network down' } as const,
    { kind: 'missing-config' } as const,
  ])('shows and retries a $kind pet-list error', async (state) => {
    mockListPets
      .mockResolvedValueOnce(state)
      .mockResolvedValueOnce({ kind: 'ok', pets: [] });

    await renderFood();
    await waitFor(() => expect(screen.getByTestId('food-error')).toBeVisible());
    await fireEvent.press(screen.getByTestId('food-retry'));

    await waitFor(() => expect(screen.getByTestId('food-empty')).toBeVisible());
    expect(mockListPets).toHaveBeenCalledTimes(2);
  });

  it('shows the empty state when the account has no pets', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });

    await renderFood();

    await waitFor(() =>
      expect(screen.getByTestId('food-empty')).toHaveTextContent('No pets yet'),
    );
  });

  it('keeps API order and selects the first pet by default', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })],
    });

    await renderFood();

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
    expect(mockGetNutritionPlan).toHaveBeenCalledWith(
      apiUrl,
      'jwt-token',
      'pet-1',
    );
  });

  it('selects a pressed pet and reloads its nutrition plan', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })],
    });

    await renderFood();
    await waitFor(() => expect(screen.getByTestId('pet-chip-pet-1')).toBeVisible());
    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));

    await waitFor(() => {
      expect(screen.getByTestId('pet-chip-pet-2').props.accessibilityState).toEqual({
        selected: true,
      });
      expect(mockGetNutritionPlan).toHaveBeenCalledWith(
        apiUrl,
        'jwt-token',
        'pet-2',
      );
    });
  });
});
