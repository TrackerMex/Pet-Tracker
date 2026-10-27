import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { router, useFocusEffect } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect, type ReactNode } from 'react';
import { Text } from 'react-native';

import { listPets } from '../../api/pets';
import { petKeys, reminderKeys } from '../../api/query-keys';
import {
  deleteReminder,
  listReminders,
  type DeleteReminderState,
  type RemindersState,
} from '../../api/reminders';
import type { PetProfile, Reminder } from '../../api/types';
import { es } from '../../i18n/catalog';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { SelectedPetProvider } from '../../providers/selected-pet-provider';
import * as selectedPetHooks from '../../providers/selected-pet-provider';
import { RemindersScreen } from '.';
import { renderWithProviders } from '../../../test/render-with-providers';

const flat = (s: unknown) => Object.assign({}, ...[s].flat(Infinity).filter(Boolean));


const mockRiseIn = jest.fn<void, [import('react-native').ViewProps & { delayMs: number }]>();

jest.mock('../../components/rise-in', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    RiseIn(props: import('react-native').ViewProps & { delayMs: number }) {
      mockRiseIn(props);
      return React.createElement(View, props);
    },
  };
});

jest.mock('../../components/pop-in', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    PopIn(props: import('react-native').ViewProps) {
      return React.createElement(View, props);
    },
  };
});

jest.mock('reicon-react-native', () => {
  const actual = jest.requireActual<typeof import('reicon-react-native')>('reicon-react-native');
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const mockIcon = (testID: string) =>
    function MockIcon(props: Record<string, unknown>) {
      return React.createElement(View, { testID, ...props });
    };
  return {
    ...actual,
    Plus: mockIcon('reminders-icon-plus'),
    Trash: mockIcon('reminders-icon-trash'),
    Syringe: mockIcon('reminders-icon-syringe'),
    Drop: mockIcon('reminders-icon-drop'),
    Pill: mockIcon('reminders-icon-pill'),
    Stethoscope: mockIcon('reminders-icon-stethoscope'),
    Weight: mockIcon('reminders-icon-weight'),
    ForkKnife: mockIcon('reminders-icon-fork-knife'),
    PinTack: mockIcon('reminders-icon-pin-tack'),
  };
});

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: jest.fn((tokens: string[]) => tokens.map((token) => `color:${token}`)),
}));

jest.mock('../../api/pets', () => ({
  listPets: jest.fn(),
}));

jest.mock('../../api/reminders', () => ({
  deleteReminder: jest.fn(),
  listReminders: jest.fn(),
}));

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@expo/ui/community/bottom-sheet', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    BottomSheet: ({
      children,
      index,
      ...props
    }: Record<string, unknown>) =>
      typeof index === 'number' && index >= 0
        ? React.createElement(
            View as unknown as React.ComponentType<Record<string, unknown>>,
            { ...props, index, testID: 'community-bottom-sheet' },
            children as never,
          )
        : null,
    BottomSheetView: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(View, props, children as never),
  };
});

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), canGoBack: jest.fn(), replace: jest.fn() },
  useFocusEffect: jest.fn(),
  useIsFocused: () => true,
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const apiUrl = 'http://example.test/v1';
const mockListPets = jest.mocked(listPets);
const mockListReminders = jest.mocked(listReminders);
const mockDeleteReminder = jest.mocked(deleteReminder);
const mockUseAuth = jest.mocked(useAuth);
const mockRouter = jest.mocked(router);
const mockUseFocusEffect = jest.mocked(useFocusEffect);

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

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

function makeReminder(overrides: Partial<Reminder> = {}): Reminder {
  return {
    id: 'reminder-1',
    petId: 'pet-1',
    type: 'vaccine',
    title: 'Rabies booster',
    dueAt: '2026-08-27T09:00:00.000Z',
    advanceMinutes: 10080,
    status: 'scheduled',
    ...overrides,
  };
}

const canvasReminders = [
  makeReminder({ id: 'a', type: 'vaccine', title: 'Refuerzo de rabia', dueAt: '2027-01-02T15:00:00.000Z', status: 'scheduled' }),
  makeReminder({ id: 'b', type: 'medication', title: 'Pastilla trimestral', dueAt: '2027-01-21T02:05:00.000Z', status: 'scheduled' }),
  makeReminder({ id: 'c', type: 'custom', title: 'Baño', dueAt: '2026-12-03T17:30:00.000Z', status: 'sent' }),
];
const hostProcess = process.getBuiltinModule('process');
const originalTimezone = hostProcess.env.TZ;

function RemindersWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial="es">
        <SelectedPetProvider>{children}</SelectedPetProvider>
      </LanguageProvider>
    </HeroUINativeProvider>
  );
}

async function renderReminders() {
  return renderWithProviders(<RemindersScreen />, {
    wrapper: RemindersWrapper,
  });
}

async function confirmDelete(reminderId: string) {
  await fireEvent.press(screen.getByTestId(`reminder-delete-${reminderId}`));
  const host = screen.getByTestId('reminders-delete-host');
  const sheet = within(host).getByTestId('community-bottom-sheet');

  expect(sheet.props).toEqual(
    expect.objectContaining({
      index: 0,
      onClose: expect.any(Function),
      enablePanDownToClose: true,
      snapPoints: ['50%', '100%'],
    }),
  );
  expect(sheet.props.isPresented).toBeUndefined();
  expect(within(sheet).getByTestId('reminders-delete-sheet')).toBeVisible();
  expect(screen.getByText('¿Eliminar recordatorio?')).toBeVisible();
  expect(screen.getByTestId('reminders-delete-reference')).toHaveTextContent(
    'Rabies booster',
  );
  expect(
    screen.getByTestId('reminders-delete-confirm').props.className,
  ).toContain('bg-danger');

  await fireEvent.press(screen.getByTestId('reminders-delete-confirm'));
}

async function focusScreen(): Promise<(() => void)[]> {
  let cleanups: (() => void)[] = [];

  await act(async () => {
    cleanups = mockUseFocusEffect.mock.calls.flatMap(([callback]) => {
      const cleanup = callback();
      return typeof cleanup === 'function' ? [cleanup] : [];
    });
    await Promise.resolve();
  });

  return cleanups;
}

async function blurScreen(cleanups: (() => void)[]) {
  await act(async () => {
    cleanups.forEach((cleanup) => cleanup());
    await Promise.resolve();
  });
}

