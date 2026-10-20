import { HeaderHeightContext } from 'expo-router/react-navigation';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { notificationAsync } from 'expo-haptics';
import { HeroUINativeProvider } from 'heroui-native';
import * as ImagePicker from 'expo-image-picker';
import { DeviceEventEmitter, Platform } from 'react-native';

import { requestPhotoUploadUrl, uploadPhotoToUrl } from '../../api/media';
import { createPet, listPets, type PetsState } from '../../api/pets';
import { petKeys } from '../../api/query-keys';
import { es } from '../../i18n/catalog';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { AddPetScreen } from '.';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { renderWithProviders } from '../../../test/render-with-providers';

jest.mock('../../api/pets', () => ({ createPet: jest.fn(), listPets: jest.fn() }));
jest.mock('../../api/media', () => ({
  ...jest.requireActual('../../api/media'),
  requestPhotoUploadUrl: jest.fn(),
  uploadPhotoToUrl: jest.fn(),
}));
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));
jest.mock('../../providers/auth-provider', () => ({ useAuth: jest.fn() }));
jest.mock('../../providers/selected-pet-provider', () => ({
  useSelectedPet: jest.fn(),
}));
jest.mock('../../components/pet-avatar', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    PetAvatar: (props: Record<string, unknown>) => React.createElement(View, props),
  };
});
jest.mock('expo-router', () => ({
  router: { back: jest.fn(), replace: jest.fn() },
}));
jest.mock('@expo/ui', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    Host: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(View, { ...props, testID: 'expo-ui-picker-host' }, children as never),
  };
});
jest.mock('@expo/ui/community/datetime-picker', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return function MockDateTimePicker(props: Record<string, unknown>) {
    return React.createElement(View, props);
  };
});
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const mockCreatePet = jest.mocked(createPet);
const mockListPets = jest.mocked(listPets);
const mockNotificationAsync = jest.mocked(notificationAsync);
const mockLaunchImageLibrary = jest.mocked(ImagePicker.launchImageLibraryAsync);
const mockRequestPhotoUploadUrl = jest.mocked(requestPhotoUploadUrl);
const mockUploadPhotoToUrl = jest.mocked(uploadPhotoToUrl);
const mockUseAuth = jest.mocked(useAuth);
const mockUseSelectedPet = jest.mocked(useSelectedPet);
const mockRouter = jest.mocked(router);
const selectPet = jest.fn();

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

async function renderAddPet(language: 'en' | 'es' = 'es') {
  return renderWithProviders(
    <HeroUINativeProvider>
      <LanguageProvider initial={language}>
        <HeaderHeightContext.Provider value={91}>
          <AddPetScreen />
        </HeaderHeightContext.Provider>
      </LanguageProvider>
    </HeroUINativeProvider>,
  );
}

async function pressPickPhoto(): Promise<void> {
  if (mockLaunchImageLibrary.getMockImplementation() === undefined) {
    throw new Error(
      'PICKER_MOCK_UNARMED: launchImageLibraryAsync must be rearmed by the root beforeEach in add-pet/index.test.tsx',
    );
  }
  await fireEvent.press(screen.getByTestId('add-pet-photo'));
}

beforeEach(() => {
  mockLaunchImageLibrary.mockReset();
  mockLaunchImageLibrary.mockResolvedValue({ canceled: true, assets: null });
  mockListPets.mockReset();
  mockListPets.mockResolvedValue({ kind: 'ok', pets: [{ id: 'pet-1', name: 'Milo' } as never] });
});

