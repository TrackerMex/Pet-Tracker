import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PetProfile } from '../api/types';
import { PetSwitcher } from './pet-switcher';

export const TAB_PET_HEADER_HEIGHT = 65;
export const TAB_PET_HEADER_SCROLL_MIN = 7;

interface TabPetHeaderProps {
  testID: string;
  pets: PetProfile[];
  selectedPetId: string | null;
  onSelect: (petId: string) => void;
  horizontalInset: number;
  scrollHint?: string;
}

export function TabPetHeader({ testID, pets, selectedPetId, onSelect, horizontalInset, scrollHint }: TabPetHeaderProps) {
  const insets = useSafeAreaInsets();
  if (pets.length === 0) return null;

  return (
    <View
      testID={testID}
      className="absolute inset-x-0 top-0 border-b border-border bg-glass-surface-strong"
      style={{ paddingTop: insets.top + 7, paddingBottom: 7 }}
    >
      <PetSwitcher variant="avatars" pets={pets} selectedPetId={selectedPetId} onSelect={onSelect} edgeInset={horizontalInset - 5} scrollHint={scrollHint} />
    </View>
  );
}
