import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { router, useFocusEffect } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, type ReactNode } from 'react';
import { Text } from 'react-native';
import { Uniwind } from 'uniwind';

import { withThemeTransition } from 'react-native-nitro-theme-transition';

import { requestPhotoUploadUrl, uploadPhotoToUrl } from '../../api/media';
import { getPet, listPets, type PetState, type PetsState } from '../../api/pets';
import type { PetProfile } from '../../api/types';
import { getMe, type MeState } from '../../api/users';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import {
  SelectedPetProvider,
  useSelectedPet,
} from '../../providers/selected-pet-provider';
import { setStoredTheme } from '../../utils/theme-preference';
import { ProfileScreen } from '.';

let mockTheme: 'light' | 'dark' = 'light';

jest.mock('react-native-nitro-theme-transition', () => ({
  withThemeTransition: jest.fn((apply: () => void) => {
    apply();
  }),
  isThemeTransitionAvailable: jest.fn(() => false),
}));

jest.mock('../../theme/nitro-availability', () => ({
  hasNitroModules: () => true,
}));

jest.mock('../../api/pets', () => ({
  getPet: jest.fn(),
  listPets: jest.fn(),
}));

jest.mock('../../api/media', () => ({
  ...jest.requireActual('../../api/media'),
  requestPhotoUploadUrl: jest.fn(),
  uploadPhotoToUrl: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}), { virtual: true });

jest.mock('../../api/users', () => ({
  getMe: jest.fn(),
}));

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../utils/theme-preference', () => ({
  setStoredTheme: jest.fn(),
}));

jest.mock('uniwind', () => {
  const actual = jest.requireActual<typeof import('uniwind')>('uniwind');

  return {
    ...actual,
    Uniwind: { ...actual.Uniwind, setTheme: jest.fn() },
    useUniwind: () => ({ theme: mockTheme, hasAdaptiveThemes: false }),
  };
});

jest.mock('../../components/pet-switcher', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { Pressable, Text, View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    PetSwitcher: ({
      pets,
      selectedPetId,
      onSelect,
    }: {
      pets: PetProfile[];
      selectedPetId: string | null;
      onSelect: (petId: string) => void;
    }) =>
      React.createElement(
        View,
        null,
        pets.map((pet) =>
          React.createElement(
            Pressable,
            {
              key: pet.id,
              testID: `pet-chip-${pet.id}`,
              accessibilityState: { selected: selectedPetId === pet.id },
              onPress: () => onSelect(pet.id),
            },
            React.createElement(Text, null, pet.name),
          ),
        ),
      ),
  };
});

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn() },
  useFocusEffect: jest.fn(),
  useIsFocused: jest.fn(() => true),
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const apiUrl = 'http://example.test/v1';
const mockLaunchImageLibrary = jest.mocked(ImagePicker.launchImageLibraryAsync);
const mockRequestPhotoUploadUrl = jest.mocked(requestPhotoUploadUrl);
const mockUploadPhotoToUrl = jest.mocked(uploadPhotoToUrl);
const mockGetPet = jest.mocked(getPet);
const mockListPets = jest.mocked(listPets);
const mockGetMe = jest.mocked(getMe);
const mockUseAuth = jest.mocked(useAuth);
const mockRouter = jest.mocked(router);
const mockUseFocusEffect = jest.mocked(useFocusEffect);
const mockSignOut = jest.fn<Promise<void>, []>();
const mockSetStoredTheme = jest.mocked(setStoredTheme);
const mockSetTheme = jest.mocked(Uniwind.setTheme);
let selectPetFromTest: ((petId: string) => void) | undefined;

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

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
    microchip: '985141004123456',
    photoUrl: 'http://example.test/luna.jpg',
    lostMode: false,
    lastPosition: null,
    lastCommunicationAt: '2026-08-21T12:00:00.000Z',
    myRole: 'owner',
    device: {
      model: 'PetTrack One',
      batteryPct: 82,
      connectivity: 'online',
      lastMessageAt: '2026-08-21T12:00:00.000Z',
      esn: 'ACT-001',
    },
    nextVaccine: null,
    nextReminder: null,
    activitySummary: null,
    createdAt: '2026-08-20T00:00:00.000Z',
    updatedAt: '2026-08-21T00:00:00.000Z',
    ...overrides,
  };
}

