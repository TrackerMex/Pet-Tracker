import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import type { TestInstance } from 'test-renderer';

import {
  ackAlert,
  type AckAlertState,
  listAlerts,
  type AlertsState,
} from '../../api/alerts';
import { alertKeys } from '../../api/query-keys';
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
  ackAlert: jest.fn(),
  listAlerts: jest.fn(),
}));

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

jest.mock('reicon-react-native', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );
  const icon = (iconName: string) =>
    function MockIcon(props: Record<string, unknown>) {
      return React.createElement(
        View as unknown as React.ComponentType<Record<string, unknown>>,
        { ...props, iconName },
      );
    };

  return {
    BatteryLow: icon('BatteryLow'),
    Bell: icon('Bell'),
    LocationSlash: icon('LocationSlash'),
  };
});

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: readonly string[]) =>
    tokens.map((token) => `--color-${token}`),
}));

const apiUrl = 'http://example.test/v1';
const mockAckAlert = jest.mocked(ackAlert);
const mockListAlerts = jest.mocked(listAlerts);
const mockUseAuth = jest.mocked(useAuth);
const mockSignOut = jest.fn<Promise<void>, []>();

function makeAlert(overrides: Partial<Alert> = {}): Alert {
  return {
    id: 'alert-1',
    petId: 'pet-1',
    petName: 'Luna',
    type: 'geofence_exit',
    status: 'open',
    geofenceId: null,
    openedAt: '2026-09-11T10:00:00.000Z',
    ackedAt: null,
    closedAt: null,
    payload: {},
    ...overrides,
  };
}

function pending<T>(): Promise<T> {
  return new Promise(() => undefined);
}

function elementChild(
  node: TestInstance,
  index: number,
): TestInstance {
  const child = node.children[index];
  if (typeof child === 'string') throw new Error('Expected an element child');
  return child;
}

function AlertsWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial="es">{children}</LanguageProvider>
    </HeroUINativeProvider>
  );
}

function renderAlerts() {
  return renderWithProviders(<AlertsScreen />, {
    wrapper: AlertsWrapper,
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
      ).toContain('h-20 w-full rounded-card');
    }
  });

  it('pinta y reintenta cada error de la primera página', async () => {
    const errors: AlertsState[] = [
      { kind: 'error' },
      { kind: 'unreachable', message: 'network down' },
      { kind: 'missing-config' },
    ];
    for (const error of errors) mockListAlerts.mockResolvedValueOnce(error);

    const rendered = await renderAlerts();

    for (const [index, error] of errors.entries()) {
      await waitFor(() =>
        expect(rendered.queryClient.getQueryData(alertKeys.list())).toEqual(
          expect.objectContaining({ pages: [error] }),
        ),
      );
      expect(screen.getByTestId('alerts-error')).toHaveTextContent(
        es['common.somethingWentWrong'],
      );
      expect(screen.getByTestId('alerts-error').props.className).toBe(
        'text-danger',
      );
      expect(screen.getByText(es['common.retry'])).toBeVisible();
      if (index < errors.length - 1) {
        await fireEvent.press(screen.getByTestId('alerts-retry'));
        await waitFor(() =>
          expect(mockListAlerts).toHaveBeenCalledTimes(index + 2),
        );
      }
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
    expect(screen.queryByTestId('alerts-loading')).toBeNull();
    expect(screen.queryByTestId('alerts-error')).toBeNull();
    expect(screen.queryByTestId('alerts-empty')).toBeNull();
  });

  it('mantiene los estados excluyentes y no pinta uno para unauthorized', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'unauthorized' });

    await renderAlerts();

    await waitFor(() =>
      expect(screen.queryByTestId('alerts-loading')).toBeNull(),
    );
    expect(screen.queryByTestId('alerts-loading')).toBeNull();
    expect(screen.queryByTestId('alerts-error')).toBeNull();
    expect(screen.queryByTestId('alerts-empty')).toBeNull();
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

