import { Image } from 'expo-image';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Label, LinkButton, TextField } from 'heroui-native';
import { useContext, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'reicon-react-native';

import { resetPassword } from '../../api/auth';
import { Card } from '../../components/card';
import { PopIn } from '../../components/pop-in';
import { PingoFloat } from '../../components/pingo-float';
import { PasswordInput } from '../../components/password-input';
import { FormError } from '../../components/form-error';
import { useTranslate } from '../../providers/language-provider';
import { useThemeColors } from '../../theme/use-theme-colors';
import { HomeEntrance } from '../home/home-entrance';

export function ResetPasswordScreen() {
  const headerHeight = useContext(HeaderHeightContext);
  const [accentForeground] = useThemeColors(['accent-foreground']);
  const { token } = useLocalSearchParams<{ token?: string }>();
  const insets = useSafeAreaInsets();
  const t = useTranslate();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const normalizedToken = token?.trim() ?? '';

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const result = await resetPassword(process.env.EXPO_PUBLIC_API_URL, {
        token: normalizedToken,
        password,
        passwordConfirmation,
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
          setError(result.errors.map(({ message }) => message).join('\n'));
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
          padding: 24,
          gap: 16,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <HomeEntrance testID="reset-header" index={0} className="flex-row items-center gap-3">
          <PingoFloat testID="reset-pingo-float">
            <Image
              testID="reset-pingo"
              source={require('../../../assets/images/pingo-clipboard.webp')}
              style={{ width: 72, height: 72 }}
            />
          </PingoFloat>
          <Text className="flex-1 text-3xl font-black text-foreground">
            {t('resetPassword.resetPassword')}
          </Text>
        </HomeEntrance>
        <PopIn testID="reset-success-pop" className="w-full">
          <Card testID="reset-success-card" accessibilityLiveRegion="polite" variant="secondary" className="flex-row items-center gap-3 px-4 py-3.5">
            <View testID="reset-success-check" className="size-8 items-center justify-center rounded-full bg-accent">
              <Check size={18} color={accentForeground} />
            </View>
            <Text testID="reset-success" className="flex-1 text-15 font-bold text-accent-strong" selectable>
              {t('resetPassword.passwordUpdated')}
            </Text>
          </Card>
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
          padding: 24,
          gap: 16,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <HomeEntrance testID="reset-header" index={0} className="flex-row items-center gap-3">
          <PingoFloat testID="reset-pingo-float">
            <Image
              testID="reset-pingo"
              source={require('../../../assets/images/pingo-clipboard.webp')}
              style={{ width: 72, height: 72 }}
            />
          </PingoFloat>
          <Text className="flex-1 text-3xl font-black text-foreground">
            {t('resetPassword.resetPassword')}
          </Text>
        </HomeEntrance>

        <HomeEntrance testID="reset-body" index={1} className="flex-1 gap-4">
          <TextField>
            <Label>
              <Label.Text className="text-13 font-semibold text-muted">
                {t('resetPassword.newPassword')}
              </Label.Text>
            </Label>
            <PasswordInput
              testID="reset-password"
              autoCapitalize="none"
              autoComplete="new-password"
              value={password}
              onChangeText={setPassword}
            />
          </TextField>

          <TextField>
            <Label>
              <Label.Text className="text-13 font-semibold text-muted">
                {t('resetPassword.confirmNewPassword')}
              </Label.Text>
            </Label>
            <PasswordInput
              testID="reset-password-confirm"
              autoCapitalize="none"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
            />
          </TextField>

          {error ? (
            <FormError testID="reset-error" message={error} />
          ) : null}

          <View testID="reset-spacer" className="flex-1" />

          <Button
            testID="reset-submit"
            className="w-full rounded-xl bg-accent border-b-4 border-black/25"
            isDisabled={submitting}
            onPress={() => void handleSubmit()}
          >
            <Button.Label className="text-17 font-extrabold text-accent-foreground">
              {t('resetPassword.updatePassword')}
            </Button.Label>
          </Button>
          <LinkButton testID="link-login" className="h-13 w-full" onPress={() => router.push('/login')}>
            <LinkButton.Label className="text-base font-bold text-accent-strong">
              {t('resetPassword.backToSignIn')}
            </LinkButton.Label>
          </LinkButton>
        </HomeEntrance>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
