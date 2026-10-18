import { fireEvent, render, screen, waitFor, within } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import type { TestInstance } from 'test-renderer';

import { ackAlert, listAlerts, type AlertsState } from '../../api/alerts';
import { listGeofences, type Geofence } from '../../api/geofences';
import { alertKeys, geofenceKeys } from '../../api/query-keys';
import type { Alert } from '../../api/types';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { createQueryClient } from '../../providers/query-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { renderWithProviders } from '../../../test/render-with-providers';
import { AlertDetailScreen } from '.';

let mockReducedMotion = false;
let mockBottom = 24;
jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'), __esModule: true,
  useReducedMotion: () => mockReducedMotion,
  withRepeat: jest.fn((animation: unknown) => animation),
}));

jest.mock('heroui-native', () => {
  const actual = jest.requireActual<typeof import('heroui-native')>('heroui-native');
  const React = jest.requireActual<typeof import('react')>('react');
  const { Pressable, Text, View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { ...actual, Skeleton: (props: Record<string, unknown>) => React.createElement(View, props), Button: Object.assign(
    ({ isDisabled, ...props }: Record<string, unknown> & { children?: ReactNode; isDisabled?: boolean }) => React.createElement(Pressable, { ...props, disabled: isDisabled }),
    { Label: (props: Record<string, unknown> & { children?: ReactNode }) => React.createElement(Text, props) },
  ) };
});

jest.mock('../home/home-entrance', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { HomeEntrance: (props: Record<string, unknown>) => React.createElement(View, props) };
});

jest.mock('expo-router', () => ({
  router: { dismissTo: jest.fn(), push: jest.fn() },
}));

const mockMapChildren = jest.fn();
jest.mock('expo-blur', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { BlurView: (props: Record<string, unknown>) => React.createElement(View, props) };
});

jest.mock('../../components/pet-map', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { PetMap: (props: Record<string, unknown>) => { mockMapChildren(props.children); return React.createElement(View, { ...props, testID: 'pet-map-double' }); } };
});

jest.mock('../../api/geofences', () => ({
  ...jest.requireActual('../../api/geofences'),
  listGeofences: jest.fn(),
}));

jest.mock('uniwind', () => ({
  ...jest.requireActual('uniwind'),
  useUniwind: () => ({ theme: mockTheme, hasAdaptiveThemes: false }),
}));

jest.mock('../../providers/selected-pet-provider', () => ({
  useSelectedPet: jest.fn(),
}));

jest.mock('../../api/alerts', () => ({
  ackAlert: jest.fn(),
  listAlerts: jest.fn(),
}));

jest.mock('../../providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: mockBottom, left: 0 }),
}));

jest.mock('reicon-react-native', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const icon = (iconName: string) =>
    function MockIcon(props: Record<string, unknown>) {
      return React.createElement(
        View as unknown as React.ComponentType<Record<string, unknown>>,
        { ...props, iconName },
      );
    };
  return {
    Map: icon('Map'),
    BatteryLow: icon('BatteryLow'),
    Bell: icon('Bell'),
    LocationSlash: icon('LocationSlash'),
  };
});

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: readonly string[]) =>
    tokens.map((token) => `--color-${token}`),
}));

let mockTheme: 'light' | 'dark' = 'light';
const mockSelectPet = jest.fn();
const mockUseSelectedPet = jest.mocked(useSelectedPet);
const mockListGeofences = jest.mocked(listGeofences);
const ZONE: Geofence = {
  id: 'zone-1', petId: 'pet-1', name: 'Casa', type: 'safe_circle',
  centerLat: 19.4326, centerLng: -99.1332, radiusM: 100, active: true,
  state: { value: 'unknown', updatedAt: null },
  createdAt: '2026-09-11T10:00:00.000Z', updatedAt: '2026-09-11T10:00:00.000Z',
};
const POS_FAR = { lat: 19.4446371, lng: -99.1332 };
const POS_OUT = { lat: 19.4342637, lng: -99.1332 };
const REAL_PAYLOAD = { position: { ...POS_OUT, ts: '2026-09-11T10:00:00.000Z', flags: [] }, geofenceName: 'Casa' };
const apiUrl = 'http://example.test/v1';
const mockAckAlert = jest.mocked(ackAlert);
const mockListAlerts = jest.mocked(listAlerts);
const mockUseAuth = jest.mocked(useAuth);
const mockDismissTo = jest.mocked(router.dismissTo);
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

function elementChild(node: TestInstance, index: number): TestInstance {
  const child = node.children[index];
  if (typeof child === 'string') throw new Error('Expected an element child');
  return child;
}

function DetailWrapper({
  children,
  language = 'es',
}: {
  children: ReactNode;
  language?: 'es' | 'en';
}) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial={language}>{children}</LanguageProvider>
    </HeroUINativeProvider>
  );
}