describe('R6: alta de mascota', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockUseSelectedPet.mockReturnValue({ selectedPetId: 'pet-1', selectPet, clearPet: jest.fn(), });
    mockCreatePet.mockReturnValue(pending());
  });

  it('renders the complete two-section form and deterministic preview', async () => {
    await renderAddPet();

    expect(screen.getByTestId('screen-add-pet')).toBeVisible();
    expect(screen.getByText('Datos básicos')).toBeVisible();
    expect(screen.getByText('Datos médicos')).toBeVisible();
    expect(screen.getByTestId('species-dog').props.accessibilityState).toEqual({ selected: true });
    expect(screen.getByTestId('species-cat')).toBeVisible();
    expect(screen.getByTestId('name-input')).toBeVisible();
    expect(screen.getByTestId('breed-input')).toBeVisible();
    expect(screen.getByTestId('sex-female')).toBeVisible();
    expect(screen.getByTestId('size-large')).toBeVisible();
    expect(screen.getByTestId('sterilized-true')).toBeVisible();
    expect(screen.getByTestId('microchip-input')).toBeVisible();
    expect(screen.getByTestId('pet-avatar').props.name).toBe('Mascota');
  });

  it('#191 R5: Tipo, Sexo y Tamaño usan el selector', async () => {
    await renderAddPet();
    expect(screen.getByTestId('species-dog').props.accessibilityState).toEqual({ selected: true });
    for (const id of ['sex-female', 'sex-male', 'size-small', 'size-medium', 'size-large']) {
      expect(screen.getByTestId(id).props.accessibilityState).toEqual({ selected: false });
      expect(screen.getByTestId(id).parent!.props.className).toBe('flex-row gap-1 rounded-14 bg-default p-1');
    }
    await fireEvent.press(screen.getByTestId('species-dog'));
    expect(screen.getByTestId('species-dog').props.accessibilityState).toEqual({ selected: true });
    for (const id of ['sex-male', 'size-medium']) {
      await fireEvent.press(screen.getByTestId(id));
      expect(screen.getByTestId(id).props.accessibilityState).toEqual({ selected: true });
      await fireEvent.press(screen.getByTestId(id));
      expect(screen.getByTestId(id).props.accessibilityState).toEqual({ selected: false });
    }
  });

  it('uses Host + community DateTimePicker and keeps exactly birthDate', async () => {
    mockCreatePet.mockResolvedValue({
      kind: 'ok',
      pet: { id: 'pet-new', name: 'Nala' } as never,
    });
    await renderAddPet();
    await fireEvent.changeText(screen.getByTestId('name-input'), '  Nala  ');
    await fireEvent.press(screen.getByTestId('birth-date-field'));

    const picker = within(screen.getByTestId('expo-ui-picker-host')).getByTestId('birth-date-picker');
    const selectedDate = new Date(2024, 3, 9, 12);
    await fireEvent(picker, 'onValueChange', {}, selectedDate);
    await fireEvent.press(screen.getByTestId('add-pet-submit'));

    await waitFor(() => expect(mockCreatePet).toHaveBeenCalledWith(
      'http://example.test/v1',
      'jwt-token',
      { name: 'Nala', species: 'dog', birthDate: '2024-04-09' },
    ));
    expect(selectPet).toHaveBeenCalledWith('pet-new');
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('posts selected fields, numeric months, and omits blank optionals', async () => {
    mockCreatePet.mockResolvedValue({
      kind: 'ok',
      pet: { id: 'pet-new', name: 'Milo' } as never,
    });
    await renderAddPet();
    await fireEvent.press(screen.getByTestId('species-cat'));
    await fireEvent.changeText(screen.getByTestId('name-input'), ' Milo ');
    await fireEvent.changeText(screen.getByTestId('breed-input'), '   ');
    await fireEvent.press(screen.getByTestId('sex-male'));
    await fireEvent.press(screen.getByTestId('size-small'));
    await fireEvent.press(screen.getByTestId('sterilized-false'));
    await fireEvent.changeText(screen.getByTestId('microchip-input'), ' CHIP-9 ');
    await fireEvent.press(screen.getByTestId('age-mode-months'));
    await fireEvent.changeText(screen.getByTestId('approx-age-input'), '15');
    await fireEvent.press(screen.getByTestId('add-pet-submit'));

    await waitFor(() => expect(mockCreatePet).toHaveBeenCalledWith(
      'http://example.test/v1',
      'jwt-token',
      {
        name: 'Milo',
        species: 'cat',
        approxAgeMonths: 15,
        sex: 'male',
        size: 'small',
        sterilized: false,
        microchip: 'CHIP-9',
      },
    ));
  });

  it('#186 R4: nombre vacío muestra su mensaje sin bloquear el botón ni llamar a la API', async () => {
    await renderAddPet();
    await fireEvent.press(screen.getByTestId('add-pet-submit'));
    await waitFor(() => expect(screen.queryByTestId('name-input-message')).toHaveTextContent('El nombre es obligatorio'));
    expect(screen.queryByTestId('add-pet-error')).toBeNull();
    expect(screen.getByTestId('add-pet-submit')).not.toBeDisabled();
    expect(mockCreatePet).not.toHaveBeenCalled();
  });

  it('disables submit while posting and preserves fields after an error', async () => {
    mockCreatePet.mockReturnValueOnce(pending());
    await renderAddPet();
    await fireEvent.changeText(screen.getByTestId('name-input'), 'Luna');
    await fireEvent.press(screen.getByTestId('age-mode-months'));
    await fireEvent.changeText(screen.getByTestId('approx-age-input'), '12');
    await fireEvent.press(screen.getByTestId('add-pet-submit'));

    await waitFor(() => expect(screen.getByTestId('add-pet-submit').props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true }),
    ));
    expect(screen.getByTestId('name-input').props.value).toBe('Luna');
    expect(screen.getByTestId('approx-age-input').props.value).toBe('12');
  });

  it('#186 R4: el 400 conserva el aviso de formulario y los valores sin mensajes de campo', async () => {
    mockCreatePet.mockResolvedValue({ kind: 'invalid' });
    await renderAddPet();
    await fireEvent.changeText(screen.getByTestId('name-input'), 'Luna');
    await fireEvent.press(screen.getByTestId('age-mode-months'));
    await fireEvent.changeText(screen.getByTestId('approx-age-input'), '12');
    await fireEvent.press(screen.getByTestId('add-pet-submit'));

    await waitFor(() => expect(screen.queryByTestId('add-pet-error')).toHaveTextContent('Revisa los datos de la mascota'));
    expect(screen.queryAllByTestId(/-message-row$/)).toHaveLength(0);
    expect(screen.getByTestId('name-input').props.value).toBe('Luna');
    expect(screen.getByTestId('approx-age-input').props.value).toBe('12');
  });
  it.each([
    ['birthDate', 'birth-date-field', 'Elige una fecha de nacimiento'],
    ['months', 'approx-age-input', 'Introduce una edad de 0 a 480 meses'],
  ] as const)('#186 R4: edad en modo %s muestra el mensaje de %s', async (mode, base, message) => {
    await renderAddPet();
    await fireEvent.changeText(screen.getByTestId('name-input'), 'Luna');
    if (mode === 'months') {
      await fireEvent.press(screen.getByTestId('age-mode-months'));
      await fireEvent.changeText(screen.getByTestId('approx-age-input'), '500');
    }
    await fireEvent.press(screen.getByTestId('add-pet-submit'));
    await waitFor(() => expect(screen.queryByTestId(`${base}-message`)).toHaveTextContent(message));
    expect(screen.queryByTestId('add-pet-error')).toBeNull();
    expect(mockCreatePet).not.toHaveBeenCalled();
  });

  it('#186 R4: nombre y fecha inválidos muestran las dos filas a la vez', async () => {
    await renderAddPet();
    await fireEvent.press(screen.getByTestId('add-pet-submit'));
    await waitFor(() => expect(screen.queryByTestId('name-input-message')).toHaveTextContent('El nombre es obligatorio'));
    expect(screen.queryByTestId('name-input-message-row')).not.toBeNull();
    expect(screen.queryByTestId('birth-date-field-message-row')).not.toBeNull();
    expect(mockCreatePet).not.toHaveBeenCalled();
  });

  it('#186 R4: corregir conserva el mensaje hasta reenviar y luego manda el mismo payload', async () => {
    await renderAddPet();
    await fireEvent.press(screen.getByTestId('age-mode-months'));
    await fireEvent.changeText(screen.getByTestId('approx-age-input'), '12');
    await fireEvent.press(screen.getByTestId('add-pet-submit'));
    await waitFor(() => expect(screen.queryByTestId('name-input-message')).toHaveTextContent('El nombre es obligatorio'));
    await fireEvent.changeText(screen.getByTestId('name-input'), ' Luna ');
    expect(screen.queryByTestId('name-input-message')).toHaveTextContent('El nombre es obligatorio');
    await fireEvent.press(screen.getByTestId('add-pet-submit'));
    await waitFor(() => expect(screen.getByTestId('add-pet-submit')).toBeDisabled());
    expect(screen.queryAllByTestId(/-message-row$/)).toHaveLength(0);
    expect(mockCreatePet).toHaveBeenCalledTimes(1);
    expect(mockCreatePet).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token', {
      name: 'Luna', species: 'dog', approxAgeMonths: 12,
    });
  });

  it.each(['birthDate', 'months'] as const)('#186 R4: modo %s no pinta el mensaje del modo inactivo', async (mode) => {
    await renderAddPet();
    if (mode === 'months') {
      await fireEvent.press(screen.getByTestId('age-mode-months'));
      await fireEvent.changeText(screen.getByTestId('approx-age-input'), '12');
    }
    await fireEvent.press(screen.getByTestId('add-pet-submit'));
    await waitFor(() => expect(screen.queryByTestId('name-input-message')).toHaveTextContent('El nombre es obligatorio'));
    expect(screen.queryByTestId(mode === 'months' ? 'birth-date-field-message' : 'approx-age-input-message')).toBeNull();
  });

  it.each([
    ['name-input', 'El nombre es obligatorio'],
    ['birth-date-field', 'Elige una fecha de nacimiento'],
    ['approx-age-input', 'Introduce una edad de 0 a 480 meses'],
  ])('#186 R4: el mensaje de %s es el último hermano del control', async (base, message) => {
    await renderAddPet();
    if (base === 'approx-age-input') {
      await fireEvent.press(screen.getByTestId('age-mode-months'));
      await fireEvent.changeText(screen.getByTestId('approx-age-input'), '500');
    }
    await fireEvent.press(screen.getByTestId('add-pet-submit'));
    await waitFor(() => expect(screen.queryByTestId(`${base}-message`)).toHaveTextContent(message));
    const control = screen.getByTestId(base);
    const wrapper = control.parent!;
    expect(wrapper.props.className).toBe('gap-2');
    expect(within(wrapper).queryByTestId(`${base}-message`)).toHaveTextContent(message);
    expect(wrapper.children[wrapper.children.length - 1]).toBe(screen.getByTestId(`${base}-error`));
    expect(within(control).queryByTestId(`${base}-message`)).toBeNull();
  });

  it('#186 R4: conserva maxLength 120 120 32 y 3', async () => {
    await renderAddPet();
    expect(screen.getByTestId('name-input').props.maxLength).toBe(120);
    expect(screen.getByTestId('breed-input').props.maxLength).toBe(120);
    expect(screen.getByTestId('microchip-input').props.maxLength).toBe(32);
    await fireEvent.press(screen.getByTestId('age-mode-months'));
    expect(screen.getByTestId('approx-age-input').props.maxLength).toBe(3);
  });

  it('#186 R4: el mensaje del nombre se traduce al inglés', async () => {
    await renderAddPet('en');
    await fireEvent.press(screen.getByTestId('add-pet-submit'));
    await waitFor(() => expect(screen.queryByTestId('name-input-message')).toHaveTextContent('Name is required'));
  });

});

