import type { ReactNode } from 'react';
import { Pressable, type AccessibilityState } from 'react-native';

interface GlassCircleProps {
  testID: string;
  accessibilityLabel: string;
  onPress: () => void;
  accessibilityState?: AccessibilityState;
  children: ReactNode;
}

export function GlassCircle({ testID, accessibilityLabel, onPress, accessibilityState, children }: GlassCircleProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      onPress={onPress}
      className="size-11 items-center justify-center rounded-full bg-glass-surface-strong"
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      {children}
    </Pressable>
  );
}
