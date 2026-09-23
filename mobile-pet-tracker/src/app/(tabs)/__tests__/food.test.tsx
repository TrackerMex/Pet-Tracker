import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { Easing, ReduceMotion } from 'react-native-reanimated';

import {
  getNutritionPlan,
  serveMeal,
  type NutritionPlanState,
  unserveMeal,
} from '../../../api/nutrition';
import { listPets, type PetsState } from '../../../api/pets';
import { nutritionKeys, petKeys } from '../../../api/query-keys';
import type { NutritionPlan, PetProfile } from '../../../api/types';
import { en, es } from '../../../i18n/catalog';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import { LanguageProvider } from '../../../providers/language-provider';
import { SelectedPetProvider } from '../../../providers/selected-pet-provider';
import * as selectedPetHooks from '../../../providers/selected-pet-provider';
import FoodScreen from '../food';
import { renderWithProviders } from '../../../../test/render-with-providers';

const { existsSync, readFileSync } = jest.requireActual<typeof import('fs')>(
  'fs',
);

jest.mock('../../../api/pets', () => ({
  listPets: jest.fn(),
}));

jest.mock('../../../api/nutrition', () => ({
  getNutritionPlan: jest.fn(),
  serveMeal: jest.fn(),
  unserveMeal: jest.fn(),
}));

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(() => Promise.resolve()),
  NotificationFeedbackType: {
    Success: 'mock-success',
    Error: 'mock-error',
  },
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

const mockWithTiming = jest.fn((value: number, _config?: unknown) => value);

function expectKcalBarTiming(target: number): void {
  const config = mockWithTiming.mock.calls.find(([value]) => value === target)?.[1];
  expect(config).toEqual(
    expect.objectContaining({ duration: 250, reduceMotion: ReduceMotion.System }),
  );
  const actual = (config as { easing: ReturnType<typeof Easing.bezier> }).easing.factory();
  const expected = Easing.bezier(0.77, 0, 0.175, 1).factory();
  for (const point of [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) {
    expect(actual(point)).toBeCloseTo(expected(point), 6);
  }
}

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  withTiming: (value: number, config?: unknown) => mockWithTiming(value, config),
  withRepeat: jest.fn((animation: unknown) => animation),
  withSequence: jest.fn((...steps: unknown[]) => steps.at(-1)),
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
    useThemeColors: (tokens: string[]) => tokens,
  }),
  { virtual: true },
);

const apiUrl = 'http://example.test/v1';
const mockGetNutritionPlan = jest.mocked(getNutritionPlan);
const mockServeMeal = jest.mocked(serveMeal);
const mockUnserveMeal = jest.mocked(unserveMeal);
const mockListPets = jest.mocked(listPets);
const mockUseAuth = jest.mocked(useAuth);
const mockRouter = jest.mocked(router);
const mockNotificationAsync = jest.mocked(Haptics.notificationAsync);

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

function makePlan(overrides: Partial<NutritionPlan> = {}): NutritionPlan {
  return {
    id: 'plan-1',
    petId: 'pet-1',
    rerKcal: 410,
    merKcal: 656,
    dailyGrams: 187,
    mealsPerDay: 2,
    mealTimes: ['07:30', '19:30'],
    objective: 'maintenance',
    warnings: [],
    aiExplanation: null,
    generatedAt: '2026-08-23T12:00:00.000Z',
    servedToday: [],
    kcalConsumedToday: 0,
    ...overrides,
  };
}

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

function opacityOf(style: unknown): unknown {
  const entries = (Array.isArray(style) ? style.flat(Infinity) : [style]).filter(
    (entry): entry is Record<string, unknown> =>
      typeof entry === 'object' && entry !== null,
  );

  return entries.find((entry) => 'opacity' in entry)?.opacity;
}

function FoodWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial="es">
        <SelectedPetProvider>{children}</SelectedPetProvider>
      </LanguageProvider>
    </HeroUINativeProvider>
  );
}

