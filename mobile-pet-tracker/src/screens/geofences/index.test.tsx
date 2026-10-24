import { useQueryClient } from '@tanstack/react-query';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { Alert, StyleSheet } from 'react-native';

import { renderWithProviders } from '../../../test/render-with-providers';
import { GEOFENCE_MAX_PER_PET, deleteGeofence, listGeofences, setGeofenceActive, type Geofence, type GeofenceWriteState } from '../../api/geofences';
import { getPet, type PetState } from '../../api/pets';
import { petKeys } from '../../api/query-keys';
import type { PetProfile } from '../../api/types';
import type { Language } from '../../i18n/catalog';
import { LanguageProvider } from '../../providers/language-provider';
import { GeofencesScreen } from '.';

jest.mock('../home/home-entrance', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { HomeEntrance: (props: import('react-native').ViewProps & { index: number }) => React.createElement(View, props) };
});
jest.mock('reicon-react-native', () => {
  const actual = jest.requireActual('reicon-react-native');
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const icon = (name: string) => function MockIcon(props: Record<string, unknown>) { return React.createElement(View, { ...props, testID: `geofences-icon-${name}` }); };
  return { ...actual, __esModule: true, Trash: icon('trash'), AlertCircle: icon('alert') };
});
jest.mock('react-native-svg', () => {
  const actual = jest.requireActual('react-native-svg');
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const host = (props: Record<string, unknown>) => React.createElement(View, props);
  return { ...actual, __esModule: true, default: host, Circle: host };
});
jest.mock('../../theme/use-theme-colors', () => ({ useThemeColors: (tokens: string[]) => tokens }));

jest.mock('../../api/geofences', () => ({
  GEOFENCE_MAX_PER_PET: jest.requireActual('../../api/geofences').GEOFENCE_MAX_PER_PET,
  deleteGeofence: jest.fn(), listGeofences: jest.fn(), setGeofenceActive: jest.fn(),
}));
jest.mock('expo-router', () => ({ router: { push: jest.fn(), back: jest.fn(), canGoBack: jest.fn(() => false), replace: jest.fn() } }));
jest.mock('../../api/pets', () => ({ getPet: jest.fn() }));
const mockSignOut = jest.fn().mockResolvedValue(undefined);
jest.mock('../../providers/auth-provider', () => ({
  useAuth: () => ({ status: 'authenticated', token: 'token-1', signIn: jest.fn(), signOut: mockSignOut }),
}));
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const mockList = jest.mocked(listGeofences);
const mockGetPet = jest.mocked(getPet);
const mockSetActive = jest.mocked(setGeofenceActive);
const mockDelete = jest.mocked(deleteGeofence);
const apiUrl = 'http://example.test/v1';

function makeGeofence(overrides: Partial<Geofence> = {}): Geofence {
  return {
    id: 'geofence-1', petId: 'pet-1', name: 'Casa', type: 'safe_circle',
    centerLat: 19.4, centerLng: -99.1, radiusM: 150, active: true,
    state: { value: 'unknown', updatedAt: null },
    createdAt: '2026-10-01T12:00:00.000Z', updatedAt: '2026-10-01T12:00:00.000Z',
    ...overrides,
  };
}

function petState(myRole: PetProfile['myRole'] = 'owner'): PetState {
  return { kind: 'ok', pet: {
    id: 'pet-1', name: 'Luna', species: 'dog', breed: null, sex: null,
    birthDate: null, approxAgeMonths: null, ageMonths: 30, currentWeightKg: null,
    size: null, color: null, sterilized: null, microchip: null, photoUrl: null,
    lostMode: false, lastPosition: null, lastCommunicationAt: null, myRole,
    device: null, nextVaccine: null, nextReminder: null, activitySummary: null,
    mealsToday: null, createdAt: '2026-10-01T12:00:00.000Z', updatedAt: '2026-10-01T12:00:00.000Z',
  } };
}

function childTestIds(node: ReturnType<typeof screen.getByTestId>) {
  return node.children.map((child) => typeof child === 'string' ? undefined : child.props.testID);
}

function mount(language: Language = 'es', onUnauthorized?: () => void, seedRole = false) {
  function Wrapper({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    if (seedRole && !queryClient.getQueryData(petKeys.detail('pet-1'))) queryClient.setQueryData(petKeys.detail('pet-1'), petState());
    return <HeroUINativeProvider><LanguageProvider initial={language}>{children}</LanguageProvider></HeroUINativeProvider>;
  }
  return renderWithProviders(<GeofencesScreen petId="pet-1" />, { onUnauthorized, wrapper: Wrapper });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockList.mockReset(); mockGetPet.mockReset(); mockSetActive.mockReset(); mockDelete.mockReset();
  process.env.EXPO_PUBLIC_API_URL = apiUrl;
  mockGetPet.mockResolvedValue(petState());
});

