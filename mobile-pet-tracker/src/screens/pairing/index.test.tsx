import {
  act,
  fireEvent,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { notificationAsync } from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { type ReactNode, useEffect } from 'react';
import { Alert, DeviceEventEmitter, Platform } from 'react-native';
import { getAnimatedStyle } from 'react-native-reanimated';

import {
  claimDevice,
  type ClaimDeviceState,
  releaseDevice,
  type ReleaseDeviceState,
} from '../../api/devices';
import { listPets, type PetsState } from '../../api/pets';
import { deviceKeys, petKeys } from '../../api/query-keys';
import {
  getPetTracking,
  type PetTrackingState,
} from '../../api/subscriptions';
import type { PetProfile } from '../../api/types';
import PairingRoute from '../../app/pairing';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { SelectedPetProvider, useSelectedPet } from '../../providers/selected-pet-provider';
import { useChunkyLip } from '../../theme/chunky-lip';
import { useShadows } from '../../theme/shadows';
import { renderWithProviders } from '../../../test/render-with-providers';

jest.mock('../../api/devices', () => ({
  claimDevice: jest.fn(),
  releaseDevice: jest.fn(),
}));

jest.mock('../../api/pets', () => ({
  listPets: jest.fn(),
}));

jest.mock('../../api/subscriptions', () => ({
  getPetTracking: jest.fn(),
}));

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), canGoBack: jest.fn(() => true), dismissTo: jest.fn() },
  useFocusEffect: jest.fn(),
  useIsFocused: () => true,
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

jest.mock('reicon-react-native', () => {
  const actual = jest.requireActual<typeof import('reicon-react-native')>('reicon-react-native');
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    ...actual,
    InfoCircle: (props: Record<string, unknown>) => React.createElement(View, { testID: 'icon-info-circle', ...props }),
    Package: (props: Record<string, unknown>) => React.createElement(View, { testID: 'icon-package', ...props }),
    LinkBroken: (props: Record<string, unknown>) => React.createElement(View, { testID: 'icon-link-broken', ...props }),
  };
});

jest.mock('@expo/ui/community/bottom-sheet', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    BottomSheet: ({ children, index, ...props }: Record<string, unknown>) =>
      typeof index === 'number' && index >= 0
        ? React.createElement(View as unknown as React.ComponentType<Record<string, unknown>>, { ...props, index, testID: 'community-bottom-sheet' }, children as never)
        : null,
    BottomSheetView: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(View, props, children as never),
  };
});

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens.map((token) => `color:${token}`),
}));

const originalOS = Platform.OS;

const apiUrl = 'http://example.test/v1';
const mockClaimDevice = jest.mocked(claimDevice);
const mockGetPetTracking = jest.mocked(getPetTracking);
const mockListPets = jest.mocked(listPets);
const mockReleaseDevice = jest.mocked(releaseDevice);
const mockUseAuth = jest.mocked(useAuth);
const mockRouter = jest.mocked(router);
const mockUseFocusEffect = jest.mocked(useFocusEffect);
const mockUseReducedMotion = jest.fn<boolean, []>(() => false);

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: () => mockUseReducedMotion(),
}));

jest.mock('../../components/rise-in', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    RiseIn(props: import('react-native').ViewProps & { delayMs: number }) {
      return React.createElement(View, props);
    },
  };
});

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

function makeDevice(
  overrides: Partial<NonNullable<PetProfile['device']>> = {},
): NonNullable<PetProfile['device']> {
  return {
    model: 'TrailTag Pro',
    batteryPct: 82,
    connectivity: 'LTE',
    lastMessageAt: '2026-09-03T10:00:00.000Z',
    esn: 'ESN-4242',
    ...overrides,
  };
}

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

let selectPairingPet: ReturnType<typeof useSelectedPet>['selectPet'];

function PairingSelectionProbe() {
  const { selectPet } = useSelectedPet();
  useEffect(() => {
    selectPairingPet = selectPet;
  }, [selectPet]);
  return null;
}

function PairingWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial="es">
        <SelectedPetProvider>
          <PairingSelectionProbe />
          {children}
        </SelectedPetProvider>
      </LanguageProvider>
    </HeroUINativeProvider>
  );
}

async function renderPairing() {
  return renderWithProviders(<PairingRoute />, { wrapper: PairingWrapper });
}

describe('R6: el estado local de pairing se limpia al cambiar de mascota', () => {
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
      pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo', device: null })],
    });
  });

  it('limpia la vista ready y el código al seleccionar otra mascota', async () => {
    mockClaimDevice.mockResolvedValue({ kind: 'ok', device: makeDevice() });
    await renderPairing();
    await fireEvent.changeText(
      await screen.findByTestId('activation-code-input'),
      'ACT-READY',
    );
    await fireEvent.press(screen.getByTestId('pairing-submit'));
    expect(await screen.findByTestId('pairing-ready')).toBeVisible();

    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));

    await waitFor(() => {
      expect(screen.queryByTestId('pairing-ready')).toBeNull();
      expect(screen.getByTestId('activation-code-input').props.value).toBe('');
    });
  });

  it('limpia actionError al seleccionar otra mascota', async () => {
    mockClaimDevice.mockResolvedValue({ kind: 'invalid' });
    await renderPairing();
    await fireEvent.changeText(
      await screen.findByTestId('activation-code-input'),
      'ACT-INVALID',
    );
    await fireEvent.press(screen.getByTestId('pairing-submit'));
    expect(await screen.findByTestId('pairing-error')).toBeVisible();

    await act(() => selectPairingPet('pet-2'));
    await waitFor(() => expect(screen.getByTestId('pairing-pet-avatar').props.accessibilityLabel).toBe('Milo'));

    await waitFor(() => {
      expect(screen.queryByTestId('pairing-error')).toBeNull();
    });
  });
});

describe('R4: /pairing monta en el Stack raíz con selector de mascota y estados de carga', () => {
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
  });

  it('renders the real route with uniform metrics and a dimensioned skeleton (#95 R6) (enmendado por #203 R2)', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderPairing();

    expect(screen.getByTestId('screen-pairing')).toBeVisible();
    expect(screen.getByTestId('pairing-form').props.contentContainerStyle).toEqual({
      paddingHorizontal: 20,
      paddingTop: 48,
      paddingBottom: 48,
      gap: 16,
      flexGrow: 1,
    });
    expect(screen.getByTestId('pairing-skeleton')).toBeVisible();
    expect(screen.getAllByTestId(/^pairing-content-skeleton-/)).toHaveLength(3);
    expect(mockListPets).toHaveBeenCalledWith(apiUrl, 'jwt-token');
  });

  it.each([
    { kind: 'error' } as const,
    { kind: 'unreachable', message: 'network down' } as const,
    { kind: 'missing-config' } as const,
  ])('shows and retries a $kind pet-list error', async (state) => {
    mockListPets
      .mockResolvedValueOnce(state)
      .mockResolvedValueOnce({ kind: 'ok', pets: [] });

    await renderPairing();

    expect(await screen.findByTestId('pairing-error-pets')).toHaveTextContent(
      'Algo salió mal',
    );
    await fireEvent.press(screen.getByTestId('pairing-retry'));

    expect(await screen.findByTestId('pairing-no-pets')).toHaveTextContent(
      'Primero añade una mascota',
    );
    expect(mockListPets).toHaveBeenCalledTimes(2);
  });

  it('shows the empty state when the account has no pets', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });

    await renderPairing();

    expect(await screen.findByTestId('pairing-no-pets')).toHaveTextContent(
      'Primero añade una mascota',
    );
  });

  it('uses the shared pet switcher and changes the selected pet', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet({ device: makeDevice() }), makePet({ id: 'pet-2', name: 'Milo', device: makeDevice() })],
    });

    mockGetPetTracking.mockResolvedValue({ kind: 'ok', tracked: true });
    await renderPairing();

    await waitFor(() =>
      expect(
        screen.getByTestId('pet-chip-pet-1').props.accessibilityState,
      ).toEqual({ selected: true }),
    );
    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));
    expect(
      screen.getByTestId('pet-chip-pet-2').props.accessibilityState,
    ).toEqual({ selected: true });
  });

  it('registers a focus effect that refetches the pets', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });

    await renderPairing();
    await waitFor(() => expect(mockListPets).toHaveBeenCalledTimes(1));
    const focusCallback = mockUseFocusEffect.mock.calls[0]?.[0];
    expect(focusCallback).toBeDefined();

    await act(async () => {
      focusCallback?.();
      await Promise.resolve();
    });

    await waitFor(() => expect(mockListPets).toHaveBeenCalledTimes(2));
  });
});

