import type { DeviceStatus } from '../api/types';
import {
  connectivityLabelKey,
  deviceConnectionState,
  MAP_CONNECTION_LABEL_KEY,
} from './device-connectivity';

function makeDevice(connectivity: string | null): DeviceStatus {
  return {
    model: null,
    batteryPct: null,
    connectivity,
    lastMessageAt: null,
    esn: null,
  };
}

describe('R16: la conectividad se traduce por catálogo', () => {
  it('resuelve el único valor conocido', () => {
    expect(connectivityLabelKey('online')).toBe(
      'deviceConnectivity.online',
    );
  });

  it('oculta cualquier valor de proveedor desconocido', () => {
    expect(connectivityLabelKey('LTE')).toBe(
      'deviceConnectivity.unknown',
    );
  });

  it('conserva null para que la pantalla pinte el guion', () => {
    expect(connectivityLabelKey(null)).toBeNull();
  });
});

describe('#73 R6: el estado de conexion se decide en un solo sitio', () => {
  it('resuelve offline por catalogo para Pairing', () => {
    expect(connectivityLabelKey('offline')).toBe(
      'deviceConnectivity.offline',
    );
  });

  it('sin collar es none', () => {
    expect(deviceConnectionState(null)).toBe('none');
  });

  it('collar con connectivity null es unknown, no offline', () => {
    expect(deviceConnectionState(makeDevice(null))).toBe('unknown');
  });

  it('online y offline se respetan', () => {
    expect(deviceConnectionState(makeDevice('online'))).toBe('online');
    expect(deviceConnectionState(makeDevice('offline'))).toBe('offline');
  });

  it('un valor de proveedor desconocido cae en unknown', () => {
    expect(deviceConnectionState(makeDevice('LTE'))).toBe('unknown');
  });
});

describe('#94 R1: el tile de conexión del Mapa se decide en un solo sitio', () => {
  it('resuelve online como En vivo', () => {
    expect(
      MAP_CONNECTION_LABEL_KEY[
        deviceConnectionState(makeDevice('online'))
      ].labelKey,
    ).toBe('map.live');
  });

  it('resuelve offline como Desactualizado', () => {
    expect(
      MAP_CONNECTION_LABEL_KEY[
        deviceConnectionState(makeDevice('offline'))
      ].labelKey,
    ).toBe('map.stale');
  });

  it('resuelve conectividad ausente o desconocida como Sin señal', () => {
    expect(
      MAP_CONNECTION_LABEL_KEY[
        deviceConnectionState(makeDevice(null))
      ].labelKey,
    ).toBe('map.noSignal');
    expect(
      MAP_CONNECTION_LABEL_KEY[
        deviceConnectionState(makeDevice('LTE'))
      ].labelKey,
    ).toBe('map.noSignal');
  });

  it('resuelve la ausencia de collar como Sin señal', () => {
    expect(
      MAP_CONNECTION_LABEL_KEY[deviceConnectionState(null)].labelKey,
    ).toBe('map.noSignal');
  });

  it('cubre exhaustivamente todos los estados compartidos', () => {
    expect(Object.keys(MAP_CONNECTION_LABEL_KEY).sort()).toEqual([
      'none',
      'offline',
      'online',
      'unknown',
    ]);
  });
});
