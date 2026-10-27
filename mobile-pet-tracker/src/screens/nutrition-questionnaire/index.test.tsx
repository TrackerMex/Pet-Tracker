import { act, fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { QueryClient } from '@tanstack/react-query';
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

const FOUR_TYPES = [
  ['dry', '350', 'Seco', 'Puse 350, lo habitual en alimento seco. Si la bolsa dice otro número, cámbialo: lo encuentras como energía metabolizable.'],
  ['wet', '90', 'Húmedo', 'Puse 90, lo habitual en alimento húmedo. Si la lata dice otro número, cámbialo: lo encuentras como energía metabolizable.'],
  ['mixed', '220', 'Mixto', 'Puse 220, un punto medio entre seco y húmedo. Si sabes el número exacto, cámbialo.'],
  ['homemade', '130', 'Casero', 'Puse 130, lo habitual en comida casera. Si tu receta tiene otro número, cámbialo.'],
] as const;

it.each(FOUR_TYPES)('#209 R11: %s precarga %s kcal y su nota', async (type, kcal, label, note) => {
  expect(FOUR_TYPES).toHaveLength(4);
  await goToFood(5);
  expect(screen.getByTestId('nutrition-questionnaire-bubble')).toHaveTextContent('¿Qué come Rocky? Con las calorías de su alimento calculo cuántos gramos servir en cada comida.', { exact: true });
  expect(screen.getByText('Calorías del alimento')).toBeVisible();
  const input = screen.getByTestId('kcal-input');
  expect(input).toHaveProp('keyboardType', 'number-pad');
  expect(input).toHaveProp('maxLength', 3);
  expect(screen.getByText('kcal / 100 g')).toBeVisible();
  expect(screen.getByText('Entre 80 y 600 kcal por cada 100 g.')).toBeVisible();
  expect(screen.queryByTestId('kcal-note')).toBeNull();
  const chip = screen.getByTestId(`food-type-${type}`);
  expect(chip).toHaveProp('accessibilityRole', 'radio');
  expect(chip).toHaveProp('accessibilityState', { checked: false });
  expect(within(chip).getByText(label)).toBeVisible();
  await fireEvent.press(chip);
  expect(screen.getByTestId(`food-type-${type}`)).toHaveProp('accessibilityState', { checked: true });
  expect(screen.getByTestId('kcal-input')).toHaveProp('value', kcal);
  expect(screen.getByTestId('kcal-note')).toHaveTextContent(note, { exact: true });
});
it('#209 R11: cambiar de tipo sobrescribe un valor editado', async () => {
  await goToFood(5);
  await fireEvent.press(screen.getByTestId('food-type-dry'));
  await fireEvent.changeText(screen.getByTestId('kcal-input'), '400');
  expect(screen.getByTestId('kcal-input')).toHaveProp('value', '400');
  await fireEvent.press(screen.getByTestId('food-type-wet'));
  expect(screen.getByTestId('kcal-input')).toHaveProp('value', '90');
  expect(screen.getByTestId('food-type-dry')).toHaveProp('accessibilityState', { checked: false });
  expect(screen.getByTestId('kcal-note')).toHaveTextContent(FOUR_TYPES[1][3], { exact: true });
});

it.each([['79', true], ['80', false], ['600', false], ['601', true], ['', true]] as const)('#209 R12: kcal «%s» desactiva Siguiente: %s', async (value, disabled) => {
  await goToFood(5);
  await fireEvent.press(screen.getByTestId('food-type-dry'));
  await fireEvent.changeText(screen.getByTestId('kcal-input'), value);
  if (disabled) expect(screen.getByTestId('nutrition-questionnaire-next')).toBeDisabled();
  else expect(screen.getByTestId('nutrition-questionnaire-next')).toBeEnabled();
});

const ALLERGY_CHIPS = [
  ['pollo', 'Pollo'], ['carne-de-res', 'Carne de res'], ['lacteos', 'Lácteos'], ['trigo', 'Trigo'],
  ['huevo', 'Huevo'], ['soya', 'Soya'], ['pescado', 'Pescado'], ['otra', 'Otra'],
] as const;
const DISEASE_CHIPS = [
  ['diabetes', 'Diabetes'], ['enfermedad-renal', 'Enfermedad renal'], ['pancreatitis', 'Pancreatitis'],
  ['enfermedad-hepatica', 'Enfermedad hepática'], ['problemas-digestivos', 'Problemas digestivos'],
  ['problemas-articulares', 'Problemas articulares'], ['otra', 'Otra'],
] as const;

async function goToHealth() {
  await goToFood(5);
  await fireEvent.press(screen.getByTestId('food-type-dry'));
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  expect(await screen.findByText('Alergias')).toBeVisible();
}

it('#209 R13: Salud pinta las dos listas con su copy y orden', async () => {
  await goToHealth();
  expect(screen.getByTestId('nutrition-questionnaire-bubble')).toHaveTextContent('¿Rocky tiene alguna alergia o enfermedad? Si no tiene ninguna, déjalo todo sin marcar.', { exact: true });
  expect(screen.getByText('Enfermedades')).toBeVisible();
  for (const [list, rows] of [['allergy', ALLERGY_CHIPS], ['disease', DISEASE_CHIPS]] as const) {
    const chips = screen.getAllByTestId(new RegExp(`^${list}-chip-`));
    expect(chips.map(chip => chip.props.testID)).toEqual(rows.map(([slug]) => `${list}-chip-${slug}`));
    rows.forEach(([, label], index) => {
      expect(chips[index]).toHaveProp('accessibilityRole', 'checkbox');
      expect(chips[index]).toHaveProp('accessibilityState', { checked: false });
      expect(within(chips[index]).getByText(label)).toBeVisible();
    });
  }
  expect(screen.getByTestId('nutrition-questionnaire-next')).toHaveTextContent('Guardar y generar plan');
  expect(screen.getByTestId('nutrition-questionnaire-step-label')).toHaveTextContent('4 de 4', { exact: true });
  await fireEvent.press(screen.getByTestId('allergy-chip-pollo'));
  expect(screen.getByTestId('allergy-chip-pollo')).toHaveProp('accessibilityState', { checked: true });
  await fireEvent.press(screen.getByTestId('allergy-chip-pollo'));
  expect(screen.getByTestId('allergy-chip-pollo')).toHaveProp('accessibilityState', { checked: false });
});
it.each(['allergy', 'disease'] as const)('#209 R13: marcar Otra en %s muestra ¿Cuál? y el contador pasa de 0/40 a 7/40', async list => {
  await goToHealth();
  expect(screen.queryByTestId(`${list}-other-input`)).toBeNull();
  expect(screen.queryByText('¿Cuál?')).toBeNull();
  await fireEvent.press(screen.getByTestId(`${list}-chip-otra`));
  expect(screen.getByText('¿Cuál?')).toBeVisible();
  expect(screen.getByTestId(`${list}-other-count`)).toHaveTextContent('0/40', { exact: true });
  expect(screen.getByTestId(`${list}-other-input`)).toHaveProp('maxLength', 40);
  await fireEvent.changeText(screen.getByTestId(`${list}-other-input`), 'Maíz ok');
  expect(screen.getByTestId(`${list}-other-count`)).toHaveTextContent('7/40', { exact: true });
});

function putBody(): Record<string, unknown> {
  const call = fetchSpy.mock.calls.find(([, init]) => (init as RequestInit | undefined)?.method === 'PUT');
  expect(call).toBeDefined();
  return JSON.parse(String((call?.[1] as RequestInit).body)) as Record<string, unknown>;
}
async function saveFromFood() {
  await fireEvent.press(screen.getByTestId('food-type-dry'));
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  expect(await screen.findByText('Alergias')).toBeVisible();
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
}

it('#209 R14: condición 5 omite targetWeightKg aunque se hubiera escrito antes', async () => {
  await goToTarget(7);
  await fireEvent.changeText(screen.getByTestId('target-weight-input'), '10');
  await fireEvent.press(screen.getByTestId('target-weight-change'));
  await fireEvent.press(await screen.findByTestId('bcs-option-5'));
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  expect(await screen.findByText('Tipo de alimento')).toBeVisible();
  await saveFromFood();
  const body = putBody();
  expect(body).toEqual({ activityLevel: 'medium', bodyCondition: 5, foodType: 'dry', kcalPer100g: 350, allergies: [], diseases: [] });
  expect(body).not.toHaveProperty('targetWeightKg');
});
it('#209 R14: condición 7 con peso vacío omite targetWeightKg', async () => {
  await goToFood(7);
  await saveFromFood();
  const body = putBody();
  expect(body).toHaveProperty('bodyCondition', 7);
  expect(body).not.toHaveProperty('targetWeightKg');
});
it('#209 R14: condición 7 con «10,5» envía targetWeightKg 10.5', async () => {
  await goToTarget(7);
  await fireEvent.changeText(screen.getByTestId('target-weight-input'), '10,5');
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  expect(await screen.findByText('Tipo de alimento')).toBeVisible();
  await saveFromFood();
  expect(putBody()).toEqual({ activityLevel: 'medium', bodyCondition: 7, targetWeightKg: 10.5, foodType: 'dry', kcalPer100g: 350, allergies: [], diseases: [] });
});
it('#209 R14: Otra con «  Maíz  » añade «Maíz» tras las etiquetas marcadas', async () => {
  await goToHealth();
  await fireEvent.press(screen.getByTestId('allergy-chip-huevo'));
  await fireEvent.press(screen.getByTestId('allergy-chip-otra'));
  await fireEvent.changeText(screen.getByTestId('allergy-other-input'), '  Maíz  ');
  await fireEvent.press(screen.getByTestId('allergy-chip-pollo'));
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  const body = putBody();
  expect(body.allergies).toEqual(['Pollo', 'Huevo', 'Maíz']);
  expect(body.diseases).toEqual([]);
});
it('#209 R14: Otra con solo espacios no añade nada', async () => {
  await goToHealth();
  await fireEvent.press(screen.getByTestId('disease-chip-diabetes'));
  await fireEvent.press(screen.getByTestId('disease-chip-otra'));
  await fireEvent.changeText(screen.getByTestId('disease-other-input'), '   ');
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  expect(putBody().diseases).toEqual(['Diabetes']);
});
it('#209 R14: con 21 alergias conservadas envía 20', async () => {
  const kept = Array.from({ length: 21 }, (_, index) => `Alergia conservada ${String(index + 1).padStart(2, '0')} ${'a'.repeat(30)}`);
  expect(kept.every(text => text.length > 40 && text.length <= 100)).toBe(true);
  storedProfile = makeProfile({ allergies: kept });
  await renderQuestionnaire();
  await screen.findByTestId('activity-option-medium');
  for (const legend of ['¿Cómo está su cuerpo?', 'Peso objetivo', 'Tipo de alimento', 'Alergias']) {
    await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
    expect(await screen.findByText(legend)).toBeVisible();
  }
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  const body = putBody();
  expect(body.allergies).toEqual(kept.slice(0, 20));
  expect(body.allergies).toHaveLength(20);
});

async function goToHealthPreloaded() {
  await renderQuestionnaire();
  await screen.findByTestId('activity-option-medium');
  for (const legend of ['¿Cómo está su cuerpo?', 'Peso objetivo', 'Tipo de alimento', 'Alergias']) {
    await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
    expect(await screen.findByText(legend)).toBeVisible();
  }
}

it('#209 R15: con perfil existente precarga actividad, condición, peso, alimento y kcal', async () => {
  storedProfile = makeProfile();
  await renderQuestionnaire();
  expect(await screen.findByTestId('activity-option-medium')).toHaveProp('accessibilityState', { checked: true });
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  expect(await screen.findByTestId('bcs-option-7')).toHaveProp('accessibilityState', { checked: true });
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  expect(await screen.findByTestId('target-weight-input')).toHaveProp('value', '10.5');
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  expect(await screen.findByTestId('food-type-wet')).toHaveProp('accessibilityState', { checked: true });
  expect(screen.getByTestId('kcal-input')).toHaveProp('value', '110');
});
it('#209 R15: «Pollo» marca su chip y «Maíz» rellena Otra', async () => {
  storedProfile = makeProfile({ allergies: ['Pollo', 'Maíz'] });
  await goToHealthPreloaded();
  expect(screen.getByTestId('allergy-chip-pollo')).toHaveProp('accessibilityState', { checked: true });
  expect(screen.getByTestId('allergy-chip-otra')).toHaveProp('accessibilityState', { checked: true });
  expect(screen.getByTestId('allergy-other-input')).toHaveProp('value', 'Maíz');
  expect(screen.getByTestId('allergy-other-count')).toHaveTextContent('4/40', { exact: true });
  expect(screen.getByTestId('disease-chip-otra')).toHaveProp('accessibilityState', { checked: false });
});
it('#209 R15: con bodyCondition null Siguiente de Condición está desactivado', async () => {
  storedProfile = makeProfile({ bodyCondition: null, targetWeightKg: null });
  await renderQuestionnaire();
  await screen.findByTestId('activity-option-medium');
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  expect(await screen.findByText('¿Cómo está su cuerpo?')).toBeVisible();
  expect(screen.getByTestId('bcs-option-7')).toHaveProp('accessibilityState', { checked: false });
  expect(screen.getByTestId('nutrition-questionnaire-next')).toBeDisabled();
});

function deferred() {
  let resolve!: (value: Response) => void;
  const promise = new Promise<Response>(done => { resolve = done; });
  return { promise, resolve };
}
function holdRequests() {
  const put = deferred();
  const generate = deferred();
  const base = fetchSpy.getMockImplementation() as typeof fetch;
  fetchSpy.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
    if (init?.method === 'PUT') return put.promise;
    if (String(input).endsWith('/nutrition-plan/generate')) return generate.promise;
    return base(input, init);
  });
  return { put, generate };
}
async function saveFromHealth() {
  await goToHealth();
  const held = holdRequests();
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  expect(await screen.findByTestId('nutrition-generating')).toBeVisible();
  return held;
}
const ROW_IN_PROGRESS = 'text-15 font-extrabold text-foreground';
const ROW_DONE = 'text-15 font-bold text-foreground';
const ROW_PENDING = 'text-15 font-semibold text-muted';
function rowClass(label: string) {
  return within(screen.getByTestId('nutrition-generating-steps')).getByText(label).props.className as string;
}

