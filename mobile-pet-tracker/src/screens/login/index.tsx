import { useChunkyLip } from '../../theme/chunky-lip';
import { Image } from 'expo-image';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { router } from 'expo-router';
import { Button, Input, Label, LinkButton, TextField } from 'heroui-native';
import { useContext, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { login } from '../../api/auth';
import { Card } from '../../components/card';
import { BackButton } from '../../components/back-button';
import { useAuth } from '../../providers/auth-provider';
import { PasswordInput } from '../../components/password-input';
import { FormError } from '../../components/form-error';
import { FieldErrorMessage } from '../../components/field-error-message';
import { useTranslate } from '../../providers/language-provider';
import { HomeEntrance } from '../home/home-entrance';
import { validateLogin, type FieldIssues } from '../../utils/account-rules';

export function LoginScreen() {
  const chunkyLip = useChunkyLip();
  const headerHeight = useContext(HeaderHeightContext);
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldIssues<'email' | 'password'>>({});
  const { signIn } = useAuth();
  const t = useTranslate();

  async function handleSubmit() {
    setFieldErrors({});
    setError(null);
    const values = { email: email.trim(), password };
    const issues = validateLogin(values);
    if (Object.keys(issues).length > 0) {
      setFieldErrors(issues);
      return;
    }
    setSubmitting(true);

    try {
      const result = await login(process.env.EXPO_PUBLIC_API_URL, values);

      switch (result.kind) {
        case 'ok':
          await signIn(result.accessToken);
          router.replace('/home');
          return;
        case 'invalid-credentials':
          setError(t('login.invalidCredentials'));
          return;
        case 'unreachable':
          setError(t('common.cannotReachServer'));
          return;
        case 'validation':
          setError(t('validation.checkDetails'));
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

  return (
    <KeyboardAvoidingView
      testID="screen-login"
      className="flex-1"
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        testID="login-form"
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
        <HomeEntrance testID="login-header" index={0} className="gap-4">
          <BackButton testID="login-back" fallback="/welcome" />
          <View testID="login-greeting" className="flex-row items-center gap-3">
            <Image
              testID="login-pingo"
              source={require('../../../assets/images/pingo-wave.webp')}
              style={{ width: 88, height: 88, transform: [{ rotate: '-8deg' }] }}
            />
            <Card testID="login-bubble" variant="secondary" className="flex-1 px-4 py-3">
              <Text testID="login-bubble-text" className="text-15 font-semibold text-foreground">
                {t('login.pingoGreeting')}
              </Text>
            </Card>
          </View>
          <Text className="text-3xl font-black text-foreground">
            {t('login.signIn')}
          </Text>
        </HomeEntrance>

        <HomeEntrance testID="login-body" index={1} className="flex-1 gap-4">
          <TextField isInvalid={Boolean(fieldErrors.email)}>
            <Label>
              <Text className="text-13 font-semibold text-muted">
                {t('login.email')}
              </Text>
            </Label>
            <Input
              testID="login-email"
              className="h-13 rounded-xl bg-default"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <FieldErrorMessage testID="login-email" issue={fieldErrors.email} />
          </TextField>

          <TextField isInvalid={Boolean(fieldErrors.password)}>
            <Label>
              <Text className="text-13 font-semibold text-muted">
                {t('login.password')}
              </Text>
            </Label>
            <PasswordInput
              testID="login-password"
              value={password}
              onChangeText={setPassword}
            />
            <FieldErrorMessage testID="login-password" issue={fieldErrors.password} />
          </TextField>

          <LinkButton
            testID="link-forgot"
            className="min-h-11 self-end"
            onPress={() => router.push('/forgot')}
          >
            <LinkButton.Label className="text-sm font-semibold text-accent-strong">
              {t('login.forgotPassword')}
            </LinkButton.Label>
          </LinkButton>

          {error ? (
            <FormError testID="login-error" message={error} />
          ) : null}

          <View testID="login-spacer" className="flex-1" />

          <Button
            testID="login-submit"
            className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary}
            isDisabled={submitting}
            onPress={() => void handleSubmit()}
          >
            <Text className="text-17 font-extrabold text-accent-foreground">
              {t('login.signIn')}
            </Text>
          </Button>

          <LinkButton
            testID="link-register"
            className="h-13 w-full"
            onPress={() => router.push('/register')}
          >
            <LinkButton.Label className="text-base font-bold text-accent-strong">
              {t('login.createAccount')}
            </LinkButton.Label>
          </LinkButton>
        </HomeEntrance>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
