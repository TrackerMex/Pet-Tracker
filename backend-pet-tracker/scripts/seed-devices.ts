import { config as loadDotenv } from 'dotenv';
import { inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { uuidv7 } from 'uuidv7';
import { devices } from '@/db/schema/devices.schema';
import { deviceSubscriptions } from '@/db/schema/subscriptions.schema';
import { SIMULATED_DEVICES } from '@/db/seed/simulated-devices';

// La constante SIMULATED_DEVICES vive en src/db/seed/simulated-devices.ts
// desde #8 (el FakeWialonClient la importa y src/ no puede depender de
// scripts/). Se re-exporta aqui para conservar la superficie que ya usan
// los e2e de #7.
export { SIMULATED_DEVICES };

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

  const simulatedDevices = await db
    .select({ id: devices.id })
    .from(devices)
    .where(
      inArray(
        devices.esn,
        SIMULATED_DEVICES.map(({ esn }) => esn),
      ),
    );

  await db
    .insert(deviceSubscriptions)
    .values(
      simulatedDevices.map(({ id }) => ({
        deviceId: id,
        status: 'active',
        planCode: 'grandfathered',
        currentPeriodEnd: new Date('2099-12-31T00:00:00Z'),
      })),
    )
    .onConflictDoNothing({ target: deviceSubscriptions.deviceId });
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
