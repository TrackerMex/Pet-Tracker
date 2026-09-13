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
import {
  ForkKnife,
  HeartPulse,
  Home,
  Map,
  Profile,
} from 'reicon-react-native';
import { useUniwind } from 'uniwind';

import { useTranslate } from '../providers/language-provider';
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
  { name: 'home', labelKey: 'tabs.home', Icon: Home },
  { name: 'map', labelKey: 'tabs.map', Icon: Map },
  { name: 'health', labelKey: 'tabs.health', Icon: HeartPulse },
  { name: 'food', labelKey: 'tabs.food', Icon: ForkKnife },
  { name: 'profile', labelKey: 'tabs.profile', Icon: Profile },
] as const;

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
  const insets = useSafeAreaInsets();
  const { theme } = useUniwind();
  const [containerWidth, setContainerWidth] = useState(0);
  const activeRouteName = state.routes[state.index]?.name;
  const activeTabIndex = TABS.findIndex((tab) => tab.name === activeRouteName);
  const translateX = useSharedValue(0);
  const lastPositionedIndex = useRef(activeTabIndex);
  const hasLiquidGlass = isLiquidGlassAvailable();
  const tabWidth = (containerWidth - 16) / TABS.length;
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

    const nextX = activeTabIndex * tabWidth;
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

    const nextTabWidth = (width - 16) / TABS.length;

    if (activeTabIndex >= 0) {
      translateX.set(activeTabIndex * nextTabWidth);
    }

    lastPositionedIndex.current = activeTabIndex;
    setContainerWidth(width);
  }

  return (
    <View
      testID="floating-tab-bar"
      className="absolute overflow-hidden rounded-full border border-border shadow-lg"
      style={{ bottom: insets.bottom + 12, left: 16, right: 16 }}
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
            className="flex-1 bg-glass-surface"
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
              left: 8,
              top: 6,
              bottom: 6,
              borderRadius: 999,
              backgroundColor: tabPill,
            },
            indicatorAnimatedStyle,
          ]}
        />
      ) : null}
      <View className="flex-row items-center justify-around px-2 py-3">
        {TABS.map(({ name, labelKey, Icon }) => {
          const route = state.routes.find(
            (candidate) => candidate.name === name,
          );

          if (!route) {
            return null;
          }

          const isActive = activeTabIndex < 0 || activeRouteName === name;

          return (
            <Pressable
              key={route.key}
              testID={`tab-${name}`}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              className="flex-1 items-center gap-1"
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
              <Icon
                size={24}
                weight={isActive ? 'Filled' : 'Outline'}
                color={isActive ? accent : muted}
              />
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
