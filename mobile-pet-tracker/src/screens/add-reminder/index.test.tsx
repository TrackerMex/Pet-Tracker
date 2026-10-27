import { HeaderHeightContext } from 'expo-router/react-navigation';
import {
  act,
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect } from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';

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
    Bell: mockIcon('add-reminder-icon-bell'),
    Repeat: mockIcon('add-reminder-icon-repeat'),
    Minus: mockIcon('add-reminder-icon-minus'),
    Plus: mockIcon('add-reminder-icon-plus'),
    Calendar: mockIcon('add-reminder-icon-calendar'),
    Clock: mockIcon('add-reminder-icon-clock'),
  };
});

const mockChunkyLip = {
  primary: { boxShadow: [{ offsetX: 0, offsetY: 4, color: 'mock-lip' }] },
  primaryCompact: { boxShadow: [{ offsetX: 0, offsetY: 3, color: 'mock-lip' }] },
};

jest.mock('../../theme/chunky-lip', () => ({ useChunkyLip: () => mockChunkyLip }));

jest.mock('../../api/reminders', () => ({
  createReminder: jest.fn(),
}));

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), dismissTo: jest.fn(), canGoBack: jest.fn(), replace: jest.fn() },
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

async function renderAddReminder(selected = true, language: 'en' | 'es' = 'es') {
  return render(
    <HeroUINativeProvider>
      <LanguageProvider initial={language}>
        <SelectedPetProvider>
          {selected ? <SelectionProbe /> : null}
          <HeaderHeightContext.Provider value={91}>
            <AddReminderScreen />
          </HeaderHeightContext.Provider>
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

async function pickUntil(date: Date) {
  expect(screen.queryByTestId('until-field')).not.toBeNull();
  await fireEvent.press(screen.getByTestId('until-field'));
  await fireEvent(screen.getByTestId('until-picker'), 'onValueChange', {}, date);
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
    recurrence: null,
    recurrenceUntil: null,
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

  it('uses the metrics under the native header (#95 R6) (enmendado por #204 R10)', async () => {
    await renderAddReminder();

    await waitFor(() =>
      expect(screen.getByTestId('screen-add-reminder')).toBeVisible(),
    );
    expect(
      screen.getByTestId('add-reminder-form').props.contentContainerStyle,
    ).toEqual({
      paddingHorizontal: 20,
      paddingTop: 52,
      gap: 16,
      paddingBottom: 48,
      flexGrow: 1,
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
    expect(screen.getByText('Vacuna')).toBeVisible(); // #178 R6
    expect(screen.getByText('Otro')).toBeVisible();
    expect(screen.getByTestId('title-input').props.maxLength).toBe(120);

    await fireEvent.press(screen.getByTestId('type-chip-custom'));
    expect(screen.getByTestId('type-chip-custom').props.accessibilityState).toEqual({
      selected: true,
    });
  });

  it('opens the date picker and reflects the selected date (enmendado por #220 R15)', async () => {
    const selectedDate = new Date(2026, 8, 15, 12, 30);
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('date-field')).toBeVisible());

    expect(screen.getByTestId('date-field-value').props.placeholder).toBe('Elige una fecha');
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
    expect(screen.getByTestId('date-field-value').props.value).toBe('15 sep 2026');
  });

  it('opens the time picker with 09:00 and reflects a new time (enmendado por #220 R15)', async () => {
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
    expect(screen.getByTestId('time-field-value').props.value).toBe('14:45');
  });

  it('closes the Expo UI dialog when the native picker is dismissed (enmendado por #220 R15)', async () => {
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
    expect(screen.getByTestId('date-field-value').props.placeholder).toBe('Elige una fecha');
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

  it('#186 R5: título vacío muestra su error de campo sin bloquear', async () => {
    mockCreateReminder.mockResolvedValue({ kind: 'error' });
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());

    await fireEvent.changeText(screen.getByTestId('title-input'), '   ');
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));

    await waitFor(() => expect(screen.queryByTestId('title-input-message')).toHaveTextContent('El título es obligatorio'));
    expect(screen.queryByTestId('add-reminder-error')).toBeNull();
    expect(screen.getByTestId('add-reminder-submit')).not.toBeDisabled();
    expect(mockCreateReminder).not.toHaveBeenCalled();
  });

  it('#186 R5: fecha ausente muestra su error bajo la columna (enmendado por #220 R15)', async () => {
    mockCreateReminder.mockResolvedValue({ kind: 'error' });
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());

    await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));

    await waitFor(() => expect(screen.queryByTestId('date-field-message')).toHaveTextContent('Elige una fecha'));
    expect(screen.queryByTestId('add-reminder-error')).toBeNull();
    expect(screen.getByTestId('add-reminder-submit')).not.toBeDisabled();
    const field = screen.getByTestId('date-field');
    expect(field.children).toHaveLength(1);
    expect(screen.getByTestId('date-field-value').parent?.children).toHaveLength(2);
    expect(field.parent!.props.className).toBe('flex-3 gap-1.5');
    expect(within(field.parent!).queryByTestId('date-field-message')).toHaveTextContent('Elige una fecha');
    expect(within(field).queryByTestId('date-field-message')).toBeNull();
    expect(mockCreateReminder).not.toHaveBeenCalled();
  });

  it('#186 R5: fecha pasada muestra su error de campo sin bloquear', async () => {
    mockCreateReminder.mockResolvedValue({ kind: 'error' });
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());

    await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
    await pickDate(new Date(2026, 7, 24, 12, 0));
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));

    await waitFor(() => expect(screen.queryByTestId('date-field-message')).toHaveTextContent('La fecha debe ser futura'));
    expect(screen.queryByTestId('add-reminder-error')).toBeNull();
    expect(screen.getByTestId('add-reminder-submit')).not.toBeDisabled();
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
  it('#186 R5: título y fecha inválidos muestran las dos filas', async () => {
    await renderAddReminder();
    await screen.findByTestId('title-input');
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));
    await waitFor(() => expect(screen.queryByTestId('title-input-message')).toHaveTextContent('El título es obligatorio'));
    expect(screen.queryByTestId('title-input-message-row')).not.toBeNull();
    expect(screen.queryByTestId('date-field-message-row')).not.toBeNull();
    expect(mockCreateReminder).not.toHaveBeenCalled();
  });

  it('#186 R5: conserva los mensajes hasta reenviar y después manda el payload recortado', async () => {
    mockCreateReminder.mockReturnValue(pending());
    await renderAddReminder();
    await screen.findByTestId('title-input');
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));
    await waitFor(() => expect(screen.queryByTestId('title-input-message')).toHaveTextContent('El título es obligatorio'));
    await fireEvent.changeText(screen.getByTestId('title-input'), ' Rabies ');
    await pickDate(new Date(2026, 7, 25, 12, 0));
    expect(screen.queryByTestId('title-input-message')).toHaveTextContent('El título es obligatorio');
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));
    await waitFor(() => expect(screen.getByTestId('add-reminder-submit')).toBeDisabled());
    expect(screen.queryAllByTestId(/-message-row$/)).toHaveLength(0);
    expect(mockCreateReminder).toHaveBeenCalledTimes(1);
    expect(mockCreateReminder).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', {
      type: 'vaccine', title: 'Rabies', dueAt: new Date(2026, 7, 25, 9, 0).toISOString(), advanceMinutes: 0,
    });
  });

  it('#186 R5: el 400 sigue como aviso de formulario sin mensajes de campo', async () => {
    mockCreateReminder.mockResolvedValue({ kind: 'invalid' });
    await renderAddReminder();
    await screen.findByTestId('title-input');
    await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
    await pickDate(new Date(2026, 7, 25, 12, 0));
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));
    await waitFor(() => expect(screen.queryByTestId('add-reminder-error')).toHaveTextContent('La fecha debe ser futura'));
    expect(screen.queryAllByTestId(/-message-row$/)).toHaveLength(0);
  });

  it('#186 R5: conserva maxLength 120 en el título', async () => {
    await renderAddReminder();
    await screen.findByTestId('title-input');
    expect(screen.getByTestId('title-input').props.maxLength).toBe(120);
  });

  it('#186 R5: el título inválido se traduce al inglés', async () => {
    await renderAddReminder(true, 'en');
    await screen.findByTestId('title-input');
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));
    await waitFor(() => expect(screen.queryByTestId('title-input-message')).toHaveTextContent('Title is required'));
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

