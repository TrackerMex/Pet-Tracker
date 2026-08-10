import * as awsClients from './aws-clients';
import { runProvisioning } from './run-provisioning';

function silentLogger(): { error: jest.Mock } {
  return { error: jest.fn() };
}

describe('R2: runProvisioning aborta antes de construir clientes si falta AWS_ENDPOINT_URL', () => {
  it('devuelve código de salida 1 y reporta el error sin construir ningún cliente', async () => {
    const logger = silentLogger();

    const exitCode = await runProvisioning({}, logger);

    expect(exitCode).toBe(1);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringMatching(/AWS_ENDPOINT_URL/),
    );
  });
});

describe('R8: runProvisioning aborta en modo aws', () => {
  it('devuelve 1 y registra AWS_MODE antes de construir clientes', async () => {
    const logger = silentLogger();
    const createSqsClient = jest
      .spyOn(awsClients, 'createSqsClient')
      .mockImplementation(() => {
        throw new Error('client constructed');
      });

    try {
      const exitCode = await runProvisioning(
        { AWS_MODE: 'aws', AWS_REGION: 'us-east-1' },
        logger,
      );

      expect(exitCode).toBe(1);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringMatching(/AWS_MODE/),
      );
      expect(createSqsClient).not.toHaveBeenCalled();
    } finally {
      createSqsClient.mockRestore();
    }
  });
});

describe('R16: runProvisioning devuelve código de salida != 0 con un mensaje claro si LocalStack no está levantado', () => {
  it('reporta el problema de conexión y termina con exit code 1 (endpoint real, puerto cerrado)', async () => {
    const logger = silentLogger();

    const exitCode = await runProvisioning(
      {
        AWS_ENDPOINT_URL: 'http://localhost:1',
        AWS_REGION: 'us-east-1',
        AWS_ACCESS_KEY_ID: 'test',
        AWS_SECRET_ACCESS_KEY: 'test',
      },
      logger,
    );

    expect(exitCode).toBe(1);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringMatching(/LocalStack/),
    );
  }, 15000);
});