describe('R5: sin collar muestra el formulario de vinculación y publica el claim solo al enviar', () => {
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
    mockClaimDevice.mockResolvedValue({ kind: 'error' });
  });

  it('shows the exact free-plan note and constrained activation-code field', async () => {
    await renderPairing();

    expect(await screen.findAllByText('Vincular collar')).toHaveLength(2);
    expect(screen.getByTestId('pairing-plan-free')).toHaveTextContent(
      'Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.',
    );
    expect(screen.getByText('Código de activación')).toBeVisible();
    expect(screen.getByText('Impreso en la caja del collar')).toBeVisible();
    expect(screen.getByTestId('activation-code-input').props).toEqual(
      expect.objectContaining({
        autoCapitalize: 'characters',
        autoCorrect: false,
        maxLength: 64,
      }),
    );
    expect(screen.getByTestId('pairing-submit')).toBeDisabled();
    expect(mockClaimDevice).not.toHaveBeenCalled();
  });

  it('keeps submit disabled for a whitespace-only code', async () => {
    await renderPairing();

    await fireEvent.changeText(
      await screen.findByTestId('activation-code-input'),
      '   ',
    );

    expect(screen.getByTestId('pairing-submit')).toBeDisabled();
    expect(mockClaimDevice).not.toHaveBeenCalled();
  });

  it('submits the trimmed code exactly once for the selected pet', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })],
    });
    await renderPairing();
    await waitFor(() => expect(screen.getByTestId('pairing-pet-avatar').props.accessibilityLabel).toBe('Luna'));
    await act(() => selectPairingPet('pet-2'));
    await waitFor(() => expect(screen.getByTestId('pairing-pet-avatar').props.accessibilityLabel).toBe('Milo'));
    await fireEvent.changeText(
      screen.getByTestId('activation-code-input'),
      '  ACT-002  ',
    );

    await fireEvent.press(screen.getByTestId('pairing-submit'));

    await waitFor(() => expect(mockClaimDevice).toHaveBeenCalledTimes(1));
    expect(mockClaimDevice).toHaveBeenCalledWith(apiUrl, 'jwt-token', {
      petId: 'pet-2',
      activationCode: 'ACT-002',
    });
    await waitFor(() =>
      expect(screen.getByTestId('pairing-submit')).not.toBeDisabled(),
    );
  });

  it('disables submit while the claim request is in flight', async () => {
    let resolveClaim!: (state: ClaimDeviceState) => void;
    mockClaimDevice.mockReturnValue(
      new Promise((resolve) => {
        resolveClaim = resolve;
      }),
    );
    await renderPairing();
    await fireEvent.changeText(
      await screen.findByTestId('activation-code-input'),
      'ACT-001',
    );

    await fireEvent.press(screen.getByTestId('pairing-submit'));

    await waitFor(() =>
      expect(screen.getByTestId('pairing-submit')).toBeDisabled(),
    );
    await act(async () => {
      resolveClaim({ kind: 'error' });
    });
    await waitFor(() =>
      expect(screen.getByTestId('pairing-submit')).not.toBeDisabled(),
    );
  });
});

describe('R6: el claim mapea cada kind a su mensaje y permite reintentar', () => {
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
  });

  it.each<[ClaimDeviceState, string]>([
    [
      { kind: 'not-found' },
      'Código de activación no válido. Revisa el código impreso en la caja.',
    ],
    [
      { kind: 'invalid' },
      'Código de activación no válido. Revisa el código impreso en la caja.',
    ],
    [
      { kind: 'already-claimed' },
      'Este collar ya está vinculado a otra mascota.',
    ],
    [
      { kind: 'pet-has-device' },
      'Esta mascota ya tiene un collar. Desvincúlalo primero.',
    ],
    [
      { kind: 'subscription-required' },
      'Este collar no tiene un plan activo. Contacta con soporte para activarlo.',
    ],
    [{ kind: 'forbidden' }, 'Solo el dueño puede vincular un collar.'],
    [{ kind: 'unreachable', message: 'offline' }, 'No se pudo conectar con el servidor'],
    [{ kind: 'error' }, 'Algo salió mal'],
    [{ kind: 'missing-config' }, 'Algo salió mal'],
  ])('shows the exact message for $kind and allows retry', async (state, message) => {
    mockClaimDevice.mockResolvedValue(state);
    await renderPairing();
    await fireEvent.changeText(
      await screen.findByTestId('activation-code-input'),
      'ACT-001',
    );

    await fireEvent.press(screen.getByTestId('pairing-submit'));

    const error = await screen.findByTestId('pairing-error');
    expect(error).toHaveTextContent(message);
    expect(error.props.selectable).toBe(true);
    expect(screen.getByTestId('pairing-submit')).not.toBeDisabled();

    await fireEvent.press(screen.getByTestId('pairing-submit'));
    await waitFor(() => expect(mockClaimDevice).toHaveBeenCalledTimes(2));
  });

  it('signs out for unauthorized without showing an error message (#72 R2)', async () => {
    const signOut = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut,
    } satisfies AuthContextValue);
    mockClaimDevice.mockResolvedValue({ kind: 'unauthorized' });
    await renderPairing();
    await fireEvent.changeText(
      await screen.findByTestId('activation-code-input'),
      'ACT-001',
    );

    await fireEvent.press(screen.getByTestId('pairing-submit'));

    await waitFor(() =>
      expect(screen.getByTestId('pairing-submit')).not.toBeDisabled(),
    );
    expect(signOut).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('pairing-error')).toBeNull();
  });
});

