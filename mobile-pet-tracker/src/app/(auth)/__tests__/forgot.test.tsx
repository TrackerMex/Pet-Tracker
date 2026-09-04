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

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
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

describe('#61 R8: forgot tiene contenedor de scroll con safe areas', () => {
  it('conserva el centrado de hoy dentro de un ScrollView con insets', async () => {
    await render(<Forgot />, { wrapper: HeroUINativeProvider });

    const screenRoot = screen.getByTestId('screen-forgot');

    expect(screenRoot.props.contentContainerStyle).toEqual({
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      gap: 16,
      paddingTop: 52,
      paddingBottom: 48,
    });
    expect(screenRoot.props.keyboardShouldPersistTaps).toBe('handled');
    expect(screenRoot.props.contentInsetAdjustmentBehavior).toBe('automatic');
  });
});
