import { HeaderHeightContext } from 'expo-router/react-navigation';
import { router } from 'expo-router';
import { Button, Input, Label, LinkButton, TextField } from 'heroui-native';
import { useContext } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock } from 'reicon-react-native';

import { useTranslate } from '../../providers/language-provider';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';

export function ForgotScreen() {
  const headerHeight = useContext(HeaderHeightContext);
  const [accentStrong] = useThemeColors(['accent-strong']);
  const insets = useSafeAreaInsets();
  const t = useTranslate();

  return (
    <KeyboardAvoidingView
      testID="screen-forgot"
      className="flex-1"
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        testID="forgot-form"
        className="flex-1 bg-background"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
          gap: 16,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View
          className="size-16 items-center justify-center rounded-xl bg-accent-soft"
          style={CONTINUOUS_CORNER}
        >
          <Lock size={28} color={accentStrong} />
        </View>
        <Text testID="forgot-title" className="text-center text-2xl font-black text-foreground">
          {t('forgot.forgotPassword')}
        </Text>
        <Text testID="forgot-body" className="text-center font-normal text-muted">
          {t('forgot.instructions')}
        </Text>

        <TextField className="w-full" isDisabled>
          <Label className="text-xs font-semibold text-foreground">
            {t('forgot.email')}
          </Label>
          <Input
            testID="forgot-email"
            className="rounded-xl bg-default"
            autoCapitalize="none"
            editable={false}
            keyboardType="email-address"
          />
        </TextField>

        <Button
          testID="forgot-submit"
          className="w-full rounded-xl bg-accent"
          isDisabled
        >
          <Button.Label className="font-bold text-accent-foreground">
            {t('forgot.sendRecoveryLink')}
          </Button.Label>
        </Button>

        <LinkButton testID="link-login" onPress={() => router.push('/login')}>
          <LinkButton.Label className="font-semibold text-accent-strong">
            {t('forgot.backToSignIn')}
          </LinkButton.Label>
        </LinkButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
