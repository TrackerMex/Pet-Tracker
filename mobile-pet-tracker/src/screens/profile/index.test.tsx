import {
  act,
  fireEvent,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { router, useFocusEffect } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState, type ReactNode } from 'react';
import { Linking, Text, TextInput } from 'react-native';
import { Uniwind } from 'uniwind';
import type { TestInstance } from 'test-renderer';

import { withThemeTransition } from 'react-native-nitro-theme-transition';

import { requestPhotoUploadUrl, uploadPhotoToUrl } from '../../api/media';
import { getPet, listPets, type PetState, type PetsState } from '../../api/pets';
import { petKeys, userKeys } from '../../api/query-keys';
import type { PetProfile } from '../../api/types';
import { getMe, type MeState } from '../../api/users';
import { useNotificationsBlocked } from '../../hooks/use-push-registration';
import { en, es } from '../../i18n/catalog';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import {
  SelectedPetProvider,
  useSelectedPet,
} from '../../providers/selected-pet-provider';
import * as selectedPetHooks from '../../providers/selected-pet-provider';
import { setStoredTheme } from '../../utils/theme-preference';
import { setStoredLanguage } from '../../utils/language-preference';
import { ProfileScreen } from '.';
import { useChunkyLip } from '../../theme/chunky-lip';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { renderWithProviders } from '../../../test/render-with-providers';

const mockUseReducedMotion = jest.fn<boolean, []>(() => false);

jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual<typeof import('react-native-reanimated')>('react-native-reanimated');
  return {
    ...actual,
    __esModule: true,
    useReducedMotion: () => mockUseReducedMotion(),
    withTiming: jest.fn((value: number) => value),
    withDelay: jest.fn((_ms: number, animation: unknown) => animation),
    withSequence: jest.fn((...steps: unknown[]) => steps.at(-1)),
    withRepeat: jest.fn((animation: unknown) => animation),
    cancelAnimation: jest.fn(),
  };
});

let mockTheme: 'light' | 'dark' = 'light';
const mockHomeEntrance = jest.fn<void, [import('react-native').ViewProps & { index: number }]>();

jest.mock('../home/home-entrance', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    HomeEntrance(props: import('react-native').ViewProps & { index: number }) {
      mockHomeEntrance(props);
      return React.createElement(View, props);
    },
  };
});

const mockPetSwitcher = jest.fn<void, [{
  pets: PetProfile[];
  selectedPetId: string | null;
  onSelect: (petId: string) => void;
  variant?: 'default' | 'avatars' | 'glass';
  trailing?: ReactNode;
}]>();

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

jest.mock('../../hooks/use-push-registration', () => ({
  useNotificationsBlocked: jest.fn(() => false),
}));

jest.mock('../../utils/theme-preference', () => ({
  setStoredTheme: jest.fn(),
}));

jest.mock('../../utils/language-preference', () => ({
  setStoredLanguage: jest.fn(),
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
    PetSwitcher: (props: {
      pets: PetProfile[];
      selectedPetId: string | null;
      onSelect: (petId: string) => void;
      variant?: 'default' | 'avatars' | 'glass';
      trailing?: ReactNode;
    }) => {
      mockPetSwitcher(props);
      const { pets, selectedPetId, onSelect } = props;
      return React.createElement(
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
      );
    },
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

jest.mock('reicon-react-native', () => {
  const actual = jest.requireActual<typeof import('reicon-react-native')>('reicon-react-native');
  const { View } = jest.requireActual('react-native');
  const icon = (testID: string) =>
    function MockIcon({ color, size, strokeWidth }: { color?: string; size?: number; strokeWidth?: number }) {
      return <View {...{ size, strokeWidth }} testID={testID} style={{ color }} />;
    };
  return {
    ...actual,
    __esModule: true,
    FileText: icon('profile-icon-file-text'),
    Wifi: icon('profile-icon-wifi'),
    Map: icon('profile-icon-map'),
    Bell: icon('profile-icon-bell'),
    Plus: icon('profile-icon-plus'),
    Camera: icon('profile-icon-camera'),
  };
});

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens,
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
const mockSetStoredLanguage = jest.mocked(setStoredLanguage);
const mockSetStoredTheme = jest.mocked(setStoredTheme);
const mockSetTheme = jest.mocked(Uniwind.setTheme);
let selectPetFromTest: ((petId: string) => void) | undefined;

beforeEach(() => {
  mockLaunchImageLibrary.mockReset();
  mockLaunchImageLibrary.mockResolvedValue({ canceled: true, assets: null });
});

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
    mealsToday: null,
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

function LocalInputProbe() {
  const [value, setValue] = useState('');

  return (
    <TextInput
      testID="language-state-probe"
      value={value}
      onChangeText={setValue}
    />
  );
}

function ProfileWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial="es">
        <SelectedPetProvider>
          <SelectionProbe />
          <LocalInputProbe />
          {children}
        </SelectedPetProvider>
      </LanguageProvider>
    </HeroUINativeProvider>
  );
}

function renderProfile() {
  return renderWithProviders(<ProfileScreen />, { wrapper: ProfileWrapper });
}

describe('#173 R5: cápsula de añadir mascota', () => {
  beforeEach(setupProfile168);

  it('pinta la cápsula tras el título con icono oculto y texto en español (enmendado por #196 R2)', async () => {
    await renderProfile();
    await screen.findByTestId('pet-info-card');
    const capsule = screen.getByTestId('profile-add-pet');

    expect(capsule.props.className).toBe('h-11 flex-row items-center gap-1.5 rounded-full bg-glass-surface-strong px-4');
    expect(capsule.props.accessibilityRole).toBe('button');
    expect(capsule.props.hitSlop).toEqual(TOUCH_SLOP);
    expect(capsule.props.style?.borderCurve).toBeUndefined();
    expect(profileChild(capsule.parent!, 0)).toBe(screen.getByTestId('profile-title'));
    expect(profileChild(capsule.parent!, 1)).toBe(capsule);
    expect(capsule.children).toHaveLength(2);
    const icon = within(capsule).getByTestId('profile-add-pet-icon', { includeHiddenElements: true });
    expect(profileChild(capsule, 0)).toBe(icon);
    expect(icon.props.accessibilityElementsHidden).toBe(true);
    expect(icon.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(icon.children).toHaveLength(1);
    const glyph = within(icon).getByTestId('profile-icon-plus', { includeHiddenElements: true });
    expect(profileChild(icon, 0)).toBe(glyph);
    expect(glyph.props.size).toBe(16);
    expect(glyph.props.strokeWidth).toBe(2.6);
    expect(glyph.props.style).toEqual({ color: 'accent-strong' });
    const label = within(capsule).getByText('Añadir mascota');
    expect(profileChild(capsule, 1)).toBe(label);
    expect(label.props.className).toBe('text-sm font-extrabold text-accent-strong');
  });

  it('pinta Add pet en inglés con la misma receta', async () => {
    await renderProfile();
    await screen.findByTestId('pet-info-card');
    await fireEvent.press(screen.getByTestId('language-toggle'));

    const capsule = screen.getByTestId('profile-add-pet');
    const label = await within(capsule).findByText('Add pet');
    expect(label.props.className).toBe('text-sm font-extrabold text-accent-strong');
  });

  it('pulsar la cápsula abre el alta de mascotas', async () => {
    await renderProfile();
    await screen.findByTestId('pet-info-card');

    await fireEvent.press(screen.getByTestId('profile-add-pet'));

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/pets/add');
  });
});

describe('#173 R4: Perfil pide la variante avatars', () => {
  beforeEach(setupProfile168);

  it('pasa avatars al selector compartido cuando carga la mascota (enmendado por #196 R2)', async () => {
    await renderProfile();
    await screen.findByTestId('pet-info-card');

    expect(mockPetSwitcher.mock.lastCall?.[0].variant).toBe('glass');
    expect(mockPetSwitcher.mock.lastCall?.[0].trailing).toBeUndefined();
  });
});

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

    expect(await screen.findByText('Ada Lovelace')).toBeVisible();
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
        'Cuenta no disponible',
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

  it('uses the canvas artboard metrics (#173 R17) and content-sized skeletons while loading (enmendado por #196 R1)', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());
    mockGetPet.mockReturnValue(pending<PetState>());

    await renderProfile();

    expect(screen.getByTestId('screen-profile').props.contentContainerStyle).toEqual({
      gap: 14,
      paddingBottom: 120,
    });
    expect(screen.getByTestId('pet-hero-skeleton')).toBeVisible();
    expect(screen.getByTestId('pet-info-skeleton')).toBeVisible();
  });

  it('renders the active pet hero, switcher, pills and information rows (enmendado por #196 R1, R2, R4)', async () => {
    const pet = makePet();
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });

    await renderProfile();

    await waitFor(() => expect(screen.getByTestId('pet-info-card')).toBeVisible());
    expect(screen.getByTestId('pet-hero-media', { includeHiddenElements: true })).toBeVisible();
    expect(screen.getAllByText('Luna').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Mixed').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('pet-chip-pet-1')).toBeOnTheScreen();
    expect(screen.getByText('Hembra')).toBeOnTheScreen();
    expect(screen.getByText('Esterilizado')).toBeOnTheScreen();
    expect(screen.getByText('30 meses')).toBeOnTheScreen();
    expect(screen.getByText('12 kg')).toBeOnTheScreen();
    expect(screen.getByText('985141004123456')).toBeVisible();
    expect(screen.getByText('Vinculado')).toBeVisible();
    expect(screen.getByTestId('change-photo')).toBeOnTheScreen();
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
    expect(screen.getAllByText('No registrado')).toHaveLength(3);
  });

  it('changes the active pet through the shared PetSwitcher (enmendado por #196 R2)', async () => {
    const luna = makePet();
    const milo = makePet({ id: 'pet-2', name: 'Milo' });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [luna, milo] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: luna });

    await renderProfile();
    await waitFor(() => expect(screen.getByTestId('pet-chip-pet-2')).toBeOnTheScreen());
    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));

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
    await fireEvent.press(screen.getByTestId('theme-toggle'));

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockSetStoredTheme).toHaveBeenCalledWith('dark');
  });

  it('switches dark to light and persists it', async () => {
    mockTheme = 'dark';
    await renderProfile();
    await fireEvent.press(screen.getByTestId('theme-toggle'));

    expect(mockSetTheme).toHaveBeenCalledWith('light');
    expect(mockSetStoredTheme).toHaveBeenCalledWith('light');
  });

  it('R2: el toggle dispara el fade vía withThemeTransition', async () => {
    await renderProfile();
    await fireEvent.press(screen.getByTestId('theme-toggle'));

    expect(jest.mocked(withThemeTransition)).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockSetStoredTheme).toHaveBeenCalledWith('dark');
  });
});

