import { Device } from '@/modules/devices/domain/entities/device.entity';
import { DeviceRepository } from '@/modules/devices/domain/repositories/device.repository';
import { GetPetDeviceUseCase } from './get-pet-device.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const DEVICE_ID = '0198c4d5-6e7f-7b12-c345-6789abcdef01';

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
    ingestWatermark: null,
    isSimulated: true,
    createdAt: new Date('2026-08-01T10:00:00.000Z'),
    updatedAt: new Date('2026-08-01T10:00:00.000Z'),
  });
}

describe('R11: GetPetDeviceUseCase devuelve el collar activo o null', () => {
  it('devuelve el device de la fila activa', async () => {
    const findActiveByPetId = jest.fn().mockResolvedValue({
      assignmentId: '0198dead-beef-7c23-d456-789abcdef012',
      device: buildDevice(),
    });
    const useCase = new GetPetDeviceUseCase({
      findActiveByPetId,
    } as unknown as DeviceRepository);

    const device = await useCase.execute(PET_ID);

    expect(findActiveByPetId).toHaveBeenCalledWith(PET_ID);
    expect(device?.id).toBe(DEVICE_ID);
  });

  it('devuelve null si la mascota no tiene collar activo — estado, no error', async () => {
    const useCase = new GetPetDeviceUseCase({
      findActiveByPetId: jest.fn().mockResolvedValue(null),
    } as unknown as DeviceRepository);

    await expect(useCase.execute(PET_ID)).resolves.toBeNull();
  });
});
