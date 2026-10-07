import { withDelay, withSpring, withTiming } from 'react-native-reanimated';

import { homeEntering } from './home-entrance';

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
