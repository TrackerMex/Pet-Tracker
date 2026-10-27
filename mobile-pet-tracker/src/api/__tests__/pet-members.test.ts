import {
  acceptInvite,
  createPetInvite,
  listPetInvites,
  listPetMembers,
  removePetMember,
  revokePetInvite,
} from '../pet-members';

const baseUrl = 'http://example.test/v1/';
const member = { userId: 'user-1', firstName: 'Ana', lastName: 'García', role: 'owner', joinedAt: '2026-10-06T09:05:00.000Z' };
const invite = { id: 'inv-1', role: 'family', createdAt: '2026-10-06T09:05:00.000Z', expiresAt: '2026-10-09T14:00:00.000Z' };
const created = { ...invite, code: 'K7P4Q2M9XA' };

function response(status: number, body: unknown): Response {
  return { status, json: jest.fn().mockResolvedValue(body) } as unknown as Response;
}

const requests = {
  listPetMembers: (url: string | undefined, fetchFn: typeof fetch) => listPetMembers(url, 'token', 'pet-1', fetchFn),
  listPetInvites: (url: string | undefined, fetchFn: typeof fetch) => listPetInvites(url, 'token', 'pet-1', fetchFn),
  createPetInvite: (url: string | undefined, fetchFn: typeof fetch) => createPetInvite(url, 'token', 'pet-1', fetchFn),
  revokePetInvite: (url: string | undefined, fetchFn: typeof fetch) => revokePetInvite(url, 'token', 'pet-1', 'inv-1', fetchFn),
  removePetMember: (url: string | undefined, fetchFn: typeof fetch) => removePetMember(url, 'token', 'pet-1', 'user-2', fetchFn),
  acceptInvite: (url: string | undefined, fetchFn: typeof fetch) => acceptInvite(url, 'token', 'K7P4Q-2M9XA', fetchFn),
};

type Branch = [string, keyof typeof requests, number, unknown, Record<string, unknown>];

it.each<Branch>([
  ['listPetMembers 200 array da ok', 'listPetMembers', 200, [member], { kind: 'ok', members: [member] }],
  ['listPetMembers 401 da unauthorized', 'listPetMembers', 401, {}, { kind: 'unauthorized' }],
  ['listPetMembers 500 da error', 'listPetMembers', 500, {}, { kind: 'error' }],
  ['listPetMembers 200 no-array da error', 'listPetMembers', 200, {}, { kind: 'error' }],
  ['listPetInvites 200 array da ok', 'listPetInvites', 200, [invite], { kind: 'ok', invites: [invite] }],
  ['listPetInvites 401 da unauthorized', 'listPetInvites', 401, {}, { kind: 'unauthorized' }],
  ['listPetInvites 500 da error', 'listPetInvites', 500, {}, { kind: 'error' }],
  ['listPetInvites 200 no-array da error', 'listPetInvites', 200, {}, { kind: 'error' }],
  ['createPetInvite 201 da ok', 'createPetInvite', 201, created, { kind: 'ok', invite: created }],
  ['createPetInvite 409 PET_INVITES_LIMIT da invites-limit', 'createPetInvite', 409, { code: 'PET_INVITES_LIMIT' }, { kind: 'invites-limit' }],
  ['createPetInvite 409 PET_MEMBERS_LIMIT da members-limit', 'createPetInvite', 409, { code: 'PET_MEMBERS_LIMIT' }, { kind: 'members-limit' }],
  ['createPetInvite 409 otro code da error', 'createPetInvite', 409, { code: 'OTHER' }, { kind: 'error' }],
  ['createPetInvite 409 sin cuerpo da error', 'createPetInvite', 409, undefined, { kind: 'error' }],
  ['createPetInvite 401 da unauthorized', 'createPetInvite', 401, {}, { kind: 'unauthorized' }],
  ['createPetInvite 500 da error', 'createPetInvite', 500, {}, { kind: 'error' }],
  ['revokePetInvite 204 da ok', 'revokePetInvite', 204, undefined, { kind: 'ok' }],
  ['revokePetInvite 404 da not-found', 'revokePetInvite', 404, {}, { kind: 'not-found' }],
  ['revokePetInvite 401 da unauthorized', 'revokePetInvite', 401, {}, { kind: 'unauthorized' }],
  ['revokePetInvite 500 da error', 'revokePetInvite', 500, {}, { kind: 'error' }],
  ['removePetMember 204 da ok', 'removePetMember', 204, undefined, { kind: 'ok' }],
  ['removePetMember 401 da unauthorized', 'removePetMember', 401, {}, { kind: 'unauthorized' }],
  ['removePetMember 403 da rejected', 'removePetMember', 403, {}, { kind: 'rejected' }],
  ['removePetMember 404 da rejected', 'removePetMember', 404, {}, { kind: 'rejected' }],
  ['removePetMember 409 da rejected', 'removePetMember', 409, {}, { kind: 'rejected' }],
  ['removePetMember 500 da error', 'removePetMember', 500, {}, { kind: 'error' }],
  ['acceptInvite 201 petId string da ok', 'acceptInvite', 201, { petId: 'pet-2' }, { kind: 'ok', petId: 'pet-2' }],
  ['acceptInvite 201 sin petId da error', 'acceptInvite', 201, {}, { kind: 'error' }],
  ['acceptInvite 201 petId no-string da error', 'acceptInvite', 201, { petId: 7 }, { kind: 'error' }],
  ['acceptInvite 404 da not-acceptable', 'acceptInvite', 404, {}, { kind: 'not-acceptable' }],
  ['acceptInvite 400 da not-acceptable', 'acceptInvite', 400, {}, { kind: 'not-acceptable' }],
  ['acceptInvite 409 da already-member', 'acceptInvite', 409, {}, { kind: 'already-member' }],
  ['acceptInvite 429 da rate-limited', 'acceptInvite', 429, {}, { kind: 'rate-limited' }],
  ['acceptInvite 401 da unauthorized', 'acceptInvite', 401, {}, { kind: 'unauthorized' }],
  ['acceptInvite 500 da error', 'acceptInvite', 500, {}, { kind: 'error' }],
])('R1: %s', async (_title, name, status, body, expected) => {
  const fetchFn = jest.fn().mockResolvedValue(response(status, body));
  const result = await requests[name](baseUrl, fetchFn);
  expect(fetchFn).toHaveBeenCalledTimes(1);
  expect(result).toEqual(expected);
});

