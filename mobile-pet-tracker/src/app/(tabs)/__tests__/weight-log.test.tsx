import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { router, useFocusEffect } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect } from 'react';

import {
  createWeight,
  listWeights,
  type CreateWeightState,
  type WeightsState,
} from '../../../api/health-records';
import { healthKeys } from '../../../api/query-keys';
import type { WeightEntry } from '../../../api/types';
import { getMe, type ProfileResponse } from '../../../api/users';
import { useAuth, type AuthContextValue } from '../../../providers/auth-provider';
import { LanguageProvider } from '../../../providers/language-provider';
import {
  SelectedPetProvider,
  useSelectedPet,
} from '../../../providers/selected-pet-provider';
import WeightLogScreen from '../weight-log';
import { TOUCH_SLOP } from '../../../theme/touch-target';
import { renderWithProviders } from '../../../../test/render-with-providers';

jest.mock('../../../api/health-records', () => ({
  createWeight: jest.fn(),
  listWeights: jest.fn(),
}));

jest.mock('../../../api/users', () => ({
  getMe: jest.fn(),
}));

jest.mock('../../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    router: { push: jest.fn(), back: jest.fn() },
    useFocusEffect: jest.fn(),
    Redirect: ({ href }: { href: string }) => {
      const props = { testID: 'weight-log-redirect', href };

      return React.createElement(View, props);
    },
  };
});

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const apiUrl = 'http://example.test/v1';
const mockCreateWeight = jest.mocked(createWeight);
const mockListWeights = jest.mocked(listWeights);
const mockGetMe = jest.mocked(getMe);
const mockUseAuth = jest.mocked(useAuth);
const mockUseFocusEffect = jest.mocked(useFocusEffect);
const mockRouter = jest.mocked(router);

function makeWeight(overrides: Partial<WeightEntry> = {}): WeightEntry {
  return {
    id: 'weight-1',
    petId: 'pet-1',
    weightKg: 12.4,
    measuredAt: '2026-08-21',
    bodyCondition: 5,
    variation: 0.4,
    ...overrides,
  };
}

function makeProfile(timezone: string): ProfileResponse {
  return {
    id: 'user-1',
    email: 'owner@example.test',
    firstName: 'Ada',
    lastName: 'Lovelace',
    phone: '+525500000000',
    country: 'MX',
    timezone,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

function deviceTodayIso(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

beforeEach(() => {
  mockGetMe.mockResolvedValue({
    kind: 'ok',
    me: makeProfile('Pacific/Kiritimati'),
  });
});

function SelectionProbe() {
  const { selectPet } = useSelectedPet();

  useEffect(() => {
    selectPet('pet-1');
  }, [selectPet]);

  return null;
}

async function renderWeightLog(selected = true) {
  return renderWithProviders(
    <HeroUINativeProvider>
      <LanguageProvider initial="es">
        <SelectedPetProvider>
          {selected ? <SelectionProbe /> : null}
          <WeightLogScreen />
        </SelectedPetProvider>
      </LanguageProvider>
    </HeroUINativeProvider>,
  );
}

async function blurScreen() {
  await act(() => {
    mockUseFocusEffect.mock.calls.forEach(([effect]) => {
      const cleanup = effect();

      if (typeof cleanup === 'function') cleanup();
    });
  });
}

describe('R3: el formulario vuelve a sus valores iniciales al perder el foco', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-17T23:30:00Z'));
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });
    mockCreateWeight.mockReturnValue(pending());
  });

  afterEach(() => jest.useRealTimers());

  it('restaura los cuatro valores visibles tras el blur (#90 R3)', async () => {
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());

    await fireEvent.changeText(
      screen.getByTestId('weight-input'),
      'not-a-number',
    );
    await fireEvent.changeText(
      screen.getByTestId('weight-date-input'),
      '2026-01-02',
    );
    await fireEvent.changeText(screen.getByTestId('weight-bc-input'), '7');
    await fireEvent.press(screen.getByTestId('weight-submit'));
    expect(screen.getByTestId('weight-form-error')).toBeVisible();

    await blurScreen();

    await waitFor(() => {
      expect(screen.getByTestId('weight-input').props.value).toBe('');
      expect(screen.getByTestId('weight-date-input').props.value).toBe('2026-09-18');
      expect(screen.getByTestId('weight-bc-input').props.value).toBe('');
      expect(screen.queryByTestId('weight-form-error')).toBeNull();
    });
  });
});

