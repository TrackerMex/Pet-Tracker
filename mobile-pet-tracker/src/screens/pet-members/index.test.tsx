import { act, fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';

import { createPetInvite, listPetInvites, listPetMembers, removePetMember, revokePetInvite, type CreatePetInviteState, type RemovePetMemberState } from '../../api/pet-members';
import { getPet } from '../../api/pets';
import type { PetProfile } from '../../api/types';
import { getMe } from '../../api/users';
import { LanguageProvider } from '../../providers/language-provider';
import { renderWithProviders } from '../../../test/render-with-providers';
import PetMembersScreen from './index';

const mockSignOut = jest.fn().mockResolvedValue(undefined);
const mockClearPet = jest.fn();
const originalApiUrl = process.env.EXPO_PUBLIC_API_URL;

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
jest.mock('../../providers/selected-pet-provider', () => ({
  useSelectedPet: () => ({ clearPet: mockClearPet }),
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
jest.mock('@expo/ui/community/bottom-sheet', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    BottomSheet: ({ children, index, ...props }: Record<string, unknown>) =>
      typeof index === 'number' && index >= 0
        ? React.createElement(View as unknown as React.ComponentType<Record<string, unknown>>, { ...props, index, testID: 'community-bottom-sheet' }, children as never)
        : null,
    BottomSheetView: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(View, props, children as never),
  };
});

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
const invite = { id: 'inv-1', role: 'family', createdAt: new Date(2026, 9, 6, 9, 5).toISOString(), expiresAt: new Date(2026, 9, 9, 14, 0).toISOString() };
const createdInvite = { ...invite, code: 'K7P4Q2M9XA' };
const queries = { pet: jest.mocked(getPet), members: jest.mocked(listPetMembers), me: jest.mocked(getMe) };

function Wrapper({ children }: { children: ReactNode }) {
  return <HeroUINativeProvider><LanguageProvider initial="es">{children}</LanguageProvider></HeroUINativeProvider>;
}

async function renderMembers() {
  return renderWithProviders(<PetMembersScreen petId="pet-1" />, { wrapper: Wrapper, onUnauthorized: mockSignOut });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockClearPet.mockReset();
  jest.mocked(router.dismissTo).mockReset();
  jest.mocked(router.push).mockReset();
  process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
  jest.mocked(getPet).mockResolvedValue({ kind: 'ok', pet });
  jest.mocked(listPetMembers).mockResolvedValue({ kind: 'ok', members });
  jest.mocked(getMe).mockResolvedValue({ kind: 'ok', me });
  jest.mocked(removePetMember).mockResolvedValue({ kind: 'ok' });
  jest.mocked(listPetInvites).mockResolvedValue({ kind: 'ok', invites: [] });
  jest.mocked(revokePetInvite).mockResolvedValue({ kind: 'ok' });
  jest.mocked(createPetInvite).mockResolvedValue({ kind: 'error' });
});

afterAll(() => {
  if (originalApiUrl === undefined) delete process.env.EXPO_PUBLIC_API_URL;
  else process.env.EXPO_PUBLIC_API_URL = originalApiUrl;
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
    expect(text).not.toHaveTextContent(/@/);
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

async function renderRemoving() {
  const app = await renderMembers();
  await waitFor(() => expect(screen.getByTestId('member-row-user-2-remove')).toBeVisible());
  await fireEvent.press(screen.getByTestId('member-row-user-2-remove'));
  await waitFor(() => expect(screen.getByTestId('member-remove-sheet')).toBeVisible());
  return app;
}

it('R11: el sheet nombra a la persona y a su mascota', async () => {
  await renderRemoving();
  expect(screen.getByTestId('member-remove-sheet-title')).toHaveTextContent('¿Quitar a Luis Ortega?');
  expect(screen.getByTestId('member-remove-sheet-body')).toHaveTextContent('Luis dejará de ver a Rocky y de recibir sus avisos. Podrás enviarle otra invitación cuando quieras.');
  expect(screen.getByTestId('member-remove-sheet-avatar', { includeHiddenElements: true })).toHaveTextContent('LO');
  expect(screen.getByTestId('community-bottom-sheet').props.backgroundStyle).toEqual({ backgroundColor: 'color:surface' });
});

it('R11: Cancelar cierra sin llamar a la API', async () => {
  await renderRemoving();
  await fireEvent.press(screen.getByTestId('member-remove-sheet-cancel'));
  await waitFor(() => expect(screen.queryByTestId('member-remove-sheet')).toBeNull());
  expect(removePetMember).not.toHaveBeenCalled();
});

it('R11: confirmar quita e invalida la lista', async () => {
  const { queryClient } = await renderRemoving();
  const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
  await fireEvent.press(screen.getByTestId('member-remove-sheet-confirm'));
  await waitFor(() => expect(screen.queryByTestId('member-remove-sheet')).toBeNull());
  expect(removePetMember).toHaveBeenCalledWith('http://example.test/v1', 'token', 'pet-1', 'user-2');
  expect(invalidate).toHaveBeenCalledWith({ queryKey: ['pet-members', 'pet-1'] });
});

it('R11: rejected invalida y avisa', async () => {
  jest.mocked(removePetMember).mockResolvedValue({ kind: 'rejected' });
  const { queryClient } = await renderRemoving();
  const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
  await fireEvent.press(screen.getByTestId('member-remove-sheet-confirm'));
  await waitFor(() => expect(screen.getByTestId('pet-members-action-error')).toHaveTextContent('Algo salió mal'));
  expect(screen.queryByTestId('member-remove-sheet')).toBeNull();
  expect(invalidate).toHaveBeenCalledWith({ queryKey: ['pet-members', 'pet-1'] });
});

it('R11: unreachable deja el sheet abierto', async () => {
  jest.mocked(removePetMember).mockResolvedValue({ kind: 'unreachable', message: 'x' });
  await renderRemoving();
  await fireEvent.press(screen.getByTestId('member-remove-sheet-confirm'));
  await waitFor(() => expect(screen.getByTestId('pet-members-action-error')).toHaveTextContent('No se pudo conectar con el servidor'));
  expect(screen.getByTestId('member-remove-sheet')).toBeVisible();
});

it('R11: error deja el sheet abierto', async () => {
  jest.mocked(removePetMember).mockResolvedValue({ kind: 'error' });
  await renderRemoving();
  await fireEvent.press(screen.getByTestId('member-remove-sheet-confirm'));
  await waitFor(() => expect(screen.getByTestId('pet-members-action-error')).toHaveTextContent('Algo salió mal'));
  expect(screen.getByTestId('member-remove-sheet')).toBeVisible();
});

it('R11: unauthorized cierra sesión', async () => {
  jest.mocked(removePetMember).mockResolvedValue({ kind: 'unauthorized' });
  await renderRemoving();
  await fireEvent.press(screen.getByTestId('member-remove-sheet-confirm'));
  await waitFor(() => expect(screen.getByTestId('member-remove-sheet-confirm')).toBeEnabled());
  expect(mockSignOut).toHaveBeenCalledTimes(1);
});

it('R11: doble toque llama una sola vez', async () => {
  let finish!: (result: RemovePetMemberState) => void;
  jest.mocked(removePetMember).mockReturnValue(new Promise((resolve) => { finish = resolve; }));
  await renderRemoving();
  await fireEvent.press(screen.getByTestId('member-remove-sheet-confirm'));
  expect(screen.getByTestId('member-remove-sheet-confirm')).toBeDisabled();
  await fireEvent.press(screen.getByTestId('member-remove-sheet-confirm'));
  expect(removePetMember).toHaveBeenCalledTimes(1);
  await act(async () => finish({ kind: 'ok' }));
  await waitFor(() => expect(screen.queryByTestId('member-remove-sheet')).toBeNull());
});

async function renderInvites() {
  jest.mocked(listPetInvites).mockResolvedValue({ kind: 'ok', invites: [invite] });
  const app = await renderMembers();
  await waitFor(() => expect(screen.getByTestId('pet-invites-list')).toBeVisible());
  return app;
}

it('R12: lista las invitaciones con fecha de creación y vencimiento', async () => {
  await renderInvites();
  expect(screen.getByTestId('pet-invites-heading')).toHaveTextContent('Invitaciones pendientes');
  expect(screen.getByTestId('invite-row-inv-1-created')).toHaveTextContent('Invitación · creada el 6 oct');
  expect(screen.getByTestId('invite-row-inv-1-expires')).toHaveTextContent('Vence el 9 oct a las 14:00');
  const icon = screen.getByTestId('invite-row-inv-1-icon', { includeHiddenElements: true });
  expect(icon.props.className).toContain('rounded-10');
  expect(icon.props.className).toContain('bg-category-amber');
  expect(screen.getByLabelText('Revocar la invitación creada el 6 oct')).toBeVisible();
});

it('R12: sin invitaciones no hay sección', async () => {
  await renderMembers();
  await waitFor(() => expect(screen.queryByTestId('pet-members-loading')).toBeNull());
  expect(screen.queryByTestId('pet-invites-heading')).toBeNull();
  expect(screen.queryByTestId('pet-invites-list')).toBeNull();
});

it('R12: si la lista falla no hay sección', async () => {
  jest.mocked(listPetInvites).mockResolvedValue({ kind: 'error' });
  await renderMembers();
  await waitFor(() => expect(screen.queryByTestId('pet-members-loading')).toBeNull());
  expect(screen.queryByTestId('pet-invites-heading')).toBeNull();
  expect(screen.queryByTestId('pet-invites-list')).toBeNull();
});

it('R12: revocar llama a la API e invalida la lista', async () => {
  const { queryClient } = await renderInvites();
  const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
  await fireEvent.press(screen.getByTestId('invite-row-inv-1-revoke'));
  await waitFor(() => expect(screen.getByTestId('invite-row-inv-1-revoke')).toBeEnabled());
  expect(revokePetInvite).toHaveBeenCalledWith('http://example.test/v1', 'token', 'pet-1', 'inv-1');
  expect(invalidate).toHaveBeenCalledWith({ queryKey: ['pet-invites', 'pet-1'] });
});

it('R12: revocar not-found también invalida', async () => {
  jest.mocked(revokePetInvite).mockResolvedValue({ kind: 'not-found' });
  const { queryClient } = await renderInvites();
  const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
  await fireEvent.press(screen.getByTestId('invite-row-inv-1-revoke'));
  await waitFor(() => expect(screen.getByTestId('invite-row-inv-1-revoke')).toBeEnabled());
  expect(invalidate).toHaveBeenCalledWith({ queryKey: ['pet-invites', 'pet-1'] });
});

it('R12: revocar unreachable avisa', async () => {
  jest.mocked(revokePetInvite).mockResolvedValue({ kind: 'unreachable', message: 'x' });
  await renderInvites();
  await fireEvent.press(screen.getByTestId('invite-row-inv-1-revoke'));
  await waitFor(() => expect(screen.getByTestId('pet-members-action-error')).toHaveTextContent('No se pudo conectar con el servidor'));
});

it('R12: family no pide invitaciones', async () => {
  jest.mocked(getPet).mockResolvedValue({ kind: 'ok', pet: { ...pet, myRole: 'family' } });
  await renderMembers();
  await waitFor(() => expect(screen.getByTestId('pet-members-list')).toBeVisible());
  expect(listPetInvites).not.toHaveBeenCalled();
});

function familyView() {
  jest.mocked(getPet).mockResolvedValue({ kind: 'ok', pet: { ...pet, myRole: 'family' } });
  jest.mocked(getMe).mockResolvedValue({ kind: 'ok', me: { ...me, id: 'user-2', firstName: 'Luis', lastName: 'Ortega', email: 'luis@correo.com' } });
}

it('R16: family ve la nota del dueño y Salir de esta mascota', async () => {
  familyView();
  await renderMembers();
  await waitFor(() => expect(screen.getByTestId('pet-members-intro')).toHaveTextContent('Ves a Rocky y recibes sus avisos porque formas parte de su familia.'));
  expect(screen.getByTestId('pet-members-owner-note')).toHaveTextContent('Ana García administra a Rocky y es quien puede invitar o quitar personas.');
  expect(screen.getByTestId('pet-members-leave-hint')).toHaveTextContent('Si sales, dejarás de ver a Rocky y de recibir sus avisos.');
  expect(screen.getByTestId('pet-members-leave')).toHaveTextContent('Salir de esta mascota');
  const avatar = screen.getByTestId('pet-members-pet-avatar', { includeHiddenElements: true });
  expect(avatar).toHaveTextContent('R');
  expect(avatar.props.className).toContain('bg-category-amber');
});

it('R16: sin dueño en la lista no hay nota', async () => {
  familyView();
  jest.mocked(listPetMembers).mockResolvedValue({ kind: 'ok', members: [members[1]] });
  await renderMembers();
  await waitFor(() => expect(screen.getByTestId('pet-members-list')).toBeVisible());
  expect(screen.queryByTestId('pet-members-owner-note')).toBeNull();
});

it('R16: el dueño no ve Salir', async () => {
  await renderMembers();
  await waitFor(() => expect(screen.getByTestId('pet-members-list')).toBeVisible());
  expect(screen.queryByTestId('pet-members-pet-avatar', { includeHiddenElements: true })).toBeNull();
  expect(screen.queryByTestId('pet-members-owner-note')).toBeNull();
  expect(screen.queryByTestId('pet-members-leave-hint')).toBeNull();
  expect(screen.queryByTestId('pet-members-leave')).toBeNull();
});

async function renderLeaving(withOwner = true) {
  familyView();
  if (!withOwner) jest.mocked(listPetMembers).mockResolvedValue({ kind: 'ok', members: [members[1]] });
  const app = await renderMembers();
  await waitFor(() => expect(screen.getByTestId('pet-members-leave')).toBeVisible());
  await fireEvent.press(screen.getByTestId('pet-members-leave'));
  await waitFor(() => expect(screen.getByTestId('member-leave-sheet')).toBeVisible());
  return app;
}

it('R17: el sheet de salir nombra a la mascota y al dueño', async () => {
  await renderLeaving();
  expect(screen.getByTestId('member-leave-sheet-title')).toHaveTextContent('¿Salir de la familia de Rocky?');
  expect(screen.getByTestId('member-leave-sheet-body')).toHaveTextContent('Dejarás de ver a Rocky y de recibir sus avisos. Para volver, Ana García tendrá que invitarte otra vez.');
});

it('R17: sin dueño en la lista el cuerpo usa la variante sin nombre', async () => {
  await renderLeaving(false);
  expect(screen.getByTestId('member-leave-sheet-body')).toHaveTextContent('Dejarás de ver a Rocky y de recibir sus avisos. Para volver, necesitarás una invitación nueva.');
});

it('R17: Cancelar no llama a la API', async () => {
  await renderLeaving();
  await fireEvent.press(screen.getByTestId('member-leave-sheet-cancel'));
  await waitFor(() => expect(screen.queryByTestId('member-leave-sheet')).toBeNull());
  expect(removePetMember).not.toHaveBeenCalled();
});

it('R17: salir limpia la mascota, invalida la lista y vuelve a Inicio en orden', async () => {
  const { queryClient } = await renderLeaving();
  const order: unknown[] = [];
  const remove = queryClient.removeQueries.bind(queryClient);
  const invalidate = queryClient.invalidateQueries.bind(queryClient);
  jest.spyOn(queryClient, 'removeQueries').mockImplementation((filters) => {
    order.push(['removeQueries', filters?.queryKey]);
    remove(filters);
  });
  jest.spyOn(queryClient, 'invalidateQueries').mockImplementation(async (filters) => {
    order.push(['invalidateQueries', filters?.queryKey]);
    await invalidate(filters);
  });
  mockClearPet.mockImplementation(() => { order.push(['clearPet']); });
  jest.mocked(router.dismissTo).mockImplementation((href) => { order.push(['dismissTo', href]); });
  await fireEvent.press(screen.getByTestId('member-leave-sheet-confirm'));
  await waitFor(() => expect(screen.getByTestId('pet-members-list')).toBeVisible());
  expect(removePetMember).toHaveBeenCalledWith('http://example.test/v1', 'token', 'pet-1', 'user-2');
  expect(order).toEqual([
    ['removeQueries', ['pets', 'detail', 'pet-1']],
    ['removeQueries', ['pet-members', 'pet-1']],
    ['clearPet'],
    ['invalidateQueries', ['pets', 'list']],
    ['dismissTo', '/home'],
  ]);
});

it('R17: unreachable deja el sheet abierto', async () => {
  jest.mocked(removePetMember).mockResolvedValue({ kind: 'unreachable', message: 'x' });
  await renderLeaving();
  await fireEvent.press(screen.getByTestId('member-leave-sheet-confirm'));
  await waitFor(() => expect(screen.getByTestId('pet-members-action-error')).toHaveTextContent('No se pudo conectar con el servidor'));
  expect(screen.getByTestId('member-leave-sheet')).toBeVisible();
});

it('R17: rejected deja el sheet abierto', async () => {
  jest.mocked(removePetMember).mockResolvedValue({ kind: 'rejected' });
  await renderLeaving();
  await fireEvent.press(screen.getByTestId('member-leave-sheet-confirm'));
  await waitFor(() => expect(screen.getByTestId('pet-members-action-error')).toHaveTextContent('Algo salió mal'));
  expect(screen.getByTestId('member-leave-sheet')).toBeVisible();
});

it('R17: unauthorized cierra sesión', async () => {
  jest.mocked(removePetMember).mockResolvedValue({ kind: 'unauthorized' });
  await renderLeaving();
  await fireEvent.press(screen.getByTestId('member-leave-sheet-confirm'));
  await waitFor(() => expect(screen.getByTestId('member-leave-sheet-confirm')).toBeEnabled());
  expect(mockSignOut).toHaveBeenCalledTimes(1);
  expect(screen.queryByTestId('pet-members-action-error')).toBeNull();
});

async function renderInviteCta() {
  const app = await renderMembers();
  await waitFor(() => expect(screen.getByTestId('pet-members-list')).toBeVisible());
  return app;
}

it('R13: ok invalida invitaciones y abre invite con sus parámetros', async () => {
  jest.mocked(createPetInvite).mockResolvedValue({ kind: 'ok', invite: createdInvite });
  const { queryClient } = await renderInviteCta();
  const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
  await fireEvent.press(screen.getByTestId('pet-members-invite-cta'));
  await waitFor(() => expect(screen.getByTestId('pet-members-invite-cta')).toBeEnabled());
  expect(createPetInvite).toHaveBeenCalledWith('http://example.test/v1', 'token', 'pet-1');
  expect(invalidate).toHaveBeenCalledWith({ queryKey: ['pet-invites', 'pet-1'] });
  expect(router.push).toHaveBeenCalledWith({ pathname: '/pets/[petId]/invite', params: { petId: 'pet-1', petName: 'Rocky', inviterName: 'Ana', code: 'K7P4Q2M9XA', expiresAt: invite.expiresAt } });
});

it('R13: invites-limit avisa del máximo de invitaciones', async () => {
  jest.mocked(createPetInvite).mockResolvedValue({ kind: 'invites-limit' });
  await renderInviteCta();
  await fireEvent.press(screen.getByTestId('pet-members-invite-cta'));
  await waitFor(() => expect(screen.getByTestId('pet-members-action-error')).toHaveTextContent('Ya hay 5 invitaciones pendientes. Revoca una para crear otra.'));
});

it('R13: members-limit avisa del máximo de personas', async () => {
  jest.mocked(createPetInvite).mockResolvedValue({ kind: 'members-limit' });
  await renderInviteCta();
  await fireEvent.press(screen.getByTestId('pet-members-invite-cta'));
  await waitFor(() => expect(screen.getByTestId('pet-members-action-error')).toHaveTextContent('Rocky ya tiene el máximo de personas. Quita a alguien o revoca una invitación para invitar de nuevo.'));
});

it('R13: unreachable avisa', async () => {
  jest.mocked(createPetInvite).mockResolvedValue({ kind: 'unreachable', message: 'x' });
  await renderInviteCta();
  await fireEvent.press(screen.getByTestId('pet-members-invite-cta'));
  await waitFor(() => expect(screen.getByTestId('pet-members-action-error')).toHaveTextContent('No se pudo conectar con el servidor'));
});

it('R13: error avisa', async () => {
  await renderInviteCta();
  await fireEvent.press(screen.getByTestId('pet-members-invite-cta'));
  await waitFor(() => expect(screen.getByTestId('pet-members-action-error')).toHaveTextContent('Algo salió mal'));
});

it('R13: unauthorized cierra sesión', async () => {
  jest.mocked(createPetInvite).mockResolvedValue({ kind: 'unauthorized' });
  await renderInviteCta();
  await fireEvent.press(screen.getByTestId('pet-members-invite-cta'));
  await waitFor(() => expect(screen.getByTestId('pet-members-invite-cta')).toBeEnabled());
  expect(mockSignOut).toHaveBeenCalledTimes(1);
});

it('R13: doble toque crea una sola invitación', async () => {
  let finish!: (result: CreatePetInviteState) => void;
  jest.mocked(createPetInvite).mockReturnValue(new Promise((resolve) => { finish = resolve; }));
  await renderInviteCta();
  await fireEvent.press(screen.getByTestId('pet-members-invite-cta'));
  expect(screen.getByTestId('pet-members-invite-cta')).toBeDisabled();
  await fireEvent.press(screen.getByTestId('pet-members-invite-cta'));
  expect(createPetInvite).toHaveBeenCalledTimes(1);
  await act(async () => finish({ kind: 'ok', invite: createdInvite }));
  await waitFor(() => expect(screen.getByTestId('pet-members-invite-cta')).toBeEnabled());
});

it('R13: el dueño ve la nota del código', async () => {
  await renderInviteCta();
  const text = within(screen.getByTestId('pet-members-code-note')).getByText('Cada código sirve una sola vez. Si nadie lo usa, vence solo.');
  expect(text).toHaveTextContent('Cada código sirve una sola vez. Si nadie lo usa, vence solo.', { exact: true });
  expect(text.props.className).toMatch(/(^| )flex-1( |$)/);
});

it.each([
  ['member-row-user-2-remove'],
  ['member-remove-sheet-confirm'],
  ['invite-row-inv-1-revoke'],
  ['pet-members-invite-cta'],
  ['pet-members-leave'],
] as const)('R13: pulsar %s borra el aviso anterior', async (target) => {
  if (target === 'pet-members-leave') {
    jest.mocked(removePetMember).mockResolvedValue({ kind: 'unreachable', message: 'x' });
    await renderLeaving();
    await fireEvent.press(screen.getByTestId('member-leave-sheet-confirm'));
    await waitFor(() => expect(screen.getByTestId('pet-members-action-error')).toBeVisible());
    await fireEvent.press(screen.getByTestId('member-leave-sheet-cancel'));
    await waitFor(() => expect(screen.queryByTestId('member-leave-sheet')).toBeNull());
  } else {
    jest.mocked(createPetInvite).mockResolvedValue({ kind: 'unreachable', message: 'x' });
    await renderInvites();
    if (target === 'member-remove-sheet-confirm') {
      await fireEvent.press(screen.getByTestId('member-row-user-2-remove'));
      await waitFor(() => expect(screen.getByTestId('member-remove-sheet')).toBeVisible());
    }
    await fireEvent.press(screen.getByTestId('pet-members-invite-cta'));
    await waitFor(() => expect(screen.getByTestId('pet-members-action-error')).toBeVisible());
  }
  if (target === 'member-remove-sheet-confirm') jest.mocked(removePetMember).mockReturnValue(new Promise(() => undefined));
  if (target === 'invite-row-inv-1-revoke') jest.mocked(revokePetInvite).mockReturnValue(new Promise(() => undefined));
  if (target === 'pet-members-invite-cta') jest.mocked(createPetInvite).mockReturnValue(new Promise(() => undefined));
  expect(screen.getByTestId('pet-members-action-error')).toBeVisible();
  await fireEvent.press(screen.getByTestId(target));
  expect(screen.queryByTestId('pet-members-action-error')).toBeNull();
});
