import { readFileSync } from 'fs';
import { join } from 'path';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import { router } from 'expo-router';
import type { ReactNode } from 'react';

import { acceptInvite, type AcceptInviteState } from '../../api/pet-members';
import { LanguageProvider } from '../../providers/language-provider';
import { renderWithProviders } from '../../../test/render-with-providers';
import JoinPetScreen from './index';

const mockSignOut = jest.fn().mockResolvedValue(undefined);
const mockSelectPet = jest.fn();
const originalApiUrl = process.env.EXPO_PUBLIC_API_URL;

jest.mock('../../api/pet-members', () => ({ acceptInvite: jest.fn() }));
jest.mock('../../providers/auth-provider', () => ({
  useAuth: () => ({ token: 'token', signOut: mockSignOut }),
}));
jest.mock('../../providers/selected-pet-provider', () => ({
  useSelectedPet: () => ({ selectPet: mockSelectPet }),
}));
jest.mock('expo-router', () => ({
  router: { back: jest.fn(), canGoBack: () => true, dismissTo: jest.fn(), replace: jest.fn() },
}));
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));
jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens.map((token) => `color:${token}`),
}));

function Wrapper({ children }: { children: ReactNode }) {
  return <HeroUINativeProvider><LanguageProvider initial="es">{children}</LanguageProvider></HeroUINativeProvider>;
}

async function renderJoin() {
  return renderWithProviders(<JoinPetScreen />, { wrapper: Wrapper });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockSelectPet.mockReset();
  jest.mocked(router.dismissTo).mockReset();
  process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1';
  jest.mocked(acceptInvite).mockResolvedValue({ kind: 'error' });
});

afterAll(() => {
  if (originalApiUrl === undefined) delete process.env.EXPO_PUBLIC_API_URL;
  else process.env.EXPO_PUBLIC_API_URL = originalApiUrl;
});

it('R18: el formulario admite 11 caracteres con el placeholder del artboard', async () => {
  await renderJoin();
  const input = screen.getByTestId('join-pet-input');
  expect(input.props).toMatchObject({ placeholder: 'XXXXX-XXXXX', placeholderTextColor: 'color:muted', maxLength: 11, autoCapitalize: 'characters', autoCorrect: false, autoComplete: 'off' });
  expect(input.props.className).toContain('border-accent');
  const source = readFileSync(join(process.cwd(), 'src/screens/join-pet/index.tsx'), 'utf8');
  expect(source).toContain('<KeyboardAvoidingView testID="screen-join-pet" behavior="padding"');
  expect(screen.getByTestId('join-pet-title')).toHaveTextContent('Unirme con código');
  expect(screen.getByTestId('join-pet-label')).toHaveTextContent('Código de invitación');
  expect(screen.getByTestId('join-pet-hint')).toHaveTextContent('Son 10 letras y números');
  expect(screen.getByTestId('join-pet-hero', { includeHiddenElements: true })).toBeOnTheScreen();
  expect(screen.getByTestId('join-pet-ring', { includeHiddenElements: true })).toBeOnTheScreen();
});

it('R18: Unirme está deshabilitado sin texto', async () => {
  await renderJoin();
  expect(screen.getByTestId('join-pet-submit')).toBeDisabled();
  await fireEvent.changeText(screen.getByTestId('join-pet-input'), '   ');
  expect(screen.getByTestId('join-pet-submit')).toBeDisabled();
});

it('R18: envía el código recortado una sola vez', async () => {
  let finish!: (result: AcceptInviteState) => void;
  jest.mocked(acceptInvite).mockReturnValue(new Promise((resolve) => { finish = resolve; }));
  await renderJoin();
  await fireEvent.changeText(screen.getByTestId('join-pet-input'), ' aB-12 ');
  await fireEvent.press(screen.getByTestId('join-pet-submit'));
  expect(screen.getByTestId('join-pet-submit')).toBeDisabled();
  await fireEvent.press(screen.getByTestId('join-pet-submit'));
  expect(acceptInvite).toHaveBeenCalledTimes(1);
  expect(acceptInvite).toHaveBeenCalledWith('http://example.test/v1', 'token', 'aB-12');
  await act(async () => finish({ kind: 'error' }));
  await waitFor(() => expect(screen.getByTestId('join-pet-submit')).toBeEnabled());
});

async function attempt(result: AcceptInviteState) {
  jest.mocked(acceptInvite).mockResolvedValue(result);
  const app = await renderJoin();
  await fireEvent.changeText(screen.getByTestId('join-pet-input'), 'K7P4Q-2M9XA');
  await fireEvent.press(screen.getByTestId('join-pet-submit'));
  return app;
}

it('R19: not-acceptable dice Este código no funciona y marca el borde', async () => {
  await attempt({ kind: 'not-acceptable' });
  await waitFor(() => expect(screen.getByTestId('join-pet-error')).toHaveTextContent('Este código no funciona. Puede que haya vencido o que ya se haya usado. Pide uno nuevo a quien te invitó.'));
  expect(screen.getByTestId('join-pet-error').props.accessibilityRole).toBe('alert');
  expect(screen.getByTestId('join-pet-input').props.className).toContain('border-danger');
});

it('R19: rate-limited dice Demasiados intentos', async () => {
  await attempt({ kind: 'rate-limited' });
  await waitFor(() => expect(screen.getByTestId('join-pet-error')).toHaveTextContent('Demasiados intentos. Inténtalo más tarde.'));
});

