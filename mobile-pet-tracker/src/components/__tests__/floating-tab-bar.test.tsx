import { fireEvent, render, screen } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import { StyleSheet } from 'react-native';
import { ReduceMotion } from 'react-native-reanimated';

import {
  FloatingTabBar,
  TAB_INDICATOR_SPRING,
  type FloatingTabBarProps,
} from '../floating-tab-bar';

const mockIsLiquidGlassAvailable = jest.fn<boolean, []>(() => false);
let mockTheme: 'light' | 'dark' = 'light';

jest.mock('uniwind', () => {
  const actual = jest.requireActual<typeof import('uniwind')>('uniwind');
  return {
    ...actual,
    useUniwind: () => ({ theme: mockTheme }),
  };
});

jest.mock('expo-glass-effect', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual('react-native');
  return {
    GlassView: (props: Record<string, unknown>) =>
      React.createElement(View, props),
    isLiquidGlassAvailable: () => mockIsLiquidGlassAvailable(),
  };
});

jest.mock('expo-blur', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual('react-native');
  return {
    BlurView: (props: Record<string, unknown>) =>
      React.createElement(View, props),
  };
});

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
  return render(<FloatingTabBar {...tabBarProps(index)} />, {
    wrapper: HeroUINativeProvider,
  });
}

describe('R1: usa GlassView cuando liquid glass está disponible (y nunca junto a BlurView)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(true);
    mockTheme = 'light';
  });

  it('monta únicamente el backdrop liquid glass regular sin tintColor', async () => {
    await renderTabBar();

    expect(screen.getByTestId('tab-bar-glass')).toHaveProp(
      'glassEffectStyle',
      'regular',
    );
    expect(screen.getByTestId('tab-bar-glass')).not.toHaveProp('tintColor');
    expect(screen.queryByTestId('tab-bar-blur')).not.toBeOnTheScreen();
  });
});

describe('R2: fallback BlurView con tint por tema, blurMethod y overlay translúcido', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
  });

  it('usa el fallback light con intensidad y método exactos', async () => {
    await renderTabBar();

    expect(screen.getByTestId('tab-bar-blur')).toHaveProp('intensity', 80);
    expect(screen.getByTestId('tab-bar-blur')).toHaveProp(
      'blurMethod',
      'dimezisBlurViewSdk31Plus',
    );
    expect(screen.getByTestId('tab-bar-blur')).toHaveProp('tint', 'light');
    expect(screen.getByTestId('tab-bar-overlay')).toHaveProp(
      'className',
      expect.stringContaining('bg-glass-surface'),
    );
    expect(screen.queryByTestId('tab-bar-glass')).not.toBeOnTheScreen();
  });

  it('sincroniza el tint del fallback con el tema dark de la app', async () => {
    mockTheme = 'dark';

    await renderTabBar();

    expect(screen.getByTestId('tab-bar-blur')).toHaveProp('tint', 'dark');
  });
});

describe('R3: pill dimensionado y posicionado tras layout (y ausente antes)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('espera un ancho válido y usa la geometría exacta para el tab activo', async () => {
    await renderTabBar(2);

    expect(screen.queryByTestId('tab-indicator')).not.toBeOnTheScreen();

    await fireEvent(screen.getByTestId('floating-tab-bar'), 'layout', {
      nativeEvent: {
        layout: { width: 360, height: 64, x: 0, y: 0 },
      },
    });
    jest.advanceTimersByTime(300);

    const indicator = screen.getByTestId('tab-indicator');
    const style = StyleSheet.flatten(indicator.props.style);

    expect(style).toMatchObject({
      width: 68.8,
      left: 8,
      top: 6,
      bottom: 6,
      borderRadius: 999,
      backgroundColor: expect.any(String),
    });
    expect(indicator).toHaveAnimatedStyle({
      transform: [{ translateX: 137.6 }],
    });
  });
});

describe('R4: pill se desliza con TAB_INDICATOR_SPRING y retarget-ea en vuelo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('expone la duración y amortiguación fijadas', () => {
    expect(TAB_INDICATOR_SPRING).toMatchObject({
      duration: 250,
      dampingRatio: 1,
    });
  });

  it('retarget-ea un cambio nuevo mientras el primer desplazamiento sigue en vuelo', async () => {
    const tabBar = await renderTabBar(0);

    await fireEvent(screen.getByTestId('floating-tab-bar'), 'layout', {
      nativeEvent: {
        layout: { width: 360, height: 64, x: 0, y: 0 },
      },
    });
    jest.advanceTimersByTime(300);

    await tabBar.rerender(<FloatingTabBar {...tabBarProps(4)} />);
    jest.advanceTimersByTime(100);
    await tabBar.rerender(<FloatingTabBar {...tabBarProps(1)} />);
    jest.advanceTimersByTime(1000);

    expect(screen.getByTestId('tab-indicator')).toHaveAnimatedStyle({
      transform: [{ translateX: 68.8 }],
    });
  });
});

describe('R5: TAB_INDICATOR_SPRING respeta reduced motion del sistema', () => {
  it('delega la preferencia de movimiento al ajuste del sistema', () => {
    expect(TAB_INDICATOR_SPRING.reduceMotion).toBe(ReduceMotion.System);
  });
});

describe('R7: tab bar renderiza y navega', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
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
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
  });

  it('positions the bar twelve points above the bottom inset and inset 16 from each edge', async () => {
    await renderTabBar();

    const style = StyleSheet.flatten(
      screen.getByTestId('floating-tab-bar').props.style,
    );
    expect(style).toMatchObject({ bottom: 46, left: 16, right: 16 });
  });
});
