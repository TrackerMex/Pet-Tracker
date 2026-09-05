import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';

import {
  listVaccines,
  listWeights,
  type VaccinesState,
  type WeightsState,
} from '../../../api/health-records';
import { listPets, type PetsState } from '../../../api/pets';
import type { PetProfile, Vaccine, WeightEntry } from '../../../api/types';
import * as apiHooks from '../../../hooks/use-api';
import type { ApiResult } from '../../../hooks/use-api';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import { SelectedPetProvider } from '../../../providers/selected-pet-provider';
import * as selectedPetHooks from '../../../providers/selected-pet-provider';
import HealthScreen from '../health';
import { TOUCH_SLOP } from '../../../theme/touch-target';

let mockTheme: 'light' | 'dark' = 'light';

jest.mock('../../../api/pets', () => ({
  listPets: jest.fn(),
}));

jest.mock('../../../api/health-records', () => ({
  listVaccines: jest.fn(),
  listWeights: jest.fn(),
}));

jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn() },
  useIsFocused: jest.fn(() => true),
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
    ChevronRight: icon('health-icon-chevron-right'),
    HeartPulse: icon('health-icon-heart-pulse'),
    Syringe: icon('health-icon-syringe'),
  };
});

jest.mock(
  '../../../theme/use-theme-colors',
  () => ({
    useThemeColors: (tokens: string[]) =>
      tokens.map((token) => {
        if (token === 'warning') {
          return mockTheme === 'dark' ? '#FBBF24' : '#F59E0B';
        }
        if (token === 'muted') {
          return mockTheme === 'dark' ? '#9CA3AF' : '#6B7280';
        }
        return mockTheme === 'dark' ? '#F7F8FA' : '#0D1117';
      }),
  }),
  { virtual: true },
);

const apiUrl = 'http://example.test/v1';
const mockListPets = jest.mocked(listPets);
const mockListVaccines = jest.mocked(listVaccines);
const mockListWeights = jest.mocked(listWeights);
const mockUseAuth = jest.mocked(useAuth);
const mockRouter = jest.mocked(router);

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

function makeVaccine(overrides: Partial<Vaccine> = {}): Vaccine {
  return {
    id: 'vaccine-1',
    petId: 'pet-1',
    catalogId: null,
    name: 'Rabies',
    appliedAt: '2026-08-01',
    nextDoseAt: '2099-08-01',
    vetName: null,
    clinic: null,
    notes: null,
    documentKey: null,
    ...overrides,
  };
}

function makeWeight(overrides: Partial<WeightEntry> = {}): WeightEntry {
  return {
    id: 'weight-1',
    petId: 'pet-1',
    weightKg: 12.4,
    measuredAt: '2026-08-21',
    bodyCondition: null,
    variation: 0.4,
    ...overrides,
  };
}

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

function HealthWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <SelectedPetProvider>{children}</SelectedPetProvider>
    </HeroUINativeProvider>
  );
}

async function renderHealth() {
  return render(<HealthScreen />, { wrapper: HealthWrapper });
}

beforeEach(() => {
  mockTheme = 'light';
});

describe('R4: health resuelve la mascota seleccionada', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListVaccines.mockReturnValue(pending<VaccinesState>());
    mockListWeights.mockReturnValue(pending<WeightsState>());
  });

  it('shows the hub and a loading state while pets are pending', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderHealth();

    expect(screen.getByTestId('screen-health')).toBeVisible();
    expect(screen.getByText('Health')).toBeVisible();
    expect(screen.getByTestId('health-loading')).toBeVisible();
    expect(screen.getByTestId('screen-health').props.contentContainerStyle).toEqual(
      expect.objectContaining({ padding: 24, paddingBottom: 120 }),
    );
  });

  it('R5 (mobile-design-drift): aplica el safe area superior al contenido', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderHealth();

    expect(screen.getByTestId('screen-health').props.contentContainerStyle).toEqual(
      expect.objectContaining({ paddingTop: 52 }),
    );
  });

  it('R8 (mobile-design-drift): reserva la altura del loading con Skeleton', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderHealth();

    expect(screen.getByTestId('health-loading').props.className).toContain('h-12');
  });

  it.each([
    { kind: 'error' } as const,
    { kind: 'unreachable', message: 'network down' } as const,
    { kind: 'missing-config' } as const,
  ])('shows and retries a $kind pet-list error', async (state) => {
    mockListPets
      .mockResolvedValueOnce(state)
      .mockResolvedValueOnce({ kind: 'ok', pets: [] });

    await renderHealth();
    await waitFor(() => expect(screen.getByTestId('health-error')).toBeVisible());

    await fireEvent.press(screen.getByTestId('health-retry'));

    await waitFor(() => expect(screen.getByTestId('health-empty')).toBeVisible());
    expect(mockListPets).toHaveBeenCalledTimes(2);
  });

  it('shows the empty state when the account has no pets', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('health-empty')).toHaveTextContent('No pets yet'),
    );
  });

  it('keeps API order and selects the first pet by default', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })],
    });

    await renderHealth();

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
    expect(mockListVaccines).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1');
    expect(mockListWeights).toHaveBeenCalledWith(
      apiUrl,
      'jwt-token',
      'pet-1',
      expect.any(Function),
      1,
    );
  });

  it('selects a pressed pet and reloads its health records', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })],
    });

    await renderHealth();
    await waitFor(() => expect(screen.getByTestId('pet-chip-pet-1')).toBeVisible());
    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));

    await waitFor(() => {
      expect(screen.getByTestId('pet-chip-pet-2').props.accessibilityState).toEqual({
        selected: true,
      });
      expect(mockListVaccines).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-2');
      expect(mockListWeights).toHaveBeenCalledWith(
        apiUrl,
        'jwt-token',
        'pet-2',
        expect.any(Function),
        1,
      );
    });
  });
});

