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
import { Platform } from 'react-native';

import {
  createReminder,
  type CreateReminderState,
} from '../../api/reminders';
import type { Reminder } from '../../api/types';
import { es } from '../../i18n/catalog';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import {
  SelectedPetProvider,
  useSelectedPet,
} from '../../providers/selected-pet-provider';
import { AddReminderScreen } from '.';
import { TOUCH_SLOP } from '../../theme/touch-target';

jest.mock('../../api/reminders', () => ({
  createReminder: jest.fn(),
}));

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
}));


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
      <LanguageProvider initial="es">
        <SelectedPetProvider>
          {selected ? <SelectionProbe /> : null}
          <AddReminderScreen />
        </SelectedPetProvider>
      </LanguageProvider>
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

  describe('#114 R7: sin mascota, add-reminder desapila hasta reminders', () => {
    it('desapila una vez y no pinta el formulario ni una ruta de reemplazo', async () => {
      await renderAddReminder(false);

      expect(mockRouter.dismissTo).toHaveBeenCalledTimes(1);
      expect(mockRouter.dismissTo).toHaveBeenCalledWith('/reminders');
      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(mockRouter.back).not.toHaveBeenCalled();
      expect(screen.queryByTestId('screen-add-reminder')).toBeNull();
      expect(screen.queryByTestId('add-reminder-redirect')).toBeNull();
    });
  });

  it('uses the metrics under the native header (#95 R6)', async () => {
    await renderAddReminder();

    await waitFor(() =>
      expect(screen.getByTestId('screen-add-reminder')).toBeVisible(),
    );
    expect(
      screen.getByTestId('screen-add-reminder').props.contentContainerStyle,
    ).toEqual({
      padding: 24,
      gap: 16,
      paddingBottom: 48,
    });
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
    expect(screen.getByText('💉 Vacuna')).toBeVisible();
    expect(screen.getByText('📌 Otro')).toBeVisible();
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

    expect(screen.getByText('Elige una fecha')).toBeVisible();
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
    expect(
      screen.getByText(selectedDate.toLocaleDateString('es-MX')),
    ).toBeVisible();
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
        selectedTime.toLocaleTimeString('es-MX', {
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
    expect(screen.getByText('Elige una fecha')).toBeVisible();
  });

  it('renders alert choices and selects seven days by default', async () => {
    await renderAddReminder();
    await waitFor(() =>
      expect(screen.getByTestId('advance-chip-10080')).toBeVisible(),
    );

    expect(screen.getAllByTestId(/^advance-chip-/)).toHaveLength(4);
    expect(
      screen.getByTestId('advance-chip-10080').props.accessibilityState,
    ).toEqual({ selected: true, disabled: false });
    await fireEvent.press(screen.getByTestId('advance-chip-1440'));
    expect(
      screen.getByTestId('advance-chip-1440').props.accessibilityState,
    ).toEqual({ selected: true, disabled: false });
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
      'El título es obligatorio',
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
      'Elige una fecha',
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
      'La fecha debe ser futura',
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
    await pickDate(new Date(2026, 7, 28, 12, 0));
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
          dueAt: new Date(2026, 7, 28, 9, 0).toISOString(),
          advanceMinutes: 1440,
        },
      ),
    );
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it.each([
    [{ kind: 'forbidden' }, 'Solo el dueño puede crear recordatorios'],
    [{ kind: 'invalid' }, 'La fecha debe ser futura'],
    [{ kind: 'unreachable', message: 'offline' }, 'No se pudo conectar con el servidor'],
    [{ kind: 'error' }, 'Algo salió mal'],
    [{ kind: 'missing-config' }, 'Algo salió mal'],
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

describe('#61 R10: los controles táctiles declaran TOUCH_SLOP', () => {
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

  it.each(['type-chip-vaccine', 'advance-chip-1440'])(
    '%s llega a 44 pt sin crecer a la vista',
    async (testID) => {
      await renderAddReminder();

      await waitFor(() => expect(screen.getByTestId(testID)).toBeVisible());

      expect(screen.getByTestId(testID).props.hitSlop).toEqual(TOUCH_SLOP);
    },
  );
});

describe('#62 R12: el placeholder del formulario sale del tema', () => {
  const muted = '#667085';
  const themeColors = jest.requireActual<
    typeof import('../../theme/use-theme-colors')
  >('../../theme/use-theme-colors');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(themeColors, 'useThemeColors').mockImplementation(
      ((tokens: readonly string[]) =>
        tokens.map((token) => (token === 'muted' ? muted : '#0D1117'))) as typeof themeColors.useThemeColors,
    );
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateReminder.mockReturnValue(pending());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('usa muted en title-input', async () => {
    await renderAddReminder();

    expect(
      (await screen.findByTestId('title-input')).props.placeholderTextColor,
    ).toBe(muted);
  });
});

describe('#95 R5: la pantalla no dibuja cabecera propia', () => {
  it('retira el botón y el título del cuerpo', async () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() });
    mockCreateReminder.mockReturnValue(pending());
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('screen-add-reminder')).toBeVisible());
    expect(screen.queryByTestId('add-reminder-back')).toBeNull();
    expect(screen.queryByText(es['addReminder.addReminder'])).toBeNull();
  });
});

