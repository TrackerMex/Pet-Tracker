import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { withDelay, withSpring, withTiming } from 'react-native-reanimated';

import { homeEntering, HomeEntrance } from './home-entrance';

const mockUseReducedMotion = jest.fn<boolean, []>(() => false);

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  Easing: {
    bezier: (...points: number[]) => ({ bezier: points }),
  },
  withDelay: jest.fn((delayMs: number, animation: unknown, reduceMotion: unknown) => ({
    delayMs,
    animation,
    reduceMotion,
  })),
  withTiming: jest.fn((toValue: number, config: unknown) => ({ toValue, config })),
  withSpring: jest.fn((toValue: number, config: unknown) => ({ toValue, config })),
  useReducedMotion: () => mockUseReducedMotion(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockUseReducedMotion.mockReturnValue(false);
});

describe('#152 R3: la receta de entrada de la Home', () => {
  it('parte invisible y desplazada y llega opaca y en su sitio (enmendado por #197 R12)', () => {
    expect(homeEntering(180, 12)({})).toEqual({
      initialValues: { opacity: 0, transform: [{ translateY: 12 }] },
      animations: {
        opacity: {
          delayMs: 180,
          animation: {
            toValue: 1,
            config: {
              duration: 400,
              easing: { bezier: [0, 0, 0.58, 1] },
              reduceMotion: 'system',
            },
          },
          reduceMotion: 'system',
        },
        transform: [{
          translateY: {
            delayMs: 180,
            animation: {
              toValue: 0,
              config: { duration: 400, easing: { bezier: [0, 0, 0.58, 1] }, reduceMotion: 'system' },
            },
            reduceMotion: 'system',
          },
        }],
      },
    });
  });

  it('no anima nada hasta que se invoca (enmendado por #197 R12)', () => {
    homeEntering(180, 12);
    expect(withDelay).not.toHaveBeenCalled();
    expect(withTiming).not.toHaveBeenCalled();
    expect(withSpring).not.toHaveBeenCalled();
    homeEntering(180, 12)({});
    expect(withTiming).toHaveBeenCalledWith(1, { duration: 400, easing: { bezier: [0, 0, 0.58, 1] }, reduceMotion: 'system' });
    expect(withSpring).not.toHaveBeenCalled();
  });
});


describe('#152 R4: HomeEntrance escalona por índice y respeta reduce motion', () => {
  it('el índice 0 entra sin espera y desplazado 14 (enmendado por #197 R12)', async () => {
    await render(<HomeEntrance index={0} testID="entrance"><Text>Hijo</Text></HomeEntrance>);
    const recipe = screen.getByTestId('entrance').props.entering({});
    expect(recipe.initialValues).toEqual({ opacity: 0, transform: [{ translateY: 14 }] });
    expect(jest.mocked(withDelay).mock.calls.map(([delay]) => delay)).toEqual([0, 0]);
  });

  it('el índice 5 espera 300 ms (enmendado por #197 R12)', async () => {
    await render(<HomeEntrance index={5} testID="entrance"><Text>Hijo</Text></HomeEntrance>);
    screen.getByTestId('entrance').props.entering({});
    expect(jest.mocked(withDelay).mock.calls.map(([delay]) => delay)).toEqual([300, 300]);
    expect(withTiming).toHaveBeenCalledWith(0, { duration: 400, easing: { bezier: [0, 0, 0.58, 1] }, reduceMotion: 'system' });
  });

  it('bajo reduce motion no anima la entrada (enmendado por #197 R13)', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await render(<HomeEntrance index={5} testID="entrance"><Text>Hijo</Text></HomeEntrance>);
    expect(screen.getByTestId('entrance').props.entering).toBeUndefined();
    expect(withDelay).not.toHaveBeenCalled();
  });

  it('no añade estilo propio', async () => {
    await render(<HomeEntrance index={0} testID="entrance"><Text testID="child">Hijo</Text></HomeEntrance>);
    const entrance = screen.getByTestId('entrance');
    expect(entrance.props.style).toBeUndefined();
    expect(entrance.props.className).toBeUndefined();
    expect(entrance.children.filter((child) => typeof child !== 'string')).toEqual([
      screen.getByTestId('child'),
    ]);
  });

  it('#167 R4: pasa className tal cual sin añadir style', async () => {
    await render(<HomeEntrance index={0} testID="entrance" className="gap-4"><Text>Hijo</Text></HomeEntrance>);
    const entrance = screen.getByTestId('entrance');
    expect(entrance.props.className).toBe('gap-4');
    expect(entrance.props.style).toBeUndefined();
  });
});