function SelectionProbe() {
  const { selectedPetId, selectPet } = useSelectedPet();
  useEffect(() => {
    selectPetFromTest = selectPet;

    return () => {
      selectPetFromTest = undefined;
    };
  }, [selectPet]);

  return <Text testID="selected-pet-id">{selectedPetId ?? 'none'}</Text>;
}

function ProfileWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <SelectedPetProvider>
        <SelectionProbe />
        {children}
      </SelectedPetProvider>
    </HeroUINativeProvider>
  );
}

function renderProfile() {
  return render(<ProfileScreen />, { wrapper: ProfileWrapper });
}

describe('R1: me card', () => {
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
  });

  it('shows the real account name and email', async () => {
    mockGetMe.mockResolvedValue({
      kind: 'ok',
      me: {
        id: 'user-1',
        email: 'ada@example.test',
        firstName: 'Ada',
        lastName: 'Lovelace',
        phone: '+525500000000',
        country: 'MX',
        timezone: 'America/Mexico_City',
        createdAt: '2026-08-20T00:00:00.000Z',
        updatedAt: '2026-08-21T00:00:00.000Z',
      },
    });

    await renderProfile();

    await waitFor(() => expect(screen.getByTestId('me-card')).toBeVisible());
    expect(screen.getByText('Ada Lovelace')).toBeVisible();
    expect(screen.getByText('ada@example.test')).toBeVisible();
    expect(mockGetMe).toHaveBeenCalledWith(apiUrl, 'jwt-token');
  });

  it.each([
    { kind: 'error' },
    { kind: 'unreachable', message: 'offline' },
    { kind: 'missing-config' },
  ] as MeState[])('degrades the account card for $kind', async (state) => {
    mockGetMe.mockResolvedValue(state);

    await renderProfile();

    await waitFor(() =>
      expect(screen.getByTestId('me-card-state')).toHaveTextContent(
        'Account unavailable',
      ),
    );
    expect(screen.getByTestId('screen-profile')).toBeVisible();
  });
});

describe('R3: reminders-link y sign out', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockSignOut.mockResolvedValue();
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: mockSignOut,
    } satisfies AuthContextValue);
    mockGetMe.mockReturnValue(pending<MeState>());
    mockListPets.mockReturnValue(pending<PetsState>());
    mockGetPet.mockReturnValue(pending<PetState>());
  });

  it('keeps reminders as a button that opens the hidden route', async () => {
    await renderProfile();

    await waitFor(() => expect(screen.getByTestId('reminders-link')).toBeVisible());
    expect(screen.getByTestId('reminders-link').props.accessibilityRole).toBe(
      'button',
    );
    fireEvent.press(screen.getByTestId('reminders-link'));

    expect(mockRouter.push).toHaveBeenCalledWith('/reminders');
  });

  it('keeps sign out and retires backend health UI', async () => {
    await renderProfile();

    await waitFor(() => expect(screen.getByTestId('profile-sign-out')).toBeVisible());
    fireEvent.press(screen.getByTestId('profile-sign-out'));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('backend-health-state')).toBeNull();
    expect(screen.queryByTestId('backend-health-retry')).toBeNull();
  });
});

