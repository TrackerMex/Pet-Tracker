import { type ReactNode } from 'react';
import { Text } from 'react-native';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { renderWithProviders } from '../../../test/render-with-providers';
import { listPets } from '../../api/pets';
import { createVaccine, getVaccineCatalog } from '../../api/health-records';
import { createReminder } from '../../api/reminders';
import { getMe } from '../../api/users';
import type { PetProfile, Vaccine, VaccineCatalogEntry } from '../../api/types';
import { LanguageProvider } from '../../providers/language-provider';
import { TOUCH_SLOP } from '../../theme/touch-target';

import VaccineCreateRoute from '../../app/pets/[petId]/vaccines/new';
import { VaccineCreateScreen } from '.';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ petId: 'pet-1' }),
  router: { push: jest.fn(), back: jest.fn(), canGoBack: jest.fn(), replace: jest.fn() },
}));

it('#208 R4: la ruta pasa el petId de la URL a la pantalla', () => {
  const element = VaccineCreateRoute();
  expect(element.type).toBe(VaccineCreateScreen);
  expect(element.props).toEqual({ petId: 'pet-1' });
});

let mockInsets = { top: 40, bottom: 34, left: 0, right: 0 };
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => mockInsets,
}));
jest.mock('../../providers/auth-provider', () => ({
  useAuth: () => ({ token: 'jwt-token', status: 'authenticated', signOut: jest.fn() }),
}));
jest.mock('../../api/pets', () => ({ listPets: jest.fn() }));
jest.mock('../../api/health-records', () => ({ getVaccineCatalog: jest.fn(), createVaccine: jest.fn() }));
jest.mock('../../api/users', () => ({ getMe: jest.fn() }));
jest.mock('../../api/reminders', () => ({ createReminder: jest.fn() }));
jest.mock('../../theme/use-theme-colors', () => ({ useThemeColors: (tokens: string[]) => tokens.map(token => `token:${token}`) }));
jest.mock('@expo/ui', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { Host: ({ children }: { children: ReactNode }) => React.createElement(View, null, children) };
});
jest.mock('@expo/ui/community/datetime-picker', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return function MockDateTimePicker(props: Record<string, unknown>) { return React.createElement(View, props); };
});

const mockListPets = jest.mocked(listPets);
const mockCatalog = jest.mocked(getVaccineCatalog);
const mockCreateVaccine = jest.mocked(createVaccine);
const mockCreateReminder = jest.mocked(createReminder);
const mockGetMe = jest.mocked(getMe);
const mockRouter = jest.mocked(router);
const nativeProcess = process.getBuiltinModule('process');
const originalZone = nativeProcess.env.TZ;
const apiUrl = 'http://example.test/v1';
const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
const flatVaccineStyle = (style: unknown) => Object.assign({}, ...[style].flat(Infinity));

