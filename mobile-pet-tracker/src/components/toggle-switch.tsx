import { Switch } from 'heroui-native';
import type { ComponentProps } from 'react';

import { useThemeColors } from '../theme/use-theme-colors';

type ToggleSwitchProps = {
  testID: string;
  isSelected: boolean;
  onSelectedChange: (isSelected: boolean) => void;
} & Pick<ComponentProps<typeof Switch>, 'isDisabled' | 'accessibilityLabel' | 'hitSlop' | 'style'>;

export function ToggleSwitch({ testID, isSelected, onSelectedChange, isDisabled, accessibilityLabel, hitSlop, style }: ToggleSwitchProps) {
  const [lipGray, accent] = useThemeColors(['lip-gray', 'accent']);
  return (
    <Switch
      testID={testID}
      isSelected={isSelected}
      onSelectedChange={onSelectedChange}
      isDisabled={isDisabled}
      accessibilityLabel={accessibilityLabel}
      hitSlop={hitSlop}
      style={style}
      className="h-7 w-12"
      animation={{ backgroundColor: { value: [lipGray, accent] } }}
    >
      <Switch.Thumb
        testID={`${testID}-thumb`}
        className="h-5.5 w-5.5 rounded-full shadow-none"
        animation={{ left: { value: 3 } }}
      />
    </Switch>
  );
}