describe('R7: foto opcional tras alta', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockUseSelectedPet.mockReturnValue({ selectedPetId: null, selectPet, clearPet: jest.fn(), });
  });

  it('uploads a chosen preview only after createPet succeeds', async () => {
    const body = new Blob(['photo'], { type: 'image/jpeg' });
    mockLaunchImageLibrary.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///new-pet.jpg', mimeType: 'image/jpeg' } as never],
    });
    mockCreatePet.mockResolvedValue({
      kind: 'ok',
      pet: { id: 'pet-new', name: 'Nala' } as never,
    });
    mockRequestPhotoUploadUrl.mockResolvedValue({
      kind: 'ok',
      uploadUrl: 'http://localstack.test/new-pet',
      expiresInSeconds: 600,
    });
    mockUploadPhotoToUrl.mockResolvedValue({ kind: 'ok' });
    globalThis.fetch = jest.fn().mockResolvedValue({
      blob: jest.fn().mockResolvedValue(body),
    }) as unknown as typeof fetch;
    await renderAddPet();

    await pressPickPhoto();
    await waitFor(() =>
      expect(screen.getByTestId('pet-avatar').props.photoUrl).toBe(
        'file:///new-pet.jpg',
      ),
    );
    await fireEvent.changeText(screen.getByTestId('name-input'), 'Nala');
    await fireEvent.press(screen.getByTestId('age-mode-months'));
    await fireEvent.changeText(screen.getByTestId('approx-age-input'), '8');
    await fireEvent.press(screen.getByTestId('add-pet-submit'));

    await waitFor(() => expect(mockCreatePet).toHaveBeenCalled());
    expect(mockRequestPhotoUploadUrl).toHaveBeenCalledWith(
      'http://example.test/v1',
      'jwt-token',
      'pet-new',
      'image/jpeg',
    );
    expect(mockUploadPhotoToUrl).toHaveBeenCalledWith(
      'http://localstack.test/new-pet',
      body,
      'image/jpeg',
    );
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});