describe('#173 R11: cuenta en Card flat con Switch e idioma', () => {
  const account: MeState = { kind: 'ok', me: {
    id: 'user-1', email: 'ana@example.test', firstName: 'Ana', lastName: 'García',
    phone: '+525500000000', country: 'MX', timezone: 'America/Mexico_City',
    createdAt: '2026-08-20T00:00:00.000Z', updatedAt: '2026-08-21T00:00:00.000Z',
  } };
  beforeEach(() => {
    setupProfile168();
    mockTheme = 'light';
    mockSetStoredTheme.mockResolvedValue();
    mockSetStoredLanguage.mockResolvedValue();
  });

  it.each<{
    name: string;
    state: MeState | undefined;
    children: string[];
  }>([
    { name: 'pendiente', state: undefined, children: ['me-card-skeleton', 'theme-row', 'language-toggle'] },
    { name: 'ok', state: account, children: ['me-identity', 'edit-profile-link', 'theme-row', 'language-toggle'] }, // #194 R9
    { name: 'error', state: { kind: 'error' }, children: ['me-card-state', 'theme-row', 'language-toggle'] },
    { name: 'unauthorized', state: { kind: 'unauthorized' }, children: ['theme-row', 'language-toggle'] },
  ])('#194 R9: orders the account children for $name without a section label', async ({ state, children }) => {
    if (state !== undefined) mockGetMe.mockResolvedValue(state);
    await renderProfile();
    const card = screen.getByTestId('me-card');
    await waitFor(() => expect(card.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(children));
    expect(card.children).toHaveLength(children.length);
    expect(card.props.className).toBe('rounded-card border border-border bg-surface px-3.5 py-1');
    expect(screen.queryByText('Cuenta')).toBeNull();
    expect(screen.queryByText('Account')).toBeNull();
  });

  it.each([
    { theme: 'light' as const, language: 'es', checked: false, label: 'Usar tema oscuro' },
    { theme: 'dark' as const, language: 'es', checked: true, label: 'Usar tema oscuro' },
    { theme: 'light' as const, language: 'en', checked: false, label: 'Use dark theme' },
    { theme: 'dark' as const, language: 'en', checked: true, label: 'Use dark theme' },
  ])('expone el Switch $theme en $language con etiqueta fija', async ({ theme, language, checked, label }) => {
    mockTheme = theme;
    await renderProfile();
    if (language === 'en') await fireEvent.press(screen.getByTestId('language-toggle'));
    const toggle = screen.getByTestId('theme-toggle');
    expect(toggle.props.accessibilityState?.checked).toBe(checked);
    expect(toggle.props.accessibilityLabel).toBe(label);
    expect(toggle.props.hitSlop).toEqual(TOUCH_SLOP);
    expect(within(screen.getByTestId('theme-row')).getByText(label)).toBeVisible();
  });

  it('usa las recetas y el orden de las dos filas de ajustes', async () => {
    await renderProfile();
    const themeRow = screen.getByTestId('theme-row');
    expect(themeRow.props.className).toBe('flex-row items-center justify-between gap-4 border-t border-separator py-2.5');
    expect(themeRow.children).toHaveLength(2);
    expect(profileChild(themeRow, 0).props.className).toBe('text-sm font-semibold text-foreground');
    expect(profileChild(themeRow, 0).props.children).toBe('Usar tema oscuro');
    expect(profileChild(themeRow, 1)).toBe(screen.getByTestId('theme-toggle'));
    const languageRow = screen.getByTestId('language-toggle');
    expect(languageRow.props.className).toBe('flex-row items-center justify-between gap-4 border-t border-separator py-2.5');
    expect(languageRow.props.accessibilityRole).toBe('button');
    expect(languageRow.props.accessibilityLabel).toBe('Cambiar idioma');
    expect(languageRow.children).toHaveLength(2);
    expect(profileChild(languageRow, 0).props.className).toBe('text-sm font-semibold text-foreground');
    expect(profileChild(languageRow, 0).props.children).toBe('Cambiar idioma');
    expect(profileChild(languageRow, 1)).toBe(screen.getByTestId('language-value'));
    expect(profileChild(languageRow, 1).props.className).toBe('text-sm font-extrabold text-accent-strong');
  });

  it.each([
    { language: 'es', current: 'Español', next: 'en', nextName: 'English' },
    { language: 'en', current: 'English', next: 'es', nextName: 'Español' },
  ])('muestra $current como valor y cambia a $next', async ({ language, current, next, nextName }) => {
    await renderProfile();
    if (language === 'en') await fireEvent.press(screen.getByTestId('language-toggle'));
    const row = screen.getByTestId('language-toggle');
    expect(row.props.accessibilityValue).toEqual({ text: current });
    expect(screen.getByTestId('language-value')).toHaveTextContent(current);
    mockSetStoredLanguage.mockClear();
    await fireEvent.press(row);
    expect(mockSetStoredLanguage).toHaveBeenCalledTimes(1);
    expect(mockSetStoredLanguage).toHaveBeenCalledWith(next);
    expect(screen.getByTestId('language-value')).toHaveTextContent(nextName);
  });
});

describe('#65 R14 (enmendado por #173 R11): Profile cambia el idioma y repinta sin reiniciar', () => {
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
    mockSetStoredLanguage.mockResolvedValue();
  });

  it('shows the current endonym and changes the live Profile copy (enmendado por #196 R2)', async () => {
    await renderProfile();

    expect(screen.getByText('Perfil')).toBeOnTheScreen();
    expect(screen.getByTestId('language-value')).toHaveTextContent('Español');
    expect(screen.getByTestId('theme-toggle')).toBeVisible();

    await act(async () => {
      await fireEvent.press(screen.getByTestId('language-toggle'));
      await Promise.resolve();
    });

    await waitFor(() => expect(screen.getByText('Profile')).toBeOnTheScreen());
    expect(screen.getByTestId('language-value')).toHaveTextContent('English');
    expect(mockSetStoredLanguage).toHaveBeenCalledWith('en');
  });

  it('preserves local input state across the language repaint', async () => {
    await renderProfile();
    await fireEvent.changeText(
      screen.getByTestId('language-state-probe'),
      'PET-123',
    );
    expect(screen.getByTestId('language-state-probe')).toHaveProp(
      'value',
      'PET-123',
    );

    await act(async () => {
      await fireEvent.press(screen.getByTestId('language-toggle'));
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(screen.getByTestId('language-state-probe')).toHaveProp(
        'value',
        'PET-123',
      ),
    );
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

  it('does not request a URL when the picker is cancelled (enmendado por #196 R4)', async () => {
    mockLaunchImageLibrary.mockResolvedValue({ canceled: true, assets: null });
    await renderProfile();
    await waitFor(() => expect(screen.getByTestId('change-photo')).toBeOnTheScreen());

    await fireEvent.press(screen.getByTestId('change-photo'));

    expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(1);
    expect(mockRequestPhotoUploadUrl).not.toHaveBeenCalled();
    expect(mockUploadPhotoToUrl).not.toHaveBeenCalled();
  });

  it('requests, uploads raw bytes, and refetches the active pet (enmendado por #196 R4)', async () => {
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
    await waitFor(() => expect(screen.getByTestId('change-photo')).toBeOnTheScreen());

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

  it('keeps the old photo and shows an error when upload fails (enmendado por #196 R1, R4)', async () => {
    mockLaunchImageLibrary.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///luna.webp', mimeType: 'image/webp' } as never],
    });
    mockRequestPhotoUploadUrl.mockResolvedValue({ kind: 'error' });
    await renderProfile();
    await waitFor(() => expect(screen.getByTestId('change-photo')).toBeOnTheScreen());

    await fireEvent.press(screen.getByTestId('change-photo'));

    await waitFor(() => expect(screen.getByTestId('photo-upload-error')).toBeVisible());
    expect(screen.getByTestId('pet-hero-media', { includeHiddenElements: true }).props.source).toEqual([
      { uri: 'http://example.test/old.jpg', cacheKey: 'pet-1' },
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

  it('shows the GPS collar tile and opens pairing', async () => {
    await renderProfile();

    const link = await screen.findByTestId('pairing-link');
    expect(
      screen.getByText('Collar GPS'),
    ).toBeVisible();
    expect(link.props.accessibilityRole).toBe('button');
    expect(link.props.className).toBe('flex-1 gap-1.5 rounded-tile p-3 bg-category-green');
    await fireEvent.press(link);

    expect(mockRouter.push).toHaveBeenCalledWith('/pairing');
  });

  it('does not show the row before a pet is loaded', async () => {
    mockGetPet.mockReturnValue(pending<PetState>());

    await renderProfile();

    expect(screen.queryByTestId('pairing-link')).toBeNull();
  });
});

describe('#61 R9 (enmendado por #173 R8): pet-info-card no lleva etiqueta de sección', () => {
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

  it('pinta cuatro filas en Card flat sin etiqueta de sección', async () => {
    const pet = makePet();
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });

    await renderProfile();

    await waitFor(() =>
      expect(screen.getByTestId('pet-info-card')).toBeVisible(),
    );

    const card = screen.getByTestId('pet-info-card');
    expect(card.props.className).toBe('rounded-card border border-border bg-surface px-3.5 py-1');
    expect(card.children).toHaveLength(4);
    expect(screen.queryByText('Información')).toBeNull();
    expect(screen.queryByText('Information')).toBeNull();
  });
});

describe('#173 R8: información en Card flat', () => {
  beforeEach(setupProfile168);

  it('contiene solo las cuatro filas de datos, sin texto de sección', async () => {
    await renderProfile();
    const card = await screen.findByTestId('pet-info-card');
    expect(card.props.className).toBe('rounded-card border border-border bg-surface px-3.5 py-1');
    expect(card.children).toHaveLength(4);
    for (let index = 0; index < 4; index++) {
      expect(profileChild(card, index).children).toHaveLength(2);
    }
    expect(screen.queryByText('Información')).toBeNull();
    expect(screen.queryByText('Information')).toBeNull();
  });

  it.each([
    { language: 'es', linked: true, value: 'Vinculado', className: 'flex-1 text-right text-sm font-bold text-accent-strong' },
    { language: 'en', linked: true, value: 'Linked', className: 'flex-1 text-right text-sm font-bold text-accent-strong' },
    { language: 'es', linked: false, value: 'Sin collar', className: 'flex-1 text-right text-sm font-bold text-foreground' },
    { language: 'en', linked: false, value: 'No collar', className: 'flex-1 text-right text-sm font-bold text-foreground' },
  ])('pinta el estado del collar ($linked) en $language', async ({ language, linked, value, className }) => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ device: linked ? makePet().device : null }) });
    await renderProfile();
    const card = await screen.findByTestId('pet-info-card');
    if (language === 'en') await fireEvent.press(screen.getByTestId('language-toggle'));
    expect(within(card).getByText(value).props.className).toBe(className);
    expect(screen.queryByText('PetTrack One')).toBeNull();
    expect(screen.queryByText('Información')).toBeNull();
    expect(screen.queryByText('Information')).toBeNull();
  });

  it('usa padding de 11 pt en raza y última señal con separador solo en raza', async () => {
    await renderProfile();
    const breed = await screen.findByText('Raza');
    expect(breed.parent!.props.className).toBe('flex-row items-center justify-between gap-4 border-b border-separator py-2.75');
    expect(screen.getByText('Última señal').parent!.props.className).toBe('flex-row items-center justify-between gap-4 py-2.75');
    expect(screen.getByText('Mixed').props.className).toBe('flex-1 text-right text-sm font-bold text-foreground');
    expect(breed.props.className).toBe('text-sm font-normal text-muted');
  });
});

describe('#173 R9: última señal relativa', () => {
  let nowSpy: jest.SpyInstance<number, []>;
  beforeEach(() => {
    setupProfile168();
    nowSpy = jest.spyOn(Date, 'now').mockReturnValue(Date.parse('2026-10-13T12:00:00.000Z'));
  });
  afterEach(() => nowSpy.mockRestore());

  const cases = [
    { iso: '2026-10-13T11:59:30.000Z', es: 'Justo ahora', en: 'Just now' },
    { iso: '2026-10-13T12:05:00.000Z', es: 'Justo ahora', en: 'Just now' },
    { iso: '2026-10-13T11:59:01.000Z', es: 'Justo ahora', en: 'Just now' },
    { iso: '2026-10-13T11:59:00.000Z', es: 'hace 1 min', en: '1m ago' },
    { iso: '2026-10-13T11:15:00.000Z', es: 'hace 45 min', en: '45m ago' },
    { iso: '2026-10-13T11:00:01.000Z', es: 'hace 59 min', en: '59m ago' },
    { iso: '2026-10-13T11:00:00.000Z', es: 'hace 1 h', en: '1h ago' },
    { iso: '2026-10-13T06:30:00.000Z', es: 'hace 5 h', en: '5h ago' },
    { iso: '2026-10-12T12:00:01.000Z', es: 'hace 23 h', en: '23h ago' },
    { iso: '2026-10-12T12:00:00.000Z', es: '12 oct', en: 'Oct 12' },
    { iso: '2026-08-21T12:00:00.000Z', es: '21 ago', en: 'Aug 21' },
    { iso: '2025-12-30T12:00:00.000Z', es: '30 dic 2025', en: 'Dec 30, 2025' },
    { iso: null, es: 'No registrado', en: 'Not registered' },
  ];

  it.each(cases)('formatea $iso en español como $es', async ({ iso, es: value }) => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ lastCommunicationAt: iso }) });
    await renderProfile();
    const card = await screen.findByTestId('pet-info-card');
    expect(await within(card).findByText(value)).toBeVisible();
  });

  it.each(cases)('formatea $iso en inglés como $en', async ({ iso, en: value }) => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ lastCommunicationAt: iso }) });
    await renderProfile();
    const card = await screen.findByTestId('pet-info-card');
    await fireEvent.press(screen.getByTestId('language-toggle'));
    expect(await within(card).findByText(value)).toBeVisible();
  });
});