describe('R5: vacunas con la próxima destacada', () => {
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
    mockListWeights.mockReturnValue(pending<WeightsState>());
  });

  it('shows a skeleton while vaccines are pending', async () => {
    mockListVaccines.mockReturnValue(pending<VaccinesState>());

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('vaccines-skeleton')).toBeVisible(),
    );
    expect(screen.getByTestId('vaccines-section')).toBeVisible();
    expect(screen.getByText('Vaccines')).toBeVisible();
  });

  it('highlights the nearest future dose and keeps row order', async () => {
    const vaccines = [
      makeVaccine({
        id: 'vaccine-2',
        name: 'Leptospirosis',
        appliedAt: '2026-08-20',
        nextDoseAt: '2099-10-01',
      }),
      makeVaccine({ nextDoseAt: '2099-05-01' }),
    ];
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines });

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('next-vaccine-card')).toBeVisible(),
    );
    const nextCard = within(screen.getByTestId('next-vaccine-card'));
    expect(nextCard.getByText('Next due')).toBeVisible();
    expect(nextCard.getByText('Rabies')).toBeVisible();
    expect(nextCard.getByText('2099-05-01')).toBeVisible();
    expect(screen.getAllByTestId(/^vaccine-row-/).map(({ props }) => props.testID)).toEqual([
      'vaccine-row-vaccine-2',
      'vaccine-row-vaccine-1',
    ]);
  });

  it('re-resolves the syringe token when a mounted tab changes theme', async () => {
    mockListVaccines.mockResolvedValue({
      kind: 'ok',
      vaccines: [makeVaccine()],
    });
    const view = await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('next-vaccine-card')).toBeVisible(),
    );

    expect(screen.getAllByTestId('health-icon-syringe')[0]).toHaveStyle({
      color: '#F59E0B',
    });

    mockTheme = 'dark';
    await view.rerender(<HealthScreen />);

    expect(screen.getAllByTestId('health-icon-syringe')[0]).toHaveStyle({
      color: '#FBBF24',
    });
  });

  it('omits the next card when every dose is past or null', async () => {
    mockListVaccines.mockResolvedValue({
      kind: 'ok',
      vaccines: [
        makeVaccine({ nextDoseAt: '2000-01-01' }),
        makeVaccine({ id: 'vaccine-2', nextDoseAt: null }),
      ],
    });

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('vaccine-row-vaccine-1')).toBeVisible(),
    );
    expect(screen.queryByTestId('next-vaccine-card')).toBeNull();
  });

  it('marks an overdue next-dose date with the danger token', async () => {
    mockListVaccines.mockResolvedValue({
      kind: 'ok',
      vaccines: [makeVaccine({ nextDoseAt: '2000-06-01' })],
    });

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('vaccine-row-vaccine-1')).toBeVisible(),
    );
    const overdueDate = screen.getByText('2000-06-01');
    expect(overdueDate.props.className).toContain('text-danger');
  });

  it('shows the vaccines empty state', async () => {
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: [] });

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('vaccines-empty')).toHaveTextContent(
        'No vaccines yet',
      ),
    );
  });

  it.each([
    { kind: 'error' } as const,
    { kind: 'unreachable', message: 'network down' } as const,
  ])('shows and retries a $kind vaccine error', async (state) => {
    mockListVaccines
      .mockResolvedValueOnce(state)
      .mockResolvedValueOnce({ kind: 'ok', vaccines: [] });

    await renderHealth();
    await waitFor(() =>
      expect(screen.getByTestId('vaccines-error')).toHaveTextContent(
        'Could not load vaccines',
      ),
    );
    await fireEvent.press(screen.getByTestId('vaccines-retry'));

    await waitFor(() => expect(screen.getByTestId('vaccines-empty')).toBeVisible());
    expect(mockListVaccines).toHaveBeenCalledTimes(2);
  });
});