function renderDetail(alertId = 'alert-1', language: 'es' | 'en' = 'es') {
  return renderWithProviders(<AlertDetailScreen alertId={alertId} />, {
    wrapper: ({ children }) => <DetailWrapper language={language}>{children}</DetailWrapper>,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockTheme = 'light';
  mockBottom = 24;
  mockReducedMotion = false;
  mockListGeofences.mockReset().mockReturnValue(new Promise(() => undefined));
  mockUseSelectedPet.mockReturnValue({ selectedPetId: 'pet-1', selectPet: mockSelectPet });
  mockListAlerts.mockReset();
  mockAckAlert.mockReset();
  process.env.EXPO_PUBLIC_API_URL = apiUrl;
  mockUseAuth.mockReturnValue({
    status: 'authenticated',
    token: 'token-1',
    signIn: jest.fn(),
    signOut: mockSignOut,
  } satisfies AuthContextValue);
});


const HERO_CASES = [
  ['geofence_exit', 'LocationSlash', 'bg-danger', '--color-danger-foreground', 'bg-category-rose', 'text-category-rose-strong', 'Salió de la zona'],
  ['battery_low', 'BatteryLow', 'bg-warning-strong', '--color-background', 'bg-category-amber', 'text-category-amber-strong', 'Batería baja'],
  ['future_alert_type', 'Bell', 'bg-muted', '--color-background', 'bg-default', 'text-muted', 'Aviso'],
] as const;
const heroClass = (disc: string) => `rounded-hero p-4.5 ${disc} items-center gap-2 px-4.5 py-5.5`;

describe('#100 R3: el detalle pinta la alerta de la caché (enmendado por #180 R3, E2)', () => {
  it.each(HERO_CASES)('#180 R3.1/R3.2/R3.3: héroe %s centrado, disco y textos en orden (enmendado por E2)', async (type, iconName, solid, color, disc, ink, label) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ type })], nextCursor: null });
    await renderDetail();
    const card = await screen.findByTestId('alert-detail-card');
    const scope = within(card);
    expect(card.props.className).toBe(heroClass(disc));
    expect(card.props.className).not.toMatch(/bg-surface-secondary|border-2|min-h-44/);
    expect(card.children).toHaveLength(5);
    expect(card.children.map(child => typeof child === 'string' ? child : child.props.testID)).toEqual([
      'alert-detail-disc', 'alert-detail-status', 'alert-detail-type', 'alert-detail-pet', 'alert-detail-opened-at',
    ]);
    expect(scope.queryByTestId('alert-detail-header')).toBeNull();
    const icon = scope.getByTestId('alert-detail-icon');
    expect(icon.props).toMatchObject({ iconName, size: 34, color });
    expect(elementChild(card, 0).props.className).toBe(`size-18 items-center justify-center rounded-full ${solid}`);
    expect(icon.parent?.props.className).toBe(`size-18 items-center justify-center rounded-full ${solid}`);
    expect(scope.getByTestId('alert-detail-type')).toHaveTextContent(label);
    expect(scope.getByTestId('alert-detail-type').props.className).toBe('text-22 font-black text-foreground text-center');
    expect(scope.getByTestId('alert-detail-pet')).toHaveTextContent('Luna');
    expect(scope.getByTestId('alert-detail-pet').props).toMatchObject({ selectable: true, className: `text-15 font-bold ${ink}` });
    expect(scope.getByTestId('alert-detail-opened-at').props.className).toBe(`text-13 font-normal ${ink}`);
  });

  it.each([
    ['open', 'Sin leer', 'rounded-full px-2.5 py-0.75 text-xs font-extrabold bg-danger text-danger-foreground'],
    ['acked', 'Leída', 'rounded-full bg-default px-2.5 py-1 text-xs font-bold text-muted'],
    ['closed', 'Resuelta', 'rounded-full bg-category-green px-2.5 py-1 text-xs font-extrabold text-category-green-strong'],
  ] as const)('#180 R3.4: píldora %s (enmendado por E2)', async (status, label, className) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ status })], nextCursor: null });
    await renderDetail();
    const pill = await screen.findByTestId('alert-detail-status');
    expect(pill).toHaveTextContent(label);
    expect(pill.props.className).toBe(className);
    if (status === 'open') expect(pill.props.className.split(' ')).not.toContain('bg-default');
  });

  it('#180 R3.4: píldora de batería abierta ámbar', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ type: 'battery_low' })], nextCursor: null });
    await renderDetail();
    expect((await screen.findByTestId('alert-detail-status')).props.className).toBe('rounded-full px-2.5 py-0.75 text-xs font-extrabold bg-warning-strong text-background');
  });

  it.each([
    ['es', '2026-12-31T12:00:00.000Z', /^Detectada el 31 dic 2026, \d{2}:\d{2}/],
    ['en', '2027-01-02T12:00:00.000Z', /^Detected Jan 2, 2027, /],
  ] as const)('#180 R3.6: apertura en %s con mes corto (enmendado por E2)', async (language, openedAt, expected) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ openedAt })], nextCursor: null });
    await renderDetail('alert-1', language);
    const opened = await screen.findByTestId('alert-detail-opened-at');
    expect(opened).toHaveTextContent(expected);
    expect(opened.props.selectable).toBe(true);
    expect(opened.props.className).toBe('text-13 font-normal text-category-rose-strong');
  });

  it('#180 R3.6: pasa las cinco opciones de fecha al locale', async () => {
    const spy = jest.spyOn(Date.prototype, 'toLocaleString');
    try {
      mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
      await renderDetail();
      await screen.findByTestId('alert-detail-opened-at');
      expect(spy).toHaveBeenCalledWith('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } finally { spy.mockRestore(); }
  });

  it('respeta las métricas A11 bajo cabecera nativa (enmendado por #180 R2, E2)', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    await renderDetail();
    const card = await screen.findByTestId('alert-detail-card');
    const root = screen.getByTestId('screen-alert-detail');
    expect(root.props.className).toBe('flex-1 bg-background');
    expect(root.props.contentInsetAdjustmentBehavior).toBe('automatic');
    expect(root.props.contentContainerStyle).toEqual({ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 64, gap: 14, flexGrow: 1 });
    expect(card.props.className).toBe(heroClass('bg-category-rose'));
  });

  it('#180 R3.5: tras el ack la píldora pasa a «Leída» y el ping desaparece', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    mockAckAlert.mockResolvedValue({ kind: 'ok', alert: makeAlert({ status: 'acked' }) });
    await renderDetail();
    await fireEvent.press(await screen.findByTestId('alert-detail-ack'));
    await waitFor(() => {
      expect(screen.getByTestId('alert-detail-status')).toHaveTextContent('Leída');
      expect(screen.queryByTestId('alert-detail-ping')).toBeNull();
    });
  });
});