describe('R7: tras el 201 muestra "El collar está listo" con el collar y sus CTAs', () => {
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
  });

  async function renderReady(
    device = makeDevice(),
  ): Promise<ReturnType<typeof renderPairing>> {
    mockClaimDevice.mockResolvedValue({ kind: 'ok', device });
    const result = await renderPairing();
    await fireEvent.changeText(
      await screen.findByTestId('activation-code-input'),
      'ACT-READY',
    );
    await fireEvent.press(screen.getByTestId('pairing-submit'));
    await screen.findByTestId('pairing-ready');
    return result;
  }

  it('shows the success copy, device values, and refreshes pets', async () => {
    await renderReady();

    expect(screen.getByText('El collar está listo')).toBeOnTheScreen();
    expect(
      screen.getByText(
        'El collar de Luna está vinculado. El rastreo GPS está activo.',
      ),
    ).toBeOnTheScreen();
    expect(screen.getByTestId('ready-model')).toHaveTextContent('TrailTag Pro');
    expect(screen.getByTestId('ready-esn')).toHaveTextContent('ESN-4242');
    expect(screen.queryByTestId('activation-code-input')).toBeNull();
    expect(screen.queryByTestId('pairing-submit')).toBeNull();
    await waitFor(() => expect(mockListPets).toHaveBeenCalledTimes(2));
  });

  it('uses em-dash fallbacks for nullable device identifiers', async () => {
    await renderReady(makeDevice({ model: null, esn: null }));

    expect(screen.getByTestId('ready-model')).toHaveTextContent('—');
    expect(screen.getByTestId('ready-esn')).toHaveTextContent('—');
  });

  it('resets ready and opens the map from the primary CTA', async () => {
    await renderReady();

    await fireEvent.press(screen.getByTestId('ready-map'));

    expect(mockRouter.dismissTo).toHaveBeenCalledWith('/map');
    expect(screen.queryByTestId('pairing-ready')).toBeNull();
    expect(screen.getByTestId('activation-code-input')).toBeVisible();
  });

  it('resets ready and goes back from Done', async () => {
    await renderReady();

    await fireEvent.press(screen.getByTestId('ready-done'));

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('pairing-ready')).toBeNull();
    expect(screen.getByTestId('activation-code-input')).toBeVisible();
  });

  describe('#95 R8: ver en el mapa desapila pairing', () => {
    it('usa dismissTo una vez y no apila otra instancia de tabs', async () => {
      await renderReady();
      await fireEvent.press(screen.getByTestId('ready-map'));
      expect(mockRouter.dismissTo).toHaveBeenCalledTimes(1);
      expect(mockRouter.dismissTo).toHaveBeenCalledWith('/map');
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe('#171 R3: celebración al vincular', () => {
    it('R3.1 el Modal muestra título y cuerpo del collar de Luna', async () => {
      await renderReady();
      expect(screen.getByTestId('pairing-ready-modal')).toBeVisible();
      expect(screen.getByTestId('pairing-ready-title')).toHaveTextContent('El collar está listo', { exact: true });
      expect(screen.getByTestId('pairing-ready-body')).toHaveTextContent('El collar de Luna está vinculado. El rastreo GPS está activo.', { exact: true });
    });

    it('R3.1 las fichas contienen Modelo y ESN exactos', async () => {
      await renderReady();
      const details = within(screen.getByTestId('pairing-ready-details'));
      expect(details.getByTestId('ready-model')).toHaveTextContent('TrailTag Pro', { exact: true });
      expect(details.getByTestId('ready-esn')).toHaveTextContent('ESN-4242', { exact: true });
    });

    it('R3.1 las acciones contienen Ver en el mapa y Listo', async () => {
      await renderReady();
      const actions = within(screen.getByTestId('pairing-ready-actions'));
      expect(actions.getByTestId('ready-map')).toHaveTextContent('Ver en el mapa', { exact: true });
      expect(actions.getByTestId('ready-done')).toHaveTextContent('Listo', { exact: true });
    });

    it('R3.2 atrás de Android vuelve una vez y retira la celebración', async () => {
      await renderReady();
      await fireEvent(screen.getByTestId('pairing-ready-modal'), 'requestClose');
      await screen.findByTestId('activation-code-input');
      expect(mockRouter.back).toHaveBeenCalledTimes(1);
      expect(mockRouter.dismissTo).not.toHaveBeenCalled();
      expect(screen.queryByTestId('pairing-ready')).toBeNull();
    });

    it('R3.3 sustituye el bloque en línea por un único Celebration', () => {
      const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
      const { join } = jest.requireActual<typeof import('path')>('path');
      const source = readFileSync(join(process.cwd(), 'src', 'screens', 'pairing', 'index.tsx'), 'utf8');
      expect(source).not.toContain('<Pressable');
      expect(source).not.toContain('size-16 items-center justify-center rounded-full bg-accent-soft');
      expect(source).not.toContain('<Card className="w-full">');
      expect(source.match(/<Celebration/g) ?? []).toHaveLength(1);
    });

    it('R3 al llegar a ready notifica éxito una vez', async () => {
      await renderReady();
      expect(mockNotificationAsync).toHaveBeenCalledTimes(1);
    });

    it('R3.4 un error del claim no monta el Modal ni dispara el háptico', async () => {
      mockClaimDevice.mockResolvedValue({ kind: 'error' });
      await renderPairing();
      await fireEvent.changeText(await screen.findByTestId('activation-code-input'), 'ACT-READY');
      await fireEvent.press(screen.getByTestId('pairing-submit'));
      await screen.findByTestId('pairing-error');
      expect(screen.queryByTestId('pairing-ready-modal')).toBeNull();
      expect(mockNotificationAsync).not.toHaveBeenCalled();
    });
  });
});

describe('R8: con collar muestra el estado del dispositivo y el plan tracked/free según subscriptions', () => {
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
      pets: [makePet({ device: makeDevice() })],
    });
    mockGetPetTracking.mockResolvedValue({ kind: 'ok', tracked: true });
  });

  it('shows all five device rows with their values', async () => {
    await renderPairing();

    expect(await screen.findByText('Dispositivo GPS')).toBeVisible();
    expect(screen.getByTestId('device-status-card')).toBeVisible();
    expect(screen.getByTestId('device-model')).toHaveTextContent('TrailTag Pro');
    expect(screen.getByTestId('device-battery')).toHaveTextContent('82%');
    expect(screen.getByTestId('device-connectivity')).toHaveTextContent(
      'Desconocida',
    );
    expect(screen.getByTestId('device-last-message')).toHaveTextContent(
      new Date('2026-09-03T10:00:00.000Z').toLocaleString('es-MX'),
    );
    expect(screen.getByTestId('device-esn')).toHaveTextContent('ESN-4242');
    expect(mockGetPetTracking).toHaveBeenCalledWith(
      apiUrl,
      'jwt-token',
      'pet-1',
    );
  });

  it('#73 R6: pinta Sin conexion para un collar desconectado', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet({ device: makeDevice({ connectivity: 'offline' }) })],
    });

    await renderPairing();

    expect(await screen.findByTestId('device-connectivity')).toHaveTextContent(
      'Sin conexión',
    );
  });

  it('uses the specified fallbacks for nullable device values', async () => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [
        makePet({
          device: makeDevice({
            model: null,
            batteryPct: null,
            connectivity: null,
            lastMessageAt: null,
            esn: null,
          }),
        }),
      ],
    });

    await renderPairing();

    expect(await screen.findByTestId('device-model')).toHaveTextContent('—');
    expect(screen.getByTestId('device-battery')).toHaveTextContent('—');
    expect(screen.getByTestId('device-connectivity')).toHaveTextContent('—');
    expect(screen.getByTestId('device-last-message')).toHaveTextContent(
      'Sin mensajes todavía',
    );
    expect(screen.getByTestId('device-esn')).toHaveTextContent('—');
  });

  it('shows a dimensioned skeleton while the plan probe is pending', async () => {
    mockGetPetTracking.mockReturnValue(pending<PetTrackingState>());

    await renderPairing();

    expect(await screen.findByTestId('device-status-card')).toBeVisible();
    expect(screen.getByTestId('plan-skeleton')).toBeVisible();
  });

  it('shows the tracked pill for an active GPS plan', async () => {
    await renderPairing();

    expect(await screen.findByTestId('plan-tracked')).toHaveTextContent(
      'Rastreo GPS activo',
    );
  });

  it('shows the exact free-plan note when tracking is not active', async () => {
    mockGetPetTracking.mockResolvedValue({ kind: 'ok', tracked: false });

    await renderPairing();

    expect(await screen.findByTestId('plan-free')).toHaveTextContent(
      'Plan gratuito — solo salud. Este collar no tiene plan activo.',
    );
  });

  it.each<PetTrackingState>([
    { kind: 'error' },
    { kind: 'unreachable', message: 'offline' },
    { kind: 'missing-config' },
  ])('shows unavailable for a $kind plan result', async (state) => {
    mockGetPetTracking.mockResolvedValue(state);

    await renderPairing();

    expect(await screen.findByTestId('plan-unknown')).toHaveTextContent(
      'Estado del plan no disponible',
    );
  });

  it('refetches the plan probe on focus', async () => {
    await renderPairing();
    await screen.findByTestId('plan-tracked');
    const trackingFocusCallback = mockUseFocusEffect.mock.calls[1]?.[0];
    expect(trackingFocusCallback).toBeDefined();

    await act(async () => {
      trackingFocusCallback?.();
      await Promise.resolve();
    });

    await waitFor(() => expect(mockGetPetTracking).toHaveBeenCalledTimes(2));
  });

  it('does not duplicate the plan probe when focused pets also refresh', async () => {
    mockListPets
      .mockResolvedValueOnce({
        kind: 'ok',
        pets: [makePet({ device: makeDevice() })],
      })
      .mockResolvedValueOnce({
        kind: 'ok',
        pets: [
          makePet({
            device: makeDevice({ model: 'TrailTag Pro refreshed' }),
          }),
        ],
      });
    await renderPairing();
    await screen.findByTestId('plan-tracked');
    const petsFocusCallback = mockUseFocusEffect.mock.calls[0]?.[0];
    const trackingFocusCallback = mockUseFocusEffect.mock.calls[1]?.[0];

    await act(async () => {
      petsFocusCallback?.();
      trackingFocusCallback?.();
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(screen.getByTestId('device-model')).toHaveTextContent(
        'TrailTag Pro refreshed',
      ),
    );
    expect(mockListPets).toHaveBeenCalledTimes(2);
    expect(mockGetPetTracking).toHaveBeenCalledTimes(2);
  });

  it('does not probe tracking while the selected pet has no device', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });

    await renderPairing();

    expect(await screen.findByTestId('activation-code-input')).toBeVisible();
    expect(mockGetPetTracking).not.toHaveBeenCalled();
  });

  it('does not probe tracking during the ready phase', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    mockClaimDevice.mockResolvedValue({ kind: 'ok', device: makeDevice() });
    await renderPairing();
    await fireEvent.changeText(
      await screen.findByTestId('activation-code-input'),
      'ACT-READY',
    );

    await fireEvent.press(screen.getByTestId('pairing-submit'));

    expect(await screen.findByTestId('pairing-ready')).toBeVisible();
    expect(mockGetPetTracking).not.toHaveBeenCalled();
  });
});

describe('#87 R15: PairingScreen lee por TanStack Query', () => {
  it('deja mascotas y tracking en sus claves canónicas', async () => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    const petsState: PetsState = {
      kind: 'ok',
      pets: [makePet({ device: makeDevice() })],
    };
    const trackingState: PetTrackingState = { kind: 'ok', tracked: true };
    mockListPets.mockResolvedValue(petsState);
    mockGetPetTracking.mockResolvedValue(trackingState);

    const { queryClient } = await renderWithProviders(<PairingRoute />, {
      wrapper: PairingWrapper,
    });
    await screen.findByTestId('plan-tracked');

    expect(queryClient.getQueryData(petKeys.list())).toEqual(petsState);
    expect(queryClient.getQueryData(deviceKeys.tracking('pet-1'))).toEqual(
      trackingState,
    );
  });
});

describe('#148 R6: pairing se aparta del teclado en Android', () => {
  afterEach(() => {
    (Platform as { OS: string }).OS = originalOS;
  });

  it('el host screen-pairing añade paddingBottom 200 al abrir el teclado (enmendado por #203 R2)', async () => {
    (Platform as { OS: string }).OS = 'android';
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockReturnValue(pending<PetsState>());
    await renderPairing();

    const host = screen.getByTestId('screen-pairing');
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
    await waitFor(() => expect(screen.getByTestId('screen-pairing')).toHaveStyle({ paddingBottom: 200 }));
  });
});

describe('#148 R8: pairing entrega el primer toque con el teclado abierto', () => {
  it('el scroll pairing-form declara keyboardShouldPersistTaps handled', async () => {
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockReturnValue(pending<PetsState>());
    await renderPairing();

    expect(screen.getByTestId('pairing-form').props.keyboardShouldPersistTaps).toBe('handled');
  });
});


jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(() => Promise.resolve()),
  NotificationFeedbackType: { Success: 'mock-success', Error: 'mock-error' },
}));
const mockNotificationAsync = jest.mocked(notificationAsync);