describe('#41 R5: la pantalla pinta la lista de zonas y sus estados', () => {
  it('pinta el esqueleto mientras carga la lista', async () => {
    mockList.mockReturnValue(new Promise(() => undefined));
    await mount();
    const skeleton = screen.getByTestId('geofences-loading');
    expect(skeleton.props.className).toBe('skeleton__root h-24 w-full rounded-card');
    expect(mockList).toHaveBeenCalledTimes(1);
    expect(mockList).toHaveBeenCalledWith(apiUrl, 'token-1', 'pet-1');
    expect(mockGetPet).toHaveBeenCalledWith(apiUrl, 'token-1', 'pet-1');
    expect(screen.queryByTestId('geofences-empty')).toBeNull();
  });

  it('sigue en esqueleto mientras el rol de la mascota no ha llegado', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [] });
    mockGetPet.mockReturnValue(new Promise(() => undefined));
    const { queryClient } = await mount();
    await waitFor(() => expect(queryClient.getQueryData(['geofences', 'list', 'pet-1'])).toEqual({ kind: 'ok', geofences: [] }));
    expect(screen.getByTestId('geofences-loading')).toBeVisible();
    expect(screen.queryByTestId('geofences-empty')).toBeNull();
  });

  it('respeta las métricas A11 bajo cabecera nativa (enmendado por #189 R3) (enmendado por E4 R21) (enmendado por #202 R1)', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [makeGeofence()] });
    await mount();
    await screen.findByTestId('geofence-geofence-1');
    const root = screen.getByTestId('screen-geofences');
    expect(root.props.className).toBe('flex-1 bg-background');
    expect(root.props.contentInsetAdjustmentBehavior).toBeUndefined();
    expect(root.props.contentContainerStyle).toEqual({ paddingHorizontal: 20, paddingTop: 52, paddingBottom: 64, gap: 12, flexGrow: 1 });
    expect(root.props.contentContainerStyle.paddingTop).toBe(40 + 12);
  });


  it('pinta cada nombre y radio en sus columnas en el orden del backend (enmendado por #189 R5)', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [
      makeGeofence({ id: 'geofence-2', name: 'Parque', radiusM: 149.6 }),
      makeGeofence({ radiusM: 1000, active: false }),
    ] });
    await mount();
    await screen.findByTestId('geofence-geofence-2');
    expect(screen.getAllByTestId(/^geofence-geofence-\d$/).map((row) => row.props.testID)).toEqual(['geofence-geofence-2', 'geofence-geofence-1']);
    for (const [id, name, radius] of [['geofence-2', 'Parque', 'Radio de 150 m'], ['geofence-1', 'Casa', 'Radio de 1000 m']]) {
      const row = screen.getByTestId(`geofence-${id}`);
      expect(row.props.className).toBe('rounded-card border border-border bg-surface p-4 flex-row items-center gap-3 px-3.5 py-3 shadow-none');
      expect(row).toHaveStyle({ borderCurve: 'continuous' });
      expect(row.props.role).toBeUndefined();
      expect(row.props.accessibilityRole).toBeUndefined();
      const column = row.children[0] as ReturnType<typeof screen.getByTestId>;
      expect(column.props.className).toBe('min-h-11 min-w-0 flex-1 flex-row items-center gap-3');
      expect(childTestIds(column)).toEqual([`geofence-${id}-tile`, undefined]);
      expect(childTestIds(column.children[1] as ReturnType<typeof screen.getByTestId>)).toEqual([`geofence-${id}-name`, `geofence-${id}-radius`]);
      const nameNode = within(row).getByTestId(`geofence-${id}-name`);
      expect(nameNode).toHaveTextContent(name);
      expect(nameNode.props.selectable).toBe(false);
      expect(nameNode.props.className).toBe('text-base font-extrabold text-foreground');
      const radiusNode = within(row).getByTestId(`geofence-${id}-radius`);
      expect(radiusNode).toHaveTextContent(radius);
      expect(radiusNode.props.className).toBe('text-xs font-normal text-muted');
    }
  });

  it('pinta el radio en inglés', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [makeGeofence({ radiusM: 149.6 })] });
    await mount('en');
    expect(await screen.findByTestId('geofence-geofence-1-radius')).toHaveTextContent('150 m radius');
  });



  it.each([
    [{ kind: 'error' }, 'Algo salió mal'],
    [{ kind: 'missing-config' }, 'Algo salió mal'],
    [{ kind: 'unreachable', message: 'offline' }, 'No se pudo conectar con el servidor'],
  ] as const)('pinta %p y Reintentar vuelve a pedir solo la lista', async (state, message) => {
    mockList.mockResolvedValueOnce(state).mockResolvedValue({ kind: 'ok', geofences: [makeGeofence()] });
    await mount();
    const error = await screen.findByTestId('geofences-error');
    expect(error).toHaveTextContent(message);
    expect(error.props.selectable).toBe(true);
    expect(error.props.className).toBe('text-danger');
    const retry = screen.getByTestId('geofences-retry');
    expect(retry.props.className).toBe('pressable-feedback__root button__root button__root--variant-primary button__root--size-md min-h-11');
    expect(retry).toHaveTextContent('Reintentar');
    await fireEvent.press(retry);
    expect(await screen.findByTestId('geofence-geofence-1')).toBeVisible();
    expect(mockList).toHaveBeenCalledTimes(2);
    expect(mockGetPet).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('geofences-error')).toBeNull();
  });

  it('deja el 401 de la lista al manejador global y no pinta estado', async () => {
    mockList.mockResolvedValue({ kind: 'unauthorized' });
    const onUnauthorized = jest.fn();
    await mount('es', onUnauthorized);
    await waitFor(() => expect(onUnauthorized).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.queryByTestId('geofences-loading')).toBeNull());
    expect(mockSignOut).not.toHaveBeenCalled();
    expect(screen.queryByTestId('geofences-error')).toBeNull();
    expect(screen.queryByTestId('geofences-empty')).toBeNull();
  });
});

describe('#41 R6: el dueño activa y desactiva una zona', () => {
  const rows = [makeGeofence(), makeGeofence({ id: 'geofence-2', name: 'Parque', active: false })];

  it('pinta el interruptor con el estado del servidor y su etiqueta accesible', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: rows });
    await mount();
    await screen.findByTestId('geofence-geofence-1');
    for (const [id, label, checked] of [
      ['geofence-1', 'Zona Casa activa', true], ['geofence-2', 'Zona Parque activa', false],
    ] as const) {
      const toggle = screen.getByTestId(`geofence-${id}-active`);
      expect(toggle.props.role).toBe('switch');
      expect(toggle.props.accessibilityState).toEqual({ checked, disabled: false });
      expect(toggle.props.accessibilityLabel).toBe(label);
      expect(toggle.props.hitSlop).toBe(10);
      expect(childTestIds(screen.getByTestId(`geofence-${id}`))[1]).toBe(`geofence-${id}-active`);
    }
  });

  it('envía el valor contrario una vez y repinta con la lista recargada', async () => {
    mockList.mockResolvedValueOnce({ kind: 'ok', geofences: rows })
      .mockResolvedValue({ kind: 'ok', geofences: [rows[0], { ...rows[1], active: true }] });
    mockSetActive.mockResolvedValue({ kind: 'ok' });
    await mount();
    const toggle = await screen.findByTestId('geofence-geofence-2-active');
    expect(toggle.props.accessibilityState.checked).toBe(false);
    await fireEvent.press(toggle);
    await waitFor(() => expect(screen.getByTestId('geofence-geofence-2-active').props.accessibilityState).toEqual({ checked: true, disabled: false }));
    expect(mockSetActive).toHaveBeenCalledTimes(1);
    expect(mockSetActive).toHaveBeenCalledWith(apiUrl, 'token-1', 'pet-1', 'geofence-2', true);
    expect(mockList).toHaveBeenCalledTimes(2);
  });

  it('bloquea los dos interruptores mientras escribe sin anticipar el estado', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: rows });
    mockSetActive.mockReturnValue(new Promise<GeofenceWriteState>(() => undefined));
    await mount();
    const first = await screen.findByTestId('geofence-geofence-1-active');
    await fireEvent.press(first);
    await waitFor(() => expect(screen.getByTestId('geofence-geofence-1-active').props.accessibilityState.disabled).toBe(true));
    for (const [id, checked] of [['geofence-1', true], ['geofence-2', false]] as const) {
      const toggle = screen.getByTestId(`geofence-${id}-active`);
      expect(toggle.props.accessibilityState).toEqual({ checked, disabled: true });
      await fireEvent.press(toggle);
    }
    expect(mockSetActive).toHaveBeenCalledTimes(1);
    expect(mockSetActive).toHaveBeenCalledWith(apiUrl, 'token-1', 'pet-1', 'geofence-1', false);
    expect(mockList).toHaveBeenCalledTimes(1);
  });

  it.each(['not-found', 'no-tracking'] as const)('recarga ante %s sin mensaje', async (kind) => {
    mockList.mockResolvedValueOnce({ kind: 'ok', geofences: [makeGeofence()] })
      .mockResolvedValue({ kind: 'ok', geofences: [] });
    mockSetActive.mockResolvedValue({ kind });
    await mount();
    await fireEvent.press(await screen.findByTestId('geofence-geofence-1-active'));
    expect(await screen.findByTestId('geofences-empty')).toBeVisible();
    expect(mockList).toHaveBeenCalledTimes(2);
    expect(screen.queryByTestId('geofences-action-error')).toBeNull();
  });

  it.each([
    ['error', 'Algo salió mal'], ['missing-config', 'Algo salió mal'],
    ['unreachable', 'No se pudo conectar con el servidor'], ['rejection', 'Algo salió mal'],
  ] as const)('pinta %s sin recargar y limpia el error al siguiente intento', async (kind, message) => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [makeGeofence()] });
    if (kind === 'rejection') mockSetActive.mockRejectedValueOnce(new Error('offline'));
    else if (kind === 'unreachable') mockSetActive.mockResolvedValueOnce({ kind, message: 'offline' });
    else mockSetActive.mockResolvedValueOnce({ kind });
    let finishRetry: (result: GeofenceWriteState) => void = () => undefined;
    mockSetActive.mockReturnValueOnce(new Promise((resolve) => { finishRetry = resolve; }));
    await mount();
    await fireEvent.press(await screen.findByTestId('geofence-geofence-1-active'));
    const error = await screen.findByTestId('geofences-action-error');
    expect(error).toHaveTextContent(message);
    expect(error.props.selectable).toBe(true);
    expect(error.props.className).toBe('text-danger');
    expect(error.parent?.children.at(-1)).toBe(error);
    expect(screen.getByTestId('geofence-geofence-1-active').props.accessibilityState).toEqual({ checked: true, disabled: false });
    expect(mockList).toHaveBeenCalledTimes(1);
    await fireEvent.press(screen.getByTestId('geofence-geofence-1-active'));
    await waitFor(() => expect(screen.getByTestId('geofence-geofence-1-active').props.accessibilityState.disabled).toBe(true));
    expect(screen.queryByTestId('geofences-action-error')).toBeNull();
    expect(mockSetActive).toHaveBeenCalledTimes(2);
    finishRetry({ kind: 'ok' });
    await waitFor(() => expect(screen.getByTestId('geofence-geofence-1-active').props.accessibilityState.disabled).toBe(false));
    expect(mockList).toHaveBeenCalledTimes(2);
    expect(screen.queryByTestId('geofences-action-error')).toBeNull();
  });

  it('cierra la sesión una vez ante unauthorized de escritura', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [makeGeofence()] });
    mockSetActive.mockResolvedValue({ kind: 'unauthorized' });
    await mount();
    await fireEvent.press(await screen.findByTestId('geofence-geofence-1-active'));
    await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
    expect(mockList).toHaveBeenCalledTimes(1);
  });
});

