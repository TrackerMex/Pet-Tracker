import { Pressable, Text, View } from 'react-native';

import { CONTINUOUS_CORNER } from '../theme/native-styles';
import { TOUCH_SLOP } from '../theme/touch-target';

export function SegmentedControl<T extends string>({
  options,
  value,
  onSelect,
  allowEmpty,
}: {
  options: readonly { value: T; label: string; testID: string }[];
  value: T | null;
  onSelect: (value: T | null) => void;
  allowEmpty?: boolean;
}) {
  return (
    <View className="flex-row gap-1 rounded-14 bg-default p-1" style={CONTINUOUS_CORNER}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            testID={option.testID}
            className={`h-9.5 flex-1 items-center justify-center rounded-10${selected ? ' bg-surface shadow-sm' : ''}`}
            style={CONTINUOUS_CORNER}
            hitSlop={TOUCH_SLOP}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => {
              if (!selected) onSelect(option.value);
              else if (allowEmpty) onSelect(null);
            }}
          >
            <Text className={selected ? 'text-sm font-extrabold text-accent-strong' : 'text-sm font-extrabold text-muted'}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
