import { readFileSync } from 'fs';
import { join } from 'path';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { PET_ROLES_KEY } from '@/modules/pets/infrastructure/decorators/require-pet-role.decorator';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { GetLastPositionUseCase } from '@/modules/positions/application/use-cases/get-last-position.use-case';
import type { ListPositionsUseCase } from '@/modules/positions/application/use-cases/list-positions.use-case';
import { PositionsController } from './positions.controller';

const PET_A = '018f5a3e-0000-7000-8000-000000000001';
const PET_B = '018f5a3e-0000-7000-8000-000000000002';

function requestFor(petId: string, query: unknown = {}): PetAccessRequest {
  return {
    petMembership: { petId, role: 'owner' },
    params: { petId: 'IGNORADO-viene-del-guard' },
    query,
  } as unknown as PetAccessRequest;
}

function fakeResponse() {
  const json = jest.fn();
  return { response: { json } as unknown as Response, json };
}

function controllerWith(
  last: Partial<GetLastPositionUseCase> = {},
  list: Partial<ListPositionsUseCase> = {},
) {
  return new PositionsController(
    last as GetLastPositionUseCase,
    list as ListPositionsUseCase,
  );
}

describe('R1: ambas rutas se protegen con PetAccessGuard y sin @RequirePetRole', () => {
  it('el guard esta declarado a nivel de clase', () => {
    const guards = Reflect.getMetadata(
      '__guards__',
      PositionsController,
    ) as unknown[];

    expect(guards).toContain(PetAccessGuard);
  });

  it('ningun handler exige rol: cualquier miembro activo lee posiciones', () => {
    const handler = (name: 'last' | 'list'): object =>
      Object.getOwnPropertyDescriptor(PositionsController.prototype, name)
        ?.value as object;

    expect(
      Reflect.getMetadata(PET_ROLES_KEY, PositionsController),
    ).toBeUndefined();
    expect(Reflect.getMetadata(PET_ROLES_KEY, handler('last'))).toBeUndefined();
    expect(Reflect.getMetadata(PET_ROLES_KEY, handler('list'))).toBeUndefined();
  });

  it('la feature no declara guard, decorador ni consulta de membresia propios', () => {
    const moduleSource = readFileSync(
      join(__dirname, '..', 'positions.module.ts'),
      'utf-8',
    );

    expect(moduleSource).toContain('PetsModule');
    expect(moduleSource).not.toMatch(/pet_users|petUsers|findMembership/);
  });

  it('el modulo no importa IngestionModule: la lectura no arrastra los workers (D6)', () => {
    // Sin comentarios: el modulo explica la decision, lo que no puede es
    // importar nada de src/workers/.
    const moduleCode = readFileSync(
      join(__dirname, '..', 'positions.module.ts'),
      'utf-8',
    )
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');

    expect(moduleCode).not.toMatch(/IngestionModule|workers\//);
  });
});

describe('R2: la mascota consultada sale solo de request.petMembership', () => {
  it('last usa el petId que valido el guard, no el :petId crudo', async () => {
    const execute = jest.fn().mockResolvedValue(null);
    const controller = controllerWith({ execute });
    const { response } = fakeResponse();

    await controller.last(requestFor(PET_A), response);

    expect(execute).toHaveBeenCalledWith(PET_A);
  });

  it('list usa el petId que valido el guard aunque el cursor traiga otro', async () => {
    const execute = jest
      .fn()
      .mockResolvedValue({ items: [], nextCursor: null });
    const controller = controllerWith({}, { execute });

    await controller.list(
      requestFor(PET_B, { cursor: 'cursor-de-otra-mascota' }),
    );

    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({ petId: PET_B }),
    );
  });

  it('el controller no lee @Param ni el body para decidir la mascota', () => {
    const code = readFileSync(
      join(__dirname, 'positions.controller.ts'),
      'utf-8',
    )
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');

    expect(code).not.toMatch(/@Param\(/);
    expect(code).not.toMatch(/@Body\(/);
    expect(code).toContain('petMembership.petId');
  });
});

describe('R5: last responde el body JSON null literal cuando no hay cache', () => {
  it('serializa null explicitamente en vez de dejar el body vacio', async () => {
    const controller = controllerWith({
      execute: jest.fn().mockResolvedValue(null),
    });
    const { response, json } = fakeResponse();

    await controller.last(requestFor(PET_A), response);

    expect(json).toHaveBeenCalledWith(null);
  });

  it('con cache serializa la vista de 6 claves tal cual', async () => {
    const view = {
      lat: 1,
      lng: 2,
      ts: 3,
      accuracy: null,
      battery: null,
      staleSeconds: 4,
    };
    const controller = controllerWith({
      execute: jest.fn().mockResolvedValue(view),
    });
    const { response, json } = fakeResponse();

    await controller.last(requestFor(PET_A), response);

    expect(json).toHaveBeenCalledWith(view);
  });
});

describe('R7: la query string invalida es 400 antes de tocar el caso de uso', () => {
  it('un parametro desconocido rechaza la peticion sin ejecutar la consulta', async () => {
    const execute = jest.fn();
    const controller = controllerWith({}, { execute });

    await expect(
      controller.list(requestFor(PET_A, { foo: 'bar' })),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(execute).not.toHaveBeenCalled();
  });

  it('un from que no es un instante ISO-8601 rechaza la peticion', async () => {
    const execute = jest.fn();
    const controller = controllerWith({}, { execute });

    await expect(
      controller.list(requestFor(PET_A, { from: 'ayer' })),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(execute).not.toHaveBeenCalled();
  });

  it('el 400 de validacion trae el detalle del campo', async () => {
    const controller = controllerWith({}, { execute: jest.fn() });

    const thrown = await controller
      .list(requestFor(PET_A, { includeSuspect: '1' }))
      .catch((error: BadRequestException) => error);

    expect(thrown).toBeInstanceOf(BadRequestException);
    expect((thrown as BadRequestException).getResponse()).toMatchObject({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
    });
  });
});
