import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect, type ReactNode } from 'react';

import {
  listPets,
  setLostMode,
  type PetsState,
  type SetLostModeState,
} from '../../../api/pets';
import {
  getLastPosition,
  listPositions,
  type LastPositionState,
  type PositionsState,
} from '../../../api/positions';
import { getDayRoute, type DayRouteState } from '../../../api/trips';
import type {
  LastPosition,
  PetProfile,
  StoredPosition,
  TripDetail,
} from '../../../api/types';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import {
  SelectedPetProvider,
  useSelectedPet,
} from '../../../providers/selected-pet-provider';
import MapScreen from '../map';

let mockFocusCleanup: (() => void) | undefined;
let mockTheme: 'light' | 'dark' = 'light';

jest.mock('../../../api/pets', () => ({
  listPets: jest.fn(),
  setLostMode: jest.fn(),
}));

jest.mock('../../../api/positions', () => ({
  getLastPosition: jest.fn(),
  listPositions: jest.fn(),
}));

jest.mock('../../../api/trips', () => ({
  getDayRoute: jest.fn(),
}));

jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useIsFocused: () => true,
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

const apiUrl = 'http://example.test/v1';
const mockGetDayRoute = jest.mocked(getDayRoute);
const mockGetLastPosition = jest.mocked(getLastPosition);
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
    createdAt: '2026-08-20T00:00:00.000Z',
    updatedAt: '2026-08-21T00:00:00.000Z',
    ...overrides,
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
      <SelectedPetProvider>
        <SelectedPetSeed />
        {children}
      </SelectedPetProvider>
    </HeroUINativeProvider>
  );
}

async function renderMap() {
  await render(<MapScreen />, { wrapper: MapWrapper });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockFocusCleanup = undefined;
  mockTheme = 'light';
  initialSelectedPetId = null;
  process.env.EXPO_PUBLIC_API_URL = apiUrl;
  mockUseAuth.mockReturnValue({
    status: 'authenticated',
    token: 'jwt-token',
    signIn: jest.fn(),
    signOut: jest.fn(),
  } satisfies AuthContextValue);
  mockGetLastPosition.mockReturnValue(pending<LastPositionState>());
  mockListPositions.mockReturnValue(pending<PositionsState>());
  mockGetDayRoute.mockReturnValue(pending<DayRouteState>());
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

  it('selects the first pet and loads its first position', async () => {
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
    expect(screen.getByTestId('map-loading')).toBeVisible();
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
      expect(screen.getByTestId('map-no-pets')).toHaveTextContent('No pets yet');
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
      expect(screen.getByTestId('map-no-tracking')).toHaveTextContent(
        'Live tracking requires a collar',
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
      'No location data yet',
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

    await waitFor(() => expect(screen.getByTestId('map-view')).toBeVisible());
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

  it('R3 (android-map-never-ready): pasa un array vacío para un día sin viajes', async () => {
    mockGetDayRoute.mockResolvedValue({
      kind: 'ok',
      date: '2026-08-21',
      trips: [],
    });

    await renderMap();

    await waitFor(() => expect(screen.getByTestId('map-view')).toBeVisible());
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
    });
    expect(screen.getByTestId('stat-distance')).toHaveTextContent('2.0 km');
    expect(screen.getByTestId('stat-updated')).toHaveTextContent('Just now');
    expect(screen.getByTestId('stat-gps')).toHaveTextContent('Live');
    expect(screen.getByTestId('map-stats').props.style).toEqual(
      expect.objectContaining({
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 120,
      }),
    );
  });

  it('shows stale GPS, empty metric fallbacks, and zero trip distance', async () => {
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

    await waitFor(() => expect(screen.getByTestId('stat-gps')).toHaveTextContent('Stale'));
    expect(screen.getByTestId('stat-speed')).toHaveTextContent('—');
    expect(screen.getByTestId('stat-distance')).toHaveTextContent('0.0 km');
    expect(screen.getByTestId('stat-updated')).toHaveTextContent('2m ago');
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
    [3599, '59m ago'],
    [3600, '1h ago'],
    [7500, '2h ago'],
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

  it('shows no signal and no age when the collar has never reported', async () => {
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
      expect(screen.getByTestId('stat-gps')).toHaveTextContent('No signal');
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

    expect(screen.getByTestId('map-view').props.markers).toEqual([
      {
        id: 'last-position',
        coordinates: { latitude: 19.4326, longitude: -99.1332 },
      },
    ]);
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
    [false, 'Activate Lost Mode'],
    [true, 'Deactivate Lost Mode'],
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
        'Activate Lost Mode',
      ),
    );

    fireEvent.press(screen.getByTestId('lost-mode-button'));

    await waitFor(() => {
      expect(mockSetLostMode).toHaveBeenCalledWith(
        apiUrl,
        'jwt-token',
        'pet-1',
        true,
      );
    });
    expect(
      screen.getByTestId('lost-mode-button').props.accessibilityState,
    ).toEqual(expect.objectContaining({ disabled: true }));

    await act(async () => {
      resolveToggle({ kind: 'ok', pet: makePet({ lostMode: true }) });
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(screen.getByTestId('lost-mode-button')).toHaveTextContent(
        'Deactivate Lost Mode',
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
        'Could not update Lost Mode',
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

  it('muestra mensaje y Retry cuando last devuelve error', async () => {
    mockGetLastPosition.mockResolvedValue({ kind: 'error' });

    await renderMap();

    await waitFor(() => {
      expect(screen.getByTestId('map-last-error')).toHaveTextContent(
        'Something went wrong',
      );
    });
    expect(screen.getByTestId('map-last-error').props.selectable).toBe(true);
    expect(screen.getByTestId('map-last-retry')).toHaveTextContent('Retry');
    expect(screen.queryByTestId('map-view')).toBeNull();
    expect(screen.queryByTestId('map-error')).toBeNull();
  });

  it('Retry llama al refetch de last y recupera el mapa', async () => {
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
