import { ConfigService } from '@nestjs/config';
import { FakeWialonClient } from './fake-wialon.client';
import { WialonHttpClient } from './wialon-http.client';
import { createWialonClient } from './wialon.factory';

/** ConfigService de prueba respaldado por un objeto plano — sin red ni env. */
function configWith(values: Record<string, string>): ConfigService {
  return {
    get: (key: string) => values[key],
  } as unknown as ConfigService;
}

describe('R1: el factory resuelve WIALON_CLIENT con fake por default y http solo con SIM_MODE=false + token real', () => {
  it('sin config alguna resuelve FakeWialonClient (default dev: fake)', () => {
    expect(createWialonClient(configWith({}))).toBeInstanceOf(FakeWialonClient);
  });

  it('con SIM_MODE=true resuelve FakeWialonClient aunque haya token real', () => {
    const client = createWialonClient(
      configWith({ SIM_MODE: 'true', WIALON_TOKEN: 'real-token' }),
    );
    expect(client).toBeInstanceOf(FakeWialonClient);
  });

  it('con SIM_MODE distinto de false (valor arbitrario) resuelve FakeWialonClient', () => {
    const client = createWialonClient(
      configWith({ SIM_MODE: 'yes', WIALON_TOKEN: 'real-token' }),
    );
    expect(client).toBeInstanceOf(FakeWialonClient);
  });

  it('con SIM_MODE=false pero WIALON_TOKEN ausente resuelve FakeWialonClient', () => {
    const client = createWialonClient(configWith({ SIM_MODE: 'false' }));
    expect(client).toBeInstanceOf(FakeWialonClient);
  });

  it('con SIM_MODE=false pero WIALON_TOKEN vacio resuelve FakeWialonClient', () => {
    const client = createWialonClient(
      configWith({ SIM_MODE: 'false', WIALON_TOKEN: '' }),
    );
    expect(client).toBeInstanceOf(FakeWialonClient);
  });

  it('con SIM_MODE=false pero WIALON_TOKEN=PENDING resuelve FakeWialonClient', () => {
    const client = createWialonClient(
      configWith({ SIM_MODE: 'false', WIALON_TOKEN: 'PENDING' }),
    );
    expect(client).toBeInstanceOf(FakeWialonClient);
  });

  it('con SIM_MODE=false y WIALON_TOKEN real resuelve WialonHttpClient', () => {
    const client = createWialonClient(
      configWith({ SIM_MODE: 'false', WIALON_TOKEN: 'real-token' }),
    );
    expect(client).toBeInstanceOf(WialonHttpClient);
  });
});
