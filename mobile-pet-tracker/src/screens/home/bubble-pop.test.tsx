import { act, cleanup, render, screen, within } from '@testing-library/react-native';
import { Text } from 'react-native';
import { getAnimatedStyle } from 'react-native-reanimated';

import { BubblePop } from './bubble-pop';

const mockUseReducedMotion = jest.fn<boolean, []>(() => false);

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: () => mockUseReducedMotion(),
}));

describe('#195 R16: pop de la burbuja con movimiento real', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseReducedMotion.mockReturnValue(false);
  });
  afterEach(() => { cleanup(); jest.useRealTimers(); });

  it('espera 450 ms, alcanza el pico en 240 ms y vuelve en 160 ms', async () => {
    await render(<BubblePop testID="home-pingo-bubble"><Text testID="home-pingo-text">Pingo</Text></BubblePop>);
    const bubble = screen.getByTestId('home-pingo-bubble');
    const text = within(bubble).getByTestId('home-pingo-text');
    expect(getAnimatedStyle(bubble)).toEqual({ opacity: 0, transform: [{ scale: 0.6 }] });
    expect(bubble).toBeOnTheScreen();
    expect(text).toBeOnTheScreen();
    expect(bubble.props.entering).toBeUndefined();
    await act(async () => { jest.advanceTimersByTime(434); });
    expect(getAnimatedStyle(bubble)).toEqual({ opacity: 0, transform: [{ scale: 0.6 }] });
    await act(async () => { jest.advanceTimersByTime(36); });
    const intermediate = getAnimatedStyle(bubble) as { opacity: number; transform: { scale: number }[] };
    expect(intermediate.opacity).toBeGreaterThan(0);
    expect(intermediate.opacity).toBeLessThan(1);
    expect(intermediate.transform[0].scale).toBeGreaterThan(0.6);
    expect(intermediate.transform[0].scale).toBeLessThan(1.08);
    await act(async () => { jest.advanceTimersByTime(220); });
    expect(getAnimatedStyle(bubble)).toEqual({ opacity: 1, transform: [{ scale: 1.08 }] });
    await act(async () => { jest.advanceTimersByTime(16); });
    const peak = getAnimatedStyle(bubble) as { opacity: number; transform: { scale: number }[] };
    expect(peak.opacity).toBeCloseTo(1);
    // #195 R16: a los 706 ms el retorno ya lleva un fotograma; el pico exacto se afirma arriba.
    expect(peak.transform[0].scale).toBeCloseTo(1.08, 1);
    expect(peak.transform[0].scale).toBeGreaterThan(1);
    await act(async () => { jest.advanceTimersByTime(160); });
    const final = getAnimatedStyle(bubble) as { opacity: number; transform: { scale: number }[] };
    expect(final.opacity).toBeCloseTo(1);
    expect(final.transform[0].scale).toBeCloseTo(1);
    expect(bubble).toBeOnTheScreen();
    expect(text).toBeOnTheScreen();
  });

  it('con reduce motion nace final y visible sin avanzar el reloj', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await render(<BubblePop testID="home-pingo-bubble"><Text testID="home-pingo-text">Pingo</Text></BubblePop>);
    const bubble = screen.getByTestId('home-pingo-bubble');
    expect(getAnimatedStyle(bubble)).toEqual({ opacity: 1, transform: [{ scale: 1 }] });
    expect(bubble).toBeVisible();
    expect(within(bubble).getByTestId('home-pingo-text')).toBeVisible();
  });

  it('reenvía testID, className, style y su único hijo sin entering', async () => {
    await render(
      <BubblePop testID="home-pingo-bubble" className="flex-1" style={{ borderCurve: 'continuous' }}>
        <Text testID="home-pingo-text">Pingo</Text>
      </BubblePop>,
    );
    const bubble = screen.getByTestId('home-pingo-bubble');
    expect(bubble.props.className).toBe('flex-1');
    expect(getAnimatedStyle(bubble)).toEqual({ borderCurve: 'continuous', opacity: 0, transform: [{ scale: 0.6 }] });
    expect(bubble.children).toEqual([within(bubble).getByTestId('home-pingo-text')]);
    expect(bubble.props.entering).toBeUndefined();
  });
});
