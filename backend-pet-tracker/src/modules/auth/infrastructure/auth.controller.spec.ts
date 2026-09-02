import 'reflect-metadata';
import {
  BadRequestException,
  ConflictException,
  ExecutionContext,
  HttpException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { GoneException } from '@nestjs/common';
import { LoginUserUseCase } from '@/modules/auth/application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '@/modules/auth/application/use-cases/register-user.use-case';
import { RequestPasswordResetUseCase } from '@/modules/auth/application/use-cases/request-password-reset.use-case';
import { ResetPasswordUseCase } from '@/modules/auth/application/use-cases/reset-password.use-case';
import { VerifyEmailUseCase } from '@/modules/auth/application/use-cases/verify-email.use-case';
import { User } from '@/modules/auth/domain/entities/user.entity';
import {
  InvalidVerificationTokenError,
  VerificationTokenExpiredError,
} from '@/modules/auth/domain/errors/email-verification.errors';
import {
  InvalidPasswordResetTokenError,
  PasswordResetTokenExpiredError,
} from '@/modules/auth/domain/errors/password-reset.errors';
import {
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
} from '@/modules/auth/domain/errors/user.errors';
import { ResendClient } from './email/resend-client';
import {
  FORGOT_PASSWORD_MAX_PER_EMAIL,
  EmailRateLimitGuard,
} from './guards/email-rate-limit.guard';
import { ResendPasswordResetSender } from './email/resend-password-reset-sender';
import { AuthController } from './auth.controller';

const VERIFICATION_TOKEN = 'kQ8s0Zr4Vv1nT7yQ2bXpL9dW3fH6jM0aC5eR8uY1oI4';

const CREATED_USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';

const validBody = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  phone: '+525512345678',
  password: 'sup3rsecret',
  passwordConfirmation: 'sup3rsecret',
  country: 'MX',
  timezone: 'America/Mexico_City',
  termsAccepted: true,
};

function buildCreatedUser(): User {
  return new User({
    id: CREATED_USER_ID,
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
    updatedAt: new Date('2026-07-30T10:00:00.000Z'),
  });
}

function buildRegisterUserDouble(
  behaviour: () => Promise<User> = () => Promise.resolve(buildCreatedUser()),
) {
  const execute = jest.fn(behaviour);
  const controller = new AuthController(
    { execute } as unknown as RegisterUserUseCase,
    { execute: jest.fn() } as unknown as VerifyEmailUseCase,
    { execute: jest.fn() } as unknown as LoginUserUseCase,
    { execute: jest.fn() } as unknown as RequestPasswordResetUseCase,
    { execute: jest.fn() } as unknown as ResetPasswordUseCase,
  );

  return { controller, execute };
}

function buildVerifyEmailDouble(
  behaviour: () => Promise<void> = () => Promise.resolve(),
) {
  const execute = jest.fn(behaviour);
  const controller = new AuthController(
    { execute: jest.fn() } as unknown as RegisterUserUseCase,
    { execute } as unknown as VerifyEmailUseCase,
    { execute: jest.fn() } as unknown as LoginUserUseCase,
    { execute: jest.fn() } as unknown as RequestPasswordResetUseCase,
    { execute: jest.fn() } as unknown as ResetPasswordUseCase,
  );

  return { controller, execute };
}

function buildLoginDouble(
  behaviour: () => Promise<{ accessToken: string }> = () =>
    Promise.resolve({ accessToken: 'signed.jwt.token' }),
) {
  const execute = jest.fn(behaviour);
  const controller = new AuthController(
    { execute: jest.fn() } as unknown as RegisterUserUseCase,
    { execute: jest.fn() } as unknown as VerifyEmailUseCase,
    { execute } as unknown as LoginUserUseCase,
    { execute: jest.fn() } as unknown as RequestPasswordResetUseCase,
    { execute: jest.fn() } as unknown as ResetPasswordUseCase,
  );

  return { controller, execute };
}

