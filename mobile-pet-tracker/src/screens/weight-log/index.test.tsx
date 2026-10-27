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
import { useEffect, type ReactNode } from 'react';
import type { TestInstance } from 'test-renderer';
import { FadeIn, FadeOut } from 'react-native-reanimated';

import {
  createWeight,
  listWeights,
  type CreateWeightState,
  type WeightsState,
} from '../../api/health-records';
import { getPet } from '../../api/pets';
import { healthKeys, petKeys } from '../../api/query-keys';
import type { PetProfile, WeightEntry } from '../../api/types';
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

jest.mock('@expo/ui', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    Host: (props: Record<string, unknown>) => {
      const { children, ...hostProps } = props;

      return React.createElement(
        View,
        { ...hostProps, testID: 'expo-ui-picker-host' },
        children as never,
      );
    },
  };
});

jest.mock('@expo/ui/community/datetime-picker', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return function MockDateTimePicker(props: Record<string, unknown>) {
    return React.createElement(View, props);
  };
});

jest.mock('../../api/health-records', () => ({
  createWeight: jest.fn(),
  listWeights: jest.fn(),
}));

jest.mock('../../api/pets', () => ({ getPet: jest.fn() }));

jest.mock('../../components/rise-in', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { RiseIn: ({ delayMs, testID, className, children }: { delayMs: number; testID?: string; className?: string; children: ReactNode }) => {
    const props = { delayMs, testID, className };
    return React.createElement(View, props, children);
  } };
});

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
    function MockIcon({ size, color, strokeWidth }: { size?: number; color?: string; strokeWidth?: number }) {
      const props = { testID, size, strokeWidth, style: { color } };
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
  return { useThemeColors: (tokens: readonly string[]) => tokens.map((token) => colors[token] ?? token) };
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
const mockGetPet = jest.mocked(getPet);
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

async function pickWeightDate(date: Date) {
  await fireEvent.press(screen.getByTestId('weight-date-input'));
  await fireEvent(screen.getByTestId('weight-date-picker'), 'onValueChange', {}, date);
}

beforeEach(() => {
  mockGetMe.mockResolvedValue({
    kind: 'ok',
    me: makeProfile('Pacific/Kiritimati'),
  });
  mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
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
          <WeightLogScreen />
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

  it('shows loading and the metrics under the native header (#95 R6) (enmendado por #199 R2)', async () => {
    mockListWeights.mockReturnValue(pending<WeightsState>());

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('screen-weight-log')).toBeVisible(),
    );
    expect(screen.getByTestId('weight-log-loading')).toBeVisible();
    expect(
      screen.getByTestId('weight-log-form').props.contentContainerStyle,
    ).toEqual({ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 56, gap: 14 });

  });

  it('R5 (mobile-design-drift, enmendado por #95 R6): el inset superior lo consume la cabecera nativa (enmendado por #199 R2)', async () => {
    mockListWeights.mockReturnValue(pending<WeightsState>());

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('screen-weight-log')).toBeVisible(),
    );
    expect(
      screen.getByTestId('weight-log-form').props.contentContainerStyle,
    ).toHaveProperty('paddingTop', 48);
  });

  it('R8 (mobile-design-drift): reserva la altura del loading con Skeleton (enmendado por #199 R22)', async () => {
    mockListWeights.mockReturnValue(pending<WeightsState>());

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('weight-log-loading')).toBeVisible(),
    );
    expect(within(screen.getByTestId('weight-log-loading')).getAllByTestId(/^weight-log-skeleton-row-\d+$/, { includeHiddenElements: true })).toHaveLength(3);
  });

  it('keeps API order and renders each weight detail (enmendado por #199 R10) (enmendado por #199 R11)', async () => {
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
    expect(newest.getByTestId('weight-row-weight-1-delta').parent!).toHaveTextContent('12.4 kg +0.4 kg', { exact: true });
    expect(newest.getByText('21 ago')).toBeVisible();
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

  it('renders the inline form with the local date prefilled (#90 R3) (enmendado por #220 R12)', async () => {
    mockCreateWeight.mockReturnValue(pending<CreateWeightState>());

    await renderWeightLog();

    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    expect(screen.getByTestId('weight-input').props.keyboardType).toBe(
      'decimal-pad',
    );
    await waitFor(() =>
      expect(screen.getByTestId('weight-date-input-value').props.value).toBe(
        '18 sep 2026',
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

  it('submits all fields, clears them, and refetches the list (#72 R2) (#90 R3) (enmendado por #220 R12)', async () => {
    mockCreateWeight.mockResolvedValue({
      kind: 'ok',
      weight: makeWeight({ weightKg: 12.8, bodyCondition: 6 }),
    });

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.8');
    await pickWeightDate(new Date(2026, 7, 20));
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
      expect(screen.getByTestId('weight-date-input-value').props.value).toBe(
        '18 sep 2026',
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
  ])('#186 R7: peso «%s» respeta decimal y rango (enmendado por #220 R12)', async (weight, message) => {
    mockCreateWeight.mockReturnValue(pending());
    await renderWeightLog();
    await screen.findByTestId('weight-input');
    await fireEvent.changeText(screen.getByTestId('weight-input'), weight!);
    await pickWeightDate(new Date(2026, 7, 20));
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
    ['10', 'La condición corporal es un número entero del 1 al 9'],
    ['abc', 'La condición corporal es un número entero del 1 al 9'],
    ['  ', null],
  ])('#186 R7: condición corporal «%s» valida y omite blanco (enmendado por #220 R12)', async (body, message) => {
    mockCreateWeight.mockReturnValue(pending());
    await renderWeightLog();
    await screen.findByTestId('weight-input');
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await pickWeightDate(new Date(2026, 7, 20));
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

  it('#186 R7: muestra simultáneamente las tres filas inválidas (enmendado por #220 R12)', async () => {
    await renderWeightLog();
    await screen.findByTestId('weight-input');
    await fireEvent.changeText(screen.getByTestId('weight-input'), 'abc');
    await pickWeightDate(new Date(2026, 7, 20));
    await fireEvent.changeText(screen.getByTestId('weight-bc-input'), '10');
    await fireEvent.press(screen.getByTestId('weight-submit'));
    await waitFor(() => expect(screen.queryByTestId('weight-input-message')).toHaveTextContent('Introduce un peso válido'));
    expect(screen.queryByTestId('weight-input-message-row')).not.toBeNull();
    expect(screen.queryByTestId('weight-date-input-message-row')).toBeNull();
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
    ['Pacific/Kiritimati', '2026-09-18', '18 sep 2026'],
    ['Pacific/Pago_Pago', '2026-09-17', '17 sep 2026'],
  ])('usa %s para el valor visible, el payload y el reset (enmendado por #220 R12)', async (timezone, expected, label) => {
    mockGetMe.mockResolvedValue({ kind: 'ok', me: makeProfile(timezone) });
    mockCreateWeight.mockResolvedValue({
      kind: 'ok',
      weight: makeWeight({ measuredAt: expected }),
    });

    await renderWeightLog();
    await waitFor(() =>
      expect(screen.getByTestId('weight-date-input-value').props.value).toBe(label),
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
      expect(screen.getByTestId('weight-date-input-value').props.value).toBe(label),
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

  it('usa el día del dispositivo mientras el perfil está pendiente (enmendado por #220 R12)', async () => {
    mockGetMe.mockReturnValue(pending());

    await renderWeightLog();

    await waitFor(() =>
      expect(screen.getByTestId('weight-date-input-value').props.value).toBe(
        '17 sep 2026',
      ),
    );
  });

  it.each([
    { kind: 'unreachable', message: 'network down' } as const,
    { kind: 'error' } as const,
    { kind: 'missing-config' } as const,
  ])('usa el día del dispositivo cuando me devuelve $kind (enmendado por #220 R12)', async (state) => {
    mockGetMe.mockResolvedValue(state);

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await waitFor(() =>
      expect(screen.getByTestId('weight-date-input-value').props.value).toBe(
        '17 sep 2026',
      ),
    );
    expect(screen.queryByTestId('weight-form-error')).toBeNull();
  });

  it('usa el día del dispositivo sin lanzar para una zona inválida (enmendado por #220 R12)', async () => {
    mockGetMe.mockResolvedValue({
      kind: 'ok',
      me: makeProfile('Not/A/Zone'),
    });

    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-input')).toBeVisible());
    await waitFor(() =>
      expect(screen.getByTestId('weight-date-input-value').props.value).toBe(
        '17 sep 2026',
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

  it('envuelve weight-chart con la superficie compartida (enmendado por #199 R3)', async () => {
    await renderWeightLog();

    const card = await screen.findByTestId('weight-chart-card');

    expect(card.props.className).toBe('gap-2 rounded-24 bg-surface-secondary p-4');
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

  it('el host screen-weight-log añade paddingBottom 291 al abrir el teclado (enmendado por #199 R2)', async () => {
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
    await waitFor(() => expect(screen.getByTestId('screen-weight-log')).toHaveStyle({ paddingBottom: 200 }));
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
    ['w-up', 0.4, 'bg-category-rose', 'text-danger', 'icon-trend-up', 'red', '+0.4 kg'],
    ['w-down', -0.2, 'bg-category-green', 'text-accent-strong', 'icon-trend-down', 'blue', '-0.2 kg'],
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

  it.each(cases)('fila %s con su tono, icono y texto (enmendado por #199 R10)', async (
    id, _variation, tileClassName, textClassName, iconId, color, text,
  ) => {
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-row-w-up')).toBeVisible());
    const tile = screen.getByTestId(`weight-row-${id}-tone`);

    expect(tile.props.className).toContain(tileClassName);
    for (const other of ['bg-category-rose', 'bg-category-green', 'bg-default']) {
      if (other !== tileClassName) expect(tile.props.className).not.toContain(other);
    }
    const icon = within(tile).getByTestId(iconId);
    expect(icon.props.style.color).toBe(color);
    expect(icon.props.size).toBe(18);
    for (const other of ['icon-trend-up', 'icon-trend-down', 'icon-minus']) {
      if (other !== iconId) expect(within(tile).queryByTestId(other)).toBeNull();
    }
    const delta = screen.getByTestId(`weight-row-${id}-delta`);
    expect(delta).toHaveTextContent(text, { exact: true });
    expect(delta.props.className).toContain(textClassName);
    for (const other of ['text-danger', 'text-accent-strong', 'text-muted']) {
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
  ] as const)('en %s pinta el peso actual y el delta del día civil (enmendado por #199 R4) (enmendado por #199 R7) (enmendado por #220 R12)', async (timezone, today, delta) => {
    mockGetMe.mockResolvedValue({ kind: 'ok', me: makeProfile(timezone) });
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-date-input-value').props.value).toBe(today === '2026-09-30' ? '30 sep 2026' : '1 oct 2026'));

    const current = await screen.findByTestId('weight-current');
    expect(current).toHaveTextContent('12.4 kg', { exact: true });
    expect(current.props.className).toBe('text-34 font-black text-foreground');
    expect(current.props.style).toEqual({ fontVariant: ['tabular-nums'] });
    if (delta !== null) {
      const deltaText = screen.getByTestId('weight-month-delta-text');
      expect(deltaText).toHaveTextContent('+1.4 kg este mes', { exact: true });
      expect(deltaText.props.style).toEqual({ fontVariant: ['tabular-nums'] });
      expect(screen.queryByTestId('weight-month-delta')).toBeNull();
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

  it('no pinta el resumen sin entradas (enmendado por #199 R3)', async () => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });
    await renderWeightLog();
    await screen.findByTestId('weight-log-empty');
    expect(screen.queryByTestId('weight-chart-empty')).toBeNull();

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
    ], '+0.4 kg este mes', 'text-sm font-extrabold text-danger'],
    ['< 0', [
      makeWeight({ id: 'weight-2', measuredAt: '2026-09-15', weightKg: 11.7 }),
      makeWeight({ id: 'weight-1', measuredAt: '2026-08-30', weightKg: 12.0 }),
    ], '-0.3 kg este mes', 'text-sm font-extrabold text-accent-strong'],
    ['= 0', [
      makeWeight({ id: 'weight-2', measuredAt: '2026-09-15', weightKg: 12.0 }),
      makeWeight({ id: 'weight-1', measuredAt: '2026-08-30', weightKg: 12.0 }),
    ], '0 kg este mes', 'text-sm font-extrabold text-muted'],
  ] as const)('rama %s: texto, clase e icono (enmendado por #199 R4)', async (_branch, entries, text, className) => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [...entries] });
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-month-delta-text'))
      .toHaveTextContent(text, { exact: true }));

    expect(screen.getByTestId('weight-month-delta-text')).toHaveTextContent(text, { exact: true });
    expect(screen.getByTestId('weight-month-delta-text').props.className).toBe(className);
    expect(screen.queryByTestId('weight-month-delta')).toBeNull();
    const summary = within(screen.getByTestId('weight-summary'));
    for (const id of ['icon-trend-up', 'icon-trend-down', 'icon-minus']) expect(summary.queryByTestId(id)).toBeNull();
  });
});

describe('#169 R10: toast y háptico tras un alta correcta', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-17T23:30:00Z'));
    prepareWeightLogTests();
  });
  afterEach(() => jest.useRealTimers());

  it('muestra el toast y el háptico solo tras resolver el alta (enmendado por #199 R23)', async () => {
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
      .toBe('absolute flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5');
    expect(toast.props.pointerEvents).toBe('none');
    expect(toast.props.accessibilityLiveRegion).toBe('polite');
    const copy = within(toast).getByText('Anotado. Ya lo puse en la gráfica.');
    expect(copy).toHaveTextContent('Anotado. Ya lo puse en la gráfica.', { exact: true });
    expect(copy.props.className).toBe('text-sm font-semibold text-foreground');
    const check = within(toast).getByTestId('icon-check');
    expect(check.props.size).toBe(16);
    expect(check.props.style.color).toBe('blue');
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

  it('el fuente declara el fundido sin ReduceMotion.Never (enmendado por #199 R23)', () => {
    const source = readFileSync(join(process.cwd(), 'src/screens/weight-log/index.tsx'), 'utf8');
    expect(source).toContain('entering={FadeIn.duration(MOTION_TOAST_FADE_MS).delay(MOTION_TOAST_DELAY_MS)}');
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

describe('#199 R2: métricas del scroll de Peso', () => {
  it('#199 R2 el scroll usa margen 24, inset superior + 8, inferior + 32 y gap 14', async () => {
    prepareWeightLogTests();
    mockListWeights.mockReturnValue(pending<WeightsState>());
    await renderWeightLog();
    await screen.findByTestId('weight-log-loading');
    expect(screen.getByTestId('weight-log-form').props.contentContainerStyle).toEqual({ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 56, gap: 14 });
    const source = readFileSync(join(process.cwd(), 'src/screens/weight-log/index.tsx'), 'utf8');
    expect(source).toContain('keyboardVerticalOffset={0}');
    expect(source).not.toContain('HeaderHeightContext');
  });
});

function riseDelayOf(node: TestInstance): number | undefined {
  let host: TestInstance | null = node;
  while (host) {
    if (typeof host.props.delayMs === 'number') return host.props.delayMs;
    host = host.parent;
  }
  return undefined;
}

function scrollSlotOf(node: TestInstance, container: TestInstance): TestInstance {
  let slot = node;
  while (slot.parent && slot.parent !== container) slot = slot.parent;
  return slot;
}

describe('#199 R3: tarjeta de la gráfica de Peso', () => {
  beforeEach(() => {
    prepareWeightLogTests();
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [makeWeight()] });
  });
  it('#199 R3 weight-chart-card es un View rounded-24 bg-surface-secondary p-4 gap-2 con esquina continua', async () => {
    await renderWeightLog();
    const card = await screen.findByTestId('weight-chart-card');
    expect(card.props.className).toBe('gap-2 rounded-24 bg-surface-secondary p-4');
    expect(card.props.style).toEqual({ borderCurve: 'continuous' });
  });
  it('#199 R3 con registros el scroll ordena cabecera, gráfica, formulario e historial', async () => {
    await renderWeightLog();
    const row = await screen.findByTestId('weight-row-weight-1');
    const header = screen.getByTestId('weight-log-header');
    const container = header.parent!;
    const slots = [header, screen.getByTestId('weight-chart-card'), screen.getByTestId('weight-input'), row].map(node => scrollSlotOf(node, container));
    const positions = slots.map(node => container.children.indexOf(node));
    expect(positions[0]).toBe(0);
    expect(new Set(positions).size).toBe(4);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });
  it('#199 R3 la tarjeta entra con RiseIn sin retraso', async () => {
    await renderWeightLog();
    const card = await screen.findByTestId('weight-chart-card');
    expect(riseDelayOf(card)).toBe(0);
  });
});

describe('#199 R4: cifra y delta del mes', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-17T18:00:00Z'));
    prepareWeightLogTests();
    mockGetMe.mockResolvedValue({ kind: 'ok', me: makeProfile('America/Mexico_City') });
  });
  afterEach(() => jest.useRealTimers());
  async function show(latest: number) {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [makeWeight({ measuredAt: '2026-09-15', weightKg: latest }), makeWeight({ id: 'previous', measuredAt: '2026-08-30', weightKg: 12 })] });
    await renderWeightLog();
    await screen.findByTestId('weight-current');
  }
  it('#199 R4 la cifra usa text-34 font-black text-foreground', async () => {
    await show(12.4);
    expect(screen.getByTestId('weight-summary').props.className).toBe('flex-row items-baseline gap-2');
    expect(screen.getByTestId('weight-current').props.className).toBe('text-34 font-black text-foreground');
    expect(screen.getByTestId('weight-current').props.style).toEqual({ fontVariant: ['tabular-nums'] });
  });
  it.each([['sube', 'text-danger', 12.4], ['baja', 'text-accent-strong', 11.7], ['igual', 'text-muted', 12]] as const)('#199 R4 delta %s pinta %s sin icono', async (_name, tone, latest) => {
    await show(latest);
    expect(screen.getByTestId('weight-month-delta-text').props.className).toBe(`text-sm font-extrabold ${tone}`);
    expect(screen.getByTestId('weight-month-delta-text').props.style).toEqual({ fontVariant: ['tabular-nums'] });
    expect(screen.queryByTestId('weight-month-delta')).toBeNull();
  });
});

describe('#199 R7: formulario de Peso', () => {
  beforeEach(() => { prepareWeightLogTests(); });
  async function form() {
    await renderWeightLog();
    await screen.findByTestId('weight-log-empty');
    expect(screen.queryByTestId('weight-form')).not.toBeNull();
    return screen.getByTestId('weight-form');
  }
  it('#199 R7 weight-form es un Card flat con gap-2.5 py-3.5 y entra a los 80 ms', async () => {
    const node = await form();
    expect(node.props.className).toBe('rounded-card border border-border bg-surface px-3.5 gap-2.5 py-3.5');
    expect(riseDelayOf(node)).toBe(80);
  });
  it('#199 R7 peso y fecha comparten la primera fila y la condición va debajo', async () => {
    const node = await form();
    const row = node.children[0] as TestInstance;
    expect(row.props.className).toBe('flex-row gap-2.5');
    expect(row.children).toHaveLength(2);
    for (const child of row.children as TestInstance[]) {
      expect(child.props.className).toContain('flex-1');
      expect(child.props.className).toContain('gap-1.5');
    }
    expect(within(row).getByTestId('weight-input')).toBeOnTheScreen();
    expect(within(row).getByTestId('weight-date-input')).toBeOnTheScreen();
    const condition = node.children[1] as TestInstance;
    expect(condition.props.className).toContain('gap-1.5');
    expect(within(condition).getByTestId('weight-bc-input')).toBeOnTheScreen();
  });
  it('#199 R7 las tres etiquetas pintan text-13 font-extrabold con su literal', async () => {
    const node = await form();
    for (const label of ['Peso', 'Fecha de medición', 'Condición corporal']) {
      expect(within(node).getByText(label).props.className).toBe('text-13 font-extrabold text-foreground');
    }
  });
  it('#199 R7 los tres inputs llevan h-12 rounded-xl bg-default', async () => {
    const node = await form();
    for (const id of ['weight-input', 'weight-date-input', 'weight-bc-input']) {
      const input = within(node).getByTestId(id);
      for (const token of ['h-12', 'rounded-xl', 'bg-default']) expect(input.props.className.split(/\s+/)).toContain(token);
    }
  });
});

describe('#199 R8: envío de Peso', () => {
  it('#199 R8 el envío es el último hijo de weight-form y conserva h-14 rounded-16 bg-accent', async () => {
    prepareWeightLogTests();
    await renderWeightLog();
    await screen.findByTestId('weight-log-empty');
    const form = screen.getByTestId('weight-form');
    const submit = screen.getByTestId('weight-submit');
    expect(form.children.at(-1) === scrollSlotOf(submit, form)).toBe(true);
    for (const token of ['h-14', 'rounded-16', 'bg-accent']) expect(submit.props.className.split(/\s+/)).toContain(token);
    expect(within(submit).getByText('Registrar peso').props.className).toBe('text-17 font-extrabold text-accent-foreground');
    expect(readFileSync(join(process.cwd(), 'src/screens/weight-log/index.tsx'), 'utf8')).toContain('style={chunkyLip.primary}');
  });
});

describe('#199 R9: historial de Peso', () => {
  const history = Array.from({ length: 4 }, (_, i) => makeWeight({ id: `history-${i}`, weightKg: 12.4 - i / 10 }));
  beforeEach(() => { prepareWeightLogTests(); mockListWeights.mockResolvedValue({ kind: 'ok', weights: history }); });
  async function show() { await renderWeightLog(); await screen.findByTestId('weight-row-history-0'); }
  it('#199 R9 pinta Historial con text-17 font-extrabold antes de las filas', async () => {
    await show();
    expect(screen.queryByTestId('weight-history-title')).not.toBeNull();
    const title = screen.getByTestId('weight-history-title');
    expect(title).toHaveTextContent('Historial', { exact: true });
    expect(title.props.accessibilityRole).toBe('header');
    expect(title.props.className).toBe('mb-1 text-17 font-extrabold text-foreground');
    const container = title.parent!;
    expect(container.children.indexOf(title)).toBeLessThan(container.children.indexOf(scrollSlotOf(screen.getByTestId('weight-row-history-0'), container)));
  });
  it('#199 R9 cada fila es un View con borde superior y py-2.5', async () => {
    await show();
    const rows = screen.getAllByTestId(/^weight-row-history-\d+$/);
    expect(rows.map(row => row.props.testID)).toEqual(['weight-row-history-0', 'weight-row-history-1', 'weight-row-history-2', 'weight-row-history-3']);
    for (const row of rows) expect(row.props.className).toBe('flex-row items-center gap-3 border-t border-border py-2.5');
  });
  it.each([[0, 140], [1, 200], [2, 260], [3, 260]])('#199 R9 la fila %i entra a los %i ms', async (index, delay) => {
    await show();
    expect(riseDelayOf(screen.getByTestId(`weight-row-history-${index}`))).toBe(delay);
  });
  it('#199 R9 sin registros no pinta Historial', async () => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });
    await renderWeightLog();
    await screen.findByTestId('weight-log-empty');
    expect(screen.queryByTestId('weight-history-title')).toBeNull();
  });
});

describe('#199 R10: fila del historial', () => {
  beforeEach(() => { prepareWeightLogTests(); });
  it('#199 R10 la cifra pinta text-15 font-extrabold y anida el delta en text-13', async () => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [makeWeight()] });
    await renderWeightLog();
    await screen.findByTestId('weight-row-weight-1');
    const delta = screen.getByTestId('weight-row-weight-1-delta');
    const figure = delta.parent!;
    expect(figure.type).toBe('Text');
    expect(figure.props.className).toBe('text-15 font-extrabold text-foreground');
    expect(figure).toHaveTextContent('12.4 kg +0.4 kg', { exact: true });
    expect(delta.props.className).toBe('text-13 text-danger');
  });
  it('#199 R10 sin condición corporal no pinta la línea CC', async () => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [makeWeight({ bodyCondition: null })] });
    await renderWeightLog();
    const row = await screen.findByTestId('weight-row-weight-1');
    expect(within(row).queryByText(/^CC /)).toBeNull();
  });
});


