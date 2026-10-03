import { zoomForRadius } from './zoom-for-radius';

describe('#146 R2: zoomForRadius encuadra el círculo con su radio', () => {
  it.each([
    [300, 16], [150, 17], [600, 15], [1200, 14],
    [75, 18], [20, 18], [2000, 13.263], [500, 15.263],
  ])('para %p m da zoom %p', (radius, zoom) => {
    expect(zoomForRadius(radius)).toBeCloseTo(zoom, 3);
  });
});
