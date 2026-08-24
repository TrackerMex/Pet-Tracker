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
import {
  deleteReminder,
  listReminders,
  type DeleteReminderState,
  type RemindersState,
} from '../../api/reminders';
import type { PetProfile, Reminder } from '../../api/types';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { SelectedPetProvider } from '../../providers/selected-pet-provider';
import { RemindersScreen } from '.';

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

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens,
}));

jest.mock('@expo/ui', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const {
    Pressable,
    Text,
    View,
  } = jest.requireActual<typeof import('react-native')>('react-native');

  return {
    BottomSheet: ({
      children,
      isPresented,
      ...props
    }: Record<string, unknown>) =>
      isPresented
        ? React.createElement(
            View as unknown as React.ComponentType<Record<string, unknown>>,
            { ...props, isPresented },
            children as never,
          )
        : null,
    Button: ({
      children,
      label,
      ...props
    }: Record<string, unknown>) =>
      React.createElement(
        Pressable,
        props,
        (children as never) ?? React.createElement(Text, null, label as string),
      ),
    Column: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(View, props, children as never),
    Host: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(View, props, children as never),
    Text: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(Text, props, children as never),
  };
});

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
      <SelectedPetProvider>{children}</SelectedPetProvider>
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
  expect(screen.getByText('Delete reminder?')).toBeVisible();
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
    expect(screen.getByText('Reminders')).toBeVisible();
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
        'No reminders yet',
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
        'Something went wrong',
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
      within(screen.getByTestId('pill-week')).getByText('This week'),
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
    expect(upcoming.getByText('Vaccine')).toBeVisible();
    expect(upcoming.getByText('Rabies booster')).toBeVisible();
    expect(
      upcoming.getByText(new Date(reminders[2].dueAt).toLocaleDateString()),
    ).toBeVisible();
    expect(upcoming.getByText('· in 3 days')).toBeVisible();
    expect(screen.getByTestId('reminder-upcoming-upcoming')).toHaveTextContent(
      'Upcoming!',
    );
    expect(screen.queryByTestId('reminder-upcoming-later')).toBeNull();

    expect(screen.getByTestId('reminder-row-sent').props.className).toContain(
      'opacity-50',
    );
    expect(screen.getByTestId('reminder-status-sent')).toHaveTextContent('Sent');
    expect(
      screen.getByTestId('reminder-row-cancelled').props.className,
    ).toContain('opacity-50');
    expect(screen.getByTestId('reminder-status-cancelled')).toHaveTextContent(
      'Cancelled',
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
    [{ kind: 'forbidden' }, 'Only the owner can delete'],
    [{ kind: 'unreachable', message: 'offline' }, 'Cannot reach server'],
    [{ kind: 'error' }, 'Something went wrong'],
    [{ kind: 'missing-config' }, 'Something went wrong'],
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