describe('R7: weight log lista el historial', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateWeight.mockReturnValue(pending());
  });

  it('redirects a cold deep-link without a selected pet', async () => {
    mockListWeights.mockReturnValue(pending<WeightsState>());

    await renderWeightLog(false);

    expect(screen.getByTestId('weight-log-redirect').props.href).toBe('/health');
    expect(screen.queryByTestId('screen-weight-log')).toBeNull();
    expect(mockListWeights).not.toHaveBeenCalled();
  });

  it('shows loading, safe padding, and navigates back', async () => {
    mockListWeights.mockReturnValue(pending<WeightsState>());

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('screen-weight-log')).toBeVisible(),
    );
    expect(screen.getByText('Registro de peso')).toBeVisible();
    expect(screen.getByTestId('weight-log-loading')).toBeVisible();
    expect(
      screen.getByTestId('screen-weight-log').props.contentContainerStyle,
    ).toEqual(expect.objectContaining({ padding: 24, paddingBottom: 120 }));

    await fireEvent.press(screen.getByTestId('weight-log-back'));

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it('R5 (mobile-design-drift): aplica el safe area superior al contenido', async () => {
    mockListWeights.mockReturnValue(pending<WeightsState>());

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('screen-weight-log')).toBeVisible(),
    );
    expect(
      screen.getByTestId('screen-weight-log').props.contentContainerStyle,
    ).toEqual(expect.objectContaining({ paddingTop: 52 }));
  });

  it('R8 (mobile-design-drift): reserva la altura del loading con Skeleton', async () => {
    mockListWeights.mockReturnValue(pending<WeightsState>());

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('weight-log-loading')).toBeVisible(),
    );
    expect(screen.getByTestId('weight-log-loading').props.className).toContain(
      'h-40',
    );
  });

  it('keeps API order and renders each weight detail', async () => {
    mockListWeights.mockResolvedValue({
      kind: 'ok',
      weights: [
        makeWeight(),
        makeWeight({
          id: 'weight-2',
          weightKg: 12,
          measuredAt: '2026-07-21',
          bodyCondition: null,
          variation: null,
        }),
      ],
    });

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('weight-row-weight-1')).toBeVisible(),
    );
    expect(screen.getAllByTestId(/^weight-row-/).map(({ props }) => props.testID)).toEqual([
      'weight-row-weight-1',
      'weight-row-weight-2',
    ]);
    const newest = within(screen.getByTestId('weight-row-weight-1'));
    expect(newest.getByText('12.4 kg')).toBeVisible();
    expect(newest.getByText('2026-08-21')).toBeVisible();
    expect(newest.getByText('+0.4 kg')).toBeVisible();
    expect(newest.getByText('CC 5/9')).toBeVisible();
    const oldest = within(screen.getByTestId('weight-row-weight-2'));
    expect(oldest.getByText('—')).toBeVisible();
    expect(oldest.queryByText(/^CC /)).toBeNull();
    expect(mockListWeights).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1');
  });

  it('shows the empty state', async () => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('weight-log-empty')).toHaveTextContent(
        'Aún no hay registros de peso',
      ),
    );
  });

  it.each([
    { kind: 'error' } as const,
    { kind: 'unreachable', message: 'network down' } as const,
    { kind: 'missing-config' } as const,
  ])('shows and retries a $kind list error', async (state) => {
    mockListWeights
      .mockResolvedValueOnce(state)
      .mockResolvedValueOnce({ kind: 'ok', weights: [] });

    await renderWeightLog();
    await waitFor(() =>
      expect(screen.getByTestId('weight-log-error')).toHaveTextContent(
        'Algo salió mal',
      ),
    );

    await fireEvent.press(screen.getByTestId('weight-log-retry'));

    await waitFor(() => expect(screen.getByTestId('weight-log-empty')).toBeVisible());
    expect(mockListWeights).toHaveBeenCalledTimes(2);
  });
});

describe('R8: weight log monta la gráfica', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateWeight.mockReturnValue(pending());
  });

  it('passes loaded entries to the chart', async () => {
    mockListWeights.mockResolvedValue({
      kind: 'ok',
      weights: [
        makeWeight(),
        makeWeight({ id: 'weight-2', measuredAt: '2026-07-21' }),
      ],
    });

    await renderWeightLog();

    await waitFor(() => expect(screen.getByTestId('weight-chart')).toBeVisible());
  });
});

