import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { HeroUINativeProvider, Label } from 'heroui-native';
import type { ComponentProps } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { LanguageProvider } from '../../providers/language-provider';
import { fromPickerValue, toPickerValue } from '../../utils/date-picker-value';
import { DateField } from '../date-field';

const { readFileSync } = jest.requireActual<{ readFileSync: (path: string, encoding: 'utf8') => string }>('fs');

jest.mock('../../utils/date-picker-value', () => {
  const actual = jest.requireActual('../../utils/date-picker-value');
  return { toPickerValue: jest.fn(actual.toPickerValue), fromPickerValue: jest.fn(actual.fromPickerValue) };
});
jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens.map((token) => `color:${token}`),
}));
const mockTheme = { theme: 'light' };
jest.mock('uniwind', () => ({
  ...jest.requireActual('uniwind'), useUniwind: () => mockTheme,
}));
jest.mock('reicon-react-native', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const icon = (testID: string) => (props: Record<string, unknown>) => React.createElement(View, { ...props, testID });
  return { ...jest.requireActual('reicon-react-native'), Calendar: icon('icon-calendar'), Clock: icon('icon-clock'), X: icon('icon-x') };
});
jest.mock('@expo/ui', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { Host: ({ children }: { children: import('react').ReactNode }) => React.createElement(View, { testID: 'expo-ui-picker-host' }, children) };
});
jest.mock('@expo/ui/community/datetime-picker', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return (props: Record<string, unknown>) => React.createElement(View, props);
});

const originalOS = Platform.OS;
const mockToPicker = jest.mocked(toPickerValue);
const mockFromPicker = jest.mocked(fromPickerValue);
function setPlatform(os: string) {
  Object.defineProperty(Platform, 'OS', { configurable: true, value: os });
}
function wallClock(local: number[], utc: number[]): Date {
  return Object.assign(new Date(local[0], local[1], local[2], local[3], local[4]), {
    getUTCFullYear: () => utc[0], getUTCMonth: () => utc[1], getUTCDate: () => utc[2],
  });
}
async function renderField(props: Partial<ComponentProps<typeof DateField>> = {}, language: 'es' | 'en' = 'es') {
  const onChange = jest.fn();
  await render(<HeroUINativeProvider><LanguageProvider initial={language}><View testID="parent">
    <DateField testID="field" value="2026-09-24" onChange={onChange} {...props} />
  </View></LanguageProvider></HeroUINativeProvider>);
  return onChange;
}
async function openField() {
  await fireEvent.press(screen.getByTestId('field'));
  return screen.getByTestId('field-picker');
}

