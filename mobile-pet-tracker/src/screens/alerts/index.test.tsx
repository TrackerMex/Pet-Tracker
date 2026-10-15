import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { defaultScheduler, notifyManager } from '@tanstack/react-query';
import { router, useFocusEffect } from 'expo-router';
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

declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');

const mockPopIn = jest.fn<void, [import('react-native').ViewProps]>();

jest.mock('../../components/pop-in', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    PopIn(props: import('react-native').ViewProps) {
      mockPopIn(props);
      return React.createElement(View, props);
    },
  };
});

jest.mock('../../api/alerts', () => ({
  ackAlert: jest.fn(),
  listAlerts: jest.fn(),
}));

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn(),
  router: { push: jest.fn() },
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
const mockUseFocusEffect = jest.mocked(useFocusEffect);
const mockRouterPush = jest.mocked(router.push);
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

function EnglishAlertsWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial="en">{children}</LanguageProvider>
    </HeroUINativeProvider>
  );
}

function renderAlertsInEnglish() {
  return renderWithProviders(<AlertsScreen />, {
    wrapper: EnglishAlertsWrapper,
  });
}

async function focusScreen(): Promise<(() => void)[]> {
  let cleanups: (() => void)[] = [];

  await act(async () => {
    const callbacks = new Set(
      mockUseFocusEffect.mock.calls.map(([callback]) => callback),
    );
    cleanups = [...callbacks].flatMap((callback) => {
      const cleanup = callback();
      return typeof cleanup === 'function' ? [cleanup] : [];
    });
    await Promise.resolve();
  });

  return cleanups;
}

async function blurScreen(cleanups: (() => void)[]) {
  await act(async () => {
    cleanups.forEach((cleanup) => cleanup());
    await Promise.resolve();
  });
}

afterEach(() => notifyManager.setScheduler(defaultScheduler));