describe('#61 R10: los controles táctiles declaran TOUCH_SLOP', () => {
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

  it.each(['documents-link', 'reminders-link'])(
    '%s llega a 44 pt sin crecer a la vista',
    async (testID) => {
      const pet = makePet();
      mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
      mockGetPet.mockResolvedValue({ kind: 'ok', pet });

      await renderProfile();

      await waitFor(() => expect(screen.getByTestId(testID)).toBeVisible());

      expect(screen.getByTestId(testID).props.hitSlop).toEqual(TOUCH_SLOP);
    },
  );
});

describe('#62 R6: la última fila de pet-info-card no cuelga su separador', () => {
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

  it('conserva el separador en Raza y lo omite en Última señal', async () => {
    await renderProfile();

    const breedRow = (await screen.findByText('Raza')).parent;
    const lastSignalRow = screen.getByText('Última señal').parent;

    expect(breedRow?.props.className).toContain('border-b border-separator');
    expect(lastSignalRow?.props.className).not.toContain('border-b');
  });
});

describe('#87 R16: ProfileScreen lee por TanStack Query', () => {
  it('deja cuenta, mascotas y detalle en sus claves canónicas', async () => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    const meState: MeState = {
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
    };
    const pet = makePet();
    const petsState: PetsState = { kind: 'ok', pets: [pet] };
    const detailState: PetState = { kind: 'ok', pet };
    mockGetMe.mockResolvedValue(meState);
    mockListPets.mockResolvedValue(petsState);
    mockGetPet.mockResolvedValue(detailState);

    const { queryClient } = await renderWithProviders(<ProfileScreen />, {
      wrapper: ProfileWrapper,
    });
    await screen.findByTestId('profile-pet-card');

    expect(queryClient.getQueryData(userKeys.me())).toEqual(meState);
    expect(queryClient.getQueryData(petKeys.list())).toEqual(petsState);
    expect(queryClient.getQueryData(petKeys.detail('pet-1'))).toEqual(
      detailState,
    );
  });
});

describe('#72 R3: el mock del picker no hereda implementación entre tests', () => {
  it('#72 R3: resuelve al valor cancelado por defecto', async () => {
    await expect(mockLaunchImageLibrary()).resolves.toEqual({
      canceled: true,
      assets: null,
    });
  });
});

const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
const mockUseNotificationsBlocked = jest.mocked(useNotificationsBlocked);
const mockOpenSettings = jest.mocked(Linking.openSettings);
const NOTICE_ES = 'Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.';

describe('#99 R3: Perfil avisa de las notificaciones bloqueadas y abre la configuración de la app', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockGetMe.mockReturnValue(pending<MeState>());
    mockListPets.mockReturnValue(pending<PetsState>());
    mockGetPet.mockReturnValue(pending<PetState>());
    mockOpenSettings.mockResolvedValue(undefined);
  });

  afterEach(() => { mockUseNotificationsBlocked.mockReturnValue(false); });

  it('con el permiso bloqueado pinta el aviso justo debajo de la cabecera, con su copy y su acción (enmendado por #196 R1, R5)', async () => {
    mockUseNotificationsBlocked.mockReturnValue(true);
    await renderProfile();
    const notice = await screen.findByTestId('notifications-blocked-notice');
    const action = screen.getByTestId('notifications-open-settings');
    const content = screen.getByTestId('profile-content');
    const entrance = screen.getByTestId('profile-entrance-notice');
    expect(profileChild(content, 0)).toBe(entrance);
    expect(entrance.children).toHaveLength(1);
    expect(profileChild(entrance, 0)).toBe(notice);
    expect(notice).toBeVisible();
    expect(notice).toHaveProperty('props.className', 'items-start gap-3 rounded-card p-3.5 bg-category-amber');
    expect(notice.children).toHaveLength(2);
    expect(notice.children[0]).toHaveTextContent(NOTICE_ES);
    expect(notice.children[0]).toHaveProperty('props.className', 'text-sm leading-note font-normal text-foreground');
    expect(notice.children.indexOf(action)).toBe(1);
    expect(action).toHaveTextContent('Abrir configuración');
    expect(action.props.accessibilityRole).toBe('button');
  });

  it('pulsar la acción abre la configuración de la app una vez y no navega', async () => {
    mockUseNotificationsBlocked.mockReturnValue(true);
    await renderProfile();
    const action = await screen.findByTestId('notifications-open-settings');
    expect(action).toBeVisible();
    fireEvent.press(action);
    expect(mockOpenSettings).toHaveBeenCalledTimes(1);
    expect(mockOpenSettings).toHaveBeenCalledWith();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('en inglés el aviso y la acción se pintan en inglés', async () => {
    mockUseNotificationsBlocked.mockReturnValue(true);
    await renderProfile();
    const toggle = await screen.findByTestId('language-toggle');
    expect(toggle).toBeVisible();
    fireEvent.press(toggle);
    await waitFor(() => expect(screen.getByTestId('notifications-blocked-notice').children[0]).toHaveTextContent(
      'Notifications are turned off. Turn them on in your phone settings to receive alerts and reminders.',
    ));
    expect(screen.getByTestId('notifications-open-settings')).toHaveTextContent('Open settings');
  });

  it('registra las dos claves en los dos idiomas y en la tabla de idioma', () => {
    const english = en as Record<string, string>;
    const spanish = es as Record<string, string>;
    expect(english['profile.notificationsBlocked']).toBe('Notifications are turned off. Turn them on in your phone settings to receive alerts and reminders.');
    expect(english['profile.openSettings']).toBe('Open settings');
    expect(spanish['profile.notificationsBlocked']).toBe(NOTICE_ES);
    expect(spanish['profile.openSettings']).toBe('Abrir configuración');
    const design = readFileSync('../specs/mobile-ui-language/design.md', 'utf8');
    expect(design).toMatch(/\| — \| `profile\.notificationsBlocked`[^\n]*← añadida por #99 \(R3\)/);
    expect(design).toMatch(/\| — \| `profile\.openSettings`[^\n]*← añadida por #99 \(R3\)/);
  });

  it('sin bloqueo no hay aviso en Perfil', async () => {
    mockUseNotificationsBlocked.mockReturnValue(false);
    await renderProfile();
    expect(await screen.findByTestId('profile-sign-out')).toBeVisible();
    expect(mockUseNotificationsBlocked).toHaveBeenCalled();
    expect(screen.queryByTestId('notifications-blocked-notice')).toBeNull();
    expect(screen.queryByTestId('notifications-open-settings')).toBeNull();
    expect(screen.queryByText(NOTICE_ES)).toBeNull();
    expect(screen.queryByText('Abrir configuración')).toBeNull();
  });
});

describe('#41 R9: Perfil enlaza a las zonas seguras de la mascota activa', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockGetMe.mockReturnValue(pending<MeState>());
    const pet = makePet();
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
  });

  it('pinta la fila de zonas seguras tras la de GPS y abre la ruta de la mascota activa', async () => {
    await renderProfile();
    const link = await screen.findByTestId('geofences-link');
    expect(link).toHaveTextContent('Zonas seguras');
    expect(link.props.accessibilityRole).toBe('button');
    expect(link.props.hitSlop).toEqual({ top: 6, bottom: 6, left: 6, right: 6 });
    expect(link.props.className).toBe('flex-1 gap-1.5 rounded-tile p-3 bg-category-amber');
    expect(link).toHaveStyle({ borderCurve: 'continuous' });
    expect(within(link).getByText('Zonas seguras').props.className).toBe('text-sm font-extrabold text-category-amber-strong');
    expect(screen.getAllByTestId(/-link$/).map((row) => row.props.testID)).toEqual([
      'documents-link', 'pairing-link', 'geofences-link', 'reminders-link',
    ]);
    await fireEvent.press(link);
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/pets/pet-1/geofences');
  });
});

function profileChild(node: TestInstance, index: number): TestInstance {
  const child = node.children[index];
  if (typeof child === 'string') throw new Error('Expected an element child');
  return child;
}

function setupProfile168() {
  jest.clearAllMocks();
  process.env.EXPO_PUBLIC_API_URL = apiUrl;
  mockUseAuth.mockReturnValue({
    status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
  } satisfies AuthContextValue);
  mockUseFocusEffect.mockReset();
  mockUseNotificationsBlocked.mockReturnValue(false);
  mockGetMe.mockReturnValue(pending<MeState>());
  mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
}

const PROFILE_BRANCHES_168 = [
  { name: 'mascotas pendientes', pets: pending<PetsState>(), detail: pending<PetState>(), hero: true, branch: 'pet-hero-skeleton' },
  { name: 'sin mascotas', pets: { kind: 'ok', pets: [] } as PetsState, detail: pending<PetState>(), hero: false, branch: 'profile-pets-empty' },
  { name: 'error de mascotas', pets: { kind: 'error' } as PetsState, detail: pending<PetState>(), hero: false, branch: 'profile-pets-error' },
  { name: 'detalle pendiente', pets: { kind: 'ok', pets: [makePet()] } as PetsState, detail: pending<PetState>(), hero: true, branch: 'pet-hero-skeleton' },
  { name: 'error de detalle', pets: { kind: 'ok', pets: [makePet()] } as PetsState, detail: { kind: 'error' } as PetState, hero: true, branch: 'profile-pet-error' },
  { name: 'detalle cargado', pets: { kind: 'ok', pets: [makePet()] } as PetsState, detail: { kind: 'ok', pet: makePet() } as PetState, hero: true, branch: 'pet-info-card' },
];

describe('#168 R1: Perfil pinta el título grande en todas sus ramas', () => {
  beforeEach(setupProfile168);

  it.each(PROFILE_BRANCHES_168)('pinta el título grande ($name) (enmendado por #197 R4) (enmendado por #196 R2)', async ({ name, pets, detail, branch, hero }) => {
    mockListPets.mockImplementation(async () => pets);
    mockGetPet.mockImplementation(async () => detail);
    await renderProfile();
    if (name === 'detalle pendiente') await screen.findByTestId('pet-chip-pet-1');
    await screen.findByTestId(branch);
    const title = screen.getByTestId('profile-title');
    expect(title.props.className).toBe(hero ? 'text-3xl font-black tracking-title text-accent-foreground' : 'text-3xl font-black tracking-title text-foreground');
    expect(title).toHaveTextContent('Perfil');
    expect(profileChild(title.parent!, 0)).toBe(title);
    expect(profileChild(title.parent!.parent!, 0)).toBe(title.parent);
  });
});

