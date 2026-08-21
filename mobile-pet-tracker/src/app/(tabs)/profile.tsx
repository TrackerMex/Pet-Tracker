import { Button } from 'heroui-native';
import { Text, View } from 'react-native';

import { useAuth } from '../../providers/auth-provider';

export default function ProfileScreen() {
  const { signOut } = useAuth();

  return (
    <View
      testID="screen-profile"
      className="flex-1 items-center justify-center bg-background"
    >
      <Text className="text-lg font-semibold text-foreground">Profile</Text>
      <Button
        testID="profile-sign-out"
        onPress={() => {
          void signOut();
        }}
      >
        Sign out
      </Button>
    </View>
  );
}
