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

import { claimDevice } from '../../api/devices';
import { listPets, type PetsState } from '../../api/pets';
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
});
