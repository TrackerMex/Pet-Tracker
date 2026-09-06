import { router } from 'expo-router';
import { Button, Input, Label, LinkButton, TextField } from 'heroui-native';
import { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { login } from '../../api/auth';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';

export default function Login() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const t = useTranslate();

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const result = await login(process.env.EXPO_PUBLIC_API_URL, { email, password });

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
          setError(result.errors.map(({ message }) => message).join('\n'));
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
    <ScrollView
      testID="screen-login"
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
      <Text className="text-center text-2xl font-black text-foreground">
        {t('login.signIn')}
      </Text>

      <TextField>
        <Label className="text-xs font-semibold text-foreground">
          {t('login.email')}
        </Label>
        <Input
          testID="login-email"
          className="rounded-xl bg-default"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </TextField>

      <TextField>
        <Label className="text-xs font-semibold text-foreground">
          {t('login.password')}
        </Label>
        <Input
          testID="login-password"
          className="rounded-xl bg-default"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </TextField>

      {error ? (
        <Text testID="login-error" className="text-danger">
          {error}
        </Text>
      ) : null}

      <Button
        testID="login-submit"
        className="w-full rounded-xl bg-accent"
        isDisabled={submitting}
        onPress={() => void handleSubmit()}
      >
        <Button.Label className="font-bold text-accent-foreground">
          {t('login.signIn')}
        </Button.Label>
      </Button>

      <LinkButton
        testID="link-register"
        className="self-center"
        onPress={() => router.push('/register')}
      >
        <LinkButton.Label className="font-semibold text-accent-strong">
          {t('login.createAccount')}
        </LinkButton.Label>
      </LinkButton>
      <LinkButton
        testID="link-forgot"
        className="self-center"
        onPress={() => router.push('/forgot')}
      >
        <LinkButton.Label className="font-semibold text-accent-strong">
          {t('login.forgotPassword')}
        </LinkButton.Label>
      </LinkButton>
    </ScrollView>
  );
}
