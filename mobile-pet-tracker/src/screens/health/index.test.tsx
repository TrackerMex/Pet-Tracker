import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect, type ReactNode } from 'react';
import { Text } from 'react-native';
import type { TestInstance } from 'test-renderer';

import {
  listVaccines,
  listWeights,
  type VaccinesState,
  type WeightsState,
} from '../../api/health-records';
import { listPets, type PetsState } from '../../api/pets';
import { healthKeys, petKeys } from '../../api/query-keys';
import type { PetProfile, Vaccine, WeightEntry } from '../../api/types';
import { WeightChart } from '../../components/weight-chart';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { SelectedPetProvider } from '../../providers/selected-pet-provider';
import * as selectedPetHooks from '../../providers/selected-pet-provider';
import { HealthScreen } from '.';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { renderWithProviders } from '../../../test/render-with-providers';

let mockTheme: 'light' | 'dark' = 'light';
let mockSemanticColors = false;

jest.mock('../../api/pets', () => ({
  listPets: jest.fn(),
}));

jest.mock('../../api/health-records', () => ({
  listVaccines: jest.fn(),
  listWeights: jest.fn(),
}));

jest.mock('../../components/weight-chart', () => {
  const actual = jest.requireActual<typeof import('../../components/weight-chart')>(
    '../../components/weight-chart',
  );
  return {
    ...actual,
    WeightChart: jest.fn(actual.WeightChart),
  };
});

jest.mock('../../components/rise-in', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { RiseIn: ({ delayMs, testID, className, children }: { delayMs: number; testID?: string; className?: string; children: ReactNode }) => {
    const props = { delayMs, testID, className };
    return React.createElement(View, props, children);
  } };
});

jest.mock('../../providers/auth-provider', () => ({
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
    function MockIcon({ color, size, strokeWidth }: { color?: string; size?: number; strokeWidth?: number }) {
      return <View {...{ size, strokeWidth }} testID={testID} style={{ color }} />;
    };

  return {
    Check: icon('health-icon-check'),
    ChevronRight: icon('health-icon-chevron-right'),
    Clock: icon('health-icon-clock'),
    HeartPulse: icon('health-icon-heart-pulse'),
    Syringe: icon('health-icon-syringe'),
    Plus: icon('health-icon-plus'),
    BellOff: icon('health-icon-bell-off'),
  };
});

jest.mock(
  '../../theme/use-theme-colors',
  () => ({
    useThemeColors: (tokens: string[]) =>
      tokens.map((token) => {
        if (mockSemanticColors) return token;
        if (token.startsWith('category-')) return token;
        if (token === 'warning') {
          return mockTheme === 'dark' ? '#FBBF24' : '#F59E0B';
        }
        if (token === 'muted') {
          return mockTheme === 'dark' ? '#9CA3AF' : '#6B7280';
        }
        return mockTheme === 'dark' ? '#F7F8FA' : '#0D1117';
      }),
  }),
);

const apiUrl = 'http://example.test/v1';
const mockListPets = jest.mocked(listPets);
const mockListVaccines = jest.mocked(listVaccines);
const mockListWeights = jest.mocked(listWeights);
const mockUseAuth = jest.mocked(useAuth);
const mockRouter = jest.mocked(router);
const mockWeightChart = jest.mocked(WeightChart);

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
    mealsToday: null,
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

function elementChild(node: TestInstance, index: number): TestInstance {
  const child = node.children[index];
  if (typeof child === 'string') throw new Error('Expected an element child');
  return child;
}

function HealthWrapper({
  children,
  language = 'es',
}: {
  children: ReactNode;
  language?: 'es' | 'en';
}) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial={language}>
        <SelectedPetProvider>{children}</SelectedPetProvider>
      </LanguageProvider>
    </HeroUINativeProvider>
  );
}

async function renderHealth(language: 'es' | 'en' = 'es') {
  return renderWithProviders(<HealthScreen />, {
    wrapper: ({ children }) => (
      <HealthWrapper language={language}>{children}</HealthWrapper>
    ),
  });
}

beforeEach(() => {
  mockTheme = 'light';
  mockSemanticColors = false;
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
    expect(screen.getByText('Salud')).toBeVisible();
    expect(screen.getByTestId('health-loading')).toBeVisible();
    expect(screen.getByTestId('screen-health').props.contentContainerStyle).toEqual(
      { padding: 24, gap: 16, paddingTop: 52, paddingBottom: 120 },
    );
  });

  it('R5 (mobile-design-drift): aplica el safe area superior al contenido', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderHealth();

    expect(screen.getByTestId('screen-health').props.contentContainerStyle.paddingTop).toBe(52);
    expect((await screen.findByTestId('health-states')).props.style).toEqual({ gap: 16 });
  });

  it('R8 (mobile-design-drift): reserva la altura del loading con Skeleton (enmendado por #199 R21)', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderHealth();

    const loading = await screen.findByTestId('health-loading');
    expect(within(loading).getAllByTestId(/^health-loading-\d+$/, { includeHiddenElements: true }).map(node => node.props.className)).toEqual(['skeleton__root size-10 rounded-full', 'skeleton__root size-10 rounded-full']);
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
      expect(screen.getByTestId('health-empty-title')).toHaveTextContent(
        'Aún no tienes mascotas',
      ),
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
    expect(mockListWeights).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1');
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
    });
    expect(mockListVaccines).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-2');
    expect(mockListWeights).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-2');
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
    expect(screen.getByText('Vacunas')).toBeVisible();
  });

  it('highlights the nearest future dose and keeps row order (enmendado por #199 R14)', async () => {
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
    expect(nextCard.getByText('Próxima dosis')).toBeVisible();
    expect(nextCard.getByText('Rabies')).toBeVisible();
    expect(nextCard.getByTestId('next-vaccine-date')).toHaveTextContent(/^1 de mayo · en \d+ días$/);
    expect(nextCard.queryByText('2099-05-01')).toBeNull();
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

  it('marks an overdue next-dose date with the danger token (enmendado por #199 R17)', async () => {
    mockListVaccines.mockResolvedValue({
      kind: 'ok',
      vaccines: [makeVaccine({ nextDoseAt: '2000-06-01' })],
    });

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('vaccine-row-vaccine-1')).toBeVisible(),
    );
    const overdueDate = screen.getByText('Próxima 1 jun 2000');
    expect(overdueDate.props.className).toContain('text-danger');
  });

  it('shows the vaccines empty state (enmendado por #208 R6)', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ myRole: 'family' })] });
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: [] });

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('vaccines-empty')).toHaveTextContent(
        'Aún no hay vacunas',
      ),
    );
  });

  it.each([
    { kind: 'error' } as const,
    { kind: 'unreachable', message: 'network down' } as const,
  ])('shows and retries a $kind vaccine error (enmendado por #208 R6)', async (state) => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ myRole: 'family' })] });
    mockListVaccines
      .mockResolvedValueOnce(state)
      .mockResolvedValueOnce({ kind: 'ok', vaccines: [] });

    await renderHealth();
    await waitFor(() =>
      expect(screen.getByTestId('vaccines-error')).toHaveTextContent(
        'No se pudieron cargar las vacunas',
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
    mockListWeights.mockImplementation(
      () =>
        new Promise<WeightsState>((resolve) => {
          setTimeout(
            () => resolve({ kind: 'ok', weights: [makeWeight()] }),
            200,
          );
        }),
    );

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('weight-current')).toHaveTextContent('12.4 kg'),
    );
    expect(screen.getByTestId('weight-card')).toBeVisible();
    expect(screen.getByText('Peso')).toBeVisible();
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
        'Aún no hay registros de peso',
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
        'No se pudo cargar el peso',
      ),
    );
    expect(screen.getByTestId('weight-log-link')).toBeVisible();
  });
});

