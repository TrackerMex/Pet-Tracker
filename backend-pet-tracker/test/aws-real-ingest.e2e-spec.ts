import { config as loadDotenv } from 'dotenv';

loadDotenv({ path: '../.env', quiet: true });

const runAwsIngest =
  (process.env.AWS_MODE ?? '').trim().toLowerCase() === 'aws';

function assertNoStaticAccessKey(): void {
  if (process.env.AWS_ACCESS_KEY_ID) {
    throw new Error(
      'AWS_ACCESS_KEY_ID debe estar ausente para usar la sesión de aws login',
    );
  }
}

(runAwsIngest ? describe : describe.skip)('R21: ingest contra AWS real', () => {
  beforeAll(() => {
    assertNoStaticAccessKey();
  });

  it('resuelve positions-raw y completa send/receive/delete', () => {
    throw new Error('R21 SQS no implementado');
  });

  it('escribe, consulta y limpia el item DynamoDB', () => {
    throw new Error('R21 DynamoDB no implementado');
  });

  it('entrega position.updated de EventBridge en geofence-events', () => {
    throw new Error('R21 EventBridge no implementado');
  });
});
