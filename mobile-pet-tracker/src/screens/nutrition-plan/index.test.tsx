import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';

import { renderWithProviders } from '../../../test/render-with-providers';
import {
  generateNutritionPlan,
  getNutritionPlan,
  type GeneratePlanState,
  type NutritionPlanState,
} from '../../api/nutrition';
import { getPet } from '../../api/pets';
import { getPetTracking } from '../../api/subscriptions';
import type { NutritionAiProposal, NutritionAiStatus, NutritionPlan, PetProfile } from '../../api/types';
import { LanguageProvider } from '../../providers/language-provider';
import { NutritionPlanScreen, planView, type PlanView } from '.';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockParams(),
  router: { push: jest.fn(), back: jest.fn(), canGoBack: jest.fn(() => false), replace: jest.fn() },
}));
jest.mock('../../api/nutrition', () => ({
  ...jest.requireActual('../../api/nutrition'),
  getNutritionPlan: jest.fn(),
  generateNutritionPlan: jest.fn(),
}));
jest.mock('../../api/pets', () => ({ getPet: jest.fn() }));
jest.mock('../../api/subscriptions', () => ({
  ...jest.requireActual('../../api/subscriptions'),
  getPetTracking: jest.fn(),
}));
jest.mock('../../providers/auth-provider', () => ({
  useAuth: () => ({ token: 'jwt-token', status: 'authenticated', signOut: mockSignOut }),
}));
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));
jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens,
}));
jest.mock('reicon-react-native', () => {
  const { View } = jest.requireActual('react-native');
  const icon = (testID: string) =>
    function MockIcon({ color, size }: { color?: string; size?: number }) {
      return <View testID={testID} style={{ color }} {...{ size }} />;
    };

  return {
    ChevronLeft: icon('nutrition-plan-icon-back'),
    Calendar: icon('nutrition-plan-icon-calendar'),
    InfoCircle: icon('nutrition-plan-icon-info'),
    Sparkles: icon('nutrition-plan-icon-sparkles'),
  };
});

const mockParams = jest.fn<{ petId: string; aiStatus?: string }, []>(() => ({ petId: 'pet-1' }));
const mockSignOut = jest.fn();
const mockGetNutritionPlan = jest.mocked(getNutritionPlan);
const mockGenerateNutritionPlan = jest.mocked(generateNutritionPlan);
const mockGetPet = jest.mocked(getPet);
const mockGetPetTracking = jest.mocked(getPetTracking);
const mockRouter = jest.mocked(router);

const PROPOSAL: NutritionAiProposal = {
  mealGrams: [{ mealTime: '08:00', grams: 112 }, { mealTime: '13:00', grams: 98 }, { mealTime: '18:00', grams: 110 }],
  recommendations: ['Pasea 10 minutos más por la mañana.', 'Mide la ración con una báscula.'],
  reviewDate: '2027-01-01',
};

function makePet(overrides: Partial<PetProfile> = {}): PetProfile {
  return {
    id: 'pet-1', name: 'Rocky', species: 'dog', myRole: 'owner', breed: null, sex: null,
    birthDate: null, approxAgeMonths: 30, ageMonths: 30, currentWeightKg: 12.4, size: null,
    color: null, sterilized: null, microchip: null, photoUrl: null, lostMode: false,
    lastPosition: null, lastCommunicationAt: null, device: null, nextVaccine: null,
    nextReminder: null, activitySummary: null, mealsToday: null,
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', ...overrides,
  };
}
function makePlan(overrides: Partial<NutritionPlan> = {}): NutritionPlan {
  return {
    id: 'plan-1', petId: 'pet-1', rerKcal: 410, merKcal: 656, dailyGrams: 350, mealsPerDay: 3,
    mealTimes: ['08:00', '13:00', '18:00'], objective: 'maintenance', warnings: [],
    aiExplanation: null, aiProposal: null, generatedAt: '2026-08-23T12:00:00.000Z',
    servedToday: [], kcalConsumedToday: 0, ...overrides,
  };
}
function planWithoutProposalKey(): NutritionPlan {
  const plan = makePlan();
  delete plan.aiProposal;
  return plan;
}
function planState(overrides: Partial<NutritionPlan> = {}): NutritionPlanState {
  return { kind: 'ok', plan: makePlan(overrides) };
}
async function renderPlan(language: 'es' | 'en' = 'es') {
  return language === 'es'
    ? renderWithProviders(<HeroUINativeProvider><LanguageProvider initial="es"><NutritionPlanScreen /></LanguageProvider></HeroUINativeProvider>)
    : renderWithProviders(<HeroUINativeProvider><LanguageProvider initial="en"><NutritionPlanScreen /></LanguageProvider></HeroUINativeProvider>);
}
function todayAt(hours: number, minutes: number): Date {
  const g = new Date();
  g.setHours(hours, minutes, 0, 0);
  return g;
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1/';
  mockParams.mockReturnValue({ petId: 'pet-1' });
  mockRouter.canGoBack.mockReturnValue(false);
  mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
  mockGetPetTracking.mockResolvedValue({ kind: 'ok', tracked: true });
  mockGetNutritionPlan.mockResolvedValue({ kind: 'ok', plan: makePlan() });
});

