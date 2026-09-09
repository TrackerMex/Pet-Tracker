import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { router, useFocusEffect } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { Uniwind } from 'uniwind';

import {
  getDailyActivity,
  type DailyActivityState,
} from '../../api/activity';
import { getPet, listPets, type PetState, type PetsState } from '../../api/pets';
import { listReminders } from '../../api/reminders';
import type { DayEntry, PetProfile, Reminder } from '../../api/types';
import * as apiHooks from '../../hooks/use-api';
import type { ApiResult } from '../../hooks/use-api';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { SelectedPetProvider } from '../../providers/selected-pet-provider';
import * as selectedPetHooks from '../../providers/selected-pet-provider';
import { TABULAR_NUMS } from '../../theme/native-styles';
import { CATEGORY_SLOTS } from '../../utils/category-palette';
import { HomeScreen } from './index';

declare function require(moduleName: 'fs'): {
  readdirSync: (
    path: string,
    options: { withFileTypes: true },
  ) => { name: string; isDirectory: () => boolean }[];
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');

function appRoutes(directory: string, prefix = ''): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return entry.name === '__tests__'
        ? []
        : appRoutes(absolutePath, relativePath);
    }

    return entry.name.endsWith('.tsx') && entry.name !== '_layout.tsx'
      ? [`/${relativePath.replace(/\.tsx$/, '')}`]
      : [];
  });
}

jest.mock('../../api/pets', () => ({
  getPet: jest.fn(),
  listPets: jest.fn(),
}));

jest.mock('../../api/activity', () => ({
  getDailyActivity: jest.fn(),
}));

jest.mock('../../api/reminders', () => ({
  listReminders: jest.fn(async () => ({ kind: 'ok', reminders: [] })),
}));

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useFocusEffect: jest.fn(),
  useIsFocused: jest.fn(() => true),
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

jest.mock('reicon-react-native', () => {
  const actual = jest.requireActual<typeof import('reicon-react-native')>(
    'reicon-react-native',
  );
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );
  const mockIcon = (testID: string) =>
    function MockIcon(props: Record<string, unknown>) {
      return React.createElement(View, { testID, ...props });
    };

  return {
    ...actual,
    Weight: mockIcon('icon-weight'),
    Walk: mockIcon('icon-walk'),
    Moon: mockIcon('icon-moon'),
    Map: mockIcon('icon-map'),
    CalendarPlus: mockIcon('icon-calendar-plus'),
    FileText: mockIcon('icon-file-text'),
    Syringe: mockIcon('icon-syringe'),
  };
});

const apiUrl = 'http://example.test/v1';
const mockGetDailyActivity = jest.mocked(getDailyActivity);
const mockGetPet = jest.mocked(getPet);
const mockListPets = jest.mocked(listPets);
const mockListReminders = jest.mocked(listReminders);

beforeEach(() => {
  mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [] });
});

const mockUseAuth = jest.mocked(useAuth);
const mockRouter = jest.mocked(router);
const mockUseFocusEffect = jest.mocked(useFocusEffect);

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

function localIso(year: number, monthIndex: number, day: number): string {
  return new Date(year, monthIndex, day, 12, 0).toISOString();
}

function makeReminder(overrides: Partial<Reminder> = {}): Reminder {
  return {
    id: 'rem-1',
    petId: 'pet-1',
    type: 'custom',
    title: 'Revisión',
    dueAt: localIso(2026, 8, 11),
    advanceMinutes: 60,
    status: 'scheduled',
    ...overrides,
  };
}

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

function HomeWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial="es">
        <SelectedPetProvider>{children}</SelectedPetProvider>
      </LanguageProvider>
    </HeroUINativeProvider>
  );
}

function HomeWrapperEn({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial="en">
        <SelectedPetProvider>{children}</SelectedPetProvider>
      </LanguageProvider>
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

  it('pads the content below the status bar with the top safe-area inset', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderHome();

    expect(screen.getByTestId('screen-home').props.contentContainerStyle).toEqual({
      gap: 16,
      paddingBottom: 120,
    });
    expect(screen.getByTestId('home-states').props.style).toEqual({
      paddingHorizontal: 24,
      paddingTop: 52,
      gap: 16,
    });
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

    await waitFor(() =>
      expect(screen.getByTestId('home-empty')).toHaveTextContent(
        'Aún no tienes mascotas',
      ),
    );
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

describe('R7: el hero muestra el perfil (antes pet card)', () => {
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

    await waitFor(() => expect(screen.getByTestId('pet-hero-skeleton')).toBeVisible());
  });

  it('shows the pet photo, name, and breed', async () => {
    const pet = makePet({ photoUrl: 'http://example.test/luna.jpg' });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('pet-hero')).toBeVisible());
    expect(screen.getByTestId('pet-hero-media').props.source).toEqual([
      { uri: pet.photoUrl, cacheKey: pet.id },
    ]);
    expect(screen.getByTestId('pet-hero-name')).toHaveTextContent('Luna');
    expect(screen.getByTestId('pet-hero-breed')).toHaveTextContent('Mixed');
  });

  it('uses a deterministic avatar and a dash when optional profile data is absent', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ breed: null, photoUrl: null }),
    });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('pet-hero')).toBeVisible());
    expect(screen.getByTestId('pet-hero-media').props.xml).toContain('<svg');
    expect(screen.getByTestId('pet-hero-breed')).toHaveTextContent('—');
  });

  it('shows an error and retries pet detail', async () => {
    mockGetPet
      .mockResolvedValueOnce({ kind: 'unreachable', message: 'network down' })
      .mockResolvedValueOnce({ kind: 'ok', pet: makePet() });

    await renderHome();
    await waitFor(() => expect(screen.getByTestId('pet-hero-error')).toBeVisible());
    await fireEvent.press(screen.getByTestId('pet-hero-retry'));

    await waitFor(() => expect(screen.getByTestId('pet-hero-name')).toHaveTextContent('Luna'));
    expect(mockGetPet).toHaveBeenCalledTimes(2);
  });
});

describe('R5 (#40): Home usa el fallback blobatar compartido', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    const pet = makePet({ photoUrl: null });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());
  });

  it('renders the generated SVG under the pet-hero-media contract', async () => {
    await renderHome();

    await waitFor(() => expect(screen.getByTestId('pet-hero')).toBeVisible());
    const avatar = screen.getByTestId('pet-hero-media');
    expect(avatar.props.xml).toContain('<svg');
    expect(within(screen.getByTestId('pet-hero')).getByTestId('pet-hero-media')).toBe(
      avatar,
    );
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
    expect(screen.getByTestId('collar-status')).toHaveTextContent('Sin collar');
    expect(screen.getByText('Sin collar — solo salud')).toBeVisible();
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
    expect(screen.getByTestId('collar-status')).toHaveTextContent('En línea');
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
    expect(screen.getByTestId('collar-status')).toHaveTextContent('Sin conexión');
    expect(screen.getByTestId('collar-battery')).toHaveTextContent('—');
  });
});