describe('#78 R6: cada fila de alerta trae su icono, su hueco, su tinta y sus tres hijos en orden', () => {
  const now = Date.parse('2026-09-11T12:00:00.000Z');

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    jest.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([
    {
      type: 'geofence_exit',
      iconName: 'LocationSlash',
      labelKey: 'alerts.typeGeofenceExit',
      surface: 'bg-danger-soft',
      color: '--color-danger',
    },
    {
      type: 'battery_low',
      iconName: 'BatteryLow',
      labelKey: 'alerts.typeBatteryLow',
      surface: 'bg-warning-soft',
      color: '--color-warning-strong',
    },
    {
      type: 'future_alert_type',
      iconName: 'Bell',
      labelKey: 'alerts.typeUnknown',
      surface: 'bg-default',
      color: '--color-muted',
    },
  ] as const)(
    'canda las doce decisiones para $type',
    async ({ type, iconName, labelKey, surface, color }) => {
      const alert = makeAlert({ id: type, type });
      mockListAlerts.mockResolvedValue({
        kind: 'ok',
        items: [alert],
        nextCursor: null,
      });

      await renderAlerts();

      const list = screen.getByTestId('alerts-list');
      await waitFor(() => expect(list.props.data).toHaveLength(1));
      const rowId = `alert-row-${alert.id}`;
      const row = within(list).getByTestId(rowId);
      const rowScope = within(row);
      const icon = rowScope.getByTestId(`${rowId}-icon`);
      const typeText = rowScope.getByTestId(`${rowId}-type`);
      const petText = rowScope.getByTestId(`${rowId}-pet`);
      const timeText = rowScope.getByTestId(`${rowId}-time`);
      const ack = rowScope.getByTestId(`${rowId}-ack`);

      expect(icon.props.iconName).toBe(iconName);
      expect(icon.props.size).toBe(20);
      expect(icon.props.color).toBe(color);
      expect(icon.parent?.props.className).toBe(
        `size-11 items-center justify-center rounded-full ${surface}`,
      );
      expect(typeText).toHaveTextContent(es[labelKey]);
      expect(typeText.props.className).toBe(
        'text-sm font-bold text-foreground',
      );
      expect(petText).toHaveTextContent(alert.petName);
      expect(petText.props.className).toBe(
        'text-xs font-semibold text-muted',
      );
      expect(timeText).toHaveTextContent(
        es['alerts.hoursAgo'].replace('{{hours}}', '2'),
      );
      expect(timeText.props.className).toBe(
        'text-xs font-normal text-muted',
      );
      expect(ack.props.accessibilityRole).toBe('button');
      expect(ack.props.className).toContain('min-h-11');
      expect(rowScope.getByText(es['alerts.ack'])).toBeVisible();
      expect(rowScope.queryByTestId(`${rowId}-status`)).toBeNull();
      expect(row.props.onPress).toBeUndefined();
      expect(row.props.accessibilityRole).toBeUndefined();
      expect(row.props.className).toContain(
        'min-h-20 flex-row items-center gap-3',
      );
      expect(row.children).toHaveLength(3);
      expect(elementChild(row, 0).props.className).toContain('size-11');
      expect(elementChild(row, 1).props.className).toBe(
        'min-w-0 flex-1 gap-1',
      );
      expect(elementChild(row, 1).children).toHaveLength(3);
      expect(elementChild(row, 2).props.testID).toBe(`${rowId}-ack`);
    },
  );

  it('alterna el tercer hijo entre ack y la píldora traducida', async () => {
    const alerts = [
      makeAlert({ id: 'open', status: 'open' }),
      makeAlert({ id: 'acked', status: 'acked' }),
      makeAlert({ id: 'closed', status: 'closed' }),
    ];
    mockListAlerts.mockResolvedValue({
      kind: 'ok',
      items: alerts,
      nextCursor: null,
    });
    await renderAlerts();

    const list = screen.getByTestId('alerts-list');
    await waitFor(() => expect(list.props.data).toHaveLength(3));
    for (const alert of alerts) {
      const rowId = `alert-row-${alert.id}`;
      const row = within(list).getByTestId(rowId);
      expect(row.children).toHaveLength(3);
      expect(row.props.className).toContain(
        'min-h-20 flex-row items-center gap-3',
      );
      expect(elementChild(row, 0).props.className).toContain('size-11');
      expect(elementChild(row, 1).props.className).toBe(
        'min-w-0 flex-1 gap-1',
      );
    }

    const open = within(within(list).getByTestId('alert-row-open'));
    expect(open.getByTestId('alert-row-open-ack')).toBeVisible();
    expect(open.queryByTestId('alert-row-open-status')).toBeNull();

    for (const [status, labelKey] of [
      ['acked', 'alerts.statusAcked'],
      ['closed', 'alerts.statusClosed'],
    ] as const) {
      const rowScope = within(
        within(list).getByTestId(`alert-row-${status}`),
      );
      const pill = rowScope.getByTestId(`alert-row-${status}-status`);
      expect(rowScope.queryByTestId(`alert-row-${status}-ack`)).toBeNull();
      expect(pill).toHaveTextContent(es[labelKey]);
      expect(pill.props.className).toBe(
        'rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted',
      );
    }
  });

  it('formatea ahora, minutos, horas y días por la clave correspondiente', async () => {
    const alerts = [
      makeAlert({ id: 'now', openedAt: '2026-09-11T11:59:30.000Z' }),
      makeAlert({ id: 'minutes', openedAt: '2026-09-11T11:55:00.000Z' }),
      makeAlert({ id: 'hours', openedAt: '2026-09-11T10:00:00.000Z' }),
      makeAlert({ id: 'days', openedAt: '2026-09-08T12:00:00.000Z' }),
    ];
    mockListAlerts.mockResolvedValue({
      kind: 'ok',
      items: alerts,
      nextCursor: null,
    });

    await renderAlerts();

    const list = screen.getByTestId('alerts-list');
    await waitFor(() => expect(list.props.data).toHaveLength(4));
    const expected = {
      now: es['alerts.justNow'],
      minutes: es['alerts.minutesAgo'].replace('{{minutes}}', '5'),
      hours: es['alerts.hoursAgo'].replace('{{hours}}', '2'),
      days: es['alerts.daysAgo'].replace('{{days}}', '3'),
    };
    for (const alert of alerts) {
      const row = within(list).getByTestId(`alert-row-${alert.id}`);
      expect(
        within(row).getByTestId(`alert-row-${alert.id}-time`),
      ).toHaveTextContent(expected[alert.id as keyof typeof expected]);
      expect(row.children).toHaveLength(3);
    }
  });
});

