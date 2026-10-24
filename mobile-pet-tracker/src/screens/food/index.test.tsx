import {
  act,
  fireEvent,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect, type ReactNode } from 'react';
import { Text } from 'react-native';
import type { TestInstance } from 'test-renderer';
import type { CircleProps, SvgProps } from 'react-native-svg';
import { Easing, ReduceMotion } from 'react-native-reanimated';

import {
  getNutritionPlan,
  serveMeal,
  type NutritionPlanState,
  unserveMeal,
} from '../../api/nutrition';
import { listPets, type PetsState } from '../../api/pets';
import { nutritionKeys, petKeys } from '../../api/query-keys';
import type { NutritionPlan, PetProfile } from '../../api/types';
import { en, es } from '../../i18n/catalog';
import { useChunkyLip } from '../../theme/chunky-lip';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { MOTION_RING_TIMING } from '../../theme/motion';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { SelectedPetProvider } from '../../providers/selected-pet-provider';
import * as selectedPetHooks from '../../providers/selected-pet-provider';
import { FoodScreen } from '.';
import { renderWithProviders } from '../../../test/render-with-providers';

const { existsSync, readFileSync } = jest.requireActual<typeof import('fs')>(
  'fs',
);

jest.mock('../../api/pets', () => ({
  listPets: jest.fn(),
}));

