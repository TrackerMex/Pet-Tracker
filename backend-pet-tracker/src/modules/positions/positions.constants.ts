// Constantes de la feature en un solo archivo: cero numeros magicos en
// domain, application o infrastructure (misma regla que src/pipeline/
// constants.ts). Vive en la raiz del modulo, no en infrastructure, porque
// domain (cursor) y application (defaults del rango) tambien lo consumen y
// la regla de dependencia prohibe que miren hacia afuera. Nucleo puro salvo
// el Symbol de inyeccion, que no acopla a ningun framework.

/** Ventana por defecto cuando `from` esta ausente (R8, D4). */
export const DEFAULT_RANGE_MINUTES = 60;

/** Tope de rango por peticion; mas alla es 400 RANGE_TOO_LARGE (R9, D4). */
export const MAX_RANGE_HOURS = 24;

/** Tamaño de pagina de la Query, fijo y no configurable por el cliente
 * (R10, D4 — plan 005 §Paso 5: 24 h a 30 s = 2 880 puntos ⇒ 3 paginas). */
export const POSITIONS_PAGE_LIMIT = 1000;

/** Version del sobre del cursor; un cursor con otra version es invalido (R13). */
export const CURSOR_VERSION = 1;

/** DocumentClient propio del modulo de lectura (D6): no se importa
 * IngestionModule para no arrastrar poller y consumidor a un proceso que
 * solo quiere servir HTTP. */
export const POSITIONS_READ_DOC_CLIENT = Symbol('POSITIONS_READ_DOC_CLIENT');