function buildForgotPasswordDouble(
  behaviour: () => Promise<void> = () => Promise.resolve(),
) {
  const execute = jest.fn(behaviour);
  const controller = new AuthController(
    { execute: jest.fn() } as unknown as RegisterUserUseCase,
    { execute: jest.fn() } as unknown as VerifyEmailUseCase,
    { execute: jest.fn() } as unknown as LoginUserUseCase,
    { execute } as unknown as RequestPasswordResetUseCase,
    { execute: jest.fn() } as unknown as ResetPasswordUseCase,
  );

  return { controller, execute };
}

function buildResetPasswordDouble(
  behaviour: () => Promise<void> = () => Promise.resolve(),
) {
  const execute = jest.fn(behaviour);
  const controller = new AuthController(
    { execute: jest.fn() } as unknown as RegisterUserUseCase,
    { execute: jest.fn() } as unknown as VerifyEmailUseCase,
    { execute: jest.fn() } as unknown as LoginUserUseCase,
    { execute: jest.fn() } as unknown as RequestPasswordResetUseCase,
    { execute } as unknown as ResetPasswordUseCase,
  );

  return { controller, execute };
}

async function captureHttpError(promise: Promise<unknown>) {
  let caught: unknown;
  await promise.catch((error: unknown) => {
    caught = error;
  });

  expect(caught).toBeInstanceOf(HttpException);
  return caught as HttpException;
}

// El status de exito lo fija @HttpCode en el handler; en un test unitario se
// verifica leyendo esa metadata (el resto del contrato HTTP vive en el body y
// en el tipo de HttpException lanzada).
function httpCodeOf(methodName: keyof AuthController): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(
    AuthController.prototype,
    methodName,
  );

  return Reflect.getMetadata('__httpCode__', descriptor?.value as object);
}

describe('R1: POST /v1/auth/register responde 201 con el usuario creado', () => {
  it('devuelve el id del usuario y declara el status 201', async () => {
    const { controller, execute } = buildRegisterUserDouble();

    const body = await controller.register(validBody);

    expect(body.id).toBe(CREATED_USER_ID);
    expect(body.email).toBe('ada@example.com');
    expect(execute).toHaveBeenCalledTimes(1);
    expect(httpCodeOf('register')).toBe(201);
  });
});

describe('R2: POST /v1/auth/register con email duplicado responde 409', () => {
  const duplicateEmail = () =>
    Promise.reject<User>(new EmailAlreadyRegisteredError('ada@example.com'));

  it('mapea EmailAlreadyRegisteredError a ConflictException 409', async () => {
    const { controller } = buildRegisterUserDouble(duplicateEmail);

    const error = await captureHttpError(controller.register(validBody));

    expect(error).toBeInstanceOf(ConflictException);
    expect(error.getStatus()).toBe(409);
  });

  it('no filtra el email en la respuesta de error', async () => {
    const { controller } = buildRegisterUserDouble(duplicateEmail);

    const error = await captureHttpError(controller.register(validBody));

    expect(JSON.stringify(error.getResponse())).not.toContain(
      'ada@example.com',
    );
  });
});

describe('R3: POST /v1/auth/register con passwordConfirmation distinta responde 400', () => {
  it('lanza BadRequestException sin invocar el caso de uso', async () => {
    const { controller, execute } = buildRegisterUserDouble();

    const error = await captureHttpError(
      controller.register({
        ...validBody,
        passwordConfirmation: 'otracosa123',
      }),
    );

    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.getStatus()).toBe(400);
    expect(execute).not.toHaveBeenCalled();
  });
});

describe('R4: POST /v1/auth/register sin termsAccepted responde 400', () => {
  it.each([
    ['termsAccepted false', { ...validBody, termsAccepted: false }],
    ['termsAccepted ausente', { ...validBody, termsAccepted: undefined }],
  ])('lanza BadRequestException con %s', async (_scenario, body) => {
    const { controller, execute } = buildRegisterUserDouble();

    const error = await captureHttpError(controller.register(body));

    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.getStatus()).toBe(400);
    expect(execute).not.toHaveBeenCalled();
  });
});

