import { User } from '@/modules/auth/domain/entities/user.entity';
import { toProfileResponse } from './profile-response.mapper';

function buildUser(): User {
  return new User({
    id: '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77',
    email: 'ada@example.com',
    passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$salt$digest',
    firstName: 'Ada',
    lastName: 'Lovelace',
    phone: '+525512345678',
    country: 'MX',
    timezone: 'America/Mexico_City',
    termsAcceptedAt: new Date('2026-07-30T10:00:00.000Z'),
    emailVerifiedAt: null,
    createdAt: new Date('2026-07-30T10:00:00.000Z'),
    updatedAt: new Date('2026-07-31T09:00:00.000Z'),
  });
}

describe('R9: el perfil serializado trae id/email/firstName/lastName/phone/country/timezone/createdAt/updatedAt', () => {
  it('mapea todos los campos esperados', () => {
    const response = toProfileResponse(buildUser());

    expect(response).toEqual({
      id: '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77',
      email: 'ada@example.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
      phone: '+525512345678',
      country: 'MX',
      timezone: 'America/Mexico_City',
      createdAt: '2026-07-30T10:00:00.000Z',
      updatedAt: '2026-07-31T09:00:00.000Z',
    });
  });
});

describe('R15: la respuesta de perfil nunca expone password_hash', () => {
  it('serializa solo la lista explicita de campos permitidos', () => {
    const response = toProfileResponse(buildUser());

    expect(Object.keys(response)).not.toContain('passwordHash');
    expect(JSON.stringify(response)).not.toContain('argon2id');
  });
});