describe('#168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara', () => {
  beforeEach(setupProfile168);

  it('ordena la tarjeta en avatar, nombre y chips (enmendado por #196 R1)', async () => {
    await renderProfile();
    const card = await screen.findByTestId('profile-pet-card');
    const scope = within(card);
    expect(card.props.className).toBe('min-w-0 flex-1 gap-2.5 px-1');
    expect(card.children).toHaveLength(2);
    expect(card.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['profile-pet-name', 'profile-pet-chips']);
    const name = scope.getByTestId('profile-pet-name');
    expect(profileChild(card, 0)).toBe(name);
    expect(name.props.className).toBe('text-3xl font-black leading-8.5 tracking-display text-foreground');
    expect(name).toHaveTextContent('Luna');
    expect(profileChild(card, 1)).toBe(scope.getByTestId('profile-pet-chips'));
  });

  it('con foto pinta el avatar circular de 96 con su cacheKey (enmendado por #196 R1)', async () => {
    await renderProfile();
    await screen.findByTestId('pet-info-card');
    const avatar = screen.getByTestId('pet-hero-media', { includeHiddenElements: true });
    expect(avatar.props.source).toEqual([{ uri: 'http://example.test/luna.jpg', cacheKey: 'pet-1' }]);
    expect(avatar.props.style).toEqual({ width: '100%', height: 430 });
  });

  it('sin foto pinta el blobatar de 96 sin source (enmendado por #196 R1)', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ photoUrl: null }) });
    await renderProfile();
    await screen.findByTestId('pet-info-card');
    const avatar = screen.getByTestId('pet-hero-media', { includeHiddenElements: true });
    expect(avatar.props.source).toBeUndefined();
    expect(avatar.props.xml).toContain('<svg');
    expect(avatar.props.width).toBe('100%');
    expect(avatar.props.height).toBe(430);
  });

  it('superpone la cámara en el anillo con su tamaño, tinta y objetivo táctil (enmendado por #196 R4)', async () => {
    await renderProfile();
    await screen.findByTestId('profile-pet-card');
    const pop = screen.getByTestId('profile-change-photo-pop');
    expect(pop.parent).toBe(screen.getByTestId('profile-hero'));
    const camera = within(pop).getByTestId('change-photo');
    const { result } = await renderHook(() => useChunkyLip());
    expect(camera.props.style).toEqual(result.current.primary);
    expect(camera.props.className).toBe('size-11 items-center justify-center rounded-full border-3 border-background bg-accent');
    expect(camera.props.accessibilityRole).toBe('button');
    expect(camera.props.accessibilityLabel).toBe('Cambiar foto');
    expect(camera.props.hitSlop).toEqual(TOUCH_SLOP);
    expect(camera.props.variant).toBeUndefined();
    expect(camera.children).toHaveLength(1);
    const glyph = within(camera).getByTestId('profile-icon-camera');
    expect(profileChild(camera, 0)).toBe(glyph);
    expect(glyph.props.size).toBe(18);
    expect(glyph.props.strokeWidth).toBe(2.4);
    expect(glyph.props.style).toEqual({ color: 'accent-foreground' });
  });

  it('con la subida fallida deja photo-upload-error inmediatamente tras la entrada del hero (enmendado por #196 R4)', async () => {
    mockLaunchImageLibrary.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///luna.webp', mimeType: 'image/webp' } as never],
    });
    mockRequestPhotoUploadUrl.mockResolvedValue({ kind: 'error' });
    await renderProfile();
    await waitFor(() => expect(screen.getByTestId('change-photo')).toBeOnTheScreen());

    await fireEvent.press(screen.getByTestId('change-photo'));

    const error = await screen.findByTestId('photo-upload-error');
    const card = screen.getByTestId('profile-pet-card');
    const block = screen.getByTestId('profile-entrance-info');
    const content = screen.getByTestId('profile-content');
    expect(error.parent).toBe(content);
    expect(profileChild(content, content.children.indexOf(block) - 1)).toBe(error);
    expect(within(block).queryByTestId('photo-upload-error')).toBeNull();
    expect(within(card).queryByTestId('photo-upload-error')).toBeNull();
  });

  it('expone la cámara habilitada en reposo', async () => {
    await renderProfile();
    await screen.findByTestId('profile-pet-card');

    expect(screen.getByTestId('change-photo').props.accessibilityState).toEqual({ disabled: false });
    expect(screen.getByTestId('change-photo').props.accessibilityLabel).toBe('Cambiar foto');
  });

  it('expone la cámara deshabilitada mientras la subida está en curso', async () => {
    let finish!: (value: { kind: 'error' }) => void;
    const requested = new Promise<{ kind: 'error' }>((resolve) => { finish = resolve; });
    mockLaunchImageLibrary.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///luna.webp', mimeType: 'image/webp' } as never],
    });
    mockRequestPhotoUploadUrl.mockReturnValue(requested);
    await renderProfile();
    await screen.findByTestId('profile-pet-card');

    await fireEvent.press(screen.getByTestId('change-photo'));

    await waitFor(() => expect(screen.getByTestId('change-photo').props.accessibilityState).toEqual({ disabled: true }));
    await act(async () => { finish({ kind: 'error' }); });
    await screen.findByTestId('photo-upload-error');
  });

  it('monta el hero compartido a sangre (enmendado por #196 R1)', async () => {
    await renderProfile();
    await screen.findByTestId('pet-info-card');
    expect(screen.getByTestId('pet-hero').parent).toBe(screen.getByTestId('profile-hero'));
  });

  it('reserva h-52 mientras carga el detalle (enmendado por #196 R1)', async () => {
    mockGetPet.mockReturnValue(pending<PetState>());
    await renderProfile();
    const skeleton = await screen.findByTestId('pet-hero-skeleton');
    expect(within(screen.getByTestId('profile-hero')).getByTestId('pet-hero-skeleton')).toBe(skeleton);
  });
});

function expectProfileChip168(root: TestInstance, id: string, surface: string, ink: string, text: string) {
  const chip = within(root).getByTestId(id);
  expect(chip.props.className).toBe(surface);
  expect(chip.children).toHaveLength(1);
  const label = within(chip).getByText(text);
  expect(profileChild(chip, 0)).toBe(label);
  expect(label.props.className).toBe(ink);
}

describe('#168 R5 (enmendado por #173 R7): chips pastel con sexo localizado', () => {
  beforeEach(() => {
    setupProfile168();
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ ageMonths: 26, currentWeightKg: 12.4 }) });
  });

  it('ordena los cuatro chips con el hueco y texto de su dato', async () => {
    await renderProfile();
    const root = await screen.findByTestId('profile-pet-chips');
    expect(root.children).toHaveLength(4);
    expect(root.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['profile-pet-chip-sex', 'profile-pet-chip-sterilized', 'profile-pet-chip-age', 'profile-pet-chip-weight']);
    expectProfileChip168(root, 'profile-pet-chip-sex', 'rounded-full px-2.5 py-1.25 bg-category-blue', 'text-xs font-extrabold text-category-blue-strong', 'Hembra');
    expectProfileChip168(root, 'profile-pet-chip-sterilized', 'rounded-full px-2.5 py-1.25 bg-category-green', 'text-xs font-extrabold text-category-green-strong', 'Esterilizado');
    expectProfileChip168(root, 'profile-pet-chip-age', 'rounded-full px-2.5 py-1.25 bg-category-amber', 'text-xs font-extrabold text-category-amber-strong', '26 meses');
    expectProfileChip168(root, 'profile-pet-chip-weight', 'rounded-full px-2.5 py-1.25 bg-category-violet', 'text-xs font-extrabold text-category-violet-strong', '12.4 kg');
  });

  it('sin sexo ni esterilización conserva edad ámbar y peso violeta', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ sex: null, sterilized: null, ageMonths: 26, currentWeightKg: 12.4 }) });
    await renderProfile();
    const root = await screen.findByTestId('profile-pet-chips');
    expect(root.children).toHaveLength(2);
    expect(root.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['profile-pet-chip-age', 'profile-pet-chip-weight']);
    expectProfileChip168(root, 'profile-pet-chip-age', 'rounded-full px-2.5 py-1.25 bg-category-amber', 'text-xs font-extrabold text-category-amber-strong', '26 meses');
    expectProfileChip168(root, 'profile-pet-chip-weight', 'rounded-full px-2.5 py-1.25 bg-category-violet', 'text-xs font-extrabold text-category-violet-strong', '12.4 kg');
  });

  it('sin peso omite su chip y conserva sexo, esterilización y edad en sus huecos', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ ageMonths: 26, currentWeightKg: null }) });
    await renderProfile();
    const root = await screen.findByTestId('profile-pet-chips');
    expect(root.children).toHaveLength(3);
    expect(root.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['profile-pet-chip-sex', 'profile-pet-chip-sterilized', 'profile-pet-chip-age']);
    expectProfileChip168(root, 'profile-pet-chip-sex', 'rounded-full px-2.5 py-1.25 bg-category-blue', 'text-xs font-extrabold text-category-blue-strong', 'Hembra');
    expectProfileChip168(root, 'profile-pet-chip-sterilized', 'rounded-full px-2.5 py-1.25 bg-category-green', 'text-xs font-extrabold text-category-green-strong', 'Esterilizado');
    expectProfileChip168(root, 'profile-pet-chip-age', 'rounded-full px-2.5 py-1.25 bg-category-amber', 'text-xs font-extrabold text-category-amber-strong', '26 meses');
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])('con la edad %p omite su chip y deja el peso en violeta', async (ageMonths) => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ ageMonths, currentWeightKg: 12.4 }) });
    await renderProfile();
    const root = await screen.findByTestId('profile-pet-chips');
    expect(root.children).toHaveLength(3);
    expect(root.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['profile-pet-chip-sex', 'profile-pet-chip-sterilized', 'profile-pet-chip-weight']);
    expectProfileChip168(root, 'profile-pet-chip-sex', 'rounded-full px-2.5 py-1.25 bg-category-blue', 'text-xs font-extrabold text-category-blue-strong', 'Hembra');
    expectProfileChip168(root, 'profile-pet-chip-sterilized', 'rounded-full px-2.5 py-1.25 bg-category-green', 'text-xs font-extrabold text-category-green-strong', 'Esterilizado');
    expectProfileChip168(root, 'profile-pet-chip-weight', 'rounded-full px-2.5 py-1.25 bg-category-violet', 'text-xs font-extrabold text-category-violet-strong', '12.4 kg');
  });

  it('sin esterilizar pinta el chip verde con «Sin esterilizar»', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ sterilized: false, ageMonths: 26, currentWeightKg: 12.4 }) });
    await renderProfile();
    const root = await screen.findByTestId('profile-pet-chips');
    expect(root.children).toHaveLength(4);
    expect(root.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['profile-pet-chip-sex', 'profile-pet-chip-sterilized', 'profile-pet-chip-age', 'profile-pet-chip-weight']);
    expectProfileChip168(root, 'profile-pet-chip-sterilized', 'rounded-full px-2.5 py-1.25 bg-category-green', 'text-xs font-extrabold text-category-green-strong', 'Sin esterilizar');
  });

  it('con 0 meses y 0 kg pinta los cuatro chips', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ ageMonths: 0, currentWeightKg: 0 }) });
    await renderProfile();
    const root = await screen.findByTestId('profile-pet-chips');
    expect(root.children).toHaveLength(4);
    expect(root.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['profile-pet-chip-sex', 'profile-pet-chip-sterilized', 'profile-pet-chip-age', 'profile-pet-chip-weight']);
    expectProfileChip168(root, 'profile-pet-chip-age', 'rounded-full px-2.5 py-1.25 bg-category-amber', 'text-xs font-extrabold text-category-amber-strong', '0 meses');
    expectProfileChip168(root, 'profile-pet-chip-weight', 'rounded-full px-2.5 py-1.25 bg-category-violet', 'text-xs font-extrabold text-category-violet-strong', '0 kg');
  });

  it('sin sexo conserva esterilización, edad y peso en sus huecos', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ sex: null, sterilized: true, ageMonths: 26, currentWeightKg: 12.4 }) });
    await renderProfile();
    const root = await screen.findByTestId('profile-pet-chips');
    expect(root.children).toHaveLength(3);
    expect(root.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['profile-pet-chip-sterilized', 'profile-pet-chip-age', 'profile-pet-chip-weight']);
    expectProfileChip168(root, 'profile-pet-chip-sterilized', 'rounded-full px-2.5 py-1.25 bg-category-green', 'text-xs font-extrabold text-category-green-strong', 'Esterilizado');
    expectProfileChip168(root, 'profile-pet-chip-age', 'rounded-full px-2.5 py-1.25 bg-category-amber', 'text-xs font-extrabold text-category-amber-strong', '26 meses');
    expectProfileChip168(root, 'profile-pet-chip-weight', 'rounded-full px-2.5 py-1.25 bg-category-violet', 'text-xs font-extrabold text-category-violet-strong', '12.4 kg');
  });

  it('sin esterilización conserva sexo, edad y peso en sus huecos', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ sex: 'female', sterilized: null, ageMonths: 26, currentWeightKg: 12.4 }) });
    await renderProfile();
    const root = await screen.findByTestId('profile-pet-chips');
    expect(root.children).toHaveLength(3);
    expect(root.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['profile-pet-chip-sex', 'profile-pet-chip-age', 'profile-pet-chip-weight']);
    expectProfileChip168(root, 'profile-pet-chip-sex', 'rounded-full px-2.5 py-1.25 bg-category-blue', 'text-xs font-extrabold text-category-blue-strong', 'Hembra');
    expectProfileChip168(root, 'profile-pet-chip-age', 'rounded-full px-2.5 py-1.25 bg-category-amber', 'text-xs font-extrabold text-category-amber-strong', '26 meses');
    expectProfileChip168(root, 'profile-pet-chip-weight', 'rounded-full px-2.5 py-1.25 bg-category-violet', 'text-xs font-extrabold text-category-violet-strong', '12.4 kg');
  });

  it('centra y agrupa los chips con gap-1.5 (enmendado por #196 R1)', async () => {
    await renderProfile();
    const root = await screen.findByTestId('profile-pet-chips');
    expect(root.props.className).toBe('flex-row flex-wrap gap-1.5');
  });

  it.each([
    { language: 'es', sex: 'male', label: 'Macho' },
    { language: 'es', sex: 'female', label: 'Hembra' },
    { language: 'es', sex: null, label: null },
    { language: 'es', sex: 'other', label: null },
    { language: 'en', sex: 'male', label: 'Male' },
    { language: 'en', sex: 'female', label: 'Female' },
    { language: 'en', sex: null, label: null },
    { language: 'en', sex: 'other', label: null },
  ])('localiza u omite el sexo $sex en $language', async ({ language, sex, label }) => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ sex }) });
    await renderProfile();
    const root = await screen.findByTestId('profile-pet-chips');
    if (language === 'en') await fireEvent.press(screen.getByTestId('language-toggle'));
    if (label === null) {
      expect(within(root).queryByTestId('profile-pet-chip-sex')).toBeNull();
      expect(root.children).toHaveLength(3);
      expect(root.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['profile-pet-chip-sterilized', 'profile-pet-chip-age', 'profile-pet-chip-weight']);
    } else {
      expectProfileChip168(root, 'profile-pet-chip-sex', 'rounded-full px-2.5 py-1.25 bg-category-blue', 'text-xs font-extrabold text-category-blue-strong', label);
    }
    expect(screen.queryByText('male')).toBeNull();
    expect(screen.queryByText('female')).toBeNull();
  });
});