describe('#100 R4: el detalle pinta carga, error y salida sin la alerta', () => {
  it('#180 R10.1: pinta el esqueleto rounded-hero mientras carga (enmendado por E2)', async () => {
    mockListAlerts.mockReturnValue(new Promise<AlertsState>(() => undefined));
    await renderDetail();
    const loading = await screen.findByTestId('alert-detail-loading');
    expect(loading.props.className).toBe('h-58 w-full rounded-hero');
    expect(screen.queryByTestId('alert-detail-card')).toBeNull();
    expect(screen.queryByTestId('alert-detail-error')).toBeNull();
    expect(mockDismissTo).not.toHaveBeenCalled();
  });

  it.each([
    { kind: 'error' },
    { kind: 'unreachable', message: 'network down' },
    { kind: 'missing-config' },
  ] as AlertsState[])('#180 R10.2: pinta $kind y reintenta la lista (enmendado por E2)', async (error) => {
    mockListAlerts
      .mockResolvedValueOnce(error)
      .mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    await renderDetail();
    const errorText = await screen.findByTestId('alert-detail-error');
    expect(errorText).toHaveTextContent('Algo salió mal');
    expect(errorText.props.selectable).toBe(true);
    expect(errorText.props.className).toBe('text-danger');
    const retry = screen.getByTestId('alert-detail-retry');
    expect(retry.props.className).toBe('h-13');
    expect(within(retry).getByText('Reintentar')).toBeVisible();
    expect(mockDismissTo).not.toHaveBeenCalled();

    await fireEvent.press(retry);
    await waitFor(() => expect(mockListAlerts).toHaveBeenCalledTimes(2));
    await screen.findByTestId('alert-detail-card');
  });

  it('no pinta estado ni navega cuando la primera página es unauthorized', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'unauthorized' });
    const rendered = await renderDetail();
    await waitFor(() => {
      expect(mockListAlerts).toHaveBeenCalledTimes(1);
      expect(rendered.queryClient.getQueryData(alertKeys.list())).toEqual(
        expect.objectContaining({ pages: [{ kind: 'unauthorized' }] }),
      );
      expect(screen.queryByTestId('alert-detail-loading')).toBeNull();
    });
    expect(screen.queryByTestId('alert-detail-card')).toBeNull();
    expect(screen.queryByTestId('alert-detail-error')).toBeNull();
    expect(mockDismissTo).not.toHaveBeenCalled();
  });

  it('sale al centro una sola vez cuando la alerta no está', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [], nextCursor: null });
    const rendered = await renderDetail();
    await waitFor(() => expect(mockDismissTo).toHaveBeenCalledWith('/alerts'));
    expect(mockDismissTo).toHaveBeenCalledTimes(1);
    await rendered.queryClient.refetchQueries({ queryKey: alertKeys.list() });
    expect(mockDismissTo).toHaveBeenCalledTimes(1);
  });

  it('espera una recarga de caché vieja antes de salir y luego pinta la alerta', async () => {
    let resolveAlerts!: (value: AlertsState) => void;
    mockListAlerts.mockReturnValue(new Promise((resolve) => { resolveAlerts = resolve; }));
    const queryClient = createQueryClient(jest.fn(), 60_000);
    queryClient.setQueryData(alertKeys.list(), {
      pages: [{ kind: 'ok', items: [makeAlert({ id: 'another-alert' })], nextCursor: null }],
      pageParams: [undefined],
    });
    await render(
      <QueryClientProvider client={queryClient}>
        <DetailWrapper><AlertDetailScreen alertId="alert-1" /></DetailWrapper>
      </QueryClientProvider>,
    );

    await waitFor(() => expect(mockListAlerts).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('alert-detail-loading')).toBeVisible();
    expect(mockDismissTo).not.toHaveBeenCalled();
    resolveAlerts({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    await screen.findByTestId('alert-detail-card');
    expect(mockDismissTo).not.toHaveBeenCalled();
    queryClient.clear();
  });
});

describe('#100 R5: el detalle marca leída la alerta', () => {
  beforeEach(() => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
  });

  it('marca leída una vez y retira el botón (enmendado por #180 R7, E2)', async () => {
    mockAckAlert.mockResolvedValue({ kind: 'ok', alert: makeAlert({ status: 'acked' }) });
    await renderDetail();
    const button = await screen.findByTestId('alert-detail-ack');
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.className).toBe('w-full h-14 rounded-16 bg-accent border-b-4 border-black/25');
    expect(within(button).getByText('Marcar leída')).toBeVisible();
    await fireEvent.press(button);
    await waitFor(() => expect(mockAckAlert).toHaveBeenCalledWith(apiUrl, 'token-1', 'alert-1'));
    await waitFor(() => expect(screen.getByTestId('alert-detail-status')).toHaveTextContent('Leída'));
    expect(screen.queryByTestId('alert-detail-ack')).toBeNull();
    expect(mockAckAlert).toHaveBeenCalledTimes(1);
  });

  it('muestra Resuelta si el servidor responde already-closed', async () => {
    mockAckAlert.mockResolvedValue({ kind: 'already-closed' });
    await renderDetail();
    await fireEvent.press(await screen.findByTestId('alert-detail-ack'));
    await waitFor(() => expect(screen.getByTestId('alert-detail-status')).toHaveTextContent('Resuelta'));
    expect(screen.queryByTestId('alert-detail-ack')).toBeNull();
  });

  it('sale una sola vez si el servidor responde not-found', async () => {
    mockAckAlert.mockResolvedValue({ kind: 'not-found' });
    await renderDetail();
    await fireEvent.press(await screen.findByTestId('alert-detail-ack'));
    await waitFor(() => expect(mockDismissTo).toHaveBeenCalledWith('/alerts'));
    expect(mockDismissTo).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('alert-detail-action-error')).toBeNull();
  });

  it.each([
    ['error', 'Algo salió mal'],
    ['missing-config', 'Algo salió mal'],
    ['unreachable', 'No se pudo conectar con el servidor'],
    ['rejected', 'Algo salió mal'],
  ] as const)('muestra el error de $kind sin borrar la tarjeta', async (kind, message) => {
    if (kind === 'rejected') mockAckAlert.mockRejectedValue(new Error('request failed'));
    else if (kind === 'unreachable') mockAckAlert.mockResolvedValue({ kind, message: 'network down' });
    else mockAckAlert.mockResolvedValue({ kind });
    await renderDetail();
    await fireEvent.press(await screen.findByTestId('alert-detail-ack'));
    const error = await screen.findByTestId('alert-detail-action-error');
    expect(error).toHaveTextContent(message);
    expect(error.props.selectable).toBe(true);
    expect(error.props.className).toBe('text-danger');
    expect(screen.getByTestId('alert-detail-card')).toBeVisible();
  });

  it('cierra sesión una vez si el ack responde unauthorized', async () => {
    mockAckAlert.mockResolvedValue({ kind: 'unauthorized' });
    await renderDetail();
    await fireEvent.press(await screen.findByTestId('alert-detail-ack'));
    await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
    expect(screen.queryByTestId('alert-detail-action-error')).toBeNull();
  });

  it('bloquea la segunda pulsación mientras el ack está en vuelo', async () => {
    mockAckAlert.mockReturnValue(new Promise(() => undefined));
    await renderDetail();
    const button = await screen.findByTestId('alert-detail-ack');
    await fireEvent.press(button);
    await fireEvent.press(button);
    expect(mockAckAlert).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('alert-detail-ack')).toBeDisabled();
  });

  describe('#134 R2: caracterización de la rama sin candado del ack', () => {
    it('muestra Algo salió mal si signOut rechaza tras unauthorized', async () => {
      mockAckAlert.mockResolvedValue({ kind: 'unauthorized' });
      mockSignOut.mockRejectedValueOnce(new Error('sign-out failed'));

      await renderDetail();
      await fireEvent.press(await screen.findByTestId('alert-detail-ack'));

      await waitFor(() =>
        expect(screen.queryByTestId('alert-detail-action-error')).toHaveTextContent(
          'Algo salió mal',
        ),
      );
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    it('muestra Cannot reach server en inglés si ackAlert responde unreachable', async () => {
      mockAckAlert.mockResolvedValueOnce({ kind: 'unreachable', message: 'network down' });

      await renderDetail('alert-1', 'en');
      await fireEvent.press(await screen.findByTestId('alert-detail-ack'));
      await waitFor(() => expect(screen.queryByTestId('alert-detail-action-error')).toHaveTextContent('Cannot reach server'));
    });

    it('muestra Something went wrong en inglés si ackAlert responde error', async () => {
      mockAckAlert.mockResolvedValueOnce({ kind: 'error' });

      await renderDetail('alert-1', 'en');
      await fireEvent.press(await screen.findByTestId('alert-detail-ack'));
      await waitFor(() => expect(screen.queryByTestId('alert-detail-action-error')).toHaveTextContent('Something went wrong'));
    });

    it('mantiene el botón deshabilitado hasta que signOut termina tras unauthorized', async () => {
      let finishSignOut: () => void = () => undefined;
      mockAckAlert.mockResolvedValueOnce({ kind: 'unauthorized' });
      mockSignOut.mockReturnValueOnce(
        new Promise<void>((resolve) => {
          finishSignOut = resolve;
        }),
      );

      await renderDetail();
      await fireEvent.press(await screen.findByTestId('alert-detail-ack'));

      await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
      expect(screen.getByTestId('alert-detail-ack')).toBeDisabled();

      finishSignOut();
      await waitFor(() => expect(screen.getByTestId('alert-detail-ack')).not.toBeDisabled());
      expect(screen.queryByTestId('alert-detail-action-error')).toBeNull();
    });
  });
});

