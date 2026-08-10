import type { ConfigService } from '@nestjs/config';
import {
  MissingAwsEndpointError,
  UnexpectedAwsEndpointError,
  resolveAwsClientOptions,
  resolveAwsConfigFromConfigService,
  resolveAwsConfigFromEnv,
} from './aws-clients';

function buildConfigServiceMock(env: NodeJS.ProcessEnv): ConfigService {
  return {
    get: (key: string) => env[key],
  } as unknown as ConfigService;
}

describe('R1: modo aws con AWS_ENDPOINT_URL definida aborta', () => {
  it('lanza el error nombrado para un endpoint no vacío', () => {
    expect(() =>
      resolveAwsConfigFromEnv({
        AWS_MODE: 'aws',
        AWS_ENDPOINT_URL: ' http://localhost:4566 ',
      }),
    ).toThrow(UnexpectedAwsEndpointError);
  });
});

describe('R2: el mensaje del error nombra la variable y la acción', () => {
  it('explica la causa y cómo corregir el entorno', () => {
    let thrown: unknown;

    try {
      resolveAwsConfigFromEnv({
        AWS_MODE: 'aws',
        AWS_ENDPOINT_URL: 'http://localhost:4566',
      });
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(UnexpectedAwsEndpointError);
    const message = (thrown as Error).message;
    expect(message).toMatch(/AWS_ENDPOINT_URL/);
    expect(message).toMatch(/AWS_MODE/);
    expect(message).toMatch(/process\.env/);
    expect(message).toMatch(/\.env/);
  });
});

describe('R3: modo aws sin AWS_ENDPOINT_URL no cambia', () => {
  it.each([undefined, '', '   '])(
    'acepta y normaliza el valor %p',
    (endpoint) => {
      const env: NodeJS.ProcessEnv = { AWS_MODE: 'aws' };
      if (endpoint !== undefined) {
        env.AWS_ENDPOINT_URL = endpoint;
      }

      const config = resolveAwsConfigFromEnv(env);
      const options = resolveAwsClientOptions(config);

      expect(config).toMatchObject({ mode: 'aws', endpoint: '' });
      expect('endpoint' in options).toBe(false);
      expect('credentials' in options).toBe(false);
    },
  );
});

describe('R4: modo local intacto', () => {
  const endpoint = 'http://localhost:4566';

  it('mantiene la validación estricta del resolver de entorno', () => {
    expect(() => resolveAwsConfigFromEnv({})).toThrow(MissingAwsEndpointError);
    expect(resolveAwsConfigFromEnv({ AWS_ENDPOINT_URL: endpoint }).endpoint).toBe(
      endpoint,
    );
  });

  it('mantiene la semántica permisiva de ConfigService', () => {
    expect(
      resolveAwsConfigFromConfigService(
        buildConfigServiceMock({
          AWS_MODE: 'local',
          AWS_ENDPOINT_URL: endpoint,
        }),
      ).endpoint,
    ).toBe(endpoint);
    expect(
      resolveAwsConfigFromConfigService(
        buildConfigServiceMock({ AWS_MODE: 'local' }),
      ).endpoint,
    ).toBe('');
  });
});