describe('#199 R11: fechas del historial', () => {
  beforeEach(() => { prepareWeightLogTests(); });
  it.each([
    ['2025-12-31', '31 dic'],
    ['2026-01-01', '1 ene'],
  ])('#199 R11 la fecha %s se lee %s en text-13 font-semibold (enmendado por #220 R12)', async (measuredAt, expected) => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [makeWeight({ measuredAt })] });
    await renderWeightLog();
    const date = await screen.findByTestId('weight-row-weight-1-date');
    expect(date.type).toBe('Text');
    expect(date.props.className).toBe('text-13 font-semibold text-muted');
    expect(date).toHaveTextContent(expected, { exact: true });
    expect(screen.getByTestId('weight-date-input-value').props.value).toMatch(/^\d{1,2} [a-z]{3} \d{4}$/);
  });
});


describe('#199 R22: estados de Peso', () => {
  beforeEach(() => { prepareWeightLogTests(); });
  async function renderLoading199() {
    mockListWeights.mockReturnValue(pending<WeightsState>());
    await renderWeightLog();
    return screen.findByTestId('weight-log-loading');
  }
  function skeletonRows199() {
    return screen.getAllByTestId(/^weight-log-skeleton-row-\d+$/, { includeHiddenElements: true });
  }
  it('#199 R22 en carga pinta cabecera, formulario y tres filas esqueleto (enmendado por #216 R1)', async () => {
    const loading = await renderLoading199();
    await screen.findByTestId('weight-form');
    expect(skeletonRows199().map(node => node.props.testID)).toEqual(['weight-log-skeleton-row-0', 'weight-log-skeleton-row-1', 'weight-log-skeleton-row-2']);
    const container = screen.getByTestId('weight-log-header').parent!;
    const slots = [screen.getByTestId('weight-log-header'), screen.getByTestId('weight-form'), loading].map(node => scrollSlotOf(node, container));
    expect(slots.map(node => container.children.indexOf(node))).toEqual([0, 1, 2]);
    expect(screen.queryByTestId('weight-chart-card')).toBeNull();
    expect(screen.queryByTestId('weight-history-title')).toBeNull();
  });
  it('#199 R22 cada fila esqueleto lleva tile y tres barras con sus clases', async () => {
    await renderLoading199();
    for (const row of skeletonRows199()) {
      expect(row.props.className).toBe('flex-row items-center gap-3 border-t border-border py-2.5');
      const parts = row.children.filter((child): child is TestInstance => typeof child !== 'string');
      expect(parts).toHaveLength(3);
      expect(parts[0].props.className).toBe('skeleton__root size-9 rounded-xl');
      expect(parts[1].props.className).toBe('flex-1 gap-1.5');
      expect(parts[1].children.filter((child): child is TestInstance => typeof child !== 'string').map(child => child.props.className)).toEqual(['skeleton__root h-3.5 w-2/5 rounded-full', 'skeleton__root h-2.5 w-1/5 rounded-full']);
      expect(parts[2].props.className).toBe('skeleton__root h-3 w-9.5 rounded-full');
    }
  });
  it.each([[0, 0], [1, 60], [2, 120]])('#199 R22 la fila esqueleto %i entra a los %i ms', async (index, delay) => {
    await renderLoading199();
    expect(riseDelayOf(screen.getByTestId(`weight-log-skeleton-row-${index}`, { includeHiddenElements: true }))).toBe(delay);
  });
  it('#199 R22 sin registros pinta el aviso bajo el formulario sin tarjeta ni Historial', async () => {
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [] });
    await renderWeightLog();
    const empty = await screen.findByTestId('weight-log-empty');
    expect(empty.props.className).toBe('text-15 leading-body text-muted');
    const container = empty.parent!;
    expect(container.children.indexOf(scrollSlotOf(screen.getByTestId('weight-form'), container))).toBeLessThan(container.children.indexOf(empty));
    expect(screen.queryByTestId('weight-chart-card')).toBeNull();
    expect(screen.queryByTestId('weight-history-title')).toBeNull();
  });
  it('#199 R22 con error pinta el aviso con role alert y Reintentar bajo el formulario', async () => {
    mockListWeights.mockResolvedValue({ kind: 'error' });
    await renderWeightLog();
    const error = await screen.findByTestId('weight-log-error');
    expect(error.props.className).toBe('text-15 leading-body text-danger');
    expect(error.props.accessibilityRole).toBe('alert');
    const container = screen.getByTestId('weight-log-header').parent!;
    expect(container.children.indexOf(scrollSlotOf(screen.getByTestId('weight-form'), container))).toBeLessThan(container.children.indexOf(scrollSlotOf(error, container)));
    expect(screen.getByTestId('weight-log-retry')).toHaveTextContent('Reintentar');
    expect(screen.queryByTestId('weight-chart-card')).toBeNull();
    expect(screen.queryByTestId('weight-history-title')).toBeNull();
  });
});


