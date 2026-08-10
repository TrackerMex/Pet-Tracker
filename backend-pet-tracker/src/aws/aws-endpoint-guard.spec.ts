import {
  UnexpectedAwsEndpointError,
  resolveAwsConfigFromEnv,
} from './aws-clients';

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
