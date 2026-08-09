import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { and, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { auditLog } from '@/db/schema/audit-log.schema';
import { petVaccines, vaccineCatalog } from '@/db/schema/health.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { seedVaccineCatalog } from '@/db/seed/vaccine-catalog';
import { DRIZZLE } from '@/db/drizzle.constants';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { AppModule } from '../src/app.module';

describe('Health vaccines (e2e)', () => {
  const runId = Date.now();
  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let tokens: TokenService;
  const userIds: string[] = [];
  const petIds: string[] = [];

  interface UserFixture {
    id: string;
    token: string;
  }

  const api = () => request(app.getHttpServer());
  const auth = (token: string) => ({ Authorization: `Bearer ${token}` });
  const dateOffset = (days: number) =>
    new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

  async function seedUser(label: string): Promise<UserFixture> {
    const id = uuidv7();
    const email = `vaccines-${label}-${runId}@example.com`;
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

  async function seedPet(owner: UserFixture, species: 'dog' | 'cat' = 'dog') {
    const response = await api()
      .post('/v1/pets')
      .set(auth(owner.token))
      .send({ name: `Pet-${uuidv7()}`, species, birthDate: '2024-01-15' })
      .expect(201);
    const pet = response.body as { id: string };
    petIds.push(pet.id);
    return pet;
  }

  async function catalogId(species: 'dog' | 'cat', name: string) {
    const [row] = await db
      .select({ id: vaccineCatalog.id })
      .from(vaccineCatalog)
      .where(
        and(eq(vaccineCatalog.species, species), eq(vaccineCatalog.name, name)),
      );
    return row.id;
  }

  const postVaccine = (
    user: UserFixture,
    petId: string,
    body: Record<string, unknown>,
  ) =>
    api().post(`/v1/pets/${petId}/vaccines`).set(auth(user.token)).send(body);

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();
    db = app.get<NodePgDatabase>(DRIZZLE);
    tokens = app.get<TokenService>(TOKEN_SERVICE);
    await seedVaccineCatalog(db);
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

  describe('R2: seed idempotente', () => {
    it('dos corridas dejan exactamente 4 dog y 3 cat', async () => {
      await seedVaccineCatalog(db);
      const rows = await db.select().from(vaccineCatalog);
      expect(rows.filter((row) => row.species === 'dog')).toHaveLength(4);
      expect(rows.filter((row) => row.species === 'cat')).toHaveLength(3);
    });

    it('elimina filas no canonicas y termina exactamente en 4 dog y 3 cat', async () => {
      const extraId = uuidv7();
      await db.insert(vaccineCatalog).values({
        id: extraId,
        species: 'dog',
        name: `Extra reviewer ${runId}`,
        scheme: { firstDoseMonths: 1, boosterMonths: 1 },
      });

      try {
        await seedVaccineCatalog(db);

        const rows = await db.select().from(vaccineCatalog);
        expect(rows.filter((row) => row.species === 'dog')).toHaveLength(4);
        expect(rows.filter((row) => row.species === 'cat')).toHaveLength(3);
      } finally {
        await db.delete(vaccineCatalog).where(eq(vaccineCatalog.id, extraId));
      }
    });
  });

  describe('R3: GET /v1/vaccine-catalog', () => {
    it('filtra por especie y ordena por name; query ausente o invalida es 400', async () => {
      const user = await seedUser('r3');
      const response = await api()
        .get('/v1/vaccine-catalog?species=dog')
        .set(auth(user.token))
        .expect(200);
      const rows = response.body as Array<Record<string, unknown>>;
      expect(rows).toHaveLength(4);
      expect(rows.map((row) => row.name)).toEqual(
        [...rows.map((row) => row.name as string)].sort(),
      );
      expect(Object.keys(rows[0]).sort()).toEqual(
        ['id', 'species', 'name', 'scheme'].sort(),
      );
      await api().get('/v1/vaccine-catalog').set(auth(user.token)).expect(400);
      await api()
        .get('/v1/vaccine-catalog?species=bird')
        .set(auth(user.token))
        .expect(400);
    });
  });

  describe('R4: PetAccessGuard bloquea IDOR en las cuatro rutas', () => {
    it('usuario B recibe 404 en POST, GET, PATCH y DELETE', async () => {
      const owner = await seedUser('r4-owner');
      const outsider = await seedUser('r4-outsider');
      const pet = await seedPet(owner);
      const id = uuidv7();
      await db.insert(petVaccines).values({
        id,
        petId: pet.id,
        name: 'Manual',
        appliedAt: '2026-01-01',
        createdBy: owner.id,
      });

      for (const petId of [pet.id, uuidv7(), 'not-a-uuid']) {
        await postVaccine(outsider, petId, {
          name: 'Hack',
          appliedAt: '2026-01-01',
        }).expect(404);
        await api()
          .get(`/v1/pets/${petId}/vaccines`)
          .set(auth(outsider.token))
          .expect(404);
        await api()
          .patch(`/v1/pets/${petId}/vaccines/${id}`)
          .set(auth(outsider.token))
          .send({ name: 'Hack' })
          .expect(404);
        await api()
          .delete(`/v1/pets/${petId}/vaccines/${id}`)
          .set(auth(outsider.token))
          .expect(404);
      }
    });
  });

  describe('R5: solo owner muta y miembros activos leen', () => {
    it('family recibe 403 en mutaciones y 200 en GET', async () => {
      const owner = await seedUser('r5-owner');
      const family = await seedUser('r5-family');
      const pet = await seedPet(owner);
      await db.insert(petUsers).values({
        petId: pet.id,
        userId: family.id,
        role: 'family',
        status: 'active',
      });
      const id = uuidv7();
      await db.insert(petVaccines).values({
        id,
        petId: pet.id,
        name: 'Manual',
        appliedAt: '2026-01-01',
        createdBy: owner.id,
      });

      await postVaccine(family, pet.id, {
        name: 'Otra',
        appliedAt: '2026-01-01',
      }).expect(403);
      await api()
        .patch(`/v1/pets/${pet.id}/vaccines/${id}`)
        .set(auth(family.token))
        .send({ name: 'Otra' })
        .expect(403);
      await api()
        .delete(`/v1/pets/${pet.id}/vaccines/${id}`)
        .set(auth(family.token))
        .expect(403);
      await api()
        .get(`/v1/pets/${pet.id}/vaccines`)
        .set(auth(family.token))
        .expect(200);
    });
  });

  describe('R6: alta desde catalogo', () => {
    it('copia nombre, calcula meses calendario, persiste actor y responde shape exacto', async () => {
      const owner = await seedUser('r6');
      const pet = await seedPet(owner);
      const rabies = await catalogId('dog', 'Rabia');
      const response = await postVaccine(owner, pet.id, {
        catalogId: rabies,
        appliedAt: '2024-02-29',
      }).expect(201);
      expect(response.body).toMatchObject({
        petId: pet.id,
        catalogId: rabies,
        name: 'Rabia',
        appliedAt: '2024-02-29',
        nextDoseAt: '2025-02-28',
      });
      expect(Object.keys(response.body as object).sort()).toEqual(
        [
          'id',
          'petId',
          'catalogId',
          'name',
          'appliedAt',
          'nextDoseAt',
          'vetName',
          'clinic',
          'notes',
          'documentKey',
        ].sort(),
      );
      const [row] = await db
        .select()
        .from(petVaccines)
        .where(eq(petVaccines.id, (response.body as { id: string }).id));
      expect(row.createdBy).toBe(owner.id);
    });
  });

  describe('R7: override y vacuna libre', () => {
    it('respeta nextDoseAt manual y deja null al omitirlo en vacuna libre', async () => {
      const owner = await seedUser('r7');
      const pet = await seedPet(owner);
      const rabies = await catalogId('dog', 'Rabia');
      const override = await postVaccine(owner, pet.id, {
        catalogId: rabies,
        appliedAt: '2025-01-01',
        nextDoseAt: '2025-06-01',
      }).expect(201);
      expect((override.body as { nextDoseAt: string }).nextDoseAt).toBe(
        '2025-06-01',
      );

      const manual = await postVaccine(owner, pet.id, {
        name: 'Vacuna personalizada',
        appliedAt: '2025-01-01',
      }).expect(201);
      expect(manual.body).toMatchObject({
        catalogId: null,
        name: 'Vacuna personalizada',
        nextDoseAt: null,
      });
    });
  });

  describe('R8: validacion y errores de catalogo', () => {
    it('rechaza XOR, fechas, futuro, texto vacio, desconocidas y catalogos invalidos', async () => {
      const owner = await seedUser('r8');
      const dog = await seedPet(owner, 'dog');
      const catRabies = await catalogId('cat', 'Rabia');
      const invalid = [
        { appliedAt: '2025-01-01' },
        { name: 'X', catalogId: catRabies, appliedAt: '2025-01-01' },
        { name: '', appliedAt: '2025-01-01' },
        { name: 'X', appliedAt: 'not-a-date' },
        { name: 'X', appliedAt: '2999-01-01' },
        { name: 'X', appliedAt: '2025-01-01', extra: true },
      ];
      for (const body of invalid)
        await postVaccine(owner, dog.id, body).expect(400);

      const missing = await postVaccine(owner, dog.id, {
        catalogId: uuidv7(),
        appliedAt: '2025-01-01',
      }).expect(404);
      expect((missing.body as { code: string }).code).toBe(
        'VACCINE_CATALOG_NOT_FOUND',
      );

      const mismatch = await postVaccine(owner, dog.id, {
        catalogId: catRabies,
        appliedAt: '2025-01-01',
      }).expect(400);
      expect((mismatch.body as { code: string }).code).toBe(
        'VACCINE_SPECIES_MISMATCH',
      );
    });

    it('fecha calendario invalida responde 400 sin dejar escapar RangeError', async () => {
      const owner = await seedUser('r8-invalid-date');
      const dog = await seedPet(owner, 'dog');

      await postVaccine(owner, dog.id, {
        name: 'X',
        appliedAt: '2025-13-01',
      }).expect(400);
    });

    it('documentKey en POST es clave desconocida porque upload queda fuera de alcance', async () => {
      const owner = await seedUser('r8-document-key');
      const dog = await seedPet(owner, 'dog');

      await postVaccine(owner, dog.id, {
        name: 'X',
        appliedAt: '2025-01-01',
        documentKey: 'vaccines/not-allowed.pdf',
      }).expect(400);
    });
  });

  describe('R9: historial ordenado', () => {
    it('devuelve [] o appliedAt DESC con id DESC como desempate', async () => {
      const owner = await seedUser('r9');
      const pet = await seedPet(owner);
      const endpoint = `/v1/pets/${pet.id}/vaccines`;
      expect(
        (await api().get(endpoint).set(auth(owner.token)).expect(200)).body,
      ).toEqual([]);

      const ids = [uuidv7(), uuidv7(), uuidv7()];
      await db.insert(petVaccines).values([
        {
          id: ids[0],
          petId: pet.id,
          name: 'A',
          appliedAt: '2025-01-01',
          createdBy: owner.id,
        },
        {
          id: ids[1],
          petId: pet.id,
          name: 'B',
          appliedAt: '2026-01-01',
          createdBy: owner.id,
        },
        {
          id: ids[2],
          petId: pet.id,
          name: 'C',
          appliedAt: '2026-01-01',
          createdBy: owner.id,
        },
      ]);
      const rows = (
        await api().get(endpoint).set(auth(owner.token)).expect(200)
      ).body as Array<{ id: string }>;
      expect(rows.map((row) => row.id)).toEqual([ids[2], ids[1], ids[0]]);
    });
  });

  describe('R10: PATCH parcial aislado por mascota', () => {
    it('actualiza solo campos permitidos; vacio es no-op; id ajeno/invalido es 404', async () => {
      const owner = await seedUser('r10');
      const petA = await seedPet(owner);
      const petB = await seedPet(owner);
      const created = await postVaccine(owner, petA.id, {
        name: 'Inicial',
        appliedAt: '2025-01-01',
        clinic: 'Uno',
      }).expect(201);
      const id = (created.body as { id: string }).id;
      const updated = await api()
        .patch(`/v1/pets/${petA.id}/vaccines/${id}`)
        .set(auth(owner.token))
        .send({ name: 'Final', notes: 'Lista' })
        .expect(200);
      expect(updated.body).toMatchObject({
        name: 'Final',
        clinic: 'Uno',
        notes: 'Lista',
      });
      expect(
        (
          await api()
            .patch(`/v1/pets/${petA.id}/vaccines/${id}`)
            .set(auth(owner.token))
            .send({})
            .expect(200)
        ).body,
      ).toEqual(updated.body);
      await api()
        .patch(`/v1/pets/${petB.id}/vaccines/${id}`)
        .set(auth(owner.token))
        .send({ name: 'Hack' })
        .expect(404);
      await api()
        .patch(`/v1/pets/${petA.id}/vaccines/not-a-uuid`)
        .set(auth(owner.token))
        .send({ name: 'Hack' })
        .expect(404);
      await api()
        .patch(`/v1/pets/${petA.id}/vaccines/${id}`)
        .set(auth(owner.token))
        .send({ catalogId: uuidv7() })
        .expect(400);
    });
  });

  describe('R11: DELETE aislado por mascota', () => {
    it('borra con 204 y responde 404 para id ajeno o invalido', async () => {
      const owner = await seedUser('r11');
      const petA = await seedPet(owner);
      const petB = await seedPet(owner);
      const created = await postVaccine(owner, petA.id, {
        name: 'Eliminar',
        appliedAt: '2025-01-01',
      }).expect(201);
      const id = (created.body as { id: string }).id;
      await api()
        .delete(`/v1/pets/${petB.id}/vaccines/${id}`)
        .set(auth(owner.token))
        .expect(404);
      await api()
        .delete(`/v1/pets/${petA.id}/vaccines/not-a-uuid`)
        .set(auth(owner.token))
        .expect(404);
      await api()
        .delete(`/v1/pets/${petA.id}/vaccines/${id}`)
        .set(auth(owner.token))
        .expect(204);
      expect(
        await db.select().from(petVaccines).where(eq(petVaccines.id, id)),
      ).toEqual([]);
    });
  });

  describe('R12: auditoria de mutaciones', () => {
    it('registra create/update/delete y no audita PATCH vacio', async () => {
      const owner = await seedUser('r12');
      const pet = await seedPet(owner);
      const created = await postVaccine(owner, pet.id, {
        name: 'Auditada',
        appliedAt: '2025-01-01',
      }).expect(201);
      const id = (created.body as { id: string }).id;
      await api()
        .patch(`/v1/pets/${pet.id}/vaccines/${id}`)
        .set(auth(owner.token))
        .send({ name: 'Actualizada', notes: 'ok' })
        .expect(200);
      await api()
        .patch(`/v1/pets/${pet.id}/vaccines/${id}`)
        .set(auth(owner.token))
        .send({})
        .expect(200);
      await api()
        .delete(`/v1/pets/${pet.id}/vaccines/${id}`)
        .set(auth(owner.token))
        .expect(204);
      const rows = await db
        .select()
        .from(auditLog)
        .where(and(eq(auditLog.entity, 'vaccine'), eq(auditLog.entityId, id)));
      expect(rows.map((row) => row.action)).toEqual([
        'vaccine.create',
        'vaccine.update',
        'vaccine.delete',
      ]);
      expect(rows[1].meta).toEqual({
        petId: pet.id,
        fields: ['name', 'notes'],
      });
    });
  });

  describe('R13: nextVaccine en perfil', () => {
    it('elige la menor fecha futura sin cambiar las demas claves', async () => {
      const owner = await seedUser('r13');
      const pet = await seedPet(owner);
      const endpoint = `/v1/pets/${pet.id}`;
      const before = (
        await api().get(endpoint).set(auth(owner.token)).expect(200)
      ).body as Record<string, unknown>;
      const firstId = uuidv7();
      const nextDate = dateOffset(1);
      await db.insert(petVaccines).values([
        {
          id: uuidv7(),
          petId: pet.id,
          name: 'Pasada',
          appliedAt: '2025-01-01',
          nextDoseAt: dateOffset(-1),
          createdBy: owner.id,
        },
        {
          id: uuidv7(),
          petId: pet.id,
          name: 'Lejana',
          appliedAt: '2025-01-01',
          nextDoseAt: dateOffset(2),
          createdBy: owner.id,
        },
        {
          id: firstId,
          petId: pet.id,
          name: 'Proxima',
          appliedAt: '2025-01-01',
          nextDoseAt: nextDate,
          createdBy: owner.id,
        },
      ]);
      const after = (
        await api().get(endpoint).set(auth(owner.token)).expect(200)
      ).body as Record<string, unknown>;
      expect(after.nextVaccine).toEqual({
        id: firstId,
        name: 'Proxima',
        nextDoseAt: nextDate,
      });
      expect({ ...after, nextVaccine: null }).toEqual(before);
    });
  });
});