describe('#215 R4: carga, error con reintento y plan inexistente', () => {
  it('#215 R4: esqueleto mientras carga', async () => {
    mockGetNutritionPlan.mockReturnValue(new Promise(() => undefined));
    await renderPlan();
    expect(await screen.findByTestId('nutrition-plan-skeleton')).toBeVisible();
    expect(screen.queryByTestId('nutrition-plan-meals')).toBeNull();
  });

  it.each<[string, NutritionPlanState]>([
    ['error', { kind: 'error' }],
    ['unreachable', { kind: 'unreachable', message: 'x' }],
    ['unauthorized', { kind: 'unauthorized' }],
    ['missing-config', { kind: 'missing-config' }],
  ])('#215 R4: error %s con reintento', async (_kind, state) => {
    mockGetNutritionPlan.mockResolvedValue(state);
    await renderPlan();
    expect(await screen.findByTestId('nutrition-plan-load-error')).toHaveTextContent('Algo salió mal', { exact: true });
    const retry = screen.getByTestId('nutrition-plan-retry');
    expect(retry).toHaveTextContent('Reintentar', { exact: true });
    await fireEvent.press(retry);
    expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2);
  });

  it('#215 R4: sin plan', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' });
    await renderPlan();
    expect(await screen.findByTestId('nutrition-plan-empty')).toHaveTextContent('Aún no hay plan de alimentación', { exact: true });
    expect(screen.queryByTestId('nutrition-plan-badge')).toBeNull();
    expect(screen.queryByTestId('nutrition-plan-meals')).toBeNull();
    expect(screen.queryByTestId('nutrition-plan-footer')).toBeNull();
  });
});

describe('#215 R5: cabecera «Plan de <nombre>» con vuelta a Horario', () => {
  it.each<['es' | 'en', string]>([
    ['es', 'Plan de Rocky'],
    ['en', "Rocky's plan"],
  ])('#215 R5: título en %s', async (language, title) => {
    await renderPlan(language);
    expect(await screen.findByTestId('nutrition-plan-header-title')).toHaveTextContent(title, { exact: true });
  });

  it('#215 R5: volver sin historial va a Horario', async () => {
    await renderPlan();
    await fireEvent.press(await screen.findByTestId('nutrition-plan-header-back'));
    expect(mockRouter.replace).toHaveBeenCalledWith('/meal-schedule');
  });

  it('#215 R5: sin mascota no hay título', async () => {
    mockGetPet.mockResolvedValue({ kind: 'error' });
    await renderPlan();
    await screen.findByTestId('nutrition-plan-meals');
    expect(screen.queryByText(/^Plan de/)).toBeNull();
    expect(screen.queryByTestId('nutrition-plan-header-title')).toBeNull();
  });
});