describe('#188 R1-R14: pairing canvas fidelity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReducedMotion.mockReturnValue(false);
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it('#188 R20: styles label, code input and hint like the artboard', async () => {
    mockClaimDevice.mockResolvedValue({ kind: 'invalid' });
    await renderPairing();
    const input = await screen.findByTestId('activation-code-input');
    const label = screen.getByTestId('pairing-activation-code-label');
    expect(label.props.className.split(' ')).toEqual(expect.arrayContaining(['text-sm', 'font-extrabold', 'text-foreground']));
    for (const excluded of ['uppercase', 'tracking-widest', 'text-xs', 'font-semibold', 'text-muted']) {
      expect(label.props.className.split(' ')).not.toContain(excluded);
    }
    expect(input.props.className.split(' ')).toEqual(expect.arrayContaining([
      'h-15', 'rounded-14', 'border-2', 'border-accent', 'bg-default', 'px-4', 'font-mono', 'text-24', 'tracking-code', 'text-foreground',
    ]));
    for (const excluded of ['min-h-12', 'rounded-xl', 'py-3', 'font-black']) {
      expect(input.props.className.split(' ')).not.toContain(excluded);
    }
    expect(input).toHaveStyle({ borderCurve: 'continuous' });
    expect(input.props).toMatchObject({ autoCapitalize: 'characters', autoCorrect: false, maxLength: 64, value: '', onChangeText: expect.any(Function) });
    const hint = screen.getByTestId('pairing-code-hint');
    expect(hint.props.className.split(' ')).toEqual(expect.arrayContaining(['flex-row', 'items-center', 'gap-1.5']));
    const icon = within(hint).getByTestId('icon-package');
    expect(icon.props).toMatchObject({ size: 14, color: 'color:muted' });
    const text = within(hint).getByText('Impreso en la caja del collar', { exact: true });
    expect(text.props.className.split(' ')).toEqual(expect.arrayContaining(['text-xs', 'font-semibold', 'text-muted']));
    expect(hint.children).toEqual([icon, text]);
    const field = label.parent!;
    expect(field.props.className).toBe('gap-1.5');
    expect(field.children).toEqual([label, input, hint]);
    await fireEvent.changeText(input, '  ACT-002  ');
    expect(screen.getByTestId('activation-code-input').props.value).toBe('  ACT-002  ');
    await fireEvent.press(screen.getByTestId('pairing-submit'));
    await screen.findByTestId('pairing-error');
    expect(mockClaimDevice).toHaveBeenCalledTimes(1);
    expect(mockClaimDevice).toHaveBeenCalledWith(apiUrl, 'jwt-token', { petId: 'pet-1', activationCode: 'ACT-002' });
  });

  it('#188 R19: anchors the submit button to the bottom edge (enmendado por #203 R2)', async () => {
    const app = await renderPairing();
    const submit = await screen.findByTestId('pairing-submit');
    expect(screen.getByTestId('pairing-form').props.contentContainerStyle.flexGrow).toBe(1);
    const spacer = screen.getByTestId('pairing-submit-spacer');
    expect(spacer).toHaveStyle({ flexGrow: 1 });
    const form = submit.parent!;
    expect(form).toHaveStyle({ flexGrow: 1 });
    expect(form.children.slice(-2)).toEqual([spacer, submit]);
    await app.unmount();

    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ device: makeDevice() })] });
    mockGetPetTracking.mockResolvedValue({ kind: 'ok', tracked: true });
    await renderPairing();
    await screen.findByTestId('device-status-card');
    expect(screen.getByTestId('pairing-form').props.contentContainerStyle).toHaveProperty('flexGrow', 1);
    expect(screen.queryByTestId('pairing-submit-spacer')).toBeNull();
  });

  it('#188 R18: renders the free-plan banner with an info icon and a bold lead', async () => {
    for (const [language, lead, body] of [
      ['es', 'Plan gratuito — solo salud.', 'Vincula un collar con plan activo para ver el mapa.'],
      ['en', 'Free plan — health only.', 'Pair a collar with an active plan to see the map.'],
    ] as const) {
      const app = await renderWithProviders(
        <LanguageProvider initial={language}><PairingRoute /></LanguageProvider>,
        { wrapper: PairingWrapper },
      );
      const text = await screen.findByTestId('pairing-plan-free');
      expect(text.props.className.split(' ')).toEqual(expect.arrayContaining([
        'flex-1', 'text-13', 'font-normal', 'leading-4.75', 'text-muted',
      ]));
      expect(text.props.selectable).toBe(true);
      expect(text).toHaveTextContent(`${lead} ${body}`, { exact: true });
      const heading = within(text).getByText(lead, { exact: true });
      expect(heading.props.className.split(' ')).toEqual(expect.arrayContaining(['font-bold', 'text-foreground']));
      const iconBox = screen.getByTestId('pairing-plan-icon');
      const banner = text.parent!;
      expect(banner.children).toEqual([iconBox, text]);
      expect(banner.props.className.split(' ')).toEqual(expect.arrayContaining([
        'flex-row', 'items-start', 'gap-2.5', 'rounded-tile', 'bg-default', 'px-3.5', 'py-3',
      ]));
      expect(banner.type).toBe('View');
      expect(banner.props.className).toBe('flex-row items-start gap-2.5 rounded-tile bg-default px-3.5 py-3');
      expect(banner.props.style).toBeUndefined();
      expect(iconBox.props.className).toBe('mt-px');
      expect(within(iconBox).getByTestId('icon-info-circle').props).toMatchObject({ size: 20, color: 'color:muted' });
      await app.unmount();
    }
  });

  it('#188 R17: shows only the selected pet avatar above the hero (enmendado por #203 R2)', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })] });
    await renderPairing();
    const avatar = await screen.findByTestId('pairing-pet-avatar');
    expect(screen.getAllByTestId('pairing-pet-avatar')).toHaveLength(1);
    expect(avatar.props.accessibilityLabel).toBe('Luna');
    expect(avatar.props.onPress).toBeUndefined();
    expect(avatar.props.accessibilityRole).not.toBe('button');
    expect(avatar.props.className.split(' ')).toEqual(expect.arrayContaining([
      'rounded-full', 'border-2', 'border-accent', 'p-0.75',
    ]));
    const header = screen.getByTestId('pairing-header');
    expect(avatar.parent!.props.testID).toBe('pairing-header');
    expect(header.children[header.children.length - 1]).toEqual(avatar);
    expect(within(screen.getByTestId('pairing-form')).getAllByTestId(
      /^(pairing-pet-avatar|pairing-pingo)$/,
      { includeHiddenElements: true },
    ).map((node) => node.props.testID)).toEqual(['pairing-pet-avatar', 'pairing-pingo']);
    expect(screen.queryAllByTestId(/^pet-chip-/)).toHaveLength(0);
  });

  it('#188 R17: renders the initial or the photo on the palette slot of the selected pet', async () => {
    const pets = [makePet({ name: 'luna' }), makePet({ id: 'pet-2', name: 'milo' })];
    mockListPets.mockResolvedValue({ kind: 'ok', pets });
    const app = await renderPairing();
    await screen.findByTestId('pairing-pet-avatar');
    expect(screen.getByTestId('pairing-pet-avatar-fallback')).toHaveTextContent('L', { exact: true });
    expect(screen.getByTestId('pairing-pet-avatar-fallback').props.className.split(' ')).toEqual(expect.arrayContaining([
      'text-sm', 'font-extrabold', 'text-category-amber-strong',
    ]));
    expect(screen.getByTestId('pairing-pet-avatar-disc').props.className.split(' ')).toEqual(expect.arrayContaining([
      'size-9', 'items-center', 'justify-center', 'overflow-hidden', 'rounded-full', 'bg-category-amber',
    ]));
    await act(() => selectPairingPet('pet-2'));
    await waitFor(() => expect(screen.getByTestId('pairing-pet-avatar').props.accessibilityLabel).toBe('milo'));
    expect(screen.getByTestId('pairing-pet-avatar-fallback')).toHaveTextContent('M', { exact: true });
    expect(screen.getByTestId('pairing-pet-avatar-disc').props.className).toContain('bg-category-violet');
    expect(screen.getByTestId('pairing-pet-avatar-fallback').props.className).toContain('text-category-violet-strong');
    const photoPets = [pets[0], { ...pets[1], photoUrl: 'https://example.test/milo.jpg' }];
    mockListPets.mockResolvedValue({ kind: 'ok', pets: photoPets });
    await act(() => app.queryClient.setQueryData(petKeys.list(), { kind: 'ok', pets: photoPets }));
    const photo = await screen.findByTestId('pairing-pet-avatar-image');
    expect(photo.props.source).toEqual([{ uri: 'https://example.test/milo.jpg', cacheKey: 'pet-2' }]);
    expect(photo).toHaveStyle({ width: 36, height: 36 });
    expect(screen.queryByTestId('pairing-pet-avatar-fallback')).toBeNull();
  });

  it('#188 R17: keeps the full pet switcher outside the linking view', async () => {
    for (const state of ['paired', 'ready']) {
      mockListPets.mockResolvedValue({ kind: 'ok', pets: [
        makePet({ device: state === 'paired' ? makeDevice() : null }),
        makePet({ id: 'pet-2', name: 'Milo', device: state === 'paired' ? makeDevice() : null }),
      ] });
      mockGetPetTracking.mockResolvedValue({ kind: 'ok', tracked: true });
      mockClaimDevice.mockResolvedValue({ kind: 'ok', device: makeDevice() });
      const app = await renderPairing();
      if (state === 'ready') {
        await fireEvent.changeText(await screen.findByTestId('activation-code-input'), 'ACT-001');
        await fireEvent.press(screen.getByTestId('pairing-submit'));
      }
      await screen.findByTestId(state === 'paired' ? 'device-status-card' : 'pairing-ready');
      expect(screen.getByTestId('pet-chip-pet-1')).toBeOnTheScreen();
      expect(screen.getByTestId('pet-chip-pet-2')).toBeOnTheScreen();
      expect(screen.queryByTestId('pairing-pet-avatar')).toBeNull();
      expect(screen.queryByTestId('pairing-pet-row')).toBeNull();
      await app.unmount();
    }
  });

  it('#188 R15: groups a 200 × 150 hero box and the title with a 10 px gap', async () => {
    await renderPairing();
    await screen.findByTestId('pairing-title');
    const hero = screen.getByTestId('pairing-hero', { includeHiddenElements: true });
    const group = screen.getByTestId('pairing-hero-group');
    expect(group.props.className.split(' ')).toEqual(expect.arrayContaining(['items-center', 'gap-2.5']));
    expect(group.children).toEqual([hero, screen.getByTestId('pairing-title')]);
    expect(hero.props.className.split(' ')).toEqual(expect.arrayContaining([
      'w-50', 'h-37.5', 'items-center', 'justify-center',
    ]));
    expect(hero.props).toMatchObject({
      accessible: false,
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no-hide-descendants',
    });
    expect(hero.children).toEqual([
      screen.getByTestId('pairing-ring-0', { includeHiddenElements: true }),
      screen.getByTestId('pairing-ring-1', { includeHiddenElements: true }),
      screen.getByTestId('pairing-pingo-float', { includeHiddenElements: true }),
    ]);
    const pingo = screen.getByTestId('pairing-pingo', { includeHiddenElements: true });
    expect(pingo).toHaveStyle({ width: 120, aspectRatio: 1 });
    const style = Object.assign({}, ...[pingo.props.style].flat(Infinity));
    expect(style).not.toHaveProperty('height');
  });

  it('#188 R1: shows the collar pose as the first visual content', async () => {
    await renderPairing();
    const pingo = await screen.findByTestId('pairing-pingo', { includeHiddenElements: true });
    expect(pingo.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-collar\.webp$/) }),
    ]);
    expect(JSON.stringify(pingo.props.source)).not.toContain('pingo-wave.webp');
    expect(pingo.props.contentFit).toBe('contain');
    const visuals = within(screen.getByTestId('pairing-form')).getAllByTestId(
      /^(pairing-pingo|pet-chip-pet-1|pairing-plan-free|activation-code-input|pairing-submit)$/,
      { includeHiddenElements: true },
    );
    expect(visuals[0].props.testID).toBe('pairing-pingo');
  });

  it('#188 R2: draws exactly two accent rings behind Pingo', async () => {
    await renderPairing();
    await screen.findByTestId('pairing-pingo', { includeHiddenElements: true });
    for (const index of [0, 1]) {
      const ring = screen.getByTestId(`pairing-ring-${index}`, { includeHiddenElements: true });
      expect(ring.props.className.split(' ')).toEqual(expect.arrayContaining([
        'size-37.5', 'rounded-full', 'border-3', 'border-accent',
      ]));
    }
    expect(screen.queryByTestId('pairing-ring-2', { includeHiddenElements: true })).toBeNull();
    const stage = screen.getByTestId('pairing-ring-0', { includeHiddenElements: true }).parent!;
    expect(within(stage).getAllByTestId(/^pairing-(ring-0|ring-1|pingo)$/, { includeHiddenElements: true })
      .map((node) => node.props.testID)).toEqual(['pairing-ring-0', 'pairing-ring-1', 'pairing-pingo']);
  });


  it('#188 R3: staggers the ping loop and resets at 2401 ms', async () => {
    jest.useFakeTimers();
    try {
      await renderPairing();
      const ring0 = await screen.findByTestId('pairing-ring-0', { includeHiddenElements: true });
      const ring1 = screen.getByTestId('pairing-ring-1', { includeHiddenElements: true });
      for (const ring of [ring0, ring1]) {
        expect(ring).toHaveAnimatedStyle({ opacity: 0.55, transform: [{ scale: 0.55 }] }, { shouldMatchAllProps: true });
      }
      await act(async () => { jest.advanceTimersByTime(600); });
      const style = getAnimatedStyle(ring0);
      const scale = (style.transform as [{ scale: number }])[0].scale;
      expect(scale).toBeGreaterThan(0.55);
      expect(scale).toBeLessThan(1.5);
      expect(style.opacity).toBeGreaterThan(0);
      expect(style.opacity).toBeLessThan(0.55);
      expect(ring0).toHaveAnimatedStyle({ opacity: style.opacity, transform: [{ scale }] }, { shouldMatchAllProps: true });
      expect(ring1).toHaveAnimatedStyle({ opacity: 0.55, transform: [{ scale: 0.55 }] }, { shouldMatchAllProps: true });
      await act(async () => { jest.advanceTimersByTime(1800); });
      expect(ring0).toHaveAnimatedStyle({ opacity: 0, transform: [{ scale: 1.5 }] }, { shouldMatchAllProps: true });
      await act(async () => { jest.advanceTimersByTime(1); });
      const restarted = getAnimatedStyle(ring0);
      expect(Object.keys(restarted).sort()).toEqual(['opacity', 'transform']);
      expect(restarted.transform).toHaveLength(1);
      expect(Object.keys(restarted.transform![0])).toEqual(['scale']);
      const restartedScale = (restarted.transform as [{ scale: number }])[0].scale;
      expect(restartedScale).toBeGreaterThan(0.55);
      expect(restartedScale).toBeLessThan(0.6);
      expect(restarted.opacity).toBeGreaterThan(0.5);
      expect(restarted.opacity).toBeLessThan(0.55);
    } finally {
      jest.useRealTimers();
    }
  });

  it('#188 R4: floats Pingo from 0 to -10 and back over 3000 ms', async () => {
    jest.useFakeTimers();
    try {
      await renderPairing();
      const pingo = await screen.findByTestId('pairing-pingo', { includeHiddenElements: true });
      const float = screen.getByTestId('pairing-pingo-float', { includeHiddenElements: true });
      expect(within(float).getByTestId('pairing-pingo', { includeHiddenElements: true })).toBe(pingo);
      expect(float).toHaveAnimatedStyle({ transform: [{ translateY: 0 }] }, { shouldMatchAllProps: true });
      await act(async () => { jest.advanceTimersByTime(1500); });
      expect(float).toHaveAnimatedStyle({ transform: [{ translateY: -10 }] }, { shouldMatchAllProps: true });
      await act(async () => { jest.advanceTimersByTime(1500); });
      expect(float).toHaveAnimatedStyle({ transform: [{ translateY: 0 }] }, { shouldMatchAllProps: true });
    } finally {
      jest.useRealTimers();
    }
  });

  it('#188 R5: keeps rings and Pingo at rest with reduced motion at 0, 1500 and 2400 ms', async () => {
    jest.useFakeTimers();
    mockUseReducedMotion.mockReturnValue(true);
    try {
      await renderPairing();
      const float = await screen.findByTestId('pairing-pingo-float', { includeHiddenElements: true });
      const rings = [0, 1].map((index) => screen.getByTestId(`pairing-ring-${index}`, { includeHiddenElements: true }));
      for (const elapsed of [0, 1500, 900]) {
        await act(async () => { jest.advanceTimersByTime(elapsed); });
        for (const ring of rings) {
          expect(ring).toHaveAnimatedStyle({ opacity: 0.3, transform: [{ scale: 1 }] }, { shouldMatchAllProps: true });
        }
        expect(float).toHaveAnimatedStyle({ transform: [{ translateY: 0 }] }, { shouldMatchAllProps: true });
      }
    } finally {
      mockUseReducedMotion.mockReturnValue(false);
      jest.useRealTimers();
    }
  });

  it.each([
    ['es', 'Vincular collar'],
    ['en', 'Pair collar'],
  ] as const)('#188 R6: places the %s title first inside the scroll content', async (language, title) => {
    await renderWithProviders(
      <LanguageProvider initial={language}><PairingRoute /></LanguageProvider>,
      { wrapper: PairingWrapper },
    );
    const form = screen.getByTestId('pairing-form');
    const heading = await within(form).findByTestId('pairing-title');
    expect(heading).toHaveTextContent(title, { exact: true });
    const texts = within(form).getAllByText(/\S/).filter((node) => node.props.testID !== 'pairing-pet-avatar-fallback');
    expect(texts[0].props.testID).toBe('pairing-title');
  });

  it('#188 R16: centers the title at 28 px with black weight and title tracking', async () => {
    await renderPairing();
    const title = await screen.findByTestId('pairing-title');
    expect(title.props.className.split(' ')).toEqual(expect.arrayContaining([
      'text-center', 'text-28', 'font-black', 'tracking-title', 'text-foreground',
    ]));
    for (const excluded of ['text-24', 'text-2xl', '[']) {
      expect(title.props.className).not.toContain(excluded);
    }
  });

  it('#188 R7/R16: gives the title the 28 px token and black weight', async () => {
    await renderPairing();
    const title = await screen.findByTestId('pairing-title');
    expect(title.props.className.split(' ')).toEqual(expect.arrayContaining(['text-28', 'font-black']));
    expect(title.props.className).not.toContain('text-24');
    expect(title.props.className).not.toContain('text-2xl');
    expect(title.props.className).not.toContain('[');
  });

  it.each([
    ['es', 'Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.', 'Código de activación', 'Impreso en la caja del collar'],
    ['en', 'Free plan — health only. Pair a collar with an active plan to see the map.', 'Activation code', 'Printed on the collar box'],
  ] as const)('#188 R8: orders the %s linking content and preserves its exact copy', async (language, plan, label, hint) => {
    await renderWithProviders(
      <LanguageProvider initial={language}><PairingRoute /></LanguageProvider>,
      { wrapper: PairingWrapper },
    );
    await screen.findByTestId('pairing-title');
    const form = within(screen.getByTestId('pairing-form'));
    expect(form.getAllByTestId(
      /^(pairing-pingo|pairing-title|pairing-plan-free|pairing-activation-code-label|activation-code-input|pairing-code-hint|pairing-submit)$/,
      { includeHiddenElements: true },
    ).map((node) => node.props.testID)).toEqual([
      'pairing-pingo', 'pairing-title', 'pairing-plan-free', 'pairing-activation-code-label',
      'activation-code-input', 'pairing-code-hint', 'pairing-submit',
    ]);
    expect(form.getByTestId('pairing-plan-free')).toHaveTextContent(plan, { exact: true });
    expect(form.getByTestId('pairing-activation-code-label')).toHaveTextContent(label, { exact: true });
    expect(form.getByTestId('pairing-code-hint')).toHaveTextContent(hint, { exact: true });
    expect(form.queryByTestId('pairing-subtitle', { includeHiddenElements: true })).toBeNull();
  });

  it.each([
    ['loading', 'pairing-skeleton'],
    ['pets-error', 'pairing-error-pets'],
    ['no-pets', 'pairing-no-pets'],
    ['linking', 'pairing-title'],
    ['paired-loading', 'plan-skeleton'],
    ['paired-tracked', 'plan-tracked'],
    ['paired-free', 'plan-free'],
    ['paired-unknown', 'plan-unknown'],
    ['claim-error', 'pairing-error'],
    ['ready', 'pairing-ready'],
  ] as const)('#188 R9: omits the unapproved subtitle in %s', async (state, anchor) => {
    if (state === 'loading') mockListPets.mockReturnValue(pending<PetsState>());
    if (state === 'pets-error') mockListPets.mockResolvedValue({ kind: 'error' });
    if (state === 'no-pets') mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    if (state.startsWith('paired-')) {
      mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ device: makeDevice() })] });
      if (state === 'paired-loading') mockGetPetTracking.mockReturnValue(pending<PetTrackingState>());
      else if (state === 'paired-unknown') mockGetPetTracking.mockResolvedValue({ kind: 'error' });
      else mockGetPetTracking.mockResolvedValue({ kind: 'ok', tracked: state === 'paired-tracked' });
    }
    if (state === 'ready') mockClaimDevice.mockResolvedValue({ kind: 'ok', device: makeDevice() });
    if (state === 'claim-error') mockClaimDevice.mockResolvedValue({ kind: 'invalid' });
    await renderPairing();
    if (state === 'ready' || state === 'claim-error') {
      await fireEvent.changeText(await screen.findByTestId('activation-code-input'), 'ACT-001');
      await fireEvent.press(screen.getByTestId('pairing-submit'));
    }
    await screen.findByTestId(anchor);
    expect(screen.queryByTestId('pairing-subtitle', { includeHiddenElements: true })).toBeNull();
  });

  it.each(['linking', 'paired'] as const)('#188 R10: uses 20 px horizontal padding when %s (enmendado por #203 R2)', async (state) => {
    if (state === 'paired') {
      mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ device: makeDevice() })] });
      mockGetPetTracking.mockResolvedValue({ kind: 'ok', tracked: true });
    }
    await renderPairing();
    await screen.findByTestId(state === 'paired' ? 'device-status-card' : 'pairing-title');
    expect(screen.getByTestId('pairing-form').props.contentContainerStyle).toEqual({
      paddingHorizontal: 20,
      paddingTop: 48,
      paddingBottom: 48,
      gap: 16,
      flexGrow: 1,
    });
  });

  it.each([
    ['tracked', 'plan-tracked'],
    ['free', 'plan-free'],
    ['unknown', 'plan-unknown'],
    ['ready', 'pairing-ready'],
    ['no-pets', 'pairing-no-pets'],
  ] as const)('#188 R14: preserves %s without the linking hero', async (state, anchor) => {
    const paired = state === 'tracked' || state === 'free' || state === 'unknown';
    if (paired) {
      mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ device: makeDevice() })] });
      mockGetPetTracking.mockResolvedValue(state === 'unknown' ? { kind: 'error' } : { kind: 'ok', tracked: state === 'tracked' });
    }
    if (state === 'no-pets') mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    if (state === 'ready') mockClaimDevice.mockResolvedValue({ kind: 'ok', device: makeDevice() });
    await renderPairing();
    if (state === 'ready') {
      await fireEvent.changeText(await screen.findByTestId('activation-code-input'), 'ACT-001');
      await fireEvent.press(screen.getByTestId('pairing-submit'));
    }
    expect(await screen.findByTestId(anchor)).toBeOnTheScreen();
    if (paired) {
      expect(screen.getByTestId('device-status-card')).toBeOnTheScreen();
      expect(screen.getByTestId('device-unpair')).toBeOnTheScreen();
    }
    for (const testID of ['pairing-pingo', 'pairing-ring-0', 'pairing-ring-1', 'pairing-pingo-float']) {
      expect(screen.queryByTestId(testID, { includeHiddenElements: true })).toBeNull();
    }
  });

});

