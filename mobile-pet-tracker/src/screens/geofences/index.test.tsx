import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';

import { renderWithProviders } from '../../../test/render-with-providers';
import { deleteGeofence, listGeofences, setGeofenceActive, type Geofence, type GeofenceListState } from '../../api/geofences';
import { getPet, type PetState } from '../../api/pets';
import type { PetProfile } from '../../api/types';
import type { Language } from '../../i18n/catalog';
import { LanguageProvider } from '../../providers/language-provider';
import { GeofencesScreen } from '.';

jest.mock('../../api/geofences', () => ({
  deleteGeofence: jest.fn(), listGeofences: jest.fn(), setGeofenceActive: jest.fn(),
}));
jest.mock('../../api/pets', () => ({ getPet: jest.fn() }));
const mockSignOut = jest.fn().mockResolvedValue(undefined);
jest.mock('../../providers/auth-provider', () => ({
  useAuth: () => ({ status: 'authenticated', token: 'token-1', signIn: jest.fn(), signOut: mockSignOut }),
}));
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));

const mockList = jest.mocked(listGeofences);
const mockGetPet = jest.mocked(getPet);
const mockSetActive = jest.mocked(setGeofenceActive);
const mockDelete = jest.mocked(deleteGeofence);
const apiUrl = 'http://example.test/v1';

function makeGeofence(overrides: Partial<Geofence> = {}): Geofence {
  return {
    id: 'geofence-1', petId: 'pet-1', name: 'Casa', type: 'safe_circle',
    centerLat: 19.4, centerLng: -99.1, radiusM: 150, active: true,
    state: { value: 'unknown', updatedAt: null },
    createdAt: '2026-10-01T12:00:00.000Z', updatedAt: '2026-10-01T12:00:00.000Z',
    ...overrides,
  };
}

function petState(myRole: PetProfile['myRole'] = 'owner'): PetState {
  return { kind: 'ok', pet: {
    id: 'pet-1', name: 'Luna', species: 'dog', breed: null, sex: null,
    birthDate: null, approxAgeMonths: null, ageMonths: 30, currentWeightKg: null,
    size: null, color: null, sterilized: null, microchip: null, photoUrl: null,
    lostMode: false, lastPosition: null, lastCommunicationAt: null, myRole,
    device: null, nextVaccine: null, nextReminder: null, activitySummary: null,
    mealsToday: null, createdAt: '2026-10-01T12:00:00.000Z', updatedAt: '2026-10-01T12:00:00.000Z',
  } };
}

function childTestIds(node: ReturnType<typeof screen.getByTestId>) {
  return node.children.map((child) => typeof child === 'string' ? undefined : child.props.testID);
}

function mount(language: Language = 'es', onUnauthorized?: () => void) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <HeroUINativeProvider><LanguageProvider initial={language}>{children}</LanguageProvider></HeroUINativeProvider>;
  }
  return renderWithProviders(<GeofencesScreen petId="pet-1" />, { onUnauthorized, wrapper: Wrapper });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockList.mockReset(); mockGetPet.mockReset(); mockSetActive.mockReset(); mockDelete.mockReset();
  process.env.EXPO_PUBLIC_API_URL = apiUrl;
  mockGetPet.mockResolvedValue(petState());
});

