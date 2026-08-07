import {
  DeleteMessageCommand,
  GetQueueUrlCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import type { Message } from '@aws-sdk/client-sqs';
import { Logger } from '@nestjs/common';
import { QUEUE_NOTIFICATIONS } from '@/aws/constants';
import type { PushTokenRepository } from '@/modules/users/domain/repositories/push-token.repository';
import { NotifierConsumerService } from './notifier-consumer.service';
import type { PushResult, PushSender } from './push-sender';

const QUEUE_URL = 'http://localhost:4566/000000000000/notifications';
const PET_ID = '01924a3f-0000-7000-8000-0000000000aa';
const ALERT_ID = '01924a3f-0000-7000-8000-0000000000bb';
const TOKEN_A = 'ExponentPushToken[aaaaaaaaaaaaaaaaaaaaAA]';
const TOKEN_B = 'ExponentPushToken[bbbbbbbbbbbbbbbbbbbbBB]';

type MockOf<T> = { [K in keyof T]: jest.Mock };

interface SqsStub {
  client: SQSClient;
  deleted: string[];
}

function sqsStub(batches: Message[][]): SqsStub {
  const deleted: string[] = [];
  let receiveIndex = 0;

  const send = jest.fn((command: unknown) => {
    if (command instanceof GetQueueUrlCommand) {
      return command.input.QueueName === QUEUE_NOTIFICATIONS
        ? Promise.resolve({ QueueUrl: QUEUE_URL })
        : Promise.reject(new Error('unexpected queue name'));
    }
    if (command instanceof ReceiveMessageCommand) {
      const batch = receiveIndex < batches.length ? batches[receiveIndex] : [];
      receiveIndex += 1;
      return Promise.resolve({ Messages: batch });
    }
    if (command instanceof DeleteMessageCommand) {
      deleted.push(command.input.ReceiptHandle as string);
      return Promise.resolve({});
    }
    return Promise.reject(new Error('unexpected command'));
  });

  return { client: { send } as unknown as SQSClient, deleted };
}

function tokensStub(tokens: string[] = []): MockOf<PushTokenRepository> {
  return {
    upsert: jest.fn(),
    deleteOwnedByUser: jest.fn(),
    findActiveMembersTokens: jest.fn().mockResolvedValue(tokens),
    deleteByToken: jest.fn().mockResolvedValue(undefined),
  };
}

function senderStub(results: PushResult[] = []): MockOf<PushSender> {
  return { send: jest.fn().mockResolvedValue(results) };
}

function validBody(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    version: 1,
    kind: 'alert',
    alertId: ALERT_ID,
    petId: PET_ID,
    title: 'Firulais salió de Casa',
    body: 'Firulais salió del área segura "Casa".',
    data: { petId: PET_ID, alertId: ALERT_ID },
    ...overrides,
  });
}

function message(body: string, handle = 'receipt-1'): Message {
  return { MessageId: `msg-${handle}`, ReceiptHandle: handle, Body: body };
}

function service(
  sqs: SqsStub,
  tokens: MockOf<PushTokenRepository>,
  sender: MockOf<PushSender>,
): NotifierConsumerService {
  return new NotifierConsumerService(sqs.client, tokens, sender);
}

describe('R7: drenado de notifications y parseo zod del contrato v1 congelado de #12', () => {
  let logError: jest.SpyInstance;

  beforeEach(() => {
    logError = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => jest.restoreAllMocks());

  it('pide lotes de 10 con long-polling de 1 s, como los otros dos consumidores', async () => {
    const sqs = sqsStub([[message(validBody())]]);
    await service(sqs, tokensStub([TOKEN_A]), senderStub()).drainOnce();

    const receive = (sqs.client.send as jest.Mock).mock.calls
      .map((call: unknown[]) => call[0])
      .find((command) => command instanceof ReceiveMessageCommand);

    expect(receive?.input.MaxNumberOfMessages).toBe(10);
    expect(receive?.input.WaitTimeSeconds).toBe(1);
  });

  it('procesa y borra un mensaje que cumple el contrato', async () => {
    const sqs = sqsStub([[message(validBody())]]);
    const sender = senderStub();
    await service(sqs, tokensStub([TOKEN_A]), sender).drainOnce();

    expect(sender.send).toHaveBeenCalledWith(
      expect.objectContaining({
        tokens: [TOKEN_A],
        title: 'Firulais salió de Casa',
        body: 'Firulais salió del área segura "Casa".',
        data: { petId: PET_ID, alertId: ALERT_ID },
      }),
    );
    expect(sqs.deleted).toEqual(['receipt-1']);
  });

  it('acepta kind alert_resolved', async () => {
    const sqs = sqsStub([[message(validBody({ kind: 'alert_resolved' }))]]);
    await service(sqs, tokensStub([TOKEN_A]), senderStub()).drainOnce();
    expect(sqs.deleted).toEqual(['receipt-1']);
  });

  it('JSON invalido: log de error y SIN delete — queda para redelivery/DLQ', async () => {
    const sqs = sqsStub([[message('{no soy json')]]);
    const sender = senderStub();
    await service(sqs, tokensStub([TOKEN_A]), sender).drainOnce();

    expect(sqs.deleted).toEqual([]);
    expect(sender.send).not.toHaveBeenCalled();
    expect(logError).toHaveBeenCalled();
  });

  it('schema incumplido o version distinta de 1: log de error y SIN delete', async () => {
    const sqs = sqsStub([
      [
        message(validBody({ version: 2 }), 'r-version'),
        message(validBody({ kind: 'nope' }), 'r-kind'),
        message(JSON.stringify({ version: 1 }), 'r-incomplete'),
        message(validBody({ data: { petId: PET_ID } }), 'r-data'),
      ],
    ]);
    await service(sqs, tokensStub([TOKEN_A]), senderStub()).drainOnce();

    expect(sqs.deleted).toEqual([]);
    expect(logError).toHaveBeenCalledTimes(4);
  });
});

describe('R8: destinatarios = push tokens de todos los miembros activos de la mascota', () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });
  afterEach(() => jest.restoreAllMocks());

  it('resuelve los destinatarios por el petId del mensaje, sin distincion de rol', async () => {
    const sqs = sqsStub([[message(validBody())]]);
    const tokens = tokensStub([TOKEN_A, TOKEN_B]);
    const sender = senderStub();

    await service(sqs, tokens, sender).drainOnce();

    expect(tokens.findActiveMembersTokens).toHaveBeenCalledWith(PET_ID);
    expect(sender.send).toHaveBeenCalledWith(
      expect.objectContaining({ tokens: [TOKEN_A, TOKEN_B] }),
    );
  });
});

