import { useSyncExternalStore, type ReactNode } from 'react';
import { Text } from 'react-native';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { renderWithProviders } from '../../../test/render-with-providers';
import { listPets } from '../../api/pets';
import { createVaccine, getVaccineCatalog, type CreateVaccineState } from '../../api/health-records';
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
const { readFileSync, existsSync } = jest.requireActual<typeof import('fs')>('fs');
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
let mockReturned = false;
const returnedListeners = new Set<() => void>();
function subscribeReturned(listener: () => void) {
  returnedListeners.add(listener);
  return () => { returnedListeners.delete(listener); };
}
function noticeApi() {
  expect(existsSync('src/hooks/vaccine-reminder-notice.ts')).toBe(true);
  return jest.requireActual<typeof import('../../hooks/vaccine-reminder-notice')>('../../hooks/vaccine-reminder-notice');
}
function clearVaccineReminderNotice() {
  if (existsSync('src/hooks/vaccine-reminder-notice.ts')) noticeApi().clearVaccineReminderNotice();
}
function VaccineNoticeProbe() {
  const { useVaccineReminderNotice } = noticeApi();
  const notice = useVaccineReminderNotice();
  return <Text testID="vaccine-create-notice-probe">{notice ?? ''}</Text>;
}
function VaccineFlow() {
  const returned = useSyncExternalStore(subscribeReturned, () => mockReturned);
  return <>
    {existsSync('src/hooks/vaccine-reminder-notice.ts') && <VaccineNoticeProbe />}
    {returned ? <Text testID="vaccine-create-returned">Salud</Text> : <VaccineCreateScreen petId="pet-1" />}
  </>;
}
async function renderVaccineCreate() {
  return renderWithProviders(<VaccineFlow />, {
    wrapper: ({ children }) => <HeroUINativeProvider><LanguageProvider initial="es">{children}</LanguageProvider></HeroUINativeProvider>,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  clearVaccineReminderNotice();
  mockReturned = false;
  mockRouter.back.mockImplementation(() => {
    mockReturned = true;
    for (const listener of returnedListeners) listener();
  });
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

jest.mock('reicon-react-native', () => {
  const actual = jest.requireActual('reicon-react-native');
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const icon = (testID: string) => function Icon(props: Record<string, unknown>) { return React.createElement(View, { ...props, testID }); };
  return { ...actual, Plus: icon('vaccine-create-plus-icon'), InfoCircle: icon('vaccine-create-info-icon'), Bell: icon('vaccine-create-bell-icon'), AlertTriangle: icon('vaccine-create-alert-icon') };
});

it('#208 R8: mientras carga pinta tres esqueletos de chip y ningún chip', async () => {
  mockCatalog.mockReturnValue(pending());
  await renderVaccineCreate();
  const skeleton = await screen.findByTestId('vaccine-create-chips-skeleton');
  expect(skeleton.children).toHaveLength(3);
  expect(skeleton.children.map(child => typeof child === 'string' ? child : child.props.className)).toEqual(Array(3).fill('skeleton__root h-9.5 w-28 rounded-full'));
  expect(screen.queryByTestId('vaccine-create-chips')).toBeNull();
  expect(screen.queryByTestId('vaccine-chip-other')).toBeNull();
});
it('#208 R8: pinta los chips en el orden de la API, preselecciona el primero y cierra con «Otra vacuna»', async () => {
  await renderVaccineCreate();
  const chips = await screen.findByTestId('vaccine-create-chips');
  expect(chips.props.className).toBe('flex-row flex-wrap gap-2');
  expect(chips.children.map(child => typeof child === 'string' ? child : child.props.testID)).toEqual(['vaccine-chip-cat-lepto', 'vaccine-chip-cat-dhppi', 'vaccine-chip-cat-rabia', 'vaccine-chip-cat-tos', 'vaccine-chip-other']);
  const first = screen.getByTestId('vaccine-chip-cat-lepto');
  expect(first.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-accent');
  expect(first.props.accessibilityRole).toBe('button');
  expect(first.props.accessibilityState).toEqual({ selected: true });
  expect(screen.getByTestId('vaccine-chip-cat-rabia').props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-default');
  const other = screen.getByTestId('vaccine-chip-other');
  expect(other.props.className).toBe('h-9.5 flex-row items-center justify-center gap-1.5 rounded-full border border-dashed border-border px-3.5 bg-surface');
  expect(within(other).getByText('Otra vacuna', { exact: true }).props.className).toBe('text-sm font-extrabold text-foreground');
  const plus = within(other).getByTestId('vaccine-create-plus-icon', { includeHiddenElements: true });
  expect([plus.props.size, plus.props.strokeWidth, plus.props.color]).toEqual([16, 2.8, 'token:foreground']);
  expect(mockCatalog).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'dog');
});
it('#208 R8: pulsar un chip lo selecciona con labio de tres y deselecciona el anterior', async () => {
  await renderVaccineCreate();
  const rabia = await screen.findByTestId('vaccine-chip-cat-rabia');
  expect(rabia.props.hitSlop).toEqual(TOUCH_SLOP);
  await fireEvent.press(rabia);
  expect(screen.getByTestId('vaccine-chip-cat-rabia').props.accessibilityState).toEqual({ selected: true });
  expect(flatVaccineStyle(screen.getByTestId('vaccine-chip-cat-rabia').props.style)).toMatchObject({ boxShadow: [{ offsetX: 0, offsetY: 3, blurRadius: 0, spreadDistance: 0, color: 'token:lip' }] });
  expect(screen.getByTestId('vaccine-chip-cat-lepto').props.accessibilityState).toEqual({ selected: false });
  expect(screen.getByTestId('vaccine-chip-cat-lepto').props.style).toBeUndefined();
  const other = screen.getByTestId('vaccine-chip-other');
  expect(other.props.hitSlop).toEqual(TOUCH_SLOP);
  await fireEvent.press(other);
  expect(screen.getByTestId('vaccine-chip-other').props.accessibilityState).toEqual({ selected: true });
  expect(within(screen.getByTestId('vaccine-chip-other')).getByTestId('vaccine-create-plus-icon', { includeHiddenElements: true }).props.color).toBe('token:accent-foreground');
  expect(within(screen.getByTestId('vaccine-chip-other')).getByText('Otra vacuna').props.className).toBe('text-sm font-extrabold text-accent-foreground');
});
it('#208 R8: con el catálogo en error solo queda «Otra vacuna» seleccionado', async () => {
  mockCatalog.mockResolvedValue({ kind: 'error' });
  await renderVaccineCreate();
  const chips = await screen.findByTestId('vaccine-create-chips');
  expect(chips.children).toHaveLength(1);
  expect(screen.getByTestId('vaccine-chip-other').props.accessibilityState).toEqual({ selected: true });
  expect(screen.queryByTestId('vaccine-create-chips-skeleton')).toBeNull();
});

it('#208 R9: «Otra vacuna» muestra nombre, contador 0/120 y lo actualiza a 13/120 con «Leishmaniasis»', async () => {
  await renderVaccineCreate();
  await fireEvent.press(await screen.findByTestId('vaccine-chip-other'));
  const name = await screen.findByTestId('vaccine-create-name');
  expect(screen.getByText('Nombre de la vacuna', { exact: true }).props.className).toBe('text-sm font-extrabold text-foreground');
  expect(name.props.maxLength).toBe(120);
  expect(name.props.style).toEqual({ borderCurve: 'continuous' });
  expect(screen.getByTestId('vaccine-create-name-count')).toHaveTextContent('0/120', { exact: true });
  expect(screen.getByTestId('vaccine-create-name-count').props.className).toBe('text-xs font-semibold text-muted');
  expect(screen.getByTestId('vaccine-create-name-count').props.style).toEqual({ fontVariant: ['tabular-nums'] });
  await fireEvent.changeText(name, 'Leishmaniasis');
  expect(screen.getByTestId('vaccine-create-name-count')).toHaveTextContent('13/120', { exact: true });
});
it('#208 R9: el borde del nombre pasa a border-accent con foco y vuelve a border-transparent al perderlo', async () => {
  await renderVaccineCreate();
  await fireEvent.press(await screen.findByTestId('vaccine-chip-other'));
  const name = await screen.findByTestId('vaccine-create-name');
  expect(name.props.className).toBe('h-13 rounded-xl bg-default px-3.5 text-15 font-semibold text-foreground border-2 border-transparent');
  await fireEvent(name, 'focus');
  expect(screen.getByTestId('vaccine-create-name').props.className).toBe('h-13 rounded-xl bg-default px-3.5 text-15 font-semibold text-foreground border-2 border-accent');
  await fireEvent(name, 'blur');
  expect(screen.getByTestId('vaccine-create-name').props.className).toBe('h-13 rounded-xl bg-default px-3.5 text-15 font-semibold text-foreground border-2 border-transparent');
});
it('#208 R9: con un chip del catálogo no hay campo de nombre ni contador', async () => {
  await renderVaccineCreate();
  await screen.findByTestId('vaccine-chip-cat-lepto');
  expect(screen.queryByTestId('vaccine-create-name')).toBeNull();
  expect(screen.queryByTestId('vaccine-create-name-count')).toBeNull();
});

async function pickVaccineDate(field: 'applied' | 'next', date: Date) {
  await fireEvent.press(screen.getByTestId(`vaccine-create-${field}`));
  await fireEvent(screen.getByTestId(`vaccine-create-${field}-picker`), 'onValueChange', {}, date);
  expect(screen.queryByTestId(`vaccine-create-${field}-picker`)).toBeNull();
}
async function readyVaccineForm() {
  const app = await renderVaccineCreate();
  await screen.findByTestId('vaccine-chip-cat-lepto');
  return app;
}
it('#208 R10: aplicación empieza hoy (6 oct 2026) con máximo hoy y la próxima dosis propone 6 oct 2027', async () => {
  await readyVaccineForm();
  expect(await screen.findByTestId('vaccine-create-applied-value')).toHaveProp('value', '6 oct 2026');
  expect(screen.getByTestId('vaccine-create-next-value')).toHaveProp('value', '6 oct 2027');
  const applied = screen.getByTestId('vaccine-create-applied');
  expect(applied.props.className).toBe('h-12 rounded-xl bg-default');
  await fireEvent.press(applied);
  expect(screen.getByTestId('vaccine-create-applied-picker').props.maximumDate).toEqual(new Date(2026, 9, 6, 12));
  await fireEvent(screen.getByTestId('vaccine-create-applied-picker'), 'onDismiss');
  await fireEvent.press(screen.getByTestId('vaccine-create-next'));
  expect(screen.getByTestId('vaccine-create-next-picker').props.minimumDate).toEqual(new Date(2026, 9, 6, 12));
});
it('#208 R10: cambiar la fecha de aplicación recalcula la propuesta', async () => {
  await readyVaccineForm();
  await pickVaccineDate('applied', new Date(2026, 8, 1, 12));
  expect(screen.getByTestId('vaccine-create-applied-value')).toHaveProp('value', '1 sep 2026');
  expect(screen.getByTestId('vaccine-create-next-value')).toHaveProp('value', '1 sep 2027');
});
it('#208 R10: una próxima dosis elegida a mano sobrevive al cambio de aplicación y cae al cambiar de chip', async () => {
  await readyVaccineForm();
  await pickVaccineDate('next', new Date(2028, 0, 12, 12));
  await pickVaccineDate('applied', new Date(2026, 8, 1, 12));
  expect(screen.getByTestId('vaccine-create-next-value')).toHaveProp('value', '12 ene 2028');
  await fireEvent.press(screen.getByTestId('vaccine-chip-cat-rabia'));
  expect(screen.getByTestId('vaccine-create-next-value')).toHaveProp('value', '1 sep 2027');
});
it('#208 R10: «Otra vacuna» deja la próxima dosis vacía y permite borrarla', async () => {
  await readyVaccineForm();
  expect(screen.queryByTestId('vaccine-create-next-clear')).toBeNull();
  await fireEvent.press(screen.getByTestId('vaccine-chip-other'));
  expect(screen.getByTestId('vaccine-create-next-value')).toHaveProp('value', '');
  expect(screen.getByTestId('vaccine-create-next-value')).toHaveProp('placeholder', 'Elige una fecha');
  expect(screen.queryByTestId('vaccine-create-next-clear')).toBeNull();
  await pickVaccineDate('next', new Date(2027, 9, 6, 12));
  await fireEvent.press(screen.getByTestId('vaccine-create-next-clear'), { stopPropagation: jest.fn() });
  expect(screen.getByTestId('vaccine-create-next-value')).toHaveProp('value', '');
});
it.each([['catálogo', 'la propuesta'], ['«Otra vacuna»', 'vacía']])('#208 R10: si la fecha de aplicación supera la próxima dosis elegida, con %s vuelve a %s', async (mode) => {
  await readyVaccineForm();
  if (mode === '«Otra vacuna»') await fireEvent.press(screen.getByTestId('vaccine-chip-other'));
  await pickVaccineDate('applied', new Date(2026, 8, 1, 12));
  await pickVaccineDate('next', new Date(2026, 8, 15, 12));
  await pickVaccineDate('applied', new Date(2026, 9, 1, 12));
  expect(screen.getByTestId('vaccine-create-next-value')).toHaveProp('value', mode === 'catálogo' ? '1 oct 2027' : '');
});

it('#208 R11: con catálogo la nota habla del esquema orientativo', async () => {
  await readyVaccineForm();
  const note = await screen.findByTestId('vaccine-create-note');
  expect(note.props.className).toBe('flex-row gap-2.5 rounded-tile bg-default px-3.5 py-3');
  expect(note.props.style).toEqual({ borderCurve: 'continuous' });
  const icon = within(note).getByTestId('vaccine-create-info-icon', { includeHiddenElements: true });
  expect([icon.props.size, icon.props.color]).toEqual([20, 'token:muted']);
  expect(screen.getByTestId('vaccine-create-note-text').props.className).toBe('flex-1 text-13 font-semibold text-muted');
  expect(screen.getByText('Propuse la próxima dosis con un esquema orientativo. Confírmala con el veterinario de Rocky.', { exact: true })).toBeVisible();
});
it('#208 R11: con «Otra vacuna» la nota dice que no propone fecha', async () => {
  await readyVaccineForm();
  await fireEvent.press(screen.getByTestId('vaccine-chip-other'));
  expect(await screen.findByTestId('vaccine-create-note-text')).toHaveTextContent('Esta vacuna no está en mi esquema, así que no propongo fecha. Pregúntale al veterinario de Rocky cuándo toca la siguiente.', { exact: true });
});

it('#208 R12: el recordatorio empieza marcado y avisa del 6 oct 2027 a las 09:00', async () => {
  await readyVaccineForm();
  const reminder = await screen.findByTestId('vaccine-create-reminder');
  expect(reminder.props.accessibilityRole).toBe('checkbox');
  expect(reminder.props.accessibilityState).toEqual({ checked: true });
  expect(reminder.props.className).toBe('flex-row items-center gap-3 rounded-tile bg-surface-secondary px-3.5 py-3');
  expect(reminder.props.style).toEqual({ borderCurve: 'continuous' });
  expect(screen.getByText('Recordarme la próxima dosis', { exact: true }).props.className).toBe('text-sm font-extrabold text-foreground');
  expect(screen.getByTestId('vaccine-create-reminder-hint').props.className).toBe('text-xs font-semibold text-muted');
  expect(screen.getByTestId('vaccine-create-reminder-hint')).toHaveTextContent('Te aviso el 6 oct 2027 a las 09:00.', { exact: true });
  expect(screen.getByTestId('vaccine-create-reminder-checkbox').props.accessibilityState).toMatchObject({ checked: true });
  const bell = within(reminder).getByTestId('vaccine-create-bell-icon', { includeHiddenElements: true });
  expect([bell.props.size, bell.props.color]).toEqual([20, 'token:accent-strong']);
});
it('#208 R12: sin próxima dosis el subtexto espera a la fecha', async () => {
  await readyVaccineForm();
  await fireEvent.press(screen.getByTestId('vaccine-chip-other'));
  expect(await screen.findByTestId('vaccine-create-reminder-hint')).toHaveTextContent('Cuando elijas la fecha, te aviso ese día a las 09:00.', { exact: true });
});
it('#208 R12: pulsar la tarjeta desmarca y vuelve a marcar', async () => {
  await readyVaccineForm();
  const reminder = await screen.findByTestId('vaccine-create-reminder');
  await fireEvent.press(reminder);
  expect(screen.getByTestId('vaccine-create-reminder').props.accessibilityState).toEqual({ checked: false });
  await fireEvent.press(reminder);
  expect(screen.getByTestId('vaccine-create-reminder').props.accessibilityState).toEqual({ checked: true });
  await fireEvent.press(screen.getByTestId('vaccine-create-reminder-checkbox'));
  expect(screen.getByTestId('vaccine-create-reminder').props.accessibilityState).toEqual({ checked: false });
});

it('#208 R13: veterinario, clínica y notas pintan etiquetas, placeholders y límites literales', async () => {
  await readyVaccineForm();
  for (const [id, label, limit] of [['vet', 'Veterinario', 120], ['clinic', 'Clínica', 120], ['notes', 'Notas', 2000]] as const) {
    const field = await screen.findByTestId(`vaccine-create-${id}`);
    expect(screen.getByText(label, { exact: true }).props.className).toBe('text-sm font-extrabold text-foreground');
    expect(field.props.maxLength).toBe(limit);
    expect(field.props.placeholderTextColor).toBe('token:muted');
    expect(field.props.style).toEqual({ borderCurve: 'continuous' });
  }
  const vet = screen.getByTestId('vaccine-create-vet');
  const clinic = screen.getByTestId('vaccine-create-clinic');
  expect(vet.props.placeholder).toBe('Opcional');
  expect(clinic.props.placeholder).toBe('Opcional');
  expect(vet.props.className).toBe('h-13 rounded-xl bg-default px-3.5 text-15 font-semibold text-foreground border-2 border-transparent');
  expect(clinic.props.className).toBe('h-13 rounded-xl bg-default px-3.5 text-15 font-semibold text-foreground border-2 border-transparent');
  expect(vet.parent?.props.className).toBe('flex-1 gap-1.5');
  expect(vet.parent?.parent?.props.className).toBe('flex-row gap-2.5');
  const notes = screen.getByTestId('vaccine-create-notes');
  expect(notes.props.multiline).toBe(true);
  expect(notes.props.textAlignVertical).toBe('top');
  expect(notes.props.placeholder).toBe('Lote, reacciones o lo que quieras recordar');
  expect(notes.props.className).toBe('h-16 rounded-xl bg-default px-3.5 text-15 font-semibold text-foreground border-2 border-transparent py-3');
});

it('#208 R14: guardar con Leptospirosis envía catalogId, fechas y opcionales recortados', async () => {
  await readyVaccineForm();
  const submit = screen.getByTestId('vaccine-create-submit');
  expect(submit.props.className).toContain('h-14 rounded-16 bg-accent');
  expect(flatVaccineStyle(submit.props.style)).toMatchObject({ boxShadow: [{ offsetX: 0, offsetY: 4, blurRadius: 0, spreadDistance: 0, color: 'token:lip' }] });
  expect(within(submit).getByText('Guardar vacuna', { exact: true }).props.className).toBe('text-17 font-extrabold text-accent-foreground');
  await pickVaccineDate('next', new Date(2028, 0, 12, 12));
  await fireEvent.changeText(screen.getByTestId('vaccine-create-vet'), '  Ana  ');
  await fireEvent.changeText(screen.getByTestId('vaccine-create-clinic'), '  Centro Vet  ');
  await fireEvent.changeText(screen.getByTestId('vaccine-create-notes'), '  Lote 15  ');
  await fireEvent.press(submit);
  await waitFor(() => expect(mockCreateVaccine).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1', { catalogId: 'cat-lepto', appliedAt: '2026-10-06', nextDoseAt: '2028-01-12', vetName: 'Ana', clinic: 'Centro Vet', notes: 'Lote 15' }));
});
it('#208 R14: guardar «Otra vacuna» sin próxima dosis envía name recortado y omite nextDoseAt y opcionales vacíos', async () => {
  await readyVaccineForm();
  await fireEvent.press(screen.getByTestId('vaccine-chip-other'));
  await fireEvent.changeText(screen.getByTestId('vaccine-create-name'), '  Leishmaniasis  ');
  for (const id of ['vet', 'clinic', 'notes']) await fireEvent.changeText(screen.getByTestId(`vaccine-create-${id}`), '   ');
  await fireEvent.press(screen.getByTestId('vaccine-create-submit'));
  await waitFor(() => expect(mockCreateVaccine).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1', { name: 'Leishmaniasis', appliedAt: '2026-10-06' }));
});
it('#208 R14: «Otra vacuna» en blanco pinta el error del nombre y no envía', async () => {
  await readyVaccineForm();
  await fireEvent.press(screen.getByTestId('vaccine-chip-other'));
  await fireEvent.changeText(screen.getByTestId('vaccine-create-name'), '   ');
  await fireEvent.press(screen.getByTestId('vaccine-create-submit'));
  expect(await screen.findByTestId('vaccine-create-name-message')).toHaveTextContent('Escribe el nombre de la vacuna.', { exact: true });
  expect(mockCreateVaccine).not.toHaveBeenCalled();
});
it('#208 R14: el CTA se bloquea mientras envía', async () => {
  await readyVaccineForm();
  await fireEvent.press(screen.getByTestId('vaccine-create-submit'));
  await waitFor(() => expect(screen.getByTestId('vaccine-create-submit')).toBeDisabled());
});

it('#208 R15: con próxima dosis futura crea el recordatorio vaccine a las 09:00 locales sin antelación', async () => {
  mockCreateVaccine.mockResolvedValue({ kind: 'ok', vaccine: makeVaccine({ name: 'Rabia' }) });
  await readyVaccineForm();
  await pickVaccineDate('next', new Date(2028, 0, 12, 12));
  await fireEvent.press(screen.getByTestId('vaccine-create-submit'));
  await screen.findByTestId('vaccine-create-returned');
  expect(mockCreateReminder).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1', { type: 'vaccine', title: 'Rabia', dueAt: new Date(2027, 9, 6, 9, 0, 0, 0).toISOString(), advanceMinutes: 0 });
});
it('#208 R15: el dueAt sigue la hora local del dispositivo', async () => {
  nativeProcess.env.TZ = 'America/Mexico_City';
  mockCreateVaccine.mockResolvedValue({ kind: 'ok', vaccine: makeVaccine() });
  await readyVaccineForm();
  await pickVaccineDate('next', new Date(2028, 0, 12, 12));
  await fireEvent.press(screen.getByTestId('vaccine-create-submit'));
  await screen.findByTestId('vaccine-create-returned');
  expect(mockCreateReminder).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1', { type: 'vaccine', title: 'Leptospirosis', dueAt: '2027-10-06T15:00:00.000Z', advanceMinutes: 0 });
});
it.each(['está desmarcado', 'la respuesta no trae próxima dosis', 'la próxima dosis es hoy'])('#208 R15: no crea recordatorio cuando %s', async reason => {
  mockCreateVaccine.mockResolvedValue({ kind: 'ok', vaccine: makeVaccine({ nextDoseAt: reason === 'la respuesta no trae próxima dosis' ? null : reason === 'la próxima dosis es hoy' ? '2026-10-06' : '2027-10-06' }) });
  await readyVaccineForm();
  if (reason === 'está desmarcado') await fireEvent.press(screen.getByTestId('vaccine-create-reminder'));
  await fireEvent.press(screen.getByTestId('vaccine-create-submit'));
  await screen.findByTestId('vaccine-create-returned');
  expect(mockCreateReminder).not.toHaveBeenCalled();
});
it('#208 R15: tras el 201 invalida vacunas, recordatorios y mascotas y vuelve', async () => {
  mockCreateVaccine.mockResolvedValue({ kind: 'ok', vaccine: makeVaccine() });
  const app = await readyVaccineForm();
  const invalidate = jest.spyOn(app.queryClient, 'invalidateQueries');
  await fireEvent.press(screen.getByTestId('vaccine-create-submit'));
  await screen.findByTestId('vaccine-create-returned');
  expect(invalidate).toHaveBeenCalledWith({ queryKey: ['health', 'vaccines', 'pet-1'] });
  expect(invalidate).toHaveBeenCalledWith({ queryKey: ['reminders', 'list', 'pet-1'] });
  expect(invalidate).toHaveBeenCalledWith({ queryKey: ['pets', 'list'] });
  expect(mockRouter.back).toHaveBeenCalledTimes(1);
});

it('#208 R16: si el recordatorio falla deja el aviso de la mascota y vuelve sin borrar la vacuna', async () => {
  noticeApi();
  const fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValue(new Error('unexpected request'));
  try {
    mockCreateVaccine.mockResolvedValue({ kind: 'ok', vaccine: makeVaccine() });
    mockCreateReminder.mockResolvedValue({ kind: 'error' });
    await readyVaccineForm();
    await fireEvent.press(screen.getByTestId('vaccine-create-submit'));
    await screen.findByTestId('vaccine-create-returned');
    expect(screen.getByTestId('vaccine-create-notice-probe')).toHaveTextContent('pet-1', { exact: true });
    expect(mockCreateVaccine).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls.some(([, init]) => init?.method === 'DELETE')).toBe(false);
  } finally { fetchSpy.mockRestore(); }
});
it('#208 R16: si el recordatorio se crea limpia un aviso anterior', async () => {
  noticeApi().showVaccineReminderNotice('pet-2');
  mockCreateVaccine.mockResolvedValue({ kind: 'ok', vaccine: makeVaccine() });
  await readyVaccineForm();
  expect(screen.getByTestId('vaccine-create-notice-probe')).toHaveTextContent('pet-2', { exact: true });
  await fireEvent.press(screen.getByTestId('vaccine-create-submit'));
  await screen.findByTestId('vaccine-create-returned');
  expect(screen.getByTestId('vaccine-create-notice-probe').children).toEqual([]);
});

async function fillCustomVaccine() {
  await fireEvent.press(screen.getByTestId('vaccine-chip-other'));
  await fireEvent.changeText(screen.getByTestId('vaccine-create-name'), 'Leishmaniasis');
  await pickVaccineDate('applied', new Date(2026, 8, 1, 12));
  await pickVaccineDate('next', new Date(2027, 8, 1, 12));
  await fireEvent.changeText(screen.getByTestId('vaccine-create-vet'), 'Ana');
  await fireEvent.changeText(screen.getByTestId('vaccine-create-clinic'), 'Centro Vet');
  await fireEvent.changeText(screen.getByTestId('vaccine-create-notes'), 'Sin reacción');
}
it.each(['error', 'unreachable', 'forbidden', 'unauthorized', 'missing-config'] as const)('#208 R17: %s pinta la alerta literal y conserva el formulario', async kind => {
  mockCreateVaccine.mockResolvedValue(kind === 'unreachable' ? { kind, message: 'offline' } : { kind });
  await readyVaccineForm();
  await fillCustomVaccine();
  await fireEvent.press(screen.getByTestId('vaccine-create-submit'));
  const error = await screen.findByTestId('vaccine-create-error');
  expect(error.props.accessibilityRole).toBe('alert');
  expect(error.props.className).toBe('flex-row items-center gap-2.5 rounded-tile px-3.5 py-3 bg-category-rose');
  expect(error.props.style).toEqual({ borderCurve: 'continuous' });
  expect(error.parent).toBe(screen.getByTestId('vaccine-create-bar'));
  expect(screen.getByTestId('vaccine-create-error-text').props.className).toBe('flex-1 text-13 font-bold text-danger');
  expect(screen.getByText('No pude guardar la vacuna. Tus datos siguen aquí; revisa tu conexión y vuelve a intentarlo.', { exact: true })).toBeVisible();
  const icon = within(error).getByTestId('vaccine-create-alert-icon', { includeHiddenElements: true });
  expect([icon.props.size, icon.props.color]).toEqual([20, 'token:danger']);
  expect(screen.getByTestId('vaccine-chip-other').props.accessibilityState).toEqual({ selected: true });
  expect(screen.getByTestId('vaccine-create-name')).toHaveProp('value', 'Leishmaniasis');
  expect(screen.getByTestId('vaccine-create-applied-value')).toHaveProp('value', '1 sep 2026');
  expect(screen.getByTestId('vaccine-create-next-value')).toHaveProp('value', '1 sep 2027');
  expect(screen.getByTestId('vaccine-create-vet')).toHaveProp('value', 'Ana');
  expect(screen.getByTestId('vaccine-create-clinic')).toHaveProp('value', 'Centro Vet');
  expect(screen.getByTestId('vaccine-create-notes')).toHaveProp('value', 'Sin reacción');
  expect(mockRouter.back).not.toHaveBeenCalled();
  expect(mockCreateReminder).not.toHaveBeenCalled();
});
it('#208 R17: reintentar con éxito vuelve a Salud', async () => {
  let finish: (value: CreateVaccineState) => void = () => undefined;
  const retry = new Promise<CreateVaccineState>(resolve => { finish = resolve; });
  mockCreateVaccine.mockResolvedValueOnce({ kind: 'error' }).mockReturnValueOnce(retry);
  await readyVaccineForm();
  await fireEvent.press(screen.getByTestId('vaccine-create-submit'));
  await screen.findByTestId('vaccine-create-error');
  await fireEvent.press(screen.getByTestId('vaccine-create-submit'));
  await waitFor(() => expect(screen.getByTestId('vaccine-create-submit')).toBeDisabled());
  expect(screen.queryByTestId('vaccine-create-error')).toBeNull();
  await act(async () => { finish({ kind: 'ok', vaccine: makeVaccine() }); });
  await screen.findByTestId('vaccine-create-returned');
  expect(mockCreateVaccine).toHaveBeenCalledTimes(2);
});

it('#208 R18: un 400 de appliedAt pinta el error de campo traducido', async () => {
  mockCreateVaccine.mockResolvedValue({ kind: 'validation', errors: [{ path: 'appliedAt', message: 'SERVER_FUTURE_PRIVATE' }] });
  await readyVaccineForm();
  await fireEvent.press(screen.getByTestId('vaccine-create-submit'));
  expect(await screen.findByTestId('vaccine-create-applied-message')).toHaveTextContent('La fecha de aplicación no puede ser futura.', { exact: true });
  expect(screen.getByTestId('vaccine-create-applied-value').props.className).toContain('android:border-danger');
  expect(screen.queryByText('SERVER_FUTURE_PRIVATE')).toBeNull();
  expect(mockRouter.back).not.toHaveBeenCalled();
  expect(mockCreateReminder).not.toHaveBeenCalled();
});
it('#208 R18: un 400 de otro campo pinta checkDetails y nunca el mensaje del servidor', async () => {
  mockCreateVaccine.mockResolvedValue({ kind: 'validation', errors: [{ path: 'clinic', message: 'SERVER_DETAILS_PRIVATE' }] });
  await readyVaccineForm();
  await fireEvent.press(screen.getByTestId('vaccine-create-submit'));
  const error = await screen.findByTestId('vaccine-create-error');
  expect(error).toHaveTextContent('Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.', { exact: true });
  expect(screen.queryByText('SERVER_DETAILS_PRIVATE')).toBeNull();
  expect(mockRouter.back).not.toHaveBeenCalled();
});