describe('#78 R4: la pantalla pinta su esqueleto, su error, su vacío y sus filas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListAlerts.mockReset();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
  });

  describe('#174 R3: el título vive en el contenido', () => {
    it.each(['carga', 'error', 'vacía', 'filas'])('pinta el título en %s', async (state) => {
      if (state === 'carga') mockListAlerts.mockReturnValue(pending<AlertsState>());
      else if (state === 'error') mockListAlerts.mockResolvedValue({ kind: 'error' });
      else mockListAlerts.mockResolvedValue({ kind: 'ok', items: state === 'vacía' ? [] : [makeAlert()], nextCursor: null });
      await renderAlerts();

      const title = await screen.findByTestId('alerts-title');
      expect(title).toHaveTextContent('Alertas', { exact: true });
      expect(title.props.accessibilityRole).toBe('header');
      expect(title.props.className).toBe('flex-1 text-26 font-black tracking-title text-foreground');
      expect(title.parent?.props.testID).toBe('alerts-title-row');
      expect(title.parent?.props.className).toBe('flex-row items-center gap-2');
      expect(title.parent?.parent?.props.testID).toBe('alerts-header');
      expect(title.parent?.parent?.props.className).toBe('gap-3');
    });

    it('traduce el título en inglés', async () => {
      mockListAlerts.mockResolvedValue({ kind: 'ok', items: [], nextCursor: null });
      await renderAlertsInEnglish();
      expect(await screen.findByTestId('alerts-title')).toHaveTextContent('Alerts', { exact: true });
    });
  });

  it('pinta tres esqueletos mientras espera la primera página', async () => {
    mockListAlerts.mockReturnValue(pending<AlertsState>());

    await renderAlerts();

    expect(screen.getByTestId('screen-alerts')).toBeVisible();
    const loading = screen.getByTestId('alerts-loading');
    expect(loading.children).toHaveLength(3);
    for (const number of [1, 2, 3]) {
      expect(
        screen.getByTestId(`alert-row-skeleton-${number}`).props.className,
      ).toContain('h-20 w-full rounded-card');
    }
  });

  it('pinta y reintenta cada error de la primera página (#72 R1)', async () => {
    notifyManager.setScheduler((callback) => setTimeout(callback, 200));
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
      expect(await screen.findByTestId('alerts-error')).toHaveTextContent(
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
      expect(screen.getByTestId('alerts-empty-title')).toHaveTextContent(
        'No hay alertas',
      ),
    );
    expect(screen.getByTestId('alerts-empty-title').props.className).toBe(
      'text-center text-lg font-bold text-foreground',
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

  it('respeta las dimensiones bajo cabecera nativa, el inset automático y los safe areas (#114 R6, enmendado por #174 R5)', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [], nextCursor: null });

    await renderAlerts();

    await waitFor(() => expect(screen.getByTestId('alerts-list')).toBeVisible());
    const list = screen.getByTestId('alerts-list');
    expect(list.props.className).toBe('flex-1 bg-background');
    expect(list.props.contentInsetAdjustmentBehavior).toBe('automatic');
    expect(list.props.contentContainerStyle).toEqual({
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 48,
      gap: 12,
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
      disc: 'bg-category-rose',
      color: '--color-danger',
    },
    {
      type: 'battery_low',
      iconName: 'BatteryLow',
      labelKey: 'alerts.typeBatteryLow',
      disc: 'bg-category-amber',
      color: '--color-warning-strong',
    },
    {
      type: 'future_alert_type',
      iconName: 'Bell',
      labelKey: 'alerts.typeUnknown',
      disc: 'bg-default',
      color: '--color-muted',
    },
  ] as const)(
    'canda las doce decisiones para $type (enmendado por #174 R7) (enmendado por #174 R8)',
    async ({ type, iconName, labelKey, disc, color }) => {
      const alert = makeAlert({ id: type, type, petName: 'Rocky' });
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
      const subtitle = rowScope.getByTestId(`${rowId}-subtitle`);
      const icon = rowScope.getByTestId(`${rowId}-icon`);
      const typeText = rowScope.getByTestId(`${rowId}-type`);
      const petText = rowScope.getByTestId(`${rowId}-pet`);
      const timeText = rowScope.getByTestId(`${rowId}-time`);
      const ack = rowScope.getByTestId(`${rowId}-ack`);

      expect(icon.props.iconName).toBe(iconName);
      expect(icon.props.size).toBe(22);
      expect(icon.props.color).toBe(color);
      expect(icon.parent?.props.className).toBe(
        `size-11 items-center justify-center rounded-full ${disc}`,
      );
      expect(typeText).toHaveTextContent(es[labelKey]);
      expect(typeText.props.className).toBe(
        'text-15 font-extrabold text-foreground',
      );
      expect(petText).toHaveTextContent(alert.petName);
      expect(petText.props.className).toBeUndefined();
      expect(subtitle.props.className).toBe('text-xs font-normal text-muted');
      expect(subtitle).toHaveTextContent(`${alert.petName} · Hace 2 h`, { exact: true });
      expect(subtitle.children).toHaveLength(3);
      expect(elementChild(subtitle, 0).props.testID).toBe(`${rowId}-pet`);
      expect(subtitle.children[1]).toBe(' · ');
      expect(elementChild(subtitle, 2).props.testID).toBe(`${rowId}-time`);
      expect(timeText).toHaveTextContent(
        es['alerts.hoursAgo'].replace('{{hours}}', '2'),
      );
      expect(timeText.props.className).toBeUndefined();
      expect(ack.props.accessibilityRole).toBe('button');
      for (const value of ['h-8.5', 'rounded-10', 'border-2', 'border-b-5', 'border-lip-gray', 'bg-surface', 'px-3']) {
        expect(ack.props.className.split(' ')).toContain(value);
      }
      expect(ack.props.className.split(' ')).not.toContain('min-h-11');
      expect(ack.props.hitSlop).toEqual({ top: 6, bottom: 6, left: 6, right: 6 });
      const ackLabel = rowScope.getByText(es['alerts.ack']);
      for (const value of ['text-xs', 'font-extrabold', 'text-foreground']) {
        expect(ackLabel.props.className.split(' ')).toContain(value);
      }
      expect(rowScope.getByText(es['alerts.ack'])).toBeVisible();
      expect(rowScope.queryByTestId(`${rowId}-status`)).toBeNull();
      expect(row.props.onPress).toBeUndefined();
      expect(row.props.accessibilityRole).toBeUndefined();
      const classes = row.props.className.split(' ');
      for (const value of ['flex-row', 'items-center', 'gap-3', 'px-3.5', 'py-3', 'shadow-none']) {
        expect(classes).toContain(value);
      }
      expect(classes).not.toContain('min-h-20');
      expect(classes).not.toContain('shadow-sm');
      expect(row.children).toHaveLength(3);
      expect(elementChild(row, 0).props.className).toContain('size-11');
      expect(elementChild(row, 1).props.className).toBe(
        'min-h-11 min-w-0 flex-1 justify-center gap-0.5',
      );
      const column = elementChild(row, 1);
      expect(column.children).toHaveLength(2);
      expect(elementChild(column, 0).props.testID).toBe(`${rowId}-type`);
      expect(elementChild(column, 1).props.testID).toBe(`${rowId}-subtitle`);
      expect(elementChild(row, 2).props.testID).toBe(`${rowId}-ack`);
    },
  );

  it('alterna el tercer hijo entre ack y la píldora traducida (enmendado por #174 R7) (enmendado por #174 R8)', async () => {
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
      const classes = row.props.className.split(' ');
      for (const value of ['flex-row', 'items-center', 'gap-3', 'px-3.5', 'py-3', 'shadow-none']) {
        expect(classes).toContain(value);
      }
      expect(classes).not.toContain('min-h-20');
      expect(classes).not.toContain('shadow-sm');
      expect(elementChild(row, 0).props.className).toContain('size-11');
      expect(elementChild(row, 1).props.className).toBe(
        'min-h-11 min-w-0 flex-1 justify-center gap-0.5',
      );
    }

    const open = within(within(list).getByTestId('alert-row-open'));
    const ack = open.getByTestId('alert-row-open-ack');
    expect(ack).toBeVisible();
    for (const value of ['h-8.5', 'rounded-10', 'border-2', 'border-b-5', 'border-lip-gray', 'bg-surface', 'px-3']) {
      expect(ack.props.className.split(' ')).toContain(value);
    }
    expect(ack.props.className.split(' ')).not.toContain('min-h-11');
    expect(ack.props.hitSlop).toEqual({ top: 6, bottom: 6, left: 6, right: 6 });
    const ackLabel = open.getByText(es['alerts.ack']);
    for (const value of ['text-xs', 'font-extrabold', 'text-foreground']) {
      expect(ackLabel.props.className.split(' ')).toContain(value);
    }
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

  it('formatea ahora, minutos, horas y días por la clave correspondiente (enmendado por #174 R2)', async () => {
    const cases = [
      ['now', '2026-09-11T11:59:30.000Z', 'Ahora mismo', 'Just now'],
      ['minutes', '2026-09-11T11:55:00.000Z', 'Hace 5 min', '5 min ago'],
      ['hours', '2026-09-11T10:00:00.000Z', 'Hace 2 h', '2 h ago'],
      ['oneDay', '2026-09-10T12:00:00.000Z', 'Hace 1 día', '1 day ago'],
      ['almostTwoDays', '2026-09-09T13:00:00.000Z', 'Hace 1 día', '1 day ago'],
      ['twoDays', '2026-09-09T12:00:00.000Z', 'Hace 2 días', '2 days ago'],
      ['sevenDays', '2026-09-04T12:00:00.000Z', 'Hace 7 días', '7 days ago'],
    ] as const;
    const alerts = cases.map(([id, openedAt]) => makeAlert({ id, openedAt }));
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: alerts, nextCursor: null });

    for (const language of ['es', 'en'] as const) {
      const rendered = await (language === 'es' ? renderAlerts() : renderAlertsInEnglish());
      await screen.findByTestId('alert-row-sevenDays-time');
      for (const [id, , spanish, english] of cases) {
        const rowId = `alert-row-${id}`;
        expect(screen.getByTestId(`${rowId}-time`)).toHaveTextContent(
          language === 'es' ? spanish : english,
          { exact: true },
        );
        expect(screen.getByTestId(rowId).children).toHaveLength(3);
      }
      await rendered.unmount();
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
    const header = screen.getByTestId('alerts-header');
    expect(screen.getByTestId('alerts-action-error').parent).toBe(header);
    expect(elementChild(header, 1).props.testID).toBe('alerts-action-error');
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

  it('cierra sesión en unauthorized sin pintar error (#72 R2)', async () => {
    mockAckAlert.mockResolvedValue({ kind: 'unauthorized' });

    await pressAck();

    await waitFor(() =>
      expect(screen.getByTestId('alert-row-alert-1-ack')).not.toBeDisabled(),
    );
    expect(mockSignOut).toHaveBeenCalledTimes(1);
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

  it('deshabilita durante el vuelo y corta dos pulsaciones seguidas (#72 R2)', async () => {
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

    await fireEvent.press(button);
    await fireEvent.press(button);

    await waitFor(() =>
      expect(screen.getByTestId('alert-row-alert-1-ack')).toBeDisabled(),
    );
    expect(mockAckAlert).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolveAck({ kind: 'ok', alert: ackedAlert });
      await Promise.resolve();
    });
    await waitFor(() =>
      expect(screen.getByTestId('alert-row-alert-1-status')).toBeVisible(),
    );
  });

  describe('#134 R1: caracterización de las ramas sin candado del ack', () => {
    it('muestra Algo salió mal si ackAlert rechaza', async () => {
      mockAckAlert.mockRejectedValueOnce(new Error('request failed'));

      await pressAck();

      await waitFor(() =>
        expect(screen.queryByTestId('alerts-action-error')).toHaveTextContent(
          'Algo salió mal',
        ),
      );
      expect(mockSignOut).not.toHaveBeenCalled();
    });

    it('muestra Algo salió mal si signOut rechaza tras unauthorized', async () => {
      mockAckAlert.mockResolvedValue({ kind: 'unauthorized' });
      mockSignOut.mockRejectedValueOnce(new Error('sign-out failed'));

      await pressAck();

      await waitFor(() =>
        expect(screen.queryByTestId('alerts-action-error')).toHaveTextContent(
          'Algo salió mal',
        ),
      );
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    it('muestra Cannot reach server en inglés si ackAlert responde unreachable', async () => {
      mockAckAlert.mockResolvedValueOnce({ kind: 'unreachable', message: 'network down' });

      await renderAlertsInEnglish();
      await fireEvent.press(await screen.findByTestId('alert-row-alert-1-ack'));
      await waitFor(() => expect(screen.queryByTestId('alerts-action-error')).toHaveTextContent('Cannot reach server'));
    });

    it('muestra Something went wrong en inglés si ackAlert responde error', async () => {
      mockAckAlert.mockResolvedValueOnce({ kind: 'error' });

      await renderAlertsInEnglish();
      await fireEvent.press(await screen.findByTestId('alert-row-alert-1-ack'));
      await waitFor(() => expect(screen.queryByTestId('alerts-action-error')).toHaveTextContent('Something went wrong'));
    });

    it('mantiene el botón deshabilitado hasta que signOut termina tras unauthorized', async () => {
      let finishSignOut: () => void = () => undefined;
      mockAckAlert.mockResolvedValueOnce({ kind: 'unauthorized' });
      mockSignOut.mockReturnValueOnce(
        new Promise<void>((resolve) => {
          finishSignOut = resolve;
        }),
      );

      await pressAck();

      await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
      expect(screen.getByTestId('alert-row-alert-1-ack')).toBeDisabled();

      finishSignOut();
      await waitFor(() => expect(screen.getByTestId('alert-row-alert-1-ack')).not.toBeDisabled());
      expect(screen.queryByTestId('alerts-action-error')).toBeNull();
    });
  });
});

describe('#78 R9: pagina por nextCursor y se para cuando no hay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListAlerts.mockReset();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
  });

  function rowIds(): string[] {
    return (screen.getByTestId('alerts-list').props.data as Alert[]).map(
      ({ id }) => id,
    );
  }

  it('pide el cursor siguiente y conserva las filas de ambas páginas', async () => {
    mockListAlerts
      .mockResolvedValueOnce({
        kind: 'ok',
        items: [makeAlert({ id: 'p1a' }), makeAlert({ id: 'p1b' })],
        nextCursor: 'c1',
      })
      .mockResolvedValueOnce({
        kind: 'ok',
        items: [makeAlert({ id: 'p2a' }), makeAlert({ id: 'p2b' })],
        nextCursor: null,
      });
    await renderAlerts();
    await waitFor(() => expect(rowIds()).toEqual(['p1a', 'p1b']));

    await fireEvent(screen.getByTestId('alerts-list'), 'onEndReached');

    await waitFor(() =>
      expect(rowIds()).toEqual(['p1a', 'p1b', 'p2a', 'p2b']),
    );
    expect(mockListAlerts).toHaveBeenNthCalledWith(
      2,
      apiUrl,
      'jwt-token',
      undefined,
      'c1',
    );
  });

  it('no pide otra página cuando nextCursor es null', async () => {
    mockListAlerts.mockResolvedValue({
      kind: 'ok',
      items: [makeAlert()],
      nextCursor: null,
    });
    await renderAlerts();
    await waitFor(() => expect(rowIds()).toEqual(['alert-1']));

    await fireEvent(screen.getByTestId('alerts-list'), 'onEndReached');

    expect(mockListAlerts).toHaveBeenCalledTimes(1);
  });

  it('corta el segundo onEndReached mientras la página está en vuelo', async () => {
    mockListAlerts
      .mockResolvedValueOnce({
        kind: 'ok',
        items: [makeAlert()],
        nextCursor: 'c1',
      })
      .mockReturnValueOnce(pending<AlertsState>());
    await renderAlerts();
    await waitFor(() => expect(rowIds()).toEqual(['alert-1']));
    const firstHandler = screen.getByTestId('alerts-list').props.onEndReached;

    await fireEvent(screen.getByTestId('alerts-list'), 'onEndReached');
    await waitFor(() => expect(mockListAlerts).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(screen.getByTestId('alerts-list').props.onEndReached).not.toBe(
        firstHandler,
      ),
    );
    await fireEvent(screen.getByTestId('alerts-list'), 'onEndReached');

    expect(mockListAlerts).toHaveBeenCalledTimes(2);
  });

  it('conserva la primera página y muestra error si falla la segunda', async () => {
    mockListAlerts
      .mockResolvedValueOnce({
        kind: 'ok',
        items: [makeAlert({ id: 'p1a' }), makeAlert({ id: 'p1b' })],
        nextCursor: 'c1',
      })
      .mockResolvedValueOnce({ kind: 'error' });
    await renderAlerts();
    await waitFor(() => expect(rowIds()).toEqual(['p1a', 'p1b']));

    await fireEvent(screen.getByTestId('alerts-list'), 'onEndReached');

    await waitFor(() =>
      expect(screen.getByTestId('alerts-action-error')).toHaveTextContent(
        es['common.somethingWentWrong'],
      ),
    );
    expect(rowIds()).toEqual(['p1a', 'p1b']);
    await fireEvent(screen.getByTestId('alerts-list'), 'onEndReached');
    expect(mockListAlerts).toHaveBeenCalledTimes(2);
  });
});

