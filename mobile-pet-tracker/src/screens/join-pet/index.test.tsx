import { readFileSync } from 'fs';
import { join } from 'path';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';

import { acceptInvite, type AcceptInviteState } from '../../api/pet-members';
import { LanguageProvider } from '../../providers/language-provider';
import { renderWithProviders } from '../../../test/render-with-providers';
import JoinPetScreen from './index';

const mockSignOut = jest.fn().mockResolvedValue(undefined);
const originalApiUrl = process.env.EXPO_PUBLIC_API_URL;

jest.mock('../../api/pet-members', () => ({ acceptInvite: jest.fn() }));
jest.mock('../../providers/auth-provider', () => ({
  useAuth: () => ({ token: 'token', signOut: mockSignOut }),
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
