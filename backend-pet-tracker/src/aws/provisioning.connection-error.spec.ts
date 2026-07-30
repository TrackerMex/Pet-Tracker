import { ListQueuesCommand, SQSClient } from '@aws-sdk/client-sqs';
import { describeProvisioningError } from './provisioning';

// R16: no se necesita LocalStack real para probar "endpoint inalcanzable" —
// un puerto real sin nada escuchando (localhost:1, privilegiado y libre en
// cualquier entorno sin root) produce el mismo ECONNREFUSED que un
// LocalStack caído, con una llamada de red genuina (sin mocks).
const UNREACHABLE_ENDPOINT = 'http://localhost:1';

describe('R16: mensaje de error claro si LocalStack no está levantado', () => {
  it('identifica el problema de conexión en vez de dejar pasar el error crudo', async () => {
    const client = new SQSClient({
      endpoint: UNREACHABLE_ENDPOINT,
      region: 'us-east-1',
      credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
      maxAttempts: 1,
    });

    expect.assertions(3);
    try {
      await client.send(new ListQueuesCommand({}));
    } catch (error) {
      const message = describeProvisioningError(error, UNREACHABLE_ENDPOINT);
      expect(message).toMatch(/LocalStack/);
      expect(message).toMatch(/docker compose up -d/);
      expect(message).not.toMatch(/^Error:\s*$/);
    } finally {
      client.destroy();
    }
  }, 10000);

  it('para un error que no es de conexión, describe el problema sin inventar que es LocalStack caído', () => {
    const genericError = new Error('AccessDenied: credenciales inválidas');

    const message = describeProvisioningError(
      genericError,
      'http://localhost:4566',
    );

    expect(message).not.toMatch(/LocalStack.*levantado/);
    expect(message).toMatch(/AccessDenied/);
  });
});
