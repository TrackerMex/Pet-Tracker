import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';

import {
  getDailyActivity,
  type DailyActivityState,
} from '../../../api/activity';
import { getPet, listPets, type PetState, type PetsState } from '../../../api/pets';
import type { DayEntry, PetProfile } from '../../../api/types';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import { SelectedPetProvider } from '../../../providers/selected-pet-provider';
import HomeScreen from '../home';

jest.mock('../../../api/pets', () => ({
  getPet: jest.fn(),
  listPets: jest.fn(),
}));

jest.mock('../../../api/activity', () => ({
  getDailyActivity: jest.fn(),
}));

jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 24, left: 0 }),
}));

const apiUrl = 'http://example.test/v1';
const mockGetDailyActivity = jest.mocked(getDailyActivity);
const mockGetPet = jest.mocked(getPet);
const mockListPets = jest.mocked(listPets);
const mockUseAuth = jest.mocked(useAuth);
const mockRouter = jest.mocked(router);

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

function makeDay(overrides: Partial<DayEntry> = {}): DayEntry {
  return {
    date: '2026-08-21',
    distanceM: 2350,
    activeMinutes: 95,
    restMinutes: 45,
    walkCount: 2,
    avgWalkMinutes: 48,
    firstWalkAt: '2026-08-21T08:00:00.000Z',
    lastWalkAt: '2026-08-21T18:00:00.000Z',
    timeAwayMinutes: null,
    source: 'computed',
    ...overrides,
  };
}

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

function HomeWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <SelectedPetProvider>{children}</SelectedPetProvider>
    </HeroUINativeProvider>
  );
}

async function renderHome() {
  await render(<HomeScreen />, { wrapper: HomeWrapper });
}

describe('R6: home carga pets y selecciona', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockGetPet.mockReturnValue(pending<PetState>());
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());
  });

  it('shows a loading state while pets are pending', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderHome();

    expect(screen.getByTestId('screen-home')).toBeVisible();
    expect(screen.getByTestId('home-loading')).toBeVisible();
  });

  it('shows an error and retries the pet list', async () => {
    mockListPets
      .mockResolvedValueOnce({ kind: 'unreachable', message: 'network down' })
      .mockResolvedValueOnce({ kind: 'ok', pets: [] });

    await renderHome();
    await waitFor(() => expect(screen.getByTestId('home-error')).toBeVisible());

    await fireEvent.press(screen.getByTestId('home-retry'));

    await waitFor(() => expect(screen.getByTestId('home-empty')).toBeVisible());
    expect(mockListPets).toHaveBeenCalledTimes(2);
  });

  it('shows the empty state when the account has no pets', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('home-empty')).toHaveTextContent('No pets yet'));
  });

  it('keeps API order and selects the first pet by default', async () => {
    const pets = [
      makePet(),
      makePet({ id: 'pet-2', name: 'Milo' }),
    ];
    mockListPets.mockResolvedValue({ kind: 'ok', pets });

    await renderHome();

    await waitFor(() => {
      expect(screen.getAllByTestId(/^pet-chip-/).map(({ props }) => props.testID)).toEqual([
        'pet-chip-pet-1',
        'pet-chip-pet-2',
      ]);
      expect(screen.getByTestId('pet-chip-pet-1').props.accessibilityState).toEqual({
        selected: true,
      });
    });
    expect(mockListPets).toHaveBeenCalledWith(apiUrl, 'jwt-token');
    expect(mockGetPet).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1');
    expect(mockGetDailyActivity).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1');
  });

  it('selects a pressed pet and reloads its detail and activity', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })],
    });

    await renderHome();
    await waitFor(() => expect(screen.getByTestId('pet-chip-pet-1')).toBeVisible());
    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));

    await waitFor(() => {
      expect(screen.getByTestId('pet-chip-pet-2').props.accessibilityState).toEqual({
        selected: true,
      });
      expect(mockGetPet).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-2');
      expect(mockGetDailyActivity).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-2');
    });
  });
});

describe('R7: pet card muestra el perfil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());
  });

  it('shows a skeleton while pet detail is pending', async () => {
    mockGetPet.mockReturnValue(pending<PetState>());

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('pet-card-skeleton')).toBeVisible());
  });

  it('shows the pet photo, name, and breed', async () => {
    const pet = makePet({ photoUrl: 'http://example.test/luna.jpg' });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('pet-card')).toBeVisible());
    expect(screen.getByTestId('pet-card-photo').props.source).toEqual([
      { uri: pet.photoUrl },
    ]);
    expect(screen.getByTestId('pet-card-name')).toHaveTextContent('Luna');
    expect(screen.getByTestId('pet-card-breed')).toHaveTextContent('Mixed');
  });

  it('uses the name initial and a dash when optional profile data is absent', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ breed: null, photoUrl: null }),
    });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('pet-card')).toBeVisible());
    expect(screen.getByTestId('pet-card-photo')).toHaveTextContent('L');
    expect(screen.getByTestId('pet-card-breed')).toHaveTextContent('—');
  });

  it('shows an error and retries pet detail', async () => {
    mockGetPet
      .mockResolvedValueOnce({ kind: 'unreachable', message: 'network down' })
      .mockResolvedValueOnce({ kind: 'ok', pet: makePet() });

    await renderHome();
    await waitFor(() => expect(screen.getByTestId('pet-card-error')).toBeVisible());
    await fireEvent.press(screen.getByTestId('pet-card-retry'));

    await waitFor(() => expect(screen.getByTestId('pet-card-name')).toHaveTextContent('Luna'));
    expect(mockGetPet).toHaveBeenCalledTimes(2);
  });
});

