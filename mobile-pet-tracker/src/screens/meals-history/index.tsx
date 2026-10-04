import { Redirect } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSelectedPet } from '../../providers/selected-pet-provider';

export function MealsHistoryScreen() {
  const { selectedPetId } = useSelectedPet();
  const insets = useSafeAreaInsets();

  if (selectedPetId === null) {
    return <Redirect href="/food" />;
  }

  return (
    <ScrollView
      testID="screen-meals-history"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}
    />
  );
}
