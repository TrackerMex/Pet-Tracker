import {
  CreateQueueCommand,
  GetQueueAttributesCommand,
  GetQueueUrlCommand,
  QueueNameExists,
  SQSClient,
} from '@aws-sdk/client-sqs';
import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  ResourceInUseException,
  UpdateTimeToLiveCommand,
} from '@aws-sdk/client-dynamodb';
import {
  BucketAlreadyOwnedByYou,
  CreateBucketCommand,
  PutPublicAccessBlockCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  CreateEventBusCommand,
  EventBridgeClient,
  PutRuleCommand,
  PutTargetsCommand,
  ResourceAlreadyExistsException,
} from '@aws-sdk/client-eventbridge';
import {
  BUCKET_MEDIA,
  DETAIL_TYPE_BATTERY_LOW,
  DETAIL_TYPE_POSITION_UPDATED,
  EVENT_BUS_NAME,
  EVENT_SOURCE,
  QUEUE_GEOFENCE_EVENTS,
  QUEUE_GEOFENCE_EVENTS_DLQ,
  QUEUE_NOTIFICATIONS,
  QUEUE_NOTIFICATIONS_DLQ,
  QUEUE_POSITIONS_RAW,
  QUEUE_POSITIONS_RAW_DLQ,
  RULE_GEOFENCE_EVENTS,
  SQS_MAX_RECEIVE_COUNT,
  TABLE_POSITIONS,
  TABLE_POSITIONS_PARTITION_KEY,
  TABLE_POSITIONS_SORT_KEY,
  TABLE_POSITIONS_TTL_ATTRIBUTE,
} from './constants';

async function ensureQueue(
  client: SQSClient,
  queueName: string,
  attributes?: Record<string, string>,
): Promise<string> {
  try {
    const result = await client.send(
      new CreateQueueCommand({
        QueueName: queueName,
        Attributes: attributes,
      }),
    );
    if (!result.QueueUrl) {
      throw new Error(
        `CreateQueueCommand no devolvió QueueUrl para ${queueName}`,
      );
    }
    return result.QueueUrl;
  } catch (error) {
    // R5: idempotencia — si la cola ya existe con los mismos atributos, SQS
    // real solo devuelve la URL existente sin lanzar; si difieren, lanza
    // QueueNameExists, y recuperamos la URL vía GetQueueUrl.
    if (error instanceof QueueNameExists) {
      const existing = await client.send(
        new GetQueueUrlCommand({ QueueName: queueName }),
      );
      if (!existing.QueueUrl) {
        throw new Error(
          `GetQueueUrlCommand no devolvió QueueUrl para ${queueName}`,
        );
      }
      return existing.QueueUrl;
    }
    throw error;
  }
}

async function getQueueArn(
  client: SQSClient,
  queueUrl: string,
): Promise<string> {
  const result = await client.send(
    new GetQueueAttributesCommand({
      QueueUrl: queueUrl,
      AttributeNames: ['QueueArn'],
    }),
  );
  const arn = result.Attributes?.QueueArn;
  if (!arn) {
    throw new Error(`No se pudo resolver QueueArn para ${queueUrl}`);
  }
  return arn;
}

async function ensureQueueWithDlq(
  client: SQSClient,
  mainQueueName: string,
  dlqName: string,
): Promise<{ mainQueueUrl: string; dlqUrl: string }> {
  // R9: la DLQ se crea primero — la RedrivePolicy de la cola principal
  // necesita el ARN de la DLQ ya existente.
  const dlqUrl = await ensureQueue(client, dlqName);
  const dlqArn = await getQueueArn(client, dlqUrl);

  const mainQueueUrl = await ensureQueue(client, mainQueueName, {
    RedrivePolicy: JSON.stringify({
      deadLetterTargetArn: dlqArn,
      maxReceiveCount: SQS_MAX_RECEIVE_COUNT,
    }),
  });

  return { mainQueueUrl, dlqUrl };
}

/**
 * Crea las 4 colas SQS (R6), con RedrivePolicy de positions-raw →
 * positions-raw-dlq (R7) y notifications → notifications-dlq (R8),
 * creando siempre la DLQ antes que su cola principal (R9). Idempotente
 * (R5): correr dos veces no duplica ni lanza una excepción no controlada.
 */