describe('R10: sin tokens registrados el notifier no falla (log y fin)', () => {
  let logError: jest.SpyInstance;
  let logInfo: jest.SpyInstance;

  beforeEach(() => {
    logError = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    logInfo = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });
  afterEach(() => jest.restoreAllMocks());

  it('borra el mensaje, no llama al sender y no emite ningun log de error', async () => {
    const sqs = sqsStub([[message(validBody())]]);
    const sender = senderStub();

    await expect(
      service(sqs, tokensStub([]), sender).drainOnce(),
    ).resolves.toBeUndefined();

    expect(sender.send).not.toHaveBeenCalled();
    expect(sqs.deleted).toEqual(['receipt-1']);
    expect(logError).not.toHaveBeenCalled();
    expect(logInfo).toHaveBeenCalledWith(
      expect.objectContaining({ petId: PET_ID, recipients: 0 }),
    );
  });
});

describe('R12: ticket DeviceNotRegistered borra esa fila de push_tokens; otro error no', () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });
  afterEach(() => jest.restoreAllMocks());

  const THREE = [TOKEN_A, TOKEN_B, 'ExponentPushToken[ccccccccccccccccccccCC]'];

  it('un lote de 3 donde el segundo es DeviceNotRegistered borra solo ese token', async () => {
    const sqs = sqsStub([[message(validBody())]]);
    const tokens = tokensStub(THREE);
    const sender = senderStub(
      THREE.map((expoToken, index) => ({
        expoToken,
        deviceNotRegistered: index === 1,
        error: index === 1 ? 'DeviceNotRegistered' : null,
      })),
    );

    await service(sqs, tokens, sender).drainOnce();

    expect(tokens.deleteByToken).toHaveBeenCalledTimes(1);
    expect(tokens.deleteByToken).toHaveBeenCalledWith(TOKEN_B);
  });

  it('un lote de 3 donde el segundo es MessageTooBig no borra ninguno', async () => {
    const sqs = sqsStub([[message(validBody())]]);
    const tokens = tokensStub(THREE);
    const logError = jest.spyOn(Logger.prototype, 'error');
    const sender = senderStub(
      THREE.map((expoToken, index) => ({
        expoToken,
        deviceNotRegistered: false,
        error: index === 1 ? 'MessageTooBig' : null,
      })),
    );

    await service(sqs, tokens, sender).drainOnce();

    expect(tokens.deleteByToken).not.toHaveBeenCalled();
    expect(logError).toHaveBeenCalledTimes(1);
  });
});

describe('R13: ningun log del consumer contiene el expo_token completo', () => {
  it('el log de error de un ticket fallido solo lleva la forma redactada', async () => {
    const logged: unknown[] = [];
    jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation((...args: unknown[]) => void logged.push(...args));
    jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation((...args: unknown[]) => void logged.push(...args));

    const sqs = sqsStub([[message(validBody())]]);
    const sender = senderStub([
      {
        expoToken: TOKEN_A,
        deviceNotRegistered: false,
        error: 'ProviderError',
      },
    ]);

    await service(sqs, tokensStub([TOKEN_A]), sender).drainOnce();

    expect(logged.length).toBeGreaterThan(0);
    expect(JSON.stringify(logged)).not.toContain(TOKEN_A);
    expect(JSON.stringify(logged)).toContain('…');

    jest.restoreAllMocks();
  });
});

describe('R14: un error no controlado no envenena el resto del lote', () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });
  afterEach(() => jest.restoreAllMocks());

  it('3 mensajes, el segundo hace lanzar al store: 2 DeleteMessageCommand', async () => {
    const sqs = sqsStub([
      [
        message(validBody(), 'r-1'),
        message(validBody(), 'r-2'),
        message(validBody(), 'r-3'),
      ],
    ]);
    const tokens = tokensStub([TOKEN_A]);
    tokens.findActiveMembersTokens.mockImplementation((petId: string) => {
      const call = tokens.findActiveMembersTokens.mock.calls.length;
      return call === 2
        ? Promise.reject(new Error(`postgres unreachable for ${petId}`))
        : Promise.resolve([TOKEN_A]);
    });

    await service(sqs, tokens, senderStub()).drainOnce();

    expect(sqs.deleted).toEqual(['r-1', 'r-3']);
  });
});
