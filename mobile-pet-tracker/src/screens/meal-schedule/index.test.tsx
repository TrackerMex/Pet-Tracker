import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect } from 'react';

import {
  addMealTime,
  moveMealTime,
  generateNutritionPlan,
  getNutritionPlan,
  getNutritionProfile,
  type EditMealTimeState,
  type GeneratePlanState,
  type NutritionPlanState,
  type NutritionProfileState,
} from '../../api/nutrition';
import { getPet, type PetState } from '../../api/pets';
import { nutritionKeys } from '../../api/query-keys';
import type { NutritionPlan, NutritionProfile, PetProfile } from '../../api/types';
import { es } from '../../i18n/catalog';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import {
  SelectedPetProvider,
  useSelectedPet,
} from '../../providers/selected-pet-provider';
import { MealScheduleScreen } from '.';
import { renderWithProviders } from '../../../test/render-with-providers';

jest.mock('../../api/nutrition', () => ({
  addMealTime: jest.fn(),
  moveMealTime: jest.fn(),
  generateNutritionPlan: jest.fn(),
  getNutritionPlan: jest.fn(),
  getNutritionProfile: jest.fn(),
}));

jest.mock('../../api/pets', () => ({ getPet: jest.fn() }));

jest.mock('../../providers/auth-provider', () => ({
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

jest.mock('@expo/ui', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    Host: (props: Record<string, unknown>) => {
      const { children, ...hostProps } = props;

      return React.createElement(
        View,
        { ...hostProps, testID: 'expo-ui-picker-host' },
        children as never,
      );
    },
  };
});

jest.mock('@expo/ui/community/datetime-picker', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return function MockDateTimePicker(props: Record<string, unknown>) {
    return React.createElement(View, props);
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
    Clock: icon('meal-schedule-icon-clock'),
    ForkKnife: icon('meal-schedule-icon-fork-knife'),
  };
});

jest.mock(
  '../../theme/use-theme-colors',
  () => ({
    useThemeColors: (tokens: string[]) => tokens.map(() => '#000000'),
  }),
  { virtual: true },
);

// Jest copies process.env; Node's environment makes Date observe TZ.
const hostProcess = process.getBuiltinModule('process');
const apiUrl = 'http://example.test/v1';
const mockGenerateNutritionPlan = jest.mocked(generateNutritionPlan);
const mockGetNutritionPlan = jest.mocked(getNutritionPlan);
const mockGetNutritionProfile = jest.mocked(getNutritionProfile);
const mockAddMealTime = jest.mocked(addMealTime);
const mockMoveMealTime = jest.mocked(moveMealTime);
const mockGetPet = jest.mocked(getPet);
const mockUseAuth = jest.mocked(useAuth);

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

function petState(myRole: PetProfile['myRole'] = 'owner'): PetState {
  return { kind: 'ok', pet: {
    id: 'pet-1', name: 'Luna', species: 'dog', breed: null, sex: null,
    birthDate: null, approxAgeMonths: null, ageMonths: 30, currentWeightKg: null,
    size: null, color: null, sterilized: null, microchip: null, photoUrl: null,
    lostMode: false, lastPosition: null, lastCommunicationAt: null, myRole,
    device: null, nextVaccine: null, nextReminder: null, activitySummary: null,
    mealsToday: null, createdAt: '2026-10-01T12:00:00.000Z', updatedAt: '2026-10-01T12:00:00.000Z',
  } };
}

