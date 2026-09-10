import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { router, useFocusEffect } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';

import { listPets } from '../../api/pets';
import { petKeys, reminderKeys } from '../../api/query-keys';
import {
  deleteReminder,
  listReminders,
  type DeleteReminderState,
  type RemindersState,
} from '../../api/reminders';
import type { PetProfile, Reminder } from '../../api/types';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { SelectedPetProvider } from '../../providers/selected-pet-provider';
import { RemindersScreen } from '.';
import { renderWithProviders } from '../../../test/render-with-providers';

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
  router: { push: jest.fn(), back: jest.fn() },
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
  return render(<RemindersScreen />, { wrapper: RemindersWrapper });
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

  it('uses uniform metrics, selects the first pet, and shows row skeletons', async () => {
    mockListReminders.mockReturnValue(pending<RemindersState>());

    await renderReminders();

    expect(screen.getByTestId('screen-reminders')).toBeVisible();
    expect(screen.getByText('Recordatorios')).toBeVisible();
    expect(
      screen.getByTestId('screen-reminders').props.contentContainerStyle,
    ).toEqual({
      padding: 24,
      gap: 16,
      paddingTop: 52,
      paddingBottom: 120,
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
      expect(screen.getByTestId('reminders-empty')).toHaveTextContent(
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
    expect(upcoming.getByText('💉')).toBeVisible();
    expect(upcoming.getByText('Vacuna')).toBeVisible();
    expect(upcoming.getByText('Rabies booster')).toBeVisible();
    expect(
      upcoming.getByText(
        new Date(reminders[2].dueAt).toLocaleDateString('es-MX'),
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

      expect(formatDate).toHaveBeenCalledWith('es-MX');
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
    const vaccineTile = vaccineRow.getByText('💉').parent;
    const medicationTile = medicationRow.getByText('💊').parent;

    expect(vaccineTile?.props.className).toContain('bg-category-blue');
    expect(medicationTile?.props.className).toContain('bg-category-amber');
    expect(vaccineTile?.props.className).not.toContain('bg-accent-soft');
    expect(medicationTile?.props.className).not.toContain('bg-accent-soft');
    expect(vaccineRow.getByText('💉')).toBeVisible();
    expect(vaccineRow.getByText('Vacuna')).toBeVisible();
    expect(medicationRow.getByText('💊')).toBeVisible();
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
