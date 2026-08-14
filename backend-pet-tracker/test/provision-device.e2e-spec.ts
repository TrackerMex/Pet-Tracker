import { FakeWialonClient } from '@/integrations/wialon/fake-wialon.client';
import { WialonHttpClient } from '@/integrations/wialon/wialon-http.client';
import {
  assertRealWialonClient,
  SimulatedWialonClientError,
} from '../scripts/provision-device';

describe('R5 (device-provisioning-admin #24): assertRealWialonClient rechaza el simulador', () => {
  it('rechaza el fake y acepta el cliente HTTP real', () => {
    const fake = new FakeWialonClient({ seed: 1, homeLat: 0, homeLng: 0 });
    const real = new WialonHttpClient('https://wialon.test', 'token');

    expect(() => assertRealWialonClient(fake)).toThrow(
      SimulatedWialonClientError,
    );
    expect(() => assertRealWialonClient(real)).not.toThrow();
  });
});