function childTestIds(node: ReturnType<typeof screen.getByTestId>) {
  return node.children.map((child) => typeof child === 'string' ? undefined : child.props.testID);
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
  return renderWithProviders(
    <HeroUINativeProvider>
      <LanguageProvider initial="es">
        <SelectedPetProvider>
          {selected ? <SelectionProbe /> : null}
          <MealScheduleScreen />
        </SelectedPetProvider>
      </LanguageProvider>
    </HeroUINativeProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockGenerateNutritionPlan.mockReset();
  mockGetNutritionPlan.mockReset();
  mockGetNutritionProfile.mockReset();
  mockAddMealTime.mockReset();
  mockAddMealTime.mockResolvedValue({ kind: 'ok' });
  mockMoveMealTime.mockReset();
  mockMoveMealTime.mockResolvedValue({ kind: 'ok' });
  mockGetPet.mockReset();
  mockGetPet.mockResolvedValue(petState('family'));
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

  it('shows loading and the metrics under the native header (#95 R6)', async () => {
    mockGetNutritionPlan.mockReturnValue(pending<NutritionPlanState>());
    mockGetNutritionProfile.mockReturnValue(pending<NutritionProfileState>());

    await renderMealSchedule();

    await waitFor(() =>
      expect(screen.getByTestId('screen-meal-schedule')).toBeVisible(),
    );
    expect(screen.getByTestId('meal-schedule-loading')).toBeVisible();
    expect(screen.getByTestId('meal-schedule-summary-skeleton')).toHaveProp(
      'className',
      expect.stringContaining('h-32'),
    );
    expect(screen.getByTestId('meal-schedule-meals-skeleton')).toHaveProp(
      'className',
      expect.stringContaining('h-56'),
    );
    expect(screen.getByTestId('meal-schedule-action-skeleton')).toHaveProp(
      'className',
      expect.stringContaining('h-12'),
    );
    expect(screen.getByTestId('meal-schedule-profile-skeleton')).toHaveProp(
      'className',
      expect.stringContaining('h-32'),
    );
    expect(
      screen.getByTestId('screen-meal-schedule').props.contentContainerStyle,
    ).toEqual({ padding: 24, gap: 16, paddingBottom: 48 });

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
    expect(summary.getByText('2 comidas / día')).toBeVisible();
    expect(summary.getByText('187 g / día')).toBeVisible();
    expect(
      screen.getAllByTestId(/^meal-time-row-/).map(({ props }) => props.testID),
    ).toEqual(['meal-time-row-0', 'meal-time-row-1']);
    const firstMeal = within(screen.getByTestId('meal-time-row-0'));
    expect(firstMeal.getByText('07:30')).toBeVisible();
    expect(firstMeal.getByText('94 g')).toBeVisible();

    const profile = within(screen.getByTestId('nutrition-profile-section'));
    expect(profile.getByText('Perfil nutricional')).toBeVisible();
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
        'Aún no hay plan de alimentación',
      ),
    );
    expect(screen.getByTestId('nutrition-profile-empty')).toHaveTextContent(
      'Aún no hay perfil nutricional',
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
        'Algo salió mal',
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

describe('R8: generar plan con degradación por kind', () => {
  beforeEach(() => {
    mockGetNutritionProfile.mockResolvedValue({ kind: 'not-found' });
  });

  it.each([
    { kind: 'not-found' } as const,
    { kind: 'ok', plan: makePlan() } as const,
  ])('shows the generate button with a $kind plan', async (state) => {
    mockGetNutritionPlan.mockResolvedValue(state);

    await renderMealSchedule();

    await waitFor(() =>
      expect(screen.getByTestId('generate-plan-button')).toBeVisible(),
    );
    expect(screen.getByText('Generar plan')).toBeVisible();
  });

  it.each<{
    result: GeneratePlanState;
    message: string;
  }>([
    {
      result: { kind: 'forbidden' },
      message: 'Solo el dueño puede generar el plan',
    },
    {
      result: {
        kind: 'unprocessable',
        code: 'NUTRITION_PROFILE_REQUIRED',
      },
      message: 'Primero crea un perfil nutricional',
    },
    {
      result: { kind: 'unprocessable', code: 'PET_WEIGHT_REQUIRED' },
      message: 'Primero registra un peso',
    },
    {
      result: { kind: 'unprocessable', code: null },
      message: 'Algo salió mal',
    },
    { result: { kind: 'error' }, message: 'Algo salió mal' },
    { result: { kind: 'missing-config' }, message: 'Algo salió mal' },
    {
      result: { kind: 'unreachable', message: 'network down' },
      message: 'No se pudo conectar con el servidor',
    },
  ])('maps $result.kind to "$message"', async ({ result, message }) => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' });
    mockGenerateNutritionPlan.mockResolvedValue(result);

    await renderMealSchedule();
    await waitFor(() =>
      expect(screen.getByTestId('generate-plan-button')).toBeVisible(),
    );
    await fireEvent.press(screen.getByTestId('generate-plan-button'));

    await waitFor(() =>
      expect(screen.getByTestId('generate-plan-error')).toHaveTextContent(
        message,
      ),
    );
    expect(mockGenerateNutritionPlan).toHaveBeenCalledWith(
      apiUrl,
      'jwt-token',
      'pet-1',
    );
  });

  it('clears a prior error and refetches the generated plan on success', async () => {
    const generatedPlan = makePlan({ dailyGrams: 200 });
    mockGetNutritionPlan
      .mockResolvedValueOnce({ kind: 'not-found' })
      .mockResolvedValueOnce({ kind: 'ok', plan: generatedPlan });
    mockGenerateNutritionPlan
      .mockResolvedValueOnce({ kind: 'forbidden' })
      .mockResolvedValueOnce({ kind: 'ok', plan: generatedPlan });

    await renderMealSchedule();
    await waitFor(() =>
      expect(screen.getByTestId('generate-plan-button')).toBeVisible(),
    );
    await fireEvent.press(screen.getByTestId('generate-plan-button'));
    await waitFor(() =>
      expect(screen.getByTestId('generate-plan-error')).toBeVisible(),
    );

    await fireEvent.press(screen.getByTestId('generate-plan-button'));

    await waitFor(() =>
      expect(screen.getByTestId('meal-schedule-summary')).toBeVisible(),
    );
    expect(screen.queryByTestId('generate-plan-error')).toBeNull();
    expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2);
    expect(mockGenerateNutritionPlan).toHaveBeenCalledTimes(2);
  });

  it('disables the generate button while the request is pending', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' });
    mockGenerateNutritionPlan.mockReturnValue(pending<GeneratePlanState>());

    await renderMealSchedule();
    await waitFor(() =>
      expect(screen.getByTestId('generate-plan-button')).toBeVisible(),
    );
    await fireEvent.press(screen.getByTestId('generate-plan-button'));

    await waitFor(() =>
      expect(
        screen.getByTestId('generate-plan-button').props.accessibilityState,
      ).toEqual(expect.objectContaining({ disabled: true })),
    );
  });
});

