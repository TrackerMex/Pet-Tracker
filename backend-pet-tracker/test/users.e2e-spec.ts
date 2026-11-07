import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { inArray, or, eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { S3_CLIENT } from '@/aws/aws.constants';
import { mealServings } from '@/db/schema/nutrition.schema';
import { pushTokens } from '@/db/schema/push-tokens.schema';
import {
  petStoresOf,
  seedPetStores,
  countPetStores,
  cleanPetStores,
} from './fixtures/pet-stores';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { devices, petDevices } from '@/db/schema/devices.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
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
  const seededStorePetIds: string[] = [];
  type TestUser = { id: string; email: string; token: string };

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
  async function createPetViaApi(owner: TestUser): Promise<{ id: string }> {
    const response = await api()
      .post('/v1/pets')
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ name: `Pet-${RUN_ID}`, species: 'dog', birthDate: '2024-01-15' })
      .expect(201);
    const body = response.body as { id: string };
    createdPetIds.push(body.id);
    return body;
  }
  function seedMembership(petId: string, userId: string, role: string) {
    return db
      .insert(petUsers)
      .values({ petId, userId, role, status: 'active' });
  }
  async function seedDevice(label: string): Promise<string> {
    const id = uuidv7();
    await db.insert(devices).values({
      id,
      model: 'e2e-collar',
      isSimulated: true,
      status: 'assigned',
      esn: `${label}-${RUN_ID}`,
    });
    createdDeviceIds.push(id);
    return id;
  }
  function deleteMe(user: TestUser, body: Record<string, unknown> | undefined) {
    const req = api()
      .delete('/v1/me')
      .set('Authorization', `Bearer ${user.token}`);
    return body === undefined ? req : req.send(body);
  }
  async function seedStores(petId: string): Promise<void> {
    seededStorePetIds.push(petId);
    await seedPetStores(petStoresOf(app), petId);
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
    for (const petId of seededStorePetIds)
      await cleanPetStores(petStoresOf(app), petId);
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
  describe('#247 R3: borrar una cuenta sin mascotas responde 204', () => {
    it('#247 R3: con la contraseña correcta responde 204 y borra el usuario y sus push_tokens', async () => {
      const user = await seedUser('r3');
      await db.insert(pushTokens).values({
        id: uuidv7(),
        userId: user.id,
        expoToken: `ExponentPushToken[r3-${RUN_ID}]`,
        platform: 'android',
      });
      const response = await deleteMe(user, { password: PASSWORD }).expect(204);
      expect(response.text).toBe('');
      expect(
        await db.select().from(users).where(eq(users.id, user.id)),
      ).toHaveLength(0);
      expect(
        await db
          .select()
          .from(pushTokens)
          .where(eq(pushTokens.userId, user.id)),
      ).toHaveLength(0);
    });
    it('#247 R3: sin token responde 401', async () => {
      await api().delete('/v1/me').send({ password: PASSWORD }).expect(401);
    });
  });
  describe('#247 R4: el token anterior al borrado da 401', () => {
    it('#247 R4: GET /v1/me y GET /v1/pets responden 401 con el token anterior', async () => {
      const user = await seedUser('r4');
      await deleteMe(user, { password: PASSWORD }).expect(204);
      for (const path of ['/v1/me', '/v1/pets']) {
        const response = await api()
          .get(path)
          .set('Authorization', `Bearer ${user.token}`)
          .expect(401);
        expect(response.body).toEqual({
          statusCode: 401,
          message: 'Unauthorized',
        });
      }
    });
    it('#247 R4: DELETE /v1/me/push-tokens con el token anterior responde 401', async () => {
      const user = await seedUser('r4-push');
      const expoToken = `ExponentPushToken[r4-${RUN_ID}]`;
      await db.insert(pushTokens).values({
        id: uuidv7(),
        userId: user.id,
        expoToken,
        platform: 'android',
      });
      await deleteMe(user, { password: PASSWORD }).expect(204);
      const response = await api()
        .delete('/v1/me/push-tokens')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ expoToken })
        .expect(401);
      expect(response.body).toEqual({
        statusCode: 401,
        message: 'Unauthorized',
      });
    });
  });
  describe('#247 R5: un body inválido es 400 y no borra', () => {
    it.each<[string, Record<string, unknown> | undefined]>([
      ['sin body', undefined],
      ['vacío', {}],
      ['password vacío', { password: '' }],
      ['password no string', { password: 123 }],
      ['clave extra', { password: PASSWORD, extra: true }],
    ])(
      '#247 R5: %s responde 400 Validation failed y el usuario sigue',
      async (label, body) => {
        const user = await seedUser(`r5-${label}`);
        const response = await deleteMe(user, body).expect(400);
        expect(response.body).toMatchObject({
          statusCode: 400,
          message: 'Validation failed',
        });
        expect(
          await db.select().from(users).where(eq(users.id, user.id)),
        ).toHaveLength(1);
      },
    );
  });
  describe('#247 R6: contraseña incorrecta es 403 y no borra nada', () => {
    it('#247 R6: responde 403 Invalid password y no borra usuario, mascota ni audita', async () => {
      const user = await seedUser('r6');
      const pet = await createPetViaApi(user);
      const response = await deleteMe(user, { password: 'wrong' }).expect(403);
      expect(response.body).toEqual({
        statusCode: 403,
        message: 'Invalid password',
        error: 'Forbidden',
      });
      expect(
        await db.select().from(users).where(eq(users.id, user.id)),
      ).toHaveLength(1);
      expect(
        await db.select().from(pets).where(eq(pets.id, pet.id)),
      ).toHaveLength(1);
      expect(
        await db
          .select()
          .from(auditLog)
          .where(
            and(
              eq(auditLog.action, 'user.delete'),
              eq(auditLog.entityId, user.id),
            ),
          ),
      ).toHaveLength(0);
    });
  });
  describe('#247 R8: las mascotas propias se borran para todos', () => {
    it('#247 R8: la mascota de un dueño único deja de existir', async () => {
      const user = await seedUser('r8-sole');
      const pet = await createPetViaApi(user);
      await deleteMe(user, { password: PASSWORD }).expect(204);
      expect(
        await db.select().from(pets).where(eq(pets.id, pet.id)),
      ).toHaveLength(0);
      expect(
        await db.select().from(petUsers).where(eq(petUsers.petId, pet.id)),
      ).toHaveLength(0);
    });
    it('#247 R8: la mascota compartida desaparece también para el miembro family', async () => {
      const owner = await seedUser('r8-owner'),
        member = await seedUser('r8-family');
      const pet = await createPetViaApi(owner);
      await seedMembership(pet.id, member.id, 'family');
      await api()
        .get(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);
      await deleteMe(owner, { password: PASSWORD }).expect(204);
      const list = await api()
        .get('/v1/pets')
        .set('Authorization', `Bearer ${member.token}`)
        .expect(200);
      expect((list.body as { id: string }[]).map((p) => p.id)).not.toContain(
        pet.id,
      );
      await api()
        .get(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${member.token}`)
        .expect(404);
      expect(
        await db.select().from(pets).where(eq(pets.id, pet.id)),
      ).toHaveLength(0);
      expect(
        await db.select().from(users).where(eq(users.id, member.id)),
      ).toHaveLength(1);
    });
  });
  describe('#247 R9: la membresía family en una mascota ajena se suelta', () => {
    it('#247 R9: la mascota ajena sobrevive y created_by queda en NULL', async () => {
      const owner = await seedUser('r9-owner'),
        family = await seedUser('r9-family');
      const pet = await createPetViaApi(owner);
      await seedMembership(pet.id, family.id, 'family');
      const mealId = uuidv7();
      await db.insert(mealServings).values({
        id: mealId,
        petId: pet.id,
        servedOn: '2026-11-06',
        mealTime: '08:00',
        createdBy: family.id,
      });
      await deleteMe(family, { password: PASSWORD }).expect(204);
      await api()
        .get(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);
      expect(
        await db.select().from(petUsers).where(eq(petUsers.userId, family.id)),
      ).toHaveLength(0);
      const rows = await db
        .select()
        .from(mealServings)
        .where(eq(mealServings.id, mealId));
      expect(rows).toHaveLength(1);
      expect(rows[0].createdBy).toBeNull();
    });
  });
  describe('#247 R10: borrar la cuenta libera los collares de sus mascotas', () => {
    it('#247 R10: el collar de la mascota borrada con la cuenta queda available', async () => {
      const user = await seedUser('r10');
      const pet = await createPetViaApi(user);
      const deviceId = await seedDevice('247-account-r10');
      await db
        .insert(petDevices)
        .values({ id: uuidv7(), petId: pet.id, deviceId });
      await deleteMe(user, { password: PASSWORD }).expect(204);
      const [device] = await db
        .select()
        .from(devices)
        .where(eq(devices.id, deviceId));
      expect(device.status).toBe('available');
    });
  });
  describe('#247 R12: el borrado de cuenta audita user.delete', () => {
    it('#247 R12: deja una sola fila user.delete con user_id NULL, entity_id y meta.petIds', async () => {
      const user = await seedUser('r12');
      const pet1 = await createPetViaApi(user),
        pet2 = await createPetViaApi(user);
      const petIds = [pet1.id, pet2.id].sort();
      await deleteMe(user, { password: PASSWORD }).expect(204);
      const entries = await db
        .select()
        .from(auditLog)
        .where(
          and(
            eq(auditLog.action, 'user.delete'),
            eq(auditLog.entityId, user.id),
          ),
        );
      expect(entries).toHaveLength(1);
      expect(entries[0].userId).toBeNull();
      expect(entries[0].entity).toBe('user');
      expect(entries[0].entityId).toBe(user.id);
      expect((entries[0].meta as { petIds: string[] }).petIds.sort()).toEqual(
        petIds,
      );
      expect(
        await db
          .select()
          .from(auditLog)
          .where(
            and(
              eq(auditLog.action, 'pet.delete'),
              inArray(auditLog.entityId, petIds),
            ),
          ),
      ).toHaveLength(0);
    });
  });
  describe('#247 R13: borrar la cuenta purga S3 y DynamoDB de sus mascotas', () => {
    it('#247 R13: borra pets/<petId>/ y PET#<petId> de cada mascota y no toca otra', async () => {
      const user = await seedUser('r13');
      const pet1 = await createPetViaApi(user),
        pet2 = await createPetViaApi(user);
      const foreignPetId = uuidv7();
      for (const petId of [pet1.id, pet2.id, foreignPetId])
        await seedStores(petId);
      await deleteMe(user, { password: PASSWORD }).expect(204);
      for (const petId of [pet1.id, pet2.id])
        expect(await countPetStores(petStoresOf(app), petId)).toEqual({
          s3Objects: 0,
          dynamoItems: 0,
        });
      expect(await countPetStores(petStoresOf(app), foreignPetId)).toEqual({
        s3Objects: 2,
        dynamoItems: 30,
      });
    });
  });
  describe('#247 R14: un fallo de purga no tumba el 204 y queda en el log', () => {
    it('#247 R14: S3 caído responde 204, borra en Postgres, purga DynamoDB y registra PET_PURGE_FAILED', async () => {
      const user = await seedUser('r14');
      const pet = await createPetViaApi(user);
      await seedStores(pet.id);
      const s3Send = jest
        .spyOn(
          app.get<{ send: (command: unknown) => Promise<unknown> }>(S3_CLIENT),
          'send',
        )
        .mockRejectedValueOnce(new Error('s3 down 247'));
      const spy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation(() => undefined);
      try {
        await deleteMe(user, { password: PASSWORD }).expect(204);
        expect(
          await db.select().from(users).where(eq(users.id, user.id)),
        ).toHaveLength(0);
        expect(
          await db.select().from(pets).where(eq(pets.id, pet.id)),
        ).toHaveLength(0);
        expect(await countPetStores(petStoresOf(app), pet.id)).toEqual({
          s3Objects: 2,
          dynamoItems: 0,
        });
        const messages = spy.mock.calls.map(([message]) => String(message));
        expect(
          messages.filter((m) =>
            m.startsWith(
              `PET_PURGE_FAILED store=s3 petId=${pet.id} target=pets/${pet.id}/ reason=s3 down 247`,
            ),
          ),
        ).toHaveLength(1);
        expect(
          messages.filter((m) =>
            m.startsWith('PET_PURGE_FAILED store=dynamodb'),
          ),
        ).toHaveLength(0);
      } finally {
        s3Send.mockRestore();
        spy.mockRestore();
      }
    });
  });
});
