import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { and, eq, inArray } from 'drizzle-orm';
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

  function createDocument(
    user: UserFixture,
    petId: string,
    body: Record<string, unknown>,
  ) {
    return api()
      .post(`/v1/pets/${petId}/media`)
      .set(auth(user.token))
      .send(body);
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

  describe('R2: POST owner emite URL, persiste y audita; rechazos no escriben', () => {
    const validBody = () => ({
      type: 'Radiografía',
      name: 'Estudio de cadera',
      date: '2026-08-25',
      vet: 'Dr. López',
    });

    it('responde 201/600s, persiste antes del PUT, aparece en GET y audita pet.document_add', async () => {
      const owner = await seedUser('r2-owner');
      const pet = await seedPet(owner);

      const response = await createDocument(owner, pet.id, validBody()).expect(
        201,
      );
      const body = response.body as {
        document: DocumentResponse;
        uploadUrl: string;
        expiresInSeconds: number;
      };

      expect(Object.keys(body).sort()).toEqual(
        ['document', 'uploadUrl', 'expiresInSeconds'].sort(),
      );
      expect(Object.keys(body.document).sort()).toEqual(
        ['id', 'type', 'name', 'date', 'vet', 'key'].sort(),
      );
      expect(typeof body.document.id).toBe('string');
      expect(body.document).toEqual({
        id: body.document.id,
        ...validBody(),
        key: `pets/${pet.id}/docs/${body.document.id}`,
      });
      expect(body.uploadUrl).toEqual(
        expect.stringContaining('X-Amz-Signature'),
      );
      expect(body.expiresInSeconds).toBe(600);

      const [stored] = await db
        .select()
        .from(petDocuments)
        .where(eq(petDocuments.id, body.document.id));
      expect(stored).toMatchObject({
        ...body.document,
        petId: pet.id,
        createdBy: owner.id,
      });

      const listed = await listDocuments(owner, pet.id).expect(200);
      expect(listed.body).toEqual([body.document]);

      const entries = await db
        .select()
        .from(auditLog)
        .where(
          and(
            eq(auditLog.action, 'pet.document_add'),
            eq(auditLog.entityId, pet.id),
          ),
        );
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        userId: owner.id,
        action: 'pet.document_add',
        entity: 'pet',
        entityId: pet.id,
        meta: { key: body.document.key },
      });
    });

    it('responde 400 para body inválido sin fila ni auditoría', async () => {
      const owner = await seedUser('r2-invalid-owner');
      const pet = await seedPet(owner);

      await createDocument(owner, pet.id, {}).expect(400);
      await createDocument(owner, pet.id, {
        ...validBody(),
        type: '   ',
      }).expect(400);
      await createDocument(owner, pet.id, {
        ...validBody(),
        date: '2026-02-30',
      }).expect(400);

      expect(
        await db
          .select()
          .from(petDocuments)
          .where(eq(petDocuments.petId, pet.id)),
      ).toEqual([]);
      expect(
        await db
          .select()
          .from(auditLog)
          .where(
            and(
              eq(auditLog.action, 'pet.document_add'),
              eq(auditLog.entityId, pet.id),
            ),
          ),
      ).toEqual([]);
    });

    it('responde 403 a caregiver (family) y viewer (vet) sin persistir', async () => {
      const owner = await seedUser('r2-roles-owner');
      const caregiver = await seedUser('r2-caregiver');
      const viewer = await seedUser('r2-viewer');
      const pet = await seedPet(owner);
      await seedMembership(pet.id, caregiver.id, 'family');
      await seedMembership(pet.id, viewer.id, 'vet');

      await createDocument(caregiver, pet.id, validBody()).expect(403);
      await createDocument(viewer, pet.id, validBody()).expect(403);

      expect(
        await db
          .select()
          .from(petDocuments)
          .where(eq(petDocuments.petId, pet.id)),
      ).toEqual([]);
    });

    it('responde 404 a no-miembro sin persistir ni auditar', async () => {
      const owner = await seedUser('r2-hidden-owner');
      const outsider = await seedUser('r2-hidden-outsider');
      const pet = await seedPet(owner);

      await createDocument(outsider, pet.id, validBody()).expect(404);

      expect(
        await db
          .select()
          .from(petDocuments)
          .where(eq(petDocuments.petId, pet.id)),
      ).toEqual([]);
      expect(
        await db
          .select()
          .from(auditLog)
          .where(
            and(
              eq(auditLog.action, 'pet.document_add'),
              eq(auditLog.entityId, pet.id),
            ),
          ),
      ).toEqual([]);
    });
  });
});