describe('R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing', () => {
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

  it('shows the pair action for a pet without a collar and opens pairing', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device: null }),
    });

    await renderHome();

    const link = await screen.findByTestId('collar-pair-link');
    expect(link).toHaveTextContent('Vincular collar');
    expect(link.props.accessibilityRole).toBe('button');
    await fireEvent.press(link);

    expect(mockRouter.push).toHaveBeenCalledWith('/pairing');
  });

  it('does not show the pair action when the pet has a collar', async () => {
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

    await screen.findByTestId('collar-card');
    expect(screen.queryByTestId('collar-pair-link')).toBeNull();
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
    expect(screen.getByText('Resumen de hoy')).toBeVisible();
    expect(screen.getByTestId('summary-activity')).toHaveTextContent('1h 35m');
    expect(screen.getByTestId('summary-sleep')).toHaveTextContent('45m');
    expect(screen.getByTestId('summary-distance')).toHaveTextContent('2.4 km');
  });

  it('shows dashes instead of zero for missing metrics', async () => {
    const pet = makePet({ currentWeightKg: null });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
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
    expect(screen.getByTestId('summary-weight')).toHaveTextContent('—');
    expect(screen.getByTestId('summary-activity')).toHaveTextContent('—');
    expect(screen.getByTestId('summary-sleep')).toHaveTextContent('—');
    expect(screen.getByTestId('summary-distance')).toHaveTextContent('—');
  });

  it('#69 R7: degrada el peso a un guion cuando el perfil no resuelve', async () => {
    mockGetPet.mockResolvedValue({ kind: 'unreachable', message: 'network down' });
    mockGetDailyActivity.mockResolvedValue({
      kind: 'ok',
      days: [makeDay()],
      weekComparison: { distanceM: 5, activeMinutes: 10, walkCount: 20 },
    });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('summary-card')).toBeVisible());
    for (const testId of [
      'summary-weight',
      'summary-activity',
      'summary-sleep',
      'summary-distance',
    ]) {
      expect(screen.getByTestId(testId)).toBeVisible();
    }
    expect(screen.getByTestId('summary-weight')).toHaveTextContent('—');
  });

  it('explains that activity tracking requires a collar', async () => {
    mockGetDailyActivity.mockResolvedValue({ kind: 'no-tracking' });

    await renderHome();

    await waitFor(() => {
      expect(screen.getByTestId('summary-note')).toHaveTextContent(
        'La actividad requiere un collar',
      );
    });
  });

  it('degrades an activity error without breaking the dashboard', async () => {
    mockGetDailyActivity.mockResolvedValue({ kind: 'error' });

    await renderHome();

    await waitFor(() => {
      expect(screen.getByTestId('summary-note')).toHaveTextContent(
        'No se pudo cargar la actividad',
      );
    });
  });

  it('shows skeletons without the previous pet data while a newly selected pet loads', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })],
    });
    mockGetPet.mockImplementation((_url, _token, petId) =>
      petId === 'pet-1'
        ? Promise.resolve<PetState>({ kind: 'ok', pet: makePet() })
        : pending<PetState>(),
    );
    mockGetDailyActivity.mockImplementation((_url, _token, petId) =>
      petId === 'pet-1'
        ? Promise.resolve<DailyActivityState>({
            kind: 'ok',
            days: [makeDay()],
            weekComparison: { distanceM: 5, activeMinutes: 10, walkCount: 20 },
          })
        : pending<DailyActivityState>(),
    );

    await renderHome();
    await waitFor(() => expect(screen.getByTestId('summary-activity')).toHaveTextContent('1h 35m'));

    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));

    expect(screen.queryByTestId('pet-hero-name')).toBeNull();
    expect(screen.getByTestId('pet-hero-skeleton')).toBeVisible();
    expect(screen.queryByTestId('summary-activity')).toBeNull();
    expect(screen.getByTestId('summary-skeleton')).toBeVisible();
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
    expect(screen.getByText('Ver en el mapa')).toBeVisible();
    expect(screen.getByTestId('last-position-time')).toHaveTextContent(
      `Última señal ${new Date(lastCommunicationAt).toLocaleString('es-MX')}`,
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
        'Sin datos de ubicación todavía',
      );
    });
  });

  it('hides the position card for a pet without a collar', async () => {
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device: null }),
    });

    await renderHome();

    await waitFor(() =>
      expect(screen.getByTestId('collar-status')).toHaveTextContent(
        'Sin collar',
      ),
    );
    expect(screen.queryByTestId('last-position-card')).toBeNull();
  });
});

describe('R10: refetch al foco', () => {
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
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());
  });

  it('refetches the pet list and active pet when Home recovers focus', async () => {
    renderHome();
    await waitFor(() => expect(mockGetPet).toHaveBeenCalledTimes(1));
    const focusCallback = mockUseFocusEffect.mock.calls.at(-1)?.[0];
    expect(focusCallback).toBeDefined();

    await act(async () => {
      focusCallback?.();
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(mockListPets).toHaveBeenCalledTimes(2);
      expect(mockGetPet).toHaveBeenCalledTimes(2);
    });
  });
});

describe('R10: preserva la mascota durante el refetch', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not replace a new selection while the stale pet list refreshes', async () => {
    const existingPet = makePet();
    const createdPet = makePet({ id: 'pet-new', name: 'Nala' });
    const selectPet = jest.fn();
    let petsResult: ApiResult<PetsState> = {
      data: { kind: 'ok', pets: [existingPet] },
      isRefreshing: true,
      refetch: jest.fn(),
    };
    const emptyResult: ApiResult<{ kind: string }> = {
      data: undefined,
      isRefreshing: false,
      refetch: jest.fn(),
    };
    let hookCall = 0;
    jest.spyOn(selectedPetHooks, 'useSelectedPet').mockReturnValue({
      selectedPetId: createdPet.id,
      selectPet,
    });
    jest.spyOn(apiHooks, 'useApi').mockImplementation(
      <T extends { kind: string }>(): ApiResult<T> => {
        const result = hookCall++ % 4 === 0 ? petsResult : emptyResult;
        return result as ApiResult<T>;
      },
    );

    const view = await render(<HomeScreen />, { wrapper: HomeWrapper });

    expect(selectPet).not.toHaveBeenCalled();

    petsResult = {
      data: { kind: 'ok', pets: [existingPet, createdPet] },
      isRefreshing: false,
      refetch: jest.fn(),
    };
    await view.rerender(<HomeScreen />);

    expect(selectPet).not.toHaveBeenCalled();
  });
});

describe('#62 R3: collar-card y last-position-card usan el Card compartido', () => {
  const device = {
    model: 'PetTrack One',
    batteryPct: 82,
    connectivity: 'online' as const,
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
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ device }),
    });
    mockGetDailyActivity.mockResolvedValue({ kind: 'no-tracking' });
  });

  it.each(['collar-card', 'last-position-card'])(
    '%s hereda radio, borde y sombra de Card',
    async (testId) => {
      await renderHome();

      const card = await screen.findByTestId(testId);

      expect(card.props.className).toContain('rounded-card');
      expect(card.props.className).toContain('border');
      expect(card.props.className).toContain('shadow-sm');
      expect(card.props.className).toContain('bg-default');
    },
  );

  it('conserva el contrato interactivo de last-position-card', async () => {
    await renderHome();

    const card = await screen.findByTestId('last-position-card');

    expect(card.props.accessibilityRole).toBe('button');
    fireEvent.press(card);
    expect(mockRouter.push).toHaveBeenCalledWith('/map');
  });
});

describe('#62 R5: el título de card usa un único tratamiento', () => {
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
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
    mockGetDailyActivity.mockResolvedValue({
      kind: 'ok',
      days: [makeDay()],
      weekComparison: { distanceM: 5, activeMinutes: 10, walkCount: 20 },
    });
  });

  it('aplica la receta canónica a Today\'s Summary', async () => {
    await renderHome();

    expect((await screen.findByTestId('summary-card-title')).props.className).toBe(
      'text-base font-bold text-foreground',
    );
  });
});

describe('#62 R8: home carga con Skeleton dimensionado, no con Spinner suelto', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockReturnValue(pending<PetsState>());
    mockGetPet.mockReturnValue(pending<PetState>());
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());
  });

  it('reserva el espacio de carga con la forma de una Card', async () => {
    await renderHome();

    expect(screen.getByTestId('home-loading').props.className).toContain(
      'h-12 w-full rounded-card',
    );
  });
});