export async function provisionQueues(
  client: SQSClient,
): Promise<Record<string, string>> {
  const positionsRaw = await ensureQueueWithDlq(
    client,
    QUEUE_POSITIONS_RAW,
    QUEUE_POSITIONS_RAW_DLQ,
  );
  const notifications = await ensureQueueWithDlq(
    client,
    QUEUE_NOTIFICATIONS,
    QUEUE_NOTIFICATIONS_DLQ,
  );

  return {
    [QUEUE_POSITIONS_RAW]: positionsRaw.mainQueueUrl,
    [QUEUE_POSITIONS_RAW_DLQ]: positionsRaw.dlqUrl,
    [QUEUE_NOTIFICATIONS]: notifications.mainQueueUrl,
    [QUEUE_NOTIFICATIONS_DLQ]: notifications.dlqUrl,
  };
}

async function waitForTableActive(
  client: DynamoDBClient,
  tableName: string,
  attempts = 10,
  delayMs = 500,
): Promise<void> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const result = await client.send(
      new DescribeTableCommand({ TableName: tableName }),
    );
    if (result.Table?.TableStatus === 'ACTIVE') {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error(
    `La tabla ${tableName} no llegó a ACTIVE tras ${attempts} intentos`,
  );
}

/**
 * Crea la tabla DynamoDB `positions` con pk (String, HASH) y sk (Number,
 * RANGE) (R10), y habilita TTL sobre `expires_at` (R11). DynamoDB no
 * permite fijar TTL en la misma llamada de CreateTable, así que se
 * encadena CreateTable → esperar ACTIVE → UpdateTimeToLive. Idempotente
 * (R5): ResourceInUseException al crear una tabla existente se ignora;
 * reaplicar la misma configuración de TTL no falla.
 */
export async function provisionPositionsTable(
  client: DynamoDBClient,
): Promise<void> {
  try {
    await client.send(
      new CreateTableCommand({
        TableName: TABLE_POSITIONS,
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: [
          { AttributeName: TABLE_POSITIONS_PARTITION_KEY, AttributeType: 'S' },
          { AttributeName: TABLE_POSITIONS_SORT_KEY, AttributeType: 'N' },
        ],
        KeySchema: [
          { AttributeName: TABLE_POSITIONS_PARTITION_KEY, KeyType: 'HASH' },
          { AttributeName: TABLE_POSITIONS_SORT_KEY, KeyType: 'RANGE' },
        ],
      }),
    );
  } catch (error) {
    if (!(error instanceof ResourceInUseException)) {
      throw error;
    }
  }

  await waitForTableActive(client, TABLE_POSITIONS);

  try {
    await client.send(
      new UpdateTimeToLiveCommand({
        TableName: TABLE_POSITIONS,
        TimeToLiveSpecification: {
          AttributeName: TABLE_POSITIONS_TTL_ATTRIBUTE,
          Enabled: true,
        },
      }),
    );
  } catch (error) {
    // R5: DynamoDB no tiene una excepción tipada dedicada para "TTL ya
    // habilitado con esta misma configuración" — el SDK v3 la reporta como
    // ValidationException genérica. Se ignora solo si el mensaje confirma
    // que el motivo es justamente ese (idempotencia), nunca cualquier otro
    // ValidationException.
    const isAlreadyEnabledWithSameAttribute =
      error instanceof Error &&
      error.name === 'ValidationException' &&
      /already enabled/i.test(error.message);
    if (!isAlreadyEnabledWithSameAttribute) {
      throw error;
    }
  }
}

/**
 * Crea el bucket S3 de media (R12) y lo deja sin acceso público, bloqueando
 * los 4 flags de PublicAccessBlock (R13). Idempotente (R5):
 * BucketAlreadyOwnedByYou al recrear el mismo bucket se ignora.
 */
export async function provisionMediaBucket(client: S3Client): Promise<void> {
  try {
    await client.send(new CreateBucketCommand({ Bucket: BUCKET_MEDIA }));
  } catch (error) {
    if (!(error instanceof BucketAlreadyOwnedByYou)) {
      throw error;
    }
  }

  await client.send(
    new PutPublicAccessBlockCommand({
      Bucket: BUCKET_MEDIA,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        IgnorePublicAcls: true,
        BlockPublicPolicy: true,
        RestrictPublicBuckets: true,
      },
    }),
  );
}

/**
 * Crea el bus EventBridge `pet-tracker` (R14). Idempotente (R5):
 * ResourceAlreadyExistsException se ignora.
 */
export async function provisionEventBus(
  client: EventBridgeClient,
): Promise<void> {
  try {
    await client.send(new CreateEventBusCommand({ Name: EVENT_BUS_NAME }));
  } catch (error) {
    if (!(error instanceof ResourceAlreadyExistsException)) {
      throw error;
    }
  }
}