describe('#62 R5: el título de card usa un único tratamiento', () => {
  it('aplica la receta canónica a Perfil nutricional', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() });
    mockGetNutritionProfile.mockResolvedValue({
      kind: 'ok',
      profile: makeProfile(),
    });

    await renderMealSchedule();

    expect(
      (await screen.findByTestId('nutrition-profile-title')).props.className,
    ).toBe('text-base font-bold text-foreground');
  });
});

describe('#87 R11: MealScheduleContent lee por TanStack Query', () => {
  it('deja el plan y el perfil en sus claves canónicas', async () => {
    const planState: NutritionPlanState = { kind: 'ok', plan: makePlan() };
    const profileState: NutritionProfileState = {
      kind: 'ok',
      profile: makeProfile(),
    };
    mockGetNutritionPlan.mockResolvedValue(planState);
    mockGetNutritionProfile.mockResolvedValue(profileState);

    const { queryClient } = await renderWithProviders(
      <HeroUINativeProvider>
        <LanguageProvider initial="es">
          <SelectedPetProvider>
            <SelectionProbe />
            <MealScheduleScreen />
          </SelectedPetProvider>
        </LanguageProvider>
      </HeroUINativeProvider>,
    );
    await screen.findByTestId('meal-schedule-summary');

    expect(queryClient.getQueryData(nutritionKeys.plan('pet-1'))).toEqual(
      planState,
    );
    expect(queryClient.getQueryData(nutritionKeys.profile('pet-1'))).toEqual(
      profileState,
    );
  });
});

describe('#95 R5: la pantalla no dibuja cabecera propia', () => {
  it('retira el botón y el título del cuerpo', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() });
    mockGetNutritionProfile.mockResolvedValue({ kind: 'ok', profile: makeProfile() });
    await renderMealSchedule();
    await waitFor(() => expect(screen.getByTestId('screen-meal-schedule')).toBeVisible());
    await screen.findByTestId('meal-schedule-summary');
    expect(screen.queryByTestId('meal-schedule-back')).toBeNull();
    expect(screen.queryByText(es['mealSchedule.mealSchedule'])).toBeNull();
  });
});


