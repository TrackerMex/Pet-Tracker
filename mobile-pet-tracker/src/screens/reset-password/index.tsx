import { router, useLocalSearchParams } from 'expo-router';
import { Button, Input, Label, LinkButton, TextField } from 'heroui-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

export function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const normalizedToken = token?.trim() ?? '';

  if (!normalizedToken) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
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
          <LinkButton.Label className="font-semibold text-accent">
            Back to sign in
          </LinkButton.Label>
        </LinkButton>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center gap-4 bg-background p-6">
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

      <Button
        testID="reset-submit"
        className="w-full rounded-2xl bg-accent"
      >
        <Button.Label className="font-bold text-accent-foreground">
          Update password
        </Button.Label>
      </Button>
    </View>
  );
}