describe(
  '#97 R4: el error del ack no sobrevive a la pérdida de foco',
  () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockListAlerts.mockReset();
      process.env.EXPO_PUBLIC_API_URL = apiUrl;
      mockUseAuth.mockReturnValue({
        status: 'authenticated',
        token: 'jwt-token',
        signIn: jest.fn(),
        signOut: jest.fn(),
      } satisfies AuthContextValue);
      mockListAlerts.mockResolvedValue({
        kind: 'ok',
        items: [makeAlert()],
        nextCursor: null,
      });
      mockAckAlert.mockResolvedValue({ kind: 'error' });
    });

    it('borra el error visible al perder foco', async () => {
      await renderAlerts();
      const button = await waitFor(() =>
        screen.getByTestId('alert-row-alert-1-ack'),
      );
      const cleanups = await focusScreen();

      await fireEvent.press(button);
      await waitFor(() =>
        expect(screen.getByTestId('alerts-action-error')).toBeVisible(),
      );

      await blurScreen(cleanups);

      await waitFor(() =>
        expect(screen.queryByTestId('alerts-action-error')).toBeNull(),
      );
    });
  },
);

describe(
  '#97 R5: el guarda del ack en vuelo sobrevive a la pérdida de foco',
  () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockListAlerts.mockReset();
      process.env.EXPO_PUBLIC_API_URL = apiUrl;
      mockUseAuth.mockReturnValue({
        status: 'authenticated',
        token: 'jwt-token',
        signIn: jest.fn(),
        signOut: jest.fn(),
      } satisfies AuthContextValue);
      mockListAlerts.mockResolvedValue({
        kind: 'ok',
        items: [makeAlert()],
        nextCursor: null,
      });
      mockAckAlert.mockReturnValue(pending<AckAlertState>());
    });

    it('mantiene bloqueado el ack que sigue en vuelo', async () => {
      await renderAlerts();
      const button = await waitFor(() =>
        screen.getByTestId('alert-row-alert-1-ack'),
      );
      const cleanups = await focusScreen();

      await fireEvent.press(button);
      await waitFor(() =>
        expect(screen.getByTestId('alert-row-alert-1-ack')).toBeDisabled(),
      );

      await blurScreen(cleanups);

      await waitFor(() =>
        expect(screen.getByTestId('alert-row-alert-1-ack')).toBeDisabled(),
      );
      await fireEvent.press(screen.getByTestId('alert-row-alert-1-ack'));
      expect(mockAckAlert).toHaveBeenCalledTimes(1);
    });

    it('no resetea el estado ni el ref desde el cleanup de foco', () => {
      const source = readFileSync(
        join(process.cwd(), 'src/screens/alerts/index.tsx'),
        'utf8',
      );
      const focusBlock = source.slice(
        source.indexOf('useFocusEffect('),
        source.indexOf('async function handleAck'),
      );

      expect(focusBlock).not.toContain('AckingId');
      expect(focusBlock).not.toContain('ackingIdRef');
    });
  },
);

