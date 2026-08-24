import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect } from 'react';

import { createReminder } from '../../api/reminders';
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

jest.mock('@react-native-community/datetimepicker', () => {
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

    const picker = screen.getByTestId('date-picker');
    expect(picker.props.mode).toBe('date');
    expect(picker.props.minimumDate).toBeInstanceOf(Date);
    await fireEvent(picker, 'onChange', { type: 'set' }, selectedDate);

    expect(screen.queryByTestId('date-picker')).toBeNull();
    expect(screen.getByText(selectedDate.toLocaleDateString())).toBeVisible();
  });

  it('opens the time picker with 09:00 and reflects a new time', async () => {
    const selectedTime = new Date(2026, 7, 24, 14, 45);
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('time-field')).toBeVisible());
    await fireEvent.press(screen.getByTestId('time-field'));

    const picker = screen.getByTestId('time-picker');
    expect(picker.props.mode).toBe('time');
    expect((picker.props.value as Date).getHours()).toBe(9);
    expect((picker.props.value as Date).getMinutes()).toBe(0);
    await fireEvent(picker, 'onChange', { type: 'set' }, selectedTime);

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