const originalPlatform = Platform.OS;

function setPlatform(os: string): void {
  Object.defineProperty(Platform, 'OS', { configurable: true, value: os });
}

function wallClock(local: number[], utc: number[]): Date {
  return Object.assign(new Date(local[0], local[1], local[2], local[3], local[4]), {
    getUTCFullYear: () => utc[0],
    getUTCMonth: () => utc[1],
    getUTCDate: () => utc[2],
  });
}

describe('#123: pickers de fecha de Nuevo recordatorio en Android a las 20:00 del 24 de septiembre', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 24, 20, 0));
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateReminder.mockResolvedValue({ kind: 'ok', reminder: makeReminder() });
    setPlatform('android');
  });

  afterEach(() => {
    setPlatform(originalPlatform);
    jest.useRealTimers();
  });

  describe('#123 R4: Nuevo recordatorio muestra y guarda el día elegido', () => {
    it.each([
      ['elegir hoy (24 de septiembre) guarda hoy', [2026, 8, 23, 18, 0], [2026, 8, 24], '24/9/2026', new Date(2026, 8, 24, 21, 30).toISOString(), 0],
      ['elegir el 1 de octubre guarda el 1 de octubre (cruce de mes)', [2026, 8, 30, 18, 0], [2026, 9, 1], '1/10/2026', new Date(2026, 9, 1, 21, 30).toISOString(), 10080],
      ['elegir el 1 de enero de 2027 guarda el 1 de enero (cruce de año)', [2026, 11, 31, 18, 0], [2027, 0, 1], '1/1/2027', new Date(2027, 0, 1, 21, 30).toISOString(), 10080],
    ] as [string, number[], number[], string, string, number][])('%s', async (_title, local, utc, etiqueta, dueAt, aviso) => {
      await renderAddReminder();
      await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());
      await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
      await pickDate(wallClock(local, utc));
      await fireEvent.press(screen.getByTestId('time-field'));
      const timePicker = within(screen.getByTestId('expo-ui-picker-host')).getByTestId('time-picker');
      await fireEvent(timePicker, 'onValueChange', {}, new Date(2026, 8, 24, 21, 30));
      expect(within(screen.getByTestId('date-field')).getByText(etiqueta)).toBeVisible();
      await fireEvent.press(screen.getByTestId('add-reminder-submit'));
      await waitFor(() => expect(mockCreateReminder).toHaveBeenCalledWith(
        'http://example.test/v1',
        'jwt-token',
        'pet-1',
        { type: 'vaccine', title: 'Rabies', dueAt, advanceMinutes: aviso },
      ));
    });
  });

  describe('#123 R5: el calendario de Nuevo recordatorio abre en el día local; el mínimo y la hora no se convierten', () => {
    it('abre en el 24, con el mínimo en el instante actual y la hora a las 09:00', async () => {
      await renderAddReminder();
      await waitFor(() => expect(screen.getByTestId('date-field')).toBeVisible());
      await fireEvent.press(screen.getByTestId('date-field'));
      const picker = within(screen.getByTestId('expo-ui-picker-host')).getByTestId('date-picker');
      expect((picker.props.value as Date).toISOString()).toBe('2026-09-24T00:00:00.000Z');
      expect((picker.props.minimumDate as Date).getTime()).toBe(new Date(2026, 8, 24, 20, 0).getTime());
      await fireEvent(picker, 'onDismiss');
      await fireEvent.press(screen.getByTestId('time-field'));
      expect((within(screen.getByTestId('expo-ui-picker-host')).getByTestId('time-picker').props.value as Date).getTime()).toBe(new Date(2026, 8, 24, 9, 0).getTime());
    });
  });
});

const ADVANCES = [0, 1440, 4320, 10080] as const;
const CHIP_SELECTED = 'rounded-full border border-accent bg-accent-soft px-3 py-2';
const CHIP_IDLE = 'rounded-full border border-border bg-default px-3 py-2';

function expectAdvanceChips(disabled: boolean[], selected: number) {
  ADVANCES.forEach((minutes, i) => {
    const chip = screen.getByTestId(`advance-chip-${minutes}`);
    expect(chip.props.accessibilityState).toEqual({
      selected: minutes === selected,
      disabled: disabled[i],
    });
    expect(chip.props.className).toBe(
      (minutes === selected ? CHIP_SELECTED : CHIP_IDLE) + (disabled[i] ? ' opacity-50' : ''),
    );
  });
}

async function pickTime(hours: number, minutes: number) {
  await fireEvent.press(screen.getByTestId('time-field'));
  await fireEvent(
    within(screen.getByTestId('expo-ui-picker-host')).getByTestId('time-picker'),
    'onValueChange',
    {},
    new Date(2026, 0, 1, hours, minutes),
  );
}

