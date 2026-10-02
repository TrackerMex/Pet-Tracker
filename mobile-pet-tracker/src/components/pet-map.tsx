import { GoogleMaps } from 'expo-maps';

import { useThemeColors } from '../theme/use-theme-colors';

export type MapCoordinates = { latitude: number; longitude: number };
export type MapPolyline = { id: string; coordinates: MapCoordinates[] };
export type MapCircle = { id: string; center: MapCoordinates; radius: number };
export type PetMapProps = {
  circles?: MapCircle[];
  zoom?: number;
  onPress?: (coordinates: MapCoordinates) => void;
  center: MapCoordinates;
  marker: MapCoordinates | null;
  polylines: MapPolyline[];
  colorScheme: 'light' | 'dark';
};

export const MAP_ZOOM = 16;
export const DEFAULT_CENTER: MapCoordinates = { latitude: 19.4326, longitude: -99.1332 };

export function PetMap(props: PetMapProps) {
  const [polylineColor, circleFill] = useThemeColors(['accent-strong', 'tab-pill']);
  const forward = (coordinates: Partial<MapCoordinates> | undefined) => {
    if (typeof coordinates?.latitude === 'number' && typeof coordinates.longitude === 'number') {
      props.onPress?.({ latitude: coordinates.latitude, longitude: coordinates.longitude });
    }
  };
  const mapViewProps = {
    testID: 'map-view',
    style: { flex: 1 },
    cameraPosition: {
      coordinates: props.center,
      zoom: props.zoom ?? MAP_ZOOM,
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
    circles: (props.circles ?? []).map((c) => ({
      id: c.id, center: c.center, radius: c.radius,
      color: circleFill, lineColor: polylineColor, lineWidth: 2,
    })),
    ...(props.onPress ? {
      onMapClick: (event: { coordinates: Partial<MapCoordinates> }) => forward(event.coordinates),
      onPOIClick: (event: { coordinates: Partial<MapCoordinates> }) => forward(event.coordinates),
      onCircleClick: (event: { clickCoordinates?: Partial<MapCoordinates> }) => forward(event.clickCoordinates),
    } : {}),
  };

  return <GoogleMaps.View {...mapViewProps} />;
}
