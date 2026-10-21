import { readFileSync } from 'fs';
import { render, screen, within } from '@testing-library/react-native';
import { HeroUINativeProvider, TextField } from 'heroui-native';
import { TextInput, View } from 'react-native';

import { LanguageProvider } from '../../providers/language-provider';
import type { RuleIssue } from '../../utils/account-rules';

const { FieldErrorMessage } = jest.requireActual<{
  FieldErrorMessage: (props: { testID: string; issue?: RuleIssue | null }) => React.JSX.Element;
}>('../field-error-message');

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

function tree(issue?: RuleIssue | null, language: 'en' | 'es' = 'es') {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial={language}>
        <FieldErrorMessage testID="f" issue={issue} />
      </LanguageProvider>
    </HeroUINativeProvider>
  );
}

function expectAbsent() {
  expect(screen.queryByTestId('f-error')).toBeNull();
  expect(screen.queryByTestId('f-message')).toBeNull();
  expect(screen.queryByTestId('f-message-row')).toBeNull();
}

describe('#186 R3: FieldErrorMessage', () => {
  it.each([null, undefined])('#186 R3: no pinta nodos con issue %s', async (issue) => {
    await render(tree(issue));
    expectAbsent();
  });

  it('#186 R3: traduce al español y conserva fila, icono y testIDs', async () => {
    await render(tree({ labelKey: 'validation.required' }));
    expect(screen.queryByTestId('f-message')).toHaveTextContent('Este campo es obligatorio');
    expect(screen.queryByTestId('f-error')).not.toBeNull();
    const row = screen.queryByTestId('f-message-row');
    expect(row).not.toBeNull();
    expect(within(row!).queryByTestId('icon-alert-circle')).not.toBeNull();
  });

  it('#186 R3: interpola los parámetros', async () => {
    await render(tree({ labelKey: 'validation.tooShort', params: { min: 7 } }));
    expect(screen.queryByTestId('f-message')).toHaveTextContent('Usa al menos 7 caracteres');
  });

  it('#186 R3: traduce al inglés', async () => {
    await render(tree({ labelKey: 'validation.required' }, 'en'));
    expect(screen.queryByTestId('f-message')).toHaveTextContent('This field is required');
  });

  it.each([true, false])('#186 R3: pinta dentro de TextField=%s y fuera junto a un TextInput', async (inside) => {
    const message = <FieldErrorMessage testID="f" issue={{ labelKey: 'validation.required' }} />;
    await render(
      <HeroUINativeProvider>
        <LanguageProvider initial="es">
          {inside ? <TextField isInvalid>{message}</TextField> : <View><TextInput />{message}</View>}
        </LanguageProvider>
      </HeroUINativeProvider>,
    );
    expect(screen.queryByText('Este campo es obligatorio')).not.toBeNull();
  });

  it('#186 R3: rerender retira y vuelve a añadir los tres nodos', async () => {
    const { rerender } = await render(tree({ labelKey: 'validation.required' }));
    expect(screen.queryByTestId('f-message')).toHaveTextContent('Este campo es obligatorio');
    await rerender(tree(null));
    expectAbsent();
    await rerender(tree({ labelKey: 'validation.required' }));
    expect(screen.queryByTestId('f-message')).toHaveTextContent('Este campo es obligatorio');
    expect(screen.queryByTestId('f-error')).not.toBeNull();
    expect(screen.queryByTestId('f-message-row')).not.toBeNull();
  });

  it('#186 R3: rerender sustituye la clave sin dejar el texto anterior', async () => {
    const { rerender } = await render(tree({ labelKey: 'validation.required' }));
    await rerender(tree({ labelKey: 'validation.invalidDate' }));
    expect(screen.queryByText('Escribe una fecha válida con formato AAAA-MM-DD')).not.toBeNull();
    expect(screen.queryByText('Este campo es obligatorio')).toBeNull();
  });

  it('#186 R3: envuelve las primitivas sin estilos propios y usa RuleIssue como tipo', () => {
    const source = readFileSync('src/components/field-error-message.tsx', 'utf8');
    expect(source).not.toContain('className');
    expect(source).not.toContain('StyleSheet');
    expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(source).toMatch(/import\s*\{\s*FieldError\s*\}\s*from 'heroui-native'/);
    expect(source).toContain("from './form-error'");
    expect(source).toMatch(/import type\s*\{\s*RuleIssue\s*\}\s*from '\.\.\/utils\/account-rules'/);
  });
});