it('R19: unreachable dice No se pudo conectar con el servidor', async () => {
  await attempt({ kind: 'unreachable', message: 'x' });
  await waitFor(() => expect(screen.getByTestId('join-pet-error')).toHaveTextContent('No se pudo conectar con el servidor'));
});

it('R19: error dice Algo salió mal', async () => {
  await attempt({ kind: 'error' });
  await waitFor(() => expect(screen.getByTestId('join-pet-error')).toHaveTextContent('Algo salió mal'));
});

it('R19: missing-config dice Algo salió mal', async () => {
  await attempt({ kind: 'missing-config' });
  await waitFor(() => expect(screen.getByTestId('join-pet-error')).toHaveTextContent('Algo salió mal'));
});

it('R19: unauthorized cierra sesión sin aviso', async () => {
  await attempt({ kind: 'unauthorized' });
  await waitFor(() => expect(screen.getByTestId('join-pet-submit')).toBeEnabled());
  expect(mockSignOut).toHaveBeenCalledTimes(1);
  expect(screen.queryByTestId('join-pet-error')).toBeNull();
});

it('R19: editar borra el error', async () => {
  await attempt({ kind: 'not-acceptable' });
  await waitFor(() => expect(screen.getByTestId('join-pet-error')).toBeVisible());
  await fireEvent.changeText(screen.getByTestId('join-pet-input'), 'OTRO');
  expect(screen.queryByTestId('join-pet-error')).toBeNull();
  expect(screen.getByTestId('join-pet-input').props.className).toContain('border-accent');
});

it('R20: ya miembro sustituye la nota y el botón por Ir a Inicio', async () => {
  await attempt({ kind: 'already-member' });
  await waitFor(() => expect(screen.getByTestId('join-pet-already-member')).toHaveTextContent('Ya formas parte de la familia de esta mascota. La encontrarás en Inicio.'));
  expect(screen.getByTestId('join-pet-input').props.className).toContain('border-transparent');
  expect(screen.queryByTestId('join-pet-note')).toBeNull();
  expect(screen.queryByTestId('join-pet-hint')).toBeNull();
  expect(screen.queryByTestId('join-pet-submit')).toBeNull();
  expect(screen.getByTestId('join-pet-go-home')).toHaveTextContent('Ir a Inicio');
});

it('R20: Ir a Inicio vuelve a Inicio', async () => {
  await attempt({ kind: 'already-member' });
  await waitFor(() => expect(screen.getByTestId('join-pet-go-home')).toBeVisible());
  await fireEvent.press(screen.getByTestId('join-pet-go-home'));
  expect(router.dismissTo).toHaveBeenCalledWith('/home');
  expect(router.replace).not.toHaveBeenCalled();
});

it('R20: editar vuelve al formulario', async () => {
  await attempt({ kind: 'already-member' });
  await waitFor(() => expect(screen.getByTestId('join-pet-input')).toHaveProp('value', 'K7P4Q-2M9XA'));
  await fireEvent.changeText(screen.getByTestId('join-pet-input'), 'OTRO');
  expect(screen.queryByTestId('join-pet-already-member')).toBeNull();
  expect(screen.queryByTestId('join-pet-go-home')).toBeNull();
  expect(screen.getByTestId('join-pet-note')).toBeVisible();
  expect(screen.getByTestId('join-pet-hint')).toBeVisible();
  expect(screen.getByTestId('join-pet-submit')).toBeEnabled();
  expect(screen.getByTestId('join-pet-input').props.className).toContain('border-accent');
});

it('R21: aceptar invalida las mascotas, selecciona la nueva y vuelve a Inicio en orden', async () => {
  jest.mocked(acceptInvite).mockResolvedValue({ kind: 'ok', petId: 'pet-2' });
  const { queryClient } = await renderJoin();
  const order: unknown[][] = [];
  const invalidate = queryClient.invalidateQueries.bind(queryClient);
  jest.spyOn(queryClient, 'invalidateQueries').mockImplementation(async (filters) => {
    order.push(['invalidateQueries', filters?.queryKey]);
    await invalidate(filters);
  });
  mockSelectPet.mockImplementation((petId) => { order.push(['selectPet', petId]); });
  jest.mocked(router.dismissTo).mockImplementation((href) => { order.push(['dismissTo', href]); });
  await fireEvent.changeText(screen.getByTestId('join-pet-input'), 'K7P4Q-2M9XA');
  await fireEvent.press(screen.getByTestId('join-pet-submit'));
  await waitFor(() => expect(screen.getByTestId('join-pet-submit')).toBeEnabled());
  expect(order).toEqual([
    ['invalidateQueries', ['pets', 'list']],
    ['selectPet', 'pet-2'],
    ['dismissTo', '/home'],
  ]);
});

it('R21: no selecciona hasta que la invalidación termina', async () => {
  jest.mocked(acceptInvite).mockResolvedValue({ kind: 'ok', petId: 'pet-2' });
  const { queryClient } = await renderJoin();
  let finish!: () => void;
  jest.spyOn(queryClient, 'invalidateQueries').mockReturnValue(new Promise((resolve) => { finish = resolve; }));
  await fireEvent.changeText(screen.getByTestId('join-pet-input'), 'K7P4Q-2M9XA');
  await fireEvent.press(screen.getByTestId('join-pet-submit'));
  await act(async () => undefined);
  expect(mockSelectPet).not.toHaveBeenCalled();
  await act(async () => finish());
  await waitFor(() => expect(screen.getByTestId('join-pet-submit')).toBeEnabled());
});
