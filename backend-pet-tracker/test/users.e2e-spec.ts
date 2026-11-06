import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { inArray, or, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { devices } from '@/db/schema/devices.schema';
import { pets } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { PASSWORD_HASHER } from '@/modules/auth/domain/ports/password-hasher';
import type { PasswordHasher } from '@/modules/auth/domain/ports/password-hasher';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { AppModule } from '../src/app.module';

describe('Users account deletion (e2e)', () => {
  const RUN_ID = `${Date.now()}`;
  const PASSWORD = 'Secreto-247-e2e';
  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokens: TokenService;
  let passwordHash: string;
  const createdUserIds: string[] = [];
  const createdPetIds: string[] = [];
  const createdDeviceIds: string[] = [];

  async function seedUser(label: string) {
    const id = uuidv7();
    const email = `users-e2e-${label}-${RUN_ID}@example.com`;
    await db.insert(users).values({
      id,
      email,
      passwordHash,
      firstName: 'E2e',
      lastName: label,
      phone: '+525512345678',
      country: 'MX',
      timezone: 'UTC',
      termsAcceptedAt: new Date(),
    });
    createdUserIds.push(id);
    return { id, email, token: tokens.sign({ sub: id, email }) };
  }
  function api() {
    return request(app.getHttpServer());
  }
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();
    db = app.get<NodePgDatabase>(DRIZZLE);
    tokens = app.get<TokenService>(TOKEN_SERVICE);
    passwordHash = await app
      .get<PasswordHasher>(PASSWORD_HASHER)
      .hash(PASSWORD);
  });
  afterAll(async () => {
    const ids = [...createdUserIds, ...createdPetIds];
    if (ids.length)
      await db
        .delete(auditLog)
        .where(
          or(inArray(auditLog.userId, ids), inArray(auditLog.entityId, ids)),
        );
    if (createdPetIds.length)
      await db.delete(pets).where(inArray(pets.id, createdPetIds));
    if (createdUserIds.length)
      await db.delete(users).where(inArray(users.id, createdUserIds));
    if (createdDeviceIds.length)
      await db.delete(devices).where(inArray(devices.id, createdDeviceIds));
    await app.close();
  });
  describe('#247 R2: un token de un usuario borrado da 401', () => {
    it('#247 R2: GET /v1/me y GET /v1/pets responden 401 si el usuario del token ya no existe', async () => {
      const user = await seedUser('r2');
      await db.delete(users).where(eq(users.id, user.id));
      for (const path of ['/v1/me', '/v1/pets']) {
        await api()
          .get(path)
          .set('Authorization', `Bearer ${user.token}`)
          .expect(401);
      }
    });
  });
});