jest.mock('../../api/nutrition', () => ({
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

const mockWithDelay = jest.fn((delay: number, animation: unknown) => animation);
const mockWithTiming = jest.fn((value: number, _config?: unknown) => value);

function expectKcalBarTiming(target: number): void {
  const config = mockWithTiming.mock.calls.find(([value]) => value === target)?.[1];
  expect(config).toEqual(
    expect.objectContaining({ duration: 1100, reduceMotion: ReduceMotion.System }),
  );
  expect(config).toEqual(MOTION_RING_TIMING);
  expect(mockWithDelay).toHaveBeenCalledWith(200, target);
  const actual = (config as { easing: ReturnType<typeof Easing.bezier> }).easing.factory();
  const expected = Easing.bezier(0, 0, 0.58, 1).factory();
  for (const point of [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) {
    expect(actual(point)).toBeCloseTo(expected(point), 6);
  }
}

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  withDelay: (delay: number, animation: unknown) => mockWithDelay(delay, animation),
  withTiming: (value: number, config?: unknown) => mockWithTiming(value, config),
  withRepeat: jest.fn((animation: unknown) => animation),
  withSequence: jest.fn((...steps: unknown[]) => steps.at(-1)),
}));

jest.mock('react-native-svg', () => {
  const actual = jest.requireActual<typeof import('react-native-svg')>('react-native-svg');
  const { View } = jest.requireActual('react-native');
  return {
    ...actual,
    __esModule: true,
    default: (props: SvgProps) => <View {...props} />,
    Circle: (props: CircleProps) => <View {...props} />,
  };
});

jest.mock('reicon-react-native', () => {
  const { View } = jest.requireActual('react-native');
  const icon = (testID: string) =>
    function MockIcon({ color, size, strokeWidth }: { color?: string; size?: number; strokeWidth?: number }) {
      return <View testID={testID} style={{ color }} {...{ color, size, strokeWidth }} />;
    };

  return {
    ChevronRight: icon('food-icon-chevron-right'),
    Check: icon('food-icon-check'),
    Clock: icon('food-icon-clock'),
    ForkKnife: icon('food-icon-fork-knife'),
    Sparkles: icon('food-icon-sparkles'),
  };
});

jest.mock(
  '../../theme/use-theme-colors',
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

  it('shows the hub and a loading state while pets are pending (enmendado por #200 R2)', async () => {
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
        paddingHorizontal: 20,
        paddingTop: 52,
        paddingBottom: 120,
        gap: 14,
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
      expect(screen.getByTestId('food-empty-title')).toHaveTextContent(
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
      // #77 R5: the plan is requested after the commit that selects the chip.
      expect(mockGetNutritionPlan).toHaveBeenCalledWith(
        apiUrl,
        'jwt-token',
        'pet-1',
      );
    });
    expect(mockListPets).toHaveBeenCalledWith(apiUrl, 'jwt-token');
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

  it('renders kcal, grams, ordered meals, portions, and local-time badges (enmendado por #200 R6)', async () => {
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
    expect(breakfast.getByText('07:30 · 94 g')).toBeVisible();
    expect(breakfast.getByText('· 94 g')).toBeVisible();
    expect(screen.getByTestId('meal-served-0')).toHaveTextContent('Servido');

    const dinner = within(screen.getByTestId('meal-row-1'));
    expect(dinner.getByText('19:30 · 94 g')).toBeVisible();
    expect(dinner.getByText('· 94 g')).toBeVisible();
    expect(screen.getByTestId('meal-pending-1')).toHaveTextContent('Marcar servido');

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
      expect(screen.getByTestId('food-plan-empty-title')).toHaveTextContent(
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

  it('pinta badges y contador desde servedToday con el reloj del dispositivo en cualquier hora (enmendado por #200 R6)', async () => {
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
    for (const [index, row] of screen.getAllByTestId(/^meal-row-/).entries()) {
      expect(row.props.className).toBe(index === 0 ? 'flex-row items-center gap-3 py-2' : 'flex-row items-center gap-3 border-t border-border py-2');
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
    for (const [index, row] of screen.getAllByTestId(/^meal-row-/).entries()) {
      expect(row.props.className).toBe(index === 0 ? 'flex-row items-center gap-3 py-2' : 'flex-row items-center gap-3 border-t border-border py-2');
      expect(within(row).getByTestId('food-icon-check').props.style).toEqual({
        color: 'category-green-strong',
      });
    }
  });

  it('no deja rastro del reloj en el fuente de Food (enmendado por #200 R1)', () => {
    const source = readFileSync('src/screens/food/index.tsx', 'utf8');

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

  it('#109 R1: acota el bloque de fuente al tag de apertura propio del meal-toggle, con ancla única (#122 R1) (enmendado por #200 R1)', () => {
    const source = readFileSync('src/screens/food/index.tsx', 'utf8');
    const anchor = source.indexOf('testID={`meal-toggle-${index}`}');
    // This is the meal-toggle's own opening tag, from `<` to `<`: ending at
    // `</Pressable>` let a nested Pressable lend it a foreign style (B2, #106/#107).
    // A `<` inside the tag (for example, `disabled={a < b}`) shrinks the slice
    // and makes the lock fail red, never green.
    const block = source.slice(
      source.lastIndexOf('<', anchor),
      source.indexOf('<', anchor),
    );

    // #122 R1: the slice assumes one anchor. A second copy (a decoy, the other
    // branch of a ternary, a comment) would be the one sliced.
    expect(source.lastIndexOf('testID={`meal-toggle-${index}`}')).toBe(anchor);
    expect(block).toMatch(
      /style=\{\(\{ pressed \}\) => \(\{\s*opacity: pressed \? 0\.8 : 1,?\s*\}\)\}/,
    );
  });

  it('#122 R2: el botón baja a opacidad 0.8 mientras se pulsa', async () => {
    await renderFood();
    const toggle = await screen.findByTestId('meal-toggle-0');

    // #122 R2: responderGrant is the first event of userEvent.press; stopping
    // there leaves the Pressable pressed, so this reads the opacity that runs.
    await fireEvent(toggle, 'responderGrant', {
      nativeEvent: {},
      persist: () => undefined,
    });

    expect(toggle).toHaveStyle({ opacity: 0.8 });
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

  it('hereda radio, borde y sombra sin capturar el testID del texto (enmendado por #200 R7)', async () => {
    await renderFood();

    const card = await screen.findByTestId(
      'warning-card-chronic_disease_vet',
    );

    expect(card.props.className).toBe('rounded-card bg-default p-3.5');
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
    ['food-meals-title', 'text-17 font-extrabold text-foreground'],
    ['food-ai-title', 'text-sm font-extrabold text-category-violet-strong'],
    ['meal-schedule-link-title', 'text-15 font-extrabold text-foreground'],
  ])(
    'aplica la receta canónica al título %s (enmendado por #200 R5 y #200 R8 y #200 R9)',
    async (testID, className) => {
      await renderFood();

      expect((await screen.findByTestId(testID)).props.className).toBe(
        className,
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

describe('#105 R14: Food opens served meals history', () => {
  beforeEach(() => {
    mockListPets.mockReset();
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetNutritionPlan.mockReset();
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() });
  });

  it('shows the history card immediately after the schedule and pushes its route (enmendado por #200 R9)', async () => {
    await renderFood();
    await waitFor(() => expect(screen.getByTestId('meals-history-link')).toBeVisible());
    const card = screen.getByTestId('meals-history-link');
    expect(screen.getByTestId('meals-history-link-title')).toHaveTextContent('Historial de comidas');
    expect(screen.getByTestId('meals-history-link-title')).toHaveProp('className', 'text-15 font-extrabold text-foreground');
    expect(within(card).getByText('Ver qué días se sirvieron comidas')).toBeVisible();
    expect(within(card).getByTestId('food-icon-chevron-right')).toHaveStyle({ color: 'foreground' });
    const siblings = card.parent?.children ?? [];
    const previous = siblings[siblings.indexOf(card) - 1];
    expect(typeof previous === 'string' ? previous : previous?.props.testID).toBe('meal-schedule-link');
    await fireEvent.press(card);
    expect(mockRouter.push).toHaveBeenCalledWith('/meals-history');
  });
});

describe('#155 R4: Comida sin mascotas presenta a Pingo', () => {
  beforeEach(() => { mockGetNutritionPlan.mockReturnValue(pending<NutritionPlanState>()); });

  it('pinta la pose, el título y la frase de Pingo', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderFood();
    const pose = await screen.findByTestId('food-empty-pose');
    expect(pose.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-talk\.webp$/) }),
    ]);
    expect(screen.getByTestId('food-empty-title')).toHaveTextContent('Aún no tienes mascotas');
    expect(screen.getByTestId('food-empty-body')).toHaveTextContent('Añade a tu mascota y te ayudo a saber dónde está y cómo está.');
    expect(within(screen.getByTestId('food-empty-action')).getByText('Añadir mascota')).toBeVisible();
  });

  it('queda en el sitio del vacío que sustituye (enmendado por #200 R2)', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderFood();
    await screen.findByTestId('food-empty-pose');
    const slot = screen.getByTestId('food-empty');
    expect(slot.parent?.parent?.props.testID).toBe('screen-food');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['food-title-row', 'food-empty']);
  });

  it('lleva a añadir mascota', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderFood();
    const action = await screen.findByTestId('food-empty-action');
    await fireEvent.press(action);
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/pets/add');
  });
});

describe('#155 R9: sin plan de comidas, Pingo enseña el cuenco', () => {
  beforeEach(() => { mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] }); });

  it('pinta la pose, el título y la frase de Pingo', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' });
    await renderFood();
    const pose = await screen.findByTestId('food-plan-empty-pose');
    expect(pose.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-food\.webp$/) }),
    ]);
    expect(screen.getByTestId('food-plan-empty-title')).toHaveTextContent('Aún no hay plan de alimentación');
    expect(screen.getByTestId('food-plan-empty-body')).toHaveTextContent('Cuando haya un plan, te ayudo a llevar la cuenta de cada comida.');
  });

  it('queda en el sitio del vacío que sustituye (enmendado por #200 R9)', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' });
    await renderFood();
    await screen.findByTestId('food-plan-empty-pose');
    const slot = screen.getByTestId('food-plan-empty');
    expect(slot.parent?.parent?.parent?.props.testID).toBe('screen-food');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['food-plan-empty', 'food-links']);
  });

  it('no ofrece acción', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' });
    await renderFood();
    await screen.findByTestId('food-plan-empty-title');
    expect(screen.queryByTestId('food-plan-empty-action')).toBeNull();
  });
});