describe('R5: reminders monta con métricas y estados', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  describe('#114 R5 (revertido por #178 R4): el título vive en el contenido', () => {
    it('deja Nuevo junto al título en carga y con filas (enmendado por #204 R4)', async () => {
      let resolveReminders!: (state: RemindersState) => void;
      mockListReminders.mockReturnValue(new Promise((resolve) => { resolveReminders = resolve; }));
      await renderReminders();

      await screen.findByTestId('reminders-loading');
      expect(screen.getByTestId('reminders-title')).toHaveTextContent(es['reminders.reminders']);
      const actions = screen.getByTestId('reminders');
      expect(actions.props.className).toBe('flex-row items-center gap-2'); // #178 R4
      expect(within(actions).getByTestId('reminders-add-link')).toBeVisible();

      await act(async () => resolveReminders({ kind: 'ok', reminders: [makeReminder()] }));
      await screen.findByTestId(`reminder-row-${makeReminder().id}`);
      expect(screen.getByTestId('reminders-title')).toHaveTextContent(es['reminders.reminders']);
      expect(screen.getByTestId('reminders-add-link')).toBeVisible();
    });
  });

  it('uses the metrics under the native header, selects the first pet, and shows row skeletons (#114 R6) (enmendado por #204 R4)', async () => {
    mockListReminders.mockReturnValue(pending<RemindersState>());

    await renderReminders();

    expect(screen.getByTestId('screen-reminders')).toBeVisible();
    expect(
      screen.getByTestId('screen-reminders').props.contentContainerStyle,
    ).toEqual({
      paddingHorizontal: 20,
      paddingTop: 52,
      gap: 14, // #178 R4
      paddingBottom: 48,
    });
    await waitFor(() =>
      expect(screen.getByTestId('pet-chip-pet-1').props.accessibilityState).toEqual({
        selected: true,
      }),
    );
    expect(screen.getByTestId('reminders-loading')).toBeVisible();
    expect(screen.getAllByTestId(/^reminder-row-skeleton-/)).toHaveLength(3);
    expect(mockListPets).toHaveBeenCalledWith(apiUrl, 'jwt-token');
    expect(mockListReminders).toHaveBeenCalledWith(
      apiUrl,
      'jwt-token',
      'pet-1',
    );
  });

  it('opens the add-reminder route', async () => {
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [] });

    await renderReminders();
    await fireEvent.press(screen.getByTestId('reminders-add-link'));

    expect(mockRouter.push).toHaveBeenCalledWith('/add-reminder');
  });

  it('shows the empty state', async () => {
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [] });

    await renderReminders();

    await waitFor(() =>
      expect(screen.getByTestId('reminders-empty-title')).toHaveTextContent(
        'Aún no hay recordatorios',
      ),
    );
  });

  it.each([
    { kind: 'error' } as const,
    { kind: 'unreachable', message: 'network down' } as const,
    { kind: 'missing-config' } as const,
    { kind: 'not-found' } as const,
  ])('shows and retries a $kind reminder-list error', async (state) => {
    mockListReminders
      .mockResolvedValueOnce(state)
      .mockResolvedValueOnce({ kind: 'ok', reminders: [] });

    await renderReminders();
    await waitFor(() =>
      expect(screen.getByTestId('reminders-error')).toHaveTextContent(
        'Algo salió mal',
      ),
    );
    await fireEvent.press(screen.getByTestId('reminders-retry'));

    await waitFor(() => expect(screen.getByTestId('reminders-empty')).toBeVisible());
    expect(mockListReminders).toHaveBeenCalledTimes(2);
  });

  it('changes pets and reloads reminders for the selection', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })],
    });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [] });

    await renderReminders();
    await waitFor(() => expect(screen.getByTestId('pet-chip-pet-2')).toBeVisible());
    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));

    await waitFor(() =>
      expect(mockListReminders).toHaveBeenCalledWith(
        apiUrl,
        'jwt-token',
        'pet-2',
      ),
    );
  });
});

describe('#178 R4: marco y título en contenido', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [makeReminder()] });
  });

  it('usa el marco 20/24/14 bajo la cabecera nativa (enmendado por #204 R4)', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-reminder-1');
    expect(screen.getByTestId('screen-reminders').props.contentContainerStyle).toEqual({
      paddingHorizontal: 20,
      paddingTop: 52,
      gap: 14,
      paddingBottom: 48,
    });
  });

  it('coloca título y Nuevo en ese orden dentro de la fila de acciones (enmendado por #204 R4)', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-reminder-1');
    const header = screen.getByTestId('reminders');
    expect(header.props.className).toBe('flex-row items-center gap-2');
    expect(header.children).toHaveLength(3);
    const [backSlot, column, add] = header.children;
    if (typeof backSlot === 'string' || typeof column === 'string' || typeof add === 'string') throw new Error('Expected element children');
    expect(backSlot.props.className).toBe('-ml-2.5');
    expect(within(backSlot).getByTestId('reminders-back')).toBeTruthy();
    expect(column.props.className).toBe('flex-1');
    expect(within(column).getByTestId('reminders-title')).toBeTruthy();
    expect(add.props.testID).toBe('reminders-add-link');
  });

  it('pinta Recordatorios como título accesible con la receta del canvas (enmendado por #204 R4)', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-reminder-1');
    const title = screen.getByTestId('reminders-title');
    expect(title).toHaveTextContent('Recordatorios');
    expect(title.props.accessibilityRole).toBe('header');
    expect(title.props.className).toBe('text-26 font-black tracking-title text-foreground');
  });

  it('pinta Nuevo compacto con Plus de 16 y tinta accent-foreground', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-reminder-1');
    const addLink = screen.getByTestId('reminders-add-link');
    expect(flat(addLink.props.style)).toMatchObject({ boxShadow: [{ offsetY: 3, color: 'color:lip' }] });
    expect(addLink.props.className).toContain('rounded-xl bg-accent h-10 gap-1.5 px-3.5');
    const icon = within(addLink).getByTestId('reminders-icon-plus', { includeHiddenElements: true });
    expect(icon.props.size).toBe(16);
    expect(icon.props.color).toBe('color:accent-foreground');
    expect(within(addLink).getByText('Nuevo')).toBeTruthy();
  });
});

describe('#178 R5: píldoras de resumen del canvas', () => {
  beforeAll(() => { hostProcess.env.TZ = 'America/Mexico_City'; });
  afterAll(() => {
    if (originalTimezone === undefined) delete hostProcess.env.TZ;
    else hostProcess.env.TZ = originalTimezone;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ now: new Date('2026-12-30T15:00:00.000Z') });
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: canvasReminders });
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('agrupa las tres píldoras en el orden activo, semana e inactivo', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    const pills = screen.getByTestId('reminders-pills');
    expect(pills.props.className).toBe('flex-row gap-2');
    expect(pills.children).toHaveLength(3);
    expect(pills.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual([
      'pill-active', 'pill-week', 'pill-inactive',
    ]);
  });

  it('pinta cada cifra y etiqueta con su radio, tinta y orden del canvas', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    const pills = screen.getByTestId('reminders-pills');
    const cases = [
      ['pill-active', 'flex-1 rounded-16 px-3 py-2.5 bg-surface-secondary', '2', 'Activos', 'text-2xl font-black text-accent-strong', 'text-xs font-bold text-muted'],
      ['pill-week', 'flex-1 rounded-16 px-3 py-2.5 bg-category-amber', '1', 'Esta semana', 'text-2xl font-black text-category-amber-strong', 'text-xs font-bold text-category-amber-strong'],
      ['pill-inactive', 'flex-1 rounded-16 px-3 py-2.5 bg-default', '1', 'Inactivos', 'text-2xl font-black text-muted', 'text-xs font-bold text-muted'],
    ] as const;
    for (const [testID, className, value, label, valueClass, labelClass] of cases) {
      const pill = within(pills).getByTestId(testID);
      expect(pill.props.className).toBe(className);
      expect(pill).toHaveStyle({ borderCurve: 'continuous' });
      expect(pill.children).toHaveLength(2);
      expect(pill.children[0]).toHaveTextContent(value);
      expect(pill.children[1]).toHaveTextContent(label);
      const number = within(pill).getByText(value);
      expect(number.props.className).toBe(valueClass);
      expect(number).toHaveStyle({ fontVariant: ['tabular-nums'] });
      expect(within(pill).getByText(label).props.className).toBe(labelClass);
    }
  });
});

