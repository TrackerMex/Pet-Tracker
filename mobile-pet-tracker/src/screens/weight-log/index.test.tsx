import { HeaderHeightContext } from 'expo-router/react-navigation';
import { router } from 'expo-router';
import { DeviceEventEmitter, Platform } from 'react-native';
import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect } from 'react';
import { FadeIn, FadeOut } from 'react-native-reanimated';

import {
  createWeight,
  listWeights,
  type CreateWeightState,
  type WeightsState,
} from '../../api/health-records';
import { healthKeys } from '../../api/query-keys';
import type { WeightEntry } from '../../api/types';
import { es } from '../../i18n/catalog';
import { getMe, type ProfileResponse } from '../../api/users';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import {
  SelectedPetProvider,
  useSelectedPet,
} from '../../providers/selected-pet-provider';
import { WeightLogScreen } from '.';
import { renderWithProviders } from '../../../test/render-with-providers';

declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};
const { readFileSync } = require('fs');
const { join } = require('path');

jest.mock('../../api/health-records', () => ({
  createWeight: jest.fn(),
  listWeights: jest.fn(),
}));

jest.mock('../../api/users', () => ({
  getMe: jest.fn(),
}));

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    router: { push: jest.fn(), back: jest.fn(), canGoBack: jest.fn(() => false), replace: jest.fn() },
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

jest.mock('reicon-react-native', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { Text } = jest.requireActual<typeof import('react-native')>('react-native');
  const icon = (testID: string) =>
    function MockIcon({ size, color }: { size?: number; color?: string }) {
      const props = { testID, size, style: { color } };
      return React.createElement(Text, props);
    };

  return {
    ...jest.requireActual('reicon-react-native'),
    Minus: icon('icon-minus'),
    TrendUp: icon('icon-trend-up'),
    TrendDown: icon('icon-trend-down'),
    Check: icon('icon-check'),
  };
});

jest.mock('../../theme/use-theme-colors', () => {
  const colors: Record<string, string> = {
    success: 'green', danger: 'red', muted: 'gray', 'accent-strong': 'blue',
  };
  return { useThemeColors: (tokens: readonly string[]) => tokens.map((token) => colors[token]) };
});

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(() => Promise.resolve()),
  NotificationFeedbackType: { Success: 'mock-success', Error: 'mock-error' },
}));

const mockHaptics = jest.requireMock('expo-haptics');

const originalOS = Platform.OS;

const apiUrl = 'http://example.test/v1';
const mockCreateWeight = jest.mocked(createWeight);
const mockListWeights = jest.mocked(listWeights);
const mockGetMe = jest.mocked(getMe);
const mockUseAuth = jest.mocked(useAuth);

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