describe('#170 R6: héroe sin borde (enmendado por #180 R3, E2)', () => {
  it.each(HERO_CASES)('abierta %s: conserva su color sin borde (enmendado por E2)', async (type, _icon, _solid, _color, disc) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ type })], nextCursor: null });
    await renderDetail();
    expect((await screen.findByTestId('alert-detail-card')).props.className).toBe(heroClass(disc));
  });
  it.each(['acked', 'closed'] as const)('%s: conserva el héroe por tipo (enmendado por E2)', async (status) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ status })], nextCursor: null });
    await renderDetail();
    expect((await screen.findByTestId('alert-detail-card')).props.className).toBe(heroClass('bg-category-rose'));
  });
  it.each(['ok', 'already-closed'] as const)('ack local %s: conserva héroe sin borde (enmendado por E2)', async (rama) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    mockAckAlert.mockResolvedValue(rama === 'ok' ? { kind: 'ok', alert: makeAlert({ status: 'acked' }) } : { kind: 'already-closed' });
    await renderDetail();
    await fireEvent.press(await screen.findByTestId('alert-detail-ack'));
    await waitFor(() => expect(screen.getByTestId('alert-detail-status')).toHaveTextContent(rama === 'ok' ? 'Leída' : 'Resuelta'));
    expect(screen.getByTestId('alert-detail-card').props.className).toBe(heroClass('bg-category-rose'));
  });
});

describe('#170 R8: pinta el mini-mapa con la posición de la alerta', () => {
  it.each([
    { fila: 'vacío', payload: {} },
    { fila: 'batería real', payload: { batteryPct: 12 } },
    { fila: 'posición nula', payload: { position: null } },
    { fila: 'posición no objeto', payload: { position: 'x' } },
    { fila: 'lat texto', payload: { position: { lat: '19.4', lng: -99.1 } } },
    { fila: 'falta lng', payload: { position: { lat: 19.4 } } },
    { fila: 'lat NaN', payload: { position: { lat: NaN, lng: -99.1 } } },
    { fila: 'lng infinito', payload: { position: { lat: 19.4, lng: Infinity } } },
    { fila: 'lat fuera', payload: { position: { lat: 90.0001, lng: 0 } } },
    { fila: 'lng fuera', payload: { position: { lat: 0, lng: -180.0001 } } },
  ])('$fila: sin mapa', async ({ payload }) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ geofenceId: 'zone-1', payload })], nextCursor: null });
    mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [ZONE] });
    await renderDetail();
    await screen.findByTestId('alert-detail-card');
    expect(screen.queryByTestId('alert-detail-map')).toBeNull();
    expect(screen.queryByTestId('alert-detail-distance')).toBeNull();
    expect(mockListGeofences).not.toHaveBeenCalled();
  });
  it.each([
    { fila: 'borde válido', payload: { position: { lat: 90, lng: -180 } }, position: { latitude: 90, longitude: -180 } },
    { fila: 'real del motor', payload: REAL_PAYLOAD, position: { latitude: 19.4342637, longitude: -99.1332 } },
  ])('$fila: con mapa (enmendado por #180 R5, E2)', async ({ payload, position }) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ payload })], nextCursor: null });
    await renderDetail();
    const map = await screen.findByTestId('alert-detail-map');
    expect(map.props.className).toBe('h-52.5 overflow-hidden rounded-24');
    expect(map.props.style).toEqual({ borderCurve: 'continuous' });
    expect(map.children).toHaveLength(1);
    const petMap = elementChild(map, 0);
    expect(petMap.props.testID).toBe('pet-map-double');
    expect(petMap.props.center).toEqual(position);
    expect(petMap.props.marker).toEqual(position);
    expect(petMap.props.polylines).toEqual([]);
    expect(petMap.props.colorScheme).toBe('light');
  });
  it('pasa colorScheme dark con el tema oscuro', async () => {
    mockTheme = 'dark';
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ payload: REAL_PAYLOAD })], nextCursor: null });
    await renderDetail();
    expect((await screen.findByTestId('pet-map-double')).props.colorScheme).toBe('dark');
  });
  it('pinta el mapa tras la tarjeta y antes del ack (enmendado por #180 R9)', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ payload: REAL_PAYLOAD })], nextCursor: null });
    await renderDetail();
    await screen.findByTestId('alert-detail-card');
    screen.getByTestId('alert-detail-map');
    const children = detailChildren();
    const cardIndex = children.findIndex((child) => child.props.testID === 'alert-detail-card' || within(child).queryByTestId('alert-detail-card') !== null);
    const mapIndex = children.findIndex((child) => child.props.testID === 'alert-detail-map' || within(child).queryByTestId('alert-detail-map') !== null);
    const ackIndex = children.findIndex((child) => child.props.testID === 'alert-detail-ack' || within(child).queryByTestId('alert-detail-ack') !== null);
    expect(cardIndex).toBeLessThan(mapIndex);
    expect(mapIndex).toBeLessThan(ackIndex);
  });
});

