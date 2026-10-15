import { fireEvent, render, screen } from '@testing-library/react-native';
import { HeroUINativeProvider, TextField } from 'heroui-native';

import { LanguageProvider } from '../../providers/language-provider';
import { PasswordInput } from '../password-input';

jest.mock('reicon-react-native', () => {
  const actual = jest.requireActual<typeof import('reicon-react-native')>('reicon-react-native');
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const mockIcon = (testID: string) =>
    function MockIcon(props: Record<string, unknown>) {
      return React.createElement(View, { testID, ...props });
    };
  return { ...actual, Eye: mockIcon('icon-eye'), EyeOff: mockIcon('icon-eye-off') };
});

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens.map((token) => `color:${token}`),
}));

async function renderPassword(initial: 'es' | 'en' = 'es') {
  await render(
    <HeroUINativeProvider>
      <LanguageProvider initial={initial}>
        <TextField><PasswordInput testID="pw" value="" onChangeText={jest.fn()} /></TextField>
      </LanguageProvider>
    </HeroUINativeProvider>,
  );
}

describe('#172 R8: PasswordInput', () => {
  it('#172 R8: arranca oculta con «Mostrar contraseña» y el ojo', async () => {
    await renderPassword();
    expect(screen.getByTestId('pw').props.secureTextEntry).toBe(true);
    const toggle = screen.getByRole('button', { name: 'Mostrar contraseña' });
    expect(toggle).toBe(screen.getByTestId('pw-toggle'));
    expect(toggle.children).toHaveLength(1);
    expect(toggle.children[0]).toHaveProperty('props.testID', 'icon-eye');
    expect(toggle.children[0]).toHaveProperty('props.size', 20);
    expect(toggle.children[0]).toHaveProperty('props.color', 'color:muted');
  });

  it('#172 R8: el ojo alterna mostrar y ocultar', async () => {
    await renderPassword();
    await fireEvent.press(screen.getByTestId('pw-toggle'));
    expect(screen.getByTestId('pw').props.secureTextEntry).toBe(false);
    const toggle = screen.getByRole('button', { name: 'Ocultar contraseña' });
    expect(toggle.children).toHaveLength(1);
    expect(toggle.children[0]).toHaveProperty('props.testID', 'icon-eye-off');
    expect(toggle.children[0]).toHaveProperty('props.size', 20);
    expect(toggle.children[0]).toHaveProperty('props.color', 'color:muted');
    await fireEvent.press(toggle);
    expect(screen.getByTestId('pw').props.secureTextEntry).toBe(true);
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' }).children[0])
      .toHaveProperty('props.testID', 'icon-eye');
  });

  it('#172 R8: en inglés dice «Show password» y «Hide password»', async () => {
    await renderPassword('en');
    const toggle = screen.getByRole('button', { name: 'Show password' });
    await fireEvent.press(toggle);
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeOnTheScreen();
  });

  it('#172 R8: el grupo envuelve el campo de 52 y el botón de 44', async () => {
    await renderPassword();
    const group = screen.getByTestId('pw-group');
    const input = screen.getByTestId('pw');
    const toggle = screen.getByTestId('pw-toggle');
    expect(group).toContainElement(input);
    expect(group).toContainElement(toggle);
    for (const token of ['h-13', 'rounded-xl', 'bg-default']) {
      expect(input.props.className.split(' ')).toContain(token);
    }
    expect(toggle.props.className).toBe('size-11 items-center justify-center');
  });
});
