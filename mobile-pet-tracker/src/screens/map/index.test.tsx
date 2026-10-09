import { router } from 'expo-router';
import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { HeroUINativeProvider } from 'heroui-native';
import { useEffect, type ReactNode } from 'react';
import type { TestInstance } from 'test-renderer';

import { listGeofences, type Geofence, type GeofenceListState } from '../../api/geofences';
import {
  getPet,
  listPets,
  setLostMode,
  type PetState,
  type PetsState,
  type SetLostModeState,
} from '../../api/pets';
import {
  geofenceKeys,
  petKeys,
  positionKeys,
  tripKeys,
} from '../../api/query-keys';
import {
  getLastPosition,
  listPositions,
  type LastPositionState,
  type PositionsState,
} from '../../api/positions';
import { getDayRoute, type DayRouteState } from '../../api/trips';
import type {
  DeviceStatus,
  LastPosition,
  PetProfile,
  StoredPosition,
  TripDetail,
} from '../../api/types';
import { en, es } from '../../i18n/catalog';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import {
  SelectedPetProvider,
  useSelectedPet,
} from '../../providers/selected-pet-provider';
import { MapScreen } from '.';
import { renderWithProviders } from '../../../test/render-with-providers';

let mockFocusCleanup: (() => void) | undefined;
let mockTheme: 'light' | 'dark' = 'light';
let mockIsFocused = true;

jest.mock('../../api/geofences', () => ({ listGeofences: jest.fn() }));

jest.mock('../../api/pets', () => ({
  getPet: jest.fn(),
  listPets: jest.fn(),
  setLostMode: jest.fn(),
}));

jest.mock('../../api/positions', () => ({
  getLastPosition: jest.fn(),
  listPositions: jest.fn(),
}));

jest.mock('../../api/trips', () => ({
  getDayRoute: jest.fn(),
}));

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useIsFocused: () => mockIsFocused,
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = jest.requireActual<typeof import('react')>('react');
    React.useEffect(() => {
      const cleanup = callback();
      mockFocusCleanup = typeof cleanup === 'function' ? cleanup : undefined;
      return cleanup;
    }, [callback]);
  },
}));

jest.mock('expo-maps', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );
  const stub = (props: Record<string, unknown>) =>
    React.createElement(View, props, props.children as ReactNode);
  return {
    __esModule: true,
    GoogleMaps: {
      View: stub,
      MapColorScheme: {
        DARK: 'DARK',
        LIGHT: 'LIGHT',
        FOLLOW_SYSTEM: 'FOLLOW_SYSTEM',
      },
    },
  };
});

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

jest.mock('uniwind', () => ({
  ...jest.requireActual('uniwind'),
  useUniwind: () => ({ theme: mockTheme, hasAdaptiveThemes: false }),
}));

const mockListGeofences = jest.mocked(listGeofences);
const apiUrl = 'http://example.test/v1';
const mockGetDayRoute = jest.mocked(getDayRoute);
const mockGetLastPosition = jest.mocked(getLastPosition);
const mockGetPet = jest.mocked(getPet);
const mockListPets = jest.mocked(listPets);
const mockSetLostMode = jest.mocked(setLostMode);
const mockListPositions = jest.mocked(listPositions);
const mockUseAuth = jest.mocked(useAuth);
let initialSelectedPetId: string | null = null;

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
    mealsToday: null,
    createdAt: '2026-08-20T00:00:00.000Z',
    updatedAt: '2026-08-21T00:00:00.000Z',
    ...overrides,
  };
}

function makeDevice(connectivity: string | null): DeviceStatus {
  return {
    model: null,
    batteryPct: null,
    connectivity,
    lastMessageAt: null,
    esn: null,
  };
}

function makeLastPosition(
  overrides: Partial<LastPosition> = {},
): LastPosition {
  return {
    lat: 19.4326,
    lng: -99.1332,
    ts: 1787353200000,
    accuracy: 4.5,
    battery: 82,
    staleSeconds: 15,
    ...overrides,
  };
}

function makeTrip(overrides: Partial<TripDetail> = {}): TripDetail {
  return {
    index: 0,
    startTs: 1787353200000,
    endTs: 1787355000000,
    distanceM: 800,
    durationMin: 30,
    pointCount: 2,
    path: [
      { lat: 19.4326, lng: -99.1332, ts: 1787353200000 },
      { lat: 19.433, lng: -99.1328, ts: 1787355000000 },
    ],
    ...overrides,
  };
}

function makeStoredPosition(
  overrides: Partial<StoredPosition> = {},
): StoredPosition {
  return {
    ts: 1787353200000,
    lat: 19.4326,
    lng: -99.1332,
    speedKmh: 4.2,
    course: 90,
    altitude: 2240,
    sats: 9,
    accuracyM: 4.5,
    batteryPct: 82,
    flags: [],
    ...overrides,
  };
}

function elementChild(node: TestInstance, index: number): TestInstance {
  const child = node.children[index];
  if (typeof child === 'string') throw new Error('Expected an element child');
  return child;
}

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

function SelectedPetSeed() {
  const { selectPet } = useSelectedPet();

  useEffect(() => {
    if (initialSelectedPetId) selectPet(initialSelectedPetId);
  }, [selectPet]);

  return null;
}

function MapWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial="es">
        <SelectedPetProvider>
          <SelectedPetSeed />
          {children}
        </SelectedPetProvider>
      </LanguageProvider>
    </HeroUINativeProvider>
  );
}

async function renderMap() {
  return renderWithProviders(<MapScreen />, {
    wrapper: MapWrapper,
    onUnauthorized: () => void mockUseAuth().signOut(),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockFocusCleanup = undefined;
  mockTheme = 'light';
  initialSelectedPetId = null;
  mockIsFocused = true;
  process.env.EXPO_PUBLIC_API_URL = apiUrl;
  mockUseAuth.mockReturnValue({
    status: 'authenticated',
    token: 'jwt-token',
    signIn: jest.fn(),
    signOut: jest.fn(),
  } satisfies AuthContextValue);
  mockGetPet.mockResolvedValue({
    kind: 'ok',
    pet: makePet({ device: makeDevice('online') }),
  });
  mockGetLastPosition.mockReturnValue(pending<LastPositionState>());
  mockListPositions.mockReturnValue(pending<PositionsState>());
  mockGetDayRoute.mockReturnValue(pending<DayRouteState>());
  mockListGeofences.mockReset().mockReturnValue(pending<GeofenceListState>());
});

describe('R4: map resuelve la mascota seleccionada', () => {
  it('shows loading while the pet list is pending', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderMap();

    expect(screen.getByTestId('screen-map')).toBeVisible();
    expect(screen.getByTestId('map-loading')).toBeVisible();
  });

  it('R8 (mobile-design-drift): reserva el mapa completo con Skeleton', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderMap();

    expect(screen.getByTestId('map-loading').props.className).toContain('flex-1');
  });

  it('selects the first pet and loads its first position (#72 R2)', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })],
    });

    await renderMap();

    await waitFor(() => {
      expect(mockGetLastPosition).toHaveBeenCalledWith(
        apiUrl,
        'jwt-token',
        'pet-1',
      );
    });
  });

  it('replaces a selection that is absent from the pet list', async () => {
    initialSelectedPetId = 'removed-pet';
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });

    await renderMap();

    await waitFor(() => {
      expect(mockGetLastPosition).toHaveBeenCalledWith(
        apiUrl,
        'jwt-token',
        'pet-1',
      );
    });
  });

  it('shows the no-pets state without mounting a map', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });

    await renderMap();

    await waitFor(() => {
      expect(screen.getByTestId('map-no-pets-title')).toHaveTextContent(
        'Aún no tienes mascotas',
      );
    });
    expect(screen.queryByTestId('map-view')).toBeNull();
    expect(mockGetLastPosition).not.toHaveBeenCalled();
  });

  it.each([
    { kind: 'error' } as PetsState,
    { kind: 'unreachable', message: 'network down' } as PetsState,
    { kind: 'missing-config' } as PetsState,
  ])('shows and retries pet-list state $kind', async (firstState) => {
    mockListPets
      .mockResolvedValueOnce(firstState)
      .mockResolvedValueOnce({ kind: 'ok', pets: [] });

    await renderMap();
    await waitFor(() => expect(screen.getByTestId('map-error')).toBeVisible());

    await fireEvent.press(screen.getByTestId('map-retry'));

    await waitFor(() => expect(screen.getByTestId('map-no-pets')).toBeVisible());
    expect(mockListPets).toHaveBeenCalledTimes(2);
  });
});