describe('#168 R6 (enmendado por #173 R10): los accesos son tiles pastel en rejilla 2×2', () => {
  beforeEach(setupProfile168);

  it.each([
    ['documents-link', 'flex-1 gap-1.5 rounded-tile p-3 bg-category-blue', 'text-sm font-extrabold text-category-blue-strong', 'profile-icon-file-text', 'category-blue-strong', 'Documentos', '/pets/pet-1/docs'],
    ['pairing-link', 'flex-1 gap-1.5 rounded-tile p-3 bg-category-green', 'text-sm font-extrabold text-category-green-strong', 'profile-icon-wifi', 'category-green-strong', 'Collar GPS', '/pairing'],
    ['geofences-link', 'flex-1 gap-1.5 rounded-tile p-3 bg-category-amber', 'text-sm font-extrabold text-category-amber-strong', 'profile-icon-map', 'category-amber-strong', 'Zonas seguras', '/pets/pet-1/geofences'],
    ['reminders-link', 'flex-1 gap-1.5 rounded-tile p-3 bg-category-violet', 'text-sm font-extrabold text-category-violet-strong', 'profile-icon-bell', 'category-violet-strong', 'Recordatorios', '/reminders'],
  ])('pinta el tile y conserva el destino de %s', async (id, surface, ink, icon, color, label, destination) => {
    await renderProfile();
    await screen.findByTestId('pet-info-card');
    const row = screen.getByTestId(id);
    const scope = within(row);
    expect(row.children).toHaveLength(2);
    expect(row.props.className).toBe(surface);
    expect(row.props.accessibilityRole).toBe('button');
    expect(row.props.hitSlop).toEqual(TOUCH_SLOP);
    expect(row.props.style).toEqual({ borderCurve: 'continuous' });
    const tile = scope.getByTestId(`${id}-icon`, { includeHiddenElements: true });
    expect(profileChild(row, 0)).toBe(tile);
    expect(tile.props.accessibilityElementsHidden).toBe(true);
    expect(tile.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(tile.children).toHaveLength(1);
    const glyph = within(tile).getByTestId(icon, { includeHiddenElements: true });
    expect(profileChild(tile, 0)).toBe(glyph);
    expect(glyph.props.size).toBe(22);
    expect(glyph.props.style).toEqual({ color });
    const text = scope.getByText(label);
    expect(profileChild(row, 1)).toBe(text);
    expect(text.props.className).toBe(ink);
    await fireEvent.press(row);
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith(destination);
  });

  it('con mascota ordena dos filas de dos tiles', async () => {
    await renderProfile();
    await screen.findByTestId('pet-info-card');
    const grid = screen.getByTestId('profile-links');
    expect(grid.props.className).toBe('gap-2');
    expect(grid.children).toHaveLength(2);
    const first = profileChild(grid, 0);
    const second = profileChild(grid, 1);
    expect(first.props.testID).toBe('profile-links-row-0');
    expect(second.props.testID).toBe('profile-links-row-1');
    expect(first.props.className).toBe('flex-row gap-2');
    expect(second.props.className).toBe('flex-row gap-2');
    expect(first.children).toHaveLength(2);
    expect(second.children).toHaveLength(2);
    expect(first.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['documents-link', 'pairing-link']);
    expect(second.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['geofences-link', 'reminders-link']);
    expect(screen.queryAllByTestId(/-link-tile$/, { includeHiddenElements: true })).toHaveLength(0);
  });

  it('sin mascota deja recordatorios solo y a ancho completo', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    mockGetPet.mockReturnValue(pending<PetState>());
    await renderProfile();
    await screen.findByTestId('profile-pets-empty');
    const grid = screen.getByTestId('profile-links');
    expect(grid.props.className).toBe('gap-2');
    expect(grid.children).toHaveLength(1);
    const row = profileChild(grid, 0);
    expect(row.props.testID).toBe('profile-links-row-0');
    expect(row.props.className).toBe('flex-row gap-2');
    expect(row.children).toHaveLength(1);
    expect(profileChild(row, 0)).toBe(screen.getByTestId('reminders-link'));
    expect(profileChild(row, 0).props.className).toBe('flex-1 gap-1.5 rounded-tile p-3 bg-category-violet');
  });
});

describe('#173 R12: entrada escalonada', () => {
  beforeEach(setupProfile168);

  it('con mascota envuelve cuatro bloques con índices fijos (enmendado por #196 R1, R6)', async () => {
    await renderProfile();
    await screen.findByTestId('pet-info-card');
    expect(Object.fromEntries(mockHomeEntrance.mock.calls.map(([props]) => [props.testID, props.index]))).toEqual({
      'profile-entrance-info': 1,
      'profile-entrance-links': 2,
      'profile-entrance-account': 3,
      'profile-entrance-sign-out': 4,
    });
    for (const [id, child] of [
      ['profile-entrance-info', 'pet-info-card'],
      ['profile-entrance-links', 'profile-links'],
      ['profile-entrance-account', 'me-card'],
      ['profile-entrance-sign-out', 'profile-sign-out'],
    ]) {
      const entrance = screen.getByTestId(id);
      expect(entrance.children).toHaveLength(1);
      expect(profileChild(entrance, 0)).toBe(screen.getByTestId(child));
    }
  });

  it('sin mascota conserva los índices 2 y 3 para links y cuenta (enmendado por #196 R6)', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    mockGetPet.mockReturnValue(pending<PetState>());
    await renderProfile();
    await screen.findByTestId('profile-pets-empty');
    expect(Object.fromEntries(mockHomeEntrance.mock.calls.map(([props]) => [props.testID, props.index]))).toEqual({
      'profile-entrance-links': 2,
      'profile-entrance-account': 3,
      'profile-entrance-sign-out': 4,
    });
    expect(screen.queryByTestId('profile-entrance-hero')).toBeNull();
    expect(screen.queryByTestId('profile-entrance-info')).toBeNull();
    for (const [id, child] of [
      ['profile-entrance-links', 'profile-links'],
      ['profile-entrance-account', 'me-card'],
      ['profile-entrance-sign-out', 'profile-sign-out'],
    ]) {
      const entrance = screen.getByTestId(id);
      expect(entrance.children).toHaveLength(1);
      expect(profileChild(entrance, 0)).toBe(screen.getByTestId(child));
    }
  });
});

describe('#168 R7 (enmendado por #173 R11): la identidad de la cuenta toma las medidas del artboard', () => {
  beforeEach(setupProfile168);

  it.each([
    { firstName: 'Ana', lastName: 'García', initials: 'AG', name: 'Ana García' },
    { firstName: ' ana ', lastName: '', initials: 'A', name: ' ana  ' },
    { firstName: '', lastName: 'núñez', initials: 'N', name: ' núñez' },
    { firstName: 'élodie', lastName: 'ñúñez', initials: 'ÉÑ', name: 'élodie ñúñez' },
    { firstName: '', lastName: ' ', initials: null, name: '  ' },
  ])('pinta las iniciales de «$firstName» / «$lastName»', async ({ firstName, lastName, initials, name }) => {
    mockGetMe.mockResolvedValue({ kind: 'ok', me: {
      id: 'user-1', email: 'ana@example.test', firstName, lastName,
      phone: '+525500000000', country: 'MX', timezone: 'America/Mexico_City',
      createdAt: '2026-08-20T00:00:00.000Z', updatedAt: '2026-08-21T00:00:00.000Z',
    } });
    await renderProfile();
    await screen.findByText('ana@example.test');
    const identity = screen.getByTestId('me-identity');
    const scope = within(identity);
    expect(identity.props.className).toBe('flex-row items-center gap-2.5 py-2.5');
    expect(identity.children).toHaveLength(initials === null ? 1 : 2);
    const text = scope.getByTestId('me-identity-text');
    expect(text.props.className).toBe('flex-1');
    expect(text.children).toHaveLength(2);
    expect(profileChild(text, 0).props.children).toBe(name);
    expect(profileChild(text, 0).props.className).toBe('text-sm font-extrabold text-foreground');
    expect(profileChild(text, 1)).toBe(within(text).getByText('ana@example.test'));
    expect(profileChild(text, 1).props.className).toBe('text-xs font-normal text-muted');
    if (initials === null) {
      expect(profileChild(identity, 0)).toBe(text);
      expect(scope.queryByTestId('me-avatar', { includeHiddenElements: true })).toBeNull();
      expect(scope.queryByTestId('me-avatar-initials', { includeHiddenElements: true })).toBeNull();
    } else {
      const avatar = scope.getByTestId('me-avatar', { includeHiddenElements: true });
      expect(profileChild(identity, 0)).toBe(avatar);
      expect(profileChild(identity, 1)).toBe(text);
      expect(avatar.props.className).toBe('size-8.5 items-center justify-center rounded-full bg-default');
      expect(avatar.props.accessibilityElementsHidden).toBe(true);
      expect(avatar.props.importantForAccessibility).toBe('no-hide-descendants');
      expect(avatar.children).toHaveLength(1);
      const label = within(avatar).getByTestId('me-avatar-initials', { includeHiddenElements: true });
      expect(profileChild(avatar, 0)).toBe(label);
      expect(label.props.className).toBe('text-13 font-extrabold text-foreground');
      expect(label).toHaveTextContent(initials);
    }
  });

  it('reserva el alto de la identidad mientras carga la cuenta', async () => {
    await renderProfile();
    expect(screen.getByTestId('me-card-skeleton').props.className).toBe('skeleton__root my-2.5 h-9 w-full rounded-xl');
  });

  it('da padding vertical al estado de cuenta no disponible', async () => {
    mockGetMe.mockResolvedValue({ kind: 'error' });
    await renderProfile();
    const state = await screen.findByTestId('me-card-state');
    expect(state.props.className).toBe('py-2.5 font-normal text-muted');
  });
});

