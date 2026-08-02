import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { devices, petDevices } from '@/db/schema/devices.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { seedSimulatedDevices } from '../scripts/seed-devices';
import { AppModule } from './../src/app.module';

const SIM_ESNS = ['SIM-001', 'SIM-002', 'SIM-003'];

/**
 * e2e de devices-claim contra Postgres real (R2-R15). Los usuarios se
 * siembran directo en la base y los tokens se firman con el TokenService de
 * la app — mismo arnes que pets.e2e-spec.ts (#5). Los devices de prueba de
 * los requisitos R3+ usan identificadores con RUN_ID para no chocar entre
 * corridas; los SIM-001..003 del seed (R2) se resetean antes de ese bloque
 * porque sus ESNs son fijos por spec.
 */
describe('Devices claim (e2e)', () => {
  const RUN_ID = `${Date.now()}`;

  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokenService: TokenService;

  const createdUserIds: string[] = [];
  const createdPetIds: string[] = [];
  const createdDeviceIds: string[] = [];

  interface TestUser {
    id: string;
    email: string;
    token: string;
  }

  async function seedUser(label: string): Promise<TestUser> {
    const id = uuidv7();
    const email = `devices-e2e-${label}-${RUN_ID}@example.com`;

    await db.insert(users).values({
      id,
      email,
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$e2e$dummy',
      firstName: 'E2e',
      lastName: label,
      phone: '+525512345678',
      country: 'MX',
      timezone: 'UTC',
      termsAcceptedAt: new Date(),
    });
    createdUserIds.push(id);

    return { id, email, token: tokenService.sign({ sub: id, email }) };
  }

  async function createPetViaApi(owner: TestUser, name: string) {
    const response = await api()
      .post('/v1/pets')
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ name, species: 'dog', birthDate: '2024-01-15' })
      .expect(201);

    const body = response.body as { id: string };
    createdPetIds.push(body.id);

    return body;
  }

  function seedMembership(
    petId: string,
    userId: string,
    role: string,
    status = 'active',
  ) {
    return db.insert(petUsers).values({ petId, userId, role, status });
  }

  /** Device de prueba con identificadores unicos por corrida (no seed). */
  async function seedDevice(
    label: string,
    overrides: Partial<typeof devices.$inferInsert> = {},
  ) {
    const id = uuidv7();

    await db.insert(devices).values({
      id,
      esn: `E2E-${label}-${RUN_ID}`,
      model: 'e2e-collar',
      isSimulated: true,
      ...overrides,
    });
    createdDeviceIds.push(id);

    const [row] = await db.select().from(devices).where(eq(devices.id, id));
    return row;
  }

  function api() {
    return request(app.getHttpServer());
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Mismo prefijo global que main.ts — sin esto /v1/* daria 404 aqui.
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
      // Cascadea pet_users y pet_devices.
      await db.delete(pets).where(inArray(pets.id, createdPetIds));
    }
    if (createdDeviceIds.length > 0) {
      await db
        .delete(petDevices)
        .where(inArray(petDevices.deviceId, createdDeviceIds));
      await db.delete(devices).where(inArray(devices.id, createdDeviceIds));
    }
    if (createdUserIds.length > 0) {
      await db.delete(users).where(inArray(users.id, createdUserIds));
    }
    await app.close();
  });

  describe('R2: seed:devices siembra SIM-001..003 y es idempotente', () => {
    // Los ESNs del seed son fijos por spec: se resetean aqui para que la
    // suite sea re-ejecutable contra la misma base.
    beforeAll(async () => {
      const rows = await db
        .select()
        .from(devices)
        .where(inArray(devices.esn, SIM_ESNS));
      const ids = rows.map((row) => row.id);

      if (ids.length > 0) {
        await db.delete(petDevices).where(inArray(petDevices.deviceId, ids));
        await db.delete(devices).where(inArray(devices.id, ids));
      }
    });

    it('la primera corrida deja exactamente las 3 filas simuladas disponibles', async () => {
      await seedSimulatedDevices(db);

      const rows = await db
        .select()
        .from(devices)
        .where(inArray(devices.esn, SIM_ESNS))
        .orderBy(devices.esn);

      expect(
        rows.map((row) => ({
          esn: row.esn,
          activationCode: row.activationCode,
          wialonUnitId: row.wialonUnitId,
          model: row.model,
          status: row.status,
          isSimulated: row.isSimulated,
        })),
      ).toEqual([
        {
          esn: 'SIM-001',
          activationCode: 'ACT-001',
          wialonUnitId: '900001',
          model: 'sim-collar',
          status: 'available',
          isSimulated: true,
        },
        {
          esn: 'SIM-002',
          activationCode: 'ACT-002',
          wialonUnitId: '900002',
          model: 'sim-collar',
          status: 'available',
          isSimulated: true,
        },
        {
          esn: 'SIM-003',
          activationCode: 'ACT-003',
          wialonUnitId: '900003',
          model: 'sim-collar',
          status: 'available',
          isSimulated: true,
        },
      ]);
    });

    it('re-sembrar con un claim de por medio no duplica ni resetea el device asignado', async () => {
      const owner = await seedUser('r2-owner');
      const pet = await createPetViaApi(owner, `R2-${RUN_ID}`);

      const [sim1] = await db
        .select()
        .from(devices)
        .where(eq(devices.esn, 'SIM-001'));

      // Claim simulado directo en base — el endpoint llega con R3; a R2 solo
      // le importa que re-sembrar no toque un device en uso.
      await db.insert(petDevices).values({
        id: uuidv7(),
        petId: pet.id,
        deviceId: sim1.id,
      });
      await db
        .update(devices)
        .set({ status: 'assigned' })
        .where(eq(devices.id, sim1.id));

      await seedSimulatedDevices(db);

      const rows = await db
        .select()
        .from(devices)
        .where(inArray(devices.esn, SIM_ESNS));
      expect(rows).toHaveLength(3);

      const sim1After = rows.find((row) => row.esn === 'SIM-001');
      expect(sim1After?.id).toBe(sim1.id);
      expect(sim1After?.status).toBe('assigned');

      const activeRows = await db
        .select()
        .from(petDevices)
        .where(
          and(eq(petDevices.deviceId, sim1.id), isNull(petDevices.releasedAt)),
        );
      expect(activeRows).toHaveLength(1);
    });
  });
});
