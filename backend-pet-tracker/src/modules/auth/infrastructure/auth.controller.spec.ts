import 'reflect-metadata';
import {
  BadRequestException,
  ConflictException,
  HttpException,
} from '@nestjs/common';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { User } from '../domain/entities/user.entity';
import { EmailAlreadyRegisteredError } from '../domain/errors/user.errors';
import { AuthController } from './auth.controller';

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
  const controller = new AuthController({
    execute,
  } as unknown as RegisterUserUseCase);

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

describe('R14: la respuesta de registro nunca expone password_hash', () => {
  it('serializa solo la lista explicita de campos permitidos', async () => {
    const { controller } = buildRegisterUserDouble();

    const body = await controller.register(validBody);

    expect(JSON.stringify(body)).not.toContain('argon2id');
    expect(Object.keys(body)).not.toContain('passwordHash');
  });
});
