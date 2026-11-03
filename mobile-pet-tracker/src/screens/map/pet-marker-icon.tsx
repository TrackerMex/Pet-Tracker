import type { ImageRef } from 'expo-image';
import { View } from 'react-native';
import { useMemo } from 'react';
import Svg, { Circle, ClipPath, Defs, G, parse } from 'react-native-svg';
import { blobatar } from 'blobatar';

import type { PetProfile } from '../../api/types';
import { useThemeColors } from '../../theme/use-theme-colors';

type MarkerPet = Pick<PetProfile, 'id' | 'name' | 'photoUrl'>;
type IconReady = { key: string; icon: ImageRef };

export function PetMarkerIcon(props: { pet: MarkerPet; onIcon: (state: IconReady) => void }) {
  const [foreground] = useThemeColors(['accent-foreground']);
  const blob = useMemo(() => parse(blobatar(props.pet.name))?.children, [props.pet.name]);
  return (
    <View
      testID="map-marker-icon"
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ position: 'absolute', top: 0, right: 0, opacity: 0.01 }}
    >
      <Svg testID="map-marker-fallback-svg" width={44} height={44} viewBox="0 0 44 44">
        <Defs>
          <ClipPath testID="map-marker-fallback-clip" id="map-marker-fallback-clip">
            <Circle cx={22} cy={22} r={22} />
          </ClipPath>
        </Defs>
        <Circle testID="map-marker-fallback-disc" cx={22} cy={22} r={22} fill={foreground} />
        <G testID="map-marker-blob-clip" clipPath="url(#map-marker-fallback-clip)">
          <G testID="map-marker-blob" transform="translate(3 3) scale(0.38)">{blob}</G>
        </G>
        <Circle testID="map-marker-fallback-ring" cx={22} cy={22} r={20.5} stroke={foreground} strokeWidth={3} fill="none" />
      </Svg>
    </View>
  );
}
