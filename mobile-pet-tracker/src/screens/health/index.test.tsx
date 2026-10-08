import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
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
  '../../theme/use-theme-colors',
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
      { gap: 16, paddingBottom: 120 },
    );
  });

  it('R5 (mobile-design-drift): aplica el safe area superior al contenido', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderHealth();

    expect((await screen.findByTestId('health-states')).props.style).toEqual(
      { paddingHorizontal: 24, paddingTop: 52, gap: 16 },
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
    expect(nextCard.getByText('Próxima dosis')).toBeVisible();
    expect(nextCard.getByText('Rabies')).toBeVisible();
    expect(nextCard.getByText('1 may 2099')).toBeVisible();
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
        'Aún no hay vacunas',
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

  it('aplica la receta canónica a Peso', async () => {
    await renderHealth();

    expect((await screen.findByTestId('weight-card-title')).props.className).toBe(
      'text-base font-bold text-foreground',
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

  it('pinta vaccines-skeleton con la clase exacta, rounded-card incluido, la vea o no el recorte de fuente', async () => {
    mockListVaccines.mockReturnValue(pending<VaccinesState>());

    await renderHealth();

    await waitFor(() =>
      expect(screen.getByTestId('vaccines-skeleton')).toBeVisible(),
    );
    expect(screen.getByTestId('vaccines-skeleton').props.className).toBe(
      'skeleton__root h-24 w-full rounded-card',
    );
  });
});

describe('#115 R2: Salud abre con el hero a sangre (A9)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: [] });
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });
  });

  it('con mascotas, pet-hero y health-content son los únicos hijos del scroll, en ese orden', async () => {
    await renderHealth();
    await waitFor(() => expect(screen.getByTestId('pet-hero-name')).toHaveTextContent('Luna'));

    const hero = screen.getByTestId('pet-hero');
    const content = screen.getByTestId('health-content');
    expect(hero.parent).toBe(content.parent);
    expect(hero.parent!.parent).toBe(screen.getByTestId('screen-health'));
    expect(hero.parent!.children).toHaveLength(2);
    expect(elementChild(hero.parent!, 0)).toBe(hero);
    expect(elementChild(hero.parent!, 1)).toBe(content);
    expect(hero.props.className).toBe('overflow-hidden bg-default');
    expect(screen.queryByTestId('health-states')).toBeNull();
  });

  it('saca el padding horizontal a health-content y deja gap y paddingBottom en el scroll', async () => {
    await renderHealth();
    await waitFor(() => {
      const content = screen.getByTestId('health-content');
      expect(within(content).getByTestId('vaccines-section')).toBeVisible();
      expect(within(content).getByTestId('weight-card')).toBeVisible();
    });
    const content = screen.getByTestId('health-content');

    expect(screen.getByTestId('screen-health').props.contentContainerStyle).toEqual({ gap: 16, paddingBottom: 120 });
    expect(content.props.style).toEqual({ paddingHorizontal: 24, gap: 16 });
    expect(within(content).getByTestId('vaccines-section')).toBeVisible();
    expect(within(content).getByTestId('weight-card')).toBeVisible();
  });

  it('con contenido no pinta el título Salud', async () => {
    await renderHealth();
    await screen.findByTestId('pet-hero-name');

    expect(screen.queryByText('Salud')).toBeNull();
  });

  it.each([
    { name: 'pendiente', state: pending<PetsState>(), branch: 'health-loading' },
    { name: 'error', state: { kind: 'error' } as const, branch: 'health-error' },
    { name: 'unreachable', state: { kind: 'unreachable', message: 'network down' } as const, branch: 'health-error' },
    { name: 'missing-config', state: { kind: 'missing-config' } as const, branch: 'health-error' },
    { name: 'vacía', state: { kind: 'ok', pets: [] } as PetsState, branch: 'health-empty' },
  ])('sin contenido ($name), agrupa título y rama en health-states sin hero', async ({ state, branch }) => {
    mockListPets.mockImplementation(async () => state);
    await renderHealth();
    await waitFor(() => expect(within(screen.getByTestId('health-states')).getByTestId(branch)).toBeVisible());

    const states = screen.getByTestId('health-states');
    expect(states.props.style).toEqual({ paddingHorizontal: 24, paddingTop: 52, gap: 16 });
    expect(within(states).getByText('Salud')).toBeVisible();
    expect(within(states).getByText('Salud').props.className).toBe('text-2xl font-black text-foreground');
    expect(screen.getByTestId('screen-health').props.contentContainerStyle).toEqual({ gap: 16, paddingBottom: 120 });
    if (branch === 'health-error') expect(within(states).getByTestId('health-retry')).toBeVisible();
    expect(screen.queryByTestId('pet-hero')).toBeNull();
    expect(screen.queryByTestId('health-content')).toBeNull();
  });
});

