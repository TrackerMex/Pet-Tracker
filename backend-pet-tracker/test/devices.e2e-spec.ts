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
      imei: `IMEI-${label}-${RUN_ID}`,
      serialNumber: `SER-${label}-${RUN_ID}`,
      activationCode: `ACT-${label}-${RUN_ID}`,
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

  const CLAIM_KEYS = [
    'model',
    'batteryPct',
    'connectivity',
    'lastMessageAt',
    'esn',
  ].sort();

  function claim(user: TestUser, body: Record<string, unknown>) {
    return api()
      .post('/v1/devices/claim')
      .set('Authorization', `Bearer ${user.token}`)
      .send(body);
  }

  /** 404 generico del guard: el baseline contra el que se compara R5. */
  async function guardBaseline404(user: TestUser) {
    const response = await api()
      .get(`/v1/pets/${uuidv7()}`)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(404);

    return response.body as Record<string, unknown>;
  }

  describe('R3: claim feliz — transaccion + status assigned + watermark now-10min', () => {
    it('responde 201 con las 5 claves y persiste la asignacion atomica', async () => {
      const owner = await seedUser('r3-owner');
      const pet = await createPetViaApi(owner, `R3-${RUN_ID}`);
      const device = await seedDevice('R3');

      const before = Date.now();
      const response = await claim(owner, {
        petId: pet.id,
        esn: device.esn,
      }).expect(201);
      const after = Date.now();

      const body = response.body as Record<string, unknown>;
      expect(Object.keys(body).sort()).toEqual(CLAIM_KEYS);
      expect(body).toEqual({
        model: 'e2e-collar',
        batteryPct: null,
        connectivity: null,
        lastMessageAt: null,
        esn: device.esn,
      });

      const activeRows = await db
        .select()
        .from(petDevices)
        .where(
          and(
            eq(petDevices.deviceId, device.id),
            eq(petDevices.petId, pet.id),
            isNull(petDevices.releasedAt),
          ),
        );
      expect(activeRows).toHaveLength(1);

      const [deviceRow] = await db
        .select()
        .from(devices)
        .where(eq(devices.id, device.id));
      expect(deviceRow.status).toBe('assigned');

      // R3: ingest_watermark = now() - 10 minutos (ventana del roundtrip).
      const watermark = deviceRow.ingestWatermark?.getTime() ?? 0;
      const tenMinutes = 10 * 60_000;
      expect(watermark).toBeGreaterThanOrEqual(before - tenMinutes);
      expect(watermark).toBeLessThanOrEqual(after - tenMinutes + 60_000);
    });
  });

  describe('R4: body invalido responde 400 sin escribir en ninguna tabla', () => {
    it('rechaza petId no-UUID, cero identificadores y dos identificadores', async () => {
      const owner = await seedUser('r4-owner');
      const pet = await createPetViaApi(owner, `R4-${RUN_ID}`);
      const device = await seedDevice('R4');

      await claim(owner, { petId: 'not-a-uuid', esn: device.esn }).expect(400);
      await claim(owner, { petId: pet.id }).expect(400);
      await claim(owner, {
        petId: pet.id,
        esn: device.esn,
        imei: '123456789012345',
      }).expect(400);

      const rows = await db
        .select()
        .from(petDevices)
        .where(eq(petDevices.petId, pet.id));
      expect(rows).toHaveLength(0);
    });
  });

  describe('R2 (claim-activation-code-only #26): imei, esn y serialNumber no reclaman nada', () => {
    it.each(['imei', 'esn', 'serialNumber'] as const)(
      '%s sin activationCode responde 400 y no escribe',
      async (field) => {
        const owner = await seedUser(`r2-26-${field}-owner`);
        const pet = await createPetViaApi(owner, `R2-26-${field}-${RUN_ID}`);
        const device = await seedDevice(`R2-26-${field}`);

        await claim(owner, {
          petId: pet.id,
          [field]: device[field],
        }).expect(400);

        const assignments = await db
          .select()
          .from(petDevices)
          .where(eq(petDevices.deviceId, device.id));
        expect(assignments).toHaveLength(0);

        const [deviceAfterRejectedClaim] = await db
          .select()
          .from(devices)
          .where(eq(devices.id, device.id));
        expect(deviceAfterRejectedClaim.status).toBe('available');

        const audits = await db
          .select()
          .from(auditLog)
          .where(
            and(
              eq(auditLog.action, 'device.claim'),
              eq(auditLog.entityId, device.id),
            ),
          );
        expect(audits).toHaveLength(0);

        await claim(owner, {
          petId: pet.id,
          activationCode: device.activationCode,
        }).expect(201);
      },
    );
  });

  describe('R1c (claim-activation-code-only #26): un imei ajeno junto al activationCode correcto se ignora', () => {
    it('reclama el device del activationCode y no el del imei', async () => {
      const owner = await seedUser('r1c-26-owner');
      const pet = await createPetViaApi(owner, `R1c-26-${RUN_ID}`);
      const victim = await seedDevice('R1c-26-victim');
      const attackerDevice = await seedDevice('R1c-26-attacker');

      await claim(owner, {
        petId: pet.id,
        activationCode: attackerDevice.activationCode,
        imei: victim.imei,
      }).expect(201);

      const assignments = await db
        .select()
        .from(petDevices)
        .where(eq(petDevices.petId, pet.id));
      expect(assignments).toHaveLength(1);
      expect(assignments[0].deviceId).toBe(attackerDevice.id);

      const victimAssignments = await db
        .select()
        .from(petDevices)
        .where(eq(petDevices.deviceId, victim.id));
      expect(victimAssignments).toHaveLength(0);

      const [victimAfterClaim] = await db
        .select()
        .from(devices)
        .where(eq(devices.id, victim.id));
      expect(victimAfterClaim.status).toBe('available');
    });
  });

  describe('R5: mascota inexistente o ajena responde el 404 generico del guard', () => {
    it('usuario B sobre mascota de A recibe 404 (no 409, no 403) con el mismo body', async () => {
      const owner = await seedUser('r5-owner');
      const attacker = await seedUser('r5-attacker');
      const pet = await createPetViaApi(owner, `R5-${RUN_ID}`);
      const device = await seedDevice('R5');

      const baseline = await guardBaseline404(attacker);

      const response = await claim(attacker, {
        petId: pet.id,
        esn: device.esn,
      }).expect(404);
      expect(response.body).toEqual(baseline);

      // petId bien formado pero inexistente: mismo 404 indistinguible.
      const ghost = await claim(attacker, {
        petId: uuidv7(),
        esn: device.esn,
      }).expect(404);
      expect(ghost.body).toEqual(baseline);

      const rows = await db
        .select()
        .from(petDevices)
        .where(eq(petDevices.deviceId, device.id));
      expect(rows).toHaveLength(0);
    });
  });

  describe('R6: miembro activo con rol distinto de owner recibe 403', () => {
    it('family recibe 403 sin escribir nada', async () => {
      const owner = await seedUser('r6-owner');
      const family = await seedUser('r6-family');
      const pet = await createPetViaApi(owner, `R6-${RUN_ID}`);
      await seedMembership(pet.id, family.id, 'family');
      const device = await seedDevice('R6');

      await claim(family, { petId: pet.id, esn: device.esn }).expect(403);

      const rows = await db
        .select()
        .from(petDevices)
        .where(eq(petDevices.deviceId, device.id));
      expect(rows).toHaveLength(0);
    });
  });

  describe('R7: identificador sin device responde 404 DEVICE_NOT_FOUND', () => {
    it('devuelve el codigo DEVICE_NOT_FOUND en el body', async () => {
      const owner = await seedUser('r7-owner');
      const pet = await createPetViaApi(owner, `R7-${RUN_ID}`);

      const response = await claim(owner, {
        petId: pet.id,
        esn: `NOPE-${RUN_ID}`,
      }).expect(404);

      expect((response.body as { code: string }).code).toBe('DEVICE_NOT_FOUND');
    });
  });

  describe('R8: device con fila activa o inactive responde 409 DEVICE_ALREADY_ASSIGNED', () => {
    it('el segundo claim del mismo device (misma u otra mascota) es 409', async () => {
      const ownerA = await seedUser('r8-owner-a');
      const ownerB = await seedUser('r8-owner-b');
      const petA = await createPetViaApi(ownerA, `R8a-${RUN_ID}`);
      const petB = await createPetViaApi(ownerB, `R8b-${RUN_ID}`);
      const device = await seedDevice('R8');

      await claim(ownerA, { petId: petA.id, esn: device.esn }).expect(201);

      const samePet = await claim(ownerA, {
        petId: petA.id,
        esn: device.esn,
      }).expect(409);
      expect((samePet.body as { code: string }).code).toBe(
        'DEVICE_ALREADY_ASSIGNED',
      );

      const otherPet = await claim(ownerB, {
        petId: petB.id,
        esn: device.esn,
      }).expect(409);
      expect((otherPet.body as { code: string }).code).toBe(
        'DEVICE_ALREADY_ASSIGNED',
      );
    });

    it('un device inactive no es reclamable aunque no tenga fila activa (D3)', async () => {
      const owner = await seedUser('r8c-owner');
      const pet = await createPetViaApi(owner, `R8c-${RUN_ID}`);
      const device = await seedDevice('R8C', { status: 'inactive' });

      const response = await claim(owner, {
        petId: pet.id,
        esn: device.esn,
      }).expect(409);
      expect((response.body as { code: string }).code).toBe(
        'DEVICE_ALREADY_ASSIGNED',
      );
    });

    it('dos claims concurrentes del mismo device: a lo sumo un 201, jamas un 500', async () => {
      const ownerA = await seedUser('r8d-owner-a');
      const ownerB = await seedUser('r8d-owner-b');
      const petA = await createPetViaApi(ownerA, `R8d-a-${RUN_ID}`);
      const petB = await createPetViaApi(ownerB, `R8d-b-${RUN_ID}`);
      const device = await seedDevice('R8D');

      const [first, second] = await Promise.all([
        claim(ownerA, { petId: petA.id, esn: device.esn }),
        claim(ownerB, { petId: petB.id, esn: device.esn }),
      ]);

      expect([first.status, second.status].sort()).toEqual([201, 409]);

      const activeRows = await db
        .select()
        .from(petDevices)
        .where(
          and(
            eq(petDevices.deviceId, device.id),
            isNull(petDevices.releasedAt),
          ),
        );
      expect(activeRows).toHaveLength(1);
    });
  });

  describe('R9: mascota con collar activo responde 409 PET_ALREADY_HAS_DEVICE', () => {
    it('el segundo collar para la misma mascota es 409 con su codigo (D2)', async () => {
      const owner = await seedUser('r9-owner');
      const pet = await createPetViaApi(owner, `R9-${RUN_ID}`);
      const first = await seedDevice('R9A');
      const second = await seedDevice('R9B');

      await claim(owner, { petId: pet.id, esn: first.esn }).expect(201);

      const response = await claim(owner, {
        petId: pet.id,
        esn: second.esn,
      }).expect(409);
      expect((response.body as { code: string }).code).toBe(
        'PET_ALREADY_HAS_DEVICE',
      );

      // El segundo device sigue sin fila alguna.
      const rows = await db
        .select()
        .from(petDevices)
        .where(eq(petDevices.deviceId, second.id));
      expect(rows).toHaveLength(0);
    });
  });

  describe('R10: el claim exitoso audita device.claim con meta {petId}', () => {
    it('deja exactamente una entrada sin el identificador enviado', async () => {
      const owner = await seedUser('r10-owner');
      const pet = await createPetViaApi(owner, `R10-${RUN_ID}`);
      const device = await seedDevice('R10');

      await claim(owner, { petId: pet.id, esn: device.esn }).expect(201);

      const entries = await db
        .select()
        .from(auditLog)
        .where(
          and(
            eq(auditLog.action, 'device.claim'),
            eq(auditLog.entityId, device.id),
          ),
        );
      expect(entries).toHaveLength(1);
      expect(entries[0].entity).toBe('device');
      expect(entries[0].userId).toBe(owner.id);
      expect(entries[0].meta).toEqual({ petId: pet.id });
    });

    it('un claim rechazado (409) no audita nada', async () => {
      const owner = await seedUser('r10b-owner');
      const pet = await createPetViaApi(owner, `R10b-${RUN_ID}`);
      const device = await seedDevice('R10B', { status: 'inactive' });

      await claim(owner, { petId: pet.id, esn: device.esn }).expect(409);

      const entries = await db
        .select()
        .from(auditLog)
        .where(
          and(
            eq(auditLog.action, 'device.claim'),
            eq(auditLog.entityId, device.id),
          ),
        );
      expect(entries).toHaveLength(0);
    });
  });

  describe('R11: GET /v1/pets/:petId/device devuelve el estado o null', () => {
    it('con collar activo responde las 5 claves para cualquier rol activo', async () => {
      const owner = await seedUser('r11-owner');
      const family = await seedUser('r11-family');
      const pet = await createPetViaApi(owner, `R11-${RUN_ID}`);
      await seedMembership(pet.id, family.id, 'family');
      const device = await seedDevice('R11');

      await claim(owner, { petId: pet.id, esn: device.esn }).expect(201);

      const response = await api()
        .get(`/v1/pets/${pet.id}/device`)
        .set('Authorization', `Bearer ${family.token}`)
        .expect(200);

      expect(response.body).toEqual({
        model: 'e2e-collar',
        batteryPct: null,
        connectivity: null,
        lastMessageAt: null,
        esn: device.esn,
      });
    });

    it('sin collar activo responde 200 con body JSON null — estado, no error', async () => {
      const owner = await seedUser('r11b-owner');
      const pet = await createPetViaApi(owner, `R11b-${RUN_ID}`);

      const response = await api()
        .get(`/v1/pets/${pet.id}/device`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);

      expect(response.body).toBeNull();
    });

    it('mascota ajena, inexistente o malformada: 404 generico del guard', async () => {
      const owner = await seedUser('r11c-owner');
      const outsider = await seedUser('r11c-outsider');
      const pet = await createPetViaApi(owner, `R11c-${RUN_ID}`);

      const baseline = await guardBaseline404(outsider);

      const foreign = await api()
        .get(`/v1/pets/${pet.id}/device`)
        .set('Authorization', `Bearer ${outsider.token}`)
        .expect(404);
      expect(foreign.body).toEqual(baseline);

      await api()
        .get(`/v1/pets/${uuidv7()}/device`)
        .set('Authorization', `Bearer ${outsider.token}`)
        .expect(404);

      await api()
        .get('/v1/pets/not-a-uuid/device')
        .set('Authorization', `Bearer ${outsider.token}`)
        .expect(404);
    });
  });

  describe('R12: el perfil GET /v1/pets/:petId rellena la clave device', () => {
    // Contrato congelado del perfil (R8 de #5): mismas 24 claves siempre.
    const PROFILE_KEYS = [
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
    ].sort();

    it('con collar activo device trae el objeto de R11; sin collar sigue null', async () => {
      const owner = await seedUser('r12-owner');
      const pet = await createPetViaApi(owner, `R12-${RUN_ID}`);
      const device = await seedDevice('R12');

      const before = await api()
        .get(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);
      expect((before.body as { device: unknown }).device).toBeNull();

      await claim(owner, { petId: pet.id, esn: device.esn }).expect(201);

      const after = await api()
        .get(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);

      const body = after.body as Record<string, unknown>;
      // El resto del contrato no cambia: ni claves nuevas ni renombradas.
      expect(Object.keys(body).sort()).toEqual(PROFILE_KEYS);
      expect(body.device).toEqual({
        model: 'e2e-collar',
        batteryPct: null,
        connectivity: null,
        lastMessageAt: null,
        esn: device.esn,
      });
    });
  });

  describe('R13: DELETE libera el collar, audita y habilita el ciclo claim de nuevo', () => {
    it('204 sin body; released_at y status available; re-claim del device es 201', async () => {
      const ownerA = await seedUser('r13-owner-a');
      const ownerB = await seedUser('r13-owner-b');
      const petA = await createPetViaApi(ownerA, `R13a-${RUN_ID}`);
      const petB = await createPetViaApi(ownerB, `R13b-${RUN_ID}`);
      const device = await seedDevice('R13');

      await claim(ownerA, { petId: petA.id, esn: device.esn }).expect(201);

      const response = await api()
        .delete(`/v1/pets/${petA.id}/device`)
        .set('Authorization', `Bearer ${ownerA.token}`)
        .expect(204);
      expect(response.body).toEqual({});

      const assignments = await db
        .select()
        .from(petDevices)
        .where(eq(petDevices.deviceId, device.id));
      expect(assignments).toHaveLength(1);
      expect(assignments[0].releasedAt).not.toBeNull();

      const [deviceRow] = await db
        .select()
        .from(devices)
        .where(eq(devices.id, device.id));
      expect(deviceRow.status).toBe('available');

      const audits = await db
        .select()
        .from(auditLog)
        .where(
          and(
            eq(auditLog.action, 'device.release'),
            eq(auditLog.entityId, device.id),
          ),
        );
      expect(audits).toHaveLength(1);
      expect(audits[0].userId).toBe(ownerA.id);
      expect(audits[0].meta).toEqual({ petId: petA.id });

      // Ciclo completo claim -> release -> claim, con otro owner (R13).
      await claim(ownerB, { petId: petB.id, esn: device.esn }).expect(201);
    });
  });

  describe('R14: DELETE sin collar es 404 DEVICE_NOT_ASSIGNED; 404 de membresia precede al 403', () => {
    it('sin collar activo responde DEVICE_NOT_ASSIGNED', async () => {
      const owner = await seedUser('r14-owner');
      const pet = await createPetViaApi(owner, `R14-${RUN_ID}`);

      const response = await api()
        .delete(`/v1/pets/${pet.id}/device`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(404);

      expect((response.body as { code: string }).code).toBe(
        'DEVICE_NOT_ASSIGNED',
      );
    });

    it('miembro no-owner recibe 403; sin membresia el 404 generico del guard', async () => {
      const owner = await seedUser('r14b-owner');
      const family = await seedUser('r14b-family');
      const outsider = await seedUser('r14b-outsider');
      const pet = await createPetViaApi(owner, `R14b-${RUN_ID}`);
      await seedMembership(pet.id, family.id, 'family');
      const device = await seedDevice('R14B');

      await claim(owner, { petId: pet.id, esn: device.esn }).expect(201);

      await api()
        .delete(`/v1/pets/${pet.id}/device`)
        .set('Authorization', `Bearer ${family.token}`)
        .expect(403);

      const baseline = await guardBaseline404(outsider);
      const foreign = await api()
        .delete(`/v1/pets/${pet.id}/device`)
        .set('Authorization', `Bearer ${outsider.token}`)
        .expect(404);
      expect(foreign.body).toEqual(baseline);

      // El collar sigue asignado: ni el 403 ni el 404 escribieron nada.
      const activeRows = await db
        .select()
        .from(petDevices)
        .where(
          and(
            eq(petDevices.deviceId, device.id),
            isNull(petDevices.releasedAt),
          ),
        );
      expect(activeRows).toHaveLength(1);
    });
  });

  describe('R15: borrar una mascota con collar deja el device reclamable (D3)', () => {
    it('claim -> DELETE /v1/pets/:petId -> claim con otra mascota responde 201', async () => {
      const ownerA = await seedUser('r15-owner-a');
      const ownerB = await seedUser('r15-owner-b');
      const petA = await createPetViaApi(ownerA, `R15a-${RUN_ID}`);
      const petB = await createPetViaApi(ownerB, `R15b-${RUN_ID}`);
      const device = await seedDevice('R15');

      await claim(ownerA, { petId: petA.id, esn: device.esn }).expect(201);

      // DELETE de #5: el ON DELETE CASCADE borra la fila de pet_devices y
      // nadie actualiza devices.status — queda 'assigned' huerfano.
      await api()
        .delete(`/v1/pets/${petA.id}`)
        .set('Authorization', `Bearer ${ownerA.token}`)
        .expect(204);

      const [orphaned] = await db
        .select()
        .from(devices)
        .where(eq(devices.id, device.id));
      expect(orphaned.status).toBe('assigned');

      const assignments = await db
        .select()
        .from(petDevices)
        .where(eq(petDevices.deviceId, device.id));
      expect(assignments).toHaveLength(0);

      // La disponibilidad se deriva de la fila activa, no del cache de
      // status: el device sigue reclamable (D3).
      await claim(ownerB, { petId: petB.id, esn: device.esn }).expect(201);

      const [reclaimed] = await db
        .select()
        .from(devices)
        .where(eq(devices.id, device.id));
      expect(reclaimed.status).toBe('assigned');

      const activeRows = await db
        .select()
        .from(petDevices)
        .where(
          and(
            eq(petDevices.deviceId, device.id),
            isNull(petDevices.releasedAt),
          ),
        );
      expect(activeRows).toHaveLength(1);
      expect(activeRows[0].petId).toBe(petB.id);
    });
  });
});
