import { Inject, Injectable, Logger } from '@nestjs/common';
import { ACTIVITY_STORE } from '@/modules/activity/domain/repositories/activity-store';
import type {
  ActivityStore,
  PetToAggregate,
} from '@/modules/activity/domain/repositories/activity-store';
import { DAILY_POSITIONS_READER } from '@/modules/activity/domain/repositories/daily-positions.reader';
import type { DailyPositionsReader } from '@/modules/activity/domain/repositories/daily-positions.reader';
import { computeDailyActivity } from '@/pipeline/activity';
import { localDayOf, localDayRange, shiftDay } from '@/pipeline/local-day';
import { computeTimeAwayMinutes } from '@/pipeline/time-away';

/** Resultado del barrido: una mascota cae en exactamente uno de los tres. */
export interface AggregateSummary {
  processed: number;
  skipped: number;
  failed: number;
}

/**
 * Agregador nocturno (R14). Toda la logica vive en `runOnce()` para que los
 * tests y el e2e lo invoquen sin esperar al reloj (precedente
 * `PollerService.runOnce()` de #8); el scheduling es una cascara aparte
 * (ActivitySchedulerService, R15).
 *
 * Procesa, por mascota, el ULTIMO DIA LOCAL CERRADO de su owner. Sustituye
 * al `cron(15 2 * * ? *)` del plan 006, que para un owner en
 * America/Mexico_City corria a las 20:15 del dia anterior local — antes de
 * que su dia cerrara — y persistia una fila truncada (D2).
 */
@Injectable()
export class AggregateDailyActivityUseCase {
  private readonly logger = new Logger(AggregateDailyActivityUseCase.name);
  private running = false;

  constructor(
    @Inject(ACTIVITY_STORE) private readonly store: ActivityStore,
    @Inject(DAILY_POSITIONS_READER)
    private readonly positions: DailyPositionsReader,
  ) {}

  async runOnce(now: Date = new Date()): Promise<AggregateSummary> {
    // Guard de solape en memoria (D4): proceso unico local — si el barrido
    // anterior sigue en curso, este tick se salta sin tocar nada.
    if (this.running) {
      return { processed: 0, skipped: 0, failed: 0 };
    }
    this.running = true;

    const summary: AggregateSummary = { processed: 0, skipped: 0, failed: 0 };

    try {
      const pets = await this.store.listPetsToAggregate();

      for (const pet of pets) {
        try {
          const done = await this.aggregatePet(pet, now);
          if (done) {
            summary.processed += 1;
          } else {
            summary.skipped += 1;
          }
        } catch (error) {
          // Try/catch POR MASCOTA (D4): un pet borrado a mitad del barrido,
          // DynamoDB inaccesible o una timezone imposible no pueden costar
          // la noche entera de las demas.
          summary.failed += 1;
          this.logger.warn({
            scope: 'activity-aggregator',
            petId: pet.petId,
            timezone: pet.timezone,
            message: describeError(error),
          });
        }
      }
    } finally {
      this.running = false;
    }

    return summary;
  }

  /** `true` si computo y upserteo; `false` si la fila ya estaba fresca. */
  private async aggregatePet(pet: PetToAggregate, now: Date): Promise<boolean> {
    const targetDay = shiftDay(localDayOf(now.getTime(), pet.timezone), -1);
    const range = localDayRange(targetDay, pet.timezone);

    // El corte es el cierre del dia, no el reloj: una fila escrita antes de
    // que el dia terminara esta truncada y hay que recomputarla.
    if (await this.store.hasFreshRow(pet.petId, targetDay, range.endMs)) {
      return false;
    }

    const positions = await this.positions.readDay(
      pet.petId,
      range.startMs,
      range.endMs,
    );
    const activity = computeDailyActivity(positions, range);

    // #13 R24-R27: una lectura mas por mascota, en el mismo bucle y bajo el
    // mismo try/catch. `null` = sin geocerca de referencia ⇒ no medible.
    const awaySpans = await this.store.findAwaySpans(pet.petId, range);
    const timeAwayMinutes =
      awaySpans === null ? null : computeTimeAwayMinutes(awaySpans, range);

    await this.store.upsertDailyActivity({
      petId: pet.petId,
      date: targetDay,
      distanceM: activity.distanceM,
      activeMinutes: activity.activeMinutes,
      restMinutes: activity.restMinutes,
      walkCount: activity.walkCount,
      avgWalkMinutes: activity.avgWalkMinutes,
      firstWalkAt:
        activity.firstWalkAt === null ? null : new Date(activity.firstWalkAt),
      lastWalkAt:
        activity.lastWalkAt === null ? null : new Date(activity.lastWalkAt),
      timeAwayMinutes,
    });

    return true;
  }
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
