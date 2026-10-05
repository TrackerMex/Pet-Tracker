import { HeaderHeightContext } from 'expo-router/react-navigation';
import { router } from 'expo-router';
import { Button, Input, Label, LinkButton, TextField } from 'heroui-native';
import { useContext, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock } from 'reicon-react-native';

import { forgotPassword } from '../../api/auth';
import { useTranslate } from '../../providers/language-provider';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';

export function ForgotScreen() {
  const headerHeight = useContext(HeaderHeightContext);
  const [accentStrong] = useThemeColors(['accent-strong']);
  const insets = useSafeAreaInsets();
  const t = useTranslate();
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(target: string) {
    setSubmitting(true);
    setError(null);
    try {
      const result = await forgotPassword(process.env.EXPO_PUBLIC_API_URL, { email: target });
      switch (result.kind) {
        case 'ok':
          setSubmittedEmail(target);
          setSent(true);
          return;
        case 'validation':
          setError(t('forgot.invalidEmail'));
          return;
        case 'rate-limited':
          setError(t('forgot.tooManyAttempts'));
          return;
        case 'unreachable':
          setError(t('common.cannotReachServer'));
          return;
        case 'error':
        case 'missing-config':
          setError(t('common.somethingWentWrong'));
      }
    } finally {
      setSubmitting(false);
    }
  }

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
          {sent ? t('forgot.checkYourEmail') : t('forgot.forgotPassword')}
        </Text>
        <Text testID="forgot-body" className="text-center font-normal text-muted">
          {sent ? t('forgot.sentTo', { email: submittedEmail }) : t('forgot.instructions')}
        </Text>

        {!sent ? (
          <TextField className="w-full">
            <Label className="text-xs font-semibold text-foreground">
              {t('forgot.email')}
            </Label>
            <Input
              testID="forgot-email"
              className="rounded-xl bg-default"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
            />
          </TextField>
        ) : null}

        {error ? (
          <Text testID="forgot-error" className="text-danger" selectable>
            {error}
          </Text>
        ) : null}

        {!sent ? (
          <Button
            testID="forgot-submit"
            className="w-full rounded-xl bg-accent"
            isDisabled={email.trim() === '' || submitting}
            onPress={() => void send(email.trim())}
          >
            <Button.Label className="font-bold text-accent-foreground">
              {t('forgot.sendRecoveryLink')}
            </Button.Label>
          </Button>
        ) : null}

        {sent ? (
          <Button
            testID="forgot-resend"
            variant="secondary"
            className="w-full rounded-xl"
            isDisabled={submitting}
            onPress={() => void send(submittedEmail)}
          >
            <Button.Label className="font-bold text-foreground">
              {t('forgot.resend')}
            </Button.Label>
          </Button>
        ) : null}

        <LinkButton testID="link-login" onPress={() => router.push('/login')}>
          <LinkButton.Label className="font-semibold text-accent-strong">
            {t('forgot.backToSignIn')}
          </LinkButton.Label>
        </LinkButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
