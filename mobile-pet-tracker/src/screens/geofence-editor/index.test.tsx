import { useQueryClient } from '@tanstack/react-query';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { Alert } from 'react-native';

import { renderWithProviders } from '../../../test/render-with-providers';
import { createGeofence, deleteGeofence, listGeofences, setGeofenceActive, updateGeofence, type Geofence } from '../../api/geofences';
import { getPet, type PetState } from '../../api/pets';
import { getLastPosition } from '../../api/positions';
import type { LastPosition, PetProfile } from '../../api/types';
import { catalog, type Language } from '../../i18n/catalog';
import { LanguageProvider } from '../../providers/language-provider';
import { GeofenceEditorScreen } from '.';

jest.mock('../../api/geofences', () => ({
  listGeofences: jest.fn(), createGeofence: jest.fn(), updateGeofence: jest.fn(),
  setGeofenceActive: jest.fn(), deleteGeofence: jest.fn(),
}));
jest.mock('../../api/pets', () => ({ getPet: jest.fn() }));
jest.mock('../../api/positions', () => ({ getLastPosition: jest.fn() }));
const mockSignOut = jest.fn().mockResolvedValue(undefined);
jest.mock('../../providers/auth-provider', () => ({
  useAuth: () => ({ status: 'authenticated', token: 'token-1', signOut: mockSignOut }),
}));
jest.mock('expo-router', () => ({ router: { back: jest.fn() } }));
jest.mock('expo-maps', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const host = (props: Record<string, unknown>) => React.createElement(View, props, props.children as ReactNode);
  return { GoogleMaps: { View: host, MapColorScheme: { DARK: 'DARK', LIGHT: 'LIGHT', FOLLOW_SYSTEM: 'FOLLOW_SYSTEM' } } };
});
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));
jest.mock('uniwind', () => ({
  ...jest.requireActual('uniwind'),
  useUniwind: () => ({ theme: 'light', hasAdaptiveThemes: false }),
}));
jest.mock('heroui-native', () => {
  const actual = jest.requireActual('heroui-native');
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const host = (props: Record<string, unknown>) => React.createElement(View, props, props.children as ReactNode);
  // #146 R7: sin manejador, consume el evento para que no alcance SafeAreaListener.
  const slider = (props: Record<string, unknown>) => host({ onChange: () => undefined, onChangeEnd: () => undefined, ...props });
  return { ...actual, Slider: Object.assign(slider, { Track: host, Fill: host, Thumb: host }) };
});

const mockList = jest.mocked(listGeofences);
const mockPosition = jest.mocked(getLastPosition);
const mockCreate = jest.mocked(createGeofence);
const mockUpdate = jest.mocked(updateGeofence);
const mockSetActive = jest.mocked(setGeofenceActive);
const mockDelete = jest.mocked(deleteGeofence);
const mockGetPet = jest.mocked(getPet);
const apiUrl = 'http://example.test/v1';
const casa: Geofence = {
  id: 'geofence-1', petId: 'pet-1', name: 'Casa', type: 'safe_circle',
  centerLat: 19.4, centerLng: -99.1, radiusM: 150, active: true,
  state: { value: 'unknown', updatedAt: null },
  createdAt: '2026-10-01T12:00:00.000Z', updatedAt: '2026-10-01T12:00:00.000Z',
};
const parque: Geofence = { ...casa, id: 'geofence-2', name: 'Parque', centerLat: 19.42, centerLng: -99.15, radiusM: 600, active: false };
const lastPosition: LastPosition = { lat: 19.5, lng: -99.2, ts: 0, accuracy: null, battery: null, [`stale${'Seconds'}`]: 0 };

function childTestIds(node: ReturnType<typeof screen.getByTestId>) {
  return node.children.map((child) => typeof child === 'string' ? undefined : child.props.testID);
}
function mount(geofenceId?: string, language: Language = 'es', onUnauthorized?: () => void, seedList = false) {
  function Wrapper({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    if (seedList && !queryClient.getQueryData(expectedListKey)) queryClient.setQueryData(expectedListKey, { kind: 'ok', geofences: [casa, parque] });
    return <HeroUINativeProvider><LanguageProvider initial={language}>{children}</LanguageProvider></HeroUINativeProvider>;
  }
  return renderWithProviders(<GeofenceEditorScreen petId="pet-1" geofenceId={geofenceId} />, { onUnauthorized, wrapper: Wrapper });
}
function circles() {
  return screen.getByTestId('map-view').props.circles.map(({ id, center, radius }: { id: string; center: unknown; radius: number }) => ({ id, center, radius }));
}
async function edit(language: Language = 'es') {
  const result = await mount('geofence-1', language);
  await screen.findByTestId('geofence-editor-name');
  return result;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockList.mockReset().mockResolvedValue({ kind: 'ok', geofences: [casa, parque] });
  mockPosition.mockReset().mockResolvedValue({ kind: 'ok', position: lastPosition });
  mockCreate.mockReset().mockResolvedValue({ kind: 'ok' });
  mockUpdate.mockReset().mockResolvedValue({ kind: 'ok' });
  mockSetActive.mockReset().mockResolvedValue({ kind: 'ok' });
  mockDelete.mockReset().mockResolvedValue({ kind: 'ok' });
  mockGetPet.mockReset().mockResolvedValue(petState());
  process.env.EXPO_PUBLIC_API_URL = apiUrl;
});