async function renderWeightLog(selected = true, language: 'en' | 'es' = 'es') {
  return renderWithProviders(
    <HeroUINativeProvider>
      <LanguageProvider initial={language}>
        <SelectedPetProvider>
          {selected ? <SelectionProbe /> : null}
          <HeaderHeightContext.Provider value={91}>
            <WeightLogScreen />
          </HeaderHeightContext.Provider>
        </SelectedPetProvider>
      </LanguageProvider>
    </HeroUINativeProvider>,
  );
}

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

  it('shows loading and the metrics under the native header (#95 R6)', async () => {
    mockListWeights.mockReturnValue(pending<WeightsState>());

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('screen-weight-log')).toBeVisible(),
    );
    expect(screen.getByTestId('weight-log-loading')).toBeVisible();
    expect(
      screen.getByTestId('weight-log-form').props.contentContainerStyle,
    ).toEqual({ padding: 24, gap: 16, paddingBottom: 48 });

  });

  it('R5 (mobile-design-drift, enmendado por #95 R6): el inset superior lo consume la cabecera nativa', async () => {
    mockListWeights.mockReturnValue(pending<WeightsState>());

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('screen-weight-log')).toBeVisible(),
    );
    expect(
      screen.getByTestId('weight-log-form').props.contentContainerStyle,
    ).not.toHaveProperty('paddingTop');
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
    expect(screen.getAllByTestId(/^weight-row-weight-\d+$/).map(({ props }) => props.testID)).toEqual([
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

  it('#186 R7: peso no numérico queda en su campo y el botón sigue habilitado', async () => {
    mockCreateWeight.mockResolvedValue({ kind: 'error' });

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), 'not-a-number');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    await waitFor(() => expect(screen.queryByTestId('weight-input-message')).toHaveTextContent('Introduce un peso válido'));
    expect(screen.queryByTestId('weight-form-error')).toBeNull();
    expect(screen.getByTestId('weight-submit')).not.toBeDisabled();
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

  it('#186 R7: el 400 mixto separa fecha futura y aviso genérico sin texto crudo', async () => {
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
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    await waitFor(() => expect(screen.queryByTestId('weight-date-input-message')).toHaveTextContent('La fecha no puede ser posterior a hoy'));
    expect(screen.queryByTestId('weight-form-error')).toHaveTextContent('Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.');
    expect(screen.queryByText(/Weight is too high/)).toBeNull();
  });

  it('#186 R7: el 400 de fecha mal formada muestra el genérico sin texto crudo', async () => {
    mockCreateWeight.mockResolvedValue({
      kind: 'validation',
      errors: [{ path: 'measuredAt', message: 'Invalid ISO date' }],
    });

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    await waitFor(() => expect(screen.queryByTestId('weight-form-error')).toHaveTextContent('Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.'));
    expect(screen.queryByText(/Invalid ISO date/)).toBeNull();
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

  it.each([
    ['0', 'El peso debe ser mayor que 0 y como máximo 999,99 kg'],
    ['1000', 'El peso debe ser mayor que 0 y como máximo 999,99 kg'],
    ['12abc', 'Introduce un peso válido'],
    ['72,5', null],
  ])('#186 R7: peso «%s» respeta decimal y rango', async (weight, message) => {
    mockCreateWeight.mockReturnValue(pending());
    await renderWeightLog();
    await screen.findByTestId('weight-input');
    await fireEvent.changeText(screen.getByTestId('weight-input'), weight!);
    await fireEvent.changeText(screen.getByTestId('weight-date-input'), '2026-08-20');
    await fireEvent.press(screen.getByTestId('weight-submit'));
    if (message !== null) {
      await waitFor(() => expect(screen.queryByTestId('weight-input-message')).toHaveTextContent(message));
      expect(mockCreateWeight).not.toHaveBeenCalled();
    } else {
      await waitFor(() => expect(screen.getByTestId('weight-submit')).toBeDisabled());
      expect(mockCreateWeight).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1', { weightKg: 72.5, measuredAt: '2026-08-20' });
    }
  });

  it.each([
    ['2026-02-30', 'Escribe una fecha válida con formato AAAA-MM-DD'],
    [' 2026-08-20 ', null],
  ])('#186 R7: fecha «%s» es real y se envía recortada', async (date, message) => {
    mockCreateWeight.mockReturnValue(pending());
    await renderWeightLog();
    await screen.findByTestId('weight-input');
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.changeText(screen.getByTestId('weight-date-input'), date!);
    await fireEvent.press(screen.getByTestId('weight-submit'));
    if (message !== null) {
      await waitFor(() => expect(screen.queryByTestId('weight-date-input-message')).toHaveTextContent(message));
      expect(mockCreateWeight).not.toHaveBeenCalled();
    } else {
      await waitFor(() => expect(screen.getByTestId('weight-submit')).toBeDisabled());
      expect(mockCreateWeight).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1', { weightKg: 12.4, measuredAt: '2026-08-20' });
    }
  });

  it.each([
    ['10', 'La condición corporal es un número entero del 1 al 9'],
    ['abc', 'La condición corporal es un número entero del 1 al 9'],
    ['  ', null],
  ])('#186 R7: condición corporal «%s» valida y omite blanco', async (body, message) => {
    mockCreateWeight.mockReturnValue(pending());
    await renderWeightLog();
    await screen.findByTestId('weight-input');
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.changeText(screen.getByTestId('weight-date-input'), '2026-08-20');
    await fireEvent.changeText(screen.getByTestId('weight-bc-input'), body!);
    await fireEvent.press(screen.getByTestId('weight-submit'));
    if (message !== null) {
      await waitFor(() => expect(screen.queryByTestId('weight-bc-input-message')).toHaveTextContent(message));
      expect(mockCreateWeight).not.toHaveBeenCalled();
    } else {
      await waitFor(() => expect(screen.getByTestId('weight-submit')).toBeDisabled());
      expect(mockCreateWeight).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1', { weightKg: 12.4, measuredAt: '2026-08-20' });
    }
  });

  it('#186 R7: muestra simultáneamente las tres filas inválidas', async () => {
    await renderWeightLog();
    await screen.findByTestId('weight-input');
    await fireEvent.changeText(screen.getByTestId('weight-input'), 'abc');
    await fireEvent.changeText(screen.getByTestId('weight-date-input'), 'bad-date');
    await fireEvent.changeText(screen.getByTestId('weight-bc-input'), '10');
    await fireEvent.press(screen.getByTestId('weight-submit'));
    await waitFor(() => expect(screen.queryByTestId('weight-input-message')).toHaveTextContent('Introduce un peso válido'));
    expect(screen.queryByTestId('weight-input-message-row')).not.toBeNull();
    expect(screen.queryByTestId('weight-date-input-message-row')).not.toBeNull();
    expect(screen.queryByTestId('weight-bc-input-message-row')).not.toBeNull();
  });

  it('#186 R7: un 400 solo de fecha futura queda únicamente en el campo', async () => {
    mockCreateWeight.mockResolvedValue({ kind: 'validation', errors: [{ path: 'measuredAt', message: 'measuredAt is too far in the future' }] });
    await renderWeightLog();
    await screen.findByTestId('weight-input');
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));
    await waitFor(() => expect(screen.queryByTestId('weight-date-input-message')).toHaveTextContent('La fecha no puede ser posterior a hoy'));
    expect(screen.queryByTestId('weight-form-error')).toBeNull();
  });

  it('#186 R7: peso fuera de rango se traduce al inglés', async () => {
    await renderWeightLog(true, 'en');
    await screen.findByTestId('weight-input');
    await fireEvent.changeText(screen.getByTestId('weight-input'), '0');
    await fireEvent.press(screen.getByTestId('weight-submit'));
    await waitFor(() => expect(screen.queryByTestId('weight-input-message')).toHaveTextContent('Weight must be above 0 and at most 999.99 kg'));
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

describe('#95 R5: la pantalla no dibuja cabecera propia', () => {
  it('retira el botón y el título del cuerpo (enmendado por #199 R1)', async () => {
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() });
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [makeWeight()] });
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('screen-weight-log')).toBeVisible());
    await screen.findByTestId('weight-chart-card');
    expect(screen.queryByTestId('weight-log-back')).toBeNull();
    expect(screen.getByTestId('weight-log-header-title')).toHaveTextContent(es['weightLog.weightLog']);
  });
});

