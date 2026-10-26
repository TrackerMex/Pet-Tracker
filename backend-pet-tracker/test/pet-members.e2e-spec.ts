import { PUSH_TOKEN_REPOSITORY } from '@/modules/users/domain/repositories/push-token.repository';
import type { PushTokenRepository } from '@/modules/users/domain/repositories/push-token.repository';
import { createHash, randomInt, randomUUID } from 'node:crypto';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { and, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import request, { Response } from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog, petInvites, pets, petUsers, users } from '@/db/schema';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { AppModule } from '@/app.module';

interface InviteBody {
  id: string;
  code: string;
  role: string;
  createdAt: string;
  expiresAt: string;
}

interface PetProfileBody {
  id: string;
  myRole: string;
}
function profileBody(response: Response): PetProfileBody {
  return response.body as PetProfileBody;
}

describe('#211 R16: pet members API', () => {
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

  async function seedUser(label: string, timezone = 'UTC'): Promise<TestUser> {
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
      timezone,
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

  let sequence = 0;
  async function fixture() {
    const label = `${++sequence}`;
    const owner = await seedUser(`owner-${label}`);
    const pet = await createPetViaApi(owner);
    return { owner, pet, label };
  }
  const routes = [
    ['post', '/v1/pets/:petId/invites'],
    ['get', '/v1/pets/:petId/invites'],
    ['delete', '/v1/pets/:petId/invites/:inviteId'],
    ['get', '/v1/pets/:petId/members'],
    ['delete', '/v1/pets/:petId/members/:userId'],
  ] as const;
  function route(path: string, petId: string) {
    return path
      .replace(':petId', petId)
      .replace(':inviteId', randomUUID())
      .replace(':userId', randomUUID());
  }
  it.each(routes)(
    '#211 R16: un no miembro recibe 404 en %s %s',
    async (method, path) => {
      const { pet, label } = await fixture();
      const stranger = await seedUser(`stranger-${label}`);
      const response = await api()
        [method](route(path, pet.id))
        .set('Authorization', `Bearer ${stranger.token}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' });
    },
  );
  it.each(routes)(
    '#211 R16: un petId inexistente da el mismo 404 en %s %s',
    async (method, path) => {
      const { owner } = await fixture();
      const response = await api()
        [method](route(path, randomUUID()))
        .set('Authorization', `Bearer ${owner.token}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' });
    },
  );
  it.each(routes)(
    '#211 R16: un petId que no es UUID da el mismo 404 en %s %s',
    async (method, path) => {
      const { owner } = await fixture();
      const response = await api()
        [method](route(path, 'not-a-uuid'))
        .set('Authorization', `Bearer ${owner.token}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' });
    },
  );
  it.each(routes.slice(0, 3))(
    '#211 R17: un family recibe 403 en %s %s',
    async (method, path) => {
      const { pet, label } = await fixture();
      const family = await seedUser(`family-${label}`);
      await seedMembership(pet.id, family.id, 'family');
      const response = await api()
        [method](route(path, pet.id))
        .set('Authorization', `Bearer ${family.token}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({ statusCode: 403, message: 'Forbidden' });
      expect(
        await db.select().from(petInvites).where(eq(petInvites.petId, pet.id)),
      ).toEqual([]);
    },
  );
  it.each([...routes, ['post', '/v1/invites/accept'] as const])(
    '#211 R18: sin token responde 401 en %s %s',
    async (method, path) => {
      const response = await api()[method](route(path, randomUUID()));
      expect(response.status).toBe(401);
    },
  );
  async function createInviteViaApi(
    owner: TestUser,
    petId: string,
  ): Promise<InviteBody> {
    const response = await api()
      .post(`/v1/pets/${petId}/invites`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ role: 'owner' })
      .expect(201);
    return response.body as InviteBody;
  }
  it('#211 R3: crea la invitación, devuelve el código una vez y guarda solo su hash', async () => {
    const { owner, pet } = await fixture();
    const body = await createInviteViaApi(owner, pet.id);
    expect(Object.keys(body).sort()).toEqual([
      'code',
      'createdAt',
      'expiresAt',
      'id',
      'role',
    ]);
    expect(body.role).toBe('family');
    expect(body.code).toMatch(/^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{10}$/);
    expect(
      new Date(body.expiresAt).getTime() - new Date(body.createdAt).getTime(),
    ).toBe(259200000);
    const [row] = await db
      .select()
      .from(petInvites)
      .where(eq(petInvites.id, body.id));
    expect(row.codeHash).toBe(
      createHash('sha256').update(body.code).digest('hex'),
    );
    expect(row.createdBy).toBe(owner.id);
    expect(row.createdAt.toISOString()).toBe(body.createdAt);
    expect(row.expiresAt.toISOString()).toBe(body.expiresAt);
    expect(Object.values(row).map(String)).not.toContain(body.code);
  });
  const invitesLimitBody = {
    statusCode: 409,
    code: 'PET_INVITES_LIMIT',
    message: 'Too many pending invites for this pet',
  };
  const membersLimitBody = {
    statusCode: 409,
    code: 'PET_MEMBERS_LIMIT',
    message: 'Pet member limit reached',
  };
  async function pendingFive(owner: TestUser, petId: string) {
    const invites: InviteBody[] = [];
    for (let i = 0; i < 5; i++)
      invites.push(await createInviteViaApi(owner, petId));
    return invites;
  }
  function requestInvite(owner: TestUser, petId: string) {
    return api()
      .post(`/v1/pets/${petId}/invites`)
      .set('Authorization', `Bearer ${owner.token}`);
  }
  it('#211 R4: la sexta pendiente responde PET_INVITES_LIMIT y no crea fila', async () => {
    const { owner, pet } = await fixture();
    await pendingFive(owner, pet.id);
    const response = await requestInvite(owner, pet.id);
    expect(response.status).toBe(409);
    expect(response.body).toEqual(invitesLimitBody);
    expect(
      await db.select().from(petInvites).where(eq(petInvites.petId, pet.id)),
    ).toHaveLength(5);
  });
  it('#211 R4: una invitación revocada libera su plaza', async () => {
    const { owner, pet } = await fixture();
    const invites = await pendingFive(owner, pet.id);
    const before = await requestInvite(owner, pet.id);
    expect(before.status).toBe(409);
    expect(before.body).toEqual(invitesLimitBody);
    await db
      .update(petInvites)
      .set({ revokedAt: new Date() })
      .where(eq(petInvites.id, invites[0].id));
    await requestInvite(owner, pet.id).expect(201);
  });
  it('#211 R4: una invitación expirada libera su plaza', async () => {
    const { owner, pet } = await fixture();
    const invites = await pendingFive(owner, pet.id);
    const before = await requestInvite(owner, pet.id);
    expect(before.status).toBe(409);
    expect(before.body).toEqual(invitesLimitBody);
    await db
      .update(petInvites)
      .set({ expiresAt: new Date(Date.now() - 60000) })
      .where(eq(petInvites.id, invites[0].id));
    await requestInvite(owner, pet.id).expect(201);
  });
  it('#211 R4: con 9 miembros activos se crea una y la siguiente responde PET_MEMBERS_LIMIT', async () => {
    const { owner, pet, label } = await fixture();
    for (let i = 0; i < 8; i++) {
      const member = await seedUser(`limit-${label}-${i}`);
      await seedMembership(pet.id, member.id, 'family');
    }
    await requestInvite(owner, pet.id).expect(201);
    const response = await requestInvite(owner, pet.id);
    expect(response.status).toBe(409);
    expect(response.body).toEqual(membersLimitBody);
    expect(
      await db.select().from(petInvites).where(eq(petInvites.petId, pet.id)),
    ).toHaveLength(1);
  });
  it('#211 R4: con ambos límites alcanzados gana PET_INVITES_LIMIT', async () => {
    const { owner, pet, label } = await fixture();
    for (let i = 0; i < 4; i++) {
      const member = await seedUser(`both-${label}-${i}`);
      await seedMembership(pet.id, member.id, 'family');
    }
    await pendingFive(owner, pet.id);
    const response = await requestInvite(owner, pet.id);
    expect(response.status).toBe(409);
    expect(response.body).toEqual(invitesLimitBody);
    expect(
      await db.select().from(petInvites).where(eq(petInvites.petId, pet.id)),
    ).toHaveLength(5);
  });
  it('#211 R5: lista solo las pendientes, de la más nueva a la más vieja, sin código', async () => {
    const { owner, pet, label } = await fixture();
    const invites = await pendingFive(owner, pet.id);
    const accepter = await seedUser(`list-${label}`);
    await db
      .update(petInvites)
      .set({ acceptedBy: accepter.id, acceptedAt: new Date() })
      .where(eq(petInvites.id, invites[1].id));
    await db
      .update(petInvites)
      .set({ revokedAt: new Date() })
      .where(eq(petInvites.id, invites[2].id));
    await db
      .update(petInvites)
      .set({ expiresAt: new Date(Date.now() - 60000) })
      .where(eq(petInvites.id, invites[3].id));
    const response = await api()
      .get(`/v1/pets/${pet.id}/invites`)
      .set('Authorization', `Bearer ${owner.token}`)
      .expect(200);
    const body = response.body as Omit<InviteBody, 'code'>[];
    expect(body.map((invite) => invite.id)).toEqual([
      invites[4].id,
      invites[0].id,
    ]);
    for (const invite of body)
      expect(Object.keys(invite).sort()).toEqual([
        'createdAt',
        'expiresAt',
        'id',
        'role',
      ]);
    for (const invite of invites)
      expect(JSON.stringify(body)).not.toContain(invite.code);
    expect(JSON.stringify(body)).not.toContain('codeHash');
    expect(JSON.stringify(body)).not.toContain('code_hash');
  });
  it('#211 R6: revocar responde 204 y fija revoked_at', async () => {
    const { owner, pet } = await fixture();
    const invite = await createInviteViaApi(owner, pet.id);
    const response = await api()
      .delete(`/v1/pets/${pet.id}/invites/${invite.id}`)
      .set('Authorization', `Bearer ${owner.token}`)
      .expect(204);
    expect(response.text).toBe('');
    const [row] = await db
      .select()
      .from(petInvites)
      .where(eq(petInvites.id, invite.id));
    expect(row.revokedAt).toBeInstanceOf(Date);
  });
  it.each([
    'no es UUID',
    'no existe',
    'es de otra mascota',
    'está aceptada',
    'está revocada',
    'está expirada',
  ])('#211 R6: responde el mismo 404 si la invitación %s', async (state) => {
    const { owner, pet, label } = await fixture();
    let invite = await createInviteViaApi(owner, pet.id);
    let targetId = invite.id;
    if (state === 'no es UUID') targetId = 'not-a-uuid';
    if (state === 'no existe') targetId = randomUUID();
    if (state === 'es de otra mascota') {
      const other = await createPetViaApi(owner);
      invite = await createInviteViaApi(owner, other.id);
      targetId = invite.id;
    }
    if (state === 'está aceptada') {
      const user = await seedUser(`revoked-accepted-${label}`);
      await db
        .update(petInvites)
        .set({ acceptedBy: user.id, acceptedAt: new Date() })
        .where(eq(petInvites.id, invite.id));
    }
    if (state === 'está revocada')
      await db
        .update(petInvites)
        .set({ revokedAt: new Date() })
        .where(eq(petInvites.id, invite.id));
    if (state === 'está expirada')
      await db
        .update(petInvites)
        .set({ expiresAt: new Date(Date.now() - 60000) })
        .where(eq(petInvites.id, invite.id));
    const before = await db
      .select()
      .from(petInvites)
      .where(eq(petInvites.id, invite.id));
    const response = await api()
      .delete(`/v1/pets/${pet.id}/invites/${targetId}`)
      .set('Authorization', `Bearer ${owner.token}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' });
    expect(
      await db.select().from(petInvites).where(eq(petInvites.id, invite.id)),
    ).toEqual(before);
  });
  function accept(user: TestUser, code: string) {
    return api()
      .post('/v1/invites/accept')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ code });
  }
  function memberships(petId: string, userId: string) {
    return db
      .select()
      .from(petUsers)
      .where(and(eq(petUsers.petId, petId), eq(petUsers.userId, userId)));
  }
  async function inviteFixture() {
    const value = await fixture();
    const accepter = await seedUser(`accepter-${value.label}`);
    const invite = await createInviteViaApi(value.owner, value.pet.id);
    return { ...value, accepter, invite };
  }
  it('#211 R7: aceptar crea la membresía family activa y responde { petId, role }', async () => {
    const { pet, accepter, invite } = await inviteFixture();
    const response = await accept(accepter, invite.code).expect(201);
    expect(response.body).toEqual({ petId: pet.id, role: 'family' });
    const rows = await memberships(pet.id, accepter.id);
    expect(rows).toHaveLength(1);
    expect(rows[0].role).toBe('family');
    expect(rows[0].status).toBe('active');
  });
  it('#211 R7: la invitación aceptada guarda accepted_by y accepted_at', async () => {
    const { accepter, invite } = await inviteFixture();
    await accept(accepter, invite.code).expect(201);
    const [row] = await db
      .select()
      .from(petInvites)
      .where(eq(petInvites.id, invite.id));
    expect(row.acceptedBy).toBe(accepter.id);
    expect(row.acceptedAt).toBeInstanceOf(Date);
  });
  it('#211 R7: acepta el código en minúsculas y con guion', async () => {
    const { pet, accepter, invite } = await inviteFixture();
    const code = invite.code.toLowerCase();
    const response = await accept(
      accepter,
      `${code.slice(0, 5)}-${code.slice(5)}`,
    ).expect(201);
    expect(response.body).toEqual({ petId: pet.id, role: 'family' });
  });
  it.each([
    'no existe',
    'no normaliza',
    'está expirado',
    'está revocado',
    'ya se usó',
  ])('#211 R8: responde el mismo 404 si el código %s', async (state) => {
    const { pet, accepter, invite, label } = await inviteFixture();
    let code = invite.code;
    if (state === 'no existe')
      code = Array.from(
        { length: 10 },
        () => '23456789ABCDEFGHJKMNPQRSTVWXYZ'[randomInt(0, 30)],
      ).join('');
    if (state === 'no normaliza') code = 'abc';
    if (state === 'está expirado')
      await db
        .update(petInvites)
        .set({ expiresAt: new Date(Date.now() - 60000) })
        .where(eq(petInvites.id, invite.id));
    if (state === 'está revocado')
      await db
        .update(petInvites)
        .set({ revokedAt: new Date() })
        .where(eq(petInvites.id, invite.id));
    if (state === 'ya se usó') {
      const previous = await seedUser(`previous-${label}`);
      await db
        .update(petInvites)
        .set({ acceptedBy: previous.id, acceptedAt: new Date() })
        .where(eq(petInvites.id, invite.id));
    }
    const response = await accept(accepter, code);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      code: 'INVITE_NOT_ACCEPTABLE',
      message: 'Invite code is invalid or expired',
    });
    expect(await memberships(pet.id, accepter.id)).toEqual([]);
  });
  it.each([{}, { code: 123 }, { code: '   ' }, { code: 'A'.repeat(65) }])(
    '#211 R8: responde 400 con el cuerpo %j',
    async (body) => {
      const { accepter } = await inviteFixture();
      const response = await api()
        .post('/v1/invites/accept')
        .set('Authorization', `Bearer ${accepter.token}`)
        .send(body);
      expect(response.status).toBe(400);
      expect(response.body as { statusCode: number; message: string }).toEqual(
        expect.objectContaining({
          statusCode: 400,
          message: 'Validation failed',
        }),
      );
    },
  );
  const alreadyMemberBody = {
    statusCode: 409,
    code: 'ALREADY_PET_MEMBER',
    message: 'User is already a member of this pet',
  };
  it('#211 R9: el owner que acepta su propio código recibe 409 y la invitación sigue pendiente', async () => {
    const { owner, pet, accepter, invite } = await inviteFixture();
    const before = await memberships(pet.id, owner.id);
    const response = await accept(owner, invite.code);
    expect(response.status).toBe(409);
    expect(response.body).toEqual(alreadyMemberBody);
    expect(await memberships(pet.id, owner.id)).toEqual(before);
    const [row] = await db
      .select()
      .from(petInvites)
      .where(eq(petInvites.id, invite.id));
    expect(row.acceptedAt).toBeNull();
    await accept(accepter, invite.code).expect(201);
  });
  it('#211 R9: un family que acepta otro código de la misma mascota recibe 409 y conserva su rol', async () => {
    const { pet, accepter, invite } = await inviteFixture();
    await seedMembership(pet.id, accepter.id, 'family');
    const before = await memberships(pet.id, accepter.id);
    const response = await accept(accepter, invite.code);
    expect(response.status).toBe(409);
    expect(response.body).toEqual(alreadyMemberBody);
    expect(await memberships(pet.id, accepter.id)).toEqual(before);
    const [row] = await db
      .select()
      .from(petInvites)
      .where(eq(petInvites.id, invite.id));
    expect(row.acceptedAt).toBeNull();
  });
  it('#211 R20: el nuevo family lista la mascota, la lee, no la edita y recibe push', async () => {
    const { pet, accepter, invite } = await inviteFixture();
    const expoToken = `ExponentPushToken[pet-members-${RUN_ID}]`;
    await api()
      .post('/v1/me/push-tokens')
      .set('Authorization', `Bearer ${accepter.token}`)
      .send({ expoToken, platform: 'android' })
      .expect(200);
    const push = app.get<PushTokenRepository>(PUSH_TOKEN_REPOSITORY);
    expect(await push.findActiveMembersTokens(pet.id)).not.toContain(expoToken);
    await accept(accepter, invite.code).expect(201);
    const list = await api()
      .get('/v1/pets')
      .set('Authorization', `Bearer ${accepter.token}`)
      .expect(200);
    expect(
      (list.body as PetProfileBody[]).find((p) => p.id === pet.id)?.myRole,
    ).toBe('family');
    const detail = await api()
      .get(`/v1/pets/${pet.id}`)
      .set('Authorization', `Bearer ${accepter.token}`)
      .expect(200);
    expect(profileBody(detail).myRole).toBe('family');
    await api()
      .patch(`/v1/pets/${pet.id}`)
      .set('Authorization', `Bearer ${accepter.token}`)
      .send({ name: 'No' })
      .expect(403);
    expect(await push.findActiveMembersTokens(pet.id)).toContain(expoToken);
  });
});
