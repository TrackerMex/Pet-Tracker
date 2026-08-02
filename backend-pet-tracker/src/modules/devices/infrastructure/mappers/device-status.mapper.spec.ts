import { toDeviceStatusResponse } from './device-status.mapper';

describe('R11: el estado de device expone exactamente las 5 claves del contrato', () => {
  it('serializa lastMessageAt a ISO y conserva los null de telemetria', () => {
    const response = toDeviceStatusResponse({
      model: 'sim-collar',
      batteryPct: 87,
      connectivity: 'lte',
      lastMessageAt: new Date('2026-08-01T11:59:00.000Z'),
      esn: 'SIM-001',
    });

    expect(response).toEqual({
      model: 'sim-collar',
      batteryPct: 87,
      connectivity: 'lte',
      lastMessageAt: '2026-08-01T11:59:00.000Z',
      esn: 'SIM-001',
    });
    expect(Object.keys(response).sort()).toEqual(
      ['model', 'batteryPct', 'connectivity', 'lastMessageAt', 'esn'].sort(),
    );
  });

  it('telemetria sin alimentar (#8) viaja como null', () => {
    const response = toDeviceStatusResponse({
      model: 'sim-collar',
      batteryPct: null,
      connectivity: null,
      lastMessageAt: null,
      esn: 'SIM-001',
    });

    expect(response.batteryPct).toBeNull();
    expect(response.connectivity).toBeNull();
    expect(response.lastMessageAt).toBeNull();
  });
});