describe('#178 R10: marco, título y chips de tipo del canvas', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateReminder.mockReturnValue(pending());
    await renderAddReminder();
    await screen.findByTestId('title-input');
  });

  it('usa el marco 20/24/16 bajo la cabecera nativa (enmendado por #204 R10)', () => {
    expect(screen.getByTestId('add-reminder-form').props.contentContainerStyle).toEqual({
      paddingHorizontal: 20, paddingTop: 52, gap: 16, paddingBottom: 48, flexGrow: 1,
    });
  });

  it('abre el formulario con Agregar recordatorio como título accesible (enmendado por #204 R10)', () => {
    const title = screen.getByTestId('add-reminder-title');
    expect(title).toHaveTextContent('Agregar recordatorio');
    expect(title.props.accessibilityRole).toBe('header');
    expect(title.props.className).toBe('text-24 font-black tracking-title text-foreground');
    expect(title.parent?.children[0]).toBe(title);
  });

  it('da a las cinco etiquetas y sus secciones las recetas del canvas', () => {
    for (const [label, gap] of [
      ['Tipo', 'gap-2'], ['Título', 'gap-1.5'], ['Fecha', 'gap-1.5'],
      ['Hora', 'gap-1.5'], ['Aviso', 'gap-2'],
    ]) {
      const text = screen.getByText(label);
      expect(text.props.className).toBe('text-sm font-extrabold text-foreground');
      expect(text.parent?.props.className.split(' ')).toContain(gap);
    }
  });

  it('pinta Vacuna seleccionada con cápsula, labio y texto sin emoji (enmendado por #197 R7)', () => {
    const chip = screen.getByTestId('type-chip-vaccine');
    expect(chip.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-accent');
    expect(chip.props.style).toEqual(mockChunkyLip.primaryCompact);
    expect(screen.getByTestId('type-chip-custom').props.style).toBeUndefined();
    expect(chip.props.hitSlop).toEqual(TOUCH_SLOP);
    expect(chip.props.accessibilityState).toEqual({ selected: true });
    expect(within(chip).getByText('Vacuna').props.className).toBe('text-sm font-extrabold text-accent-foreground');
  });

  it('pinta los chips violeta y neutro sin seleccionar con sus tintas', () => {
    for (const [type, label, surface, ink] of [
      ['deworming', 'Desparasitación', 'bg-category-violet', 'text-category-violet-strong'],
      ['custom', 'Otro', 'bg-default', 'text-foreground'],
    ]) {
      const chip = screen.getByTestId(`type-chip-${type}`);
      expect(chip.props.className).toBe(`h-9.5 items-center justify-center rounded-full px-3.5 ${surface}`);
      expect(chip.props.hitSlop).toEqual(TOUCH_SLOP);
      expect(chip.props.accessibilityState).toEqual({ selected: false });
      expect(within(chip).getByText(label).props.className).toBe(`text-sm font-extrabold ${ink}`);
    }
  });

  it('invierte las recetas al seleccionar Otro (enmendado por #197 R7)', async () => {
    await fireEvent.press(screen.getByTestId('type-chip-custom'));
    const selected = screen.getByTestId('type-chip-custom');
    const idle = screen.getByTestId('type-chip-vaccine');
    expect(selected.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-accent');
    expect(selected.props.style).toEqual(mockChunkyLip.primaryCompact);
    expect(idle.props.style).toBeUndefined();
    expect(selected.props.accessibilityState).toEqual({ selected: true });
    expect(within(selected).getByText('Otro').props.className).toBe('text-sm font-extrabold text-accent-foreground');
    expect(idle.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-category-blue');
    expect(idle.props.accessibilityState).toEqual({ selected: false });
    expect(within(idle).getByText('Vacuna').props.className).toBe('text-sm font-extrabold text-category-blue-strong');
  });
});

describe('#95 R5: la pantalla no dibuja cabecera propia', () => {
  it('el título vive en el cuerpo (#178 R10) (enmendado por #204 R10)', async () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() });
    mockCreateReminder.mockReturnValue(pending());
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('screen-add-reminder')).toBeVisible());
    expect(screen.getByTestId('add-reminder-title')).toHaveTextContent(es['addReminder.addReminder']);
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
      ['elegir hoy (24 de septiembre) guarda hoy', [2026, 8, 23, 18, 0], [2026, 8, 24], '24 sep 2026', new Date(2026, 8, 24, 21, 30).toISOString(), 0],
      ['elegir el 1 de octubre guarda el 1 de octubre (cruce de mes)', [2026, 8, 30, 18, 0], [2026, 9, 1], '1 oct 2026', new Date(2026, 9, 1, 21, 30).toISOString(), 10080],
      ['elegir el 1 de enero de 2027 guarda el 1 de enero (cruce de año)', [2026, 11, 31, 18, 0], [2027, 0, 1], '1 ene 2027', new Date(2027, 0, 1, 21, 30).toISOString(), 10080],
    ] as [string, number[], number[], string, string, number][])('%s (enmendado por #220 R15)', async (_title, local, utc, etiqueta, dueAt, aviso) => {
      await renderAddReminder();
      await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());
      await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
      await pickDate(wallClock(local, utc));
      await fireEvent.press(screen.getByTestId('time-field'));
      const timePicker = within(screen.getByTestId('expo-ui-picker-host')).getByTestId('time-picker');
      await fireEvent(timePicker, 'onValueChange', {}, new Date(2026, 8, 24, 21, 30));
      expect(screen.getByTestId('date-field-value').props.value).toBe(etiqueta);
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
    it('abre en el 24, con el mínimo en el instante actual y la hora a las 09:00 (enmendado por #197 R7) (enmendado por #220 R15)', async () => {
      await renderAddReminder();
      await waitFor(() => expect(screen.getByTestId('date-field')).toBeVisible());
      await fireEvent.press(screen.getByTestId('date-field'));
      const picker = within(screen.getByTestId('expo-ui-picker-host')).getByTestId('date-picker');
      expect((picker.props.value as Date).toISOString()).toBe('2026-09-24T00:00:00.000Z');
      expect((picker.props.minimumDate as Date).getTime()).toBe(new Date(2026, 8, 24, 12).getTime());
      await fireEvent(picker, 'onDismiss');
      await fireEvent.press(screen.getByTestId('time-field'));
      expect((within(screen.getByTestId('expo-ui-picker-host')).getByTestId('time-picker').props.value as Date).getTime()).toBe(new Date(2026, 8, 24, 9, 0).getTime());
      for (const minutes of [0, 1440, 4320, 10080]) {
        const chip = screen.getByTestId(`advance-chip-${minutes}`);
        expect(chip.props.style).toEqual(minutes === 10080 ? mockChunkyLip.primaryCompact : undefined);
        expect(chip.props.className).not.toMatch(/border-b-3|border-black\/25/);
      }
    });
  });
});

