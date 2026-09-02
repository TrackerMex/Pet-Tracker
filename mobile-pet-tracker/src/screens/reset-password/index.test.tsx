import { fireEvent, render, screen } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';

import ResetPasswordRoute from '../../app/reset-password';

const mockRouterPush = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock('../../api/auth', () => ({
  resetPassword: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    push: mockRouterPush,
  },
  useLocalSearchParams: mockUseLocalSearchParams,
}));

async function renderRoute(token?: string) {
  mockUseLocalSearchParams.mockReturnValue({ token });
  await render(<ResetPasswordRoute />, { wrapper: HeroUINativeProvider });
}

describe('R5: la ruta /reset-password recibe el token del deep link', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el formulario cuando recibe un token', async () => {
    await renderRoute('reset-token-r5');

    expect(screen.getByTestId('reset-password')).toBeVisible();
    expect(screen.getByTestId('reset-password-confirm')).toBeVisible();
    expect(screen.getByTestId('reset-submit')).toBeVisible();
    expect(screen.queryByTestId('reset-missing-token')).toBeNull();
  });

  it.each([undefined, '', '   '])(
    'muestra el estado seguro para token %p y permite volver al login',
    async (token) => {
      await renderRoute(token);

      expect(screen.getByTestId('reset-missing-token')).toHaveTextContent(
        'This reset link is incomplete. Open the link from your email again.',
      );
      expect(screen.queryByTestId('reset-password')).toBeNull();

      await fireEvent.press(screen.getByTestId('link-login'));
      expect(mockRouterPush).toHaveBeenCalledWith('/login');
    },
  );
});
