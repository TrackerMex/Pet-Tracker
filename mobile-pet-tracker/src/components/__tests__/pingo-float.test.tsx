import { act, render, screen, within } from '@testing-library/react-native';
import { Text } from 'react-native';
import { getAnimatedStyle } from 'react-native-reanimated';

import { PingoFloat } from '../pingo-float';

const mockUseReducedMotion = jest.fn<boolean, []>(() => false);

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: () => mockUseReducedMotion(),
}));

describe('#172 R4: PingoFloat', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseReducedMotion.mockReturnValue(false);
  });
  afterEach(() => jest.useRealTimers());

  it('#172 R4: flota 10 px arriba en 1,5 s y vuelve en bucle', async () => {
    await render(<PingoFloat testID="float"><Text>Hijo</Text></PingoFloat>);
    expect(getAnimatedStyle(screen.getByTestId('float')).transform[0].translateY)
      .toBeCloseTo(0, 0);
    await act(async () => { jest.advanceTimersByTime(750); });
    expect(getAnimatedStyle(screen.getByTestId('float')).transform[0].translateY)
      .toBeCloseTo(-5, 0);
    await act(async () => { jest.advanceTimersByTime(750); });
    expect(getAnimatedStyle(screen.getByTestId('float')).transform[0].translateY)
      .toBeCloseTo(-10, 0);
    await act(async () => { jest.advanceTimersByTime(1500); });
    expect(getAnimatedStyle(screen.getByTestId('float')).transform[0].translateY)
      .toBeCloseTo(0, 0);
    await act(async () => { jest.advanceTimersByTime(1500); });
    expect(getAnimatedStyle(screen.getByTestId('float')).transform[0].translateY)
      .toBeCloseTo(-10, 0);
  });

  it('#172 R4: con reduce motion no se mueve', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await render(<PingoFloat testID="float"><Text>Hijo</Text></PingoFloat>);
    expect(getAnimatedStyle(screen.getByTestId('float')).transform[0].translateY).toBe(0);
    await act(async () => { jest.advanceTimersByTime(750); });
    expect(getAnimatedStyle(screen.getByTestId('float')).transform[0].translateY).toBe(0);
    await act(async () => { jest.advanceTimersByTime(750); });
    expect(getAnimatedStyle(screen.getByTestId('float')).transform[0].translateY).toBe(0);
  });

  it('#172 R4: pasa testID y children', async () => {
    await render(<PingoFloat testID="float"><Text>Hijo</Text></PingoFloat>);
    expect(within(screen.getByTestId('float')).getByText('Hijo')).toBeOnTheScreen();
  });
});