const ADVANCES = [0, 1440, 4320, 10080] as const;
const CHIP_SELECTED = 'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent'; // (enmendado por #197 R7)
const CHIP_IDLE = 'h-9.5 items-center justify-center rounded-full px-3.5 bg-default';

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
        await waitFor(() => expect(screen.queryByTestId('date-field-message')).toHaveTextContent('La fecha debe ser futura'));
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

  describe('#125 R4: los chips se evalúan con el instante del último cambio de fecha u hora y guardar recalcula con el del envío', () => {
    async function openAt(now: number[]) {
      jest.setSystemTime(new Date(now[0], now[1], now[2], now[3], now[4]));
      await renderAddReminder();
      await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());
      await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
      await pickDate(new Date(2026, 6, 1, 12, 0));
      expectAdvanceChips([false, false, false, false], 10080);
      jest.setSystemTime(new Date(2026, 5, 24, 9, 0));
    }

    it('cambiar la hora reevalúa los chips con el instante del cambio', async () => {
      await openAt([2026, 5, 24, 8, 58]);
      await pickTime(9, 0);
      expectAdvanceChips([false, false, false, true], 4320);
    });

    it('volver a elegir la fecha reevalúa los chips con el instante del cambio', async () => {
      await openAt([2026, 5, 24, 8, 58]);
      await pickDate(new Date(2026, 6, 1, 12, 0));
      expectAdvanceChips([false, false, false, true], 4320);
    });

    it('guardar envía el mayor aviso aún futuro en el instante del envío', async () => {
      await openAt([2026, 5, 24, 8, 58]);
      await fireEvent.press(screen.getByTestId('add-reminder-submit'));
      await waitFor(() => expect(mockCreateReminder).toHaveBeenCalledWith(
        'http://example.test/v1',
        'jwt-token',
        'pet-1',
        { type: 'vaccine', title: 'Rabies', dueAt: new Date(2026, 6, 1, 9, 0).toISOString(), advanceMinutes: 4320 },
      ));
    });
  });

  describe('#125 R6: la elección explícita del aviso se conserva al cambiar fecha u hora (Enmienda E1)', () => {
    it('con avisos mayores activos, cambiar fecha u hora conserva el aviso elegido', async () => {
      jest.setSystemTime(new Date(2026, 8, 24, 8, 0));
      await renderAddReminder();
      await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());
      await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');

      await pickDate(new Date(2026, 9, 10, 12, 0));
      expectAdvanceChips([false, false, false, false], 10080);
      await fireEvent.press(screen.getByTestId('advance-chip-1440'));
      expectAdvanceChips([false, false, false, false], 1440);
      await pickDate(new Date(2026, 9, 5, 12, 0));
      expectAdvanceChips([false, false, false, false], 1440);
      await pickTime(10, 0);
      expectAdvanceChips([false, false, false, false], 1440);
      await fireEvent.press(screen.getByTestId('add-reminder-submit'));
      await waitFor(() => expect(mockCreateReminder).toHaveBeenCalledWith(
        'http://example.test/v1',
        'jwt-token',
        'pet-1',
        { type: 'vaccine', title: 'Rabies', dueAt: new Date(2026, 9, 5, 10, 0).toISOString(), advanceMinutes: 1440 },
      ));
    });

    it('con todos los chips desactivados sigue marcada la elección, no un valor fijo', async () => {
      jest.setSystemTime(new Date(2026, 8, 24, 8, 0));
      await renderAddReminder();
      await waitFor(() => expect(screen.getByTestId('title-input')).toBeVisible());
      await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');

      await pickDate(new Date(2026, 9, 10, 12, 0));
      expectAdvanceChips([false, false, false, false], 10080);
      await fireEvent.press(screen.getByTestId('advance-chip-1440'));
      expectAdvanceChips([false, false, false, false], 1440);
      await pickDate(new Date(2026, 8, 24, 12, 0));
      expectAdvanceChips([false, true, true, true], 0);
      await pickTime(8, 0);
      expectAdvanceChips([true, true, true, true], 1440);
      await fireEvent.press(screen.getByTestId('add-reminder-submit'));
      await waitFor(() => expect(screen.queryByTestId('date-field-message')).toHaveTextContent('La fecha debe ser futura'));
      expect(mockCreateReminder).not.toHaveBeenCalled();
    });
  });
});