describe('R1 (mobile-jest-mock-hygiene): el mock del picker se reinicializa por test', () => {
  it('uses a canceled default without inheriting another test', async () => {
    await expect(mockLaunchImageLibrary()).resolves.toEqual({
      canceled: true,
      assets: null,
    });
    expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(1);
  });
});

describe('#72 R4: el fallo del picker nombra el invariante roto', () => {
  it('#72 R4: falla con PICKER_MOCK_UNARMED si el mock está desarmado', async () => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockUseSelectedPet.mockReturnValue({ selectedPetId: null, selectPet, clearPet: jest.fn(), });
    mockCreatePet.mockReturnValue(pending());
    await renderAddPet();
    mockLaunchImageLibrary.mockReset();

    await expect(pressPickPhoto()).rejects.toThrow(/PICKER_MOCK_UNARMED/);
  });
});

describe('#90 R6: birthDate manda el día civil local del picker, no el UTC', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-17T23:30:00Z'));
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockUseSelectedPet.mockReturnValue({ selectedPetId: 'pet-1', selectPet, clearPet: jest.fn(), });
    mockCreatePet.mockReturnValue(pending());
  });

  afterEach(() => jest.useRealTimers());

  it('envía los getters locales aunque los getters UTC estén en el día siguiente', async () => {
    mockCreatePet.mockResolvedValue({
      kind: 'ok',
      pet: { id: 'pet-new', name: 'Nala' } as never,
    });
    const birthDate = Object.assign(new Date(2026, 8, 17, 23, 30), {
      getUTCFullYear: () => 2026,
      getUTCMonth: () => 8,
      getUTCDate: () => 18,
    });

    await renderAddPet();
    await fireEvent.changeText(screen.getByTestId('name-input'), 'Nala');
    await fireEvent.press(screen.getByTestId('birth-date-field'));
    const picker = within(
      screen.getByTestId('expo-ui-picker-host'),
    ).getByTestId('birth-date-picker');
    await fireEvent(picker, 'onValueChange', {}, birthDate);
    await fireEvent.press(screen.getByTestId('add-pet-submit'));

    await waitFor(() =>
      expect(mockCreatePet).toHaveBeenCalledWith(
        'http://example.test/v1',
        'jwt-token',
        expect.objectContaining({ birthDate: '2026-09-17' }),
      ),
    );
  });
});