describe('R10: preserva la mascota durante el refetch', () => {
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not replace a new selection while the stale pet list refreshes', async () => {
    const existingPet = makePet({ id: 'pet-old' });
    const createdPet = makePet({ id: 'pet-new', name: 'Nala' });
    const selectPet = jest.fn();
    let resolvePets!: (state: PetsState) => void;
    const revalidatedPets = new Promise<PetsState>((resolve) => {
      resolvePets = resolve;
    });
    const useSelectedPet = selectedPetHooks.useSelectedPet;
    mockListPets.mockResolvedValueOnce({ kind: 'ok', pets: [existingPet] });
    mockListVaccines.mockReturnValue(pending<VaccinesState>());
    mockListWeights.mockReturnValue(pending<WeightsState>());

    const { queryClient, unmount } = await renderHealth();
    await screen.findByTestId(`pet-chip-${existingPet.id}`);

    const selectedPetSpy = jest
      .spyOn(selectedPetHooks, 'useSelectedPet')
      .mockImplementation(() => ({
        ...useSelectedPet(),
        selectedPetId: createdPet.id,
        selectPet,
      }));
    const callsBeforeRefetch = selectedPetSpy.mock.calls.length;
    mockListPets.mockReturnValue(revalidatedPets);
    await act(() => {
      void queryClient.refetchQueries({ queryKey: petKeys.list() });
    });
    await waitFor(() =>
      expect(queryClient.isFetching({ queryKey: petKeys.list() })).toBe(1),
    );
    await waitFor(() =>
      expect(selectedPetSpy.mock.calls.length).toBeGreaterThan(
        callsBeforeRefetch,
      ),
    );

    expect(selectPet).not.toHaveBeenCalled();
    expect(screen.getByTestId(`pet-chip-${existingPet.id}`)).toBeVisible();

    await act(async () => {
      resolvePets({ kind: 'ok', pets: [existingPet, createdPet] });
      await revalidatedPets;
    });
    await waitFor(() =>
      expect(queryClient.isFetching({ queryKey: petKeys.list() })).toBe(0),
    );

    expect(selectPet).not.toHaveBeenCalled();
    await unmount();
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

  it('aplica la receta canónica a Peso (enmendado por #199 R18)', async () => {
    await renderHealth();

    expect((await screen.findByTestId('weight-card-title')).props.className).toBe(
      'text-13 font-bold text-muted',
    );
  });
});

describe('#87 R13: HealthScreen lee por TanStack Query', () => {
  it('deja mascotas, vacunas y el historial de peso en sus claves canónicas', async () => {
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    const petsState: PetsState = { kind: 'ok', pets: [makePet()] };
    const vaccinesState: VaccinesState = {
      kind: 'ok',
      vaccines: [makeVaccine()],
    };
    const weightsState: WeightsState = {
      kind: 'ok',
      weights: [makeWeight()],
    };
    mockListPets.mockResolvedValue(petsState);
    mockListVaccines.mockResolvedValue(vaccinesState);
    mockListWeights.mockResolvedValue(weightsState);

    const { queryClient } = await renderWithProviders(<HealthScreen />, {
      wrapper: HealthWrapper,
    });
    await screen.findByTestId('weight-current');

    expect(queryClient.getQueryData(petKeys.list())).toEqual(petsState);
    expect(queryClient.getQueryData(healthKeys.vaccines('pet-1'))).toEqual(
      vaccinesState,
    );
    expect(queryClient.getQueryData(healthKeys.weights('pet-1', undefined))).toEqual(
      weightsState,
    );
    expect(queryClient.getQueryData(healthKeys.weights('pet-1', 1))).toBeUndefined();
  });
});

describe('#127 R2: el skeleton de vacunas lleva su receta en el árbol', () => {
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

  it('pinta vaccines-skeleton con la clase exacta, rounded-card incluido, la vea o no el recorte de fuente (enmendado por #199 R19)', async () => {
    mockListVaccines.mockReturnValue(pending<VaccinesState>());

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('vaccines-skeleton')).toBeVisible(),
    );
    expect(screen.getByTestId('vaccines-skeleton').props.className).toBe(
      'rounded-card border border-border bg-surface px-3.5 flex-row items-center gap-3 py-3.5',
    );
  });
});

describe('#115 R5: la weight card dibuja la evolución con WeightChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: [] });
  });

  it('con dos o más registros, pasa el historial entero y en orden entre la variación y el enlace (enmendado por #199 R18)', async () => {
    const weights = [
      makeWeight({ id: 'weight-3', weightKg: 12.4, measuredAt: '2026-08-21', variation: 0.4 }),
      makeWeight({ id: 'weight-2', weightKg: 12.0, measuredAt: '2026-08-14' }),
      makeWeight({ id: 'weight-1', weightKg: 11.8, measuredAt: '2026-08-07' }),
    ];
    mockListWeights.mockResolvedValue({ kind: 'ok', weights });
    await renderHealth();
    await screen.findByTestId('weight-chart', { includeHiddenElements: true });

    const card = screen.getByTestId('weight-card');
    expect(card.children).toHaveLength(3);
    expect(elementChild(card, 0).props.className).toBe('flex-row items-end justify-between');
    expect(within(elementChild(card, 0)).getByTestId('weight-variation')).toHaveTextContent('+0.4 kg');
    expect(elementChild(card, 1).props.testID).toBe('weight-chart');
    expect(elementChild(card, 2).props.testID).toBe('weight-log-link');
    expect(screen.getByTestId('weight-current')).toHaveTextContent('12.4 kg');
    const props = mockWeightChart.mock.calls.at(-1)![0];
    expect(props.entries.map(({ id }) => id)).toEqual(['weight-3', 'weight-2', 'weight-1']);
    expect(props.variant).toBe('mini');
  });

  it('con un registro, muestra el aviso de datos insuficientes de WeightChart (enmendado por #199 R18)', async () => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [makeWeight()] });
    await renderHealth();
    await waitFor(() => expect(screen.getByTestId('weight-chart-empty')).toHaveTextContent('Aún no hay datos suficientes'));

    const card = screen.getByTestId('weight-card');
    expect(card.children).toHaveLength(3);
    expect(elementChild(card, 1).props.testID).toBe('weight-chart-empty');
    expect(screen.queryByTestId('weight-chart')).toBeNull();
  });

  it('sin registros, deja el estado vacío y el enlace sin gráfica', async () => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });
    await renderHealth();
    await screen.findByTestId('weight-card-empty');

    const card = screen.getByTestId('weight-card');
    expect(screen.queryByTestId('weight-chart')).toBeNull();
    expect(screen.queryByTestId('weight-chart-empty')).toBeNull();
    expect(card.children).toHaveLength(3);
    expect(elementChild(card, 1).props.testID).toBe('weight-card-empty');
    expect(elementChild(card, 2).props.testID).toBe('weight-log-link');
  });

  it.each([
    { kind: 'error' } as const,
    { kind: 'unreachable', message: 'network down' } as const,
  ])('con error de peso ($kind), no pinta gráfica', async (state) => {
    mockListWeights.mockResolvedValue(state);
    await renderHealth();
    await screen.findByTestId('weight-card-error');

    expect(screen.queryByTestId('weight-chart')).toBeNull();
    expect(screen.queryByTestId('weight-chart-empty')).toBeNull();
  });

  it('mientras el peso carga, no pinta gráfica', async () => {
    mockListWeights.mockReturnValue(pending<WeightsState>());
    await renderHealth();
    await screen.findByTestId('weight-log-link');

    expect(screen.getByTestId('weight-card').children).toHaveLength(2);
    expect(screen.queryByTestId('weight-chart')).toBeNull();
    expect(screen.queryByTestId('weight-chart-empty')).toBeNull();
  });
});