function setupFood168() {
  mockListPets.mockReset();
  mockGetNutritionPlan.mockReset();
  mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() });
}

const FOOD_BRANCHES_168 = [
  { name: 'food-loading', pets: pending<PetsState>(), plan: pending<NutritionPlanState>(), branch: 'food-loading' },
  { name: 'food-error', pets: { kind: 'error' } as PetsState, plan: pending<NutritionPlanState>(), branch: 'food-error' },
  { name: 'food-empty', pets: { kind: 'ok', pets: [] } as PetsState, plan: pending<NutritionPlanState>(), branch: 'food-empty' },
  { name: 'con plan', pets: { kind: 'ok', pets: [makePet()] } as PetsState, plan: { kind: 'ok', plan: makePlan() } as NutritionPlanState, branch: 'food-plan-card' },
  { name: 'sin plan', pets: { kind: 'ok', pets: [makePet()] } as PetsState, plan: { kind: 'not-found' } as NutritionPlanState, branch: 'food-plan-empty' },
  { name: 'error de plan', pets: { kind: 'ok', pets: [makePet()] } as PetsState, plan: { kind: 'error' } as NutritionPlanState, branch: 'food-plan-error' },
];

describe('#168 R1: Nutrición pinta el título grande en todas sus ramas', () => {
  beforeEach(setupFood168);

  it.each(FOOD_BRANCHES_168)('pinta el título grande ($name) (enmendado por #197 R4)', async ({ pets, plan, branch }) => {
    mockListPets.mockImplementation(async () => pets);
    mockGetNutritionPlan.mockImplementation(async () => plan);
    await renderFood();
    await screen.findByTestId(branch);
    const title = screen.getByTestId('food-title');
    expect(title.props.className).toBe('text-3xl font-black tracking-title text-foreground');
    expect(title).toHaveTextContent('Nutrición');
    expect(title.parent!.children[0]).toBe(title);
  });
});

function foodChild(node: TestInstance, index: number): TestInstance {
  const child = node.children[index];
  if (typeof child === 'string') throw new Error('Expected an element child');
  return child;
}