describe('R5: POST /v1/auth/register con payload invalido responde 400 con el detalle de validacion', () => {
  it('mapea los issues de ZodError a la respuesta 400', async () => {
    const { controller, execute } = buildRegisterUserDouble();

    const error = await captureHttpError(
      controller.register({
        ...validBody,
        email: 'no-es-un-email',
        password: 'corta',
        passwordConfirmation: 'corta',
      }),
    );

    expect(error.getStatus()).toBe(400);
    const response = error.getResponse() as {
      errors: { path: string; message: string }[];
    };
    expect(response.errors.map((issue) => issue.path)).toEqual(
      expect.arrayContaining(['email', 'password']),
    );
    expect(execute).not.toHaveBeenCalled();
  });
});

describe('R7: la respuesta de registro nunca incluye el token de verificacion', () => {
  it('el body trae solo los campos permitidos, sin token', async () => {
    const { controller } = buildRegisterUserDouble();

    const body = await controller.register(validBody);

    expect(Object.keys(body).sort()).toEqual([
      'country',
      'createdAt',
      'email',
      'firstName',
      'id',
      'lastName',
      'phone',
      'timezone',
    ]);
    expect(JSON.stringify(body).toLowerCase()).not.toContain('token');
  });
});

describe('R8: POST /v1/auth/verify-email con token valido responde 200', () => {
  it('invoca el caso de uso con el token y declara el status 200', async () => {
    const { controller, execute } = buildVerifyEmailDouble();

    const body = await controller.verifyEmail({ token: VERIFICATION_TOKEN });

    expect(execute).toHaveBeenCalledWith({ token: VERIFICATION_TOKEN });
    expect(body).toEqual({ verified: true });
    expect(httpCodeOf('verifyEmail')).toBe(200);
  });
});

describe('R9: POST /v1/auth/verify-email con token inexistente responde 400', () => {
  it('mapea InvalidVerificationTokenError a BadRequestException 400', async () => {
    const { controller } = buildVerifyEmailDouble(() =>
      Promise.reject(new InvalidVerificationTokenError()),
    );

    const error = await captureHttpError(
      controller.verifyEmail({ token: VERIFICATION_TOKEN }),
    );

    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.getStatus()).toBe(400);
  });

  it('responde 400 si el body no trae token', async () => {
    const { controller, execute } = buildVerifyEmailDouble();

    const error = await captureHttpError(controller.verifyEmail({}));

    expect(error.getStatus()).toBe(400);
    expect(execute).not.toHaveBeenCalled();
  });
});

describe('R10: POST /v1/auth/verify-email con token expirado responde 410', () => {
  it('mapea VerificationTokenExpiredError a GoneException 410', async () => {
    const { controller } = buildVerifyEmailDouble(() =>
      Promise.reject(new VerificationTokenExpiredError()),
    );

    const error = await captureHttpError(
      controller.verifyEmail({ token: VERIFICATION_TOKEN }),
    );

    expect(error).toBeInstanceOf(GoneException);
    expect(error.getStatus()).toBe(410);
  });
});

describe('R11: POST /v1/auth/verify-email con token ya usado responde 400', () => {
  it('un token consumido llega como InvalidVerificationTokenError y se mapea a 400', async () => {
    const { controller } = buildVerifyEmailDouble(() =>
      Promise.reject(new InvalidVerificationTokenError()),
    );

    const error = await captureHttpError(
      controller.verifyEmail({ token: VERIFICATION_TOKEN }),
    );

    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.getStatus()).toBe(400);
  });
});

describe('R14: la respuesta de registro nunca expone password_hash', () => {
  it('serializa solo la lista explicita de campos permitidos', async () => {
    const { controller } = buildRegisterUserDouble();

    const body = await controller.register(validBody);

    expect(JSON.stringify(body)).not.toContain('argon2id');
    expect(Object.keys(body)).not.toContain('passwordHash');
  });
});

const validLoginBody = { email: 'ada@example.com', password: 'sup3rsecret' };