describe('R5: mascota free degrada sin mapa', () => {
  it('shows the collar requirement without map, stats, lost mode, or polling', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({ kind: 'no-tracking' });

    await renderMap();

    await waitFor(() => {
      expect(screen.getByTestId('map-no-tracking-body')).toHaveTextContent(
        'Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.',
      );
    });
    expect(screen.queryByTestId('map-view')).toBeNull();
    expect(screen.queryByTestId('stat-speed')).toBeNull();
    expect(screen.queryByTestId('lost-mode-button')).toBeNull();
    expect(mockFocusCleanup).toBeUndefined();
  });
});

describe('R6: mapa y marker con la última posición', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('R8 (android-map-never-ready): el contenedor del mapa no declara fondo opaco', async () => {
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition(),
    });

    await renderMap();

    await waitFor(() => expect(screen.getByTestId('map-view')).toBeVisible());
    expect(screen.getByTestId('screen-map').props.className).not.toContain(
      'bg-',
    );
  });

  it('R3 (android-map-never-ready): centra el mapa y pasa la última posición como marker', async () => {
    const position = makeLastPosition({ lat: 19.45, lng: -99.12 });
    mockGetLastPosition.mockResolvedValue({ kind: 'ok', position });

    await renderMap();

    await waitFor(() => expect(screen.getByTestId('map-view')).toBeVisible());
    expect(screen.getByTestId('map-view').props).toEqual(
      expect.objectContaining({
        cameraPosition: {
          coordinates: { latitude: 19.45, longitude: -99.12 },
          zoom: 16,
        },
        markers: [
          {
            id: 'last-position',
            coordinates: { latitude: 19.45, longitude: -99.12 },
          },
        ],
        polylines: [],
        style: { flex: 1 },
      }),
    );
    expect(screen.queryByTestId('map-empty')).toBeNull();
  });

  it('R3 (android-map-never-ready): usa el centro por defecto y ningún marker sin posición', async () => {
    mockGetLastPosition.mockResolvedValue({ kind: 'ok', position: null });

    await renderMap();

    await waitFor(() => expect(screen.getByTestId('map-view')).toBeVisible());
    expect(screen.getByTestId('map-view').props).toEqual(
      expect.objectContaining({
        cameraPosition: {
          coordinates: { latitude: 19.4326, longitude: -99.1332 },
          zoom: 16,
        },
        markers: [],
        polylines: [],
      }),
    );
    expect(screen.getByTestId('map-empty')).toHaveTextContent(
      'Sin datos de ubicación todavía',
    );
  });

  it('R7 (mobile-design-drift): posiciona el overlay bajo el safe area', async () => {
    mockGetLastPosition.mockResolvedValue({ kind: 'ok', position: null });

    await renderMap();

    await waitFor(() =>
      expect(screen.getByTestId('map-empty-overlay')).toBeVisible(),
    );
    expect(screen.getByTestId('map-empty-overlay').props.style).toEqual(
      expect.objectContaining({ top: 52 }),
    );
  });
});

describe('R7 (mobile-figma-polish): mapa adapta su base al tema', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition(),
    });
  });

  it('R4 (android-map-never-ready): pasa LIGHT en tema claro', async () => {
    await renderMap();

    await waitFor(() => expect(screen.getByTestId('map-view')).toBeVisible());
    expect(screen.getByTestId('map-view').props.colorScheme).toBe('LIGHT');
  });

  it('R4 (android-map-never-ready): pasa DARK en tema oscuro', async () => {
    mockTheme = 'dark';

    await renderMap();

    await waitFor(() => expect(screen.getByTestId('map-view')).toBeVisible());
    expect(screen.getByTestId('map-view').props.colorScheme).toBe('DARK');
  });
});

describe('R7: ruta del día como polylines', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition(),
    });
  });

  it('R3 (android-map-never-ready): pasa una polyline mapeada por cada viaje', async () => {
    const first = makeTrip();
    const second = makeTrip({
      index: 1,
      path: [
        { lat: 19.44, lng: -99.12, ts: 1787360000000 },
        { lat: 19.45, lng: -99.11, ts: 1787361800000 },
      ],
    });
    mockGetDayRoute.mockResolvedValue({
      kind: 'ok',
      date: '2026-08-21',
      trips: [first, second],
    });

    await renderMap();

    await waitFor(() => {
      expect(screen.getByTestId('map-view')).toBeVisible();
      expect(screen.getByTestId('map-view').props.polylines).toEqual([
        {
          id: 'trip-0',
          coordinates: [
            { latitude: 19.4326, longitude: -99.1332 },
            { latitude: 19.433, longitude: -99.1328 },
          ],
          color: expect.any(String),
        },
        {
          id: 'trip-1',
          coordinates: [
            { latitude: 19.44, longitude: -99.12 },
            { latitude: 19.45, longitude: -99.11 },
          ],
          color: expect.any(String),
        },
      ]);
    });
  });

  it('R3 (android-map-never-ready): pasa un array vacío para un día sin viajes', async () => {
    mockGetDayRoute.mockResolvedValue({
      kind: 'ok',
      date: '2026-08-21',
      trips: [],
    });

    await renderMap();

    await waitFor(() =>
      expect(screen.getByTestId('stat-distance')).toHaveTextContent('0.0 km'),
    );
    expect(screen.getByTestId('map-view')).toBeVisible();
    expect(screen.getByTestId('map-view').props.polylines).toEqual([]);
  });

  it.each<DayRouteState>([
    { kind: 'error' },
    { kind: 'unreachable', message: 'network down' },
  ])(
    'R3 (android-map-never-ready): conserva marker y stats con ruta $kind',
    async (routeState) => {
      mockGetDayRoute.mockResolvedValue(routeState);

      await renderMap();

      await waitFor(() =>
        expect(screen.getByTestId('map-view')).toBeVisible(),
      );
      expect(screen.getByTestId('map-view').props.markers).toEqual([
        {
          id: 'last-position',
          coordinates: { latitude: 19.4326, longitude: -99.1332 },
        },
      ]);
      expect(screen.getByTestId('map-view').props.polylines).toEqual([]);
      expect(screen.getByTestId('stat-distance')).toHaveTextContent('—');
    },
  );
});