describe('#203 R2: cabecera de pairing', () => {
  const states = ['carga', 'error', 'sin mascotas', 'vincular', 'con collar'] as const;
  const anchors: Record<(typeof states)[number], string> = {
    carga: 'pairing-skeleton',
    error: 'pairing-error-pets',
    'sin mascotas': 'pairing-no-pets',
    vincular: 'pairing-title',
    'con collar': 'device-status-card',
  };

  async function renderState(state: (typeof states)[number]) {
    if (state === 'carga') mockListPets.mockReturnValue(pending<PetsState>());
    if (state === 'error') mockListPets.mockResolvedValue({ kind: 'error' });
    if (state === 'sin mascotas') mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    if (state === 'con collar') {
      mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ device: makeDevice() })] });
      mockGetPetTracking.mockResolvedValue({ kind: 'ok', tracked: true });
    }
    await renderPairing();
    await screen.findByTestId(anchors[state]);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReducedMotion.mockReturnValue(false);
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  afterEach(() => {
    (Platform as { OS: string }).OS = originalOS;
  });

  it.each(states)('#203 R2.1: pinta la cabecera en %s', async (state) => {
    await renderState(state);
    const form = screen.getByTestId('pairing-form');
    const header = within(form).getByTestId('pairing-header');
    const content = header.parent!;
    expect(content.parent!.props.testID).toBe('pairing-form');
    const first = content.children[0];
    expect(typeof first === 'string' ? first : first.props.testID).toBe('pairing-header');
    expect(within(header).getByTestId('pairing-header-back')).toBeOnTheScreen();
  });

  it('#203 R2.1: la celebración no pinta la cabecera', async () => {
    mockClaimDevice.mockResolvedValue({ kind: 'ok', device: makeDevice() });
    await renderPairing();
    await fireEvent.changeText(await screen.findByTestId('activation-code-input'), 'ACT-001');
    expect(screen.getByTestId('pairing-header')).toBeOnTheScreen();
    await fireEvent.press(screen.getByTestId('pairing-submit'));
    await screen.findByTestId('pairing-ready');
    expect(screen.queryByTestId('pairing-header')).toBeNull();
    expect(screen.queryByTestId('pairing-header-back')).toBeNull();
  });

  it('#203 R2.2: el avatar de la mascota es el accesorio de la cabecera', async () => {
    await renderState('vincular');
    expect(within(screen.getByTestId('pairing-header')).getByTestId('pairing-pet-avatar')).toBeOnTheScreen();
    expect(screen.queryByTestId('pairing-pet-row')).toBeNull();
  });

  it('#203 R2.3: con collar la cabecera no lleva accesorio', async () => {
    await renderState('con collar');
    const header = screen.getByTestId('pairing-header');
    expect(header.children).toHaveLength(2);
    expect(within(header).queryByTestId('pairing-pet-avatar')).toBeNull();
  });

  it.each(states)('#203 R2.4: métricas uniformes sin cabecera nativa en %s', async (state) => {
    await renderState(state);
    expect(screen.getByTestId('pairing-form').props.contentContainerStyle).toEqual({
      paddingHorizontal: 20,
      paddingTop: 48,
      paddingBottom: 48,
      gap: 16,
      flexGrow: 1,
    });
  });

  it('#203 R2.4: con teclado de 200 el host añade paddingBottom 200', async () => {
    (Platform as { OS: string }).OS = 'android';
    mockListPets.mockReturnValue(pending<PetsState>());
    await renderPairing();

    const host = screen.getByTestId('screen-pairing');
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
    await waitFor(() => expect(screen.getByTestId('screen-pairing')).toHaveStyle({ paddingBottom: 200 }));
  });
});

