import { useChunkyLip } from '../../theme/chunky-lip';
import { Image } from 'expo-image';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { router } from 'expo-router';
import { Button, Input, Label, LinkButton, TextField } from 'heroui-native';
import { useContext, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock } from 'reicon-react-native';

import { forgotPassword } from '../../api/auth';
import { BackButton } from '../../components/back-button';
import { PopIn } from '../../components/pop-in';
import { RiseIn } from '../../components/rise-in';
import { FormError } from '../../components/form-error';
import { FieldErrorMessage } from '../../components/field-error-message';
import { useTranslate } from '../../providers/language-provider';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { validateForgot, type FieldIssues } from '../../utils/account-rules';

export function ForgotScreen() {
  const chunkyLip = useChunkyLip();
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
          paddingHorizontal: 20,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View testID="forgot-top" className="-ml-2.5 w-full">
          <BackButton testID="forgot-back" fallback="/login" />
        </View>
        <RiseIn testID="forgot-scene" delayMs={0} className="mt-4 h-37.5 w-42">
          <View
            testID="forgot-scene-backdrop"
            className="absolute inset-x-2.5 top-3.5 bottom-0 rounded-40 bg-surface-secondary"
            style={CONTINUOUS_CORNER}
          />
          <Image
            testID="forgot-pingo"
            source={require('../../../assets/images/pingo-talk.webp')}
            style={{ position: 'absolute', left: 24, top: 0, width: 120, height: 120, transform: [{ rotate: '6deg' }] }}
          />
          <PopIn
            testID="forgot-lock-tile"
            className="absolute bottom-1.5 right-0 size-13 items-center justify-center bg-accent rounded-16"
            style={[CONTINUOUS_CORNER, chunkyLip.primary]}
          >
            <Lock size={26} color={accentForeground} />
          </PopIn>
        </RiseIn>
        <Text
          testID="forgot-title"
          className="mt-7 text-center text-28 leading-8.5 font-black tracking-display text-foreground"
        >
          {sent ? t('forgot.checkYourEmail') : t('forgot.forgotPassword')}
        </Text>
        <Text testID="forgot-body" className="mt-2.5 max-w-80 text-center text-15 leading-5.5 font-normal text-muted">
          {sent ? t('forgot.sentTo', { email: submittedEmail }) : t('forgot.instructions')}
        </Text>

        {!sent ? (
          <TextField className="mt-7 w-full" isInvalid={Boolean(fieldErrors.email)}>
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
            <FieldErrorMessage testID="forgot-email" issue={fieldErrors.email} />
          </TextField>
        ) : null}

        {error ? (
          <FormError testID="forgot-error" message={error} />
        ) : null}

        <View testID="forgot-spacer" className="flex-1" />

        <View testID="forgot-actions" className="w-full gap-3.5">
          {!sent ? (
            <Button
              testID="forgot-submit"
              className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary}
              isDisabled={email.trim() === '' || submitting}
              onPress={() => void submit()}
            >
              <Text className="text-17 font-extrabold text-accent-foreground">
                {t('forgot.sendRecoveryLink')}
              </Text>
            </Button>
          ) : null}

          {sent ? (
            <Button
              testID="forgot-resend"
              variant="secondary"
              className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface" style={chunkyLip.neutral}
              isDisabled={submitting}
              onPress={() => void send(submittedEmail)}
            >
              <Text className="text-17 font-extrabold text-foreground">
                {t('forgot.resend')}
              </Text>
            </Button>
          ) : null}

          <LinkButton testID="link-login" className="h-13 w-full" onPress={() => router.push('/login')}>
            <LinkButton.Label className="text-base font-bold text-accent-strong">
              {t('forgot.backToSignIn')}
            </LinkButton.Label>
          </LinkButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