describe('#199 R23: toast de registro', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-17T23:30:00Z'));
    prepareWeightLogTests();
    mockCreateWeight.mockResolvedValue({ kind: 'ok', weight: makeWeight() });
  });
  afterEach(() => jest.useRealTimers());
  async function showToast199() {
    await renderWeightLog();
    const input = await screen.findByTestId('weight-input');
    await fireEvent.changeText(input, '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));
    return screen.findByTestId('weight-toast');
  }
  it('#199 R23 el toast es una píldora con borde, sombra toast y top inset + 42', async () => {
    const toast = await showToast199();
    expect(toast.props.className).toBe('absolute flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5');
    expect(toast.props.style).toEqual([{ top: 82 }, { boxShadow: [{ offsetX: 0, offsetY: 2, blurRadius: 8, spreadDistance: 0, color: 'shadow-10' }] }]);
  });
  it('#199 R23 el check es de 16 en accent-strong y el texto es el de weightLog.weightLogged', async () => {
    const toast = await showToast199();
    const check = within(toast).getByTestId('icon-check');
    expect(check.props.size).toBe(16);
    expect(check.props.strokeWidth).toBe(2.6);
    expect(check.props.style.color).toBe('blue');
    const text = within(toast).getByText('Anotado. Ya lo puse en la gráfica.');
    expect(text.type).toBe('Text');
    expect(text.props.className).toBe('text-sm font-semibold text-foreground');
  });
  it('#199 R23 el fuente declara FadeIn.duration(MOTION_TOAST_FADE_MS).delay(MOTION_TOAST_DELAY_MS)', () => {
    const source = readFileSync(join(process.cwd(), 'src/screens/weight-log/index.tsx'), 'utf8');
    expect(source).toContain('entering={FadeIn.duration(MOTION_TOAST_FADE_MS).delay(MOTION_TOAST_DELAY_MS)}');
  });
});


