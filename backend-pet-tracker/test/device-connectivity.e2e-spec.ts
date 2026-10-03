import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { devices, petDevices } from '@/db/schema/devices.schema';
import { pets } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { DEVICE_ONLINE_THRESHOLD_MS } from '@/pipeline/constants';
import { AppModule } from './../src/app.module';

interface DeviceBody {
  model: string | null;
  batteryPct: number | null;
  connectivity: string | null;
  lastMessageAt: string | null;
  esn: string | null;
}

describe('Device connectivity derived at read (e2e)', () => {
  jest.setTimeout(180_000);

  const RUN_ID = `${Date.now()}`;
  const DEVICE_KEYS = [
    'model',
    'batteryPct',
    'connectivity',
    'lastMessageAt',
    'esn',
  ].sort();

  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokenService: TokenService;
  let userId: string;
  let token: string;
  let petId: string;
  let deviceId: string;

  function api() {
    return request(app.getHttpServer());
  }

  async function readDevices(): Promise<{
    profile: DeviceBody;
    direct: DeviceBody;
  }> {
    const profileResponse = await api()
      .get(`/v1/pets/${petId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const directResponse = await api()
      .get(`/v1/pets/${petId}/device`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    return {
      profile: (profileResponse.body as { device: DeviceBody }).device,
      direct: directResponse.body as DeviceBody,
    };
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();

    db = app.get<NodePgDatabase>(DRIZZLE);
    tokenService = app.get<TokenService>(TOKEN_SERVICE);

    userId = uuidv7();
    const email = `device-connectivity-${RUN_ID}@example.com`;
    await db.insert(users).values({
      id: userId,
      email,
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$e2e$dummy',
      firstName: 'E2e',
      lastName: 'Connectivity',
      phone: '+525512345678',
      country: 'MX',
      timezone: 'UTC',
      termsAcceptedAt: new Date(),
    });
    token = tokenService.sign({ sub: userId, email });

    const petResponse = await api()
      .post('/v1/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Connectivity-${RUN_ID}`,
        species: 'dog',
        birthDate: '2024-01-15',
      })
      .expect(201);
    petId = (petResponse.body as { id: string }).id;

    deviceId = uuidv7();
    await db.insert(devices).values({
      id: deviceId,
      esn: `CONN-${deviceId}`,
      model: 'sim-collar',
      status: 'assigned',
      isSimulated: true,
    });
    await db.insert(petDevices).values({ id: uuidv7(), petId, deviceId });
  });

  afterAll(async () => {
    if (db) {
      await db.delete(auditLog).where(eq(auditLog.userId, userId));
      if (petId) {
        await db.delete(pets).where(eq(pets.id, petId));
      }
      if (deviceId) {
        await db.delete(devices).where(eq(devices.id, deviceId));
      }
      if (userId) {
        await db.delete(users).where(inArray(users.id, [userId]));
      }
    }
    await app?.close();
  });

  describe('#73 R3: GET /v1/pets/:petId y GET /v1/pets/:petId/device derivan connectivity de devices.last_message_at', () => {
    it('collar vinculado que nunca reporto: connectivity null en el detalle y en /device', async () => {
      await db
        .update(devices)
        .set({ lastMessageAt: null })
        .where(eq(devices.id, deviceId));

      const { profile, direct } = await readDevices();

      expect(profile.connectivity).toBeNull();
      expect(direct.connectivity).toBeNull();
      expect(Object.keys(profile).sort()).toEqual(DEVICE_KEYS);
      expect(Object.keys(direct).sort()).toEqual(DEVICE_KEYS);
    });

    it('last_message_at mas viejo que el umbral: offline en ambas rutas', async () => {
      await db
        .update(devices)
        .set({
          lastMessageAt: new Date(
            Date.now() - DEVICE_ONLINE_THRESHOLD_MS - 60_000,
          ),
        })
        .where(eq(devices.id, deviceId));

      const { profile, direct } = await readDevices();

      expect(profile.connectivity).toBe('offline');
      expect(direct.connectivity).toBe('offline');
    });

    it('last_message_at reciente: online en ambas rutas', async () => {
      await db
        .update(devices)
        .set({ lastMessageAt: new Date(Date.now() - 10_000) })
        .where(eq(devices.id, deviceId));

      const { profile, direct } = await readDevices();

      expect(profile.connectivity).toBe('online');
      expect(direct.connectivity).toBe('online');
    });
  });
});
