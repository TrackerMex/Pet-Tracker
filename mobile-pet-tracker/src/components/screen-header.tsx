import type { Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { BackButton } from './back-button';

const TITLE_CLASSES = {
  24: 'text-24 font-black tracking-title text-foreground',
  26: 'text-26 font-black tracking-title text-foreground',
};

type ScreenHeaderProps = {
  testID: string;
  backFallback: Href;
  title?: string;
  eyebrow?: string;
  size?: 24 | 26;
  accessory?: ReactNode;
  titlePlaceholder?: ReactNode;
};

export function ScreenHeader({ testID, backFallback, title, eyebrow, size = 26, accessory, titlePlaceholder }: ScreenHeaderProps) {
  return (
    <View testID={testID} className="flex-row items-center gap-2">
      <View className="-ml-2.5">
        <BackButton testID={`${testID}-back`} fallback={backFallback} strokeWidth={2.4} />
      </View>
      <View className="flex-1">
        {eyebrow ? <Text testID={`${testID}-eyebrow`} className="text-11 font-extrabold uppercase tracking-eyebrow text-muted">{eyebrow}</Text> : null}
        {title ? <Text testID={`${testID}-title`} accessibilityRole="header" className={TITLE_CLASSES[size]}>{title}</Text> : titlePlaceholder}
      </View>
      {accessory}
    </View>
  );
}
