/**
 * Estilos nativos que Tailwind/uniwind no puede expresar. Mismo motivo y mismo
 * precedente que TOUCH_SLOP de ./touch-target.ts: no son valores de diseño
 * repetidos (esos son tokens de global.css), son props de estilo de React
 * Native sin utilidad CSS equivalente.
 */

/** Esquina continua (estilo iOS) en toda superficie redondeada no-cápsula. */
export const CONTINUOUS_CORNER = { borderCurve: 'continuous' } as const;

/** Cifras de ancho fijo: los dígitos dejan de bailar al refrescarse. */
export const TABULAR_NUMS = { fontVariant: ['tabular-nums'] } as const;
