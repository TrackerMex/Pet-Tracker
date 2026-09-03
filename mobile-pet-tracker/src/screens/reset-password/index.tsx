import { router, useLocalSearchParams } from 'expo-router';
import { Button, Input, Label, LinkButton, TextField } from 'heroui-native';
import { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { resetPassword } from '../../api/auth';

export function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const insets = useSafeAreaInsets();
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
          setError(
            'Reset link is invalid or already used. Request a new one.',
          );
          return;
        case 'expired':
          setError('Reset link expired. Request a new one.');
          return;
        case 'validation':
          setError(result.errors.map(({ message }) => message).join('\n'));
          return;
        case 'unreachable':
          setError('Cannot reach server');
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
          Reset password
        </Text>
        <Text
          testID="reset-missing-token"
          className="text-center text-danger"
          selectable
        >
          This reset link is incomplete. Open the link from your email again.
        </Text>
        <LinkButton testID="link-login" onPress={() => router.push('/login')}>
          <LinkButton.Label className="font-semibold text-accent-strong">
            Back to sign in
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
        <Text className="text-center text-2xl font-black text-foreground">
          Reset password
        </Text>
        <Text
          testID="reset-success"
          className="text-center text-foreground"
          selectable
        >
          Password updated
        </Text>
        <LinkButton
          testID="link-login"
          className="self-center"
          onPress={() => router.push('/login')}
        >
          <LinkButton.Label className="font-semibold text-accent-strong">
            Back to sign in
          </LinkButton.Label>
        </LinkButton>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      testID="screen-reset-password"
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
        Reset password
      </Text>

      <TextField>
        <Label className="text-xs font-semibold text-foreground">
          New password
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
          Confirm new password
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

      {error ? (
        <Text testID="reset-error" className="text-danger" selectable>
          {error}
        </Text>
      ) : null}

      <Button
        testID="reset-submit"
        className="w-full rounded-2xl bg-accent"
        isDisabled={submitting}
        onPress={() => void handleSubmit()}
      >
        <Button.Label className="font-bold text-accent-foreground">
          Update password
        </Button.Label>
      </Button>
    </ScrollView>
  );
}
