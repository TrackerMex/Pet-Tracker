import { Logger } from '@nestjs/common';
import { ExpoPushSender } from './expo-push-sender';
import type { ExpoPushClient } from './expo-push-sender';

const PET_ID = '01924a3f-0000-7000-8000-0000000000aa';
const ALERT_ID = '01924a3f-0000-7000-8000-0000000000bb';
const EXPO_CHUNK_SIZE = 100;

function token(index: number): string {
  return `ExponentPushToken[${String(index).padStart(6, '0')}]`;
}

/**
 * Doble del SDK (D2): nunca se toca la red ni `expo-server-sdk`. Reproduce
 * las tres piezas que R11 usa — el troceado real de Expo es de 100 mensajes.
 */
function expoDouble(
  overrides: Partial<ExpoPushClient> = {},
): ExpoPushClient & { sent: string[][] } {
  const sent: string[][] = [];

  const client = {
    isExpoPushToken: (value: unknown): boolean =>
      typeof value === 'string' && value.startsWith('ExponentPushToken['),
    chunkPushNotifications: (
      messages: { to: string }[],
    ): { to: string }[][] => {
      const chunks: { to: string }[][] = [];
      for (let i = 0; i < messages.length; i += EXPO_CHUNK_SIZE) {
        chunks.push(messages.slice(i, i + EXPO_CHUNK_SIZE));
      }
      return chunks;
    },
    sendPushNotificationsAsync: (messages: { to: string }[]) => {
      sent.push(messages.map((m) => m.to));
      return Promise.resolve(messages.map(() => ({ status: 'ok', id: 'r' })));
    },
    ...overrides,
  } as unknown as ExpoPushClient & { sent: string[][] };

  Object.defineProperty(client, 'sent', { value: sent, enumerable: true });
  return client;
}

function input(tokens: string[]) {
  return {
    messageId: 'msg-1',
    tokens,
    title: 'Firulais salió de Casa',
    body: 'Firulais salió del área segura "Casa".',
    data: { petId: PET_ID, alertId: ALERT_ID },
  };
}

describe('R11: con PUSH_ENABLED=true el envio pasa por isExpoPushToken/chunk/send', () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });
  afterEach(() => jest.restoreAllMocks());

  it('120 tokens producen mas de una llamada de envio y la union es el conjunto de R8', async () => {
    const tokens = Array.from({ length: 120 }, (_, i) => token(i));
    const expo = expoDouble();

    await new ExpoPushSender(expo).send(input(tokens));

    expect(expo.sent.length).toBeGreaterThan(1);
    expect(expo.sent.flat().sort()).toEqual([...tokens].sort());
  });

  it('descarta los tokens que isExpoPushToken rechaza, sin enviarlos', async () => {
    const expo = expoDouble();

    await new ExpoPushSender(expo).send(
      input([token(1), 'basura', token(2), '']),
    );

    expect(expo.sent.flat()).toEqual([token(1), token(2)]);
  });

  it('el mensaje Expo lleva title, body y data del mensaje SQS', async () => {
    const captured: Record<string, unknown>[] = [];
    const expo = expoDouble({
      sendPushNotificationsAsync: (messages: unknown[]) => {
        captured.push(...(messages as Record<string, unknown>[]));
        return Promise.resolve(messages.map(() => ({ status: 'ok', id: 'r' })));
      },
    } as unknown as Partial<ExpoPushClient>);

    await new ExpoPushSender(expo).send(input([token(1)]));

    expect(captured[0]).toEqual({
      to: token(1),
      title: 'Firulais salió de Casa',
      body: 'Firulais salió del área segura "Casa".',
      data: { petId: PET_ID, alertId: ALERT_ID },
    });
  });

  it('sin ningun token valido no llama al SDK', async () => {
    const expo = expoDouble();
    const results = await new ExpoPushSender(expo).send(input(['basura']));

    expect(expo.sent).toEqual([]);
    expect(results).toEqual([]);
  });
});

describe('R12: los tickets se traducen a PushResult emparejados con su token de origen', () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });
  afterEach(() => jest.restoreAllMocks());

  it('marca deviceNotRegistered solo en el ticket cuyo details.error lo dice', async () => {
    const tokens = [token(1), token(2), token(3)];
    const expo = expoDouble({
      sendPushNotificationsAsync: () =>
        Promise.resolve([
          { status: 'ok', id: 'r1' },
          {
            status: 'error',
            message: 'not registered',
            details: { error: 'DeviceNotRegistered' },
          },
          { status: 'ok', id: 'r3' },
        ]),
    } as unknown as Partial<ExpoPushClient>);

    const results = await new ExpoPushSender(expo).send(input(tokens));

    expect(results).toEqual([
      { expoToken: token(1), deviceNotRegistered: false, error: null },
      {
        expoToken: token(2),
        deviceNotRegistered: true,
        error: 'DeviceNotRegistered',
      },
      { expoToken: token(3), deviceNotRegistered: false, error: null },
    ]);
  });

  it('cualquier otro error de ticket sale con deviceNotRegistered false', async () => {
    const expo = expoDouble({
      sendPushNotificationsAsync: () =>
        Promise.resolve([
          {
            status: 'error',
            message: 'too big',
            details: { error: 'MessageTooBig' },
          },
        ]),
    } as unknown as Partial<ExpoPushClient>);

    const results = await new ExpoPushSender(expo).send(input([token(1)]));

    expect(results).toEqual([
      {
        expoToken: token(1),
        deviceNotRegistered: false,
        error: 'MessageTooBig',
      },
    ]);
  });

  it('si el SDK lanza, el error se propaga — R14 exige que el mensaje NO se borre', async () => {
    const expo = expoDouble({
      sendPushNotificationsAsync: () =>
        Promise.reject(new Error('expo unreachable')),
    });

    await expect(
      new ExpoPushSender(expo).send(input([token(1)])),
    ).rejects.toThrow('expo unreachable');
  });
});
