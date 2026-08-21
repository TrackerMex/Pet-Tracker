import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect, type ReactNode } from 'react';

import { listPets, type PetsState } from '../../../api/pets';
import {
  getLastPosition,
  listPositions,
  type LastPositionState,
  type PositionsState,
} from '../../../api/positions';
import { getDayRoute, type DayRouteState } from '../../../api/trips';
import type { PetProfile } from '../../../api/types';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import {
  SelectedPetProvider,
  useSelectedPet,
} from '../../../providers/selected-pet-provider';
import MapScreen from '../map';

let mockFocusCleanup: (() => void) | undefined;

jest.mock('../../../api/pets', () => ({
  listPets: jest.fn(),
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
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = require('react');
    React.useEffect(() => {
      const cleanup = callback();
      mockFocusCleanup = typeof cleanup === 'function' ? cleanup : undefined;
      return cleanup;
    }, [callback]);
  },
}));

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const stub = (props: Record<string, unknown>) =>
    React.createElement(View, props, props.children);
  return { __esModule: true, default: stub, Marker: stub, Polyline: stub };
});

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const apiUrl = 'http://example.test/v1';
const mockGetDayRoute = jest.mocked(getDayRoute);
const mockGetLastPosition = jest.mocked(getLastPosition);
const mockListPets = jest.mocked(listPets);
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