describe('R8: collar card refleja el device', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());
  });

  it('shows the health-only free state without a battery row', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ device: null }) });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('collar-card')).toBeVisible());
    expect(screen.getByTestId('collar-status')).toHaveTextContent('Free');
    expect(screen.getByText('No collar — health only')).toBeVisible();
    expect(screen.queryByTestId('collar-battery')).toBeNull();
  });

  it('shows an online collar and its battery percentage', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({
        device: {
          model: 'PetTrack One',
          batteryPct: 82,
          connectivity: 'online',
          lastMessageAt: '2026-08-21T12:00:00.000Z',
          esn: 'ACT-001',
        },
      }),
    });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('collar-card')).toBeVisible());
    expect(screen.getByTestId('collar-status')).toHaveTextContent('Online');
    expect(screen.getByTestId('collar-battery')).toHaveTextContent('82%');
  });

  it('treats an unknown connection as offline and preserves missing battery', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({
        device: {
          model: null,
          batteryPct: null,
          connectivity: null,
          lastMessageAt: null,
          esn: null,
        },
      }),
    });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('collar-card')).toBeVisible());
    expect(screen.getByTestId('collar-status')).toHaveTextContent('Offline');
    expect(screen.getByTestId('collar-battery')).toHaveTextContent('—');
  });
});

describe('R9: summary degrada con gracia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    const pet = makePet();
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
  });

  it('formats metrics from the last day in the response', async () => {
    mockGetDailyActivity.mockResolvedValue({
      kind: 'ok',
      days: [makeDay({ activeMinutes: 999 }), makeDay()],
      weekComparison: { distanceM: 5, activeMinutes: 10, walkCount: 20 },
    });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('summary-card')).toBeVisible());
    expect(screen.getByText("Today's Summary")).toBeVisible();
    expect(screen.getByTestId('summary-activity')).toHaveTextContent('1h 35m');
    expect(screen.getByTestId('summary-sleep')).toHaveTextContent('45m');
    expect(screen.getByTestId('summary-distance')).toHaveTextContent('2.4 km');
  });

  it('shows dashes instead of zero for missing metrics', async () => {
    mockGetDailyActivity.mockResolvedValue({
      kind: 'ok',
      days: [
        makeDay({
          distanceM: null,
          activeMinutes: null,
          restMinutes: null,
          walkCount: null,
          avgWalkMinutes: null,
          firstWalkAt: null,
          lastWalkAt: null,
          source: 'missing',
        }),
      ],
      weekComparison: { distanceM: null, activeMinutes: null, walkCount: null },
    });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('summary-card')).toBeVisible());
    expect(screen.getByTestId('summary-activity')).toHaveTextContent('—');
    expect(screen.getByTestId('summary-sleep')).toHaveTextContent('—');
    expect(screen.getByTestId('summary-distance')).toHaveTextContent('—');
  });

  it('explains that activity tracking requires a collar', async () => {
    mockGetDailyActivity.mockResolvedValue({ kind: 'no-tracking' });

    await renderHome();

    await waitFor(() => {
      expect(screen.getByTestId('summary-note')).toHaveTextContent(
        'Activity tracking requires a collar',
      );
    });
  });

  it('degrades an activity error without breaking the dashboard', async () => {
    mockGetDailyActivity.mockResolvedValue({ kind: 'error' });

    await renderHome();

    await waitFor(() => {
      expect(screen.getByTestId('summary-note')).toHaveTextContent(
        'Could not load activity',
      );
    });
  });

  it('shows a summary skeleton while activity is pending', async () => {
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('summary-skeleton')).toBeVisible());
  });
});

describe('R10: last position enlaza al mapa', () => {
  const device = {
    model: 'PetTrack One',
    batteryPct: 82,
    connectivity: 'online',
    lastMessageAt: '2026-08-21T12:00:00.000Z',
    esn: 'ACT-001',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockGetDailyActivity.mockResolvedValue({ kind: 'no-tracking' });
  });

  it('shows the last-seen time and opens the map tab', async () => {
    const lastCommunicationAt = '2026-08-21T12:34:00.000Z';
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device, lastCommunicationAt }),
    });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('last-position-card')).toBeVisible());
    expect(screen.getByText('View on map')).toBeVisible();
    expect(screen.getByTestId('last-position-time')).toHaveTextContent(
      `Last seen ${new Date(lastCommunicationAt).toLocaleString()}`,
    );

    await fireEvent.press(screen.getByTestId('last-position-card'));
    expect(mockRouter.push).toHaveBeenCalledWith('/map');
  });

  it('explains when the collar has no location yet', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device, lastCommunicationAt: null }),
    });

    await renderHome();

    await waitFor(() => {
      expect(screen.getByTestId('last-position-time')).toHaveTextContent(
        'No location data yet',
      );
    });
  });

  it('hides the position card for a pet without a collar', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device: null }),
    });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('collar-status')).toHaveTextContent('Free'));
    expect(screen.queryByTestId('last-position-card')).toBeNull();
  });
});
