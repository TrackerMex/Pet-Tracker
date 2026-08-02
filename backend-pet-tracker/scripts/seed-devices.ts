import { config as loadDotenv } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { uuidv7 } from 'uuidv7';
import { devices } from '@/db/schema/devices.schema';

/** Los 3 collares simulados del MVP (devices-claim R2, plan 005 §Paso 2). */
export const SIMULATED_DEVICES = [
  { esn: 'SIM-001', activationCode: 'ACT-001', wialonUnitId: '900001' },
  { esn: 'SIM-002', activationCode: 'ACT-002', wialonUnitId: '900002' },
  { esn: 'SIM-003', activationCode: 'ACT-003', wialonUnitId: '900003' },
] as const;

/**
 * Inserta los devices simulados que falten (R2). `ON CONFLICT (esn) DO
 * NOTHING` a proposito — NO es upsert: re-sembrar jamas resetea el `status`
 * ni la asignacion de un device ya reclamado (ver
 * specs/devices-claim/design.md).
 */
export async function seedSimulatedDevices(db: NodePgDatabase): Promise<void> {
  await db
    .insert(devices)
    .values(
      SIMULATED_DEVICES.map((device) => ({
        id: uuidv7(),
        esn: device.esn,
        activationCode: device.activationCode,
        wialonUnitId: device.wialonUnitId,
        model: 'sim-collar',
        status: 'available',
        isSimulated: true,
      })),
    )
    .onConflictDoNothing({ target: devices.esn });
}

/**
 * Excepcion documentada (misma que provision-local.ts, ver
 * specs/localstack-provisioning/design.md): script standalone fuera del
 * bootstrap de Nest — carga el .env raiz con dotenv y lee DATABASE_URL de
 * process.env en vez de ConfigService.
 */
async function main(): Promise<void> {
  loadDotenv({ path: '../.env' });

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    await seedSimulatedDevices(drizzle(pool));
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main().catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error('seed-devices failed:', error);
    process.exitCode = 1;
  });
}
