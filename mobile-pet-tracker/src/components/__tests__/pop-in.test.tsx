import { act, render, screen, within } from '@testing-library/react-native';
import { Text } from 'react-native';
import { getAnimatedStyle } from 'react-native-reanimated';

import { PopIn } from '../pop-in';

const mockUseReducedMotion = jest.fn<boolean, []>(() => false);

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: () => mockUseReducedMotion(),
}));

describe('#167 R3: PopIn entra con escala y fundido', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseReducedMotion.mockReturnValue(false);
  });
  afterEach(() => jest.useRealTimers());

  it('#167 R3: entra desde opacidad 0 y escala 0.9 tras 250 ms', async () => {
    await render(<PopIn testID="pop"><Text>Hijo</Text></PopIn>);
    await act(async () => { jest.advanceTimersByTime(200); });
    expect(getAnimatedStyle(screen.getByTestId('pop'))).toEqual({
      opacity: 0, transform: [{ scale: 0.9 }],
    });
    await act(async () => { jest.advanceTimersByTime(1300); });
    expect(getAnimatedStyle(screen.getByTestId('pop'))).toEqual({
      opacity: 1, transform: [{ scale: 1 }],
    });
  });

  it('#167 R3: con reduce motion funde la opacidad y no escala', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await render(<PopIn testID="pop"><Text>Hijo</Text></PopIn>);
    expect(getAnimatedStyle(screen.getByTestId('pop'))).toEqual({
      opacity: 0, transform: [{ scale: 1 }],
    });
    await act(async () => { jest.advanceTimersByTime(200); });
    expect(getAnimatedStyle(screen.getByTestId('pop'))).toEqual({
      opacity: 0, transform: [{ scale: 1 }],
    });
    await act(async () => { jest.advanceTimersByTime(1300); });
    expect(getAnimatedStyle(screen.getByTestId('pop'))).toEqual({
      opacity: 1, transform: [{ scale: 1 }],
    });
  });

  it('#167 R3: pasa testID, className, style y children', async () => {
    await render(
      <PopIn testID="pop" className="size-16" style={{ borderCurve: 'continuous' }}>
        <Text testID="pop-child">Hijo</Text>
      </PopIn>,
    );
    const pop = screen.getByTestId('pop');
    expect(pop.props.className).toBe('size-16');
    expect(getAnimatedStyle(pop)).toEqual({
      borderCurve: 'continuous', opacity: 0, transform: [{ scale: 0.9 }],
    });
    expect(within(pop).getByTestId('pop-child')).toBeOnTheScreen();
  });

  it('#167 R3: sin className ni style no añade nada propio', async () => {
    await render(<PopIn testID="pop"><Text>Hijo</Text></PopIn>);
    const pop = screen.getByTestId('pop');
    expect(pop.props.className).toBeUndefined();
    expect(getAnimatedStyle(pop)).toEqual({
      opacity: 0, transform: [{ scale: 0.9 }],
    });
  });
});