async function renderFood() {
  return renderWithProviders(<FoodScreen />, { wrapper: FoodWrapper });
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

describe('#106 R1: expo-haptics entra declarada y sin configuración de babel', () => {
  it('declara una versión compatible sin configuración manual y enmienda la carta', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
      dependencies: Record<string, string>;
    };
    const hapticsVersion = packageJson.dependencies['expo-haptics'];

    expect(hapticsVersion).toBeDefined();
    expect(hapticsVersion?.match(/\d+/)?.[0]).toBe(
      packageJson.dependencies.expo.match(/\d+/)?.[0],
    );
    for (const file of [
      'babel.config.js',
      'babel.config.cjs',
      'babel.config.ts',
      '.babelrc',
      '.babelrc.js',
    ]) {
      expect(existsSync(file)).toBe(false);
    }

    const guidelines = readFileSync('../docs/ui-guidelines.md', 'utf8');
    expect(guidelines).not.toContain('expo-haptics NO está instalado');
    expect(guidelines).toContain('expo-haptics está instalado desde #106');
  });
});

describe('R4: food resuelve la mascota seleccionada', () => {
  beforeEach(() => {
    mockGetNutritionPlan.mockReturnValue(pending<NutritionPlanState>());
  });

  it('shows the hub and a loading state while pets are pending', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderFood();

    expect(screen.getByTestId('screen-food')).toBeVisible();
    expect(screen.getByText('Nutrición')).toBeVisible();
    expect(screen.getByTestId('food-loading')).toBeVisible();
    expect(screen.getByTestId('food-plan-skeleton')).toHaveProp(
      'className',
      expect.stringContaining('h-40'),
    );
    expect(screen.getByTestId('food-meals-skeleton')).toHaveProp(
      'className',
      expect.stringContaining('h-56'),
    );
    expect(screen.getByTestId('food-schedule-skeleton')).toHaveProp(
      'className',
      expect.stringContaining('h-20'),
    );
    expect(screen.getByTestId('screen-food').props.contentContainerStyle).toEqual(
      expect.objectContaining({
        padding: 24,
        paddingTop: 52,
        paddingBottom: 120,
      }),
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
      expect(screen.getByTestId('food-empty')).toHaveTextContent(
        'Aún no tienes mascotas',
      ),
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

describe('R5: plan del día con horarios y warnings', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('shows a skeleton and schedule link while the plan is pending', async () => {
    mockGetNutritionPlan.mockReturnValue(pending<NutritionPlanState>());

    await renderFood();

    await waitFor(() => {
      expect(screen.getByTestId('food-plan-skeleton')).toBeVisible();
      expect(screen.getByTestId('food-meals-skeleton')).toHaveProp(
        'className',
        expect.stringContaining('h-56'),
      );
      expect(screen.queryByTestId('food-schedule-skeleton')).toBeNull();
      expect(screen.getByTestId('meal-schedule-link')).toBeVisible();
    });
  });

  it('renders kcal, grams, ordered meals, portions, and local-time badges', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ servedToday: ['07:30'] }),
    });

    await renderFood();

    await waitFor(() => expect(screen.getByTestId('food-plan-card')).toBeVisible());
    expect(screen.getByTestId('food-plan-kcal')).toHaveTextContent(
      '656 kcal / día',
    );
    expect(screen.getByTestId('food-plan-grams')).toHaveTextContent(
      '187 g / día',
    );
    expect(screen.getByTestId('food-meals-section')).toBeVisible();
    expect(screen.getByTestId('food-meals-progress')).toHaveTextContent('1/2');
    expect(screen.getAllByTestId(/^meal-row-/).map(({ props }) => props.testID)).toEqual([
      'meal-row-0',
      'meal-row-1',
    ]);

    const breakfast = within(screen.getByTestId('meal-row-0'));
    expect(breakfast.getByText('07:30')).toBeVisible();
    expect(breakfast.getByText('94 g')).toBeVisible();
    expect(screen.getByTestId('meal-served-0')).toHaveTextContent('Servido');

    const dinner = within(screen.getByTestId('meal-row-1'));
    expect(dinner.getByText('19:30')).toBeVisible();
    expect(dinner.getByText('94 g')).toBeVisible();
    expect(screen.getByTestId('meal-pending-1')).toHaveTextContent('Pendiente');

    await fireEvent.press(screen.getByTestId('meal-schedule-link'));
    expect(mockRouter.push).toHaveBeenCalledWith('/meal-schedule');
  });

  it('derives progress for three meals and omits an empty warnings section', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({
        dailyGrams: 300,
        mealsPerDay: 3,
        mealTimes: ['06:00', '12:00', '18:00'],
        servedToday: ['06:00', '12:00'],
      }),
    });

    await renderFood();

    await waitFor(() =>
      expect(screen.getByTestId('food-meals-progress')).toHaveTextContent('2/3'),
    );
    expect(screen.getAllByTestId(/^meal-row-/)).toHaveLength(3);
    expect(screen.queryAllByTestId(/^plan-warning-/)).toHaveLength(0);
  });

  it('lists every backend warning verbatim', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({
        warnings: [
          {
            code: 'chronic_disease_vet',
            message: 'Consulta al veterinario por enfermedad crónica.',
          },
          {
            code: 'check_food_allergens',
            message: 'Verifica los alérgenos del alimento.',
          },
        ],
      }),
    });

    await renderFood();

    await waitFor(() =>
      expect(screen.getByTestId('plan-warning-chronic_disease_vet')).toHaveTextContent(
        'Consulta al veterinario por enfermedad crónica.',
      ),
    );
    expect(
      screen.getByTestId('plan-warning-check_food_allergens'),
    ).toHaveTextContent('Verifica los alérgenos del alimento.');
  });

  it('shows a graceful empty plan and keeps the schedule link', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' });

    await renderFood();

    await waitFor(() =>
      expect(screen.getByTestId('food-plan-empty')).toHaveTextContent(
        'Aún no hay plan de alimentación',
      ),
    );
    expect(screen.getByTestId('meal-schedule-link')).toBeVisible();
  });

  it.each([
    { kind: 'error' } as const,
    { kind: 'unreachable', message: 'network down' } as const,
  ])('shows and retries a $kind plan error', async (state) => {
    mockGetNutritionPlan
      .mockResolvedValueOnce(state)
      .mockResolvedValueOnce({ kind: 'ok', plan: makePlan() });

    await renderFood();
    await waitFor(() =>
      expect(screen.getByTestId('food-plan-error')).toHaveTextContent(
        'No se pudo cargar el plan de alimentación',
      ),
    );
    await fireEvent.press(screen.getByTestId('food-plan-retry'));

    await waitFor(() => expect(screen.getByTestId('food-plan-card')).toBeVisible());
    expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2);
  });
});

