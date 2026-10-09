import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { and, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { AWS_RESOURCE_NAMES, S3_CLIENT } from '@/aws/aws.constants';
import type { AwsResourceNames } from '@/aws/resource-names';
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
  let s3: S3Client;
  let resourceNames: AwsResourceNames;
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

  interface DocumentListItemResponse extends DocumentResponse {
    downloadUrl: string;
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
      uploadedAt?: Date | null;
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
      uploadedAt:
        values.uploadedAt === undefined ? new Date() : values.uploadedAt,
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

  function confirmDocument(
    user: UserFixture,
    petId: string,
    documentId: string,
  ) {
    return api()
      .post(`/v1/pets/${petId}/media/${documentId}/confirm`)
      .set(auth(user.token));
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
    s3 = app.get<S3Client>(S3_CLIENT);
    resourceNames = app.get<AwsResourceNames>(AWS_RESOURCE_NAMES);
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
        { ...sameDateHigherId, downloadUrl: expect.any(String) as unknown },
        { ...sameDateLowerId, downloadUrl: expect.any(String) as unknown },
        { ...oldest, downloadUrl: expect.any(String) as unknown },
      ]);
      for (const item of response.body as DocumentResponse[]) {
        expect(Object.keys(item).sort()).toEqual(
          ['id', 'type', 'name', 'date', 'vet', 'key', 'downloadUrl'].sort(),
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

    it('responde 201/600s, persiste pendiente antes del PUT, no aparece en GET y audita pet.document_add', async () => {
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
        uploadedAt: null,
      });

      const listed = await listDocuments(owner, pet.id).expect(200);
      expect(listed.body).toEqual([]);

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

  describe('#157 R3: GET oculta los pendientes a los cuatro roles', () => {
    it.each(['owner', 'family', 'walker', 'vet'] as const)(
      '#157 R3: %s solo ve los documentos subidos',
      async (role) => {
        const owner = await seedUser(`157-r3-owner-${role}`);
        const pet = await seedPet(owner);
        const member =
          role === 'owner' ? owner : await seedUser(`157-r3-member-${role}`);
        if (role !== 'owner') await seedMembership(pet.id, member.id, role);
        const uploaded = await seedDocument(pet.id, owner.id, {
          date: '2026-10-08',
        });
        await seedDocument(pet.id, owner.id, {
          date: '2026-10-09',
          uploadedAt: null,
        });

        const listed = await listDocuments(member, pet.id).expect(200);
        expect(
          (listed.body as DocumentResponse[]).map((item) => item.id),
        ).toEqual([uploaded.id]);
      },
    );
  });

  describe('#157 R2: POST deja el documento pendiente', () => {
    it('#157 R2: tras el PUT sin confirmar, la fila sigue con uploaded_at NULL y el GET solo lista los subidos', async () => {
      const owner = await seedUser('157-r2-owner');
      const pet = await seedPet(owner);
      const uploaded = await seedDocument(pet.id, owner.id, {
        date: '2026-10-07',
      });
      const created = await createDocument(owner, pet.id, {
        type: 'Consulta',
        name: 'Pendiente de confirmar',
        date: '2026-10-08',
      }).expect(201);
      const body = created.body as {
        document: DocumentResponse;
        uploadUrl: string;
      };
      const put = await fetch(body.uploadUrl, {
        method: 'PUT',
        body: Buffer.from('pending upload'),
      });
      expect(put.status).toBeGreaterThanOrEqual(200);
      expect(put.status).toBeLessThan(300);
      const [stored] = await db
        .select()
        .from(petDocuments)
        .where(eq(petDocuments.id, body.document.id));
      expect(stored.uploadedAt).toBeNull();
      const listed = await listDocuments(owner, pet.id).expect(200);
      expect(
        (listed.body as DocumentResponse[]).map((item) => item.id),
      ).toEqual([uploaded.id]);
    });
  });

  describe('#157 R5: confirmar marca el documento como subido', () => {
    it('#157 R5: el owner confirma un pendiente subido: 204 sin cuerpo, uploaded_at no nulo y aparece en GET', async () => {
      const owner = await seedUser('157-r5-owner');
      const pet = await seedPet(owner);
      const created = await createDocument(owner, pet.id, {
        type: 'Consulta',
        name: 'Control',
        date: '2026-10-08',
      }).expect(201);
      const body = created.body as {
        document: DocumentResponse;
        uploadUrl: string;
      };
      const put = await fetch(body.uploadUrl, {
        method: 'PUT',
        body: Buffer.from('confirmed document'),
      });
      expect(put.status).toBeGreaterThanOrEqual(200);
      expect(put.status).toBeLessThan(300);

      const confirmed = await confirmDocument(
        owner,
        pet.id,
        body.document.id,
      ).expect(204);
      expect(confirmed.text).toBe('');
      const [stored] = await db
        .select()
        .from(petDocuments)
        .where(eq(petDocuments.id, body.document.id));
      expect(stored.uploadedAt).toBeInstanceOf(Date);
      const listed = await listDocuments(owner, pet.id).expect(200);
      expect(
        (listed.body as DocumentResponse[]).map((item) => item.id),
      ).toEqual([body.document.id]);
    });

    it('#157 R5: un segundo confirm responde 204 y no cambia uploaded_at', async () => {
      const owner = await seedUser('157-r5-idempotent-owner');
      const pet = await seedPet(owner);
      const created = await createDocument(owner, pet.id, {
        type: 'Consulta',
        name: 'Control idempotente',
        date: '2026-10-08',
      }).expect(201);
      const body = created.body as {
        document: DocumentResponse;
        uploadUrl: string;
      };
      const put = await fetch(body.uploadUrl, {
        method: 'PUT',
        body: Buffer.from('idempotent document'),
      });
      expect(put.status).toBeGreaterThanOrEqual(200);
      expect(put.status).toBeLessThan(300);

      await confirmDocument(owner, pet.id, body.document.id).expect(204);
      const [first] = await db
        .select()
        .from(petDocuments)
        .where(eq(petDocuments.id, body.document.id));
      expect(first.uploadedAt).toBeInstanceOf(Date);
      await confirmDocument(owner, pet.id, body.document.id).expect(204);
      const [second] = await db
        .select()
        .from(petDocuments)
        .where(eq(petDocuments.id, body.document.id));
      expect(second.uploadedAt?.getTime()).toBe(first.uploadedAt?.getTime());
    });
  });

  describe('#157 R6: confirmar rechaza sin escribir', () => {
    it('#157 R6 (a): documentId malformado responde 404 PET_DOCUMENT_NOT_FOUND', async () => {
      const owner = await seedUser('157-r6-a-owner');
      const pet = await seedPet(owner);
      const document = await seedDocument(pet.id, owner.id, {
        date: '2026-10-08',
        uploadedAt: null,
      });
      const response = await confirmDocument(
        owner,
        pet.id,
        'not-a-uuid',
      ).expect(404);
      expect(response.body).toEqual({
        statusCode: 404,
        code: 'PET_DOCUMENT_NOT_FOUND',
        message: 'Pet document not found',
      });
      const [stored] = await db
        .select()
        .from(petDocuments)
        .where(eq(petDocuments.id, document.id));
      expect(stored.uploadedAt).toBeNull();
    });

    it('#157 R6 (b): documentId inexistente responde el mismo 404', async () => {
      const owner = await seedUser('157-r6-b-owner');
      const pet = await seedPet(owner);
      const document = await seedDocument(pet.id, owner.id, {
        date: '2026-10-08',
        uploadedAt: null,
      });
      const response = await confirmDocument(owner, pet.id, uuidv7()).expect(
        404,
      );
      expect(response.body).toEqual({
        statusCode: 404,
        code: 'PET_DOCUMENT_NOT_FOUND',
        message: 'Pet document not found',
      });
      const [stored] = await db
        .select()
        .from(petDocuments)
        .where(eq(petDocuments.id, document.id));
      expect(stored.uploadedAt).toBeNull();
    });

    it('#157 R6 (c): documento de otra mascota responde el mismo 404 y no se marca', async () => {
      const owner = await seedUser('157-r6-c-owner');
      const pet = await seedPet(owner);
      const otherPet = await seedPet(owner);
      const created = await createDocument(owner, otherPet.id, {
        type: 'Consulta',
        name: 'Documento ajeno',
        date: '2026-10-08',
      }).expect(201);
      const body = created.body as {
        document: DocumentResponse;
        uploadUrl: string;
      };
      const put = await fetch(body.uploadUrl, {
        method: 'PUT',
        body: Buffer.from('other pet document'),
      });
      expect(put.status).toBeGreaterThanOrEqual(200);
      expect(put.status).toBeLessThan(300);
      const response = await confirmDocument(
        owner,
        pet.id,
        body.document.id,
      ).expect(404);
      expect(response.body).toEqual({
        statusCode: 404,
        code: 'PET_DOCUMENT_NOT_FOUND',
        message: 'Pet document not found',
      });
      const [stored] = await db
        .select()
        .from(petDocuments)
        .where(eq(petDocuments.id, body.document.id));
      expect(stored.uploadedAt).toBeNull();
    });

    it('#157 R6 (d): objeto ausente responde 409 PET_DOCUMENT_NOT_UPLOADED', async () => {
      const owner = await seedUser('157-r6-d-owner');
      const pet = await seedPet(owner);
      const document = await seedDocument(pet.id, owner.id, {
        date: '2026-10-08',
        uploadedAt: null,
      });
      const response = await confirmDocument(owner, pet.id, document.id).expect(
        409,
      );
      expect(response.body).toEqual({
        statusCode: 409,
        code: 'PET_DOCUMENT_NOT_UPLOADED',
        message: 'Pet document file not found in storage',
      });
      const listed = await listDocuments(owner, pet.id).expect(200);
      expect(listed.body).toEqual([]);
      const [stored] = await db
        .select()
        .from(petDocuments)
        .where(eq(petDocuments.id, document.id));
      expect(stored.uploadedAt).toBeNull();
    });

    it.each(['family', 'walker', 'vet'] as const)(
      '#157 R6 (e): %s recibe 403 aunque el objeto exista',
      async (role) => {
        const owner = await seedUser(`157-r6-e-owner-${role}`);
        const member = await seedUser(`157-r6-e-member-${role}`);
        const pet = await seedPet(owner);
        await seedMembership(pet.id, member.id, role);
        const created = await createDocument(owner, pet.id, {
          type: 'Consulta',
          name: 'Documento del owner',
          date: '2026-10-08',
        }).expect(201);
        const body = created.body as {
          document: DocumentResponse;
          uploadUrl: string;
        };
        const put = await fetch(body.uploadUrl, {
          method: 'PUT',
          body: Buffer.from(`document for ${role}`),
        });
        expect(put.status).toBeGreaterThanOrEqual(200);
        expect(put.status).toBeLessThan(300);
        await confirmDocument(member, pet.id, body.document.id).expect(403);
        const [stored] = await db
          .select()
          .from(petDocuments)
          .where(eq(petDocuments.id, body.document.id));
        expect(stored.uploadedAt).toBeNull();
      },
    );

    it('#157 R6 (f): no-miembro, mascota inexistente y :petId malformado reciben el 404 del guard', async () => {
      const owner = await seedUser('157-r6-f-owner');
      const outsider = await seedUser('157-r6-f-outsider');
      const pet = await seedPet(owner);
      const document = await seedDocument(pet.id, owner.id, {
        date: '2026-10-08',
        uploadedAt: null,
      });
      for (const [user, petId] of [
        [outsider, pet.id],
        [owner, uuidv7()],
        [owner, 'not-a-uuid'],
      ] as const) {
        const response = await confirmDocument(user, petId, document.id).expect(
          404,
        );
        expect(response.body).toEqual({
          statusCode: 404,
          message: 'Not Found',
        });
      }
      const [stored] = await db
        .select()
        .from(petDocuments)
        .where(eq(petDocuments.id, document.id));
      expect(stored.uploadedAt).toBeNull();
    });
  });

  describe('#157 R4: cada documento listado trae downloadUrl de 3600 s', () => {
    it.each(['owner', 'family', 'walker', 'vet'] as const)(
      '#157 R4: %s recibe downloadUrl prefirmada sobre la key',
      async (role) => {
        const owner = await seedUser(`157-r4-owner-${role}`);
        const pet = await seedPet(owner);
        const member =
          role === 'owner' ? owner : await seedUser(`157-r4-member-${role}`);
        if (role !== 'owner') await seedMembership(pet.id, member.id, role);
        const document = await seedDocument(pet.id, owner.id, {
          date: '2026-10-08',
        });

        const listed = await listDocuments(member, pet.id).expect(200);
        const items = listed.body as DocumentListItemResponse[];
        expect(items).toHaveLength(1);
        const item = items[0];
        expect(item.id).toBe(document.id);
        expect(Object.keys(item).sort()).toEqual(
          ['id', 'type', 'name', 'date', 'vet', 'key', 'downloadUrl'].sort(),
        );
        expect(item.downloadUrl).toMatch(/^https?:\/\//);
        const url = new URL(item.downloadUrl);
        expect(url.searchParams.get('X-Amz-Expires')).toBe('3600');
        expect(url.searchParams.has('X-Amz-Signature')).toBe(true);
        expect(url.pathname.endsWith(`/${item.key}`)).toBe(true);
      },
    );
  });

  describe('#157 R8: flujo POST → PUT → confirm → GET → descarga contra LocalStack', () => {
    it.each(['application/pdf', 'image/jpeg'])(
      '#157 R8: %s se sube, se confirma y se descarga con sus bytes y su content-type',
      async (type) => {
        const owner = await seedUser(`157-r8-owner-${type.replace('/', '-')}`);
        const pet = await seedPet(owner);
        const bytes = Buffer.from(`document-${type}-${runId}`);
        const created = await createDocument(owner, pet.id, {
          type: 'Consulta',
          name: 'Documento descargable',
          date: '2026-10-08',
        }).expect(201);
        const body = created.body as {
          document: DocumentResponse;
          uploadUrl: string;
        };
        const put = await fetch(body.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': type },
          body: bytes,
        });
        expect(put.status).toBeGreaterThanOrEqual(200);
        expect(put.status).toBeLessThan(300);
        const pending = await listDocuments(owner, pet.id).expect(200);
        expect(pending.body).toEqual([]);

        await confirmDocument(owner, pet.id, body.document.id).expect(204);
        const listed = await listDocuments(owner, pet.id).expect(200);
        const items = listed.body as DocumentListItemResponse[];
        expect(items).toHaveLength(1);
        const item = items[0];
        expect(item.id).toBe(body.document.id);
        expect(item.downloadUrl).toMatch(/^https?:\/\//);
        const download = await fetch(item.downloadUrl);
        expect(download.status).toBe(200);
        expect(Buffer.from(await download.arrayBuffer())).toEqual(bytes);
        expect(download.headers.get('content-type')).toBe(type);
      },
    );
  });

  describe('R3: flujo end-to-end POST → PUT → GET contra LocalStack', () => {
    it('sube bytes sin Authorization, conserva el documento y permite leer el objeto por key', async () => {
      const owner = await seedUser('r3-owner');
      const pet = await seedPet(owner);
      const fixtureBytes = Buffer.from(
        `media-document-e2e-${runId}-${Math.random()}`,
        'utf-8',
      );

      const created = await createDocument(owner, pet.id, {
        type: 'Laboratorio',
        name: 'Resultados sanguíneos',
        date: '2026-08-25',
      }).expect(201);
      const createdBody = created.body as {
        document: DocumentResponse;
        uploadUrl: string;
      };

      const putResponse = await fetch(createdBody.uploadUrl, {
        method: 'PUT',
        body: fixtureBytes,
      });
      expect(putResponse.status).toBeGreaterThanOrEqual(200);
      expect(putResponse.status).toBeLessThan(300);

      await confirmDocument(owner, pet.id, createdBody.document.id).expect(204);

      const listed = await listDocuments(owner, pet.id).expect(200);
      expect(listed.body).toEqual([
        { ...createdBody.document, downloadUrl: expect.any(String) as unknown },
      ]);

      const storedObject = await s3.send(
        new GetObjectCommand({
          Bucket: resourceNames.mediaBucket,
          Key: createdBody.document.key,
        }),
      );
      const storedBytes = Buffer.from(
        (await storedObject.Body?.transformToByteArray()) ?? [],
      );
      expect(storedBytes.equals(fixtureBytes)).toBe(true);
    });
  });

  describe('#161 R2: confirm contra LocalStack en la frontera de 10485760 bytes', () => {
    it('#161 R2 (a): un fichero de 10485760 bytes se confirma y aparece en GET', async () => {
      const owner = await seedUser('161-r2-a-owner');
      const pet = await seedPet(owner);
      const created = await createDocument(owner, pet.id, {
        type: 'Consulta',
        name: 'Control',
        date: '2026-10-08',
      }).expect(201);
      const body = created.body as {
        document: DocumentResponse;
        uploadUrl: string;
      };
      const put = await fetch(body.uploadUrl, {
        method: 'PUT',
        body: Buffer.alloc(10485760, 0x61),
      });
      expect(put.status).toBeGreaterThanOrEqual(200);
      expect(put.status).toBeLessThan(300);
      const head = await s3.send(
        new HeadObjectCommand({
          Bucket: resourceNames.mediaBucket,
          Key: body.document.key,
        }),
      );
      expect(head.ContentLength).toBe(10485760);

      const confirmed = await confirmDocument(
        owner,
        pet.id,
        body.document.id,
      ).expect(204);
      expect(confirmed.text).toBe('');
      const [stored] = await db
        .select()
        .from(petDocuments)
        .where(eq(petDocuments.id, body.document.id));
      expect(stored.uploadedAt).toBeInstanceOf(Date);
      const listed = await listDocuments(owner, pet.id).expect(200);
      expect((listed.body as DocumentResponse[]).map((d) => d.id)).toEqual([
        body.document.id,
      ]);
    }, 30000);

    it('#161 R2 (b): un fichero de 10485761 bytes responde 409 PET_DOCUMENT_TOO_LARGE y no se borra', async () => {
      const owner = await seedUser('161-r2-b-owner');
      const pet = await seedPet(owner);
      const created = await createDocument(owner, pet.id, {
        type: 'Consulta',
        name: 'Control',
        date: '2026-10-08',
      }).expect(201);
      const body = created.body as {
        document: DocumentResponse;
        uploadUrl: string;
      };
      const put = await fetch(body.uploadUrl, {
        method: 'PUT',
        body: Buffer.alloc(10485761, 0x61),
      });
      expect(put.status).toBeGreaterThanOrEqual(200);
      expect(put.status).toBeLessThan(300);
      const head = await s3.send(
        new HeadObjectCommand({
          Bucket: resourceNames.mediaBucket,
          Key: body.document.key,
        }),
      );
      expect(head.ContentLength).toBe(10485761);

      const confirmed = await confirmDocument(
        owner,
        pet.id,
        body.document.id,
      ).expect(409);
      expect(confirmed.body).toEqual({
        statusCode: 409,
        code: 'PET_DOCUMENT_TOO_LARGE',
        message: 'Pet document file exceeds the size limit',
      });
      const listed = await listDocuments(owner, pet.id).expect(200);
      expect((listed.body as DocumentResponse[]).map((d) => d.id)).toEqual([]);
      const [stored] = await db
        .select()
        .from(petDocuments)
        .where(eq(petDocuments.id, body.document.id));
      expect(stored.uploadedAt).toBeNull();
      const retained = await s3.send(
        new HeadObjectCommand({
          Bucket: resourceNames.mediaBucket,
          Key: body.document.key,
        }),
      );
      expect(retained.ContentLength).toBe(10485761);
    }, 30000);
  });
});