describe('#220 R2: DateField muestra el día civil en el idioma elegido', () => {
  beforeEach(() => { mockToPicker.mockClear(); mockFromPicker.mockClear(); mockTheme.theme = 'light'; setPlatform('android'); });
  afterEach(() => { setPlatform(originalOS); jest.useRealTimers(); });

  it.each([
    ['es', '2026-09-24', '24 sep 2026'], ['es', '2026-10-01', '1 oct 2026'],
    ['es', '2027-01-01', '1 ene 2027'], ['es', '2024-04-09', '9 abr 2024'],
    ['en', '2026-09-24', 'Sep 24, 2026'],
  ] as const)('#220 R2: %s %s se muestra como %s', async (language, value, expected) => {
    await renderField({ value }, language);
    expect(screen.getByTestId('field-value').props.value).toBe(expected);
  });

  it.each([
    ['date', null, 'es', 'Elige una fecha'], ['date', '', 'es', 'Elige una fecha'],
    ['date', 'bad', 'es', 'Elige una fecha'], ['date', '2026-02-30', 'es', 'Elige una fecha'],
    ['time', null, 'es', 'Elige una hora'], ['time', '', 'es', 'Elige una hora'],
    ['time', '24:00', 'es', 'Elige una hora'], ['time', '9:00', 'es', 'Elige una hora'],
    ['date', null, 'en', 'Select a date'], ['time', null, 'en', 'Select a time'],
  ] as const)('#220 R3: %s vacío o inválido (%s) usa placeholder %s %s', async (mode, value, language, expected) => {
    await renderField({ mode, value }, language);
    expect(screen.getByTestId('field-value').props.value).toBe('');
    expect(screen.getByTestId('field-value').props.placeholder).toBe(expected);
    expect(screen.getByTestId('field').props.accessibilityLabel).toBe(expected);
  });
  it('#220 R3: acepta un placeholder propio', async () => {
    await renderField({ value: null, placeholder: 'Fecha opcional' });
    expect(screen.getByTestId('field-value').props.placeholder).toBe('Fecha opcional');
    expect(screen.getByTestId('field').props.accessibilityLabel).toBe('Fecha opcional');
  });
  it('#220 R3: la hora se muestra tal cual', async () => {
    await renderField({ mode: 'time', value: '09:05' });
    expect(screen.getByTestId('field-value').props.value).toBe('09:05');
  });

  it.each([['date', 'icon-calendar'], ['time', 'icon-clock']] as const)(
    '#220 R4: raíz, input e icono de %s conservan su estructura', async (mode, iconID) => {
      await renderField({ mode, value: mode === 'date' ? '2026-09-24' : '09:05' });
      const root = screen.getByTestId('field');
      expect(root).toBe(screen.getByRole('button'));
      expect(root.props.className).toBe('h-12 rounded-xl bg-default');
      expect(StyleSheet.flatten(root.props.style).borderCurve).toBe('continuous');
      expect(root.parent).toBe(screen.getByTestId('parent'));
      expect(root.props.accessibilityLabel).toBe(mode === 'date' ? '24 sep 2026' : '09:05');
      const input = within(root).getByTestId('field-value');
      expect(input.props.editable).toBe(false);
      expect(input.props.pointerEvents).toBe('none');
      for (const token of ['h-12', 'rounded-xl', 'bg-default']) expect(input.props.className.split(' ')).toContain(token);
      const icon = within(root).getByTestId(iconID, { includeHiddenElements: true });
      expect(icon.props.size).toBe(18);
      expect(icon.props.color).toBe('color:muted');
      expect(icon.parent?.props.accessibilityElementsHidden).toBe(true);
      expect(screen.queryByTestId('field-message')).toBeNull();
    },
  );
  it('#220 R4: el fichero no importa FieldError ni TextInput', () => {
    const source = readFileSync('src/components/date-field.tsx', 'utf8');
    expect(source).not.toMatch(/\b(?:FieldError\w*|TextInput)\b/);
    expect(source).toContain("import { Host } from '@expo/ui';");
    expect(source).toContain("import ExpoDateTimePicker from '@expo/ui/community/datetime-picker';");
  });
  it('#220 R4: la etiqueta explícita nombra el botón', async () => {
    await renderField({ label: 'Fecha del documento' });
    expect(screen.getByTestId('field').props.accessibilityLabel).toBe('Fecha del documento');
  });
  it.each([true, false, undefined])('#220 R5: borde de error para isInvalid=%s', async (isInvalid) => {
    await renderField({ isInvalid });
    expect(screen.getByTestId('field-value').props.className.split(' ').includes('android:border-danger')).toBe(isInvalid === true);
  });
  it('#220 R5: Label precede al disparador y su texto usa la receta', async () => {
    await renderField({ label: 'Fecha del documento' });
    const parent = screen.getByTestId('parent');
    expect(parent.children.indexOf(screen.getByTestId('field-label'))).toBeLessThan(parent.children.indexOf(screen.getByTestId('field')));
    expect(screen.UNSAFE_getByType(Label.Text).props.className).toBe('text-sm font-extrabold text-foreground');
  });
  it('#220 R5: sin label no monta etiqueta', async () => {
    await renderField();
    expect(screen.queryByTestId('field-label')).toBeNull();
  });

  it.each([
    ['es', 'es-MX', 'light', 'Aceptar', 'Cancelar'], ['en', 'en-US', 'dark', 'OK', 'Cancel'],
  ] as const)('#220 R6: diálogo %s %s %s con botones %s %s', async (language, locale, theme, ok, cancel) => {
    mockTheme.theme = theme;
    await renderField({}, language);
    expect(screen.queryByTestId('expo-ui-picker-host')).toBeNull();
    expect(screen.queryByTestId('field-picker')).toBeNull();
    const picker = await openField();
    const host = screen.getByTestId('expo-ui-picker-host');
    expect(host).toContainElement(picker);
    const parent = screen.getByTestId('parent');
    expect(parent.children.indexOf(host)).toBeGreaterThan(parent.children.indexOf(screen.getByTestId('field')));
    expect(picker.props).toMatchObject({ mode: 'date', presentation: 'dialog', locale, accentColor: 'color:accent', themeVariant: theme, positiveButton: { label: ok }, negativeButton: { label: cancel } });
  });
  it('#220 R6: permite un pickerTestID propio', async () => {
    await renderField({ pickerTestID: 'custom-picker', mode: 'time', value: '09:05' });
    await fireEvent.press(screen.getByTestId('field'));
    expect(screen.getByTestId('custom-picker').props.mode).toBe('time');
  });

  it('#220 R7: toPickerValue entrega el valor del selector', async () => {
    const sentinel = new Date(Date.UTC(1999, 0, 2));
    mockToPicker.mockReturnValueOnce(sentinel);
    await renderField();
    expect((await openField()).props.value.getTime()).toBe(sentinel.getTime());
    expect(mockToPicker).toHaveBeenCalledTimes(1);
    const arg = mockToPicker.mock.calls[0][0];
    expect([arg.getFullYear(), arg.getMonth(), arg.getDate(), arg.getHours()]).toEqual([2026, 8, 24, 0]);
  });
  it('#220 R7: fromPickerValue convierte lo elegido', async () => {
    mockFromPicker.mockReturnValueOnce(new Date(2031, 2, 5));
    const onChange = await renderField();
    const picked = new Date(2026, 9, 1);
    await fireEvent(await openField(), 'onValueChange', {}, picked);
    expect(mockFromPicker).toHaveBeenCalledTimes(1);
    expect(mockFromPicker).toHaveBeenCalledWith(picked);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('2031-03-05');
  });
  it.each([
    [[2026, 8, 23, 18, 0], [2026, 8, 24], '2026-09-24'],
    [[2026, 8, 30, 18, 0], [2026, 9, 1], '2026-10-01'],
    [[2026, 11, 31, 18, 0], [2027, 0, 1], '2027-01-01'],
    [[2026, 8, 24, 14, 0], [2026, 8, 24], '2026-09-24'],
  ] as [number[], number[], string][])('#220 R7: en Android el día UTC del diálogo es el día elegido (%s)', async (local, utc, expected) => {
    const onChange = await renderField();
    await fireEvent(await openField(), 'onValueChange', {}, wallClock(local, utc));
    expect(onChange).toHaveBeenCalledWith(expected);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
  it('#220 R7: en iOS el día local del selector es el día elegido', async () => {
    setPlatform('ios');
    const onChange = await renderField();
    await fireEvent(await openField(), 'onValueChange', {}, wallClock([2026, 8, 24, 10, 0], [2026, 8, 25]));
    expect(onChange).toHaveBeenCalledWith('2026-09-24');
  });
  it.each(['android', 'ios'])('#220 R7: el valor inicial en %s', async (os) => {
    setPlatform(os);
    await renderField();
    const value = (await openField()).props.value;
    if (os === 'android') expect(value.toISOString()).toBe('2026-09-24T00:00:00.000Z');
    else expect(value.getTime()).toBe(new Date(2026, 8, 24).getTime());
  });
  it('#220 R7: al elegir se cierra el selector', async () => {
    await renderField();
    await fireEvent(await openField(), 'onValueChange', {}, new Date(2026, 8, 25));
    expect(screen.queryByTestId('field-picker')).toBeNull();
    expect(screen.queryByTestId('expo-ui-picker-host')).toBeNull();
  });

  it('#220 R8: mínimo y máximo van crudos a mediodía local', async () => {
    await renderField({ minDate: '2026-09-24', maxDate: '2026-12-31' });
    const picker = await openField();
    expect(picker.props.minimumDate.getTime()).toBe(new Date(2026, 8, 24, 12).getTime());
    expect(picker.props.maximumDate.getTime()).toBe(new Date(2026, 11, 31, 12).getTime());
    expect(mockToPicker).toHaveBeenCalledTimes(1);
  });
  it('#220 R8: sin límites las props van undefined', async () => {
    await renderField();
    const picker = await openField();
    expect(picker.props.minimumDate).toBeUndefined();
    expect(picker.props.maximumDate).toBeUndefined();
  });
  it.each([
    [{}, '2026-09-24T00:00:00.000Z'],
    [{ maxDate: '2026-09-20' }, '2026-09-20T00:00:00.000Z'],
    [{ minDate: '2026-10-05' }, '2026-10-05T00:00:00.000Z'],
  ])('#220 R8: valor nulo abre en hoy limitado al rango %s', async (limits, expected) => {
    jest.useFakeTimers(); jest.setSystemTime(new Date(2026, 8, 24, 20));
    await renderField({ ...limits, value: null });
    expect((await openField()).props.value.toISOString()).toBe(expected);
  });
  it('#220 R8: en modo hora no hay mínimo ni máximo aunque se pasen', async () => {
    await renderField({ mode: 'time', value: '09:05', minDate: '2026-09-24', maxDate: '2026-12-31' });
    const picker = await openField();
    expect(picker.props.minimumDate).toBeUndefined();
    expect(picker.props.maximumDate).toBeUndefined();
  });

  it.each(['android', 'ios'])('#220 R9: hora local en %s sin conversiones UTC', async (os) => {
    setPlatform(os); jest.useFakeTimers(); jest.setSystemTime(new Date(2026, 8, 24, 20));
    const onChange = await renderField({ mode: 'time', value: '09:05' });
    const picker = await openField();
    expect(picker.props.value.getTime()).toBe(new Date(2026, 8, 24, 9, 5).getTime());
    await fireEvent(picker, 'onValueChange', {}, new Date(2026, 8, 24, 21, 30));
    expect(onChange).toHaveBeenCalledWith('21:30');
    expect(screen.queryByTestId('field-picker')).toBeNull();
    expect(screen.queryByTestId('expo-ui-picker-host')).toBeNull();
    await fireEvent(await openField(), 'onValueChange', {}, new Date(2026, 8, 24, 7, 5));
    expect(onChange).toHaveBeenLastCalledWith('07:05');
    expect(mockToPicker.mock.calls).toHaveLength(0);
    expect(mockFromPicker.mock.calls).toHaveLength(0);
  });
  it('#220 R9: hora nula abre en el instante del toque', async () => {
    jest.useFakeTimers(); jest.setSystemTime(new Date(2026, 8, 24, 20));
    await renderField({ mode: 'time', value: null });
    expect((await openField()).props.value.getTime()).toBe(new Date(2026, 8, 24, 20).getTime());
    expect(mockToPicker.mock.calls).toHaveLength(0);
    expect(mockFromPicker.mock.calls).toHaveLength(0);
  });
  it('#220 R10: descartar no cambia el valor', async () => {
    const onChange = await renderField();
    await fireEvent(await openField(), 'onDismiss');
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId('field-picker')).toBeNull();
    expect(screen.queryByTestId('expo-ui-picker-host')).toBeNull();
  });

  it.each([['es', 'Borrar'], ['en', 'Clear']] as const)('#220 R11: borrar en %s dice %s y no abre el selector', async (language, name) => {
    const onChange = await renderField({ allowClear: true }, language);
    const clear = screen.getByRole('button', { name });
    expect(clear).toBe(screen.getByTestId('field-clear'));
    expect(clear.props.className).toBe('size-11 items-center justify-center');
    const icon = within(clear).getByTestId('icon-x');
    expect(icon.props.size).toBe(18); expect(icon.props.color).toBe('color:muted');
    await fireEvent.press(clear, { stopPropagation: jest.fn() });
    expect(onChange).toHaveBeenCalledTimes(1); expect(onChange).toHaveBeenCalledWith(null);
    expect(screen.queryByTestId('expo-ui-picker-host')).toBeNull();
  });
  it.each([
    { allowClear: false }, {}, { allowClear: true, value: null },
    { allowClear: true, value: 'bad' }, { allowClear: true, mode: 'time' as const, value: '24:00' },
  ])('#220 R11: no muestra borrar sin permiso y valor válido %s', async (props) => {
    await renderField(props); expect(screen.queryByTestId('field-clear')).toBeNull();
  });
});

describe('#220 R17: DateField cumple los candados de fuente y alcance', () => {
  const forbidden: [string, RegExp, string][] = [
    ['hex', /#(?!\d{2,3} R\d)[\da-f]{3,8}\b/i, "color='#abc'"],
    ['clases arbitrarias', /\b[\w-]+-\[[^\]]+\]/, 'className="h-[48px]"'],
    ['estilos', /StyleSheet\.create/, 'StyleSheet.create({})'],
    ['tamaño HeroUI propio', /<(?:(?:InputGroup\.)?\w+)[^>]*className="[^"]*\btext-(?:2xs|\d+)\b/s, '<Label className="text-17" />'],
    ['tinta desnuda', /\btext-(?:accent|warning)\b(?!-)/, 'text-accent'],
    ['tracking', /\btracking-[\w-]+/, 'tracking-title'],
    ['tokens vetados', /\b(?:rounded-(?:16|14)|text-(?:17|22))\b/, 'rounded-14'],
    ['emoji', /\p{Extended_Pictographic}/u, '📅'],
    ['inputs y mensajes', /\b(?:FieldError\w*|TextInput)\b/, '<TextInput />'],
    ['clases no literales HeroUI', /<(?:InputGroup(?:\.\w+)?|Label(?:\.Text)?)[^>]*\bclassName=\{/s, '<InputGroup.Input className={classes} />'],
  ];
  it.each(forbidden)('#220 R17: date-field.tsx es grep-limpio (%s)', (_name, pattern, mutation) => {
    expect(mutation).toMatch(pattern);
    expect(readFileSync('src/components/date-field.tsx', 'utf8')).not.toMatch(pattern);
  });
  it('#220 R18: el horario de comidas conserva su selector propio', () => {
    const source = readFileSync('src/screens/meal-schedule/index.tsx', 'utf8');
    expect(source).toContain("import ExpoDateTimePicker from '@expo/ui/community/datetime-picker';");
    expect(source.match(/ExpoDateTimePicker/g)).toHaveLength(2);
    expect(source).not.toContain('date-field');
  });
});