describe('#148 R5: add-reminder se aparta del teclado en Android', () => {
  afterEach(() => {
    setPlatform(originalPlatform);
  });

  it('el host screen-add-reminder añade paddingBottom 200 al abrir el teclado (enmendado por #204 R10)', async () => {
    setPlatform('android');
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateReminder.mockReturnValue(pending());
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('screen-add-reminder')).toBeVisible());

    const host = screen.getByTestId('screen-add-reminder');
    expect(host).toHaveStyle({ paddingBottom: 0 });
    await fireEvent(host, 'layout', {
      persist() {},
      nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 700 } },
    });
    await act(async () => {
      DeviceEventEmitter.emit('keyboardDidShow', {
        startCoordinates: { screenX: 0, screenY: 800, width: 400, height: 0 },
        endCoordinates: { screenX: 0, screenY: 500, width: 400, height: 300 },
        duration: 0, easing: 'keyboard', isEventFromThisApp: true,
      });
    });
    await waitFor(() => expect(screen.getByTestId('screen-add-reminder')).toHaveStyle({ paddingBottom: 200 }));
  });
});

describe('#148 R8: add-reminder entrega el primer toque con el teclado abierto', () => {
  it('el scroll add-reminder-form declara keyboardShouldPersistTaps handled', async () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateReminder.mockReturnValue(pending());
    await renderAddReminder();
    await waitFor(() => expect(screen.getByTestId('screen-add-reminder')).toBeVisible());

    expect(screen.getByTestId('add-reminder-form').props.keyboardShouldPersistTaps).toBe('handled');
  });
});

describe('#178 R11: título, fecha y hora del canvas', () => {
  const themeColors = jest.requireActual<typeof import('../../theme/use-theme-colors')>('../../theme/use-theme-colors');

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(themeColors, 'useThemeColors').mockImplementation(
      ((tokens: readonly string[]) => tokens.map((token) => `color:${token}`)) as typeof themeColors.useThemeColors,
    );
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateReminder.mockReturnValue(pending());
    await renderAddReminder();
    await screen.findByTestId('title-input');
  });
  afterEach(() => { jest.restoreAllMocks(); });

  it('alterna el borde completo del título al recibir y perder foco', async () => {
    const input = screen.getByTestId('title-input');
    expect(input.props.className).toBe('h-13 rounded-xl bg-default px-3.5 text-base font-semibold text-foreground border-2 border-transparent');
    expect(input).toHaveStyle({ borderCurve: 'continuous' });
    await fireEvent(input, 'focus');
    expect(screen.getByTestId('title-input').props.className).toBe('h-13 rounded-xl bg-default px-3.5 text-base font-semibold text-foreground border-2 border-accent');
    await fireEvent(screen.getByTestId('title-input'), 'blur');
    expect(screen.getByTestId('title-input').props.className).toBe('h-13 rounded-xl bg-default px-3.5 text-base font-semibold text-foreground border-2 border-transparent');
  });

  it('abre cada campo con su icono de 18 y tinta muted (enmendado por #220 R15)', () => {
    for (const [fieldID, iconID] of [
      ['date-field', 'add-reminder-icon-calendar'],
      ['time-field', 'add-reminder-icon-clock'],
    ]) {
      const field = screen.getByTestId(fieldID);
      expect(field.props.className).toBe('h-12 rounded-xl bg-default');
      expect(field).toHaveStyle({ borderCurve: 'continuous' });
      expect(field.children).toHaveLength(1);
      const icon = within(field).getByTestId(iconID, { includeHiddenElements: true });
      expect(field.children[0]).toBe(icon.parent?.parent);
      expect(icon.parent?.parent?.children[0]).toBe(icon.parent);
      expect(icon.parent?.props.accessibilityElementsHidden).toBe(true);
      expect(icon.props.size).toBe(18);
      expect(icon.props.color).toBe('color:muted');
    }
  });

  it('pinta la fecha vacía como texto base seminegrita y muted (enmendado por #220 R15)', () => {
    const input = screen.getByTestId('date-field-value');
    expect(input.props.placeholder).toBe('Elige una fecha');
    expect(input.props.value).toBe('');
    expect(input.props.editable).toBe(false);
  });

  it('refleja la hora elegida en formato de 24 horas (enmendado por #220 R15)', async () => {
    await pickTime(20, 5);
    const time = screen.getByTestId('time-field-value');
    expect(time.props.value).toBe('20:05');
    expect(time.props.editable).toBe(false);
  });
});