function alertButton(label: string) {
  const button = jest.mocked(Alert.alert).mock.calls.at(-1)?.[2]?.find((item) => item.text === label);
  expect(button).toBeDefined();
  return button!;
}

describe('#41 R7: el dueño borra una zona tras confirmar', () => {
  const rows = [makeGeofence(), makeGeofence({ id: 'geofence-2', name: 'Parque', active: false })];
  beforeEach(() => { jest.spyOn(Alert, 'alert').mockImplementation(() => undefined); });
  afterEach(() => { jest.restoreAllMocks(); });

  it('pinta los dos borrados con sus recetas y como tercer hijo (enmendado por #189 R5)', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: rows });
    await mount();
    await screen.findByTestId('geofence-geofence-1');
    for (const id of ['geofence-1', 'geofence-2']) {
      const button = screen.getByTestId(`geofence-${id}-delete`);
      expect(button.props.className).toBe('size-11 items-center justify-center rounded-xl bg-danger-soft');
      expect(button.props.accessibilityRole).toBe('button');
      expect(button.props.accessibilityState.disabled).toBe(false);
      expect(button).toHaveStyle({ borderCurve: 'continuous' });
      expect(button.props.accessibilityLabel).toBe(`Eliminar zona ${rows.find((row) => row.id === id)!.name}`);
      expect(within(button).getByTestId('geofences-icon-trash').props.size).toBe(20);
      expect(childTestIds(screen.getByTestId(`geofence-${id}`))).toEqual([`geofence-${id}-edit`, `geofence-${id}-active`, `geofence-${id}-delete`]);
    }
  });

  it('deshabilita los dos borrados mientras el interruptor escribe y no abre Alert', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: rows });
    mockSetActive.mockReturnValue(new Promise(() => undefined));
    await mount();
    await screen.findByTestId('geofence-geofence-1-delete');
    await fireEvent.press(screen.getByTestId('geofence-geofence-1-active'));
    await waitFor(() => expect(screen.getByTestId('geofence-geofence-1-delete').props.accessibilityState.disabled).toBe(true));
    for (const id of ['geofence-1', 'geofence-2']) {
      const button = screen.getByTestId(`geofence-${id}-delete`);
      expect(button.props.accessibilityState.disabled).toBe(true);
      await fireEvent.press(button);
    }
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('abre la confirmación nativa exacta y Cancelar no borra', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: rows });
    await mount();
    await fireEvent.press(await screen.findByTestId('geofence-geofence-1-delete'));
    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith('¿Eliminar Casa?',
      'Dejarás de recibir alertas de esta zona. Esta acción no se puede deshacer.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: expect.any(Function) },
      ]);
    await act(async () => { alertButton('Cancelar').onPress?.(); });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('confirmar borra una vez y quita la tarjeta con la lista recargada', async () => {
    mockList.mockResolvedValueOnce({ kind: 'ok', geofences: rows })
      .mockResolvedValue({ kind: 'ok', geofences: [rows[0]] });
    mockDelete.mockResolvedValue({ kind: 'ok' });
    await mount();
    await fireEvent.press(await screen.findByTestId('geofence-geofence-2-delete'));
    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(jest.mocked(Alert.alert).mock.calls[0][0]).toBe('¿Eliminar Parque?');
    expect(mockDelete).not.toHaveBeenCalled();
    await act(async () => { alertButton('Eliminar').onPress?.(); });
    await waitFor(() => expect(screen.getByTestId('geofence-geofence-1-delete').props.accessibilityState.disabled).toBe(false));
    expect(screen.getByTestId('geofence-geofence-1')).toBeVisible();
    expect(screen.queryByTestId('geofence-geofence-2')).toBeNull();
    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith(apiUrl, 'token-1', 'pet-1', 'geofence-2');
    expect(mockList).toHaveBeenCalledTimes(2);
  });

  it.each([
    [{ kind: 'error' }, 'Algo salió mal'],
    [{ kind: 'unreachable', message: 'offline' }, 'No se pudo conectar con el servidor'],
  ] as const)('pinta el fallo %p y conserva la tarjeta', async (state, message) => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [makeGeofence()] });
    mockDelete.mockResolvedValue(state);
    await mount();
    await fireEvent.press(await screen.findByTestId('geofence-geofence-1-delete'));
    await act(async () => { alertButton('Eliminar').onPress?.(); });
    expect(await screen.findByTestId('geofences-action-error')).toHaveTextContent(message);
    expect(screen.getByTestId('geofence-geofence-1')).toBeVisible();
    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith(apiUrl, 'token-1', 'pet-1', 'geofence-1');
    expect(mockList).toHaveBeenCalledTimes(1);
  });

  it('cierra la sesión una vez ante unauthorized del borrado', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [makeGeofence()] });
    mockDelete.mockResolvedValue({ kind: 'unauthorized' });
    await mount();
    await fireEvent.press(await screen.findByTestId('geofence-geofence-1-delete'));
    await act(async () => { alertButton('Eliminar').onPress?.(); });
    await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
    expect(mockList).toHaveBeenCalledTimes(1);
  });
});

