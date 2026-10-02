import { act, fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { Alert } from 'react-native';

import { renderWithProviders } from '../../../test/render-with-providers';
import { deleteGeofence, listGeofences, setGeofenceActive, type Geofence, type GeofenceWriteState } from '../../api/geofences';
import { getPet, type PetState } from '../../api/pets';
import type { PetProfile } from '../../api/types';
import type { Language } from '../../i18n/catalog';
import { LanguageProvider } from '../../providers/language-provider';
import { GeofencesScreen } from '.';

jest.mock('../../api/geofences', () => ({
  deleteGeofence: jest.fn(), listGeofences: jest.fn(), setGeofenceActive: jest.fn(),
}));
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

function mount(language: Language = 'es', onUnauthorized?: () => void) {
  function Wrapper({ children }: { children: ReactNode }) {
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

  it('respeta las métricas A11 bajo cabecera nativa', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [makeGeofence()] });
    await mount();
    await screen.findByTestId('geofence-geofence-1');
    const root = screen.getByTestId('screen-geofences');
    expect(root.props.className).toBe('flex-1 bg-background');
    expect(root.props.contentInsetAdjustmentBehavior).toBe('automatic');
    expect(root.props.contentContainerStyle).toEqual({ padding: 24, gap: 16, paddingBottom: 48 });
  });

  it('pinta el vacío con su tarjeta y su copy', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [] });
    await mount();
    const empty = await screen.findByTestId('geofences-empty');
    expect(empty.props.className).toBe('rounded-card border border-border bg-surface p-4 shadow-sm items-center py-8');
    expect(within(empty).getByText('Aún no hay zonas seguras').props.className).toBe('text-center font-normal text-muted');
    expect(screen.queryByTestId('geofences-loading')).toBeNull();
  });

  it('pinta cada nombre y radio en sus columnas en el orden del backend', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [
      makeGeofence({ id: 'geofence-2', name: 'Parque', radiusM: 149.6 }),
      makeGeofence({ radiusM: 1000, active: false }),
    ] });
    await mount();
    await screen.findByTestId('geofence-geofence-2');
    expect(screen.getAllByTestId(/^geofence-geofence-\d$/).map((row) => row.props.testID)).toEqual(['geofence-geofence-2', 'geofence-geofence-1']);
    for (const [id, name, radius] of [['geofence-2', 'Parque', 'Radio de 150 m'], ['geofence-1', 'Casa', 'Radio de 1000 m']]) {
      const row = screen.getByTestId(`geofence-${id}`);
      expect(row.props.className).toBe('rounded-card border border-border bg-surface p-4 shadow-sm flex-row items-center gap-3');
      expect(row).toHaveStyle({ borderCurve: 'continuous' });
      expect(row.props.role).toBeUndefined();
      expect(row.props.accessibilityRole).toBeUndefined();
      const column = row.children[0] as ReturnType<typeof screen.getByTestId>;
      expect(column.props.className).toBe('min-w-0 flex-1 gap-1');
      expect(childTestIds(column)).toEqual([`geofence-${id}-name`, `geofence-${id}-radius`]);
      const nameNode = within(row).getByTestId(`geofence-${id}-name`);
      expect(nameNode).toHaveTextContent(name);
      expect(nameNode.props.selectable).toBe(true);
      expect(nameNode.props.className).toBe('font-bold text-foreground');
      const radiusNode = within(row).getByTestId(`geofence-${id}-radius`);
      expect(radiusNode).toHaveTextContent(radius);
      expect(radiusNode.props.className).toBe('text-sm font-normal text-muted');
    }
  });

  it('pinta el radio en inglés', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [makeGeofence({ radiusM: 149.6 })] });
    await mount('en');
    expect(await screen.findByTestId('geofence-geofence-1-radius')).toHaveTextContent('150 m radius');
  });

  it('pinta el 402 sin Reintentar', async () => {
    mockList.mockResolvedValue({ kind: 'no-tracking' });
    await mount();
    const card = await screen.findByTestId('geofences-no-tracking');
    expect(card).toHaveTextContent('Las zonas seguras requieren un collar');
    expect(card.props.className).toBe('rounded-card border border-border bg-surface p-4 shadow-sm items-center py-8');
    expect(screen.queryByTestId('geofences-retry')).toBeNull();
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

  it('pinta los dos borrados con sus recetas y como tercer hijo', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: rows });
    await mount();
    await screen.findByTestId('geofence-geofence-1');
    for (const id of ['geofence-1', 'geofence-2']) {
      const button = screen.getByTestId(`geofence-${id}-delete`);
      expect(button.props.className).toBe('pressable-feedback__root button__root button__root--variant-danger-soft button__root--size-sm min-h-11 rounded-xl bg-danger-soft');
      expect(button.props.accessibilityRole).toBe('button');
      expect(button.props.accessibilityState.disabled).toBe(false);
      expect(button).toHaveStyle({ borderCurve: 'continuous' });
      expect(within(button).getByText('Eliminar').props.className).toBe('button__label button__label--variant-danger-soft button__label--size-sm font-semibold text-danger');
      expect(childTestIds(screen.getByTestId(`geofence-${id}`))).toEqual([undefined, `geofence-${id}-active`, `geofence-${id}-delete`]);
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
  it.each(['family', 'walker', 'vet'] as const)('pinta las dos píldoras para %s sin controles', async (role) => {
    mockGetPet.mockResolvedValue(petState(role));
    mockList.mockResolvedValue({ kind: 'ok', geofences: rows });
    await mount();
    await screen.findByTestId('geofence-geofence-1');
    for (const [id, label] of [['geofence-1', 'Activa'], ['geofence-2', 'Inactiva']]) {
      const pill = screen.getByTestId(`geofence-${id}-status`);
      expect(pill).toHaveTextContent(label);
      expect(pill.props.className).toBe('self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted');
      expect(childTestIds(screen.getByTestId(`geofence-${id}`))).toEqual([undefined, `geofence-${id}-status`]);
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