describe('#170 R9: ningún fondo encima del mapa', () => {
  it('con mapa, la raíz es flex-1 y ningún ancestro del mapa declara fondo', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ payload: REAL_PAYLOAD })], nextCursor: null });
    await renderDetail();
    await screen.findByTestId('pet-map-double');
    expect(screen.getByTestId('screen-alert-detail').props.className).toBe('flex-1');
    let node: TestInstance | null | undefined = screen.getByTestId('pet-map-double');
    while (node) {
      expect(node.props.className ?? '').not.toMatch(/bg-/);
      for (const style of [node.props.style].flat(Infinity)) {
        if (typeof style === 'object' && style !== null) expect(style).not.toHaveProperty('backgroundColor');
      }
      if (node.props.testID === 'screen-alert-detail') break;
      node = node.parent;
    }
  });
  it.each(['carga', 'error', 'payload sin posición'])('sin mapa (%s), la raíz conserva flex-1 bg-background', async (state) => {
    if (state === 'carga') mockListAlerts.mockReturnValue(new Promise(() => undefined));
    else if (state === 'error') mockListAlerts.mockResolvedValue({ kind: 'error' });
    else mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    await renderDetail();
    await screen.findByTestId(state === 'carga' ? 'alert-detail-loading' : state === 'error' ? 'alert-detail-error' : 'alert-detail-card');
    expect(screen.getByTestId('screen-alert-detail').props.className).toBe('flex-1 bg-background');
  });
});

describe('#170 R10: pinta la zona y la distancia a su borde', () => {
  beforeEach(() => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ geofenceId: 'zone-1', payload: REAL_PAYLOAD })], nextCursor: null });
    mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [ZONE] });
  });
  it('pinta el círculo, el encuadre y «A 85 m de Casa» (enmendado por #180 R5, E2)', async () => {
    await renderDetail();
    const distance = await screen.findByTestId('alert-detail-distance');
    expect(distance).toHaveTextContent('A 85 m de Casa');
    expect(distance.props.className).toBe('bg-glass-surface-strong px-2.5 py-1.5 text-xs font-bold text-foreground');
    expect(distance.props.style).toEqual({ fontVariant: ['tabular-nums'] });
    const map = screen.getByTestId('pet-map-double');
    expect(map.props.circles).toEqual([{ id: 'zone-1', center: { latitude: 19.4326, longitude: -99.1332 }, radius: 100 }]);
    expect(map.props.zoom).toBeCloseTo(16.0740, 3);
    expect(mockListGeofences).toHaveBeenCalledWith('http://example.test/v1', 'token-1', 'pet-1');
  });
  it('consulta las zonas de la mascota de la alerta, no de la seleccionada', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ petId: 'pet-7', geofenceId: 'zone-1', payload: REAL_PAYLOAD })], nextCursor: null });
    mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [{ ...ZONE, petId: 'pet-7' }] });
    await renderDetail();
    expect(await screen.findByTestId('alert-detail-distance')).toHaveTextContent('A 85 m de Casa');
    expect(mockListGeofences).toHaveBeenCalledWith('http://example.test/v1', 'token-1', 'pet-7');
    expect(mockListGeofences).not.toHaveBeenCalledWith('http://example.test/v1', 'token-1', 'pet-1');
  });
  it('dice «85 m from Casa» en inglés', async () => {
    await renderDetail('alert-1', 'en');
    expect(await screen.findByTestId('alert-detail-distance')).toHaveTextContent('85 m from Casa');
  });
  it('pasa a km desde 1000 m: «A 1.2 km de Casa»', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ geofenceId: 'zone-1', payload: { ...REAL_PAYLOAD, position: POS_FAR } })], nextCursor: null });
    await renderDetail();
    expect(await screen.findByTestId('alert-detail-distance')).toHaveTextContent('A 1.2 km de Casa');
    expect(screen.getByTestId('pet-map-double').props.zoom).toBeCloseTo(13.7385, 3);
  });
  it('redondea al metro: a 0,71 m del borde dice «A 1 m de Casa»', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ geofenceId: 'zone-1', payload: { ...REAL_PAYLOAD, position: { lat: 19.4335057, lng: -99.1332 } } })], nextCursor: null });
    await renderDetail();
    expect(await screen.findByTestId('alert-detail-distance')).toHaveTextContent('A 1 m de Casa');
  });
  it('usa la zona aunque esté inactiva', async () => {
    mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [{ ...ZONE, active: false }] });
    await renderDetail();
    expect(await screen.findByTestId('alert-detail-distance')).toHaveTextContent('A 85 m de Casa');
    expect(screen.getByTestId('pet-map-double').props.circles).toEqual([{ id: 'zone-1', center: { latitude: 19.4326, longitude: -99.1332 }, radius: 100 }]);
  });
  it('lee la zona de la caché compartida de geofenceKeys.list', async () => {
    const queryClient = createQueryClient(jest.fn(), 60_000);
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ petId: 'pet-7', geofenceId: 'zone-1', payload: REAL_PAYLOAD })], nextCursor: null });
    queryClient.setQueryData(geofenceKeys.list('pet-7'), { kind: 'ok', geofences: [{ ...ZONE, petId: 'pet-7' }] });
    mockListGeofences.mockReturnValue(new Promise(() => undefined));
    try {
      await render(<QueryClientProvider client={queryClient}><DetailWrapper><AlertDetailScreen alertId="alert-1" /></DetailWrapper></QueryClientProvider>);
      expect(await screen.findByTestId('alert-detail-distance')).toHaveTextContent('A 85 m de Casa');
    } finally {
      queryClient.clear();
    }
  });
  it('#180 R5.2 (enmendado por E1): la distancia es un BlurView dentro del mapa', async () => {
    await renderDetail();
    await screen.findByTestId('alert-detail-distance');
    const blur = within(screen.getByTestId('alert-detail-map')).getByTestId('alert-detail-distance-blur');
    const { intensity, blurMethod, className } = blur.props;
    expect({ intensity, blurMethod, className }).toEqual({ intensity: 48, blurMethod: 'dimezisBlurViewSdk31Plus', className: 'absolute bottom-3 left-3 overflow-hidden rounded-full' });
    const distance = within(blur).getByTestId('alert-detail-distance');
    expect(distance.props.className).toBe('bg-glass-surface-strong px-2.5 py-1.5 text-xs font-bold text-foreground');
    expect(distance.props.className.split(' ')).not.toContain('bg-glass-surface');
    expect(distance.props.style).toEqual({ fontVariant: ['tabular-nums'] });
  });
});

describe('#170 R11: sin geofenceId pinta el mapa sin zona', () => {
  it.each(['geofence_exit', 'battery_low'])('%s sin geofenceId: mapa sin círculo ni distancia, sin consulta', async (type) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ type, geofenceId: null, payload: REAL_PAYLOAD })], nextCursor: null });
    await renderDetail();
    const map = await screen.findByTestId('pet-map-double');
    expect(map.props.circles).toEqual([]);
    expect(map.props.zoom).toBeUndefined();
    expect(screen.queryByTestId('alert-detail-distance')).toBeNull();
    expect(mockListGeofences).not.toHaveBeenCalled();
  });
});

