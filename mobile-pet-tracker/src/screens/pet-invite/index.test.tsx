import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';
import { HeroUINativeProvider } from 'heroui-native';
import { Share } from 'react-native';

import { LanguageProvider } from '../../providers/language-provider';
import PetInviteScreen from './index';

const expiresAt = new Date(2026, 9, 9, 14, 0).toISOString();
const params = { petId: 'pet-1', petName: 'Rocky', inviterName: 'Ana', code: 'K7P4Q2M9XA', expiresAt };
let mockParams: Partial<typeof params> = params;

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockParams,
  router: { back: jest.fn(), canGoBack: () => true, replace: jest.fn() },
}));
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));
jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens.map((token) => `color:${token}`),
}));

async function renderInvite(language: 'es' | 'en' = 'es') {
  return render(<HeroUINativeProvider><LanguageProvider initial={language}><PetInviteScreen /></LanguageProvider></HeroUINativeProvider>);
}

beforeEach(() => {
  mockParams = params;
  jest.mocked(Clipboard.setStringAsync).mockResolvedValue(true);
  jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction });
});

afterEach(() => { jest.restoreAllMocks(); });

it('R14: muestra el código partido, el vencimiento y el mensaje literal', async () => {
  await renderInvite();
  expect(screen.getByTestId('pet-invite-header-title')).toHaveTextContent('Invitar a cuidar a Rocky');
  expect(screen.getByTestId('pet-invite-intro')).toHaveTextContent('Comparte este código con quien quieras que vea a Rocky y reciba sus avisos.');
  expect(screen.getByTestId('pet-invite-code')).toHaveTextContent('K7P4Q-2M9XA');
  expect(screen.getByTestId('pet-invite-code-label')).toHaveTextContent('Código de invitación');
  expect(screen.getByTestId('pet-invite-expires')).toHaveTextContent('Vence el 9 oct a las 14:00 · sirve una sola vez');
  expect(screen.getByTestId('pet-invite-message-label')).toHaveTextContent('Mensaje que se enviará');
  expect(screen.getByTestId('pet-invite-message')).toHaveTextContent('Ana te invita a cuidar a Rocky en Pet Tracker. Abre la app, toca «Unirme con código» y escribe K7P4Q-2M9XA. Vence el 9 oct a las 14:00.');
  expect(screen.getByTestId('pet-invite-role-note')).toHaveTextContent('Quien lo use podrá ver a Rocky, pero solo tú podrás invitar o quitar personas.');
});

it('R14: en inglés el mensaje usa Join with a code', async () => {
  await renderInvite('en');
  expect(screen.getByTestId('pet-invite-message')).toHaveTextContent('Ana invited you to care for Rocky on Pet Tracker. Open the app, tap "Join with a code" and enter K7P4Q-2M9XA. It expires Oct 9 at 14:00.');
});

it('R14: sin código no ofrece compartir', async () => {
  mockParams = { ...params, code: undefined };
  await renderInvite();
  expect(screen.queryByTestId('pet-invite-share')).toBeNull();
  expect(screen.queryByTestId('pet-invite-copy')).toBeNull();
});

it('R15: Compartir abre la hoja nativa con el mensaje', async () => {
  await renderInvite();
  await fireEvent.press(screen.getByTestId('pet-invite-share'));
  expect(Share.share).toHaveBeenCalledTimes(1);
  expect(Share.share).toHaveBeenCalledWith({ message: 'Ana te invita a cuidar a Rocky en Pet Tracker. Abre la app, toca «Unirme con código» y escribe K7P4Q-2M9XA. Vence el 9 oct a las 14:00.' });
});

it('R15: un Share rechazado no rompe la pantalla', async () => {
  jest.mocked(Share.share).mockRejectedValue(new Error('x'));
  await renderInvite();
  await fireEvent.press(screen.getByTestId('pet-invite-share'));
  await act(async () => undefined);
  expect(screen.getByTestId('pet-invite-header-title')).toHaveTextContent('Invitar a cuidar a Rocky');
  expect(screen.getByTestId('pet-invite-code')).toHaveTextContent('K7P4Q-2M9XA');
});

it('R15: Copiar código copia el código con guion y confirma', async () => {
  let finish!: (value: boolean) => void;
  jest.mocked(Clipboard.setStringAsync).mockReturnValue(new Promise((resolve) => { finish = resolve; }));
  await renderInvite();
  await fireEvent.press(screen.getByTestId('pet-invite-copy'));
  expect(Clipboard.setStringAsync).toHaveBeenCalledWith('K7P4Q-2M9XA');
  expect(screen.getByTestId('pet-invite-copy-label')).toHaveTextContent('Copiar código');
  await act(async () => finish(true));
  await waitFor(() => expect(screen.getByTestId('pet-invite-copy-label')).toHaveTextContent('Código copiado'));
});

it('R15: si copiar falla la etiqueta no cambia', async () => {
  jest.mocked(Clipboard.setStringAsync).mockRejectedValue(new Error('x'));
  await renderInvite();
  await fireEvent.press(screen.getByTestId('pet-invite-copy'));
  await act(async () => undefined);
  expect(screen.getByTestId('pet-invite-copy-label')).toHaveTextContent('Copiar código');
});