describe(
  '#97 R6: la alerta atendida sigue atendida al volver a la pantalla',
  () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockListAlerts.mockReset();
      process.env.EXPO_PUBLIC_API_URL = apiUrl;
      mockUseAuth.mockReturnValue({
        status: 'authenticated',
        token: 'jwt-token',
        signIn: jest.fn(),
        signOut: jest.fn(),
      } satisfies AuthContextValue);
      mockListAlerts
        .mockResolvedValueOnce({
          kind: 'ok',
          items: [makeAlert()],
          nextCursor: null,
        })
        .mockReturnValue(pending<AlertsState>());
      mockAckAlert.mockResolvedValue({
        kind: 'ok',
        alert: makeAlert({
          status: 'acked',
          ackedAt: '2026-09-11T12:00:00.000Z',
        }),
      });
    });

    it('conserva el overlay local aunque el refetch siga pendiente', async () => {
      await renderAlerts();
      const button = await waitFor(() =>
        screen.getByTestId('alert-row-alert-1-ack'),
      );
      const cleanups = await focusScreen();

      await fireEvent.press(button);
      await waitFor(() =>
        expect(screen.getByTestId('alert-row-alert-1-status')).toHaveTextContent(
          es['alerts.statusAcked'],
        ),
      );

      await blurScreen(cleanups);
      await focusScreen();

      await waitFor(() =>
        expect(screen.getByTestId('alert-row-alert-1-status')).toHaveTextContent(
          es['alerts.statusAcked'],
        ),
      );
      expect(screen.queryByTestId('alert-row-alert-1-ack')).toBeNull();
    });
  },
);