describe('#115 R6: la próxima vacuna dice fecha y días restantes', () => {
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
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });
  });

  afterEach(() => jest.useRealTimers());

  it.each([
    { row: 'a', language: 'es', tz: 'UTC', now: '2026-12-31 12:00', past: '2026-12-30', next: '2026-12-31', days: 'Hoy', label: undefined, date: '31 de diciembre · hoy' },
    { row: 'b', language: 'es', tz: 'UTC', now: '2026-12-31 12:00', past: '2026-12-30', next: '2027-01-02', days: '2 d', label: 'Faltan 2 días', date: '2 de enero · en 2 días' },
    { row: 'c', language: 'es', tz: 'UTC', now: '2027-01-01 12:00', past: '2026-12-31', next: '2027-01-01', days: 'Hoy', label: undefined, date: '1 de enero · hoy' },
    { row: 'd', language: 'es', tz: 'UTC', now: '2027-01-30 12:00', past: '2027-01-29', next: '2027-02-03', days: '4 d', label: 'Faltan 4 días', date: '3 de febrero · en 4 días' },
    { row: 'e', language: 'es', tz: 'UTC', now: '2026-12-31 12:00', past: undefined, next: '2027-12-31', days: '365 d', label: 'Faltan 365 días', date: '31 de diciembre · en 365 días' },
    { row: 'f', language: 'en', tz: 'UTC', now: '2026-12-31 12:00', past: '2026-12-30', next: '2027-01-02', days: '2 d', label: 'In 2 days', date: 'January 2 · in 2 days' },
    { row: 'g', language: 'en', tz: 'UTC', now: '2027-01-01 12:00', past: '2026-12-31', next: '2027-01-01', days: 'Today', label: undefined, date: 'January 1 · due today' },
    { row: 'h', language: 'es', tz: 'America/Mexico_City', now: '2026-12-31 20:00', past: '2026-12-30', next: '2027-01-02', days: '2 d', label: 'Faltan 2 días', date: '2 de enero · en 2 días' },
    { row: 'i', language: 'es', tz: 'UTC', now: '2026-12-31 06:00', past: '2026-12-30', next: '2026-12-31', days: 'Hoy', label: undefined, date: '31 de diciembre · hoy' },
    { row: 'j', language: 'es', tz: 'UTC', now: '2026-12-31 06:00', past: '2026-12-30', next: '2027-01-02', days: '2 d', label: 'Faltan 2 días', date: '2 de enero · en 2 días' },
    { row: 'k', language: 'es', tz: 'America/New_York', now: '2027-03-13 23:30', past: '2027-03-12', next: '2027-03-15', days: '2 d', label: 'Faltan 2 días', date: '15 de marzo · en 2 días' },
    { row: 'l', language: 'es', tz: 'Pacific/Auckland', now: '2027-01-01 10:00', past: '2026-12-31', next: '2027-01-03', days: '2 d', label: 'Faltan 2 días', date: '3 de enero · en 2 días' },
    { row: 'm', language: 'es', tz: 'America/New_York', now: '2027-11-06 12:00', past: '2027-11-05', next: '2027-11-08', days: '2 d', label: 'Faltan 2 días', date: '8 de noviembre · en 2 días' },
    { row: 'n', language: 'es', tz: 'UTC', now: '2026-12-31 12:00', past: '2026-12-30', next: '2027-01-01', days: '1 d', label: 'Faltan 1 días', date: '1 de enero · mañana' },
  ] as const)('fila $row: hoy $now, próxima $next (enmendado por #199 R14) (enmendado por #199 R25)', async ({ language, tz, now, past, next, days, label, date }) => {
    // Jest copies process.env; Node's environment makes Date observe TZ.
    const hostProcess = process.getBuiltinModule('process');
    const previousTZ = hostProcess.env.TZ;
    try {
      hostProcess.env.TZ = tz;
      jest.useFakeTimers();
      const [localDate, localTime] = now.split(' ');
      const [year, month, day] = localDate.split('-').map(Number);
      const [hour, minute] = localTime.split(':').map(Number);
      jest.setSystemTime(new Date(year, month - 1, day, hour, minute));
      const vaccines = [
        ...(past ? [makeVaccine({ id: 'vaccine-past', name: 'Parvo', nextDoseAt: past })] : []),
        makeVaccine({ nextDoseAt: next }),
      ];
      mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines });
      await renderHealth(language);
      await waitFor(() => expect(screen.getByTestId('next-vaccine-days')).toHaveTextContent(days, { exact: true }));

      expect(screen.getByTestId('next-vaccine-days').props.accessibilityLabel).toBe(label);
      expect(screen.getByTestId('next-vaccine-date')).toHaveTextContent(date, { exact: true });
      const card = within(screen.getByTestId('next-vaccine-card'));
      expect(card.getByText('Rabies')).toBeVisible();
      expect(card.queryByText(next)).toBeNull();
    } finally {
      if (previousTZ === undefined) delete hostProcess.env.TZ;
      else hostProcess.env.TZ = previousTZ;
    }
  });

  const NEXT_CARD_BRANCHES = [
    { branch: 'días', next: '2099-05-01', text: '26419 d' },
    { branch: 'hoy', next: '2026-12-31', text: 'Hoy' },
  ] as const;

  it.each(NEXT_CARD_BRANCHES)('ordena la card en icono, columna y días, con la fecha en la columna ($branch) (enmendado por #199 R14)', async ({ next, text }) => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 12 - 1, 31, 12, 0));
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: [makeVaccine({ nextDoseAt: next })] });
    await renderHealth();
    await waitFor(() => expect(screen.getByTestId('next-vaccine-days')).toHaveTextContent(text, { exact: true }));
    const card = screen.getByTestId('next-vaccine-card');

    expect(card.children).toHaveLength(3);
    expect(elementChild(card, 2).props.testID).toBe('next-vaccine-days');
    const column = elementChild(card, 1);
    expect(column.props.className).toBe('flex-1 gap-0.5');
    expect(column.children).toHaveLength(3);
    expect(elementChild(column, 0)).toHaveTextContent('Próxima dosis', { exact: true });
    expect(elementChild(column, 1)).toHaveTextContent('Rabies', { exact: true });
    expect(elementChild(column, 2).props.testID).toBe('next-vaccine-date');
    expect(within(elementChild(card, 0)).getByTestId('health-icon-syringe')).toBeVisible();
  });

  it.each(NEXT_CARD_BRANCHES)('pinta los días con la receta exacta ($branch) (enmendado por #199 R14)', async ({ next, text }) => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 12 - 1, 31, 12, 0));
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: [makeVaccine({ nextDoseAt: next })] });
    await renderHealth();
    await waitFor(() => expect(screen.getByTestId('next-vaccine-days')).toHaveTextContent(text, { exact: true }));
    const days = screen.getByTestId('next-vaccine-days');

    expect(days.props.className).toBe('text-28 font-black text-category-amber-strong');
    expect(days.props.style).toEqual({ fontVariant: ['tabular-nums'] });
    expect(screen.getByTestId('next-vaccine-date').props.className).toBe('text-13 font-semibold text-category-amber-strong');
  });
});

