import type {
  DailyActivityRow,
  DailyActivityUpsert,
} from '@/modules/activity/domain/entities/daily-activity.entity';
import type { LocalDayRange } from '@/pipeline/local-day';
import type { AwaySpan } from '@/pipeline/time-away';

/**
 * Puerto propio del modulo sobre Postgres (D8). No se extiende
 * `PetRepository` — su contrato lo cerro la spec aprobada de #5 y el
 * consumidor es otro — ni se exporta `IngestionStore` de `src/workers/`.
 */
export const ACTIVITY_STORE = Symbol('ActivityStore');

/** Mascota con collar activo y la timezone ya resuelta y validada (R13). */
export interface PetToAggregate {
  petId: string;
  /** Siempre una zona IANA valida: 'UTC' si el owner no aporta una (R13). */
  timezone: string;
}

export interface ActivityStore {
  /** Mascotas con `pet_devices.released_at IS NULL` y su tz de owner (R13). */
  listPetsToAggregate(): Promise<PetToAggregate[]>;

  /** ¿Hay fila de ese dia computada despues de `notBeforeMs`? (skip de R14). */
  hasFreshRow(
    petId: string,
    date: string,
    notBeforeMs: number,
  ): Promise<boolean>;

  /**
   * INSERT ... ON CONFLICT que preserva `time_away_minutes` (R11): desde #13
   * (R28/D4) la columna entra en el SET como
   * `coalesce(excluded.time_away_minutes, activity_daily.time_away_minutes)`,
   * asi que un upsert que no aporta valor sigue preservando el existente.
   */
  upsertDailyActivity(row: DailyActivityUpsert): Promise<void>;

  /**
   * Intervalos `geofence_exit` de la **geocerca de referencia** de la mascota
   * que solapan el dia local `range` (#13 R24/R25). La geocerca de referencia
   * es la mas antigua (`created_at ASC`, desempate `id ASC`), **activa o no**
   * (D3): desactivar una geocerca no debe cambiar retroactivamente el KPI de
   * dias ya medidos.
   *
   * `null` = la mascota no tiene ninguna geocerca ⇒ `time_away_minutes` NULL,
   * "no medible" (R27). `[]` = tiene geocerca y no salio ⇒ 0, "medido".
   */
  findAwaySpans(
    petId: string,
    range: LocalDayRange,
  ): Promise<AwaySpan[] | null>;

  /** Filas del rango de dias, ambos extremos incluidos (R20). */
  findDailyRange(
    petId: string,
    fromDay: string,
    toDay: string,
  ): Promise<DailyActivityRow[]>;

  /** Timezone del owner activo de la mascota; 'UTC' si no hay o no es IANA. */
  findOwnerTimezone(petId: string): Promise<string>;
}
