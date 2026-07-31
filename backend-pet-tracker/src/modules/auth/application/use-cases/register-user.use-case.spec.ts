import { User } from '../../domain/entities/user.entity';
import { EmailAlreadyRegisteredError } from '../../domain/errors/user.errors';
import { PasswordHasher } from '../../domain/ports/password-hasher';
import {
  NewUser,
  UserRepository,
} from '../../domain/repositories/user.repository';
import { RegisterUserDto } from '../dto/register-user.dto';
import { RegisterUserUseCase } from './register-user.use-case';

const CREATED_USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const HASHED_PASSWORD = '$argon2id$v=19$m=65536,t=3,p=4$fake$hash';

function buildDto(overrides: Partial<RegisterUserDto> = {}): RegisterUserDto {
  return {
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'Ada@Example.com',
    phone: '+525512345678',
    password: 'sup3rsecret',
    passwordConfirmation: 'sup3rsecret',
    country: 'MX',
    timezone: 'America/Mexico_City',
    termsAccepted: true,
    ...overrides,
  };
}

function userFrom(newUser: NewUser): User {
  return new User({
    id: CREATED_USER_ID,
    ...newUser,
    emailVerifiedAt: null,
    createdAt: new Date('2026-07-30T10:00:00.000Z'),
    updatedAt: new Date('2026-07-30T10:00:00.000Z'),
  });
}

function buildUserRepositoryDouble(options: { emailExists?: boolean } = {}) {
  const existsByEmail = jest.fn<Promise<boolean>, [string]>(() =>
    Promise.resolve(options.emailExists ?? false),
  );
  const create = jest.fn<Promise<User>, [NewUser]>((newUser) =>
    Promise.resolve(userFrom(newUser)),
  );
  const markEmailVerified = jest.fn<Promise<void>, [string, Date]>(() =>
    Promise.resolve(),
  );
  const repository: UserRepository = {
    existsByEmail,
    create,
    markEmailVerified,
  };

  return { repository, existsByEmail, create, markEmailVerified };
}

function buildPasswordHasherDouble() {
  const hash = jest.fn<Promise<string>, [string]>(() =>
    Promise.resolve(HASHED_PASSWORD),
  );
  const passwordHasher: PasswordHasher = { hash };

  return { passwordHasher, hash };
}

describe('R1: el registro valido crea el usuario con los datos del payload', () => {
  it('persiste el usuario con password hasheado, terms_accepted_at y email_verified_at nulo', async () => {
    const users = buildUserRepositoryDouble();
    const hasher = buildPasswordHasherDouble();
    const useCase = new RegisterUserUseCase(
      users.repository,
      hasher.passwordHasher,
    );
    const before = Date.now();

    const user = await useCase.execute(buildDto());

    const persisted = users.create.mock.calls[0][0];
    expect(persisted.passwordHash).toBe(HASHED_PASSWORD);
    expect(persisted.firstName).toBe('Ada');
    expect(persisted.lastName).toBe('Lovelace');
    expect(persisted.phone).toBe('+525512345678');
    expect(persisted.country).toBe('MX');
    expect(persisted.timezone).toBe('America/Mexico_City');
    expect(persisted.termsAcceptedAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(persisted.termsAcceptedAt.getTime()).toBeLessThanOrEqual(Date.now());
    expect(hasher.hash).toHaveBeenCalledWith('sup3rsecret');
    expect(user.id).toBe(CREATED_USER_ID);
    expect(user.emailVerifiedAt).toBeNull();
  });

  it('nunca persiste el password en claro', async () => {
    const users = buildUserRepositoryDouble();
    const useCase = new RegisterUserUseCase(
      users.repository,
      buildPasswordHasherDouble().passwordHasher,
    );

    await useCase.execute(buildDto());

    expect(JSON.stringify(users.create.mock.calls[0][0])).not.toContain(
      'sup3rsecret',
    );
  });

  it('normaliza el email a minusculas antes de persistirlo', async () => {
    const users = buildUserRepositoryDouble();
    const useCase = new RegisterUserUseCase(
      users.repository,
      buildPasswordHasherDouble().passwordHasher,
    );

    await useCase.execute(buildDto({ email: 'Ada@Example.com' }));

    expect(users.create.mock.calls[0][0].email).toBe('ada@example.com');
  });

  it("persiste timezone 'UTC' cuando el payload no la trae", async () => {
    const users = buildUserRepositoryDouble();
    const useCase = new RegisterUserUseCase(
      users.repository,
      buildPasswordHasherDouble().passwordHasher,
    );

    await useCase.execute(buildDto({ timezone: undefined }));

    expect(users.create.mock.calls[0][0].timezone).toBe('UTC');
  });
});

describe('R2: el email ya registrado no crea otro usuario', () => {
  it('lanza EmailAlreadyRegisteredError sin llamar a create', async () => {
    const users = buildUserRepositoryDouble({ emailExists: true });
    const useCase = new RegisterUserUseCase(
      users.repository,
      buildPasswordHasherDouble().passwordHasher,
    );

    await expect(useCase.execute(buildDto())).rejects.toBeInstanceOf(
      EmailAlreadyRegisteredError,
    );
    expect(users.create).not.toHaveBeenCalled();
  });

  it('compara el email de forma case-insensitive', async () => {
    const users = buildUserRepositoryDouble();
    const useCase = new RegisterUserUseCase(
      users.repository,
      buildPasswordHasherDouble().passwordHasher,
    );

    await useCase.execute(buildDto({ email: 'ADA@EXAMPLE.COM' }));

    expect(users.existsByEmail).toHaveBeenCalledWith('ada@example.com');
  });
});

describe('R15: passwordConfirmation nunca se persiste', () => {
  it('no incluye passwordConfirmation en los datos enviados al repositorio', async () => {
    const users = buildUserRepositoryDouble();
    const useCase = new RegisterUserUseCase(
      users.repository,
      buildPasswordHasherDouble().passwordHasher,
    );

    await useCase.execute(buildDto());

    expect(Object.keys(users.create.mock.calls[0][0])).not.toContain(
      'passwordConfirmation',
    );
  });
});
