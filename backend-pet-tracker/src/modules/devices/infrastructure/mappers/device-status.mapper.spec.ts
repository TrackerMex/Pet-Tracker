import { DEVICE_ONLINE_THRESHOLD_MS } from '@/pipeline/constants';
import { toDeviceStatusResponse } from './device-status.mapper';

describe('#73 R2 (R11 de devices-claim): el estado de device deriva connectivity de lastMessageAt contra now y conserva las 5 claves', () => {
  const now = new Date('2026-09-13T12:00:00.000Z');

  it('un lastMessageAt reciente sale como online, serializado a ISO, con las 5 claves exactas', () => {
    const response = toDeviceStatusResponse(
      {
        model: 'sim-collar',
        batteryPct: 87,
        lastMessageAt: new Date(now.getTime() - 30_000),
        esn: 'SIM-001',
      },
      now,
    );

    expect(response).toEqual({
      model: 'sim-collar',
      batteryPct: 87,
      connectivity: 'online',
      lastMessageAt: '2026-09-13T11:59:30.000Z',
      esn: 'SIM-001',
    });
    expect(Object.keys(response).sort()).toEqual(
      ['model', 'batteryPct', 'connectivity', 'lastMessageAt', 'esn'].sort(),
    );
  });

  it('un lastMessageAt mas viejo que el umbral sale como offline', () => {
    const response = toDeviceStatusResponse(
      {
        model: 'sim-collar',
        batteryPct: 20,
        lastMessageAt: new Date(
          now.getTime() - DEVICE_ONLINE_THRESHOLD_MS - 1_000,
        ),
        esn: 'SIM-001',
      },
      now,
    );

    expect(response.connectivity).toBe('offline');
  });

  it('telemetria sin alimentar viaja como null: batteryPct, connectivity y lastMessageAt', () => {
    const response = toDeviceStatusResponse(
      {
        model: 'sim-collar',
        batteryPct: null,
        lastMessageAt: null,
        esn: 'SIM-001',
      },
      now,
    );

    expect(response.batteryPct).toBeNull();
    expect(response.connectivity).toBeNull();
    expect(response.lastMessageAt).toBeNull();
  });
});