describe('#178 R6: fila del canvas', () => {
  beforeAll(() => { hostProcess.env.TZ = 'America/Mexico_City'; });
  afterAll(() => {
    if (originalTimezone === undefined) delete hostProcess.env.TZ;
    else hostProcess.env.TZ = originalTimezone;
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ now: new Date('2026-12-30T15:00:00.000Z') });
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: canvasReminders });
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('distingue las recetas de fila próxima, lejana e inactiva (enmendado por #204 R7)', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    for (const [id, className] of [
      ['a', 'flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border-2 border-category-amber'],
      ['b', 'flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border'],
      ['c', 'flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border opacity-50'],
    ]) {
      const row = screen.getByTestId(`reminder-row-${id}`);
      expect(row.props.className).toBe(className);
      expect(row).toHaveStyle({ borderCurve: 'continuous' });
    }
  });

  it('ordena mosaico, columna y borrar con la anatomía exacta de cada fila', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    for (const id of ['a', 'b', 'c']) {
      const row = screen.getByTestId(`reminder-row-${id}`);
      expect(row.children).toHaveLength(3);
      expect(row.children[0]).toHaveProperty('props.testID', `reminder-tile-${id}`);
      expect(row.children[1]).toHaveProperty('props.className', 'min-w-0 flex-1 gap-0.75');
      expect(row.children[1]).toHaveProperty('children.length', 3);
      expect(row.children[2]).toHaveProperty('props.testID', `reminder-delete-${id}`);
    }
  });

  it('da a cada mosaico su único icono, tamaño, superficie y tinta', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    for (const [id, className, iconID, color] of [
      ['a', 'size-11.5 items-center justify-center rounded-14 bg-category-blue', 'reminders-icon-syringe', 'color:category-blue-strong'],
      ['b', 'size-11.5 items-center justify-center rounded-14 bg-category-amber', 'reminders-icon-pill', 'color:category-amber-strong'],
      ['c', 'size-11.5 items-center justify-center rounded-14 bg-default', 'reminders-icon-pin-tack', 'color:muted'],
    ]) {
      const tile = screen.getByTestId(`reminder-tile-${id}`);
      expect(tile.props.className).toBe(className);
      expect(tile).toHaveStyle({ borderCurve: 'continuous' });
      expect(tile.children).toHaveLength(1);
      expect(tile.children[0]).toHaveProperty('props.testID', iconID);
      const icon = within(tile).getByTestId(iconID);
      expect(icon.props.size).toBe(22);
      expect(icon.props.color).toBe(color);
    }
  });

  it('pinta tipo y título con sus tintas y pesos propios', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    for (const [id, type, title, typeClass] of [
      ['a', 'Vacuna', 'Refuerzo de rabia', 'text-xs font-extrabold text-category-blue-strong'],
      ['b', 'Medicamento', 'Pastilla trimestral', 'text-xs font-extrabold text-category-amber-strong'],
      ['c', 'Otro', 'Baño', 'text-xs font-extrabold text-muted'],
    ]) {
      const row = within(screen.getByTestId(`reminder-row-${id}`));
      expect(row.getByText(type).props.className).toBe(typeClass);
      expect(row.getByText(title).props.className).toBe('text-base font-extrabold text-foreground');
    }
  });

  it('formatea la fecha y hora próxima y conserva sus días en text-13', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    const row = within(screen.getByTestId('reminder-row-a'));
    expect(row.getByText('2 ene, 09:00').props.className).toBe('text-13 font-normal text-muted');
    expect(row.getByText('· en 3 días').props.className).toBe('text-13 font-normal text-muted');
  });

  it('formatea la hora lejana y la meta inactiva con su estado', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    expect(within(screen.getByTestId('reminder-row-b')).getByText('20 ene, 20:05').props.className).toBe('text-13 font-normal text-muted');
    const row = within(screen.getByTestId('reminder-row-c'));
    expect(row.getByText('3 dic, 11:30').props.className).toBe('text-13 font-normal text-muted');
    const status = row.getByTestId('reminder-status-c');
    expect(status).toHaveTextContent('Enviado');
    expect(status.props.className).toBe('text-13 font-semibold text-muted');
  });

  it('sustituye los emoji de todas las filas por iconos', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    for (const id of ['a', 'b', 'c']) {
      const row = screen.getByTestId(`reminder-row-${id}`);
      expect(within(row).queryAllByText(/\p{Extended_Pictographic}/u)).toEqual([]);
    }
  });
});

describe('R6: lista con pills, badges y refetch on focus', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-24T09:00:00.000Z'));
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders summaries and reminder rows in API order', async () => {
    const reminders = [
      makeReminder({
        id: 'sent',
        type: 'food',
        title: 'Buy food',
        dueAt: '2026-08-20T09:00:00.000Z',
        status: 'sent',
      }),
      makeReminder({
        id: 'cancelled',
        type: 'appointment',
        title: 'Vet visit',
        dueAt: '2026-08-21T09:00:00.000Z',
        status: 'cancelled',
      }),
      makeReminder({ id: 'upcoming' }),
      makeReminder({
        id: 'later',
        type: 'medication',
        title: 'Monthly medication',
        dueAt: '2026-09-10T09:00:00.000Z',
      }),
    ];
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders });

    await renderReminders();
    await waitFor(() =>
      expect(screen.getByTestId('reminder-row-upcoming')).toBeVisible(),
    );

    expect(within(screen.getByTestId('pill-active')).getByText('2')).toBeVisible();
    expect(within(screen.getByTestId('pill-week')).getByText('1')).toBeVisible();
    expect(
      within(screen.getByTestId('pill-week')).getByText('Esta semana'),
    ).toBeVisible();
    expect(
      within(screen.getByTestId('pill-inactive')).getByText('2'),
    ).toBeVisible();
    expect(
      screen.getAllByTestId(/^reminder-row-/).map(({ props }) => props.testID),
    ).toEqual([
      'reminder-row-sent',
      'reminder-row-cancelled',
      'reminder-row-upcoming',
      'reminder-row-later',
    ]);

    const upcoming = within(screen.getByTestId('reminder-row-upcoming'));
    expect(upcoming.getByTestId('reminders-icon-syringe')).toBeVisible(); // #178 R6
    expect(upcoming.getByText('Vacuna')).toBeVisible();
    expect(upcoming.getByText('Rabies booster')).toBeVisible();
    const due = new Date(reminders[2].dueAt);
    expect(
      upcoming.getByText(
        `${due.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}, ${due.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}`,
      ),
    ).toBeVisible();
    expect(upcoming.getByText('· en 3 días')).toBeVisible();
    expect(screen.getByTestId('reminder-upcoming-upcoming')).toHaveTextContent(
      '¡Próximo!',
    );
    expect(screen.queryByTestId('reminder-upcoming-later')).toBeNull();

    expect(screen.getByTestId('reminder-row-sent').props.className).toContain(
      'opacity-50',
    );
    expect(screen.getByTestId('reminder-status-sent')).toHaveTextContent(
      'Enviado',
    );
    expect(
      screen.getByTestId('reminder-row-cancelled').props.className,
    ).toContain('opacity-50');
    expect(screen.getByTestId('reminder-status-cancelled')).toHaveTextContent(
      'Cancelado',
    );
  });

  it('refetches when the screen recovers focus', async () => {
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [] });

    await renderReminders();
    await waitFor(() => expect(mockListReminders).toHaveBeenCalledTimes(1));
    const focusCallback = mockUseFocusEffect.mock.calls.at(-1)?.[0];
    expect(focusCallback).toBeDefined();

    await act(async () => {
      focusCallback?.();
      await Promise.resolve();
    });

    await waitFor(() => expect(mockListReminders).toHaveBeenCalledTimes(2));
  });
});

describe('#65 R15: la fecha del recordatorio se formatea con el locale del idioma', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListReminders.mockResolvedValue({
      kind: 'ok',
      reminders: [makeReminder()],
    });
  });

  it('passes es-MX explicitly to the date formatter', async () => {
    const formatDate = jest.spyOn(Date.prototype, 'toLocaleDateString');

    try {
      await renderReminders();
      await waitFor(() =>
        expect(screen.getByTestId('reminder-row-reminder-1')).toBeVisible(),
      );

    expect(formatDate).toHaveBeenCalledWith('es-MX', { day: 'numeric', month: 'short' }); // #178 R6
    } finally {
      formatDate.mockRestore();
    }
  });
});