it('#209 R16: con PUT en vuelo pinta Generando con Perfil guardado en curso', async () => {
  await saveFromHealth();
  expect(screen.queryByTestId('nutrition-questionnaire-next')).toBeNull();
  expect(screen.getByTestId('nutrition-generating-ring-0', { includeHiddenElements: true })).toBeOnTheScreen();
  expect(screen.getByTestId('nutrition-generating-ring-1', { includeHiddenElements: true })).toBeOnTheScreen();
  expect(screen.getByTestId('nutrition-generating-pingo', { includeHiddenElements: true })).toBeOnTheScreen();
  expect(screen.getByText('Preparando el plan de Rocky')).toBeVisible();
  expect(screen.getByText('Estoy calculando sus calorías y el reparto de sus comidas. Tarda unos segundos.')).toBeVisible();
  expect(screen.getByTestId('nutrition-generating-steps')).toHaveProp('accessibilityLiveRegion', 'polite');
  expect(rowClass('Perfil guardado')).toBe(ROW_IN_PROGRESS);
  expect(rowClass('Calculando calorías')).toBe(ROW_PENDING);
  expect(rowClass('Repartiendo comidas')).toBe(ROW_PENDING);
});
it('#209 R16: tras PUT ok marca Perfil guardado hecho y Calculando en curso', async () => {
  const { put } = await saveFromHealth();
  await act(async () => { put.resolve(response(200, makeProfile())); });
  await waitFor(() => expect(rowClass('Perfil guardado')).toBe(ROW_DONE));
  expect(rowClass('Calculando calorías')).toBe(ROW_IN_PROGRESS);
  expect(rowClass('Repartiendo comidas')).toBe(ROW_PENDING);
  expect(mockRouter.back).not.toHaveBeenCalled();
});
it('#209 R16: generate ok invalida perfil y plan y vuelve atrás', async () => {
  const invalidate = jest.spyOn(QueryClient.prototype, 'invalidateQueries');
  const { put, generate } = await saveFromHealth();
  await act(async () => { put.resolve(response(200, makeProfile())); });
  await waitFor(() => expect(rowClass('Calculando calorías')).toBe(ROW_IN_PROGRESS));
  expect(mockRouter.back).not.toHaveBeenCalled();
  await act(async () => { generate.resolve(response(200, { id: 'plan-1', petId: 'pet-1' })); });
  await waitFor(() => expect(mockRouter.back).toHaveBeenCalledTimes(1));
  expect(invalidate).toHaveBeenCalledWith({ queryKey: ['nutrition', 'profile', 'pet-1'] });
  expect(invalidate).toHaveBeenCalledWith({ queryKey: ['nutrition', 'plan', 'pet-1'] });
  invalidate.mockRestore();
});
it('#209 R16: con movimiento reducido no pinta anillos', async () => {
  mockUseReducedMotion.mockReturnValue(true);
  await saveFromHealth();
  expect(screen.queryByTestId('nutrition-generating-ring-0', { includeHiddenElements: true })).toBeNull();
  expect(screen.queryByTestId('nutrition-generating-ring-1', { includeHiddenElements: true })).toBeNull();
  expect(screen.getByTestId('nutrition-generating-pingo', { includeHiddenElements: true })).toBeOnTheScreen();
});