describe('#61 R10: los controles táctiles declaran TOUCH_SLOP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockUseSelectedPet.mockReturnValue({ selectedPetId: 'pet-1', selectPet, clearPet: jest.fn(), });
    mockCreatePet.mockReturnValue(pending());
  });

  it.each([
    'species-dog',
    'sex-female',
    'size-small',
    'sterilized-true',
    'age-mode-date',
  ])('%s llega a 44 pt sin crecer a la vista', async (testID) => {
    await renderAddPet();

    await waitFor(() => expect(screen.getByTestId(testID)).toBeVisible());

    expect(screen.getByTestId(testID).props.hitSlop).toEqual(TOUCH_SLOP);
  });
});

describe('#62 R11: los selectores de especie usan la receta segmentada (enmendado por #191 R5)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockUseSelectedPet.mockReturnValue({ selectedPetId: 'pet-1', selectPet, clearPet: jest.fn(), });
    mockCreatePet.mockReturnValue(pending());
  });

  it.each([
    ['species-dog', 'Perro'],
    ['species-cat', 'Gato'],
  ])('%s coincide con los demás chips del formulario', async (testID, label) => {
    await renderAddPet();

    const chip = screen.getByTestId(testID);

    expect(chip.props.className).toBe('h-9.5 flex-1 items-center justify-center rounded-10' + (testID === 'species-dog' ? ' bg-surface shadow-sm' : ''));
    expect(chip.props.className).not.toContain('px-4');
    expect(within(chip).getByText(label).props.className).toBe(
      testID === 'species-dog' ? 'text-sm font-extrabold text-accent-strong' : 'text-sm font-extrabold text-muted',
    );
    expect(chip.props.hitSlop).toEqual(TOUCH_SLOP);
  });
});

describe('#62 R12: el placeholder del formulario sale del tema', () => {
  const muted = '#667085';
  const themeColors = jest.requireActual<
    typeof import('../../theme/use-theme-colors')
  >('../../theme/use-theme-colors');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(themeColors, 'useThemeColors').mockImplementation(
      ((tokens: readonly string[]) =>
        tokens.map((token) => (token === 'muted' ? muted : '#0D1117'))) as typeof themeColors.useThemeColors,
    );
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockUseSelectedPet.mockReturnValue({ selectedPetId: 'pet-1', selectPet, clearPet: jest.fn(), });
    mockCreatePet.mockReturnValue(pending());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('usa muted en los cuatro TextInput con placeholder', async () => {
    await renderAddPet();

    for (const testID of ['name-input', 'breed-input', 'microchip-input']) {
      expect(screen.getByTestId(testID).props.placeholderTextColor).toBe(muted);
    }

    await fireEvent.press(screen.getByTestId('age-mode-months'));

    expect(screen.getByTestId('approx-age-input').props.placeholderTextColor).toBe(
      muted,
    );
  });
});

describe('#95 R5: la pantalla no dibuja cabecera propia', () => {
  it('retira el botón y el título del cuerpo', async () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() });
    mockUseSelectedPet.mockReturnValue({ selectedPetId: 'pet-1', selectPet, clearPet: jest.fn(), });
    await renderAddPet();
    expect(screen.queryByTestId('add-pet-back')).toBeNull();
    expect(screen.queryByText(es['addPet.addPet'])).toBeNull();
  });
});

