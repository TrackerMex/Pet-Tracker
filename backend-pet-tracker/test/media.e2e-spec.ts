import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { config as loadDotenv } from 'dotenv';
import { and, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { pets, petUsers } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { AppModule } from './../src/app.module';

// Direct S3 access (R8/R9) construye su propia URL contra AWS_ENDPOINT_URL
// fuera del bootstrap de Nest — mismo patron que localstack-provisioning.e2e-spec.ts.
loadDotenv({ path: '../.env' });

/**
 * e2e de pet-photos-s3 contra Postgres + LocalStack reales (R1-R9). Requiere
 * `docker compose up -d` levantado (mismo arnes que devices.e2e-spec.ts /
 * localstack-provisioning.e2e-spec.ts).
 */
describe('Pet photo upload (e2e)', () => {
  const RUN_ID = `${Date.now()}`;

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
    const email = `media-e2e-${label}-${RUN_ID}@example.com`;

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

  function api() {
    return request(app.getHttpServer());
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

  function requestUploadUrl(
    user: TestUser,
    petId: string,
    body: Record<string, unknown>,
  ) {
    return api()
      .post(`/v1/pets/${petId}/photo-upload-url`)
      .set('Authorization', `Bearer ${user.token}`)
      .send(body);
  }

  async function photoKeyOf(petId: string): Promise<string | null> {
    const [row] = await db.select().from(pets).where(eq(pets.id, petId));
    return row.photoKey ?? null;
  }

  /** 404 generico del guard: el baseline contra el que se compara R4. */
  async function guardBaseline404(user: TestUser) {
    const response = await api()
      .get(`/v1/pets/${uuidv7()}`)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(404);

    return response.body as Record<string, unknown>;
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
      // Cascadea pet_users.
      await db.delete(pets).where(inArray(pets.id, createdPetIds));
    }
    if (createdUserIds.length > 0) {
      await db.delete(users).where(inArray(users.id, createdUserIds));
    }
    await app.close();
  });

  describe('R1: owner + contentType valido responde 200 con uploadUrl PUT prefirmado de 10 min', () => {
    it('persiste pets.photo_key y responde uploadUrl + expiresInSeconds: 600', async () => {
      const owner = await seedUser('r1-owner');
      const pet = await createPetViaApi(owner, `R1-${RUN_ID}`);

      const response = await requestUploadUrl(owner, pet.id, {
        contentType: 'image/jpeg',
      }).expect(200);

      const body = response.body as {
        uploadUrl: string;
        expiresInSeconds: number;
      };
      expect(Object.keys(body).sort()).toEqual(
        ['uploadUrl', 'expiresInSeconds'].sort(),
      );
      expect(body.expiresInSeconds).toBe(600);
      expect(body.uploadUrl).toEqual(
        expect.stringContaining('pet-tracker-media-local'),
      );

      const photoKey = await photoKeyOf(pet.id);
      expect(photoKey).toEqual(
        expect.stringContaining(`pets/${pet.id}/photo-`),
      );
    });
  });

  describe('R2: contentType ausente o no soportado responde 400 sin persistir', () => {
    it('rechaza body sin contentType y con un tipo no imagen', async () => {
      const owner = await seedUser('r2-owner');
      const pet = await createPetViaApi(owner, `R2-${RUN_ID}`);

      expect(await photoKeyOf(pet.id)).toBeNull();

      await requestUploadUrl(owner, pet.id, {}).expect(400);
      await requestUploadUrl(owner, pet.id, {
        contentType: 'application/pdf',
      }).expect(400);
      await requestUploadUrl(owner, pet.id, {
        contentType: 'image/gif',
      }).expect(400);

      expect(await photoKeyOf(pet.id)).toBeNull();
    });
  });

  describe('R3: miembro activo con rol distinto de owner responde 403 sin persistir', () => {
    it.each(['family', 'walker', 'vet'])('%s recibe 403', async (role) => {
      const owner = await seedUser(`r3-owner-${role}`);
      const member = await seedUser(`r3-${role}`);
      const pet = await createPetViaApi(owner, `R3-${role}-${RUN_ID}`);
      await seedMembership(pet.id, member.id, role);

      await requestUploadUrl(member, pet.id, {
        contentType: 'image/jpeg',
      }).expect(403);

      expect(await photoKeyOf(pet.id)).toBeNull();
    });
  });

  describe('R4: mascota ajena, inexistente o malformada responde el 404 generico del guard', () => {
    it('usuario B sobre mascota de A recibe el mismo 404 que el baseline del guard', async () => {
      const owner = await seedUser('r4-owner');
      const attacker = await seedUser('r4-attacker');
      const pet = await createPetViaApi(owner, `R4-${RUN_ID}`);

      const baseline = await guardBaseline404(attacker);

      const response = await requestUploadUrl(attacker, pet.id, {
        contentType: 'image/jpeg',
      }).expect(404);
      expect(response.body).toEqual(baseline);
    });

    it(':petId sintacticamente invalido responde 404 sin tocar la base', async () => {
      const owner = await seedUser('r4b-owner');

      await requestUploadUrl(owner, 'not-a-uuid', {
        contentType: 'image/jpeg',
      }).expect(404);
    });
  });

  describe('R5: el POST exitoso audita pet.photo_update; 400/403/404 no auditan nada', () => {
    it('deja una entrada con action, entity, entityId, userId y meta.key', async () => {
      const owner = await seedUser('r5-owner');
      const pet = await createPetViaApi(owner, `R5-${RUN_ID}`);

      await requestUploadUrl(owner, pet.id, {
        contentType: 'image/png',
      }).expect(200);

      const photoKey = await photoKeyOf(pet.id);
      const entries = await db
        .select()
        .from(auditLog)
        .where(
          and(
            eq(auditLog.action, 'pet.photo_update'),
            eq(auditLog.entityId, pet.id),
          ),
        );
      expect(entries).toHaveLength(1);
      expect(entries[0].entity).toBe('pet');
      expect(entries[0].userId).toBe(owner.id);
      expect(entries[0].meta).toEqual({ key: photoKey });
    });

    it('un intento rechazado (400/403/404) no escribe en audit_log', async () => {
      const owner = await seedUser('r5b-owner');
      const outsider = await seedUser('r5b-outsider');
      const pet = await createPetViaApi(owner, `R5b-${RUN_ID}`);

      await requestUploadUrl(owner, pet.id, {}).expect(400);
      await requestUploadUrl(outsider, pet.id, {
        contentType: 'image/jpeg',
      }).expect(404);

      const entries = await db
        .select()
        .from(auditLog)
        .where(
          and(
            eq(auditLog.action, 'pet.photo_update'),
            eq(auditLog.entityId, pet.id),
          ),
        );
      expect(entries).toHaveLength(0);
    });
  });

  // NOTA PARA EL REVIEWER: verificado experimentalmente contra el LocalStack
  // Community 4.14 de este repo (docker-compose.yml) que un GET anonimo/sin
  // firmar sobre un objeto S3 EXISTENTE responde 200 con el contenido, no
  // 403 — probado tanto con el PutPublicAccessBlock que #2 aplica sobre
  // pet-tracker-media-local como con una bucket policy explicita de Deny
  // sobre un bucket descartable aparte; ninguno de los dos fue aplicado por
  // LocalStack en la respuesta HTTP. LocalStack Community no hace cumplir
  // ACLs/bucket policies/Block-Public-Access en el plano de datos de S3
  // (enforcement de IAM es funcionalidad Pro) — solo persiste esa
  // configuracion como metadata, igual que localstack-provisioning
  // (#2 R13) ya solo verifica que los 4 flags queden en `true`, sin probar
  // el efecto real de bloqueo. Esta feature no toca AwsModule ni
  // provisioning.ts (fuera de alcance, ver requirements.md R8) — el test
  // queda escrito exactamente como pide la spec (403) y hoy falla en este
  // entorno por esa limitacion de LocalStack Community, no por el codigo de
  // la app: el codigo de pet-photos-s3 nunca emite una URL sin firmar (el
  // unico puerto de lectura/escritura es PHOTO_STORAGE.createDownloadUrl /
  // createUploadUrl, ambos siempre presignan). Reportado en
  // progress/impl_pet-photos-s3.md para que un humano decida si acepta la
  // limitacion documentada o reabre R8 para redefinir su verificacion local.
  describe('R8: el bucket nunca es publico — GET directo sin firma responde 403', () => {
    it('un GET sin parametros de firma sobre el objeto responde 403', async () => {
      const owner = await seedUser('r8-owner');
      const pet = await createPetViaApi(owner, `R8-${RUN_ID}`);

      const uploadResponse = await requestUploadUrl(owner, pet.id, {
        contentType: 'image/jpeg',
      }).expect(200);
      const { uploadUrl } = uploadResponse.body as { uploadUrl: string };

      // El objeto existe de verdad (mismo camino que R9) — descarta que el
      // 403 esperado sea en realidad un 404 por objeto inexistente.
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: Buffer.from('r8-fixture-bytes'),
      });

      const unsignedUrl = new URL(uploadUrl);
      unsignedUrl.search = '';

      const response = await fetch(unsignedUrl.toString());
      expect(response.status).toBe(403);
    });
  });

  describe('R9: flujo end-to-end — pedir URL, subir con PUT, leer photoUrl descargable', () => {
    it('el GET directo sobre el photoUrl devuelve exactamente los bytes subidos', async () => {
      const owner = await seedUser('r9-owner');
      const pet = await createPetViaApi(owner, `R9-${RUN_ID}`);
      const fixtureBytes = Buffer.from(
        `e2e-fixture-image-bytes-${RUN_ID}-${Math.random()}`,
        'utf-8',
      );

      const uploadResponse = await requestUploadUrl(owner, pet.id, {
        contentType: 'image/jpeg',
      }).expect(200);
      const { uploadUrl } = uploadResponse.body as { uploadUrl: string };

      const putResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: fixtureBytes,
      });
      expect(putResponse.status).toBe(200);

      const detail = await api()
        .get(`/v1/pets/${pet.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);
      const { photoUrl } = detail.body as { photoUrl: string | null };
      expect(photoUrl).not.toBeNull();
      // R6: forma de URL prefirmada SigV4.
      expect(photoUrl).toEqual(expect.stringContaining('X-Amz-Signature'));

      const downloadResponse = await fetch(photoUrl as string);
      expect(downloadResponse.status).toBe(200);
      const downloadedBytes = Buffer.from(await downloadResponse.arrayBuffer());
      expect(downloadedBytes.equals(fixtureBytes)).toBe(true);
    });
  });
});