describe('#215 R6: insignia IA (hoy / fecha) y del motor', () => {
  it.each<[string, () => Date, 'es' | 'en', string]>([
    ['hoy en es', () => todayAt(10, 20), 'es', 'Ajustado con IA · hoy, 10:20'],
    ['hoy en en', () => todayAt(10, 20), 'en', 'Adjusted with AI · today, 10:20'],
    ['fin de año en es', () => new Date(2025, 11, 31, 18, 5), 'es', 'Ajustado con IA · 31 dic 2025, 18:05'],
    ['fin de año en en', () => new Date(2025, 11, 31, 18, 5), 'en', 'Adjusted with AI · Dec 31, 2025, 18:05'],
    ['año nuevo en es', () => new Date(2026, 0, 1, 7, 0), 'es', 'Ajustado con IA · 1 ene 2026, 07:00'],
    ['año nuevo en en', () => new Date(2026, 0, 1, 7, 0), 'en', 'Adjusted with AI · Jan 1, 2026, 07:00'],
    ['febrero en es', () => new Date(2026, 1, 28, 9, 30), 'es', 'Ajustado con IA · 28 feb 2026, 09:30'],
  ])('#215 R6: insignia %s', async (_row, generatedAt, language, text) => {
    mockGetNutritionPlan.mockResolvedValue(planState({ aiProposal: PROPOSAL, generatedAt: generatedAt().toISOString() }));
    await renderPlan(language);
    const badge = await screen.findByTestId('nutrition-plan-badge');
    expect(within(badge).getByTestId('nutrition-plan-badge-text')).toHaveTextContent(text, { exact: true });
    const sparkles = within(badge).getByTestId('nutrition-plan-icon-sparkles');
    expect(sparkles).toHaveProp('size', 14);
    expect(sparkles.props.style).toEqual({ color: 'category-violet-strong' });
  });

  it.each<[string, { aiStatus?: string }]>([
    ['motor', {}],
    ['sin collar', { aiStatus: 'not_tracked' }],
    ['descartada', { aiStatus: 'rejected' }],
    ['límite', { aiStatus: 'limit_reached' }],
  ])('#215 R6: insignia del motor en la vista %s', async (_view, params) => {
    mockParams.mockReturnValue({ petId: 'pet-1', ...params });
    await renderPlan();
    const badge = await screen.findByTestId('nutrition-plan-badge');
    expect(within(badge).getByTestId('nutrition-plan-badge-text')).toHaveTextContent('Plan calculado · 350 g al día', { exact: true });
    expect(within(badge).queryByTestId('nutrition-plan-icon-sparkles')).toBeNull();
  });
});

describe('#215 R7: tarjeta de comidas, «antes» y total', () => {
  it('#215 R7: filas de la IA', async () => {
    mockGetNutritionPlan.mockResolvedValue(planState({ aiProposal: PROPOSAL }));
    await renderPlan();
    const meals = await screen.findByTestId('nutrition-plan-meals');
    expect(within(meals).getAllByTestId(/^nutrition-plan-row-\d+$/).map(row => row.props.testID)).toEqual(['nutrition-plan-row-0', 'nutrition-plan-row-1', 'nutrition-plan-row-2']);
    const expected: [string, string][] = [['08:00', '112 g'], ['13:00', '98 g'], ['18:00', '110 g']];
    expected.forEach(([mealTime, grams], index) => {
      const row = within(meals).getByTestId(`nutrition-plan-row-${index}`);
      expect(within(row).getByText(mealTime)).toBeVisible();
      expect(within(row).getByTestId(`nutrition-plan-grams-${index}`)).toHaveTextContent(grams, { exact: true });
      expect(within(row).getByTestId(`nutrition-plan-before-${index}`)).toHaveTextContent('antes 117 g', { exact: true });
    });
    const total = within(meals).getByTestId('nutrition-plan-total');
    expect(within(total).getByText('Total')).toBeVisible();
    expect(within(total).getByTestId('nutrition-plan-total-grams')).toHaveTextContent('320 g al día', { exact: true });
  });

  it('#215 R7: filas del motor', async () => {
    await renderPlan();
    const meals = await screen.findByTestId('nutrition-plan-meals');
    expect(within(meals).getAllByTestId(/^nutrition-plan-row-\d+$/)).toHaveLength(3);
    expect(within(meals).getAllByTestId(/^nutrition-plan-grams-\d+$/).map(node => node)).toHaveLength(3);
    [0, 1, 2].forEach(index => {
      expect(within(meals).getByTestId(`nutrition-plan-grams-${index}`)).toHaveTextContent('117 g', { exact: true });
    });
    expect(screen.queryAllByTestId(/^nutrition-plan-before-\d+$/)).toEqual([]);
    expect(within(meals).getByTestId('nutrition-plan-total-grams')).toHaveTextContent('350 g al día', { exact: true });
  });

  it('#215 R7: una fila por hora', async () => {
    mockGetNutritionPlan.mockResolvedValue(planState({ mealTimes: ['07:30', '19:30'], mealsPerDay: 2, dailyGrams: 187 }));
    await renderPlan();
    const meals = await screen.findByTestId('nutrition-plan-meals');
    expect(within(meals).getAllByTestId(/^nutrition-plan-row-\d+$/).map(row => row.props.testID)).toEqual(['nutrition-plan-row-0', 'nutrition-plan-row-1']);
    expect(within(meals).getByTestId('nutrition-plan-row-0')).toHaveTextContent('07:30', { exact: false });
    expect(within(meals).getByTestId('nutrition-plan-row-1')).toHaveTextContent('19:30', { exact: false });
    expect(within(meals).getByTestId('nutrition-plan-grams-0')).toHaveTextContent('94 g', { exact: true });
    expect(within(meals).getByTestId('nutrition-plan-grams-1')).toHaveTextContent('94 g', { exact: true });
    expect(within(meals).getByTestId('nutrition-plan-total-grams')).toHaveTextContent('187 g al día', { exact: true });
  });
});

