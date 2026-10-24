import { render, screen } from '@testing-library/react-native';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';

type HeaderProps = ComponentProps<typeof import('../screen-header').ScreenHeader>;
const { existsSync } = jest.requireActual<{ existsSync: (path: string) => boolean }>('fs');
const ScreenHeader = existsSync(`${process.cwd()}/src/components/screen-header.tsx`)
  ? jest.requireActual<typeof import('../screen-header')>('../screen-header').ScreenHeader
  : undefined;
jest.mock('../back-button', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { BackButton: (props: Record<string, unknown>) => React.createElement(View, props) };
});
async function renderHeader(props: Partial<HeaderProps> = {}) {
  expect(ScreenHeader).toEqual(expect.any(Function));
  const Component = ScreenHeader!;
  return render(<Component testID="header" backFallback="/welcome" title="Documentos" {...props} />);
}

describe('#197 R19: cabecera en contenido', () => {
  it('#197 R19: pinta volver, título de 26 y nada más', async () => {
    await renderHeader();
    const row = screen.getByTestId('header');
    const title = screen.getByTestId('header-title');
    expect(row.props.className).toBe('flex-row items-center gap-2');
    expect(row.children).toEqual([screen.getByTestId('header-back').parent, title.parent]);
    expect(screen.getByTestId('header-back').parent?.props.className).toBe('-ml-2.5');
    expect(title.parent?.props.className).toBe('flex-1');
    expect(title).toHaveTextContent('Documentos');
    expect(title.props.className).toBe('text-26 font-black tracking-title text-foreground');
    expect(title.props.accessibilityRole).toBe('header');
    expect(screen.queryByTestId('header-eyebrow')).toBeNull();
  });
  it('#197 R19: añade el eyebrow encima del título', async () => {
    await renderHeader({ eyebrow: 'Mi mascota' });
    const eyebrow = screen.getByTestId('header-eyebrow');
    const title = screen.getByTestId('header-title');
    expect(eyebrow).toHaveTextContent('Mi mascota');
    expect(eyebrow.props.className).toBe('text-11 font-extrabold uppercase tracking-eyebrow text-muted');
    expect(title.parent?.children).toEqual([eyebrow, title]);
  });
  it('#197 R19: el título de 24 cambia solo el tamaño', async () => {
    await renderHeader({ size: 24 });
    expect(screen.getByTestId('header-title').props.className).toBe('text-24 font-black tracking-title text-foreground');
  });
  it('#197 R19: coloca el accesorio al final de la fila', async () => {
    await renderHeader({ accessory: <Text testID="accessory">Más</Text> });
    expect(screen.queryByTestId('accessory')).not.toBeNull();
    expect(screen.getByTestId('header').children.at(-1)).toBe(screen.getByTestId('accessory'));
  });
  it('#197 R19: volver usa el fallback y el trazo 2.4', async () => {
    await renderHeader();
    expect(screen.getByTestId('header-back').props).toMatchObject({ fallback: '/welcome', strokeWidth: 2.4 });
  });
  it('#197 R19: sin título ni eyebrow solo queda volver', async () => {
    await renderHeader({ title: undefined });
    expect(screen.getByTestId('header-back')).toBeOnTheScreen();
    expect(screen.queryByTestId('header-title')).toBeNull();
    expect(screen.queryByTestId('header-eyebrow')).toBeNull();
    expect(screen.getByTestId('header').children).toHaveLength(2);
  });
});

describe('#204 R2: marcador de título', () => {
  const childIds = (node: ReturnType<typeof screen.getByTestId> | null | undefined) =>
    (node?.children ?? []).map((child) => (typeof child === 'string' ? child : child.props.testID));

  it('#204 R2: sin título pinta el marcador en el hueco del título', async () => {
    await renderHeader({
      title: undefined,
      eyebrow: 'Documentos de',
      titlePlaceholder: <View testID="placeholder" />,
    });
    const eyebrow = screen.getByTestId('header-eyebrow');
    const placeholder = screen.getByTestId('placeholder');
    expect(eyebrow.parent?.props.className).toBe('flex-1');
    expect(childIds(eyebrow.parent)).toEqual(['header-eyebrow', 'placeholder']);
    expect(childIds(placeholder.parent)).toEqual(['header-eyebrow', 'placeholder']);
    expect(screen.queryByTestId('header-title')).toBeNull();
  });

  it('#204 R2: con título ignora el marcador', async () => {
    await renderHeader({ title: 'Luna', titlePlaceholder: <View testID="placeholder" /> });
    expect(screen.getByTestId('header-title')).toHaveTextContent('Luna');
    expect(screen.queryByTestId('placeholder')).toBeNull();
  });
});
