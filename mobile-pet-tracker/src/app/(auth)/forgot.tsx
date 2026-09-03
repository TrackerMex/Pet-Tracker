import { router } from 'expo-router';
import {
  Button,
  Input,
  Label,
  LinkButton,
  TextField,
  useThemeColor,
} from 'heroui-native';
import { Text, View } from 'react-native';
import { Lock } from 'reicon-react-native';

export default function Forgot() {
  const [accent] = useThemeColor(['accent']);

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
      <View className="size-16 items-center justify-center rounded-2xl bg-accent-soft">
        <Lock size={28} color={accent} />
      </View>
      <Text className="text-center text-2xl font-black text-foreground">
        Forgot password
      </Text>
      <Text className="text-center font-normal text-muted">
        Password recovery coming soon
      </Text>

      <TextField className="w-full" isDisabled>
        <Label className="text-xs font-semibold text-foreground">Email</Label>
        <Input
          testID="forgot-email"
          className="rounded-xl bg-default"
          autoCapitalize="none"
          editable={false}
          keyboardType="email-address"
        />
      </TextField>

      <Button
        testID="forgot-submit"
        className="w-full rounded-2xl bg-accent"
        isDisabled
      >
        <Button.Label className="font-bold text-accent-foreground">
          Send recovery link
        </Button.Label>
      </Button>

      <LinkButton testID="link-login" onPress={() => router.push('/login')}>
        <LinkButton.Label className="font-semibold text-accent-strong">
          Back to sign in
        </LinkButton.Label>
      </LinkButton>
    </View>
  );
}