describe('#178 R12: chips de aviso y vista previa', () => {
  const hostProcess = process.getBuiltinModule('process');
  const originalTimezone = hostProcess.env.TZ;
  const themeColors = jest.requireActual<typeof import('../../theme/use-theme-colors')>('../../theme/use-theme-colors');

  beforeAll(() => { hostProcess.env.TZ = 'America/Mexico_City'; });
  afterAll(() => {
    if (originalTimezone === undefined) delete hostProcess.env.TZ;
    else hostProcess.env.TZ = originalTimezone;
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ now: new Date(2026, 11, 20, 10, 0) });
    setPlatform('android');
    jest.spyOn(themeColors, 'useThemeColors').mockImplementation(
      ((tokens: readonly string[]) => tokens.map((token) => `color:${token}`)) as typeof themeColors.useThemeColors,
    );
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateReminder.mockReturnValue(pending());
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    setPlatform(originalPlatform);
    jest.restoreAllMocks();
  });

  it.each([
    [null, 9, 0, 'Te aviso el 25 dic a las 09:00.'],
    [1440, 9, 0, 'Te aviso el 31 dic a las 09:00.'],
    [0, 9, 0, 'Te aviso el 1 ene a las 09:00.'],
    [4320, 9, 0, 'Te aviso el 29 dic a las 09:00.'],
    [0, 20, 5, 'Te aviso el 1 ene a las 20:05.'],
  ] as const)('muestra el aviso efectivo %s a las %s:%s', async (minutes, hours, minute, expected) => {
    await renderAddReminder();
    if (minutes === null) expect(screen.queryByTestId('add-reminder-preview')).toBeNull();
    await pickDate(wallClock([2027, 0, 1, 12, 0], [2027, 0, 1]));
    await pickTime(hours, minute);
    if (minutes !== null) await fireEvent.press(screen.getByTestId(`advance-chip-${minutes}`));
    expect(screen.getByTestId('add-reminder-preview-text')).toHaveTextContent(expected);
  });

  it('pinta el aviso por defecto y los demás chips con sus recetas y pesos', async () => {
    await renderAddReminder();
    await pickDate(wallClock([2027, 0, 1, 12, 0], [2027, 0, 1]));
    await pickTime(9, 0);
    expectAdvanceChips([false, false, false, false], 10080);
    for (const minutes of ADVANCES) {
      const label = screen.getByTestId(`advance-chip-${minutes}`).children[0];
      expect(label).toHaveProperty('props.className', minutes === 10080
        ? 'text-sm font-extrabold text-accent-foreground'
        : 'text-sm font-extrabold text-foreground');
    }
  });

  it('invierte la receta del seleccionado y su etiqueta al elegir un día antes', async () => {
    await renderAddReminder();
    await pickDate(wallClock([2027, 0, 1, 12, 0], [2027, 0, 1]));
    await pickTime(9, 0);
    await fireEvent.press(screen.getByTestId('advance-chip-1440'));
    expectAdvanceChips([false, false, false, false], 1440);
    expect(screen.getByTestId('advance-chip-1440').children[0]).toHaveProperty('props.className', 'text-sm font-extrabold text-accent-foreground');
    expect(screen.getByTestId('advance-chip-10080').children[0]).toHaveProperty('props.className', 'text-sm font-extrabold text-foreground');
  });

  it('coloca Bell y el texto en la vista previa entre Aviso y Guardar', async () => {
    await renderAddReminder();
    await pickDate(wallClock([2027, 0, 1, 12, 0], [2027, 0, 1]));
    await pickTime(9, 0);
    const preview = screen.getByTestId('add-reminder-preview');
    expect(preview.props.className).toBe('flex-row items-center gap-2.5 rounded-tile bg-surface-secondary px-3.5 py-3');
    expect(preview).toHaveStyle({ borderCurve: 'continuous' });
    expect(preview.children).toHaveLength(2);
    const bell = within(preview).getByTestId('add-reminder-icon-bell');
    expect(preview.children[0]).toBe(bell);
    expect(bell.props.size).toBe(20);
    expect(bell.props.color).toBe('color:accent-strong');
    const text = within(preview).getByTestId('add-reminder-preview-text');
    expect(preview.children[1]).toBe(text);
    expect(text.props.className).toBe('flex-1 text-13 font-semibold text-foreground');
    const siblings = preview.parent!.children;
    expect(siblings.indexOf(preview)).toBeGreaterThan(siblings.indexOf(screen.getByText('Aviso').parent!));
    expect(siblings.indexOf(preview)).toBeLessThan(siblings.indexOf(screen.getByTestId('add-reminder-submit')));
  });

  it('usa el aviso efectivo cuando los tres anticipados ya pasaron', async () => {
    jest.setSystemTime(new Date(2026, 11, 31, 10, 0));
    await renderAddReminder();
    await pickDate(wallClock([2027, 0, 1, 12, 0], [2027, 0, 1]));
    await pickTime(9, 0);
    expect(screen.getByTestId('add-reminder-preview-text')).toHaveTextContent('Te aviso el 1 ene a las 09:00.');
    expectAdvanceChips([false, true, true, true], 0);
  });
});

describe('#204 R10: cabecera en contenido', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateReminder.mockReturnValue(pending());
  });

  it('#204 R10: pinta volver y Agregar recordatorio en la cabecera en contenido', async () => {
    await renderAddReminder();
    await screen.findByTestId('title-input');
    const form = screen.getByTestId('add-reminder-form');
    const container = form.children[0];
    if (typeof container === 'string') throw new Error('Expected scroll content');
    const first = container.children[0];
    expect(typeof first === 'string' ? first : first.props.testID).toBe('add-reminder');
    expect(within(form).getByTestId('add-reminder-back')).toBeTruthy();
    const title = within(form).getByTestId('add-reminder-title');
    expect(title).toHaveTextContent('Agregar recordatorio');
    expect(title.props.accessibilityRole).toBe('header');
    expect(title.props.className).toBe('text-24 font-black tracking-title text-foreground');
  });

  it('#204 R10: volver sin historial lleva a Recordatorios', async () => {
    mockRouter.canGoBack.mockReturnValue(false);
    await renderAddReminder();
    await screen.findByTestId('title-input');
    await fireEvent.press(screen.getByTestId('add-reminder-back'));
    expect(mockRouter.replace).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).toHaveBeenCalledWith('/reminders');
    expect(mockRouter.back).not.toHaveBeenCalled();
  });

  it('#204 R10: usa el marco del canvas sin cabecera nativa', async () => {
    await renderAddReminder();
    await screen.findByTestId('title-input');
    const form = screen.getByTestId('add-reminder-form');
    expect(form.props.contentContainerStyle).toEqual({
      paddingHorizontal: 20, paddingTop: 52, gap: 16, paddingBottom: 48, flexGrow: 1,
    });
    expect(form.props.contentInsetAdjustmentBehavior).toBeUndefined();
  });

  it('#204 R10: el teclado no descuenta una cabecera que ya no existe', async () => {
    setPlatform('android');
    try {
      await renderAddReminder();
      await screen.findByTestId('title-input');
      const host = screen.getByTestId('screen-add-reminder');
      expect(host.props.keyboardVerticalOffset).toBeUndefined();
      await fireEvent(host, 'layout', {
        persist() {},
        nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 700 } },
      });
      await act(async () => {
        DeviceEventEmitter.emit('keyboardDidShow', {
          startCoordinates: { screenX: 0, screenY: 800, width: 400, height: 0 },
          endCoordinates: { screenX: 0, screenY: 500, width: 400, height: 300 },
          duration: 0, easing: 'keyboard', isEventFromThisApp: true,
        });
      });
      await waitFor(() => expect(screen.getByTestId('screen-add-reminder')).toHaveStyle({ paddingBottom: 200 }));
    } finally {
      setPlatform(originalPlatform);
    }
  });
});

describe('#204 R11: Guardar al pie', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateReminder.mockReturnValue(pending());
  });

  it('#204 R11: Guardar se apoya al pie del formulario', async () => {
    await renderAddReminder();
    await screen.findByTestId('title-input');
    expect(screen.getByTestId('add-reminder-submit').props.className).toContain('mt-auto h-14 rounded-16 bg-accent');
  });
});


