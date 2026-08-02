// Geometria del nucleo puro (R6) — #10 (trips-activity) reutiliza esta
// haversine para distancias de paseo. Sin imports.

const EARTH_RADIUS_M = 6_371_000;

/** Distancia haversine en metros entre dos coordenadas WGS84. */
export function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLng = (lng2 - lng1) * toRad;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}
