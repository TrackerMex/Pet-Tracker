import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { petDocuments } from '@/db/schema/media.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { AppModule } from '../src/app.module';

describe('Pet documents API (e2e)', () => {
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

  interface DocumentResponse {
    id: string;
    type: string;
    name: string;
    date: string;
    vet: string | null;
    key: string;
  }

  const api = () => request(app.getHttpServer());
  const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

  async function seedUser(label: string): Promise<UserFixture> {
    const id = uuidv7();
    const email = `media-docs-${label}-${runId}@example.com`;
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
    const id = uuidv7();
    await db.insert(pets).values({
      id,
      name: `Media docs ${id}`,
      species: 'dog',
      birthDate: '2024-01-15',
    });
    await seedMembership(id, owner.id, 'owner');
    petIds.push(id);
    return { id };
  }

  function seedMembership(
    petId: string,
    userId: string,
    role: 'owner' | 'family' | 'walker' | 'vet',
  ) {
    return db
      .insert(petUsers)
      .values({ petId, userId, role, status: 'active' });
  }

  async function seedDocument(
    petId: string,
    createdBy: string,
    values: {
      id?: string;
      type?: string;
      name?: string;
      date: string;
      vet?: string | null;
    },
  ): Promise<DocumentResponse> {
    const id = values.id ?? uuidv7();
    const document = {
      id,
      petId,
      type: values.type ?? 'Vacunación',
      name: values.name ?? `Documento ${id}`,
      date: values.date,
      vet: values.vet ?? null,
      key: `pets/${petId}/docs/${id}`,
      createdBy,
    };
    await db.insert(petDocuments).values(document);
    return {
      id: document.id,
      type: document.type,
      name: document.name,
      date: document.date,
      vet: document.vet,
      key: document.key,
    };
  }

  function listDocuments(user: UserFixture, petId: string) {
    return api().get(`/v1/pets/${petId}/media`).set(auth(user.token));
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();
    db = app.get<NodePgDatabase>(DRIZZLE);
    tokens = app.get<TokenService>(TOKEN_SERVICE);
  });

  afterAll(async () => {
    if (userIds.length > 0) {
      await db.delete(auditLog).where(inArray(auditLog.userId, userIds));
    }
    if (petIds.length > 0) {
      await db.delete(pets).where(inArray(pets.id, petIds));
    }
    if (userIds.length > 0) {
      await db.delete(users).where(inArray(users.id, userIds));
    }
    await app.close();
  });

  describe('R1: GET lista documentos con el contrato móvil y orden date/id descendente', () => {
    it('responde un array plano con shape exacto, solo la mascota solicitada y orden determinista', async () => {
      const owner = await seedUser('r1-order-owner');
      const pet = await seedPet(owner);
      const otherPet = await seedPet(owner);
      const oldest = await seedDocument(pet.id, owner.id, {
        id: '0198b2c3-4d5e-7a01-b234-56789abcde01',
        type: 'Consulta',
        name: 'Consulta inicial',
        date: '2026-07-12',
      });
      const sameDateLowerId = await seedDocument(pet.id, owner.id, {
        id: '0198b2c3-4d5e-7a01-b234-56789abcde02',
        name: 'Vacuna A',
        date: '2026-08-25',
        vet: 'Dra. Rivera',
      });
      const sameDateHigherId = await seedDocument(pet.id, owner.id, {
        id: '0198b2c3-4d5e-7a01-b234-56789abcde03',
        name: 'Vacuna B',
        date: '2026-08-25',
      });
      await seedDocument(otherPet.id, owner.id, {
        date: '2026-12-31',
        name: 'No pertenece al pet solicitado',
      });

      const response = await listDocuments(owner, pet.id).expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual([
        sameDateHigherId,
        sameDateLowerId,
        oldest,
      ]);
      for (const item of response.body as DocumentResponse[]) {
        expect(Object.keys(item).sort()).toEqual(
          ['id', 'type', 'name', 'date', 'vet', 'key'].sort(),
        );
        expect(typeof item.id).toBe('string');
        expect(typeof item.type).toBe('string');
        expect(typeof item.name).toBe('string');
        expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it('responde [] cuando la mascota no tiene documentos', async () => {
      const owner = await seedUser('r1-empty-owner');
      const pet = await seedPet(owner);

      const response = await listDocuments(owner, pet.id).expect(200);

      expect(response.body).toEqual([]);
    });

    it('permite GET a caregiver (family) y viewer (vet)', async () => {
      const owner = await seedUser('r1-roles-owner');
      const caregiver = await seedUser('r1-caregiver');
      const viewer = await seedUser('r1-viewer');
      const pet = await seedPet(owner);
      const document = await seedDocument(pet.id, owner.id, {
        date: '2026-08-25',
      });
      await seedMembership(pet.id, caregiver.id, 'family');
      await seedMembership(pet.id, viewer.id, 'vet');

      await expect(
        listDocuments(caregiver, pet.id).expect(200),
      ).resolves.toMatchObject({
        body: [document],
      });
      await expect(
        listDocuments(viewer, pet.id).expect(200),
      ).resolves.toMatchObject({
        body: [document],
      });
    });

    it('responde 404 a no-miembro, mascota inexistente y :petId malformado', async () => {
      const owner = await seedUser('r1-hidden-owner');
      const outsider = await seedUser('r1-hidden-outsider');
      const pet = await seedPet(owner);

      await listDocuments(outsider, pet.id).expect(404);
      await listDocuments(owner, uuidv7()).expect(404);
      await listDocuments(owner, 'not-a-uuid').expect(404);
    });
  });
});