describe('#148 R7: weight-log se aparta del teclado en Android', () => {
  afterEach(() => {
    (Platform as { OS: string }).OS = originalOS;
  });

  it('el host screen-weight-log añade paddingBottom 291 al abrir el teclado', async () => {
    (Platform as { OS: string }).OS = 'android';
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateWeight.mockReturnValue(pending());
    mockListWeights.mockReturnValue(pending<WeightsState>());
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('screen-weight-log')).toBeVisible());

    const host = screen.getByTestId('screen-weight-log');
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
    await waitFor(() => expect(screen.getByTestId('screen-weight-log')).toHaveStyle({ paddingBottom: 291 }));
  });
});

describe('#148 R8: weight-log entrega el primer toque con el teclado abierto', () => {
  it('el scroll weight-log-form declara keyboardShouldPersistTaps handled', async () => {
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockCreateWeight.mockReturnValue(pending());
    mockListWeights.mockReturnValue(pending<WeightsState>());
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('screen-weight-log')).toBeVisible());

    expect(screen.getByTestId('weight-log-form').props.keyboardShouldPersistTaps).toBe('handled');
  });
});

function prepareWeightLogTests() {
  jest.clearAllMocks();
  process.env.EXPO_PUBLIC_API_URL = apiUrl;
  mockUseAuth.mockReturnValue({
    status: 'authenticated', token: 'jwt-token',
    signIn: jest.fn(), signOut: jest.fn(),
  } satisfies AuthContextValue);
  mockCreateWeight.mockReturnValue(pending<CreateWeightState>());
  mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });
}