describe('R8: stats calculadas de positions y trips', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('uses the latest speed, trip total, fresh age, and live GPS', async () => {
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition({ staleSeconds: 15 }),
    });
    mockListPositions.mockResolvedValue({
      kind: 'ok',
      items: [
        makeStoredPosition({ speedKmh: 99 }),
        makeStoredPosition({ ts: 1787353260000, speedKmh: 12.34 }),
      ],
      nextCursor: null,
    });
    mockGetDayRoute.mockResolvedValue({
      kind: 'ok',
      date: '2026-08-21',
      trips: [makeTrip({ distanceM: 800 }), makeTrip({ index: 1, distanceM: 1200 })],
    });

    await renderMap();

    await waitFor(() => {
      expect(screen.getByTestId('stat-speed')).toHaveTextContent('12.3 km/h');
      expect(screen.getByTestId('stat-distance')).toHaveTextContent('2.0 km');
      expect(screen.getByTestId('stat-updated')).toHaveTextContent('Justo ahora');
      expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('GPS activo');
    });
    expect(screen.getByTestId('map-stats').props.style).toEqual(
      expect.objectContaining({
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 120,
      }),
    );
  });

  it('#94 R2: la antigüedad de la posición ya no mueve el tile de conexión', async () => {
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition({ staleSeconds: 121 }),
    });
    mockListPositions.mockResolvedValue({
      kind: 'ok',
      items: [],
      nextCursor: null,
    });
    mockGetDayRoute.mockResolvedValue({
      kind: 'ok',
      date: '2026-08-21',
      trips: [],
    });

    await renderMap();

    await waitFor(() => {
      expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('GPS activo');
      expect(screen.getByTestId('stat-speed')).toHaveTextContent('—');
      expect(screen.getByTestId('stat-distance')).toHaveTextContent('0.0 km');
      expect(screen.getByTestId('stat-updated')).toHaveTextContent('hace 2 min');
    });
  });

  it('uses the last item even when its speed is null', async () => {
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition(),
    });
    mockListPositions.mockResolvedValue({
      kind: 'ok',
      items: [
        makeStoredPosition({ speedKmh: 8 }),
        makeStoredPosition({ speedKmh: null }),
      ],
      nextCursor: null,
    });
    mockGetDayRoute.mockResolvedValue({
      kind: 'ok',
      date: '2026-08-21',
      trips: [],
    });

    await renderMap();

    await waitFor(() => expect(screen.getByTestId('stat-speed')).toHaveTextContent('—'));
  });

  it.each([
    [3599, 'hace 59 min'],
    [3600, 'hace 1 h'],
    [7500, 'hace 2 h'],
  ])('formats age %i seconds as %s', async (staleSeconds, expected) => {
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition({ staleSeconds }),
    });
    mockListPositions.mockResolvedValue({
      kind: 'ok',
      items: [],
      nextCursor: null,
    });
    mockGetDayRoute.mockResolvedValue({
      kind: 'ok',
      date: '2026-08-21',
      trips: [],
    });

    await renderMap();

    await waitFor(() => {
      expect(screen.getByTestId('stat-updated')).toHaveTextContent(expected);
    });
  });

  it('#94 R2: sin collar el tile de conexión dice Sin señal', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device: null }),
    });
    mockGetLastPosition.mockResolvedValue({ kind: 'ok', position: null });
    mockListPositions.mockResolvedValue({
      kind: 'ok',
      items: [],
      nextCursor: null,
    });
    mockGetDayRoute.mockResolvedValue({
      kind: 'ok',
      date: '2026-08-21',
      trips: [],
    });

    await renderMap();

    await waitFor(() => {
      expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('Sin señal');
    });
    expect(screen.getByTestId('stat-updated')).toHaveTextContent('—');
  });
});

describe('R9: polling con foco', () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['requestAnimationFrame'] });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition
      .mockResolvedValueOnce({
        kind: 'ok',
        position: makeLastPosition(),
      })
      .mockReturnValue(pending<LastPositionState>());
    mockListPositions.mockResolvedValue({
      kind: 'ok',
      items: [makeStoredPosition()],
      nextCursor: null,
    });
    mockGetDayRoute.mockResolvedValue({
      kind: 'ok',
      date: '2026-08-21',
      trips: [],
    });
  });

  afterEach(() => {
    mockFocusCleanup?.();
    jest.useRealTimers();
  });

  it('polls position APIs every 15 seconds, preserves data, and cleans up', async () => {
    const clearIntervalSpy = jest.spyOn(globalThis, 'clearInterval');
    await renderMap();

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(screen.getByTestId('map-view').props.markers).toEqual([
        {
          id: 'last-position',
          coordinates: { latitude: 19.4326, longitude: -99.1332 },
        },
      ]),
    );
    expect(mockFocusCleanup).toEqual(expect.any(Function));
    const initialLastCalls = mockGetLastPosition.mock.calls.length;
    const initialPositionsCalls = mockListPositions.mock.calls.length;
    const initialRouteCalls = mockGetDayRoute.mock.calls.length;
    expect(initialRouteCalls).toBeGreaterThan(1);

    await act(async () => {
      jest.advanceTimersByTime(15000);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockGetLastPosition).toHaveBeenCalledTimes(initialLastCalls + 1);
    expect(mockListPositions).toHaveBeenCalledTimes(initialPositionsCalls + 1);
    expect(mockGetDayRoute).toHaveBeenCalledTimes(initialRouteCalls);
    expect(screen.getByTestId('map-view').props.markers).toEqual([
      {
        id: 'last-position',
        coordinates: { latitude: 19.4326, longitude: -99.1332 },
      },
    ]);

    const blurCleanup = mockFocusCleanup;
    await act(async () => {
      blurCleanup?.();
      await Promise.resolve();
    });
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});

describe('R6: owner toglea lost mode contra el endpoint', () => {
  beforeEach(() => {
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition(),
    });
    mockListPositions.mockResolvedValue({
      kind: 'ok',
      items: [],
      nextCursor: null,
    });
    mockGetDayRoute.mockResolvedValue({
      kind: 'ok',
      date: '2026-08-21',
      trips: [],
    });
  });

  it.each([
    [false, 'Activar modo perdido'],
    [true, 'Desactivar modo perdido'],
  ])('shows the owner action for lostMode=%s', async (lostMode, label) => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet({ lostMode })],
    });

    await renderMap();

    await waitFor(() => {
      expect(screen.getByTestId('lost-mode-button')).toBeVisible();
    });
    expect(screen.getByTestId('lost-mode-button')).toHaveTextContent(label);
    expect(
      screen.getByTestId('lost-mode-button').props.accessibilityState,
    ).toEqual(expect.objectContaining({ disabled: false }));
    expect(screen.queryByText('Coming soon')).toBeNull();
  });

  it('posts the inverse, disables in flight, and refetches the new label', async () => {
    mockListPets
      .mockResolvedValueOnce({ kind: 'ok', pets: [makePet()] })
      .mockResolvedValue({
        kind: 'ok',
        pets: [makePet({ lostMode: true })],
      });
    let resolveToggle!: (state: SetLostModeState) => void;
    mockSetLostMode.mockReturnValue(
      new Promise<SetLostModeState>((resolve) => {
        resolveToggle = resolve;
      }),
    );

    await renderMap();
    await waitFor(() =>
      expect(screen.getByTestId('lost-mode-button')).toHaveTextContent(
        'Activar modo perdido',
      ),
    );

    fireEvent.press(screen.getByTestId('lost-mode-button'));

    await waitFor(() => {
      expect(
        screen.getByTestId('lost-mode-button').props.accessibilityState,
      ).toEqual(expect.objectContaining({ disabled: true }));
    });
    expect(mockSetLostMode).toHaveBeenCalledWith(
      apiUrl,
      'jwt-token',
      'pet-1',
      true,
    );

    await act(async () => {
      resolveToggle({ kind: 'ok', pet: makePet({ lostMode: true }) });
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(screen.getByTestId('lost-mode-button')).toHaveTextContent(
        'Desactivar modo perdido',
      ),
    );
    expect(mockListPets.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});

describe('R7: no-owner deshabilitado y error visible', () => {
  beforeEach(() => {
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition(),
    });
    mockListPositions.mockResolvedValue({
      kind: 'ok',
      items: [],
      nextCursor: null,
    });
    mockGetDayRoute.mockResolvedValue({
      kind: 'ok',
      date: '2026-08-21',
      trips: [],
    });
  });

  it('keeps the family action visible and disabled without calling the API', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet({ myRole: 'family' })],
    });

    await renderMap();

    await waitFor(() => {
      expect(screen.getByTestId('lost-mode-button')).toBeVisible();
    });
    expect(
      screen.getByTestId('lost-mode-button').props.accessibilityState,
    ).toEqual(expect.objectContaining({ disabled: true }));
    expect(screen.queryByText('Coming soon')).toBeNull();

    fireEvent.press(screen.getByTestId('lost-mode-button'));

    expect(mockSetLostMode).not.toHaveBeenCalled();
  });

  it('shows a failure, re-enables, and clears the error on retry', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    let resolveRetry!: (state: SetLostModeState) => void;
    mockSetLostMode
      .mockResolvedValueOnce({ kind: 'forbidden' })
      .mockReturnValueOnce(
        new Promise<SetLostModeState>((resolve) => {
          resolveRetry = resolve;
        }),
      );

    await renderMap();
    await waitFor(() =>
      expect(screen.getByTestId('lost-mode-button')).toBeVisible(),
    );

    fireEvent.press(screen.getByTestId('lost-mode-button'));

    await waitFor(() => {
      expect(screen.getByTestId('lost-mode-error')).toHaveTextContent(
        'No se pudo cambiar el modo perdido',
      );
    });
    expect(screen.getByTestId('lost-mode-error').props.selectable).toBe(true);
    expect(screen.getByTestId('lost-mode-error').props.className).toContain(
      'text-danger',
    );
    expect(
      screen.getByTestId('lost-mode-button').props.accessibilityState,
    ).toEqual(expect.objectContaining({ disabled: false }));

    fireEvent.press(screen.getByTestId('lost-mode-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('lost-mode-error')).toBeNull();
    });
    expect(mockSetLostMode).toHaveBeenCalledTimes(2);

    await act(async () => {
      resolveRetry({ kind: 'ok', pet: makePet({ lostMode: true }) });
      await Promise.resolve();
    });
  });
});

