import { router, type Href } from 'expo-router';
import { Pressable } from 'react-native';
import { ChevronLeft } from 'reicon-react-native';

import { useTranslate } from '../providers/language-provider';
import { useThemeColors } from '../theme/use-theme-colors';

export function BackButton({ testID, fallback, strokeWidth }: { testID: string; fallback: Href; strokeWidth?: number }) {
  const t = useTranslate();
  const [foreground] = useThemeColors(['foreground']);

  return (
    <Pressable
      testID={testID}
      className="size-11 items-center justify-center rounded-full"
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      accessibilityRole="button"
      accessibilityLabel={t('common.back')}
      onPress={() => router.canGoBack() ? router.back() : router.replace(fallback)}
    >
      <ChevronLeft size={24} color={foreground} strokeWidth={strokeWidth} />
    </Pressable>
  );
}
