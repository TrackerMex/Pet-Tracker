import { Text, View } from 'react-native';

export default function FoodScreen() {
  return (
    <View
      testID="screen-food"
      className="flex-1 items-center justify-center bg-background"
    >
      <Text className="text-lg font-semibold text-foreground">Food</Text>
    </View>
  );
}
