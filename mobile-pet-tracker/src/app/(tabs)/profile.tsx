import { Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View
      testID="screen-profile"
      className="flex-1 items-center justify-center bg-background"
    >
      <Text className="text-lg font-semibold text-foreground">Profile</Text>
    </View>
  );
}
