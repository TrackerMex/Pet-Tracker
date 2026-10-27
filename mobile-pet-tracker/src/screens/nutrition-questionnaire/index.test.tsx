import { act, fireEvent, screen, within } from '@testing-library/react-native';
import { usePreventRemove } from 'expo-router/react-navigation';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { renderWithProviders } from '../../../test/render-with-providers';
import { getPet } from '../../api/pets';
import type { NutritionProfile, PetProfile } from '../../api/types';
import { LanguageProvider } from '../../providers/language-provider';
import { NutritionQuestionnaireScreen } from '.';

jest.mock('../../api/pets', () => ({ getPet: jest.fn() }));
jest.mock('../../providers/auth-provider', () => ({
  useAuth: () => ({ token: 'jwt-token', status: 'authenticated', signOut: mockSignOut }),
}));
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ petId: 'pet-1' }),
  router: { push: jest.fn(), back: jest.fn(), canGoBack: jest.fn(() => true), replace: jest.fn() },
}));
jest.mock('expo-router/react-navigation', () => ({
  ...jest.requireActual('expo-router/react-navigation'),
  __esModule: true,
  usePreventRemove: jest.fn(),
}));
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));
jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens.map(() => 'black'),
}));
jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: () => mockUseReducedMotion(),
}));

const mockSignOut = jest.fn();
const mockUseReducedMotion = jest.fn<boolean, []>(() => false);
const mockGetPet = jest.mocked(getPet);
const mockRouter = jest.mocked(router);
const mockPreventRemove = jest.mocked(usePreventRemove);
const apiUrl = 'http://example.test/v1';
let fetchSpy: jest.SpyInstance;
let storedProfile: NutritionProfile | null = null;

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
function makeProfile(overrides: Partial<NutritionProfile> = {}): NutritionProfile {
  return { petId: 'pet-1', activityLevel: 'medium', bodyCondition: 7, targetWeightKg: 10.5,
    foodType: 'wet', kcalPer100g: 110, allergies: [], diseases: [], updatedAt: '', ...overrides };
}
function response(status: number, body: unknown): Response {
  return { status, json: jest.fn().mockResolvedValue(body) } as unknown as Response;
}
async function renderQuestionnaire() {
  return renderWithProviders(<HeroUINativeProvider><LanguageProvider initial="es"><NutritionQuestionnaireScreen /></LanguageProvider></HeroUINativeProvider>);
}
beforeEach(() => {
  jest.clearAllMocks();
  process.env.EXPO_PUBLIC_API_URL = apiUrl;
  storedProfile = null;
  mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
  mockUseReducedMotion.mockReturnValue(false);
  fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(async (input, init) => {
    const url = String(input);
    if (url === 'http://example.test/v1/pets/pet-1/nutrition-profile') {
      if (init?.method === 'PUT') return response(200, makeProfile());
      return storedProfile ? response(200, storedProfile) : response(404, {});
    }
    if (url === 'http://example.test/v1/pets/pet-1/nutrition-plan/generate' && init?.method === 'POST') {
      return response(200, { id: 'plan-1', petId: 'pet-1' });
    }
    throw new Error(`Unexpected request ${init?.method ?? 'GET'} ${url}`);
  });
});
afterEach(() => {
  fetchSpy.mockRestore();
  mockUseReducedMotion.mockReturnValue(false);
});

const { existsSync, readFileSync } = jest.requireActual<typeof import('fs')>('fs');

it('#209 R3: la ruta nutrition-profile es delgada y está en el Stack', () => {
  const routePath = 'src/app/nutrition-profile.tsx';
  expect(existsSync(routePath)).toBe(true);
  const route = readFileSync(routePath, 'utf8');
  expect(route.trim().split('\n').length).toBeLessThan(10);
  expect(route.trim()).toBe("export { NutritionQuestionnaireScreen as default } from '../screens/nutrition-questionnaire';");
  const layout = readFileSync('src/app/_layout.tsx', 'utf8');
  expect(layout).toContain('<Stack.Screen name="nutrition-profile" options={{ headerShown: false }} />');
});