describe('#147 R4: solo el owner ve Editar y Añadir comida', () => {
  beforeEach(() => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() });
    mockGetNutritionProfile.mockResolvedValue({ kind: 'ok', profile: makeProfile() });
  });

  it('el owner ve Editar en cada fila y Añadir comida bajo la lista', async () => {
    mockGetPet.mockResolvedValue(petState('owner'));
    await renderMealSchedule();
    await waitFor(() => expect(childTestIds(screen.getByTestId('meal-time-row-1'))).toEqual([undefined, undefined, undefined, 'meal-time-edit-1']));
    expect(childTestIds(screen.getByTestId('meal-time-row-0'))).toEqual([undefined, undefined, undefined, 'meal-time-edit-0']);
    expect(mockGetPet).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token', 'pet-1');
    expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1', 'add-meal-time-button']);
    for (const [index, label] of [[0, 'Editar horario de las 07:30'], [1, 'Editar horario de las 19:30']] as const) {
      const button = within(screen.getByTestId(`meal-time-row-${index}`)).getByTestId(`meal-time-edit-${index}`);
      expect(button.props.accessibilityLabel).toBe(label);
      expect(within(button).getByText('Editar')).toBeVisible();
      expect(button.props.className.split(' ')).toEqual(expect.arrayContaining(['min-h-11', 'rounded-xl', 'bg-accent-soft']));
      expect(within(button).getByText('Editar').props.className.split(' ')).toEqual(expect.arrayContaining(['font-semibold', 'text-accent-strong']));
    }
    const add = screen.getByTestId('add-meal-time-button');
    expect(within(add).getByText('Añadir comida')).toBeVisible();
    expect(add.props.className.split(' ')).toEqual(expect.arrayContaining(['rounded-xl', 'bg-accent-soft']));
    expect(within(add).getByText('Añadir comida').props.className.split(' ')).toEqual(expect.arrayContaining(['font-bold', 'text-accent-strong']));
  });

  it.each(['family', 'walker', 'vet'] as const)('%s no ve controles de edición', async (role) => {
    mockGetPet.mockResolvedValue(petState(role));
    const { queryClient } = await renderMealSchedule();
    await waitFor(() => {
      expect(queryClient.getQueryData(['pets', 'detail', 'pet-1'])).toEqual(petState(role));
      expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1']);
      for (const index of [0, 1]) {
        expect(childTestIds(screen.getByTestId(`meal-time-row-${index}`))).toEqual([undefined, undefined, undefined]);
        expect(screen.queryByTestId(`meal-time-edit-${index}`)).toBeNull();
      }
      expect(screen.queryByTestId('add-meal-time-button')).toBeNull();
    });
  });

  it('sin el detalle de la mascota resuelto no hay controles', async () => {
    mockGetPet.mockReturnValue(pending<PetState>());
    await renderMealSchedule();
    await waitFor(() => {
      expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1']);
      expect(screen.getByTestId('meal-time-row-1')).toBeVisible();
      expect(mockGetPet).toHaveBeenCalled();
      for (const index of [0, 1]) {
        expect(childTestIds(screen.getByTestId(`meal-time-row-${index}`))).toEqual([undefined, undefined, undefined]);
        expect(screen.queryByTestId(`meal-time-edit-${index}`)).toBeNull();
      }
      expect(screen.queryByTestId('add-meal-time-button')).toBeNull();
    });
  });

  it('con el detalle de la mascota en error no hay controles', async () => {
    mockGetPet.mockResolvedValue({ kind: 'error' });
    const { queryClient } = await renderMealSchedule();
    await waitFor(() => {
      expect(queryClient.getQueryData(['pets', 'detail', 'pet-1'])).toEqual({ kind: 'error' });
      expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1']);
      for (const index of [0, 1]) {
        expect(childTestIds(screen.getByTestId(`meal-time-row-${index}`))).toEqual([undefined, undefined, undefined]);
        expect(screen.queryByTestId(`meal-time-edit-${index}`)).toBeNull();
      }
      expect(screen.queryByTestId('add-meal-time-button')).toBeNull();
    });
  });
});


