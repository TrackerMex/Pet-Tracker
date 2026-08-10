import { config as loadDotenv } from 'dotenv';
import { ListQueuesCommand, SQSClient } from '@aws-sdk/client-sqs';
import {
  createSqsClient,
  resolveAwsConfigFromEnv,
} from '../src/aws/aws-clients';

loadDotenv({ path: '../.env', quiet: true });

const runSmoke = (process.env.AWS_MODE ?? '').trim().toLowerCase() === 'aws';

function assertNoStaticAccessKey(): void {
  if (process.env.AWS_ACCESS_KEY_ID) {
    throw new Error(
      'AWS_ACCESS_KEY_ID debe estar ausente para usar la sesión de aws login',
    );
  }
}

(runSmoke ? describe : describe.skip)(
  'R11: llamada de solo lectura con credenciales de sesion',
  () => {
    let client: SQSClient | undefined;

    afterAll(() => {
      client?.destroy();
    });

    it('rechaza credenciales estáticas antes de llamar a AWS', () => {
      expect(assertNoStaticAccessKey).not.toThrow();
    });

    it('lista colas sin crear recursos', async () => {
      assertNoStaticAccessKey();
      client = createSqsClient(resolveAwsConfigFromEnv(process.env));

      await expect(
        client.send(new ListQueuesCommand({})),
      ).resolves.toBeDefined();
    }, 30000);
  },
);
