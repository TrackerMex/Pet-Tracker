import { Logger } from '@nestjs/common';
import { ConsolePushSender } from './console-push-sender';

const TOKEN_A = 'ExponentPushToken[aaaaaaaaaaaaaaaaaaxY9kQ]';
const TOKEN_B = 'ExponentPushToken[bbbbbbbbbbbbbbbbbbbbBB]';
const PET_ID = '01924a3f-0000-7000-8000-0000000000aa';
const ALERT_ID = '01924a3f-0000-7000-8000-0000000000bb';

const INPUT = {
  messageId: 'msg-1',
  tokens: [TOKEN_A, TOKEN_B],
  title: 'Firulais salió de Casa',
  body: 'Firulais salió del área segura "Casa".',
  data: { petId: PET_ID, alertId: ALERT_ID },
};

describe('R9: con PUSH_ENABLED != true se emite un log {wouldSend} y no se toca Expo', () => {
  let logged: unknown[];

  beforeEach(() => {
    logged = [];
    jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation((...args: unknown[]) => void logged.push(...args));
  });

  afterEach(() => jest.restoreAllMocks());

  it('emite exactamente UN log estructurado con {scope, messageId, wouldSend}', async () => {
    const results = await new ConsolePushSender().send(INPUT);

    expect(logged).toHaveLength(1);
    const entry = logged[0] as {
      scope: string;
      messageId: string;
      wouldSend: Record<string, unknown>;
    };
    expect(entry.scope).toBe('notifier-consumer');
    expect(entry.messageId).toBe('msg-1');
    // Sin tickets que accionar: R12 no aplica en modo consola.
    expect(results).toEqual([]);
  });

  it('wouldSend lleva title/body del mensaje SQS y recipients = conteo de R8', async () => {
    await new ConsolePushSender().send(INPUT);

    const { wouldSend } = logged[0] as {
      wouldSend: Record<string, unknown>;
    };
    expect(wouldSend.title).toBe(INPUT.title);
    expect(wouldSend.body).toBe(INPUT.body);
    expect(wouldSend.data).toEqual({ petId: PET_ID, alertId: ALERT_ID });
    expect(wouldSend.recipients).toBe(2);
  });
});

describe('R13: el log de ConsolePushSender jamas contiene el token completo', () => {
  it('wouldSend.to es la forma redactada (… + 6 ultimos caracteres)', async () => {
    const logged: unknown[] = [];
    jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation((...args: unknown[]) => void logged.push(...args));

    await new ConsolePushSender().send(INPUT);

    const serialized = JSON.stringify(logged);
    expect(serialized).not.toContain(TOKEN_A);
    expect(serialized).not.toContain(TOKEN_B);

    const { wouldSend } = logged[0] as { wouldSend: { to: string } };
    expect(wouldSend.to).toBe('…xY9kQ]');

    jest.restoreAllMocks();
  });
});
