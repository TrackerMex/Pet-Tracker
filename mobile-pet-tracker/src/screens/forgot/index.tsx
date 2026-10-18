import { Image } from 'expo-image';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { router } from 'expo-router';
import { Button, FieldError, Input, Label, LinkButton, TextField } from 'heroui-native';
import { useContext, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock } from 'reicon-react-native';

import { forgotPassword } from '../../api/auth';
import { BackButton } from '../../components/back-button';
import { PopIn } from '../../components/pop-in';
import { PingoFloat } from '../../components/pingo-float';
import { FormError } from '../../components/form-error';
import { useTranslate } from '../../providers/language-provider';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { validateForgot, type FieldIssues } from '../../utils/account-rules';

export function ForgotScreen() {
  const headerHeight = useContext(HeaderHeightContext);
  const [accentForeground] = useThemeColors(['accent-foreground']);
  const insets = useSafeAreaInsets();
  const t = useTranslate();
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldIssues<'email'>>({});

  async function submit() {
    setFieldErrors({});
    setError(null);
    const values = { email: email.trim() };
    const issues = validateForgot(values);
    if (Object.keys(issues).length > 0) {
      setFieldErrors(issues);
      return;
    }
    await send(values.email);
  }

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
          setError(t('validation.checkDetails'));
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
          alignItems: 'center',
          padding: 24,
          gap: 16,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View testID="forgot-top" className="w-full">
          <BackButton testID="forgot-back" fallback="/login" />
        </View>
        <PingoFloat testID="forgot-pingo-float">
          <Image
            testID="forgot-pingo"
            source={require('../../../assets/images/pingo-talk.webp')}
            style={{ width: 120, height: 120, transform: [{ rotate: '6deg' }] }}
          />
        </PingoFloat>
        <PopIn
          testID="forgot-lock-tile"
          className="size-13 items-center justify-center rounded-xl border-b-4 border-black/25 bg-accent"
          style={CONTINUOUS_CORNER}
        >
          <Lock size={26} color={accentForeground} />
        </PopIn>
        <Text testID="forgot-title" className="text-center text-3xl font-black text-foreground">
          {sent ? t('forgot.checkYourEmail') : t('forgot.forgotPassword')}
        </Text>
        <Text testID="forgot-body" className="text-center text-15 font-normal text-muted">
          {sent ? t('forgot.sentTo', { email: submittedEmail }) : t('forgot.instructions')}
        </Text>

        {!sent ? (
          <TextField className="w-full" isInvalid={Boolean(fieldErrors.email)}>
            <Label>
              <Text className="text-13 font-semibold text-muted">
                {t('forgot.email')}
              </Text>
            </Label>
            <Input
              testID="forgot-email"
              className="h-13 rounded-xl bg-default"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
            />
            <FieldError testID="forgot-email-error">
              {fieldErrors.email ? <FormError testID="forgot-email-message" message={t(fieldErrors.email.labelKey, fieldErrors.email.params)} /> : null}
            </FieldError>
          </TextField>
        ) : null}

        {error ? (
          <FormError testID="forgot-error" message={error} />
        ) : null}

        <View testID="forgot-spacer" className="flex-1" />

        {!sent ? (
          <Button
            testID="forgot-submit"
            className="w-full h-14 rounded-xl bg-accent border-b-4 border-black/25"
            isDisabled={email.trim() === '' || submitting}
            onPress={() => void submit()}
          >
            <Button.Label className="text-17 font-extrabold text-accent-foreground">
              {t('forgot.sendRecoveryLink')}
            </Button.Label>
          </Button>
        ) : null}

        {sent ? (
          <Button
            testID="forgot-resend"
            variant="secondary"
            className="w-full h-14 rounded-xl border-2 border-b-6 border-lip-gray bg-surface"
            isDisabled={submitting}
            onPress={() => void send(submittedEmail)}
          >
            <Button.Label className="text-17 font-extrabold text-foreground">
              {t('forgot.resend')}
            </Button.Label>
          </Button>
        ) : null}

        <LinkButton testID="link-login" className="h-13 w-full" onPress={() => router.push('/login')}>
          <LinkButton.Label className="text-base font-bold text-accent-strong">
            {t('forgot.backToSignIn')}
          </LinkButton.Label>
        </LinkButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