describe('#168 R8: food-plan-card pinta el anillo', () => {
  beforeEach(setupFood168);

  it('agrupa progreso y columna como únicos hijos del resumen (enmendado por #200 R3)', async () => {
    await renderFood();
    const card = await screen.findByTestId('food-plan-card');
    expect(card.children).toHaveLength(1);
    const summary = within(card).getByTestId('food-plan-summary');
    expect(foodChild(card, 0)).toBe(summary);
    expect(summary.props.className).toBe('flex-row items-center gap-4');
    expect(summary.children).toHaveLength(2);
    expect(foodChild(summary, 0)).toBe(within(summary).getByTestId('food-plan-progress'));
    const column = foodChild(summary, 1);
    expect(column.props.className).toBe('flex-1 gap-1');
    expect(column.children).toHaveLength(3);
    expect(foodChild(column, 0).props.className).toBe('text-xs font-extrabold uppercase tracking-caps text-accent-foreground');
    expect(foodChild(column, 0)).toHaveTextContent('Objetivo diario');
    const kcal = within(column).getByTestId('food-plan-kcal');
    const grams = within(column).getByTestId('food-plan-grams');
    expect(foodChild(column, 1)).toBe(kcal);
    expect(foodChild(column, 2)).toBe(grams);
    expect(kcal.props.className).toBe('text-24 font-black text-accent-foreground');
    expect(grams.props.className).toBe('text-sm font-semibold text-accent-foreground');
    expect(kcal).toHaveTextContent('656 kcal / día');
    expect(grams).toHaveTextContent('187 g / día');
  });

  it('retira la pista, el relleno y el tile ForkKnife de la barra', async () => {
    await renderFood();
    await screen.findByTestId('food-plan-card');
    expect(screen.queryByTestId('food-plan-track')).toBeNull();
    expect(screen.queryByTestId('food-plan-fill')).toBeNull();
    expect(screen.queryByTestId('food-icon-fork-knife')).toBeNull();
  });

  it('ordena el progreso en anillo, porcentaje y kcal', async () => {
    await renderFood();
    const progress = await screen.findByTestId('food-plan-progress');
    expect(progress.props.className).toBe('size-26 items-center justify-center');
    expect(progress.children).toHaveLength(3);
    expect(progress.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['food-plan-ring', 'food-plan-percent', 'food-plan-consumed']);
  });

  it('la pista tiene exactamente su receta de Circle (enmendado por #200 R4)', async () => {
    await renderFood();
    await screen.findByTestId('food-plan-card');
    const track = screen.getByTestId('food-plan-ring-track');
    const props = { ...track.props };
    delete props.children;
    expect(props).toEqual({ testID: 'food-plan-ring-track', cx: 52, cy: 52, r: 44, fill: 'none', stroke: 'accent-foreground', strokeOpacity: 0.22, strokeWidth: 12 });
  });

  it('el relleno tiene exactamente su receta y solo anima strokeDashoffset', async () => {
    await renderFood();
    await screen.findByTestId('food-plan-card');
    const fill = screen.getByTestId('food-plan-ring-fill');
    expect(fill.props.strokeDasharray).toBeCloseTo(276.46, 2);
    expect(fill.props.strokeDashoffset).toBeCloseTo(276.46, 2);
    expect(fill.props.nativeID).toBeUndefined();
    expect(fill.props.collapsable).toBe(false);
    expect(fill.props.style).toBeUndefined();
    expect(fill.props.jestInlineStyle).toBeUndefined();
    expect(fill.props.jestAnimatedStyle.value).toEqual({});
    await waitFor(() => {
      expect(Object.keys(fill.props.jestAnimatedProps.value)).toEqual(['strokeDashoffset']);
      expect(fill.props.jestAnimatedProps.value.strokeDashoffset).toBeCloseTo(276.46, 2);
    });
    const props = { ...fill.props };
    for (const key of ['children', 'nativeID', 'collapsable', 'style', 'jestInlineStyle', 'jestAnimatedStyle', 'jestAnimatedProps', 'strokeDasharray', 'strokeDashoffset']) delete props[key];
    expect(props).toEqual({ testID: 'food-plan-ring-fill', cx: 52, cy: 52, r: 44, fill: 'none', stroke: 'accent-foreground', strokeWidth: 12, strokeLinecap: 'round', transform: 'rotate(-90 52 52)' });
  });

  it('el anillo contiene un SVG de 104 y dos círculos en orden, sin style', async () => {
    await renderFood();
    await screen.findByTestId('food-plan-card');
    const ring = screen.getByTestId('food-plan-ring');
    expect(ring.props.className).toBe('absolute inset-0');
    expect(ring.props.style).toBeUndefined();
    expect(ring.children).toHaveLength(1);
    const svg = foodChild(ring, 0);
    expect(svg.props.width).toBe(104);
    expect(svg.props.height).toBe(104);
    expect(svg.props.viewBox).toBe('0 0 104 104');
    expect(svg.children).toHaveLength(2);
    expect(foodChild(svg, 0)).toBe(within(svg).getByTestId('food-plan-ring-track'));
    expect(foodChild(svg, 1)).toBe(within(svg).getByTestId('food-plan-ring-fill'));
  });

  it('porcentaje y kcal llevan sus clases y cifras tabulares (enmendado por #200 R3)', async () => {
    await renderFood();
    const percent = await screen.findByTestId('food-plan-percent');
    const consumed = screen.getByTestId('food-plan-consumed');
    expect(percent.props.className).toBe('text-24 font-black text-accent-foreground');
    expect(consumed.props.className).toBe('text-11 font-bold text-accent-foreground');
    expect(percent.props.style).toEqual({ fontVariant: ['tabular-nums'] });
    expect(consumed.props.style).toEqual({ fontVariant: ['tabular-nums'] });
    expect(percent).toHaveTextContent('0%');
    expect(consumed).toHaveTextContent('0 kcal');
  });
});