it.each(Object.keys(requests) as (keyof typeof requests)[])('R1: %s fallo de red da unreachable', async (name) => {
  const fetchFn = jest.fn().mockRejectedValue(new Error('sin red'));
  const result = await requests[name](baseUrl, fetchFn);
  expect(fetchFn).toHaveBeenCalledTimes(1);
  expect(result).toEqual({ kind: 'unreachable', message: 'sin red' });
});

it.each(['listPetMembers', 'listPetInvites', 'acceptInvite'] as const)('R1: %s JSON inválido da error', async (name) => {
  const fetchFn = jest.fn().mockResolvedValue({ status: name === 'acceptInvite' ? 201 : 200, json: jest.fn().mockRejectedValue(new SyntaxError('json')) });
  const result = await requests[name](baseUrl, fetchFn);
  expect(fetchFn).toHaveBeenCalledTimes(1);
  expect(result).toEqual({ kind: 'error' });
});

it('R1: ninguna función toca fetch sin baseUrl', async () => {
  for (const request of Object.values(requests)) {
    for (const url of [undefined, '']) {
      const fetchFn = jest.fn();
      await expect(request(url, fetchFn)).resolves.toEqual({ kind: 'missing-config' });
      expect(fetchFn).not.toHaveBeenCalled();
    }
  }
});

it('R1: cada función llama al método y la ruta del contrato', async () => {
  const contracts: [keyof typeof requests, string, Record<string, unknown>][] = [
    ['listPetMembers', '/pets/pet-1/members', { headers: { Authorization: 'Bearer token' } }],
    ['listPetInvites', '/pets/pet-1/invites', { headers: { Authorization: 'Bearer token' } }],
    ['createPetInvite', '/pets/pet-1/invites', { method: 'POST', headers: { Authorization: 'Bearer token', 'Content-Type': 'application/json' }, body: '{}' }],
    ['revokePetInvite', '/pets/pet-1/invites/inv-1', { method: 'DELETE', headers: { Authorization: 'Bearer token' } }],
    ['removePetMember', '/pets/pet-1/members/user-2', { method: 'DELETE', headers: { Authorization: 'Bearer token' } }],
    ['acceptInvite', '/invites/accept', { method: 'POST', headers: { Authorization: 'Bearer token', 'Content-Type': 'application/json' }, body: '{"code":"K7P4Q-2M9XA"}' }],
  ];
  for (const [name, path, options] of contracts) {
    const fetchFn = jest.fn().mockResolvedValue(response(500, {}));
    await requests[name](baseUrl, fetchFn);
    expect(fetchFn).toHaveBeenCalledWith(`http://example.test/v1${path}`, options);
  }
});