describe('#203 R3: entrada de la vista de vincular', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReducedMotion.mockReturnValue(false);
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
  });

  it.each([
    ['pairing-hero-group', 0, 'pairing-hero-rise', 'items-center gap-2.5'],
    ['pairing-plan-icon', 80, 'pairing-plan-rise', 'flex-row items-start gap-2.5 rounded-tile bg-default px-3.5 py-3'],
    ['pairing-activation-code-label', 140, 'pairing-code-rise', 'gap-1.5'],
  ] as const)('#203 R3: %s entra con RiseIn %i', async (anchorId, delayMs, riseId, wrappedClassName) => {
    await renderPairing();
    await screen.findByTestId(anchorId);
    expect(screen.getAllByTestId(riseId)).toHaveLength(1);
    const rise = screen.getByTestId(riseId);
    expect(rise.props.delayMs).toBe(delayMs);
    expect(within(rise).getByTestId(anchorId)).toBeOnTheScreen();
    expect(rise.children).toHaveLength(1);
    const wrapped = rise.children[0];
    expect(typeof wrapped === 'string' ? wrapped : wrapped.props.className).toBe(wrappedClassName);
  });
});

describe('#203 R4: título y tarjeta de la vista con collar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReducedMotion.mockReturnValue(false);
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ device: makeDevice() })] });
    mockGetPetTracking.mockResolvedValue({ kind: 'ok', tracked: true });
  });

  it('#203 R4.1: el título de la vista con collar es 28/900 y entra en 0', async () => {
    await renderPairing();
    const title = await screen.findByTestId('device-title');
    expect(title.props.className).toBe('mt-2 text-28 font-black tracking-title text-foreground');
    expect(title).toHaveTextContent('Dispositivo GPS');
    expect(screen.getAllByTestId('device-title-rise')).toHaveLength(1);
    const rise = screen.getByTestId('device-title-rise');
    expect(rise.props.delayMs).toBe(0);
    expect(within(rise).getByTestId('device-title')).toBeOnTheScreen();
    expect(rise.children).toHaveLength(1);
  });

  it('#203 R4.2: la tarjeta de estado lleva radio 22, sombra card y entra en 80', async () => {
    const { result } = await renderHook(() => useShadows());
    await renderPairing();
    const card = await screen.findByTestId('device-status-card');
    const classes = (card.props.className as string).split(' ');
    expect(classes).toEqual(expect.arrayContaining(['rounded-22', 'px-4', 'py-4.5', 'shadow-none']));
    expect(classes).not.toContain('shadow-sm');
    expect(card.props.style).toMatchObject(result.current.card);
    expect(screen.getAllByTestId('device-status-rise')).toHaveLength(1);
    const rise = screen.getByTestId('device-status-rise');
    expect(rise.props.delayMs).toBe(80);
    expect(within(rise).getByTestId('device-status-card')).toBeOnTheScreen();
    expect(rise.children).toHaveLength(1);
  });

  it.each([
    ['device-model', 'device-model'],
    ['device-battery', 'device-battery'],
    ['device-connectivity', 'device-connectivity'],
    ['device-last-message', 'device-last-message'],
    ['device-esn', 'device-esn'],
  ] as const)('#203 R4.3: %s pinta raíz y etiqueta del canvas', async (_name, testID) => {
    await renderPairing();
    const value = await screen.findByTestId(testID);
    const row = value.parent;
    expect(row?.props.className).toBe('flex-row items-baseline justify-between gap-3');
    expect(row?.children).toHaveLength(2);
    const label = row?.children[0];
    expect(typeof label === 'string' ? label : label?.props.className).toBe('text-sm text-muted');
  });

  it.each([
    ['device-battery con número', 'text-accent-strong', 'device-battery', { batteryPct: 82 }],
    ['device-battery nula', 'text-foreground', 'device-battery', { batteryPct: null }],
    ['device-connectivity online', 'text-accent-strong', 'device-connectivity', { connectivity: 'online' }],
    ['device-connectivity offline', 'text-foreground', 'device-connectivity', { connectivity: 'offline' }],
    ['device-connectivity desconocida', 'text-foreground', 'device-connectivity', { connectivity: 'LTE' }],
    ['device-model', 'text-foreground', 'device-model', {}],
    ['device-last-message', 'text-foreground', 'device-last-message', {}],
    ['device-esn', 'font-mono tracking-mono text-foreground', 'device-esn', {}],
  ] as const)('#203 R4.3: %s pinta su valor en %s', async (_name, tone, testID, override) => {
    mockListPets.mockResolvedValue({
      kind: 'ok',
      pets: [makePet({ device: makeDevice({ ...override }) })],
    });
    await renderPairing();
    const value = await screen.findByTestId(testID);
    expect(value.props.className).toBe(`shrink text-right text-15 font-extrabold ${tone}`);
  });
});

