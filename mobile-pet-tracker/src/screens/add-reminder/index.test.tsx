import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect } from 'react';

import {
  createReminder,
  type CreateReminderState,
} from '../../api/reminders';
import type { Reminder } from '../../api/types';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import {
  SelectedPetProvider,
  useSelectedPet,
} from '../../providers/selected-pet-provider';
import { AddReminderScreen } from '.';

jest.mock('../../api/reminders', () => ({
  createReminder: jest.fn(),
}));

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
      const props = { testID: 'add-reminder-redirect', href };

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

const mockCreateReminder = jest.mocked(createReminder);
const mockUseAuth = jest.mocked(useAuth);
const mockRouter = jest.mocked(router);

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

async function renderAddReminder(selected = true) {
  return render(
    <HeroUINativeProvider>
      <SelectedPetProvider>
        {selected ? <SelectionProbe /> : null}
        <AddReminderScreen />
      </SelectedPetProvider>
    </HeroUINativeProvider>,
  );
}

async function pickDate(date: Date) {
  await fireEvent.press(screen.getByTestId('date-field'));
  await fireEvent(
    screen.getByTestId('date-picker'),
    'onValueChange',
    { nativeEvent: { timestamp: date.getTime(), utcOffset: 0 } },
    date,
  );
}

function makeReminder(overrides: Partial<Reminder> = {}): Reminder {
  return {
    id: 'reminder-1',
    petId: 'pet-1',
    type: 'vaccine',
    title: 'Annual vaccine',
    dueAt: '2026-08-25T09:00:00.000Z',
    advanceMinutes: 10080,
    status: 'scheduled',
    ...overrides,
  };
}

describe('R8: formulario de alta con chips y pickers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateReminder.mockReturnValue(pending());
  });

  it('redirects a cold deep-link without a selected pet', async () => {
    await renderAddReminder(false);

    expect(screen.getByTestId('add-reminder-redirect').props.href).toBe(
      '/reminders',
    );
    expect(screen.queryByTestId('screen-add-reminder')).toBeNull();
  });

  it('uses uniform metrics and navigates back', async () => {
    await renderAddReminder();

    await waitFor(() =>
      expect(screen.getByTestId('screen-add-reminder')).toBeVisible(),
    );
    expect(screen.getByText('Add reminder')).toBeVisible();
    expect(
      screen.getByTestId('screen-add-reminder').props.contentContainerStyle,
    ).toEqual({
      padding: 24,
      gap: 16,
      paddingTop: 52,
      paddingBottom: 120,
    });
    await fireEvent.press(screen.getByTestId('add-reminder-back'));
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it('renders all reminder types and selects vaccine by default', async () => {
    await renderAddReminder();
    await waitFor(() =>
      expect(screen.getByTestId('type-chip-vaccine')).toBeVisible(),
    );

    expect(screen.getAllByTestId(/^type-chip-/)).toHaveLength(7);
    expect(screen.getByTestId('type-chip-vaccine').props.accessibilityState).toEqual({
      selected: true,
    });
    expect(screen.getByText('💉 Vaccine')).toBeVisible();
    expect(screen.getByText('📌 Other')).toBeVisible();
    expect(screen.getByTestId('title-input').props.maxLength).toBe(120);

    await fireEvent.press(screen.getByTestId('type-chip-custom'));
    expect(screen.getByTestId('type-chip-custom').props.accessibilityState).toEqual({
      selected: true,
    });
  });

  it('opens the date picker and reflects the selected date', async () => {
    const selectedDate = new Date(2026, 8, 15, 12, 30);
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('date-field')).toBeVisible());

    expect(screen.getByText('Select a date')).toBeVisible();
    expect(screen.queryByTestId('date-picker')).toBeNull();
    await fireEvent.press(screen.getByTestId('date-field'));

    const picker = within(
      screen.getByTestId('expo-ui-picker-host'),
    ).getByTestId('date-picker');
    expect(picker.props.mode).toBe('date');
    expect(picker.props.presentation).toBe('dialog');
    expect(picker.props.minimumDate).toBeInstanceOf(Date);
    await fireEvent(
      picker,
      'onValueChange',
      { nativeEvent: { timestamp: selectedDate.getTime(), utcOffset: 0 } },
      selectedDate,
    );

    expect(screen.queryByTestId('date-picker')).toBeNull();
    expect(screen.getByText(selectedDate.toLocaleDateString())).toBeVisible();
  });

  it('opens the time picker with 09:00 and reflects a new time', async () => {
    const selectedTime = new Date(2026, 7, 24, 14, 45);
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('time-field')).toBeVisible());
    await fireEvent.press(screen.getByTestId('time-field'));

    const picker = within(
      screen.getByTestId('expo-ui-picker-host'),
    ).getByTestId('time-picker');
    expect(picker.props.mode).toBe('time');
    expect(picker.props.presentation).toBe('dialog');
    expect((picker.props.value as Date).getHours()).toBe(9);
    expect((picker.props.value as Date).getMinutes()).toBe(0);
    await fireEvent(
      picker,
      'onValueChange',
      { nativeEvent: { timestamp: selectedTime.getTime(), utcOffset: 0 } },
      selectedTime,
    );

    expect(screen.queryByTestId('time-picker')).toBeNull();
    expect(
      screen.getByText(
        selectedTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      ),
    ).toBeVisible();
  });

  it('closes the Expo UI dialog when the native picker is dismissed', async () => {
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('date-field')).toBeVisible());

    await fireEvent.press(screen.getByTestId('date-field'));
    await fireEvent(
      within(screen.getByTestId('expo-ui-picker-host')).getByTestId(
        'date-picker',
      ),
      'onDismiss',
    );

    expect(screen.queryByTestId('date-picker')).toBeNull();
    expect(screen.getByText('Select a date')).toBeVisible();
  });

  it('renders alert choices and selects seven days by default', async () => {
    await renderAddReminder();
    await waitFor(() =>
      expect(screen.getByTestId('advance-chip-10080')).toBeVisible(),
    );

    expect(screen.getAllByTestId(/^advance-chip-/)).toHaveLength(4);
    expect(
      screen.getByTestId('advance-chip-10080').props.accessibilityState,
    ).toEqual({ selected: true });
    await fireEvent.press(screen.getByTestId('advance-chip-1440'));
    expect(
      screen.getByTestId('advance-chip-1440').props.accessibilityState,
    ).toEqual({ selected: true });
    expect(screen.getByTestId('add-reminder-submit')).toBeVisible();
  });
});

