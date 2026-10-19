import { useEffect } from 'react';
import { Image } from 'expo-image';
import { Button } from 'heroui-native';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G } from 'react-native-svg';
import { useChunkyLip } from '../theme/chunky-lip';
import { MOTION_FLOAT_OFFSET_Y, MOTION_FLOAT_TIMING } from '../theme/motion';
import { PINGO_STAGE_PAW_OPACITY, PINGO_STAGE_SHADOW_COLOR } from '../theme/pingo-stage';
import { useThemeColors } from '../theme/use-theme-colors';
import { PingoFloat } from './pingo-float';

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
  variant?: 'default' | 'hero';
  testID: string;
  pose: EmptyStatePose;
  title: string;
  body: string;
  action?: { label: string; onPress: () => void };
};

export function EmptyState({ testID, pose, title, body, action, variant = 'default' }: EmptyStateProps) {
  const chunkyLip = useChunkyLip();
  const [accent] = useThemeColors(['accent']);
  const reduceMotion = useReducedMotion();
  const offset = useSharedValue(0);
  const poseSize = variant === 'hero' ? 190 : 160;
  const floatStyle = useAnimatedStyle(() => ({
    ...(variant === 'default' ? { width: 160, height: 160 } : {}),
    transform: [{ translateY: offset.get() }],
  }));
  useEffect(() => {
    if (variant === 'default' && !reduceMotion) {
      offset.set(withRepeat(withTiming(-MOTION_FLOAT_OFFSET_Y, MOTION_FLOAT_TIMING), -1, true));
    }
  }, [offset, reduceMotion, variant]);

  const poseImage = (
        <Image
          testID={`${testID}-pose`}
          source={POSES[pose]}
          style={{ width: poseSize, height: poseSize }}
          contentFit="contain"
        />
  );
  const floatingPose = variant === 'hero' ? (
    <PingoFloat testID={`${testID}-float`}>{poseImage}</PingoFloat>
  ) : (
    <Animated.View testID={`${testID}-float`} style={floatStyle}>{poseImage}</Animated.View>
  );

  return (
    <View testID={testID} className="items-center gap-3 py-8">
      {variant === 'hero' ? (
        <View testID={`${testID}-stage`} className="h-65 w-70 items-center justify-center">
          <View testID={`${testID}-stage-disc`} className="absolute size-60 rounded-full bg-surface-secondary" />
          <Svg testID={`${testID}-stage-paw`} width={280} height={260} viewBox="0 0 280 260" style={{ position: 'absolute', opacity: PINGO_STAGE_PAW_OPACITY }}>
            <G fill={accent}>
              <G transform="translate(30 40) rotate(-20)">
                <Circle cx={0} cy={0} r={5} /><Circle cx={10} cy={-6} r={5} /><Circle cx={20} cy={0} r={5} />
                <Ellipse cx={10} cy={12} rx={9} ry={7} />
              </G>
              <G transform="translate(232 70) rotate(18)">
                <Circle cx={0} cy={0} r={5} /><Circle cx={10} cy={-6} r={5} /><Circle cx={20} cy={0} r={5} />
                <Ellipse cx={10} cy={12} rx={9} ry={7} />
              </G>
              <G transform="translate(220 210) rotate(-8)">
                <Circle cx={0} cy={0} r={4} /><Circle cx={8} cy={-5} r={4} /><Circle cx={16} cy={0} r={4} />
                <Ellipse cx={8} cy={10} rx={7} ry={6} />
              </G>
            </G>
          </Svg>
          {floatingPose}
          <View testID={`${testID}-stage-shadow`} className="absolute bottom-4.5 h-3.5 w-30 rounded-full" style={{ backgroundColor: PINGO_STAGE_SHADOW_COLOR }} />
        </View>
      ) : floatingPose}
      <Text testID={`${testID}-title`} className={variant === 'hero' ? 'text-center text-26 font-black tracking-title text-foreground' : 'text-center text-lg font-bold text-foreground'}>
        {title}
      </Text>
      <Text testID={`${testID}-body`} className="text-center font-normal text-muted">
        {body}
      </Text>
      {action ? (
        <Button testID={`${testID}-action`} className="h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={action.onPress}>
          <Text className="text-17 font-extrabold text-accent-foreground">{action.label}</Text>
        </Button>
      ) : null}
    </View>
  );
}