describe('#97 R7: la lista se revalida al ganar el foco', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListAlerts.mockReset();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListAlerts.mockResolvedValue({
      kind: 'ok',
      items: [makeAlert()],
      nextCursor: null,
    });
  });

  it('vuelve a pedir la página visible al recuperar foco', async () => {
    await renderAlerts();
    await waitFor(() =>
      expect(screen.getByTestId('alert-row-alert-1')).toBeVisible(),
    );
    expect(mockListAlerts).toHaveBeenCalledTimes(1);

    await focusScreen();

    await waitFor(() => expect(mockListAlerts).toHaveBeenCalledTimes(2));
  });
});

describe(
  '#97 R8: el overlay del ack caduca cuando la lista trae otro status',
  () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockListAlerts.mockReset();
      process.env.EXPO_PUBLIC_API_URL = apiUrl;
      mockUseAuth.mockReturnValue({
        status: 'authenticated',
        token: 'jwt-token',
        signIn: jest.fn(),
        signOut: jest.fn(),
      } satisfies AuthContextValue);
      mockListAlerts
        .mockResolvedValueOnce({
          kind: 'ok',
          items: [makeAlert()],
          nextCursor: null,
        })
        .mockResolvedValueOnce({
          kind: 'ok',
          items: [
            makeAlert({
              status: 'closed',
              closedAt: '2026-09-11T12:05:00.000Z',
            }),
          ],
          nextCursor: null,
        });
      mockAckAlert.mockResolvedValue({
        kind: 'ok',
        alert: makeAlert({
          status: 'acked',
          ackedAt: '2026-09-11T12:00:00.000Z',
        }),
      });
    });

    it('da prioridad al status cerrado descargado en el siguiente foco', async () => {
      await renderAlerts();
      const button = await waitFor(() =>
        screen.getByTestId('alert-row-alert-1-ack'),
      );

      await fireEvent.press(button);
      await waitFor(() =>
        expect(screen.getByTestId('alert-row-alert-1-status')).toHaveTextContent(
          es['alerts.statusAcked'],
        ),
      );

      await focusScreen();

      await waitFor(() =>
        expect(screen.getByTestId('alert-row-alert-1-status')).toHaveTextContent(
          es['alerts.statusClosed'],
        ),
      );
    });
  },
);

describe('#100 R6: la columna de texto de cada fila abre su detalle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListAlerts.mockReset();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListAlerts.mockResolvedValue({
      kind: 'ok',
      items: [makeAlert(), makeAlert({ id: 'alert-2' })],
      nextCursor: null,
    });
  });

  it('abre el id de la fila pulsada, incluso con dos filas', async () => {
    await renderAlerts();
    await fireEvent.press(await screen.findByTestId('alert-row-alert-2-link'));
    await fireEvent.press(screen.getByTestId('alert-row-alert-1-link'));
    expect(mockRouterPush).toHaveBeenNthCalledWith(1, {
      pathname: '/alerts/[alertId]', params: { alertId: 'alert-2' },
    });
    expect(mockRouterPush).toHaveBeenNthCalledWith(2, {
      pathname: '/alerts/[alertId]', params: { alertId: 'alert-1' },
    });
  });

  it('da rol, altura y opacidad de pulsado solo al enlace (enmendado por #174 R7) (enmendado por #174 R8)', async () => {
    await renderAlerts();
    const link = await screen.findByTestId('alert-row-alert-1-link');
    expect(link.props.accessibilityRole).toBe('button');
    expect(link.props.className).toBe('min-h-11 min-w-0 flex-1 justify-center gap-0.5');
    expect(link).toHaveStyle({ opacity: 1 });
    const row = screen.getByTestId('alert-row-alert-1');
    expect(row.props.accessibilityRole).toBeUndefined();
    expect(row.props.onPress).toBeUndefined();
    await fireEvent(link, 'responderGrant', { nativeEvent: {}, persist: () => undefined });
    expect(link).toHaveStyle({ opacity: 0.8 });
  });

  it('conserva Marcar leída sin navegar al pulsarlo', async () => {
    mockAckAlert.mockResolvedValue({ kind: 'ok', alert: makeAlert({ status: 'acked' }) });
    await renderAlerts();
    await screen.findByTestId('alert-row-alert-1-link');
    await fireEvent.press(screen.getByTestId('alert-row-alert-1-ack'));
    await waitFor(() => expect(mockAckAlert).toHaveBeenCalledTimes(1));
    expect(mockRouterPush).not.toHaveBeenCalled();
  });
});

