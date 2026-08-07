import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { AlertsEngineDrizzleStore } from './alerts-engine.drizzle.store';

/**
 * Spec de #13 (R23/D1) sobre un archivo de #12 — el UNICO cambio funcional
 * que esta feature hace en `alerts-engine`. La suite de #12 no se toca:
 * ninguno de sus tests acka, asi que ninguno cambia de significado.
 *
 * El SQL se captura con un cliente pg falso: se ejercita el constructor de
 * consultas real de Drizzle, no una reimplementacion del `where` en el test.
 */
interface CapturedQuery {
  text: string;
  values: unknown[];
}

function storeCapturing(captured: CapturedQuery[]): AlertsEngineDrizzleStore {
  const client = {
    query: (query: { text: string }, values: unknown[]) => {
      captured.push({ text: query.text, values });
      return Promise.resolve({ rows: [] });
    },
  };

  return new AlertsEngineDrizzleStore(drizzle(client as never));
}

describe('R23: el regreso sigue cerrando una alerta que el usuario ya acko (D1)', () => {
  it('closeOpenAlert filtra por status IN (open, acked), no solo open', async () => {
    const captured: CapturedQuery[] = [];

    await storeCapturing(captured).closeOpenAlert({
      petId: 'pet-1',
      type: 'geofence_exit',
      geofenceId: 'geofence-1',
      closedAt: new Date('2026-08-07T10:00:00.000Z'),
    });

    expect(captured).toHaveLength(1);
    expect(captured[0].text).toContain('"alert_events"."status" in (');
    expect(captured[0].text).not.toMatch(/"alert_events"\."status" = \$\d/);
    expect(captured[0].values).toEqual(
      expect.arrayContaining(['open', 'acked']),
    );
  });

  it('las alertas de bateria (geofence_id NULL) conservan su rama IS NULL', async () => {
    const captured: CapturedQuery[] = [];

    await storeCapturing(captured).closeOpenAlert({
      petId: 'pet-1',
      type: 'battery_low',
      geofenceId: null,
      closedAt: new Date('2026-08-07T10:00:00.000Z'),
    });

    expect(captured[0].text).toContain('"geofence_id" is null');
    expect(captured[0].values).toEqual(
      expect.arrayContaining(['open', 'acked']),
    );
  });

  it('la firma y el contrato de retorno de closeOpenAlert no cambian', () => {
    // Sigue devolviendo {id} | null: el consumer de #12 no se toca.
    const source = readFileSync(
      join(__dirname, 'alerts-engine-store.ts'),
      'utf8',
    );
    expect(source).toContain(
      'closeOpenAlert(input: CloseOpenAlertInput): Promise<{ id: string } | null>',
    );
  });
});