describe('#203 R5: píldora de rastreo y entrada del plan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReducedMotion.mockReturnValue(false);
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ device: makeDevice() })] });
    mockGetPetTracking.mockResolvedValue({ kind: 'ok', tracked: true });
  });

  it('#203 R5: la píldora de rastreo es 36 con punto y verde fuerte', async () => {
    await renderPairing();
    const pill = await screen.findByTestId('plan-tracked');
    expect(pill.props.className).toBe('h-9 flex-row items-center gap-2 self-start rounded-full bg-tab-pill px-3.5');
    expect(pill.children).toHaveLength(2);
    const dot = pill.children[0];
    expect(typeof dot === 'string' ? dot : dot.props.testID).toBe('plan-tracked-dot');
    expect(typeof dot === 'string' ? dot : dot.props.className).toBe('size-2 rounded-full bg-accent');
    const label = pill.children[1];
    expect(typeof label === 'string' ? label : label.props.className).toBe('text-sm font-bold text-accent-strong');
    expect(within(pill).getByText('Rastreo GPS activo')).toBeOnTheScreen();
  });

  it.each([
    ['plan-skeleton', () => pending<PetTrackingState>()],
    ['plan-tracked', () => Promise.resolve<PetTrackingState>({ kind: 'ok', tracked: true })],
    ['plan-free', () => Promise.resolve<PetTrackingState>({ kind: 'ok', tracked: false })],
    ['plan-unknown', () => Promise.resolve<PetTrackingState>({ kind: 'error' })],
  ] as const)('#203 R5: %s entra con RiseIn 140', async (planId, load) => {
    mockGetPetTracking.mockReturnValue(load());
    await renderPairing();
    await screen.findByTestId(planId);
    expect(screen.getAllByTestId('device-plan-rise')).toHaveLength(1);
    const rise = screen.getByTestId('device-plan-rise');
    expect(rise.props.delayMs).toBe(140);
    expect(within(rise).getByTestId(planId)).toBeOnTheScreen();
    expect(rise.children).toHaveLength(1);
  });
});

describe('#203 R6: botón de desvincular', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReducedMotion.mockReturnValue(false);
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ device: makeDevice() })] });
    mockGetPetTracking.mockResolvedValue({ kind: 'ok', tracked: true });
  });

  it('#203 R6: desvincular es 54, radio 16, labio rojo y va al fondo', async () => {
    const { result } = await renderHook(() => useChunkyLip());
    await renderPairing();
    const button = await screen.findByTestId('device-unpair');
    const classes = (button.props.className as string).split(' ');
    expect(classes.slice(-4)).toEqual(['h-13.5', 'w-full', 'rounded-16', 'bg-danger']);
    expect(classes).not.toContain('min-h-11');
    expect(classes).not.toContain('rounded-xl');
    expect(button).toHaveStyle(result.current.danger);
    const label = screen.getByText('Desvincular collar');
    expect((label.props.className as string).split(' ').slice(-3)).toEqual(['text-base', 'font-extrabold', 'text-accent-foreground']);
    const spacer = screen.getByTestId('device-unpair-spacer');
    expect(spacer.props.className).toBe('flex-1');
    const container = button.parent!;
    expect(container === spacer.parent).toBe(true);
    const siblings = container.children;
    expect(siblings[siblings.indexOf(button) - 1] === spacer).toBe(true);
    expect(container.props.className).toBe('gap-4');
    expect(container).toHaveStyle({ flexGrow: 1 });
  });
});