describe('R5: Home usa el hero compartido', () => {
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

  it('monta el hero con el selector dentro y sin rastro de la pet card', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('pet-hero')).toBeVisible());
    const hero = screen.getByTestId('pet-hero');
    expect(within(hero).getByTestId('pet-hero-media')).toBeVisible();
    expect(within(hero).getByTestId('pet-hero-slot')).toBeVisible();
    expect(within(hero).getByTestId('pet-chip-pet-1')).toBeVisible();
    expect(screen.queryByTestId('pet-card')).toBeNull();
    expect(screen.queryByTestId('pet-card-photo')).toBeNull();
    expect(screen.queryByTestId('pet-card-name')).toBeNull();
    expect(screen.queryByTestId('pet-card-breed')).toBeNull();
    expect(screen.queryByTestId('pet-card-skeleton')).toBeNull();
    expect(screen.queryByTestId('pet-card-error')).toBeNull();
    expect(screen.queryByTestId('pet-card-retry')).toBeNull();
  });

  it('conserva gap y paddingBottom y saca el padding horizontal a un envoltorio', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('pet-hero')).toBeVisible());
    expect(screen.getByTestId('screen-home').props.contentContainerStyle).toEqual({
      gap: 16,
      paddingBottom: 120,
    });
    expect(screen.getByTestId('home-content').props.style).toEqual({
      paddingHorizontal: 24,
      gap: 16,
    });
    expect(
      within(screen.getByTestId('home-content')).getByTestId('collar-card'),
    ).toBeVisible();
  });

  it('conserva intactos los testID que la spec no sustituye', async () => {
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
    for (const testId of [
      'screen-home',
      'collar-status',
      'collar-battery',
      'summary-card',
      'last-position-card',
      'pet-avatar-fallback-pet-1',
    ]) {
      expect(screen.getByTestId(testId)).toBeVisible();
    }
  });
});

describe('R8: el error del detalle deja el selector alcanzable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })],
    });
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());
  });

  it('mantiene el hero y los chips montados cuando el detalle falla', async () => {
    mockGetPet.mockResolvedValue({ kind: 'unreachable', message: 'down' });

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('pet-hero-error')).toBeVisible());
    expect(screen.getByTestId('pet-hero')).toBeVisible();
    expect(screen.getByTestId('pet-hero-retry')).toBeVisible();
    expect(screen.getByTestId('pet-chip-pet-1')).toBeVisible();
    expect(screen.getByTestId('pet-chip-pet-2')).toBeVisible();
    expect(screen.getByTestId('pet-hero-skeleton')).toBeVisible();
  });

  it('deja cambiar de mascota sin salir de la pantalla', async () => {
    mockGetPet.mockResolvedValue({ kind: 'unreachable', message: 'down' });

    await renderHome();
    await waitFor(() => expect(screen.getByTestId('pet-hero-error')).toBeVisible());

    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));

    await waitFor(() =>
      expect(mockGetPet).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-2'),
    );
  });
});

describe('R7: el hero pinta los paseos de hoy', () => {
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

  it('pinta el recuento del día y su etiqueta traducida', async () => {
    mockGetDailyActivity.mockResolvedValue({
      kind: 'ok',
      days: [makeDay({ walkCount: 9 }), makeDay({ walkCount: 3 })],
      weekComparison: { distanceM: 5, activeMinutes: 10, walkCount: 20 },
    });

    await renderHome();

    await waitFor(() =>
      expect(screen.getByTestId('pet-hero-highlight-value')).toHaveTextContent(
        '3',
      ),
    );
    expect(screen.getByTestId('pet-hero-highlight-label')).toHaveTextContent(
      'Paseos',
    );
  });

  it('pinta un guion largo cuando no hay recuento', async () => {
    mockGetDailyActivity.mockResolvedValue({
      kind: 'ok',
      days: [makeDay({ walkCount: null })],
      weekComparison: { distanceM: null, activeMinutes: null, walkCount: null },
    });

    await renderHome();

    await waitFor(() =>
      expect(screen.getByTestId('pet-hero-highlight-value')).toHaveTextContent(
        '—',
      ),
    );
  });

  it('no pinta dato destacado mientras la actividad no ha resuelto', async () => {
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());

    await renderHome();

    await waitFor(() => expect(screen.getByTestId('pet-hero')).toBeVisible());
    expect(screen.queryByTestId('pet-hero-highlight-value')).toBeNull();
  });
});

describe('R8: el mapa solo se ofrece para hoy', () => {
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

  it('ofrece el mapa solo para el día de hoy', async () => {
    const days = [
      makeDay({ date: '2026-09-01' }),
      makeDay({ date: '2026-09-02' }),
    ];
    mockGetDailyActivity.mockResolvedValue({
      kind: 'ok',
      days,
      weekComparison: { distanceM: null, activeMinutes: null, walkCount: null },
    });

    await renderHome();
    await waitFor(() =>
      expect(
        screen.getByTestId('weekly-activity-day-2026-09-01'),
      ).toBeVisible(),
    );

    await fireEvent.press(
      screen.getByTestId('weekly-activity-day-2026-09-01'),
    );
    expect(screen.queryByTestId('weekly-activity-day-map')).toBeNull();

    await fireEvent.press(
      screen.getByTestId('weekly-activity-day-2026-09-02'),
    );
    const mapButton = screen.getByTestId('weekly-activity-day-map');

    expect(mapButton).toHaveTextContent('Ver en el mapa');
    expect(mapButton.props.className).toContain('rounded-xl bg-accent');
    expect(
      within(mapButton).getByText('Ver en el mapa').props.className,
    ).toContain('text-accent-foreground');

    await fireEvent.press(mapButton);
    expect(mockRouter.push).toHaveBeenCalledWith('/map');

    await fireEvent.press(
      screen.getByTestId('weekly-activity-day-2026-09-01'),
    );
    expect(screen.queryByTestId('weekly-activity-day-map')).toBeNull();
  });
});

describe('R14: la Home monta la actividad semanal sin pedir nada nuevo', () => {
  const weekDates = [
    '2026-09-01',
    '2026-09-02',
    '2026-09-03',
    '2026-09-04',
    '2026-09-05',
    '2026-09-06',
    '2026-09-07',
  ];
  const days = weekDates.map((date) => makeDay({ date }));
  const weekComparison = {
    distanceM: 5,
    activeMinutes: 10,
    walkCount: 20,
  };
  const device = {
    model: 'PetTrack One',
    batteryPct: 82,
    connectivity: 'online',
    lastMessageAt: '2026-09-07T12:00:00.000Z',
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
    const pet = makePet({ device });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
  });

  it('muestra la tarjeta con los siete días recibidos', async () => {
    mockGetDailyActivity.mockResolvedValue({
      kind: 'ok',
      days,
      weekComparison,
    });

    await renderHome();
    await waitFor(() =>
      expect(screen.getByTestId('weekly-activity-card')).toBeVisible(),
    );

    expect(
      screen
        .getAllByTestId(/^weekly-activity-day-\d{4}-\d{2}-\d{2}$/)
        .map(({ props }) => props.testID),
    ).toEqual(
      weekDates.map((date) => `weekly-activity-day-${date}`),
    );
  });

  it('queda entre el resumen y la última posición en el árbol', async () => {
    mockGetDailyActivity.mockResolvedValue({
      kind: 'ok',
      days,
      weekComparison,
    });

    await renderHome();
    await waitFor(() =>
      expect(screen.getByTestId('last-position-card')).toBeVisible(),
    );

    const relevantChildren = screen
      .getByTestId('home-content')
      .children.flatMap((child) =>
        typeof child === 'string' ? [] : [child.props.testID],
      )
      .filter((testID) =>
        [
          'summary-card',
          'weekly-activity-card',
          'last-position-card',
        ].includes(testID),
      );

    expect(relevantChildren).toEqual([
      'summary-card',
      'weekly-activity-card',
      'last-position-card',
    ]);
  });

  it('no vuelve a pedir la actividad al cambiar de métrica', async () => {
    mockGetDailyActivity.mockResolvedValue({
      kind: 'ok',
      days,
      weekComparison,
    });

    await renderHome();
    await waitFor(() =>
      expect(screen.getByTestId('weekly-activity-metric')).toBeVisible(),
    );
    const callsBeforeMetricChange = [...mockGetDailyActivity.mock.calls];

    await fireEvent.press(
      screen.getByTestId('weekly-activity-metric-distanceM'),
    );

    expect(mockGetDailyActivity.mock.calls).toEqual(callsBeforeMetricChange);
  });

  it('carga con skeleton y se calla cuando la actividad falla', async () => {
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());

    const loading = await render(<HomeScreen />, { wrapper: HomeWrapper });
    await waitFor(() =>
      expect(screen.getByTestId('summary-skeleton')).toBeVisible(),
    );
    const skeleton = screen.getByTestId('weekly-activity-skeleton');

    expect(skeleton.props.className).toContain('w-full');
    expect(skeleton.props.className).toContain('rounded-card');
    expect(skeleton.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ height: expect.any(Number) }),
      ]),
    );

    await loading.unmount();
    mockGetDailyActivity.mockResolvedValue({ kind: 'error' });
    await renderHome();
    await waitFor(() =>
      expect(screen.getByTestId('summary-note')).toHaveTextContent(
        'No se pudo cargar la actividad',
      ),
    );

    expect(screen.queryByTestId('weekly-activity-card')).toBeNull();
    expect(screen.queryByTestId('weekly-activity-skeleton')).toBeNull();
  });
});