describe('#95 R6: métricas bajo cabecera nativa', () => {
  it('usa solo el inset inferior del dispositivo', async () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() });
    mockUseSelectedPet.mockReturnValue({ selectedPetId: 'pet-1', selectPet, clearPet: jest.fn(), });
    await renderAddPet();
    expect(screen.getByTestId('add-pet-form').props.contentContainerStyle).toEqual({
      padding: 24, gap: 16, paddingBottom: 48,
    });
  });
});

const originalPlatform = Platform.OS;

function setPlatform(os: string): void {
  Object.defineProperty(Platform, 'OS', { configurable: true, value: os });
}

function wallClock(local: number[], utc: number[]): Date {
  return Object.assign(new Date(local[0], local[1], local[2], local[3], local[4]), {
    getUTCFullYear: () => utc[0],
    getUTCMonth: () => utc[1],
    getUTCDate: () => utc[2],
  });
}

describe('#123: picker de nacimiento de Añadir mascota en Android a las 20:00 del 24 de septiembre', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 24, 20, 0));
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockUseSelectedPet.mockReturnValue({ selectedPetId: 'pet-1', selectPet, clearPet: jest.fn(), });
    mockCreatePet.mockResolvedValue({ kind: 'ok', pet: { id: 'pet-new', name: 'Nala' } as never });
    setPlatform('android');
  });

  afterEach(() => {
    setPlatform(originalPlatform);
    jest.useRealTimers();
  });

  describe('#123 R6: Añadir mascota muestra y manda el día de nacimiento elegido', () => {
    it.each([
      ['elegir hoy (24 de septiembre de 2026) manda 2026-09-24', [2026, 8, 23, 18, 0], [2026, 8, 24], '24/9/2026', '2026-09-24'],
      ['elegir el 1 de octubre de 2025 manda 2025-10-01 (cruce de mes)', [2025, 8, 30, 18, 0], [2025, 9, 1], '1/10/2025', '2025-10-01'],
      ['elegir el 1 de enero de 2026 manda 2026-01-01 (cruce de año)', [2025, 11, 31, 18, 0], [2026, 0, 1], '1/1/2026', '2026-01-01'],
    ] as [string, number[], number[], string, string][])('%s', async (_title, local, utc, etiqueta, birthDate) => {
      await renderAddPet();
      await fireEvent.changeText(screen.getByTestId('name-input'), 'Nala');
      await fireEvent.press(screen.getByTestId('birth-date-field'));
      const picker = within(screen.getByTestId('expo-ui-picker-host')).getByTestId('birth-date-picker');
      await fireEvent(picker, 'onValueChange', {}, wallClock(local, utc));
      expect(within(screen.getByTestId('birth-date-field')).getByText(etiqueta)).toBeVisible();
      await fireEvent.press(screen.getByTestId('add-pet-submit'));
      await waitFor(() => expect(mockCreatePet).toHaveBeenCalledWith(
        'http://example.test/v1',
        'jwt-token',
        { name: 'Nala', species: 'dog', birthDate },
      ));
    });
  });

  describe('#123 R7: el calendario de nacimiento abre en el día local y el máximo no se convierte', () => {
    it('abre en el 24, con el máximo en el instante actual', async () => {
      await renderAddPet();
      await fireEvent.press(screen.getByTestId('birth-date-field'));
      const picker = within(screen.getByTestId('expo-ui-picker-host')).getByTestId('birth-date-picker');
      expect((picker.props.value as Date).toISOString()).toBe('2026-09-24T00:00:00.000Z');
      expect((picker.props.maximumDate as Date).getTime()).toBe(new Date(2026, 8, 24, 20, 0).getTime());
    });
  });
});

describe('#148 R4: add-pet se aparta del teclado en Android', () => {
  afterEach(() => {
    setPlatform(originalPlatform);
  });

  it('el host screen-add-pet añade paddingBottom 291 al abrir el teclado', async () => {
    setPlatform('android');
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockUseSelectedPet.mockReturnValue({ selectedPetId: 'pet-1', selectPet, clearPet: jest.fn(), });
    await renderAddPet();

    const host = screen.getByTestId('screen-add-pet');
    expect(host).toHaveStyle({ paddingBottom: 0 });
    await fireEvent(host, 'layout', {
      persist() {},
      nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 700 } },
    });
    await act(async () => {
      DeviceEventEmitter.emit('keyboardDidShow', {
        startCoordinates: { screenX: 0, screenY: 800, width: 400, height: 0 },
        endCoordinates: { screenX: 0, screenY: 500, width: 400, height: 300 },
        duration: 0, easing: 'keyboard', isEventFromThisApp: true,
      });
    });
    await waitFor(() => expect(screen.getByTestId('screen-add-pet')).toHaveStyle({ paddingBottom: 291 }));
  });
});

