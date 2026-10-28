import { useChunkyLip } from '../../theme/chunky-lip';
import { Image } from 'expo-image';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Label, LinkButton, TextField } from 'heroui-native';
import { useContext, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'reicon-react-native';

import { resetPassword } from '../../api/auth';
import { PopIn } from '../../components/pop-in';
import { RiseIn } from '../../components/rise-in';
import { PasswordInput } from '../../components/password-input';
import { FormError } from '../../components/form-error';
import { FieldErrorMessage } from '../../components/field-error-message';
import { useTranslate } from '../../providers/language-provider';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import { validateResetPassword, type FieldIssues } from '../../utils/account-rules';

export function ResetPasswordScreen() {
  const chunkyLip = useChunkyLip();
  const headerHeight = useContext(HeaderHeightContext);
  const [accentForeground] = useThemeColors(['accent-foreground']);
  const { token } = useLocalSearchParams<{ token?: string }>();
  const insets = useSafeAreaInsets();
  const t = useTranslate();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldIssues<'password' | 'passwordConfirmation'>>({});
  const [succeeded, setSucceeded] = useState(false);
  const normalizedToken = token?.trim() ?? '';

  async function handleSubmit() {
    setFieldErrors({});
    setError(null);
    const values = { password, passwordConfirmation };
    const issues = validateResetPassword(values);
    if (Object.keys(issues).length > 0) {
      setFieldErrors(issues);
      return;
    }
    setSubmitting(true);

    try {
      const result = await resetPassword(process.env.EXPO_PUBLIC_API_URL, {
        token: normalizedToken,
        ...values,
      });

      switch (result.kind) {
        case 'ok':
          setSucceeded(true);
          return;
        case 'invalid-token':
          setError(t('resetPassword.errorInvalidToken'));
          return;
        case 'expired':
          setError(t('resetPassword.errorExpiredToken'));
          return;
        case 'validation':
          setError(t('validation.checkDetails'));
          return;
        case 'unreachable':
          setError(t('common.cannotReachServer'));
          return;
        case 'error':
        case 'missing-config':
          setError(t('common.somethingWentWrong'));
      }
    } catch {
      setError(t('common.somethingWentWrong'));
    } finally {
      setSubmitting(false);
    }
  }

  if (!normalizedToken) {
    return (
      <ScrollView
        testID="screen-reset-password"
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
        <Text className="text-center text-2xl font-black text-foreground">
          {t('resetPassword.resetPassword')}
        </Text>
        <Text
          testID="reset-missing-token"
          className="text-center text-danger"
          selectable
        >
          {t('resetPassword.errorMissingToken')}
        </Text>
        <LinkButton testID="link-login" onPress={() => router.push('/login')}>
          <LinkButton.Label className="font-semibold text-accent-strong">
            {t('resetPassword.backToSignIn')}
          </LinkButton.Label>
        </LinkButton>
      </ScrollView>
    );
  }

  if (succeeded) {
    return (
      <ScrollView
        testID="screen-reset-password"
        className="flex-1 bg-background"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: insets.top + 56,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <RiseIn testID="reset-header" delayMs={0} className="flex-row items-center gap-3.5">
          <Image
            testID="reset-pingo"
            source={require('../../../assets/images/orbit-clipboard.webp')}
            style={{ width: 72, height: 72 }}
          />
          <Text className="flex-1 text-28 leading-8 font-black tracking-display text-foreground">
            {t('resetPassword.resetPassword')}
          </Text>
        </RiseIn>
        <PopIn testID="reset-success-pop" className="mt-6 w-full">
          <View
            testID="reset-success-card"
            accessibilityLiveRegion="polite"
            className="flex-row items-center gap-3 rounded-16 bg-surface-secondary px-4 py-3.5"
            style={CONTINUOUS_CORNER}
          >
            <View testID="reset-success-check" className="size-8 items-center justify-center rounded-full bg-accent">
              <Check size={18} color={accentForeground} />
            </View>
            <Text testID="reset-success" className="flex-1 text-15 font-bold text-accent-strong" selectable>
              {t('resetPassword.passwordUpdated')}
            </Text>
          </View>
        </PopIn>
        <View testID="reset-spacer" className="flex-1" />
        <LinkButton
          testID="link-login"
          className="h-13 w-full"
          onPress={() => router.push('/login')}
        >
          <LinkButton.Label className="text-base font-bold text-accent-strong">
            {t('resetPassword.backToSignIn')}
          </LinkButton.Label>
        </LinkButton>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      testID="screen-reset-password"
      className="flex-1"
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        testID="reset-password-form"
        className="flex-1 bg-background"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: insets.top + 56,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <RiseIn testID="reset-header" delayMs={0} className="flex-row items-center gap-3.5">
          <Image
            testID="reset-pingo"
            source={require('../../../assets/images/orbit-clipboard.webp')}
            style={{ width: 72, height: 72 }}
          />
          <Text className="flex-1 text-28 leading-8 font-black tracking-display text-foreground">
            {t('resetPassword.resetPassword')}
          </Text>
        </RiseIn>

        <RiseIn testID="reset-body" delayMs={100} className="mt-8 flex-1 gap-4">
          <TextField isInvalid={Boolean(fieldErrors.password)}>
            <Label>
              <Text className="text-13 font-semibold text-muted">
                {t('resetPassword.newPassword')}
              </Text>
            </Label>
            <PasswordInput
              testID="reset-password"
              autoCapitalize="none"
              autoComplete="new-password"
              value={password}
              onChangeText={setPassword}
            />
            <FieldErrorMessage testID="reset-password" issue={fieldErrors.password} />
          </TextField>

          <TextField isInvalid={Boolean(fieldErrors.passwordConfirmation)}>
            <Label>
              <Text className="text-13 font-semibold text-muted">
                {t('resetPassword.confirmNewPassword')}
              </Text>
            </Label>
            <PasswordInput
              testID="reset-password-confirm"
              autoCapitalize="none"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
            />
            <FieldErrorMessage testID="reset-password-confirm" issue={fieldErrors.passwordConfirmation} />
          </TextField>

          {error ? (
            <FormError testID="reset-error" message={error} />
          ) : null}

          <View testID="reset-spacer" className="flex-1" />

          <Button
            testID="reset-submit"
            className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary}
            isDisabled={submitting}
            onPress={() => void handleSubmit()}
          >
            <Text className="text-17 font-extrabold text-accent-foreground">
              {t('resetPassword.updatePassword')}
            </Text>
          </Button>
          <LinkButton testID="link-login" className="h-13 w-full" onPress={() => router.push('/login')}>
            <LinkButton.Label className="text-base font-bold text-accent-strong">
              {t('resetPassword.backToSignIn')}
            </LinkButton.Label>
          </LinkButton>
        </RiseIn>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