describe('#220 R12: Peso usa DateField', () => {
  beforeEach(() => {
    prepareWeightLogTests();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-17T23:30:00Z'));
  });
  afterEach(() => jest.useRealTimers());
  it('#220 R12: el campo de fecha muestra hoy en la zona del perfil y se elige con el selector', async () => {
    await renderWeightLog();
    await waitFor(() => expect(screen.getByTestId('weight-date-input-value').props.value).toBe('18 sep 2026'));
    await fireEvent.press(screen.getByTestId('weight-date-input'));
    const picker = screen.getByTestId('weight-date-picker');
    expect(picker.props.maximumDate.getTime()).toBe(new Date(2026, 8, 18, 12).getTime());
    expect(picker.props.minimumDate).toBeUndefined();
    await fireEvent(picker, 'onValueChange', {}, new Date(2026, 7, 20));
    expect(screen.getByTestId('weight-date-input-value').props.value).toBe('20 ago 2026');
    await fireEvent.changeText(screen.getByTestId('weight-input'), '12.4');
    await fireEvent.press(screen.getByTestId('weight-submit'));
    await waitFor(() => expect(screen.getByTestId('weight-submit')).toBeDisabled());
    expect(mockCreateWeight).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1', { weightKg: 12.4, measuredAt: '2026-08-20' });
  });
});