describe('#78 R7: pinta las abiertas primero y conserva la posición tras el ack', () => {
  const alerts = [
    makeAlert({ id: 'acked', status: 'acked' }),
    makeAlert({ id: 'open1', status: 'open' }),
    makeAlert({ id: 'closed', status: 'closed' }),
    makeAlert({ id: 'open2', status: 'open' }),
  ];
  const expectedOrder = [
    'alert-row-open1',
    'alert-row-open2',
    'alert-row-acked',
    'alert-row-closed',
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListAlerts.mockResolvedValue({
      kind: 'ok',
      items: alerts,
      nextCursor: null,
    });
    mockAckAlert.mockResolvedValue({
      kind: 'ok',
      alert: { ...alerts[1], status: 'acked' },
    });
  });

  function rowOrder(): string[] {
    return (screen.getByTestId('alerts-list').props.data as Alert[]).map(
      (alert) => `alert-row-${alert.id}`,
    );
  }

  it('particiona por el status descargado y conserva el orden de cada grupo', async () => {
    await renderAlerts();

    await waitFor(() => expect(rowOrder()).toEqual(expectedOrder));
    expect(mockListAlerts).toHaveBeenCalledWith(
      apiUrl,
      'jwt-token',
      undefined,
      undefined,
    );
  });

  it('no mueve la fila abierta al pulsar su ack', async () => {
    await renderAlerts();
    await waitFor(() => expect(rowOrder()).toEqual(expectedOrder));

    await fireEvent.press(screen.getByTestId('alert-row-open1-ack'));

    await waitFor(() =>
      expect(screen.getByTestId('alert-row-open1-status')).toHaveTextContent(
        es['alerts.statusAcked'],
      ),
    );
    expect(rowOrder()).toEqual(expectedOrder);
  });
});

