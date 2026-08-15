import { AuditLogger } from '@/audit/audit-log.repository';
import { Device } from '@/modules/devices/domain/entities/device.entity';
import {
  DeviceAlreadyAssignedError,
  DeviceNotFoundError,
  InsufficientPetRoleError,
  PetAlreadyHasDeviceError,
  PetNotAccessibleError,
} from '@/modules/devices/domain/errors/device.errors';
import { DeviceRepository } from '@/modules/devices/domain/repositories/device.repository';
import { PetMembership } from '@/modules/pets/domain/entities/pet-membership';
import { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import {
  CLAIM_WATERMARK_LOOKBACK_MINUTES,
  ClaimDeviceUseCase,
} from './claim-device.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const DEVICE_ID = '0198c4d5-6e7f-7b12-c345-6789abcdef01';

const DTO = { petId: PET_ID, activationCode: 'ACT-001' };

function buildDevice(overrides: Partial<Device> = {}): Device {
  return new Device({
    id: DEVICE_ID,
    esn: 'SIM-001',
    imei: null,
    serialNumber: null,
    activationCode: 'ACT-001',
    wialonUnitId: '900001',
    model: 'sim-collar',
    status: 'available',
    batteryPct: null,
    connectivity: null,
    lastMessageAt: null,
    ingestWatermark: null,
    isSimulated: true,
    createdAt: new Date('2026-08-01T10:00:00.000Z'),
    updatedAt: new Date('2026-08-01T10:00:00.000Z'),
    ...overrides,
  });
}

function buildMembership(
  overrides: Partial<PetMembership> = {},
): PetMembership {
  return {
    petId: PET_ID,
    userId: USER_ID,
    role: 'owner',
    status: 'active',
    ...overrides,
  };
}

function buildDeps() {
  const findMembership = jest.fn().mockResolvedValue(buildMembership());
  const findByIdentifier = jest.fn().mockResolvedValue(buildDevice());
  const hasActiveAssignment = jest.fn().mockResolvedValue(false);
  const findActiveByPetId = jest.fn().mockResolvedValue(null);
  const claim = jest.fn().mockResolvedValue(undefined);
  const record = jest.fn().mockResolvedValue(undefined);

  const pets = { findMembership } as unknown as PetRepository;
  const devices = {
    findByIdentifier,
    hasActiveAssignment,
    findActiveByPetId,
    claim,
  } as unknown as DeviceRepository;
  const auditLogger: AuditLogger = { record };

  return {
    pets,
    devices,
    auditLogger,
    findMembership,
    findByIdentifier,
    hasActiveAssignment,
    findActiveByPetId,
    claim,
    record,
  };
}

function buildUseCase(deps: ReturnType<typeof buildDeps>) {
  return new ClaimDeviceUseCase(deps.pets, deps.devices, deps.auditLogger);
}

describe('R3: claim feliz ejecuta la transaccion con watermark now-10min', () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: new Date('2026-08-01T12:00:00.000Z') });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('delega en el repositorio y devuelve el device reclamado', async () => {
    const deps = buildDeps();
    const useCase = buildUseCase(deps);

    const device = await useCase.execute(DTO, USER_ID);

    expect(deps.findByIdentifier).toHaveBeenCalledWith({
      field: 'activationCode',
      value: 'ACT-001',
    });
    expect(deps.claim).toHaveBeenCalledWith(
      DEVICE_ID,
      PET_ID,
      new Date('2026-08-01T11:50:00.000Z'),
    );
    expect(device.id).toBe(DEVICE_ID);
    expect(CLAIM_WATERMARK_LOOKBACK_MINUTES).toBe(10);
  });
});

describe('R5: sin membresia activa el claim es 404 generico antes de tocar devices', () => {
  it('lanza PetNotAccessibleError sin fila de membresia', async () => {
    const deps = buildDeps();
    deps.findMembership.mockResolvedValue(null);
    const useCase = buildUseCase(deps);

    await expect(useCase.execute(DTO, USER_ID)).rejects.toThrow(
      PetNotAccessibleError,
    );
    expect(deps.findByIdentifier).not.toHaveBeenCalled();
    expect(deps.claim).not.toHaveBeenCalled();
    expect(deps.record).not.toHaveBeenCalled();
  });

  it('lanza PetNotAccessibleError con membresia no activa', async () => {
    const deps = buildDeps();
    deps.findMembership.mockResolvedValue(
      buildMembership({ status: 'revoked' }),
    );
    const useCase = buildUseCase(deps);

    await expect(useCase.execute(DTO, USER_ID)).rejects.toThrow(
      PetNotAccessibleError,
    );
    expect(deps.findByIdentifier).not.toHaveBeenCalled();
  });
});