describe('#98 R4: el estado servido sale de servedToday, no del reloj', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('pinta badges y contador desde servedToday con el reloj del dispositivo en cualquier hora', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ servedToday: [] }),
    });

    const pendingView = await renderFood();
    await waitFor(() =>
      expect(screen.getByTestId('food-meals-progress')).toHaveTextContent('0/2'),
    );
    expect(screen.getAllByTestId(/^meal-pending-/)).toHaveLength(2);
    expect(screen.queryAllByTestId(/^meal-served-/)).toHaveLength(0);
    for (const row of screen.getAllByTestId(/^meal-row-/)) {
      expect(row.props.className).toContain('bg-default');
      expect(within(row).getByTestId('food-icon-clock').props.style).toEqual({
        color: 'muted',
      });
    }
    await pendingView.unmount();

    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ servedToday: ['07:30', '19:30'] }),
    });

    await renderFood();
    await waitFor(() =>
      expect(screen.getByTestId('food-meals-progress')).toHaveTextContent('2/2'),
    );
    expect(screen.getAllByTestId(/^meal-served-/)).toHaveLength(2);
    expect(screen.queryAllByTestId(/^meal-pending-/)).toHaveLength(0);
    for (const row of screen.getAllByTestId(/^meal-row-/)) {
      expect(row.props.className).toContain('bg-surface-secondary');
      expect(within(row).getByTestId('food-icon-clock').props.style).toEqual({
        color: 'accent-strong',
      });
    }
  });

  it('no deja rastro del reloj en el fuente de Food', () => {
    const source = readFileSync('src/app/(tabs)/food.tsx', 'utf8');

    expect(source).not.toContain('localTimeHhmm');
    expect(source).not.toContain('new Date(');
    expect(source).not.toMatch(/mealTime\s*<=\s*hhmm/);
  });
});

