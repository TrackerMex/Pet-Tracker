import { useEffect } from 'react';
import { Image } from 'expo-image';
import { Button } from 'heroui-native';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { MOTION_FLOAT_OFFSET_Y, MOTION_FLOAT_TIMING } from '../theme/motion';

export type EmptyStatePose = 'talk' | 'sleep' | 'clipboard' | 'health' | 'collar' | 'food';

const POSES = {
  talk: require('../../assets/images/pingo-talk.webp'),
  sleep: require('../../assets/images/pingo-sleep.webp'),
  clipboard: require('../../assets/images/pingo-clipboard.webp'),
  health: require('../../assets/images/pingo-health.webp'),
  collar: require('../../assets/images/pingo-collar.webp'),
  food: require('../../assets/images/pingo-food.webp'),
};

type EmptyStateProps = {
  testID: string;
  pose: EmptyStatePose;
  title: string;
  body: string;
  action?: { label: string; onPress: () => void };
};

export function EmptyState({ testID, pose, title, body, action }: EmptyStateProps) {
  const reduceMotion = useReducedMotion();
  const offset = useSharedValue(0);
  const floatStyle = useAnimatedStyle(() => ({
    width: 160,
    height: 160,
    transform: [{ translateY: offset.get() }],
  }));
  useEffect(() => {
    offset.set(withRepeat(withTiming(-MOTION_FLOAT_OFFSET_Y, MOTION_FLOAT_TIMING), -1, true));
  }, [offset, reduceMotion]);

  return (
    <View testID={testID} className="items-center gap-3 py-8">
      <Animated.View testID={`${testID}-float`} style={floatStyle}>
        <Image
          testID={`${testID}-pose`}
          source={POSES[pose]}
          style={{ width: 160, height: 160 }}
          contentFit="contain"
        />
      </Animated.View>
      <Text testID={`${testID}-title`} className="text-center text-lg font-bold text-foreground">
        {title}
      </Text>
      <Text testID={`${testID}-body`} className="text-center font-normal text-muted">
        {body}
      </Text>
      {action ? (
        <Button testID={`${testID}-action`} className="rounded-xl bg-accent border-b-4 border-black/25" onPress={action.onPress}>
          <Button.Label className="font-bold text-accent-foreground">{action.label}</Button.Label>
        </Button>
      ) : null}
    </View>
  );
}