describe('R1 (auth-login-me): POST /v1/auth/login responde 200 con access_token', () => {
  it('devuelve el access_token del caso de uso y declara el status 200', async () => {
    const { controller, execute } = buildLoginDouble();

    const body = await controller.login(validLoginBody);

    expect(body).toEqual({ access_token: 'signed.jwt.token' });
    expect(execute).toHaveBeenCalledWith(validLoginBody);
    expect(httpCodeOf('login')).toBe(200);
  });
});

describe('R2 (auth-login-me): POST /v1/auth/login con credenciales invalidas responde 401 generico', () => {
  it('mapea InvalidCredentialsError a UnauthorizedException 401', async () => {
    const { controller } = buildLoginDouble(() =>
      Promise.reject(new InvalidCredentialsError()),
    );

    const error = await captureHttpError(controller.login(validLoginBody));

    expect(error).toBeInstanceOf(UnauthorizedException);
    expect(error.getStatus()).toBe(401);
  });

  it('el body de error no revela si el email existe', async () => {
    const { controller } = buildLoginDouble(() =>
      Promise.reject(new InvalidCredentialsError()),
    );

    const error = await captureHttpError(controller.login(validLoginBody));

    expect(JSON.stringify(error.getResponse())).not.toContain(
      'ada@example.com',
    );
  });
});

describe('R3 (auth-login-me): POST /v1/auth/login con payload invalido responde 400', () => {
  it('lanza BadRequestException sin invocar el caso de uso', async () => {
    const { controller, execute } = buildLoginDouble();

    const error = await captureHttpError(
      controller.login({ email: 'no-es-un-email', password: '' }),
    );

    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.getStatus()).toBe(400);
    expect(execute).not.toHaveBeenCalled();
  });
});

describe('R15 (auth-login-me): la respuesta de login nunca expone password_hash', () => {
  it('el body de login solo trae access_token', async () => {
    const { controller } = buildLoginDouble();

    const body = await controller.login(validLoginBody);

    expect(Object.keys(body)).toEqual(['access_token']);
  });
});

describe('R1: POST /v1/auth/forgot-password responde 200 con requested true', () => {
  it('invoca el caso de uso y fija exactamente el contrato de exito', async () => {
    const { controller, execute } = buildForgotPasswordDouble();

    const body = await controller.forgotPassword({ email: 'ada@example.com' });

    expect(execute).toHaveBeenCalledWith({ email: 'ada@example.com' });
    expect(body).toEqual({ requested: true });
    expect(httpCodeOf('forgotPassword')).toBe(200);
  });
});

describe('R2: POST /v1/auth/forgot-password responde igual exista o no la cuenta', () => {
  it('produce respuestas estructuralmente identicas en ambos caminos', async () => {
    const existing = buildForgotPasswordDouble();
    const missing = buildForgotPasswordDouble();

    const existingResponse = {
      status: httpCodeOf('forgotPassword'),
      body: await existing.controller.forgotPassword({
        email: 'ada@example.com',
      }),
    };
    const missingResponse = {
      status: httpCodeOf('forgotPassword'),
      body: await missing.controller.forgotPassword({
        email: 'missing@example.com',
      }),
    };

    expect(missingResponse).toEqual(existingResponse);
  });
});

