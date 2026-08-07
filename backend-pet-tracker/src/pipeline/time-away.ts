import type { LocalDayRange } from './local-day';

const MS_PER_MINUTE = 60_000;

/**
 * Intervalo "fuera de la geocerca de referencia": una fila de `alert_events`
 * de tipo `geofence_exit`. `closedAtMs` a `null` = todavia abierta.
 */
export interface AwaySpan {
  openedAtMs: number;
  closedAtMs: number | null;
}

/**
 * Minutos que la mascota paso fuera de su geocerca de referencia durante el
 * dia local `range` (#13 R25/R26). Funcion pura: sin base, sin reloj y sin
 * dependencias — el resultado solo depende de `spans` y `range`.
 *
 * Cada fila se recorta al dia y se suma; **no hay union ni deduplicacion de
 * intervalos**: el indice unico anti-spam de R2 garantiza como maximo una
 * fila no cerrada por `(pet, type, geofence)` a la vez, asi que los
 * intervalos de una misma geocerca son disjuntos por construccion. El clamp
 * superior absorbe el caso patologico de solape por desorden de timestamps.
 *
 * El cruce de medianoche sale correcto sin caso especial: una salida abierta
 * a las 22:00 del dia D y cerrada a las 02:00 de D+1 aporta 120 minutos a
 * cada dia, porque cada uno recorta con su propio `range`.
 *
 * **Aproximacion deliberada** para un evento todavia abierto (`closedAtMs`
 * null): se asume que la mascota siguio fuera hasta el cierre del dia
 * (`endMs`). El historico de `geofence_state` no existe —solo su valor
 * actual—, asi que no hay forma de saber cuando regreso de verdad. El
 * agregador solo procesa el ultimo dia local CERRADO (#10 R14), asi que
 * `endMs` siempre esta en el pasado y el valor nunca depende del reloj: una
 * fila recomputada da el mismo numero.
 */
export function computeTimeAwayMinutes(
  spans: AwaySpan[],
  range: LocalDayRange,
): number {
  const totalMs = spans.reduce((accumulated, span) => {
    const from = Math.max(span.openedAtMs, range.startMs);
    const to = Math.min(span.closedAtMs ?? range.endMs, range.endMs);

    return accumulated + Math.max(0, to - from);
  }, 0);

  const dayMinutes = (range.endMs - range.startMs) / MS_PER_MINUTE;

  return Math.min(Math.round(totalMs / MS_PER_MINUTE), dayMinutes);
}