describe('#168 R9: el anillo dice el porcentaje acotado', () => {
  beforeEach(setupFood168);

  it.each([
    { merKcal: 656, kcal: 0, percent: '0%', offset: 276.46 },
    { merKcal: 656, kcal: 328, percent: '50%', offset: 138.23 },
    { merKcal: 656, kcal: 656, percent: '100%', offset: 0 },
    { merKcal: 1420, kcal: 890, percent: '63%', offset: 102.29 },
    { merKcal: 1000, kcal: 333, percent: '33%', offset: 185.23 },
    { merKcal: 200, kcal: 33, percent: '17%', offset: 229.46 },
    { merKcal: 0, kcal: 0, percent: '0%', offset: 276.46 },
    { merKcal: 656, kcal: 984, percent: '150%', offset: 0 },
  ])('con $merKcal/$kcal pinta $percent y desfase $offset', async ({ merKcal, kcal, percent, offset }) => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ merKcal, kcalConsumedToday: kcal }),
    });
    await renderFood();
    await screen.findByTestId('food-plan-card');
    const fill = screen.getByTestId('food-plan-ring-fill');
    await waitFor(() => {
      expect(screen.getByTestId('food-plan-percent')).toHaveTextContent(percent);
      expect(Object.keys(fill.props.jestAnimatedProps.value)).toEqual(['strokeDashoffset']);
      expect(fill.props.jestAnimatedProps.value.strokeDashoffset).toBeCloseTo(offset, 2);
    });
  });

  it('anuncia el valor sin acotar cuando pasa de 100', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ merKcal: 656, kcalConsumedToday: 984 }),
    });
    await renderFood();
    const progress = await screen.findByTestId('food-plan-progress');
    await waitFor(() => expect(screen.getByTestId('food-plan-percent')).toHaveTextContent('150%'));
    expect(progress.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 150 });
  });
});


describe('#168 R10: el anillo transiciona con reduce motion', () => {
  beforeEach(setupFood168);

  it('transiciona de 50 a 100 al servir y vuelve a 50 al deshacer (enmendado por #200 R4)', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ merKcal: 1420, kcalConsumedToday: 710, servedToday: ['07:30'] }),
    });
    mockServeMeal.mockResolvedValue({ kind: 'ok' });
    mockUnserveMeal.mockResolvedValue({ kind: 'ok' });
    await renderFood();
    await screen.findByTestId('food-plan-card');
    await waitFor(() => {
      expect(screen.getByTestId('food-plan-consumed')).toHaveTextContent('710 kcal');
      expect(screen.getByTestId('food-plan-percent')).toHaveTextContent('50%');
      expect(screen.getByTestId('food-plan-ring-fill').props.jestAnimatedProps.value.strokeDashoffset).toBeCloseTo(138.23, 2);
    });
    expectKcalBarTiming(50);
    mockWithTiming.mockClear();

    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ merKcal: 1420, kcalConsumedToday: 1420, servedToday: ['07:30', '19:30'] }),
    });
    await fireEvent.press(screen.getByTestId('meal-toggle-1'));
    await waitFor(() => {
      expect(screen.getByTestId('meal-served-1')).toBeVisible();
      expect(screen.getByTestId('meal-toggle-1')).not.toBeDisabled();
      expect(screen.getByTestId('food-plan-consumed')).toHaveTextContent('1420 kcal');
      expect(screen.getByTestId('food-plan-percent')).toHaveTextContent('100%');
      expect(screen.getByTestId('food-plan-ring-fill').props.jestAnimatedProps.value.strokeDashoffset).toBeCloseTo(0, 2);
    });
    expectKcalBarTiming(100);
    mockWithTiming.mockClear();

    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ merKcal: 1420, kcalConsumedToday: 710, servedToday: ['07:30'] }),
    });
    await fireEvent.press(screen.getByTestId('meal-toggle-1'));
    await waitFor(() => {
      expect(screen.getByTestId('meal-pending-1')).toBeVisible();
      expect(screen.getByTestId('meal-toggle-1')).not.toBeDisabled();
      expect(screen.getByTestId('food-plan-consumed')).toHaveTextContent('710 kcal');
      expect(screen.getByTestId('food-plan-percent')).toHaveTextContent('50%');
      expect(screen.getByTestId('food-plan-ring-fill').props.jestAnimatedProps.value.strokeDashoffset).toBeCloseTo(138.23, 2);
    });
    expectKcalBarTiming(50);
  });

  it('la llamada de 50 respeta ReduceMotion.System', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ merKcal: 1420, kcalConsumedToday: 710 }),
    });
    await renderFood();
    await screen.findByTestId('food-plan-card');
    await waitFor(() => {
      expect(screen.getByTestId('food-plan-percent')).toHaveTextContent('50%');
      expect(screen.getByTestId('food-plan-ring-fill').props.jestAnimatedProps.value.strokeDashoffset).toBeCloseTo(138.23, 2);
    });
    const config = mockWithTiming.mock.calls.find(([value]) => value === 50)?.[1];
    expect(config).toEqual(expect.objectContaining({ reduceMotion: ReduceMotion.System }));
  });

  it('acota la llamada a 100 aunque el texto diga 150%', async () => {
    mockGetNutritionPlan.mockResolvedValue({
      kind: 'ok',
      plan: makePlan({ merKcal: 656, kcalConsumedToday: 984 }),
    });
    await renderFood();
    await screen.findByTestId('food-plan-card');
    await waitFor(() => {
      expect(screen.getByTestId('food-plan-percent')).toHaveTextContent('150%');
      expect(screen.getByTestId('food-plan-ring-fill').props.jestAnimatedProps.value.strokeDashoffset).toBeCloseTo(0, 2);
    });
    expect(mockWithTiming).toHaveBeenCalledWith(100, expect.any(Object));
    expect(mockWithTiming).not.toHaveBeenCalledWith(150, expect.anything());
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

describe('#181 R6: food hereda la limpieza de selección', () => {
  it('elimina la selección rancia y conserva el estado vacío', async () => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    mockGetNutritionPlan.mockResolvedValue({ kind: 'error' });
    const { queryClient } = await renderWithProviders(
      <><SelectionProbe181 /><FoodScreen /></>, { wrapper: FoodWrapper },
    );
    await screen.findByTestId('food-empty');
    await act(async () => { selectPet181?.('pet-stale'); });
    await waitFor(() => expect(screen.getByTestId('selected-pet-id')).toHaveTextContent('none'));
    await screen.findByTestId('food-empty');
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(screen.queryByTestId('food-plan-error')).toBeNull();
  });
});


describe('#200 R2: marco y fila del canvas', () => {
  beforeEach(setupFood168);

  it('#200 R2: el marco es el del canvas', async () => {
    await renderFood();
    expect(screen.getByTestId('screen-food').props.contentContainerStyle).toEqual({
      paddingHorizontal: 20, paddingTop: 52, paddingBottom: 120, gap: 14,
    });
  });

  it('#200 R2: los avatares comparten fila con el título', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet(), makePet({ id: 'pet-2', name: 'Max' })] });
    await renderFood();
    await screen.findByTestId('pet-chip-pet-2');
    const row = screen.getByTestId('food-title-row');
    expect(row.props.className).toBe('flex-row items-center justify-between');
    expect(foodChild(row, 0).props.testID).toBe('food-title');
    expect(within(row).getAllByTestId(/^pet-chip-/).map((node) => node.props.testID))
      .toEqual(['pet-chip-pet-1', 'pet-chip-pet-2']);
  });

  it('#200 R2: sin mascotas la fila solo lleva el título', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderFood();
    await screen.findByTestId('food-empty');
    const row = screen.getByTestId('food-title-row');
    expect(row.children).toHaveLength(1);
    expect(foodChild(row, 0).props.testID).toBe('food-title');
    expect(within(row).queryAllByTestId(/^pet-chip-/)).toEqual([]);
  });

  it('#200 R2: el contenido de la mascota se separa 14 como el canvas', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' });
    await renderFood();
    const empty = await screen.findByTestId('food-plan-empty');
    expect(empty.parent?.props.className).toBe('gap-3.5');
  });
});


