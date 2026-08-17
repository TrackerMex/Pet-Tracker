import {
  GetQueueUrlCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { eq, inArray, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import type { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { buildResourceNames } from '@/aws/resource-names';
import { DRIZZLE } from '@/db/drizzle.constants';
import { AppModule } from '@/app.module';
import { alertEvents } from '@/db/schema/alerts.schema';
import { devices, petDevices } from '@/db/schema/devices.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { deviceSubscriptions } from '@/db/schema/subscriptions.schema';
import { users } from '@/db/schema/users.schema';
import type { WialonClient } from '@/integrations/wialon/wialon-client.interface';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { CLAIM_WATERMARK_LOOKBACK_MINUTES } from '@/modules/devices/application/use-cases/claim-device.use-case';
import { SUBSCRIPTION_REPOSITORY } from '@/modules/subscriptions/domain/repositories/subscription.repository';
import { PetTrackingGuard } from '@/modules/subscriptions/infrastructure/guards/pet-tracking.guard';
import { SubscriptionDrizzleRepository } from '@/modules/subscriptions/infrastructure/repositories/subscription.drizzle.repository';
import type { RawPosition } from '@/pipeline/types';
import { IngestionDrizzleStore } from '@/workers/ingestion.drizzle.store';
import {
  PollerService,
  POSITIONS_PER_MESSAGE_MAX,
} from '@/workers/poller.service';
import { setDeviceSubscription } from '../scripts/set-device-subscription';
import { seedSimulatedDevices } from '../scripts/seed-devices';

describe('Device subscriptions (e2e)', () => {
  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let subscriptions: SubscriptionDrizzleRepository;
  let tokenService: TokenService;

  const createdUserIds: string[] = [];
  const createdPetIds: string[] = [];
  const createdDeviceIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();
    db = app.get<NodePgDatabase>(DRIZZLE);
    tokenService = app.get<TokenService>(TOKEN_SERVICE);
    subscriptions = new SubscriptionDrizzleRepository(db);
  });

  afterAll(async () => {
    if (createdDeviceIds.length > 0) {
      await db
        .delete(deviceSubscriptions)
        .where(inArray(deviceSubscriptions.deviceId, createdDeviceIds));
      await db
        .delete(petDevices)
        .where(inArray(petDevices.deviceId, createdDeviceIds));
      await db.delete(devices).where(inArray(devices.id, createdDeviceIds));
    }
    if (createdPetIds.length > 0) {
      await db.delete(pets).where(inArray(pets.id, createdPetIds));
    }
    if (createdUserIds.length > 0) {
      await db.delete(users).where(inArray(users.id, createdUserIds));
    }
    await app.close();
  });

  async function seedUser(label: string) {
    const id = uuidv7();
    const email = `subscriptions-${label}-${id}@example.com`;
    await db.insert(users).values({
      id,
      email,
      passwordHash: 'not-used-by-e2e',
      firstName: 'Subscription',
      lastName: label,
      phone: '+525512345678',
      country: 'MX',
      timezone: 'UTC',
      termsAcceptedAt: new Date(),
    });
    createdUserIds.push(id);

    return { id, token: tokenService.sign({ sub: id, email }) };
  }

  async function seedPet(label: string): Promise<string> {
    const id = uuidv7();
    await db.insert(pets).values({ id, name: label, species: 'dog' });
    createdPetIds.push(id);
    return id;
  }

  async function seedDevice(
    label: string,
    overrides: Partial<typeof devices.$inferInsert> = {},
  ): Promise<string> {
    const id = uuidv7();
    await db.insert(devices).values({
      id,
      esn: `SUB-${label}-${id}`,
      status: 'assigned',
      isSimulated: true,
      ...overrides,
    });
    createdDeviceIds.push(id);
    return id;
  }

  async function seedActiveCollar(petId: string, label: string) {
    const deviceId = await seedDevice(label);
    await db.insert(petDevices).values({
      id: uuidv7(),
      petId,
      deviceId,
    });
    return deviceId;
  }

  async function seedSubscription(
    deviceId: string,
    status: 'active' | 'canceled',
    currentPeriodEnd: Date,
  ) {
    await db.insert(deviceSubscriptions).values({
      deviceId,
      status,
      planCode: 'track_monthly',
      currentPeriodEnd,
    });
  }

  async function seedMembership(petId: string, userId: string, role = 'owner') {
    await db.insert(petUsers).values({
      petId,
      userId,
      role,
      status: 'active',
    });
  }

  describe('R15 (device-subscriptions #25): subscriptions module wiring', () => {
    it('exposes the shared repository and tracking guard from AppModule', () => {
      expect(app.get(SUBSCRIPTION_REPOSITORY)).toBeInstanceOf(
        SubscriptionDrizzleRepository,
      );
      expect(app.get(PetTrackingGuard)).toBeInstanceOf(PetTrackingGuard);
    });
  });

  describe('R9 (device-subscriptions #25): exact tracking route gate', () => {
    it('returns the exact 402 body on all 10 tracking routes', async () => {
      const owner = await seedUser('r9-owner');
      const petId = await seedPet('R9 free pet');
      await seedMembership(petId, owner.id);
      const geofenceId = uuidv7();
      const auth = { Authorization: `Bearer ${owner.token}` };
      const calls = [
        () =>
          request(app.getHttpServer())
            .get(`/v1/pets/${petId}/positions/last`)
            .set(auth),
        () =>
          request(app.getHttpServer())
            .get(`/v1/pets/${petId}/positions`)
            .set(auth),
        () =>
          request(app.getHttpServer()).get(`/v1/pets/${petId}/trips`).set(auth),
        () =>
          request(app.getHttpServer())
            .get(`/v1/pets/${petId}/trips/1`)
            .set(auth),
        () =>
          request(app.getHttpServer())
            .get(`/v1/pets/${petId}/activity/daily`)
            .set(auth),
        () =>
          request(app.getHttpServer())
            .post(`/v1/pets/${petId}/geofences`)
            .set(auth)
            .send({}),
        () =>
          request(app.getHttpServer())
            .get(`/v1/pets/${petId}/geofences`)
            .set(auth),
        () =>
          request(app.getHttpServer())
            .get(`/v1/pets/${petId}/geofences/${geofenceId}`)
            .set(auth),
        () =>
          request(app.getHttpServer())
            .patch(`/v1/pets/${petId}/geofences/${geofenceId}`)
            .set(auth)
            .send({}),
        () =>
          request(app.getHttpServer())
            .delete(`/v1/pets/${petId}/geofences/${geofenceId}`)
            .set(auth),
      ];

      for (const call of calls) {
        const response = await call().expect(402);
        expect(response.body).toEqual({
          statusCode: 402,
          code: 'DEVICE_SUBSCRIPTION_REQUIRED',
          message: 'Pet tracking requires an active device subscription',
        });
      }
    });

    it('does not gate profile, device management, health or reminders', async () => {
      const owner = await seedUser('r9-ungated');
      const petId = await seedPet('R9 ungated pet');
      await seedMembership(petId, owner.id);
      const auth = { Authorization: `Bearer ${owner.token}` };

      await request(app.getHttpServer())
        .get(`/v1/pets/${petId}`)
        .set(auth)
        .expect(200);
      await request(app.getHttpServer())
        .get(`/v1/pets/${petId}/device`)
        .set(auth)
        .expect(200);
      await request(app.getHttpServer())
        .delete(`/v1/pets/${petId}/device`)
        .set(auth)
        .expect(404);
      await request(app.getHttpServer())
        .get(`/v1/pets/${petId}/weights`)
        .set(auth)
        .expect(200);
      await request(app.getHttpServer())
        .get(`/v1/pets/${petId}/vaccines`)
        .set(auth)
        .expect(200);
      await request(app.getHttpServer())
        .post(`/v1/pets/${petId}/reminders`)
        .set(auth)
        .send({})
        .expect(400);
    });

    it('returns 404 before entitlement for a non-member and malformed petId', async () => {
      const owner = await seedUser('r9-sec-owner');
      const attacker = await seedUser('r9-sec-attacker');
      const petId = await seedPet('R9 subscribed pet');
      await seedMembership(petId, owner.id);
      const deviceId = await seedActiveCollar(petId, 'r9-sec');
      await seedSubscription(
        deviceId,
        'active',
        new Date('2099-12-31T00:00:00.000Z'),
      );

      await request(app.getHttpServer())
        .get(`/v1/pets/${petId}/positions/last`)
        .set('Authorization', `Bearer ${attacker.token}`)
        .expect(404);
      await request(app.getHttpServer())
        .get('/v1/pets/not-a-uuid/positions/last')
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(404);
    });
  });

  describe('R11 (device-subscriptions #25): entitlement is shared by pet members', () => {
    it.each(['family', 'walker', 'vet'])(
      '%s sees the same tracked route as the owner',
      async (role) => {
        const owner = await seedUser(`r11-owner-${role}`);
        const member = await seedUser(`r11-${role}`);
        const petId = await seedPet(`R11 ${role} pet`);
        await seedMembership(petId, owner.id);
        await seedMembership(petId, member.id, role);
        const deviceId = await seedActiveCollar(petId, `r11-${role}`);
        await seedSubscription(
          deviceId,
          'active',
          new Date('2099-12-31T00:00:00.000Z'),
        );

        const ownerResponse = await request(app.getHttpServer())
          .get(`/v1/pets/${petId}/positions/last`)
          .set('Authorization', `Bearer ${owner.token}`)
          .expect(200);
        const memberResponse = await request(app.getHttpServer())
          .get(`/v1/pets/${petId}/positions/last`)
          .set('Authorization', `Bearer ${member.token}`)
          .expect(200);

        expect(memberResponse.body).toEqual(ownerResponse.body);
      },
    );
  });

  describe('R16 (device-subscriptions #25): HTTP response shape stays frozen', () => {
    it('keeps the 24 profile keys and the 5 nested device keys', async () => {
      const owner = await seedUser('r16-owner');
      const petId = await seedPet('R16 pet');
      await seedMembership(petId, owner.id);
      const deviceId = await seedActiveCollar(petId, 'r16');
      await seedSubscription(
        deviceId,
        'active',
        new Date('2099-12-31T00:00:00.000Z'),
      );

      const response = await request(app.getHttpServer())
        .get(`/v1/pets/${petId}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);
      const body = response.body as Record<string, unknown>;

      expect(Object.keys(body).sort()).toEqual(
        [
          'id',
          'name',
          'species',
          'breed',
          'sex',
          'birthDate',
          'approxAgeMonths',
          'ageMonths',
          'currentWeightKg',
          'size',
          'color',
          'sterilized',
          'microchip',
          'photoUrl',
          'lostMode',
          'lastPosition',
          'lastCommunicationAt',
          'myRole',
          'device',
          'nextVaccine',
          'nextReminder',
          'activitySummary',
          'createdAt',
          'updatedAt',
        ].sort(),
      );
      expect(Object.keys(body.device as object).sort()).toEqual(
        ['model', 'batteryPct', 'connectivity', 'lastMessageAt', 'esn'].sort(),
      );
    });
  });

  describe('R1 (device-subscriptions #25): device_subscriptions schema', () => {
    it('has the exact columns, primary key, foreign key and checks', async () => {
      const columns = await db.execute<{
        column_name: string;
        data_type: string;
        is_nullable: 'YES' | 'NO';
      }>(sql`
        select column_name, data_type, is_nullable
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'device_subscriptions'
        order by ordinal_position
      `);

      expect(columns.rows).toEqual([
        { column_name: 'device_id', data_type: 'uuid', is_nullable: 'NO' },
        {
          column_name: 'status',
          data_type: 'character varying',
          is_nullable: 'NO',
        },
        {
          column_name: 'plan_code',
          data_type: 'character varying',
          is_nullable: 'NO',
        },
        {
          column_name: 'current_period_end',
          data_type: 'timestamp with time zone',
          is_nullable: 'NO',
        },
        {
          column_name: 'created_at',
          data_type: 'timestamp with time zone',
          is_nullable: 'NO',
        },
        {
          column_name: 'updated_at',
          data_type: 'timestamp with time zone',
          is_nullable: 'NO',
        },
      ]);

      const constraints = await db.execute<{
        constraint_name: string;
        constraint_type: string;
        definition: string;
      }>(sql`
        select
          con.conname as constraint_name,
          con.contype as constraint_type,
          pg_get_constraintdef(con.oid) as definition
        from pg_constraint con
        join pg_class rel on rel.oid = con.conrelid
        join pg_namespace nsp on nsp.oid = rel.relnamespace
        where nsp.nspname = 'public'
          and rel.relname = 'device_subscriptions'
        order by con.conname
      `);

      expect(constraints.rows).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            constraint_type: 'p',
            definition: 'PRIMARY KEY (device_id)',
          }),
          expect.objectContaining({
            constraint_name: 'device_subscriptions_status_check',
            constraint_type: 'c',
          }),
          expect.objectContaining({
            constraint_name: 'device_subscriptions_plan_code_check',
            constraint_type: 'c',
          }),
        ]),
      );
      expect(
        constraints.rows.find((row) => row.constraint_type === 'f')?.definition,
      ).toMatch(/^FOREIGN KEY \(device_id\) REFERENCES devices\(id\)$/);
    });
  });

  describe('R17 (device-subscriptions #25): grandfather existing devices', () => {
    it('backfills every device present when the migration runs', async () => {
      const missing = await db.execute<{ count: string }>(sql`
        select count(*)::text as count
        from devices d
        left join device_subscriptions s on s.device_id = d.id
        where s.device_id is null
      `);

      expect(missing.rows[0].count).toBe('0');
    });

    it('seeds one idempotent grandfathered subscription per simulated device', async () => {
      await seedSimulatedDevices(db);
      await seedSimulatedDevices(db);

      const subscriptions = await db.execute<{
        esn: string;
        status: string;
        plan_code: string;
        current_period_end: Date;
      }>(sql`
        select d.esn, s.status, s.plan_code, s.current_period_end
        from devices d
        inner join device_subscriptions s on s.device_id = d.id
        where d.esn in ('SIM-001', 'SIM-002', 'SIM-003')
        order by d.esn
      `);

      expect(subscriptions.rows).toHaveLength(3);
      expect(
        subscriptions.rows.map(({ esn, status, plan_code }) => ({
          esn,
          status,
          plan_code,
        })),
      ).toEqual([
        { esn: 'SIM-001', status: 'active', plan_code: 'grandfathered' },
        { esn: 'SIM-002', status: 'active', plan_code: 'grandfathered' },
        { esn: 'SIM-003', status: 'active', plan_code: 'grandfathered' },
      ]);
      expect(
        subscriptions.rows.every(
          ({ current_period_end }) =>
            new Date(current_period_end).toISOString() ===
            '2099-12-31T00:00:00.000Z',
        ),
      ).toBe(true);
    });
  });

  describe('R3 (device-subscriptions #25): derive pet and device entitlement', () => {
    it('returns false when the pet has no active collar', async () => {
      const petId = await seedPet('R3-no-collar');

      await expect(subscriptions.isPetTracked(petId)).resolves.toBe(false);
    });

    it('returns false when the active collar has no subscription row', async () => {
      const petId = await seedPet('R3-no-subscription');
      await seedActiveCollar(petId, 'R3-no-subscription');

      await expect(subscriptions.isPetTracked(petId)).resolves.toBe(false);
    });

    it('returns false for a canceled subscription with a future period end', async () => {
      const petId = await seedPet('R3-canceled');
      const deviceId = await seedActiveCollar(petId, 'R3-canceled');
      await seedSubscription(
        deviceId,
        'canceled',
        new Date(Date.now() + 24 * 60 * 60_000),
      );

      await expect(subscriptions.isPetTracked(petId)).resolves.toBe(false);
    });

    it('returns true for an active subscription with a future period end', async () => {
      const petId = await seedPet('R3-current');
      const deviceId = await seedActiveCollar(petId, 'R3-current');
      await seedSubscription(
        deviceId,
        'active',
        new Date(Date.now() + 24 * 60 * 60_000),
      );

      await expect(subscriptions.isPetTracked(petId)).resolves.toBe(true);
      await expect(subscriptions.isDeviceEntitled(deviceId)).resolves.toBe(
        true,
      );
    });

    it('returns true one day after period end within grace', async () => {
      const petId = await seedPet('R3-grace');
      const deviceId = await seedActiveCollar(petId, 'R3-grace');
      await seedSubscription(
        deviceId,
        'active',
        new Date(Date.now() - 24 * 60 * 60_000),
      );

      await expect(subscriptions.isPetTracked(petId)).resolves.toBe(true);
    });

    it('returns false four days after period end outside grace', async () => {
      const petId = await seedPet('R3-expired');
      const deviceId = await seedActiveCollar(petId, 'R3-expired');
      await seedSubscription(
        deviceId,
        'active',
        new Date(Date.now() - 4 * 24 * 60 * 60_000),
      );

      await expect(subscriptions.isPetTracked(petId)).resolves.toBe(false);
      await expect(subscriptions.isDeviceEntitled(deviceId)).resolves.toBe(
        false,
      );
    });

    it('returns false for a valid nonexistent pet id', async () => {
      await expect(subscriptions.isPetTracked(uuidv7())).resolves.toBe(false);
    });

    it('accepts only petId in isPetTracked', () => {
      expect(SubscriptionDrizzleRepository.prototype.isPetTracked.length).toBe(
        1,
      );
    });
  });

  describe('R4 (device-subscriptions #25): poll only entitled assignments', () => {
    const queueUrl = 'http://localhost:4566/000000000000/positions-raw';
    const now = new Date();
    const initialWatermark = new Date(now.getTime() - 60 * 60_000);

    let activePetId: string;
    let activeDeviceId: string;
    let unsubscribedDeviceId: string;
    let expiredDeviceId: string;

    beforeAll(async () => {
      activePetId = await seedPet('R4-active');
      activeDeviceId = await seedDevice('R4-active', {
        wialonUnitId: 'R4-active-unit',
        ingestWatermark: initialWatermark,
      });
      await db.insert(petDevices).values({
        id: uuidv7(),
        petId: activePetId,
        deviceId: activeDeviceId,
      });
      await seedSubscription(
        activeDeviceId,
        'active',
        new Date(now.getTime() + 24 * 60 * 60_000),
      );

      const unsubscribedPetId = await seedPet('R4-unsubscribed');
      unsubscribedDeviceId = await seedDevice('R4-unsubscribed', {
        wialonUnitId: 'R4-unsubscribed-unit',
        ingestWatermark: initialWatermark,
      });
      await db.insert(petDevices).values({
        id: uuidv7(),
        petId: unsubscribedPetId,
        deviceId: unsubscribedDeviceId,
      });

      const expiredPetId = await seedPet('R4-expired');
      expiredDeviceId = await seedDevice('R4-expired', {
        wialonUnitId: 'R4-expired-unit',
        ingestWatermark: initialWatermark,
      });
      await db.insert(petDevices).values({
        id: uuidv7(),
        petId: expiredPetId,
        deviceId: expiredDeviceId,
      });
      await seedSubscription(
        expiredDeviceId,
        'active',
        new Date(now.getTime() - 4 * 24 * 60 * 60_000),
      );
    });

    it('lists only the assignment with a current subscription', async () => {
      const store = new IngestionDrizzleStore(db);

      await expect(store.listActiveAssignments()).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            deviceId: activeDeviceId,
            petId: activePetId,
            unitId: 'R4-active-unit',
          }),
        ]),
      );

      const assignmentIds = (await store.listActiveAssignments()).map(
        ({ deviceId }) => deviceId,
      );
      expect(assignmentIds).toContain(activeDeviceId);
      expect(assignmentIds).not.toContain(unsubscribedDeviceId);
      expect(assignmentIds).not.toContain(expiredDeviceId);
    });

    it('preserves message shape and chunking without moving excluded watermarks', async () => {
      const count = POSITIONS_PER_MESSAGE_MAX + 1;
      const stepMs = 30_000;
      const baseTs = now.getTime() - count * stepMs - 60_000;
      const positions: RawPosition[] = Array.from(
        { length: count },
        (_, i) => ({
          lat: 19.4326,
          lng: -99.1332,
          ts: baseTs + i * stepMs,
        }),
      );
      expect(Math.max(...positions.map(({ ts }) => ts))).toBeLessThan(
        now.getTime(),
      );

      const getMessages = jest.fn().mockResolvedValue(positions);
      const wialon = {
        listUnits: jest.fn().mockResolvedValue([]),
        getMessages,
      } as jest.Mocked<WialonClient>;
      const send = jest.fn((command: unknown) => {
        if (command instanceof GetQueueUrlCommand) {
          return Promise.resolve({ QueueUrl: queueUrl });
        }
        return Promise.resolve({ MessageId: 'r4' });
      });
      const poller = new PollerService(
        new IngestionDrizzleStore(db),
        wialon,
        {
          send,
        } as unknown as SQSClient,
        buildResourceNames(''),
      );

      await poller.runOnce(now);

      expect(getMessages).toHaveBeenCalledTimes(1);
      expect(getMessages).toHaveBeenCalledWith(
        'R4-active-unit',
        initialWatermark.getTime(),
        now.getTime(),
      );

      const bodies = send.mock.calls
        .map(([command]) => command)
        .filter(
          (command): command is SendMessageCommand =>
            command instanceof SendMessageCommand,
        )
        .map(
          (command) =>
            JSON.parse(command.input.MessageBody as string) as unknown,
        ) as Array<Record<string, unknown> & { positions: RawPosition[] }>;

      expect(bodies.map(({ positions: batch }) => batch.length)).toEqual([
        POSITIONS_PER_MESSAGE_MAX,
        1,
      ]);
      expect(bodies[0]).toEqual({
        version: 1,
        deviceId: activeDeviceId,
        petId: activePetId,
        unitId: 'R4-active-unit',
        positions: positions.slice(0, POSITIONS_PER_MESSAGE_MAX),
      });

      const excluded = await db
        .select({ id: devices.id, ingestWatermark: devices.ingestWatermark })
        .from(devices)
        .where(inArray(devices.id, [unsubscribedDeviceId, expiredDeviceId]));
      expect(excluded).toHaveLength(2);
      expect(
        excluded.every(
          ({ ingestWatermark }) =>
            ingestWatermark?.getTime() === initialWatermark.getTime(),
        ),
      ).toBe(true);
    });
  });

  describe('R5 (device-subscriptions #25): expiration keeps the assignment', () => {
    it('reactivates polling with the same pet_devices row and no re-claim', async () => {
      const petId = await seedPet('R5-retained');
      const deviceId = await seedDevice('R5-retained', {
        wialonUnitId: 'R5-retained-unit',
      });
      const assignmentId = uuidv7();
      await db.insert(petDevices).values({
        id: assignmentId,
        petId,
        deviceId,
      });
      await seedSubscription(
        deviceId,
        'active',
        new Date(Date.now() - 4 * 24 * 60 * 60_000),
      );

      const store = new IngestionDrizzleStore(db);
      expect(
        (await store.listActiveAssignments()).map(({ deviceId }) => deviceId),
      ).not.toContain(deviceId);

      const [expiredAssignment] = await db
        .select()
        .from(petDevices)
        .where(eq(petDevices.id, assignmentId));
      const [expiredDevice] = await db
        .select()
        .from(devices)
        .where(eq(devices.id, deviceId));
      expect(expiredAssignment.releasedAt).toBeNull();
      expect(expiredDevice.status).toBe('assigned');

      await db
        .update(deviceSubscriptions)
        .set({ currentPeriodEnd: new Date(Date.now() + 24 * 60 * 60_000) })
        .where(eq(deviceSubscriptions.deviceId, deviceId));

      expect(
        (await store.listActiveAssignments()).map(({ deviceId }) => deviceId),
      ).toContain(deviceId);

      const assignments = await db
        .select()
        .from(petDevices)
        .where(eq(petDevices.deviceId, deviceId));
      expect(assignments).toHaveLength(1);
      expect(assignments[0].id).toBe(assignmentId);
      expect(assignments[0].releasedAt).toBeNull();
    });
  });

  describe('R13 (device-subscriptions #25): idempotent subscription:set', () => {
    let invalidCaseSequence = 0;

    it('upserts by unit id and device id without touching assignment state', async () => {
      const byUnitId = await seedDevice('R13-unit', {
        wialonUnitId: 'R13-unit-selector',
        status: 'available',
      });
      const periodEnd = '2030-01-15T12:00:00.000Z';

      const first = await setDeviceSubscription(db, {
        unitId: 'R13-unit-selector',
        status: 'active',
        planCode: 'grandfathered',
        periodEnd,
      });
      const second = await setDeviceSubscription(db, {
        unitId: 'R13-unit-selector',
        status: 'active',
        planCode: 'grandfathered',
        periodEnd,
      });

      expect(first).toMatchObject({
        deviceId: byUnitId,
        status: 'active',
        planCode: 'grandfathered',
        currentPeriodEnd: new Date(periodEnd),
        entitled: true,
      });
      expect(typeof first.watermarkReset).toBe('boolean');
      expect(second).toMatchObject({
        deviceId: byUnitId,
        status: first.status,
        planCode: first.planCode,
        currentPeriodEnd: first.currentPeriodEnd,
      });

      const unitRows = await db
        .select()
        .from(deviceSubscriptions)
        .where(eq(deviceSubscriptions.deviceId, byUnitId));
      expect(unitRows).toHaveLength(1);

      const byDeviceId = await seedDevice('R13-device', {
        status: 'available',
      });
      const beforeDefault = Date.now();
      const defaults = await setDeviceSubscription(db, {
        deviceId: byDeviceId,
      });
      const afterDefault = Date.now();

      expect(defaults).toMatchObject({
        deviceId: byDeviceId,
        status: 'active',
        planCode: 'track_monthly',
        entitled: true,
      });
      expect(defaults.currentPeriodEnd.getTime()).toBeGreaterThanOrEqual(
        beforeDefault + 30 * 24 * 60 * 60_000,
      );
      expect(defaults.currentPeriodEnd.getTime()).toBeLessThanOrEqual(
        afterDefault + 30 * 24 * 60 * 60_000,
      );

      const deviceRows = await db
        .select({ id: devices.id, status: devices.status })
        .from(devices)
        .where(inArray(devices.id, [byUnitId, byDeviceId]));
      expect(deviceRows).toEqual(
        expect.arrayContaining([
          { id: byUnitId, status: 'available' },
          { id: byDeviceId, status: 'available' },
        ]),
      );
      const assignments = await db
        .select({ id: petDevices.id })
        .from(petDevices)
        .where(inArray(petDevices.deviceId, [byUnitId, byDeviceId]));
      expect(assignments).toHaveLength(0);
    });

    it.each([
      {
        label: 'missing selector',
        input: {},
        message: '--device-id or --unit-id',
      },
      {
        label: 'both selectors',
        input: { deviceId: 'target', unitId: 'target-unit' },
        message: 'only one of --device-id or --unit-id',
      },
      {
        label: 'invalid status',
        input: { deviceId: 'target', status: 'paused' },
        message: '--status',
      },
      {
        label: 'invalid plan',
        input: { deviceId: 'target', planCode: 'annual' },
        message: '--plan',
      },
      {
        label: 'invalid period end',
        input: { deviceId: 'target', periodEnd: 'not-a-date' },
        message: '--period-end',
      },
      {
        label: 'missing device',
        input: { deviceId: uuidv7() },
        message: '--device-id',
      },
    ])('rejects $label without writing', async ({ input, message }) => {
      invalidCaseSequence += 1;
      const unitId = `target-unit-${invalidCaseSequence}`;
      const targetId = await seedDevice(`R13I${invalidCaseSequence}`, {
        wialonUnitId: unitId,
      });
      const resolvedInput = Object.fromEntries(
        Object.entries(input).map(([key, value]) => [
          key,
          value === 'target'
            ? targetId
            : value === 'target-unit'
              ? unitId
              : value,
        ]),
      );

      await expect(setDeviceSubscription(db, resolvedInput)).rejects.toThrow(
        message,
      );

      const rows = await db
        .select({ deviceId: deviceSubscriptions.deviceId })
        .from(deviceSubscriptions)
        .where(eq(deviceSubscriptions.deviceId, targetId));
      expect(rows).toHaveLength(0);
    });
  });

  describe('R6 (device-subscriptions #25): reset watermark on reactivation', () => {
    it('resets only on the transition from not entitled to entitled', async () => {
      const staleWatermark = new Date(Date.now() - 90 * 24 * 60 * 60_000);
      const deviceId = await seedDevice('R6-reactivate', {
        ingestWatermark: staleWatermark,
      });
      await seedSubscription(
        deviceId,
        'active',
        new Date(Date.now() - 4 * 24 * 60 * 60_000),
      );

      const before = Date.now();
      const first = await setDeviceSubscription(db, {
        deviceId,
        status: 'active',
        periodEnd: new Date(Date.now() + 24 * 60 * 60_000).toISOString(),
      });
      const after = Date.now();
      const [afterFirst] = await db
        .select({ ingestWatermark: devices.ingestWatermark })
        .from(devices)
        .where(eq(devices.id, deviceId));
      const resetWatermark = afterFirst.ingestWatermark?.getTime() ?? 0;

      expect(first.watermarkReset).toBe(true);
      expect(resetWatermark).toBeGreaterThanOrEqual(
        before - CLAIM_WATERMARK_LOOKBACK_MINUTES * 60_000,
      );
      expect(resetWatermark).toBeLessThanOrEqual(
        after - CLAIM_WATERMARK_LOOKBACK_MINUTES * 60_000 + 1_000,
      );

      const second = await setDeviceSubscription(db, {
        deviceId,
        status: 'active',
        periodEnd: first.currentPeriodEnd.toISOString(),
      });
      const [afterSecond] = await db
        .select({ ingestWatermark: devices.ingestWatermark })
        .from(devices)
        .where(eq(devices.id, deviceId));

      expect(second.watermarkReset).toBe(false);
      expect(afterSecond.ingestWatermark?.getTime()).toBe(resetWatermark);
    });
  });

  describe('R10 (device-subscriptions #25): alerts filter by entitlement', () => {
    it('lists only entitled alerts and hides an unentitled alert from ack', async () => {
      const owner = await seedUser('r10-owner');
      const entitledPetId = await seedPet('R10 entitled pet');
      const freePetId = await seedPet('R10 free pet');
      await seedMembership(entitledPetId, owner.id);
      await seedMembership(freePetId, owner.id);

      const entitledDeviceId = await seedActiveCollar(
        entitledPetId,
        'r10-entitled',
      );
      await seedSubscription(
        entitledDeviceId,
        'active',
        new Date('2099-12-31T00:00:00.000Z'),
      );
      await seedActiveCollar(freePetId, 'r10-free');

      const entitledAlertId = uuidv7();
      const freeAlertId = uuidv7();
      await db.insert(alertEvents).values([
        {
          id: entitledAlertId,
          petId: entitledPetId,
          type: 'battery_low',
          payload: {},
          openedAt: new Date('2030-01-02T00:00:00.000Z'),
        },
        {
          id: freeAlertId,
          petId: freePetId,
          type: 'battery_low',
          payload: {},
          openedAt: new Date('2030-01-01T00:00:00.000Z'),
        },
      ]);
      const auth = { Authorization: `Bearer ${owner.token}` };

      const list = await request(app.getHttpServer())
        .get('/v1/alerts')
        .set(auth)
        .expect(200);
      expect(list.body).toMatchObject({
        items: [{ id: entitledAlertId, petId: entitledPetId }],
        nextCursor: null,
      });
      expect(JSON.stringify(list.body)).not.toContain(freeAlertId);

      const ack = await request(app.getHttpServer())
        .post(`/v1/alerts/${freeAlertId}/ack`)
        .set(auth)
        .expect(404);
      expect(ack.status).not.toBe(402);
    });
  });
});
