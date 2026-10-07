import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { withDelay, withSpring, withTiming } from 'react-native-reanimated';

import { homeEntering, HomeEntrance } from './home-entrance';

const mockUseReducedMotion = jest.fn<boolean, []>(() => false);

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
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
  it('parte invisible y desplazada y llega opaca y en su sitio', () => {
    expect(homeEntering(180, 12)({})).toEqual({
      initialValues: { opacity: 0, transform: [{ translateY: 12 }] },
      animations: {
        opacity: {
          delayMs: 180,
          animation: {
            toValue: 1,
            config: {
              duration: 250,
              easing: { bezier: [0.23, 1, 0.32, 1] },
              reduceMotion: 'never',
            },
          },
          reduceMotion: 'never',
        },
        transform: [{
          translateY: {
            delayMs: 180,
            animation: {
              toValue: 0,
              config: { duration: 250, dampingRatio: 1, reduceMotion: 'system' },
            },
            reduceMotion: 'never',
          },
        }],
      },
    });
  });

  it('no anima nada hasta que se invoca', () => {
    homeEntering(180, 12);
    expect(withDelay).not.toHaveBeenCalled();
    expect(withTiming).not.toHaveBeenCalled();
    expect(withSpring).not.toHaveBeenCalled();
  });
});


describe('#152 R4: HomeEntrance escalona por índice y respeta reduce motion', () => {
  it('el índice 0 entra sin espera y desplazado 12', async () => {
    await render(<HomeEntrance index={0} testID="entrance"><Text>Hijo</Text></HomeEntrance>);
    const recipe = screen.getByTestId('entrance').props.entering({});
    expect(recipe.initialValues).toEqual({ opacity: 0, transform: [{ translateY: 12 }] });
    expect(jest.mocked(withDelay).mock.calls.map(([delay]) => delay)).toEqual([0, 0]);
  });

  it('el índice 5 espera 300 ms', async () => {
    await render(<HomeEntrance index={5} testID="entrance"><Text>Hijo</Text></HomeEntrance>);
    screen.getByTestId('entrance').props.entering({});
    expect(jest.mocked(withDelay).mock.calls.map(([delay]) => delay)).toEqual([300, 300]);
  });

  it('bajo reduce motion conserva el fundido y el escalonado y no desplaza', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    try {
      await render(<HomeEntrance index={5} testID="entrance"><Text>Hijo</Text></HomeEntrance>);
      expect(screen.getByTestId('entrance').props.entering({})).toEqual({
        initialValues: { opacity: 0, transform: [{ translateY: 0 }] },
        animations: {
          opacity: {
            delayMs: 300,
            animation: {
              toValue: 1,
              config: {
                duration: 250,
                easing: { bezier: [0.23, 1, 0.32, 1] },
                reduceMotion: 'never',
              },
            },
            reduceMotion: 'never',
          },
          transform: [{
            translateY: {
              delayMs: 300,
              animation: {
                toValue: 0,
                config: { duration: 250, dampingRatio: 1, reduceMotion: 'system' },
              },
              reduceMotion: 'never',
            },
          }],
        },
      });
    } finally {
      mockUseReducedMotion.mockReturnValue(false);
    }
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
});
