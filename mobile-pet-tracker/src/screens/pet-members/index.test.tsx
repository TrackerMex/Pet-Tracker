import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';

import { listPetMembers } from '../../api/pet-members';
import { getPet } from '../../api/pets';
import type { PetProfile } from '../../api/types';
import { getMe } from '../../api/users';
import { LanguageProvider } from '../../providers/language-provider';
import { renderWithProviders } from '../../../test/render-with-providers';
import PetMembersScreen from './index';

const mockSignOut = jest.fn().mockResolvedValue(undefined);

jest.mock('../../api/pets', () => ({ getPet: jest.fn() }));
jest.mock('../../api/users', () => ({ getMe: jest.fn() }));
jest.mock('../../api/pet-members', () => ({
  listPetMembers: jest.fn(),
  listPetInvites: jest.fn(),
  createPetInvite: jest.fn(),
  revokePetInvite: jest.fn(),
  removePetMember: jest.fn(),
}));
jest.mock('../../providers/auth-provider', () => ({
  useAuth: () => ({ token: 'token', signOut: mockSignOut }),
}));
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), canGoBack: () => true, dismissTo: jest.fn() },
}));
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));
jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens.map((token) => `color:${token}`),
}));

const pet: PetProfile = {
  id: 'pet-1', name: 'Rocky', species: 'dog', breed: null, sex: 'male',
  birthDate: null, approxAgeMonths: 30, ageMonths: 30, currentWeightKg: 12,
  size: 'medium', color: null, sterilized: true, microchip: null, photoUrl: null,
  lostMode: false, lastPosition: null, lastCommunicationAt: null, myRole: 'owner',
  device: null, nextVaccine: null, nextReminder: null, activitySummary: null,
  mealsToday: null, createdAt: '2026-10-06T09:05:00.000Z', updatedAt: '2026-10-06T09:05:00.000Z',
};
const members = [
  { userId: 'user-1', firstName: 'Ana', lastName: 'García', role: 'owner' as const, joinedAt: '2026-10-06T09:05:00.000Z' },
  { userId: 'user-2', firstName: 'Luis', lastName: 'Ortega', role: 'family' as const, joinedAt: '2026-10-06T09:05:00.000Z' },
];
const me = {
  id: 'user-1', firstName: 'Ana', lastName: 'García', email: 'ana@correo.com',
  phone: '', country: 'MX', timezone: 'America/Mexico_City',
  createdAt: '2026-10-06T09:05:00.000Z', updatedAt: '2026-10-06T09:05:00.000Z',
};
const queries = { pet: jest.mocked(getPet), members: jest.mocked(listPetMembers), me: jest.mocked(getMe) };

function Wrapper({ children }: { children: ReactNode }) {
  return <HeroUINativeProvider><LanguageProvider initial="es">{children}</LanguageProvider></HeroUINativeProvider>;
}

async function renderMembers() {
  return renderWithProviders(<PetMembersScreen petId="pet-1" />, { wrapper: Wrapper, onUnauthorized: mockSignOut });
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(getPet).mockResolvedValue({ kind: 'ok', pet });
  jest.mocked(listPetMembers).mockResolvedValue({ kind: 'ok', members });
  jest.mocked(getMe).mockResolvedValue({ kind: 'ok', me });
});

it('R8: muestra el skeleton mientras carga', async () => {
  jest.mocked(getPet).mockReturnValue(new Promise(() => undefined));
  jest.mocked(listPetMembers).mockReturnValue(new Promise(() => undefined));
  jest.mocked(getMe).mockReturnValue(new Promise(() => undefined));
  await renderMembers();
  expect(screen.getByTestId('pet-members-loading')).toBeVisible();
  expect(screen.getByTestId('pet-members-header-skeleton')).toBeVisible();
  expect(screen.queryAllByTestId(/^member-row-/)).toHaveLength(0);
});

it.each(['pet', 'members', 'me'] as const)('R8: %s unreachable dice No se pudo conectar con el servidor y Reintentar repite solo esa carga', async (name) => {
  queries[name].mockResolvedValue({ kind: 'unreachable', message: 'x' });
  await renderMembers();
  await waitFor(() => expect(screen.getByTestId('pet-members-error-text')).toHaveTextContent('No se pudo conectar con el servidor'));
  await fireEvent.press(screen.getByTestId('pet-members-retry'));
  await waitFor(() => expect(screen.getByTestId('pet-members-error-text')).toHaveTextContent('No se pudo conectar con el servidor'));
  for (const key of ['pet', 'members', 'me'] as const) {
    expect(queries[key]).toHaveBeenCalledTimes(key === name ? 2 : 1);
  }
});

it.each(['pet', 'members', 'me'] as const)('R8: %s error dice Algo salió mal', async (name) => {
  queries[name].mockResolvedValue({ kind: 'error' });
  await renderMembers();
  await waitFor(() => expect(screen.getByTestId('pet-members-error-text')).toHaveTextContent('Algo salió mal'));
});

it.each(['pet', 'members', 'me'] as const)('R8: %s unauthorized cierra sesión', async (name) => {
  queries[name].mockResolvedValue({ kind: 'unauthorized' });
  await renderMembers();
  await waitFor(() => expect(screen.queryByTestId('pet-members-loading')).toBeNull());
  expect(mockSignOut).toHaveBeenCalledTimes(1);
});