describe('R9: guardar con validación y degradación por kind', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 7, 24, 10, 0));
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('requires a non-blank title without calling the API', async () => {
    mockCreateReminder.mockResolvedValue({ kind: 'error' });
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());

    await fireEvent.changeText(screen.getByTestId('title-input'), '   ');
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));

    expect(screen.getByTestId('add-reminder-error')).toHaveTextContent(
      'Title is required',
    );
    expect(mockCreateReminder).not.toHaveBeenCalled();
  });

  it('requires a selected date without calling the API', async () => {
    mockCreateReminder.mockResolvedValue({ kind: 'error' });
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());

    await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));

    expect(screen.getByTestId('add-reminder-error')).toHaveTextContent(
      'Pick a date',
    );
    expect(mockCreateReminder).not.toHaveBeenCalled();
  });

  it('rejects a combined date-time that is not in the future', async () => {
    mockCreateReminder.mockResolvedValue({ kind: 'error' });
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());

    await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
    await pickDate(new Date(2026, 7, 24, 12, 0));
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));

    expect(screen.getByTestId('add-reminder-error')).toHaveTextContent(
      'Date must be in the future',
    );
    expect(mockCreateReminder).not.toHaveBeenCalled();
  });

  it('posts the exact trimmed input and navigates back on success', async () => {
    mockCreateReminder.mockResolvedValue({
      kind: 'ok',
      reminder: makeReminder({
        type: 'appointment',
        advanceMinutes: 1440,
      }),
    });
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());

    await fireEvent.press(screen.getByTestId('type-chip-appointment'));
    await fireEvent.changeText(
      screen.getByTestId('title-input'),
      '  Annual vaccine  ',
    );
    await pickDate(new Date(2026, 7, 25, 12, 0));
    await fireEvent.press(screen.getByTestId('advance-chip-1440'));
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));

    await waitFor(() =>
      expect(mockCreateReminder).toHaveBeenCalledWith(
        'http://example.test/v1',
        'jwt-token',
        'pet-1',
        {
          type: 'appointment',
          title: 'Annual vaccine',
          dueAt: new Date(2026, 7, 25, 9, 0).toISOString(),
          advanceMinutes: 1440,
        },
      ),
    );
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it.each([
    [{ kind: 'forbidden' }, 'Only the owner can create reminders'],
    [{ kind: 'invalid' }, 'Date must be in the future'],
    [{ kind: 'unreachable', message: 'offline' }, 'Cannot reach server'],
    [{ kind: 'error' }, 'Something went wrong'],
    [{ kind: 'missing-config' }, 'Something went wrong'],
  ] as [CreateReminderState, string][])(
    'shows the form error for $state.kind',
    async (createState, message) => {
      mockCreateReminder.mockResolvedValue(createState);
      await renderAddReminder();
      await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());

      await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
      await pickDate(new Date(2026, 7, 25, 12, 0));
      await fireEvent.press(screen.getByTestId('add-reminder-submit'));

      await waitFor(() =>
        expect(screen.getByTestId('add-reminder-error')).toHaveTextContent(
          message,
        ),
      );
      expect(mockRouter.back).not.toHaveBeenCalled();
    },
  );

  it('disables submit while the request is pending', async () => {
    mockCreateReminder.mockReturnValue(pending<CreateReminderState>());
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());

    await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
    await pickDate(new Date(2026, 7, 25, 12, 0));
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));

    expect(
      screen.getByTestId('add-reminder-submit').props.accessibilityState,
    ).toEqual(expect.objectContaining({ disabled: true }));
  });
});