describe('Perfil: refetch de foco con selección vigente', () => {
  let selectedPetId: string | null;

  beforeEach(() => {
    setupProfile168();
    selectedPetId = null;
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    mockGetMe.mockResolvedValue({ kind: 'error' });
    const realUseSelectedPet = selectedPetHooks.useSelectedPet;
    jest.spyOn(selectedPetHooks, 'useSelectedPet').mockImplementation(() => ({
      ...realUseSelectedPet(), selectedPetId,
    }));
  });

  afterEach(() => jest.restoreAllMocks());

  describe('#193 R4: Perfil sin mascota no pide detalle al enfocar', () => {
    it('no llama a getPet durante el foco con selección nula', async () => {
      const { queryClient } = await renderProfile();
      await screen.findByTestId('profile-pets-empty');
      await waitFor(() => expect(queryClient.isFetching()).toBe(0));
      const before = mockGetPet.mock.calls.length;
      const focus = mockUseFocusEffect.mock.calls.at(-1)?.[0];
      expect(focus).toBeDefined();

      await act(async () => { focus?.(); });

      expect(mockGetPet.mock.calls.slice(before)).toEqual([]);
    });
  });

  describe('#193 R5: Perfil con mascota refresca el detalle al enfocar', () => {
    it('la callback original pide una vez el id seleccionado después del montaje', async () => {
      mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
      const view = await renderProfile();
      await screen.findByTestId('pet-chip-pet-1');
      await waitFor(() => expect(view.queryClient.isFetching()).toBe(0));
      const focus = mockUseFocusEffect.mock.calls.at(-1)?.[0];
      expect(focus).toBeDefined();
      selectedPetId = 'pet-1';
      await view.rerender(<ProfileScreen />);
      await waitFor(() => expect(screen.getByTestId('profile-pet-name')).toHaveTextContent('Luna'));
      await waitFor(() => expect(view.queryClient.isFetching()).toBe(0));
      const before = mockGetPet.mock.calls.length;

      await act(async () => { focus?.(); });

      expect(mockGetPet.mock.calls.slice(before)).toEqual([[apiUrl, 'jwt-token', 'pet-1']]);
    });
  });

  describe('#193 R6: Perfil sin mascota conserva el refetch de la lista', () => {
    it('llama una vez a listPets durante el foco', async () => {
      const { queryClient } = await renderProfile();
      await screen.findByTestId('profile-pets-empty');
      await waitFor(() => expect(queryClient.isFetching()).toBe(0));
      const before = mockListPets.mock.calls.length;
      const focus = mockUseFocusEffect.mock.calls.at(-1)?.[0];
      expect(focus).toBeDefined();

      await act(async () => { focus?.(); });

      expect(mockListPets.mock.calls.slice(before)).toEqual([[apiUrl, 'jwt-token']]);
    });
  });

  describe('#193 R10: Perfil conserva la identidad de su callback de foco', () => {
    it('mantiene la misma función al seleccionar y deseleccionar una mascota', async () => {
      mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
      const view = await renderProfile();
      await screen.findByTestId('pet-chip-pet-1');
      await waitFor(() => expect(view.queryClient.isFetching()).toBe(0));
      const focus = mockUseFocusEffect.mock.calls.at(-1)?.[0];
      expect(focus).toBeDefined();

      selectedPetId = 'pet-1';
      await view.rerender(<ProfileScreen />);
      await waitFor(() => expect(screen.getByTestId('profile-pet-name')).toHaveTextContent('Luna'));
      expect(Object.is(focus, mockUseFocusEffect.mock.calls.at(-1)?.[0])).toBe(true);

      selectedPetId = null;
      await view.rerender(<ProfileScreen />);
      await waitFor(() => expect(screen.getByTestId('selected-pet-id')).toHaveTextContent('none'));
      expect(Object.is(focus, mockUseFocusEffect.mock.calls.at(-1)?.[0])).toBe(true);
    });
  });
});

describe('#181 R1: profile sin mascotas no muestra errores de detalle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token',
      signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    mockGetPet.mockResolvedValue({ kind: 'error' });
    mockGetMe.mockResolvedValue({ kind: 'error' });
  });

  afterEach(() => jest.restoreAllMocks());

  it.each(['S1', 'S2', 'S3'] as const)('%s: conserva el vacío sin tarjeta ni reintento (enmendado por #196 R1)', async (scenario) => {
    if (scenario === 'S3') {
      const realUseSelectedPet = selectedPetHooks.useSelectedPet;
      jest.spyOn(selectedPetHooks, 'useSelectedPet').mockImplementation(() => ({
        ...realUseSelectedPet(), selectedPetId: 'pet-stale', clearPet: () => undefined,
      }));
    }
    const { queryClient } = await renderProfile();
    if (scenario === 'S2') {
      const focus = mockUseFocusEffect.mock.calls.at(-1)?.[0];
      expect(focus).toBeDefined();
      await act(async () => { focus?.(); });
    }
    await screen.findByTestId('profile-pets-empty');
    if (scenario === 'S1') {
      await act(async () => { selectPetFromTest?.('pet-stale'); });
      await waitFor(() => expect(screen.getByTestId('selected-pet-id')).toHaveTextContent('none'));
    }
    await screen.findByTestId('profile-pets-empty');
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(mockGetPet).not.toHaveBeenCalledWith(apiUrl, 'jwt-token', null);
    expect(screen.queryByTestId('profile-pet-error')).toBeNull();
    expect(screen.queryByTestId('profile-pet-retry')).toBeNull();
    expect(screen.queryByTestId('profile-hero')).toBeNull();
    expect(screen.queryByTestId('pet-hero-skeleton')).toBeNull();
    expect(screen.queryByTestId('pet-info-skeleton')).toBeNull();
  });

  it('S4: lista unreachable y selección nula ocultan la tarjeta', async () => {
    mockListPets.mockResolvedValue({ kind: 'unreachable', message: 'offline' });
    const { queryClient } = await renderProfile();
    const focus = mockUseFocusEffect.mock.calls.at(-1)?.[0];
    expect(focus).toBeDefined();
    await act(async () => { focus?.(); });
    await screen.findByTestId('profile-pets-error');
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(mockGetPet).not.toHaveBeenCalledWith(apiUrl, 'jwt-token', null);
    expect(screen.queryByTestId('profile-pet-error')).toBeNull();
    expect(screen.queryByTestId('profile-pet-retry')).toBeNull();
  });

  it('S5: lista vacía revalidando y detalle pendiente no muestran esqueletos (enmendado por #196 R1)', async () => {
    const { queryClient } = await renderProfile();
    await screen.findByTestId('profile-pets-empty');
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    mockListPets.mockReturnValue(pending<PetsState>());
    mockGetPet.mockReturnValue(pending<PetState>());
    await act(async () => {
      void queryClient.refetchQueries({ queryKey: petKeys.list() });
    });
    await waitFor(() => expect(queryClient.isFetching({ queryKey: petKeys.list() })).toBe(1));
    await act(async () => { selectPetFromTest?.('pet-stale'); });
    await waitFor(() => expect(mockGetPet).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-stale'));
    await screen.findByTestId('profile-pets-empty');
    expect(screen.queryByTestId('profile-hero')).toBeNull();
    expect(screen.queryByTestId('pet-hero-skeleton')).toBeNull();
    expect(screen.queryByTestId('pet-info-skeleton')).toBeNull();
  });
});

describe('#181 R5: Perfil conserva la cuenta y compone el vacío ilustrado', () => {
  beforeEach(() => {
    setupProfile168();
    mockGetMe.mockResolvedValue({ kind: 'error' });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    mockGetPet.mockResolvedValue({ kind: 'error' });
  });

  it('R5.1: conserva un único testID y muestra pose talk, copy y acción para añadir', async () => {
    await renderProfile();
    await screen.findByTestId('profile-pets-empty-title');
    expect(screen.getAllByTestId('profile-pets-empty')).toHaveLength(1);
    expect(screen.getByTestId('profile-pets-empty-title')).toHaveTextContent(es['common.noPetsYet']);
    expect(screen.getByTestId('profile-pets-empty-body')).toHaveTextContent(es['common.noPetsBody']);
    expect(screen.getByTestId('profile-pets-empty-pose').props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/pingo-talk\.webp$/) }),
    ]);
    const action = screen.getByTestId('profile-pets-empty-action');
    expect(within(action).getByText(es['profile.addPet'])).toBeVisible();
    expect(screen.getByTestId('profile-add-pet')).toBeVisible();
    await fireEvent.press(action);
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/pets/add');
  });

  it('R5.2 R5.3: centra en horizontal dentro del scroll y mantiene las acciones de cuenta (enmendado por #196 R1)', async () => {
    const { queryClient } = await renderProfile();
    const empty = await screen.findByTestId('profile-pets-empty-title');
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(empty.parent).toBe(screen.getByTestId('profile-pets-empty'));
    expect(empty.parent?.props.className).toBe('items-center gap-3 py-8');
    for (const id of ['screen-profile', 'profile-title', 'profile-add-pet', 'reminders-link', 'me-card', 'profile-sign-out']) {
      expect(screen.getByTestId(id)).toBeVisible();
    }
    for (const id of ['profile-pet-error', 'profile-pet-retry', 'pet-hero-skeleton', 'profile-hero', 'pet-info-skeleton']) {
      expect(screen.queryByTestId(id)).toBeNull();
    }
  });
});

describe('#184 R1: la cámara no responde mientras sube', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: mockSignOut,
    } satisfies AuthContextValue);
    mockSignOut.mockResolvedValue();
    mockGetMe.mockReturnValue(pending<MeState>());
    const pet = makePet({ photoUrl: 'http://example.test/old.jpg' });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
  });

  it('#184 R1: no responde a toques durante la subida', async () => {
    let finish!: (value: { kind: 'error' }) => void;
    const requested = new Promise<{ kind: 'error' }>((resolve) => { finish = resolve; });
    mockLaunchImageLibrary.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///luna.webp', mimeType: 'image/webp' } as never],
    });
    mockRequestPhotoUploadUrl.mockReturnValue(requested);
    await renderProfile();
    await screen.findByTestId('profile-pet-card');
    expect(screen.getByTestId('change-photo').props.onStartShouldSetResponder()).toBe(true);

    await fireEvent.press(screen.getByTestId('change-photo'));

    await waitFor(() => expect(screen.getByTestId('change-photo').props.accessibilityState).toEqual({ disabled: true }));
    expect(screen.getByTestId('change-photo').props.onStartShouldSetResponder()).toBe(false);
    await fireEvent.press(screen.getByTestId('change-photo'));
    expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(1);
    expect(mockRequestPhotoUploadUrl).toHaveBeenCalledTimes(1);
    await act(async () => { finish({ kind: 'error' }); });
    await screen.findByTestId('photo-upload-error');
    expect(screen.getByTestId('change-photo').props.onStartShouldSetResponder()).toBe(true);
  });
});