describe('#98 R5: cada franja sirve, deshace y refresca', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('sirve una franja pendiente y refresca el plan y el perfil', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ servedToday: [] }),
    });
    mockServeMeal.mockResolvedValue({ kind: 'ok' });
    const view = await renderFood();
    const toggle = await screen.findByTestId('meal-toggle-0');
    const refetchQueries = jest.spyOn(view.queryClient, 'refetchQueries');

    expect(toggle.props.accessibilityRole).toBe('button');
    expect(toggle.props.accessibilityLabel).toBe(
      'Marcar 07:30 como servida',
    );
    expect(toggle.props.className).toBe('min-h-11 justify-center');
    await fireEvent.press(toggle);

    await waitFor(() => expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2));
    expect(mockServeMeal).toHaveBeenCalledWith(
      apiUrl,
      'jwt-token',
      'pet-1',
      '07:30',
    );
    expect(refetchQueries).toHaveBeenCalledWith({
      queryKey: petKeys.detail('pet-1'),
    });
    expect(mockGetNutritionPlan.mock.invocationCallOrder[1]).toBeLessThan(
      refetchQueries.mock.invocationCallOrder[0],
    );
  });

  it('deshace una franja servida y refresca el plan y el perfil', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ servedToday: ['07:30'] }),
    });
    mockUnserveMeal.mockResolvedValue({ kind: 'ok' });
    const view = await renderFood();
    const toggle = await screen.findByTestId('meal-toggle-0');
    const refetchQueries = jest.spyOn(view.queryClient, 'refetchQueries');

    expect(toggle.props.accessibilityLabel).toBe('Deshacer 07:30');
    await fireEvent.press(toggle);

    await waitFor(() => expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2));
    expect(mockUnserveMeal).toHaveBeenCalledWith(
      apiUrl,
      'jwt-token',
      'pet-1',
      '07:30',
    );
    expect(refetchQueries).toHaveBeenCalledWith({
      queryKey: petKeys.detail('pet-1'),
    });
    expect(mockGetNutritionPlan.mock.invocationCallOrder[1]).toBeLessThan(
      refetchQueries.mock.invocationCallOrder[0],
    );
  });

  it('ignora la segunda pulsación mientras la primera está en vuelo', async () => {
    let resolveServe!: (state: { kind: 'ok' }) => void;
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ servedToday: [] }),
    });
    mockServeMeal.mockReturnValue(
      new Promise((resolve) => {
        resolveServe = resolve;
      }),
    );
    await renderFood();
    const toggle = await screen.findByTestId('meal-toggle-0');

    await fireEvent.press(toggle);
    await fireEvent.press(toggle);

    expect(mockServeMeal).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('meal-pending-0')).toBeVisible();
    await waitFor(() =>
      expect(screen.getByTestId('meal-toggle-0')).toBeDisabled(),
    );

    await act(async () => resolveServe({ kind: 'ok' }));
  });
});

describe('#98 R6: el conflicto se resuelve refrescando y el fallo avisa', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('no muestra error cuando el servidor ya estaba en el estado pedido', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ servedToday: [] }),
    });
    mockServeMeal.mockResolvedValue({ kind: 'already-served' });
    const servedView = await renderFood();

    expect(screen.queryByTestId('food-meal-error')).toBeNull();
    await fireEvent.press(await screen.findByTestId('meal-toggle-0'));
    await waitFor(() => expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2));
    expect(screen.queryByTestId('food-meal-error')).toBeNull();
    await servedView.unmount();

    mockGetNutritionPlan.mockClear();
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ servedToday: ['07:30'] }),
    });
    mockUnserveMeal.mockResolvedValue({ kind: 'not-served' });
    await renderFood();

    await fireEvent.press(await screen.findByTestId('meal-toggle-0'));
    await waitFor(() => expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2));
    expect(screen.queryByTestId('food-meal-error')).toBeNull();
  });

  it('muestra el aviso ante un fallo y lo borra en el reintento con éxito', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ servedToday: [] }),
    });
    mockServeMeal
      .mockResolvedValueOnce({ kind: 'error' })
      .mockResolvedValueOnce({ kind: 'ok' });
    await renderFood();

    expect(screen.queryByTestId('food-meal-error')).toBeNull();
    await fireEvent.press(await screen.findByTestId('meal-toggle-0'));

    const error = await screen.findByTestId('food-meal-error');
    expect(error).toHaveTextContent('No se pudo actualizar la comida');
    expect(error.props.selectable).toBe(true);
    expect(screen.getAllByTestId(/^meal-row-/)).toHaveLength(2);
    const mealsSection = screen.getByTestId('food-meals-section');
    expect(mealsSection.children[mealsSection.children.length - 1]).toBe(error);
    await waitFor(() => expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2));

    await fireEvent.press(screen.getByTestId('meal-toggle-0'));
    await waitFor(() =>
      expect(screen.queryByTestId('food-meal-error')).toBeNull(),
    );
    await waitFor(() => expect(mockGetNutritionPlan).toHaveBeenCalledTimes(3));
  });
});

