export const DEVICE_REPOSITORY = Symbol('DeviceRepository');

/**
 * Columnas por las que el claim puede buscar un device (R4/R7). Las cuatro
 * son UNIQUE en `devices` (decision D4): un identificador matchea a lo sumo
 * una fila, sin regla de desambiguacion.
 */
export const DEVICE_IDENTIFIER_FIELDS = [
  'esn',
  'imei',
  'serialNumber',
  'activationCode',
] as const;

export type DeviceIdentifierField = (typeof DEVICE_IDENTIFIER_FIELDS)[number];

/** El unico identificador presente en el body del claim (XOR de R4). */
export interface DeviceIdentifier {
  field: DeviceIdentifierField;
  value: string;
}
