import { alertPosition, distanceMeters, formatDistance } from './alert-location';

describe('#170 R7: alertPosition valida la posición del payload', () => {
  it.each([
    { fila: 'vacío', payload: {}, expected: null },
    { fila: 'batería real', payload: { batteryPct: 12 }, expected: null },
    { fila: 'posición nula', payload: { position: null }, expected: null },
    { fila: 'posición no objeto', payload: { position: 'x' }, expected: null },
    { fila: 'lat texto', payload: { position: { lat: '19.4', lng: -99.1 } }, expected: null },
    { fila: 'falta lng', payload: { position: { lat: 19.4 } }, expected: null },
    { fila: 'lat NaN', payload: { position: { lat: NaN, lng: -99.1 } }, expected: null },
    { fila: 'lng infinito', payload: { position: { lat: 19.4, lng: Infinity } }, expected: null },
    { fila: 'lat fuera', payload: { position: { lat: 90.0001, lng: 0 } }, expected: null },
    { fila: 'lng fuera', payload: { position: { lat: 0, lng: -180.0001 } }, expected: null },
    { fila: 'borde válido', payload: { position: { lat: 90, lng: -180 } }, expected: { latitude: 90, longitude: -180 } },
    { fila: 'real del motor', payload: { position: { lat: 19.4342637, lng: -99.1332, ts: '2026-09-11T10:00:00.000Z', flags: [] }, geofenceName: 'Casa' }, expected: { latitude: 19.4342637, longitude: -99.1332 } },
  ])('$fila', ({ payload, expected }) => {
    if (expected === null) expect(alertPosition(payload)).toBeNull();
    else expect(alertPosition(payload)).toEqual(expected);
  });
});

describe('#170 R7: distanceMeters', () => {
  it.each([
    [0, 0, 0, 0.001, 111.1949],
    [0, 0, 1, 0, 111194.9266],
    [60, 0, 60, 0.002, 111.1949],
    [19.4326, -99.1332, 19.4326, -99.1332, 0],
  ])('(%s, %s)→(%s, %s) = %s', (latA, lngA, latB, lngB, expected) => {
    expect(distanceMeters({ latitude: latA, longitude: lngA }, { latitude: latB, longitude: lngB })).toBeCloseTo(expected, 3);
  });
});

describe('#170 R7: formatDistance', () => {
  it.each([
    [0, '0 m'], [0.4, '0 m'], [84.6, '85 m'], [999.4, '999 m'],
    [999.5, '1.0 km'], [1238.46, '1.2 km'], [1250, '1.3 km'], [12345.6, '12.3 km'],
  ] as const)('%s → %s', (meters, expected) => {
    expect(formatDistance(meters)).toBe(expected);
  });
});
