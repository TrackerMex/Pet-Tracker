import { router } from 'expo-router';
import { Button, Input, Label, LinkButton, TextField } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock } from 'reicon-react-native';

import { useThemeColors } from '../../theme/use-theme-colors';

export default function Forgot() {
  const [accentStrong] = useThemeColors(['accent-strong']);
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      testID="screen-forgot"
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
      <View className="size-16 items-center justify-center rounded-xl bg-accent-soft">
        <Lock size={28} color={accentStrong} />
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
        className="w-full rounded-xl bg-accent"
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
    </ScrollView>
  );
}