describe('R6 (auth-email-delivery): forgot-password responde 200 identico aunque el emisor falle', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('compara la respuesta existente con fallo Resend contra la inexistente', async () => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const fetchDouble = jest.fn(() =>
      Promise.reject(new Error('provider unavailable')),
    );
    const client = new ResendClient(
      'api-key-for-r6',
      'sender@example.com',
      fetchDouble as unknown as typeof fetch,
    );
    const sender = new ResendPasswordResetSender(client);
    const existing = buildForgotPasswordDouble(async () => {
      await sender.send({
        userId: CREATED_USER_ID,
        email: 'ada@example.com',
        token: 'reset-token-r6',
        expiresAt: new Date('2026-07-30T11:00:00.000Z'),
      });
      await client.whenIdle();
    });
    const missing = buildForgotPasswordDouble();

    const existingResponse = {
      status: httpCodeOf('forgotPassword'),
      body: await existing.controller.forgotPassword({
        email: 'ada@example.com',
      }),
    };
    const missingResponse = {
      status: httpCodeOf('forgotPassword'),
      body: await missing.controller.forgotPassword({
        email: 'missing@example.com',
      }),
    };

    expect(missingResponse).toEqual(existingResponse);
    expect(fetchDouble).toHaveBeenCalledTimes(1);
  });
});
describe('R3: POST /v1/auth/forgot-password con payload invalido responde 400', () => {
  it.each([
    ['email ausente', {}],
    ['email no string', { email: 42 }],
    ['formato invalido', { email: 'no-es-email' }],
    ['mas de 320 caracteres', { email: `${'a'.repeat(310)}@example.com` }],
  ])(
    'rechaza %s con detalle por campo antes del caso de uso',
    async (_case, body) => {
      const { controller, execute } = buildForgotPasswordDouble();

      const error = await captureHttpError(controller.forgotPassword(body));

      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.getStatus()).toBe(400);
      const response = error.getResponse() as {
        errors: { path: string; message: string }[];
      };
      expect(response.errors.map((issue) => issue.path)).toContain('email');
      expect(execute).not.toHaveBeenCalled();
    },
  );
});

describe('R5: POST /v1/auth/reset-password con token valido responde 200', () => {
  it('invoca el caso de uso y fija exactamente el contrato de exito', async () => {
    const { controller, execute } = buildResetPasswordDouble();
    const body = {
      token: VERIFICATION_TOKEN,
      password: 'NewPassword1!',
      passwordConfirmation: 'NewPassword1!',
    };

    const response = await controller.resetPassword(body);

    expect(execute).toHaveBeenCalledWith(body);
    expect(response).toEqual({ reset: true });
    expect(httpCodeOf('resetPassword')).toBe(200);
  });
});

describe('R6: POST /v1/auth/reset-password con token invalido o usado responde 400', () => {
  it.each(['inexistente', 'usado'])(
    'mapea el token %s al mismo 400',
    async () => {
      const { controller } = buildResetPasswordDouble(() =>
        Promise.reject(new InvalidPasswordResetTokenError()),
      );

      const error = await captureHttpError(
        controller.resetPassword({
          token: VERIFICATION_TOKEN,
          password: 'NewPassword1!',
          passwordConfirmation: 'NewPassword1!',
        }),
      );

      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.getStatus()).toBe(400);
    },
  );
});

describe('R7: POST /v1/auth/reset-password con token expirado responde 410', () => {
  it('mapea PasswordResetTokenExpiredError a GoneException', async () => {
    const { controller } = buildResetPasswordDouble(() =>
      Promise.reject(new PasswordResetTokenExpiredError()),
    );

    const error = await captureHttpError(
      controller.resetPassword({
        token: VERIFICATION_TOKEN,
        password: 'NewPassword1!',
        passwordConfirmation: 'NewPassword1!',
      }),
    );

    expect(error).toBeInstanceOf(GoneException);
    expect(error.getStatus()).toBe(410);
  });
});

describe('R8: POST /v1/auth/reset-password con payload invalido responde 400', () => {
  const validResetBody = {
    token: VERIFICATION_TOKEN,
    password: 'NewPassword1!',
    passwordConfirmation: 'NewPassword1!',
  };

  it.each([
    ['token ausente', { ...validResetBody, token: undefined }],
    ['token vacio', { ...validResetBody, token: '   ' }],
    ['token mayor a 256', { ...validResetBody, token: 'x'.repeat(257) }],
    ['password corto', { ...validResetBody, password: 'short' }],
    [
      'password mayor a 128',
      {
        ...validResetBody,
        password: 'x'.repeat(129),
        passwordConfirmation: 'x'.repeat(129),
      },
    ],
    [
      'confirmacion distinta',
      { ...validResetBody, passwordConfirmation: 'DifferentPassword1!' },
    ],
  ])('rechaza %s antes de invocar el caso de uso', async (_case, body) => {
    const { controller, execute } = buildResetPasswordDouble();

    const error = await captureHttpError(controller.resetPassword(body));

    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.getStatus()).toBe(400);
    expect(execute).not.toHaveBeenCalled();
  });
});

