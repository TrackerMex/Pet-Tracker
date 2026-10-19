import { useEffect } from 'react';
import { Image } from 'expo-image';
import { Button } from 'heroui-native';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
import { Plus } from 'reicon-react-native';
import Svg, { Circle, Ellipse, G } from 'react-native-svg';
import { useChunkyLip } from '../theme/chunky-lip';
import { MOTION_ENTRANCE_OFFSET_Y, MOTION_FADE_TIMING, MOTION_FLOAT_OFFSET_Y, MOTION_FLOAT_TIMING, MOTION_SETTLE_SPRING, MOTION_STAGGER_MS } from '../theme/motion';
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

function useHeroEntrance(index: number, active: boolean) {
  const opacity = useSharedValue(active ? 0 : 1);
  const translateY = useSharedValue(active ? MOTION_ENTRANCE_OFFSET_Y : 0);
  useEffect(() => {
    if (active) {
      const delay = index * MOTION_STAGGER_MS;
      opacity.set(withDelay(delay, withTiming(1, MOTION_FADE_TIMING)));
      translateY.set(withDelay(delay, withSpring(0, MOTION_SETTLE_SPRING)));
    }
  }, [active, index, opacity, translateY]);
  return useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateY: translateY.get() }],
  }));
}

export function EmptyState({ testID, pose, title, body, action, variant = 'default' }: EmptyStateProps) {
  const chunkyLip = useChunkyLip();
  const [accent, accentForeground] = useThemeColors(['accent', 'accent-foreground']);
  const reduceMotion = useReducedMotion();
  const stageStyle = useHeroEntrance(0, variant === 'hero');
  const titleStyle = useHeroEntrance(1, variant === 'hero');
  const bodyStyle = useHeroEntrance(2, variant === 'hero');
  const actionStyle = useHeroEntrance(3, variant === 'hero');
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
  const titleText = (
    <Text testID={`${testID}-title`} className={variant === 'hero' ? 'text-center text-26 font-black tracking-title text-foreground' : 'text-center text-lg font-bold text-foreground'}>
      {title}
    </Text>
  );
  const bodyText = (
    <Text testID={`${testID}-body`} className={variant === 'hero' ? 'text-center text-15 text-muted' : 'text-center font-normal text-muted'} style={variant === 'hero' ? { maxWidth: 290 } : undefined}>
      {body}
    </Text>
  );
  const actionButton = action ? (
    <Button testID={`${testID}-action`} className="h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={action.onPress}>
      {variant === 'hero' ? <Plus size={20} color={accentForeground} style={{ marginRight: 8 }} testID={`${testID}-action-icon`} /> : null}
      <Text className="text-17 font-extrabold text-accent-foreground">{action.label}</Text>
    </Button>
  ) : null;

  return (
    <View testID={testID} className="items-center gap-3 py-8">
      {variant === 'hero' ? (
        <Animated.View testID={`${testID}-stage`} className="h-65 w-70 items-center justify-center" style={stageStyle}>
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
        </Animated.View>
      ) : floatingPose}
      {variant === 'hero' ? <Animated.View testID={`${testID}-title-enter`} style={titleStyle}>{titleText}</Animated.View> : titleText}
      {variant === 'hero' ? <Animated.View testID={`${testID}-body-enter`} style={bodyStyle}>{bodyText}</Animated.View> : bodyText}
      {variant === 'hero' && action ? (
        <Animated.View testID={`${testID}-action-wrap`} className="w-full mt-2.5" style={actionStyle}>{actionButton}</Animated.View>
      ) : actionButton}
    </View>
  );
}