describe('R6: weight card enlaza al log', () => {
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
    mockListVaccines.mockReturnValue(pending<VaccinesState>());
  });

  it('shows the current weight and opens the weight log', async () => {
    mockListWeights.mockResolvedValue({
      kind: 'ok',
      weights: [makeWeight()],
    });

    await renderHealth();

    await waitFor(() => expect(screen.getByTestId('weight-card')).toBeVisible());
    expect(screen.getByText('Weight')).toBeVisible();
    expect(screen.getByTestId('weight-current')).toHaveTextContent('12.4 kg');
    expect(screen.getByTestId('weight-variation')).toHaveTextContent('+0.4 kg');

    await fireEvent.press(screen.getByTestId('weight-log-link'));

    expect(mockRouter.push).toHaveBeenCalledWith('/weight-log');
  });

  it.each([
    [-0.2, '-0.2 kg'],
    [0, '0 kg'],
    [null, '—'],
  ])('formats variation %p as %s', async (variation, expected) => {
    mockListWeights.mockResolvedValue({
      kind: 'ok',
      weights: [makeWeight({ variation })],
    });

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('weight-variation')).toHaveTextContent(expected),
    );
  });

  it('shows the empty state and keeps the log link', async () => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('weight-card-empty')).toHaveTextContent(
        'No weight entries yet',
      ),
    );
    expect(screen.getByTestId('weight-log-link')).toBeVisible();
  });

  it.each([
    { kind: 'error' } as const,
    { kind: 'unreachable', message: 'network down' } as const,
  ])('shows a $kind weight error and keeps the log link', async (state) => {
    mockListWeights.mockResolvedValue(state);

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('weight-card-error')).toHaveTextContent(
        'Could not load weight',
      ),
    );
    expect(screen.getByTestId('weight-log-link')).toBeVisible();
  });
});

describe('R10: preserva la mascota durante el refetch', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not replace a new selection while the stale pet list refreshes', async () => {
    const existingPet = makePet();
    const createdPet = makePet({ id: 'pet-new', name: 'Nala' });
    const selectPet = jest.fn();
    let petsResult: ApiResult<PetsState> = {
      data: { kind: 'ok', pets: [existingPet] },
      isRefreshing: true,
      refetch: jest.fn(),
    };
    const emptyResult: ApiResult<{ kind: string }> = {
      data: undefined,
      isRefreshing: false,
      refetch: jest.fn(),
    };
    let hookCall = 0;
    jest.spyOn(selectedPetHooks, 'useSelectedPet').mockReturnValue({
      selectedPetId: createdPet.id,
      selectPet,
    });
    jest.spyOn(apiHooks, 'useApi').mockImplementation(
      <T extends { kind: string }>(): ApiResult<T> => {
        const result = hookCall++ % 3 === 0 ? petsResult : emptyResult;
        return result as ApiResult<T>;
      },
    );

    const view = await renderHealth();

    expect(selectPet).not.toHaveBeenCalled();

    petsResult = {
      data: { kind: 'ok', pets: [existingPet, createdPet] },
      isRefreshing: false,
      refetch: jest.fn(),
    };
    await view.rerender(<HealthScreen />);

    expect(selectPet).not.toHaveBeenCalled();
  });
});

describe('#61 R10: los controles táctiles declaran TOUCH_SLOP', () => {
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
    mockListVaccines.mockReturnValue(pending<VaccinesState>());
  });

  it('la fila de enlace al weight log llega a 44 pt sin crecer a la vista', async () => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [makeWeight()] });

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('weight-log-link')).toBeVisible(),
    );

    expect(screen.getByTestId('weight-log-link').props.hitSlop).toEqual(
      TOUCH_SLOP,
    );
  });
});

describe('#62 R5: el título de card usa un único tratamiento', () => {
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
    mockListVaccines.mockReturnValue(pending<VaccinesState>());
    mockListWeights.mockResolvedValue({
      kind: 'ok',
      weights: [makeWeight()],
    });
  });

  it('aplica la receta canónica a Weight', async () => {
    await renderHealth();

    expect((await screen.findByText('Weight')).props.className).toBe(
      'text-base font-bold text-foreground',
    );
  });
});