describe('#106 R4: servir y deshacer vibran una vez y distinguen éxito de fallo', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('no vibra al montar o refrescar sin una pulsación', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan(),
    });

    const view = await renderFood();
    await screen.findByTestId('meal-toggle-0');
    await act(async () => view.queryClient.refetchQueries());

    expect(mockNotificationAsync).not.toHaveBeenCalled();
  });

  it('vibra una vez con éxito después de servir', async () => {
    mockGetNutritionPlan
      .mockResolvedValueOnce({
        kind: 'ok',
        plan: makePlan({ servedToday: [] }),
      })
      .mockResolvedValue({
        kind: 'ok',
        plan: makePlan({ servedToday: ['07:30'] }),
      });
    mockServeMeal.mockResolvedValue({ kind: 'ok' });
    await renderFood();

    expect(mockNotificationAsync).not.toHaveBeenCalled();
    await fireEvent.press(await screen.findByTestId('meal-toggle-0'));
    await screen.findByTestId('meal-served-0');

    await waitFor(() => expect(mockNotificationAsync).toHaveBeenCalledTimes(1));
    expect(mockNotificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success,
    );
  });

  it('vibra una vez con éxito después de deshacer', async () => {
    mockGetNutritionPlan
      .mockResolvedValueOnce({
        kind: 'ok',
        plan: makePlan({ servedToday: ['07:30'] }),
      })
      .mockResolvedValue({
        kind: 'ok',
        plan: makePlan({ servedToday: [] }),
      });
    mockUnserveMeal.mockResolvedValue({ kind: 'ok' });
    await renderFood();

    await fireEvent.press(await screen.findByTestId('meal-toggle-0'));
    await screen.findByTestId('meal-pending-0');

    await waitFor(() => expect(mockNotificationAsync).toHaveBeenCalledTimes(1));
    expect(mockNotificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success,
    );
  });

  it('vibra una vez con error sin sustituir el aviso visual', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ servedToday: [] }),
    });
    mockServeMeal.mockResolvedValue({ kind: 'error' });
    await renderFood();

    await fireEvent.press(await screen.findByTestId('meal-toggle-0'));
    expect(await screen.findByTestId('food-meal-error')).toBeVisible();

    await waitFor(() => expect(mockNotificationAsync).toHaveBeenCalledTimes(1));
    expect(mockNotificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Error,
    );
  });

  it('trata already-served como éxito', async () => {
    mockGetNutritionPlan
      .mockResolvedValueOnce({
        kind: 'ok',
        plan: makePlan({ servedToday: [] }),
      })
      .mockResolvedValue({
        kind: 'ok',
        plan: makePlan({ servedToday: ['07:30'] }),
      });
    mockServeMeal.mockResolvedValue({ kind: 'already-served' });
    await renderFood();

    await fireEvent.press(await screen.findByTestId('meal-toggle-0'));
    await screen.findByTestId('meal-served-0');

    await waitFor(() => expect(mockNotificationAsync).toHaveBeenCalledTimes(1));
    expect(mockNotificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success,
    );
  });
});

describe('#107 R5: el botón por franja conserva su feedback de pulsado', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() });
  });

  it('expone opacidad 1 en reposo en el árbol renderizado', async () => {
    await renderFood();

    const toggle = await screen.findByTestId('meal-toggle-0');
    expect(opacityOf(toggle.props.style)).toBe(1);
  });

  it('#109 R1: acota el bloque de fuente al tag de apertura propio del meal-toggle', () => {
    const source = readFileSync('src/app/(tabs)/food.tsx', 'utf8');
    const anchor = source.indexOf('testID={`meal-toggle-${index}`}');
    // This is the meal-toggle's own opening tag, from `<` to `<`: ending at
    // `</Pressable>` let a nested Pressable lend it a foreign style (B2, #106/#107).
    // A `<` inside the tag (for example, `disabled={a < b}`) shrinks the slice
    // and makes the lock fail red, never green.
    const block = source.slice(
      source.lastIndexOf('<', anchor),
      source.indexOf('<', anchor),
    );

    expect(block).toMatch(
      /style=\{\(\{ pressed \}\) => \(\{\s*opacity: pressed \? 0\.8 : 1,?\s*\}\)\}/,
    );
  });
});

