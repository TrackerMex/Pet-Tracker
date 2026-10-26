import {
  GetQueueUrlCommand,
  PurgeQueueCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { eq, inArray, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { SQS_CLIENT } from '@/aws/aws.constants';
import { resolveResourceNamesFromEnv } from '@/aws/resource-names';
import { auditLog } from '@/db/schema/audit-log.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { reminders } from '@/db/schema/reminders.schema';
import { users } from '@/db/schema/users.schema';
import { DRIZZLE } from '@/db/drizzle.constants';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import {
  REMINDER_REPOSITORY,
  type ReminderRepository,
} from '@/modules/reminders/domain/repositories/reminder.repository';
import { RemindersDispatchService } from '@/modules/reminders/infrastructure/reminders-dispatch.service';
import { NotifierConsumerService } from '@/workers/notifier/notifier-consumer.service';
import { PUSH_SENDER } from '@/workers/notifier/push-sender';
import { AppModule } from '../src/app.module';

const names = resolveResourceNamesFromEnv(process.env);

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

  async function seedReminder(
    petId: string,
    createdBy: string,
    values: {
      dueAt: Date;
      status?: 'scheduled' | 'sent' | 'cancelled';
      title?: string;
    },
  ) {
    const id = uuidv7();
    await db.insert(reminders).values({
      id,
      petId,
      type: 'custom',
      title: values.title ?? `Reminder-${id}`,
      dueAt: values.dueAt,
      advanceMinutes: 60,
      channel: 'push',
      status: values.status ?? 'scheduled',
      scheduleName: `reminder-${id}`,
      enqueuedAt: null,
      createdBy,
    });
    return id;
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
      await sqs.send(new GetQueueUrlCommand({ QueueName: names.notifications }))
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

  describe('R1: GET lista todos los reminders de la mascota por dueAt', () => {
    it('responde todos los status ordenados por dueAt ascendente', async () => {
      const owner = await seedUser('api-r1-order-owner');
      const pet = await seedPet(owner);
      const latestId = await seedReminder(pet.id, owner.id, {
        dueAt: new Date('2031-03-03T10:00:00.000Z'),
        status: 'cancelled',
        title: 'Último',
      });
      const earliestId = await seedReminder(pet.id, owner.id, {
        dueAt: new Date('2031-01-01T10:00:00.000Z'),
        status: 'sent',
        title: 'Primero',
      });
      const middleId = await seedReminder(pet.id, owner.id, {
        dueAt: new Date('2031-02-02T10:00:00.000Z'),
        status: 'scheduled',
        title: 'Segundo',
      });

      const response = await api()
        .get(`/v1/pets/${pet.id}/reminders`)
        .set(auth(owner.token))
        .expect(200);

      expect(response.body).toEqual([
        expect.objectContaining({ id: earliestId, status: 'sent' }),
        expect.objectContaining({ id: middleId, status: 'scheduled' }),
        expect.objectContaining({ id: latestId, status: 'cancelled' }),
      ]);
    });

    it('responde [] cuando la mascota no tiene reminders', async () => {
      const owner = await seedUser('api-r1-empty-owner');
      const pet = await seedPet(owner);

      await api()
        .get(`/v1/pets/${pet.id}/reminders`)
        .set(auth(owner.token))
        .expect(200, []);
    });

    it('permite cualquier rol activo y oculta la mascota a un no-miembro', async () => {
      const owner = await seedUser('api-r1-access-owner');
      const family = await seedUser('api-r1-access-family');
      const outsider = await seedUser('api-r1-access-outsider');
      const pet = await seedPet(owner);
      const reminderId = await seedReminder(pet.id, owner.id, {
        dueAt: new Date('2031-01-01T10:00:00.000Z'),
      });
      await db.insert(petUsers).values({
        petId: pet.id,
        userId: family.id,
        role: 'family',
        status: 'active',
      });

      const allowed = await api()
        .get(`/v1/pets/${pet.id}/reminders`)
        .set(auth(family.token))
        .expect(200);
      expect(allowed.body).toEqual([
        expect.objectContaining({ id: reminderId, petId: pet.id }),
      ]);

      await api()
        .get(`/v1/pets/${pet.id}/reminders`)
        .set(auth(outsider.token))
        .expect(404);
    });
  });

  describe('R2 (reminders-api #47): DELETE borra solo para el owner', () => {
    it('responde 204 sin body, elimina la fila y desaparece del GET', async () => {
      const owner = await seedUser('api-r2-delete-owner');
      const pet = await seedPet(owner);
      const reminderId = await seedReminder(pet.id, owner.id, {
        dueAt: new Date('2031-01-01T10:00:00.000Z'),
      });

      const deleted = await api()
        .delete(`/v1/pets/${pet.id}/reminders/${reminderId}`)
        .set(auth(owner.token))
        .expect(204);
      expect(deleted.text).toBe('');

      expect(
        await db.select().from(reminders).where(eq(reminders.id, reminderId)),
      ).toEqual([]);
      const listed = await api()
        .get(`/v1/pets/${pet.id}/reminders`)
        .set(auth(owner.token))
        .expect(200);
      expect(listed.body).toEqual([]);
    });

    it('permite borrar un reminder cancelled', async () => {
      const owner = await seedUser('api-r2-cancelled-owner');
      const pet = await seedPet(owner);
      const reminderId = await seedReminder(pet.id, owner.id, {
        dueAt: new Date('2031-01-01T10:00:00.000Z'),
        status: 'cancelled',
      });

      await api()
        .delete(`/v1/pets/${pet.id}/reminders/${reminderId}`)
        .set(auth(owner.token))
        .expect(204);
      expect(
        await db.select().from(reminders).where(eq(reminders.id, reminderId)),
      ).toEqual([]);
    });

    it('responde 404 para id no-UUID sin modificar reminders', async () => {
      const owner = await seedUser('api-r2-invalid-owner');
      const pet = await seedPet(owner);
      const reminderId = await seedReminder(pet.id, owner.id, {
        dueAt: new Date('2031-01-01T10:00:00.000Z'),
      });

      await api()
        .delete(`/v1/pets/${pet.id}/reminders/not-a-uuid`)
        .set(auth(owner.token))
        .expect(404);
      expect(
        await db.select().from(reminders).where(eq(reminders.id, reminderId)),
      ).toHaveLength(1);
    });

    it('responde 404 si el reminder pertenece a otra mascota', async () => {
      const owner = await seedUser('api-r2-wrong-pet-owner');
      const requestedPet = await seedPet(owner);
      const reminderPet = await seedPet(owner);
      const reminderId = await seedReminder(reminderPet.id, owner.id, {
        dueAt: new Date('2031-01-01T10:00:00.000Z'),
      });

      await api()
        .delete(`/v1/pets/${requestedPet.id}/reminders/${reminderId}`)
        .set(auth(owner.token))
        .expect(404);
      expect(
        await db.select().from(reminders).where(eq(reminders.id, reminderId)),
      ).toHaveLength(1);
    });

    it('responde 403 para miembro no-owner y 404 para no-miembro', async () => {
      const owner = await seedUser('api-r2-access-owner');
      const family = await seedUser('api-r2-access-family');
      const outsider = await seedUser('api-r2-access-outsider');
      const pet = await seedPet(owner);
      const reminderId = await seedReminder(pet.id, owner.id, {
        dueAt: new Date('2031-01-01T10:00:00.000Z'),
      });
      await db.insert(petUsers).values({
        petId: pet.id,
        userId: family.id,
        role: 'family',
        status: 'active',
      });

      await api()
        .delete(`/v1/pets/${pet.id}/reminders/${reminderId}`)
        .set(auth(family.token))
        .expect(403);
      await api()
        .delete(`/v1/pets/${pet.id}/reminders/${reminderId}`)
        .set(auth(outsider.token))
        .expect(404);
      expect(
        await db.select().from(reminders).where(eq(reminders.id, reminderId)),
      ).toHaveLength(1);
    });
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
          'recurrence',
          'recurrenceUntil',
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
          data: { petId: pet.id, reminderId, kind: 'reminder' },
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

  describe('#210 R1: CHECKs de recurrencia en Postgres', () => {
    let owner: UserFixture;
    let pet: { id: string };
    beforeAll(async () => {
      owner = await seedUser('210-r1');
      pet = await seedPet(owner);
    });
    const limits = [
      ['hour', 24],
      ['day', 365],
      ['week', 52],
      ['month', 12],
      ['year', 10],
    ] as const;
    const cases: [
      string,
      string | null,
      number | null,
      boolean,
      string | null,
      string | null,
    ][] = [
      ['unidad desconocida', 'min', 1, true, null, 'unit'],
      ...limits.map(
        ([unit]): [string, string, number, boolean, null, string] => [
          `${unit} bajo minimo`,
          unit,
          0,
          true,
          null,
          'every',
        ],
      ),
      ...limits.map(
        ([unit, max]): [string, string, number, boolean, null, string] => [
          `${unit} sobre maximo`,
          unit,
          max + 1,
          true,
          null,
          'every',
        ],
      ),
      ...limits.flatMap(
        ([unit, max]): [string, string, number, boolean, null, null][] => [
          [`${unit} minimo`, unit, 1, true, null, null],
          [`${unit} maximo`, unit, max, true, null, null],
        ],
      ),
      ['serie sin ancla', 'day', 1, false, null, 'shape'],
      ['until sin serie', null, null, false, '2027-01-01', 'shape'],
      ['every sin unidad', null, 3, true, null, 'shape'],
      ['unidad sin every', 'week', null, true, null, 'shape'],
      ['serie completa con until', 'month', 6, true, '2027-01-01', null],
    ];
    it.each(cases)(
      '#210 R1: CHECK %s',
      async (_label, unit, every, anchor, until, check) => {
        const insert = db.execute(sql`insert into reminders
        (id, pet_id, type, title, due_at, created_by, recurrence_unit, recurrence_every, recurrence_anchor_at, recurrence_until)
        values (${uuidv7()}, ${pet.id}, 'custom', 'CHECK recurrence', now(), ${owner.id}, ${unit}, ${every}, ${anchor ? sql`now()` : sql`null`}, ${until})`);
        if (check) {
          await expect(insert).rejects.toMatchObject({
            cause: {
              code: '23514',
              constraint: `reminders_recurrence_${check}_check`,
            },
          });
        } else {
          await expect(insert).resolves.toBeDefined();
        }
      },
    );
  });

  describe('#210 R4: persistencia de recurrencia', () => {
    it('#210 R4: POST con recurrence guarda las cuatro columnas', async () => {
      const owner = await seedUser('210-r4');
      const pet = await seedPet(owner);
      const dueAt = new Date(Date.now() + 3 * 86_400_000);
      const response = await api()
        .post(`/v1/pets/${pet.id}/reminders`)
        .set(auth(owner.token))
        .send({
          type: 'custom',
          title: 'Serie R4',
          dueAt: dueAt.toISOString(),
          recurrence: { unit: 'week', every: 2 },
          recurrenceUntil: '2031-01-01',
        })
        .expect(201);
      const { id } = response.body as { id: string };
      const [row] = await db
        .select()
        .from(reminders)
        .where(eq(reminders.id, id));
      expect(row).toMatchObject({
        recurrenceUnit: 'week',
        recurrenceEvery: 2,
        recurrenceUntil: '2031-01-01',
        recurrenceAnchorAt: dueAt,
        status: 'scheduled',
        scheduleName: expect.stringMatching(
          /^reminder-[0-9a-f-]{36}$/,
        ) as unknown,
        enqueuedAt: null,
      });
    });
  });

  describe('#210 R5: respuesta publica de las series', () => {
    it('#210 R5: GET POST y PATCH devuelven recurrence y recurrenceUntil sin el ancla', async () => {
      const owner = await seedUser('210-r5');
      const pet = await seedPet(owner);
      const expectedRows: Record<string, unknown>[] = [];
      for (const [offset, recurrence, recurrenceUntil] of [
        [3, { unit: 'month', every: 6 }, '2031-01-01'],
        [4, null, null],
      ] as const) {
        const dueAt = new Date(Date.now() + offset * 86_400_000).toISOString();
        const created = await api()
          .post(`/v1/pets/${pet.id}/reminders`)
          .set(auth(owner.token))
          .send({
            type: 'custom',
            title: 'Shape',
            dueAt,
            recurrence,
            recurrenceUntil,
          })
          .expect(201);
        const { id } = created.body as { id: string };
        const expected = {
          id,
          petId: pet.id,
          type: 'custom',
          title: 'Shape',
          dueAt,
          advanceMinutes: 60,
          status: 'scheduled',
          recurrence,
          recurrenceUntil,
        };
        expect(created.body).toEqual(expected);
        const patched = await api()
          .patch(`/v1/reminders/${id}`)
          .set(auth(owner.token))
          .send({ title: 'Cambio' })
          .expect(200);
        expected.title = 'Cambio';
        expect(patched.body).toEqual(expected);
        expectedRows.push(expected);
        const listed = await api()
          .get(`/v1/pets/${pet.id}/reminders`)
          .set(auth(owner.token))
          .expect(200);
        expect(listed.body).toEqual(expectedRows);
      }
    });
  });

  describe('#210 R3: reglas cruzadas en HTTP', () => {
    it('#210 R3: POST con recurrenceUntil sin recurrence responde 400 sin insertar', async () => {
      const owner = await seedUser('210-r3-post');
      const pet = await seedPet(owner);
      const response = await api()
        .post(`/v1/pets/${pet.id}/reminders`)
        .set(auth(owner.token))
        .send({
          type: 'custom',
          title: 'Invalido',
          dueAt: new Date(Date.now() + 3 * 86_400_000).toISOString(),
          recurrenceUntil: '2031-01-01',
        })
        .expect(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Invalid recurrence',
      });
      expect(
        await db.select().from(reminders).where(eq(reminders.petId, pet.id)),
      ).toHaveLength(0);
    });
    it('#210 R3: PATCH que deja until antes de dueAt responde 400 sin cambiar la fila', async () => {
      const owner = await seedUser('210-r3-patch');
      const pet = await seedPet(owner);
      const created = await api()
        .post(`/v1/pets/${pet.id}/reminders`)
        .set(auth(owner.token))
        .send({
          type: 'custom',
          title: 'Serie',
          dueAt: new Date(Date.now() + 3 * 86_400_000).toISOString(),
          recurrence: { unit: 'day', every: 1 },
        })
        .expect(201);
      const { id } = created.body as { id: string };
      const [before] = await db
        .select()
        .from(reminders)
        .where(eq(reminders.id, id));
      const response = await api()
        .patch(`/v1/reminders/${id}`)
        .set(auth(owner.token))
        .send({ recurrenceUntil: new Date().toISOString().slice(0, 10) })
        .expect(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Invalid recurrence',
      });
      const [after] = await db
        .select()
        .from(reminders)
        .where(eq(reminders.id, id));
      expect(after).toEqual(before);
    });
  });
  describe('#210 R6: PATCH de las columnas de recurrencia', () => {
    it('#210 R6: PATCH reancla, conserva y limpia columnas de la serie', async () => {
      const owner = await seedUser('210-r6');
      const pet = await seedPet(owner);
      const until = new Date(Date.now() + 30 * 86_400_000)
        .toISOString()
        .slice(0, 10);
      const created = await api()
        .post(`/v1/pets/${pet.id}/reminders`)
        .set(auth(owner.token))
        .send({
          type: 'custom',
          title: 'Serie',
          dueAt: new Date(Date.now() + 3 * 86_400_000).toISOString(),
          recurrence: { unit: 'week', every: 2 },
          recurrenceUntil: until,
        })
        .expect(201);
      const { id } = created.body as { id: string };
      const dueAt = new Date(Date.now() + 4 * 86_400_000);
      await api()
        .patch(`/v1/reminders/${id}`)
        .set(auth(owner.token))
        .send({ dueAt: dueAt.toISOString() })
        .expect(200);
      let [row] = await db.select().from(reminders).where(eq(reminders.id, id));
      expect(row).toMatchObject({
        dueAt,
        recurrenceUnit: 'week',
        recurrenceEvery: 2,
        recurrenceAnchorAt: dueAt,
        recurrenceUntil: until,
      });
      await api()
        .patch(`/v1/reminders/${id}`)
        .set(auth(owner.token))
        .send({ recurrenceUntil: null })
        .expect(200);
      [row] = await db.select().from(reminders).where(eq(reminders.id, id));
      expect(row).toMatchObject({
        recurrenceUnit: 'week',
        recurrenceEvery: 2,
        recurrenceAnchorAt: dueAt,
        recurrenceUntil: null,
      });
      await api()
        .patch(`/v1/reminders/${id}`)
        .set(auth(owner.token))
        .send({ recurrence: null })
        .expect(200);
      [row] = await db.select().from(reminders).where(eq(reminders.id, id));
      expect(row).toMatchObject({
        recurrenceUnit: null,
        recurrenceEvery: null,
        recurrenceAnchorAt: null,
        recurrenceUntil: null,
      });
    });
  });

  describe('#210 R13: escrituras condicionadas al schedule', () => {
    it('#210 R13: markEnqueued con scheduleName viejo no toca enqueued_at', async () => {
      const owner = await seedUser('210-r13-enqueue');
      const pet = await seedPet(owner);
      const id = await seedReminder(pet.id, owner.id, {
        dueAt: new Date(Date.now() + 3 * 86_400_000),
      });
      const repository = app.get<ReminderRepository>(REMINDER_REPOSITORY);
      const at = new Date();
      await repository.markEnqueued(id, 'reminder-old', at);
      const [afterOld] = await db
        .select()
        .from(reminders)
        .where(eq(reminders.id, id));
      await repository.markEnqueued(id, `reminder-${id}`, at);
      const [afterCurrent] = await db
        .select()
        .from(reminders)
        .where(eq(reminders.id, id));
      expect(afterCurrent.enqueuedAt).toEqual(at);
      expect(afterOld.enqueuedAt).toBeNull();
    });
    it('#210 R13: advanceOccurrence solo avanza la fila con su scheduleName y scheduled', async () => {
      const owner = await seedUser('210-r13-advance');
      const pet = await seedPet(owner);
      const repository = app.get<ReminderRepository>(REMINDER_REPOSITORY);
      const next = new Date(Date.now() + 4 * 86_400_000);
      for (const mode of ['old', 'cancelled', 'current'] as const) {
        const id = await seedReminder(pet.id, owner.id, {
          dueAt: new Date(Date.now() + 3 * 86_400_000),
          status: mode === 'cancelled' ? 'cancelled' : 'scheduled',
        });
        await db
          .update(reminders)
          .set({ enqueuedAt: new Date() })
          .where(eq(reminders.id, id));
        const [before] = await db
          .select()
          .from(reminders)
          .where(eq(reminders.id, id));
        const newScheduleName = `reminder-${uuidv7()}`;
        const advanced = await repository.advanceOccurrence(
          id,
          mode === 'old' ? 'reminder-old' : before.scheduleName!,
          next,
          newScheduleName,
        );
        const [after] = await db
          .select()
          .from(reminders)
          .where(eq(reminders.id, id));
        expect(advanced).toBe(mode === 'current');
        expect(after).toEqual(
          mode === 'current'
            ? {
                ...before,
                dueAt: next,
                scheduleName: newScheduleName,
                enqueuedAt: null,
              }
            : before,
        );
      }
    });
  });
});