describe('#200 R3: héroe del canvas', () => {
  beforeEach(setupFood168);

  it('#200 R3: el héroe es un View de acento con labio hero', async () => {
    await renderFood();
    const card = await screen.findByTestId('food-plan-card');
    expect(card.type).toBe('View');
    expect(card.props.className).toBe('rounded-hero bg-accent p-4.5');
    expect(card).toHaveStyle(CONTINUOUS_CORNER);
    const { result } = await renderHook(() => useChunkyLip());
    expect(card).toHaveStyle(result.current.hero);
  });

  it.each([
    ['Objetivo diario', 'text-xs font-extrabold uppercase tracking-caps text-accent-foreground'],
    ['food-plan-kcal', 'text-24 font-black text-accent-foreground'],
    ['food-plan-grams', 'text-sm font-semibold text-accent-foreground'],
    ['food-plan-percent', 'text-24 font-black text-accent-foreground'],
    ['food-plan-consumed', 'text-11 font-bold text-accent-foreground'],
  ])('#200 R3: textos del héroe con la escala del canvas (%s)', async (id, className) => {
    await renderFood();
    await screen.findByTestId('food-plan-card');
    const node = id === 'Objetivo diario' ? screen.getByText(id) : screen.getByTestId(id);
    expect(node.props.className).toBe(className);
  });
});


describe('#200 R4: pista y movimiento del anillo', () => {
  beforeEach(setupFood168);
  it('#200 R4: el relleno espera 200 ms y usa la curva del anillo', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan({ kcalConsumedToday: 328 }) });
    mockServeMeal.mockResolvedValue({ kind: 'ok' });
    await renderFood();
    await waitFor(() => expect(screen.getByTestId('food-plan-percent')).toHaveTextContent('50%'));
    expectKcalBarTiming(50);
    mockWithDelay.mockClear();
    mockWithTiming.mockClear();
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan({ kcalConsumedToday: 656, servedToday: ['07:30'] }) });
    await fireEvent.press(screen.getByTestId('meal-toggle-0'));
    await waitFor(() => expect(screen.getByTestId('food-plan-percent')).toHaveTextContent('100%'));
    expectKcalBarTiming(100);
  });
  it('#200 R4: la pista lleva la opacidad del canvas', async () => {
    await renderFood();
    await screen.findByTestId('food-plan-card');
    expect(screen.getByTestId('food-plan-ring-track').props.strokeOpacity).toBe(0.22);
  });
});