describe('#155 R5: sin alertas, Pingo duerme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({
      status: 'authenticated',
      token: 'jwt-token',
      signIn: jest.fn(),
      signOut: jest.fn(),
    } satisfies AuthContextValue);
    mockListAlerts.mockReset();
  });

  it('queda en el sitio del vacío que sustituye (enmendado por #174 R3)', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [], nextCursor: null });
    await renderAlerts();
    await screen.findByTestId('alerts-empty-pose');
    const slot = screen.getByTestId('alerts-empty');
    expect(slot.parent?.parent?.props.testID).toBe('alerts-list');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['View', 'alerts-empty']); // #174 R3: el primer hijo es el envoltorio del ListHeaderComponent
  });

  it('pinta la pose, el título y la frase de Pingo', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [], nextCursor: null });
    await renderAlerts();
    const pose = await screen.findByTestId('alerts-empty-pose');
    expect(pose.props.source).toEqual([
      expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-sleep\.webp$/) }),
    ]);
    expect(screen.getByTestId('alerts-empty-title')).toHaveTextContent('No hay alertas');
    expect(screen.getByTestId('alerts-empty-body')).toHaveTextContent('Todo está tranquilo. Si pasa algo, te aviso aquí.');
  });

  it('no ofrece acción', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [], nextCursor: null });
    await renderAlerts();
    await screen.findByTestId('alerts-empty-title');
    expect(screen.queryByTestId('alerts-empty-action')).toBeNull();
  });
});

describe('#170 R3: agrupa la lista en Hoy, Esta semana y Anteriores', () => {
  const hostProcess = process.getBuiltinModule('process');
  let previousTZ: string | undefined;
  const S = [
    makeAlert({ id: 'earlier-closed', status: 'closed', openedAt: '2026-12-26T12:00:00.000Z' }),
    makeAlert({ id: 'today-acked', status: 'acked', openedAt: '2027-01-02T15:00:00.000Z' }),
    makeAlert({ id: 'earlier-open', status: 'open', openedAt: '2026-12-20T12:00:00.000Z' }),
    makeAlert({ id: 'week-open', status: 'open', openedAt: '2027-01-01T12:00:00.000Z' }),
    makeAlert({ id: 'today-open', status: 'open', openedAt: '2027-01-02T07:00:00.000Z' }),
  ];
  beforeEach(() => {
    previousTZ = hostProcess.env.TZ;
    hostProcess.env.TZ = 'America/Mexico_City';
    jest.spyOn(Date, 'now').mockReturnValue(Date.parse('2027-01-02T16:00:00.000Z'));
    jest.clearAllMocks();
    mockListAlerts.mockReset().mockResolvedValue({ kind: 'ok', items: S, nextCursor: null });
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() });
  });
  afterEach(() => {
    if (previousTZ === undefined) delete hostProcess.env.TZ;
    else hostProcess.env.TZ = previousTZ;
    jest.restoreAllMocks();
  });
  it('ordena por sección y, dentro, abiertas primero en el orden del servidor', async () => {
    await renderAlerts();
    await screen.findByTestId('alert-row-today-open');
    expect(screen.getByTestId('alerts-list').props.data.map((a: Alert) => a.id)).toEqual(['today-open', 'today-acked', 'week-open', 'earlier-open', 'earlier-closed']);
  });
  it('pinta una cabecera por sección con su copy en español (enmendado por #174 R6)', async () => {
    await renderAlerts();
    await screen.findByTestId('alert-row-today-open');
    for (const [section, copy] of [['today', 'Hoy'], ['week', 'Esta semana'], ['earlier', 'Anteriores']]) {
      const headers = screen.getAllByTestId('alerts-section-' + section);
      expect(headers).toHaveLength(1);
      expect(headers[0]).toHaveTextContent(copy);
      expect(headers[0].props.accessibilityRole).toBe('header');
      expect(headers[0].props.className).toBe('mt-1.5 text-13 font-extrabold uppercase tracking-caps text-muted');
    }
  });
  it('pinta las cabeceras en inglés', async () => {
    await renderAlertsInEnglish();
    await screen.findByTestId('alert-row-today-open');
    for (const [section, copy] of [['today', 'Today'], ['week', 'This week'], ['earlier', 'Earlier']]) {
      expect(screen.getByTestId('alerts-section-' + section)).toHaveTextContent(copy);
    }
  });
  it('envuelve cada cabecera con la primera fila de su sección en un View gap-3 (enmendado por #174 R6)', async () => {
    await renderAlerts();
    await screen.findByTestId('alert-row-today-open');
    for (const [section, id] of [['today', 'today-open'], ['week', 'week-open'], ['earlier', 'earlier-open']]) {
      const parent = screen.getByTestId('alerts-section-' + section).parent!;
      expect(parent.props.className).toBe('gap-3');
      expect(parent.children).toHaveLength(2);
      expect(elementChild(parent, 0).props.className).toBe(
        'mt-1.5 text-13 font-extrabold uppercase tracking-caps text-muted',
      );
      expect(within(parent).getByTestId('alert-row-' + id)).toBeVisible();
      expect(elementChild(parent, 0).props.testID).toBe('alerts-section-' + section);
      const first = elementChild(parent, 1);
      expect(first.props.testID === 'alert-row-' + id || within(first).queryByTestId('alert-row-' + id) !== null).toBe(true);
    }
  });
  it.each([
    ['today', S.filter((a) => !a.id.startsWith('today'))],
    ['week', S.filter((a) => !a.id.startsWith('week'))],
    ['earlier', S.filter((a) => !a.id.startsWith('earlier'))],
  ] as const)('omite la cabecera de %s cuando la sección queda vacía', async (section, items) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items, nextCursor: null });
    await renderAlerts();
    await screen.findByTestId('alert-row-' + items[0].id);
    expect(screen.queryByTestId('alerts-section-' + section)).toBeNull();
  });
  it('pinta cada cabecera una sola vez al cargar la página siguiente', async () => {
    mockListAlerts.mockResolvedValueOnce({ kind: 'ok', items: [
      makeAlert({ id: 'today-1', openedAt: '2027-01-02T14:00:00.000Z' }),
      makeAlert({ id: 'week-1', openedAt: '2026-12-30T12:00:00.000Z' }),
    ], nextCursor: 'c1' }).mockResolvedValue({ kind: 'ok', items: [
      makeAlert({ id: 'week-2', status: 'acked', openedAt: '2026-12-29T12:00:00.000Z' }),
      makeAlert({ id: 'earlier-1', openedAt: '2026-12-01T12:00:00.000Z' }),
    ], nextCursor: null });
    await renderAlerts();
    await screen.findByTestId('alert-row-today-1');
    await fireEvent(screen.getByTestId('alerts-list'), 'onEndReached');
    await waitFor(() => expect(screen.getByTestId('alerts-list').props.data).toHaveLength(4));
    expect(screen.getByTestId('alerts-list').props.data.map((a: Alert) => a.id)).toEqual(['today-1', 'week-1', 'week-2', 'earlier-1']);
    expect(screen.getAllByTestId('alerts-section-week')).toHaveLength(1);
  });
  it('no reordena al marcar leída una fila abierta', async () => {
    mockAckAlert.mockResolvedValue({ kind: 'ok', alert: { ...S[4], status: 'acked' } });
    await renderAlerts();
    await fireEvent.press(await screen.findByTestId('alert-row-today-open-ack'));
    await screen.findByTestId('alert-row-today-open-status');
    expect(screen.getByTestId('alerts-list').props.data.map((a: Alert) => a.id)).toEqual(['today-open', 'today-acked', 'week-open', 'earlier-open', 'earlier-closed']);
  });
});

