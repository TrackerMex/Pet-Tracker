import { GoogleMaps } from 'expo-maps';

export type MapCoordinates = { latitude: number; longitude: number };
export type MapPolyline = { id: string; coordinates: MapCoordinates[] };
export type PetMapProps = {
  center: MapCoordinates;
  marker: MapCoordinates | null;
  polylines: MapPolyline[];
  colorScheme: 'light' | 'dark';
};

export function PetMap(props: PetMapProps) {
  void props;

  const mapViewProps = {
    testID: 'map-view',
    style: { flex: 1 },
  };

  return <GoogleMaps.View {...mapViewProps} />;
}