describe('#200 R5: tarjeta de comidas', () => {
  beforeEach(setupFood168);
  it('#200 R5: la tarjeta de comidas es la del canvas', async () => {
    await renderFood();
    const card = await screen.findByTestId('food-meals-section');
    expect(card.type).toBe('View');
    expect(card.props.className).toBe('gap-2 rounded-24 border border-border bg-surface p-3.5');
    expect(card).toHaveStyle(CONTINUOUS_CORNER);
    expect(screen.getByTestId('food-meals-progress')).toHaveStyle({ fontVariant: ['tabular-nums'] });
  });
  it.each([
    ['food-meals-title', 'text-17 font-extrabold text-foreground'],
    ['food-meals-progress', 'text-15 font-black text-accent-strong'],
  ])('#200 R5: la tarjeta de comidas es la del canvas (%s)', async (id, className) => {
    await renderFood();
    expect((await screen.findByTestId(id)).props.className).toBe(className);
  });
});


describe('#200 R6: filas del canvas', () => {
  beforeEach(() => {
    setupFood168();
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan({ servedToday: ['07:30'] }) });
  });
  it.each([
    [0, 'flex-row items-center gap-3 py-2'],
    [1, 'flex-row items-center gap-3 border-t border-border py-2'],
  ])('#200 R6: la primera fila no lleva borde y las siguientes sí (%s)', async (index, className) => {
    await renderFood();
    expect((await screen.findByTestId(`meal-row-${index}`)).props.className).toBe(className);
  });
  it.each([
    [0, 'size-9 items-center justify-center rounded-xl bg-category-green', 'food-icon-check', 2.6, 'category-green-strong'],
    [1, 'size-9 items-center justify-center rounded-xl bg-default', 'food-icon-clock', 2.4, 'muted'],
  ] as const)('#200 R6: el tile dice servido o pendiente (%s)', async (index, className, iconID, strokeWidth, color) => {
    await renderFood();
    await screen.findByTestId(`meal-row-${index}`);
    const tile = screen.getByTestId(`meal-tile-${index}`, { includeHiddenElements: true });
    expect(tile.props.className).toBe(className);
    expect(tile).toHaveStyle(CONTINUOUS_CORNER);
    expect(foodChild(screen.getByTestId(`meal-row-${index}`), 0).props.testID).toBe(`meal-tile-${index}`);
    const icon = within(tile).getByTestId(iconID, { includeHiddenElements: true });
    expect(icon.props).toMatchObject({ size: 18, strokeWidth, color });
  });
  it('#200 R6: la hora anida la ración', async () => {
    await renderFood();
    const hour = await screen.findByText('07:30 · 94 g');
    expect(hour.props.className).toBe('text-15 font-extrabold text-foreground');
    expect(hour).toHaveStyle({ fontVariant: ['tabular-nums'] });
    const portion = within(hour).getByTestId('meal-portion-0');
    expect(portion.props.className).toBe('font-semibold text-muted');
    expect(portion).toHaveTextContent('· 94 g');
  });
  it.each([
    ['meal-served-0', 'rounded-full px-2.5 py-1 bg-category-green', 'text-xs font-extrabold text-category-green-strong', 'Servido'],
    ['meal-pending-1', 'h-8 justify-center rounded-full bg-accent px-3', 'text-xs font-extrabold text-accent-foreground', 'Marcar servido'],
  ])('#200 R6: servida es píldora verde y pendiente es botón con labio (%s)', async (id, className, textClass, label) => {
    await renderFood();
    const pill = await screen.findByTestId(id);
    expect(pill.type).toBe('View');
    expect(pill.props.className).toBe(className);
    expect(within(pill).getByText(label).props.className).toBe(textClass);
    if (id === 'meal-pending-1') {
      const { result } = await renderHook(() => useChunkyLip());
      expect(pill).toHaveStyle(result.current.primaryCompact);
      expect(es['food.markServedAction']).toBe('Marcar servido');
      expect(en['food.markServedAction']).toBe('Mark served');
    }
  });
});


const FOOD_WARNINGS_200 = [
  { code: 'weight_loss_plan', message: 'Aviso de peso.' },
  { code: 'check_food_allergens', message: 'Aviso de alergias.' },
];
function setupFood200Warnings() {
  setupFood168();
  mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan({ warnings: FOOD_WARNINGS_200, aiExplanation: 'Plan explicado.' }) });
}

describe('#200 R7: avisos del plan', () => {
  beforeEach(setupFood200Warnings);
  it('#200 R7: cada aviso es una tarjeta neutra con interlineado de nota', async () => {
    await renderFood();
    const warnings = await screen.findByTestId('food-warnings');
    expect(warnings.props.className).toBe('gap-2');
    for (const { code, message } of FOOD_WARNINGS_200) {
      const card = within(warnings).getByTestId(`warning-card-${code}`);
      expect(card.type).toBe('View');
      expect(card.props.className).toBe('rounded-card bg-default p-3.5');
      expect(card).toHaveStyle(CONTINUOUS_CORNER);
      const text = within(card).getByTestId(`plan-warning-${code}`);
      expect(text.props.className).toBe('text-sm font-medium leading-note text-foreground');
      expect(text).toHaveTextContent(message);
    }
  });
  it('#200 R7: sin avisos no hay contenedor', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() });
    await renderFood();
    await screen.findByTestId('food-plan-card');
    expect(screen.queryByTestId('food-warnings')).toBeNull();
  });
});


