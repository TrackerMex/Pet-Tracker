export function zoomForRadius(radiusM: number): number {
  return Math.min(18, 16 - Math.log2(radiusM / 300));
}
