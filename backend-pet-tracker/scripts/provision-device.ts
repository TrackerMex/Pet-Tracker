import { parseArgs } from 'node:util';
import { ConfigService } from '@nestjs/config';
import { config as loadDotenv } from 'dotenv';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { uuidv7 } from 'uuidv7';
import { devices } from '@/db/schema/devices.schema';
import { createWialonClient } from '@/integrations/wialon/wialon.factory';
import { WialonHttpClient } from '@/integrations/wialon/wialon-http.client';
import type { WialonClient } from '@/integrations/wialon/wialon-client.interface';
import { generateActivationCode } from '@/modules/devices/application/activation-code';

export interface ProvisionDeviceInput {
  wialonUnitId: string;
  imei?: string;
  serialNumber?: string;
  esn?: string;
  model?: string;
}

export interface ProvisionDeviceResult {
  created: boolean;
  deviceId: string;
  activationCode: string | null;
}

export class WialonUnitNotFoundError extends Error {
  constructor(
    readonly unitId: string,
    readonly visibleUnits: number,
  ) {
    super(
      `wialon unit "${unitId}" no existe en la cuenta (${visibleUnits} unidades visibles); no se inserto ninguna fila`,
    );
    this.name = 'WialonUnitNotFoundError';
  }
}

export class SimulatedWialonClientError extends Error {
  constructor() {
    super(
      'provision-device exige la API real de Wialon: pon SIM_MODE=false y un WIALON_TOKEN real en .env',
    );
    this.name = 'SimulatedWialonClientError';
  }
}

export function assertRealWialonClient(client: WialonClient): void {
  if (!(client instanceof WialonHttpClient)) {
    throw new SimulatedWialonClientError();
  }
}

export async function provisionDevice(
  db: NodePgDatabase,
  wialon: WialonClient,
  input: ProvisionDeviceInput,
): Promise<ProvisionDeviceResult> {
  // ponytail: SELECT+INSERT asume una corrida manual; UNIQUE rechaza un duplicado concurrente.
  const [existing] = await db
    .select({ id: devices.id, activationCode: devices.activationCode })
    .from(devices)
    .where(eq(devices.wialonUnitId, input.wialonUnitId));

  if (existing) {
    return {
      created: false,
      deviceId: existing.id,
      activationCode: existing.activationCode,
    };
  }

  const units = await wialon.listUnits();
  if (!units.some((unit) => unit.unitId === input.wialonUnitId)) {
    throw new WialonUnitNotFoundError(input.wialonUnitId, units.length);
  }

  const row = {
    id: uuidv7(),
    wialonUnitId: input.wialonUnitId,
    imei: input.imei ?? null,
    serialNumber: input.serialNumber ?? null,
    esn: input.esn ?? null,
    model: input.model ?? null,
    activationCode: generateActivationCode(),
    status: 'available' as const,
    isSimulated: false,
  };

  await db.insert(devices).values(row);

  return {
    created: true,
    deviceId: row.id,
    activationCode: row.activationCode,
  };
}

async function main(): Promise<void> {
  loadDotenv({ path: '../.env' });
  const { values } = parseArgs({
    options: {
      'unit-id': { type: 'string' },
      imei: { type: 'string' },
      serial: { type: 'string' },
      esn: { type: 'string' },
      model: { type: 'string' },
    },
  });
  const wialonUnitId = values['unit-id'];

  if (!wialonUnitId) {
    throw new Error('falta --unit-id');
  }

  const wialon = createWialonClient(new ConfigService());
  assertRealWialonClient(wialon);
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const result = await provisionDevice(drizzle(pool), wialon, {
      wialonUnitId,
      imei: values.imei,
      serialNumber: values.serial,
      esn: values.esn,
      model: values.model,
    });
    console.log(
      `provision-device: ${result.created ? 'alta OK' : 'sin cambios'}, device ${result.deviceId}, activation_code ${result.activationCode}`,
    );
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main().catch((error: unknown) => {
    console.error('provision-device failed:', error);
    process.exitCode = 1;
  });
}