function makePet(overrides: Partial<PetProfile> = {}): PetProfile {
  return {
    id: 'pet-1', name: 'Rocky', species: 'dog', myRole: 'owner', breed: null, sex: null,
    birthDate: null, approxAgeMonths: 30, ageMonths: 30, currentWeightKg: 12, size: null,
    color: null, sterilized: null, microchip: null, photoUrl: null, lostMode: false,
    lastPosition: null, lastCommunicationAt: null, device: null, nextVaccine: null,
    nextReminder: null, activitySummary: null, mealsToday: null,
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', ...overrides,
  };
}
const catalog: VaccineCatalogEntry[] = [
  ['cat-lepto', 'Leptospirosis'], ['cat-dhppi', 'Polivalente (DHPPi)'],
  ['cat-rabia', 'Rabia'], ['cat-tos', 'Tos de las perreras'],
].map(([id, name]) => ({ id, name, species: 'dog', scheme: { firstDoseMonths: 3, boosterMonths: 12 } }));
function makeVaccine(overrides: Partial<Vaccine> = {}): Vaccine {
  return { id: 'vaccine-1', petId: 'pet-1', catalogId: 'cat-lepto', name: 'Leptospirosis',
    appliedAt: '2026-10-06', nextDoseAt: '2027-10-06', vetName: null, clinic: null,
    notes: null, documentKey: null, ...overrides };
}
function pending<T>(): Promise<T> { return new Promise(() => undefined); }
async function renderVaccineCreate() {
  return renderWithProviders(<VaccineCreateScreen petId="pet-1" />, {
    wrapper: ({ children }) => <HeroUINativeProvider><LanguageProvider initial="es">{children}</LanguageProvider></HeroUINativeProvider>,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers({ now: new Date('2026-10-06T18:00:00.000Z') });
  mockInsets = { top: 40, bottom: 34, left: 0, right: 0 };
  process.env.EXPO_PUBLIC_API_URL = apiUrl;
  mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  mockCatalog.mockResolvedValue({ kind: 'ok', entries: catalog });
  mockCreateVaccine.mockReturnValue(pending());
  mockCreateReminder.mockResolvedValue({ kind: 'ok', reminder: { id: 'reminder-1', petId: 'pet-1', type: 'vaccine', title: 'Leptospirosis', dueAt: '2027-10-06T09:00:00.000Z', advanceMinutes: 0, status: 'scheduled' } });
  mockGetMe.mockResolvedValue({ kind: 'ok', me: { id: 'user-1', email: 'a@example.test', firstName: 'Ana', lastName: 'A', phone: '', country: 'MX', timezone: 'America/Mexico_City', createdAt: '', updatedAt: '' } });
});
afterEach(() => {
  jest.useRealTimers();
  if (originalZone === undefined) delete nativeProcess.env.TZ;
  else nativeProcess.env.TZ = originalZone;
});

it('#208 R7: monta cabecera, leyenda y barra fija con las dimensiones del canvas', async () => {
  const app = await renderVaccineCreate();
  const header = await screen.findByTestId('vaccine-create-header');
  expect(readFileSync('src/screens/vaccine-create/index.tsx', 'utf8')).toMatch(/<KeyboardAvoidingView[^>]*behavior="padding"/);
  expect(screen.getByTestId('screen-vaccine-create').props.className).toBe('flex-1 bg-background');
  const scroll = screen.getByTestId('vaccine-create-form');
  expect(scroll.props.keyboardShouldPersistTaps).toBe('handled');
  expect(scroll.props.contentContainerStyle).toEqual({ paddingHorizontal: 20, paddingTop: 52, paddingBottom: 24, gap: 16 });
  expect(header.parent).toBe(screen.getByTestId('vaccine-create-legend').parent);
  expect(header.parent?.children.slice(0, 2).map(child => typeof child === 'string' ? child : child.props.testID)).toEqual(['vaccine-create-header', 'vaccine-create-legend']);
  expect(within(header).getByText('Agregar vacuna', { exact: true })).toBeVisible();
  expect(screen.getByTestId('vaccine-create-legend').props.className).toBe('text-sm font-extrabold text-foreground');
  expect(screen.getByTestId('vaccine-create-legend')).toHaveTextContent('Vacuna · esquema para perro', { exact: true });
  expect(screen.getByTestId('vaccine-create-legend-species').props.className).toBe('font-semibold text-muted');
  const bar = screen.getByTestId('vaccine-create-bar');
  expect(bar.props.style).toEqual({ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 34, gap: 12 });
  const last = bar.children.at(-1);
  expect(typeof last === 'string' ? null : last?.props.testID).toBe('vaccine-create-submit');
  mockInsets = { ...mockInsets, bottom: 0 };
  await app.rerender(<VaccineCreateScreen petId="pet-1" />);
  expect(screen.getByTestId('vaccine-create-bar').props.style).toEqual({ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, gap: 12 });
});
it('#208 R7: un gato ve «· esquema para gato»', async () => {
  mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ species: 'cat' })] });
  await renderVaccineCreate();
  await waitFor(() => expect(screen.getByTestId('vaccine-create-legend-species')).toHaveTextContent('· esquema para gato', { exact: true }));
});
