import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';

import {
  listAlerts,
  type AlertsState,
} from '../../api/alerts';
import type { Alert } from '../../api/types';
import { es } from '../../i18n/catalog';
import {
  useAuth,
  type AuthContextValue,
} from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { renderWithProviders } from '../../../test/render-with-providers';
import { AlertsScreen } from '.';

jest.mock('../../api/alerts', () => ({
  listAlerts: jest.fn(),
}));

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const apiUrl = 'http://example.test/v1';
const mockListAlerts = jest.mocked(listAlerts);
const mockUseAuth = jest.mocked(useAuth);

function makeAlert(overrides: Partial<Alert> = {}): Alert {
  return {
    id: 'alert-1',
    petId: 'pet-1',
    petName: 'Luna',
    type: 'geofence_exit',
    status: 'open',
    openedAt: '2026-09-11T10:00:00.000Z',
    payload: {},
    ...overrides,
  };
}

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

function AlertsWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial="es">{children}</LanguageProvider>
    </HeroUINativeProvider>
  );
}

function renderAlerts(onUnauthorized?: () => void) {
  return renderWithProviders(<AlertsScreen />, {
    wrapper: AlertsWrapper,
    onUnauthorized,
  });
}

describe('#78 R4: la pantalla pinta su esqueleto, su error, su vacío y sus filas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
  });

  it('pinta tres esqueletos mientras espera la primera página', async () => {
    mockListAlerts.mockReturnValue(pending<AlertsState>());

    await renderAlerts();

    expect(screen.getByTestId('screen-alerts')).toBeVisible();
    expect(screen.getByText(es['alerts.title'])).toBeVisible();
    const loading = screen.getByTestId('alerts-loading');
    expect(loading.children).toHaveLength(3);
    for (const number of [1, 2, 3]) {
      expect(
        screen.getByTestId(`alert-row-skeleton-${number}`).props.className,
      ).toBe('h-20 w-full rounded-card');
    }
  });

  it('pinta y reintenta cada error de la primera página', async () => {
    const errors: AlertsState[] = [
      { kind: 'error' },
      { kind: 'unreachable', message: 'network down' },
      { kind: 'missing-config' },
    ];

    for (const error of errors) {
      mockListAlerts.mockReset().mockResolvedValue(error);
      const rendered = await renderAlerts();

      await waitFor(() =>
        expect(screen.getByTestId('alerts-error')).toHaveTextContent(
          es['common.somethingWentWrong'],
        ),
      );
      expect(screen.getByTestId('alerts-error').props.className).toBe(
        'text-danger',
      );
      expect(screen.getByText(es['common.retry'])).toBeVisible();
      await fireEvent.press(screen.getByTestId('alerts-retry'));
      await waitFor(() => expect(mockListAlerts).toHaveBeenCalledTimes(2));
      rendered.unmount();
    }
  });

  it('pinta el estado vacío', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [], nextCursor: null });

    await renderAlerts();

    await waitFor(() =>
      expect(screen.getByTestId('alerts-empty')).toHaveTextContent(
        es['alerts.empty'],
      ),
    );
    expect(screen.getByTestId('alerts-empty').props.className).toBe(
      'font-normal text-muted',
    );
  });

  it('pinta una fila por alerta con clave estable', async () => {
    mockListAlerts.mockResolvedValue({
      kind: 'ok',
      items: [makeAlert(), makeAlert({ id: 'alert-2' })],
      nextCursor: null,
    });

    await renderAlerts();

    await waitFor(() =>
      expect(screen.getByTestId('alert-row-alert-1')).toBeVisible(),
    );
    expect(screen.getByTestId('alert-row-alert-2')).toBeVisible();
    expect(screen.getByTestId('alerts-list').props.data).toHaveLength(2);
  });

  it('mantiene los estados excluyentes y no pinta uno para unauthorized', async () => {
    const cases: Array<{
      result: Promise<AlertsState>;
      visible: string | null;
    }> = [
      { result: pending<AlertsState>(), visible: 'alerts-loading' },
      { result: Promise.resolve({ kind: 'error' }), visible: 'alerts-error' },
      {
        result: Promise.resolve({ kind: 'ok', items: [], nextCursor: null }),
        visible: 'alerts-empty',
      },
      {
        result: Promise.resolve({
          kind: 'ok',
          items: [makeAlert()],
          nextCursor: null,
        }),
        visible: null,
      },
      { result: Promise.resolve({ kind: 'unauthorized' }), visible: null },
    ];

    for (const testCase of cases) {
      const onUnauthorized = jest.fn();
      mockListAlerts.mockReset().mockReturnValue(testCase.result);
      const rendered = await renderAlerts(onUnauthorized);

      if (testCase.visible) {
        await waitFor(() =>
          expect(screen.getByTestId(testCase.visible!)).toBeVisible(),
        );
      } else {
        await waitFor(() => expect(mockListAlerts).toHaveBeenCalledTimes(1));
      }
      const visibleStates = [
        'alerts-loading',
        'alerts-error',
        'alerts-empty',
      ].filter((testID) => screen.queryByTestId(testID) !== null);
      expect(visibleStates).toEqual(
        testCase.visible === null ? [] : [testCase.visible],
      );
      rendered.unmount();
    }
  });

  it('respeta las dimensiones, el inset automático y los safe areas', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [], nextCursor: null });

    await renderAlerts();

    await waitFor(() => expect(screen.getByTestId('alerts-list')).toBeVisible());
    const list = screen.getByTestId('alerts-list');
    expect(list.props.className).toBe('flex-1 bg-background');
    expect(list.props.contentInsetAdjustmentBehavior).toBe('automatic');
    expect(list.props.contentContainerStyle).toEqual({
      padding: 24,
      gap: 16,
      paddingTop: 52,
      paddingBottom: 120,
    });
  });
});