describe('R7: borrar recordatorio con confirmación', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('shows a delete action for reminders in every status', async () => {
    mockListReminders.mockResolvedValue({
      kind: 'ok',
      reminders: [
        makeReminder({ id: 'scheduled' }),
        makeReminder({ id: 'sent', status: 'sent' }),
        makeReminder({ id: 'cancelled', status: 'cancelled' }),
      ],
    });

    await renderReminders();

    await waitFor(() =>
      expect(screen.getByTestId('reminder-delete-scheduled')).toBeVisible(),
    );
    expect(screen.getByTestId('reminder-delete-sent')).toBeVisible();
    expect(screen.getByTestId('reminder-delete-cancelled')).toBeVisible();
  });

  it('closes the confirmation sheet on cancel and native dismiss', async () => {
    mockListReminders.mockResolvedValue({
      kind: 'ok',
      reminders: [makeReminder()],
    });

    await renderReminders();
    await waitFor(() =>
      expect(screen.getByTestId('reminder-delete-reminder-1')).toBeVisible(),
    );
    await fireEvent.press(screen.getByTestId('reminder-delete-reminder-1'));

    await fireEvent(
      screen.getByTestId('community-bottom-sheet'),
      'onClose',
    );
    expect(screen.queryByTestId('community-bottom-sheet')).toBeNull();
    expect(screen.queryByTestId('reminders-delete-sheet')).toBeNull();
    expect(mockDeleteReminder).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByTestId('reminder-delete-reminder-1'));
    await fireEvent.press(screen.getByTestId('reminders-delete-cancel'));

    expect(screen.queryByTestId('reminders-delete-sheet')).toBeNull();
    expect(mockDeleteReminder).not.toHaveBeenCalled();
  });

  it.each([
    { kind: 'ok' } as const,
    { kind: 'not-found' } as const,
  ])('refetches and removes the row after $kind', async (deleteState) => {
    mockListReminders
      .mockResolvedValueOnce({
        kind: 'ok',
        reminders: [makeReminder()],
      })
      .mockResolvedValueOnce({ kind: 'ok', reminders: [] });
    mockDeleteReminder.mockResolvedValue(deleteState);

    await renderReminders();
    await waitFor(() =>
      expect(screen.getByTestId('reminder-delete-reminder-1')).toBeVisible(),
    );
    await confirmDelete('reminder-1');

    expect(mockDeleteReminder).toHaveBeenCalledWith(
      apiUrl,
      'jwt-token',
      'pet-1',
      'reminder-1',
    );
    await waitFor(() => expect(screen.queryByTestId('reminder-row-reminder-1')).toBeNull());
    expect(mockListReminders).toHaveBeenCalledTimes(2);
  });

  it.each([
    [{ kind: 'forbidden' }, 'Solo el dueño puede eliminar'],
    [{ kind: 'unreachable', message: 'offline' }, 'No se pudo conectar con el servidor'],
    [{ kind: 'error' }, 'Algo salió mal'],
    [{ kind: 'missing-config' }, 'Algo salió mal'],
  ] as [DeleteReminderState, string][]) (
    'shows the action error for $state.kind',
    async (deleteState, message) => {
      mockListReminders.mockResolvedValue({
        kind: 'ok',
        reminders: [makeReminder()],
      });
      mockDeleteReminder.mockResolvedValue(deleteState);

      await renderReminders();
      await waitFor(() =>
        expect(screen.getByTestId('reminder-delete-reminder-1')).toBeVisible(),
      );
      await confirmDelete('reminder-1');

      await waitFor(() =>
        expect(screen.getByTestId('reminders-action-error')).toHaveTextContent(
          message,
        ),
      );
      expect(mockListReminders).toHaveBeenCalledTimes(1);
    },
  );

  it('disables only the row being deleted while the request is pending', async () => {
    mockListReminders.mockResolvedValue({
      kind: 'ok',
      reminders: [makeReminder(), makeReminder({ id: 'reminder-2' })],
    });
    mockDeleteReminder.mockReturnValue(pending<DeleteReminderState>());

    await renderReminders();
    await waitFor(() =>
      expect(screen.getByTestId('reminder-delete-reminder-1')).toBeVisible(),
    );
    await confirmDelete('reminder-1');

    expect(
      screen.getByTestId('reminder-delete-reminder-1').props.accessibilityState,
    ).toEqual(expect.objectContaining({ disabled: true }));
    expect(
      screen.getByTestId('reminder-delete-reminder-2').props.accessibilityState,
    ).toEqual(expect.objectContaining({ disabled: false }));
  });
});

describe('#64 R7: la fila de recordatorio pinta el icono con el color de su tipo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('mantiene emoji y etiqueta junto a superficies distintas', async () => {
    mockListReminders.mockResolvedValue({
      kind: 'ok',
      reminders: [
        makeReminder({ id: 'vaccine', type: 'vaccine' }),
        makeReminder({
          id: 'medication',
          type: 'medication',
          title: 'Monthly medication',
        }),
      ],
    });

    await renderReminders();
    await waitFor(() =>
      expect(screen.getByTestId('reminder-row-vaccine')).toBeVisible(),
    );

    const vaccineRow = within(screen.getByTestId('reminder-row-vaccine'));
    const medicationRow = within(
      screen.getByTestId('reminder-row-medication'),
    );
    const vaccineTile = vaccineRow.getByTestId('reminder-tile-vaccine'); // #178 R6
    const medicationTile = medicationRow.getByTestId('reminder-tile-medication');

    expect(vaccineTile?.props.className).toContain('bg-category-blue');
    expect(medicationTile?.props.className).toContain('bg-category-amber');
    expect(vaccineTile?.props.className).not.toContain('bg-accent-soft');
    expect(medicationTile?.props.className).not.toContain('bg-accent-soft');
    expect(vaccineRow.getByTestId('reminders-icon-syringe')).toBeVisible();
    expect(vaccineRow.getByText('Vacuna')).toBeVisible();
    expect(medicationRow.getByTestId('reminders-icon-pill')).toBeVisible();
    expect(medicationRow.getByText('Medicamento')).toBeVisible();
  });
});

describe('#87 R14: RemindersScreen lee por TanStack Query', () => {
  it('deja mascotas y recordatorios en sus claves canónicas', async () => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    const petsState = { kind: 'ok' as const, pets: [makePet()] };
    const remindersState: RemindersState = {
      kind: 'ok',
      reminders: [makeReminder()],
    };
    mockListPets.mockResolvedValue(petsState);
    mockListReminders.mockResolvedValue(remindersState);

    const { queryClient } = await renderWithProviders(<RemindersScreen />, {
      wrapper: RemindersWrapper,
    });
    await screen.findByTestId('reminder-row-reminder-1');

    expect(queryClient.getQueryData(petKeys.list())).toEqual(petsState);
    expect(queryClient.getQueryData(reminderKeys.list('pet-1'))).toEqual(
      remindersState,
    );
  });
});

describe(
  '#97 R1: la confirmación de borrado no sobrevive a la pérdida de foco',
  () => {
    beforeEach(() => {
      jest.clearAllMocks();
      process.env.EXPO_PUBLIC_API_URL = apiUrl;
      mockUseAuth.mockReturnValue({
        status: 'authenticated',
        token: 'jwt-token',
        signIn: jest.fn(),
        signOut: jest.fn(),
      } satisfies AuthContextValue);
      mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
      mockListReminders.mockResolvedValue({
        kind: 'ok',
        reminders: [makeReminder()],
      });
    });

    it('cierra el sheet y elimina su contenido accesible al perder foco', async () => {
      await renderReminders();
      await waitFor(() =>
        expect(screen.getByTestId('reminder-row-reminder-1')).toBeVisible(),
      );
      const cleanups = await focusScreen();

      await fireEvent.press(screen.getByTestId('reminder-delete-reminder-1'));
      expect(screen.getByTestId('community-bottom-sheet')).toBeVisible();

      await blurScreen(cleanups);

      await waitFor(() => {
        expect(screen.queryByTestId('community-bottom-sheet')).toBeNull();
        expect(screen.queryByTestId('reminders-delete-sheet')).toBeNull();
        expect(screen.queryByTestId('reminders-delete-confirm')).toBeNull();
      });
    });
  },
);

