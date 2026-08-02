// Nucleo puro: aritmetica sin imports de framework, SDK ni ORM.

/**
 * Antiguedad en segundos del dato del dispositivo (R4). `ts` es el
 * `device_ts` en epoch ms de la cache y `now` el reloj del servidor, que el
 * caso de uso inyecta para que el test lo fije (D5). Un `ts` posterior a
 * `now` (desfase de reloj del collar) satura en 0 — nunca negativo.
 */
export function staleSeconds(ts: number, now: Date): number {
  return Math.max(0, Math.floor((now.getTime() - ts) / 1000));
}