describe('R1 (mobile-map-last-position-error-state): rama de error de last', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('muestra mensaje y Reintentar cuando last devuelve error', async () => {
    mockGetLastPosition.mockResolvedValue({ kind: 'error' });

    await renderMap();

    await waitFor(() => {
      expect(screen.getByTestId('map-last-error')).toHaveTextContent(
        'Algo salió mal',
      );
    });
    expect(screen.getByTestId('map-last-error').props.selectable).toBe(true);
    expect(screen.getByTestId('map-last-retry')).toHaveTextContent('Reintentar');
    expect(screen.queryByTestId('map-view')).toBeNull();
    expect(screen.queryByTestId('map-error')).toBeNull();
  });

  it('Reintentar llama al refetch de last y recupera el mapa', async () => {
    mockGetLastPosition
      .mockResolvedValueOnce({ kind: 'error' })
      .mockResolvedValue({
        kind: 'ok',
        position: makeLastPosition(),
      });

    await renderMap();
    await waitFor(() => {
      expect(screen.getByTestId('map-last-retry')).toBeVisible();
    });

    fireEvent.press(screen.getByTestId('map-last-retry'));

    await waitFor(() => expect(screen.getByTestId('map-view')).toBeVisible());
    expect(mockGetLastPosition.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('la rama pinta bg-background y screen-map sigue sin fondo', async () => {
    mockGetLastPosition.mockResolvedValue({ kind: 'error' });

    await renderMap();

    await waitFor(() => {
      expect(screen.getByTestId('map-last-error-state')).toBeVisible();
    });
    expect(
      screen.getByTestId('map-last-error-state').props.className,
    ).toContain('bg-background');
    expect(screen.getByTestId('screen-map').props.className).not.toContain(
      'bg-',
    );
  });
});

describe('R2 (mobile-map-last-position-error-state): unauthorized de last', () => {
  it('comparte la rama de error y dispara el signOut de sesión expirada', async () => {
    const signOut = jest.fn();
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut,
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({ kind: 'unauthorized' });

    await renderMap();

    await waitFor(() => {
      expect(screen.getByTestId('map-last-error')).toBeVisible();
    });
    expect(signOut).toHaveBeenCalled();
  });
});

describe('R3 (mobile-map-last-position-error-state): cobertura total y exclusión mutua', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it.each<LastPositionState>([
    { kind: 'unreachable', message: 'network down' },
    { kind: 'missing-config' },
  ])(
    'muestra la rama de error y reintenta con $kind',
    async (firstState) => {
      mockGetLastPosition.mockResolvedValueOnce(firstState).mockResolvedValue({
        kind: 'ok',
        position: makeLastPosition(),
      });

      await renderMap();
      await waitFor(() => {
        expect(screen.getByTestId('map-last-retry')).toBeVisible();
      });

      fireEvent.press(screen.getByTestId('map-last-retry'));

      await waitFor(() =>
        expect(screen.getByTestId('map-view')).toBeVisible(),
      );
      expect(mockGetLastPosition.mock.calls.length).toBeGreaterThanOrEqual(2);
    },
  );

  it('solo la rama de error de pets renderiza cuando pets cae con last resuelto', async () => {
    mockListPets
      .mockResolvedValueOnce({ kind: 'ok', pets: [makePet()] })
      .mockResolvedValue({ kind: 'unreachable', message: 'network down' });
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition(),
    });
    mockSetLostMode.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ lostMode: true }),
    });

    await renderMap();
    await waitFor(() => expect(screen.getByTestId('map-view')).toBeVisible());

    fireEvent.press(screen.getByTestId('lost-mode-button'));

    await waitFor(() => expect(screen.getByTestId('map-error')).toBeVisible());
    expect(screen.queryByTestId('map-view')).toBeNull();
    expect(screen.queryByTestId('map-last-error')).toBeNull();
  });
});

describe('R4 (mobile-map-last-position-error-state): unauthorized de pets', () => {
  it('renderiza la rama de error de pets y dispara signOut', async () => {
    const signOut = jest.fn();
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut,
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'unauthorized' });

    await renderMap();

    await waitFor(() => expect(screen.getByTestId('map-error')).toBeVisible());
    expect(screen.getByTestId('map-retry')).toBeVisible();
    expect(signOut).toHaveBeenCalled();
    expect(mockGetLastPosition).not.toHaveBeenCalled();
  });
});

describe('#61 R11: el overlay de stats reparte los cuatro tiles en 2x2 sin envolver', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it.each(['stat-speed', 'stat-distance', 'stat-updated', 'stat-battery'])(
    '%s se queda en una sola línea',
    async (testID) => {
      mockGetLastPosition.mockResolvedValue({
        kind: 'ok',
        position: makeLastPosition({ staleSeconds: 15 }),
      });

      await renderMap();

      await waitFor(() => expect(screen.getByTestId(testID)).toBeVisible());

      expect(screen.getByTestId(testID).props.numberOfLines).toBe(1);
    },
  );

  /**
   * Fila `flex-row gap-2` que contiene el tile de ese valor. Subir por el árbol
   * es la única forma de afirmar la maqueta: aplanar el overlay a una sola fila
   * de cuatro deja los cuatro `numberOfLines` intactos y no rompería nada más.
   */
  function statRow(testID: string): ReturnType<typeof screen.getByTestId> {
    let node: ReturnType<typeof screen.getByTestId> | null =
      screen.getByTestId(testID);

    while (node && node.props.className !== 'flex-row gap-2') {
      node = node.parent;
    }

    if (!node) {
      throw new Error(`${testID} no cuelga de ninguna fila flex-row gap-2`);
    }

    return node;
  }

  /**
   * Los `stat-*` de esa fila, en orden de lectura. Se reduce a cadenas a
   * propósito: un `ReactTestInstance` tiene `parent` circular y jest revienta
   * el worker al serializar el diff si el assert falla.
   */
  function statsIn(row: ReturnType<typeof screen.getByTestId>): string[] {
    return within(row)
      .queryAllByTestId(/^stat-/)
      .map((node) => String(node.props.testID));
  }

  it('reparte los tiles en dos filas de dos y no en una fila de cuatro', async () => {
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition({ staleSeconds: 15 }),
    });

    await renderMap();

    await waitFor(() => expect(screen.getByTestId('stat-battery')).toBeVisible());

    expect(statsIn(statRow('stat-speed'))).toEqual([
      'stat-speed',
      'stat-distance',
    ]);
    expect(statsIn(statRow('stat-updated'))).toEqual([
      'stat-updated',
      'stat-battery',
    ]);
  });

  it('conserva los cuatro tiles, su orden de lectura y el overlay absoluto', async () => {
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition({ staleSeconds: 15 }),
    });

    await renderMap();

    await waitFor(() => expect(screen.getByTestId('stat-speed')).toBeVisible());

    expect(screen.getByTestId('stat-distance')).toBeVisible();
    expect(screen.getByTestId('stat-updated')).toBeVisible();
    expect(screen.getByTestId('stat-battery')).toBeVisible();
    expect(screen.getByText('Velocidad')).toBeVisible();
    expect(screen.getByText('Distancia')).toBeVisible();
    expect(screen.getByText('Actualizado')).toBeVisible();
    expect(screen.getByText('Batería')).toBeVisible();
    expect(screen.getByTestId('map-stats').props.style).toEqual(
      expect.objectContaining({
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 120,
      }),
    );
  });
});