// [petición, resultado, texto es literal ('' = signOut sin texto), status (null = fetch rechaza), cuerpo]
const ERROR_ROWS: [string, string, string, number | null, unknown][] = [
  ['PUT', 'invalid', 'Algo salió mal', 400, {}],
  ['PUT', 'forbidden', 'Solo el dueño puede generar el plan', 403, {}],
  ['PUT', 'unreachable', 'No se pudo conectar con el servidor', null, null],
  ['PUT', 'error', 'Algo salió mal', 500, {}],
  ['generate', 'forbidden', 'Solo el dueño puede generar el plan', 403, {}],
  ['generate', 'unprocessable PET_WEIGHT_REQUIRED', 'Primero registra un peso', 422, { code: 'PET_WEIGHT_REQUIRED' }],
  ['generate', 'unprocessable NUTRITION_PROFILE_REQUIRED', 'Algo salió mal', 422, { code: 'NUTRITION_PROFILE_REQUIRED' }],
  ['generate', 'unreachable', 'No se pudo conectar con el servidor', null, null],
  ['PUT', 'unauthorized', '', 401, {}],
];

it.each(ERROR_ROWS)('#209 R17: %s %s pinta «%s»', async (request, _result, text, status, body) => {
  const invalidate = jest.spyOn(QueryClient.prototype, 'invalidateQueries');
  await goToHealth();
  await fireEvent.press(screen.getByTestId('allergy-chip-pollo'));
  const base = fetchSpy.getMockImplementation() as typeof fetch;
  fetchSpy.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
    const target = init?.method === 'PUT' ? 'PUT' : String(input).endsWith('/nutrition-plan/generate') ? 'generate' : null;
    if (target !== request) return base(input, init);
    return status === null ? Promise.reject(new TypeError('Network request failed')) : Promise.resolve(response(status, body));
  });
  await fireEvent.press(screen.getByTestId('nutrition-questionnaire-next'));
  expect(await screen.findByTestId('nutrition-questionnaire-next')).toBeVisible();
  expect(screen.getByTestId('nutrition-questionnaire-step-label')).toHaveTextContent('4 de 4', { exact: true });
  expect(screen.getByTestId('allergy-chip-pollo')).toHaveProp('accessibilityState', { checked: true });
  expect(screen.queryAllByTestId('nutrition-questionnaire-error').map(node => [node.props.className, node.props.children])).toEqual(text === '' ? [] : [['text-danger', text]]);
  expect(mockSignOut).toHaveBeenCalledTimes(text === '' ? 1 : 0);
  expect(invalidate.mock.calls.some(([filters]) => JSON.stringify(filters?.queryKey) === '["nutrition","profile","pet-1"]')).toBe(request === 'generate');
  expect(mockRouter.back).not.toHaveBeenCalled();
  invalidate.mockRestore();
});