describe('#220 R15: Recordatorio usa DateField para fecha y hora', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 24, 20));
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() });
    mockCreateReminder.mockReturnValue(pending());
  });
  afterEach(() => jest.useRealTimers());
  it('#220 R15: elegir fecha y hora conserva dueAt y el mensaje hermano de fecha', async () => {
    await renderAddReminder();
    await screen.findByTestId('title-input');
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));
    await waitFor(() => expect(screen.getByTestId('date-field-message')).toHaveTextContent('Elige una fecha'));
    const field = screen.getByTestId('date-field');
    expect(within(field.parent!).getByTestId('date-field-message')).toBeOnTheScreen();
    expect(within(field).queryByTestId('date-field-message')).toBeNull();
    expect(within(screen.getByTestId('time-field').parent!).queryByTestId('time-field-message')).toBeNull();
    await pickDate(new Date(2026, 8, 25));
    await fireEvent.press(screen.getByTestId('time-field'));
    await fireEvent(screen.getByTestId('time-picker'), 'onValueChange', {}, new Date(2026, 8, 24, 9, 5));
    expect(screen.getByTestId('date-field-value').props.value).toBe('25 sep 2026');
    expect(screen.getByTestId('time-field-value').props.value).toBe('09:05');
    await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));
    await waitFor(() => expect(screen.getByTestId('add-reminder-submit')).toBeDisabled());
    expect(mockCreateReminder).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', { type: 'vaccine', title: 'Rabies', dueAt: '2026-09-25T09:05:00.000Z', advanceMinutes: 0 });
  });
});