describe('#146 R6: el editor pinta el formulario sobre el mapa y sus estados', () => {
  it('pinta el esqueleto mientras carga la lista al editar', async () => {
    mockList.mockReturnValue(new Promise(() => undefined));
    await mount('geofence-1');
    const loading = screen.getByTestId('geofence-editor-loading');
    expect(loading.props.className).toBe('skeleton__root h-24 w-full rounded-card');
    const root = screen.getByTestId('screen-geofence-editor');
    expect(root.props.className).toBe('flex-1 bg-background');
    expect(root.props.contentInsetAdjustmentBehavior).toBe('automatic');
    expect(root.props.contentContainerStyle).toEqual({ padding: 24, gap: 16, paddingBottom: 48 });
    expect(mockPosition).not.toHaveBeenCalled();
    expect(mockList).toHaveBeenCalledWith(apiUrl, 'token-1', 'pet-1');
  });
  it('al crear sigue en esqueleto hasta que llega la última posición', async () => {
    mockPosition.mockReturnValue(new Promise(() => undefined));
    await mount();
    expect(await screen.findByTestId('geofence-editor-loading')).toBeVisible();
    expect(screen.queryByTestId('geofence-editor-name')).toBeNull();
  });
  it('al editar precarga nombre, centro y radio de la zona', async () => {
    await mount('geofence-2');
    const input = await screen.findByTestId('geofence-editor-name');
    expect(input.props.value).toBe('Parque');
    expect(input.props.maxLength).toBe(120);
    expect(screen.getByTestId('map-view').props.cameraPosition).toEqual({ coordinates: { latitude: 19.42, longitude: -99.15 }, zoom: 15 });
    expect(screen.getByTestId('geofence-editor-radius-value')).toHaveTextContent('Radio de 600 m');
    const slider = screen.getByTestId('geofence-editor-radius');
    expect([slider.props.value, slider.props.minValue, slider.props.maxValue, slider.props.step]).toEqual([600, 20, 2000, 10]);
    expect(screen.getByTestId('geofence-editor-reset-note')).toHaveTextContent('Al guardar un centro o radio nuevos, la zona se vuelve a evaluar y se cierran sus alertas abiertas.');
    expect(mockPosition).not.toHaveBeenCalled();
  });
  it('al crear centra en la última posición con el radio por defecto', async () => {
    await mount();
    await screen.findByTestId('geofence-editor-name');
    expect(screen.getByTestId('map-view').props.cameraPosition).toEqual({ coordinates: { latitude: 19.5, longitude: -99.2 }, zoom: 17 });
    expect(screen.getByTestId('geofence-editor-radius').props.value).toBe(150);
    expect(screen.queryByTestId('geofence-editor-reset-note')).toBeNull();
    expect(mockPosition).toHaveBeenCalledWith(apiUrl, 'token-1', 'pet-1');
  });
  it.each(['ok sin posición', 'no-tracking', 'unauthorized', 'error', 'unreachable'] as const)('al crear sin posición utilizable (%s) centra en el centro por defecto', async (kind) => {
    mockPosition.mockResolvedValue(kind === 'ok sin posición' ? { kind: 'ok', position: null } : kind === 'unreachable' ? { kind, message: 'offline' } : { kind });
    await mount();
    await screen.findByTestId('geofence-editor-name');
    expect(screen.getByTestId('map-view').props.cameraPosition).toEqual({ coordinates: { latitude: 19.4326, longitude: -99.1332 }, zoom: 17 });
  });
  it('dibuja todas las zonas de la mascota, activas o no, con la editada en borrador', async () => {
    await edit();
    expect(circles()).toEqual([
      { id: 'geofence-1', center: { latitude: 19.4, longitude: -99.1 }, radius: 150 },
      { id: 'geofence-2', center: { latitude: 19.42, longitude: -99.15 }, radius: 600 },
    ]);
  });
  it('al crear dibuja el borrador después de las zonas existentes', async () => {
    await mount(); await screen.findByTestId('geofence-editor-name');
    expect(circles()).toEqual([
      { id: 'geofence-1', center: { latitude: 19.4, longitude: -99.1 }, radius: 150 },
      { id: 'geofence-2', center: { latitude: 19.42, longitude: -99.15 }, radius: 600 },
      { id: 'draft', center: { latitude: 19.5, longitude: -99.2 }, radius: 150 },
    ]);
  });
  it('pinta no encontrada si la zona ya no está en la lista', async () => {
    await mount('missing');
    expect(await screen.findByTestId('geofence-editor-not-found')).toHaveTextContent('La mascota o la zona ya no están disponibles.');
  });
  it('pinta el 402 sin Reintentar', async () => {
    mockList.mockResolvedValue({ kind: 'no-tracking' }); await mount('geofence-1');
    expect(await screen.findByTestId('geofence-editor-no-tracking')).toHaveTextContent('Las zonas seguras requieren un collar');
    expect(screen.queryByTestId('geofence-editor-retry')).toBeNull();
  });
  it.each(['error', 'unreachable', 'missing-config'] as const)('pinta %s con Reintentar, que vuelve a pedir solo la lista', async (kind) => {
    mockList.mockResolvedValueOnce(kind === 'unreachable' ? { kind, message: 'offline' } : { kind }).mockResolvedValue({ kind: 'ok', geofences: [casa] });
    await mount('geofence-1');
    const error = await screen.findByTestId('geofence-editor-load-error');
    expect(error.props.selectable).toBe(true);
    expect(error.props.className).toBe('text-danger');
    expect(error).toHaveTextContent(kind === 'unreachable' ? 'No se pudo conectar con el servidor' : 'Algo salió mal');
    const retry = screen.getByTestId('geofence-editor-retry');
    expect(retry).toHaveTextContent('Reintentar');
    await fireEvent.press(retry);
    await screen.findByTestId('geofence-editor-name');
    expect(mockList).toHaveBeenCalledTimes(2);
    expect(mockPosition).not.toHaveBeenCalled();
  });
  it('deja el 401 de la lista al manejador global y no pinta estado', async () => {
    const onUnauthorized = jest.fn();
    mockList.mockResolvedValue({ kind: 'unauthorized' }); await mount('geofence-1', 'es', onUnauthorized);
    await waitFor(() => expect(onUnauthorized).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.queryByTestId('geofence-editor-loading')).toBeNull());
    expect(screen.queryByTestId('geofence-editor-load-error')).toBeNull();
    expect(screen.queryByTestId('geofence-editor-name')).toBeNull();
  });
  it('compone mapa y formulario sin fondo sobre el mapa y con las métricas A11 en el formulario', async () => {
    await edit();
    const root = screen.getByTestId('screen-geofence-editor');
    expect(root.props.className).toBe('flex-1');
    expect(childTestIds(root)).toEqual(['geofence-editor-map', 'geofence-editor-form']);
    expect(screen.getByTestId('geofence-editor-map').props.className).toBe('flex-1');
    const form = screen.getByTestId('geofence-editor-form');
    expect(form.props.className).toBe('bg-background');
    expect(form).toHaveStyle({ flexGrow: 0, flexShrink: 1 });
    expect(form.props.contentInsetAdjustmentBehavior).toBeUndefined();
    expect(form.props.keyboardShouldPersistTaps).toBe('handled');
    expect(form.props.contentContainerStyle).toEqual({ padding: 24, gap: 16, paddingBottom: 48 });
    expect(screen.getByTestId('geofence-editor-radius-value').props.selectable).toBe(true);
    expect(screen.getByTestId('geofence-editor-radius-thumb').props.accessibilityLabel).toBe('Radio de la zona');
  });
  it('pinta el formulario en inglés', async () => {
    await edit('en');
    expect(screen.getByText('Name')).toBeVisible();
    expect(screen.getByTestId('geofence-editor-map-hint')).toHaveTextContent("Tap the map to move the zone's center.");
    expect(screen.getByTestId('geofence-editor-radius-value')).toHaveTextContent('150 m radius');
  });
});