describe('#184 R4: cerrar sesión conserva su botón danger-soft', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: mockSignOut,
    } satisfies AuthContextValue);
    mockSignOut.mockResolvedValue();
    mockGetMe.mockReturnValue(pending<MeState>());
    const pet = makePet({ photoUrl: 'http://example.test/old.jpg' });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
  });

  it('#184 R4: conserva la variante y las clases (enmendado por #196 R6)', async () => {
    await renderProfile();
    await screen.findByTestId('profile-sign-out');

    expect(screen.getByTestId('profile-sign-out').props.className).toBe('pressable-feedback__root button__root button__root--variant-danger-soft button__root--size-md h-13 rounded-14 bg-category-rose');
  });
});

describe('#184 R2: handleChangePhoto ignora toques mientras hay uno en curso', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: mockSignOut,
    } satisfies AuthContextValue);
    mockSignOut.mockResolvedValue();
    mockGetMe.mockReturnValue(pending<MeState>());
    const pet = makePet({ photoUrl: 'http://example.test/old.jpg' });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [pet] });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('#184 R2: un segundo toque con el picker abierto no lanza otro picker', async () => {
    mockLaunchImageLibrary.mockReturnValue(pending<ImagePicker.ImagePickerResult>());
    await renderProfile();
    await screen.findByTestId('profile-pet-card');

    await fireEvent.press(screen.getByTestId('change-photo'));
    await fireEvent.press(screen.getByTestId('change-photo'));

    expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(1);
  });

  it.each([
    'picker cancelado',
    'formato no soportado',
    'URL denegada',
    'sesión caducada',
    'subida rechazada',
    'excepción al leer el asset',
    'subida correcta',
  ])('#184 R2: libera la guardia tras %s (enmendado por #196 R1)', async (salida) => {
    mockLaunchImageLibrary.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///luna.webp', mimeType: 'image/webp' } as never],
    });
    mockRequestPhotoUploadUrl.mockResolvedValue({
      kind: 'ok',
      uploadUrl: 'http://localstack.test/upload',
      expiresInSeconds: 600,
    });
    mockUploadPhotoToUrl.mockResolvedValue({ kind: 'ok' });

    switch (salida) {
      case 'picker cancelado':
        mockLaunchImageLibrary.mockResolvedValue({ canceled: true, assets: null });
        break;
      case 'formato no soportado':
        mockLaunchImageLibrary.mockResolvedValue({
          canceled: false,
          assets: [{ uri: 'file:///luna.gif', mimeType: 'image/gif' } as never],
        });
        break;
      case 'URL denegada':
        mockRequestPhotoUploadUrl.mockResolvedValue({ kind: 'error' });
        break;
      case 'sesión caducada':
        mockRequestPhotoUploadUrl.mockResolvedValue({ kind: 'unauthorized' });
        break;
      case 'subida rechazada':
      case 'subida correcta':
        globalThis.fetch = jest.fn().mockResolvedValue({
          blob: jest.fn().mockResolvedValue(new Blob(['x'], { type: 'image/webp' })),
        });
        if (salida === 'subida rechazada') {
          mockUploadPhotoToUrl.mockResolvedValue({ kind: 'error' });
        } else {
          mockGetPet
            .mockResolvedValueOnce({ kind: 'ok', pet: makePet({ photoUrl: 'http://example.test/old.jpg' }) })
            .mockResolvedValue({ kind: 'ok', pet: makePet({ photoUrl: 'http://example.test/new.jpg' }) });
        }
        break;
      case 'excepción al leer el asset':
        globalThis.fetch = jest.fn().mockRejectedValue(new Error('boom'));
        break;
    }

    await renderProfile();
    await screen.findByTestId('profile-pet-card');

    await fireEvent.press(screen.getByTestId('change-photo'));

    if (salida === 'subida correcta') {
      await waitFor(() => expect(screen.getByTestId('pet-hero-media', { includeHiddenElements: true }).props.source).toEqual([
        { uri: 'http://example.test/new.jpg', cacheKey: 'pet-1' },
      ]));
      expect(mockGetPet).toHaveBeenCalledTimes(2);
    } else if (salida !== 'picker cancelado' && salida !== 'sesión caducada') {
      expect(await screen.findByTestId('photo-upload-error')).toBeVisible();
    }
    if (salida !== 'picker cancelado') {
      await waitFor(() => expect(screen.getByTestId('change-photo').props.accessibilityState).toEqual({ disabled: false }));
    }
    if (salida === 'sesión caducada') {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    }

    await fireEvent.press(screen.getByTestId('change-photo'));

    expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(2);
  });
});


describe('#194 R9: profile links to the editor and observes saved changes', () => {
  const account: MeState = { kind: 'ok', me: {
    id: 'user-1', email: 'ada@example.test', firstName: 'Ada', lastName: 'Lovelace',
    phone: '+525500000000', country: 'MX', timezone: 'America/Mexico_City',
    createdAt: '2026-08-20T00:00:00.000Z', updatedAt: '2026-08-21T00:00:00.000Z',
  } };
  beforeEach(setupProfile168);

  it('#194 R9: opens the editor from the account row', async () => {
    mockGetMe.mockResolvedValue(account);
    await renderProfile();
    await screen.findByTestId('me-identity');
    await fireEvent.press(screen.getByTestId('language-toggle'));
    const link = await screen.findByTestId('edit-profile-link');
    expect(await within(link).findByText('Edit profile')).toBeVisible();
    expect(link).toHaveProp('accessibilityRole', 'button');
    await fireEvent.press(link);
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/edit-profile');
  });

  it('#194 R9: hides editing while the account is pending or unavailable', async () => {
    for (const kind of ['pending', 'error', 'unauthorized'] as const) {
      if (kind === 'pending') mockGetMe.mockReturnValue(pending<MeState>());
      else mockGetMe.mockResolvedValue({ kind });
      const app = await renderProfile();
      if (kind === 'pending') await screen.findByTestId('me-card-skeleton');
      else if (kind === 'error') await screen.findByTestId('me-card-state');
      else await waitFor(() => expect(screen.getByTestId('me-card').children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual(['theme-row', 'language-toggle']));
      expect(screen.queryByTestId('edit-profile-link')).toBeNull();
      await app.unmount();
    }
  });

  it('#194 R9: shows cache updates without another profile request', async () => {
    const { queryClient } = await renderProfile();
    await act(() => queryClient.setQueryData(userKeys.me(), account));
    expect(within(await screen.findByTestId('me-identity-text')).getByText('Ada Lovelace')).toBeVisible();
    const requests = mockGetMe.mock.calls.length;
    const updated = { ...account.me, firstName: 'Grace', lastName: 'Hopper' };
    await act(() => queryClient.setQueryData(userKeys.me(), { kind: 'ok', me: updated }));
    await waitFor(() => expect(within(screen.getByTestId('me-identity-text')).getByText('Grace Hopper')).toBeVisible());
    expect(within(screen.getByTestId('me-identity-text')).queryByText('Ada Lovelace')).toBeNull();
    expect(mockGetMe).toHaveBeenCalledTimes(requests);
  });
});


describe('#196 R1: hero a sangre y contenido por rama', () => {
  beforeEach(setupProfile168);

  it.each(PROFILE_BRANCHES_168)('#196 R1: en la rama $name monta el hero = $hero', async ({ name, pets, detail, branch, hero }) => {
    mockListPets.mockImplementation(async () => pets);
    mockGetPet.mockImplementation(async () => detail);
    await renderProfile();
    if (name === 'detalle pendiente') await screen.findByTestId('pet-chip-pet-1');
    await screen.findByTestId(branch);
    const scroll = screen.getByTestId('screen-profile');
    const scrollContent = profileChild(scroll, 0);
    const content = screen.getByTestId('profile-content');
    expect(scroll.props.contentContainerStyle).toEqual({ gap: 14, paddingBottom: 120 });
    expect(content.props.className).toBe('gap-3.5 px-5');
    expect(profileChild(scrollContent, scrollContent.children.length - 1)).toBe(content);
    expect(content.props.style).toEqual(hero ? undefined : { paddingTop: 52 });
    if (hero) {
      const header = screen.getByTestId('profile-hero');
      expect(profileChild(scrollContent, 0)).toBe(header);
      expect(header.props.className).toBe('relative');
      const shared = screen.getByTestId('pet-hero');
      expect(profileChild(header, 0)).toBe(shared);
      expect(shared.props.className).toBe('overflow-hidden bg-default');
      expect(screen.getByTestId('pet-hero-frame').props.style).toEqual({ height: 430 });
      if (branch === 'pet-info-card') {
        expect(screen.getByTestId('pet-hero-media', { includeHiddenElements: true }).props.source).toEqual([{ uri: 'http://example.test/luna.jpg', cacheKey: 'pet-1' }]);
        expect(screen.queryByTestId('pet-hero-skeleton')).toBeNull();
      } else {
        expect(screen.getByTestId('pet-hero-skeleton')).toBeOnTheScreen();
        expect(screen.queryByTestId('pet-hero-media', { includeHiddenElements: true })).toBeNull();
      }
    } else {
      expect(screen.queryByTestId('profile-hero')).toBeNull();
      expect(screen.queryByTestId('pet-hero')).toBeNull();
      expect(profileChild(content, 0)).toBe(screen.getByTestId('profile-title').parent);
    }
  });

  it('#196 R1: pinta nombre y chips dentro del pie del hero', async () => {
    await renderProfile();
    const footer = await screen.findByTestId('profile-pet-card');
    expect(footer.parent).toBe(screen.getByTestId('pet-hero-caption'));
    expect(footer.props.className).toBe('min-w-0 flex-1 gap-2.5 px-1');
    expect(footer.children).toHaveLength(2);
    const name = screen.getByTestId('profile-pet-name');
    expect(profileChild(footer, 0)).toBe(name);
    expect(name.props.className).toBe('text-3xl font-black leading-8.5 tracking-display text-foreground');
    expect(name).toHaveTextContent('Luna');
    const chips = screen.getByTestId('profile-pet-chips');
    expect(profileChild(footer, 1)).toBe(chips);
    expect(chips.props.className).toBe('flex-row flex-wrap gap-1.5');
  });
});

describe('#196 R4: cámara flotante sobre la foto', () => {
  beforeEach(setupProfile168);

  it('#196 R4: con el detalle cargado monta la cámara con labio sobre la foto', async () => {
    await renderProfile();
    await screen.findByTestId('profile-pet-card');
    const hero = screen.getByTestId('profile-hero');
    const pop = screen.getByTestId('profile-change-photo-pop');
    expect(profileChild(hero, 1)).toBe(pop);
    expect(pop.props.className).toBe('absolute bottom-24 right-5');
    const camera = screen.getByTestId('change-photo');
    expect(profileChild(pop, 0)).toBe(camera);
    expect(camera.props.className).toBe('size-11 items-center justify-center rounded-full border-3 border-background bg-accent');
    const { result } = await renderHook(() => useChunkyLip());
    expect(camera.props.style).toEqual(result.current.primary);
    expect(camera.props.accessibilityRole).toBe('button');
    expect(camera.props.accessibilityLabel).toBe('Cambiar foto');
    expect(camera.props.hitSlop).toEqual(TOUCH_SLOP);
    expect(camera.props.accessibilityState).toEqual({ disabled: false });
    const glyph = within(camera).getByTestId('profile-icon-camera');
    expect(glyph.props.size).toBe(18);
    expect(glyph.props.strokeWidth).toBe(2.4);
    expect(glyph.props.style).toEqual({ color: 'accent-foreground' });
  });

  it.each(PROFILE_BRANCHES_168.filter(({ name }) => ['detalle pendiente', 'error de detalle'].includes(name)))('#196 R4: sin detalle cargado ($name) no monta la cámara', async ({ pets, detail, branch }) => {
    mockListPets.mockImplementation(async () => pets);
    mockGetPet.mockImplementation(async () => detail);
    await renderProfile();
    await screen.findByTestId(branch === 'pet-hero-skeleton' ? 'pet-chip-pet-1' : branch);
    expect(screen.queryByTestId('profile-change-photo-pop')).toBeNull();
    expect(screen.queryByTestId('change-photo')).toBeNull();
  });

  it('#196 R4: con la subida fallida pinta el error justo antes de la info', async () => {
    mockLaunchImageLibrary.mockResolvedValue({ canceled: false, assets: [{ uri: 'file:///luna.webp', mimeType: 'image/webp' } as never] });
    mockRequestPhotoUploadUrl.mockResolvedValue({ kind: 'error' });
    await renderProfile();
    await screen.findByTestId('change-photo');
    await fireEvent.press(screen.getByTestId('change-photo'));
    const error = await screen.findByTestId('photo-upload-error');
    const content = screen.getByTestId('profile-content');
    expect(error).toHaveTextContent(es['profile.couldNotUploadPhoto']);
    expect(error.parent).toBe(content);
    expect(profileChild(content, content.children.indexOf(error) + 1)).toBe(screen.getByTestId('profile-entrance-info'));
  });
});


describe('#196 R2: título y selector en el slot fotográfico', () => {
  beforeEach(setupProfile168);

  it('#196 R2: con hero pinta título blanco, píldora de vidrio y selector glass en el slot', async () => {
    await renderProfile();
    await screen.findByTestId('profile-pet-card');
    const top = screen.getByTestId('profile-hero-top');
    expect(top.parent).toBe(screen.getByTestId('pet-hero-slot'));
    expect(top.props.className).toBe('gap-3 px-1');
    expect(top.children).toHaveLength(2);
    const row = profileChild(top, 0);
    expect(row.props.className).toBe('flex-row items-center justify-between gap-3');
    expect(profileChild(row, 0)).toBe(screen.getByTestId('profile-title'));
    expect(screen.getByTestId('profile-title').props.className).toBe('text-3xl font-black tracking-title text-accent-foreground');
    expect(screen.getByTestId('profile-title')).toHaveTextContent('Perfil');
    const capsule = screen.getByTestId('profile-add-pet');
    expect(profileChild(row, 1)).toBe(capsule);
    expect(capsule.props.className).toBe('h-11 flex-row items-center gap-1.5 rounded-full bg-glass-surface-strong px-4');
    expect(profileChild(top, 1)).toBe(screen.getByTestId('pet-chip-pet-1').parent);
    const props = mockPetSwitcher.mock.lastCall?.[0];
    expect(props?.variant).toBe('glass');
    expect(props?.trailing).toBeUndefined();
    expect(props?.pets.map(({ id }) => id)).toEqual(['pet-1']);
    expect(props?.selectedPetId).toBe('pet-1');
    await fireEvent.press(capsule);
    expect(mockRouter.push).toHaveBeenCalledWith('/pets/add');
  });

  it('#196 R2: con la lista pendiente el slot no monta el selector', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());
    await renderProfile();
    const top = await screen.findByTestId('profile-hero-top');
    expect(top.parent).toBe(screen.getByTestId('pet-hero-slot'));
    expect(top.children).toHaveLength(1);
    expect(screen.getByTestId('profile-title')).toHaveTextContent('Perfil');
    expect(mockPetSwitcher).not.toHaveBeenCalled();
  });

  it.each([
    { name: 'vacía', pets: { kind: 'ok', pets: [] } as PetsState, branch: 'profile-pets-empty' },
    { name: 'error de lista', pets: { kind: 'error' } as PetsState, branch: 'profile-pets-error' },
  ])('#196 R2: sin hero ($name) pinta la fila clara al principio del contenido', async ({ pets, branch }) => {
    mockListPets.mockResolvedValue(pets);
    await renderProfile();
    await screen.findByTestId(branch);
    const content = screen.getByTestId('profile-content');
    const row = profileChild(content, 0);
    expect(row.props.className).toBe('flex-row items-center justify-between gap-3');
    expect(profileChild(row, 0)).toBe(screen.getByTestId('profile-title'));
    expect(screen.getByTestId('profile-title').props.className).toBe('text-3xl font-black tracking-title text-foreground');
    const capsule = screen.getByTestId('profile-add-pet');
    expect(profileChild(row, 1)).toBe(capsule);
    expect(capsule.props.className).toBe('h-9 flex-row items-center gap-1.5 rounded-full bg-tab-pill px-3.5');
    expect(screen.queryByTestId('profile-hero-top')).toBeNull();
    expect(mockPetSwitcher).not.toHaveBeenCalled();
  });

  it.each([true, false])('#196 R2: el icono de añadir usa trazo 2.6 en las dos ramas (hero = %s)', async (hero) => {
    if (!hero) mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderProfile();
    await screen.findByTestId(hero ? 'profile-pet-card' : 'profile-pets-empty');
    const capsule = screen.getByTestId('profile-add-pet');
    const icon = within(capsule).getByTestId('profile-add-pet-icon', { includeHiddenElements: true });
    const glyph = within(icon).getByTestId('profile-icon-plus', { includeHiddenElements: true });
    expect(glyph.props.size).toBe(16);
    expect(glyph.props.strokeWidth).toBe(2.6);
    expect(glyph.props.style).toEqual({ color: 'accent-strong' });
    expect(within(capsule).getByText('Añadir mascota').props.className).toBe('text-sm font-extrabold text-accent-strong');
  });
});