describe('#169 R8: chip de delta por entrada', () => {
  const cases = [
    ['w-up', 0.4, 'bg-danger-soft', 'text-danger', 'icon-trend-up', 'red', '+0.4 kg'],
    ['w-down', -0.2, 'bg-success-soft', 'text-success', 'icon-trend-down', 'green', '-0.2 kg'],
    ['w-flat', 0, 'bg-default', 'text-muted', 'icon-minus', 'gray', '0 kg'],
    ['w-none', null, 'bg-default', 'text-muted', 'icon-minus', 'gray', '—'],
  ] as const;

  beforeEach(() => {
    prepareWeightLogTests();
    mockListWeights.mockResolvedValue({
      kind: 'ok',
      weights: cases.map(([id, variation]) => makeWeight({ id, variation })),
    });
  });

  it.each(cases)('fila %s con su tono, icono y texto', async (
    id, _variation, tileClassName, textClassName, iconId, color, text,
  ) => {
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-row-w-up')).toBeVisible());
    const tile = screen.getByTestId(`weight-row-${id}-tone`);

    expect(tile.props.className).toContain(tileClassName);
    for (const other of ['bg-danger-soft', 'bg-success-soft', 'bg-default']) {
      if (other !== tileClassName) expect(tile.props.className).not.toContain(other);
    }
    const icon = within(tile).getByTestId(iconId);
    expect(icon.props.style.color).toBe(color);
    expect(icon.props.size).toBe(15);
    for (const other of ['icon-trend-up', 'icon-trend-down', 'icon-minus']) {
      if (other !== iconId) expect(within(tile).queryByTestId(other)).toBeNull();
    }
    const delta = screen.getByTestId(`weight-row-${id}-delta`);
    expect(delta).toHaveTextContent(text, { exact: true });
    expect(delta.props.className).toContain(textClassName);
    for (const other of ['text-danger', 'text-success', 'text-muted']) {
      if (other !== textClassName) expect(delta.props.className).not.toContain(other);
    }
  });
});

describe('#169 R6: resumen del peso en la card de la gráfica', () => {
  const entries = [
    makeWeight({ id: 'weight-3', measuredAt: '2026-09-30', weightKg: 12.4 }),
    makeWeight({ id: 'weight-2', measuredAt: '2026-09-29', weightKg: 12.0 }),
    makeWeight({ id: 'weight-1', measuredAt: '2026-08-31', weightKg: 11.0 }),
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-01T05:00:00Z'));
    prepareWeightLogTests();
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: entries });
  });
  afterEach(() => jest.useRealTimers());

  it.each([
    ['Pacific/Pago_Pago', '2026-09-30', '+1.4 kg este mes'],
    ['Pacific/Kiritimati', '2026-10-01', null],
  ] as const)('en %s pinta el peso actual y el delta del día civil', async (timezone, today, delta) => {
    mockGetMe.mockResolvedValue({ kind: 'ok', me: makeProfile(timezone) });
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-date-input').props.value).toBe(today));

    const current = screen.getByTestId('weight-current');
    expect(current).toHaveTextContent('12.4 kg', { exact: true });
    expect(current.props.className).toBe('text-3xl font-black text-foreground');
    expect(current.props.style).toEqual({ fontVariant: ['tabular-nums'] });
    if (delta !== null) {
      const deltaText = screen.getByTestId('weight-month-delta-text');
      expect(deltaText).toHaveTextContent('+1.4 kg este mes', { exact: true });
      expect(deltaText.props.style).toEqual({ fontVariant: ['tabular-nums'] });
      expect(screen.getByTestId('weight-month-delta').props.className)
        .toBe('flex-row items-center gap-1.5');
    } else {
      expect(screen.queryByTestId('weight-month-delta')).toBeNull();
    }
  });

  it('pinta el resumen dentro de la card y antes de la gráfica', async () => {
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-chart-card')).toBeVisible());

    within(screen.getByTestId('weight-chart-card')).getByTestId('weight-summary');
    expect(within(screen.getByTestId('weight-chart-card'))
      .getAllByTestId(/^weight-(summary|chart)$/).map((node) => node.props.testID))
      .toEqual(['weight-summary', 'weight-chart']);
  });

  it('no pinta el resumen sin entradas', async () => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-chart-empty'))
      .toHaveTextContent('Aún no hay datos suficientes'));

    expect(screen.queryByTestId('weight-summary')).toBeNull();
  });
});

