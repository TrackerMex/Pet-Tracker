import { Image } from 'expo-image';
import { Button } from 'heroui-native';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InfoCircle } from 'reicon-react-native';

import { acceptInvite } from '../../api/pet-members';
import { PingRing } from '../../components/ping-ring';
import { PingoFloat } from '../../components/pingo-float';
import { ScreenHeader } from '../../components/screen-header';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { useChunkyLip } from '../../theme/chunky-lip';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';

const PINGO_SOURCE = require('../../../assets/images/pingo-collar.webp');

export default function JoinPetScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const chunkyLip = useChunkyLip();
  const [foreground, muted, accentStrong] = useThemeColors(['foreground', 'muted', 'accent-strong']);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const border = 'border-accent';

  async function submit() {
    if (input.trim() === '' || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      await acceptInvite(baseUrl, token ?? '', input.trim());
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView testID="screen-join-pet" behavior="padding" className="flex-1 bg-background">
      <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24, gap: 16, flexGrow: 1 }}>
        <ScreenHeader testID="join-pet-header" backFallback="/home" />
        <View testID="join-pet-hero" className="h-37.5 w-50 items-center justify-center self-center" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <PingRing testID="join-pet-ring" delay={0} className="size-32.5 rounded-full border-3 border-accent" />
          <View className="absolute size-30 rounded-full bg-surface-secondary" />
          <PingoFloat testID="join-pet-pingo-float">
            <Image testID="join-pet-pingo" source={PINGO_SOURCE} style={{ width: 104, height: 104 }} contentFit="contain" />
          </PingoFloat>
        </View>
        <Text testID="join-pet-title" accessibilityRole="header" className="text-center text-28 font-black tracking-title text-foreground">{t('joinPet.title')}</Text>
        <View testID="join-pet-note" className="flex-row items-center gap-2.5 rounded-tile bg-default px-3.5 py-3">
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><InfoCircle size={20} color={foreground} /></View>
          <Text className="flex-1 text-13 font-semibold leading-note text-foreground">{t('joinPet.note')}</Text>
        </View>
        <Text testID="join-pet-label" className="text-sm font-extrabold text-foreground">{t('invite.codeLabel')}</Text>
        <TextInput testID="join-pet-input" placeholder="XXXXX-XXXXX" placeholderTextColor={muted} maxLength={11} autoCapitalize="characters" autoCorrect={false} autoComplete="off" accessibilityLabel={t('invite.codeLabel')} className={`h-15 rounded-14 border-2 ${border} bg-default px-4 font-mono text-24 tracking-code text-foreground`} style={CONTINUOUS_CORNER} value={input} onChangeText={setInput} />
        <Text testID="join-pet-hint" className="text-13 font-semibold text-muted">{t('joinPet.hint')}</Text>
        <View style={{ flexGrow: 1 }} />
        <Button testID="join-pet-submit" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} isDisabled={input.trim() === '' || busy} onPress={() => void submit()}>
          <Text className="text-17 font-extrabold text-accent-foreground">{t('joinPet.submit')}</Text>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
