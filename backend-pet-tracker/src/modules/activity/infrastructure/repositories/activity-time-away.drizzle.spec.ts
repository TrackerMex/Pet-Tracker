import { drizzle } from 'drizzle-orm/node-postgres';
import { ActivityDrizzleStore } from './activity.drizzle.store';

/**
 * SQL capturado con un cliente pg falso: se ejercita el constructor de
 * consultas real de Drizzle, no una reimplementacion en el test. Cobertura
 * de comportamiento contra Postgres real en el e2e.
 */
interface CapturedQuery {
  text: string;
  values: unknown[];
}

function storeCapturing(
  captured: CapturedQuery[],
  rows: unknown[][] = [],
): ActivityDrizzleStore {
  const client = {
    query: (query: { text: string }, values: unknown[]) => {
      captured.push({ text: query.text, values });
      return Promise.resolve({ rows });
    },
  };

  return new ActivityDrizzleStore(drizzle(client as never));
}

const RANGE = { startMs: Date.UTC(2026, 7, 2), endMs: Date.UTC(2026, 7, 3) };
const PET_ID = '018f5a3e-0000-7000-8000-00000000000a';

describe('R24: la geocerca de referencia es la mas antigua, ACTIVA O NO (D3)', () => {
  it('ordena por created_at ASC con desempate id ASC y toma una sola', async () => {
    const captured: CapturedQuery[] = [];

    await storeCapturing(captured).findAwaySpans(PET_ID, RANGE);

    const [geofenceQuery] = captured;
    expect(geofenceQuery.text).toContain('from "geofences"');
    expect(geofenceQuery.text).toContain(
      'order by "geofences"."created_at" asc, "geofences"."id" asc',
    );
    expect(geofenceQuery.text).toContain('limit');
  });

  it('NO filtra por active: desactivar una geocerca no cambia un KPI ya medido', async () => {
    const captured: CapturedQuery[] = [];

    await storeCapturing(captured).findAwaySpans(PET_ID, RANGE);

    expect(captured[0].text).not.toContain('"active"');
  });

  it('sin ninguna geocerca devuelve null (no medible), no una lista vacia', async () => {
    const spans = await storeCapturing([], []).findAwaySpans(PET_ID, RANGE);

    expect(spans).toBeNull();
  });
});

describe('R25: la consulta de spans filtra geofence_exit de la geocerca de referencia', () => {
  it('acota por pet, type, geofence_id y el solape con el dia local', async () => {
    const captured: CapturedQuery[] = [];
    // La primera consulta devuelve la geocerca de referencia; la segunda, los spans.
    const client = {
      query: (query: { text: string }, values: unknown[]) => {
        captured.push({ text: query.text, values });
        return Promise.resolve({
          rows: captured.length === 1 ? [['geofence-1']] : [],
        });
      },
    };

    await new ActivityDrizzleStore(drizzle(client as never)).findAwaySpans(
      PET_ID,
      RANGE,
    );

    expect(captured).toHaveLength(2);
    const spansQuery = captured[1];
    expect(spansQuery.text).toContain('from "alert_events"');
    expect(spansQuery.text).toContain('"alert_events"."type" = ');
    expect(spansQuery.text).toContain('"alert_events"."geofence_id" = ');
    expect(spansQuery.text).toContain('"alert_events"."opened_at" < ');
    expect(spansQuery.text).toContain('"alert_events"."closed_at" is null');
    expect(spansQuery.text).toContain('"alert_events"."closed_at" > ');
    expect(spansQuery.values).toEqual(
      expect.arrayContaining([PET_ID, 'geofence_exit', 'geofence-1']),
    );
  });
});

describe('R28: el upsert fija time_away_minutes con coalesce(excluded, actual) (D4)', () => {
  it('un valor nuevo NULL nunca pisa el valor ya escrito', async () => {
    const captured: CapturedQuery[] = [];

    await storeCapturing(captured).upsertDailyActivity({
      petId: PET_ID,
      date: '2026-08-02',
      distanceM: 0,
      activeMinutes: 0,
      restMinutes: 0,
      walkCount: 0,
      avgWalkMinutes: 0,
      firstWalkAt: null,
      lastWalkAt: null,
      timeAwayMinutes: null,
    });

    expect(captured[0].text).toContain('on conflict');
    expect(captured[0].text).toContain(
      'coalesce(excluded.time_away_minutes, "activity_daily"."time_away_minutes")',
    );
  });

  it('no altera ninguna otra columna del SET del upsert de #10', async () => {
    const captured: CapturedQuery[] = [];

    await storeCapturing(captured).upsertDailyActivity({
      petId: PET_ID,
      date: '2026-08-02',
      distanceM: 10,
      activeMinutes: 1,
      restMinutes: 2,
      walkCount: 1,
      avgWalkMinutes: 1.5,
      firstWalkAt: null,
      lastWalkAt: null,
      timeAwayMinutes: 90,
    });

    const setClause = captured[0].text.split('do update set')[1];
    for (const column of [
      'distance_m',
      'active_minutes',
      'rest_minutes',
      'walk_count',
      'avg_walk_minutes',
      'first_walk_at',
      'last_walk_at',
      'computed_at',
      'time_away_minutes',
    ]) {
      expect(setClause).toContain(`"${column}"`);
    }
    expect(setClause).not.toContain('"pet_id"');
    expect(setClause).not.toContain('"date"');
  });
});
