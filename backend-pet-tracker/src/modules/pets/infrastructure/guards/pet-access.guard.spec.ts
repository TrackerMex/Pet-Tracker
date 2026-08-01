import {
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PetMembership } from '@/modules/pets/domain/entities/pet-membership';
import { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { RequirePetRole } from '../decorators/require-pet-role.decorator';
import { PetAccessGuard, PetAccessRequest } from './pet-access.guard';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';

/** Handlers de prueba: uno exige owner (R11), el otro no exige rol (R12). */
class HandlersDouble {
  @RequirePetRole('owner')
  ownerOnly(): void {}

  anyRole(): void {}
}

function buildMembership(overrides: Partial<PetMembership> = {}): PetMembership {
  return {
    petId: PET_ID,
    userId: USER_ID,
    role: 'owner',
    status: 'active',
    ...overrides,
  };
}

function buildContext(options: {
  petId: string;
  handler?: 'ownerOnly' | 'anyRole';
}) {
  const request = {
    params: { petId: options.petId },
    user: { id: USER_ID, email: 'ada@example.com' },
  } as unknown as PetAccessRequest;

  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () =>
      HandlersDouble.prototype[options.handler ?? 'anyRole'],
    getClass: () => HandlersDouble,
  } as unknown as ExecutionContext;

  return { context, request };
}

function buildGuard(membership: PetMembership | null) {
  const findMembership = jest.fn().mockResolvedValue(membership);
  const guard = new PetAccessGuard(new Reflector(), {
    findMembership,
  } as unknown as PetRepository);

  return { guard, findMembership };
}

describe('R9: sin membresia activa (o mascota inexistente) el guard responde 404', () => {
  it('lanza NotFoundException cuando no hay fila en pet_users', async () => {
    const { guard } = buildGuard(null);
    const { context } = buildContext({ petId: PET_ID });

    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
  });

  it('lanza NotFoundException cuando la membresia no esta activa', async () => {
    const { guard } = buildGuard(buildMembership({ status: 'revoked' }));
    const { context } = buildContext({ petId: PET_ID });

    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
  });

  it('consulta la membresia con el petId de la ruta y el usuario autenticado', async () => {
    const { guard, findMembership } = buildGuard(buildMembership());
    const { context } = buildContext({ petId: PET_ID });

    await guard.canActivate(context);

    expect(findMembership).toHaveBeenCalledWith(PET_ID, USER_ID);
  });
});

describe('R10: petId no-UUID responde 404 sin consultar la base', () => {
  it.each(['not-a-uuid', '123', 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz'])(
    'lanza NotFoundException para "%s" sin llamar findMembership',
    async (petId) => {
      const { guard, findMembership } = buildGuard(buildMembership());
      const { context } = buildContext({ petId });

      await expect(guard.canActivate(context)).rejects.toThrow(
        NotFoundException,
      );
      expect(findMembership).not.toHaveBeenCalled();
    },
  );
});

describe('R11: membresia activa con rol insuficiente responde 403', () => {
  it.each(['family', 'walker', 'vet'] as const)(
    'lanza ForbiddenException para role %s en un handler @RequirePetRole(owner)',
    async (role) => {
      const { guard } = buildGuard(buildMembership({ role }));
      const { context } = buildContext({ petId: PET_ID, handler: 'ownerOnly' });

      await expect(guard.canActivate(context)).rejects.toThrow(
        ForbiddenException,
      );
    },
  );

  it('deja pasar al owner en un handler @RequirePetRole(owner)', async () => {
    const { guard } = buildGuard(buildMembership({ role: 'owner' }));
    const { context } = buildContext({ petId: PET_ID, handler: 'ownerOnly' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('la falta de membresia responde 404 aunque el handler exija rol (404 precede a 403)', async () => {
    const { guard } = buildGuard(null);
    const { context } = buildContext({ petId: PET_ID, handler: 'ownerOnly' });

    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
  });
});

describe('R12: sin @RequirePetRole cualquier rol activo pasa', () => {
  it.each(['owner', 'family', 'walker', 'vet'] as const)(
    'deja pasar role %s y adjunta request.petMembership',
    async (role) => {
      const { guard } = buildGuard(buildMembership({ role }));
      const { context, request } = buildContext({ petId: PET_ID });

      await expect(guard.canActivate(context)).resolves.toBe(true);
      expect(request.petMembership).toEqual({ petId: PET_ID, role });
    },
  );
});
