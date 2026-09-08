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

import {
  getDailyActivity,
  type DailyActivityState,
} from '../../api/activity';
import { getPet, listPets, type PetState, type PetsState } from '../../api/pets';
import type { DayEntry, PetProfile } from '../../api/types';
import * as apiHooks from '../../hooks/use-api';
import type { ApiResult } from '../../hooks/use-api';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { SelectedPetProvider } from '../../providers/selected-pet-provider';
import * as selectedPetHooks from '../../providers/selected-pet-provider';
import { HomeScreen } from './index';

jest.mock('../../api/pets', () => ({
  getPet: jest.fn(),
  listPets: jest.fn(),
}));

jest.mock('../../api/activity', () => ({
  getDailyActivity: jest.fn(),
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

const apiUrl = 'http://example.test/v1';
const mockGetDailyActivity = jest.mocked(getDailyActivity);
const mockGetPet = jest.mocked(getPet);
const mockListPets = jest.mocked(listPets);
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
        const result = hookCall++ % 3 === 0 ? petsResult : emptyResult;
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

  it('asigna cada valor a su celda y a ninguna otra', async () => {
    await renderHome();

    await screen.findByTestId('summary-card');
    expect(screen.getByTestId('summary-weight')).toHaveTextContent('12.4 kg');
    expect(screen.getByTestId('summary-activity')).toHaveTextContent('1h 35m');
    expect(screen.getByTestId('summary-sleep')).toHaveTextContent('45m');
    expect(screen.getByTestId('summary-distance')).toHaveTextContent('2.4 km');
  });
});