describe(
  '#97 R2: el error de acción no sobrevive a la pérdida de foco',
  () => {
    beforeEach(() => {
      jest.clearAllMocks();
      process.env.EXPO_PUBLIC_API_URL = apiUrl;
      mockUseAuth.mockReturnValue({
        status: 'authenticated',
        token: 'jwt-token',
        signIn: jest.fn(),
        signOut: jest.fn(),
      } satisfies AuthContextValue);
      mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
      mockListReminders.mockResolvedValue({
        kind: 'ok',
        reminders: [makeReminder()],
      });
      mockDeleteReminder.mockResolvedValue({ kind: 'error' });
    });

    it('borra el error visible al perder foco', async () => {
      await renderReminders();
      await waitFor(() =>
        expect(screen.getByTestId('reminder-delete-reminder-1')).toBeVisible(),
      );
      const cleanups = await focusScreen();

      await confirmDelete('reminder-1');
      await waitFor(() =>
        expect(screen.getByTestId('reminders-action-error')).toBeVisible(),
      );

      await blurScreen(cleanups);

      await waitFor(() =>
        expect(screen.queryByTestId('reminders-action-error')).toBeNull(),
      );
    });
  },
);

describe(
  '#97 R3: el guarda del borrado en vuelo sobrevive a la pérdida de foco',
  () => {
    beforeEach(() => {
      jest.clearAllMocks();
      process.env.EXPO_PUBLIC_API_URL = apiUrl;
      mockUseAuth.mockReturnValue({
        status: 'authenticated',
        token: 'jwt-token',
        signIn: jest.fn(),
        signOut: jest.fn(),
      } satisfies AuthContextValue);
      mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
      mockListReminders.mockResolvedValue({
        kind: 'ok',
        reminders: [makeReminder(), makeReminder({ id: 'reminder-2' })],
      });
      mockDeleteReminder.mockReturnValue(pending<DeleteReminderState>());
    });

    it('mantiene deshabilitada solo la fila cuyo delete sigue pendiente', async () => {
      await renderReminders();
      await waitFor(() =>
        expect(screen.getByTestId('reminder-delete-reminder-1')).toBeVisible(),
      );
      const cleanups = await focusScreen();

      await confirmDelete('reminder-1');
      await waitFor(() =>
        expect(
          screen.getByTestId('reminder-delete-reminder-1').props
            .accessibilityState.disabled,
        ).toBe(true),
      );
      expect(
        screen.getByTestId('reminder-delete-reminder-2').props
          .accessibilityState.disabled,
      ).toBe(false);

      await blurScreen(cleanups);

      expect(
        screen.getByTestId('reminder-delete-reminder-1').props
          .accessibilityState.disabled,
      ).toBe(true);
      expect(
        screen.getByTestId('reminder-delete-reminder-2').props
          .accessibilityState.disabled,
      ).toBe(false);
    });
  },
);

describe('#84 R3: recordatorios cuenta días de calendario en la píldora, el badge y la etiqueta', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 10, 8, 0));
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('08:00 del 10 de septiembre: hoy a las 20:00, +7 y +10 días a las 09:00 cuentan 0, 7 y 10', async () => {
    const reminders = [
      makeReminder({ id: 'today-later', dueAt: new Date(2026, 8, 10, 20, 0).toISOString() }),
      makeReminder({ id: 'week-edge', dueAt: new Date(2026, 8, 17, 9, 0).toISOString() }),
      makeReminder({ id: 'badge-edge', dueAt: new Date(2026, 8, 20, 9, 0).toISOString() }),
    ];
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders });

    await renderReminders();
    await waitFor(() => expect(screen.getByTestId('reminder-row-badge-edge')).toBeVisible());

    const today = within(screen.getByTestId('reminder-row-today-later'));
    const week = within(screen.getByTestId('reminder-row-week-edge'));
    const badge = within(screen.getByTestId('reminder-row-badge-edge'));
    expect(today.getByText('· en 0 días')).toBeVisible();
    expect(week.getByText('· en 7 días')).toBeVisible();
    expect(badge.getByText('· en 10 días')).toBeVisible();
    expect(today.getByTestId('reminder-upcoming-today-later')).toBeVisible();
    expect(week.getByTestId('reminder-upcoming-week-edge')).toBeVisible();
    expect(badge.getByTestId('reminder-upcoming-badge-edge')).toBeVisible();
    expect(within(screen.getByTestId('pill-week')).getByText('2')).toBeVisible();
  });

  it('08:00 del 10 de septiembre: ayer a las 09:00 no es de esta semana ni próximo', async () => {
    mockListReminders.mockResolvedValue({
      kind: 'ok',
      reminders: [makeReminder({ id: 'yesterday-later', dueAt: new Date(2026, 8, 9, 9, 0).toISOString() })],
    });

    await renderReminders();
    await waitFor(() => expect(screen.getByTestId('reminder-row-yesterday-later')).toBeVisible());

    const yesterday = within(screen.getByTestId('reminder-row-yesterday-later'));
    expect(yesterday.getByText('· en -1 días')).toBeVisible();
    expect(yesterday.queryByTestId('reminder-upcoming-yesterday-later')).toBeNull();
    expect(within(screen.getByTestId('pill-week')).getByText('0')).toBeVisible();
  });
});

describe('#84 R6: los umbrales de la píldora y del badge no se aflojan (Enmienda E1)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 10, 8, 0));
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('08:00 del 10 de septiembre: +8 días queda fuera de la semana con badge y +11 días queda sin badge', async () => {
    mockListReminders.mockResolvedValue({
      kind: 'ok',
      reminders: [
        makeReminder({ id: 'plus-eight', dueAt: new Date(2026, 8, 18, 9, 0).toISOString() }),
        makeReminder({ id: 'plus-eleven', dueAt: new Date(2026, 8, 21, 9, 0).toISOString() }),
      ],
    });

    await renderReminders();
    await waitFor(() => expect(screen.getByTestId('reminder-row-plus-eleven')).toBeVisible());

    expect(within(screen.getByTestId('reminder-row-plus-eight')).getByText('· en 8 días')).toBeVisible();
    expect(screen.getByTestId('reminder-upcoming-plus-eight')).toBeVisible();
    expect(within(screen.getByTestId('reminder-row-plus-eleven')).getByText('· en 11 días')).toBeVisible();
    expect(screen.queryByTestId('reminder-upcoming-plus-eleven')).toBeNull();
    expect(within(screen.getByTestId('pill-week')).getByText('0')).toBeVisible();
  });
});

describe('#127 R3: las tres píldoras de resumen llevan su receta en el árbol', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('pinta cada píldora con su clase exacta, rounded-xl incluido, y la esquina continua, las vea o no el recorte de fuente', async () => {
    mockListReminders.mockResolvedValue({
      kind: 'ok',
      reminders: [makeReminder()],
    });

    await renderReminders();
    await waitFor(() =>
      expect(screen.getByTestId('reminder-row-reminder-1')).toBeVisible(),
    );

    expect(
      ['pill-active', 'pill-week', 'pill-inactive'].map((testID) => {
        const { className, style } = screen.getByTestId(testID).props;

        return { testID, className, style };
      }),
    ).toStrictEqual([
      {
        testID: 'pill-active',
        className: 'flex-1 rounded-16 px-3 py-2.5 bg-surface-secondary', // #178 R5
        style: { borderCurve: 'continuous' },
      },
      {
        testID: 'pill-week',
        className: 'flex-1 rounded-16 px-3 py-2.5 bg-category-amber', // #178 R5
        style: { borderCurve: 'continuous' },
      },
      {
        testID: 'pill-inactive',
        className: 'flex-1 rounded-16 px-3 py-2.5 bg-default', // #178 R5
        style: { borderCurve: 'continuous' },
      },
    ]);
  });
});