describe('#41 R8: quien no es dueño ve las zonas sin controles', () => {
  const rows = [makeGeofence(), makeGeofence({ id: 'geofence-2', name: 'Parque', active: false })];
  it.each(['family', 'walker', 'vet'] as const)('pinta las dos píldoras para %s sin controles (enmendado por #189 R5)', async (role) => {
    mockGetPet.mockResolvedValue(petState(role));
    mockList.mockResolvedValue({ kind: 'ok', geofences: rows });
    await mount();
    await screen.findByTestId('geofence-geofence-1');
    for (const [id, label] of [['geofence-1', 'Activa'], ['geofence-2', 'Inactiva']]) {
      const pill = screen.getByTestId(`geofence-${id}-status`);
      expect(pill).toHaveTextContent(label);
      expect(pill.props.className).toBe('self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted');
      expect(childTestIds(screen.getByTestId(`geofence-${id}`))).toEqual([`geofence-${id}-text-row`, `geofence-${id}-status`]);
      expect(screen.queryByTestId(`geofence-${id}-delete`)).toBeNull();
    }
    expect(screen.queryAllByRole('switch')).toEqual([]);
    expect(mockSetActive).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('un error al leer el rol deja la lista en solo lectura', async () => {
    mockGetPet.mockResolvedValue({ kind: 'error' });
    mockList.mockResolvedValue({ kind: 'ok', geofences: rows });
    await mount();
    await screen.findByTestId('geofence-geofence-1');
    expect(screen.getByTestId('geofence-geofence-1-status')).toHaveTextContent('Activa');
    expect(screen.getByTestId('geofence-geofence-2-status')).toHaveTextContent('Inactiva');
    expect(screen.queryAllByRole('switch')).toEqual([]);
    expect(screen.queryAllByTestId(/-delete$/)).toEqual([]);
  });

  it('pinta las píldoras en inglés', async () => {
    mockGetPet.mockResolvedValue(petState('family'));
    mockList.mockResolvedValue({ kind: 'ok', geofences: rows });
    await mount('en');
    await screen.findByTestId('geofence-geofence-1');
    expect(screen.getByTestId('geofence-geofence-1-status')).toHaveTextContent('Active');
    expect(screen.getByTestId('geofence-geofence-2-status')).toHaveTextContent('Inactive');
  });
});

const mockPush = jest.mocked(router.push);

describe('#146 R9: el dueño entra al editor desde la lista', () => {
  beforeEach(() => { mockList.mockResolvedValue({ kind: 'ok', geofences: [makeGeofence()] }); });
  it('convierte la columna de cada zona en un botón al editor para el dueño (enmendado por #189 R5)', async () => {
    await mount(); const column = await screen.findByTestId('geofence-geofence-1-edit');
    expect(column.props.accessibilityRole).toBe('button');
    expect(column.props.accessibilityLabel).toBe('Editar zona Casa');
    expect(column.props.className).toBe('min-h-11 min-w-0 flex-1 flex-row items-center gap-3');
    expect(column).toHaveStyle({ opacity: 1 });
    await fireEvent(column, 'responderGrant', { nativeEvent: {}, persist: () => undefined });
    expect(column).toHaveStyle({ opacity: 0.8 });
  });
  it('abre el editor de la zona tocada', async () => {
    await mount(); await fireEvent.press(await screen.findByTestId('geofence-geofence-1-edit'));
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/pets/[petId]/geofence-editor', params: { petId: 'pet-1', geofenceId: 'geofence-1' } });
  });
  it('no abre el editor mientras una escritura está en vuelo', async () => {
    mockSetActive.mockReturnValue(new Promise(() => undefined)); await mount();
    const column = await screen.findByTestId('geofence-geofence-1-edit');
    await fireEvent.press(screen.getByTestId('geofence-geofence-1-active'));
    await waitFor(() => expect(column.props.accessibilityState.disabled).toBe(true));
    await fireEvent.press(column); expect(mockPush).not.toHaveBeenCalled();
  });
  it('pinta Añadir zona con la receta primaria antes del error de acción', async () => {
    mockSetActive.mockResolvedValue({ kind: 'error' }); await mount();
    const add = await screen.findByTestId('geofences-add');
    expect(add.props.className).toContain('h-14 rounded-16 bg-accent');
    expect(within(add).getByText('Añadir zona').props.className).toBe('text-17 font-extrabold text-accent-foreground');
    await fireEvent.press(add);
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/pets/[petId]/geofence-editor', params: { petId: 'pet-1' } });
    await fireEvent.press(screen.getByTestId('geofence-geofence-1-active'));
    const error = await screen.findByTestId('geofences-action-error');
    const ids = childTestIds(error.parent!);
    expect(ids.at(-2)).toBe('geofences-add'); expect(ids.at(-1)).toBe('geofences-action-error');
  });
  it('pinta Añadir zona también con la lista vacía', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [] }); await mount();
    expect(await screen.findByTestId('geofences-add')).toHaveTextContent('Añadir zona');
    expect(screen.getByTestId('geofences-empty')).toBeVisible();
  });
  it.each(['family', 'un error al leer el rol'] as const)('no ofrece editar ni añadir a %s', async (role) => {
    mockGetPet.mockResolvedValue(role === 'family' ? petState(role) : { kind: 'error' }); await mount();
    const name = await screen.findByTestId('geofence-geofence-1-name');
    expect(name.props.selectable).toBe(true);
    expect(screen.queryByTestId('geofence-geofence-1-edit')).toBeNull();
    expect(screen.queryByTestId('geofences-add')).toBeNull();
  });
  it.each(['cargando', 'no-tracking', 'error', 'unauthorized'] as const)('no pinta Añadir zona con %s', async (kind) => {
    if (kind === 'cargando') mockList.mockReturnValue(new Promise(() => undefined));
    else mockList.mockResolvedValue({ kind });
    await mount('es', undefined, kind === 'cargando');
    if (kind === 'cargando') expect(screen.getByTestId('geofences-loading')).toBeVisible();
    else if (kind === 'no-tracking') await screen.findByTestId('geofences-no-tracking');
    else if (kind === 'error') await screen.findByTestId('geofences-error');
    else await waitFor(() => expect(screen.queryByTestId('geofences-loading')).toBeNull());
    expect(screen.queryByTestId('geofences-add')).toBeNull();
  });
  it('nombra el botón de editar y Añadir zona en inglés', async () => {
    await mount('en'); const column = await screen.findByTestId('geofence-geofence-1-edit');
    expect(column.props.accessibilityLabel).toBe('Edit Casa zone');
    expect(screen.getByTestId('geofences-add')).toHaveTextContent('Add zone');
  });
});

describe('#146 R12: con el máximo de zonas la lista no ofrece añadir otra', () => {
  const fiveZones = Array.from({ length: GEOFENCE_MAX_PER_PET }, (_, i) => makeGeofence({ id: `geofence-${i + 1}` }));
  it('con cinco zonas deshabilita Añadir zona y pinta el aviso del máximo justo antes (enmendado por #189 R3) (enmendado por #189 R6)', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: fiveZones }); await mount();
    const add = await screen.findByTestId('geofences-add');
    expect(add.props.accessibilityState.disabled).toBe(true);
    const notice = screen.getByTestId('geofences-limit');
    expect(notice).toHaveTextContent('Esta mascota ya tiene 5 zonas, el máximo. Elimina una para añadir otra.');
    expect(notice.props.className).toBe('flex-row items-start gap-2.5 rounded-tile px-3.5 py-3 bg-category-amber');
    const ids = childTestIds(add.parent!);
    expect(ids.slice(ids.indexOf('geofences-add') - 1, ids.indexOf('geofences-add') + 1)).toEqual(['geofences-limit-entrance', 'geofences-add']);
  });
  it('con cuatro zonas deja Añadir zona habilitada y sin aviso', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: fiveZones.slice(0, 4) }); await mount();
    const add = await screen.findByTestId('geofences-add');
    expect(add.props.accessibilityState.disabled).toBe(false);
    expect(screen.queryByTestId('geofences-limit')).toBeNull();
  });
  it('no pinta el aviso a quien no es dueño aunque haya cinco zonas', async () => {
    mockGetPet.mockResolvedValue(petState('family'));
    mockList.mockResolvedValue({ kind: 'ok', geofences: fiveZones }); await mount();
    await screen.findByTestId('geofence-geofence-1-status');
    expect(screen.queryByTestId('geofences-limit')).toBeNull();
  });
  it('pinta el aviso del máximo en inglés', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: fiveZones }); await mount('en');
    expect(await screen.findByTestId('geofences-limit')).toHaveTextContent('This pet already has 5 zones, the maximum. Delete one to add another.');
  });
});

