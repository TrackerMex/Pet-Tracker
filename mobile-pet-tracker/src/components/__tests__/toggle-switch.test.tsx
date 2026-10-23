import { fireEvent, render, screen } from '@testing-library/react-native';
import { HeroUINativeProvider, Switch } from 'heroui-native';
import type { ComponentProps } from 'react';

type ToggleProps = ComponentProps<typeof import('../toggle-switch').ToggleSwitch>;
const { existsSync } = jest.requireActual<{ existsSync: (path: string) => boolean }>('fs');
const ToggleSwitch = existsSync(`${process.cwd()}/src/components/toggle-switch.tsx`)
  ? jest.requireActual<typeof import('../toggle-switch')>('../toggle-switch').ToggleSwitch
  : undefined;

jest.mock('heroui-native', () => {
  const actual = jest.requireActual<typeof import('heroui-native')>('heroui-native');
  const React = jest.requireActual<typeof import('react')>('react');
  const root = jest.fn((props: ComponentProps<typeof actual.Switch>) => React.createElement(actual.Switch, props));
  const thumb = jest.fn((props: ComponentProps<typeof actual.Switch.Thumb>) => React.createElement(actual.Switch.Thumb, props));
  return { ...actual, Switch: Object.assign(root, actual.Switch, { Thumb: thumb }) };
});
jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: readonly string[]) => tokens.map(token => `--color-${token}`),
}));

async function renderToggle(props: Partial<ToggleProps> = {}) {
  expect(ToggleSwitch).toEqual(expect.any(Function));
  const Component = ToggleSwitch!;
  return render(<HeroUINativeProvider><Component testID="toggle" isSelected={false} onSelectedChange={jest.fn()} {...props} /></HeroUINativeProvider>);
}
beforeEach(() => jest.clearAllMocks());

describe('#197 R16: interruptor del canvas', () => {
  it('#197 R16: pinta la raíz de 48x28 con lip-gray y accent', async () => {
    const onSelectedChange = jest.fn();
    const hitSlop = { top: 6, bottom: 6, left: 6, right: 6 };
    const style = { opacity: 1 };
    await renderToggle({ isSelected: true, onSelectedChange, isDisabled: false, accessibilityLabel: 'Avisos', hitSlop, style });
    expect(screen.getByTestId('toggle')).toBeOnTheScreen();
    const props = jest.mocked(Switch).mock.calls.at(-1)?.[0];
    expect(props).toMatchObject({ testID: 'toggle', isSelected: true, onSelectedChange, isDisabled: false, accessibilityLabel: 'Avisos', hitSlop, style,
      className: 'h-7 w-12', animation: { backgroundColor: { value: ['--color-lip-gray', '--color-accent'] } },
    });
  });
  it('#197 R16: pinta el pulgar de 22 a 3 del borde y sin sombra', async () => {
    await renderToggle();
    expect(screen.getByTestId('toggle-thumb', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(jest.mocked(Switch.Thumb).mock.calls.at(-1)?.[0]).toMatchObject({
      testID: 'toggle-thumb', className: 'h-5.5 w-5.5 rounded-full shadow-none', animation: { left: { value: 3 } },
    });
  });
});

describe('#197 R17: comportamiento controlado', () => {
  it('#197 R17: al pulsar apagado llama con true', async () => {
    const onSelectedChange = jest.fn();
    await renderToggle({ isSelected: false, onSelectedChange });
    await fireEvent.press(screen.getByTestId('toggle'));
    expect(onSelectedChange).toHaveBeenCalledTimes(1);
    expect(onSelectedChange).toHaveBeenCalledWith(true);
    expect(screen.getByTestId('toggle').props.accessibilityState.checked).toBe(false);
  });
  it('#197 R17: al pulsar encendido llama con false', async () => {
    const onSelectedChange = jest.fn();
    await renderToggle({ isSelected: true, onSelectedChange });
    await fireEvent.press(screen.getByTestId('toggle'));
    expect(onSelectedChange).toHaveBeenCalledTimes(1);
    expect(onSelectedChange).toHaveBeenCalledWith(false);
    expect(screen.getByTestId('toggle').props.accessibilityState.checked).toBe(true);
  });
  it('#197 R17: deshabilitado no llama', async () => {
    const onSelectedChange = jest.fn();
    await renderToggle({ isDisabled: true, onSelectedChange });
    await fireEvent.press(screen.getByTestId('toggle'));
    expect(onSelectedChange).not.toHaveBeenCalled();
  });
});