describe('#69 R1: la tira de hoy tiene cuatro celdas con tres divisores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    const pet = makePet({ currentWeightKg: 12.4 });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
    mockGetDailyActivity.mockResolvedValue({
      kind: 'ok',
      days: [
        makeDay({
          activeMinutes: 95,
          restMinutes: 45,
          distanceM: 2350,
          walkCount: 2,
        }),
      ],
      weekComparison: { distanceM: 5, activeMinutes: 10, walkCount: 20 },
    });
  });

  it('renders the four value testIDs in tree order', async () => {
    await renderHome();

    const summary = await screen.findByTestId('summary-card');
    const valueTestIds = within(summary)
      .getAllByTestId(/^summary-(weight|activity|sleep|distance)$/)
      .map(({ props }) => props.testID);

    expect(valueTestIds).toEqual([
      'summary-weight',
      'summary-activity',
      'summary-sleep',
      'summary-distance',
    ]);
  });

  it('renders exactly three dividers between the four cells', async () => {
    await renderHome();

    await screen.findByTestId('summary-card');
    const dividedCells = [
      'summary-weight',
      'summary-activity',
      'summary-sleep',
      'summary-distance',
    ].filter((testId) =>
      screen
        .getByTestId(testId)
        .parent?.props.className?.includes('border-r border-border'),
    );

    expect(dividedCells).toHaveLength(3);
  });

  it('keeps the row flush without spacing utilities', async () => {
    await renderHome();

    const activityValue = await screen.findByTestId('summary-activity');
    const rowClassName = activityValue.parent?.parent?.props.className;

    expect(rowClassName).toBe('flex-row');
    expect(rowClassName).not.toContain('gap-3');
    expect(rowClassName).not.toContain('justify-between');
  });

  it('asigna cada valor, icono y etiqueta a su celda y a ninguna otra', async () => {
    await renderHome();

    await screen.findByTestId('summary-card');
    const cells = [
      ['summary-weight', '12.4 kg', 'icon-weight', 'Peso'],
      ['summary-activity', '1h 35m', 'icon-walk', 'Actividad'],
      ['summary-sleep', '45m', 'icon-moon', 'Descanso'],
      ['summary-distance', '2.4 km', 'icon-map', 'Distancia'],
    ] as const;

    for (const [testID, expectedValue, iconTestID, label] of cells) {
      const value = screen.getByTestId(testID);
      const cell = within(value.parent!);

      expect(value).toHaveTextContent(expectedValue);
      expect(cell.getByTestId(iconTestID)).toBeVisible();
      expect(cell.getByText(label)).toBeVisible();
    }
  });

  it('conserva el descanso como celda siempre visible', async () => {
    await renderHome();

    const sleepValue = await screen.findByTestId('summary-sleep');
    expect(sleepValue).toBeVisible();
    expect(within(sleepValue.parent!).getByText('Descanso')).toBeVisible();
    expect(screen.queryByTestId('weekly-activity-detail')).toBeNull();
  });

  it('no repite los paseos dentro de la tira', async () => {
    await renderHome();

    const summary = await screen.findByTestId('summary-card');
    expect(screen.queryByTestId('summary-walks')).toBeNull();
    expect(within(summary).queryByText('Paseos')).toBeNull();
    expect(screen.getByTestId('pet-hero-highlight-value')).toHaveTextContent(
      '2',
    );
  });

  it('coloca la tira sobre la tarjeta del collar', async () => {
    const pet = makePet({
      currentWeightKg: 12.4,
      device: {
        model: 'PetTrack One',
        batteryPct: 82,
        connectivity: 'online',
        lastMessageAt: '2026-09-08T12:00:00.000Z',
        esn: 'ACT-001',
      },
    });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });

    await renderHome();

    await screen.findByTestId('weekly-activity-card');
    const relevantChildren = screen
      .getByTestId('home-content')
      .children.flatMap((child) =>
        typeof child === 'string' ? [] : [child.props.testID],
      )
      .filter((testID) =>
        [
          'summary-card',
          'collar-card',
          'weekly-activity-card',
          'last-position-card',
        ].includes(testID),
      );

    expect(relevantChildren).toEqual([
      'summary-card',
      'collar-card',
      'weekly-activity-card',
      'last-position-card',
    ]);
  });

  it('#69 R9: usa iconos de reicon y ningún emoji', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/screens/home/index.tsx'),
      'utf8',
    );
    const reiconImport =
      source.match(
        /import \{([\s\S]*?)\} from 'reicon-react-native';/,
      )?.[1] ?? '';

    expect(reiconImport).toMatch(/\bWeight\b/);
    expect(
      source.match(
        /<(?:Weight|Walk|Moon|Map) size=\{20\} color=\{muted\} \/>/g,
      ) ?? [],
    ).toHaveLength(4);
    for (const emoji of ['⚖️', '⚡', '🦮', '📍']) {
      expect(source).not.toContain(emoji);
    }
  });

  it('#69 R12: deja que cada celda se anuncie por separado', async () => {
    await renderHome();

    await screen.findByTestId('summary-card');
    const values = [
      screen.getByTestId('summary-weight'),
      screen.getByTestId('summary-activity'),
      screen.getByTestId('summary-sleep'),
      screen.getByTestId('summary-distance'),
    ];
    const row = values[0].parent?.parent;

    expect(row?.props.accessible).toBeUndefined();
    expect(row?.props.accessibilityLabel).toBeUndefined();
    expect(values).toHaveLength(4);
    for (const value of values) {
      expect(value).toBeVisible();
    }
    expect(
      row?.children.filter((child) => typeof child !== 'string'),
    ).toHaveLength(4);
    for (const cell of row?.children ?? []) {
      if (typeof cell !== 'string') {
        expect(cell.props.onPress).toBeUndefined();
      }
    }
  });

  it('#69 R8: no añade ninguna llamada a la API', async () => {
    const existingScenarioCallCount = { detail: 1, activity: 1 };

    await renderHome();
    await screen.findByTestId('summary-card');

    expect({
      detail: mockGetPet.mock.calls.length,
      activity: mockGetDailyActivity.mock.calls.length,
    }).toEqual(existingScenarioCallCount);
  });
});

