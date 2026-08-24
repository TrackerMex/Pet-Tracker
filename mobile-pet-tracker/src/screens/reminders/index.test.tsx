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

import { listPets, type PetsState } from '../../api/pets';
import { listReminders, type RemindersState } from '../../api/reminders';
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