describe('#78 R8: el ack cambia la fila sin recargar la lista', () => {
  const openAlert = makeAlert();
  const ackedAlert = {
    ...openAlert,
    status: 'acked',
    ackedAt: '2026-09-11T12:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockSignOut.mockResolvedValue();
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: mockSignOut,
    } satisfies AuthContextValue);
    mockListAlerts.mockResolvedValue({
      kind: 'ok',
      items: [openAlert],
      nextCursor: null,
    });
  });

  async function pressAck() {
    await renderAlerts();
    const button = await waitFor(() =>
      screen.getByTestId('alert-row-alert-1-ack'),
    );
    await fireEvent.press(button);
  }

  it('aplica el Alert devuelto por ok y quita el botón', async () => {
    mockAckAlert.mockResolvedValue({ kind: 'ok', alert: ackedAlert });

    await pressAck();

    expect(mockAckAlert).toHaveBeenCalledWith(
      apiUrl,
      'jwt-token',
      openAlert.id,
    );
    await waitFor(() =>
      expect(screen.getByTestId('alert-row-alert-1-status')).toHaveTextContent(
        es['alerts.statusAcked'],
      ),
    );
    expect(screen.queryByTestId('alert-row-alert-1-ack')).toBeNull();
  });

  it('convierte already-closed en la píldora resuelta', async () => {
    mockAckAlert.mockResolvedValue({ kind: 'already-closed' });

    await pressAck();

    await waitFor(() =>
      expect(screen.getByTestId('alert-row-alert-1-status')).toHaveTextContent(
        es['alerts.statusClosed'],
      ),
    );
    expect(screen.queryByTestId('alert-row-alert-1-ack')).toBeNull();
  });

  it('mantiene la fila en not-found, muestra el error y lo limpia al reintentar', async () => {
    mockAckAlert
      .mockResolvedValueOnce({ kind: 'not-found' })
      .mockResolvedValueOnce({ kind: 'ok', alert: ackedAlert });

    await pressAck();

    await waitFor(() =>
      expect(screen.getByTestId('alerts-action-error')).toHaveTextContent(
        es['common.somethingWentWrong'],
      ),
    );
    expect(screen.getByTestId('alerts-action-error').props.className).toBe(
      'text-danger',
    );
    expect(screen.getByTestId('alert-row-alert-1-ack')).toBeVisible();
    await fireEvent.press(screen.getByTestId('alert-row-alert-1-ack'));
    await waitFor(() =>
      expect(screen.queryByTestId('alerts-action-error')).toBeNull(),
    );
  });

  it('traduce unreachable como servidor inalcanzable', async () => {
    mockAckAlert.mockResolvedValue({
      kind: 'unreachable',
      message: 'network down',
    });

    await pressAck();

    await waitFor(() =>
      expect(screen.getByTestId('alerts-action-error')).toHaveTextContent(
        es['common.cannotReachServer'],
      ),
    );
  });

  it('cierra sesión en unauthorized sin pintar error', async () => {
    mockAckAlert.mockResolvedValue({ kind: 'unauthorized' });

    await pressAck();

    await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
    expect(screen.queryByTestId('alerts-action-error')).toBeNull();
  });

  it.each([
    { kind: 'error' },
    { kind: 'missing-config' },
  ] as const)('traduce $kind como error genérico', async (result) => {
    mockAckAlert.mockResolvedValue(result);

    await pressAck();

    await waitFor(() =>
      expect(screen.getByTestId('alerts-action-error')).toHaveTextContent(
        es['common.somethingWentWrong'],
      ),
    );
  });

  it('no vuelve a cargar la lista tras el ack', async () => {
    mockAckAlert.mockResolvedValue({ kind: 'ok', alert: ackedAlert });

    await pressAck();

    await waitFor(() =>
      expect(screen.getByTestId('alert-row-alert-1-status')).toBeVisible(),
    );
    expect(mockListAlerts).toHaveBeenCalledTimes(1);
  });

  it('deshabilita durante el vuelo y corta dos pulsaciones seguidas', async () => {
    let resolveAck!: (result: AckAlertState) => void;
    mockAckAlert.mockReturnValue(
      new Promise((resolve) => {
        resolveAck = resolve;
      }),
    );
    await renderAlerts();
    const button = await waitFor(() =>
      screen.getByTestId('alert-row-alert-1-ack'),
    );

    fireEvent.press(button);
    fireEvent.press(button);

    await waitFor(() => expect(mockAckAlert).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('alert-row-alert-1-ack')).toBeDisabled();
    await act(async () => {
      resolveAck({ kind: 'ok', alert: ackedAlert });
    });
    await waitFor(() =>
      expect(screen.getByTestId('alert-row-alert-1-status')).toBeVisible(),
    );
  });
});