describe('#216 R1: Peso solo deja registrar al dueño', () => {
  beforeEach(() => {
    prepareWeightLogTests();
    mockListWeights.mockResolvedValue({ kind: 'ok', weights: [makeWeight()] });
  });
  it.each([
    ['owner', true],
    ['family', false],
    ['walker', false],
    ['vet', false],
  ] as const)('#216 R1 con el rol %s el formulario se pinta: %s', async (role, formVisible) => {
    const pet = makePet({ myRole: role });
    mockGetPet.mockResolvedValue({ kind: 'ok', pet });
    const { queryClient } = await renderWeightLog();
    await screen.findByTestId('weight-row-weight-1');
    await waitFor(() => expect(queryClient.getQueryData(petKeys.detail('pet-1'))).toEqual({ kind: 'ok', pet }));
    expect(mockGetPet).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1');
    for (const id of ['weight-form', 'weight-input', 'weight-date-input', 'weight-bc-input', 'weight-submit']) {
      if (formVisible) expect(screen.queryByTestId(id)).not.toBeNull();
      else expect(screen.queryByTestId(id)).toBeNull();
    }
    for (const id of ['weight-log-header', 'weight-chart-card', 'weight-history-title']) {
      expect(screen.queryByTestId(id)).not.toBeNull();
    }
  });
  it('#216 R1 mientras la mascota carga no pinta el formulario', async () => {
    mockGetPet.mockReturnValue(pending());
    await renderWeightLog();
    await screen.findByTestId('weight-row-weight-1');
    expect(screen.queryByTestId('weight-form')).toBeNull();
    expect(screen.queryByTestId('weight-submit')).toBeNull();
  });
});
