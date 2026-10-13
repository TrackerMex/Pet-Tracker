import { render, screen } from '@testing-library/react-native';

import { FormError } from '../form-error';

jest.mock('reicon-react-native', () => {
  const actual = jest.requireActual<typeof import('reicon-react-native')>('reicon-react-native');
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    ...actual,
    AlertCircle: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'icon-alert-circle', ...props }),
  };
});

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens.map((token) => `color:${token}`),
}));

describe('#172 R9: FormError', () => {
  it('#172 R9: la fila lleva el icono y después el texto', async () => {
    await render(<FormError testID="err" message="Algo falló" />);
    const row = screen.getByTestId('err-row');
    expect(row.props.className).toBe('w-full flex-row items-center gap-1.5');
    expect(row.children).toEqual([
      screen.getByTestId('icon-alert-circle'), screen.getByTestId('err'),
    ]);
  });

  it('#172 R9: el icono mide 14 y usa danger', async () => {
    await render(<FormError testID="err" message="Algo falló" />);
    const icon = screen.getByTestId('icon-alert-circle');
    expect(icon.props.size).toBe(14);
    expect(icon.props.color).toBe('color:danger');
  });

  it('#172 R9: el texto pesa 13/600 en danger, es seleccionable y dice el mensaje', async () => {
    await render(<FormError testID="err" message="Algo falló" />);
    const text = screen.getByTestId('err');
    expect(text.props.className).toBe('flex-1 text-13 font-semibold text-danger');
    expect(text.props.selectable).toBe(true);
    expect(text).toHaveTextContent('Algo falló');
  });
});
