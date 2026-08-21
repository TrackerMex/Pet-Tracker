import { router } from 'expo-router';
import { Button, Input, Label, LinkButton, TextField } from 'heroui-native';
import { Text, View } from 'react-native';

export default function Forgot() {
  return (
    <View className="flex-1 justify-center gap-4 bg-background p-6">
      <Text className="text-2xl font-semibold text-foreground">Forgot password</Text>
      <Text className="text-muted">Password recovery coming soon</Text>

      <TextField isDisabled>
        <Label>Email</Label>
        <Input
          testID="forgot-email"
          autoCapitalize="none"
          editable={false}
          keyboardType="email-address"
        />
      </TextField>

      <Button testID="forgot-submit" isDisabled>
        Send recovery link
      </Button>

      <LinkButton testID="link-login" onPress={() => router.push('/login')}>
        Back to sign in
      </LinkButton>
    </View>
  );
}
