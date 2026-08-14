import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { backfillWeights } from '../scripts/backfill-weights';
import { DRIZZLE } from '@/db/drizzle.constants';
import { weights } from '@/db/schema/health.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { AppModule } from '../src/app.module';

describe('Weight backfill (e2e)', () => {
  const runId = Date.now();
  let app: INestApplication<App>;
  let db: NodePgDatabase;
  let userIds: string[] = [];
  let petIds: string[] = [];

  async function seedUser(label: string): Promise<string> {
    const id = uuidv7();

    await db.insert(users).values({
      id,
      email: `backfill-${label}-${runId}-${id}@example.com`,
      passwordHash: 'not-used',
      firstName: 'Backfill',
      lastName: label,
      phone: '+525512345678',
      country: 'MX',
      timezone: 'UTC',
      termsAcceptedAt: new Date(),
    });
    userIds.push(id);

    return id;
  }

  async function seedPet(
    ownerId: string | null,
    currentWeightKg: string | null,
  ) {
    const id = uuidv7();
    const createdAt = new Date('2025-03-04T23:45:00.000Z');
    const updatedAt = new Date('2026-07-08T12:30:00.000Z');

    await db.insert(pets).values({
      id,
      name: `Backfill-${id}`,
      species: 'dog',
      birthDate: '2024-01-15',
      currentWeightKg,
      createdAt,
      updatedAt,
    });
    petIds.push(id);

    if (ownerId) {
      await db.insert(petUsers).values({
        petId: id,
        userId: ownerId,
        role: 'owner',
        status: 'active',
      });
    }

    return { id, createdAt, updatedAt };
  }

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    db = app.get<NodePgDatabase>(DRIZZLE);
  });

  afterEach(async () => {
    if (petIds.length) {
      await db.delete(pets).where(inArray(pets.id, petIds));
    }
    if (userIds.length) {
      await db.delete(users).where(inArray(users.id, userIds));
    }
    petIds = [];
    userIds = [];
  });

  afterAll(async () => {
    await app.close();
  });

  describe('R3 (weight-single-source-of-truth #22): crea el historial faltante', () => {
    it('inserta una medicion con el peso, fecha de alta y owner originales', async () => {
      const ownerId = await seedUser('insert');
      const pet = await seedPet(ownerId, '21.35');

      await expect(backfillWeights(db)).resolves.toBe(1);

      const rows = await db
        .select()
        .from(weights)
        .where(eq(weights.petId, pet.id));
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        petId: pet.id,
        weightKg: '21.35',
        bodyCondition: null,
        measuredAt: '2025-03-04',
        createdBy: ownerId,
      });
    });

    it('omite mascotas sin current_weight_kg', async () => {
      const ownerId = await seedUser('null-weight');
      const pet = await seedPet(ownerId, null);

      await expect(backfillWeights(db)).resolves.toBe(0);

      const rows = await db
        .select()
        .from(weights)
        .where(eq(weights.petId, pet.id));
      expect(rows).toHaveLength(0);
    });

    it('no duplica mascotas que ya tienen historial', async () => {
      const ownerId = await seedUser('existing');
      const pet = await seedPet(ownerId, '18.20');
      await db.insert(weights).values({
        id: uuidv7(),
        petId: pet.id,
        weightKg: '18.20',
        bodyCondition: null,
        measuredAt: '2025-03-04',
        createdBy: ownerId,
      });

      await expect(backfillWeights(db)).resolves.toBe(0);

      const rows = await db
        .select()
        .from(weights)
        .where(eq(weights.petId, pet.id));
      expect(rows).toHaveLength(1);
    });

    it('omite mascotas sin owner activo', async () => {
      await seedPet(null, '17.50');

      await expect(backfillWeights(db)).resolves.toBe(0);
    });

    it('la segunda ejecucion no inserta otra fila', async () => {
      const ownerId = await seedUser('idempotent');
      const pet = await seedPet(ownerId, '12.75');

      await expect(backfillWeights(db)).resolves.toBe(1);
      await expect(backfillWeights(db)).resolves.toBe(0);

      const rows = await db
        .select()
        .from(weights)
        .where(eq(weights.petId, pet.id));
      expect(rows).toHaveLength(1);
    });
  });

  describe('R4 (weight-single-source-of-truth #22): conserva la proyeccion', () => {
    it('no modifica current_weight_kg ni updated_at', async () => {
      const ownerId = await seedUser('projection');
      const pet = await seedPet(ownerId, '9.80');

      await backfillWeights(db);

      const [row] = await db.select().from(pets).where(eq(pets.id, pet.id));
      expect(row.currentWeightKg).toBe('9.80');
      expect(row.updatedAt).toEqual(pet.updatedAt);
    });
  });
});
