import { GoogleMaps } from 'expo-maps';

import { useThemeColors } from '../theme/use-theme-colors';

export type MapCoordinates = { latitude: number; longitude: number };
export type MapPolyline = { id: string; coordinates: MapCoordinates[] };
export type PetMapProps = {
  center: MapCoordinates;
  marker: MapCoordinates | null;
  polylines: MapPolyline[];
  colorScheme: 'light' | 'dark';
};

export const MAP_ZOOM = 16;

export function PetMap(props: PetMapProps) {
  const [polylineColor] = useThemeColors(['accent']);
  const mapViewProps = {
    testID: 'map-view',
    style: { flex: 1 },
    cameraPosition: {
      coordinates: props.center,
      zoom: MAP_ZOOM,
    },
    markers: props.marker
      ? [{ id: 'last-position', coordinates: props.marker }]
      : [],
    polylines: props.polylines.map((polyline) => ({
      ...polyline,
      color: polylineColor,
    })),
    colorScheme:
      props.colorScheme === 'dark'
        ? GoogleMaps.MapColorScheme.DARK
        : GoogleMaps.MapColorScheme.LIGHT,
    uiSettings: { zoomControlsEnabled: false },
  };

  return <GoogleMaps.View {...mapViewProps} />;
}
