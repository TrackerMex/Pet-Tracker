import type { ProcessedPosition } from '@/pipeline/types';

/**
 * Puerto propio de #10 para leer un dia local COMPLETO ya paginado (D1).
 *
 * No se reutiliza `ListPositionsUseCase` de #9: su `MAX_RANGE_HOURS = 24`
 * rechazaria un dia local de 25 h por DST, filtra `low_accuracy` (que el
 * computo necesita, D5) y emite cursores atados a una huella de consulta que
 * aqui no significa nada.
 */
export const DAILY_POSITIONS_READER = Symbol('DailyPositionsReader');

export interface DailyPositionsReader {
  /** Serie ascendente por `ts` del rango semiabierto [startMs, endMs). */
  readDay(
    petId: string,
    startMs: number,
    endMs: number,
  ): Promise<ProcessedPosition[]>;
}
