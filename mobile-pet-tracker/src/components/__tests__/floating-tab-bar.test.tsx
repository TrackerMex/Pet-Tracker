import { fireEvent, render, screen } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import { StyleSheet } from 'react-native';

import {
  FloatingTabBar,
  type FloatingTabBarProps,
} from '../floating-tab-bar';

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 34, left: 0 }),
}));

type TabPressEvent = Parameters<FloatingTabBarProps['navigation']['emit']>[0];

const routes = [
  { key: 'home-1', name: 'home' },
  { key: 'map-1', name: 'map' },
  { key: 'health-1', name: 'health' },
  { key: 'food-1', name: 'food' },
  { key: 'profile-1', name: 'profile' },
];
const mockEmit = jest.fn<{ defaultPrevented: boolean }, [TabPressEvent]>();
const mockNavigate = jest.fn<void, [string]>();

function tabBarProps(index = 0): FloatingTabBarProps {
  return {
    state: { index, routes },
    navigation: {
      emit: mockEmit,
      navigate: mockNavigate,
    },
  };
}

async function renderTabBar(index = 0) {
  await render(<FloatingTabBar {...tabBarProps(index)} />, {
    wrapper: HeroUINativeProvider,
  });
}

describe('R7: tab bar renderiza y navega', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
  });

  it('renders the five labeled tabs in the required order', async () => {
    await renderTabBar();

    expect(screen.getAllByRole('tab').map((tab) => tab.props.testID)).toEqual([
      'tab-home',
      'tab-map',
      'tab-health',
      'tab-food',
      'tab-profile',
    ]);
    for (const label of ['Home', 'Map', 'Health', 'Food', 'Profile']) {
      expect(screen.getByText(label)).toBeVisible();
    }
    expect(screen.getByTestId('tab-home')).toHaveProp('accessibilityState', {
      selected: true,
    });
    expect(screen.getByTestId('tab-map')).toHaveProp('accessibilityState', {
      selected: false,
    });
  });

  it('emits tabPress and navigates when an inactive tab is pressed', async () => {
    await renderTabBar();

    await fireEvent.press(screen.getByTestId('tab-map'));

    expect(mockEmit).toHaveBeenCalledWith({
      type: 'tabPress',
      target: 'map-1',
      canPreventDefault: true,
    });
    expect(mockNavigate).toHaveBeenCalledWith('map');
  });

  it('does not navigate when the active tab is pressed', async () => {
    await renderTabBar();

    await fireEvent.press(screen.getByTestId('tab-home'));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('respects a prevented tabPress event', async () => {
    mockEmit.mockReturnValue({ defaultPrevented: true });
    await renderTabBar();

    await fireEvent.press(screen.getByTestId('tab-map'));

    expect(mockEmit).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('R8: tab bar flota con safe area', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
  });

  it('positions the bar twelve points above the bottom inset', async () => {
    await renderTabBar();

    const style = StyleSheet.flatten(
      screen.getByTestId('floating-tab-bar').props.style,
    );
    expect(style).toMatchObject({ bottom: 46 });
  });
});
