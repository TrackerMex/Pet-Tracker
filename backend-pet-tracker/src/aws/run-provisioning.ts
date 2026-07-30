import {
  AwsRuntimeConfig,
  createDynamoDbClient,
  createEventBridgeClient,
  createS3Client,
  createSqsClient,
  resolveAwsConfigFromEnv,
} from './aws-clients';
import {
  AwsClientBundle,
  describeProvisioningError,
  provisionAllResources,
} from './provisioning';

export interface ProvisioningLogger {
  error(message: string): void;
}

/**
 * Orquesta el ciclo completo del script standalone (R4, R5, R16): resuelve
 * config desde process.env (aborta con exit code 1 si falta
 * AWS_ENDPOINT_URL — R2), crea los 4 clientes AWS SDK v3 y provisiona los 8
 * recursos de forma idempotente. Devuelve el código de salida (nunca llama
 * a process.exit directamente, para quedar testeable sin mockear el
 * proceso).
 */
export async function runProvisioning(
  env: NodeJS.ProcessEnv,
  logger: ProvisioningLogger = console,
): Promise<number> {
  let config: AwsRuntimeConfig;
  try {
    config = resolveAwsConfigFromEnv(env);
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error));
    return 1;
  }

  const clients: AwsClientBundle = {
    sqs: createSqsClient(config),
    dynamoDb: createDynamoDbClient(config),
    s3: createS3Client(config),
    eventBridge: createEventBridgeClient(config),
  };

  try {
    await provisionAllResources(clients);
    return 0;
  } catch (error) {
    logger.error(describeProvisioningError(error, config.endpoint));
    return 1;
  } finally {
    clients.sqs.destroy();
    clients.dynamoDb.destroy();
    clients.s3.destroy();
    clients.eventBridge.destroy();
  }
}