describe('#71 R1: la Home dibuja la rejilla de accesos rápidos', () => {
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
    mockGetDailyActivity.mockResolvedValue({
      kind: 'ok',
      days: [makeDay()],
      weekComparison: { distanceM: 5, activeMinutes: 10, walkCount: 20 },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('dibuja el rótulo y los tres tiles en orden', async () => {
    await renderHome();

    const quickActions = await screen.findByTestId('quick-actions');
    const title = within(quickActions).getByTestId('quick-actions-title');
    const tileRow = within(quickActions).getByTestId('quick-actions-row');
    const tileTestIds = within(quickActions)
      .getAllByTestId(/^quick-action-/)
      .map(({ props }) => props.testID);

    expect(title).toHaveTextContent('Accesos rápidos');
    expect(title.props.className).toBe(
      'text-xs font-semibold uppercase tracking-widest text-muted',
    );
    expect(tileTestIds).toEqual([
      'quick-action-weight',
      'quick-action-reminder',
      'quick-action-documents',
    ]);
    expect(tileRow.children).toHaveLength(3);
    expect(screen.queryByTestId('quick-action-map')).toBeNull();
  });

  it('lleva cada tile a su ruta existente', async () => {
    await renderHome();

    for (const testID of [
      'quick-action-weight',
      'quick-action-reminder',
      'quick-action-documents',
    ]) {
      await fireEvent.press(screen.getByTestId(testID));
    }

    expect(mockRouter.push).toHaveBeenCalledTimes(3);
    expect(mockRouter.push).toHaveBeenNthCalledWith(1, '/weight-log');
    expect(mockRouter.push).toHaveBeenNthCalledWith(2, '/add-reminder');
    expect(mockRouter.push).toHaveBeenNthCalledWith(3, '/pets/pet-1/docs');
  });

  it('no apunta a ninguna ruta inexistente', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/screens/home/index.tsx'),
      'utf8',
    );
    const start = source.indexOf('const QUICK_ACTIONS');
    const end = source.indexOf('] as const;', start);
    const quickActions = source.slice(start, end);
    const destinations = [
      ...quickActions.matchAll(
        /href:\s*\([^)]*\)\s*=>\s*(?:'([^']+)'|`([^`]+)`)/g,
      ),
    ].map(([, literal, template]) =>
      (literal ?? template).replace('${petId}', '[petId]'),
    );
    const routes = appRoutes(join(process.cwd(), 'src/app/(tabs)'));

    expect(destinations).toHaveLength(3);
    for (const destination of destinations) {
      expect(routes).toContain(destination);
    }
    expect(source).not.toMatch(/href\(selectedPetId\)\s+as\s+Href/);
  });

  it('no dibuja ningún tile a una pestaña ni a un destino inexistente', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/screens/home/index.tsx'),
      'utf8',
    );
    const start = source.indexOf('const QUICK_ACTIONS');
    const end = source.indexOf('] as const;', start);
    const quickActions = source.slice(start, end);

    expect(quickActions.match(/testID: 'quick-action-/g)).toHaveLength(3);
    expect(source).toContain('{QUICK_ACTIONS.map(');
    for (const forbiddenDestination of [
      '/map',
      '/health',
      '/food',
      '/trips',
      '/reminders',
      '/pairing',
      '/pets/add',
      '/meal-schedule',
    ]) {
      expect(quickActions).not.toContain(`'${forbiddenDestination}'`);
    }
  });

  it('liga icono, etiqueta, fondo, destino, tinta y color de etiqueta de cada tile y de ninguno más', async () => {
    jest
      .spyOn(Uniwind, 'getCSSVariable')
      .mockImplementation((token) => token);
    await renderHome();

    const bindings = [
      [
        'quick-action-weight',
        'icon-weight',
        'Peso',
        'bg-category-violet',
        '--color-category-violet-strong',
        'text-foreground',
        '/weight-log',
      ],
      [
        'quick-action-reminder',
        'icon-calendar-plus',
        'Recordatorio',
        'bg-category-amber',
        '--color-category-amber-strong',
        'text-foreground',
        '/add-reminder',
      ],
      [
        'quick-action-documents',
        'icon-file-text',
        'Documentos',
        'bg-category-blue',
        '--color-category-blue-strong',
        'text-foreground',
        '/pets/pet-1/docs',
      ],
    ] as const;

    for (const [
      testID,
      iconTestID,
      label,
      surface,
      ink,
      labelColor,
      href,
    ] of bindings) {
      const tile = screen.getByTestId(testID);
      const tileQueries = within(tile);
      const icon = tileQueries.getByTestId(iconTestID);
      const labelNode = tileQueries.getByText(label);

      expect(icon).toBeVisible();
      expect(icon.props.color).toBe(ink);
      expect(labelNode).toBeVisible();
      expect(labelNode.props.className).toContain(labelColor);
      expect(tile.props.className).toContain(surface);
      await fireEvent.press(tile);
      expect(mockRouter.push).toHaveBeenLastCalledWith(href);
    }

    expect(mockRouter.push).toHaveBeenCalledTimes(bindings.length);
  });

  it('resuelve el fondo y la tinta desde el mismo hueco', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/screens/home/index.tsx'),
      'utf8',
    );

    expect(source).toContain('CATEGORY_SLOTS[slot].surface');
    expect(source).toContain('`category-${slot}-strong`');
    expect(source).not.toMatch(/(?:bg|text)-category-/);
  });

  it('da a cada tile 44 pt de objetivo táctil', async () => {
    await renderHome();

    const quickActions = await screen.findByTestId('quick-actions');
    for (const testID of [
      'quick-action-weight',
      'quick-action-reminder',
      'quick-action-documents',
    ]) {
      const tile = within(quickActions).getByTestId(testID);

      expect(tile.props.className).toContain('min-h-11');
      expect(tile.props.className).toContain('flex-1');
      expect(tile.props.hitSlop).toBeUndefined();
    }
  });

  it('usa iconos de reicon y ningún emoji', async () => {
    const source = readFileSync(
      join(process.cwd(), 'src/screens/home/index.tsx'),
      'utf8',
    );
    const reiconImport = source.match(
      /import \{([\s\S]*?)\} from 'reicon-react-native';/,
    )?.[1];
    const start = source.indexOf('const QUICK_ACTIONS');
    const end = source.indexOf('] as const;', start);
    const quickActions = source.slice(start, end);

    expect(reiconImport).toBeDefined();
    for (const iconName of ['Weight', 'CalendarPlus', 'FileText']) {
      expect(reiconImport).toMatch(new RegExp(`\\b${iconName}\\b`));
    }
    expect(source.match(/<Icon size=\{24\}/g)).toHaveLength(1);
    expect(quickActions).not.toMatch(/\b(?:HeartPulse|ForkKnife)\b/);
    for (const emoji of ['🗺️', '🏃', '💉', '🍽️']) {
      expect(source).not.toContain(emoji);
    }

    await renderHome();
    for (const [testID, iconTestID] of [
      ['quick-action-weight', 'icon-weight'],
      ['quick-action-reminder', 'icon-calendar-plus'],
      ['quick-action-documents', 'icon-file-text'],
    ] as const) {
      const tile = screen.getByTestId(testID);
      expect(within(tile).getByTestId(iconTestID).props.size).toBe(24);
    }
  });

  it('anuncia los tres tiles como botones independientes', async () => {
    await renderHome();

    const quickActions = await screen.findByTestId('quick-actions');
    const weightTile = within(quickActions).getByTestId('quick-action-weight');
    const tileRow = weightTile.parent;

    for (const testID of [
      'quick-action-weight',
      'quick-action-reminder',
      'quick-action-documents',
    ]) {
      expect(within(quickActions).getByTestId(testID).props.accessibilityRole).toBe(
        'button',
      );
    }
    for (const group of [quickActions, tileRow]) {
      expect(group?.props.accessible).toBeUndefined();
      expect(group?.props.accessibilityLabel).toBeUndefined();
    }
  });

  it('coloca la rejilla entre el collar y la actividad semanal', async () => {
    const pet = makePet({
      device: {
        model: 'PetTrack One',
        batteryPct: 82,
        connectivity: 'online',
        lastMessageAt: '2026-09-08T12:00:00.000Z',
        esn: 'ACT-001',
      },
    });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });

    await renderHome();
    await screen.findByTestId('last-position-card');

    const relevantChildren = screen
      .getByTestId('home-content')
      .children.flatMap((child) =>
        typeof child === 'string' ? [] : [child.props.testID],
      )
      .filter((testID) =>
        [
          'summary-card',
          'collar-card',
          'quick-actions',
          'weekly-activity-card',
          'last-position-card',
        ].includes(testID),
      );

    expect(relevantChildren).toEqual([
      'summary-card',
      'collar-card',
      'quick-actions',
      'weekly-activity-card',
      'last-position-card',
    ]);
  });

  it('no dibuja la rejilla sin mascota seleccionada', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });

    await renderHome();

    await screen.findByTestId('home-empty');
    expect(screen.queryByTestId('quick-actions')).toBeNull();
  });

  it('no añade ninguna llamada a la API', async () => {
    const existingScenarioCallCount = { pets: 1, detail: 1, activity: 1 };

    await renderHome();
    await screen.findByTestId('summary-card');

    expect({
      pets: mockListPets.mock.calls.length,
      detail: mockGetPet.mock.calls.length,
      activity: mockGetDailyActivity.mock.calls.length,
    }).toEqual(existingScenarioCallCount);
  });
});

