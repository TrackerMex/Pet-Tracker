import { useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export function HeroStatusBar() {
  const isFocused = useIsFocused();

  if (!isFocused) return null;

  return <StatusBar style="light" />;
}
