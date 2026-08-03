import { readFileSync } from 'fs';
import { join } from 'path';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { GetDailyActivityUseCase } from '@/modules/activity/application/use-cases/get-daily-activity.use-case';
import type { ListTripsUseCase } from '@/modules/activity/application/use-cases/list-trips.use-case';
import {
  InvalidDateError,
  InvalidRangeError,
  InvalidTripIndexError,
  RangeTooLargeError,
  TripNotFoundError,
} from '@/modules/activity/domain/errors/activity.errors';
import { PET_ROLES_KEY } from '@/modules/pets/infrastructure/decorators/require-pet-role.decorator';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import { ActivityController } from './activity.controller';
import { mapActivityError } from './mappers/activity-error.mapper';
import { TripsController } from './trips.controller';

const PET_A = '018f5a3e-0000-7000-8000-00000000000a';
const MODULE_DIR = join(__dirname, '..');

/** Codigo sin comentarios: lo que el archivo explica no es lo que hace. */
function codeOf(path: string): string {
  return readFileSync(path, 'utf-8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

function requestFor(query: unknown = {}): PetAccessRequest {
  return {
    petMembership: { petId: PET_A, role: 'walker' },
    params: { petId: 'IGNORADO-viene-del-guard' },
    query,
  } as unknown as PetAccessRequest;
}

/** Primer argumento de cada invocacion, tipado sin tocar el objeto mock. */
function firstArgs(mock: jest.Mock): Array<{ petId: string }> {
  return mock.mock.calls.map((call: unknown[]) => call[0] as { petId: string });
}

function tripsController(executeMock?: jest.Mock) {
  const execute =
    executeMock ??
    jest.fn().mockResolvedValue({ date: '2026-08-02', items: [] });
  const executeOne = jest.fn().mockResolvedValue({
    date: '2026-08-02',
    trip: {
      index: 0,
      startTs: 1,
      endTs: 2,
      distanceM: 3,
      durationMin: 4,
      pointCount: 5,
      path: [],
    },
  });
  const useCase = { execute, executeOne } as unknown as ListTripsUseCase;

  return { controller: new TripsController(useCase), execute, executeOne };
}

function activityController() {
  const execute = jest.fn().mockResolvedValue({
    days: [],
    weekComparison: { distanceM: null, activeMinutes: null, walkCount: null },
  });
  const useCase = { execute } as unknown as GetDailyActivityUseCase;

  return { controller: new ActivityController(useCase), execute };
}

describe('R16: las tres rutas las autoriza PetAccessGuard, sin @RequirePetRole', () => {
  it('el guard esta declarado a nivel de clase en los dos controllers', () => {
    for (const controller of [TripsController, ActivityController]) {
      const guards = Reflect.getMetadata('__guards__', controller) as unknown[];
      expect(guards).toContain(PetAccessGuard);
    }
  });

  it('ningun handler exige rol: cualquier miembro activo lee', () => {
    const handler = (controller: object, name: string): object =>
      Object.getOwnPropertyDescriptor(controller, name)?.value as object;

    expect(Reflect.getMetadata(PET_ROLES_KEY, TripsController)).toBeUndefined();
    expect(
      Reflect.getMetadata(PET_ROLES_KEY, ActivityController),
    ).toBeUndefined();
    for (const name of ['list', 'one']) {
      expect(
        Reflect.getMetadata(
          PET_ROLES_KEY,
          handler(TripsController.prototype, name),
        ),
      ).toBeUndefined();
    }
    expect(
      Reflect.getMetadata(
        PET_ROLES_KEY,
        handler(ActivityController.prototype, 'daily'),
      ),
    ).toBeUndefined();
  });

  it('ninguna ruta es @Public()', () => {
    for (const source of ['trips.controller.ts', 'activity.controller.ts']) {
      expect(codeOf(join(MODULE_DIR, 'infrastructure', source))).not.toMatch(
        /@Public\(\)/,
      );
    }
  });

  it('la mascota sale de request.petMembership, nunca de @Param ni de la query', async () => {
    const { controller, execute, executeOne } = tripsController();
    const request = requestFor({});

    await controller.list(request);
    await controller.one(request, '0');

    expect(firstArgs(execute)[0].petId).toBe(PET_A);
    expect(firstArgs(executeOne)[0].petId).toBe(PET_A);

    const { controller: activity, execute: daily } = activityController();
    await activity.daily(request);
    expect(firstArgs(daily)[0].petId).toBe(PET_A);
  });

  it('la feature no declara guard, decorador ni consulta de membresia propios', () => {
    const moduleSource = readFileSync(
      join(MODULE_DIR, 'activity.module.ts'),
      'utf-8',
    );

    expect(moduleSource).toContain('PetsModule');
    expect(moduleSource).not.toMatch(/pet_users|petUsers|findMembership/);
  });

  it('el modulo no importa PositionsModule ni los workers de #8', () => {
    const moduleCode = readFileSync(
      join(MODULE_DIR, 'activity.module.ts'),
      'utf-8',
    )
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');

    expect(moduleCode).not.toMatch(/PositionsModule|IngestionModule|workers\//);
  });
});

describe('R17: la query string se valida entera en el borde HTTP', () => {
  it('un parametro desconocido es 400 en las tres rutas', async () => {
    const { controller } = tripsController();
    const { controller: activity } = activityController();

    await expect(
      controller.list(requestFor({ foo: 'bar' })),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      controller.one(requestFor({ foo: 'bar' }), '0'),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      activity.daily(requestFor({ foo: 'bar' })),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('la query valida llega intacta al caso de uso', async () => {
    const { controller, execute } = tripsController();
    await controller.list(requestFor({ date: '2026-08-02' }));

    expect(firstArgs(execute)[0]).toEqual({
      petId: PET_A,
      date: '2026-08-02',
    });

    const { controller: activity, execute: daily } = activityController();
    await activity.daily(requestFor({ from: '2026-08-01', to: '2026-08-02' }));
    expect(firstArgs(daily)[0]).toEqual({
      petId: PET_A,
      from: '2026-08-01',
      to: '2026-08-02',
    });
  });

  it('los errores de dominio se traducen a HTTP con su codigo', () => {
    const cases: Array<[unknown, number, string]> = [
      [new InvalidDateError('2026-13-01'), 400, 'INVALID_DATE'],
      [new InvalidRangeError(), 400, 'INVALID_RANGE'],
      [new RangeTooLargeError(), 400, 'RANGE_TOO_LARGE'],
      [new InvalidTripIndexError('-1'), 400, 'INVALID_TRIP_INDEX'],
      [new TripNotFoundError(9), 404, 'TRIP_NOT_FOUND'],
    ];

    for (const [error, status, code] of cases) {
      const mapped = mapActivityError(error);
      expect(mapped).toBeInstanceOf(
        status === 404 ? NotFoundException : BadRequestException,
      );
      const body = (mapped as BadRequestException).getResponse() as {
        statusCode: number;
        code: string;
      };
      expect(body.statusCode).toBe(status);
      expect(body.code).toBe(code);
    }
  });

  it('un error ajeno pasa sin transformar', () => {
    const error = new Error('boom');

    expect(mapActivityError(error)).toBe(error);
  });

  it('los errores de dominio no importan @nestjs/common', () => {
    expect(
      codeOf(join(MODULE_DIR, 'domain', 'errors', 'activity.errors.ts')),
    ).not.toMatch(/@nestjs/);
  });

  it('el error de dominio del caso de uso llega mapeado desde el handler', async () => {
    const { controller } = tripsController(
      jest.fn().mockRejectedValue(new InvalidDateError('2026-13-01')),
    );

    await expect(
      controller.list(requestFor({ date: '2026-13-01' })),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