describe('#215 R8: sección «Por qué cambié sus porciones» con el parser de #224 R1', () => {
  it.each([
    ['Intro:\n- uno\n- dos', 'Intro:\nuno\ndos'],
    ['- Mide **300 g** al día', 'Mide 300 g al día'],
  ])('#215 R8: texto plano de %p', async (aiExplanation, plain) => {
    mockGetNutritionPlan.mockResolvedValue(planState({ aiProposal: PROPOSAL, aiExplanation }));
    await renderPlan();
    const why = await screen.findByTestId('nutrition-plan-why');
    expect(within(why).getByText('Por qué cambié sus porciones')).toHaveProp('accessibilityRole', 'header');
    expect(within(why).getByTestId('nutrition-plan-why-text').props.children).toBe(plain);
  });

  it.each<[string, Partial<NutritionPlan>]>([
    ['con aiExplanation null', { aiExplanation: null, aiProposal: PROPOSAL }],
    ['con aiExplanation vacío', { aiExplanation: '', aiProposal: PROPOSAL }],
    ['en la vista motor', { aiExplanation: 'Texto', aiProposal: null }],
  ])('#215 R8: sin sección %s', async (_row, overrides) => {
    mockGetNutritionPlan.mockResolvedValue(planState(overrides));
    await renderPlan();
    await screen.findByTestId('nutrition-plan-meals');
    expect(screen.queryByTestId('nutrition-plan-why')).toBeNull();
    expect(screen.queryByText('Por qué cambié sus porciones')).toBeNull();
  });
});

describe('#215 R9: recomendaciones numeradas', () => {
  it('#215 R9: lista numerada', async () => {
    mockGetNutritionPlan.mockResolvedValue(planState({ aiProposal: PROPOSAL }));
    await renderPlan();
    const title = await screen.findByTestId('nutrition-plan-recommendations-title');
    expect(title).toHaveTextContent('Recomendaciones', { exact: true });
    expect(title).toHaveProp('accessibilityRole', 'header');
    const list = screen.getByTestId('nutrition-plan-recommendations');
    const items = within(list).getAllByTestId(/^nutrition-plan-recommendation-\d+$/);
    expect(items.map(item => item.props.testID)).toEqual(['nutrition-plan-recommendation-0', 'nutrition-plan-recommendation-1']);
    expect(within(items[0]).getByText('1')).toBeVisible();
    expect(within(items[0]).getByText('Pasea 10 minutos más por la mañana.')).toBeVisible();
    expect(within(items[1]).getByText('2')).toBeVisible();
    expect(within(items[1]).getByText('Mide la ración con una báscula.')).toBeVisible();
  });

  it.each<[string, Partial<NutritionPlan>]>([
    ['con la lista vacía', { aiProposal: { ...PROPOSAL, recommendations: [] } }],
    ['en la vista motor', { aiProposal: null }],
  ])('#215 R9: sin recomendaciones %s', async (_row, overrides) => {
    mockGetNutritionPlan.mockResolvedValue(planState(overrides));
    await renderPlan();
    await screen.findByTestId('nutrition-plan-meals');
    expect(screen.queryByTestId('nutrition-plan-recommendations-title')).toBeNull();
    expect(screen.queryByTestId('nutrition-plan-recommendations')).toBeNull();
  });
});

