import { Image } from 'expo-image';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Input, Label, LinkButton, TextField } from 'heroui-native';
import { useContext, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'reicon-react-native';

import { resetPassword } from '../../api/auth';
import { Card } from '../../components/card';
import { PopIn } from '../../components/pop-in';
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
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
          gap: 16,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <HomeEntrance testID="reset-header" index={3} className="items-center gap-8">
          <Image
            testID="reset-pingo"
            source={require('../../../assets/images/pingo-clipboard.webp')}
            style={{ width: 72, height: 72 }}
          />
          <Text className="text-center text-2xl font-black text-foreground">
            {t('resetPassword.resetPassword')}
          </Text>
        </HomeEntrance>
        <PopIn testID="reset-success-pop" className="w-full">
          <Card testID="reset-success-card" variant="secondary" className="flex-row items-center gap-3 px-4 py-3.5">
            <View testID="reset-success-check" className="size-8 items-center justify-center rounded-full bg-accent">
              <Check size={18} color={accentForeground} />
            </View>
            <Text testID="reset-success" className="flex-1 font-bold text-accent-strong" selectable>
              {t('resetPassword.passwordUpdated')}
            </Text>
          </Card>
        </PopIn>
        <LinkButton
          testID="link-login"
          className="self-center"
          onPress={() => router.push('/login')}
        >
          <LinkButton.Label className="font-semibold text-accent-strong">
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
          justifyContent: 'center',
          padding: 24,
          gap: 16,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <HomeEntrance testID="reset-body" index={1} className="gap-4">
          <Text testID="reset-error" className="text-danger" selectable>
            {error}
          </Text>

          <TextField>
            <Label className="text-xs font-semibold text-foreground">
              {t('resetPassword.newPassword')}
            </Label>
            <Input
              testID="reset-password"
              className="rounded-xl bg-default"
              autoCapitalize="none"
              autoComplete="new-password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </TextField>

          <TextField>
            <Label className="text-xs font-semibold text-foreground">
              {t('resetPassword.confirmNewPassword')}
            </Label>
            <Input
              testID="reset-password-confirm"
              className="rounded-xl bg-default"
              autoCapitalize="none"
              autoComplete="new-password"
              secureTextEntry
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
            />
          </TextField>

          <Button
            testID="reset-submit"
            className="w-full rounded-xl bg-accent border-b-4 border-black/25"
            isDisabled={submitting}
            onPress={() => void handleSubmit()}
          >
            <Button.Label className="font-bold text-accent-foreground">
              {t('resetPassword.updatePassword')}
            </Button.Label>
          </Button>
        </HomeEntrance>

        <HomeEntrance testID="reset-header" index={0} className="flex-row items-center justify-center gap-3">
          <Image
            testID="reset-pingo"
            source={require('../../../assets/images/pingo-clipboard.webp')}
            style={{ width: 72, height: 72 }}
          />
          <Text className="text-center text-2xl font-black text-foreground">
            {t('resetPassword.resetPassword')}
          </Text>
        </HomeEntrance>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