describe('#155 R4: Salud sin mascotas presenta a Pingo', () => {
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

  it('queda en el sitio del vacío que sustituye', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderHealth();
    await screen.findByTestId('health-empty-pose');
    const slot = screen.getByTestId('health-empty');
    expect(slot.parent?.props.testID).toBe('health-states');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['health-empty']);
  });

  it('pinta la pose, el título y la frase de Pingo', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderHealth();
    const pose = await screen.findByTestId('health-empty-pose');
    expect(pose.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-talk\.webp$/) }),
    ]);
    expect(screen.getByTestId('health-empty-title')).toHaveTextContent('Aún no tienes mascotas');
    expect(screen.getByTestId('health-empty-body')).toHaveTextContent('Añade a tu mascota y te ayudo a saber dónde está y cómo está.');
    expect(within(screen.getByTestId('health-empty-action')).getByText('Añadir mascota')).toBeVisible();
  });

  it('lleva a añadir mascota', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderHealth();
    const action = await screen.findByTestId('health-empty-action');
    await fireEvent.press(action);
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/pets/add');
  });
});

const HEALTH_BRANCHES_168 = [
  { name: 'pendiente', state: pending<PetsState>(), branch: 'health-loading' },
  { name: 'error', state: { kind: 'error' } as const, branch: 'health-error' },
  { name: 'unreachable', state: { kind: 'unreachable', message: 'network down' } as const, branch: 'health-error' },
  { name: 'missing-config', state: { kind: 'missing-config' } as const, branch: 'health-error' },
  { name: 'sin mascotas', state: { kind: 'ok', pets: [] } as PetsState, branch: 'health-empty' },
  { name: 'con mascotas', state: { kind: 'ok', pets: [makePet(), makePet({ id: 'pet-2', name: 'Max' })] } as PetsState, branch: 'health-content' },
];

function setupHealth168() {
  jest.clearAllMocks();
  process.env.EXPO_PUBLIC_API_URL = apiUrl;
  mockUseAuth.mockReturnValue({
    status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
  } satisfies AuthContextValue);
  mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet(), makePet({ id: 'pet-2', name: 'Max' })] });
  mockListVaccines.mockImplementation(async (_url, _token, petId) => ({
    kind: 'ok', vaccines: [makeVaccine({ name: petId === 'pet-2' ? 'Vacuna de Max' : 'Vacuna de Luna' })],
  }));
  mockListWeights.mockResolvedValue({ kind: 'ok', weights: [makeWeight()] });
}

describe('#168 R1: Salud pinta el título grande en todas sus ramas', () => {
  beforeEach(setupHealth168);

  it.each(HEALTH_BRANCHES_168)('pinta el título grande ($name) (enmendado por #197 R4)', async ({ state, branch }) => {
    mockListPets.mockImplementation(async () => state);
    await renderHealth();
    await screen.findByTestId(branch);
    const title = screen.getByTestId('health-title');
    expect(title.props.className).toBe('text-3xl font-black tracking-title text-foreground');
    expect(title).toHaveTextContent('Salud');
    expect(elementChild(title.parent!, 0)).toBe(title);
  });
});

describe('#168 R2: Salud sin hero y con métricas estándar', () => {
  beforeEach(setupHealth168);

  it('con mascotas, health-title y health-content son los únicos hijos del scroll, en ese orden (enmendado por #199 R12)', async () => {
    await renderHealth();
    const content = await screen.findByTestId('health-content');
    expect(content.parent!.parent).toBe(screen.getByTestId('screen-health'));
    expect(content.parent!.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['health-header', 'health-content']);
    expect(screen.queryByTestId('pet-hero')).toBeNull();
  });

  it('aplica las métricas estándar al scroll y gap a health-content', async () => {
    await renderHealth();
    const content = await screen.findByTestId('health-content');
    expect(screen.getByTestId('screen-health').props.contentContainerStyle).toEqual({ padding: 24, gap: 16, paddingTop: 52, paddingBottom: 120 });
    expect(content.props.style).toEqual({ gap: 16 });
  });

  it('pone el PetSwitcher como primer hijo de health-content (enmendado por #199 R13) (enmendado por #199 R14) (enmendado por #199 R18)', async () => {
    await renderHealth();
    const content = await screen.findByTestId('health-content');
    const header = screen.getByTestId('health-header');
    expect(header.children).toHaveLength(2);
    const switcher = within(elementChild(header, 1));
    expect(switcher.getByTestId('pet-chip-pet-1')).toBeVisible();
    expect(switcher.getByTestId('pet-chip-pet-2')).toBeVisible();
    expect(elementChild(content, 1).props.testID).toBe('vaccines-section');
    expect(within(elementChild(content, 2)).getByTestId('weight-card').props.testID).toBe('weight-card');
  });

  it('cambia vacunas y peso al pulsar otra mascota (enmendado por #199 R13)', async () => {
    mockListWeights.mockImplementation(async (_url, _token, petId) => ({ kind: 'ok', weights: [makeWeight({ weightKg: petId === 'pet-2' ? 20 : 12 })] }));
    await renderHealth();
    await within(await screen.findByTestId('vaccine-row-vaccine-1')).findByText('Vacuna de Luna');
    const header = screen.getByTestId('health-header');
    expect(header.children).toHaveLength(2);
    const switcher = within(elementChild(header, 1));
    await fireEvent.press(switcher.getByTestId('pet-chip-pet-2'));
    await waitFor(() => expect(within(screen.getByTestId('vaccine-row-vaccine-1')).getByText('Vacuna de Max')).toBeVisible());
    await waitFor(() => expect(screen.getByTestId('weight-current')).toHaveTextContent('20 kg'));
    expect(screen.queryByText('Vacuna de Luna')).toBeNull();
  });

  it.each(HEALTH_BRANCHES_168.slice(0, 5))('sin contenido ($name), health-title precede a health-states (enmendado por #199 R12)', async ({ state, branch }) => {
    mockListPets.mockImplementation(async () => state);
    await renderHealth();
    await screen.findByTestId(branch);
    const states = screen.getByTestId('health-states');
    expect(states.parent!.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['health-header', 'health-states']);
    expect(states.props.style).toEqual({ gap: 16 });
    expect(within(states).queryByTestId('health-title')).toBeNull();
    expect(screen.queryByTestId('pet-hero')).toBeNull();
  });
});