describe('#147 R5: Editar abre el selector en la hora de la fila y publica el PATCH', () => {
  beforeEach(() => {
    mockGetPet.mockResolvedValue(petState('owner'));
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() });
    mockGetNutritionProfile.mockResolvedValue({ kind: 'ok', profile: makeProfile() });
  });

  it('abre un único selector de hora con la hora local de la fila', async () => {
    const previousTZ = hostProcess.env.TZ;
    try {
      hostProcess.env.TZ = 'America/Mexico_City';
      await renderMealSchedule();
      await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
      expect(screen.queryByTestId('meal-time-picker')).not.toBeNull();
      expect(screen.getAllByTestId('meal-time-picker')).toHaveLength(1);
      expect(screen.getAllByTestId('expo-ui-picker-host')).toHaveLength(1);
      const picker = screen.getByTestId('meal-time-picker');
      expect(picker.props.mode).toBe('time');
      expect(picker.props.presentation).toBe('dialog');
      expect([picker.props.value.getHours(), picker.props.value.getMinutes()]).toEqual([19, 30]);
      await fireEvent(picker, 'onDismiss');
      await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
    } finally {
      if (previousTZ === undefined) delete hostProcess.env.TZ;
      else hostProcess.env.TZ = previousTZ;
    }
  });

  it('al elegir una hora nueva llama a moveMealTime con la hora local y cierra el selector', async () => {
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
    expect(screen.queryByTestId('meal-time-picker')).not.toBeNull();
    const chosen = Object.assign(new Date(2026, 9, 2, 20, 5), { getUTCHours: () => 3, getUTCMinutes: () => 7, toISOString: () => '2026-10-03T03:07:00.000Z' });
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, chosen);
    await waitFor(() => {
      expect(screen.getByTestId('meal-time-edit-0')).toBeVisible();
      expect(mockMoveMealTime).toHaveBeenCalledTimes(1);
      expect(mockMoveMealTime).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', '19:30', '20:05');
      expect(screen.queryByTestId('meal-time-picker')).toBeNull();
    });
    expect(jest.mocked(addMealTime)?.mock.calls ?? []).toEqual([]);
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });

  it('al cerrar el selector sin elegir no llama a nada', async () => {
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
    expect(screen.queryByTestId('meal-time-picker')).not.toBeNull();
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onDismiss');
    await waitFor(() => {
      expect(screen.getByTestId('meal-time-edit-0')).toBeVisible();
      expect(screen.queryByTestId('meal-time-picker')).toBeNull();
    });
    expect(mockMoveMealTime).not.toHaveBeenCalled();
    expect(jest.mocked(addMealTime)?.mock.calls ?? []).toEqual([]);
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });

  it('elegir la misma hora de la fila no llama a nada', async () => {
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
    expect(screen.queryByTestId('meal-time-picker')).not.toBeNull();
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 19, 30));
    await waitFor(() => {
      expect(screen.getByTestId('meal-time-edit-0')).toBeVisible();
      expect(screen.queryByTestId('meal-time-picker')).toBeNull();
    });
    expect(mockMoveMealTime).not.toHaveBeenCalled();
    expect(jest.mocked(addMealTime)?.mock.calls ?? []).toEqual([]);
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });
});