describe('#203 R7: hoja de desvincular', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListPets.mockReset();
    mockUseReducedMotion.mockReturnValue(false);
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ device: makeDevice() })] });
    mockGetPetTracking.mockResolvedValue({ kind: 'ok', tracked: true });
    mockReleaseDevice.mockResolvedValue({ kind: 'error' });
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  async function openUnpairSheet() {
    await renderPairing();
    await screen.findByTestId('device-status-card');
    await fireEvent.press(screen.getByTestId('device-unpair'));
    return screen.findByTestId('pairing-unpair-sheet');
  }

  async function pressConfirm() {
    await fireEvent.press(screen.getByTestId('pairing-unpair-confirm'));
  }

  function testIdOf(node: string | { props: { testID?: string } }) {
    return typeof node === 'string' ? node : node.props.testID;
  }

  it('#203 R7.1: la hoja de desvincular está cerrada por defecto', async () => {
    await renderPairing();
    await screen.findByTestId('device-status-card');
    const host = screen.getByTestId('pairing-unpair-host');
    const root = screen.getByTestId('screen-pairing');
    expect(root.children[root.children.length - 1] === host).toBe(true);
    expect(screen.queryByTestId('community-bottom-sheet')).toBeNull();
    expect(screen.queryByTestId('pairing-unpair-sheet')).toBeNull();
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('#203 R7.2: desvincular abre la hoja con su anatomía y sin diálogo nativo', async () => {
    const { result } = await renderHook(() => useChunkyLip());
    const sheet = await openUnpairSheet();

    expect(Alert.alert).not.toHaveBeenCalled();
    const host = screen.getByTestId('pairing-unpair-host');
    const community = within(host).getByTestId('community-bottom-sheet');
    expect(community.props.index).toBe(0);
    expect(community.props.enablePanDownToClose).toBe(true);
    expect(community.props.snapPoints).toEqual(['50%', '100%']);
    expect(typeof community.props.onClose).toBe('function');
    expect(within(community).getByTestId('pairing-unpair-sheet') === sheet).toBe(true);
    expect(sheet.props.className).toBe('items-center gap-3 bg-surface px-5 pb-9 pt-3');
    expect(sheet.children.map(testIdOf)).toEqual([
      'pairing-unpair-icon',
      'pairing-unpair-title',
      'pairing-unpair-body',
      'pairing-unpair-confirm',
      'pairing-unpair-cancel',
    ]);

    const icon = screen.getByTestId('pairing-unpair-icon');
    expect(icon.props.className).toBe('size-14 items-center justify-center rounded-full bg-category-rose');
    const glyph = within(icon).getByTestId('icon-link-broken');
    expect(glyph.props.size).toBe(26);
    expect(glyph.props.strokeWidth).toBe(2.2);
    expect(glyph.props.color).toBe('color:danger');

    const title = screen.getByTestId('pairing-unpair-title');
    expect(title.props.className).toBe('text-center text-xl font-black text-foreground');
    expect(title).toHaveTextContent('¿Desvincular collar?', { exact: true });
    const body = screen.getByTestId('pairing-unpair-body');
    expect(body.props.className).toBe('max-w-80 text-center text-sm leading-note text-muted');
    expect(body).toHaveTextContent(
      'El historial de ubicaciones se conserva, pero el rastreo en vivo se detiene hasta que vincules otro collar.',
      { exact: true },
    );

    const confirm = screen.getByTestId('pairing-unpair-confirm');
    expect((confirm.props.className as string).split(' ').slice(-4)).toEqual(['w-full', 'h-13.5', 'rounded-16', 'bg-danger']);
    expect(confirm).toHaveStyle(result.current.danger);
    const confirmLabel = within(confirm).getByText('Desvincular');
    expect(confirmLabel.props.className).toBe('text-base font-extrabold text-danger-foreground');

    const cancel = screen.getByTestId('pairing-unpair-cancel');
    expect((cancel.props.className as string).split(' ').slice(-6)).toEqual([
      'w-full', 'h-13.5', 'rounded-16', 'border-2', 'border-lip-gray', 'bg-surface',
    ]);
    expect(cancel).toHaveStyle(result.current.neutral);
    const cancelLabel = within(cancel).getByText('Cancelar');
    expect(cancelLabel.props.className).toBe('text-base font-extrabold text-foreground');
  });

  it('#203 R7.3: Cancelar cierra sin liberar', async () => {
    await openUnpairSheet();

    await fireEvent.press(screen.getByTestId('pairing-unpair-cancel'));

    await waitFor(() => expect(screen.queryByTestId('pairing-unpair-sheet')).toBeNull());
    expect(mockReleaseDevice).not.toHaveBeenCalled();
    expect(screen.getByTestId('device-unpair')).toBeOnTheScreen();
  });

  it('#203 R7.3: cerrar con el gesto no libera', async () => {
    await openUnpairSheet();

    await act(async () => {
      (screen.getByTestId('community-bottom-sheet').props.onClose as () => void)();
    });

    await waitFor(() => expect(screen.queryByTestId('pairing-unpair-sheet')).toBeNull());
    expect(mockReleaseDevice).not.toHaveBeenCalled();
    expect(screen.getByTestId('device-unpair')).toBeOnTheScreen();
  });

  it.each<ReleaseDeviceState>([{ kind: 'ok' }, { kind: 'not-assigned' }])(
    '#203 R7.4: confirma, refresca y vuelve al formulario tras $kind',
    async (state) => {
      mockReleaseDevice.mockResolvedValue(state);
      mockListPets
        .mockResolvedValueOnce({ kind: 'ok', pets: [makePet({ device: makeDevice() })] })
        .mockResolvedValueOnce({ kind: 'ok', pets: [makePet()] });
      await openUnpairSheet();

      await pressConfirm();

      expect(await screen.findByTestId('activation-code-input')).toBeVisible();
      await waitFor(() => expect(screen.queryByTestId('pairing-unpair-sheet')).toBeNull());
      expect(mockReleaseDevice).toHaveBeenCalledTimes(1);
      expect(mockReleaseDevice).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1');
      expect(mockListPets).toHaveBeenCalledTimes(2);
    },
  );

  it.each<{ kind: string; state: ReleaseDeviceState; message: string }>([
    { kind: 'forbidden', state: { kind: 'forbidden' }, message: 'Solo el dueño puede desvincular el collar.' },
    { kind: 'unreachable', state: { kind: 'unreachable', message: 'offline' }, message: 'No se pudo conectar con el servidor' },
    { kind: 'error', state: { kind: 'error' }, message: 'Algo salió mal' },
    { kind: 'missing-config', state: { kind: 'missing-config' }, message: 'Algo salió mal' },
  ])('#203 R7.5: muestra el error exacto para $kind', async ({ state, message }) => {
    mockReleaseDevice.mockResolvedValue(state);
    await openUnpairSheet();

    await pressConfirm();

    const error = await screen.findByTestId('pairing-error');
    expect(error).toHaveTextContent(message, { exact: true });
    expect(error.props.selectable).toBe(true);
    await waitFor(() => expect(screen.queryByTestId('pairing-unpair-sheet')).toBeNull());
  });

  it('#203 R7.6: unauthorized cierra sesión sin error local', async () => {
    const signOut = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut,
    } satisfies AuthContextValue);
    mockReleaseDevice.mockResolvedValue({ kind: 'unauthorized' });
    await openUnpairSheet();

    await pressConfirm();

    await waitFor(() => expect(screen.queryByTestId('pairing-unpair-sheet')).toBeNull());
    expect(signOut).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('pairing-error')).toBeNull();
    expect(screen.getByTestId('device-unpair')).not.toBeDisabled();
  });

  it('#203 R7.7: desvincular y confirmar quedan deshabilitados en vuelo', async () => {
    let resolveRelease!: (state: ReleaseDeviceState) => void;
    mockReleaseDevice.mockReturnValue(
      new Promise((resolve) => {
        resolveRelease = resolve;
      }),
    );
    await openUnpairSheet();
    expect(screen.getByTestId('pairing-unpair-confirm')).not.toBeDisabled();

    await pressConfirm();

    await waitFor(() => {
      expect(screen.getByTestId('device-unpair')).toBeDisabled();
      expect(screen.getByTestId('pairing-unpair-confirm')).toBeDisabled();
    });
    await act(async () => {
      resolveRelease({ kind: 'error' });
    });
    await waitFor(() => expect(screen.getByTestId('device-unpair')).not.toBeDisabled());
  });

  it('#203 R7.8: la hoja en inglés', async () => {
    await renderWithProviders(
      <LanguageProvider initial="en"><PairingRoute /></LanguageProvider>,
      { wrapper: PairingWrapper },
    );
    await screen.findByTestId('device-status-card');
    await fireEvent.press(screen.getByTestId('device-unpair'));

    await screen.findByTestId('pairing-unpair-sheet');
    expect(screen.getByTestId('pairing-unpair-title')).toHaveTextContent('Unpair collar?', { exact: true });
    expect(screen.getByTestId('pairing-unpair-body')).toHaveTextContent(
      'Location history stays, but live tracking stops until you pair a collar again.',
      { exact: true },
    );
    expect(within(screen.getByTestId('pairing-unpair-confirm')).getByText('Unpair')).toBeOnTheScreen();
    expect(within(screen.getByTestId('pairing-unpair-cancel')).getByText('Cancel')).toBeOnTheScreen();
  });
});