it('#209 R4: mientras carga pinta el esqueleto', async () => {
  mockGetPet.mockReturnValue(new Promise(() => undefined));
  await renderQuestionnaire();
  expect(await screen.findByTestId('nutrition-questionnaire-skeleton')).toBeVisible();
  expect(readFileSync('src/screens/nutrition-questionnaire/index.tsx', 'utf8')).not.toContain('<Spinner');
});
it('#209 R4: si la mascota falla pinta el error de carga', async () => {
  mockGetPet.mockResolvedValue({ kind: 'error' });
  await renderQuestionnaire();
  expect(await screen.findByTestId('nutrition-questionnaire-load-error')).toHaveTextContent('Algo salió mal', { exact: true });
});

it('#209 R5: pinta cabecera, contador «1 de 4» y la barra con un segmento hecho', async () => {
  await renderQuestionnaire();
  const header = await screen.findByTestId('nutrition-questionnaire');
  expect(within(header).getByText('Perfil nutricional')).toBeVisible();
  expect(screen.getByTestId('nutrition-questionnaire-title').props.className).toBe('text-24 font-black tracking-title text-foreground');
  expect(screen.getByTestId('nutrition-questionnaire-step-label')).toHaveTextContent('1 de 4', { exact: true });
  const bar = screen.getByTestId('nutrition-questionnaire-step-bar');
  expect(bar).toHaveProp('accessibilityRole', 'progressbar');
  expect(bar).toHaveProp('accessibilityValue', { min: 1, max: 4, now: 1 });
  expect(bar.children).toHaveLength(4);
  expect(bar.children.map(child => typeof child === 'string' ? child : child.props.className)).toEqual([
    'h-1.5 flex-1 rounded-full bg-accent',
    'h-1.5 flex-1 rounded-full bg-lip-gray',
    'h-1.5 flex-1 rounded-full bg-lip-gray',
    'h-1.5 flex-1 rounded-full bg-lip-gray',
  ]);
  expect(screen.getByTestId('nutrition-questionnaire-bubble')).toHaveTextContent('Cuéntame cómo es un día normal de Rocky. Con eso calculo cuánta energía necesita.', { exact: true });
});

it('#209 R7: Actividad pinta las tres opciones con su copy', async () => {
  await renderQuestionnaire();
  expect(await screen.findByText('¿Cuánto se mueve Rocky?')).toBeVisible();
  for (const [value, title, description] of [
    ['low', 'Baja', 'Paseos cortos y mucho descanso.'],
    ['medium', 'Media', 'Uno o dos paseos al día y algo de juego.'],
    ['high', 'Alta', 'Corre, entrena o juega con intensidad cada día.'],
  ]) {
    const card = screen.getByTestId(`activity-option-${value}`);
    expect(card).toHaveProp('accessibilityRole', 'radio');
    expect(card).toHaveProp('accessibilityState', { checked: false });
    expect(within(card).getByText(title)).toBeVisible();
    expect(within(card).getByText(description)).toBeVisible();
  }
});
it('#209 R7: Siguiente está desactivado hasta elegir actividad', async () => {
  await renderQuestionnaire();
  expect(await screen.findByTestId('nutrition-questionnaire-next')).toBeDisabled();
  await fireEvent.press(screen.getByTestId('activity-option-medium'));
  expect(screen.getByTestId('nutrition-questionnaire-next')).toBeEnabled();
  expect(screen.getByTestId('activity-option-medium')).toHaveProp('accessibilityState', { checked: true });
});

const NINE_ROWS = [
  [1, 'Muy delgado', 'Huesos muy visibles, sin grasa al tacto', 'blue'],
  [2, 'Delgado', 'Costillas y cadera se ven a simple vista', 'blue'],
  [3, 'Algo delgado', 'Costillas fáciles de sentir, cintura marcada', 'blue'],
  [4, 'Ideal, esbelto', 'Costillas se sienten con poca grasa', 'green'],
  [5, 'Ideal', 'Costillas se sienten y la cintura se ve', 'green'],
  [6, 'Algo de sobrepeso', 'Algo de grasa en costillas, poca cintura', 'amber'],
  [7, 'Sobrepeso', 'Costillas difíciles de sentir', 'amber'],
  [8, 'Obesidad', 'No se sienten las costillas ni la cintura', 'rose'],
  [9, 'Obesidad severa', 'Grasa abundante en cuello, lomo y vientre', 'rose'],
] as const;

