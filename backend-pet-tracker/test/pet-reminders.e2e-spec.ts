import {
  GetQueueUrlCommand,
  PurgeQueueCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { SQS_CLIENT } from '@/aws/aws.constants';
import { QUEUE_NOTIFICATIONS } from '@/aws/constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { reminders } from '@/db/schema/reminders.schema';
import { users } from '@/db/schema/users.schema';
import { DRIZZLE } from '@/db/drizzle.constants';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { RemindersDispatchService } from '@/modules/reminders/infrastructure/reminders-dispatch.service';
import { NotifierConsumerService } from '@/workers/notifier/notifier-consumer.service';
import { PUSH_SENDER } from '@/workers/notifier/push-sender';
import { AppModule } from '../src/app.module';

describe('Pet reminders (e2e)', () => {
  const runId = Date.now();
  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokens: TokenService;
  let sqs: SQSClient;
  let notificationsUrl: string;
  let dispatcher: RemindersDispatchService;
  let notifier: NotifierConsumerService;
  const sendPush = jest.fn().mockResolvedValue([]);
  const userIds: string[] = [];
  const petIds: string[] = [];

  interface UserFixture {
    id: string;
    token: string;
  }

  const api = () => request(app.getHttpServer());
  const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

  async function seedUser(label: string): Promise<UserFixture> {
    const id = uuidv7();
    const email = `reminders-${label}-${runId}@example.com`;
    await db.insert(users).values({
      id,
      email,
      passwordHash: 'not-used',
      firstName: 'E2e',
      lastName: label,
      phone: '+525512345678',
      country: 'MX',
      timezone: 'UTC',
      termsAcceptedAt: new Date(),
    });
    userIds.push(id);
    return { id, token: tokens.sign({ sub: id, email }) };
  }

  async function seedPet(owner: UserFixture) {
    const response = await api()
      .post('/v1/pets')
      .set(auth(owner.token))
      .send({
        name: `Pet-${uuidv7()}`,
        species: 'dog',
        birthDate: '2024-01-15',
      })
      .expect(201);
    const pet = response.body as { id: string };
    petIds.push(pet.id);
    return pet;
  }

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PUSH_SENDER)
      .useValue({ send: sendPush })
      .compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();
    db = app.get<NodePgDatabase>(DRIZZLE);
    tokens = app.get<TokenService>(TOKEN_SERVICE);
    sqs = app.get<SQSClient>(SQS_CLIENT);
    dispatcher = app.get(RemindersDispatchService);
    notifier = app.get(NotifierConsumerService);
    notificationsUrl = (
      await sqs.send(new GetQueueUrlCommand({ QueueName: QUEUE_NOTIFICATIONS }))
    ).QueueUrl as string;
    await sqs.send(new PurgeQueueCommand({ QueueUrl: notificationsUrl }));
  });

  afterAll(async () => {
    if (userIds.length) {
      await db.delete(auditLog).where(inArray(auditLog.userId, userIds));
    }
    if (petIds.length) {
      await db.delete(pets).where(inArray(pets.id, petIds));
    }
    if (userIds.length) {
      await db.delete(users).where(inArray(users.id, userIds));
    }
    await app.close();
  });

  describe('R2: POST crea reminder programado con shape exacto', () => {
    it('persiste defaults, actor y token vigente', async () => {
      const owner = await seedUser('r2');
      const pet = await seedPet(owner);
      const dueAt = new Date(Date.now() + 5 * 60_000).toISOString();

      const response = await api()
        .post(`/v1/pets/${pet.id}/reminders`)
        .set(auth(owner.token))
        .send({ type: 'appointment', title: 'Consulta anual', dueAt })
        .expect(201);

      expect(Object.keys(response.body as object).sort()).toEqual(
        [
          'id',
          'petId',
          'type',
          'title',
          'dueAt',
          'advanceMinutes',
          'status',
        ].sort(),
      );
      expect(response.body).toMatchObject({
        petId: pet.id,
        type: 'appointment',
        title: 'Consulta anual',
        dueAt,
        advanceMinutes: 60,
        status: 'scheduled',
      });

      const [row] = await db
        .select()
        .from(reminders)
        .where(eq(reminders.id, (response.body as { id: string }).id));
      expect(row).toMatchObject({
        petId: pet.id,
        createdBy: owner.id,
        status: 'scheduled',
        advanceMinutes: 60,
        enqueuedAt: null,
      });
      expect(row.scheduleName).toMatch(/^reminder-[0-9a-f-]{36}$/);
    });
  });

  describe('R3: POST invalido responde 400 sin insertar', () => {
    it.each<[string, Record<string, unknown>]>([
      ['type', { type: 'other' }],
      ['title-empty', { title: '   ' }],
      ['title-long', { title: 'x'.repeat(121) }],
      ['due-no-offset', { dueAt: '2099-01-01T00:00:00' }],
      ['due-past', { dueAt: new Date(Date.now() - 60_000).toISOString() }],
      ['advance-decimal', { advanceMinutes: 1.5 }],
      ['advance-negative', { advanceMinutes: -1 }],
      ['advance-too-large', { advanceMinutes: 10_081 }],
      ['unknown-key', { extra: true }],
    ])(
      'rechaza %s con el error de validacion estable',
      async (label, changes) => {
        const owner = await seedUser(`r3-${label}`);
        const pet = await seedPet(owner);
        const response = await api()
          .post(`/v1/pets/${pet.id}/reminders`)
          .set(auth(owner.token))
          .send({
            type: 'custom',
            title: 'Valido',
            dueAt: new Date(Date.now() + 60_000).toISOString(),
            ...changes,
          })
          .expect(400);

        const validationBody = response.body as {
          statusCode: number;
          message: string;
          errors: unknown[];
        };
        expect(validationBody.statusCode).toBe(400);
        expect(validationBody.message).toBe('Validation failed');
        expect(Array.isArray(validationBody.errors)).toBe(true);
        expect(
          await db.select().from(reminders).where(eq(reminders.petId, pet.id)),
        ).toEqual([]);
      },
    );
  });

  describe('R4: POST usa PetAccessGuard y exige owner', () => {
    const validBody = () => ({
      type: 'custom',
      title: 'Privado',
      dueAt: new Date(Date.now() + 60_000).toISOString(),
    });

    it('responde 404 para no-miembro, mascota inexistente e id invalido', async () => {
      const owner = await seedUser('r4-owner');
      const outsider = await seedUser('r4-outsider');
      const pet = await seedPet(owner);

      await api()
        .post(`/v1/pets/${pet.id}/reminders`)
        .set(auth(outsider.token))
        .send(validBody())
        .expect(404);
      await api()
        .post(`/v1/pets/${uuidv7()}/reminders`)
        .set(auth(owner.token))
        .send(validBody())
        .expect(404);
      await api()
        .post('/v1/pets/not-a-uuid/reminders')
        .set(auth(owner.token))
        .send(validBody())
        .expect(404);
    });

    it('responde 403 para un miembro family activo', async () => {
      const owner = await seedUser('r4-role-owner');
      const family = await seedUser('r4-role-family');
      const pet = await seedPet(owner);
      await db.insert(petUsers).values({
        petId: pet.id,
        userId: family.id,
        role: 'family',
        status: 'active',
      });

      await api()
        .post(`/v1/pets/${pet.id}/reminders`)
        .set(auth(family.token))
        .send(validBody())
        .expect(403);
    });

    it('el 404 del no-miembro precede a la validacion del body', async () => {
      const owner = await seedUser('r4-priority-owner');
      const outsider = await seedUser('r4-priority-outsider');
      const pet = await seedPet(owner);

      await api()
        .post(`/v1/pets/${pet.id}/reminders`)
        .set(auth(outsider.token))
        .send({ type: 'invalid' })
        .expect(404);
    });
  });

  describe('R7: create, dispatch y notifier dejan sent sin duplicar push', () => {
    it('procesa la cadena real y un segundo tick no vuelve a enviar', async () => {
      sendPush.mockClear();
      await sqs.send(new PurgeQueueCommand({ QueueUrl: notificationsUrl }));
      const owner = await seedUser('r7');
      const pet = await seedPet(owner);
      await api()
        .post('/v1/me/push-tokens')
        .set(auth(owner.token))
        .send({
          expoToken: `ExponentPushToken[reminders-${runId}]`,
          platform: 'android',
        })
        .expect(200);
      const created = await api()
        .post(`/v1/pets/${pet.id}/reminders`)
        .set(auth(owner.token))
        .send({
          type: 'deworming',
          title: 'Desparasitación',
          dueAt: new Date(Date.now() + 60_000).toISOString(),
          advanceMinutes: 60,
        })
        .expect(201);
      const reminderId = (created.body as { id: string }).id;

      await dispatcher.dispatchOnce();
      await notifier.drainOnce();
      await dispatcher.dispatchOnce();
      await notifier.drainOnce();

      expect(sendPush).toHaveBeenCalledTimes(1);
      expect(sendPush).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { petId: pet.id, reminderId },
        }),
      );
      const [row] = await db
        .select()
        .from(reminders)
        .where(eq(reminders.id, reminderId));
      expect(row.status).toBe('sent');
      expect(row.enqueuedAt).not.toBeNull();
    });
  });

  describe('R8: PATCH reprograma e invalida el mensaje anterior', () => {
    it('regenera scheduleName, resetea enqueuedAt y produce un solo push', async () => {
      sendPush.mockClear();
      await sqs.send(new PurgeQueueCommand({ QueueUrl: notificationsUrl }));
      const owner = await seedUser('r8');
      const pet = await seedPet(owner);
      await api()
        .post('/v1/me/push-tokens')
        .set(auth(owner.token))
        .send({
          expoToken: `ExponentPushToken[reminders-r8-${runId}]`,
          platform: 'android',
        })
        .expect(200);
      const created = await api()
        .post(`/v1/pets/${pet.id}/reminders`)
        .set(auth(owner.token))
        .send({
          type: 'custom',
          title: 'Hora original',
          dueAt: new Date(Date.now() + 60_000).toISOString(),
          advanceMinutes: 60,
        })
        .expect(201);
      const reminderId = (created.body as { id: string }).id;
      const [before] = await db
        .select()
        .from(reminders)
        .where(eq(reminders.id, reminderId));

      await dispatcher.dispatchOnce();
      const dueAt = new Date(Date.now() + 120_000).toISOString();
      const updated = await api()
        .patch(`/v1/reminders/${reminderId}`)
        .set(auth(owner.token))
        .send({ dueAt })
        .expect(200);

      expect(updated.body).toMatchObject({
        id: reminderId,
        petId: pet.id,
        title: 'Hora original',
        dueAt,
        advanceMinutes: 60,
        status: 'scheduled',
      });
      const [rescheduled] = await db
        .select()
        .from(reminders)
        .where(eq(reminders.id, reminderId));
      expect(rescheduled.scheduleName).not.toBe(before.scheduleName);
      expect(rescheduled.scheduleName).toMatch(/^reminder-[0-9a-f-]{36}$/);
      expect(rescheduled.enqueuedAt).toBeNull();

      await dispatcher.dispatchOnce();
      await notifier.drainOnce();

      expect(sendPush).toHaveBeenCalledTimes(1);
      expect(
        (
          await db.select().from(reminders).where(eq(reminders.id, reminderId))
        )[0].status,
      ).toBe('sent');
    });
  });

  describe('R9: PATCH cancelled impide cualquier push', () => {
    async function createEligible(owner: UserFixture, petId: string) {
      const response = await api()
        .post(`/v1/pets/${petId}/reminders`)
        .set(auth(owner.token))
        .send({
          type: 'custom',
          title: 'Cancelar',
          dueAt: new Date(Date.now() + 60_000).toISOString(),
          advanceMinutes: 60,
        })
        .expect(201);
      return (response.body as { id: string }).id;
    }

    it('cancelar antes del dispatch deja cancelled y no encola', async () => {
      sendPush.mockClear();
      await sqs.send(new PurgeQueueCommand({ QueueUrl: notificationsUrl }));
      const owner = await seedUser('r9-before');
      const pet = await seedPet(owner);
      const reminderId = await createEligible(owner, pet.id);

      const response = await api()
        .patch(`/v1/reminders/${reminderId}`)
        .set(auth(owner.token))
        .send({ status: 'cancelled' })
        .expect(200);
      expect((response.body as { status: string }).status).toBe('cancelled');

      await dispatcher.dispatchOnce();
      await notifier.drainOnce();
      expect(sendPush).not.toHaveBeenCalled();
      expect(
        (
          await db.select().from(reminders).where(eq(reminders.id, reminderId))
        )[0].status,
      ).toBe('cancelled');
    });

    it('cancelar despues del dispatch vuelve inocuo el mensaje en vuelo', async () => {
      sendPush.mockClear();
      await sqs.send(new PurgeQueueCommand({ QueueUrl: notificationsUrl }));
      const owner = await seedUser('r9-after');
      const pet = await seedPet(owner);
      await api()
        .post('/v1/me/push-tokens')
        .set(auth(owner.token))
        .send({
          expoToken: `ExponentPushToken[reminders-r9-${runId}]`,
          platform: 'android',
        })
        .expect(200);
      const reminderId = await createEligible(owner, pet.id);

      await dispatcher.dispatchOnce();
      await api()
        .patch(`/v1/reminders/${reminderId}`)
        .set(auth(owner.token))
        .send({ status: 'cancelled' })
        .expect(200);
      await notifier.drainOnce();

      expect(sendPush).not.toHaveBeenCalled();
      expect(
        (
          await db.select().from(reminders).where(eq(reminders.id, reminderId))
        )[0].status,
      ).toBe('cancelled');
    });
  });

  describe('R10: PATCH autoriza opacamente via reminder.petId', () => {
    it('id invalido, inexistente, no-miembro e inactivo comparten 404; family recibe 403', async () => {
      const owner = await seedUser('r10-owner');
      const outsider = await seedUser('r10-outsider');
      const inactive = await seedUser('r10-inactive');
      const family = await seedUser('r10-family');
      const pet = await seedPet(owner);
      await db.insert(petUsers).values([
        {
          petId: pet.id,
          userId: inactive.id,
          role: 'owner',
          status: 'inactive',
        },
        {
          petId: pet.id,
          userId: family.id,
          role: 'family',
          status: 'active',
        },
      ]);
      const created = await api()
        .post(`/v1/pets/${pet.id}/reminders`)
        .set(auth(owner.token))
        .send({
          type: 'custom',
          title: 'Privado',
          dueAt: new Date(Date.now() + 60_000).toISOString(),
        })
        .expect(201);
      const reminderId = (created.body as { id: string }).id;
      const patch = (id: string, user: UserFixture) =>
        api()
          .patch(`/v1/reminders/${id}`)
          .set(auth(user.token))
          .send({ title: 'Intrusión' });

      const invalid = await patch('not-a-uuid', owner).expect(404);
      const missing = await patch(uuidv7(), owner).expect(404);
      const hidden = await patch(reminderId, outsider).expect(404);
      const inactiveResponse = await patch(reminderId, inactive).expect(404);
      expect(missing.body).toEqual(invalid.body);
      expect(hidden.body).toEqual(invalid.body);
      expect(inactiveResponse.body).toEqual(invalid.body);
      await patch(reminderId, family).expect(403);

      expect(
        (
          await db.select().from(reminders).where(eq(reminders.id, reminderId))
        )[0].title,
      ).toBe('Privado');
    });
  });

  describe('R11: PATCH rechaza estado no editable y body invalido', () => {
    it.each(['sent', 'cancelled'] as const)(
      'status=%s responde 409 sin modificar la fila',
      async (status) => {
        const owner = await seedUser(`r11-${status}`);
        const pet = await seedPet(owner);
        const created = await api()
          .post(`/v1/pets/${pet.id}/reminders`)
          .set(auth(owner.token))
          .send({
            type: 'custom',
            title: 'Inmutable',
            dueAt: new Date(Date.now() + 60_000).toISOString(),
          })
          .expect(201);
        const reminderId = (created.body as { id: string }).id;
        await db
          .update(reminders)
          .set({ status })
          .where(eq(reminders.id, reminderId));

        const response = await api()
          .patch(`/v1/reminders/${reminderId}`)
          .set(auth(owner.token))
          .send({ title: 'Cambio rechazado' })
          .expect(409);
        expect((response.body as { message: string }).message).toBe(
          'Reminder is not editable',
        );
        const [stored] = await db
          .select()
          .from(reminders)
          .where(eq(reminders.id, reminderId));
        expect(stored).toMatchObject({ title: 'Inmutable', status });
      },
    );

    it.each([
      {},
      { status: 'cancelled', title: 'No permitido' },
      { status: 'scheduled' },
      { extra: true },
      { dueAt: '2020-01-01T00:00:00.000Z' },
    ])('body invalido %o responde 400 sin modificar la fila', async (body) => {
      const owner = await seedUser(`r11-invalid-${uuidv7()}`);
      const pet = await seedPet(owner);
      const created = await api()
        .post(`/v1/pets/${pet.id}/reminders`)
        .set(auth(owner.token))
        .send({
          type: 'custom',
          title: 'Sin cambios',
          dueAt: new Date(Date.now() + 60_000).toISOString(),
        })
        .expect(201);
      const reminderId = (created.body as { id: string }).id;
      const [before] = await db
        .select()
        .from(reminders)
        .where(eq(reminders.id, reminderId));

      const response = await api()
        .patch(`/v1/reminders/${reminderId}`)
        .set(auth(owner.token))
        .send(body)
        .expect(400);
      expect((response.body as { message: string }).message).toBe(
        'Validation failed',
      );
      const [after] = await db
        .select()
        .from(reminders)
        .where(eq(reminders.id, reminderId));
      expect(after).toEqual(before);
    });
  });
});
