import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { and, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request, { Response } from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { AppModule } from './../src/app.module';

/** Shape del contrato R8 tal como viaja por HTTP (todo serializado). */
interface PetProfileBody {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string | null;
  birthDate: string | null;
  approxAgeMonths: number | null;
  ageMonths: number;
  currentWeightKg: number | null;
  size: string | null;
  color: string | null;
  sterilized: boolean | null;
  microchip: string | null;
  photoUrl: string | null;
  lostMode: boolean;
  lastPosition: unknown;
  lastCommunicationAt: string | null;
  myRole: string;
  device: null;
  nextVaccine: null;
  nextReminder: null;
  activitySummary: null;
  createdAt: string;
  updatedAt: string;
}

function profileBody(response: Response): PetProfileBody {
  return response.body as PetProfileBody;
}

function listBody(response: Response): PetProfileBody[] {
  return response.body as PetProfileBody[];
}

/**
 * e2e del CRUD de mascotas contra Postgres real (R2-R16). El e2e de IDOR
 * (R9) es obligatorio por acceptance criteria: usuario B sobre mascota de
 * A recibe el MISMO 404 que una mascota inexistente, en GET, PATCH y
 * DELETE. Los tokens se firman con el TokenService de la app (el AuthGuard
 * no consulta `users`, solo verifica la firma — auth-login-me R8), y los
 * usuarios se siembran directo en la base: la gestion de miembros por API
 * esta fuera de alcance de #5.
 */
describe('Pets CRUD (e2e)', () => {
  const RUN_ID = `${Date.now()}`;
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

  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokenService: TokenService;

  const createdUserIds: string[] = [];
  const createdPetIds: string[] = [];

  interface TestUser {
    id: string;
    email: string;
    token: string;
  }

  async function seedUser(label: string): Promise<TestUser> {
    const id = uuidv7();
    const email = `pets-e2e-${label}-${RUN_ID}@example.com`;

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

  async function createPetViaApi(
    owner: TestUser,
    overrides: Record<string, unknown> = {},
  ): Promise<PetProfileBody> {
    const response = await request(app.getHttpServer())
      .post('/v1/pets')
      .set('Authorization', `Bearer ${owner.token}`)
      .send({
        name: `Pet-${RUN_ID}`,
        species: 'dog',
        birthDate: '2024-01-15',
        ...overrides,
      })
      .expect(201);

    const body = profileBody(response);
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
      await db.delete(pets).where(inArray(pets.id, createdPetIds));
    }
    if (createdUserIds.length > 0) {
      await db.delete(users).where(inArray(users.id, createdUserIds));
    }
    await app.close();
  });

  describe('R2: POST /v1/pets crea pets + pet_users(owner) en una transaccion', () => {
    it('responde 201 con el perfil y persiste la membresia owner activa', async () => {
      const owner = await seedUser('r2-owner');

      const body = await createPetViaApi(owner, { name: `R2-${RUN_ID}` });

      expect(body.myRole).toBe('owner');
      expect(body.name).toBe(`R2-${RUN_ID}`);

      const petRows = await db.select().from(pets).where(eq(pets.id, body.id));
      expect(petRows).toHaveLength(1);

      const membershipRows = await db
        .select()
        .from(petUsers)
        .where(and(eq(petUsers.petId, body.id), eq(petUsers.userId, owner.id)));
      expect(membershipRows).toHaveLength(1);
      expect(membershipRows[0].role).toBe('owner');
      expect(membershipRows[0].status).toBe('active');
    });

    it('si el insert de pet_users falla, la fila de pets no persiste (rollback)', async () => {
      // Token valido para un usuario que NO existe en `users`: el AuthGuard
      // pasa (solo verifica firma), pero el insert de pet_users viola la FK
      // user_id -> users.id dentro de la transaccion.
      const ghostId = uuidv7();
      const ghostToken = tokenService.sign({
        sub: ghostId,
        email: `ghost-${RUN_ID}@example.com`,
      });
      const uniqueName = `Rollback-${RUN_ID}`;

      const response = await api()
        .post('/v1/pets')
        .set('Authorization', `Bearer ${ghostToken}`)
        .send({ name: uniqueName, species: 'dog', birthDate: '2024-01-15' });

      expect(response.status).toBeGreaterThanOrEqual(500);

      const orphanPets = await db
        .select()
        .from(pets)
        .where(eq(pets.name, uniqueName));
      expect(orphanPets).toHaveLength(0);
    });
  });

  describe('R3: la creacion exitosa audita pet.create', () => {
    it('deja una entrada action=pet.create con el entityId y el creador', async () => {
      const owner = await seedUser('r3-owner');
      const body = await createPetViaApi(owner);

      const entries = await db
        .select()
        .from(auditLog)
        .where(
          and(
            eq(auditLog.action, 'pet.create'),
            eq(auditLog.entityId, body.id),
          ),
        );

      expect(entries).toHaveLength(1);
      expect(entries[0].entity).toBe('pet');
      expect(entries[0].userId).toBe(owner.id);
    });
  });

  describe('R4: body invalido responde 400 sin escribir en pets ni audit_log', () => {
    it('rechaza species invalida sin dejar rastro en la base', async () => {
      const owner = await seedUser('r4-owner');

      await api()
        .post('/v1/pets')
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ name: 'Bird', species: 'bird', birthDate: '2024-01-15' })
        .expect(400);

      const memberships = await db
        .select()
        .from(petUsers)
        .where(eq(petUsers.userId, owner.id));
      expect(memberships).toHaveLength(0);

      const audits = await db
        .select()
        .from(auditLog)
        .where(eq(auditLog.userId, owner.id));
      expect(audits).toHaveLength(0);
    });
  });

  describe('R5: birthDate XOR approxAgeMonths en el alta', () => {
    it('rechaza ambos presentes con 400', async () => {
      const owner = await seedUser('r5-owner');

      await api()
        .post('/v1/pets')
        .set('Authorization', `Bearer ${owner.token}`)
        .send({
          name: 'Both',
          species: 'cat',
          birthDate: '2024-01-15',
          approxAgeMonths: 6,
        })
        .expect(400);
    });

    it('rechaza ninguno de los dos con 400', async () => {
      const owner = await seedUser('r5b-owner');

      await api()
        .post('/v1/pets')
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ name: 'Neither', species: 'cat' })
        .expect(400);
    });
  });

  describe('R7: GET /v1/pets lista solo membresias activas con myRole', () => {
    it('devuelve exclusivamente las mascotas del usuario', async () => {
      const owner = await seedUser('r7-owner');
      const stranger = await seedUser('r7-stranger');
      const petA = await createPetViaApi(owner, { name: `R7a-${RUN_ID}` });
      const petB = await createPetViaApi(owner, { name: `R7b-${RUN_ID}` });

      const response = await api()
        .get('/v1/pets')
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);

      const items = listBody(response);
      expect(items.map((pet) => pet.id).sort()).toEqual(
        [petA.id, petB.id].sort(),
      );
      for (const pet of items) {
        expect(pet.myRole).toBe('owner');
      }

      const strangerList = await api()
        .get('/v1/pets')
        .set('Authorization', `Bearer ${stranger.token}`)
        .expect(200);
      expect(listBody(strangerList)).toEqual([]);
    });

    it('excluye membresias con status distinto de active', async () => {
      const owner = await seedUser('r7c-owner');
      const revoked = await seedUser('r7c-revoked');
      const pet = await createPetViaApi(owner, { name: `R7c-${RUN_ID}` });
      await seedMembership(pet.id, revoked.id, 'family', 'revoked');

      const response = await api()
        .get('/v1/pets')
        .set('Authorization', `Bearer ${revoked.token}`)
        .expect(200);

      expect(listBody(response)).toEqual([]);
    });
  });

  describe('R8: GET /v1/pets/:petId devuelve el contrato completo', () => {
    it('responde exactamente las 24 claves con los placeholders en null', async () => {
      const owner = await seedUser('r8-owner');
      const pet = await createPetViaApi(owner, { name: `R8-${RUN_ID}` });

      const response = await api()
        .get(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);

      const body = profileBody(response);
      expect(Object.keys(body).sort()).toEqual(PROFILE_KEYS);
      expect(body.device).toBeNull();
      expect(body.nextVaccine).toBeNull();
      expect(body.nextReminder).toBeNull();
      expect(body.activitySummary).toBeNull();
      expect(body.photoUrl).toBeNull();
      expect(body.lastPosition).toBeNull();
      expect(body.lastCommunicationAt).toBeNull();
      expect(body.myRole).toBe('owner');
      expect(typeof body.ageMonths).toBe('number');
    });
  });

  describe('R9: IDOR — usuario B sobre mascota de A recibe 404 indistinguible', () => {
    it('GET, PATCH y DELETE responden el mismo 404 que un petId inexistente', async () => {
      const owner = await seedUser('r9-owner');
      const attacker = await seedUser('r9-attacker');
      const pet = await createPetViaApi(owner, { name: `R9-${RUN_ID}` });

      const nonexistentId = uuidv7();
      const baseline = await api()
        .get(`/v1/pets/${nonexistentId}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(404);

      const getResponse = await api()
        .get(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${attacker.token}`)
        .expect(404);
      expect(getResponse.body).toEqual(baseline.body);

      const patchResponse = await api()
        .patch(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${attacker.token}`)
        .send({ name: 'Hacked' })
        .expect(404);
      expect(patchResponse.body).toEqual(baseline.body);

      const deleteResponse = await api()
        .delete(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${attacker.token}`)
        .expect(404);
      expect(deleteResponse.body).toEqual(baseline.body);

      // La mascota sigue intacta para su owner.
      const stillThere = await api()
        .get(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);
      expect(profileBody(stillThere).name).toBe(`R9-${RUN_ID}`);
    });

    it('una membresia no activa recibe el mismo 404 que un no-miembro', async () => {
      const owner = await seedUser('r9b-owner');
      const revoked = await seedUser('r9b-revoked');
      const pet = await createPetViaApi(owner, { name: `R9b-${RUN_ID}` });
      await seedMembership(pet.id, revoked.id, 'family', 'revoked');

      await api()
        .get(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${revoked.token}`)
        .expect(404);
    });
  });

  describe('R10: petId no-UUID responde 404 con el mismo body generico', () => {
    it('responde 404 identico al de una mascota inexistente', async () => {
      const owner = await seedUser('r10-owner');

      const baseline = await api()
        .get(`/v1/pets/${uuidv7()}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(404);

      const response = await api()
        .get('/v1/pets/not-a-uuid')
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(404);

      expect(response.body).toEqual(baseline.body);
    });
  });

  describe('R11: miembro con rol insuficiente recibe 403 en PATCH y DELETE', () => {
    it('family recibe 403 en PATCH; vet recibe 403 en DELETE', async () => {
      const owner = await seedUser('r11-owner');
      const family = await seedUser('r11-family');
      const vet = await seedUser('r11-vet');
      const pet = await createPetViaApi(owner, { name: `R11-${RUN_ID}` });
      await seedMembership(pet.id, family.id, 'family');
      await seedMembership(pet.id, vet.id, 'vet');

      await api()
        .patch(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${family.token}`)
        .send({ name: 'NotAllowed' })
        .expect(403);

      await api()
        .delete(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${vet.token}`)
        .expect(403);

      // 404 precede a 403: un no-miembro jamas ve el 403 del rol.
      const outsider = await seedUser('r11-outsider');
      await api()
        .delete(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${outsider.token}`)
        .expect(404);
    });
  });

  describe('R12: GET detalle accesible para cualquier rol activo', () => {
    it('family accede al detalle con su myRole', async () => {
      const owner = await seedUser('r12-owner');
      const family = await seedUser('r12-family');
      const pet = await createPetViaApi(owner, { name: `R12-${RUN_ID}` });
      await seedMembership(pet.id, family.id, 'family');

      const response = await api()
        .get(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${family.token}`)
        .expect(200);

      expect(profileBody(response).myRole).toBe('family');
    });
  });

  describe('R13: PATCH del owner actualiza solo los campos presentes', () => {
    it('persiste el subconjunto enviado y refresca updated_at', async () => {
      const owner = await seedUser('r13-owner');
      const pet = await createPetViaApi(owner, {
        name: `R13-${RUN_ID}`,
        weightKg: 20,
      });

      const response = await api()
        .patch(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ name: `R13-updated-${RUN_ID}`, weightKg: 22.5 })
        .expect(200);

      const body = profileBody(response);
      expect(body.name).toBe(`R13-updated-${RUN_ID}`);
      expect(body.currentWeightKg).toBe(22.5);
      // Campos no enviados intactos:
      expect(body.species).toBe('dog');
      expect(body.birthDate).toBe('2024-01-15');
      expect(new Date(body.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(pet.updatedAt).getTime(),
      );
    });

    it('un campo invalido rechaza el body completo sin persistir nada', async () => {
      const owner = await seedUser('r13b-owner');
      const pet = await createPetViaApi(owner, { name: `R13b-${RUN_ID}` });

      await api()
        .patch(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ name: 'Valid name', weightKg: -5 })
        .expect(400);

      const unchanged = await api()
        .get(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);
      expect(profileBody(unchanged).name).toBe(`R13b-${RUN_ID}`);
    });
  });

  describe('R14: en PATCH la edad tiene una sola fuente de verdad', () => {
    it('enviar approxAgeMonths anula birth_date (y viceversa); ambos es 400', async () => {
      const owner = await seedUser('r14-owner');
      const pet = await createPetViaApi(owner, { name: `R14-${RUN_ID}` });

      const withApprox = await api()
        .patch(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ approxAgeMonths: 24 })
        .expect(200);
      expect(profileBody(withApprox).approxAgeMonths).toBe(24);
      expect(profileBody(withApprox).birthDate).toBeNull();

      const withBirthDate = await api()
        .patch(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ birthDate: '2024-06-01' })
        .expect(200);
      expect(profileBody(withBirthDate).birthDate).toBe('2024-06-01');
      expect(profileBody(withBirthDate).approxAgeMonths).toBeNull();

      await api()
        .patch(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ birthDate: '2024-06-01', approxAgeMonths: 12 })
        .expect(400);
    });
  });

  describe('R15: auditoria de pet.update con nombres de campos; body vacio no audita', () => {
    it('el PATCH con cambios deja meta.fields; el body vacio es no-op sin auditoria', async () => {
      const owner = await seedUser('r15-owner');
      const pet = await createPetViaApi(owner, { name: `R15-${RUN_ID}` });

      await api()
        .patch(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ color: 'black', sterilized: true })
        .expect(200);

      const updates = await db
        .select()
        .from(auditLog)
        .where(
          and(eq(auditLog.action, 'pet.update'), eq(auditLog.entityId, pet.id)),
        );
      expect(updates).toHaveLength(1);
      expect(updates[0].meta).toEqual({ fields: ['color', 'sterilized'] });

      const noop = await api()
        .patch(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({})
        .expect(200);
      expect(profileBody(noop).color).toBe('black');

      const updatesAfterNoop = await db
        .select()
        .from(auditLog)
        .where(
          and(eq(auditLog.action, 'pet.update'), eq(auditLog.entityId, pet.id)),
        );
      expect(updatesAfterNoop).toHaveLength(1);
    });
  });

  describe('R16: DELETE del owner responde 204, cascadea y audita', () => {
    it('borra la mascota, sus membresias caen en cascada y queda auditado', async () => {
      const owner = await seedUser('r16-owner');
      const family = await seedUser('r16-family');
      const pet = await createPetViaApi(owner, { name: `R16-${RUN_ID}` });
      await seedMembership(pet.id, family.id, 'family');

      const response = await api()
        .delete(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(204);
      expect(response.body).toEqual({});

      const memberships = await db
        .select()
        .from(petUsers)
        .where(eq(petUsers.petId, pet.id));
      expect(memberships).toHaveLength(0);

      const audits = await db
        .select()
        .from(auditLog)
        .where(
          and(eq(auditLog.action, 'pet.delete'), eq(auditLog.entityId, pet.id)),
        );
      expect(audits).toHaveLength(1);
      expect(audits[0].userId).toBe(owner.id);

      await api()
        .get(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(404);

      const list = await api()
        .get('/v1/pets')
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);
      expect(listBody(list).some((item) => item.id === pet.id)).toBe(false);
    });
  });
});