it('R8: el título es Familia de Rocky', async () => {
  await renderMembers();
  await waitFor(() => expect(screen.getByTestId('pet-members-header-title')).toHaveTextContent('Familia de Rocky'));
});

it('R9: pinta iniciales, nombre, Tú y la píldora de rol en el orden de la API', async () => {
  await renderMembers();
  await waitFor(() => expect(screen.getByTestId('pet-members-list')).toBeVisible());
  expect(screen.getByTestId('pet-members-heading')).toHaveTextContent('Miembros');
  expect(within(screen.getByTestId('pet-members-list')).getAllByTestId(/^member-row-user-\d+$/).map((row) => row.props.testID)).toEqual(['member-row-user-1', 'member-row-user-2']);
  expect(screen.getByTestId('member-row-user-1-name')).toHaveTextContent('Ana García');
  expect(screen.getByTestId('member-row-user-2-name')).toHaveTextContent('Luis Ortega');
  expect(screen.getByTestId('member-row-user-1-you')).toHaveTextContent('Tú');
  expect(screen.queryByTestId('member-row-user-2-you')).toBeNull();
  const ownAvatar = screen.getByTestId('member-row-user-1-avatar', { includeHiddenElements: true });
  const otherAvatar = screen.getByTestId('member-row-user-2-avatar', { includeHiddenElements: true });
  expect(ownAvatar).toHaveTextContent('AG');
  expect(otherAvatar).toHaveTextContent('LO');
  expect(ownAvatar.props.className).toContain('bg-default');
  expect(otherAvatar.props.className).toContain('bg-category-blue');
  expect(screen.getByTestId('member-row-user-1-role').props.className).toBe('rounded-full px-2 py-0.75 bg-category-green');
  expect(screen.getByTestId('member-row-user-1-role')).toHaveTextContent('Dueño');
  expect(screen.getByTestId('member-row-user-2-role').props.className).toBe('rounded-full px-2 py-0.75 bg-category-rose');
  expect(screen.getByTestId('member-row-user-2-role')).toHaveTextContent('Familia');
});

it('R9: walker y vet se muestran como Familia', async () => {
  jest.mocked(listPetMembers).mockResolvedValue({ kind: 'ok', members: [
    { ...members[0], role: 'walker' },
    { ...members[1], role: 'vet' },
  ] });
  await renderMembers();
  await waitFor(() => expect(screen.getByTestId('member-row-user-1-role')).toHaveTextContent('Familia'));
  expect(screen.getByTestId('member-row-user-2-role')).toHaveTextContent('Familia');
});

it('R9: ningún texto de la pantalla contiene el correo de getMe', async () => {
  await renderMembers();
  await waitFor(() => expect(screen.queryByTestId('pet-members-loading')).toBeNull());
  for (const text of screen.getAllByText(/./, { includeHiddenElements: true })) {
    expect(text).not.toHaveTextContent('@');
  }
});

it('R10: el dueño ve Quitar en los demás y no en sí mismo', async () => {
  jest.mocked(listPetMembers).mockResolvedValue({ kind: 'ok', members: [
    { ...members[0], role: 'family' },
    members[1],
    { ...members[0], userId: 'user-3' },
  ] });
  await renderMembers();
  await waitFor(() => expect(screen.getByTestId('member-row-user-2-remove')).toBeVisible());
  expect(screen.getByTestId('member-row-user-2-remove')).toHaveTextContent('Quitar');
  expect(screen.getByLabelText('Quitar a Luis Ortega')).toBeVisible();
  expect(screen.queryByTestId('member-row-user-1-remove')).toBeNull();
  expect(screen.queryByTestId('member-row-user-3-remove')).toBeNull();
  expect(screen.getByTestId('pet-members-intro')).toHaveTextContent('Quienes estén aquí ven a Rocky y reciben sus avisos. Solo tú puedes invitar o quitar a alguien.');
});

it('R10: family no ve Quitar, invitaciones ni CTA', async () => {
  jest.mocked(getPet).mockResolvedValue({ kind: 'ok', pet: { ...pet, myRole: 'family' } });
  await renderMembers();
  await waitFor(() => expect(screen.getByTestId('pet-members-list')).toBeVisible());
  expect(screen.queryAllByTestId(/^member-row-.*-remove$/)).toHaveLength(0);
  expect(screen.queryAllByTestId(/^pet-invites-/)).toHaveLength(0);
  expect(screen.queryByTestId('pet-members-code-note')).toBeNull();
  expect(screen.queryByTestId('pet-members-invite-cta')).toBeNull();
});

it('R10: walker tampoco ve acciones de dueño', async () => {
  jest.mocked(getPet).mockResolvedValue({ kind: 'ok', pet: { ...pet, myRole: 'walker' } });
  await renderMembers();
  await waitFor(() => expect(screen.getByTestId('pet-members-list')).toBeVisible());
  expect(screen.queryAllByTestId(/^member-row-.*-remove$/)).toHaveLength(0);
  expect(screen.queryAllByTestId(/^pet-invites-/)).toHaveLength(0);
  expect(screen.queryByTestId('pet-members-code-note')).toBeNull();
  expect(screen.queryByTestId('pet-members-invite-cta')).toBeNull();
});