describe('#215 R10: próxima revisión y aviso', () => {
  it.each<[string, string, 'es' | 'en', string]>([
    ['2026-12-31 en es', '2026-12-31', 'es', 'Próxima revisión: 31 dic 2026'],
    ['2026-12-31 en en', '2026-12-31', 'en', 'Next review: Dec 31, 2026'],
    ['2027-01-01 en es', '2027-01-01', 'es', 'Próxima revisión: 1 ene 2027'],
    ['2027-01-01 en en', '2027-01-01', 'en', 'Next review: Jan 1, 2027'],
    ['2027-05-05 en es', '2027-05-05', 'es', 'Próxima revisión: 5 may 2027'],
    ['2027-05-05 en en', '2027-05-05', 'en', 'Next review: May 5, 2027'],
  ])('#215 R10: revisión %s', async (_row, reviewDate, language, text) => {
    mockGetNutritionPlan.mockResolvedValue(planState({ aiProposal: { ...PROPOSAL, reviewDate } }));
    await renderPlan(language);
    expect(await screen.findByTestId('nutrition-plan-review')).toHaveTextContent(text, { exact: true });
  });

  it('#215 R10: fecha inválida', async () => {
    mockGetNutritionPlan.mockResolvedValue(planState({ aiProposal: { ...PROPOSAL, reviewDate: '2027-13-01' } }));
    await renderPlan();
    expect(await screen.findByTestId('nutrition-plan-disclaimer')).toHaveTextContent('Es una sugerencia y no sustituye la opinión de su veterinario.', { exact: true });
    expect(screen.queryByTestId('nutrition-plan-review')).toBeNull();
  });

  it('#215 R10: el motor no avisa', async () => {
    await renderPlan();
    await screen.findByTestId('nutrition-plan-meals');
    expect(screen.queryByTestId('nutrition-plan-review')).toBeNull();
    expect(screen.queryByTestId('nutrition-plan-disclaimer')).toBeNull();
  });

  it('#215 R10: aviso en inglés', async () => {
    mockGetNutritionPlan.mockResolvedValue(planState({ aiProposal: PROPOSAL }));
    await renderPlan('en');
    expect(await screen.findByTestId('nutrition-plan-disclaimer')).toHaveTextContent("It's a suggestion and doesn't replace their vet's advice.", { exact: true });
  });
});

describe('#215 R11: planView, precedencia de vistas', () => {
  const withProposal = makePlan({ aiProposal: PROPOSAL });
  const withoutProposal = makePlan();

  it.each<[number, NutritionPlan, NutritionAiStatus | null, boolean | null, PlanView]>([
    [1, withoutProposal, 'limit_reached', true, 'limit'],
    [2, withProposal, 'limit_reached', true, 'limit'],
    [3, withoutProposal, 'rejected', true, 'rejected'],
    [4, withoutProposal, 'not_tracked', true, 'no-collar'],
    [5, withProposal, 'not_tracked', null, 'no-collar'],
    [6, withProposal, 'proposed', true, 'ai'],
    [7, withProposal, null, null, 'ai'],
    [8, withProposal, 'unavailable', true, 'ai'],
    [9, withoutProposal, null, false, 'no-collar'],
    [10, withoutProposal, 'unavailable', false, 'engine'],
    [11, withoutProposal, null, true, 'engine'],
    [12, withoutProposal, null, null, 'engine'],
    [13, planWithoutProposalKey(), null, true, 'engine'],
  ])('#215 R11: planView %s', (_row, plan, status, tracked, view) => {
    expect(planView(plan, status, tracked)).toBe(view);
  });
});