describe('#148 R8: add-pet entrega el primer toque con el teclado abierto', () => {
  it('el scroll add-pet-form declara keyboardShouldPersistTaps handled', async () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockUseSelectedPet.mockReturnValue({ selectedPetId: 'pet-1', selectPet, clearPet: jest.fn(), });
    await renderAddPet();

    expect(screen.getByTestId('add-pet-form').props.keyboardShouldPersistTaps).toBe('handled');
  });
});


jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(() => Promise.resolve()),
  NotificationFeedbackType: { Success: 'mock-success', Error: 'mock-error' },
}));

// #171 R4: la lista debe llegar a la caché antes de guardar.
async function renderWithPetList(state: PetsState) {
  mockListPets.mockResolvedValue(state);
  const { queryClient } = await renderAddPet();
  await waitFor(() => expect(queryClient.getQueryData(petKeys.list())).toEqual(state));
}

async function saveNala() {
  await fireEvent.press(screen.getByTestId('species-cat'));
  await fireEvent.changeText(screen.getByTestId('name-input'), ' Nala ');
  await fireEvent.changeText(screen.getByTestId('breed-input'), '   ');
  await fireEvent.press(screen.getByTestId('sex-male'));
  await fireEvent.press(screen.getByTestId('size-small'));
  await fireEvent.press(screen.getByTestId('sterilized-false'));
  await fireEvent.changeText(screen.getByTestId('microchip-input'), ' CHIP-9 ');
  await fireEvent.press(screen.getByTestId('age-mode-months'));
  await fireEvent.changeText(screen.getByTestId('approx-age-input'), '15');
  await fireEvent.press(screen.getByTestId('add-pet-submit'));
}

function armNalaPhoto() {
  const body = new Blob(['photo'], { type: 'image/jpeg' });
  mockLaunchImageLibrary.mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'file:///new-pet.jpg', mimeType: 'image/jpeg' } as never],
  });
  mockRequestPhotoUploadUrl.mockResolvedValue({
    kind: 'ok', uploadUrl: 'http://localstack.test/new-pet', expiresInSeconds: 600,
  });
  mockUploadPhotoToUrl.mockResolvedValue({ kind: 'ok' });
  globalThis.fetch = jest.fn().mockResolvedValue({
    blob: jest.fn().mockResolvedValue(body),
  }) as unknown as typeof fetch;
}

async function saveNalaWithPhoto() {
  await pressPickPhoto();
  await waitFor(() => expect(screen.getByTestId('pet-avatar').props.photoUrl).toBe('file:///new-pet.jpg'));
  await fireEvent.changeText(screen.getByTestId('name-input'), 'Nala');
  await fireEvent.press(screen.getByTestId('age-mode-months'));
  await fireEvent.changeText(screen.getByTestId('approx-age-input'), '8');
  await fireEvent.press(screen.getByTestId('add-pet-submit'));
}

async function expectReturnWithoutCelebration() {
  await waitFor(() => expect(screen.getByTestId('add-pet-submit')).not.toBeDisabled());
  expect(mockRouter.back).toHaveBeenCalledTimes(1);
  expect(screen.queryByTestId('add-pet-celebration-modal')).toBeNull();
  expect(mockNotificationAsync).not.toHaveBeenCalled();
}

