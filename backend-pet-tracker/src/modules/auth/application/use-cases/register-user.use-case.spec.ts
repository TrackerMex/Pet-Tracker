import { createHash } from 'node:crypto';
import { User } from '../../domain/entities/user.entity';
import { EmailAlreadyRegisteredError } from '../../domain/errors/user.errors';
import {
  EmailVerificationMessage,
  EmailVerificationSender,
} from '../../domain/ports/email-verification-sender';
import { PasswordHasher } from '../../domain/ports/password-hasher';
import {
  EmailVerificationTokenRepository,
  NewEmailVerificationToken,
} from '../../domain/repositories/email-verification-token.repository';
import {
  NewUser,
  UserRepository,
} from '../../domain/repositories/user.repository';
import { RegisterUserDto } from '../dto/register-user.dto';
import { VERIFICATION_TOKEN_TTL_MS } from '../verification-token';
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

function buildScenario(options: { emailExists?: boolean } = {}) {
  const existsByEmail = jest.fn<Promise<boolean>, [string]>(() =>
    Promise.resolve(options.emailExists ?? false),
  );
  const create = jest.fn<Promise<User>, [NewUser]>((newUser) =>
    Promise.resolve(userFrom(newUser)),
  );
  const markEmailVerified = jest.fn<Promise<void>, [string, Date]>(() =>
    Promise.resolve(),
  );
  const users: UserRepository = { existsByEmail, create, markEmailVerified };

  const hash = jest.fn<Promise<string>, [string]>(() =>
    Promise.resolve(HASHED_PASSWORD),
  );
  const passwordHasher: PasswordHasher = { hash };

  const createToken = jest.fn<Promise<void>, [NewEmailVerificationToken]>(() =>
    Promise.resolve(),
  );
  const tokens = {
    create: createToken,
    findByTokenHash: jest.fn(),
    markUsed: jest.fn(),
  } as unknown as EmailVerificationTokenRepository;

  const send = jest.fn<Promise<void>, [EmailVerificationMessage]>(() =>
    Promise.resolve(),
  );
  const sender: EmailVerificationSender = { send };

  const useCase = new RegisterUserUseCase(
    users,
    passwordHasher,
    tokens,
    sender,
  );

  return { useCase, existsByEmail, create, hash, createToken, send };
}

describe('R1: el registro valido crea el usuario con los datos del payload', () => {
  it('persiste el usuario con password hasheado, terms_accepted_at y email_verified_at nulo', async () => {
    const { useCase, create, hash } = buildScenario();
    const before = Date.now();

    const user = await useCase.execute(buildDto());

    const persisted = create.mock.calls[0][0];
    expect(persisted.passwordHash).toBe(HASHED_PASSWORD);
    expect(persisted.firstName).toBe('Ada');
    expect(persisted.lastName).toBe('Lovelace');
    expect(persisted.phone).toBe('+525512345678');
    expect(persisted.country).toBe('MX');
    expect(persisted.timezone).toBe('America/Mexico_City');
    expect(persisted.termsAcceptedAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(persisted.termsAcceptedAt.getTime()).toBeLessThanOrEqual(Date.now());
    expect(hash).toHaveBeenCalledWith('sup3rsecret');
    expect(user.id).toBe(CREATED_USER_ID);
    expect(user.emailVerifiedAt).toBeNull();
  });

  it('nunca persiste el password en claro', async () => {
    const { useCase, create } = buildScenario();

    await useCase.execute(buildDto());

    expect(JSON.stringify(create.mock.calls[0][0])).not.toContain(
      'sup3rsecret',
    );
  });

  it('normaliza el email a minusculas antes de persistirlo', async () => {
    const { useCase, create } = buildScenario();

    await useCase.execute(buildDto({ email: 'Ada@Example.com' }));

    expect(create.mock.calls[0][0].email).toBe('ada@example.com');
  });

  it("persiste timezone 'UTC' cuando el payload no la trae", async () => {
    const { useCase, create } = buildScenario();

    await useCase.execute(buildDto({ timezone: undefined }));

    expect(create.mock.calls[0][0].timezone).toBe('UTC');
  });
});

describe('R2: el email ya registrado no crea otro usuario', () => {
  it('lanza EmailAlreadyRegisteredError sin llamar a create', async () => {
    const { useCase, create, createToken, send } = buildScenario({
      emailExists: true,
    });

    await expect(useCase.execute(buildDto())).rejects.toBeInstanceOf(
      EmailAlreadyRegisteredError,
    );
    expect(create).not.toHaveBeenCalled();
    expect(createToken).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('compara el email de forma case-insensitive', async () => {
    const { useCase, existsByEmail } = buildScenario();

    await useCase.execute(buildDto({ email: 'ADA@EXAMPLE.COM' }));

    expect(existsByEmail).toHaveBeenCalledWith('ada@example.com');
  });
});

describe('R6: el registro emite un token de verificacion con expiracion y lo entrega al sender', () => {
  it('persiste solo el SHA-256 del token que entrego al sender', async () => {
    const { useCase, createToken, send } = buildScenario();

    await useCase.execute(buildDto());

    const persistedToken = createToken.mock.calls[0][0];
    const sentMessage = send.mock.calls[0][0];
    expect(persistedToken.userId).toBe(CREATED_USER_ID);
    expect(persistedToken.tokenHash).toBe(
      createHash('sha256').update(sentMessage.token).digest('hex'),
    );
    expect(persistedToken.tokenHash).not.toContain(sentMessage.token);
  });

  it('registra una expiracion futura de 24 horas y la comparte con el sender', async () => {
    const { useCase, createToken, send } = buildScenario();
    const before = Date.now();

    await useCase.execute(buildDto());

    const { expiresAt } = createToken.mock.calls[0][0];
    expect(expiresAt.getTime()).toBeGreaterThanOrEqual(
      before + VERIFICATION_TOKEN_TTL_MS,
    );
    expect(expiresAt.getTime()).toBeLessThanOrEqual(
      Date.now() + VERIFICATION_TOKEN_TTL_MS,
    );
    expect(send.mock.calls[0][0].expiresAt).toEqual(expiresAt);
  });

  it('entrega al sender el usuario y el email destino del token', async () => {
    const { useCase, send } = buildScenario();

    await useCase.execute(buildDto());

    expect(send.mock.calls[0][0].userId).toBe(CREATED_USER_ID);
    expect(send.mock.calls[0][0].email).toBe('ada@example.com');
  });
});

describe('R7: el token de verificacion no viaja en el resultado del registro', () => {
  it('el caso de uso devuelve solo el usuario, sin el token en claro', async () => {
    const { useCase, send } = buildScenario();

    const user = await useCase.execute(buildDto());

    expect(JSON.stringify(user)).not.toContain(send.mock.calls[0][0].token);
  });
});

describe('R15: passwordConfirmation nunca se persiste', () => {
  it('no incluye passwordConfirmation en los datos enviados al repositorio', async () => {
    const { useCase, create } = buildScenario();

    await useCase.execute(buildDto());

    expect(Object.keys(create.mock.calls[0][0])).not.toContain(
      'passwordConfirmation',
    );
  });
});