describe('#215 R12: vista sin collar y «Vincular collar»', () => {
  it.each<[string, () => void]>([
    ['el parámetro not_tracked', () => mockParams.mockReturnValue({ petId: 'pet-1', aiStatus: 'not_tracked' })],
    ['el collar sin seguimiento', () => mockGetPetTracking.mockResolvedValue({ kind: 'ok', tracked: false })],
  ])('#215 R12: sin collar por %s', async (_cause, arrange) => {
    arrange();
    await renderPlan();
    const note = await screen.findByTestId('nutrition-plan-note');
    expect(within(note).getByTestId('nutrition-plan-note-text')).toHaveTextContent('Para ajustar el plan con IA necesito la actividad de Rocky, y eso llega desde su collar. Mientras tanto, sigue con su plan calculado.', { exact: true });
    const info = within(note).getByTestId('nutrition-plan-icon-info');
    expect(info).toHaveProp('size', 20);
    expect(info.props.style).toEqual({ color: 'muted' });
    expect(screen.getByTestId('nutrition-plan-badge-text')).toHaveTextContent('Plan calculado · 350 g al día', { exact: true });
    expect(screen.getByTestId('nutrition-plan-grams-0')).toHaveTextContent('117 g', { exact: true });
    const pair = await screen.findByTestId('nutrition-plan-pair');
    expect(pair).toHaveTextContent('Vincular collar', { exact: true });
    await fireEvent.press(pair);
    expect(mockRouter.push).toHaveBeenCalledWith('/pairing');
    expect(screen.queryByTestId('nutrition-plan-request')).toBeNull();
  });

  it('#215 R12: nota en inglés', async () => {
    mockParams.mockReturnValue({ petId: 'pet-1', aiStatus: 'not_tracked' });
    await renderPlan('en');
    expect(await screen.findByTestId('nutrition-plan-note-text')).toHaveTextContent("To adjust the plan with AI I need Rocky's activity, and that comes from their collar. In the meantime, keep to their calculated plan.", { exact: true });
  });
});

describe('#215 R13: vista propuesta descartada', () => {
  it('#215 R13: propuesta descartada', async () => {
    mockParams.mockReturnValue({ petId: 'pet-1', aiStatus: 'rejected' });
    await renderPlan();
    expect(await screen.findByTestId('nutrition-plan-note-text')).toHaveTextContent('Esta vez la propuesta de la IA se salía de lo seguro para Rocky y no la apliqué. Sigue con su plan calculado, que está bien para él.', { exact: true });
    expect(screen.getByTestId('nutrition-plan-badge-text')).toHaveTextContent('Plan calculado · 350 g al día', { exact: true });
    expect(screen.getByTestId('nutrition-plan-grams-0')).toHaveTextContent('117 g', { exact: true });
    const request = await screen.findByTestId('nutrition-plan-request');
    expect(request).toHaveTextContent('Pedir otro plan', { exact: true });
    expect(request).toBeEnabled();
    expect(screen.queryByTestId('nutrition-plan-pair')).toBeNull();
  });

  it('#215 R13: nota en inglés', async () => {
    mockParams.mockReturnValue({ petId: 'pet-1', aiStatus: 'rejected' });
    await renderPlan('en');
    expect(await screen.findByTestId('nutrition-plan-note-text')).toHaveTextContent("This time the AI's proposal went beyond what's safe for Rocky, so I didn't apply it. Keep to their calculated plan, which is right for them.", { exact: true });
  });
});

