import {
  DeleteMessageCommand,
  GetQueueUrlCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import type { Message } from '@aws-sdk/client-sqs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AWS_RESOURCE_NAMES, SQS_CLIENT } from '@/aws/aws.constants';
import type { AwsResourceNames } from '@/aws/resource-names';
import { REMINDER_REPOSITORY } from '@/modules/reminders/domain/repositories/reminder.repository';
import type { ReminderRepository } from '@/modules/reminders/domain/repositories/reminder.repository';
import { PUSH_TOKEN_REPOSITORY } from '@/modules/users/domain/repositories/push-token.repository';
import type { PushTokenRepository } from '@/modules/users/domain/repositories/push-token.repository';
import { notificationMessageSchema } from './notification-message.schema';
import type { NotificationMessage } from './notification-message.schema';
import {
  CONSUMER_RECEIVE_MAX_MESSAGES,
  CONSUMER_WAIT_TIME_SECONDS,
  MAX_DRAIN_ITERATIONS,
  NOTIFIER_SCOPE,
  redactToken,
} from './notifier.constants';
import { PUSH_SENDER } from './push-sender';
import type { PushSender } from './push-sender';

/**
 * Consumidor de la cola `notifications` (R7-R14): toda la logica vive en
 * `drainOnce()` para que los tests y el e2e lo invoquen sin esperas de reloj;
 * el scheduling es una cascara aparte (NotifierSchedulerService, R15).
 *
 * Tres caminos ante un mensaje, copiados de #12: (1) `Body` no parseable o
 * que no cumple el schema -> log de error y **sin delete** (redelivery ->
 * `notifications-dlq` via la RedrivePolicy ya provisionada, jamas a mano);
 * (2) valido cuyo procesamiento lanza -> log de error y **sin delete**, sin
 * envenenar el resto del lote; (3) procesado con exito (incluido "sin
 * destinatarios", R10) -> DeleteMessageCommand.
 *
 * `PUSH_ENABLED` no se lee aqui: la rama vive en el `useFactory` de
 * NotifierModule, y este servicio solo conoce el puerto PushSender.
 */
@Injectable()
export class NotifierConsumerService {
  private readonly logger = new Logger(NotifierConsumerService.name);
  private queueUrl: string | null = null;

  constructor(
    @Inject(SQS_CLIENT) private readonly sqs: SQSClient,
    @Inject(AWS_RESOURCE_NAMES) private readonly names: AwsResourceNames,
    @Inject(PUSH_TOKEN_REPOSITORY)
    private readonly pushTokens: PushTokenRepository,
    @Inject(PUSH_SENDER) private readonly sender: PushSender,
    @Inject(REMINDER_REPOSITORY)
    private readonly reminders?: ReminderRepository,
  ) {}

  async drainOnce(): Promise<void> {
    let queueUrl: string;
    try {
      queueUrl = await this.resolveQueueUrl();
    } catch (error) {
      this.logger.error({
        scope: NOTIFIER_SCOPE,
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
        await this.consumeMessage(queueUrl, sqsMessage);
      }
    }
  }

  private async consumeMessage(
    queueUrl: string,
    sqsMessage: Message,
  ): Promise<void> {
    const parsed = this.parseBody(sqsMessage);
    if (parsed === null) {
      // R7: sin delete — la RedrivePolicy se encarga tras 3 recepciones.
      return;
    }

    try {
      await this.notify(parsed, sqsMessage.MessageId ?? '');
      await this.sqs.send(
        new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: sqsMessage.ReceiptHandle,
        }),
      );
    } catch (error) {
      // R14: el fallido no envenena el lote — queda sin borrar y vuelve por
      // redelivery. Reenviar un push repetido es preferible a perderlo.
      this.logger.error({
        scope: NOTIFIER_SCOPE,
        messageId: sqsMessage.MessageId,
        message: describeError(error),
      });
    }
  }

  private parseBody(sqsMessage: Message): NotificationMessage | null {
    let json: unknown;
    try {
      json = JSON.parse(sqsMessage.Body ?? '');
    } catch {
      this.logger.error({
        scope: NOTIFIER_SCOPE,
        messageId: sqsMessage.MessageId,
        message: 'malformed message body: invalid JSON',
      });
      return null;
    }

    const parsed = notificationMessageSchema.safeParse(json);
    if (!parsed.success) {
      this.logger.error({
        scope: NOTIFIER_SCOPE,
        messageId: sqsMessage.MessageId,
        message: `malformed message body: ${parsed.error.message}`,
      });
      return null;
    }

    return parsed.data;
  }

  /** R8 -> R10/R9-R11 -> R12. */
  private async notify(
    message: NotificationMessage,
    messageId: string,
  ): Promise<void> {
    if (message.kind === 'reminder') {
      await this.notifyReminder(message, messageId);
      return;
    }

    await this.sendPush(message.petId, message, messageId);
  }

  private async notifyReminder(
    message: Extract<NotificationMessage, { kind: 'reminder' }>,
    messageId: string,
  ): Promise<void> {
    if (!this.reminders) throw new Error('Reminder repository unavailable');
    const reminder = await this.reminders.findById(message.reminderId);
    if (!reminder) {
      this.logReminderSkipped(messageId, message.reminderId, 'not_found');
      return;
    }
    if (reminder.status !== 'scheduled') {
      this.logReminderSkipped(messageId, message.reminderId, 'not_scheduled');
      return;
    }
    if (reminder.scheduleName !== message.scheduleName) {
      this.logReminderSkipped(messageId, message.reminderId, 'stale_schedule');
      return;
    }

    await this.sendPush(reminder.petId, message, messageId);
    await this.reminders.markSent(message.reminderId);
  }

  private logReminderSkipped(
    messageId: string,
    reminderId: string,
    skipped: 'not_found' | 'not_scheduled' | 'stale_schedule',
  ): void {
    this.logger.log({
      scope: NOTIFIER_SCOPE,
      messageId,
      reminderId,
      skipped,
    });
  }

  private async sendPush(
    petId: string,
    message: NotificationMessage,
    messageId: string,
  ): Promise<void> {
    const tokens = await this.pushTokens.findActiveMembersTokens(petId);

    if (tokens.length === 0) {
      // R10: log informativo, sin excepcion y sin llamar a Expo. El mensaje
      // se borra igual — no hay nada que reintentar.
      this.logger.log({
        scope: NOTIFIER_SCOPE,
        messageId,
        petId,
        recipients: 0,
      });
      return;
    }

    const results = await this.sender.send({
      messageId,
      tokens,
      title: message.title,
      body: message.body,
      // Los adaptadores existentes reenvian data sin inspeccionarla; su tipo
      // conserva alertId porque la rama alert de #13 esta congelada.
      data: message.data as { petId: string; alertId: string },
    });

    for (const result of results) {
      if (result.deviceNotRegistered) {
        // R12: el dispositivo desinstalo la app o revoco el token.
        await this.pushTokens.deleteByToken(result.expoToken);
        continue;
      }

      if (result.error !== null) {
        this.logger.error({
          scope: NOTIFIER_SCOPE,
          messageId,
          expoToken: redactToken(result.expoToken),
          message: result.error,
        });
      }
    }
  }

  /** El provisioning (#2) no persiste URLs: se deriva del nombre y se cachea.
   * (ponytail: cuarta copia de resolveQueueUrl — upgrade path: extraer a
   * src/aws/ cuando alguien toque los cuatro workers por otro motivo). */
  private async resolveQueueUrl(): Promise<string> {
    if (this.queueUrl !== null) {
      return this.queueUrl;
    }

    const response = await this.sqs.send(
      new GetQueueUrlCommand({ QueueName: this.names.notifications }),
    );
    if (!response.QueueUrl) {
      throw new Error(`queue ${this.names.notifications} has no QueueUrl`);
    }

    this.queueUrl = response.QueueUrl;
    return this.queueUrl;
  }
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
