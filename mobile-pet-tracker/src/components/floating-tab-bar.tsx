import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useEffect, useRef, useState } from 'react';
import {
  type LayoutChangeEvent,
  Pressable,
  Text,
  View,
} from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { useUniwind } from 'uniwind';

import { useTranslate } from '../providers/language-provider';
import { useShadows } from '../theme/shadows';
import { useThemeColors } from '../theme/use-theme-colors';

interface TabRoute {
  key: string;
  name: string;
}

export interface FloatingTabBarProps {
  state: {
    index: number;
    routes: TabRoute[];
  };
  navigation: {
    emit: (event: {
      type: 'tabPress';
      target: string;
      canPreventDefault: true;
    }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
}

const TABS = [
  { name: 'home', labelKey: 'tabs.home' },
  { name: 'map', labelKey: 'tabs.map' },
  { name: 'health', labelKey: 'tabs.health' },
  { name: 'food', labelKey: 'tabs.food' },
  { name: 'profile', labelKey: 'tabs.profile' },
] as const;

const TAB_ICON_SHAPES = {
  home: <Path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  map: <><Path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" /><Path d="M9 3v15M15 6v15" /></>,
  health: <><Path d="M20.4 13.4 12 21l-8.4-7.6A5 5 0 0 1 12 6.6a5 5 0 0 1 8.4 6.8z" /><Path d="M3.5 12h4l2-3 3 6 2-3h5.5" /></>,
  food: <><Path d="M7 3v18M4 3v5a3 3 0 0 0 6 0V3" /><Path d="M18 21V3c-2.5 1-4 3.5-4 7 0 2 1.5 3 4 3" /></>,
  profile: <><Circle cx="12" cy="8" r="4" /><Path d="M4 21a8 8 0 0 1 16 0" /></>,
} as const;

function TabIcon({ name, color, active }: { name: keyof typeof TAB_ICON_SHAPES; color: string; active: boolean }) {
  return (
    <Svg testID={`icon-tab-${name}`} width={24} height={24}
      viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={active ? 2.4 : 2}
      strokeLinecap="round" strokeLinejoin="round">
      {TAB_ICON_SHAPES[name]}
    </Svg>
  );
}

export const TAB_INDICATOR_SPRING = {
  duration: 250,
  dampingRatio: 1,
  reduceMotion: ReduceMotion.System,
} as const;

export function FloatingTabBar({ state, navigation }: FloatingTabBarProps) {
  const t = useTranslate();
  const [accent, muted, tabPill] = useThemeColors([
    'accent-strong',
    'muted',
    'tab-pill',
  ]);
  const shadows = useShadows();
  const insets = useSafeAreaInsets();
  const { theme } = useUniwind();
  const [containerWidth, setContainerWidth] = useState(0);
  const activeRouteName = state.routes[state.index]?.name;
  const activeTabIndex = TABS.findIndex((tab) => tab.name === activeRouteName);
  const translateX = useSharedValue(0);
  const lastPositionedIndex = useRef(activeTabIndex);
  const hasLiquidGlass = isLiquidGlassAvailable();
  const tabWidth = (containerWidth - 30) / TABS.length;
  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.get() }],
  }));

  useEffect(() => {
    if (containerWidth <= 0 || lastPositionedIndex.current === activeTabIndex) {
      return;
    }

    const previousIndex = lastPositionedIndex.current;
    lastPositionedIndex.current = activeTabIndex;

    if (activeTabIndex < 0) {
      return;
    }

    const nextX = activeTabIndex * (tabWidth + 4);
    translateX.set(
      previousIndex < 0 ? nextX : withSpring(nextX, TAB_INDICATOR_SPRING),
    );
  }, [activeTabIndex, containerWidth, tabWidth, translateX]);

  function handleLayout(event: LayoutChangeEvent) {
    const { width } = event.nativeEvent.layout;

    if (width <= 0) {
      setContainerWidth(0);
      return;
    }

    const nextTabWidth = (width - 30) / TABS.length;

    if (activeTabIndex >= 0) {
      translateX.set(activeTabIndex * (nextTabWidth + 4));
    }

    lastPositionedIndex.current = activeTabIndex;
    setContainerWidth(width);
  }

  return (
    <View
      testID="floating-tab-bar"
      className="absolute h-16 overflow-hidden rounded-full border border-border"
      style={{ ...shadows.tabBar, bottom: insets.bottom + 12, left: 16, right: 16 }}
      onLayout={handleLayout}
    >
      {hasLiquidGlass ? (
        <GlassView
          testID="tab-bar-glass"
          glassEffectStyle="regular"
          className="absolute inset-0"
        />
      ) : (
        <BlurView
          testID="tab-bar-blur"
          intensity={80}
          blurMethod="dimezisBlurViewSdk31Plus"
          tint={theme === 'dark' ? 'dark' : 'light'}
          className="absolute inset-0"
        >
          <View
            testID="tab-bar-overlay"
            className="flex-1 bg-glass-surface-strong"
          />
        </BlurView>
      )}
      {containerWidth > 0 && activeTabIndex >= 0 ? (
        <Animated.View
          testID="tab-indicator"
          style={[
            {
              position: 'absolute',
              width: tabWidth,
              left: 6,
              top: 6,
              height: 52,
              borderRadius: 999,
              backgroundColor: tabPill,
            },
            indicatorAnimatedStyle,
          ]}
        />
      ) : null}
      <View testID="tab-bar-row" className="flex-row gap-1 p-1.5">
        {TABS.map(({ name, labelKey }) => {
          const route = state.routes.find(
            (candidate) => candidate.name === name,
          );

          if (!route) {
            return null;
          }

          const isActive = activeRouteName === name;

          return (
            <Pressable
              key={route.key}
              testID={`tab-${name}`}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              className="h-13 flex-1 items-center justify-center gap-0.5"
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isActive && !event.defaultPrevented) {
                  navigation.navigate(name);
                }
              }}
            >
              <TabIcon name={name} active={isActive} color={isActive ? accent : muted} />
              <Text
                className={
                  isActive
                    ? 'text-2xs font-semibold text-accent-strong'
                    : 'text-2xs font-semibold text-muted'
                }
              >
                {t(labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
