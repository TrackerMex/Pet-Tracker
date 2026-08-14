import { spawnSync } from 'node:child_process';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { eq, inArray } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { devices } from '@/db/schema/devices.schema';
import { FakeWialonClient } from '@/integrations/wialon/fake-wialon.client';
import { WialonHttpClient } from '@/integrations/wialon/wialon-http.client';
import type { WialonClient } from '@/integrations/wialon/wialon-client.interface';
import {
  assertRealWialonClient,
  SimulatedWialonClientError,
} from '../scripts/provision-device';
import * as provisionScript from '../scripts/provision-device';
import { AppModule } from '../src/app.module';

interface ProvisionResult {
  created: boolean;
  deviceId: string;
  activationCode: string | null;
}

const provisionDevice = (
  provisionScript as typeof provisionScript & {
    provisionDevice: (
      db: NodePgDatabase,
      wialon: WialonClient,
      input: {
        wialonUnitId: string;
        imei?: string;
        serialNumber?: string;
        esn?: string;
        model?: string;
      },
    ) => Promise<ProvisionResult>;
  }
).provisionDevice;

const RUN_ID = `${Date.now()}`;

function wialonStub(unitIds: string[]): WialonClient {
  return {
    listUnits: () =>
      Promise.resolve(
        unitIds.map((unitId) => ({ unitId, name: `collar ${unitId}` })),
      ),
    getMessages: () => Promise.resolve([]),
  };
}

describe('Device provisioning (e2e)', () => {
  let app: INestApplication;
  let db: NodePgDatabase;
  const createdDeviceIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();
    db = app.get<NodePgDatabase>(DRIZZLE);
  });

  afterAll(async () => {
    if (createdDeviceIds.length > 0) {
      await db.delete(devices).where(inArray(devices.id, createdDeviceIds));
    }
    await app.close();
  });

  describe('R1 (device-provisioning-admin #24): da de alta el collar real con activation_code generado, is_simulated=false y status available', () => {
    it('inserta exactamente una fila real con los flags y nulos requeridos', async () => {
      const unitId = `e2e-r1-unit-${RUN_ID}`;
      const result = await provisionDevice(db, wialonStub([unitId]), {
        wialonUnitId: unitId,
        imei: `imei-r1-${RUN_ID}`,
        model: 'tracker-r1',
      });
      createdDeviceIds.push(result.deviceId);

      const [row] = await db
        .select()
        .from(devices)
        .where(eq(devices.id, result.deviceId));

      expect(result.created).toBe(true);
      expect(result.activationCode).toMatch(
        /^PT-[0-9A-HJKMNP-TV-Z]{10}$/,
      );
      expect(row).toMatchObject({
        id: result.deviceId,
        wialonUnitId: unitId,
        imei: `imei-r1-${RUN_ID}`,
        serialNumber: null,
        esn: null,
        model: 'tracker-r1',
        activationCode: result.activationCode,
        status: 'available',
        isSimulated: false,
        batteryPct: null,
        connectivity: null,
        lastMessageAt: null,
        ingestWatermark: null,
      });
    });

    it('falla antes de conectar si falta --unit-id', () => {
      const result = spawnSync(
        process.execPath,
        [
          '-r',
          'ts-node/register',
          '-r',
          'tsconfig-paths/register',
          'scripts/provision-device.ts',
        ],
        { cwd: process.cwd(), encoding: 'utf8' },
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('--unit-id');
    });
  });
});

describe('R5 (device-provisioning-admin #24): assertRealWialonClient rechaza el simulador', () => {
  it('rechaza el fake y acepta el cliente HTTP real', () => {
    const fake = new FakeWialonClient({ seed: 1, homeLat: 0, homeLng: 0 });
    const real = new WialonHttpClient('https://wialon.test', 'token');

    expect(() => assertRealWialonClient(fake)).toThrow(
      SimulatedWialonClientError,
    );
    expect(() => assertRealWialonClient(real)).not.toThrow();
  });
});