describe('#128 R4: el botón destructivo del sheet y su etiqueta llevan su receta en el árbol', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('pinta reminders-delete-confirm con la variante danger y bg-danger, y su única etiqueta Eliminar con text-danger-foreground, haya o no un señuelo en la fuente (enmendado por #204 R9)', async () => {
    mockListReminders.mockResolvedValue({
      kind: 'ok',
      reminders: [makeReminder()],
    });

    await renderReminders();
    await waitFor(() =>
      expect(screen.getByTestId('reminder-row-reminder-1')).toBeVisible(),
    );
    await fireEvent.press(screen.getByTestId('reminder-delete-reminder-1'));

    const confirm = screen.getByTestId('reminders-delete-confirm');

    expect(confirm.props.className).toBe(
      'pressable-feedback__root button__root button__root--variant-danger button__root--size-md h-14 w-full rounded-16 bg-danger',
    );
    expect(within(confirm).getByText('Eliminar').props.className).toBe(
      'text-17 font-extrabold text-danger-foreground',
    );
  });
});

describe('#178 R7: entrada escalonada y badge', () => {
  beforeAll(() => { hostProcess.env.TZ = 'America/Mexico_City'; });
  afterAll(() => {
    if (originalTimezone === undefined) delete hostProcess.env.TZ;
    else hostProcess.env.TZ = originalTimezone;
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ now: new Date('2026-12-30T15:00:00.000Z') });
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: canvasReminders });
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('asigna a cada entrada su índice en el orden del fixture (enmendado por #204 R6)', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    for (const [index, id] of ['a', 'b', 'c'].entries()) {
      expect(mockRiseIn).toHaveBeenCalledWith(
        expect.objectContaining({ testID: `reminders-entry-${id}`, delayMs: index * 70 }),
      );
    }
  });

  it('envuelve cada fila en su propia entrada', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    for (const id of ['a', 'b', 'c']) {
      expect(within(screen.getByTestId(`reminders-entry-${id}`)).getByTestId(`reminder-row-${id}`)).toBeVisible();
    }
  });

  it('envuelve el badge próximo con PopIn y la receta del canvas (enmendado por #204 R7)', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    const badge = within(screen.getByTestId('reminder-upcoming-pop-a')).getByTestId('reminder-upcoming-a');
    expect(badge).toHaveTextContent('¡Próximo!');
    expect(badge.props.className).toBe('rounded-full px-2 py-0.75 text-11 font-extrabold bg-category-amber text-category-amber-strong');
  });

  it('reserva el pop para la fila próxima y lo omite en la lejana', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    expect(screen.getByTestId('reminder-upcoming-pop-a')).toBeVisible();
    expect(screen.queryByTestId('reminder-upcoming-pop-b')).toBeNull();
  });
});

describe('#178 R8: sheet de borrado del canvas', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: canvasReminders });
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    await fireEvent.press(screen.getByTestId('reminder-delete-a'));
  });

  it('centra los cinco hijos del sheet con el marco del canvas', () => {
    const sheet = screen.getByTestId('reminders-delete-sheet');
    expect(sheet.props.className).toBe('items-center gap-3 bg-surface px-5 pb-9 pt-3');
    expect(sheet.children).toHaveLength(5);
  });

  it('abre el sheet con el mosaico rosa y Trash de 26 en tinta danger', () => {
    const sheet = screen.getByTestId('reminders-delete-sheet');
    const tile = within(sheet).getByTestId('reminders-delete-icon');
    expect(sheet.children[0]).toBe(tile);
    expect(tile.props.className).toBe('size-14 items-center justify-center rounded-full bg-category-rose');
    const icon = within(tile).getByTestId('reminders-icon-trash');
    expect(icon.props.size).toBe(26);
    expect(icon.props.color).toBe('color:danger');
  });

  it('centra título, referencia y cuerpo con sus pesos propios', () => {
    const sheet = screen.getByTestId('reminders-delete-sheet');
    const title = within(sheet).getByText('¿Eliminar recordatorio?');
    const reference = within(sheet).getByTestId('reminders-delete-reference');
    const body = within(sheet).getByText('Esta acción no se puede deshacer.');
    expect(title.props.className).toBe('text-center text-xl font-black text-foreground');
    expect(reference.props.className).toBe('text-center text-base font-semibold text-foreground');
    expect(reference).toHaveTextContent('Refuerzo de rabia');
    expect(body.props.className).toBe('text-center text-sm font-normal text-muted');
    expect(sheet.children.slice(1, 4)).toEqual([title, reference, body]);
  });

  it('termina con las dos acciones en un grupo de ancho completo', () => {
    const sheet = screen.getByTestId('reminders-delete-sheet');
    const confirm = within(sheet).getByTestId('reminders-delete-confirm');
    const actions = confirm.parent;
    expect(actions?.props.className).toBe('w-full gap-3');
    expect(sheet.children[4]).toBe(actions);
    expect(within(actions!).getByTestId('reminders-delete-cancel')).toBeVisible();
  });
});

describe('#218 R1: el cajón de borrar pinta su contenedor con el token surface', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: canvasReminders });
  });

  it('#218 R1: backgroundStyle del BottomSheet de borrar es exactamente el token surface', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    await fireEvent.press(screen.getByTestId('reminder-delete-a'));
    const sheet = within(screen.getByTestId('reminders-delete-host')).getByTestId('community-bottom-sheet');
    expect(flat(sheet.props.backgroundStyle)).toEqual({ backgroundColor: 'color:surface' });
    expect(sheet.props.snapPoints).toEqual(['50%', '100%']);
  });
});

describe('#178 R9: el vacío ofrece crear', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [] });
    await renderReminders();
    await screen.findByTestId('reminders-empty-title');
  });

  it('ofrece Nuevo dentro del estado vacío', () => {
    expect(within(screen.getByTestId('reminders-empty')).getByText('Nuevo')).toBeVisible();
  });

  it('abre el formulario una sola vez desde la acción del vacío', async () => {
    await fireEvent.press(within(screen.getByTestId('reminders-empty')).getByText('Nuevo'));
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/add-reminder');
  });

  it('ofrece la acción del vacío junto al enlace Nuevo de la cabecera', () => {
    expect(within(screen.getByTestId('reminders-empty')).getByText('Nuevo')).toBeVisible();
    expect(within(screen.getByTestId('reminders-add-link')).getByText('Nuevo')).toBeVisible();
  });
});

describe('#155 R6: sin recordatorios, Pingo sostiene su lista', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('queda en el sitio del vacío que sustituye (enmendado por #204 R4)', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })] });
    mockListReminders.mockImplementation((_url, _token, petId) => Promise.resolve<RemindersState>({ kind: 'ok', reminders: petId === 'pet-2' ? [makeReminder({ petId: 'pet-2' })] : [] }));
    mockDeleteReminder.mockResolvedValue({ kind: 'forbidden' });
    await renderReminders();
    await screen.findByTestId('reminders-empty-pose');
    const slot = screen.getByTestId('reminders-empty');
    expect(slot.parent?.parent?.props.testID).toBe('screen-reminders');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['reminders', 'RCTScrollView', 'reminders-empty', 'reminders-delete-host']);
    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));
    await waitFor(() => expect(screen.getByTestId('reminder-delete-reminder-1')).toBeVisible());
    await confirmDelete('reminder-1');
    await waitFor(() => expect(screen.getByTestId('reminders-action-error')).toBeVisible());
    await fireEvent.press(screen.getByTestId('pet-chip-pet-1'));
    await screen.findByTestId('reminders-empty-pose');
    const slotWithError = screen.getByTestId('reminders-empty');
    expect(slotWithError.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['reminders', 'RCTScrollView', 'reminders-empty', 'reminders-action-error', 'reminders-delete-host']);
  });

  it('pinta la pose, el título y la frase de Pingo', async () => {
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [] });
    await renderReminders();
    const pose = await screen.findByTestId('reminders-empty-pose');
    expect(pose.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-clipboard\.webp$/) }),
    ]);
    expect(screen.getByTestId('reminders-empty-title')).toHaveTextContent('Aún no hay recordatorios');
    expect(screen.getByTestId('reminders-empty-body')).toHaveTextContent('Cuando crees un recordatorio, te aviso a tiempo.');
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