describe('#169 R7: tono del delta del mes', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-17T18:00:00Z'));
    prepareWeightLogTests();
    mockGetMe.mockResolvedValue({ kind: 'ok', me: makeProfile('America/Mexico_City') });
  });
  afterEach(() => jest.useRealTimers());

  it.each([
    ['> 0', [
      makeWeight({ id: 'weight-2', measuredAt: '2026-09-15', weightKg: 12.4 }),
      makeWeight({ id: 'weight-1', measuredAt: '2026-09-02', weightKg: 12.0 }),
    ], '+0.4 kg este mes', 'text-sm font-semibold text-danger', 'icon-trend-up', 'red', ['icon-trend-down', 'icon-minus']],
    ['< 0', [
      makeWeight({ id: 'weight-2', measuredAt: '2026-09-15', weightKg: 11.7 }),
      makeWeight({ id: 'weight-1', measuredAt: '2026-08-30', weightKg: 12.0 }),
    ], '-0.3 kg este mes', 'text-sm font-semibold text-success', 'icon-trend-down', 'green', ['icon-trend-up', 'icon-minus']],
    ['= 0', [
      makeWeight({ id: 'weight-2', measuredAt: '2026-09-15', weightKg: 12.0 }),
      makeWeight({ id: 'weight-1', measuredAt: '2026-08-30', weightKg: 12.0 }),
    ], '0 kg este mes', 'text-sm font-semibold text-muted', 'icon-minus', 'gray', ['icon-trend-up', 'icon-trend-down']],
  ] as const)('rama %s: texto, clase e icono', async (_branch, entries, text, className, iconId, color, absent) => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [...entries] });
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-month-delta-text'))
      .toHaveTextContent(text, { exact: true }));

    expect(screen.getByTestId('weight-month-delta-text')).toHaveTextContent(text, { exact: true });
    expect(screen.getByTestId('weight-month-delta-text').props.className).toBe(className);
    const delta = within(screen.getByTestId('weight-month-delta'));
    const icon = delta.getByTestId(iconId);
    expect(icon.props.size).toBe(15);
    expect(icon.props.style.color).toBe(color);
    for (const other of absent) expect(delta.queryByTestId(other)).toBeNull();
  });
});

