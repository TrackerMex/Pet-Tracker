import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';

import { renderWithProviders } from '../../../test/render-with-providers';
import { createGeofence, listGeofences, updateGeofence, type Geofence } from '../../api/geofences';
import { getLastPosition } from '../../api/positions';
import type { LastPosition } from '../../api/types';
import type { Language } from '../../i18n/catalog';
import { LanguageProvider } from '../../providers/language-provider';
import { GeofenceEditorScreen } from '.';

jest.mock('../../api/geofences', () => ({
  listGeofences: jest.fn(), createGeofence: jest.fn(), updateGeofence: jest.fn(),
}));
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
function mount(geofenceId?: string, language: Language = 'es', onUnauthorized?: () => void) {
  function Wrapper({ children }: { children: ReactNode }) {
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
    await edit();
    expect(typeof screen.getByTestId('map-view').props.onPOIClick).toBe('function');
    await fireEvent(screen.getByTestId('map-view'), 'pOIClick', { coordinates: tap, name: 'POI' });
    expect(circles()[0].center).toEqual(tap);
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
    await fireEvent(screen.getByTestId('geofence-editor-radius'), 'change', 600);
    await fireEvent(screen.getByTestId('geofence-editor-radius'), 'changeEnd', [600]);
    expect(screen.getByTestId('map-view').props.cameraPosition).toEqual({ coordinates: { latitude: 19.4, longitude: -99.1 }, zoom: 15 });
  });
  it('TalkBack sube y baja el radio de diez en diez y encuadra', async () => {
    await edit();
    const thumb = screen.getByTestId('geofence-editor-radius-thumb');
    expect(thumb.props.accessibilityActions).toEqual([{ name: 'increment' }, { name: 'decrement' }]);
    await fireEvent(thumb, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    expect(screen.getByTestId('geofence-editor-radius').props.value).toBe(160);
    expect(screen.getByTestId('map-view').props.cameraPosition.zoom).toBeCloseTo(16.907, 3);
    await fireEvent(thumb, 'accessibilityAction', { nativeEvent: { actionName: 'decrement' } });
    expect(screen.getByTestId('geofence-editor-radius').props.value).toBe(150);
    expect(screen.getByTestId('map-view').props.cameraPosition.zoom).toBe(17);
  });
  it('TalkBack no sale de 20 ni de 2000', async () => {
    await edit();
    await fireEvent(screen.getByTestId('geofence-editor-radius'), 'change', 20);
    await fireEvent(screen.getByTestId('geofence-editor-radius-thumb'), 'accessibilityAction', { nativeEvent: { actionName: 'decrement' } });
    expect(screen.getByTestId('geofence-editor-radius').props.value).toBe(20);
    await fireEvent(screen.getByTestId('geofence-editor-radius'), 'change', 2000);
    await fireEvent(screen.getByTestId('geofence-editor-radius-thumb'), 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    expect(screen.getByTestId('geofence-editor-radius').props.value).toBe(2000);
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
