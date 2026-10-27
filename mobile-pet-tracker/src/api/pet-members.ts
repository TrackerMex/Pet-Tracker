import { deleteJson, getJson, postJson, readJson } from './http';

export interface PetMember {
  userId: string;
  firstName: string;
  lastName: string;
  role: 'owner' | 'family' | 'walker' | 'vet';
  joinedAt: string;
}

export interface PetInvite {
  id: string;
  role: string;
  createdAt: string;
  expiresAt: string;
}

export interface CreatedPetInvite extends PetInvite {
  code: string;
}

type ApiFailure =
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export type PetMembersState = ApiFailure | { kind: 'ok'; members: PetMember[] };
export type PetInvitesState = ApiFailure | { kind: 'ok'; invites: PetInvite[] };
export type CreatePetInviteState = ApiFailure
  | { kind: 'ok'; invite: CreatedPetInvite }
  | { kind: 'invites-limit' }
  | { kind: 'members-limit' };
export type RevokePetInviteState = ApiFailure | { kind: 'ok' } | { kind: 'not-found' };
export type RemovePetMemberState = ApiFailure | { kind: 'ok' } | { kind: 'rejected' };
export type AcceptInviteState = ApiFailure
  | { kind: 'ok'; petId: string }
  | { kind: 'not-acceptable' }
  | { kind: 'already-member' }
  | { kind: 'rate-limited' };

export async function listPetMembers(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<PetMembersState> {
  if (!baseUrl) return { kind: 'missing-config' };
  const result = await getJson(baseUrl, `/pets/${petId}/members`, token, fetchFn);
  if (result.kind === 'unreachable') return result;
  if (result.response.status === 401) return { kind: 'unauthorized' };
  if (result.response.status !== 200) return { kind: 'error' };
  const body = await readJson(result.response);
  return Array.isArray(body) ? { kind: 'ok', members: body as PetMember[] } : { kind: 'error' };
}

export async function listPetInvites(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<PetInvitesState> {
  if (!baseUrl) return { kind: 'missing-config' };
  const result = await getJson(baseUrl, `/pets/${petId}/invites`, token, fetchFn);
  if (result.kind === 'unreachable') return result;
  if (result.response.status === 401) return { kind: 'unauthorized' };
  if (result.response.status !== 200) return { kind: 'error' };
  const body = await readJson(result.response);
  return Array.isArray(body) ? { kind: 'ok', invites: body as PetInvite[] } : { kind: 'error' };
}

export async function createPetInvite(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<CreatePetInviteState> {
  if (!baseUrl) return { kind: 'missing-config' };
  const result = await postJson(baseUrl, `/pets/${petId}/invites`, token, {}, fetchFn);
  if (result.kind === 'unreachable') return result;
  if (result.response.status === 401) return { kind: 'unauthorized' };
  if (result.response.status === 409) {
    const body = await readJson(result.response);
    const code = body && typeof body === 'object' && 'code' in body ? body.code : undefined;
    if (code === 'PET_INVITES_LIMIT') return { kind: 'invites-limit' };
    if (code === 'PET_MEMBERS_LIMIT') return { kind: 'members-limit' };
    return { kind: 'error' };
  }
  if (result.response.status !== 201) return { kind: 'error' };
  const body = await readJson(result.response);
  return body && typeof body === 'object' && 'code' in body && typeof body.code === 'string'
    ? { kind: 'ok', invite: body as CreatedPetInvite }
    : { kind: 'error' };
}

export async function revokePetInvite(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  inviteId: string,
  fetchFn: typeof fetch = fetch,
): Promise<RevokePetInviteState> {
  if (!baseUrl) return { kind: 'missing-config' };
  const result = await deleteJson(baseUrl, `/pets/${petId}/invites/${inviteId}`, token, fetchFn);
  if (result.kind === 'unreachable') return result;
  if (result.response.status === 401) return { kind: 'unauthorized' };
  if (result.response.status === 404) return { kind: 'not-found' };
  return result.response.status === 204 ? { kind: 'ok' } : { kind: 'error' };
}

export async function removePetMember(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  userId: string,
  fetchFn: typeof fetch = fetch,
): Promise<RemovePetMemberState> {
  if (!baseUrl) return { kind: 'missing-config' };
  const result = await deleteJson(baseUrl, `/pets/${petId}/members/${userId}`, token, fetchFn);
  if (result.kind === 'unreachable') return result;
  if (result.response.status === 401) return { kind: 'unauthorized' };
  if ([403, 404, 409].includes(result.response.status)) return { kind: 'rejected' };
  return result.response.status === 204 ? { kind: 'ok' } : { kind: 'error' };
}

export async function acceptInvite(
  baseUrl: string | undefined,
  token: string,
  code: string,
  fetchFn: typeof fetch = fetch,
): Promise<AcceptInviteState> {
  if (!baseUrl) return { kind: 'missing-config' };
  const result = await postJson(baseUrl, '/invites/accept', token, { code }, fetchFn);
  if (result.kind === 'unreachable') return result;
  if (result.response.status === 401) return { kind: 'unauthorized' };
  if (result.response.status === 404 || result.response.status === 400) return { kind: 'not-acceptable' };
  if (result.response.status === 409) return { kind: 'already-member' };
  if (result.response.status === 429) return { kind: 'rate-limited' };
  if (result.response.status !== 201) return { kind: 'error' };
  const body = await readJson(result.response);
  return body && typeof body === 'object' && 'petId' in body && typeof body.petId === 'string'
    ? { kind: 'ok', petId: body.petId }
    : { kind: 'error' };
}