describe('#169 R10: toast y háptico tras un alta correcta', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-17T23:30:00Z'));
    prepareWeightLogTests();
  });
  afterEach(() => jest.useRealTimers());

  it('muestra el toast y el háptico solo tras resolver el alta', async () => {
    let resolveCreate!: (result: CreateWeightState) => void;
    mockCreateWeight.mockReturnValue(new Promise((resolve) => { resolveCreate = resolve; }));
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    expect(screen.queryByTestId('weight-toast')).toBeNull();
    expect(mockHaptics.notificationAsync).not.toHaveBeenCalled();
    await act(async () => { resolveCreate({ kind: 'ok', weight: makeWeight({ weightKg: 12.4 }) }); });
    await act(async () => {});
    expect(screen.queryByTestId('weight-toast')).not.toBeNull();
    const toast = screen.getByTestId('weight-toast');
    expect(toast.props.className)
      .toBe('absolute top-4 flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm');
    expect(toast.props.pointerEvents).toBe('none');
    expect(toast.props.accessibilityLiveRegion).toBe('polite');
    const copy = within(toast).getByText('Anotado. Ya lo puse en la gráfica.');
    expect(copy).toHaveTextContent('Anotado. Ya lo puse en la gráfica.', { exact: true });
    expect(copy.props.className).toBe('text-sm font-semibold text-foreground');
    const check = within(toast).getByTestId('icon-check');
    expect(check.props.size).toBe(16);
    expect(check.props.style.color).toBe('green');
    expect(within(screen.getByTestId('screen-weight-log')).getByTestId('weight-toast')).toBe(toast);
    expect(within(screen.getByTestId('weight-log-form')).queryByTestId('weight-toast')).toBeNull();
    expect(within(screen.getByTestId('screen-weight-log'))
      .getAllByTestId(/^weight-(log-form|toast)$/).map((node) => node.props.testID))
      .toEqual(['weight-log-form', 'weight-toast']);
    expect(mockHaptics.notificationAsync).toHaveBeenCalledTimes(1);
    expect(mockHaptics.notificationAsync).toHaveBeenCalledWith('mock-success');
  });

  it('llama al háptico una sola vez en la rama ok del fuente', () => {
    const source = readFileSync(join(process.cwd(), 'src/screens/weight-log/index.tsx'), 'utf8');
    const start = source.indexOf("case 'ok':");
    const okBranch = source.slice(start, source.indexOf("case 'validation':", start));
    expect(okBranch.split('Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)').length - 1)
      .toBe(1);
  });
});
describe('#169 R11: ni toast ni háptico fuera de la rama ok', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-17T23:30:00.000Z'));
    prepareWeightLogTests();
  });

  afterEach(() => jest.useRealTimers());

  const cases: [string, CreateWeightState | null, string | null][] = [
    ['peso no numérico', null, 'Introduce un peso válido'],
    ['validation', { kind: 'validation', errors: [{ path: 'weightKg', message: 'weightKg must be positive' }] }, 'Algo no cuadra en los datos. Revísalos y vuelve a intentarlo.'],
    ['forbidden', { kind: 'forbidden' }, 'Solo el dueño puede registrar pesos'],
    ['unreachable', { kind: 'unreachable', message: 'x' }, 'No se pudo conectar con el servidor'],
    ['unauthorized', { kind: 'unauthorized' }, null],
    ['error', { kind: 'error' }, 'Algo salió mal'],
    ['missing-config', { kind: 'missing-config' }, 'Algo salió mal'],
    ['excepción', null, 'Algo salió mal'],
  ];

  it.each(cases)('#186 R7: rama %s: ni toast ni háptico', async (branch, result, message) => {
    if (branch === 'excepción') {
      mockCreateWeight.mockRejectedValue(new Error('boom'));
    } else if (result !== null) {
      mockCreateWeight.mockResolvedValue(result);
    }

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), branch === 'peso no numérico' ? 'abc' : '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));

    if (branch === 'unauthorized') {
      await waitFor(() => expect(mockUseAuth().signOut).toHaveBeenCalledTimes(1));
    } else if (branch === 'peso no numérico') {
      await waitFor(() => expect(screen.queryByTestId('weight-input-message')).toHaveTextContent('Introduce un peso válido'));
      expect(screen.queryByTestId('weight-form-error')).toBeNull();
      expect(mockCreateWeight).not.toHaveBeenCalled();
    } else {
      await waitFor(() => {
        expect(screen.queryByTestId('weight-form-error')).toHaveTextContent(message!);
        expect(screen.getByTestId('weight-form-error')).toBeVisible();
      });
      expect(screen.getByTestId('weight-form-error')).toHaveTextContent(message!);
    }
    expect(screen.queryByTestId('weight-toast')).toBeNull();
    expect(mockHaptics.notificationAsync).not.toHaveBeenCalled();
  });
});