describe('#125: avisos que ya pasaron en Nuevo recordatorio', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateReminder.mockResolvedValue({ kind: 'ok', reminder: makeReminder() });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('#125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro', () => {
    it.each([
      ['a 7 días justos del 1 de julio, el aviso de 7 días cae en el instante actual y cuenta como pasado (cruce de mes)', [2026, 5, 24, 9, 0], [2026, 6, 1], [false, false, false, true], 4320, 4320],
      ['a 7 días y 1 minuto del 1 de julio, el aviso de 7 días sigue en el futuro (cruce de mes)', [2026, 5, 24, 8, 59], [2026, 6, 1], [false, false, false, false], 10080, 10080],
      ['el 1 de enero de 2027 desde el mediodía del 29 de diciembre queda el aviso de 1 día (cruce de año)', [2026, 11, 29, 12, 0], [2027, 0, 1], [false, false, true, true], 1440, 1440],
      ['el 1 de octubre desde la noche del 30 de septiembre solo queda el mismo día (cruce de mes)', [2026, 8, 30, 20, 0], [2026, 9, 1], [false, true, true, true], 0, 0],
      ['el 30 de septiembre a 3 días justos, el aviso de 3 días cuenta como pasado', [2026, 8, 27, 9, 0], [2026, 8, 30], [false, false, true, true], 1440, 1440],
      ['el 1 de enero de 2027 a 1 día justo, el aviso de 1 día cuenta como pasado (cruce de año)', [2026, 11, 31, 9, 0], [2027, 0, 1], [false, true, true, true], 0, 0],
      ['a la hora exacta del recordatorio todos cuentan como pasados y el formulario lo rechaza', [2026, 9, 1, 9, 0], [2026, 9, 1], [true, true, true, true], 10080, null],
    ] as [string, number[], number[], boolean[], number, number | null][])('%s', async (_title, ahora, dia, desactivados, seleccionado, enviado) => {
      jest.setSystemTime(new Date(ahora[0], ahora[1], ahora[2], ahora[3], ahora[4]));
      await renderAddReminder();
      await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());
      await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
      await pickDate(new Date(dia[0], dia[1], dia[2], 12, 0));

      expectAdvanceChips(desactivados, seleccionado);
      await fireEvent.press(screen.getByTestId('add-reminder-submit'));
      if (enviado === null) {
        expect(screen.getByTestId('add-reminder-error')).toHaveTextContent('La fecha debe ser futura');
        expect(mockCreateReminder).not.toHaveBeenCalled();
      } else {
        await waitFor(() => expect(mockCreateReminder).toHaveBeenCalledWith(
          'http://example.test/v1',
          'jwt-token',
          'pet-1',
          { type: 'vaccine', title: 'Rabies', dueAt: new Date(dia[0], dia[1], dia[2], 9, 0).toISOString(), advanceMinutes: enviado },
        ));
      }
    });

    it('pulsar un chip desactivado no cambia la selección', async () => {
      jest.setSystemTime(new Date(2026, 5, 24, 9, 0));
      await renderAddReminder();
      await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());
      await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
      await pickDate(new Date(2026, 6, 1, 12, 0));
      await fireEvent.press(screen.getByTestId('advance-chip-0'));
      await fireEvent.press(screen.getByTestId('advance-chip-10080'));
      expectAdvanceChips([false, false, false, true], 0);
      await fireEvent.press(screen.getByTestId('add-reminder-submit'));
      await waitFor(() => expect(mockCreateReminder).toHaveBeenCalledWith(
        'http://example.test/v1',
        'jwt-token',
        'pet-1',
        { type: 'vaccine', title: 'Rabies', dueAt: new Date(2026, 6, 1, 9, 0).toISOString(), advanceMinutes: 0 },
      ));
    });

    it('al cambiar fecha u hora se recalcula: la elección explícita se conserva mientras siga en el futuro y vuelve cuando deja de estar en el pasado', async () => {
      jest.setSystemTime(new Date(2026, 8, 24, 8, 0));
      await renderAddReminder();
      await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());
      await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
      await pickDate(new Date(2026, 9, 10, 12, 0));
      expectAdvanceChips([false, false, false, false], 10080);
      await fireEvent.press(screen.getByTestId('advance-chip-1440'));
      expectAdvanceChips([false, false, false, false], 1440);
      await pickDate(new Date(2026, 8, 25, 12, 0));
      expectAdvanceChips([false, false, true, true], 1440);
      await pickTime(7, 0);
      expectAdvanceChips([false, true, true, true], 0);
      await pickTime(9, 0);
      expectAdvanceChips([false, false, true, true], 1440);
      await fireEvent.press(screen.getByTestId('add-reminder-submit'));
      await waitFor(() => expect(mockCreateReminder).toHaveBeenCalledWith(
        'http://example.test/v1',
        'jwt-token',
        'pet-1',
        { type: 'vaccine', title: 'Rabies', dueAt: new Date(2026, 8, 25, 9, 0).toISOString(), advanceMinutes: 1440 },
      ));
    });
  });
});