describe('#171 R4: primera mascota', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockUseSelectedPet.mockReturnValue({ selectedPetId: null, selectPet, clearPet: jest.fn(), });
    mockCreatePet.mockResolvedValue({ kind: 'ok', pet: { id: 'pet-new', name: 'Nala' } as never });
  });

  it('R4.1 consulta la lista con la URL y el token', async () => {
    await renderAddPet();
    await waitFor(() => expect(mockListPets).toHaveBeenCalledTimes(1));
    expect(mockListPets).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token');
  });

  it('R4.3 celebra la primera mascota sin foto', async () => {
    await renderWithPetList({ kind: 'ok', pets: [] });
    await saveNala();
    await screen.findByTestId('add-pet-celebration-modal');
    expect(mockRouter.back).not.toHaveBeenCalled();
    expect(mockNotificationAsync).toHaveBeenCalledTimes(1);
  });

  it('R4.3 celebra la primera mascota después de subir la foto', async () => {
    armNalaPhoto();
    await renderWithPetList({ kind: 'ok', pets: [] });
    await saveNalaWithPhoto();
    await screen.findByTestId('add-pet-celebration-modal');
    expect(mockRouter.back).not.toHaveBeenCalled();
    expect(mockNotificationAsync).toHaveBeenCalledTimes(1);
  });

  it('R4.4 vuelve sin celebrar si ya hay una mascota', async () => {
    await renderWithPetList({ kind: 'ok', pets: [{ id: 'pet-1', name: 'Milo' } as never] });
    await saveNala();
    await expectReturnWithoutCelebration();
  });

  it('R4.5 vuelve sin celebrar si la lista está pendiente', async () => {
    mockListPets.mockReturnValue(new Promise(() => {}));
    await renderAddPet();
    await saveNala();
    await expectReturnWithoutCelebration();
  });

  it('R4.5 vuelve sin celebrar si la lista da error', async () => {
    await renderWithPetList({ kind: 'error' });
    await saveNala();
    await expectReturnWithoutCelebration();
  });

  it('R4.5 vuelve sin celebrar si la lista está inaccesible', async () => {
    await renderWithPetList({ kind: 'unreachable', message: 'offline' });
    await saveNala();
    await expectReturnWithoutCelebration();
  });

  it('R4.5 vuelve sin celebrar si la lista no está autorizada', async () => {
    await renderWithPetList({ kind: 'unauthorized' });
    await saveNala();
    await expectReturnWithoutCelebration();
  });

  it('R4.6 no celebra si falla la subida de la foto', async () => {
    armNalaPhoto();
    mockUploadPhotoToUrl.mockResolvedValue({ kind: 'error' });
    await renderWithPetList({ kind: 'ok', pets: [] });
    await saveNalaWithPhoto();
    await screen.findByText('Se creó la mascota, pero no se pudo subir la foto');
    expect(screen.queryByTestId('add-pet-celebration-modal')).toBeNull();
    expect(mockRouter.back).not.toHaveBeenCalled();
  });
});

describe('#171 R5: variante sin collar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockUseSelectedPet.mockReturnValue({ selectedPetId: null, selectPet, clearPet: jest.fn(), });
    mockCreatePet.mockResolvedValue({ kind: 'ok', pet: { id: 'pet-new', name: 'Nala' } as never });
  });

  async function celebrateNala() {
    await renderWithPetList({ kind: 'ok', pets: [] });
    await saveNala();
    await screen.findByTestId('add-pet-celebration-modal');
  }

  it('R5.1 muestra el título y el cuerpo con el nombre de Nala', async () => {
    await celebrateNala();
    expect(screen.getByTestId('add-pet-celebration-title').props.children).toBe('¡Nala ya está en casa!');
    expect(screen.getByTestId('add-pet-celebration-body').props.children).toBe('Te ayudo a cuidar de Nala. Vincula un collar y estaré pendiente de dónde está.');
  });

  it('R5.1 existe sin fichas de collar', async () => {
    await celebrateNala();
    expect(screen.getByTestId('add-pet-celebration')).toBeTruthy();
    expect(screen.queryByTestId('add-pet-celebration-details')).toBeNull();
  });

  it('R5.2 Vincular un collar reemplaza por pairing', async () => {
    await celebrateNala();
    expect(screen.getByTestId('add-pet-celebration-pair')).toHaveTextContent('Vincular un collar');
    await fireEvent.press(screen.getByTestId('add-pet-celebration-pair'));
    expect(mockRouter.replace).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).toHaveBeenCalledWith('/pairing');
    expect(mockRouter.back).not.toHaveBeenCalled();
  });

  it('R5.3 Ahora no vuelve una sola vez', async () => {
    await celebrateNala();
    expect(screen.getByTestId('add-pet-celebration-later')).toHaveTextContent('Ahora no');
    await fireEvent.press(screen.getByTestId('add-pet-celebration-later'));
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('R5.3 requestClose vuelve una sola vez', async () => {
    await celebrateNala();
    await fireEvent(screen.getByTestId('add-pet-celebration-modal'), 'requestClose');
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('R5.4 toma el nombre de la respuesta y no el del formulario', async () => {
    mockCreatePet.mockResolvedValue({ kind: 'ok', pet: { id: 'pet-new', name: 'Kira' } as never });
    await celebrateNala();
    expect(screen.getByTestId('add-pet-celebration-title').props.children).toBe('¡Kira ya está en casa!');
    expect(screen.getByTestId('add-pet-celebration-body').props.children).toBe('Te ayudo a cuidar de Kira. Vincula un collar y estaré pendiente de dónde está.');
  });
});
