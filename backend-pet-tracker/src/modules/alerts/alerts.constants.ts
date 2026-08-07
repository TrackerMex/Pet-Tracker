/**
 * Tamaño de pagina del centro de alertas (R18), constante y **sin** parametro
 * `?limit=` de cliente — mismo criterio D4 de #9, por eso `?limit=` es un 400
 * en R17.
 */
export const ALERTS_PAGE_SIZE = 50;

/** Version del sobre del cursor (R18): un cambio de shape invalida los viejos. */
export const ALERTS_CURSOR_VERSION = 1;