describe('R2: estructura Figma', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockGetMe.mockReturnValue(pending<MeState>());
  });

  it('uses uniform dimensions and content-sized skeletons while loading', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());
    mockGetPet.mockReturnValue(pending<PetState>());

    await renderProfile();

    expect(screen.getByTestId('screen-profile').props.contentContainerStyle).toEqual({
      padding: 24,
      gap: 16,
      paddingTop: 52,
      paddingBottom: 120,
    });
    expect(screen.getByTestId('profile-hero-skeleton')).toBeVisible();
    expect(screen.getByTestId('pet-info-skeleton')).toBeVisible();
  });

  it('renders the active pet hero, switcher, pills and information rows', async () => {
    const pet = makePet();
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });

    await renderProfile();

    await waitFor(() => expect(screen.getByTestId('pet-info-card')).toBeVisible());
    expect(screen.getByTestId('profile-pet-photo')).toBeVisible();
    expect(screen.getAllByText('Luna').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Mixed').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('pet-chip-pet-1')).toBeVisible();
    expect(screen.getByText('female')).toBeVisible();
    expect(screen.getByText('Sterilized')).toBeVisible();
    expect(screen.getByText('30 months')).toBeVisible();
    expect(screen.getByText('12 kg')).toBeVisible();
    expect(screen.getByText('985141004123456')).toBeVisible();
    expect(screen.getByText('PetTrack One')).toBeVisible();
    expect(screen.getByTestId('change-photo')).toBeVisible();
    expect(screen.getByTestId('documents-link')).toBeVisible();
    expect(mockGetPet).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1');
  });

  it('uses No registrado for nullable information', async () => {
    const pet = makePet({
      breed: null,
      microchip: null,
      device: null,
      lastCommunicationAt: null,
    });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });

    await renderProfile();

    await waitFor(() => expect(screen.getByTestId('pet-info-card')).toBeVisible());
    expect(screen.getAllByText('No registrado')).toHaveLength(4);
  });

  it('changes the active pet through the shared PetSwitcher', async () => {
    const luna = makePet();
    const milo = makePet({ id: 'pet-2', name: 'Milo' });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [luna, milo] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: luna });

    await renderProfile();
    await waitFor(() => expect(screen.getByTestId('pet-chip-pet-2')).toBeVisible());
    fireEvent.press(screen.getByTestId('pet-chip-pet-2'));

    await waitFor(() =>
      expect(mockGetPet).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-2'),
    );
  });
});

describe('R4: toggle persiste', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTheme = 'light';
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockGetMe.mockReturnValue(pending<MeState>());
    mockListPets.mockReturnValue(pending<PetsState>());
    mockGetPet.mockReturnValue(pending<PetState>());
    mockSetStoredTheme.mockResolvedValue();
  });

  it('switches light to dark and persists it', async () => {
    await renderProfile();
    fireEvent.press(screen.getByTestId('theme-toggle'));

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockSetStoredTheme).toHaveBeenCalledWith('dark');
  });

  it('switches dark to light and persists it', async () => {
    mockTheme = 'dark';
    await renderProfile();
    fireEvent.press(screen.getByTestId('theme-toggle'));

    expect(mockSetTheme).toHaveBeenCalledWith('light');
    expect(mockSetStoredTheme).toHaveBeenCalledWith('light');
  });

  it('R2: el toggle dispara el fade vía withThemeTransition', async () => {
    await renderProfile();
    fireEvent.press(screen.getByTestId('theme-toggle'));

    expect(jest.mocked(withThemeTransition)).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockSetStoredTheme).toHaveBeenCalledWith('dark');
  });
});

describe('R7: cambiar foto', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockGetMe.mockReturnValue(pending<MeState>());
    const pet = makePet({ photoUrl: 'http://example.test/old.jpg' });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
  });

  it('does not request a URL when the picker is cancelled', async () => {
    mockLaunchImageLibrary.mockResolvedValue({ canceled: true, assets: null });
    await renderProfile();
    await waitFor(() => expect(screen.getByTestId('change-photo')).toBeVisible());

    await fireEvent.press(screen.getByTestId('change-photo'));

    expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(1);
    expect(mockRequestPhotoUploadUrl).not.toHaveBeenCalled();
    expect(mockUploadPhotoToUrl).not.toHaveBeenCalled();
  });

  it('requests, uploads raw bytes, and refetches the active pet', async () => {
    const body = new Blob(['png bytes'], { type: 'image/png' });
    mockLaunchImageLibrary.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///luna.png', mimeType: 'image/png' } as never],
    });
    mockRequestPhotoUploadUrl.mockResolvedValue({
      kind: 'ok',
      uploadUrl: 'http://localstack.test/upload',
      expiresInSeconds: 600,
    });
    mockUploadPhotoToUrl.mockResolvedValue({ kind: 'ok' });
    const assetFetch = jest.fn().mockResolvedValue({ blob: jest.fn().mockResolvedValue(body) });
    globalThis.fetch = assetFetch as unknown as typeof fetch;
    await renderProfile();
    await waitFor(() => expect(screen.getByTestId('change-photo')).toBeVisible());

    await fireEvent.press(screen.getByTestId('change-photo'));

    await waitFor(() => expect(mockRequestPhotoUploadUrl).toHaveBeenCalledWith(
      apiUrl,
      'jwt-token',
      'pet-1',
      'image/png',
    ));
    expect(assetFetch).toHaveBeenCalledWith('file:///luna.png');
    expect(mockUploadPhotoToUrl).toHaveBeenCalledWith(
      'http://localstack.test/upload',
      body,
      'image/png',
    );
    await waitFor(() => expect(mockGetPet).toHaveBeenCalledTimes(2));
  });

  it('keeps the old photo and shows an error when upload fails', async () => {
    mockLaunchImageLibrary.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///luna.webp', mimeType: 'image/webp' } as never],
    });
    mockRequestPhotoUploadUrl.mockResolvedValue({ kind: 'error' });
    await renderProfile();
    await waitFor(() => expect(screen.getByTestId('change-photo')).toBeVisible());

    await fireEvent.press(screen.getByTestId('change-photo'));

    await waitFor(() => expect(screen.getByTestId('photo-upload-error')).toBeVisible());
    expect(screen.getByTestId('profile-pet-photo').props.source).toEqual([
      { uri: 'http://example.test/old.jpg' },
    ]);
    expect(mockUploadPhotoToUrl).not.toHaveBeenCalled();
  });
});