describe('R6: aiExplanation nullable con gracia', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('omits the AI card without leaving a gap when the explanation is null', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() });

    await renderFood();

    await waitFor(() => expect(screen.getByTestId('food-plan-card')).toBeVisible());
    expect(screen.queryByTestId('food-ai-card')).toBeNull();
    expect(screen.getByTestId('food-meals-section')).toBeVisible();
    expect(screen.getByTestId('meal-schedule-link')).toBeVisible();
  });

  it('shows the AI recommendation only when the explanation is present', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({
        aiExplanation: 'Split the daily amount into two balanced meals.',
      }),
    });

    await renderFood();

    await waitFor(() => expect(screen.getByTestId('food-ai-card')).toBeVisible());
    const aiCard = within(screen.getByTestId('food-ai-card'));
    expect(aiCard.getByText('Recomendación IA')).toBeVisible();
    expect(
      aiCard.getByText('Split the daily amount into two balanced meals.'),
    ).toBeVisible();
  });
});

describe('R10: preserva la mascota durante el refetch', () => {
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
    mockGetNutritionPlan.mockReturnValue(pending<NutritionPlanState>());

    const { queryClient, unmount } = await renderFood();
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

describe('#62 R3: los avisos de plan usan el Card compartido', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({
        warnings: [
          {
            code: 'chronic_disease_vet',
            message: 'Consulta al veterinario por enfermedad crónica.',
          },
        ],
      }),
    });
  });

  it('hereda radio, borde y sombra sin capturar el testID del texto', async () => {
    await renderFood();

    const card = await screen.findByTestId(
      'warning-card-chronic_disease_vet',
    );

    expect(card.props.className).toContain('rounded-card');
    expect(card.props.className).toContain('border');
    expect(card.props.className).toContain('shadow-sm');
    expect(card.props.className).toContain('bg-default');
    expect(screen.queryAllByTestId(/^plan-warning-/)).toHaveLength(1);
  });
});

describe('#87 R12: FoodScreen lee por TanStack Query', () => {
  it('deja mascotas y plan en sus claves canónicas', async () => {
    const petsState: PetsState = { kind: 'ok', pets: [makePet()] };
    const planState: NutritionPlanState = { kind: 'ok', plan: makePlan() };
    mockListPets.mockResolvedValue(petsState);
    mockGetNutritionPlan.mockResolvedValue(planState);

    const { queryClient } = await renderWithProviders(<FoodScreen />, {
      wrapper: FoodWrapper,
    });
    await screen.findByTestId('food-plan-card');

    expect(queryClient.getQueryData(petKeys.list())).toEqual(petsState);
    expect(queryClient.getQueryData(nutritionKeys.plan('pet-1'))).toEqual(
      planState,
    );
  });
});

describe('#62 R5: el título de card usa un único tratamiento', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({
        aiExplanation: 'Split the daily amount into two balanced meals.',
      }),
    });
  });

  it.each([
    'food-meals-title',
    'food-ai-title',
    'meal-schedule-link-title',
  ])(
    'aplica la receta canónica al título %s',
    async (testID) => {
      await renderFood();

      expect((await screen.findByTestId(testID)).props.className).toBe(
        'text-base font-bold text-foreground',
      );
    },
  );
});

describe('#113 R1: NutritionPlan declara kcalConsumedToday como número y último campo (mobile-kcal-consumed-bar #113)', () => {
  it('añade kcalConsumedToday: number justo después de servedToday', () => {
    const source = readFileSync('src/api/types.ts', 'utf8');
    const block = source.match(/export interface NutritionPlan \{[\s\S]*?\n\}/)?.[0] ?? '';
    const fields = [...block.matchAll(/^\s+(\w+):/gm)].map(([, field]) => field);
    expect(fields.slice(-2)).toEqual(['servedToday', 'kcalConsumedToday']);
    expect(block).toContain('\n  kcalConsumedToday: number;\n');
  });
});