describe('#146 R7: el toque y el slider mueven el borrador sin perseguir la cámara', () => {
  const tap = { latitude: 19.41, longitude: -99.11 };
  it('un toque en el mapa mueve el centro del borrador y no la cámara', async () => {
    await edit();
    const props = screen.getByTestId('map-view').props;
    expect(typeof props.onMapClick).toBe('function');
    await fireEvent(screen.getByTestId('map-view'), 'mapClick', { coordinates: tap });
    expect(circles()[0].center).toEqual(tap);
    expect(screen.getByTestId('map-view').props.cameraPosition).toEqual({ coordinates: { latitude: 19.4, longitude: -99.1 }, zoom: 17 });
  });
  it('un toque en un POI mueve el centro del borrador', async () => {
    await mount(); await screen.findByTestId('geofence-editor-name');
    expect(typeof screen.getByTestId('map-view').props.onPOIClick).toBe('function');
    await fireEvent(screen.getByTestId('map-view'), 'pOIClick', { coordinates: tap, name: 'POI' });
    expect(circles()[2]).toEqual({ id: 'draft', center: tap, radius: 150 });
  });
  it('un toque dentro de un círculo mueve el centro al punto tocado', async () => {
    await edit();
    expect(typeof screen.getByTestId('map-view').props.onCircleClick).toBe('function');
    await fireEvent(screen.getByTestId('map-view'), 'circleClick', { center: { latitude: 19.42, longitude: -99.15 }, clickCoordinates: tap });
    expect(circles()[0].center).toEqual(tap);
  });
  it('mover el slider cambia el radio del borrador y su valor sin mover la cámara', async () => {
    await edit();
    await fireEvent(screen.getByTestId('geofence-editor-radius'), 'change', [300]);
    expect(screen.getByTestId('geofence-editor-radius').props.value).toBe(300);
    expect(circles()[0].radius).toBe(300);
    expect(screen.getByTestId('geofence-editor-radius-value')).toHaveTextContent('Radio de 300 m');
    expect(screen.getByTestId('map-view').props.cameraPosition).toEqual({ coordinates: { latitude: 19.4, longitude: -99.1 }, zoom: 17 });
  });
  it('al soltar el slider la cámara encuadra el borrador', async () => {
    await edit();
    await fireEvent(screen.getByTestId('map-view'), 'mapClick', { coordinates: tap });
    await fireEvent(screen.getByTestId('geofence-editor-radius'), 'change', 600);
    await fireEvent(screen.getByTestId('geofence-editor-radius'), 'changeEnd', [600]);
    expect(screen.getByTestId('map-view').props.cameraPosition).toEqual({ coordinates: tap, zoom: 15 });
  });
  it('TalkBack sube y baja el radio de diez en diez y encuadra', async () => {
    await edit();
    await fireEvent(screen.getByTestId('map-view'), 'mapClick', { coordinates: tap });
    const thumb = screen.getByTestId('geofence-editor-radius-thumb');
    expect(thumb.props.accessibilityActions).toEqual([{ name: 'increment' }, { name: 'decrement' }]);
    await fireEvent(thumb, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    expect(screen.getByTestId('geofence-editor-radius').props.value).toBe(160);
    expect(screen.getByTestId('map-view').props.cameraPosition.zoom).toBeCloseTo(16.907, 3);
    expect(screen.getByTestId('map-view').props.cameraPosition.coordinates).toEqual(tap);
    await fireEvent(thumb, 'accessibilityAction', { nativeEvent: { actionName: 'decrement' } });
    expect(screen.getByTestId('geofence-editor-radius').props.value).toBe(150);
    expect(screen.getByTestId('map-view').props.cameraPosition.zoom).toBe(17);
    expect(screen.getByTestId('map-view').props.cameraPosition.coordinates).toEqual(tap);
  });
  it('TalkBack no sale de 20 ni de 2000', async () => {
    await mount(); await screen.findByTestId('geofence-editor-name');
    await fireEvent(screen.getByTestId('geofence-editor-radius'), 'change', 20);
    await fireEvent(screen.getByTestId('geofence-editor-radius-thumb'), 'accessibilityAction', { nativeEvent: { actionName: 'decrement' } });
    expect(screen.getByTestId('geofence-editor-radius').props.value).toBe(20);
    expect(circles()[2]).toEqual({ id: 'draft', center: { latitude: 19.5, longitude: -99.2 }, radius: 20 });
    await fireEvent(screen.getByTestId('geofence-editor-radius'), 'change', 2000);
    await fireEvent(screen.getByTestId('geofence-editor-radius-thumb'), 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    expect(screen.getByTestId('geofence-editor-radius').props.value).toBe(2000);
    expect(circles()[2].radius).toBe(2000);
  });
  it('escribir el nombre actualiza el campo', async () => {
    await edit(); await fireEvent.changeText(screen.getByTestId('geofence-editor-name'), 'Casa nueva');
    expect(screen.getByTestId('geofence-editor-name').props.value).toBe('Casa nueva');
  });
});


const mockBack = jest.mocked(router.back);
const expectedListKey = ['geofences', 'list', 'pet-1'];

describe('#146 R8: Guardar crea o actualiza la zona y vuelve a la lista', () => {
  it('al crear envía el borrador recortado y vuelve a la lista recargada', async () => {
    const { queryClient } = await mount();
    const save = await screen.findByTestId('geofence-editor-save');
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    await fireEvent.changeText(screen.getByTestId('geofence-editor-name'), '  Paseo  ');
    await fireEvent.press(save);
    await waitFor(() => expect(mockBack).toHaveBeenCalledTimes(1));
    expect(mockCreate).toHaveBeenCalledWith(apiUrl, 'token-1', 'pet-1', { name: 'Paseo', centerLat: 19.5, centerLng: -99.2, radiusM: 150 });
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(invalidate).toHaveBeenCalledWith({ queryKey: expectedListKey });
    expect(invalidate.mock.invocationCallOrder[0]).toBeLessThan(mockBack.mock.invocationCallOrder[0]);
  });
  it('al editar envía el borrador completo con PATCH', async () => {
    await edit(); const save = screen.getByTestId('geofence-editor-save');
    await fireEvent(screen.getByTestId('map-view'), 'mapClick', { coordinates: { latitude: 19.41, longitude: -99.11 } });
    await fireEvent.changeText(screen.getByTestId('geofence-editor-name'), 'Casa nueva');
    await fireEvent.press(save);
    await waitFor(() => expect(mockBack).toHaveBeenCalledTimes(1));
    expect(mockUpdate).toHaveBeenCalledWith(apiUrl, 'token-1', 'pet-1', 'geofence-1', { name: 'Casa nueva', centerLat: 19.41, centerLng: -99.11, radiusM: 150 });
    expect(mockCreate).not.toHaveBeenCalled();
  });
  it('pinta Guardar con la receta primaria tras la nota de reinicio', async () => {
    await edit(); const save = screen.getByTestId('geofence-editor-save');
    expect(save.props.className).toBe('pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent');
    expect(within(save).getByText('Guardar').props.className).toBe('button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground');
    const ids = childTestIds(save.parent!);
    expect(ids.slice(ids.indexOf('geofence-editor-reset-note'), ids.indexOf('geofence-editor-reset-note') + 2)).toEqual(['geofence-editor-reset-note', 'geofence-editor-save']);
  });
  it('deshabilita Guardar mientras guarda y no envía dos veces', async () => {
    mockUpdate.mockReturnValue(new Promise(() => undefined)); await edit();
    const save = screen.getByTestId('geofence-editor-save');
    await fireEvent.press(save);
    expect(save.props.accessibilityState.disabled).toBe(true);
    await fireEvent.press(save);
    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });
  it('deshabilita Guardar con el nombre vacío', async () => {
    await mount(); const save = await screen.findByTestId('geofence-editor-save');
    expect(save.props.accessibilityState.disabled).toBe(true);
    await fireEvent.changeText(screen.getByTestId('geofence-editor-name'), 'Casa');
    expect(save.props.accessibilityState.disabled).toBe(false);
  });
  it('deshabilita Guardar con un nombre de solo espacios', async () => {
    await edit(); const save = screen.getByTestId('geofence-editor-save');
    await fireEvent.changeText(screen.getByTestId('geofence-editor-name'), '   ');
    expect(save.props.accessibilityState.disabled).toBe(true);
    await fireEvent.press(save); expect(mockUpdate).not.toHaveBeenCalled();
  });
  it.each([
    ['name-taken', 'Ya tienes una zona con ese nombre.'],
    ['limit-reached', 'Esta mascota ya tiene el máximo de zonas.'],
    ['invalid', 'Revisa el nombre y el radio de la zona.'],
    ['not-found', 'La mascota o la zona ya no están disponibles.'],
    ['no-tracking', 'Las zonas seguras requieren un collar'],
    ['unreachable', 'No se pudo conectar con el servidor'],
    ['error', 'Algo salió mal'], ['missing-config', 'Algo salió mal'],
  ] as const)('pinta %s bajo Guardar y conserva el borrador', async (kind, message) => {
    mockUpdate.mockResolvedValue(kind === 'unreachable' ? { kind, message: 'offline' } : { kind });
    await edit(); const save = screen.getByTestId('geofence-editor-save');
    await fireEvent.changeText(screen.getByTestId('geofence-editor-name'), 'Mi casa');
    await fireEvent.press(save);
    const error = await screen.findByTestId('geofence-editor-error');
    expect(error).toHaveTextContent(message);
    expect(error.props.selectable).toBe(true);
    expect(error.props.className).toBe('text-danger');
    expect(childTestIds(save.parent!).at(-1)).toBe('geofence-editor-error');
    expect(screen.getByTestId('geofence-editor-name').props.value).toBe('Mi casa');
    expect(screen.getByTestId('geofence-editor-radius').props.value).toBe(150);
    expect(mockBack).not.toHaveBeenCalled();
  });
  it('un rechazo pinta el error genérico y el siguiente intento lo borra', async () => {
    mockUpdate.mockRejectedValueOnce(new Error('offline')).mockResolvedValue({ kind: 'ok' });
    await edit(); const save = screen.getByTestId('geofence-editor-save');
    await fireEvent.press(save);
    expect(await screen.findByTestId('geofence-editor-error')).toHaveTextContent('Algo salió mal');
    await fireEvent.press(save);
    await waitFor(() => expect(screen.queryByTestId('geofence-editor-error')).toBeNull());
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
  it('un 401 cierra sesión una vez y no vuelve a la lista', async () => {
    mockUpdate.mockResolvedValue({ kind: 'unauthorized' });
    await edit(); const save = screen.getByTestId('geofence-editor-save');
    await fireEvent.press(save);
    await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
    expect(mockBack).not.toHaveBeenCalled();
  });
});

describe('#146 R13: el interruptor del editor activa o desactiva la zona sin salir', () => {
  it('pinta el interruptor de zona activa entre el slider y la nota de reinicio', async () => {
    await edit(); const toggle = screen.getByTestId('geofence-editor-active');
    const row = screen.getByTestId('geofence-editor-active-row');
    expect(row.props.className).toBe('flex-row items-center justify-between gap-3');
    expect(row).toHaveTextContent(catalog.es['geofences.statusActive']);
    expect(toggle.props.role).toBe('switch');
    expect(toggle.props.accessibilityState).toEqual({ checked: true, disabled: false });
    expect(toggle.props.accessibilityLabel).toBe(catalog.es['geofences.activeLabel'].replace('{{name}}', casa.name));
    expect(toggle.props.hitSlop).toBe(10);
    const ids = childTestIds(row.parent!);
    expect(ids.slice(ids.indexOf('geofence-editor-radius'), ids.indexOf('geofence-editor-radius') + 3)).toEqual(['geofence-editor-radius', 'geofence-editor-active-row', 'geofence-editor-reset-note']);
  });
  it('desactivar escribe solo el estado, recarga la lista y se queda en el editor', async () => {
    mockList.mockResolvedValueOnce({ kind: 'ok', geofences: [casa, parque] }).mockResolvedValue({ kind: 'ok', geofences: [{ ...casa, active: false }, parque] });
    const { queryClient } = await edit();
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    await fireEvent.press(screen.getByTestId('geofence-editor-active'));
    await waitFor(() => expect(screen.getByTestId('geofence-editor-active').props.accessibilityState).toEqual({ checked: false, disabled: false }));
    expect(mockSetActive).toHaveBeenCalledTimes(1);
    expect(mockSetActive).toHaveBeenCalledWith(apiUrl, 'token-1', 'pet-1', 'geofence-1', false);
    expect(invalidate).toHaveBeenCalledWith({ queryKey: expectedListKey });
    expect(mockList).toHaveBeenCalledTimes(2);
    expect(mockUpdate).not.toHaveBeenCalled(); expect(mockBack).not.toHaveBeenCalled();
  });
  it('deshabilita el interruptor y Guardar mientras escribe', async () => {
    mockSetActive.mockReturnValue(new Promise(() => undefined)); await edit();
    const toggle = screen.getByTestId('geofence-editor-active');
    await fireEvent.press(toggle);
    await waitFor(() => expect(toggle.props.accessibilityState.disabled).toBe(true));
    expect(screen.getByTestId('geofence-editor-save').props.accessibilityState.disabled).toBe(true);
    await fireEvent.press(toggle); await fireEvent.press(screen.getByTestId('geofence-editor-save'));
    expect(mockSetActive).toHaveBeenCalledTimes(1); expect(mockUpdate).not.toHaveBeenCalled();
  });
  it('Guardar tras cambiar el interruptor envía el PATCH sin el estado', async () => {
    mockList.mockResolvedValueOnce({ kind: 'ok', geofences: [casa, parque] }).mockResolvedValue({ kind: 'ok', geofences: [{ ...casa, active: false }, parque] });
    await edit();
    await fireEvent.changeText(screen.getByTestId('geofence-editor-name'), 'Casa nueva');
    await fireEvent(screen.getByTestId('map-view'), 'mapClick', { coordinates: { latitude: 19.41, longitude: -99.11 } });
    await fireEvent(screen.getByTestId('geofence-editor-radius'), 'change', 300);
    await fireEvent.press(screen.getByTestId('geofence-editor-active'));
    await waitFor(() => expect(screen.getByTestId('geofence-editor-active').props.accessibilityState).toEqual({ checked: false, disabled: false }));
    await fireEvent.press(screen.getByTestId('geofence-editor-save'));
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1));
    const draft = mockUpdate.mock.calls[0][4];
    expect(Object.keys(draft).sort()).toEqual(['centerLat', 'centerLng', 'name', 'radiusM']);
    expect(draft).toEqual({ name: 'Casa nueva', centerLat: 19.41, centerLng: -99.11, radiusM: 300 });
  });
  it.each(['not-found', 'unreachable'] as const)('un fallo %s del interruptor pinta el error bajo el formulario y no vuelve', async (kind) => {
    mockSetActive.mockResolvedValue(kind === 'unreachable' ? { kind, message: 'offline' } : { kind });
    await edit(); await fireEvent.press(screen.getByTestId('geofence-editor-active'));
    const error = await screen.findByTestId('geofence-editor-error');
    expect(error).toHaveTextContent(kind === 'not-found' ? 'La mascota o la zona ya no están disponibles.' : catalog.es['common.cannotReachServer']);
    expect(childTestIds(error.parent!).at(-1)).toBe('geofence-editor-error');
    expect(mockBack).not.toHaveBeenCalled();
  });
  it('un 401 del interruptor cierra sesión una vez', async () => {
    mockSetActive.mockResolvedValue({ kind: 'unauthorized' }); await edit();
    await fireEvent.press(screen.getByTestId('geofence-editor-active'));
    await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
    expect(mockBack).not.toHaveBeenCalled();
  });
});

function alertButton(label: string) {
  const button = jest.mocked(Alert.alert).mock.calls.at(-1)?.[2]?.find((item) => item.text === label);
  expect(button).toBeDefined();
  return button!;
}

describe('#146 R14: Eliminar en el editor borra la zona y vuelve a la lista', () => {
  beforeEach(() => { jest.spyOn(Alert, 'alert').mockImplementation(() => undefined); });
  afterEach(() => { jest.restoreAllMocks(); });
  it('pinta Eliminar con la receta de peligro justo después de Guardar', async () => {
    await edit(); const button = screen.getByTestId('geofence-editor-delete');
    expect(button.props.className).toBe('pressable-feedback__root button__root button__root--variant-danger-soft button__root--size-md rounded-xl bg-danger-soft');
    expect(within(button).getByText(catalog.es['geofences.delete']).props.className).toBe('button__label button__label--variant-danger-soft button__label--size-md font-semibold text-danger');
    expect(button.props.accessibilityState.disabled).toBe(false);
    const ids = childTestIds(button.parent!);
    expect(ids.slice(ids.indexOf('geofence-editor-save'), ids.indexOf('geofence-editor-save') + 2)).toEqual(['geofence-editor-save', 'geofence-editor-delete']);
  });
  it('ordena el formulario del dueño al editar', async () => {
    await edit();
    expect(childTestIds(screen.getByTestId('geofence-editor-radius-value').parent!)).toEqual([undefined, 'geofence-editor-map-hint', 'geofence-editor-radius-value', 'geofence-editor-radius', 'geofence-editor-active-row', 'geofence-editor-reset-note', 'geofence-editor-save', 'geofence-editor-delete']);
  });
  it('al crear no pinta ni el interruptor ni Eliminar', async () => {
    await mount(); await screen.findByTestId('geofence-editor-save');
    expect(screen.queryByTestId('geofence-editor-active')).toBeNull();
    expect(screen.queryByTestId('geofence-editor-delete')).toBeNull();
  });
  it('pide confirmación con el nombre de la zona y Cancelar no borra', async () => {
    await edit(); await fireEvent.press(screen.getByTestId('geofence-editor-delete'));
    expect(Alert.alert).toHaveBeenCalledTimes(1);
    const [title, body, buttons] = jest.mocked(Alert.alert).mock.calls[0];
    expect(title).toBe(catalog.es['geofences.deleteTitle'].replace('{{name}}', casa.name));
    expect(body).toBe(catalog.es['geofences.deleteBody']);
    expect(buttons?.map(({ text, style }) => ({ text, style }))).toEqual([
      { text: catalog.es['geofences.cancel'], style: 'cancel' },
      { text: catalog.es['geofences.delete'], style: 'destructive' },
    ]);
    await act(async () => { alertButton(catalog.es['geofences.cancel']).onPress?.(); });
    expect(mockDelete).not.toHaveBeenCalled();
  });
  it('al confirmar borra una vez y vuelve a la lista recargada', async () => {
    const { queryClient } = await edit(); const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    await fireEvent.press(screen.getByTestId('geofence-editor-delete'));
    expect(mockDelete).not.toHaveBeenCalled();
    await act(async () => { alertButton(catalog.es['geofences.delete']).onPress?.(); });
    await waitFor(() => expect(mockBack).toHaveBeenCalledTimes(1));
    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith(apiUrl, 'token-1', 'pet-1', 'geofence-1');
    expect(invalidate).toHaveBeenCalledWith({ queryKey: expectedListKey });
    expect(invalidate.mock.invocationCallOrder[0]).toBeLessThan(mockBack.mock.invocationCallOrder[0]);
  });
  it('deshabilita Eliminar, Guardar y el interruptor mientras borra', async () => {
    mockDelete.mockReturnValue(new Promise(() => undefined)); await edit();
    const button = screen.getByTestId('geofence-editor-delete');
    await fireEvent.press(button);
    await act(async () => { alertButton(catalog.es['geofences.delete']).onPress?.(); });
    await waitFor(() => expect(button.props.accessibilityState.disabled).toBe(true));
    expect(screen.getByTestId('geofence-editor-save').props.accessibilityState.disabled).toBe(true);
    expect(screen.getByTestId('geofence-editor-active').props.accessibilityState.disabled).toBe(true);
    await fireEvent.press(button); await fireEvent.press(screen.getByTestId('geofence-editor-save')); await fireEvent.press(screen.getByTestId('geofence-editor-active'));
    expect(mockDelete).toHaveBeenCalledTimes(1); expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(mockUpdate).not.toHaveBeenCalled(); expect(mockSetActive).not.toHaveBeenCalled();
  });
  it('un fallo al borrar pinta el error y no vuelve', async () => {
    mockDelete.mockResolvedValue({ kind: 'unreachable', message: 'offline' }); await edit();
    await fireEvent.press(screen.getByTestId('geofence-editor-delete'));
    await act(async () => { alertButton(catalog.es['geofences.delete']).onPress?.(); });
    expect(await screen.findByTestId('geofence-editor-error')).toHaveTextContent(catalog.es['common.cannotReachServer']);
    expect(mockBack).not.toHaveBeenCalled();
  });
  it('un 401 al borrar cierra sesión una vez', async () => {
    mockDelete.mockResolvedValue({ kind: 'unauthorized' }); await edit();
    await fireEvent.press(screen.getByTestId('geofence-editor-delete'));
    await act(async () => { alertButton(catalog.es['geofences.delete']).onPress?.(); });
    await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
    expect(mockBack).not.toHaveBeenCalled();
  });
  it('pinta Eliminar en inglés', async () => {
    await edit('en'); const button = screen.getByTestId('geofence-editor-delete');
    expect(button).toHaveTextContent(catalog.en['geofences.delete']);
    await fireEvent.press(button);
    expect(jest.mocked(Alert.alert).mock.calls[0][0]).toBe(catalog.en['geofences.deleteTitle'].replace('{{name}}', casa.name));
  });
});

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

describe('#146 R16: quien no es dueño ve la zona sin poder editarla', () => {
  it('pinta el esqueleto mientras carga el rol', async () => {
    mockGetPet.mockReturnValue(new Promise(() => undefined));
    mockList.mockReturnValue(new Promise(() => undefined));
    // La lista ya está en caché al montar; evita confundir la carga de lista con la del rol.
    await mount('geofence-1', 'es', undefined, true);
    expect(await screen.findByTestId('geofence-editor-loading')).toBeVisible();
    expect(screen.queryByTestId('geofence-editor-form')).toBeNull();
  });
  it.each(['family', 'walker', 'vet', 'un error al leer el rol'] as const)('al editar como %s pinta la zona en solo lectura', async (role) => {
    mockGetPet.mockResolvedValue(role === 'un error al leer el rol' ? { kind: 'error' } : petState(role));
    await mount('geofence-1'); await screen.findByTestId('geofence-editor-form');
    const radius = screen.getByTestId('geofence-editor-radius-value');
    expect(childTestIds(radius.parent!)).toEqual(['geofence-editor-name-text', 'geofence-editor-radius-value', 'geofence-editor-read-only']);
    const name = screen.getByTestId('geofence-editor-name-text');
    expect(name).toHaveTextContent(casa.name); expect(name.props.selectable).toBe(true);
    expect(name.props.className).toBe('font-bold text-foreground');
    expect(radius).toHaveTextContent(catalog.es['geofences.radius'].replace('{{meters}}', '150'));
    const notice = screen.getByTestId('geofence-editor-read-only');
    expect(notice).toHaveTextContent('Solo el dueño de la mascota puede crear o editar zonas.');
    expect(notice.props.className).toBe('text-sm font-normal text-muted');
    for (const id of ['name', 'map-hint', 'radius', 'active', 'reset-note', 'save', 'delete']) expect(screen.queryByTestId(`geofence-editor-${id}`)).toBeNull();
  });
  it('en solo lectura el mapa no registra toques y dibuja la zona guardada', async () => {
    mockGetPet.mockResolvedValue(petState('family')); await mount('geofence-1');
    await screen.findByTestId('geofence-editor-form'); const map = screen.getByTestId('map-view');
    expect(map.props.onMapClick).toBeUndefined();
    expect(map.props.onPOIClick).toBeUndefined(); expect(map.props.onCircleClick).toBeUndefined();
    expect(circles()[0]).toEqual({ id: casa.id, center: { latitude: casa.centerLat, longitude: casa.centerLng }, radius: casa.radiusM });
  });
  it('al crear sin ser dueño pinta la tarjeta de solo dueño', async () => {
    mockGetPet.mockResolvedValue(petState('walker')); await mount();
    const card = await screen.findByTestId('geofence-editor-owner-only');
    expect(card).toHaveTextContent('Solo el dueño de la mascota puede crear o editar zonas.');
    expect(card.props.className).toBe('rounded-card border border-border bg-surface p-4 shadow-sm items-center py-8');
    expect(screen.queryByTestId('geofence-editor-form')).toBeNull();
  });
  it('pinta la solo lectura en inglés', async () => {
    mockGetPet.mockResolvedValue(petState('family')); await mount('geofence-1', 'en');
    expect(await screen.findByTestId('geofence-editor-read-only')).toHaveTextContent("Only the pet's owner can create or edit zones.");
  });
  it('pide el rol de la mascota con su token', async () => {
    await mount('geofence-1');
    await waitFor(() => expect(mockGetPet).toHaveBeenCalledWith(apiUrl, 'token-1', 'pet-1'));
  });
});
