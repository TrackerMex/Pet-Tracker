import { Image } from 'expo-image';
import { Button } from 'heroui-native';
import { Text, View } from 'react-native';

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
  return (
    <View testID={testID} className="items-center gap-3 py-8">
      <Image
        testID={`${testID}-pose`}
        source={POSES[pose]}
        style={{ width: 160, height: 160 }}
        contentFit="contain"
      />
      <Text testID={`${testID}-title`} className="text-center text-lg font-bold text-foreground">
        {title}
      </Text>
      <Text testID={`${testID}-body`} className="text-center font-normal text-muted">
        {body}
      </Text>
      {action ? (
        <Button testID={`${testID}-action`} className="rounded-xl bg-accent" onPress={action.onPress}>
          <Button.Label className="font-bold text-accent-foreground">{action.label}</Button.Label>
        </Button>
      ) : null}
    </View>
  );
}