describe('#113 R2: la tarjeta Objetivo diario pinta las kcal servidas contra merKcal (mobile-kcal-consumed-bar #113)', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('compone la tarjeta: fila intacta y bloque de progreso debajo', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ merKcal: 1420, kcalConsumedToday: 890, servedToday: ['07:30'] }),
    });
    await renderFood();

    const card = await screen.findByTestId('food-plan-card');
    expect(card.children).toHaveLength(2);
    const row = card.children[0];
    const progress = card.children[1];
    if (typeof row === 'string' || typeof progress === 'string') {
      throw new Error('Expected element children');
    }
    expect(row.props.className).toBe('flex-row items-center justify-between gap-4');
    expect(row.children).toHaveLength(2);
    const column = row.children[0];
    const tile = row.children[1];
    if (typeof column === 'string' || typeof tile === 'string') {
      throw new Error('Expected element children');
    }
    expect(within(column).getByTestId('food-plan-kcal')).toBeVisible();
    expect(within(tile).getByTestId('food-icon-fork-knife')).toBeVisible();
    expect(progress.props.testID).toBe('food-plan-progress');
    expect(progress.props.className).toBe('gap-1.5');
    expect(progress.props.onPress).toBeUndefined();
    expect(progress.children).toHaveLength(2);
    const header = progress.children[0];
    const track = progress.children[1];
    if (typeof header === 'string' || typeof track === 'string') {
      throw new Error('Expected element children');
    }
    expect(header.props.className).toBe('flex-row items-center justify-between');
    expect(header.children).toHaveLength(2);
    expect(header.children[0]).toHaveProperty('props.testID', 'food-plan-consumed');
    expect(header.children[1]).toHaveProperty('props.testID', 'food-plan-percent');
    for (const testID of ['food-plan-consumed', 'food-plan-percent']) {
      const text = screen.getByTestId(testID);
      expect(text.props.className).toBe('text-xs font-normal text-accent-foreground');
      expect(text.props.style).toEqual({ fontVariant: ['tabular-nums'] });
    }
    expect(track.props.testID).toBe('food-plan-track');
    expect(track.props.className).toBe('h-2 overflow-hidden rounded-full bg-accent-foreground/20');
    expect(track.children).toHaveLength(1);
    const fill = track.children[0];
    if (typeof fill === 'string') {
      throw new Error('Expected element child');
    }
    expect(fill.props.testID).toBe('food-plan-fill');
    expect(fill.props.className).toBe('h-full rounded-full bg-accent-foreground');
    expect(screen.getAllByTestId('food-plan-progress')).toHaveLength(1);
  });

  it.each([
    { merKcal: 656, mealsPerDay: 2, mealTimes: ['07:30', '19:30'], servedToday: [], kcal: 0, consumed: '0 kcal', percent: '0%' },
    { merKcal: 656, mealsPerDay: 2, mealTimes: ['07:30', '19:30'], servedToday: ['07:30'], kcal: 328, consumed: '328 kcal', percent: '50%' },
    { merKcal: 656, mealsPerDay: 2, mealTimes: ['07:30', '19:30'], servedToday: ['07:30', '19:30'], kcal: 656, consumed: '656 kcal', percent: '100%' },
    { merKcal: 1420, mealsPerDay: 2, mealTimes: ['07:30', '19:30'], servedToday: ['07:30'], kcal: 890, consumed: '890 kcal', percent: '63%' },
    { merKcal: 1000, mealsPerDay: 3, mealTimes: ['08:00', '13:00', '20:00'], servedToday: ['08:00'], kcal: 333, consumed: '333 kcal', percent: '33%' },
    { merKcal: 200, mealsPerDay: 6, mealTimes: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'], servedToday: ['06:00'], kcal: 33, consumed: '33 kcal', percent: '17%' },
    { merKcal: 0, mealsPerDay: 2, mealTimes: ['07:30', '19:30'], servedToday: [], kcal: 0, consumed: '0 kcal', percent: '0%' },
  ])('con merKcal $merKcal y kcalConsumedToday $kcal pinta $consumed y $percent', async ({ merKcal, mealsPerDay, mealTimes, servedToday, kcal, consumed, percent }) => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ merKcal, mealsPerDay, mealTimes, servedToday, kcalConsumedToday: kcal }),
    });
    await renderFood();
    expect(await screen.findByTestId('food-plan-consumed')).toHaveTextContent(consumed);
    expect(screen.getByTestId('food-plan-percent')).toHaveTextContent(percent);
    expect(screen.getByTestId('food-plan-fill')).toHaveAnimatedStyle({ width: percent });
  });

  it('no pinta el bloque sin plan', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' });
    await renderFood();
    await screen.findByTestId('food-plan-empty');
    expect(screen.queryByTestId('food-plan-progress')).toBeNull();
  });
});