async function goToCondition() {
  await renderQuestionnaire();
  await fireEvent.press(await screen.findByTestId('activity-option-medium'));
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
}

it.each(NINE_ROWS)('#209 R8: fila %i pinta «%s», «%s» y la banda %s', async (n, title, description, band) => {
  await goToCondition();
  const row = await screen.findByTestId(`bcs-option-${n}`);
  expect(row).toHaveProp('accessibilityRole', 'radio');
  expect(row).toHaveProp('accessibilityState', { checked: false });
  expect(within(row).getByText(title)).toBeVisible();
  expect(within(row).getByText(description)).toBeVisible();
  const [surface, ink] = {
    blue: ['bg-category-blue', 'text-category-blue-strong'],
    green: ['bg-category-green', 'text-category-green-strong'],
    amber: ['bg-category-amber', 'text-category-amber-strong'],
    rose: ['bg-category-rose', 'text-category-rose-strong'],
  }[band];
  const badge = screen.getByTestId(`bcs-badge-${n}`, { includeHiddenElements: true });
  expect(badge.props.className).toBe(`size-7.5 items-center justify-center rounded-10 ${surface}`);
  expect(within(badge).getByText(String(n), { includeHiddenElements: true }).props.className).toBe(`text-sm font-black ${ink}`);
  await fireEvent.press(row);
  expect(screen.getByTestId(`bcs-option-${n}`)).toHaveProp('accessibilityState', { checked: true });
});
it('#209 R8: Siguiente está desactivado hasta elegir condición', async () => {
  await goToCondition();
  expect(await screen.findByText('¿Cómo está su cuerpo?')).toBeVisible();
  expect(NINE_ROWS).toHaveLength(9);
  expect(screen.getByTestId('nutrition-questionnaire-bubble')).toHaveTextContent('Pasa la mano por el costado de Rocky y elige lo que más se parezca a lo que sientes.', { exact: true });
  expect(screen.getByTestId('nutrition-questionnaire-next')).toBeDisabled();
  await fireEvent.press(screen.getByTestId('bcs-option-5'));
  expect(screen.getByTestId('nutrition-questionnaire-next')).toBeEnabled();
});

it.each([[1, 'Alimento'], [6, 'Alimento'], [7, 'Peso objetivo'], [9, 'Peso objetivo']] as const)('#209 R9: con condición %i Siguiente va a %s', async (n, destination) => {
  await goToCondition();
  await fireEvent.press(await screen.findByTestId(`bcs-option-${n}`));
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  const legend = { Alimento: 'Tipo de alimento', 'Peso objetivo': 'Peso objetivo' }[destination];
  const other = { Alimento: 'Peso objetivo', 'Peso objetivo': 'Tipo de alimento' }[destination];
  expect(await screen.findByText(legend)).toBeVisible();
  expect(screen.queryByText(other)).toBeNull();
});

async function goToFood(n: number) {
  await goToCondition();
  await fireEvent.press(await screen.findByTestId(`bcs-option-${n}`));
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  if (n >= 7) await fireEvent.press(await screen.findByTestId('nutrition-questionnaire-next'));
  expect(await screen.findByText('Tipo de alimento')).toBeVisible();
}
async function pressBack() {
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-back'));
  expect(mockRouter.back).toHaveBeenCalled();
  const call = mockPreventRemove.mock.lastCall;
  expect(call?.[0]).toBe(true);
  await act(async () => call?.[1]({ data: { action: { type: 'GO_BACK' } } }));
}