describe('Recordatorios: refetch de foco con selección vigente', () => {
  let selectedPetId: string | null;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    selectedPetId = null;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token',
      signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [makeReminder()] });
    mockDeleteReminder.mockResolvedValue({ kind: 'error' });
    const realUseSelectedPet = selectedPetHooks.useSelectedPet;
    jest.spyOn(selectedPetHooks, 'useSelectedPet').mockImplementation(() => ({
      ...realUseSelectedPet(), selectedPetId,
    }));
  });

  afterEach(() => jest.restoreAllMocks());

  describe('#193 R7: sin mascota no pide recordatorios al enfocar', () => {
    it('no llama a listReminders durante el foco con selección nula', async () => {
      const { queryClient } = await renderReminders();
      await screen.findByTestId('reminders-no-pets');
      await waitFor(() => expect(queryClient.isFetching()).toBe(0));
      const before = mockListReminders.mock.calls.length;
      const focus = mockUseFocusEffect.mock.calls.at(-1)?.[0];
      expect(focus).toBeDefined();

      await act(async () => { focus?.(); });

      expect(mockListReminders.mock.calls.slice(before)).toEqual([]);
    });
  });

  describe('#193 R8: con mascota refresca los recordatorios al enfocar', () => {
    it('la callback original pide una vez el id seleccionado después del montaje', async () => {
      mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
      const view = await renderReminders();
      await screen.findByTestId('pet-chip-pet-1');
      await waitFor(() => expect(view.queryClient.isFetching()).toBe(0));
      const focus = mockUseFocusEffect.mock.calls.at(-1)?.[0];
      expect(focus).toBeDefined();
      selectedPetId = 'pet-1';
      await view.rerender(<RemindersScreen />);
      await screen.findByTestId('reminder-row-reminder-1');
      await waitFor(() => expect(view.queryClient.isFetching()).toBe(0));
      const before = mockListReminders.mock.calls.length;

      await act(async () => { focus?.(); });

      expect(mockListReminders.mock.calls.slice(before)).toEqual([[apiUrl, 'jwt-token', 'pet-1']]);
    });
  });

  describe('#193 R9: perder foco sin mascota limpia confirmación y error', () => {
    it.each(['confirmación', 'error'] as const)('limpia %s tras cambiar la selección a null', async (state) => {
      selectedPetId = 'pet-1';
      mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
      const view = await renderWithProviders(
        <><SelectionProbe181 /><RemindersScreen /></>, { wrapper: RemindersWrapper },
      );
      await screen.findByTestId('reminder-row-reminder-1');
      await waitFor(() => expect(view.queryClient.isFetching()).toBe(0));
      const visibleId = state === 'confirmación' ? 'reminders-delete-sheet' : 'reminders-action-error';
      if (state === 'confirmación') {
        await fireEvent.press(screen.getByTestId('reminder-delete-reminder-1'));
      } else {
        await confirmDelete('reminder-1');
      }
      await screen.findByTestId(visibleId);

      selectedPetId = null;
      await view.rerender(<><SelectionProbe181 /><RemindersScreen /></>);
      await waitFor(() => expect(screen.getByTestId('selected-pet-id')).toHaveTextContent('none'));
      expect(screen.getByTestId(visibleId)).toBeVisible();
      const focus = mockUseFocusEffect.mock.calls.at(-1)?.[0];
      expect(focus).toBeDefined();
      const cleanups: (() => void)[] = [];
      await act(async () => {
        const cleanup = focus?.();
        if (typeof cleanup === 'function') cleanups.push(cleanup);
      });

      await blurScreen(cleanups);

      expect(screen.queryByTestId('reminders-delete-sheet')).toBeNull();
      expect(screen.queryByTestId('reminders-action-error')).toBeNull();
    });
  });

  describe('#193 R10: Recordatorios conserva la identidad de su callback de foco', () => {
    it('mantiene la misma función al seleccionar y deseleccionar una mascota', async () => {
      mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
      const view = await renderWithProviders(
        <><SelectionProbe181 /><RemindersScreen /></>, { wrapper: RemindersWrapper },
      );
      await screen.findByTestId('pet-chip-pet-1');
      await waitFor(() => expect(view.queryClient.isFetching()).toBe(0));
      const focus = mockUseFocusEffect.mock.calls.at(-1)?.[0];
      expect(focus).toBeDefined();

      selectedPetId = 'pet-1';
      await view.rerender(<><SelectionProbe181 /><RemindersScreen /></>);
      await screen.findByTestId('reminder-row-reminder-1');
      expect(Object.is(focus, mockUseFocusEffect.mock.calls.at(-1)?.[0])).toBe(true);

      selectedPetId = null;
      await view.rerender(<><SelectionProbe181 /><RemindersScreen /></>);
      await waitFor(() => expect(screen.getByTestId('selected-pet-id')).toHaveTextContent('none'));
      expect(Object.is(focus, mockUseFocusEffect.mock.calls.at(-1)?.[0])).toBe(true);
    });
  });
});

describe('#181 R1: reminders sin mascotas no muestra errores de detalle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token',
      signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    mockListReminders.mockResolvedValue({ kind: 'not-found' });
  });

  afterEach(() => jest.restoreAllMocks());

  it.each(['S1', 'S2', 'S3'] as const)('%s: conserva el vacío sin tarjeta ni reintento', async (scenario) => {
    if (scenario === 'S3') {
      const realUseSelectedPet = selectedPetHooks.useSelectedPet;
      jest.spyOn(selectedPetHooks, 'useSelectedPet').mockImplementation(() => ({
        ...realUseSelectedPet(), selectedPetId: 'pet-stale', clearPet: () => undefined,
      }));
    }
    const { queryClient } = await renderWithProviders(
      <><SelectionProbe181 /><RemindersScreen /></>, { wrapper: RemindersWrapper },
    );
    if (scenario === 'S2') {
      const focus = mockUseFocusEffect.mock.calls.at(-1)?.[0];
      expect(focus).toBeDefined();
      await act(async () => { focus?.(); });
    }
    await screen.findByTestId('reminders-no-pets');
    if (scenario === 'S1') {
      await act(async () => { selectPet181?.('pet-stale'); });
      await waitFor(() => expect(screen.getByTestId('selected-pet-id')).toHaveTextContent('none'));
    }
    await screen.findByTestId('reminders-no-pets');
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(mockListReminders).not.toHaveBeenCalledWith(apiUrl, 'jwt-token', null);
    expect(screen.queryByTestId('reminders-error')).toBeNull();
    expect(screen.queryByTestId('reminders-retry')).toBeNull();
  });

  it('S4: lista unreachable y selección nula ocultan la tarjeta', async () => {
    mockListPets.mockResolvedValue({ kind: 'unreachable', message: 'offline' });
    const { queryClient } = await renderWithProviders(<RemindersScreen />, { wrapper: RemindersWrapper });
    const focus = mockUseFocusEffect.mock.calls.at(-1)?.[0];
    expect(focus).toBeDefined();
    await act(async () => { focus?.(); });
    await screen.findByTestId('screen-reminders');
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(mockListReminders).not.toHaveBeenCalledWith(apiUrl, 'jwt-token', null);
    expect(screen.queryByTestId('reminders-error')).toBeNull();
    expect(screen.queryByTestId('reminders-retry')).toBeNull();
  });
});

