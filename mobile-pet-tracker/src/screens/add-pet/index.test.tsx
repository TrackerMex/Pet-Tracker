import { fireEvent, render, screen, waitFor, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import * as ImagePicker from 'expo-image-picker';

import { requestPhotoUploadUrl, uploadPhotoToUrl } from '../../api/media';
import { createPet } from '../../api/pets';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { AddPetScreen } from '.';

jest.mock('../../api/pets', () => ({ createPet: jest.fn() }));
jest.mock('../../api/media', () => ({
  ...jest.requireActual('../../api/media'),
  requestPhotoUploadUrl: jest.fn(),
  uploadPhotoToUrl: jest.fn(),
}));
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}), { virtual: true });
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

async function renderAddPet() {
  return render(
    <HeroUINativeProvider>
      <AddPetScreen />
    </HeroUINativeProvider>,
  );
}

beforeEach(() => {
  mockLaunchImageLibrary.mockReset();
  mockLaunchImageLibrary.mockResolvedValue({ canceled: true, assets: null });
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
    mockUseSelectedPet.mockReturnValue({ selectedPetId: 'pet-1', selectPet });
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
    expect(screen.getByTestId('pet-avatar').props.name).toBe('Pet');
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

  it('validates exactly one age mode without posting', async () => {
    mockCreatePet.mockResolvedValue({ kind: 'error' });
    await renderAddPet();
    await fireEvent.changeText(screen.getByTestId('name-input'), 'Luna');
    await fireEvent.press(screen.getByTestId('add-pet-submit'));

    expect(screen.getByTestId('add-pet-error')).toHaveTextContent('Choose a birth date');
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

  it('shows a backend error without losing typed values', async () => {
    mockCreatePet.mockResolvedValue({ kind: 'invalid' });
    await renderAddPet();
    await fireEvent.changeText(screen.getByTestId('name-input'), 'Luna');
    await fireEvent.press(screen.getByTestId('age-mode-months'));
    await fireEvent.changeText(screen.getByTestId('approx-age-input'), '12');
    await fireEvent.press(screen.getByTestId('add-pet-submit'));

    await waitFor(() => expect(screen.getByTestId('add-pet-error')).toBeVisible());
    expect(screen.getByTestId('name-input').props.value).toBe('Luna');
    expect(screen.getByTestId('approx-age-input').props.value).toBe('12');
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
    mockUseSelectedPet.mockReturnValue({ selectedPetId: null, selectPet });
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

    await fireEvent.press(screen.getByTestId('add-pet-photo'));
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
