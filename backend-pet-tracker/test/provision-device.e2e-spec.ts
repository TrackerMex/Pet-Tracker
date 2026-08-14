import { spawnSync } from 'node:child_process';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import type { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { devices, petDevices } from '@/db/schema/devices.schema';
import { pets } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { FakeWialonClient } from '@/integrations/wialon/fake-wialon.client';
import { WialonHttpClient } from '@/integrations/wialon/wialon-http.client';
import type { WialonClient } from '@/integrations/wialon/wialon-client.interface';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import {
  assertRealWialonClient,
  SimulatedWialonClientError,
} from '../scripts/provision-device';
import { seedSimulatedDevices } from '../scripts/seed-devices';
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
  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokenService: TokenService;
  const createdDeviceIds: string[] = [];
  const createdPetIds: string[] = [];
  const createdUserIds: string[] = [];

  async function seedUser() {
    const id = uuidv7();
    const email = `provision-device-${RUN_ID}@example.com`;

    await db.insert(users).values({
      id,
      email,
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$e2e$dummy',
      firstName: 'Provision',
      lastName: 'Owner',
      phone: '+525512345678',
      country: 'MX',
      timezone: 'UTC',
      termsAcceptedAt: new Date(),
    });
    createdUserIds.push(id);

    return { id, token: tokenService.sign({ sub: id, email }) };
  }

  async function createPet(ownerToken: string) {
    const response = await request(app.getHttpServer())
      .post('/v1/pets')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: `Provision-${RUN_ID}`,
        species: 'dog',
        birthDate: '2024-01-15',
      })
      .expect(201);
    const pet = response.body as { id: string };
    createdPetIds.push(pet.id);
    return pet;
  }

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();
    db = app.get<NodePgDatabase>(DRIZZLE);
    tokenService = app.get<TokenService>(TOKEN_SERVICE);
  });

  afterAll(async () => {
    if (createdUserIds.length > 0) {
      await db.delete(auditLog).where(inArray(auditLog.userId, createdUserIds));
    }
    if (createdPetIds.length > 0) {
      await db.delete(pets).where(inArray(pets.id, createdPetIds));
    }
    if (createdDeviceIds.length > 0) {
      await db.delete(devices).where(inArray(devices.id, createdDeviceIds));
    }
    if (createdUserIds.length > 0) {
      await db.delete(users).where(inArray(users.id, createdUserIds));
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
      expect(result.activationCode).toMatch(/^PT-[0-9A-HJKMNP-TV-Z]{10}$/);
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

  describe('R6 (device-provisioning-admin #24): seed-devices sigue sembrando los simulados sin tocar el collar real', () => {
    it('conserva el collar real y distingue las filas simuladas', async () => {
      const unitId = `e2e-r6-unit-${RUN_ID}`;
      const result = await provisionDevice(db, wialonStub([unitId]), {
        wialonUnitId: unitId,
      });
      createdDeviceIds.push(result.deviceId);

      await seedSimulatedDevices(db);

      const [real] = await db
        .select()
        .from(devices)
        .where(eq(devices.id, result.deviceId));
      const simulated = await db
        .select()
        .from(devices)
        .where(inArray(devices.esn, ['SIM-001', 'SIM-002', 'SIM-003']));

      expect(real.isSimulated).toBe(false);
      expect(real.activationCode).toBe(result.activationCode);
      expect(simulated).toHaveLength(3);
      expect(simulated.every((row) => row.isSimulated)).toBe(true);
    });
  });

  describe('R7 (device-provisioning-admin #24): el collar aprovisionado se reclama con POST /v1/devices/claim', () => {
    it('crea la asignacion activa y marca el collar assigned', async () => {
      const unitId = `e2e-r7-unit-${RUN_ID}`;
      const provisioned = await provisionDevice(db, wialonStub([unitId]), {
        wialonUnitId: unitId,
      });
      createdDeviceIds.push(provisioned.deviceId);
      const owner = await seedUser();
      const pet = await createPet(owner.token);

      await request(app.getHttpServer())
        .post('/v1/devices/claim')
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ petId: pet.id, activationCode: provisioned.activationCode })
        .expect(201);

      const assignments = await db
        .select()
        .from(petDevices)
        .where(
          and(
            eq(petDevices.petId, pet.id),
            eq(petDevices.deviceId, provisioned.deviceId),
            isNull(petDevices.releasedAt),
          ),
        );
      const [device] = await db
        .select()
        .from(devices)
        .where(eq(devices.id, provisioned.deviceId));

      expect(assignments).toHaveLength(1);
      expect(device.status).toBe('assigned');
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
