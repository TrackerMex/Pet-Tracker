import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect } from 'react';

import {
  getNutritionPlan,
  getNutritionProfile,
  type NutritionPlanState,
  type NutritionProfileState,
} from '../../../api/nutrition';
import type { NutritionPlan, NutritionProfile } from '../../../api/types';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import {
  SelectedPetProvider,
  useSelectedPet,
} from '../../../providers/selected-pet-provider';
import MealScheduleScreen from '../meal-schedule';

jest.mock('../../../api/nutrition', () => ({
  getNutritionPlan: jest.fn(),
  getNutritionProfile: jest.fn(),
}));

jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    router: { push: jest.fn(), back: jest.fn() },
    Redirect: ({ href }: { href: string }) => {
      const props = { testID: 'meal-schedule-redirect', href };

      return React.createElement(View, props);
    },
  };
});

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
    ArrowLeft: icon('meal-schedule-icon-arrow-left'),
    Clock: icon('meal-schedule-icon-clock'),
    ForkKnife: icon('meal-schedule-icon-fork-knife'),
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
const mockGetNutritionProfile = jest.mocked(getNutritionProfile);
const mockUseAuth = jest.mocked(useAuth);
const mockRouter = jest.mocked(router);

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

function makeProfile(
  overrides: Partial<NutritionProfile> = {},
): NutritionProfile {
  return {
    petId: 'pet-1',
    activityLevel: 'medium',
    bodyCondition: 5,
    targetWeightKg: 12,
    foodType: 'dry',
    kcalPer100g: 350,
    allergies: ['chicken', 'soy'],
    diseases: ['arthritis'],
    updatedAt: '2026-08-23T12:00:00.000Z',
    ...overrides,
  };
}

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

function SelectionProbe() {
  const { selectPet } = useSelectedPet();

  useEffect(() => {
    selectPet('pet-1');
  }, [selectPet]);

  return null;
}

async function renderMealSchedule(selected = true) {
  await render(
    <HeroUINativeProvider>
      <SelectedPetProvider>
        {selected ? <SelectionProbe /> : null}
        <MealScheduleScreen />
      </SelectedPetProvider>
    </HeroUINativeProvider>,
  );
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

describe('R7: meal schedule muestra horarios y perfil', () => {
  it('redirects a cold deep-link without a selected pet', async () => {
    mockGetNutritionPlan.mockReturnValue(pending<NutritionPlanState>());
    mockGetNutritionProfile.mockReturnValue(pending<NutritionProfileState>());

    await renderMealSchedule(false);

    expect(screen.getByTestId('meal-schedule-redirect').props.href).toBe('/food');
    expect(screen.queryByTestId('screen-meal-schedule')).toBeNull();
    expect(mockGetNutritionPlan).not.toHaveBeenCalled();
    expect(mockGetNutritionProfile).not.toHaveBeenCalled();
  });

  it('shows loading, safe padding, and navigates back', async () => {
    mockGetNutritionPlan.mockReturnValue(pending<NutritionPlanState>());
    mockGetNutritionProfile.mockReturnValue(pending<NutritionProfileState>());

    await renderMealSchedule();

    await waitFor(() =>
      expect(screen.getByTestId('screen-meal-schedule')).toBeVisible(),
    );
    expect(screen.getByText('Meal schedule')).toBeVisible();
    expect(screen.getByTestId('meal-schedule-loading')).toBeVisible();
    expect(
      screen.getByTestId('screen-meal-schedule').props.contentContainerStyle,
    ).toEqual(expect.objectContaining({ padding: 24, paddingBottom: 120 }));

    await fireEvent.press(screen.getByTestId('meal-schedule-back'));
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it('renders the plan summary, ordered portions, and complete profile', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() });
    mockGetNutritionProfile.mockResolvedValue({
      kind: 'ok',
      profile: makeProfile(),
    });

    await renderMealSchedule();

    await waitFor(() =>
      expect(screen.getByTestId('meal-schedule-summary')).toBeVisible(),
    );
    const summary = within(screen.getByTestId('meal-schedule-summary'));
    expect(summary.getByText('656 kcal')).toBeVisible();
    expect(summary.getByText('2 meals / day')).toBeVisible();
    expect(summary.getByText('187 g / day')).toBeVisible();
    expect(
      screen.getAllByTestId(/^meal-time-row-/).map(({ props }) => props.testID),
    ).toEqual(['meal-time-row-0', 'meal-time-row-1']);
    const firstMeal = within(screen.getByTestId('meal-time-row-0'));
    expect(firstMeal.getByText('07:30')).toBeVisible();
    expect(firstMeal.getByText('94 g')).toBeVisible();

    const profile = within(screen.getByTestId('nutrition-profile-section'));
    expect(profile.getByText('Nutrition profile')).toBeVisible();
    expect(profile.getByText('dry')).toBeVisible();
    expect(profile.getByText('350 kcal / 100 g')).toBeVisible();
    expect(profile.getByText('medium')).toBeVisible();
    expect(screen.getByTestId('profile-allergies')).toHaveTextContent(
      'chicken, soy',
    );
    expect(screen.getByTestId('profile-diseases')).toHaveTextContent('arthritis');
    expect(mockGetNutritionPlan).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1');
    expect(mockGetNutritionProfile).toHaveBeenCalledWith(
      apiUrl,
      'jwt-token',
      'pet-1',
    );
  });

  it('shows both graceful empty states', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' });
    mockGetNutritionProfile.mockResolvedValue({ kind: 'not-found' });

    await renderMealSchedule();

    await waitFor(() =>
      expect(screen.getByTestId('meal-schedule-empty')).toHaveTextContent(
        'No meal plan yet',
      ),
    );
    expect(screen.getByTestId('nutrition-profile-empty')).toHaveTextContent(
      'No nutrition profile yet',
    );
  });

  it('omits empty allergies and diseases rows', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' });
    mockGetNutritionProfile.mockResolvedValue({
      kind: 'ok',
      profile: makeProfile({ allergies: [], diseases: [] }),
    });

    await renderMealSchedule();

    await waitFor(() =>
      expect(screen.getByTestId('nutrition-profile-section')).toBeVisible(),
    );
    expect(screen.queryByTestId('profile-allergies')).toBeNull();
    expect(screen.queryByTestId('profile-diseases')).toBeNull();
  });

  it.each([
    { kind: 'error' } as const,
    { kind: 'unreachable', message: 'network down' } as const,
    { kind: 'missing-config' } as const,
  ])('shows and retries a $kind result from either request', async (state) => {
    mockGetNutritionPlan
      .mockResolvedValueOnce(state)
      .mockResolvedValueOnce({ kind: 'not-found' });
    mockGetNutritionProfile
      .mockResolvedValueOnce({ kind: 'not-found' })
      .mockResolvedValueOnce({ kind: 'not-found' });

    await renderMealSchedule();
    await waitFor(() =>
      expect(screen.getByTestId('meal-schedule-error')).toHaveTextContent(
        'Something went wrong',
      ),
    );
    await fireEvent.press(screen.getByTestId('meal-schedule-retry'));

    await waitFor(() =>
      expect(screen.getByTestId('meal-schedule-empty')).toBeVisible(),
    );
    expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2);
    expect(mockGetNutritionProfile).toHaveBeenCalledTimes(2);
  });
});
