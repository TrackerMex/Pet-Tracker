jest.mock('react-native-worklets', () =>
  require('react-native-worklets/lib/module/mock'),
);

require('react-native-reanimated').setUpTests();

// The real <StatusBar> defers its native update with setImmediate; under
// renderRouter's fake timers its unmount calls the real clearImmediate on a fake
// id and corrupts Node's immediate counter (tests then time out).
jest.mock('expo-status-bar', () => ({
  ...jest.requireActual('expo-status-bar'),
  StatusBar: () => null,
}));
jest.mock('expo-clipboard', () => ({ setStringAsync: jest.fn() }));