describe('#62 R3: el overlay vacío del mapa usa el Card compartido', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({ kind: 'ok', position: null });
  });

  it('hereda la receta de Card y conserva su style absoluto como objeto', async () => {
    await renderMap();

    const overlay = await screen.findByTestId('map-empty-overlay');

    expect(overlay.props.className).toContain('rounded-card');
    expect(overlay.props.className).toContain('border');
    expect(overlay.props.className).toContain('shadow-sm');
    expect(overlay.props.className).toContain('bg-surface');
    expect(overlay.props.style).toEqual(
      expect.objectContaining({
        position: 'absolute',
        top: 52,
        left: 16,
        right: 16,
      }),
    );
    expect(Array.isArray(overlay.props.style)).toBe(false);
  });
});

describe('#62 R15: el overlay del mapa usa cifras tabulares', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition({ staleSeconds: 15 }),
    });
  });

  it('estabiliza los valores numéricos sin tratar GPS como contador', async () => {
    await renderMap();

    const speed = await screen.findByTestId('stat-speed');

    expect(speed.props.style).toEqual(
      expect.objectContaining({ fontVariant: ['tabular-nums'] }),
    );
    expect(screen.getByTestId('stat-battery').props.style).toEqual(
      expect.objectContaining({ fontVariant: ['tabular-nums'] }),
    );
    expect(screen.getByTestId('map-pet-pill-status').props.style).not.toEqual(
      expect.objectContaining({ fontVariant: ['tabular-nums'] }),
    );
  });
});

describe('#87 R18: MapScreen lee por TanStack Query', () => {
  it('deja cada recurso en su clave canónica', async () => {
    initialSelectedPetId = 'pet-1';
    const petsState: PetsState = { kind: 'ok', pets: [makePet()] };
    const petDetailState: PetState = {
      kind: 'ok',
      pet: makePet({ device: makeDevice('online') }),
    };
    const lastState: LastPositionState = {
      kind: 'ok',
      position: makeLastPosition(),
    };
    const positionsState: PositionsState = {
      kind: 'ok',
      items: [makeStoredPosition()],
      nextCursor: null,
    };
    const routeState: DayRouteState = {
      kind: 'ok',
      date: '2026-08-21',
      trips: [makeTrip()],
    };
    const geofencesState: GeofenceListState = { kind: 'ok', geofences: [] };
    mockListGeofences.mockResolvedValue(geofencesState);
    mockListPets.mockResolvedValue(petsState);
    mockGetPet.mockResolvedValue(petDetailState);
    mockGetLastPosition.mockResolvedValue(lastState);
    mockListPositions.mockResolvedValue(positionsState);
    mockGetDayRoute.mockResolvedValue(routeState);

    const { queryClient } = await renderWithProviders(<MapScreen />, {
      wrapper: MapWrapper,
    });
    await screen.findByTestId('stat-speed');

    expect(queryClient.getQueryData(petKeys.list())).toEqual(petsState);
    expect(queryClient.getQueryData(petKeys.detail('pet-1'))).toEqual(
      petDetailState,
    );
    expect(queryClient.getQueryData(positionKeys.last('pet-1'))).toEqual(
      lastState,
    );
    expect(queryClient.getQueryData(positionKeys.list('pet-1'))).toEqual(
      positionsState,
    );
    expect(queryClient.getQueryData(tripKeys.dayRoute('pet-1'))).toEqual(
      routeState,
    );
    await waitFor(() => expect(queryClient.getQueryData(geofenceKeys.list('pet-1'))).toEqual(geofencesState));
  });
});

describe('#94 R2: el tile de conexión sigue al collar', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition({ staleSeconds: 15 }),
    });
  });

  it('muestra GPS activo aunque después falte la posición', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device: makeDevice('online') }),
    });

    const { queryClient } = await renderMap();

    await waitFor(() =>
      expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('GPS activo'),
    );

    await act(async () => {
      queryClient.setQueryData(positionKeys.last('pet-1'), {
        kind: 'ok',
        position: null,
      } satisfies LastPositionState);
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(screen.getByTestId('stat-updated')).toHaveTextContent('—'),
    );
    expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('GPS activo');
  });

  it('muestra Desactualizado para un collar offline', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device: makeDevice('offline') }),
    });

    await renderMap();

    await waitFor(() =>
      expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent(
        'Desactualizado',
      ),
    );
  });

  it('muestra Sin señal para una conectividad desconocida', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device: makeDevice(null) }),
    });

    await renderMap();

    await waitFor(() =>
      expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('Sin señal'),
    );
  });

  it('muestra Sin señal sin collar aunque haya posición', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device: null }),
    });

    await renderMap();

    await waitFor(() =>
      expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('Sin señal'),
    );
  });
});

describe('#94 R3: sin detalle el tile de conexión cae al guion', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition(),
    });
  });

  it('muestra el guion mientras el detalle está pendiente', async () => {
    mockGetPet.mockReturnValue(pending<PetState>());

    await renderMap();

    await waitFor(() =>
      expect(screen.getByTestId('stat-speed')).toBeVisible(),
    );
    expect(screen.getByTestId('stat-distance')).toBeVisible();
    expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('—');
  });

  it('muestra el guion cuando el detalle falla', async () => {
    mockGetPet.mockResolvedValue({ kind: 'error' });

    await renderMap();

    await waitFor(() =>
      expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('—'),
    );
  });
});

describe('#94 R4: la antigüedad y la conexión son datos independientes', () => {
  it('muestra un collar online junto a una posición de hace dos minutos', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device: makeDevice('online') }),
    });
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition({ staleSeconds: 121 }),
    });

    await renderMap();

    await waitFor(() =>
      expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('GPS activo'),
    );
    expect(screen.getByTestId('stat-updated')).toHaveTextContent('hace 2 min');
  });
});

describe('#94 R6 (enmienda #116): el mapa ya no rotula la conexión', () => {
  it('retira Conexión y GPS y rotula Batería', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition(),
    });

    await renderMap();

    await waitFor(() => expect(screen.getByTestId('stat-speed')).toBeVisible());
    expect(screen.queryByText('Conexión')).toBeNull();
    expect(screen.queryByText('GPS')).toBeNull();
    expect(screen.getByText('Batería')).toBeVisible();
  });
});

