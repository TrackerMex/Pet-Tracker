import type { ImageRef } from 'expo-image';
import { View } from 'react-native';

import type { PetProfile } from '../../api/types';

type MarkerPet = Pick<PetProfile, 'id' | 'name' | 'photoUrl'>;
type IconReady = { key: string; icon: ImageRef };

export function PetMarkerIcon(props: { pet: MarkerPet; onIcon: (state: IconReady) => void }) {
  return (
    <View
      testID="map-marker-icon"
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ position: 'absolute', top: 0, right: 0, opacity: 0.01 }}
    />
  );
}
