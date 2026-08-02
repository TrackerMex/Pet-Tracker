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
