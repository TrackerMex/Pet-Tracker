import { Image } from 'expo-image';
import { Button } from 'heroui-native';
import { Modal, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CelebrationProps = {
  testID: string;
  title: string;
  body: string;
  details?: { testID: string; label: string; value: string }[];
  primary: { testID: string; label: string; onPress: () => void };
  secondary: { testID: string; label: string; onPress: () => void };
};

export function Celebration({ testID, title, body, details, primary, secondary }: CelebrationProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      testID={`${testID}-modal`}
      visible
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={secondary.onPress}
    >
      <View
        testID={testID}
        className="flex-1 items-center gap-4 bg-surface-secondary px-6"
        style={{ paddingTop: insets.top + 80, paddingBottom: insets.bottom + 24 }}
      >
        <View
          testID={`${testID}-confetti`}
          className="absolute inset-0"
          pointerEvents="none"
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
        />
        <View testID={`${testID}-hero`} style={{ width: 200, height: 200 }}>
          <Animated.View testID={`${testID}-pingo`} style={{ width: 200, height: 200 }}>
            <Image
              testID={`${testID}-pose`}
              source={require('../../assets/images/pingo-celebrate.webp')}
              style={{ width: 200, height: 200 }}
              contentFit="contain"
              accessible={false}
            />
          </Animated.View>
          <Animated.View
            testID={`${testID}-badge`}
            style={{ position: 'absolute', right: 0, bottom: 0 }}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden
          >
            <View className="size-14 items-center justify-center rounded-full border-4 border-surface-secondary bg-accent">
              <Text className="text-2xl font-black text-accent-foreground">✓</Text>
            </View>
          </Animated.View>
        </View>
        <Text testID={`${testID}-title`} className="text-center text-3xl font-black text-foreground">{title}</Text>
        <Text testID={`${testID}-body`} className="text-center text-base text-muted" selectable>{body}</Text>
        {details?.length ? (
          <View testID={`${testID}-details`} className="flex-row flex-wrap justify-center gap-2">
            {details.map((detail) => (
              <View key={detail.testID} className="flex-row items-center gap-1.5 rounded-full bg-surface px-3 py-1.5">
                <Text className="text-xs font-bold text-muted">{detail.label}</Text>
                <Text testID={detail.testID} className="text-xs font-bold text-foreground" selectable>{detail.value}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <View testID={`${testID}-actions`} className="mt-auto w-full gap-3">
          <Button testID={primary.testID} className="min-h-11 w-full rounded-xl bg-accent border-b-4 border-black/25" onPress={primary.onPress}>
            <Button.Label className="font-bold text-accent-foreground">{primary.label}</Button.Label>
          </Button>
          <Button testID={secondary.testID} className="min-h-11 w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface" onPress={secondary.onPress}>
            <Button.Label className="font-bold text-foreground">{secondary.label}</Button.Label>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