describe('#181 R4: Recordatorios distingue una cuenta sin mascotas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [] });
  });

  it('R4.2: centra solo el vacío y retira los controles que necesitan mascota', async () => {
    const { queryClient } = await renderReminders();
    const empty = await screen.findByTestId('reminders-no-pets');
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    const container = screen.getByTestId('reminders-no-pets-screen');
    expect(container.type).toBe('View');
    expect(container.props.className).toBe('flex-1 items-center justify-center p-6 bg-background');
    expect(container.props.style).toBeUndefined();
    expect(empty.parent).toBe(container);
    expect(container.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['reminders-no-pets']);
    for (const id of ['screen-reminders', 'reminders-actions', 'reminders-empty', 'reminders-pills', 'reminders-delete-host']) {
      expect(screen.queryByTestId(id)).toBeNull();
    }
  });

  it('R4.2: muestra Pingo talk, copy español y una acción hacia pets/add', async () => {
    await renderReminders();
    const pose = await screen.findByTestId('reminders-no-pets-pose');
    expect(pose.props.source).toEqual([expect.objectContaining({ testUri: expect.stringMatching(/pingo-talk\.webp$/) })]);
    expect(screen.getByTestId('reminders-no-pets-title')).toHaveTextContent(es['common.noPetsYet']);
    expect(screen.getByTestId('reminders-no-pets-body')).toHaveTextContent(es['common.noPetsBody']);
    const action = screen.getByTestId('reminders-no-pets-action');
    expect(within(action).getByText(es['profile.addPet'])).toBeVisible();
    await fireEvent.press(action);
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/pets/add');
  });

  it('R4.3: con mascota mantiene el scroll y el vacío de recordatorios', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    const { queryClient } = await renderReminders();
    await screen.findByTestId('reminders-empty');
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(screen.getByTestId('screen-reminders')).toBeVisible();
    expect(screen.queryByTestId('reminders-no-pets-screen')).toBeNull();
  });
});

describe('#204 R4: cabecera en contenido', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [makeReminder()] });
  });

  it('#204 R4: pinta volver, Recordatorios y Nuevo en la cabecera en contenido', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-reminder-1');
    const header = screen.getByTestId('reminders');
    expect(within(header).getByTestId('reminders-back')).toBeTruthy();
    const title = within(header).getByTestId('reminders-title');
    expect(title).toHaveTextContent('Recordatorios');
    expect(title.props.accessibilityRole).toBe('header');
    expect(title.props.className).toBe('text-26 font-black tracking-title text-foreground');
    const last = header.children.at(-1);
    expect(typeof last === 'string' ? last : last?.props.testID).toBe('reminders-add-link');
  });

  it('#204 R4: volver sin historial lleva a Perfil', async () => {
    mockRouter.canGoBack.mockReturnValue(false);
    await renderReminders();
    await screen.findByTestId('reminder-row-reminder-1');
    await fireEvent.press(screen.getByTestId('reminders-back'));
    expect(mockRouter.replace).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).toHaveBeenCalledWith('/profile');
    expect(mockRouter.back).not.toHaveBeenCalled();
  });

  it('#204 R4: usa el marco del canvas sin cabecera nativa', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-reminder-1');
    const scroll = screen.getByTestId('screen-reminders');
    expect(scroll.props.contentContainerStyle).toEqual({
      paddingHorizontal: 20,
      paddingTop: 52,
      gap: 14,
      paddingBottom: 48,
    });
    expect(scroll.props.contentInsetAdjustmentBehavior).toBeUndefined();
  });
});

describe('#204 R5: estados bajo la cabecera', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it.each([
    ['reminders-loading'],
    ['reminders-error'],
    ['reminders-empty'],
    ['reminders-action-error'],
  ])('#204 R5: la cabecera encabeza el estado %s', async (stateId) => {
    if (stateId === 'reminders-loading') {
      mockListReminders.mockReturnValue(pending<RemindersState>());
    } else if (stateId === 'reminders-error') {
      mockListReminders.mockResolvedValue({ kind: 'error' });
    } else if (stateId === 'reminders-empty') {
      mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [] });
    } else {
      mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [makeReminder()] });
      mockDeleteReminder.mockResolvedValue({ kind: 'forbidden' });
    }
    await renderReminders();
    if (stateId === 'reminders-action-error') {
      await screen.findByTestId('reminder-delete-reminder-1');
      await confirmDelete('reminder-1');
    }
    await screen.findByTestId(stateId);
    const ids = within(screen.getByTestId('screen-reminders'))
      .getAllByTestId(/^(reminders|reminders-loading|reminders-error|reminders-empty|reminders-action-error)$/)
      .map((node) => node.props.testID);
    expect(ids.indexOf('reminders')).toBeGreaterThanOrEqual(0);
    expect(ids.indexOf('reminders')).toBeLessThan(ids.indexOf(stateId));
  });

  it('#204 R5: sin mascotas conserva volver encima del vacío', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [] });
    await renderReminders();
    const frame = await screen.findByTestId('reminders-no-pets-frame');
    expect(frame.props.className).toBe('flex-1 bg-background');
    expect(flat(frame.props.style)).toMatchObject({ paddingTop: 52, paddingHorizontal: 20 });
    expect(frame.children.map((child) => (typeof child === 'string' ? child : child.props.testID))).toEqual([
      'reminders-no-pets-header',
      'reminders-no-pets-screen',
    ]);
    expect(screen.getByTestId('reminders-no-pets-header-back')).toBeTruthy();
    expect(screen.queryByTestId('reminders-no-pets-header-title')).toBeNull();
  });
});

describe('#204 R6: entrada de las filas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: canvasReminders });
  });

  it('#204 R6: escalona las filas 0, 70 y 140 ms con RiseIn', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    const delayById = new Map(
      mockRiseIn.mock.calls
        .map(([props]) => props)
        .filter((props) => props.testID?.startsWith('reminders-entry-'))
        .map((props) => [props.testID, props.delayMs] as const),
    );
    expect([...delayById]).toEqual([
      ['reminders-entry-a', 0],
      ['reminders-entry-b', 70],
      ['reminders-entry-c', 140],
    ]);
  });
});

describe('#204 R7: ámbar de la fila próxima', () => {
  beforeAll(() => { hostProcess.env.TZ = 'America/Mexico_City'; });
  afterAll(() => {
    if (originalTimezone === undefined) delete hostProcess.env.TZ;
    else hostProcess.env.TZ = originalTimezone;
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ now: new Date('2026-12-30T15:00:00.000Z') });
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: canvasReminders });
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('#204 R7: la fila próxima y su badge usan el ámbar del canvas', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    expect(screen.getByTestId('reminder-row-a').props.className).toBe(
      'flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border-2 border-category-amber',
    );
    expect(screen.getByTestId('reminder-upcoming-a').props.className).toBe(
      'rounded-full px-2 py-0.75 text-11 font-extrabold bg-category-amber text-category-amber-strong',
    );
  });
});

describe('#204 R8: Eliminar de la fila', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: canvasReminders });
  });

  it('#204 R8: Eliminar de fila usa la receta rosa del canvas', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    const button = screen.getByTestId('reminder-delete-a');
    expect(button.props.className).toContain('button__root--variant-danger-soft');
    expect(button.props.className).toContain('button__root--size-md');
    expect(button.props.className).toContain('h-11 rounded-14 px-2.5 bg-category-rose');
    expect(within(button).getByText('Eliminar').props.className).toBe('text-13 font-extrabold text-danger');
  });
});

describe('#204 R9: Eliminar de la hoja', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockListReminders.mockResolvedValue({ kind: 'ok', reminders: canvasReminders });
  });

  it('#204 R9: Eliminar de la hoja lleva cuerpo de 56 y labio danger', async () => {
    await renderReminders();
    await screen.findByTestId('reminder-row-a');
    await fireEvent.press(screen.getByTestId('reminder-delete-a'));
    const confirm = screen.getByTestId('reminders-delete-confirm');
    expect(confirm.props.className).toContain('button__root--variant-danger button__root--size-md');
    expect(confirm.props.className).toContain('h-14 w-full rounded-16 bg-danger');
    expect(within(confirm).getByText('Eliminar').props.className).toBe(
      'text-17 font-extrabold text-danger-foreground',
    );
  });
});