const VACCINES_168 = [
  makeVaccine({ id: 'overdue', name: 'Vencida', appliedAt: '2026-01-01', nextDoseAt: '2026-02-28' }),
  makeVaccine({ id: 'next', name: 'Próxima', appliedAt: '2026-01-02', nextDoseAt: '2026-03-31' }),
  makeVaccine({ id: 'future', name: 'Futura', appliedAt: '2026-01-03', nextDoseAt: '2026-04-02' }),
  makeVaccine({ id: 'completed', name: 'Sin próxima dosis', appliedAt: '2026-01-04', nextDoseAt: null }),
];

describe('#168 R3: cada vacuna lleva su tile pastel', () => {
  beforeEach(() => {
    setupHealth168();
    jest.useFakeTimers({ now: new Date('2026-03-31T12:00:00Z') });
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: VACCINES_168 });
  });
  afterEach(() => jest.useRealTimers());

  it.each([
    { id: 'overdue', surface: 'size-10 items-center justify-center rounded-xl bg-category-rose', icon: 'health-icon-clock', color: 'category-rose-strong', texts: ['Vencida', 'Aplicada 1 ene 2026 · Próxima 28 feb 2026'], dateClass: 'text-danger' },
    { id: 'next', surface: 'size-10 items-center justify-center rounded-xl bg-category-amber', icon: 'health-icon-clock', color: 'category-amber-strong', texts: ['Próxima', 'Aplicada 2 ene 2026 · Próxima 31 mar 2026'], dateClass: undefined },
    { id: 'future', surface: 'size-10 items-center justify-center rounded-xl bg-category-green', icon: 'health-icon-check', color: 'category-green-strong', texts: ['Futura', 'Aplicada 3 ene 2026 · Próxima 2 abr 2026'], dateClass: undefined },
    { id: 'completed', surface: 'size-10 items-center justify-center rounded-xl bg-category-green', icon: 'health-icon-check', color: 'category-green-strong', texts: ['Sin próxima dosis', 'Aplicada 4 ene 2026'], dateClass: undefined },
  ])('pinta el estado de $id con su icono y textos (enmendado por #199 R16) (enmendado por #199 R17)', async ({ id, surface, icon, color, texts, dateClass }) => {
    await renderHealth();
    const row = await screen.findByTestId(`vaccine-row-${id}`);
    const scope = within(row);
    expect(row.children).toHaveLength(2);
    expect(row.props.className).toContain('flex-row items-center gap-3');
    const tile = scope.getByTestId(`vaccine-tile-${id}`, { includeHiddenElements: true });
    const column = scope.getByTestId(`vaccine-text-${id}`);
    expect(elementChild(row, 0)).toBe(tile);
    expect(elementChild(row, 1)).toBe(column);
    expect(tile.props.className).toBe(surface);
    expect(tile.props.style).toEqual({ borderCurve: 'continuous' });
    expect(tile.props.accessibilityElementsHidden).toBe(true);
    expect(tile.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(tile.children).toHaveLength(1);
    const glyph = within(tile).getByTestId(icon, { includeHiddenElements: true });
    expect(elementChild(tile, 0)).toBe(glyph);
    expect(glyph.props.size).toBe(20);
    expect(glyph.props.style).toEqual({ color });
    expect(column.props.className).toBe('flex-1 gap-1');
    expect(column.children).toHaveLength(texts.length);
    texts.forEach((text, index) => {
      const node = within(column).getByText(text);
      expect(elementChild(column, index)).toBe(node);
      expect(node.props.className).toBe(index === 0 ? 'text-15 font-extrabold text-foreground' : 'text-xs text-muted');
    });
    const dates = scope.getByTestId(`vaccine-dates-${id}`);
    const next = within(dates).queryByText(/^Próxima /);
    if (id === 'completed') expect(next).toBeNull();
    else expect(next!.props.className).toBe(dateClass);
  });
});

let selectPet181: ((id: string) => void) | undefined;

function SelectionProbe181() {
  const { selectedPetId, selectPet } = selectedPetHooks.useSelectedPet();
  useEffect(() => {
    selectPet181 = selectPet;
    return () => { selectPet181 = undefined; };
  }, [selectPet]);
  return <Text testID="selected-pet-id">{selectedPetId ?? 'none'}</Text>;
}

describe('#181 R6: health hereda la limpieza de selección', () => {
  it('elimina la selección rancia y conserva el estado vacío', async () => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    mockListVaccines.mockResolvedValue({ kind: 'error' });
    mockListWeights.mockResolvedValue({ kind: 'error' });
    const { queryClient } = await renderWithProviders(
      <><SelectionProbe181 /><HealthScreen /></>, { wrapper: HealthWrapper },
    );
    await screen.findByTestId('health-empty');
    await act(async () => { selectPet181?.('pet-stale'); });
    await waitFor(() => expect(screen.getByTestId('selected-pet-id')).toHaveTextContent('none'));
    await screen.findByTestId('health-empty');
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
  });
});


describe('#199 R12: cabecera de Salud', () => {
  beforeEach(setupHealth168);
  it('#199 R12 con mascotas, health-header y health-content son los únicos hijos del scroll', async () => {
    await renderHealth();
    const content = await screen.findByTestId('health-content');
    expect(content.parent!.children.map(child => typeof child === 'string' ? child : child.props.testID)).toEqual(['health-header', 'health-content']);
  });
  it('#199 R12 health-header es una fila justify-between que empieza por health-title', async () => {
    await renderHealth();
    const header = await screen.findByTestId('health-header');
    expect(header.type).toBe('View');
    expect(header.props.className).toBe('flex-row items-center justify-between');
    expect(elementChild(header, 0).props.testID).toBe('health-title');
    expect(elementChild(header, 0)).toHaveTextContent('Salud', { exact: true });
  });
});


describe('#199 R13: avatares de Salud', () => {
  beforeEach(setupHealth168);
  it('#199 R13 el selector va en health-header tras health-title en su variante avatars', async () => {
    await renderHealth();
    const content = await screen.findByTestId('health-content');
    const header = screen.getByTestId('health-header');
    expect(header.children).toHaveLength(2);
    expect(elementChild(header, 0).props.testID).toBe('health-title');
    const switcher = within(elementChild(header, 1));
    for (const id of ['pet-1', 'pet-2']) {
      expect(switcher.getByTestId(`pet-avatar-fallback-${id}`).props.className.split(' ').slice(0, 2)).toEqual(['text-sm', 'font-extrabold']);
    }
    expect(within(content).queryAllByTestId(/^pet-chip-/)).toHaveLength(0);
  });
});


function riseDelayOf(node: TestInstance): number | undefined {
  let host: TestInstance | null = node;
  while (host) {
    if (typeof host.props.delayMs === 'number') return host.props.delayMs;
    host = host.parent;
  }
  return undefined;
}

