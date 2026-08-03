// Umbrales del pipeline (R6, R17) — fuente unica: #10 (trips), #11
// (geocercas) y #12 (alertas) los importan de aqui; cero numeros magicos en
// poller/consumer. Nucleo puro: sin imports.

/** Velocidad implicita (km/h) por encima de la cual se marca suspect_jump. */
export const SUSPECT_JUMP_SPEED_KMH = 60;

/** Precision (m) por encima de la cual se marca low_accuracy. */
export const LOW_ACCURACY_MAX_ACCURACY_M = 100;

/** Satelites por debajo de los cuales se marca low_accuracy. */
export const LOW_ACCURACY_MIN_SATS = 4;

/** Umbral de bateria baja: battery.low dispara al cruzar hacia abajo (R17).
 * Histeresis: #12 cierra la alerta con bateria >= 30 (design.md D8). */
export const BATTERY_LOW_THRESHOLD_PCT = 20;

/** Nombres de flags de calidad (docs/data-model.md §DynamoDB `flags`). */
export const FLAG_SUSPECT_JUMP = 'suspect_jump';
export const FLAG_LOW_ACCURACY = 'low_accuracy';

// Umbrales de segmentacion de paseos (#10 trips-activity R1, valores
// literales del plan 006 §Paso 2). Son PRODUCTO: no se recalibran a ojo —
// si el simulador da 0 paseos, se para y se reporta con los numeros.

/** Velocidad (km/h) por encima de la cual un punto esta en movimiento. */
export const TRIP_MOVING_SPEED_KMH = 1.8;

/** Velocidad implicita (m/s) alternativa para declarar movimiento. */
export const TRIP_MOVING_IMPLIED_MPS = 0.5;

/** Puntos consecutivos en movimiento que abren un paseo. */
export const TRIP_MIN_MOVING_POINTS = 3;

/** Minutos consecutivos sin movimiento que cierran un paseo abierto. */
export const TRIP_IDLE_CLOSE_MINUTES = 10;

/** Minutos entre dos puntos consecutivos por encima de los cuales el hueco
 * de datos cierra el paseo (el siguiente punto ya no lo continua). */
export const TRIP_MAX_GAP_MINUTES = 15;

/** Duracion minima (min) para que un paseo cerrado no sea ruido. */
export const TRIP_MIN_DURATION_MINUTES = 5;

/** Distancia minima (metros RECORRIDOS) para que un paseo no sea ruido.
 * Comparte el valor 100 con LOW_ACCURACY_MAX_ACCURACY_M (metros de
 * PRECISION GPS) por coincidencia: son magnitudes distintas y calibrar una
 * no debe mover la otra (R1). */
export const TRIP_MIN_DISTANCE_M = 100;