describe('#85 R1: la sección recupera su rótulo en los dos idiomas', () => {
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
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());
  });

  it('rotula en español', async () => {
    await renderHome();

    const section = await screen.findByTestId('reminders-section');

    expect(
      within(section).getByTestId('reminders-section-title'),
    ).toHaveTextContent('Recordatorios');
    expect(within(section).getByTestId('reminders-see-all')).toHaveTextContent(
      'Ver todos',
    );
  });

  it('rotula en inglés', async () => {
    await render(<HomeScreen />, { wrapper: HomeWrapperEn });

    const section = await screen.findByTestId('reminders-section');

    expect(
      within(section).getByTestId('reminders-section-title'),
    ).toHaveTextContent('Reminders');
    expect(within(section).getByTestId('reminders-see-all')).toHaveTextContent(
      'See all',
    );
    expect(within(section).getByText('No upcoming vaccine')).toBeVisible();
  });
});

describe('#85 R4: la Home pide los recordatorios de la mascota', () => {
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
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());
  });

  it('pide una vez los recordatorios de la mascota seleccionada', async () => {
    await renderHome();

    await waitFor(() => expect(mockListReminders).toHaveBeenCalledTimes(1));
    expect(mockListReminders).toHaveBeenCalledWith(
      apiUrl,
      'jwt-token',
      'pet-1',
    );
  });

  it('no pide nada sin mascota seleccionada', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });

    await renderHome();

    await screen.findByTestId('home-empty');
    expect(mockListReminders).not.toHaveBeenCalled();
  });
});