describe('#147 R6: Añadir comida abre el selector a las 12:00 y publica el POST', () => {
  beforeEach(() => {
    mockGetPet.mockResolvedValue(petState('owner'));
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() });
    mockGetNutritionProfile.mockResolvedValue({ kind: 'ok', profile: makeProfile() });
  });

  it('abre el selector a las 12:00 locales', async () => {
    const previousTZ = hostProcess.env.TZ;
    try {
      hostProcess.env.TZ = 'America/Mexico_City';
      await renderMealSchedule();
      await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
      expect(screen.queryByTestId('meal-time-picker')).not.toBeNull();
      const picker = screen.getByTestId('meal-time-picker');
      expect([picker.props.value.getHours(), picker.props.value.getMinutes()]).toEqual([12, 0]);
      expect(picker.props.mode).toBe('time');
      expect(picker.props.presentation).toBe('dialog');
      await fireEvent(picker, 'onDismiss');
      await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
    } finally {
      if (previousTZ === undefined) delete hostProcess.env.TZ;
      else hostProcess.env.TZ = previousTZ;
    }
  });

  it('al elegir una hora llama a addMealTime con la hora local rellenada a dos dígitos', async () => {
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    expect(screen.queryByTestId('meal-time-picker')).not.toBeNull();
    const chosen = Object.assign(new Date(2026, 9, 2, 8, 5), { getUTCHours: () => 14, getUTCMinutes: () => 7, toISOString: () => '2026-10-02T14:07:00.000Z' });
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, chosen);
    await waitFor(() => {
      expect(screen.getByTestId('meal-time-edit-0')).toBeVisible();
      expect(mockAddMealTime).toHaveBeenCalledTimes(1);
      expect(mockAddMealTime).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', '08:05');
      expect(screen.queryByTestId('meal-time-picker')).toBeNull();
    });
    expect(mockMoveMealTime).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });

  it('al cerrar el selector sin elegir no llama a nada', async () => {
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    expect(screen.queryByTestId('meal-time-picker')).not.toBeNull();
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onDismiss');
    await waitFor(() => {
      expect(screen.getByTestId('meal-time-edit-0')).toBeVisible();
      expect(screen.queryByTestId('meal-time-picker')).toBeNull();
    });
    expect(mockMoveMealTime).not.toHaveBeenCalled();
    expect(mockAddMealTime).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });
});