describe('#170 R12: sin la zona de la alerta no pinta zona', () => {
  it.each([
    { fila: 'lista vacía', geofences: [] },
    { fila: 'otra zona llamada Casa', geofences: [{ ...ZONE, id: 'zone-2' }] },
  ])('$fila', async ({ geofences }) => {
    const queryClient = createQueryClient(jest.fn(), 60_000);
    queryClient.setQueryData(geofenceKeys.list('pet-1'), { kind: 'ok', geofences });
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ geofenceId: 'zone-1', payload: REAL_PAYLOAD })], nextCursor: null });
    try {
      await render(<QueryClientProvider client={queryClient}><DetailWrapper><AlertDetailScreen alertId="alert-1" /></DetailWrapper></QueryClientProvider>);
      const map = await screen.findByTestId('pet-map-double');
      expect(map.props.circles).toEqual([]);
      expect(map.props.zoom).toBeUndefined();
      expect(screen.queryByTestId('alert-detail-distance')).toBeNull();
    } finally {
      queryClient.clear();
    }
  });
});

describe('#170 R13: si la consulta de zonas no da ok, mapa sin zona y sin error', () => {
  it.each([
    { fila: 'pendiente', state: null },
    { fila: 'no-tracking', state: { kind: 'no-tracking' } },
    { fila: 'error', state: { kind: 'error' } },
    { fila: 'unreachable', state: { kind: 'unreachable', message: 'network down' } },
    { fila: 'missing-config', state: { kind: 'missing-config' } },
    { fila: 'unauthorized', state: { kind: 'unauthorized' } },
  ])('$fila', async ({ state }) => {
    const queryClient = createQueryClient(jest.fn(), 60_000);
    if (state !== null) queryClient.setQueryData(geofenceKeys.list('pet-1'), state);
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ geofenceId: 'zone-1', payload: REAL_PAYLOAD })], nextCursor: null });
    try {
      await render(<QueryClientProvider client={queryClient}><DetailWrapper><AlertDetailScreen alertId="alert-1" /></DetailWrapper></QueryClientProvider>);
      const map = await screen.findByTestId('pet-map-double');
      expect(map.props.circles).toEqual([]);
      expect(map.props.zoom).toBeUndefined();
      expect(screen.queryByTestId('alert-detail-distance')).toBeNull();
      expect(screen.queryByTestId('alert-detail-error')).toBeNull();
      expect(screen.getByTestId('alert-detail-card')).toBeVisible();
    } finally {
      queryClient.clear();
    }
  });
});

describe('#170 R14: dentro o en el borde no dice distancia', () => {
  it.each([
    { fila: 'en el centro', position: { lat: 19.4326, lng: -99.1332 }, zoom: 17.5850 },
    { fila: 'a 0,41 m del borde', position: { lat: 19.43350305, lng: -99.1332 }, zoom: 16.5820 },
  ])('$fila', async ({ position, zoom }) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ geofenceId: 'zone-1', payload: { ...REAL_PAYLOAD, position } })], nextCursor: null });
    mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [ZONE] });
    await renderDetail();
    await waitFor(() => expect(screen.getByTestId('pet-map-double').props.circles).toHaveLength(1));
    const map = screen.getByTestId('pet-map-double');
    expect(map.props.circles).toEqual([{ id: 'zone-1', center: { latitude: 19.4326, longitude: -99.1332 }, radius: 100 }]);
    expect(map.props.zoom).toBeCloseTo(zoom, 3);
    expect(screen.queryByTestId('alert-detail-distance')).toBeNull();
  });
});

describe('#170 R15: Ver en el mapa lleva al Mapa con la mascota de la alerta', () => {
  it.each([
    ['abierta geofence_exit con mapa', { type: 'geofence_exit', status: 'open', payload: REAL_PAYLOAD }],
    ['acked battery_low sin mapa', { type: 'battery_low', status: 'acked', payload: { batteryPct: 12 } }],
    ['closed mystery_type sin mapa', { type: 'mystery_type', status: 'closed', payload: {} }],
  ] as const)('lo pinta en %s (enmendado por #180 R6, E2)', async (_fila, overrides) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert(overrides)], nextCursor: null });
    await renderDetail();
    const button = await screen.findByTestId('alert-detail-view-map');
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.className).toBe('h-13 rounded-16 border-2 border-b-6 border-lip-gray bg-surface');
    expect(within(button).getByText('Ver en el mapa')).toBeVisible();
  });
  it('dice «View on map» en inglés', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    await renderDetail('alert-1', 'en');
    const button = await screen.findByTestId('alert-detail-view-map');
    expect(within(button).getByText('View on map')).toBeVisible();
  });
  it('no lo pinta mientras carga', async () => {
    mockListAlerts.mockReturnValue(new Promise(() => undefined));
    await renderDetail();
    await screen.findByTestId('alert-detail-loading');
    expect(screen.queryByTestId('alert-detail-view-map')).toBeNull();
  });
  it('no lo pinta con error', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'error' });
    await renderDetail();
    await screen.findByTestId('alert-detail-error');
    expect(screen.queryByTestId('alert-detail-view-map')).toBeNull();
  });

  it('selecciona la mascota de la alerta y después vuelve al Mapa', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ petId: 'pet-7' })], nextCursor: null });
    await renderDetail();
    await fireEvent.press(await screen.findByTestId('alert-detail-view-map'));
    expect(mockSelectPet).toHaveBeenCalledTimes(1);
    expect(mockSelectPet).toHaveBeenCalledWith('pet-7');
    expect(mockDismissTo).toHaveBeenCalledTimes(1);
    expect(mockDismissTo).toHaveBeenCalledWith('/map');
    expect(mockSelectPet.mock.invocationCallOrder[0]).toBeLessThan(mockDismissTo.mock.invocationCallOrder[0]);
  });
});


describe('#180 R1: título en el contenido', () => {
  it.each(['carga', 'error', 'con alerta'] as const)('#180 R1.2: título en %s', async (state) => {
    if (state === 'carga') mockListAlerts.mockReturnValue(new Promise(() => undefined));
    else if (state === 'error') mockListAlerts.mockResolvedValue({ kind: 'error' });
    else mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    const language = state === 'carga' ? 'en' : 'es';
    await renderDetail('alert-1', language);
    await screen.findByTestId(state === 'carga' ? 'alert-detail-loading' : state === 'error' ? 'alert-detail-error' : 'alert-detail-card');
    const title = screen.getByTestId('alert-detail-title');
    expect(title.props.accessibilityRole).toBe('header');
    expect(title).toHaveTextContent(language === 'en' ? 'Alert' : 'Alerta');
    const scrollContent = elementChild(screen.getByTestId('screen-alert-detail'), 0);
    expect(elementChild(scrollContent, 0)).toBe(title);
    expect(title.props.className).toBe('text-26 font-black tracking-title text-foreground');
  });
});