describe('R9: alta de peso con degradación por kind', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-17T23:30:00Z'));
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });
  });

  afterEach(() => jest.useRealTimers());

  it('renders the inline form with the local date prefilled (#90 R3)', async () => {
    mockCreateWeight.mockReturnValue(pending<CreateWeightState>());

    await renderWeightLog();

    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    expect(screen.getByTestId('weight-input').props.keyboardType).toBe(
      'decimal-pad',
    );
    await waitFor(() =>
      expect(screen.getByTestId('weight-date-input').props.value).toBe(
        '2026-09-18',
      ),
    );
    expect(screen.getByTestId('weight-bc-input').props.keyboardType).toBe(
      'number-pad',
    );
  });

  it('rejects an invalid weight without calling the API', async () => {
    mockCreateWeight.mockResolvedValue({ kind: 'error' });

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), 'not-a-number');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    expect(screen.getByTestId('weight-form-error')).toHaveTextContent(
      'Introduce un peso válido',
    );
    expect(mockCreateWeight).not.toHaveBeenCalled();
  });

  it('submits all fields, clears them, and refetches the list (#72 R2) (#90 R3)', async () => {
    mockCreateWeight.mockResolvedValue({
      kind: 'ok',
      weight: makeWeight({ weightKg: 12.8, bodyCondition: 6 }),
    });

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.8');
    await fireEvent.changeText(
      screen.getByTestId('weight-date-input'),
      '2026-08-20',
    );
    await fireEvent.changeText(screen.getByTestId('weight-bc-input'), '6');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    await waitFor(() =>
      expect(mockCreateWeight).toHaveBeenCalledWith(
        apiUrl,
        'jwt-token',
        'pet-1',
        { weightKg: 12.8, measuredAt: '2026-08-20', bodyCondition: 6 },
      ),
    );
    await waitFor(() =>
      expect(screen.getByTestId('weight-input').props.value).toBe(''),
    );
    expect(mockListWeights).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('weight-bc-input').props.value).toBe('');
    await waitFor(() =>
      expect(screen.getByTestId('weight-date-input').props.value).toBe(
        '2026-09-18',
      ),
    );
    expect(screen.queryByTestId('weight-form-error')).toBeNull();
  });

  it('omits body condition when its field is blank (#90 R3)', async () => {
    mockCreateWeight.mockResolvedValue({
      kind: 'ok',
      weight: makeWeight({ bodyCondition: null }),
    });

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    await waitFor(() =>
      expect(mockCreateWeight).toHaveBeenCalledWith(
        apiUrl,
        'jwt-token',
        'pet-1',
        { weightKg: 12.4, measuredAt: '2026-09-18' },
      ),
    );
  });

  it('joins backend validation messages, translating the future-date one (#90 R5)', async () => {
    mockCreateWeight.mockResolvedValue({
      kind: 'validation',
      errors: [
        { path: 'weightKg', message: 'Weight is too high' },
        {
          path: 'measuredAt',
          message: 'measuredAt is too far in the future',
        },
      ],
    });

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '1000');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    await waitFor(() =>
      expect(screen.getByTestId('weight-form-error').props.children).toBe(
        'Weight is too high\nLa fecha no puede ser posterior a hoy',
      ),
    );
  });

  it('keeps a malformed-date validation message raw (#90 R5)', async () => {
    mockCreateWeight.mockResolvedValue({
      kind: 'validation',
      errors: [{ path: 'measuredAt', message: 'Invalid ISO date' }],
    });

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    await waitFor(() =>
      expect(screen.getByTestId('weight-form-error').props.children).toBe(
        'Invalid ISO date',
      ),
    );
  });

  it.each([
    [{ kind: 'forbidden' } as const, 'Solo el dueño puede registrar pesos'],
    [{ kind: 'error' } as const, 'Algo salió mal'],
    [{ kind: 'missing-config' } as const, 'Algo salió mal'],
    [
      { kind: 'unreachable', message: 'network down' } as const,
      'No se pudo conectar con el servidor',
    ],
  ])('maps $expected.kind to its form error', async (result, message) => {
    mockCreateWeight.mockResolvedValue(result);

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    await waitFor(() =>
      expect(screen.getByTestId('weight-form-error')).toHaveTextContent(message),
    );
  });

  it('disables submit while the request is pending', async () => {
    mockCreateWeight.mockReturnValue(pending<CreateWeightState>());

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    await waitFor(() =>
      expect(screen.getByTestId('weight-submit').props.accessibilityState).toEqual(
        expect.objectContaining({ disabled: true }),
      ),
    );
  });
});