describe('#113 R3: el progreso es un único elemento accesible con su clave de catálogo (mobile-kcal-consumed-bar #113)', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it.each([
    { merKcal: 1420, kcal: 890, servedToday: ['07:30'], label: '890 de 1420 kcal servidas hoy', now: 63 },
    { merKcal: 656, kcal: 0, servedToday: [], label: '0 de 656 kcal servidas hoy', now: 0 },
  ])('anuncia $label como un solo progressbar', async ({ merKcal, kcal, servedToday, label, now }) => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ merKcal, kcalConsumedToday: kcal, servedToday }),
    });
    await renderFood();
    const progress = await screen.findByTestId('food-plan-progress');
    expect(progress.props.accessible).toBe(true);
    expect(progress.props.accessibilityRole).toBe('progressbar');
    expect(progress.props.accessibilityLabel).toBe(label);
    expect(progress.props.accessibilityValue).toEqual({ min: 0, max: 100, now });
  });

  it('registra food.kcalConsumedOfTarget en los dos idiomas y en la tabla de idioma', () => {
    const english = en as Record<string, string>;
    const spanish = es as Record<string, string>;
    expect(english['food.kcalConsumedOfTarget']).toBe('{{consumed}} of {{target}} kcal served today');
    expect(spanish['food.kcalConsumedOfTarget']).toBe('{{consumed}} de {{target}} kcal servidas hoy');
    expect(readFileSync('../specs/mobile-ui-language/design.md', 'utf8')).toMatch(
      /\| — \| `food\.kcalConsumedOfTarget`[^\n]*← añadida por #113 \(R3\)/,
    );
  });
});

describe('#113 R4: el relleno transiciona su ancho al servir y al deshacer (mobile-kcal-consumed-bar #113)', () => {
  afterEach(() => mockGetNutritionPlan.mockReset());

  it('anima a 50, sube a 100 al servir y baja a 50 al deshacer con 250 ms y ease-in-out', async () => {
    const half = makePlan({ merKcal: 1420, servedToday: ['07:30'], kcalConsumedToday: 710 });
    const full = makePlan({ merKcal: 1420, servedToday: ['07:30', '19:30'], kcalConsumedToday: 1420 });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetNutritionPlan
      .mockResolvedValueOnce({ kind: 'ok', plan: half })
      .mockResolvedValueOnce({ kind: 'ok', plan: full })
      .mockResolvedValue({ kind: 'ok', plan: half });
    mockServeMeal.mockResolvedValue({ kind: 'ok' });
    mockUnserveMeal.mockResolvedValue({ kind: 'ok' });

    await renderFood();
    expect(await screen.findByTestId('food-plan-consumed')).toHaveTextContent('710 kcal');
    expect(screen.getByTestId('food-plan-percent')).toHaveTextContent('50%');
    expect(screen.getByTestId('food-plan-fill')).toHaveAnimatedStyle({ width: '50%' });
    expectKcalBarTiming(50);

    mockWithTiming.mockClear();
    await fireEvent.press(screen.getByTestId('meal-toggle-1'));
    await screen.findByTestId('meal-served-1');
    expect(screen.getByTestId('food-plan-consumed')).toHaveTextContent('1420 kcal');
    expect(screen.getByTestId('food-plan-percent')).toHaveTextContent('100%');
    expect(screen.getByTestId('food-plan-fill')).toHaveAnimatedStyle({ width: '100%' });
    expectKcalBarTiming(100);

    await waitFor(() => expect(screen.getByTestId('meal-toggle-1')).toBeEnabled());
    mockWithTiming.mockClear();
    await fireEvent.press(screen.getByTestId('meal-toggle-1'));
    await screen.findByTestId('meal-pending-1');
    expect(screen.getByTestId('food-plan-consumed')).toHaveTextContent('710 kcal');
    expect(screen.getByTestId('food-plan-percent')).toHaveTextContent('50%');
    expect(screen.getByTestId('food-plan-fill')).toHaveAnimatedStyle({ width: '50%' });
    expectKcalBarTiming(50);
  });
});

describe('#65 R17: los títulos de card se localizan por testID y su copy sigue asertada', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({
        aiExplanation: 'Split the daily amount into two balanced meals.',
      }),
    });
  });

  it('expone los tres títulos de Food sin perder sus dos aserciones de copy', async () => {
    await renderFood();

    await waitFor(() => {
      expect(screen.getByText('Comidas hoy')).toBeVisible();
      expect(screen.getByText('Horario de comidas')).toBeVisible();
      expect(screen.getByTestId('food-meals-title')).toBeVisible();
      expect(screen.getByTestId('food-ai-title')).toBeVisible();
      expect(screen.getByTestId('meal-schedule-link-title')).toBeVisible();
    });
  });
});

describe('#113 R5: el esqueleto del plan reserva el alto de la tarjeta con progreso (mobile-kcal-consumed-bar #113)', () => {
  it('usa h-40 con el radio de card', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());
    await renderFood();
    expect(screen.getByTestId('food-plan-skeleton').props.className).toBe('skeleton__root h-40 w-full rounded-card');
  });
});