describe('R8: navegación a docs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockGetMe.mockReturnValue(pending<MeState>());
    const pet = makePet();
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
  });

  it('opens the active pet document route', async () => {
    await renderProfile();
    await waitFor(() => expect(screen.getByTestId('documents-link')).toBeVisible());

    fireEvent.press(screen.getByTestId('documents-link'));

    expect(mockRouter.push).toHaveBeenCalledWith('/pets/pet-1/docs');
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
    mockGetMe.mockReturnValue(pending<MeState>());
    const pet = makePet();
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
  });

  it('refetches the pet list and active pet when Profile recovers focus', async () => {
    renderProfile();
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

  it('preserves the newly selected pet while the stale list revalidates', async () => {
    const existingPet = makePet();
    const createdPet = makePet({ id: 'pet-new', name: 'Nala' });
    let resolveRevalidatedPets!: (state: PetsState) => void;
    const revalidatedPets = new Promise<PetsState>((resolve) => {
      resolveRevalidatedPets = resolve;
    });
    mockListPets
      .mockResolvedValueOnce({ kind: 'ok', pets: [existingPet] })
      .mockReturnValueOnce(revalidatedPets);
    mockGetPet.mockImplementation(async (_baseUrl, _token, petId) => ({
      kind: 'ok',
      pet: petId === createdPet.id ? createdPet : existingPet,
    }));
    renderProfile();
    await waitFor(() =>
      expect(screen.getByTestId('selected-pet-id')).toHaveTextContent(
        existingPet.id,
      ),
    );
    const focusCallback = mockUseFocusEffect.mock.calls.at(-1)?.[0];
    expect(focusCallback).toBeDefined();

    await act(async () => {
      selectPetFromTest?.(createdPet.id);
      focusCallback?.();
      await Promise.resolve();
    });

    expect(screen.getByTestId('selected-pet-id')).toHaveTextContent(
      createdPet.id,
    );

    await act(async () => {
      resolveRevalidatedPets({ kind: 'ok', pets: [existingPet, createdPet] });
      await revalidatedPets;
    });

    await waitFor(() =>
      expect(screen.getByTestId('selected-pet-id')).toHaveTextContent(
        createdPet.id,
      ),
    );
  });
});

describe('R10 (mobile-device-pairing): el perfil enlaza a /pairing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockGetMe.mockReturnValue(pending<MeState>());
    const pet = makePet();
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
  });

  it('shows the GPS configuration row and opens pairing', async () => {
    await renderProfile();

    const link = await screen.findByTestId('pairing-link');
    expect(
      screen.getByText('Configuración del Dispositivo GPS'),
    ).toBeVisible();
    expect(link.props.accessibilityRole).toBe('button');
    await fireEvent.press(link);

    expect(mockRouter.push).toHaveBeenCalledWith('/pairing');
  });

  it('does not show the row before a pet is loaded', async () => {
    mockGetPet.mockReturnValue(pending<PetState>());

    await renderProfile();

    expect(screen.queryByTestId('pairing-link')).toBeNull();
  });
});
