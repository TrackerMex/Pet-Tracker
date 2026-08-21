import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View
      testID="screen-home"
      className="flex-1 items-center justify-center bg-background"
    >
      <Text className="text-lg font-semibold text-foreground">Home</Text>
    </View>
  );
}
