import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { router } from 'expo-router';

import { LanguageProvider } from '../../providers/language-provider';
import { BackButton } from '../back-button';

jest.mock('expo-router', () => ({
  router: { back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn() },
}));

jest.mock('reicon-react-native', () => {
  const actual = jest.requireActual<typeof import('reicon-react-native')>('reicon-react-native');
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    ...actual,
    ChevronLeft: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'icon-chevron-left', ...props }),
  };
});

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens.map((token) => `color:${token}`),
}));

const mockRouter = jest.mocked(router);

async function renderBack(initial: 'es' | 'en' = 'es') {
  await render(
    <LanguageProvider initial={initial}>
      <BackButton testID="back" fallback="/welcome" />
    </LanguageProvider>,
  );
}

describe('#172 R2: BackButton', () => {
  beforeEach(() => jest.clearAllMocks());

  it('#172 R2: es un botón de 44 con nombre accesible «Volver»', async () => {
    await renderBack();
    const back = screen.getByRole('button', { name: 'Volver' });
    expect(back.props.className).toBe('size-11 items-center justify-center rounded-full');
    expect(back.children).toHaveLength(1);
  });

  it('#172 R2: en inglés se llama «Back»', async () => {
    await renderBack('en');
    expect(screen.getByRole('button', { name: 'Back' })).toBeOnTheScreen();
  });

  it('#172 R2: pinta ChevronLeft de 24 en foreground', async () => {
    await renderBack();
    const back = screen.getByTestId('back');
    const icon = within(back).getByTestId('icon-chevron-left');
    expect(back.children).toEqual([icon]);
    expect(icon.props.size).toBe(24);
    expect(icon.props.color).toBe('color:foreground');
  });

  it('#172 R2: con historial vuelve atrás y no reemplaza', async () => {
    mockRouter.canGoBack.mockReturnValue(true);
    await renderBack();
    await fireEvent.press(screen.getByTestId('back'));
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('#172 R2: sin historial reemplaza por el fallback', async () => {
    mockRouter.canGoBack.mockReturnValue(false);
    await renderBack();
    await fireEvent.press(screen.getByTestId('back'));
    expect(mockRouter.replace).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).toHaveBeenCalledWith('/welcome');
    expect(mockRouter.back).not.toHaveBeenCalled();
  });

  it('#172 R2: suelto pinta opacidad 1 y pulsado 0,8', async () => {
    await renderBack();
    const back = screen.getByTestId('back');
    expect(back.props.style).toEqual({ opacity: 1 });
    await fireEvent(back, 'responderGrant', { nativeEvent: {}, persist: () => undefined });
    expect(back.props.style).toEqual({ opacity: 0.8 });
  });
});