it('#209 R6: Volver desde Alimento con condición 6 vuelve a Condición', async () => {
  await goToFood(6);
  await pressBack();
  expect(await screen.findByText('¿Cómo está su cuerpo?')).toBeVisible();
  expect(screen.queryByText('Tipo de alimento')).toBeNull();
  expect(screen.getByTestId('bcs-option-6')).toHaveProp('accessibilityState', { checked: true });
});
it('#209 R6: Volver desde Alimento con condición 7 vuelve a Peso objetivo', async () => {
  await goToFood(7);
  await pressBack();
  expect(await screen.findByText('Peso objetivo')).toBeVisible();
  expect(screen.queryByText('Tipo de alimento')).toBeNull();
  await pressBack();
  expect(await screen.findByText('¿Cómo está su cuerpo?')).toBeVisible();
  await pressBack();
  expect(await screen.findByText('¿Cuánto se mueve Rocky?')).toBeVisible();
  expect(mockPreventRemove.mock.lastCall?.[0]).toBe(false);
});

async function goToTarget(n: number) {
  await goToCondition();
  await fireEvent.press(await screen.findByTestId(`bcs-option-${n}`));
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  expect(await screen.findByText('Peso objetivo')).toBeVisible();
}

it('#209 R10: Peso objetivo pinta resumen, copy y contador «2 de 4»', async () => {
  await goToTarget(7);
  expect(screen.getByTestId('nutrition-questionnaire-bubble')).toHaveTextContent('Con condición 7 conviene que Rocky baje de peso poco a poco. ¿Te dijo el veterinario cuál es su peso ideal?', { exact: true });
  const summary = screen.getByTestId('target-weight-summary');
  expect(summary.props.className).toBe('flex-row items-center gap-2.5 rounded-16 bg-default px-3 py-2.5');
  const badge = within(summary).getByTestId('bcs-badge-summary', { includeHiddenElements: true });
  expect(badge.props.className).toBe('size-7.5 items-center justify-center rounded-10 bg-category-amber');
  expect(within(summary).getByText('Condición 7/9 · Sobrepeso')).toBeVisible();
  const change = within(summary).getByTestId('target-weight-change');
  expect(within(change).getByText('Cambiar').props.className).toBe('text-13 font-extrabold text-accent-strong');
  expect(screen.getByText('Opcional')).toBeVisible();
  const input = screen.getByTestId('target-weight-input');
  expect(input).toHaveProp('keyboardType', 'decimal-pad');
  expect(input).toHaveProp('maxLength', 6);
  expect(screen.getByText('kg')).toBeVisible();
  expect(screen.getByTestId('target-weight-current')).toHaveTextContent('Peso actual de Rocky: 12.4 kg', { exact: true });
  expect(screen.getByTestId('target-weight-note')).toHaveTextContent('Si aún no lo sabes, déjalo vacío: calculo con su peso actual y lo ajustas después.', { exact: true });
  expect(screen.getByTestId('nutrition-questionnaire-step-label')).toHaveTextContent('2 de 4', { exact: true });
  expect(screen.getByTestId('nutrition-questionnaire-step-bar')).toHaveProp('accessibilityValue', { min: 1, max: 4, now: 2 });
  expect(screen.getByTestId('nutrition-questionnaire-next')).toBeEnabled();
});
it('#209 R10: Cambiar vuelve a Condición', async () => {
  await goToTarget(7);
  await fireEvent.press(screen.getByTestId('target-weight-change'));
  expect(await screen.findByText('¿Cómo está su cuerpo?')).toBeVisible();
  expect(screen.queryByText('Peso objetivo')).toBeNull();
  expect(screen.getByTestId('bcs-option-7')).toHaveProp('accessibilityState', { checked: true });
});
it('#209 R10: sin currentWeightKg no pinta el peso actual', async () => {
  mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ currentWeightKg: null }) });
  await goToTarget(7);
  expect(screen.getByTestId('target-weight-input')).toBeVisible();
  expect(screen.queryByTestId('target-weight-current')).toBeNull();
});
it.each([['0', true], ['1000', true], ['12,345', true], ['', false], ['10,5', false]] as const)('#209 R10: peso «%s» desactiva Siguiente: %s', async (value, disabled) => {
  await goToTarget(7);
  await fireEvent.changeText(screen.getByTestId('target-weight-input'), value);
  if (disabled) expect(screen.getByTestId('nutrition-questionnaire-next')).toBeDisabled();
  else expect(screen.getByTestId('nutrition-questionnaire-next')).toBeEnabled();
});
