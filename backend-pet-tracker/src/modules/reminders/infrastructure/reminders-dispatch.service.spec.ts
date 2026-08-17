import {
  GetQueueUrlCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Logger } from '@nestjs/common';
import { buildResourceNames } from '@/aws/resource-names';
import { Reminder } from '@/modules/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/modules/reminders/domain/repositories/reminder.repository';
import { RemindersDispatchService } from './reminders-dispatch.service';

const NOW = new Date('2026-08-13T18:00:00.000Z');
const QUEUE_URL = 'http://localhost:4566/000000000000/notifications';
const REMINDER_ID = '01924a3f-0000-7000-8000-0000000000cc';
const NAMES = buildResourceNames('');

function reminder(id: string, dueAt: string): Reminder {
  return new Reminder({
    id,
    petId: '01924a3f-0000-7000-8000-0000000000aa',
    type: 'custom',
    title: `Reminder ${id}`,
    dueAt: new Date(dueAt),
    advanceMinutes: 60,
    channel: 'push',
    status: 'scheduled',
    scheduleName: `reminder-${id}`,
    enqueuedAt: null,
    createdBy: '01924a3f-0000-7000-8000-0000000000bb',
  });
}

function repositoryStub() {
  const findDue = jest.fn();
  const markEnqueued = jest.fn().mockResolvedValue(undefined);
  const client = {
    create: jest.fn(),
    findDue,
    markEnqueued,
  } as unknown as jest.Mocked<ReminderRepository>;
  return { client, findDue, markEnqueued };
}

function sqsStub(failSendNumber?: number) {
  let sendNumber = 0;
  const send = jest.fn((command: unknown) => {
    if (command instanceof GetQueueUrlCommand) {
      expect(command.input.QueueName).toBe(NAMES.notifications);
      return Promise.resolve({ QueueUrl: QUEUE_URL });
    }
    if (command instanceof SendMessageCommand) {
      sendNumber += 1;
      return sendNumber === failSendNumber
        ? Promise.reject(new Error('sqs unavailable'))
        : Promise.resolve({ MessageId: `message-${sendNumber}` });
    }
    return Promise.reject(new Error('unexpected command'));
  });
  return { client: { send } as unknown as SQSClient, send };
}

describe('R5: dispatcher encola vencidos una sola vez', () => {
  let logError: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(NOW);
    logError = jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('publica en orden dueAt y marca enqueuedAt solo despues de cada send', async () => {
    const first = reminder('first', '2026-08-13T17:00:00.000Z');
    const second = reminder('second', '2026-08-13T17:30:00.000Z');
    const repository = repositoryStub();
    repository.findDue.mockResolvedValue([first, second]);
    const sqs = sqsStub();

    await new RemindersDispatchService(
      sqs.client,
      NAMES,
      repository.client,
    ).dispatchOnce();

    expect(repository.findDue).toHaveBeenCalledWith(NOW);
    expect(
      sqs.send.mock.calls
        .map((call: unknown[]) => call[0])
        .filter((command) => command instanceof SendMessageCommand),
    ).toHaveLength(2);
    expect(repository.markEnqueued.mock.calls).toEqual([
      [first.id, NOW],
      [second.id, NOW],
    ]);
  });

  it('una fila ya excluida por findDue no se reencola en el tick siguiente', async () => {
    const due = reminder('once', '2026-08-13T17:00:00.000Z');
    const repository = repositoryStub();
    repository.findDue.mockResolvedValueOnce([due]).mockResolvedValueOnce([]);
    const sqs = sqsStub();
    const service = new RemindersDispatchService(
      sqs.client,
      NAMES,
      repository.client,
    );

    await service.dispatchOnce();
    await service.dispatchOnce();

    expect(repository.markEnqueued).toHaveBeenCalledTimes(1);
    expect(
      sqs.send.mock.calls.filter(
        (call: unknown[]) => call[0] instanceof SendMessageCommand,
      ),
    ).toHaveLength(1);
  });

  it('un send fallido queda sin marcar y no frena las filas siguientes', async () => {
    const failed = reminder('failed', '2026-08-13T17:00:00.000Z');
    const sent = reminder('sent', '2026-08-13T17:30:00.000Z');
    const repository = repositoryStub();
    repository.findDue.mockResolvedValue([failed, sent]);
    const sqs = sqsStub(1);

    await new RemindersDispatchService(
      sqs.client,
      NAMES,
      repository.client,
    ).dispatchOnce();

    expect(repository.markEnqueued).toHaveBeenCalledTimes(1);
    expect(repository.markEnqueued).toHaveBeenCalledWith(sent.id, NOW);
    expect(repository.markEnqueued).not.toHaveBeenCalledWith(failed.id, NOW);
    expect(logError).toHaveBeenCalled();
  });
});

describe('R6: dispatcher publica el mensaje reminder exacto', () => {
  beforeEach(() => jest.useFakeTimers().setSystemTime(NOW));
  afterEach(() => jest.useRealTimers());

  it('incluye version, ids, scheduleName, copy y data sin claves extra', async () => {
    const due = reminder(REMINDER_ID, '2026-08-13T17:00:00.000Z');
    const repository = repositoryStub();
    repository.findDue.mockResolvedValue([due]);
    const sqs = sqsStub();

    await new RemindersDispatchService(
      sqs.client,
      NAMES,
      repository.client,
    ).dispatchOnce();

    const command = sqs.send.mock.calls
      .map((call: unknown[]) => call[0])
      .find((item) => item instanceof SendMessageCommand);
    expect(JSON.parse(command?.input.MessageBody ?? '')).toEqual({
      version: 1,
      kind: 'reminder',
      reminderId: REMINDER_ID,
      petId: due.petId,
      scheduleName: due.scheduleName,
      title: due.title,
      body: `Recordatorio: ${due.title}`,
      data: { petId: due.petId, reminderId: REMINDER_ID },
    });
  });
});
