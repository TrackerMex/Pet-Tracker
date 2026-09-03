import { router } from 'expo-router';
import { Button, Input, Label, LinkButton, TextField } from 'heroui-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { login } from '../../api/auth';
import { useAuth } from '../../providers/auth-provider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

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
          setError('Invalid credentials');
          return;
        case 'unreachable':
          setError('Cannot reach server');
          return;
        case 'validation':
          setError(result.errors.map(({ message }) => message).join('\n'));
          return;
        case 'error':
        case 'missing-config':
          setError('Something went wrong');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View className="flex-1 justify-center gap-4 bg-background p-6">
      <Text className="text-center text-2xl font-black text-foreground">
        Sign in
      </Text>

      <TextField>
        <Label className="text-xs font-semibold text-foreground">Email</Label>
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
          Password
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
        className="w-full rounded-2xl bg-accent"
        isDisabled={submitting}
        onPress={() => void handleSubmit()}
      >
        <Button.Label className="font-bold text-accent-foreground">
          Sign in
        </Button.Label>
      </Button>

      <LinkButton
        testID="link-register"
        className="self-center"
        onPress={() => router.push('/register')}
      >
        <LinkButton.Label className="font-semibold text-accent-strong">
          Create account
        </LinkButton.Label>
      </LinkButton>
      <LinkButton
        testID="link-forgot"
        className="self-center"
        onPress={() => router.push('/forgot')}
      >
        <LinkButton.Label className="font-semibold text-accent-strong">
          Forgot password?
        </LinkButton.Label>
      </LinkButton>
    </View>
  );
}