describe('R10: la respuesta de forgot-password nunca incluye el token', () => {
  it('devuelve exclusivamente requested true', async () => {
    const { controller } = buildForgotPasswordDouble();

    const body = await controller.forgotPassword({ email: 'ada@example.com' });

    expect(Object.keys(body)).toEqual(['requested']);
    expect(body).toEqual({ requested: true });
    expect(JSON.stringify(body).toLowerCase()).not.toContain('token');
  });
});

describe('R10 (auth-email-delivery): el 429 del rate limit no revela si la cuenta existe', () => {
  function guardContext(
    methodName: keyof AuthController,
    body: unknown,
  ): ExecutionContext {
    return {
      getHandler: () => AuthController.prototype[methodName],
      switchToHttp: () =>
        ({
          getRequest: () => ({ body, ip: '203.0.113.30' }),
        }) as ReturnType<ExecutionContext['switchToHttp']>,
    } as unknown as ExecutionContext;
  }

  function guardsOf(methodName: keyof AuthController): unknown[] {
    const metadata: unknown = Reflect.getMetadata(
      '__guards__',
      AuthController.prototype[methodName],
    );

    return Array.isArray(metadata) ? metadata : [];
  }

  async function forgotResponse(
    guard: EmailRateLimitGuard,
    controller: AuthController,
    email: string,
  ): Promise<{ status: unknown; body: unknown }> {
    try {
      guard.canActivate(guardContext('forgotPassword', { email }));
      return {
        status: httpCodeOf('forgotPassword'),
        body: await controller.forgotPassword({ email }),
      };
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      const httpError = error as HttpException;
      return {
        status: httpError.getStatus(),
        body: httpError.getResponse(),
      };
    }
  }

  it('aplica el guard solo a register y forgotPassword', () => {
    expect(guardsOf('register')).toContain(EmailRateLimitGuard);
    expect(guardsOf('forgotPassword')).toContain(EmailRateLimitGuard);
    expect(guardsOf('login')).not.toContain(EmailRateLimitGuard);
    expect(guardsOf('verifyEmail')).not.toContain(EmailRateLimitGuard);
    expect(guardsOf('resetPassword')).not.toContain(EmailRateLimitGuard);
  });

  it('iguala el 200 dentro del cupo y el 429 al agotarlo', async () => {
    const guard = new EmailRateLimitGuard();
    const existing = buildForgotPasswordDouble();
    const missing = buildForgotPasswordDouble();
    const existingEmail = 'registered-r10@example.com';
    const missingEmail = 'missing-r10@example.com';

    const existingWithinQuota = await forgotResponse(
      guard,
      existing.controller,
      existingEmail,
    );
    const missingWithinQuota = await forgotResponse(
      guard,
      missing.controller,
      missingEmail,
    );

    expect(missingWithinQuota).toEqual(existingWithinQuota);
    expect(existingWithinQuota).toEqual({
      status: 200,
      body: { requested: true },
    });

    for (let attempt = 1; attempt < FORGOT_PASSWORD_MAX_PER_EMAIL; attempt++) {
      await forgotResponse(guard, existing.controller, existingEmail);
      await forgotResponse(guard, missing.controller, missingEmail);
    }

    const existingBlocked = await forgotResponse(
      guard,
      existing.controller,
      existingEmail,
    );
    const missingBlocked = await forgotResponse(
      guard,
      missing.controller,
      missingEmail,
    );

    expect(missingBlocked).toEqual(existingBlocked);
    expect(existingBlocked.status).toBe(429);
    expect(existing.execute).toHaveBeenCalledTimes(3);
    expect(missing.execute).toHaveBeenCalledTimes(3);
  });

  it('deja pasar sin contar cualquier body sin email string', () => {
    for (const body of [{}, { email: 42 }]) {
      const guard = new EmailRateLimitGuard();

      for (let attempt = 0; attempt < 5; attempt++) {
        expect(guard.canActivate(guardContext('forgotPassword', body))).toBe(
          true,
        );
      }
    }
  });
});
