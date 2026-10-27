import { useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Button } from 'heroui-native';
import { useState } from 'react';
import { ScrollView, Share, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Copy, Lock, Share as ShareIcon } from 'reicon-react-native';

import { ScreenHeader } from '../../components/screen-header';
import { useLocale, useTranslate } from '../../providers/language-provider';
import { useChunkyLip } from '../../theme/chunky-lip';
import { useThemeColors } from '../../theme/use-theme-colors';
import { formatInviteCode, inviteDateParts } from '../../utils/pet-members';

export default function PetInviteScreen() {
  const { petName, inviterName, code, expiresAt } = useLocalSearchParams<{ petId: string; petName: string; inviterName: string; code: string; expiresAt: string }>();
  const t = useTranslate();
  const locale = useLocale();
  const insets = useSafeAreaInsets();
  const chunkyLip = useChunkyLip();
  const [copied, setCopied] = useState(false);
  const [foreground, muted, accentForeground] = useThemeColors(['foreground', 'muted', 'accent-foreground']);
  const valid = Boolean(code && expiresAt && !Number.isNaN(new Date(expiresAt).getTime()));
  const dates = valid ? inviteDateParts(expiresAt, locale) : { date: '', time: '' };
  const formattedCode = formatInviteCode(code ?? '');
  const shareText = t('invite.shareMessage', { inviterName, petName, code: formattedCode, ...dates });

  async function copyCode() {
    try {
      await Clipboard.setStringAsync(formatInviteCode(code));
      setCopied(true);
    } catch {
      // #214 R15: leave the copy label unchanged when the native call rejects.
    }
  }

  return (
    <View testID="screen-pet-invite" className="flex-1 bg-background">
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24, gap: 12, flexGrow: 1 }}>
        <ScreenHeader testID="pet-invite-header" size={24} backFallback="/profile" title={t('invite.title', { petName })} />
        {valid ? (
          <>
            <Text testID="pet-invite-intro" className="text-sm leading-note text-muted">{t('invite.intro', { petName })}</Text>
            <View testID="pet-invite-code-card" className="items-center gap-2.5 rounded-24 bg-surface-secondary px-4 py-6" accessibilityLabel={t('invite.codeLabel')}>
              <Text testID="pet-invite-code-label" className="text-13 font-extrabold text-accent-strong">{t('invite.codeLabel')}</Text>
              <Text testID="pet-invite-code" className="font-mono text-3xl font-black tracking-eyebrow text-foreground" selectable>{formattedCode}</Text>
              <Text testID="pet-invite-expires" className="text-13 font-bold text-muted">{t('invite.expiresOnce', dates)}</Text>
            </View>
            <Text testID="pet-invite-message-label" className="text-sm font-extrabold text-foreground">{t('invite.messageLabel')}</Text>
            <View className="rounded-tile bg-default p-3.5">
              <Text testID="pet-invite-message" className="text-sm font-semibold text-foreground" selectable>{shareText}</Text>
            </View>
            <View className="flex-row items-center gap-2.5">
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Lock size={18} color={muted} /></View>
              <Text testID="pet-invite-role-note" className="flex-1 text-13 font-semibold text-muted">{t('invite.roleNote', { petName })}</Text>
            </View>
            <View style={{ flexGrow: 1 }} />
            <Button testID="pet-invite-share" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={() => { void Share.share({ message: shareText }).catch(() => undefined); }}>
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><ShareIcon size={20} color={accentForeground} /></View>
              <Text className="text-17 font-extrabold text-accent-foreground">{t('invite.share')}</Text>
            </Button>
            <Button testID="pet-invite-copy" variant="outline" className="w-full h-13.5 rounded-16 border-2 border-lip-gray bg-surface" style={chunkyLip.neutral} onPress={() => void copyCode()}>
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Copy size={20} color={foreground} /></View>
              <Text testID="pet-invite-copy-label" className="text-base font-extrabold text-foreground">{copied ? t('invite.copied') : t('invite.copy')}</Text>
            </Button>
          </>
        ) : <Text testID="pet-invite-invalid" className="text-sm font-semibold text-danger">{t('common.somethingWentWrong')}</Text>}
      </ScrollView>
    </View>
  );
}