it('#200 R8: la recomendación es la tarjeta violeta del canvas', async () => {
  setupFood200Warnings();
  await renderFood();
  const card = await screen.findByTestId('food-ai-card');
  expect(card.type).toBe('View');
  expect(card.props.className).toBe('flex-row gap-3 rounded-card bg-category-violet p-3.5');
  expect(card).toHaveStyle(CONTINUOUS_CORNER);
  const icon = within(card).getByTestId('food-icon-sparkles', { includeHiddenElements: true });
  expect(icon.props).toMatchObject({ size: 22, strokeWidth: 2.2, color: 'category-violet-strong' });
  const title = within(card).getByTestId('food-ai-title');
  expect(title.props.className).toBe('text-sm font-extrabold text-category-violet-strong');
  expect(title).toHaveTextContent('Recomendación IA');
  expect(title.parent?.props.className).toBe('flex-1 gap-0.5');
  const body = within(card).getByTestId('food-ai-body');
  expect(body.props.className).toBe('text-13 leading-body text-foreground');
  expect(body).toHaveTextContent('Plan explicado.');
  expect(within(card).getAllByTestId(/^(food-icon-sparkles|food-ai-title|food-ai-body)$/).map(n => n.props.testID))
    .toEqual(['food-icon-sparkles', 'food-ai-title', 'food-ai-body']);
});


describe('#200 R9: enlaces del canvas', () => {
  beforeEach(setupFood200Warnings);
  it.each([
    ['meal-schedule-link', 'meal-schedule-link-title', es['food.mealScheduleLinkSubtitle']],
    ['meals-history-link', 'meals-history-link-title', es['food.mealsHistoryLinkSubtitle']],
  ])('#200 R9: los enlaces son filas neutras de radio 16 (%s)', async (id, titleID, subtitle) => {
    await renderFood();
    const link = await screen.findByTestId(id);
    expect(screen.getByTestId('food-links').props.className).toBe('gap-2');
    expect(link.props.className).toBe('flex-row items-center gap-3 rounded-16 bg-default px-3.5 py-3');
    expect(link.props.accessibilityRole).toBe('button');
    expect(link).toHaveStyle(CONTINUOUS_CORNER);
    const title = within(link).getByTestId(titleID);
    expect(title.props.className).toBe('text-15 font-extrabold text-foreground');
    expect(title.parent?.props.className).toBe('flex-1 gap-0.5');
    expect(within(link).getByText(subtitle).props.className).toBe('text-xs text-muted');
    expect(within(link).getByTestId('food-icon-chevron-right', { includeHiddenElements: true }).props)
      .toMatchObject({ size: 18, strokeWidth: 2.4, color: 'foreground' });
  });
  it.each([
    ['meal-schedule-link', '/meal-schedule'], ['meals-history-link', '/meals-history'],
  ])('#200 R9: pulsar cada enlace navega como hoy (%s)', async (id, route) => {
    await renderFood();
    const link = await screen.findByTestId(id);
    await fireEvent.press(link);
    expect(mockRouter.push).toHaveBeenCalledWith(route);
  });
});

it('#200 R11: las piezas siguen el orden del canvas', async () => {
  setupFood200Warnings();
  await renderFood();
  await screen.findByTestId('food-ai-card');
  expect(screen.getAllByTestId(/^(food-plan-card|food-meals-section|food-warnings|food-ai-card|food-links)$/).map(n => n.props.testID))
    .toEqual(['food-plan-card', 'food-meals-section', 'food-warnings', 'food-ai-card', 'food-links']);
});


jest.mock('../../components/rise-in', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    RiseIn(props: import('react-native').ViewProps & { delayMs: number; className?: string }) {
      return React.createElement(View, props);
    },
  };
});

function riseDelayOf(node: TestInstance | null): number | undefined {
  for (let current = node; current; current = current.parent) {
    if (current.props.delayMs !== undefined) return current.props.delayMs;
  }
  return undefined;
}

describe('#200 R10: entrada escalonada de Nutrición', () => {
  beforeEach(setupFood200Warnings);
  it.each([
    ['food-plan-card', 0], ['food-meals-section', 80],
    ['warning-card-weight_loss_plan', 110], ['warning-card-check_food_allergens', 140],
    ['food-ai-card', 140], ['food-links', 200],
  ] as const)('#200 R10: cada pieza entra con el retardo del canvas (%s)', async (id, delay) => {
    await renderFood();
    const piece = await screen.findByTestId(id);
    expect(riseDelayOf(piece)).toBe(delay);
  });
  it('#200 R10: sin plan los enlaces no entran con RiseIn', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' });
    await renderFood();
    await screen.findByTestId('food-plan-empty');
    expect(riseDelayOf(screen.getByTestId('food-links'))).toBeUndefined();
  });
});