describe('#170 R4: cuenta las alertas nuevas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListAlerts.mockReset();
    mockAckAlert.mockReset();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() });
  });
  it.each(['carga', 'error', 'vacía', 'todas leídas'])('no pinta el contador con 0 nuevas: %s', async (state) => {
    if (state === 'carga') mockListAlerts.mockReturnValue(pending<AlertsState>());
    else if (state === 'error') mockListAlerts.mockResolvedValue({ kind: 'error' });
    else mockListAlerts.mockResolvedValue({ kind: 'ok', items: state === 'vacía' ? [] : [makeAlert({ id: 'a', status: 'acked' }), makeAlert({ id: 'b', status: 'closed' })], nextCursor: null });
    await renderAlerts();
    await screen.findByTestId(state === 'carga' ? 'alerts-loading' : state === 'error' ? 'alerts-error' : state === 'vacía' ? 'alerts-empty' : 'alert-row-a');
    expect(screen.queryByTestId('alerts-new-count')).toBeNull();
    expect(screen.getByTestId('alerts-title-row').children).toHaveLength(1);
    const root = screen.getByTestId('screen-alerts');
    expect(root.children).toHaveLength(1);
    expect(elementChild(root, 0).props.testID).toBe('alerts-list');
  });
  it('pinta «1 nueva» con una abierta', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    await renderAlerts();
    expect(await screen.findByTestId('alerts-new-count-text')).toHaveTextContent('1 nueva');
  });
  it('pinta «1 new» en inglés', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    await renderAlertsInEnglish();
    expect(await screen.findByTestId('alerts-new-count-text')).toHaveTextContent('1 new');
  });
  it('suma las abiertas de todas las páginas cargadas', async () => {
    mockListAlerts.mockResolvedValueOnce({ kind: 'ok', items: [makeAlert({ id: 'a' }), makeAlert({ id: 'b' }), makeAlert({ id: 'c', status: 'acked' })], nextCursor: 'c1' })
      .mockResolvedValue({ kind: 'ok', items: [makeAlert({ id: 'd' })], nextCursor: null });
    await renderAlerts();
    expect(await screen.findByTestId('alerts-new-count-text')).toHaveTextContent('2 nuevas');
    await fireEvent(screen.getByTestId('alerts-list'), 'onEndReached');
    await waitFor(() => expect(screen.getByTestId('alerts-new-count-text')).toHaveTextContent('3 nuevas'));
  });
  it('pinta «2 new» en inglés', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ id: 'a' }), makeAlert({ id: 'b' })], nextCursor: null });
    await renderAlertsInEnglish();
    expect(await screen.findByTestId('alerts-new-count-text')).toHaveTextContent('2 new');
  });
  it('baja al marcar leída y desaparece en 0', async () => {
    const a = makeAlert({ id: 'a' });
    const b = makeAlert({ id: 'b' });
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [a, b], nextCursor: null });
    mockAckAlert.mockResolvedValueOnce({ kind: 'ok', alert: { ...a, status: 'acked' } }).mockResolvedValue({ kind: 'ok', alert: { ...b, status: 'acked' } });
    await renderAlerts();
    expect(await screen.findByTestId('alerts-new-count-text')).toHaveTextContent('2 nuevas');
    await fireEvent.press(screen.getByTestId('alert-row-a-ack'));
    await waitFor(() => expect(screen.getByTestId('alerts-new-count-text')).toHaveTextContent('1 nueva'));
    await fireEvent.press(screen.getByTestId('alert-row-b-ack'));
    await screen.findByTestId('alert-row-b-status');
    expect(screen.queryByTestId('alerts-new-count')).toBeNull();
  });
  it('pinta el contador junto al título con su anatomía (enmendado por #174 R4)', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ id: 'a' }), makeAlert({ id: 'b' })], nextCursor: null });
    await renderAlerts();
    const counter = await screen.findByTestId('alerts-new-count');
    const titleRow = screen.getByTestId('alerts-title-row');
    expect(titleRow.children).toHaveLength(2);
    expect(elementChild(titleRow, 0).props.testID).toBe('alerts-title');
    expect(elementChild(titleRow, 1).props.testID).toBe('alerts-new-count');
    expect(mockPopIn).toHaveBeenCalledWith(expect.objectContaining({
      testID: 'alerts-new-count',
      className: 'rounded-full bg-danger px-2.5 py-1',
    }));
    expect(counter.props.className).toBe('rounded-full bg-danger px-2.5 py-1');
    expect(counter.children).toHaveLength(1);
    const text = elementChild(counter, 0);
    expect(text.props.testID).toBe('alerts-new-count-text');
    expect(text.props.className).toBe('text-13 font-extrabold text-danger-foreground');
    expect(text.props.style).toEqual({ fontVariant: ['tabular-nums'] });
    expect(text).toHaveTextContent('2 nuevas', { exact: true });
    const root = screen.getByTestId('screen-alerts');
    expect(root.children).toHaveLength(1);
    expect(elementChild(root, 0).props.testID).toBe('alerts-list');
  });

});

