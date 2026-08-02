import {
  DeleteMessageCommand,
  GetQueueUrlCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import type { Message } from '@aws-sdk/client-sqs';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EVENTBRIDGE_CLIENT, SQS_CLIENT } from '@/aws/aws.constants';
import { QUEUE_POSITIONS_RAW } from '@/aws/constants';
import { INGESTION_STORE } from './ingestion-store';
import type { IngestionStore } from './ingestion-store';
import { POSITIONS_DOC_CLIENT } from './ingestion.constants';
import { positionsMessageSchema } from './positions-message.schema';
import type { PositionsMessage } from './positions-message.schema';

/** Batch maximo por ReceiveMessage (R12). */
export const CONSUMER_RECEIVE_MAX_MESSAGES = 10;

/** Long-polling corto: drena rapido en tests y evita busy-loop (R12). */
export const CONSUMER_WAIT_TIME_SECONDS = 1;

// Tope de iteraciones por drenado — corta un loop infinito si la cola
// recibe mensajes mas rapido de lo que se procesan.
const MAX_DRAIN_ITERATIONS = 50;

/**
 * Consumidor de positions-raw (R12-R18): toda la logica vive en drainOnce()
 * para que los tests y el e2e lo invoquen sin esperas de reloj (D10); el
 * scheduling es una cascara aparte (IngestionSchedulerService, R8).
 *
 * Orden por mensaje (design.md): (1) parse zod — invalido: log + no-delete
 * (redrive -> DLQ, R18); (2) normalize; (3) BatchWrite DynamoDB (R13, R15);
 * (4) si asignacion activa: cache + eventos (R14, R16, R17); (5) delete.
 * Un throw en (2)-(4) deja el mensaje sin borrar sin bloquear el resto del
 * lote (R12).
 */
@Injectable()
export class PositionsConsumerService {
  private readonly logger = new Logger(PositionsConsumerService.name);
  private queueUrl: string | null = null;

  constructor(
    @Inject(INGESTION_STORE) private readonly store: IngestionStore,
    @Inject(SQS_CLIENT) private readonly sqs: SQSClient,
    @Inject(POSITIONS_DOC_CLIENT)
    private readonly documents: DynamoDBDocumentClient,
    @Inject(EVENTBRIDGE_CLIENT) private readonly eventBridge: EventBridgeClient,
  ) {}

  async drainOnce(now: Date = new Date()): Promise<void> {
    let queueUrl: string;
    try {
      queueUrl = await this.resolveQueueUrl();
    } catch (error) {
      this.logger.error({
        scope: 'consumer',
        message: `drain skipped, cannot resolve queue url: ${describeError(error)}`,
      });
      return;
    }

    for (let iteration = 0; iteration < MAX_DRAIN_ITERATIONS; iteration++) {
      const received = await this.sqs.send(
        new ReceiveMessageCommand({
          QueueUrl: queueUrl,
          MaxNumberOfMessages: CONSUMER_RECEIVE_MAX_MESSAGES,
          WaitTimeSeconds: CONSUMER_WAIT_TIME_SECONDS,
        }),
      );

      const messages = received.Messages ?? [];
      if (messages.length === 0) {
        return;
      }

      for (const sqsMessage of messages) {
        await this.consumeMessage(queueUrl, sqsMessage, now);
      }
    }
  }

  /** Procesa un mensaje; solo borra de la cola si se proceso completo. */
  private async consumeMessage(
    queueUrl: string,
    sqsMessage: Message,
    now: Date,
  ): Promise<void> {
    const parsed = this.parseBody(sqsMessage);
    if (parsed === null) {
      // R18: malformado — sin delete, la RedrivePolicy ya provisionada lo
      // llevara a la DLQ tras SQS_MAX_RECEIVE_COUNT recepciones.
      return;
    }

    try {
      await this.handleMessage(parsed, now);
      await this.sqs.send(
        new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: sqsMessage.ReceiptHandle,
        }),
      );
    } catch (error) {
      // El fallido no envenena el lote (R12): queda sin borrar y vuelve por
      // redelivery; la idempotencia de R13/R14 hace seguro el reintento.
      this.logger.error({
        scope: 'consumer',
        messageId: sqsMessage.MessageId,
        deviceId: parsed.deviceId,
        petId: parsed.petId,
        message: describeError(error),
      });
    }
  }

  private parseBody(sqsMessage: Message): PositionsMessage | null {
    let json: unknown;
    try {
      json = JSON.parse(sqsMessage.Body ?? '');
    } catch {
      this.logger.error({
        scope: 'consumer',
        messageId: sqsMessage.MessageId,
        message: 'malformed message body: invalid JSON',
      });
      return null;
    }

    const result = positionsMessageSchema.safeParse(json);
    if (!result.success) {
      this.logger.error({
        scope: 'consumer',
        messageId: sqsMessage.MessageId,
        message: `malformed message body: ${result.error.message}`,
      });
      return null;
    }

    return result.data;
  }

  private async handleMessage(
    parsed: PositionsMessage,
    now: Date,
  ): Promise<void> {
    // R13-R17 implementan normalize + DynamoDB + cache + eventos.
    void parsed;
    void now;
    return Promise.resolve();
  }

  /** El provisioning (#2) no persiste URLs: se deriva del nombre y se cachea. */
  private async resolveQueueUrl(): Promise<string> {
    if (this.queueUrl !== null) {
      return this.queueUrl;
    }

    const response = await this.sqs.send(
      new GetQueueUrlCommand({ QueueName: QUEUE_POSITIONS_RAW }),
    );
    if (!response.QueueUrl) {
      throw new Error(`queue ${QUEUE_POSITIONS_RAW} has no QueueUrl`);
    }

    this.queueUrl = response.QueueUrl;
    return this.queueUrl;
  }
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
