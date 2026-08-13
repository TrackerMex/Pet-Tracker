import {
  GetQueueUrlCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SQS_CLIENT } from '@/aws/aws.constants';
import { QUEUE_NOTIFICATIONS } from '@/aws/constants';
import { REMINDER_REPOSITORY } from '@/modules/reminders/domain/repositories/reminder.repository';
import type { ReminderRepository } from '@/modules/reminders/domain/repositories/reminder.repository';
import { REMINDERS_SCOPE } from './reminders.constants';

@Injectable()
export class RemindersDispatchService {
  private readonly logger = new Logger(RemindersDispatchService.name);
  private queueUrl: string | null = null;

  constructor(
    @Inject(SQS_CLIENT) private readonly sqs: SQSClient,
    @Inject(REMINDER_REPOSITORY)
    private readonly reminders: ReminderRepository,
  ) {}

  async dispatchOnce(): Promise<void> {
    let queueUrl: string;
    try {
      queueUrl = await this.resolveQueueUrl();
    } catch (error) {
      this.logger.error({
        scope: REMINDERS_SCOPE,
        message: `dispatch skipped, cannot resolve queue url: ${describeError(error)}`,
      });
      return;
    }

    const dueReminders = await this.reminders.findDue(new Date());
    for (const reminder of dueReminders) {
      try {
        await this.sqs.send(
          new SendMessageCommand({ QueueUrl: queueUrl, MessageBody: '{}' }),
        );
        await this.reminders.markEnqueued(reminder.id, new Date());
      } catch (error) {
        this.logger.error({
          scope: REMINDERS_SCOPE,
          reminderId: reminder.id,
          message: describeError(error),
        });
      }
    }
  }

  /** ponytail: quinta copia; extraer a src/aws cuando se toquen los workers juntos. */
  private async resolveQueueUrl(): Promise<string> {
    if (this.queueUrl !== null) return this.queueUrl;

    const response = await this.sqs.send(
      new GetQueueUrlCommand({ QueueName: QUEUE_NOTIFICATIONS }),
    );
    if (!response.QueueUrl) {
      throw new Error(`queue ${QUEUE_NOTIFICATIONS} has no QueueUrl`);
    }
    this.queueUrl = response.QueueUrl;
    return this.queueUrl;
  }
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