describe('#155 R8: sin zonas seguras, Pingo enseña el collar', () => {

  it('pinta la pose, el título y la frase de Pingo, sin tarjeta', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [] });
    await mount();
    const empty = await screen.findByTestId('geofences-empty');
    expect(empty.props.className).toBe('items-center gap-3 py-8');
    const pose = await screen.findByTestId('geofences-empty-pose');
    expect(pose.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-collar\.webp$/) }),
    ]);
    expect(screen.getByTestId('geofences-empty-title')).toHaveTextContent('Aún no hay zonas seguras');
    expect(screen.getByTestId('geofences-empty-body')).toHaveTextContent('Cuando haya una zona segura, te aviso si tu mascota sale de ella.');
    expect(within(empty).getByText('Aún no hay zonas seguras').props.className).toBe('text-center text-lg font-bold text-foreground');
    expect(screen.queryByTestId('geofences-loading')).toBeNull();
  });

  it('queda en el sitio del vacío que sustituye (enmendado por #189 R1) (enmendado por #189 R2)', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [] });
    await mount();
    await screen.findByTestId('geofences-empty-pose');
    const slot = screen.getByTestId('geofences-empty');
    expect(slot.parent?.parent?.props.testID).toBe('screen-geofences');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['geofences-header', 'geofences-progress', 'geofences-empty', 'geofences-add']);
  });

  it('no ofrece acción', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [] });
    await mount();
    await screen.findByTestId('geofences-empty-title');
    expect(screen.queryByTestId('geofences-empty-action')).toBeNull();
  });
});

describe('#159 R5: Zonas seguras sin seguimiento presentan a Pingo', () => {
  it('pinta la pose del collar, el título y la frase de Pingo, sin tarjeta', async () => {
    mockList.mockResolvedValue({ kind: 'no-tracking' });
    await mount();
    const empty = await screen.findByTestId('geofences-no-tracking');
    expect(empty.props.className).toBe('items-center gap-3 py-8');
    expect(screen.getByTestId('geofences-no-tracking-pose').props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-collar\.webp$/) }),
    ]);
    expect(screen.getByTestId('geofences-no-tracking-title')).toHaveTextContent('Zonas seguras no disponibles');
    expect(screen.getByTestId('geofences-no-tracking-body')).toHaveTextContent('Cuando tu mascota tenga un collar con plan activo, te aviso si sale de una zona segura.');
  });

  it('pinta el título y la frase en inglés', async () => {
    mockList.mockResolvedValue({ kind: 'no-tracking' });
    await mount('en');
    expect(await screen.findByTestId('geofences-no-tracking-title')).toHaveTextContent('Safe zones unavailable');
    expect(screen.getByTestId('geofences-no-tracking-body')).toHaveTextContent("Once your pet has a collar with an active plan, I'll let you know if they leave a safe zone.");
  });

  it('queda en el sitio de la tarjeta que sustituye (enmendado por #189 R1)', async () => {
    mockList.mockResolvedValue({ kind: 'no-tracking' });
    await mount();
    await screen.findByTestId('geofences-no-tracking-pose');
    const slot = screen.getByTestId('geofences-no-tracking');
    expect(slot.parent?.parent?.props.testID).toBe('screen-geofences');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['geofences-header', 'geofences-no-tracking']);
    expect(screen.queryByTestId('geofences-retry')).toBeNull();
    expect(screen.queryByTestId('geofences-add')).toBeNull();
    expect(screen.queryByTestId('geofences-empty')).toBeNull();
  });
});

describe('#159 R6: en Zonas seguras nadie ve el botón de emparejar', () => {
  it.each(['owner', 'family', 'walker', 'vet'] as const)('no ofrece acción a %s', async (role) => {
    mockList.mockResolvedValue({ kind: 'no-tracking' });
    mockGetPet.mockResolvedValue(petState(role));
    await mount();
    await screen.findByTestId('geofences-no-tracking-title');
    expect(screen.queryByTestId('geofences-no-tracking-action')).toBeNull();
  });

  it('no ofrece acción si el detalle falla', async () => {
    mockList.mockResolvedValue({ kind: 'no-tracking' });
    mockGetPet.mockResolvedValue({ kind: 'error' });
    await mount();
    await screen.findByTestId('geofences-no-tracking-title');
    expect(screen.queryByTestId('geofences-no-tracking-action')).toBeNull();
  });
});


describe('#189 R1: título y contador en el contenido', () => {
  it.each(['es', 'en'] as const)('#189 R1.2: el título de %s tiene clase, rol y posición exactos (enmendado por #189 R3) (enmendado por E4 R21) (enmendado por #202 R1)', async (language) => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [makeGeofence()] });
    await mount(language);
    const row = await screen.findByTestId('geofence-geofence-1');
    const header = screen.getByTestId('geofences-header');
    expect(header.props.className).toBe('flex-row items-center gap-2');
    expect(header.props.style).toBeUndefined();
    expect(header.parent!.children[0]).toBe(header);
    expect(header.parent).toBe(row.parent?.parent);
    const title = screen.getByTestId('geofences-header-title');
    expect(header.children[1]).toBe(title.parent);
    expect(title.props.className).toBe('text-26 font-black tracking-title text-foreground');
    expect(title.props.accessibilityRole).toBe('header');
    expect(title).toHaveTextContent(language === 'es' ? 'Zonas seguras' : 'Safe zones');
  });
  it.each([0, 3, 5])('#189 R1.3: cuenta %i zonas con la lista cargada (enmendado por #202 R1)', async (count) => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: Array.from({ length: count }, (_, i) => makeGeofence({ id: `zone-${i}` })) });
    await mount();
    const counter = await screen.findByTestId('geofences-counter');
    expect(counter).toHaveTextContent(`${count}/5`);
    expect(counter.props.className).toBe('text-sm font-extrabold text-muted');
    const header = screen.getByTestId('geofences-header');
    expect(header.children).toHaveLength(3);
    expect(header.children.at(-1)).toBe(counter);
  });
  it('#189 R1.3: family recibe el contador en inglés', async () => {
    mockGetPet.mockResolvedValue(petState('family'));
    mockList.mockResolvedValue({ kind: 'ok', geofences: [makeGeofence()] });
    await mount('en');
    expect(await screen.findByTestId('geofences-counter')).toHaveTextContent('1/5');
  });
  it.each(['loading', 'no-tracking', 'error', 'unauthorized'] as const)('#189 R1.2/R1.3: %s conserva solo el título (enmendado por #202 R1)', async (kind) => {
    if (kind === 'loading') mockList.mockReturnValue(new Promise(() => undefined));
    else mockList.mockResolvedValue({ kind });
    await mount();
    if (kind === 'loading') expect(screen.getByTestId('geofences-loading')).toBeVisible();
    else if (kind === 'no-tracking') await screen.findByTestId('geofences-no-tracking');
    else if (kind === 'error') await screen.findByTestId('geofences-error');
    else await waitFor(() => expect(childTestIds(screen.getByTestId('geofences-header').parent!)).toEqual(['geofences-header']));
    const header = screen.getByTestId('geofences-header');
    expect(header.parent!.children[0]).toBe(header);
    expect(header.children).toHaveLength(2);
    expect(within(header).getByTestId('geofences-header-title')).toBeOnTheScreen();
    expect(screen.queryByTestId('geofences-counter')).toBeNull();
  });
});


