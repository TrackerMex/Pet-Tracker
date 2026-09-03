import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { router, useFocusEffect } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';

import { claimDevice, type ClaimDeviceState } from '../../api/devices';
import { listPets, type PetsState } from '../../api/pets';
import {
  getPetTracking,
  type PetTrackingState,
} from '../../api/subscriptions';
import type { PetProfile } from '../../api/types';
import PairingRoute from '../../app/(tabs)/pairing';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { SelectedPetProvider } from '../../providers/selected-pet-provider';

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
  router: { push: jest.fn(), back: jest.fn() },
  useFocusEffect: jest.fn(),
  useIsFocused: () => true,
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const apiUrl = 'http://example.test/v1';
const mockClaimDevice = jest.mocked(claimDevice);
const mockGetPetTracking = jest.mocked(getPetTracking);
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
      <SelectedPetProvider>{children}</SelectedPetProvider>
    </HeroUINativeProvider>
  );
}

async function renderPairing() {
  return render(<PairingRoute />, { wrapper: PairingWrapper });
}

describe('R4: /pairing monta dentro de (tabs) con selector de mascota y estados de carga', () => {
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

  it('renders the real route with uniform metrics and a dimensioned skeleton', async () => {
    mockListPets.mockReturnValue(pending<PetsState>());

    await renderPairing();

    expect(screen.getByTestId('screen-pairing')).toBeVisible();
    expect(screen.getByTestId('screen-pairing').props.contentContainerStyle).toEqual({
      padding: 24,
      gap: 16,
      paddingTop: 52,
      paddingBottom: 120,
    });
    expect(screen.getByTestId('pairing-skeleton')).toBeVisible();
    expect(screen.getAllByTestId(/^pairing-content-skeleton-/)).toHaveLength(3);
    expect(mockListPets).toHaveBeenCalledWith(apiUrl, 'jwt-token');
  });

  it('goes back from the screen header', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });

    await renderPairing();
    await fireEvent.press(screen.getByTestId('pairing-back'));

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
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
      'Something went wrong',
    );
    await fireEvent.press(screen.getByTestId('pairing-retry'));

    expect(await screen.findByTestId('pairing-no-pets')).toHaveTextContent(
      'Add a pet first',
    );
    expect(mockListPets).toHaveBeenCalledTimes(2);
  });

  it('shows the empty state when the account has no pets', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });

    await renderPairing();

    expect(await screen.findByTestId('pairing-no-pets')).toHaveTextContent(
      'Add a pet first',
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

    expect(await screen.findAllByText('Pair collar')).toHaveLength(2);
    expect(screen.getByTestId('pairing-plan-free')).toHaveTextContent(
      'Free plan — health only. Pair a collar with an active plan to see the map.',
    );
    expect(screen.getByText('Activation code')).toBeVisible();
    expect(screen.getByText('Printed on the collar box')).toBeVisible();
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
      'Invalid activation code. Check the code printed on the box.',
    ],
    [
      { kind: 'invalid' },
      'Invalid activation code. Check the code printed on the box.',
    ],
    [
      { kind: 'already-claimed' },
      'This collar is already paired to another pet.',
    ],
    [
      { kind: 'pet-has-device' },
      'This pet already has a collar. Unpair it first.',
    ],
    [
      { kind: 'subscription-required' },
      'This collar has no active plan. Contact support to activate it.',
    ],
    [{ kind: 'forbidden' }, 'Only the owner can pair a collar.'],
    [{ kind: 'unreachable', message: 'offline' }, 'Cannot reach server'],
    [{ kind: 'error' }, 'Something went wrong'],
    [{ kind: 'missing-config' }, 'Something went wrong'],
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

  it('signs out for unauthorized without showing an error message', async () => {
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

    await waitFor(() => expect(signOut).toHaveBeenCalledTimes(1));
    expect(screen.queryByTestId('pairing-error')).toBeNull();
  });
});

describe('R7: tras el 201 muestra "Tracker is ready" con el collar y sus CTAs', () => {
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

    expect(screen.getByText('Tracker is ready')).toBeVisible();
    expect(
      screen.getByText("Luna's collar is paired. GPS tracking is on."),
    ).toBeVisible();
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

    expect(mockRouter.push).toHaveBeenCalledWith('/map');
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

    expect(await screen.findByText('GPS device')).toBeVisible();
    expect(screen.getByTestId('device-status-card')).toBeVisible();
    expect(screen.getByTestId('device-model')).toHaveTextContent('TrailTag Pro');
    expect(screen.getByTestId('device-battery')).toHaveTextContent('82%');
    expect(screen.getByTestId('device-connectivity')).toHaveTextContent('LTE');
    expect(screen.getByTestId('device-last-message')).toHaveTextContent(
      new Date('2026-09-03T10:00:00.000Z').toLocaleString(),
    );
    expect(screen.getByTestId('device-esn')).toHaveTextContent('ESN-4242');
    expect(mockGetPetTracking).toHaveBeenCalledWith(
      apiUrl,
      'jwt-token',
      'pet-1',
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
      'No messages yet',
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
      'GPS tracking active',
    );
  });

  it('shows the exact free-plan note when tracking is not active', async () => {
    mockGetPetTracking.mockResolvedValue({ kind: 'ok', tracked: false });

    await renderPairing();

    expect(await screen.findByTestId('plan-free')).toHaveTextContent(
      'Free plan — health only. This collar has no active plan.',
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
      'Plan status unavailable',
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
