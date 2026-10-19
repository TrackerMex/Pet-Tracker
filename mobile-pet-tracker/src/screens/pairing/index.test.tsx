import { HeaderHeightContext } from 'expo-router/react-navigation';
import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { notificationAsync } from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { Alert, DeviceEventEmitter, Platform } from 'react-native';
import { getAnimatedStyle } from 'react-native-reanimated/src/jestUtils';

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
import { SelectedPetProvider } from '../../providers/selected-pet-provider';
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
  router: { push: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
  useFocusEffect: jest.fn(),
  useIsFocused: () => true,
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
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

function PairingWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial="es">
        <SelectedPetProvider>
          <HeaderHeightContext.Provider value={91}>
            {children}
          </HeaderHeightContext.Provider>
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

    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));

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

  it('renders the real route with uniform metrics and a dimensioned skeleton (#95 R6)', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderPairing();

    expect(screen.getByTestId('screen-pairing')).toBeVisible();
    expect(screen.getByTestId('pairing-form').props.contentContainerStyle).toEqual({
      padding: 24,
      gap: 16,
      paddingBottom: 48,
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
      pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })],
    });

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
    await waitFor(() =>
      expect(
        screen.getByTestId('pet-chip-pet-1').props.accessibilityState,
      ).toEqual({ selected: true }),
    );
    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));
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

describe('R9: desvincular pide confirmación nativa, libera el collar y vuelve al formulario', () => {
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
    mockReleaseDevice.mockResolvedValue({ kind: 'error' });
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function getAlertButton(label: string) {
    return jest
      .mocked(Alert.alert)
      .mock.calls[0]?.[2]?.find(({ text }) => text === label);
  }

  async function openUnpairAlert() {
    await renderPairing();
    await screen.findByTestId('device-status-card');
    await fireEvent.press(screen.getByTestId('device-unpair'));
  }

  it('opens the exact native confirmation and Cancel does not release', async () => {
    await openUnpairAlert();

    expect(Alert.alert).toHaveBeenCalledWith(
      '¿Desvincular collar?',
      'El historial de ubicaciones se conserva, pero el rastreo en vivo se detiene hasta que vincules otro collar.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desvincular',
          style: 'destructive',
          onPress: expect.any(Function),
        },
      ],
    );
    getAlertButton('Cancelar')?.onPress?.();
    expect(mockReleaseDevice).not.toHaveBeenCalled();
  });

  it.each<ReleaseDeviceState>([{ kind: 'ok' }, { kind: 'not-assigned' }])(
    'refreshes pets and returns to the form after $kind',
    async (state) => {
      mockReleaseDevice.mockResolvedValue(state);
      mockListPets
        .mockResolvedValueOnce({
          kind: 'ok',
          pets: [makePet({ device: makeDevice() })],
        })
        .mockResolvedValueOnce({ kind: 'ok', pets: [makePet()] });
      await openUnpairAlert();

      await act(async () => {
        getAlertButton('Desvincular')?.onPress?.();
        await Promise.resolve();
      });

      expect(mockReleaseDevice).toHaveBeenCalledTimes(1);
      expect(mockReleaseDevice).toHaveBeenCalledWith(
        apiUrl,
        'jwt-token',
        'pet-1',
      );
      expect(await screen.findByTestId('activation-code-input')).toBeVisible();
      expect(mockListPets).toHaveBeenCalledTimes(2);
    },
  );

  it.each<[ReleaseDeviceState, string]>([
    [{ kind: 'forbidden' }, 'Solo el dueño puede desvincular el collar.'],
    [{ kind: 'unreachable', message: 'offline' }, 'No se pudo conectar con el servidor'],
    [{ kind: 'error' }, 'Algo salió mal'],
    [{ kind: 'missing-config' }, 'Algo salió mal'],
  ])('shows the exact error for $kind', async (state, message) => {
    mockReleaseDevice.mockResolvedValue(state);
    await openUnpairAlert();

    await act(async () => {
      getAlertButton('Desvincular')?.onPress?.();
      await Promise.resolve();
    });

    const error = await screen.findByTestId('pairing-error');
    expect(error).toHaveTextContent(message);
    expect(error.props.selectable).toBe(true);
  });

  it('signs out for unauthorized without showing a local error (#72 R2)', async () => {
    const signOut = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut,
    } satisfies AuthContextValue);
    mockReleaseDevice.mockResolvedValue({ kind: 'unauthorized' });
    await openUnpairAlert();

    await act(async () => {
      getAlertButton('Desvincular')?.onPress?.();
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(screen.getByTestId('device-unpair')).not.toBeDisabled(),
    );
    expect(signOut).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('pairing-error')).toBeNull();
  });

  it('disables unpair while the release request is in flight', async () => {
    let resolveRelease!: (state: ReleaseDeviceState) => void;
    mockReleaseDevice.mockReturnValue(
      new Promise((resolve) => {
        resolveRelease = resolve;
      }),
    );
    await openUnpairAlert();

    await act(async () => {
      getAlertButton('Desvincular')?.onPress?.();
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(screen.getByTestId('device-unpair')).toBeDisabled(),
    );
    await act(async () => {
      resolveRelease({ kind: 'error' });
    });
    await waitFor(() =>
      expect(screen.getByTestId('device-unpair')).not.toBeDisabled(),
    );
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

describe('#95 R5: la pantalla no dibuja cabecera propia', () => {
  it('retira el botón de volver del cuerpo', async () => {
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() });
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });
    await renderPairing();
    await waitFor(() => expect(screen.getByTestId('screen-pairing')).toBeVisible());
    expect(screen.queryByTestId(['pairing', 'back'].join('-'))).toBeNull();
  });
});

describe('#148 R6: pairing se aparta del teclado en Android', () => {
  afterEach(() => {
    (Platform as { OS: string }).OS = originalOS;
  });

  it('el host screen-pairing añade paddingBottom 291 al abrir el teclado', async () => {
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
    await waitFor(() => expect(screen.getByTestId('screen-pairing')).toHaveStyle({ paddingBottom: 291 }));
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
    const texts = within(form).getAllByText(/\S/);
    expect(texts[0].props.testID).toBe('pairing-title');
  });

  it('#188 R7: gives the title the 24 px token and black weight', async () => {
    await renderPairing();
    const title = await screen.findByTestId('pairing-title');
    expect(title.props.className.split(' ')).toEqual(expect.arrayContaining(['text-24', 'font-black']));
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

});
