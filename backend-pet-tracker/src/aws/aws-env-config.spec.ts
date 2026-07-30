import {
  MissingAwsEndpointError,
  resolveAwsConfigFromEnv,
} from './aws-clients';

describe('R2: aborta si falta AWS_ENDPOINT_URL antes de crear recursos', () => {
  it('lanza MissingAwsEndpointError si AWS_ENDPOINT_URL no está definida', () => {
    expect(() => resolveAwsConfigFromEnv({})).toThrow(MissingAwsEndpointError);
  });

  it('lanza MissingAwsEndpointError si AWS_ENDPOINT_URL está vacía', () => {
    expect(() => resolveAwsConfigFromEnv({ AWS_ENDPOINT_URL: '' })).toThrow(
      MissingAwsEndpointError,
    );
  });

  it('el mensaje de error identifica la variable faltante, sin caer a un endpoint de AWS real', () => {
    expect.assertions(1);
    try {
      resolveAwsConfigFromEnv({});
    } catch (error) {
      expect((error as Error).message).toMatch(/AWS_ENDPOINT_URL/);
    }
  });

  it('resuelve la config normalmente cuando AWS_ENDPOINT_URL sí está definida', () => {
    const config = resolveAwsConfigFromEnv({
      AWS_ENDPOINT_URL: 'http://localhost:4566',
      AWS_REGION: 'us-east-1',
      AWS_ACCESS_KEY_ID: 'test',
      AWS_SECRET_ACCESS_KEY: 'test',
    });

    expect(config.endpoint).toBe('http://localhost:4566');
  });
});
