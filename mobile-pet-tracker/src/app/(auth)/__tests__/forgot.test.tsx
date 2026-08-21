import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';

import { login, register } from '../../../api/auth';
import Forgot from '../forgot';

jest.mock('../../../api/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

const mockLogin = jest.mocked(login);
const mockRegister = jest.mocked(register);
const mockRouter = jest.mocked(router);

describe('R9: forgot es un stub deshabilitado', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders disabled controls and never calls auth APIs', async () => {
    await render(<Forgot />, { wrapper: HeroUINativeProvider });

    expect(screen.getByText('Password recovery coming soon')).toBeVisible();
    expect(screen.getByTestId('forgot-email')).toHaveProp('editable', false);
    expect(screen.getByTestId('forgot-submit')).toBeDisabled();

    await fireEvent.press(screen.getByTestId('forgot-submit'));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('links back to login without a network request', async () => {
    await render(<Forgot />, { wrapper: HeroUINativeProvider });

    await fireEvent.press(screen.getByTestId('link-login'));

    expect(mockRouter.push).toHaveBeenCalledWith('/login');
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockRegister).not.toHaveBeenCalled();
  });
});