describe('#196 R5: aviso ámbar de notificaciones bloqueadas', () => {
  beforeEach(() => {
    setupProfile168();
    mockUseNotificationsBlocked.mockReturnValue(true);
    mockOpenSettings.mockResolvedValue(undefined);
  });
  afterEach(() => mockUseNotificationsBlocked.mockReturnValue(false));

  it('#196 R5: con el permiso bloqueado y hero el aviso ámbar abre el contenido', async () => {
    await renderProfile();
    await screen.findByTestId('profile-pet-card');
    const content = screen.getByTestId('profile-content');
    const entrance = screen.getByTestId('profile-entrance-notice');
    expect(profileChild(content, 0)).toBe(entrance);
    expect(entrance.props.index).toBe(0);
    expect(entrance.children).toHaveLength(1);
    const notice = screen.getByTestId('notifications-blocked-notice');
    expect(profileChild(entrance, 0)).toBe(notice);
    expect(notice.props.className).toBe('items-start gap-3 rounded-card p-3.5 bg-category-amber');
    expect(notice.children).toHaveLength(2);
    expect(profileChild(notice, 0)).toHaveTextContent(NOTICE_ES);
    expect(profileChild(notice, 0).props.className).toBe('text-sm leading-note font-normal text-foreground');
    expect(profileChild(notice, 1)).toBe(screen.getByTestId('notifications-open-settings'));
  });

  it('#196 R5: con el permiso bloqueado y sin hero el aviso va tras el título', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderProfile();
    await screen.findByTestId('profile-pets-empty');
    const content = screen.getByTestId('profile-content');
    expect(profileChild(content, 0)).toBe(screen.getByTestId('profile-title').parent);
    expect(profileChild(content, 1)).toBe(screen.getByTestId('profile-entrance-notice'));
    expect(profileChild(screen.getByTestId('profile-entrance-notice'), 0)).toBe(screen.getByTestId('notifications-blocked-notice'));
  });

  it('#196 R5: el CTA del aviso lleva labio primario y abre la configuración', async () => {
    const { result } = await renderHook(() => useChunkyLip());
    await renderProfile();
    const notice = await screen.findByTestId('notifications-blocked-notice');
    const action = within(notice).getByTestId('notifications-open-settings');
    expect(action.props.className).toBe('pressable-feedback__root button__root button__root--variant-primary button__root--size-md h-11 rounded-14 px-4.5');
    expect(action.props.style).toContainEqual(result.current.primary);
    expect(within(action).getByText('Abrir configuración').props.className).toBe('button__label button__label--variant-primary button__label--size-md text-sm font-extrabold text-accent-foreground');
    await fireEvent.press(action);
    expect(mockOpenSettings).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('#196 R5: con el permiso concedido no pinta el aviso', async () => {
    mockUseNotificationsBlocked.mockReturnValue(false);
    await renderProfile();
    await screen.findByTestId('profile-pet-card');
    expect(screen.queryByTestId('profile-entrance-notice')).toBeNull();
    expect(screen.queryByTestId('notifications-blocked-notice')).toBeNull();
  });
});


describe('#196 R6: cerrar sesión como el artboard de cuenta', () => {
  beforeEach(() => {
    setupProfile168();
    mockSignOut.mockResolvedValue();
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: mockSignOut } satisfies AuthContextValue);
  });

  it('#196 R6: Cerrar sesión pinta la píldora rosa de 52 con texto de 15', async () => {
    await renderProfile();
    const button = await screen.findByTestId('profile-sign-out');
    const content = screen.getByTestId('profile-content');
    const entrance = screen.getByTestId('profile-entrance-sign-out');
    expect(profileChild(content, content.children.length - 1)).toBe(entrance);
    expect(entrance.props.index).toBe(4);
    expect(entrance.children).toHaveLength(1);
    expect(profileChild(entrance, 0)).toBe(button);
    expect(button.props.className).toBe('pressable-feedback__root button__root button__root--variant-danger-soft button__root--size-md h-13 rounded-14 bg-category-rose');
    const label = within(button).getByText('Cerrar sesión');
    const contentChildren = button.children.filter((child) => typeof child !== 'string' && child.props.pointerEvents !== 'none');
    expect(contentChildren).toEqual([label]);
    expect(label.props.className).toBe('text-15 font-extrabold text-danger');
    expect(label.props.className).not.toContain('button__label');
    expect(JSON.stringify(button.props.style ?? [])).not.toContain('boxShadow');
  });

  it('#196 R6: Cerrar sesión llama a signOut una vez', async () => {
    await renderProfile();
    const button = await screen.findByTestId('profile-sign-out');
    await fireEvent.press(button);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});


describe('#196 R7: interruptor de tema compartido', () => {
  beforeEach(() => {
    setupProfile168();
    mockTheme = 'light';
    mockSetStoredTheme.mockResolvedValue();
  });

  it('#196 R7: el tema usa ToggleSwitch con pulgar', async () => {
    await renderProfile();
    const toggle = await screen.findByTestId('theme-toggle');
    expect(toggle.props.accessibilityLabel).toBe('Usar tema oscuro');
    expect(toggle.props.hitSlop).toEqual(TOUCH_SLOP);
    expect(screen.getByTestId('theme-toggle-thumb', { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it.each([['light', 'dark'], ['dark', 'light']] as const)('#196 R7: con tema $0 el interruptor pide $1', async (theme, next) => {
    mockTheme = theme;
    await renderProfile();
    const toggle = await screen.findByTestId('theme-toggle');
    await fireEvent.press(toggle);
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith(next);
    expect(mockSetStoredTheme).toHaveBeenCalledWith(next);
  });
});