describe('#169 R12: el toast se va solo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-17T23:30:00.000Z'));
    prepareWeightLogTests();
    mockCreateWeight.mockResolvedValue({ kind: 'ok', weight: makeWeight() });
  });

  afterEach(() => jest.useRealTimers());

  it('se ve a los 2400 ms y se va a los 2650 ms', async () => {
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));
    await act(async () => {});

    await act(async () => { jest.advanceTimersByTime(2400); });
    expect(screen.queryByTestId('weight-toast')).not.toBeNull();
    await act(async () => { jest.advanceTimersByTime(250); });
    expect(screen.queryByTestId('weight-toast')).toBeNull();
  });

  it('otra alta reinicia la cuenta y vibra otra vez', async () => {
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));
    await act(async () => {});

    await act(async () => { jest.advanceTimersByTime(2000); });
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.5');
    await fireEvent.press(screen.getByTestId('weight-submit'));
    await act(async () => {});

    await act(async () => { jest.advanceTimersByTime(2400); });
    expect(screen.queryByTestId('weight-toast')).not.toBeNull();
    await act(async () => { jest.advanceTimersByTime(250); });
    expect(screen.queryByTestId('weight-toast')).toBeNull();
    expect(mockHaptics.notificationAsync).toHaveBeenCalledTimes(2);
  });
});

describe('#169 R13: movimiento del toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-17T23:30:00.000Z'));
    prepareWeightLogTests();
    mockCreateWeight.mockResolvedValue({ kind: 'ok', weight: makeWeight() });
  });

  afterEach(() => jest.useRealTimers());

  it('el fuente declara el fundido sin ReduceMotion.Never', () => {
    const source = readFileSync(join(process.cwd(), 'src/screens/weight-log/index.tsx'), 'utf8');
    expect(source).toContain('entering={FadeIn.duration(MOTION_TRANSITION_MS)}');
    expect(source).toContain('exiting={FadeOut.duration(MOTION_FEEDBACK_MS)}');
    expect(source.split('ReduceMotion.Never').length - 1).toBe(0);
  });

  it('el toast lleva FadeIn y FadeOut', async () => {
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));
    await act(async () => {});

    expect(screen.queryByTestId('weight-toast')).not.toBeNull();
    const toast = screen.getByTestId('weight-toast');
    expect(toast.props.entering).toBeInstanceOf(FadeIn);
    expect(toast.props.exiting).toBeInstanceOf(FadeOut);
  });
});

describe('#199 R1: Peso dibuja su propia cabecera', () => {
  beforeEach(() => { prepareWeightLogTests(); });
  it('#199 R1 pinta weight-log-header como primer hijo del scroll con el título de weightLog.weightLog', async () => {
    await renderWeightLog();
    await screen.findByTestId('weight-log-empty');
    expect(screen.queryByTestId('weight-log-header')).not.toBeNull();
    const header = screen.getByTestId('weight-log-header');
    expect(header.parent?.children[0] === header).toBe(true);
    expect(screen.getByTestId('weight-log-header-title')).toHaveTextContent(es['weightLog.weightLog']);
    expect(screen.getByTestId('weight-log-header-title').props.className).toBe('text-24 font-black tracking-title text-foreground');
    expect(screen.getByTestId('weight-log-header-back')).toBeOnTheScreen();
  });
  it('#199 R1 sin historial la vuelta lleva a /health', async () => {
    await renderWeightLog();
    await screen.findByTestId('weight-log-empty');
    expect(screen.queryByTestId('weight-log-header-back')).not.toBeNull();
    await fireEvent.press(screen.getByTestId('weight-log-header-back'));
    expect(router.replace).toHaveBeenCalledWith('/health');
  });
});