describe('#170 R5: la fila abierta lleva el borde de su tipo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListAlerts.mockReset();
    process.env.EXPO_PUBLIC_API_URL = apiUrl;
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() });
  });
  it.each([
    { type: 'geofence_exit', border: 'border-danger', iconName: 'LocationSlash', labelKey: 'alerts.typeGeofenceExit', disc: 'bg-category-rose', ink: '--color-danger', label: 'Salió de la zona' },
    { type: 'battery_low', border: 'border-warning-strong', iconName: 'BatteryLow', labelKey: 'alerts.typeBatteryLow', disc: 'bg-category-amber', ink: '--color-warning-strong', label: 'Batería baja' },
    { type: 'mystery_type', border: 'border-muted', iconName: 'Bell', labelKey: 'alerts.typeUnknown', disc: 'bg-default', ink: '--color-muted', label: 'Aviso' },
  ])('abierta $type: border-2 y $border, con $iconName y $labelKey (enmendado por #174 R7) (enmendado por #174 R8)', async ({ type, border, iconName, disc, ink, label }) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ type })], nextCursor: null });
    await renderAlerts();
    const row = await screen.findByTestId('alert-row-alert-1');
    const classes = row.props.className.split(' ');
    expect(classes).toContain('border-2');
    expect(classes).toContain(border);
    expect(classes).not.toContain('border-border');
    const icon = within(row).getByTestId('alert-row-alert-1-icon');
    expect(icon.props.iconName).toBe(iconName);
    expect(icon.props.color).toBe(ink);
    expect(icon.parent?.props.className.split(' ')).toContain(disc);
    expect(within(row).getByTestId('alert-row-alert-1-type')).toHaveTextContent(label);
  });
  it.each(['acked', 'closed'] as const)('%s: sin borde de severidad', async (status) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ status })], nextCursor: null });
    await renderAlerts();
    const row = await screen.findByTestId('alert-row-alert-1');
    const classes = row.props.className.split(' ');
    expect(classes).toContain('border');
    expect(classes).toContain('border-border');
    expect(classes).not.toContain('border-2');
    expect(classes).not.toContain('border-danger');
  });
  it.each(['ok', 'already-closed'] as const)('marcada leída en local (%s): pierde el borde de severidad', async (rama) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    mockAckAlert.mockResolvedValue(rama === 'ok' ? { kind: 'ok', alert: makeAlert({ status: 'acked' }) } : { kind: 'already-closed' });
    await renderAlerts();
    await fireEvent.press(await screen.findByTestId('alert-row-alert-1-ack'));
    await waitFor(() => expect(screen.getByTestId('alert-row-alert-1-status')).toHaveTextContent(rama === 'ok' ? es['alerts.statusAcked'] : es['alerts.statusClosed']));
    const classes = screen.getByTestId('alert-row-alert-1').props.className.split(' ');
    expect(classes).toContain('border');
    expect(classes).toContain('border-border');
    expect(classes).not.toContain('border-2');
    expect(classes).not.toContain('border-danger');
  });
});