describe('#189 R2: cinco segmentos indican las zonas usadas', () => {
  it.each([['es', 0], ['es', 2], ['es', 5], ['en', 0], ['en', 2], ['en', 5]] as const)('#189 R2: %s con %i zonas', async (language, count) => {
    if (language === 'en' && count === 2) mockGetPet.mockResolvedValue(petState('family'));
    mockList.mockResolvedValue({ kind: 'ok', geofences: Array.from({ length: count }, (_, i) => makeGeofence({ id: `zone-${i}` })) });
    await mount(language);
    const progress = await screen.findByTestId('geofences-progress');
    expect(progress.props.className).toBe('flex-row gap-1');
    expect(progress.props.accessibilityRole).toBe('progressbar');
    expect(progress.props.accessibilityValue).toEqual({ min: 0, max: 5, now: count });
    expect(progress.props.accessibilityLabel).toBe(language === 'es' ? `${count} de 5 zonas usadas` : `${count} of 5 zones used`);
    expect(progress.parent!.children[1]).toBe(progress);
    expect(progress.children).toHaveLength(5);
    expect(childTestIds(progress)).toEqual(Array.from({ length: 5 }, (_, i) => `geofences-progress-segment-${i}`));
    for (let i = 0; i < 5; i++) {
      expect(screen.getByTestId(`geofences-progress-segment-${i}`).props.className).toBe(`h-1.5 flex-1 rounded-full ${i < count ? 'bg-accent' : 'bg-default'}`);
    }
  });
  it.each(['loading', 'no-tracking', 'error'] as const)('#189 R2: no muestra progreso con %s', async (kind) => {
    if (kind === 'loading') mockList.mockReturnValue(new Promise(() => undefined));
    else mockList.mockResolvedValue({ kind });
    await mount();
    await screen.findByTestId(kind === 'loading' ? 'geofences-loading' : kind === 'error' ? 'geofences-error' : 'geofences-no-tracking');
    expect(screen.queryByTestId('geofences-progress')).toBeNull();
  });
});


describe('#189 R3: métricas y orden del contenido', () => {
  it.each(['owner-three', 'owner-five-error', 'family-three', 'empty'] as const)('#189 R3: ordena %s sin hijos adicionales', async (scenario) => {
    const count = scenario === 'empty' ? 0 : scenario === 'owner-five-error' ? 5 : 3;
    const zones = Array.from({ length: count }, (_, i) => makeGeofence({ id: `zone-${i}` }));
    mockList.mockResolvedValue({ kind: 'ok', geofences: zones });
    if (scenario === 'family-three') mockGetPet.mockResolvedValue(petState('family'));
    mockSetActive.mockResolvedValue({ kind: 'error' });
    await mount();
    await screen.findByTestId('geofences-counter');
    if (scenario === 'owner-five-error') {
      await fireEvent.press(screen.getByTestId('geofence-zone-0-active'));
      await screen.findByTestId('geofences-action-error');
    }
    const expected = ['geofences-header', 'geofences-progress',
      ...(count ? zones.map(({ id }) => `geofence-${id}-entrance`) : ['geofences-empty']),
      ...(scenario === 'owner-five-error' ? ['geofences-limit-entrance'] : []),
      ...(scenario === 'family-three' ? [] : ['geofences-add']),
      ...(scenario === 'owner-five-error' ? ['geofences-action-error'] : [])];
    const content = screen.getByTestId('geofences-header').parent!;
    expect(childTestIds(content)).toEqual(expected);
    expect(content.children).toHaveLength(expected.length);
  });
});


