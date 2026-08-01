import { User } from '@/modules/auth/domain/entities/user.entity';
import { toUserResponse } from './user-response.mapper';

const SECRET_HASH = '$argon2id$v=19$m=65536,t=3,p=4$salt$digest';

function buildUser(): User {
  return new User({
    id: '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77',
    email: 'ada@example.com',
    passwordHash: SECRET_HASH,
    firstName: 'Ada',
    lastName: 'Lovelace',
    phone: '+525512345678',
    country: 'MX',
    timezone: 'America/Mexico_City',
    termsAcceptedAt: new Date('2026-07-30T10:00:00.000Z'),
    emailVerifiedAt: null,
    createdAt: new Date('2026-07-30T10:00:00.000Z'),
    updatedAt: new Date('2026-07-30T10:00:00.000Z'),
  });
}

describe('R14: la serializacion de un usuario excluye password_hash', () => {
  it('devuelve exactamente la lista explicita de campos permitidos', () => {
    expect(Object.keys(toUserResponse(buildUser())).sort()).toEqual([
      'country',
      'createdAt',
      'email',
      'firstName',
      'id',
      'lastName',
      'phone',
      'timezone',
    ]);
  });

  it('no filtra el hash del password ni bajo passwordHash ni bajo password_hash', () => {
    const serialized = JSON.stringify(toUserResponse(buildUser()));

    expect(serialized).not.toContain(SECRET_HASH);
    expect(serialized).not.toContain('passwordHash');
    expect(serialized).not.toContain('password_hash');
  });
});