describe('#147 R7: tras un éxito refetchea plan y mascota, sin estado optimista', () => {
  beforeEach(() => {
    mockGetPet.mockResolvedValue(petState('owner'));
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() });
    mockGetNutritionProfile.mockResolvedValue({ kind: 'ok', profile: makeProfile() });
  });

  it('tras ok refetchea el plan y el detalle de la mascota y repinta con la hora nueva', async () => {
    mockGetNutritionPlan
      .mockResolvedValueOnce({ kind: 'ok', plan: makePlan() })
      .mockResolvedValueOnce({ kind: 'ok', plan: makePlan({ mealTimes: ['07:30', '20:05'] }) });
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 20, 5));
    await waitFor(() => {
      expect(within(screen.getByTestId('meal-time-row-1')).queryByText('20:05')).not.toBeNull();
      expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true }));
    });
    expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2);
    expect(mockGetPet).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });

  it('mientras la edición vuela, todos los controles están deshabilitados y la lista no cambia', async () => {
    let resolve!: (state: EditMealTimeState) => void;
    mockMoveMealTime.mockReturnValue(new Promise((done) => { resolve = done; }));
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 20, 5));
    await waitFor(() => {
      expect(mockMoveMealTime).toHaveBeenCalledTimes(1);
      for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
        expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
      }
    });
    expect(within(screen.getByTestId('meal-time-row-1')).getByText('19:30')).toBeVisible();
    expect(screen.queryByText('20:05')).toBeNull();
    await act(async () => resolve({ kind: 'ok' }));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });

  it('los controles siguen deshabilitados hasta que termina el refetch', async () => {
    let resolve!: (state: NutritionPlanState) => void;
    mockGetNutritionPlan.mockResolvedValueOnce({ kind: 'ok', plan: makePlan() })
      .mockReturnValueOnce(new Promise((done) => { resolve = done; }));
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 20, 5));
    await waitFor(() => {
      for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
        expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
      }
      expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2);
    });
    expect(screen.queryByText('20:05')).toBeNull(); // #147 E4.1: ni la hora nueva antes del refetch
    expect(within(screen.getByTestId('meal-time-row-1')).getByText('19:30')).toBeVisible();
    await act(async () => resolve({ kind: 'ok', plan: makePlan({ mealTimes: ['07:30', '20:05'] }) }));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });

  it('un resultado que no es ok no refetchea', async () => {
    mockMoveMealTime.mockResolvedValue({ kind: 'unprocessable', code: 'MEAL_TIME_DUPLICATE' });
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 20, 5));
    await waitFor(() => {
      expect(mockMoveMealTime).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true }));
    });
    expect(mockGetNutritionPlan).toHaveBeenCalledTimes(1);
    expect(mockGetPet).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });

  it('tras ok de Añadir refetchea el plan y el detalle de la mascota y repinta con la fila nueva', async () => {
    mockGetNutritionPlan
      .mockResolvedValueOnce({ kind: 'ok', plan: makePlan() })
      .mockResolvedValueOnce({ kind: 'ok', plan: makePlan({ mealTimes: ['07:30', '08:05', '19:30'] }) });
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 8, 5));
    await waitFor(() => {
      expect(within(screen.getByTestId('meal-time-row-1')).queryByText('08:05')).not.toBeNull();
      expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true }));
    });
    expect(mockAddMealTime).toHaveBeenCalledTimes(1);
    expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2);
    expect(mockGetPet).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });

  it('mientras Añadir vuela, todos los controles están deshabilitados y no aparece la fila nueva', async () => {
    let resolve!: (state: EditMealTimeState) => void;
    mockAddMealTime.mockReturnValue(new Promise((done) => { resolve = done; }));
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 8, 5));
    await waitFor(() => {
      expect(mockAddMealTime).toHaveBeenCalledTimes(1);
      for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
        expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
      }
    });
    expect(screen.queryByTestId('meal-time-row-2')).toBeNull();
    expect(within(screen.getByTestId('meal-time-row-1')).getByText('19:30')).toBeVisible();
    expect(screen.queryByText('08:05')).toBeNull();
    await act(async () => resolve({ kind: 'ok' }));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });

  it('tras ok de Añadir los controles siguen deshabilitados y sin fila nueva hasta que termina el refetch', async () => {
    let resolve!: (state: NutritionPlanState) => void;
    mockGetNutritionPlan.mockResolvedValueOnce({ kind: 'ok', plan: makePlan() })
      .mockReturnValueOnce(new Promise((done) => { resolve = done; }));
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 8, 5));
    await waitFor(() => {
      for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
        expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
      }
      expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2);
    });
    expect(screen.queryByTestId('meal-time-row-2')).toBeNull();
    expect(within(screen.getByTestId('meal-time-row-1')).getByText('19:30')).toBeVisible();
    await act(async () => resolve({ kind: 'ok', plan: makePlan({ mealTimes: ['07:30', '08:05', '19:30'] }) }));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });

  it('los controles siguen deshabilitados hasta que termina también el refetch de la mascota', async () => {
    let resolvePet!: (state: PetState) => void;
    mockGetNutritionPlan
      .mockResolvedValueOnce({ kind: 'ok', plan: makePlan() })
      .mockResolvedValueOnce({ kind: 'ok', plan: makePlan({ mealTimes: ['07:30', '20:05'] }) });
    mockGetPet.mockResolvedValueOnce(petState('owner'))
      .mockReturnValueOnce(new Promise((done) => { resolvePet = done; }));
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 20, 5));
    await waitFor(() => {
      for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
        expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
      }
      expect(mockGetPet).toHaveBeenCalledTimes(2);
    });
    await waitFor(() => expect(within(screen.getByTestId('meal-time-row-1')).queryByText('20:05')).not.toBeNull());
    for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
      expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    }
    await act(async () => resolvePet(petState('owner')));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });

  it('tras ok de Añadir los controles siguen deshabilitados hasta que termina también el refetch de la mascota', async () => {
    let resolvePet!: (state: PetState) => void;
    mockGetNutritionPlan
      .mockResolvedValueOnce({ kind: 'ok', plan: makePlan() })
      .mockResolvedValueOnce({ kind: 'ok', plan: makePlan({ mealTimes: ['07:30', '08:05', '19:30'] }) });
    mockGetPet.mockResolvedValueOnce(petState('owner'))
      .mockReturnValueOnce(new Promise((done) => { resolvePet = done; }));
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 8, 5));
    await waitFor(() => {
      for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
        expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
      }
      expect(mockGetPet).toHaveBeenCalledTimes(2);
    });
    await waitFor(() => expect(within(screen.getByTestId('meal-time-row-1')).queryByText('08:05')).not.toBeNull());
    for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'meal-time-edit-2', 'add-meal-time-button']) {
      expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    }
    await act(async () => resolvePet(petState('owner')));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });
});


