import { useThemeColor } from 'heroui-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ForkKnife,
  HeartPulse,
  Home,
  Map,
  Profile,
} from 'reicon-react-native';

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
  { name: 'home', label: 'Home', Icon: Home },
  { name: 'map', label: 'Map', Icon: Map },
  { name: 'health', label: 'Health', Icon: HeartPulse },
  { name: 'food', label: 'Food', Icon: ForkKnife },
  { name: 'profile', label: 'Profile', Icon: Profile },
] as const;

export function FloatingTabBar({ state, navigation }: FloatingTabBarProps) {
  const [accent, muted] = useThemeColor(['accent', 'muted']);
  const insets = useSafeAreaInsets();
  const activeRouteName = state.routes[state.index]?.name;

  return (
    <View
      testID="floating-tab-bar"
      className="absolute flex-row items-center justify-around rounded-full border border-border bg-surface px-2 py-3 shadow-lg"
      style={{ bottom: insets.bottom + 12, left: 16, right: 16 }}
    >
      {TABS.map(({ name, label, Icon }) => {
        const route = state.routes.find((candidate) => candidate.name === name);

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
                  ? 'text-[10px] font-semibold text-accent'
                  : 'text-[10px] font-semibold text-muted'
              }
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
