import {
  GetBucketPolicyCommand,
  GetPublicAccessBlockCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { config as loadDotenv } from 'dotenv';
import { and, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { S3_CLIENT } from '@/aws/aws.constants';
import { BUCKET_MEDIA } from '@/aws/constants';
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

interface PolicyStatement {
  Effect?: string;
  Principal?: unknown;
}

/**
 * R8: un statement concede acceso publico si es `Allow` sobre el principal
 * anonimo, en cualquiera de sus tres formas — `"*"`, `{"AWS": "*"}` y
 * `{"AWS": ["*"]}`. Se buscan como el token `"*"` ya serializado, asi que un
 * ARN con comodin interno (`arn:aws:iam::*:root`) no cuenta como publico.
 */
function grantsPublicAccess(statement: PolicyStatement): boolean {
  return (
    statement.Effect === 'Allow' &&
    JSON.stringify(statement.Principal ?? null).includes('"*"')
  );
}

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
      expect(body.uploadUrl).toEqual(expect.stringContaining(BUCKET_MEDIA));

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

  // POR QUE ESTE TEST NO HACE UN GET ANONIMO:
  //
  // La forma obvia de verificar "el bucket nunca es publico" seria un GET sin
  // firma sobre el objeto esperando 403. Contra LocalStack esa asercion no
  // vale: LocalStack Community NO aplica PublicAccessBlock, ACLs ni bucket
  // policies en el plano de datos de S3 — el enforcement de IAM es
  // funcionalidad Pro. Solo persiste esa configuracion como metadata y sirve
  // el objeto igual. Verificado experimentalmente contra el LocalStack 4.14
  // de docker-compose.yml: con los 4 flags en `true` (y tambien con una
  // bucket policy Deny explicita sobre un bucket descartable), un GET anonimo
  // sobre un objeto existente responde 200 con el contenido. Contra AWS real,
  // esa misma configuracion hace que ese GET responda 403.
  //
  // O sea: el GET anonimo mide el emulador, no el codigo. Aqui se verifica lo
  // que el codigo si controla y LocalStack si modela — y que es exactamente lo
  // que produce el 403 en AWS real: los 4 flags de PublicAccessBlock en `true`
  // y la ausencia de una bucket policy que conceda acceso publico. Sigue
  // siendo e2e contra LocalStack real (cliente S3 del contenedor Nest), no un
  // unit test con mocks.
  //
  // Queda pendiente de verificar contra un despliegue AWS real que ese GET sin
  // firma responde 403 de verdad. Ver specs/pet-photos-s3/requirements.md R8 y
  // docs/architecture.md §Adaptacion local.
  describe('R8: el bucket nunca es publico — PublicAccessBlock en los 4 flags y sin bucket policy publica', () => {
    function s3Client() {
      return app.get<S3Client>(S3_CLIENT);
    }

    it('GetPublicAccessBlock devuelve los 4 flags de bloqueo en true', async () => {
      const { PublicAccessBlockConfiguration } = await s3Client().send(
        new GetPublicAccessBlockCommand({ Bucket: BUCKET_MEDIA }),
      );

      expect(PublicAccessBlockConfiguration).toEqual(
        expect.objectContaining({
          BlockPublicAcls: true,
          IgnorePublicAcls: true,
          BlockPublicPolicy: true,
          RestrictPublicBuckets: true,
        }),
      );
    });

    it('no existe una bucket policy que conceda acceso publico', async () => {
      const policy = await s3Client()
        .send(new GetBucketPolicyCommand({ Bucket: BUCKET_MEDIA }))
        .then((response) => response.Policy ?? null)
        .catch((error: { name?: string }) => {
          // provisionMediaBucket no crea ninguna policy: "no hay policy" es el
          // estado esperado. Cualquier otro error si debe romper el test.
          if (error.name === 'NoSuchBucketPolicy') {
            return null;
          }
          throw error;
        });

      const statements =
        policy === null
          ? []
          : ((JSON.parse(policy) as { Statement?: PolicyStatement[] })
              .Statement ?? []);

      expect(statements.filter(grantsPublicAccess)).toEqual([]);
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
