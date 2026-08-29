import { GoogleMaps } from 'expo-maps';

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
  const mapViewProps = {
    testID: 'map-view',
    style: { flex: 1 },
    cameraPosition: {
      coordinates: props.center,
      zoom: MAP_ZOOM,
    },
  };

  return <GoogleMaps.View {...mapViewProps} />;
}