describe('#189 R5: filas con tile pastel, textos y controles', () => {
  const rows = [makeGeofence(), makeGeofence({ id: 'park', name: 'Parque', radiusM: 250.6, active: false }), makeGeofence({ id: 'vet', name: 'Veterinaria', radiusM: 800 })];
  const slots = ['green', 'blue', 'amber'];
  beforeEach(() => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: rows });
    mockSetActive.mockResolvedValue({ kind: 'ok' });
    mockDelete.mockResolvedValue({ kind: 'ok' });
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());
  it('#189 R5: cada fila conserva su dato, icono, tinta, tipografía, destino y acciones (enmendado por #202 R3)', async () => {
    await mount();
    await screen.findByTestId('geofence-geofence-1');
    for (const [index, zone] of rows.entries()) {
      const id = `geofence-${zone.id}`;
      const entry = screen.getByTestId(`${id}-entrance`);
      expect(entry.props.index).toBe(index);
      expect(entry.children).toHaveLength(1);
      expect(childTestIds(entry)).toEqual([id]);
      const row = screen.getByTestId(id);
      expect(row.props.className.split(' ')).toEqual(expect.arrayContaining(['rounded-card', 'border', 'border-border', 'bg-surface', 'flex-row', 'items-center', 'gap-3', 'px-3.5', 'py-3', 'shadow-none']));
      expect(row).toHaveStyle({ borderCurve: 'continuous' });
      expect(row.children).toHaveLength(3);
      expect(childTestIds(row)).toEqual([`${id}-edit`, `${id}-active`, `${id}-delete`]);
      const edit = screen.getByTestId(`${id}-edit`);
      expect(edit.props.className).toBe('min-h-11 min-w-0 flex-1 flex-row items-center gap-3');
      expect(edit.props.accessibilityRole).toBe('button');
      expect(edit.props.accessibilityLabel).toBe(`Editar zona ${zone.name}`);
      expect(edit.props.accessibilityState.disabled).toBe(false);
      expect(edit.children).toHaveLength(2);
      expect(childTestIds(edit)).toEqual([`${id}-tile`, undefined]);
      const tile = screen.getByTestId(`${id}-tile`, { includeHiddenElements: true });
      expect(tile.props.className).toBe(`size-11 items-center justify-center rounded-14 bg-category-${slots[index]}`);
      expect(tile).toHaveStyle({ borderCurve: 'continuous' });
      expect(tile.props.importantForAccessibility).toBe('no-hide-descendants');
      expect(tile.props.accessibilityElementsHidden).toBe(true);
      expect(tile.children).toHaveLength(1);
      const icon = within(tile).getByTestId(`${id}-glyph`, { includeHiddenElements: true });
      expect(tile.children[0]).toBe(icon);
      expect([icon.props.width, icon.props.height]).toEqual([22, 22]);
      expect(icon.props.stroke).toBe(`category-${slots[index]}-strong`);
      const column = edit.children[1] as ReturnType<typeof screen.getByTestId>;
      expect(column.props.className).toBe('min-w-0 flex-1');
      expect(column.children).toHaveLength(2);
      expect(childTestIds(column)).toEqual([`${id}-name`, `${id}-radius`]);
      const name = screen.getByTestId(`${id}-name`);
      expect(name).toHaveTextContent(zone.name);
      expect(name.props.className).toBe('text-base font-extrabold text-foreground');
      expect(name.props.selectable).toBe(false);
      const radius = screen.getByTestId(`${id}-radius`);
      expect(radius).toHaveTextContent(`Radio de ${Math.round(zone.radiusM)} m`);
      expect(radius.props.className).toBe('text-xs font-normal text-muted');
      await fireEvent.press(edit);
      expect(mockPush).toHaveBeenLastCalledWith({ pathname: '/pets/[petId]/geofence-editor', params: { petId: 'pet-1', geofenceId: zone.id } });
      const toggle = screen.getByTestId(`${id}-active`);
      expect(toggle.props.accessibilityState.checked).toBe(zone.active);
      expect(toggle.props.hitSlop).toBe(10);
      expect(toggle.props.accessibilityLabel).toBe(`Zona ${zone.name} activa`);
      await fireEvent.press(toggle);
      await waitFor(() => expect(screen.getByTestId(`${id}-active`).props.accessibilityState.disabled).toBe(false));
      expect(mockSetActive).toHaveBeenLastCalledWith(apiUrl, 'token-1', 'pet-1', zone.id, !zone.active);
      const trash = screen.getByTestId(`${id}-delete`);
      expect(trash.props.className).toBe('size-11 items-center justify-center rounded-xl bg-danger-soft');
      expect(trash.props.accessibilityRole).toBe('button');
      expect(trash.props.accessibilityLabel).toBe(`Eliminar zona ${zone.name}`);
      expect(trash.props.hitSlop).toBeUndefined();
      expect(trash).toHaveStyle({ borderCurve: 'continuous' });
      expect(trash.children).toHaveLength(1);
      const trashIcon = within(trash).getByTestId('geofences-icon-trash');
      expect(trashIcon.props.size).toBe(20);
      expect(trashIcon.props.color).toBe('danger');
      await fireEvent.press(trash);
      expect(jest.mocked(Alert.alert).mock.calls.at(-1)?.[0]).toBe(`¿Eliminar ${zone.name}?`);
      await act(async () => { alertButton('Eliminar').onPress?.(); });
      await waitFor(() => expect(screen.getByTestId(`${id}-delete`).props.accessibilityState.disabled).toBe(false));
      expect(mockDelete).toHaveBeenLastCalledWith(apiUrl, 'token-1', 'pet-1', zone.id);
    }
  });
  it('#189 R5: las cinco posiciones usan verde, azul, ámbar, violeta y rosa en inglés (enmendado por #202 R3)', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: Array.from({ length: 5 }, (_, index) => makeGeofence({ id: `zone-${index}`, name: `Zone ${index}` })) });
    await mount('en');
    await screen.findByTestId('geofence-zone-0');
    for (const [index, slot] of ['green', 'blue', 'amber', 'violet', 'rose'].entries()) {
      const tile = screen.getByTestId(`geofence-zone-${index}-tile`, { includeHiddenElements: true });
      expect(tile.props.className).toBe(`size-11 items-center justify-center rounded-14 bg-category-${slot}`);
      expect(within(tile).getByTestId(`geofence-zone-${index}-glyph`, { includeHiddenElements: true }).props.stroke).toBe(`category-${slot}-strong`);
      expect(screen.getByTestId(`geofence-zone-${index}-delete`).props.accessibilityLabel).toBe(`Delete Zone ${index} zone`);
    }
  });
  it('#189 R5: family conserva tile y columna, nombre seleccionable y chip sin controles (enmendado por #202 R3)', async () => {
    mockGetPet.mockResolvedValue(petState('family'));
    await mount();
    await screen.findByTestId('geofence-geofence-1');
    for (const [index, zone] of rows.entries()) {
      const id = `geofence-${zone.id}`;
      const row = screen.getByTestId(id);
      expect(row.children).toHaveLength(2);
      expect(childTestIds(row)).toEqual([`${id}-text-row`, `${id}-status`]);
      const textRow = screen.getByTestId(`${id}-text-row`);
      expect(textRow.props.className).toBe('min-h-11 min-w-0 flex-1 flex-row items-center gap-3');
      expect(textRow.children).toHaveLength(2);
      expect(childTestIds(textRow)).toEqual([`${id}-tile`, undefined]);
      const tile = screen.getByTestId(`${id}-tile`, { includeHiddenElements: true });
      expect(tile.props.className).toBe(`size-11 items-center justify-center rounded-14 bg-category-${slots[index]}`);
      expect(within(tile).getByTestId(`${id}-glyph`, { includeHiddenElements: true }).props.stroke).toBe(`category-${slots[index]}-strong`);
      expect(screen.getByTestId(`${id}-name`)).toHaveTextContent(zone.name);
      expect(screen.getByTestId(`${id}-name`).props.selectable).toBe(true);
      expect(screen.getByTestId(`${id}-status`)).toHaveTextContent(zone.active ? 'Activa' : 'Inactiva');
      expect(screen.queryByTestId(`${id}-edit`)).toBeNull();
      expect(screen.queryByTestId(`${id}-active`)).toBeNull();
      expect(screen.queryByTestId(`${id}-delete`)).toBeNull();
    }
  });
});


describe('#189 R6: aviso ámbar al alcanzar el límite', () => {
  it.each(['es', 'en'] as const)('#189 R6: compone el aviso de %s tras las cinco filas', async (language) => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: Array.from({ length: 5 }, (_, i) => makeGeofence({ id: `zone-${i}` })) });
    await mount(language);
    const text = await screen.findByTestId('geofences-limit-text');
    const entry = screen.getByTestId('geofences-limit-entrance');
    expect(entry.props.index).toBe(5);
    expect(entry.children).toHaveLength(1);
    expect(childTestIds(entry)).toEqual(['geofences-limit']);
    const notice = screen.getByTestId('geofences-limit');
    expect(notice.props.className).toBe('flex-row items-start gap-2.5 rounded-tile px-3.5 py-3 bg-category-amber');
    expect(notice).toHaveStyle({ borderCurve: 'continuous' });
    expect(notice.children).toHaveLength(2);
    expect(childTestIds(notice)).toEqual(['geofences-icon-alert', 'geofences-limit-text']);
    const icon = within(notice).getByTestId('geofences-icon-alert');
    expect(icon.props.size).toBe(20);
    expect(icon.props.color).toBe('warning');
    expect(text.props.className).toBe('flex-1 text-13 text-category-amber-strong');
    expect(text).toHaveTextContent(language === 'es' ? 'Esta mascota ya tiene 5 zonas, el máximo. Elimina una para añadir otra.' : 'This pet already has 5 zones, the maximum. Delete one to add another.');
    expect(childTestIds(entry.parent!).slice(-3)).toEqual(['geofence-zone-4-entrance', 'geofences-limit-entrance', 'geofences-add']);
  });
  it('#189 R6: el error de lista no muestra aviso', async () => {
    mockList.mockResolvedValue({ kind: 'error' });
    await mount();
    await screen.findByTestId('geofences-error');
    expect(screen.queryByTestId('geofences-limit-entrance')).toBeNull();
    expect(screen.queryByTestId('geofences-limit')).toBeNull();
  });
});