describe('#147 R8: cada error del contrato tiene su mensaje', () => {
  beforeEach(() => {
    mockGetPet.mockResolvedValue(petState('owner'));
    mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() });
    mockGetNutritionProfile.mockResolvedValue({ kind: 'ok', profile: makeProfile() });
  });

  it.each<{ label: string; flow: 'add' | 'edit'; result?: EditMealTimeState; rejects?: boolean; literal: string }>([
    { label: 'invalid', flow: 'add', result: { kind: 'invalid' }, literal: 'La hora no es válida' },
    { label: 'forbidden', flow: 'edit', result: { kind: 'forbidden' }, literal: 'Solo el dueño puede cambiar los horarios' },
    { label: 'NUTRITION_PLAN_REQUIRED', flow: 'add', result: { kind: 'unprocessable', code: 'NUTRITION_PLAN_REQUIRED' }, literal: 'Primero genera un plan de alimentación' },
    { label: 'MEAL_TIME_NOT_IN_PLAN', flow: 'edit', result: { kind: 'unprocessable', code: 'MEAL_TIME_NOT_IN_PLAN' }, literal: 'Ese horario ya no está en el plan' },
    { label: 'MEAL_TIME_DUPLICATE', flow: 'edit', result: { kind: 'unprocessable', code: 'MEAL_TIME_DUPLICATE' }, literal: 'Ya hay una comida a esa hora' },
    { label: 'MEAL_TIMES_LIMIT_REACHED', flow: 'add', result: { kind: 'unprocessable', code: 'MEAL_TIMES_LIMIT_REACHED' }, literal: 'El plan ya tiene el máximo de 6 comidas' },
    { label: 'unreachable', flow: 'edit', result: { kind: 'unreachable', message: 'network down' }, literal: 'No se pudo conectar con el servidor' },
    { label: 'error', flow: 'add', result: { kind: 'error' }, literal: 'Algo salió mal' },
    { label: 'missing-config', flow: 'edit', result: { kind: 'missing-config' }, literal: 'Algo salió mal' },
    { label: 'rechazo', flow: 'add', rejects: true, literal: 'Algo salió mal' },
  ])('$label muestra «$literal»', async ({ flow, result, rejects, literal }) => {
    const request = flow === 'add' ? mockAddMealTime : mockMoveMealTime;
    if (rejects) request.mockRejectedValue(new Error('boom'));
    else request.mockResolvedValue(result!);
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId(flow === 'add' ? 'add-meal-time-button' : 'meal-time-edit-1'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, flow === 'add' ? new Date(2026, 9, 2, 8, 5) : new Date(2026, 9, 2, 20, 5));
    await waitFor(() => expect(screen.getByTestId('meal-time-error').props.children).toBe(literal));
    const error = screen.getByTestId('meal-time-error');
    expect(error.props.selectable).toBe(true);
    expect(error.props.className).toBe('text-danger');
    expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1', 'meal-time-error', 'add-meal-time-button']);
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
    expect(mockGetNutritionPlan).toHaveBeenCalledTimes(1); // #147 E2.2: ningún refetch si no es ok
    expect(mockGetPet).toHaveBeenCalledTimes(1);
  });

  it('401 cierra sesión sin mensaje', async () => {
    const signOut = jest.fn();
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut });
    mockMoveMealTime.mockResolvedValue({ kind: 'unauthorized' });
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 20, 5));
    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true }));
    });
    expect(screen.queryByTestId('meal-time-error')).toBeNull();
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
    expect(mockGetNutritionPlan).toHaveBeenCalledTimes(1); // #147 E2.2: ningún refetch si no es ok
    expect(mockGetPet).toHaveBeenCalledTimes(1);
  });

  it('una nueva edición retira el error anterior', async () => {
    mockAddMealTime.mockResolvedValue({ kind: 'unprocessable', code: 'MEAL_TIME_DUPLICATE' });
    let resolve!: (state: EditMealTimeState) => void;
    mockMoveMealTime.mockReturnValue(new Promise((done) => { resolve = done; }));
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 8, 5));
    await waitFor(() => expect(screen.getByTestId('meal-time-error').props.children).toBe('Ya hay una comida a esa hora'));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
    await fireEvent.press(screen.getByTestId('meal-time-edit-1'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 20, 5));
    await waitFor(() => {
      for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
        expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
      }
      expect(screen.queryByTestId('meal-time-error')).toBeNull();
    });
    await act(async () => resolve({ kind: 'ok' }));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });
});