describe('#94 R7: el poll refresca también el detalle', () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['requestAnimationFrame'] });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetPet
      .mockResolvedValueOnce({
        kind: 'ok',
        pet: makePet({ device: makeDevice('online') }),
      })
      .mockResolvedValue({
        kind: 'ok',
        pet: makePet({ device: makeDevice('offline') }),
      });
    mockGetLastPosition.mockResolvedValue({
      kind: 'ok',
      position: makeLastPosition(),
    });
    mockListPositions.mockResolvedValue({
      kind: 'ok',
      items: [makeStoredPosition()],
      nextCursor: null,
    });
    mockGetDayRoute.mockResolvedValue({
      kind: 'ok',
      date: '2026-08-21',
      trips: [],
    });
  });

  afterEach(() => {
    mockFocusCleanup?.();
    jest.useRealTimers();
  });

  it('actualiza el badge con el mismo intervalo de 15 segundos', async () => {
    await renderMap();

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('GPS activo'),
    );
    const initialDetailCalls = mockGetPet.mock.calls.length;

    await act(async () => {
      jest.advanceTimersByTime(15000);
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent(
        'Desactualizado',
      ),
    );
    expect(mockGetPet).toHaveBeenCalledTimes(initialDetailCalls + 1);
    expect(mockGetPet).toHaveBeenLastCalledWith(
      apiUrl,
      'jwt-token',
      'pet-1',
    );
  });
});

const casa: Geofence = {
  id: 'geofence-1', petId: 'pet-1', name: 'Casa', type: 'safe_circle',
  centerLat: 19.4, centerLng: -99.1, radiusM: 150, active: true,
  state: { value: 'unknown', updatedAt: null },
  createdAt: '2026-10-01T12:00:00.000Z', updatedAt: '2026-10-01T12:00:00.000Z',
};
const parque: Geofence = { ...casa, id: 'geofence-2', name: 'Parque', centerLat: 19.42, centerLng: -99.15, radiusM: 600, active: false };

describe('#146 R11: la pestaña Mapa dibuja las zonas activas de la mascota', () => {
  beforeEach(() => {
    initialSelectedPetId = 'pet-1';
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({ kind: 'ok', position: makeLastPosition() });
  });
  it('dibuja como círculos solo las zonas activas de la mascota', async () => {
    mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [casa, parque] });
    await renderMap();
    await waitFor(() => expect(screen.getByTestId('map-view').props.circles.map(({ id, center, radius }: { id: string; center: unknown; radius: number }) => ({ id, center, radius }))).toEqual([
      { id: 'geofence-1', center: { latitude: 19.4, longitude: -99.1 }, radius: 150 },
    ]));
  });
  it('pide las zonas de la mascota seleccionada con su token', async () => {
    await renderMap();
    await waitFor(() => expect(mockListGeofences).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1'));
  });
  it.each(['pendiente', 'error'] as const)('con la lista de zonas %s pinta el mapa sin círculos', async (kind) => {
    if (kind === 'error') mockListGeofences.mockResolvedValue({ kind });
    await renderMap(); const map = await screen.findByTestId('map-view');
    expect(map).toBeVisible(); expect(map.props.circles).toEqual([]);
  });
  it('no pide zonas sin mascota seleccionada', async () => {
    initialSelectedPetId = null; mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderMap(); await screen.findByTestId('map-no-pets');
    expect(mockListGeofences).not.toHaveBeenCalled();
  });
  it('el poll de 15 s no vuelve a pedir las zonas', async () => {
    jest.useFakeTimers({ doNotFake: ['requestAnimationFrame'] });
    mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [] });
    try {
      await renderMap(); await screen.findByTestId('map-view');
      const initialCalls = mockListGeofences.mock.calls.length;
      await act(async () => { jest.advanceTimersByTime(15000); await Promise.resolve(); await Promise.resolve(); });
      expect(mockListGeofences).toHaveBeenCalledTimes(initialCalls);
    } finally { mockFocusCleanup?.(); jest.useRealTimers(); }
  });
});


describe('#116 R1: el estado activo usa la palabra del Make', () => {
  it('resuelve map.live a GPS active y GPS activo y lo registra en la tabla de copy', () => {
    expect(en['map.live']).toBe('GPS active');
    expect(es['map.live']).toBe('GPS activo');
    const design = readFileSync(
      join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md'),
      'utf8',
    );
    expect(design).toMatch(
      /\| 198 \| `map\.live` \| `GPS active` \| `GPS activo`[^\n]*← literal cambiado por #116 \(R1\)/,
    );
  });
});


describe('#116 R2: la píldora existe encima de la tarjeta de stats', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({ kind: 'ok', position: makeLastPosition() });
  });

  it('pinta la píldora como hijo 0 de map-stats y la tarjeta como hijo 1', async () => {
    await renderMap();
    await waitFor(() => expect(screen.getByTestId('map-pet-pill')).toBeVisible());

    const stats = screen.getByTestId('map-stats');
    expect(elementChild(stats, 0).props.testID).toBe('map-pet-pill');
    expect(within(elementChild(stats, 1)).getByTestId('stat-speed')).toBeVisible();
  });

  it('compone la cápsula con la receta exacta y sin esquina continua', async () => {
    await renderMap();
    await waitFor(() => expect(screen.getByTestId('map-pet-pill')).toBeVisible());

    const pill = screen.getByTestId('map-pet-pill');
    expect(pill.props.className).toBe(
      'flex-row items-center gap-2 self-start rounded-full border border-border bg-surface px-3 py-2 shadow-sm',
    );
    expect(pill.props.style).toBeUndefined();
  });

  it('no pinta la píldora mientras la selección no está en la lista', async () => {
    mockIsFocused = false;
    initialSelectedPetId = 'removed-pet';

    await renderMap();
    await waitFor(() => expect(screen.getByTestId('stat-speed')).toBeVisible());

    expect(screen.queryByTestId('map-pet-pill')).toBeNull();
  });
});

describe('#116 R3: la píldora muestra avatar y nombre', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({ kind: 'ok', position: makeLastPosition() });
  });

  it('pinta el avatar de 24 sin foto', async () => {
    await renderMap();
    await waitFor(() => expect(screen.getByTestId('map-pet-pill')).toBeVisible());

    const avatar = elementChild(screen.getByTestId('map-pet-pill'), 0);
    expect(avatar.props.testID).toBe('map-pet-pill-avatar');
    expect(avatar.props.width).toBe(24);
    expect(avatar.props.height).toBe(24);
  });

  it('pinta la foto de la lista con su cacheKey', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet({ photoUrl: 'https://cdn.example/luna.jpg' })],
    });
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ photoUrl: null, device: makeDevice('online') }),
    });

    await renderMap();
    await waitFor(() => expect(screen.getByTestId('map-pet-pill')).toBeVisible());

    const avatar = elementChild(screen.getByTestId('map-pet-pill'), 0);
    expect(avatar.props.source).toEqual([{ uri: 'https://cdn.example/luna.jpg', cacheKey: 'pet-1' }]);
    expect(avatar.props.style).toEqual({ width: 24, height: 24, borderRadius: 12 });
  });

  it('rotula el nombre de la lista en una línea', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ name: 'Luna' })] });
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ name: 'Nala', device: makeDevice('online') }),
    });

    await renderMap();
    await waitFor(() =>
      expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('GPS activo'),
    );

    const name = elementChild(screen.getByTestId('map-pet-pill'), 1);
    expect(name.props.testID).toBe('map-pet-pill-name');
    expect(name).toHaveTextContent('Luna');
    expect(name.props.className).toBe('shrink text-xs font-bold text-foreground');
    expect(name.props.numberOfLines).toBe(1);
  });

});