describe('#189 R7: Añadir zona conserva una sola CTA anclada al pie', () => {
  it.each([['es', 0], ['es', 4], ['es', 5], ['en', 0], ['en', 4], ['en', 5]] as const)('#189 R7: receta y navegación en %s con %i zonas (enmendado por E4 R20)', async (language, count) => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: Array.from({ length: count }, (_, i) => makeGeofence({ id: `zone-${i}` })) });
    await mount(language);
    const add = await screen.findByTestId('geofences-add');
    expect(screen.getAllByTestId('geofences-add')).toHaveLength(1);
    expect(add.props.className).toBe(`pressable-feedback__root button__root button__root--variant-primary button__root--size-md ${count === 5 ? 'disabled:element-disabled ' : ''}mt-auto h-14 rounded-16 ${count === 5 ? 'bg-default' : 'bg-accent'}`);
    expect(add.props.accessibilityState.disabled).toBe(count === 5);
    const label = within(add).getByText(language === 'es' ? 'Añadir zona' : 'Add zone');
    expect(label.props.className).toBe(`text-17 font-extrabold ${count === 5 ? 'text-muted' : 'text-accent-foreground'}`);
    if (count === 5) expect(StyleSheet.flatten(add.props.style)).toEqual({ borderCurve: 'continuous', transform: [{ scale: 1 }], opacity: 1 });
    else expect(add).toHaveStyle({ boxShadow: [{ offsetX: 0, offsetY: 4, blurRadius: 0, spreadDistance: 0, color: 'lip' }], opacity: 1 });
    expect(childTestIds(add.parent!).at(-1)).toBe('geofences-add');
    expect(screen.getByTestId('screen-geofences').props.contentContainerStyle.flexGrow).toBe(1);
    await fireEvent.press(add);
    if (count === 5) expect(mockPush).not.toHaveBeenCalled();
    else expect(mockPush).toHaveBeenCalledWith({ pathname: '/pets/[petId]/geofence-editor', params: { petId: 'pet-1' } });
  });
  it('#189 R7: una escritura conserva la receta primaria sin atenuado (enmendado por E4 R20)', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [makeGeofence()] });
    mockSetActive.mockReturnValue(new Promise(() => undefined));
    await mount();
    const add = await screen.findByTestId('geofences-add');
    await fireEvent.press(screen.getByTestId('geofence-geofence-1-active'));
    expect(add.props.accessibilityState.disabled).toBe(true);
    expect(add.props.className).toContain('mt-auto h-14 rounded-16 bg-accent');
    expect(within(add).getByText('Añadir zona').props.className).toBe('text-17 font-extrabold text-accent-foreground');
    expect(add).toHaveStyle({ boxShadow: [{ offsetX: 0, offsetY: 4, blurRadius: 0, spreadDistance: 0, color: 'lip' }], opacity: 1 });
    await fireEvent.press(add);
    expect(mockPush).not.toHaveBeenCalled();
  });
});


describe('#189 R19: el bloqueo de los interruptores conserva la opacidad', () => {
  it('#189 R19.2: las dos filas siguen bloqueadas y opacas durante una escritura', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [makeGeofence(), makeGeofence({ id: 'geofence-2' })] });
    mockSetActive.mockReturnValue(new Promise(() => undefined));
    await mount();
    await fireEvent.press(await screen.findByTestId('geofence-geofence-1-active'));
    await waitFor(() => expect(screen.getByTestId('geofence-geofence-2-active').props.accessibilityState.disabled).toBe(true));
    for (const id of ['geofence-1', 'geofence-2']) {
      const node = screen.getByTestId(`geofence-${id}-active`);
      expect(node.props.accessibilityState.disabled).toBe(true);
      expect(StyleSheet.flatten(node.props.style)?.opacity).toBe(1);
    }
  });
});


it('#189 R20.1: el límite conserva disabled:element-disabled y cancela su opacidad por style', async () => {
  mockList.mockResolvedValue({ kind: 'ok', geofences: Array.from({ length: 5 }, (_, i) => makeGeofence({ id: `zone-${i}` })) });
  await mount();
  const add = await screen.findByTestId('geofences-add');
  expect(add.props.className).toContain('disabled:element-disabled');
  expect(add.props.accessibilityState.disabled).toBe(true);
  expect(StyleSheet.flatten(add.props.style)).toEqual({ borderCurve: 'continuous', transform: [{ scale: 1 }], opacity: 1 });
});


it.each(['carga', 'error', 'sin collar', 'vacía', 'con zonas'])('#202 R1: %s monta ScreenHeader con título y volver', async (kind) => {
  if (kind === 'carga') mockList.mockReturnValue(new Promise(() => undefined));
  else if (kind === 'error') mockList.mockResolvedValue({ kind: 'error' });
  else if (kind === 'sin collar') mockList.mockResolvedValue({ kind: 'no-tracking' });
  else mockList.mockResolvedValue({ kind: 'ok', geofences: kind === 'vacía' ? [] : [makeGeofence()] });
  await mount();
  await screen.findByTestId(kind === 'carga' ? 'geofences-loading' : kind === 'error' ? 'geofences-error' : kind === 'sin collar' ? 'geofences-no-tracking' : kind === 'vacía' ? 'geofences-empty' : 'geofence-geofence-1');
  expect(screen.queryByTestId('geofences-header-back')).not.toBeNull();
  const header = screen.getByTestId('geofences-header');
  expect(within(header).getByTestId('geofences-header-title')).toHaveTextContent('Zonas seguras');
  const back = within(header).getByTestId('geofences-header-back');
  expect(back.props.accessibilityLabel).toBe('Volver');
  if (kind === 'vacía' || kind === 'con zonas') expect(within(header).getByTestId('geofences-counter')).toHaveTextContent(kind === 'vacía' ? '0/5' : '1/5');
  else expect(screen.queryByTestId('geofences-counter')).toBeNull();
  await fireEvent.press(back);
  expect(router.replace).toHaveBeenCalledTimes(1);
  expect(router.replace).toHaveBeenCalledWith('/profile');
});

it('#202 R1: el contenido arranca en insets.top + 12', async () => {
  mockList.mockReturnValue(new Promise(() => undefined));
  await mount();
  expect(screen.getByTestId('screen-geofences').props.contentContainerStyle).toEqual({ paddingHorizontal: 20, paddingTop: 40 + 12, paddingBottom: 24 + 40, gap: 12, flexGrow: 1 });
});

it('#202 R3: el tile de cada fila pinta el glifo de zona del canvas', async () => {
  const zones = Array.from({ length: 5 }, (_, i) => makeGeofence({ id: `glyph-${i}` }));
  mockList.mockResolvedValue({ kind: 'ok', geofences: zones });
  await mount();
  await screen.findByTestId('geofence-glyph-0');
  for (const [i, color] of ['category-green-strong', 'category-blue-strong', 'category-amber-strong', 'category-violet-strong', 'category-rose-strong'].entries()) {
    const tile = screen.getByTestId(`geofence-glyph-${i}-tile`, { includeHiddenElements: true });
    expect(within(tile).queryByTestId(`geofence-glyph-${i}-glyph`, { includeHiddenElements: true })).not.toBeNull();
    const glyph = within(tile).getByTestId(`geofence-glyph-${i}-glyph`, { includeHiddenElements: true });
    expect(glyph.props).toMatchObject({ width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' });
    expect(glyph.children).toHaveLength(2);
    expect((glyph.children[0] as typeof glyph).props).toMatchObject({ cx: 12, cy: 12, r: 9, strokeDasharray: '3 3' });
    expect((glyph.children[1] as typeof glyph).props).toMatchObject({ cx: 12, cy: 12, r: 2.5 });
  }
});

it('#202 R4: el interruptor de cada fila es ToggleSwitch', async () => {
  const zones = [makeGeofence(), makeGeofence({ id: 'second', active: false })];
  mockList.mockResolvedValue({ kind: 'ok', geofences: zones });
  mockSetActive.mockResolvedValue({ kind: 'ok' });
  await mount();
  await screen.findByTestId('geofence-geofence-1');
  for (const zone of zones) {
    expect(screen.queryByTestId(`geofence-${zone.id}-active-thumb`, { includeHiddenElements: true })).not.toBeNull();
    const toggle = screen.getByTestId(`geofence-${zone.id}-active`);
    expect(toggle.props.accessibilityState.checked).toBe(zone.active);
    expect(toggle.props.hitSlop).toBe(10);
    await fireEvent.press(toggle);
    await waitFor(() => expect(screen.getByTestId(`geofence-${zone.id}-active`).props.accessibilityState.disabled).toBe(false));
    expect(mockSetActive).toHaveBeenLastCalledWith(apiUrl, 'token-1', 'pet-1', zone.id, !zone.active);
  }
  expect(mockSetActive).toHaveBeenCalledTimes(2);
});