describe('#215 R14: vista límite diario', () => {
  it('#215 R14: límite diario', async () => {
    mockParams.mockReturnValue({ petId: 'pet-1', aiStatus: 'limit_reached' });
    await renderPlan();
    const limit = await screen.findByTestId('nutrition-plan-limit');
    expect(limit).toHaveTextContent('Ya pediste 3 planes para Rocky hoy. Podrás pedir otro mañana.', { exact: true });
    expect(limit).toHaveProp('accessibilityLiveRegion', 'polite');
    const request = screen.getByTestId('nutrition-plan-request');
    expect(request).toHaveTextContent('Pedir otro plan', { exact: true });
    expect(request).toBeDisabled();
    const sparkles = within(request).getByTestId('nutrition-plan-icon-sparkles');
    expect(sparkles).toHaveProp('size', 18);
    expect(sparkles.props.style).toEqual({ color: 'muted' });
    expect(screen.getByTestId('nutrition-plan-badge-text')).toHaveTextContent('Plan calculado · 350 g al día', { exact: true });
    expect(screen.queryByTestId('nutrition-plan-note')).toBeNull();
  });

  it('#215 R14: límite en inglés', async () => {
    mockParams.mockReturnValue({ petId: 'pet-1', aiStatus: 'limit_reached' });
    await renderPlan('en');
    expect(await screen.findByTestId('nutrition-plan-limit')).toHaveTextContent("You've already asked for 3 plans for Rocky today. You can ask for another tomorrow.", { exact: true });
  });
});

describe('#215 R15: «Pedir otro plan», generate, estados y errores', () => {
  it.each<[string, Partial<NutritionPlan>, { aiStatus?: string }]>([
    ['ai', { aiProposal: PROPOSAL }, {}],
    ['engine', {}, {}],
    ['rejected', {}, { aiStatus: 'rejected' }],
  ])('#215 R15: botón habilitado en la vista %s', async (_view, overrides, params) => {
    mockParams.mockReturnValue({ petId: 'pet-1', ...params });
    mockGetNutritionPlan.mockResolvedValue(planState(overrides));
    await renderPlan();
    const request = await screen.findByTestId('nutrition-plan-request');
    expect(request).toHaveTextContent('Pedir otro plan', { exact: true });
    expect(request).toBeEnabled();
  });

  it('#215 R15: deshabilitado mientras espera', async () => {
    mockGenerateNutritionPlan.mockReturnValue(new Promise(() => undefined));
    await renderPlan();
    await fireEvent.press(await screen.findByTestId('nutrition-plan-request'));
    expect(mockGenerateNutritionPlan).toHaveBeenCalledWith('http://example.test/v1/', 'jwt-token', 'pet-1');
    expect(screen.getByTestId('nutrition-plan-request')).toBeDisabled();
  });

  it.each<[string, { aiStatus?: string }, GeneratePlanState, NutritionPlan, string, string]>([
    ['rejected', {}, { kind: 'ok', plan: makePlan(), aiStatus: 'rejected' }, makePlan(), 'nutrition-plan-note-text', 'Esta vez la propuesta de la IA se salía de lo seguro para Rocky y no la apliqué. Sigue con su plan calculado, que está bien para él.'],
    ['limit_reached', {}, { kind: 'ok', plan: makePlan(), aiStatus: 'limit_reached' }, makePlan(), 'nutrition-plan-limit', 'Ya pediste 3 planes para Rocky hoy. Podrás pedir otro mañana.'],
    ['ausente', { aiStatus: 'rejected' }, { kind: 'ok', plan: makePlan({ aiProposal: PROPOSAL }) }, makePlan({ aiProposal: PROPOSAL }), 'nutrition-plan-disclaimer', 'Es una sugerencia y no sustituye la opinión de su veterinario.'],
  ])('#215 R15: ok con aiStatus %s', async (_status, params, response, refreshed, afterTestId, afterText) => {
    mockParams.mockReturnValue({ petId: 'pet-1', ...params });
    mockGetNutritionPlan.mockResolvedValueOnce({ kind: 'ok', plan: makePlan() }).mockResolvedValueOnce({ kind: 'ok', plan: refreshed });
    mockGenerateNutritionPlan.mockResolvedValue(response);
    await renderPlan();
    expect(screen.queryByTestId(afterTestId)).toBeNull();
    await fireEvent.press(await screen.findByTestId('nutrition-plan-request'));
    expect(await screen.findByTestId(afterTestId)).toHaveTextContent(afterText, { exact: true });
    expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2);
  });

  it.each<[string, () => Promise<GeneratePlanState>, string]>([
    ['forbidden', () => Promise.resolve({ kind: 'forbidden' }), 'Solo el dueño puede generar el plan'],
    ['unprocessable NUTRITION_PROFILE_REQUIRED', () => Promise.resolve({ kind: 'unprocessable', code: 'NUTRITION_PROFILE_REQUIRED' }), 'Primero crea un perfil nutricional'],
    ['unprocessable PET_WEIGHT_REQUIRED', () => Promise.resolve({ kind: 'unprocessable', code: 'PET_WEIGHT_REQUIRED' }), 'Primero registra un peso'],
    ['unprocessable sin código', () => Promise.resolve({ kind: 'unprocessable', code: null }), 'Algo salió mal'],
    ['unreachable', () => Promise.resolve({ kind: 'unreachable', message: 'x' }), 'No se pudo conectar con el servidor'],
    ['error', () => Promise.resolve({ kind: 'error' }), 'Algo salió mal'],
    ['missing-config', () => Promise.resolve({ kind: 'missing-config' }), 'Algo salió mal'],
    ['con la promesa rechazada', () => Promise.reject(new Error('boom')), 'Algo salió mal'],
  ])('#215 R15: error %s', async (_result, generate, message) => {
    mockGenerateNutritionPlan.mockImplementation(generate);
    await renderPlan();
    await fireEvent.press(await screen.findByTestId('nutrition-plan-request'));
    expect(await screen.findByTestId('nutrition-plan-error')).toHaveTextContent(message, { exact: true });
  });

  it('#215 R15: sesión caducada', async () => {
    mockGenerateNutritionPlan.mockResolvedValue({ kind: 'unauthorized' });
    await renderPlan();
    await fireEvent.press(await screen.findByTestId('nutrition-plan-request'));
    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('nutrition-plan-error')).toBeNull();
  });

  it('#215 R15: el error se borra al reintentar', async () => {
    mockGenerateNutritionPlan.mockResolvedValueOnce({ kind: 'forbidden' }).mockResolvedValueOnce({ kind: 'ok', plan: makePlan() });
    await renderPlan();
    await fireEvent.press(await screen.findByTestId('nutrition-plan-request'));
    expect(await screen.findByTestId('nutrition-plan-error')).toHaveTextContent('Solo el dueño puede generar el plan', { exact: true });
    await fireEvent.press(screen.getByTestId('nutrition-plan-request'));
    await waitFor(() => expect(screen.queryByTestId('nutrition-plan-error')).toBeNull());
    expect(mockGenerateNutritionPlan).toHaveBeenCalledTimes(2);
  });
});