/**
 * Cola `geofence-events` + DLQ (alerts-engine #12 R3, D2) y regla
 * EventBridge sobre el bus `pet-tracker` con target unico esa cola (R4):
 * EventPattern `{source:['pet-tracker'], detail-type:['position.updated',
 * 'battery.low']}`, sin InputTransformer — el mensaje SQS conserva el
 * sobre EventBridge completo (incluida `detail-type`), asi el worker
 * despacha por ese campo en vez de inferir el tipo de evento por la forma
 * del `detail` (D2). `ensureQueueWithDlq` reutilizada tal cual (cero
 * codigo nuevo para esa parte); `PutRuleCommand`/`PutTargetsCommand` son
 * upsert nativos — a diferencia de `CreateQueueCommand`, no requieren
 * capturar una excepcion de duplicado para ser idempotentes (R4).
 */
export async function provisionGeofenceEventsRoute(clients: {
  sqs: SQSClient;
  eventBridge: EventBridgeClient;
}): Promise<void> {
  const { mainQueueUrl } = await ensureQueueWithDlq(
    clients.sqs,
    QUEUE_GEOFENCE_EVENTS,
    QUEUE_GEOFENCE_EVENTS_DLQ,
  );
  const queueArn = await getQueueArn(clients.sqs, mainQueueUrl);

  await clients.eventBridge.send(
    new PutRuleCommand({
      Name: RULE_GEOFENCE_EVENTS,
      EventBusName: EVENT_BUS_NAME,
      EventPattern: JSON.stringify({
        source: [EVENT_SOURCE],
        'detail-type': [DETAIL_TYPE_POSITION_UPDATED, DETAIL_TYPE_BATTERY_LOW],
      }),
    }),
  );

  await clients.eventBridge.send(
    new PutTargetsCommand({
      Rule: RULE_GEOFENCE_EVENTS,
      EventBusName: EVENT_BUS_NAME,
      Targets: [{ Id: QUEUE_GEOFENCE_EVENTS, Arn: queueArn }],
    }),
  );
}

export interface AwsClientBundle {
  sqs: SQSClient;
  dynamoDb: DynamoDBClient;
  s3: S3Client;
  eventBridge: EventBridgeClient;
}

/**
 * Orquesta la creación idempotente de los recursos de LocalStack (R4): 5
 * colas SQS (con sus RedrivePolicy, DLQ primero — R6-R9, R3), la tabla
 * `positions` con TTL (R10, R11), el bucket de media sin acceso público
 * (R12, R13), el bus EventBridge (R14) y la regla de alerts-engine sobre
 * ese bus (R4, D2). Correr esta función dos veces seguidas (R5) no
 * duplica recursos ni lanza una excepción no controlada.
 */
export async function provisionAllResources(
  clients: AwsClientBundle,
): Promise<void> {
  await provisionQueues(clients.sqs);
  await provisionPositionsTable(clients.dynamoDb);
  await provisionMediaBucket(clients.s3);
  await provisionEventBus(clients.eventBridge);
  await provisionGeofenceEventsRoute(clients);
}

// AggregateError aparece en el mensaje cuando Node intenta conectar por
// IPv6 y IPv4 y ambos intentos fallan (ECONNREFUSED dual-stack) — el SDK v3
// a veces normaliza ese AggregateError a un wrapper genérico ("AWS SDK
// error wrapper for AggregateError") que pierde el .code/.errors
// originales (observado corriendo bajo ts-jest), así que se trata como
// señal de conexión igual que los códigos de red explícitos.
const CONNECTION_ERROR_PATTERN =
  /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|EHOSTUNREACH|TimeoutError|NetworkingError|AggregateError/i;

function isConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  const code = (error as NodeJS.ErrnoException).code ?? '';
  return (
    CONNECTION_ERROR_PATTERN.test(error.name) ||
    CONNECTION_ERROR_PATTERN.test(error.message) ||
    CONNECTION_ERROR_PATTERN.test(code)
  );
}

/**
 * Traduce cualquier error del provisioning a un mensaje identificable
 * (R16): si el motivo es que LocalStack no está alcanzable, el mensaje lo
 * dice explícitamente en vez de dejar pasar un stack trace crudo sin
 * contexto.
 */
export function describeProvisioningError(
  error: unknown,
  endpoint: string,
): string {
  const detail = error instanceof Error ? error.message : String(error);

  if (isConnectionError(error)) {
    return (
      `No se pudo conectar a LocalStack en ${endpoint}. ` +
      '¿Está levantado? Corre "docker compose up -d" y vuelve a intentar. ' +
      `Detalle: ${detail}`
    );
  }

  return `Error al aprovisionar recursos AWS en ${endpoint}: ${detail}`;
}