describe('#199 R14: panel de la próxima dosis', () => {
  beforeEach(() => {
    setupHealth168();
    mockSemanticColors = true;
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 9, 6, 12));
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: [makeVaccine({ nextDoseAt: '2026-10-12' })] });
  });
  afterEach(() => jest.useRealTimers());
  it('#199 R14 next-vaccine-card es un View rounded-24 sobre el pastel ámbar con esquina continua', async () => {
    await renderHealth();
    const card = await screen.findByTestId('next-vaccine-card');
    expect(card.type).toBe('View');
    expect(card.props.className).toBe('flex-row items-center gap-3.5 rounded-24 p-4 bg-category-amber');
    expect(card.props.style).toEqual({ borderCurve: 'continuous' });
    const content = screen.getByTestId('health-content');
    expect(within(elementChild(content, 0)).getByTestId('next-vaccine-card').props.testID).toBe('next-vaccine-card');
    expect(elementChild(content, 1).props.testID).toBe('vaccines-section');
  });
  it('#199 R14 el tile es size-13 rounded-16 bg-surface con la jeringa a 26 en warning', async () => {
    await renderHealth();
    const tile = elementChild(await screen.findByTestId('next-vaccine-card'), 0);
    expect(tile.props.className).toBe('size-13 items-center justify-center rounded-16 bg-surface');
    expect(tile.props.style).toEqual({ borderCurve: 'continuous' });
    const icon = within(tile).getByTestId('health-icon-syringe');
    expect(icon.props.size).toBe(26);
    expect(icon.props.strokeWidth).toBe(2.2);
    expect(icon.props.style.color).toBe('warning');
  });
  it('#199 R14 caps, nombre y fecha llevan sus clases exactas', async () => {
    await renderHealth();
    const card = await screen.findByTestId('next-vaccine-card');
    const column = elementChild(card, 1);
    expect(column.props.className).toBe('flex-1 gap-0.5');
    expect(elementChild(column, 0).props.className).toBe('text-xs font-extrabold uppercase tracking-caps text-category-amber-strong');
    expect(elementChild(column, 1).props.className).toBe('text-lg font-black text-foreground');
    expect(screen.getByTestId('next-vaccine-date').props.className).toBe('text-13 font-semibold text-category-amber-strong');
    expect(screen.getByTestId('next-vaccine-days').props.className).toBe('text-28 font-black text-category-amber-strong');
    expect(screen.getByTestId('next-vaccine-days').props.style).toEqual({ fontVariant: ['tabular-nums'] });
  });
  it.each([
    ['31 de diciembre · hoy', '2025-12-31', '2025-12-31'],
    ['1 de enero · mañana', '2025-12-31', '2026-01-01'],
    ['12 de octubre · en 6 días', '2026-10-06', '2026-10-12'],
  ])('#199 R14 la fecha dice %s', async (expected, today, nextDoseAt) => {
    const [year, month, day] = today.split('-').map(Number);
    jest.setSystemTime(new Date(year, month - 1, day, 12));
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: [makeVaccine({ nextDoseAt })] });
    await renderHealth();
    expect(await screen.findByTestId('next-vaccine-date')).toHaveTextContent(expected, { exact: true });
  });
  it('#199 R14 entra con RiseIn sin retraso', async () => {
    await renderHealth();
    expect(riseDelayOf(await screen.findByTestId('next-vaccine-card'))).toBe(0);
  });
});


describe('#199 R15: título de Vacunas', () => {
  beforeEach(setupHealth168);
  it('#199 R15 Vacunas es un h2 de text-lg font-extrabold sin icono (enmendado por #208 R5)', async () => {
    await renderHealth();
    const title = await screen.findByTestId('vaccines-title');
    expect(title.type).toBe('Text');
    expect(title.props.accessibilityRole).toBe('header');
    expect(title.props.className).toBe('mt-1 text-lg font-extrabold text-foreground');
    expect(title).toHaveTextContent('Vacunas', { exact: true });
    expect(elementChild(screen.getByTestId('vaccines-section'), 0).props.testID).toBe('vaccines-header');
    expect(elementChild(screen.getByTestId('vaccines-header'), 0).props.testID).toBe('vaccines-title');
    expect(within(screen.getByTestId('vaccines-section')).queryByTestId('health-icon-heart-pulse')).toBeNull();
  });
  it('#199 R15 vaccines-section separa sus hijos con gap-2.5', async () => {
    await renderHealth();
    expect((await screen.findByTestId('vaccines-section')).props.className).toBe('gap-2.5');
  });
});


describe('#199 R16: filas de vacunas', () => {
  beforeEach(() => {
    setupHealth168();
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: [0, 1, 2, 3].map(index => makeVaccine({ id: `vax-${index}`, name: `Vacuna ${index}`, nextDoseAt: null })) });
  });
  it('#199 R16 cada vacuna es un Card flat con py-3.5 y nombre text-15 font-extrabold', async () => {
    await renderHealth();
    const row = await screen.findByTestId('vaccine-row-vax-0');
    expect(row.props.className).toBe('rounded-card border border-border bg-surface px-3.5 flex-row items-center gap-3 py-3.5');
    const name = within(row).getByText('Vacuna 0');
    expect(name.type).toBe('Text');
    expect(name.props.className).toBe('text-15 font-extrabold text-foreground');
    const tile = screen.getByTestId('vaccine-tile-vax-0', { includeHiddenElements: true });
    expect(tile.props.className).toBe('size-10 items-center justify-center rounded-xl bg-category-green');
    expect(within(tile).getByTestId('health-icon-check', { includeHiddenElements: true }).props.size).toBe(20);
  });
  it.each([[0, 80], [1, 140], [2, 200], [3, 200]])('#199 R16 la fila %i entra a los %i ms', async (index, delay) => {
    await renderHealth();
    expect(riseDelayOf(await screen.findByTestId(`vaccine-row-vax-${index}`))).toBe(delay);
  });
});


describe('#199 R17: subtítulo de vacunas', () => {
  beforeEach(() => {
    setupHealth168();
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 2, 31, 12));
  });
  afterEach(() => jest.useRealTimers());
  async function renderDates199(overrides: Partial<Vaccine>) {
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: [makeVaccine(overrides)] });
    await renderHealth();
    return screen.findByTestId('vaccine-dates-vaccine-1');
  }
  it('#199 R17 dice Aplicada y Próxima en una línea', async () => {
    const dates = await renderDates199({ appliedAt: '2025-12-31', nextDoseAt: '2026-01-01' });
    expect(dates.type).toBe('Text');
    expect(dates.props.className).toBe('text-xs text-muted');
    expect(dates).toHaveTextContent('Aplicada 31 dic 2025 · Próxima 1 ene 2026', { exact: true });
    expect(screen.getByTestId('vaccine-text-vaccine-1').children).toHaveLength(2);
    expect(within(dates).getByText('Próxima 1 ene 2026').parent === dates).toBe(true);
  });
  it('#199 R17 una dosis vencida pinta Próxima en text-danger', async () => {
    const dates = await renderDates199({ nextDoseAt: '2026-03-30' });
    expect(within(dates).getByText('Próxima 30 mar 2026').props.className).toBe('text-danger');
  });
  it('#199 R17 una dosis vigente no pinta text-danger', async () => {
    const dates = await renderDates199({ nextDoseAt: '2026-04-01' });
    expect(within(dates).getByText('Próxima 1 abr 2026').props.className).not.toBe('text-danger');
  });
  it('#199 R17 sin próxima dosis solo dice Aplicada', async () => {
    const dates = await renderDates199({ appliedAt: '2025-12-31', nextDoseAt: null });
    expect(dates).toHaveTextContent('Aplicada 31 dic 2025', { exact: true });
    expect(within(dates).queryByText(/^Próxima /)).toBeNull();
  });
});


