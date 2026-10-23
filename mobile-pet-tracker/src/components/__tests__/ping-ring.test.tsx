import { act, render, screen } from '@testing-library/react-native';
import { Easing, ReduceMotion, getAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';

import { PingRing } from '../ping-ring';

jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual<typeof import('react-native-reanimated')>('react-native-reanimated');
  return { ...actual, __esModule: true, withTiming: jest.fn(actual.withTiming), withDelay: jest.fn(actual.withDelay) };
});

describe('#188 R13: shared welcome ring', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });
  afterEach(() => jest.useRealTimers());

  it.each([800, 1600])('#188 R13: applies the %i ms delay to both animated properties', async (delay) => {
    await render(<PingRing testID="ring" delay={delay} className="size-65 rounded-full border-2 border-accent" />);
    expect(jest.mocked(withDelay).mock.calls.map(([ms]) => ms)).toEqual([delay, delay]);
    expect(screen.getByTestId('ring').props.className).toBe('absolute size-65 rounded-full border-2 border-accent');
    await act(async () => { jest.advanceTimersByTime(delay - 100); });
    expect(screen.getByTestId('ring')).toHaveAnimatedStyle({
      opacity: 0.55, transform: [{ scale: 0.55 }],
    }, { shouldMatchAllProps: true });
    await act(async () => { jest.advanceTimersByTime(200); });
    const style = getAnimatedStyle(screen.getByTestId('ring'));
    expect(style.opacity).toBeLessThan(0.55);
    expect((style.transform as [{ scale: number }])[0].scale).toBeGreaterThan(0.55);
  });
});


describe('#195 R8: timing opcional del anillo compartido', () => {
  beforeEach(() => { jest.useFakeTimers(); jest.clearAllMocks(); });
  afterEach(() => jest.useRealTimers());
  it('conserva 2400 ms por defecto y usa el timing recibido en ambas propiedades', async () => {
    const view = await render(<PingRing testID="ring" delay={0} className="inset-0" />);
    expect(jest.mocked(withTiming).mock.calls.map(([, config]) => config?.duration)).toEqual([2400, 2400]);
    jest.mocked(withTiming).mockClear();
    const timing = { duration: 1600, easing: Easing.bezier(0, 0, 0.58, 1), reduceMotion: ReduceMotion.System };
    await view.rerender(<PingRing testID="ring" delay={0} className="inset-0" timing={timing} />);
    expect(jest.mocked(withTiming).mock.calls).toEqual([[1.5, timing], [0, timing]]);
    await act(async () => { jest.advanceTimersByTime(800); });
    const style = getAnimatedStyle(screen.getByTestId('ring'));
    expect(style.opacity).toBeLessThan(0.55);
    expect((style.transform as [{ scale: number }])[0].scale).toBeGreaterThan(0.55);
  });
});