describe('#116 R4: la píldora muestra el estado del GPS', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({ kind: 'ok', position: makeLastPosition() });
  });

  it.each([
    ['online', makeDevice('online'), 'GPS activo', 'bg-success', 'text-accent-strong'],
    ['offline', makeDevice('offline'), 'Desactualizado', 'bg-warning-strong', 'text-warning-strong'],
    ['unknown', makeDevice('mystery'), 'Sin señal', 'bg-muted', 'text-muted'],
    ['sin collar', null, 'Sin señal', 'bg-muted', 'text-muted'],
    ['detalle pendiente', null, '—', 'bg-muted', 'text-muted'],
    ['detalle con error', null, '—', 'bg-muted', 'text-muted'],
  ] as const)('%s: rotula su estado con su punto y su tinta', async (scenario, device, label, dotClass, textClass) => {
    if (scenario === 'detalle pendiente') {
      mockGetPet.mockReturnValue(pending<PetState>());
    } else if (scenario === 'detalle con error') {
      mockGetPet.mockResolvedValue({ kind: 'error' });
    } else {
      mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ device }) });
    }

    await renderMap();
    if (scenario === 'detalle pendiente' || scenario === 'detalle con error') {
      await waitFor(() => expect(screen.getByTestId('stat-speed')).toBeVisible());
    }
    if (scenario !== 'detalle pendiente') {
      await waitFor(() =>
        expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent(label),
      );
    }

    const status = screen.getByTestId('map-pet-pill-status');
    expect(status).toHaveTextContent(label);
    expect(screen.getByTestId('map-pet-pill-dot').props.className).toBe(`size-2 rounded-full ${dotClass}`);
    expect(status.props.className).toBe(`text-2xs font-semibold ${textClass}`);
    expect(screen.getByTestId('map-pet-pill').props.accessibilityLabel).toBe(`Luna, ${label}`);
  });

  it('fija cuatro hijos en orden: avatar, nombre, punto, estado', async () => {
    await renderMap();
    await waitFor(() =>
      expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('GPS activo'),
    );

    const pill = screen.getByTestId('map-pet-pill');
    expect(pill.children).toHaveLength(4);
    expect([0, 1, 2, 3].map((index) => elementChild(pill, index).props.testID)).toEqual([
      'map-pet-pill-avatar', 'map-pet-pill-name', 'map-pet-pill-dot', 'map-pet-pill-status',
    ]);
  });

  it('agrupa la píldora para el lector de pantalla y deja el estado en una línea sin cifras tabulares', async () => {
    await renderMap();
    await waitFor(() =>
      expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('GPS activo'),
    );

    expect(screen.getByTestId('map-pet-pill').props.accessible).toBe(true);
    const status = screen.getByTestId('map-pet-pill-status');
    expect(status.props.numberOfLines).toBe(1);
    expect(status.props.style).toBeUndefined();
  });
});


describe('#116 R5: la batería sustituye al tile de conexión', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({ kind: 'ok', position: makeLastPosition() });
  });

  it('monta el tile de batería con valor y rótulo en ese orden', async () => {
    await renderMap();
    await waitFor(() => expect(screen.getByTestId('stat-battery')).toBeVisible());

    let tile: TestInstance | null = screen.getByTestId('stat-battery');
    while (tile && tile.props.className !== 'flex-1 items-center rounded-xl bg-default p-3') {
      tile = tile.parent;
    }
    if (!tile) throw new Error('La batería no cuelga de su tile');

    expect(tile.children.length).toBe(2);
    expect(elementChild(tile, 0).props.testID).toBe('stat-battery');
    expect(elementChild(tile, 1)).toHaveTextContent('Batería');
    expect(elementChild(tile, 1).props.className).toBe('mt-1 text-2xs font-normal text-muted');
  });

  it('retira stat-gps del mapa', async () => {
    await renderMap();
    await waitFor(() => expect(screen.getByTestId('stat-battery')).toBeVisible());

    expect(screen.queryByTestId('stat-gps')).toBeNull();
  });
});

describe('#116 R6: la batería se lee con formato entero y tinta por umbral', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({ kind: 'ok', position: makeLastPosition() });
  });

  it.each([
    [100, '100%', 'text-base font-black text-accent-strong'],
    [82, '82%', 'text-base font-black text-accent-strong'],
    [61, '61%', 'text-base font-black text-accent-strong'],
    [60, '60%', 'text-base font-black text-warning-strong'],
    [15, '15%', 'text-base font-black text-warning-strong'],
    [0, '0%', 'text-base font-black text-warning-strong'],
  ] as const)('%i se lee %s con %s', async (batteryPct, value, className) => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device: { ...makeDevice('online'), batteryPct } }),
    });

    await renderMap();
    await waitFor(() => expect(screen.getByTestId('stat-battery')).toHaveTextContent(value));

    expect(screen.getByTestId('stat-battery').props.className).toBe(className);
  });
});

describe('#116 R7: la batería cae al guion y solo la lee el detalle', () => {
  beforeEach(() => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({ kind: 'ok', position: makeLastPosition() });
  });

  it('muestra el guion mientras el detalle está pendiente', async () => {
    mockGetPet.mockReturnValue(pending<PetState>());

    await renderMap();
    await waitFor(() => expect(screen.getByTestId('stat-speed')).toBeVisible());

    const battery = screen.getByTestId('stat-battery');
    expect(battery).toHaveTextContent('—');
    expect(battery.props.className).toBe('text-base font-black text-muted');
  });

  it('muestra el guion cuando el detalle falla', async () => {
    mockGetPet.mockResolvedValue({ kind: 'error' });

    await renderMap();
    await waitFor(() => expect(screen.getByTestId('stat-speed')).toBeVisible());
    await waitFor(() => expect(screen.getByTestId('stat-battery')).toHaveTextContent('—'));

    expect(screen.getByTestId('stat-battery').props.className).toBe('text-base font-black text-muted');
  });

  it('muestra el guion sin collar', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ device: null }) });

    await renderMap();
    await waitFor(() => expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('Sin señal'));

    const battery = screen.getByTestId('stat-battery');
    expect(battery).toHaveTextContent('—');
    expect(battery.props.className).toBe('text-base font-black text-muted');
  });

  it('ignora la batería de la última posición cuando el collar no la trae', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ device: makeDevice('online') }) });
    mockGetLastPosition.mockResolvedValue({ kind: 'ok', position: makeLastPosition({ battery: 82 }) });

    await renderMap();
    await waitFor(() => expect(screen.getByTestId('map-pet-pill-status')).toHaveTextContent('GPS activo'));

    const battery = screen.getByTestId('stat-battery');
    expect(battery).toHaveTextContent('—');
    expect(battery.props.className).toBe('text-base font-black text-muted');
  });

  it('lee la batería del detalle y no de la lista', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet({ device: { ...makeDevice('online'), batteryPct: 10 } })],
    });
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device: { ...makeDevice('online'), batteryPct: 82 } }),
    });

    await renderMap();
    await waitFor(() => expect(screen.getByTestId('stat-battery')).toHaveTextContent('82%'));

    expect(screen.getByTestId('stat-battery').props.className).toBe('text-base font-black text-accent-strong');
  });

  it('repinta la batería con el poll de 15 segundos', async () => {
    jest.useFakeTimers({ doNotFake: ['requestAnimationFrame'] });
    mockGetPet
      .mockResolvedValueOnce({
        kind: 'ok',
        pet: makePet({ device: { ...makeDevice('online'), batteryPct: 82 } }),
      })
      .mockResolvedValue({
        kind: 'ok',
        pet: makePet({ device: { ...makeDevice('online'), batteryPct: 40 } }),
      });
    try {
      await renderMap();
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
      });
      await waitFor(() => expect(screen.getByTestId('stat-battery')).toHaveTextContent('82%'));

      await act(async () => {
        jest.advanceTimersByTime(15000);
        await Promise.resolve();
        await Promise.resolve();
      });
      await waitFor(() => expect(screen.getByTestId('stat-battery')).toHaveTextContent('40%'));

      expect(screen.getByTestId('stat-battery').props.className).toBe('text-base font-black text-warning-strong');
    } finally {
      mockFocusCleanup?.();
      jest.useRealTimers();
    }
  });
});

