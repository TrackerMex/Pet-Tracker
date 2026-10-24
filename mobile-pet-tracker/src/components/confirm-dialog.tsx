import { Modal, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import { MOTION_TRANSITION_MS } from '../theme/motion';
import { useShadows } from '../theme/shadows';
import { Card } from './card';
import { RiseIn } from './rise-in';

const SCRIM = 'rgba(13,17,23,0.4)';

type ConfirmDialogProps = {
  testID: string;
  visible: boolean;
  title: string;
  body: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({ testID, visible, title, body, cancelLabel, confirmLabel, onCancel, onConfirm }: ConfirmDialogProps) {
  const shadows = useShadows();
  const reduceMotion = useReducedMotion();
  if (!visible) return null;

  return (
    <Modal transparent animationType="none" statusBarTranslucent onRequestClose={onCancel}>
      <View testID={testID} className="flex-1 justify-center px-7">
        <Animated.View className="absolute inset-0" style={{ backgroundColor: SCRIM }} entering={reduceMotion ? undefined : FadeIn.duration(MOTION_TRANSITION_MS)}>
          <Pressable testID={`${testID}-scrim`} className="absolute inset-0" accessibilityLabel={cancelLabel} onPress={onCancel} />
        </Animated.View>
        <RiseIn delayMs={0}>
          <Card testID={`${testID}-card`} role="alertdialog" className="gap-3 rounded-hero px-6 pt-6 pb-3 shadow-none" style={shadows.dialog}>
            <Text testID={`${testID}-title`} role="header" className="text-xl font-black tracking-dialog text-foreground">{title}</Text>
            <Text testID={`${testID}-body`} className="text-sm leading-normal text-muted">{body}</Text>
            <View className="mt-1 flex-row justify-end gap-1">
              <Pressable testID={`${testID}-cancel`} role="button" className="min-h-12 justify-center px-4" onPress={onCancel}>
                <Text className="text-15 font-extrabold text-accent-strong">{cancelLabel}</Text>
              </Pressable>
              <Pressable testID={`${testID}-confirm`} role="button" className="min-h-12 justify-center px-4" onPress={onConfirm}>
                <Text className="text-15 font-extrabold text-danger">{confirmLabel}</Text>
              </Pressable>
            </View>
          </Card>
        </RiseIn>
      </View>
    </Modal>
  );
}
