import { Redirect, Tabs } from 'expo-router';

import { FloatingTabBar } from '../../components/floating-tab-bar';
import { useAuth } from '../../providers/auth-provider';

export default function TabsLayout() {
  const { status } = useAuth();

  if (status === 'loading') {
    return null;
  }

  if (status === 'unauthenticated') {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <FloatingTabBar state={props.state} navigation={props.navigation} />
      )}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="health" />
      <Tabs.Screen name="food" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
