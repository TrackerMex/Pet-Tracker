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
  _baseUrl: string | undefined, _token: string, _petId: string,
  _fetchFn: typeof fetch = fetch,
): Promise<PetMembersState> {
  return { kind: 'error' };
}

export async function listPetInvites(
  _baseUrl: string | undefined, _token: string, _petId: string,
  _fetchFn: typeof fetch = fetch,
): Promise<PetInvitesState> {
  return { kind: 'error' };
}

export async function createPetInvite(
  _baseUrl: string | undefined, _token: string, _petId: string,
  _fetchFn: typeof fetch = fetch,
): Promise<CreatePetInviteState> {
  return { kind: 'error' };
}

export async function revokePetInvite(
  _baseUrl: string | undefined, _token: string, _petId: string, _inviteId: string,
  _fetchFn: typeof fetch = fetch,
): Promise<RevokePetInviteState> {
  return { kind: 'error' };
}

export async function removePetMember(
  _baseUrl: string | undefined, _token: string, _petId: string, _userId: string,
  _fetchFn: typeof fetch = fetch,
): Promise<RemovePetMemberState> {
  return { kind: 'error' };
}

export async function acceptInvite(
  _baseUrl: string | undefined, _token: string, _code: string,
  _fetchFn: typeof fetch = fetch,
): Promise<AcceptInviteState> {
  return { kind: 'error' };
}