describe('#90 R3: la fecha por defecto sale de la zona del perfil', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-17T23:30:00Z'));
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });
  });

  afterEach(() => jest.useRealTimers());

  it.each([
    ['Pacific/Kiritimati', '2026-09-18'],
    ['Pacific/Pago_Pago', '2026-09-17'],
  ])('usa %s para el valor visible, el payload y el reset', async (timezone, expected) => {
    mockGetMe.mockResolvedValue({ kind: 'ok', me: makeProfile(timezone) });
    mockCreateWeight.mockResolvedValue({
      kind: 'ok',
      weight: makeWeight({ measuredAt: expected }),
    });

    await renderWeightLog();
    await waitFor(() =>
      expect(screen.getByTestId('weight-date-input').props.value).toBe(expected),
    );
    expect(mockGetMe).toHaveBeenCalledWith(apiUrl, 'jwt-token');

    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    await waitFor(() =>
      expect(mockCreateWeight).toHaveBeenCalledWith(
        apiUrl,
        'jwt-token',
        'pet-1',
        { weightKg: 12.4, measuredAt: expected },
      ),
    );
    await waitFor(() =>
      expect(screen.getByTestId('weight-date-input').props.value).toBe(expected),
    );
  });
});

describe('#90 R4: sin zona del perfil la fecha cae al dispositivo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-17T23:30:00Z'));
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });
    mockCreateWeight.mockReturnValue(pending());
  });

  afterEach(() => jest.useRealTimers());

  it('usa el día del dispositivo mientras el perfil está pendiente', async () => {
    mockGetMe.mockReturnValue(pending());

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('weight-date-input').props.value).toBe(
        deviceTodayIso(),
      ),
    );
  });

  it.each([
    { kind: 'unreachable', message: 'network down' } as const,
    { kind: 'error' } as const,
    { kind: 'missing-config' } as const,
  ])('usa el día del dispositivo cuando me devuelve $kind', async (state) => {
    mockGetMe.mockResolvedValue(state);

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await waitFor(() =>
      expect(screen.getByTestId('weight-date-input').props.value).toBe(
        deviceTodayIso(),
      ),
    );
    expect(screen.queryByTestId('weight-form-error')).toBeNull();
  });

  it('usa el día del dispositivo sin lanzar para una zona inválida', async () => {
    mockGetMe.mockResolvedValue({
      kind: 'ok',
      me: makeProfile('Not/A/Zone'),
    });

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await waitFor(() =>
      expect(screen.getByTestId('weight-date-input').props.value).toBe(
        deviceTodayIso(),
      ),
    );
    expect(screen.queryByTestId('weight-form-error')).toBeNull();
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
    mockCreateWeight.mockReturnValue(pending());
  });

  it('el botón de volver llega a 44 pt sin crecer a la vista', async () => {
    mockListWeights.mockReturnValue(pending<WeightsState>());

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('weight-log-back')).toBeVisible(),
    );

    expect(screen.getByTestId('weight-log-back').props.hitSlop).toEqual(
      TOUCH_SLOP,
    );
  });
});

describe('#62 R9: la gráfica de peso vive dentro de una card', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateWeight.mockReturnValue(pending());
    mockListWeights.mockResolvedValue({
      kind: 'ok',
      weights: [
        makeWeight(),
        makeWeight({
          id: 'weight-2',
          weightKg: 12,
          measuredAt: '2026-07-21',
        }),
      ],
    });
  });

  it('envuelve weight-chart con la superficie compartida', async () => {
    await renderWeightLog();

    const card = await screen.findByTestId('weight-chart-card');

    expect(card.props.className).toContain('rounded-card');
    expect(within(card).getByTestId('weight-chart')).toBeVisible();
  });
});

describe('#87 R10: WeightLogContent lee por TanStack Query', () => {
  it('deja el historial en la caché bajo su clave sin límite', async () => {
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    });
    const weightsState: WeightsState = {
      kind: 'ok',
      weights: [makeWeight()],
    };
    mockListWeights.mockResolvedValue(weightsState);
    mockCreateWeight.mockReturnValue(pending());

    const { queryClient } = await renderWithProviders(
      <HeroUINativeProvider>
        <LanguageProvider initial="es">
          <SelectedPetProvider>
            <SelectionProbe />
            <WeightLogScreen />
          </SelectedPetProvider>
        </LanguageProvider>
      </HeroUINativeProvider>,
    );
    await screen.findByTestId('weight-row-weight-1');

    expect(
      queryClient.getQueryData(healthKeys.weights('pet-1', undefined)),
    ).toEqual(weightsState);
  });
});