describe('#199 R18: tarjeta de peso', () => {
  beforeEach(() => {
    setupHealth168();
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [makeWeight(), makeWeight({ id: 'old', measuredAt: '2025-01-01', weightKg: 12 })] });
  });
  it('#199 R18 weight-card es un View rounded-24 bg-surface-secondary sin borde con esquina continua', async () => {
    await renderHealth();
    const card = await screen.findByTestId('weight-card');
    expect(card.type).toBe('View');
    expect(card.props.className).toBe('gap-3 rounded-24 bg-surface-secondary p-4');
    expect(card.props.style).toEqual({ borderCurve: 'continuous' });
  });
  it('#199 R18 la cabecera pone Peso y la cifra a la izquierda y la píldora a la derecha', async () => {
    await renderHealth();
    const current = await screen.findByTestId('weight-current');
    const card = screen.getByTestId('weight-card');
    const row = elementChild(card, 0);
    expect(row.props.className).toBe('flex-row items-end justify-between');
    const column = elementChild(row, 0);
    expect(column.props.className).toBe('gap-0.5');
    expect(column.children.map(child => typeof child === 'string' ? child : child.props.testID)).toEqual(['weight-card-title', 'weight-current']);
    expect(screen.getByTestId('weight-card-title').props.className).toBe('text-13 font-bold text-muted');
    expect(current.props.className).toBe('text-3xl font-black text-foreground');
    expect(current.props.style).toEqual({ fontVariant: ['tabular-nums'] });
    expect(elementChild(row, 1).props.testID).toBe('weight-variation');
  });
  it.each([
    [0.4, 'bg-category-rose', 'text-category-rose-strong', '+0.4 kg'],
    [-0.2, 'bg-category-green', 'text-category-green-strong', '-0.2 kg'],
    [0, 'bg-default', 'text-muted', '0 kg'],
  ] as const)('#199 R18 variación %s usa %s y %s', async (variation, surface, ink, expected) => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [makeWeight({ variation })] });
    await renderHealth();
    const pill = await screen.findByTestId('weight-variation');
    expect(pill.type).toBe('View');
    expect(pill.props.className).toBe(`rounded-full px-2.5 py-1 ${surface}`);
    const text = elementChild(pill, 0);
    expect(text.type).toBe('Text');
    expect(text.props.className).toBe(`text-13 font-extrabold ${ink}`);
    expect(text.props.style).toEqual({ fontVariant: ['tabular-nums'] });
    expect(text).toHaveTextContent(expected, { exact: true });
  });
  it('#199 R18 pasa variant mini y el historial entero a WeightChart', async () => {
    await renderHealth();
    await screen.findByTestId('weight-chart', { includeHiddenElements: true });
    const props = mockWeightChart.mock.calls.at(-1)![0];
    expect(props.variant).toBe('mini');
    expect(props.entries.map(entry => entry.id)).toEqual(['weight-1', 'old']);
  });
  it('#199 R18 el enlace es rounded-14 bg-surface con etiqueta text-15 y chevron de 18', async () => {
    await renderHealth();
    const link = await screen.findByTestId('weight-log-link');
    expect(link.props.className).toBe('flex-row items-center justify-between rounded-14 bg-surface px-3.5 py-3');
    expect(link.props.style).toEqual({ borderCurve: 'continuous' });
    expect(link.props.hitSlop).toEqual({ top: 6, bottom: 6, left: 6, right: 6 });
    expect(within(link).getByText('Registro de peso').props.className).toBe('text-15 font-bold text-foreground');
    expect(within(link).getByTestId('health-icon-chevron-right').props.size).toBe(18);
  });
  it('#199 R18 entra con RiseIn a los 260 ms', async () => {
    await renderHealth();
    expect(riseDelayOf(await screen.findByTestId('weight-card'))).toBe(260);
  });
});


describe('#199 R19: estados de vacunas', () => {
  beforeEach(setupHealth168);
  it('#199 R19 la carga pinta una fila flat con tile y dos barras', async () => {
    mockListVaccines.mockReturnValue(pending<VaccinesState>());
    await renderHealth();
    const row = await screen.findByTestId('vaccines-skeleton');
    expect(row.props.className).toBe('rounded-card border border-border bg-surface px-3.5 flex-row items-center gap-3 py-3.5');
    expect(within(row).getByTestId('vaccines-skeleton-tile', { includeHiddenElements: true }).props.className).toBe('skeleton__root size-10 rounded-xl');
    const column = elementChild(row, 1);
    expect(column.props.className).toBe('flex-1 gap-1.5');
    expect(column.children.filter((child): child is TestInstance => typeof child !== 'string').map(child => child.props.className)).toEqual(['skeleton__root h-3.5 w-1/3 rounded-full', 'skeleton__root h-2.5 w-2/3 rounded-full']);
  });
  it('#199 R19 sin vacunas pinta el aviso en text-15 leading-body text-muted (enmendado por #208 R6)', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ myRole: 'family' })] });
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: [] });
    await renderHealth();
    const empty = await screen.findByTestId('vaccines-empty');
    expect(empty.props.className).toBe('text-15 leading-body text-muted');
    expect(empty).toHaveTextContent('Aún no hay vacunas', { exact: true });
  });
  it('#199 R19 con error pinta el aviso en text-danger con role alert y conserva Reintentar', async () => {
    mockListVaccines.mockResolvedValue({ kind: 'error' });
    await renderHealth();
    const error = await screen.findByTestId('vaccines-error');
    expect(error.props.className).toBe('text-15 leading-body text-danger');
    expect(error.props.accessibilityRole).toBe('alert');
    expect(screen.getByTestId('vaccines-retry')).toHaveTextContent('Reintentar');
    expect(error).toHaveTextContent('No se pudieron cargar las vacunas', { exact: true });
  });
});


describe('#199 R20: peso vacío y con error', () => {
  beforeEach(setupHealth168);
  function expectNoWeightData199() {
    expect(screen.queryByTestId('weight-current')).toBeNull();
    expect(screen.queryByTestId('weight-variation')).toBeNull();
    expect(screen.queryByTestId('weight-chart', { includeHiddenElements: true })).toBeNull();
    expect(screen.queryByTestId('weight-chart-empty')).toBeNull();
  }
  it('#199 R20 sin registros conserva envoltorio, Peso, aviso y enlace', async () => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });
    await renderHealth();
    const empty = await screen.findByTestId('weight-card-empty');
    const card = screen.getByTestId('weight-card');
    expect(card.props.className).toBe('gap-3 rounded-24 bg-surface-secondary p-4');
    expect(card.props.style).toEqual({ borderCurve: 'continuous' });
    expect(riseDelayOf(card)).toBe(260);
    expect(within(card).getByTestId('weight-card-title')).toHaveTextContent('Peso', { exact: true });
    expect(empty.props.className).toBe('text-15 leading-body text-muted');
    expect(empty).toHaveTextContent('Aún no hay registros de peso', { exact: true });
    expect(within(card).getByTestId('weight-log-link')).toBeVisible();
    expectNoWeightData199();
  });
  it('#199 R20 con error pinta el aviso en text-danger con role alert dentro de la tarjeta', async () => {
    mockListWeights.mockResolvedValue({ kind: 'error' });
    await renderHealth();
    const error = await screen.findByTestId('weight-card-error');
    const card = screen.getByTestId('weight-card');
    expect(within(card).getByTestId('weight-card-error').props.testID).toBe('weight-card-error');
    expect(card.props.className).toBe('gap-3 rounded-24 bg-surface-secondary p-4');
    expect(card.props.style).toEqual({ borderCurve: 'continuous' });
    expect(riseDelayOf(card)).toBe(260);
    expect(error.props.className).toBe('text-15 leading-body text-danger');
    expect(error.props.accessibilityRole).toBe('alert');
    expect(error).toHaveTextContent('No se pudo cargar el peso', { exact: true });
    expect(within(card).getByTestId('weight-log-link')).toBeVisible();
    expectNoWeightData199();
  });
});


