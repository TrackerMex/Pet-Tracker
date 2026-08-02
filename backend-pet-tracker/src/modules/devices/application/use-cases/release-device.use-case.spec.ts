import { AuditLogger } from '@/audit/audit-log.repository';
import { Device } from '@/modules/devices/domain/entities/device.entity';
import { DeviceNotAssignedError } from '@/modules/devices/domain/errors/device.errors';
import { DeviceRepository } from '@/modules/devices/domain/repositories/device.repository';
import { ReleaseDeviceUseCase } from './release-device.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const DEVICE_ID = '0198c4d5-6e7f-7b12-c345-6789abcdef01';
const ASSIGNMENT_ID = '0198dead-beef-7c23-d456-789abcdef012';

function buildDevice(): Device {
  return new Device({
    id: DEVICE_ID,
    esn: 'SIM-001',
    imei: null,
    serialNumber: null,
    activationCode: 'ACT-001',
    wialonUnitId: '900001',
    model: 'sim-collar',
    status: 'assigned',
    batteryPct: null,
    connectivity: null,
    lastMessageAt: null,
    ingestWatermark: new Date('2026-08-01T11:50:00.000Z'),
    isSimulated: true,
    createdAt: new Date('2026-08-01T10:00:00.000Z'),
    updatedAt: new Date('2026-08-01T10:00:00.000Z'),
  });
}

function buildDeps() {
  const findActiveByPetId = jest.fn().mockResolvedValue({
    assignmentId: ASSIGNMENT_ID,
    device: buildDevice(),
  });
  const release = jest.fn().mockResolvedValue(undefined);
  const record = jest.fn().mockResolvedValue(undefined);

  const devices = { findActiveByPetId, release } as unknown as DeviceRepository;
  const auditLogger: AuditLogger = { record };

  return { devices, auditLogger, findActiveByPetId, release, record };
}

describe('R13: el release cierra la fila activa y audita device.release', () => {
  it('libera la asignacion activa y registra la auditoria con meta {petId}', async () => {
    const deps = buildDeps();
    const useCase = new ReleaseDeviceUseCase(deps.devices, deps.auditLogger);

    await useCase.execute(PET_ID, USER_ID);

    expect(deps.findActiveByPetId).toHaveBeenCalledWith(PET_ID);
    expect(deps.release).toHaveBeenCalledWith(ASSIGNMENT_ID, DEVICE_ID);
    expect(deps.record).toHaveBeenCalledTimes(1);
    expect(deps.record).toHaveBeenCalledWith({
      userId: USER_ID,
      action: 'device.release',
      entity: 'device',
      entityId: DEVICE_ID,
      meta: { petId: PET_ID },
    });
  });

  it('si la transaccion de release falla no se audita nada', async () => {
    const deps = buildDeps();
    deps.release.mockRejectedValue(new Error('tx aborted'));
    const useCase = new ReleaseDeviceUseCase(deps.devices, deps.auditLogger);

    await expect(useCase.execute(PET_ID, USER_ID)).rejects.toThrow(
      'tx aborted',
    );
    expect(deps.record).not.toHaveBeenCalled();
  });
});

describe('R14: release sin collar activo es DEVICE_NOT_ASSIGNED', () => {
  it('lanza DeviceNotAssignedError sin escribir ni auditar', async () => {
    const deps = buildDeps();
    deps.findActiveByPetId.mockResolvedValue(null);
    const useCase = new ReleaseDeviceUseCase(deps.devices, deps.auditLogger);

    await expect(useCase.execute(PET_ID, USER_ID)).rejects.toThrow(
      DeviceNotAssignedError,
    );
    expect(deps.release).not.toHaveBeenCalled();
    expect(deps.record).not.toHaveBeenCalled();
  });
});