describe('#213 R4: controles de repetición', () => {
  const hostProcess = process.getBuiltinModule('process');
  const originalTimezone = hostProcess.env.TZ;

  beforeEach(async () => {
    hostProcess.env.TZ = 'America/Mexico_City';
    jest.useFakeTimers({ now: new Date(2026, 11, 20, 10, 0) });
    jest.clearAllMocks();
    const themeColors = jest.requireActual<typeof import('../../theme/use-theme-colors')>('../../theme/use-theme-colors');
    jest.spyOn(themeColors, 'useThemeColors').mockImplementation(
      ((tokens: readonly string[]) => tokens.map((token) => `color:${token}`)) as typeof themeColors.useThemeColors,
    );
    setPlatform('android');
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() } satisfies AuthContextValue);
    mockCreateReminder.mockReturnValue(pending());
    await renderAddReminder();
    await screen.findByTestId('title-input');
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    setPlatform(originalPlatform);
    jest.restoreAllMocks();
    if (originalTimezone === undefined) delete hostProcess.env.TZ;
    else hostProcess.env.TZ = originalTimezone;
  });

  it('#213 R4: Repetición ofrece seis chips con Una vez seleccionado', () => {
    const options = [['once', 'Una vez'], ['day', 'Diario'], ['week', 'Semanal'], ['month', 'Mensual'], ['year', 'Anual'], ['hour', 'Cada N horas']];
    expect(screen.getAllByTestId(/^repeat-chip-/)).toHaveLength(6);
    for (const [key, label] of options) {
      const chip = screen.getByTestId(`repeat-chip-${key}`);
      expect(chip).toHaveTextContent(label);
      expect(chip.props.accessibilityState).toEqual({ selected: key === 'once' });
      expect(chip.props.className).toBe(key === 'once'
        ? 'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent'
        : 'h-9.5 items-center justify-center rounded-full px-3.5 bg-default');
      if (key === 'once') expect(chip.props.style).toEqual(mockChunkyLip.primaryCompact);
      else expect(chip.props.style).toBeUndefined();
    }
    const row = screen.getByTestId('repeat-chip-once').parent!;
    expect(row.props.className).toBe('flex-row flex-wrap gap-2');
    expect(row.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(options.map(([key]) => `repeat-chip-${key}`));
  });

  it('#213 R4: pulsar un chip de repetición mueve la selección', async () => {
    await fireEvent.press(screen.getByTestId('repeat-chip-week'));
    expect(screen.getByTestId('repeat-chip-week').props.accessibilityState).toEqual({ selected: true });
    expect(screen.getByTestId('repeat-chip-once').props.accessibilityState).toEqual({ selected: false });
  });

  it('#213 R4: Repetición va después de Hora y antes de Aviso', () => {
    const tree = JSON.stringify(screen.toJSON());
    expect(tree.indexOf('Repetición')).toBeGreaterThan(tree.indexOf('Hora'));
    expect(tree.indexOf('Repetición')).toBeLessThan(tree.indexOf('Aviso'));
  });

  it('#213 R5: Tipo y Aviso son filas horizontales sin salto de línea', () => {
    for (const [id, pattern, count] of [
      ['type-chips-row', /^type-chip-/, 7],
      ['advance-chips-row', /^advance-chip-/, 4],
    ] as const) {
      const row = screen.getByTestId(id);
      expect(row.props.horizontal).toBe(true);
      expect(row.props.showsHorizontalScrollIndicator).toBe(false);
      expect(row.props.className).toBe('-mr-5');
      expect(row.props.className).not.toContain('flex-wrap');
      expect(row.props.contentContainerStyle).toEqual({ gap: 8, paddingRight: 20 });
      expect(within(row).getAllByTestId(pattern)).toHaveLength(count);
    }
  });


  it('#213 R6: el stepper de horas nace en 8 y muestra su ayuda', async () => {
    await fireEvent.press(screen.getByTestId('repeat-chip-hour'));
    const stepper = screen.getByTestId('repeat-stepper');
    expect(stepper.props.className).toBe('flex-row items-center gap-3 rounded-16 bg-default p-2');
    expect(stepper).toHaveStyle({ borderCurve: 'continuous' });
    expect(within(stepper).getByText('Cada').props.className).toBe('text-15 font-extrabold text-foreground');
    expect(screen.getByTestId('repeat-every-value')).toHaveTextContent('8 horas');
    expect(screen.getByTestId('repeat-every-value').props.className).toBe('min-w-21 text-center text-22 font-black text-foreground');
    expect(screen.getByTestId('repeat-every-value').props.accessibilityLiveRegion).toBe('polite');
    expect(screen.getByTestId('repeat-every-help')).toHaveTextContent('De 1 a 24 horas.');
    expect(screen.getByTestId('repeat-every-less').props.accessibilityLabel).toBe('Una hora menos');
    expect(screen.getByTestId('repeat-every-more').props.accessibilityLabel).toBe('Una hora más');
  });

  it('#213 R6: el stepper de horas se detiene en 1 con «1 hora» y deshabilita menos', async () => {
    await fireEvent.press(screen.getByTestId('repeat-chip-hour'));
    for (let i = 0; i < 10; i++) await fireEvent.press(screen.getByTestId('repeat-every-less'));
    expect(screen.getByTestId('repeat-every-value')).toHaveTextContent('1 hora');
    expect(screen.getByTestId('repeat-every-less').props.accessibilityState.disabled).toBe(true);
    expect(screen.getByTestId('repeat-every-less').props.className).toContain('opacity-50');
  });

  it('#213 R6: el stepper de horas se detiene en 24 y deshabilita más', async () => {
    await fireEvent.press(screen.getByTestId('repeat-chip-hour'));
    for (let i = 0; i < 20; i++) await fireEvent.press(screen.getByTestId('repeat-every-more'));
    expect(screen.getByTestId('repeat-every-value')).toHaveTextContent('24 horas');
    expect(screen.getByTestId('repeat-every-more').props.accessibilityState.disabled).toBe(true);
  });

  it('#213 R7: el stepper de meses nace en 1 mes y se detiene en 12', async () => {
    await fireEvent.press(screen.getByTestId('repeat-chip-month'));
    expect(screen.getByTestId('repeat-every-value')).toHaveTextContent('1 mes');
    expect(screen.getByTestId('repeat-every-help')).toHaveTextContent('De 1 a 12 meses.');
    expect(screen.getByTestId('repeat-every-less').props.accessibilityLabel).toBe('Un mes menos');
    expect(screen.getByTestId('repeat-every-more').props.accessibilityLabel).toBe('Un mes más');
    expect(screen.getByTestId('repeat-every-less').props.accessibilityState.disabled).toBe(true);
    for (let i = 0; i < 14; i++) await fireEvent.press(screen.getByTestId('repeat-every-more'));
    expect(screen.getByTestId('repeat-every-value')).toHaveTextContent('12 meses');
    expect(screen.getByTestId('repeat-every-more').props.accessibilityState.disabled).toBe(true);
    for (let i = 0; i < 14; i++) await fireEvent.press(screen.getByTestId('repeat-every-less'));
    expect(screen.getByTestId('repeat-every-value')).toHaveTextContent('1 mes');
  });

  it.each(['once', 'day', 'week', 'year'])('#213 R7: sin stepper con %s', async (key) => {
    await fireEvent.press(screen.getByTestId(`repeat-chip-${key}`));
    expect(screen.queryByTestId('repeat-stepper')).toBeNull();
  });

  it('#213 R7: cada unidad conserva su valor al cambiar de chip', async () => {
    await fireEvent.press(screen.getByTestId('repeat-chip-hour'));
    await fireEvent.press(screen.getByTestId('repeat-every-more'));
    await fireEvent.press(screen.getByTestId('repeat-chip-month'));
    await fireEvent.press(screen.getByTestId('repeat-every-more'));
    await fireEvent.press(screen.getByTestId('repeat-chip-hour'));
    expect(screen.getByTestId('repeat-every-value')).toHaveTextContent('9 horas');
    await fireEvent.press(screen.getByTestId('repeat-chip-month'));
    expect(screen.getByTestId('repeat-every-value')).toHaveTextContent('2 meses');
  });

  it.each([
    { key: 'day', name: 'Hasta aparece con la repetición y es opcional' },
    { key: 'once', name: 'Hasta no aparece con Una vez' },
  ])('#213 R8: $name', async ({ key }) => {
    await fireEvent.press(screen.getByTestId(`repeat-chip-${key}`));
    if (key === 'once') {
      expect(screen.queryByTestId('until-field')).toBeNull();
      return;
    }
    expect(screen.queryByTestId('until-field')).not.toBeNull();
    expect(screen.getByText('Hasta')).toBeVisible();
    expect(screen.getByText('Opcional')).toBeVisible();
    expect(screen.getByTestId('until-field-value').props.placeholder).toBe('Sin fecha de fin');
    await fireEvent.press(screen.getByTestId('until-field'));
    expect(screen.getByTestId('until-picker').props.minimumDate).toEqual(new Date(2026, 11, 20, 12));
    await fireEvent(screen.getByTestId('until-picker'), 'onDismiss');
    await pickDate(new Date(2026, 11, 31, 12));
    await fireEvent.press(screen.getByTestId('until-field'));
    expect(screen.getByTestId('until-picker').props.minimumDate).toEqual(new Date(2026, 11, 31, 12));
    await fireEvent(screen.getByTestId('until-picker'), 'onDismiss');
    for (const unit of ['day', 'week', 'month', 'year', 'hour']) {
      await fireEvent.press(screen.getByTestId(`repeat-chip-${unit}`));
      expect(screen.getByTestId('until-field')).toBeVisible();
    }
  });

  it('#213 R8: mover la fecha más allá de Hasta lo vacía', async () => {
    await fireEvent.press(screen.getByTestId('repeat-chip-day'));
    await pickDate(new Date(2026, 11, 31, 12));
    await pickUntil(new Date(2027, 0, 2, 12));
    expect(screen.getByTestId('until-field-value').props.value).toBe('2 ene 2027');
    await pickDate(new Date(2027, 0, 3, 12));
    expect(screen.getByTestId('until-field-value').props.value).toBe('');
  });

  it('#213 R8: borrar Hasta lo quita del cuerpo y de la nota', async () => {
    await fireEvent.press(screen.getByTestId('repeat-chip-day'));
    await pickDate(new Date(2026, 11, 31, 12));
    await pickUntil(new Date(2027, 0, 2, 12));
    await fireEvent.press(screen.getByTestId('until-field-clear'), { stopPropagation: jest.fn() });
    expect(screen.getByTestId('until-field-value').props.value).toBe('');
    expect(screen.getByTestId('add-reminder-preview-text')).not.toHaveTextContent('hasta el');
    await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));
    await waitFor(() => expect(screen.getByTestId('add-reminder-submit')).toBeDisabled());
    expect(mockCreateReminder.mock.calls[0][3]).not.toHaveProperty('recurrenceUntil');
  });

  it('#213 R9: Cada N horas oculta Aviso y envía advanceMinutes 0', async () => {
    await pickDate(new Date(2026, 11, 31, 12));
    await fireEvent.press(screen.getByTestId('advance-chip-1440'));
    await fireEvent.press(screen.getByTestId('repeat-chip-hour'));
    expect(screen.queryByText('Aviso')).toBeNull();
    expect(screen.queryAllByTestId(/^advance-chip-/)).toHaveLength(0);
    await fireEvent.changeText(screen.getByTestId('title-input'), 'Rabies');
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));
    await waitFor(() => expect(screen.getByTestId('add-reminder-submit')).toBeDisabled());
    expect(mockCreateReminder.mock.calls[0][3].advanceMinutes).toBe(0);
  });

  it.each([
    ['Una vez', 'once', 1, false, { type: 'vaccine', title: 'Rabies', dueAt: '2026-12-31T15:00:00.000Z', advanceMinutes: 10080 }],
    ['Diario', 'day', 1, false, { type: 'vaccine', title: 'Rabies', dueAt: '2026-12-31T15:00:00.000Z', advanceMinutes: 10080, recurrence: { unit: 'day', every: 1 } }],
    ['Semanal', 'week', 1, false, { type: 'vaccine', title: 'Rabies', dueAt: '2026-12-31T15:00:00.000Z', advanceMinutes: 10080, recurrence: { unit: 'week', every: 1 } }],
    ['Mensual', 'month', 3, false, { type: 'vaccine', title: 'Rabies', dueAt: '2026-12-31T15:00:00.000Z', advanceMinutes: 10080, recurrence: { unit: 'month', every: 3 } }],
    ['Anual', 'year', 1, false, { type: 'vaccine', title: 'Rabies', dueAt: '2026-12-31T15:00:00.000Z', advanceMinutes: 10080, recurrence: { unit: 'year', every: 1 } }],
    ['Cada N horas', 'hour', 12, false, { type: 'vaccine', title: 'Rabies', dueAt: '2026-12-31T15:00:00.000Z', advanceMinutes: 0, recurrence: { unit: 'hour', every: 12 } }],
    ['Diario con Hasta', 'day', 1, true, { type: 'vaccine', title: 'Rabies', dueAt: '2026-12-31T15:00:00.000Z', advanceMinutes: 10080, recurrence: { unit: 'day', every: 1 }, recurrenceUntil: '2027-01-02' }],
  ] as const)('#213 R10: guarda %s con su cuerpo exacto', async (_label, key, count, hasUntil, expected) => {
    await pickDate(new Date(2026, 11, 31, 12));
    await pickTime(9, 0);
    if (key === 'once') {
      await fireEvent.press(screen.getByTestId('repeat-chip-day'));
      await pickUntil(new Date(2027, 0, 2, 12));
    }
    await fireEvent.press(screen.getByTestId(`repeat-chip-${key}`));
    if (key === 'month' || key === 'hour') {
      for (let i = key === 'hour' ? 8 : 1; i < count; i++) await fireEvent.press(screen.getByTestId('repeat-every-more'));
    }
    if (hasUntil) await pickUntil(new Date(2027, 0, 2, 12));
    await fireEvent.changeText(screen.getByTestId('title-input'), ' Rabies ');
    await fireEvent.press(screen.getByTestId('add-reminder-submit'));
    await waitFor(() => expect(screen.getByTestId('add-reminder-submit')).toBeDisabled());
    expect(mockCreateReminder).toHaveBeenCalledTimes(1);
    expect(mockCreateReminder).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', expected);
  });

  it.each([
    ["Diario", "Te aviso cada día a las 09:00.", "day", 1, 2026, 11, 31, 0, null],
    ["Diario con Hasta", "Te aviso cada día a las 09:00, hasta el 2 ene 2027.", "day", 1, 2026, 11, 31, 0, [2027, 0, 2]],
    ["Semanal", "Te aviso cada miércoles a las 09:00.", "week", 1, 2026, 11, 30, 0, null],
    ["Semanal con Hasta", "Te aviso cada miércoles a las 09:00, hasta el 6 ene 2027.", "week", 1, 2026, 11, 30, 0, [2027, 0, 6]],
    ["Mensual", "Te aviso el día 31 de cada mes a las 09:00.", "month", 1, 2026, 11, 31, 0, null],
    ["Mensual con aviso y Hasta", "Te aviso el día 31 de cada mes a las 09:00, hasta el 31 ene 2027.", "month", 1, 2027, 0, 1, 1440, [2027, 0, 31]],
    ["Mensual 3", "Te aviso el día 31 cada 3 meses a las 09:00.", "month", 3, 2026, 11, 31, 0, null],
    ["Mensual 3 con Hasta", "Te aviso el día 31 cada 3 meses a las 09:00, hasta el 30 jun 2027.", "month", 3, 2026, 11, 31, 0, [2027, 5, 30]],
    ["Anual", "Te aviso cada año el 2 ene a las 09:00.", "year", 1, 2027, 0, 2, 0, null],
    ["Anual con Hasta", "Te aviso cada año el 2 ene a las 09:00, hasta el 2 ene 2030.", "year", 1, 2027, 0, 2, 0, [2030, 0, 2]],
  ] as const)('#213 R11: la nota de %s dice «%s»', async (_label, expected, key, count, year, month, day, advance, until) => {
    await fireEvent.press(screen.getByTestId(`repeat-chip-${key}`));
    if (key === 'month') for (let i = 1; i < count; i++) await fireEvent.press(screen.getByTestId('repeat-every-more'));
    await pickDate(new Date(year, month, day, 12));
    await pickTime(9, 0);
    await fireEvent.press(screen.getByTestId(`advance-chip-${advance}`));
    if (until) await pickUntil(new Date(until[0], until[1], until[2], 12));
    expect(screen.getByTestId('add-reminder-preview-text')).toHaveTextContent(expected);
  });

  it('#213 R11: la nota usa Repeat con repetición y Bell con Una vez', async () => {
    await pickDate(new Date(2026, 11, 31, 12));
    const bell = screen.getByTestId('add-reminder-icon-bell', { includeHiddenElements: true });
    expect(bell.props.size).toBe(20);
    expect(bell.props.color).toBe('color:accent-strong');
    await fireEvent.press(screen.getByTestId('repeat-chip-day'));
    expect(screen.queryByTestId('add-reminder-icon-bell', { includeHiddenElements: true })).toBeNull();
    const repeat = screen.getByTestId('add-reminder-icon-repeat', { includeHiddenElements: true });
    expect(repeat.props.size).toBe(20);
    expect(repeat.props.color).toBe('color:accent-strong');
  });

  it('#213 R11: la nota semanal usa el día local al cruzar medianoche UTC', async () => {
    await fireEvent.press(screen.getByTestId('repeat-chip-week'));
    await pickDate(new Date(2026, 11, 30, 12));
    await pickTime(23, 30);
    await fireEvent.press(screen.getByTestId('advance-chip-0'));
    expect(screen.getByTestId('add-reminder-preview-text')).toHaveTextContent('Te aviso cada miércoles a las 23:30.');
  });

});