describe('#85 R5: la sección pinta los recordatorios reales', () => {
  const vaccine = {
    id: 'vac-9',
    name: 'Antirrábica',
    nextDoseAt: '2026-09-15',
  };
  const reminderFixture = [
    makeReminder({
      id: 'rem-a',
      type: 'appointment',
      title: 'Consulta anual',
      dueAt: localIso(2026, 8, 13),
    }),
    makeReminder({
      id: 'rem-c',
      type: 'food',
      title: 'Comprar croquetas',
      dueAt: localIso(2026, 8, 16),
    }),
    makeReminder({
      id: 'rem-b',
      type: 'medication',
      title: 'Pastilla antipulgas',
      dueAt: localIso(2026, 8, 11),
    }),
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 10, 12, 0));
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    const pet = makePet({ nextVaccine: vaccine });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
    mockGetDailyActivity.mockReturnValue(pending<DailyActivityState>());
    mockListReminders.mockResolvedValue({
      kind: 'ok',
      reminders: reminderFixture,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('pinta las tres filas con su título, su fecha y su contador', async () => {
    await renderHome();

    const section = await screen.findByTestId('reminders-section');
    const expected = [
      ['rem-b', 'Pastilla antipulgas', '11 sep 2026', '1 d'],
      ['rem-a', 'Consulta anual', '13 sep 2026', '3 d'],
      ['rem-c', 'Comprar croquetas', '16 sep 2026', '6 d'],
    ] as const;

    for (const [id, title, date, days] of expected) {
      const row = await within(section).findByTestId(`reminders-item-${id}`);

      expect(
        within(row).getByTestId(`reminders-item-${id}-title`),
      ).toHaveTextContent(title);
      expect(
        within(row).getByTestId(`reminders-item-${id}-date`),
      ).toHaveTextContent(date);
      expect(
        within(row).getByTestId(`reminders-item-${id}-days`),
      ).toHaveTextContent(days);
    }
  });

  it('las ordena por fecha ascendente bajo la fila de la vacuna', async () => {
    await renderHome();

    await screen.findByTestId('reminders-item-rem-b');
    const body = screen.getByTestId('reminders-section-body');

    expect(body.children[0]).toHaveProperty(
      'props.testID',
      'reminders-next-vaccine',
    );
    expect(
      body.children.slice(1).map((child) =>
        typeof child === 'string' ? child : child.props.testID,
      ),
    ).toEqual([
      'reminders-item-rem-b',
      'reminders-item-rem-a',
      'reminders-item-rem-c',
    ]);
  });

  it('cuenta los hijos del cuerpo en tres escenarios', async () => {
    const scenarios: [Reminder[], number][] = [
      [[], 1],
      [[reminderFixture[0]], 2],
      [reminderFixture, 4],
    ];

    for (const [reminderList, childCount] of scenarios) {
      mockListReminders.mockResolvedValue({
        kind: 'ok',
        reminders: reminderList,
      });
      const view = await render(<HomeScreen />, { wrapper: HomeWrapper });

      try {
        await screen.findByTestId('reminders-next-vaccine');
        await waitFor(() =>
          expect(screen.getByTestId('reminders-section-body').children).toHaveLength(
            childCount,
          ),
        );
      } finally {
        await view.unmount();
      }
    }
  });

  it('corta en tres aunque haya cinco', async () => {
    mockListReminders.mockResolvedValue({
      kind: 'ok',
      reminders: [1, 2, 3, 4, 5].map((days) =>
        makeReminder({
          id: `rem-plus-${days}`,
          dueAt: localIso(2026, 8, 10 + days),
        }),
      ),
    });

    await renderHome();

    await screen.findByTestId('reminders-item-rem-plus-1');
    const body = screen.getByTestId('reminders-section-body');
    expect(body.children).toHaveLength(4);
    expect(
      body.children.slice(1).map((child) =>
        typeof child === 'string' ? child : child.props.testID,
      ),
    ).toEqual([
      'reminders-item-rem-plus-1',
      'reminders-item-rem-plus-2',
      'reminders-item-rem-plus-3',
    ]);
  });

  it('pinta fecha y contador reales para un dueAt con hora', async () => {
    mockListReminders.mockResolvedValue({
      kind: 'ok',
      reminders: [makeReminder()],
    });

    await renderHome();

    const row = await screen.findByTestId('reminders-item-rem-1');
    expect(within(row).getByTestId('reminders-item-rem-1-date')).not.toHaveTextContent(
      'Invalid',
    );
    expect(within(row).getByTestId('reminders-item-rem-1-days')).not.toHaveTextContent(
      'NaN',
    );
  });
});

describe('#70 R1: la Home dibuja la sección de recordatorios', () => {
  const vaccine = {
    id: 'vac-9',
    name: 'Antirrábica',
    nextDoseAt: '2026-09-15',
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
    mockGetPet.mockResolvedValue({
      kind: 'ok',
      pet: makePet({ nextVaccine: vaccine }),
    });
    mockGetDailyActivity.mockResolvedValue({
      kind: 'ok',
      days: [makeDay()],
      weekComparison: { distanceM: 5, activeMinutes: 10, walkCount: 20 },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('#70 R2: contrato nextVaccine', () => {
    it('tipa nextVaccine con los tres campos del contrato y ninguno más', () => {
      const source = readFileSync(
        join(process.cwd(), 'src/api/types.ts'),
        'utf8',
      );
      const nextVaccineBlock =
        source.match(/export interface NextVaccine \{[\s\S]*?\n\}/)?.[0] ?? '';
      const petProfileBlock =
        source.match(/export interface PetProfile \{[\s\S]*?\n\}/)?.[0] ?? '';
      const fields = [...nextVaccineBlock.matchAll(/^\s+(\w+):/gm)].map(
        ([, field]) => field,
      );

      expect(fields).toEqual(['id', 'name', 'nextDoseAt']);
      expect(nextVaccineBlock).not.toMatch(/\b(?:daysLeft|date):/);
      expect(petProfileBlock).toContain('nextVaccine: NextVaccine | null;');
      expect(petProfileBlock).toContain('nextReminder: unknown;');
      expect(petProfileBlock).toContain('activitySummary: unknown;');
    });
  });

  describe('#70 R1: estructura de la sección', () => {
    it('dibuja la cabecera y el cuerpo de la sección', async () => {
      await renderHome();

      const section = await screen.findByTestId('reminders-section');
      const title = within(section).getByTestId('reminders-section-title');
      const header = title.parent;
      const body = within(section).getByTestId('reminders-section-body');
      const seeAll = within(section).getByTestId('reminders-see-all');

      expect(section.children).toHaveLength(2);
      expect(section.props.className).toBe('gap-3');
      expect(header?.props.className).toBe(
        'flex-row items-center justify-between',
      );
      expect(section.children[0]).toBe(header);
      expect(section.children[1]).toBe(body);
      expect(title).toHaveTextContent('Recordatorios');
      expect(title.props.className).toBe(
        'text-base font-bold text-foreground',
      );
      expect(seeAll).toBeVisible();
      expect(seeAll).toHaveTextContent('Ver todos');
      expect(body.props.className).toBe('gap-2');
    });
  });

  describe('#70 R6: datos de la próxima vacuna', () => {
    it('liga nombre, fecha y contador a su nodo y a ninguno más', async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 8, 10, 12, 0));
      jest
        .spyOn(Uniwind, 'getCSSVariable')
        .mockImplementation((token) => token);

      await renderHome();

      const section = await screen.findByTestId('reminders-section');
      const row = within(section).getByTestId('reminders-next-vaccine');
      const icon = within(row).getByTestId('icon-syringe');
      const name = within(row).getByTestId('reminders-next-vaccine-name');
      const date = within(row).getByTestId('reminders-next-vaccine-date');
      const days = within(row).getByTestId('reminders-next-vaccine-days');

      expect(icon).toBeVisible();
      expect(icon.props.color).toBe('--color-category-blue-strong');
      expect(name.props.children).toBe('Antirrábica');
      expect(name.props.className).toBe(
        'text-sm font-semibold text-foreground',
      );
      expect(date.props.children).toBe('15 sep 2026');
      expect(date.props.className).toBe('text-xs font-normal text-muted');
      expect(days.props.children).toBe('5 d');
      expect(name).not.toHaveTextContent('15 sep 2026');
      expect(name).not.toHaveTextContent('5 d');
      expect(date).not.toHaveTextContent('Antirrábica');
      expect(date).not.toHaveTextContent('5 d');
      expect(days).not.toHaveTextContent('Antirrábica');
      expect(days).not.toHaveTextContent('15 sep 2026');
      expect(within(section).queryByText('vac-9')).toBeNull();
    });

    it('no hace pulsable la fila de la vacuna', async () => {
      await renderHome();

      const row = await screen.findByTestId('reminders-next-vaccine');

      expect(row.props.onPress).toBeUndefined();
      expect(row.props.accessibilityRole).toBeUndefined();
      fireEvent.press(row);
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe('#70 R7: ramas del contador de vacuna', () => {
    it('resuelve las tres ramas del contador', async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 8, 10, 12, 0));

      const cases = [
        ['2026-09-15', '5 d', 'Faltan 5 días'],
        ['2026-09-10', 'Hoy', 'Hoy'],
        ['2026-09-08', 'Vencida', 'Vencida'],
      ] as const;

      for (const [nextDoseAt, text, label] of cases) {
        mockGetPet.mockResolvedValue({
          kind: 'ok',
          pet: makePet({ nextVaccine: { ...vaccine, nextDoseAt } }),
        });
        const view = await render(<HomeScreen />, { wrapper: HomeWrapper });

        try {
          const days = await screen.findByTestId('reminders-next-vaccine-days');

          expect(days.props.children).toBe(text);
          expect(days.props.accessibilityLabel).toBe(label);
          expect(days).not.toHaveTextContent('-');
        } finally {
          await view.unmount();
        }
      }
    });
  });

  describe('#70 R8: estado vacío de próxima vacuna', () => {
    it('dibuja un estado vacío con forma de fila cuando no hay vacuna', async () => {
      mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
      jest
        .spyOn(Uniwind, 'getCSSVariable')
        .mockImplementation((token) => token);

      await renderHome();

      const section = await screen.findByTestId('reminders-section');
      const empty = within(section).getByTestId('reminders-none-upcoming');
      const icon = within(empty).getByTestId('icon-syringe');
      const text = within(empty).getByText('Sin vacuna próxima');

      expect(empty.props.className).toContain('flex-row items-center gap-3');
      expect(icon).toBeVisible();
      expect(icon.props.color).toBe('--color-muted');
      expect(text).toBeVisible();
      expect(text.props.className).toBe(
        'flex-1 text-sm font-normal text-muted',
      );
      expect(within(section).queryByTestId('reminders-next-vaccine')).toBeNull();
      expect(
        within(section).queryByTestId('reminders-next-vaccine-name'),
      ).toBeNull();
      expect(
        within(section).queryByTestId('reminders-next-vaccine-date'),
      ).toBeNull();
      expect(
        within(section).queryByTestId('reminders-next-vaccine-days'),
      ).toBeNull();
      expect(
        within(section).getByTestId('reminders-section-title'),
      ).toBeVisible();
      expect(within(section).getByTestId('reminders-see-all')).toBeVisible();
    });
  });

  describe('#70 R9: estados de carga y error del detalle', () => {
    it('esqueletiza mientras carga y calla cuando el perfil falla', async () => {
      mockGetPet.mockReturnValue(pending<PetState>());
      const loading = await render(<HomeScreen />, { wrapper: HomeWrapper });

      try {
        const section = await screen.findByTestId('reminders-section');
        const skeleton = within(section).getByTestId(
          'reminders-section-skeleton',
        );

        expect(skeleton.props.className).toContain('h-16 w-full rounded-card');
        expect(
          within(section).queryAllByTestId(/(?:-error|-retry)$/),
        ).toHaveLength(0);
        expect(within(section).getByTestId('reminders-see-all')).toBeVisible();
      } finally {
        await loading.unmount();
      }

      mockGetPet.mockResolvedValue({ kind: 'error' });
      const failed = await render(<HomeScreen />, { wrapper: HomeWrapper });

      try {
        const section = await screen.findByTestId('reminders-section');
        const body = within(section).getByTestId('reminders-section-body');

        expect(body.children).toHaveLength(0);
        expect(
          within(section).queryAllByTestId(/(?:-error|-retry)$/),
        ).toHaveLength(0);
        expect(within(section).getByTestId('reminders-see-all')).toBeVisible();
      } finally {
        await failed.unmount();
      }
    });

    it('deja el cuerpo con un solo hijo', async () => {
      mockGetPet.mockResolvedValue({
        kind: 'ok',
        pet: makePet({ nextVaccine: vaccine }),
      });
      const loaded = await render(<HomeScreen />, { wrapper: HomeWrapper });

      try {
        await screen.findByTestId('reminders-next-vaccine');
        expect(
          screen.getByTestId('reminders-section-body').children,
        ).toHaveLength(1);
      } finally {
        await loaded.unmount();
      }

      mockGetPet.mockReturnValue(pending<PetState>());
      const loading = await render(<HomeScreen />, { wrapper: HomeWrapper });

      try {
        await screen.findByTestId('reminders-section');
        expect(
          screen.getByTestId('reminders-section-body').children,
        ).toHaveLength(1);
      } finally {
        await loading.unmount();
      }

      mockGetPet.mockResolvedValue({ kind: 'error' });
      const failed = await render(<HomeScreen />, { wrapper: HomeWrapper });

      try {
        await screen.findByTestId('reminders-section');
        expect(
          screen.getByTestId('reminders-section-body').children,
        ).toHaveLength(0);
      } finally {
        await failed.unmount();
      }
    });
  });

  describe('#70 R10: enlace a la lista de recordatorios', () => {
    it('lleva a la lista de recordatorios existente', async () => {
      await renderHome();

      fireEvent.press(await screen.findByTestId('reminders-see-all'));

      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith('/reminders');
      expect(appRoutes(join(process.cwd(), 'src/app/(tabs)'))).toContain(
        '/reminders',
      );

      const source = readFileSync(
        join(process.cwd(), 'src/screens/home/index.tsx'),
        'utf8',
      );
      expect(source).not.toContain("'/reminders' as Href");
      expect(source).not.toMatch(/import\s*\{[^}]*\bHref\b[^}]*\}\s*from/);
    });

    it('no añade un segundo camino a la lista desde la Home', () => {
      const source = readFileSync(
        join(process.cwd(), 'src/screens/home/index.tsx'),
        'utf8',
      );
      const quickActions = source.slice(
        source.indexOf('const QUICK_ACTIONS = ['),
        source.indexOf('] as const;', source.indexOf('const QUICK_ACTIONS = [')),
      );

      expect(source.match(/['"]\/reminders['"]/g) ?? []).toHaveLength(1);
      expect(quickActions).not.toContain("'/reminders'");
    });

    it('muestra feedback visual al pulsar el enlace', async () => {
      const opacityOf = (style: unknown): unknown => {
        const entries = (Array.isArray(style) ? style.flat(Infinity) : [style])
          .filter(
            (entry): entry is Record<string, unknown> =>
              typeof entry === 'object' && entry !== null,
          );

        return entries.find((entry) => 'opacity' in entry)?.opacity;
      };

      await renderHome();
      const link = await screen.findByTestId('reminders-see-all');
      const source = readFileSync(
        join(process.cwd(), 'src/screens/home/index.tsx'),
        'utf8',
      );
      const anchor = source.indexOf('testID="reminders-see-all"');
      const block = source.slice(
        source.lastIndexOf('<Pressable', anchor),
        source.indexOf('</Pressable>', anchor),
      );

      expect(opacityOf(link.props.style)).toBe(1);
      expect(block).toMatch(
        /style=\{\(\{ pressed \}\) => \(\{ opacity: pressed \? 0\.8 : 1 \}\)\}/,
      );
    });
  });

  describe('#70 R11: accesibilidad por partes', () => {
    it('anuncia el enlace como botón y expande la abreviatura del contador', async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 8, 10, 12, 0));

      const cases = [
        ['2026-09-15', 'Faltan 5 días'],
        ['2026-09-10', 'Hoy'],
        ['2026-09-08', 'Vencida'],
      ] as const;

      for (const [nextDoseAt, label] of cases) {
        mockGetPet.mockResolvedValue({
          kind: 'ok',
          pet: makePet({ nextVaccine: { ...vaccine, nextDoseAt } }),
        });
        const view = await render(<HomeScreen />, { wrapper: HomeWrapper });

        try {
          const section = await screen.findByTestId('reminders-section');
          const body = within(section).getByTestId('reminders-section-body');
          const days = within(section).getByTestId(
            'reminders-next-vaccine-days',
          );
          const buttons = within(section).getAllByRole('button');

          expect(buttons.map((node) => node.props.testID)).toEqual([
            'reminders-see-all',
          ]);
          expect(days.props.accessibilityLabel).toBe(label);
          expect(
            within(section).getByTestId('reminders-next-vaccine-name').props
              .accessibilityLabel,
          ).toBeUndefined();
          expect(
            within(section).getByTestId('reminders-next-vaccine-date').props
              .accessibilityLabel,
          ).toBeUndefined();
          for (const group of [section, body]) {
            expect(group.props.accessible).toBeUndefined();
            expect(group.props.accessibilityLabel).toBeUndefined();
          }
        } finally {
          await view.unmount();
        }
      }
    });
  });

  describe('#70 R12: Card compartido y tokens', () => {
    it('viste la sección con el Card compartido y los tokens', async () => {
      const loaded = await render(<HomeScreen />, { wrapper: HomeWrapper });

      try {
        const row = await screen.findByTestId('reminders-next-vaccine');
        const name = within(row).getByTestId('reminders-next-vaccine-name');
        const date = within(row).getByTestId('reminders-next-vaccine-date');
        const days = within(row).getByTestId('reminders-next-vaccine-days');
        const disk = row.children[0];

        expect(row.props.className).toContain(
          'rounded-card border border-border bg-surface p-4 shadow-sm',
        );
        expect(row.props.className).toContain('flex-row items-center gap-3');
        expect(row.children[1]).toHaveProperty('props.className', 'flex-1');
        expect(typeof disk).not.toBe('string');
        if (typeof disk !== 'string') {
          expect(disk.props.className).toBe(
            `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.blue.surface}`,
          );
        }
        expect(days.props.className).toBe(
          `rounded-full px-2.5 py-1 text-xs font-bold ${CATEGORY_SLOTS.amber.surface} ${CATEGORY_SLOTS.amber.ink}`,
        );
        expect(days.props.style).toEqual(TABULAR_NUMS);
        expect(name.props.style).toBeUndefined();
        expect(date.props.style).toBeUndefined();
      } finally {
        await loaded.unmount();
      }

      mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
      const empty = await render(<HomeScreen />, { wrapper: HomeWrapper });

      try {
        const row = await screen.findByTestId('reminders-none-upcoming');
        const disk = row.children[0];

        expect(row.props.className).toContain(
          'rounded-card border border-border bg-surface p-4 shadow-sm',
        );
        expect(typeof disk).not.toBe('string');
        if (typeof disk !== 'string') {
          expect(disk.props.className).toBe(
            `size-9 items-center justify-center rounded-full ${CATEGORY_SLOTS.neutral.surface}`,
          );
        }
      } finally {
        await empty.unmount();
      }
    });
  });

  describe('#70 R13: icono de vacuna', () => {
    it('usa el icono de reicon y ningún emoji', () => {
      const source = readFileSync(
        join(process.cwd(), 'src/screens/home/index.tsx'),
        'utf8',
      );
      const reiconImport =
        source.match(/import \{[\s\S]*?\} from 'reicon-react-native';/)?.[0] ??
        '';

      expect(reiconImport).toMatch(/\bSyringe\b/);
      expect(source.match(/<Syringe\s+size=\{20\}/g) ?? []).toHaveLength(2);
      expect(source).not.toContain('💉');
    });
  });

  describe('#70 R14: posición y condición de la sección', () => {
    it('coloca la sección entre la actividad semanal y la última posición', async () => {
      const detailPet = makePet({
        nextVaccine: vaccine,
        device: {
          model: 'PetTrack One',
          batteryPct: 82,
          connectivity: 'online',
          lastMessageAt: '2026-09-08T12:00:00.000Z',
          esn: 'REM-001',
        },
      });
      mockGetPet.mockResolvedValue({ kind: 'ok', pet: detailPet });

      await renderHome();
      await screen.findByTestId('last-position-card');

      const relevantChildren = screen
        .getByTestId('home-content')
        .children.flatMap((child) =>
          typeof child === 'string' ? [] : [child.props.testID],
        )
        .filter((testID) =>
          [
            'summary-card',
            'collar-card',
            'quick-actions',
            'weekly-activity-card',
            'reminders-section',
            'last-position-card',
          ].includes(testID),
        );

      expect(relevantChildren).toEqual([
        'summary-card',
        'collar-card',
        'quick-actions',
        'weekly-activity-card',
        'reminders-section',
        'last-position-card',
      ]);
    });

    it('no dibuja la sección sin mascota seleccionada', async () => {
      mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });

      await renderHome();

      await screen.findByTestId('home-empty');
      expect(screen.queryByTestId('reminders-section')).toBeNull();
    });
  });

  describe('#70 R15: sin llamadas nuevas', () => {
    it('no añade ninguna llamada a la API', async () => {
      await renderHome();
      await screen.findByTestId('reminders-next-vaccine');
      await screen.findByTestId('weekly-activity-card');

      expect({
        pets: mockListPets.mock.calls.length,
        detail: mockGetPet.mock.calls.length,
        activity: mockGetDailyActivity.mock.calls.length,
        reminders: mockListReminders.mock.calls.length,
      }).toEqual({ pets: 1, detail: 1, activity: 1, reminders: 1 });
    });
  });

  describe('#70 R3: la barra de comidas queda fuera', () => {
    it('no dibuja la barra de comidas ni pide el plan de nutrición', async () => {
      await renderHome();

      const section = await screen.findByTestId('reminders-section');
      const body = within(section).getByTestId('reminders-section-body');
      const source = readFileSync(
        join(process.cwd(), 'src/screens/home/index.tsx'),
        'utf8',
      );

      expect(body.children).toHaveLength(1);
      expect(within(section).queryByText(/\d+\s*\/\s*\d+/)).toBeNull();
      expect(source).not.toContain("../../api/nutrition");
    });
  });
});
