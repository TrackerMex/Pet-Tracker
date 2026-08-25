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

import { getNutritionPlan, type NutritionPlanState } from '../../../api/nutrition';
import { listPets, type PetsState } from '../../../api/pets';
import type { NutritionPlan, PetProfile } from '../../../api/types';
import * as apiHooks from '../../../hooks/use-api';
import type { ApiResult } from '../../../hooks/use-api';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import { SelectedPetProvider } from '../../../providers/selected-pet-provider';
import * as selectedPetHooks from '../../../providers/selected-pet-provider';
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
    expect(screen.getByTestId('food-plan-skeleton')).toHaveProp(
      'className',
      expect.stringContaining('h-32'),
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

describe('R5: plan del día con horarios y warnings', () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['requestAnimationFrame'] });
    jest.setSystemTime(new Date('2026-08-23T13:00:00'));
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows a skeleton and schedule link while the plan is pending', async () => {
    mockGetNutritionPlan.mockReturnValue(pending<NutritionPlanState>());

    await renderFood();

    await waitFor(() =>
      expect(screen.getByTestId('food-plan-skeleton')).toBeVisible(),
    );
    expect(screen.getByTestId('food-meals-skeleton')).toHaveProp(
      'className',
      expect.stringContaining('h-56'),
    );
    expect(screen.queryByTestId('food-schedule-skeleton')).toBeNull();
    expect(screen.getByTestId('meal-schedule-link')).toBeVisible();
  });

  it('renders kcal, grams, ordered meals, portions, and local-time badges', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() });

    await renderFood();

    await waitFor(() => expect(screen.getByTestId('food-plan-card')).toBeVisible());
    expect(screen.getByTestId('food-plan-kcal')).toHaveTextContent(
      '656 kcal / day',
    );
    expect(screen.getByTestId('food-plan-grams')).toHaveTextContent(
      '187 g / day',
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
    expect(screen.getByTestId('meal-served-0')).toHaveTextContent('Served');

    const dinner = within(screen.getByTestId('meal-row-1'));
    expect(dinner.getByText('19:30')).toBeVisible();
    expect(dinner.getByText('94 g')).toBeVisible();
    expect(screen.getByTestId('meal-pending-1')).toHaveTextContent('Pending');

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
        'No meal plan yet',
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
        'Could not load meal plan',
      ),
    );
    await fireEvent.press(screen.getByTestId('food-plan-retry'));

    await waitFor(() => expect(screen.getByTestId('food-plan-card')).toBeVisible());
    expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2);
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
    expect(aiCard.getByText('AI recommendation')).toBeVisible();
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
        const result = hookCall++ % 2 === 0 ? petsResult : emptyResult;
        return result as ApiResult<T>;
      },
    );

    const view = await renderFood();

    expect(selectPet).not.toHaveBeenCalled();

    petsResult = {
      data: { kind: 'ok', pets: [existingPet, createdPet] },
      isRefreshing: false,
      refetch: jest.fn(),
    };
    await view.rerender(<FoodScreen />);

    expect(selectPet).not.toHaveBeenCalled();
  });
});