describe('#199 R21: estados de mascotas', () => {
  beforeEach(setupHealth168);
  it('#199 R21 la carga pinta dos círculos de 40 en fila', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());
    await renderHealth();
    const loading = await screen.findByTestId('health-loading');
    expect(loading.type).toBe('View');
    expect(loading.props.className).toBe('flex-row gap-2.5');
    const circles = within(loading).getAllByTestId(/^health-loading-\d+$/, { includeHiddenElements: true });
    expect(circles.map(node => node.props.testID)).toEqual(['health-loading-0', 'health-loading-1']);
    expect(circles.map(node => node.props.className)).toEqual(['skeleton__root size-10 rounded-full', 'skeleton__root size-10 rounded-full']);
    expect(loading.parent!.props.testID).toBe('health-states');
  });
  it('#199 R21 el error pinta el aviso en text-15 leading-body text-danger con role alert', async () => {
    mockListPets.mockResolvedValue({ kind: 'error' });
    await renderHealth();
    const error = await screen.findByTestId('health-error');
    expect(error.props.className).toBe('text-15 leading-body text-danger');
    expect(error.props.accessibilityRole).toBe('alert');
    expect(error).toHaveTextContent('Algo salió mal', { exact: true });
    expect(screen.getByTestId('health-retry')).toHaveTextContent('Reintentar');
  });
});


const flatVaccineStyle = (style: unknown) => Object.assign({}, ...[style].flat(Infinity));

describe('#208 R5: acceso al alta desde Salud', () => {
  beforeEach(setupHealth168);
  it('#208 R5: el owner ve «Agregar vacuna» con la receta compacta y abre el alta de su mascota', async () => {
    mockSemanticColors = true;
    await renderHealth();
    const add = await screen.findByTestId('vaccines-add');
    expect(screen.getByTestId('vaccines-header').props.className).toBe('flex-row items-center justify-between');
    expect(elementChild(screen.getByTestId('vaccines-header'), 0).props.testID).toBe('vaccines-title');
    expect(add.props.className).toContain('rounded-xl bg-accent h-10 gap-1.5 px-3.5');
    expect(flatVaccineStyle(add.props.style)).toMatchObject({ boxShadow: [{ offsetX: 0, offsetY: 3, blurRadius: 0, spreadDistance: 0, color: 'lip' }] });
    const label = within(add).getByText('Agregar vacuna', { exact: true });
    expect(label.props.className).toContain('text-sm font-extrabold text-accent-foreground');
    const icon = within(add).getByTestId('health-icon-plus', { includeHiddenElements: true });
    expect(icon.props.size).toBe(16);
    expect(icon.props.style.color).toBe('accent-foreground');
    await fireEvent.press(add);
    expect(mockRouter.push).toHaveBeenCalledWith({ pathname: '/pets/[petId]/vaccines/new', params: { petId: 'pet-1' } });
  });
  it.each(['family', 'walker', 'vet'] as const)('#208 R5: %s no ve «Agregar vacuna»', async myRole => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ myRole })] });
    await renderHealth();
    const header = await screen.findByTestId('vaccines-header');
    expect(header.children).toHaveLength(1);
    expect(screen.queryByTestId('vaccines-add')).toBeNull();
  });
});


describe('#208 R6: vacío de vacunas por rol', () => {
  beforeEach(() => {
    setupHealth168();
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: [] });
  });
  it('#208 R6: el owner sin vacunas ve la tarjeta del canvas con sus cuatro hijos y copy literal', async () => {
    mockSemanticColors = true;
    await renderHealth();
    const card = await screen.findByTestId('vaccines-empty-card');
    expect(card.props.className).toBe('items-center gap-2.5 rounded-24 bg-surface-secondary px-4.5 pb-4.5 pt-5.5');
    expect(card.props.style).toEqual({ borderCurve: 'continuous' });
    expect(card.children).toHaveLength(4);
    expect(card.children.map(child => typeof child === 'string' ? child : child.props.testID)).toEqual(['vaccines-empty-tile', 'vaccines-empty-card-title', 'vaccines-empty-card-body', 'vaccines-empty-action']);
    const tile = screen.getByTestId('vaccines-empty-tile', { includeHiddenElements: true });
    expect(tile.props.className).toBe('size-14 items-center justify-center rounded-tile bg-surface');
    expect(tile.props.style).toEqual({ borderCurve: 'continuous' });
    const icon = within(tile).getByTestId('health-icon-syringe', { includeHiddenElements: true });
    expect(icon.props.size).toBe(28);
    expect(icon.props.style.color).toBe('accent-strong');
    expect(screen.getByTestId('vaccines-empty-card-title').props.className).toBe('text-17 font-black text-foreground text-center');
    expect(screen.getByTestId('vaccines-empty-card-title')).toHaveTextContent('Aún no hay vacunas', { exact: true });
    expect(screen.getByTestId('vaccines-empty-card-body').props.className).toBe('text-sm font-medium leading-note text-muted text-center');
    expect(screen.getByText('Registra la primera vacuna de Luna y te aviso antes de cada próxima dosis.', { exact: true })).toBeVisible();
    const action = screen.getByTestId('vaccines-empty-action');
    expect(action.props.className).toContain('w-full h-14 rounded-16 bg-accent');
    expect(flatVaccineStyle(action.props.style)).toMatchObject({ boxShadow: [{ offsetX: 0, offsetY: 4, blurRadius: 0, spreadDistance: 0, color: 'lip' }] });
    expect(within(action).getByText('Agregar vacuna', { exact: true }).props.className).toBe('text-17 font-extrabold text-accent-foreground');
    const plus = within(action).getByTestId('health-icon-plus', { includeHiddenElements: true });
    expect(plus.props.size).toBe(20);
    expect(plus.props.style.color).toBe('accent-foreground');
    expect(screen.queryByTestId('vaccines-empty')).toBeNull();
  });
  it('#208 R6: el CTA del vacío abre el alta de vacuna de la mascota', async () => {
    await renderHealth();
    await fireEvent.press(await screen.findByTestId('vaccines-empty-action'));
    expect(mockRouter.push).toHaveBeenCalledWith({ pathname: '/pets/[petId]/vaccines/new', params: { petId: 'pet-1' } });
  });
  it.each(['family', 'walker', 'vet'] as const)('#208 R6: %s sin vacunas ve el aviso plano sin CTA', async myRole => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ myRole })] });
    await renderHealth();
    const empty = await screen.findByTestId('vaccines-empty');
    expect(empty.props.className).toBe('text-15 leading-body text-muted');
    expect(empty).toHaveTextContent('Aún no hay vacunas', { exact: true });
    expect(screen.queryByTestId('vaccines-empty-card')).toBeNull();
    expect(screen.queryByTestId('vaccines-empty-action')).toBeNull();
  });
});