describe('#180 R4: ping del héroe', () => {
  it.each(['acked', 'closed'] as const)('#180 R4.2: %s no tiene ping', async status => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ status })], nextCursor: null });
    await renderDetail();
    await screen.findByTestId('alert-detail-card');
    expect(screen.queryByTestId('alert-detail-ping', { includeHiddenElements: true })).toBeNull();
  });
  it.each([false, true])('#180 R4.2: abierta con movimiento reducido %s', async reduced => {
    mockReducedMotion = reduced;
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    await renderDetail();
    await screen.findByTestId('alert-detail-card');
    if (reduced) expect(screen.queryByTestId('alert-detail-ping', { includeHiddenElements: true })).toBeNull();
    else expect(screen.getByTestId('alert-detail-ping', { includeHiddenElements: true })).toBeOnTheScreen();
  });
  it.each([['geofence_exit', 'bg-danger/20'], ['battery_low', 'bg-warning-strong/20'], ['unknown', 'bg-muted/20']])('#180 R4.3: %s usa su anillo detrás del disco', async (type, ring) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ type })], nextCursor: null });
    await renderDetail();
    const ping = await screen.findByTestId('alert-detail-ping');
    expect(ping.props.className).toBe('absolute size-23 rounded-full ' + ring);
    const disc = screen.getByTestId('alert-detail-disc');
    expect(elementChild(disc, 0)).toBe(ping);
    expect(within(elementChild(disc, 1)).getByTestId('alert-detail-icon')).toBeOnTheScreen();
  });
});

describe('#180 R5: mapa con cristal', () => {
  function prepare(payload: Alert['payload'] = REAL_PAYLOAD) {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ geofenceId: 'zone-1', payload })], nextCursor: null });
    mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [ZONE] });
  }
  it.each(['light', 'dark'] as const)('#180 R5.2 (enmendado por E1): tint del cristal en %s', async theme => {
    mockTheme = theme; prepare(); await renderDetail();
    expect((await screen.findByTestId('alert-detail-distance-blur')).props.tint).toBe(theme);
  });
  it('#180 R5.2 (enmendado por E1): la distancia cuelga del mapa y no es hermana de la CTA', async () => {
    prepare(); await renderDetail();
    const distance = await screen.findByTestId('alert-detail-distance');
    const map = screen.getByTestId('alert-detail-map');
    expect(within(map).getByTestId('alert-detail-distance') === distance).toBe(true);
    expect(distance.parent === screen.getByTestId('alert-detail-view-map').parent).toBe(false);
  });
  it.each([[19.43350305, 0], [19.4335057, 1]])('#180 R5.2 (enmendado por E1): umbral redondeado %s / %s m', async (lat, meters) => {
    prepare({ ...REAL_PAYLOAD, position: { lat, lng: -99.1332 } }); await renderDetail();
    await waitFor(() => expect(screen.getByTestId('pet-map-double').props.circles).toHaveLength(1));
    if (meters === 0) {
      expect(screen.queryByTestId('alert-detail-distance')).toBeNull();
      expect(screen.queryByTestId('alert-detail-distance-blur')).toBeNull();
    } else {
      expect(screen.getByTestId('alert-detail-distance')).toHaveTextContent('A 1 m de Casa');
      expect(screen.getByTestId('alert-detail-distance-blur')).toBeOnTheScreen();
    }
  });
  it('#180 R5.1/R5.2: batería sin posición no pinta mapa ni cristal y conserva CTA', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ type: 'battery_low', payload: { batteryPct: 12 } })], nextCursor: null });
    await renderDetail(); await screen.findByTestId('alert-detail-view-map');
    expect(screen.queryByTestId('alert-detail-map')).toBeNull();
    expect(screen.queryByTestId('alert-detail-distance')).toBeNull();
    expect(screen.queryByTestId('alert-detail-distance-blur')).toBeNull();
  });
  it('#180 R5.3: PetMap no recibe children', async () => {
    prepare(); await renderDetail(); await screen.findByTestId('alert-detail-distance');
    expect(screen.getByTestId('pet-map-double').props.children === undefined).toBe(true);
    expect(mockMapChildren).toHaveBeenLastCalledWith(undefined);
  });
  it.each([['es', 'Ubicación al salir de la zona Casa'], ['en', 'Location when leaving Casa']] as const)('#180 R5.4: prioridad del nombre del payload en %s', async (language, expected) => {
    prepare(); mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [{ ...ZONE, name: 'Jardín' }] });
    await renderDetail('alert-1', language);
    await screen.findByTestId('alert-detail-distance');
    const { accessible, accessibilityLabel } = screen.getByTestId('alert-detail-map').props;
    expect({ accessible, accessibilityLabel }).toEqual({ accessible: true, accessibilityLabel: expected });
  });
  it('#180 R5.4: usa el nombre de la zona si falta en el payload', async () => {
    prepare({ position: REAL_PAYLOAD.position }); await renderDetail(); await screen.findByTestId('alert-detail-distance');
    expect(screen.getByTestId('alert-detail-map').props.accessibilityLabel).toBe('Ubicación al salir de la zona Casa');
  });
  it('#180 R5.4: sin ningún nombre omite la etiqueta del mapa', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ payload: { position: REAL_PAYLOAD.position } })], nextCursor: null });
    await renderDetail();
    expect((await screen.findByTestId('alert-detail-map')).props.accessibilityLabel).toBeUndefined();
    expect(screen.queryByTestId('alert-detail-distance-blur')).toBeNull();
  });
});

describe('#180 R6: CTA Ver en el mapa', () => {
  it('#180 R6.1 (enmendado por E1): la CTA lleva h-13, rounded-16, labio gris y el icono Map antes de la etiqueta', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    await renderDetail();
    const button = await screen.findByTestId('alert-detail-view-map');
    expect(button.props.className).toBe('h-13 rounded-16 border-2 border-b-6 border-lip-gray bg-surface');
    expect(button.children).toHaveLength(2);
    expect(elementChild(button, 0).props).toMatchObject({ iconName: 'Map', size: 18, color: '--color-foreground' });
    expect(elementChild(button, 1)).toHaveTextContent('Ver en el mapa');
    expect(elementChild(button, 1).props.className).toBe('text-base font-extrabold text-foreground');
  });
  it.each(['open', 'acked', 'closed'].flatMap(status => [true, false].map(map => ({ status, map }))))('#180 R6.2: CTA $status con mapa $map', async ({ status, map }) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ status, payload: map ? REAL_PAYLOAD : {} })], nextCursor: null });
    await renderDetail(); await screen.findByTestId('alert-detail-view-map');
    if (map) expect(screen.getByTestId('alert-detail-map')).toBeOnTheScreen();
    else expect(screen.queryByTestId('alert-detail-map')).toBeNull();
  });
});

