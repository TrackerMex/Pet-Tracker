import { screen, waitFor, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import type { TestInstance } from 'test-renderer';

import { ackAlert, listAlerts, type AlertsState } from '../../api/alerts';
import type { Alert } from '../../api/types';
import { useAuth, type AuthContextValue } from '../../providers/auth-provider';
import { LanguageProvider } from '../../providers/language-provider';
import { renderWithProviders } from '../../../test/render-with-providers';
import { AlertDetailScreen } from '.';

jest.mock('expo-router', () => ({
  router: { dismissTo: jest.fn(), push: jest.fn() },
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
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
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

describe('#100 R3: el detalle pinta la alerta de la caché de la lista', () => {
  it.each([
    ['geofence_exit', 'LocationSlash', 'bg-danger-soft', '--color-danger', 'Salió de la zona'],
    ['battery_low', 'BatteryLow', 'bg-warning-soft', '--color-warning-strong', 'Batería baja'],
    ['future_alert_type', 'Bell', 'bg-default', '--color-muted', 'Aviso'],
  ] as const)(
    'pinta icono, disco, tinta y etiqueta de $type',
    async (type, iconName, surface, color, label) => {
      mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ type })], nextCursor: null });
      await renderDetail();

      const card = await screen.findByTestId('alert-detail-card');
      const cardScope = within(card);
      expect(card.children).toHaveLength(4);
      expect(elementChild(card, 0).props.testID).toBe('alert-detail-header');
      expect(elementChild(card, 1).props.testID).toBe('alert-detail-pet');
      expect(elementChild(card, 2).props.testID).toBe('alert-detail-opened-at');
      expect(elementChild(card, 3).props.testID).toBe('alert-detail-status');
      const header = cardScope.getByTestId('alert-detail-header');
      expect(header.props.className).toBe('flex-row items-center gap-3');
      const icon = cardScope.getByTestId('alert-detail-icon');
      expect(icon.props.iconName).toBe(iconName);
      expect(icon.props.size).toBe(20);
      expect(icon.props.color).toBe(color);
      expect(icon.parent?.props.className).toBe(`size-11 items-center justify-center rounded-full ${surface}`);
      expect(cardScope.getByTestId('alert-detail-type')).toHaveTextContent(label);
      expect(cardScope.getByTestId('alert-detail-type').props.className).toBe('text-lg font-bold text-foreground');
      expect(cardScope.getByTestId('alert-detail-pet')).toHaveTextContent('Luna');
      expect(cardScope.getByTestId('alert-detail-pet').props.selectable).toBe(true);
      expect(cardScope.getByTestId('alert-detail-pet').props.className).toBe('text-sm font-semibold text-muted');
    },
  );

  it.each([
    ['open', 'Sin leer'],
    ['acked', 'Leída'],
    ['closed', 'Resuelta'],
  ] as const)('pinta la píldora de $status', async (status, label) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ status })], nextCursor: null });
    await renderDetail();
    const pill = await screen.findByTestId('alert-detail-status');
    expect(pill).toHaveTextContent(label);
    expect(pill.props.className).toBe('self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted');
  });

  it.each([
    ['es', '2026-12-31T12:00:00.000Z', /^Detectada el 31\/12\/2026,/],
    ['en', '2027-01-02T12:00:00.000Z', /^Detected 1\/2\/2027,/],
  ] as const)('formatea la apertura en $language con el locale del idioma', async (language, openedAt, expected) => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ openedAt })], nextCursor: null });
    await renderDetail('alert-1', language);
    const opened = await screen.findByTestId('alert-detail-opened-at');
    expect(opened).toHaveTextContent(expected);
    expect(opened.props.selectable).toBe(true);
    expect(opened.props.className).toBe('text-sm font-normal text-muted');
  });

  it('respeta las métricas A11 bajo cabecera nativa', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
    await renderDetail();
    const root = await screen.findByTestId('screen-alert-detail');
    expect(root.props.className).toBe('flex-1 bg-background');
    expect(root.props.contentInsetAdjustmentBehavior).toBe('automatic');
    expect(root.props.contentContainerStyle).toEqual({ padding: 24, gap: 16, paddingBottom: 48 });
    expect(screen.getByTestId('alert-detail-card').props.className).toBe('rounded-card border border-border bg-surface p-4 shadow-sm min-h-44 gap-3');
  });
});