describe('#41 R5: la pantalla pinta la lista de zonas y sus estados', () => {
  it('pinta el esqueleto mientras carga la lista', async () => {
    mockList.mockReturnValue(new Promise(() => undefined));
    await mount();
    const skeleton = screen.getByTestId('geofences-loading');
    expect(skeleton.props.className).toBe('skeleton__root h-24 w-full rounded-card');
    expect(mockList).toHaveBeenCalledTimes(1);
    expect(mockList).toHaveBeenCalledWith(apiUrl, 'token-1', 'pet-1');
    expect(mockGetPet).toHaveBeenCalledWith(apiUrl, 'token-1', 'pet-1');
    expect(screen.queryByTestId('geofences-empty')).toBeNull();
  });

  it('sigue en esqueleto mientras el rol de la mascota no ha llegado', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [] });
    mockGetPet.mockReturnValue(new Promise(() => undefined));
    const { queryClient } = await mount();
    await waitFor(() => expect(queryClient.getQueryData(['geofences', 'list', 'pet-1'])).toEqual({ kind: 'ok', geofences: [] }));
    expect(screen.getByTestId('geofences-loading')).toBeVisible();
    expect(screen.queryByTestId('geofences-empty')).toBeNull();
  });

  it('respeta las métricas A11 bajo cabecera nativa', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [makeGeofence()] });
    await mount();
    await screen.findByTestId('geofence-geofence-1');
    const root = screen.getByTestId('screen-geofences');
    expect(root.props.className).toBe('flex-1 bg-background');
    expect(root.props.contentInsetAdjustmentBehavior).toBe('automatic');
    expect(root.props.contentContainerStyle).toEqual({ padding: 24, gap: 16, paddingBottom: 48 });
  });

  it('pinta el vacío con su tarjeta y su copy', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [] });
    await mount();
    const empty = await screen.findByTestId('geofences-empty');
    expect(empty.props.className).toBe('rounded-card border border-border bg-surface p-4 shadow-sm items-center py-8');
    expect(within(empty).getByText('Aún no hay zonas seguras').props.className).toBe('text-center font-normal text-muted');
    expect(screen.queryByTestId('geofences-loading')).toBeNull();
  });

  it('pinta cada nombre y radio en sus columnas en el orden del backend', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [
      makeGeofence({ id: 'geofence-2', name: 'Parque', radiusM: 149.6 }),
      makeGeofence({ radiusM: 1000, active: false }),
    ] });
    await mount();
    await screen.findByTestId('geofence-geofence-2');
    expect(screen.getAllByTestId(/^geofence-geofence-\d$/).map((row) => row.props.testID)).toEqual(['geofence-geofence-2', 'geofence-geofence-1']);
    for (const [id, name, radius] of [['geofence-2', 'Parque', 'Radio de 150 m'], ['geofence-1', 'Casa', 'Radio de 1000 m']]) {
      const row = screen.getByTestId(`geofence-${id}`);
      expect(row.props.className).toBe('rounded-card border border-border bg-surface p-4 shadow-sm flex-row items-center gap-3');
      expect(row).toHaveStyle({ borderCurve: 'continuous' });
      expect(row.props.role).toBeUndefined();
      expect(row.props.accessibilityRole).toBeUndefined();
      const column = row.children[0] as ReturnType<typeof screen.getByTestId>;
      expect(column.props.className).toBe('min-w-0 flex-1 gap-1');
      expect(childTestIds(column)).toEqual([`geofence-${id}-name`, `geofence-${id}-radius`]);
      const nameNode = within(row).getByTestId(`geofence-${id}-name`);
      expect(nameNode).toHaveTextContent(name);
      expect(nameNode.props.selectable).toBe(true);
      expect(nameNode.props.className).toBe('font-bold text-foreground');
      const radiusNode = within(row).getByTestId(`geofence-${id}-radius`);
      expect(radiusNode).toHaveTextContent(radius);
      expect(radiusNode.props.className).toBe('text-sm font-normal text-muted');
    }
  });

  it('pinta el radio en inglés', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [makeGeofence({ radiusM: 149.6 })] });
    await mount('en');
    expect(await screen.findByTestId('geofence-geofence-1-radius')).toHaveTextContent('150 m radius');
  });

  it('pinta el 402 sin Reintentar', async () => {
    mockList.mockResolvedValue({ kind: 'no-tracking' });
    await mount();
    const card = await screen.findByTestId('geofences-no-tracking');
    expect(card).toHaveTextContent('Las zonas seguras requieren un collar');
    expect(card.props.className).toBe('rounded-card border border-border bg-surface p-4 shadow-sm items-center py-8');
    expect(screen.queryByTestId('geofences-retry')).toBeNull();
  });

  it.each([
    [{ kind: 'error' }, 'Algo salió mal'],
    [{ kind: 'missing-config' }, 'Algo salió mal'],
    [{ kind: 'unreachable', message: 'offline' }, 'No se pudo conectar con el servidor'],
  ] as const)('pinta %p y Reintentar vuelve a pedir solo la lista', async (state, message) => {
    mockList.mockResolvedValueOnce(state).mockResolvedValue({ kind: 'ok', geofences: [makeGeofence()] });
    await mount();
    const error = await screen.findByTestId('geofences-error');
    expect(error).toHaveTextContent(message);
    expect(error.props.selectable).toBe(true);
    expect(error.props.className).toBe('text-danger');
    const retry = screen.getByTestId('geofences-retry');
    expect(retry.props.className).toBe('pressable-feedback__root button__root button__root--variant-primary button__root--size-md min-h-11');
    expect(retry).toHaveTextContent('Reintentar');
    await fireEvent.press(retry);
    expect(await screen.findByTestId('geofence-geofence-1')).toBeVisible();
    expect(mockList).toHaveBeenCalledTimes(2);
    expect(mockGetPet).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('geofences-error')).toBeNull();
  });

  it('deja el 401 de la lista al manejador global y no pinta estado', async () => {
    mockList.mockResolvedValue({ kind: 'unauthorized' });
    const onUnauthorized = jest.fn();
    await mount('es', onUnauthorized);
    await waitFor(() => expect(onUnauthorized).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.queryByTestId('geofences-loading')).toBeNull());
    expect(mockSignOut).not.toHaveBeenCalled();
    expect(screen.queryByTestId('geofences-error')).toBeNull();
    expect(screen.queryByTestId('geofences-empty')).toBeNull();
  });
});
