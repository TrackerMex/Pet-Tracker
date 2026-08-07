// `type` de alert_events que esta feature produce (R1) — mismos valores que
// el CHECK de la migracion, como constantes nombradas en vez de literales
// repetidos por el consumer.
export const ALERT_TYPE_GEOFENCE_EXIT = 'geofence_exit';
export const ALERT_TYPE_BATTERY_LOW = 'battery_low';

/** Batch maximo por ReceiveMessage (R5), mismo patron que positions-consumer. */
export const CONSUMER_RECEIVE_MAX_MESSAGES = 10;

/** Long-polling corto: drena rapido en tests y evita busy-loop (R5). */
export const CONSUMER_WAIT_TIME_SECONDS = 1;
