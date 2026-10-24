import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { withDelay, withTiming } from 'react-native-reanimated';

import { RiseIn } from '../rise-in';

const mockUseReducedMotion = jest.fn<boolean, []>(() => false);

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  Easing: {
    bezier: (...points: number[]) => ({ bezier: points }),
  },
  withDelay: jest.fn((delayMs: number, animation: unknown) => ({ delayMs, animation })),
  withTiming: jest.fn((toValue: number, config: unknown) => ({ toValue, config })),
  useReducedMotion: () => mockUseReducedMotion(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockUseReducedMotion.mockReturnValue(false);
});

describe('#197 R24: RiseIn', () => {
  it('#197 R24 la entrada parte de opacidad 0 y MOTION_RISE_OFFSET_Y abajo', async () => {
    await render(<RiseIn delayMs={0} testID="rise"><Text>Hijo</Text></RiseIn>);
    expect(screen.getByTestId('rise').props.entering({}).initialValues).toEqual({
      opacity: 0,
      transform: [{ translateY: 14 }],
    });
  });

  it('#197 R24 anima opacidad y desplazamiento con MOTION_RISE_TIMING tras delayMs', async () => {
    await render(<RiseIn delayMs={180} testID="rise"><Text>Hijo</Text></RiseIn>);
    expect(withDelay).not.toHaveBeenCalled();
    expect(withTiming).not.toHaveBeenCalled();
    const recipe = screen.getByTestId('rise').props.entering({});
    const config = { duration: 400, easing: { bezier: [0, 0, 0.58, 1] }, reduceMotion: 'system' };
    expect(recipe.animations).toEqual({
      opacity: { delayMs: 180, animation: { toValue: 1, config } },
      transform: [{ translateY: { delayMs: 180, animation: { toValue: 0, config } } }],
    });
    expect(withTiming).toHaveBeenCalledTimes(2);
    expect(jest.mocked(withDelay).mock.calls.map(([delay]) => delay)).toEqual([180, 180]);
  });

  it('#197 R24 bajo reduce motion no declara entering', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await render(<RiseIn delayMs={180} testID="rise"><Text>Hijo</Text></RiseIn>);
    expect(screen.getByTestId('rise').props.entering).toBeUndefined();
    expect(withDelay).not.toHaveBeenCalled();
    expect(withTiming).not.toHaveBeenCalled();
  });

  it('#197 R24 pasa testID y className al Animated.View y pinta sus hijos', async () => {
    await render(<RiseIn delayMs={0} testID="rise" className="gap-4"><Text testID="child">Hijo</Text></RiseIn>);
    const entrance = screen.getByTestId('rise');
    expect(entrance.props.className).toBe('gap-4');
    expect(entrance.children.filter((child) => typeof child !== 'string')).toEqual([
      screen.getByTestId('child'),
    ]);
    await render(<RiseIn delayMs={0}><Text>Sin props opcionales</Text></RiseIn>);
    expect(screen.getByText('Sin props opcionales')).toBeOnTheScreen();
  });
});