describe('R6: miembro activo con rol distinto de owner recibe 403', () => {
  it('lanza InsufficientPetRoleError sin consultar devices', async () => {
    const deps = buildDeps();
    deps.findMembership.mockResolvedValue(buildMembership({ role: 'family' }));
    const useCase = buildUseCase(deps);

    await expect(useCase.execute(DTO, USER_ID)).rejects.toThrow(
      InsufficientPetRoleError,
    );
    expect(deps.findByIdentifier).not.toHaveBeenCalled();
    expect(deps.claim).not.toHaveBeenCalled();
  });
});

describe('R7: identificador sin device es DEVICE_NOT_FOUND', () => {
  it('lanza DeviceNotFoundError sin escribir nada', async () => {
    const deps = buildDeps();
    deps.findByIdentifier.mockResolvedValue(null);
    const useCase = buildUseCase(deps);

    await expect(useCase.execute(DTO, USER_ID)).rejects.toThrow(
      DeviceNotFoundError,
    );
    expect(deps.claim).not.toHaveBeenCalled();
    expect(deps.record).not.toHaveBeenCalled();
  });
});

describe('R8: device con fila activa o inactive es DEVICE_ALREADY_ASSIGNED', () => {
  it('lanza DeviceAlreadyAssignedError si existe fila activa en pet_devices', async () => {
    const deps = buildDeps();
    deps.hasActiveAssignment.mockResolvedValue(true);
    const useCase = buildUseCase(deps);

    await expect(useCase.execute(DTO, USER_ID)).rejects.toThrow(
      DeviceAlreadyAssignedError,
    );
    expect(deps.claim).not.toHaveBeenCalled();
  });

  it('lanza DeviceAlreadyAssignedError si status es inactive (D3)', async () => {
    const deps = buildDeps();
    deps.findByIdentifier.mockResolvedValue(
      buildDevice({ status: 'inactive' }),
    );
    const useCase = buildUseCase(deps);

    await expect(useCase.execute(DTO, USER_ID)).rejects.toThrow(
      DeviceAlreadyAssignedError,
    );
    expect(deps.claim).not.toHaveBeenCalled();
  });

  it('propaga el DeviceAlreadyAssignedError del repositorio (carrera 23505)', async () => {
    const deps = buildDeps();
    deps.claim.mockRejectedValue(new DeviceAlreadyAssignedError(DEVICE_ID));
    const useCase = buildUseCase(deps);

    await expect(useCase.execute(DTO, USER_ID)).rejects.toThrow(
      DeviceAlreadyAssignedError,
    );
    expect(deps.record).not.toHaveBeenCalled();
  });
});

describe('R9: mascota con collar activo es PET_ALREADY_HAS_DEVICE', () => {
  it('lanza PetAlreadyHasDeviceError sin escribir nada (D2)', async () => {
    const deps = buildDeps();
    deps.findActiveByPetId.mockResolvedValue({
      assignmentId: uuidLike(),
      device: buildDevice({ id: uuidLike() }),
    });
    const useCase = buildUseCase(deps);

    await expect(useCase.execute(DTO, USER_ID)).rejects.toThrow(
      PetAlreadyHasDeviceError,
    );
    expect(deps.claim).not.toHaveBeenCalled();
    expect(deps.record).not.toHaveBeenCalled();
  });
});

describe('R10: la auditoria device.claim corre tras el commit con meta {petId}', () => {
  it('registra la entrada sin el identificador enviado', async () => {
    const deps = buildDeps();
    const useCase = buildUseCase(deps);

    await useCase.execute(DTO, USER_ID);

    expect(deps.record).toHaveBeenCalledTimes(1);
    expect(deps.record).toHaveBeenCalledWith({
      userId: USER_ID,
      action: 'device.claim',
      entity: 'device',
      entityId: DEVICE_ID,
      meta: { petId: PET_ID },
    });
  });

  it('si la transaccion falla no se audita nada', async () => {
    const deps = buildDeps();
    deps.claim.mockRejectedValue(new Error('tx aborted'));
    const useCase = buildUseCase(deps);

    await expect(useCase.execute(DTO, USER_ID)).rejects.toThrow('tx aborted');
    expect(deps.record).not.toHaveBeenCalled();
  });
});

function uuidLike(): string {
  return '0198dead-beef-7c23-d456-789abcdef012';
}
