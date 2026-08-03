// Politica de API y de worker de la feature en un solo archivo: los
// umbrales de PIPELINE (velocidad, gap, duracion minima) viven en
// src/pipeline/constants.ts y no se duplican aqui (D10). Vive en la raiz del
// modulo, no en infrastructure/, porque application y domain tambien lo
// consumen y la regla de dependencia les prohibe mirar hacia afuera
// (precedente literal positions.constants.ts de #9). Nucleo puro salvo el
// Symbol de inyeccion.

/** Tope de dias por peticion de /activity/daily; mas alla es 400 (R17). */
export const ACTIVITY_MAX_RANGE_DAYS = 31;

/** Ventana por defecto cuando faltan `from`/`to`: hoy y los 6 previos (R20). */
export const ACTIVITY_DEFAULT_RANGE_DAYS = 7;

/** Dias naturales anteriores a `from` que forman la base de comparacion (R21). */
export const ACTIVITY_BASELINE_DAYS = 7;

/** Tamaño de pagina de la Query de un dia; un dia a 30 s son ~2 880 puntos. */
export const ACTIVITY_PAGE_LIMIT = 1000;

/** Tope defensivo de paginas por dia: al alcanzarlo se computa con lo leido
 * y se registra un warn, nunca se lanza (precedente MAX_DRAIN_ITERATIONS). */
export const ACTIVITY_MAX_PAGES_PER_DAY = 10;

/** Cadencia del tick del agregador: constante nombrada, no env (D7). */
export const ACTIVITY_TICK_INTERVAL_MS = 3_600_000;

/** Nombre del intervalo en SchedulerRegistry (R15). */
export const ACTIVITY_TICK_NAME = 'activity-aggregator';

/** DocumentClient propio del modulo (D1): no se importa PositionsModule ni
 * IngestionModule para no acoplar el agregador a un modulo HTTP ajeno. */
export const ACTIVITY_DAILY_DOC_CLIENT = Symbol('ACTIVITY_DAILY_DOC_CLIENT');
