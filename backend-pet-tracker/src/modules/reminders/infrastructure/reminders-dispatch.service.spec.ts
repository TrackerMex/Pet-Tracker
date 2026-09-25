import {
  GetQueueUrlCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Logger } from '@nestjs/common';
import { buildResourceNames } from '@/aws/resource-names';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
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

function petsStub(zones: Record<string, string | null | Error> = {}) {
  const findOwnerTimezone = jest.fn((petId: string) => {
    const zone = petId in zones ? zones[petId] : 'America/Mexico_City';
    return zone instanceof Error ? Promise.reject(zone) : Promise.resolve(zone);
  });
  return {
    client: { findOwnerTimezone } as unknown as PetRepository,
    findOwnerTimezone,
  };
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
      petsStub().client,
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
      petsStub().client,
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
      petsStub().client,
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
      petsStub().client,
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
      body: `Recordatorio: ${due.title} · 13 de agosto a las 11:00`,
      data: { petId: due.petId, reminderId: REMINDER_ID },
    });
  });
});

describe('#125 R2: el dispatcher escribe en el cuerpo cuándo vence, en la zona del owner de cada mascota', () => {
  const PET_A = '01924a3f-0000-7000-8000-0000000000d1';
  const PET_B = '01924a3f-0000-7000-8000-0000000000d2';
  let logError: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(NOW);
    logError = jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('dos mascotas con owners en zonas distintas: cada cuerpo con la suya', async () => {
    const first = new Reminder({
      ...reminder('first', '2026-10-01T03:30:00.000Z'),
      petId: PET_A,
    });
    const second = new Reminder({
      ...reminder('second', '2026-10-01T03:30:00.000Z'),
      petId: PET_B,
    });
    const repository = repositoryStub();
    repository.findDue.mockResolvedValue([first, second]);
    const pets = petsStub({
      [PET_A]: 'America/Mexico_City',
      [PET_B]: 'Asia/Tokyo',
    });
    const sqs = sqsStub();

    await new RemindersDispatchService(
      sqs.client,
      NAMES,
      repository.client,
      pets.client,
    ).dispatchOnce();

    expect(pets.findOwnerTimezone.mock.calls).toEqual([[PET_A], [PET_B]]);
    expect(
      sqs.send.mock.calls
        .map((call: unknown[]) => call[0])
        .filter((command) => command instanceof SendMessageCommand)
        .map(
          (command) =>
            (JSON.parse(command.input.MessageBody ?? '') as { body: string })
              .body,
        ),
    ).toEqual([
      'Recordatorio: Reminder first · 30 de septiembre a las 21:30',
      'Recordatorio: Reminder second · 1 de octubre a las 12:30',
    ]);
  });

  it('si la zona del owner no se puede leer, esa fila no se encola y las siguientes sí', async () => {
    const failed = new Reminder({
      ...reminder('failed', '2026-10-01T03:30:00.000Z'),
      petId: PET_A,
    });
    const sent = new Reminder({
      ...reminder('sent', '2026-10-01T03:30:00.000Z'),
      petId: PET_B,
    });
    const repository = repositoryStub();
    repository.findDue.mockResolvedValue([failed, sent]);
    const pets = petsStub({
      [PET_A]: new Error('db down'),
      [PET_B]: 'America/Mexico_City',
    });
    const sqs = sqsStub();

    await new RemindersDispatchService(
      sqs.client,
      NAMES,
      repository.client,
      pets.client,
    ).dispatchOnce();

    expect(
      sqs.send.mock.calls
        .map((call: unknown[]) => call[0])
        .filter((command) => command instanceof SendMessageCommand)
        .map(
          (command) =>
            (JSON.parse(command.input.MessageBody ?? '') as { body: string })
              .body,
        ),
    ).toEqual(['Recordatorio: Reminder sent · 30 de septiembre a las 21:30']);
    expect(repository.markEnqueued.mock.calls).toEqual([[sent.id, NOW]]);
    expect(logError).toHaveBeenCalled();
  });
});
