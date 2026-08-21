import { Image } from 'expo-image';
import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { useAuth } from '../providers/auth-provider';

export default function Index() {
  const { status } = useAuth();

  if (status === 'authenticated') {
    return <Redirect href="/health" />;
  }

  if (status === 'unauthenticated') {
    return <Redirect href="/login" />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Image
        testID="splash-logo"
        source={require('../../assets/images/splash-icon.png')}
        style={{ width: 120, height: 120 }}
        contentFit="contain"
      />
    </View>
  );
}
