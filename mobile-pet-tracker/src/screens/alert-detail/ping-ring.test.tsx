import { act, render, screen } from '@testing-library/react-native';
import { getAnimatedStyle, withRepeat } from 'react-native-reanimated';
import { AlertPingRing } from './ping-ring';

let mockReducedMotion = false;
jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'), __esModule: true,
  useReducedMotion: () => mockReducedMotion,
  withRepeat: jest.fn((animation: unknown) => animation),
}));
beforeEach(() => { jest.useFakeTimers(); jest.clearAllMocks(); mockReducedMotion = false; });
afterEach(() => jest.useRealTimers());
it('#180 R4.1 (enmendado por E1): el anillo late en 1800 ms con ease-out', async () => {
  await render(<AlertPingRing ring="bg-danger/20" />);
  const start = { opacity: 0.55, transform: [{ scale: 0.55 }] };
  const end = { opacity: 0, transform: [{ scale: 1.5 }] };
  await act(async () => { jest.advanceTimersByTime(0); });
  expect(getAnimatedStyle(screen.getByTestId('alert-detail-ping'))).toEqual(start);
  await act(async () => { jest.advanceTimersByTime(900); });
  expect(getAnimatedStyle(screen.getByTestId('alert-detail-ping'))).not.toEqual(start);
  expect(getAnimatedStyle(screen.getByTestId('alert-detail-ping'))).not.toEqual(end);
  await act(async () => { jest.advanceTimersByTime(1000); });
  expect(getAnimatedStyle(screen.getByTestId('alert-detail-ping'))).toEqual(end);
  expect(screen.getByTestId('alert-detail-ping').props.className).toBe('absolute size-23 rounded-full bg-danger/20');
  expect(jest.mocked(withRepeat).mock.calls.map(call => call.slice(1))).toEqual([[-1, false], [-1, false]]);
});
it('#180 R4.2: el anillo no se pinta ni anima con movimiento reducido', async () => {
  mockReducedMotion = true;
  await render(<AlertPingRing ring="bg-danger/20" />);
  expect(screen.queryByTestId('alert-detail-ping', { includeHiddenElements: true })).toBeNull();
  expect(withRepeat).not.toHaveBeenCalled();
});