describe('#180 R7: ack primario', () => {
  it('#180 R7.1 (enmendado por E1): ack abierto con labio y etiqueta', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    await renderDetail();
    const button = await screen.findByTestId('alert-detail-ack');
    expect(button.props.className).toBe('w-full h-14 rounded-16 bg-accent border-b-4 border-black/25');
    const label = within(button).getByText('Marcar leída');
    expect(label.props.className).toBe('text-17 font-extrabold text-accent-foreground');
  });
  it.each(['acked', 'closed'] as const)('#180 R7.1 (enmendado por E1): %s no pinta ack', async status => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ status })], nextCursor: null });
    await renderDetail(); await screen.findByTestId('alert-detail-card');
    expect(screen.queryByTestId('alert-detail-ack')).toBeNull();
    expect(screen.getByTestId('alert-detail-view-map')).toBeOnTheScreen();
  });
  it('#180 R7.1: el error está inmediatamente antes del ack', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    mockAckAlert.mockResolvedValue({ kind: 'error' });
    await renderDetail(); await fireEvent.press(await screen.findByTestId('alert-detail-ack'));
    const error = await screen.findByTestId('alert-detail-action-error');
    const content = elementChild(screen.getByTestId('screen-alert-detail'), 0);
    const errorIndex = content.children.findIndex(child => typeof child !== 'string' && child.props.testID === 'alert-detail-action-error');
    expect(errorIndex).toBeGreaterThanOrEqual(0);
    expect(elementChild(content, errorIndex) === error).toBe(true);
    expect(elementChild(content, errorIndex + 1) === screen.getByTestId('alert-detail-ack')).toBe(true);
  });
});

function detailChildren() {
  return elementChild(screen.getByTestId('screen-alert-detail'), 0).children.filter((child): child is TestInstance => typeof child !== 'string');
}
function detailIds() {
  return detailChildren().map(child => ['alert-detail-card-entrance', 'alert-detail-map-entrance'].includes(child.props.testID)
    ? elementChild(child, 0).props.testID : child.props.testID);
}
describe('#180 R2: marco y orden', () => {
  it.each([0, 24])('#180 R2.1: inset inferior %i conserva la holgura de 40', async bottom => {
    mockBottom = bottom;
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    await renderDetail(); await screen.findByTestId('alert-detail-card');
    expect(screen.getByTestId('screen-alert-detail').props.contentContainerStyle).toEqual({ paddingHorizontal: 20, paddingTop: 24, paddingBottom: bottom + 40, gap: 14, flexGrow: 1 });
  });
  it('#180 R2.2: el espaciador va entre la CTA y el ack', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    await renderDetail(); await screen.findByTestId('alert-detail-ack');
    expect(screen.getByTestId('alert-detail-spacer').props.className).toBe('flex-1');
    const ids = detailIds();
    expect(ids.indexOf('alert-detail-spacer')).toBe(ids.indexOf('alert-detail-view-map') + 1);
    expect(ids.indexOf('alert-detail-ack')).toBe(ids.indexOf('alert-detail-spacer') + 1);
  });
  it('#180 R2.2: sin ack el espaciador sigue y la CTA conserva su índice', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    mockAckAlert.mockResolvedValue({ kind: 'ok', alert: makeAlert({ status: 'acked' }) });
    await renderDetail(); const ack = await screen.findByTestId('alert-detail-ack');
    const before = detailIds();
    expect(before).toContain('alert-detail-spacer');
    await fireEvent.press(ack);
    await waitFor(() => expect(screen.getByTestId('alert-detail-status')).toHaveTextContent('Leída'));
    const after = detailIds();
    expect(after).toContain('alert-detail-spacer');
    expect(after.indexOf('alert-detail-spacer')).toBe(before.indexOf('alert-detail-spacer'));
    expect(after.indexOf('alert-detail-view-map')).toBe(before.indexOf('alert-detail-view-map'));
    expect(screen.queryByTestId('alert-detail-ack')).toBeNull();
  });
  it.each([
    { scenario: 'con zona', zone: true, position: true },
    { scenario: 'sin zona', zone: false, position: true },
    { scenario: 'sin posición', zone: false, position: false },
  ].flatMap(scenario => [true, false].map(error => ({ ...scenario, error }))))('#180 R2.3: ordena título, héroe, mapa, CTA, espaciador, error y ack: $scenario / error $error', async ({ zone, position, error }) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ geofenceId: zone ? 'zone-1' : null, payload: position ? REAL_PAYLOAD : {} })], nextCursor: null });
    mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [ZONE] });
    mockAckAlert.mockResolvedValue({ kind: 'error' });
    await renderDetail(); await screen.findByTestId('alert-detail-ack');
    if (zone) await screen.findByTestId('alert-detail-distance');
    if (error) { await fireEvent.press(screen.getByTestId('alert-detail-ack')); await screen.findByTestId('alert-detail-action-error'); }
    await waitFor(() => expect(detailIds()).toEqual(['alert-detail-title', 'alert-detail-card', ...(position ? ['alert-detail-map'] : []), 'alert-detail-view-map', 'alert-detail-spacer', ...(error ? ['alert-detail-action-error'] : []), 'alert-detail-ack']));
  });
});

it('#180 R9.1: el héroe y el mapa entran con HomeEntrance 0 y 1', async () => {
  mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ geofenceId: 'zone-1', payload: REAL_PAYLOAD })], nextCursor: null });
  mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [ZONE] });
  await renderDetail(); await screen.findByTestId('alert-detail-distance');
  const heroEntrance = screen.getByTestId('alert-detail-card-entrance');
  const mapEntrance = screen.getByTestId('alert-detail-map-entrance');
  expect(heroEntrance.props.index).toBe(0); expect(mapEntrance.props.index).toBe(1);
  expect(heroEntrance.children).toHaveLength(1); expect(mapEntrance.children).toHaveLength(1);
  expect(elementChild(heroEntrance, 0) === screen.getByTestId('alert-detail-card')).toBe(true);
  expect(elementChild(mapEntrance, 0) === screen.getByTestId('alert-detail-map')).toBe(true);
  expect(detailChildren()[0] === screen.getByTestId('alert-detail-title')).toBe(true);
  expect(within(heroEntrance).queryByTestId('alert-detail-title')).toBeNull();
  expect(within(mapEntrance).queryByTestId('alert-detail-title')).toBeNull();
  expect(detailIds().slice(-2)).toEqual(['alert-detail-spacer', 'alert-detail-ack']);
});
