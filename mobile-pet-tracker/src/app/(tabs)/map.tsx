import { Text, View } from 'react-native';

export default function MapScreen() {
  return (
    <View
      testID="screen-map"
      className="flex-1 items-center justify-center bg-background"
    >
      <Text className="text-lg font-semibold text-foreground">Map</Text>
    </View>
  );
}
