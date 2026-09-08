import { connectivityLabelKey } from './device-connectivity';

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