describe('#116 R8: el mapa no estrena animación', () => {
  it('no importa Reanimated ni anima el punto', () => {
    const source = readFileSync(
      join(process.cwd(), 'src', 'screens', 'map', 'index.tsx'),
      'utf8',
    );
    expect(source).not.toContain('react-native-reanimated');
    expect(source).not.toMatch(/\bAnimated\b/);
  });
});

const mockRouter = jest.mocked(router);

describe('#155 R4: Mapa sin mascotas presenta a Pingo', () => {

  it('pinta la pose, el título y la frase de Pingo', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderMap();
    const pose = await screen.findByTestId('map-no-pets-pose');
    expect(pose.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-talk\.webp$/) }),
    ]);
    expect(screen.getByTestId('map-no-pets-title')).toHaveTextContent('Aún no tienes mascotas');
    expect(screen.getByTestId('map-no-pets-body')).toHaveTextContent('Añade a tu mascota y te ayudo a saber dónde está y cómo está.');
    expect(within(screen.getByTestId('map-no-pets-action')).getByText('Añadir mascota')).toBeVisible();
  });

  it('queda en el sitio del vacío que sustituye', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderMap();
    await screen.findByTestId('map-no-pets-pose');
    const slot = screen.getByTestId('map-no-pets');
    expect(slot.parent?.props.className).toBe('flex-1 items-center justify-center p-6 bg-background');
    expect(slot.parent?.parent?.props.testID).toBe('screen-map');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['map-no-pets']);
  });

  it('lleva a añadir mascota', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderMap();
    const action = await screen.findByTestId('map-no-pets-action');
    await fireEvent.press(action);
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/pets/add');
  });
});


describe('#159 R2: Mapa sin seguimiento presenta a Pingo', () => {
  it('pinta la pose del collar, el título y la frase de Pingo', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({ kind: 'no-tracking' });
    await renderMap();
    const pose = await screen.findByTestId('map-no-tracking-pose');
    expect(pose.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-collar\.webp$/) }),
    ]);
    expect(screen.getByTestId('map-no-tracking-title')).toHaveTextContent('Sin ubicación en vivo');
    expect(screen.getByTestId('map-no-tracking-body')).toHaveTextContent('Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.');
  });

  it('queda en el sitio del texto que sustituye y sin mapa debajo', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetLastPosition.mockResolvedValue({ kind: 'no-tracking' });
    await renderMap();
    await screen.findByTestId('map-no-tracking-pose');
    const slot = screen.getByTestId('map-no-tracking');
    expect(slot.props.className).toBe('items-center gap-3 py-8');
    expect(slot.parent?.props.className).toBe('flex-1 items-center justify-center p-6 bg-background');
    expect(slot.parent?.parent?.props.testID).toBe('screen-map');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['map-no-tracking']);
    expect(screen.queryByTestId('map-view')).toBeNull();
  });
});

describe('#159 R3: el dueño sin collar puede ir a emparejar', () => {
  it('pinta Vincular collar al dueño de una mascota sin collar', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
    mockGetLastPosition.mockResolvedValue({ kind: 'no-tracking' });
    await renderMap();
    const action = await screen.findByTestId('map-no-tracking-action');
    expect(within(action).getByText('Vincular collar')).toBeVisible();
  });

  it('lleva a emparejar una sola vez', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
    mockGetLastPosition.mockResolvedValue({ kind: 'no-tracking' });
    await renderMap();
    const action = await screen.findByTestId('map-no-tracking-action');
    await fireEvent.press(action);
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/pairing');
  });

  it.each([
    { role: 'family', collar: 'sin collar', device: null },
    { role: 'family', collar: 'con collar', device: makeDevice('online') },
    { role: 'walker', collar: 'sin collar', device: null },
    { role: 'walker', collar: 'con collar', device: makeDevice('online') },
    { role: 'vet', collar: 'sin collar', device: null },
    { role: 'vet', collar: 'con collar', device: makeDevice('online') },
  ] as const)('pinta Vincular collar aunque el listado diga $role $collar: manda el rol y el collar del detalle', async ({ role, device }) => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ myRole: role, device })] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
    mockGetLastPosition.mockResolvedValue({ kind: 'no-tracking' });
    await renderMap();
    const action = await screen.findByTestId('map-no-tracking-action');
    expect(within(action).getByText('Vincular collar')).toBeVisible();
  });

  it('pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ device: makeDevice('online') })] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
    mockGetLastPosition.mockResolvedValue({ kind: 'no-tracking' });
    await renderMap();
    const action = await screen.findByTestId('map-no-tracking-action');
    expect(within(action).getByText('Vincular collar')).toBeVisible();
  });
});

describe('#159 R4: nadie más ve el botón de emparejar', () => {
  function noTrackingAfterDetail(detailState: PetState) {
    const detailPromise = Promise.resolve(detailState);
    mockGetPet.mockReturnValue(detailPromise);
    mockGetLastPosition.mockReturnValue(detailPromise.then((): LastPositionState => ({ kind: 'no-tracking' })));
  }

  it.each(['family', 'walker', 'vet'] as const)('no pinta el botón a %s', async (role) => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ myRole: role })] });
    noTrackingAfterDetail({ kind: 'ok', pet: makePet({ myRole: role }) });
    await renderMap();
    await screen.findByTestId('map-no-tracking-title');
    expect(screen.getByTestId('map-no-tracking-body')).toHaveTextContent('Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.');
    expect(screen.queryByTestId('map-no-tracking-action')).toBeNull();
  });

  it('no pinta el botón al dueño de una mascota con collar', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    noTrackingAfterDetail({ kind: 'ok', pet: makePet({ device: makeDevice('online') }) });
    await renderMap();
    await screen.findByTestId('map-no-tracking-title');
    expect(screen.getByTestId('map-no-tracking-body')).toHaveTextContent('Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.');
    expect(screen.queryByTestId('map-no-tracking-action')).toBeNull();
  });

  it.each([
    ['error', { kind: 'error' }],
    ['unreachable', { kind: 'unreachable', message: 'offline' }],
    ['missing-config', { kind: 'missing-config' }],
  ] as const)('no pinta el botón si el detalle resuelve %s', async (_kind, state) => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    noTrackingAfterDetail(state);
    await renderMap();
    await screen.findByTestId('map-no-tracking-title');
    expect(screen.getByTestId('map-no-tracking-body')).toHaveTextContent('Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.');
    expect(screen.queryByTestId('map-no-tracking-action')).toBeNull();
  });

  it('no pinta el botón mientras el detalle carga', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetPet.mockReturnValue(pending<PetState>());
    mockGetLastPosition.mockResolvedValue({ kind: 'no-tracking' });
    await renderMap();
    await screen.findByTestId('map-no-tracking-title');
    expect(screen.getByTestId('map-no-tracking-body')).toHaveTextContent('Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.');
    expect(screen.queryByTestId('map-no-tracking-action')).toBeNull();
  });

  it.each(['family', 'walker', 'vet'] as const)('no pinta el botón a %s aunque el listado diga owner', async (role) => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    noTrackingAfterDetail({ kind: 'ok', pet: makePet({ myRole: role }) });
    await renderMap();
    await screen.findByTestId('map-no-tracking-title');
    expect(screen.getByTestId('map-no-tracking-body')).toHaveTextContent('Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.');
    expect(screen.queryByTestId('map-no-tracking-action')).toBeNull();
  });
});
