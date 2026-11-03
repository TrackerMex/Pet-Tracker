import { useImage, type ImageRef } from 'expo-image';
import { PixelRatio, View } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import Svg, { Circle, ClipPath, Defs, G, Image, parse } from 'react-native-svg';
import { blobatar } from 'blobatar';

import type { PetProfile } from '../../api/types';
import { useThemeColors } from '../../theme/use-theme-colors';

type MarkerPet = Pick<PetProfile, 'id' | 'name' | 'photoUrl'>;
type IconReady = { key: string; icon: ImageRef };

export function markerCompositionKey(pet: MarkerPet): string {
  return JSON.stringify([pet.id, pet.name, pet.photoUrl ?? '']);
}

function MarkerImage({ uri, compositionKey, onIcon }: {
  uri: string;
  compositionKey: string;
  onIcon: (state: IconReady) => void;
}) {
  const icon = useImage({ uri });
  useEffect(() => {
    if (icon) onIcon({ key: compositionKey, icon });
  }, [icon, compositionKey, onIcon]);
  return null;
}

export function PetMarkerIcon(props: { pet: MarkerPet; onIcon: (state: IconReady) => void }) {
  const [foreground] = useThemeColors(['accent-foreground']);
  const blob = useMemo(() => parse(blobatar(props.pet.name))?.children, [props.pet.name]);
  const svgRef = useRef<Svg>(null);
  const [capture, setCapture] = useState<string | null>(null);
  useEffect(() => {
    let cleaned = false;
    let secondFrame: number | undefined;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        if (cleaned) return;
        const size = Math.round(44 * PixelRatio.get());
        svgRef.current?.toDataURL((base64) => {
          if (!cleaned) setCapture('data:image/png;base64,' + base64);
        }, { width: size, height: size });
      });
    });
    return () => {
      cleaned = true;
      cancelAnimationFrame(firstFrame);
      if (secondFrame !== undefined) cancelAnimationFrame(secondFrame);
    };
  }, []);
  return (
    <View
      testID="map-marker-icon"
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ position: 'absolute', top: 0, right: 0, opacity: 0.01 }}
    >
      <Svg ref={svgRef} testID="map-marker-fallback-svg" width={44} height={44} viewBox="0 0 44 44">
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
      {props.pet.photoUrl ? (
        <Svg testID="map-marker-photo-svg" width={44} height={44} viewBox="0 0 44 44">
          <Defs>
            <ClipPath testID="map-marker-photo-clip" id="map-marker-photo-clip">
              <Circle cx={22} cy={22} r={22} />
            </ClipPath>
          </Defs>
          <Image testID="map-marker-photo" href={{ uri: props.pet.photoUrl }} x={0} y={0} width={44} height={44} preserveAspectRatio="xMidYMid slice" clipPath="url(#map-marker-photo-clip)" />
          <Circle testID="map-marker-photo-ring" cx={22} cy={22} r={20.5} stroke={foreground} strokeWidth={3} fill="none" />
        </Svg>
      ) : null}
      {capture ? <MarkerImage uri={capture} compositionKey={markerCompositionKey(props.pet)} onIcon={props.onIcon} /> : null}
    </View>
  );
}