describe('#215 R16: rol family sin pie', () => {
  it.each<[string, Partial<NutritionPlan>, { aiStatus?: string }]>([
    ['IA', { aiProposal: PROPOSAL }, {}],
    ['sin collar', {}, { aiStatus: 'not_tracked' }],
    ['límite', {}, { aiStatus: 'limit_reached' }],
  ])('#215 R16: family no ve el pie en la vista %s', async (_view, overrides, params) => {
    mockParams.mockReturnValue({ petId: 'pet-1', ...params });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ myRole: 'family' }) });
    mockGetNutritionPlan.mockResolvedValue(planState(overrides));
    await renderPlan();
    expect(await screen.findByTestId('nutrition-plan-header-title')).toHaveTextContent('Plan de Rocky', { exact: true });
    await screen.findByTestId('nutrition-plan-meals');
    expect(screen.queryByTestId('nutrition-plan-footer')).toBeNull();
    expect(screen.queryByTestId('nutrition-plan-request')).toBeNull();
    expect(screen.queryByTestId('nutrition-plan-pair')).toBeNull();
    expect(screen.queryByTestId('nutrition-plan-limit')).toBeNull();
  });

  it('#215 R16: sin mascota no hay pie', async () => {
    mockGetPet.mockResolvedValue({ kind: 'error' });
    await renderPlan();
    await screen.findByTestId('nutrition-plan-meals');
    expect(screen.queryByTestId('nutrition-plan-footer')).toBeNull();
  });
});