describe('#115 R3: el hero muestra la mascota seleccionada de la lista', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: [] });
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });
  });

  it('pinta nombre, raza y media de la mascota sin estado ni dato destacado', async () => {
    await renderHealth();
    await waitFor(() => expect(screen.getByTestId('pet-hero-name')).toHaveTextContent('Luna'));

    expect(screen.getByTestId('pet-hero-breed')).toHaveTextContent('Mixed');
    expect(screen.getByTestId('pet-hero-media')).toBeVisible();
    expect(screen.queryByTestId('pet-hero-skeleton')).toBeNull();
    expect(screen.queryByTestId('pet-hero-status')).toBeNull();
    expect(screen.queryByTestId('pet-hero-highlight-value')).toBeNull();
  });

  it('pone el PetSwitcher en el slot del hero', async () => {
    await renderHealth();
    const slot = await screen.findByTestId('pet-hero-slot');

    expect(within(slot).getByTestId('pet-chip-pet-1')).toBeVisible();
    expect(slot.children).toHaveLength(1);
  });

  it('cambia el hero al pulsar otra mascota', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet(), makePet({ id: 'pet-2', name: 'Max' })] });
    await renderHealth();
    await waitFor(() => expect(within(screen.getByTestId('pet-hero')).getByTestId('pet-hero-name')).toHaveTextContent('Luna'));
    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));
    await waitFor(() => expect(within(screen.getByTestId('pet-hero')).getByTestId('pet-hero-name')).toHaveTextContent('Max'));
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

  it('con dos o más registros, pasa el historial entero y en orden entre la variación y el enlace', async () => {
    const weights = [
      makeWeight({ id: 'weight-3', weightKg: 12.4, measuredAt: '2026-08-21', variation: 0.4 }),
      makeWeight({ id: 'weight-2', weightKg: 12.0, measuredAt: '2026-08-14' }),
      makeWeight({ id: 'weight-1', weightKg: 11.8, measuredAt: '2026-08-07' }),
    ];
    mockListWeights.mockResolvedValue({ kind: 'ok', weights });
    await renderHealth();
    await screen.findByTestId('weight-chart');

    const card = screen.getByTestId('weight-card');
    expect(card.children).toHaveLength(4);
    expect(elementChild(card, 1).props.className).toBe('flex-row justify-end');
    expect(within(elementChild(card, 1)).getByTestId('weight-variation')).toHaveTextContent('+0.4 kg');
    expect(elementChild(card, 2).props.testID).toBe('weight-chart');
    expect(elementChild(card, 3).props.testID).toBe('weight-log-link');
    expect(screen.getByTestId('weight-current')).toHaveTextContent('12.4 kg');
    const props = mockWeightChart.mock.calls.at(-1)![0];
    expect(props.entries.map(({ id }) => id)).toEqual(['weight-3', 'weight-2', 'weight-1']);
  });

  it('con un registro, muestra el aviso de datos insuficientes de WeightChart', async () => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [makeWeight()] });
    await renderHealth();
    await waitFor(() => expect(screen.getByTestId('weight-chart-empty')).toHaveTextContent('Aún no hay datos suficientes'));

    const card = screen.getByTestId('weight-card');
    expect(card.children).toHaveLength(4);
    expect(elementChild(card, 2).props.testID).toBe('weight-chart-empty');
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
    { row: 'a', language: 'es', tz: 'UTC', now: '2026-12-31 12:00', past: '2026-12-30', next: '2026-12-31', days: 'Hoy', label: undefined, date: '31 dic 2026' },
    { row: 'b', language: 'es', tz: 'UTC', now: '2026-12-31 12:00', past: '2026-12-30', next: '2027-01-02', days: '2 d', label: 'Faltan 2 días', date: '2 ene 2027' },
    { row: 'c', language: 'es', tz: 'UTC', now: '2027-01-01 12:00', past: '2026-12-31', next: '2027-01-01', days: 'Hoy', label: undefined, date: '1 ene 2027' },
    { row: 'd', language: 'es', tz: 'UTC', now: '2027-01-30 12:00', past: '2027-01-29', next: '2027-02-03', days: '4 d', label: 'Faltan 4 días', date: '3 feb 2027' },
    { row: 'e', language: 'es', tz: 'UTC', now: '2026-12-31 12:00', past: undefined, next: '2027-12-31', days: '365 d', label: 'Faltan 365 días', date: '31 dic 2027' },
    { row: 'f', language: 'en', tz: 'UTC', now: '2026-12-31 12:00', past: '2026-12-30', next: '2027-01-02', days: '2 d', label: 'In 2 days', date: 'Jan 2, 2027' },
    { row: 'g', language: 'en', tz: 'UTC', now: '2027-01-01 12:00', past: '2026-12-31', next: '2027-01-01', days: 'Today', label: undefined, date: 'Jan 1, 2027' },
    { row: 'h', language: 'es', tz: 'America/Mexico_City', now: '2026-12-31 20:00', past: '2026-12-30', next: '2027-01-02', days: '2 d', label: 'Faltan 2 días', date: '2 ene 2027' },
    { row: 'i', language: 'es', tz: 'UTC', now: '2026-12-31 06:00', past: '2026-12-30', next: '2026-12-31', days: 'Hoy', label: undefined, date: '31 dic 2026' },
    { row: 'j', language: 'es', tz: 'UTC', now: '2026-12-31 06:00', past: '2026-12-30', next: '2027-01-02', days: '2 d', label: 'Faltan 2 días', date: '2 ene 2027' },
    { row: 'k', language: 'es', tz: 'America/New_York', now: '2027-03-13 23:30', past: '2027-03-12', next: '2027-03-15', days: '2 d', label: 'Faltan 2 días', date: '15 mar 2027' },
    { row: 'l', language: 'es', tz: 'Pacific/Auckland', now: '2027-01-01 10:00', past: '2026-12-31', next: '2027-01-03', days: '2 d', label: 'Faltan 2 días', date: '3 ene 2027' },
    { row: 'm', language: 'es', tz: 'America/New_York', now: '2027-11-06 12:00', past: '2027-11-05', next: '2027-11-08', days: '2 d', label: 'Faltan 2 días', date: '8 nov 2027' },
    { row: 'n', language: 'es', tz: 'UTC', now: '2026-12-31 12:00', past: '2026-12-30', next: '2027-01-01', days: '1 d', label: 'Faltan 1 días', date: '1 ene 2027' },
  ] as const)('fila $row: hoy $now, próxima $next', async ({ language, tz, now, past, next, days, label, date }) => {
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

  it.each(NEXT_CARD_BRANCHES)('ordena la card en icono, columna y días, con la fecha en la columna ($branch)', async ({ next, text }) => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 12 - 1, 31, 12, 0));
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: [makeVaccine({ nextDoseAt: next })] });
    await renderHealth();
    await waitFor(() => expect(screen.getByTestId('next-vaccine-days')).toHaveTextContent(text, { exact: true }));
    const card = screen.getByTestId('next-vaccine-card');

    expect(card.children).toHaveLength(3);
    expect(elementChild(card, 2).props.testID).toBe('next-vaccine-days');
    const column = elementChild(card, 1);
    expect(column.props.className).toBe('flex-1 gap-1');
    expect(column.children).toHaveLength(3);
    expect(elementChild(column, 0)).toHaveTextContent('Próxima dosis', { exact: true });
    expect(elementChild(column, 1)).toHaveTextContent('Rabies', { exact: true });
    expect(elementChild(column, 2).props.testID).toBe('next-vaccine-date');
    expect(within(elementChild(card, 0)).getByTestId('health-icon-syringe')).toBeVisible();
  });

  it.each(NEXT_CARD_BRANCHES)('pinta los días con la receta exacta ($branch)', async ({ next, text }) => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 12 - 1, 31, 12, 0));
    mockListVaccines.mockResolvedValue({ kind: 'ok', vaccines: [makeVaccine({ nextDoseAt: next })] });
    await renderHealth();
    await waitFor(() => expect(screen.getByTestId('next-vaccine-days')).toHaveTextContent(text, { exact: true }));
    const days = screen.getByTestId('next-vaccine-days');

    expect(days.props.className).toBe('text-lg font-black text-warning-strong');
    expect(days.props.style).toEqual({ fontVariant: ['tabular-nums'] });
    expect(screen.getByTestId('next-vaccine-date').props.className).toBe('font-normal text-muted');
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
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['Text', 'health-empty']);
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
