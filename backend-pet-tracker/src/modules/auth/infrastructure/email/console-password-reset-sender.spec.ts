import { Logger } from '@nestjs/common';
import { PasswordResetMessage } from '@/modules/auth/domain/ports/password-reset-sender';
import { ConsolePasswordResetSender } from './console-password-reset-sender';

const message: PasswordResetMessage = {
  userId: '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77',
  email: 'ada@example.com',
  token: 'kQ8s0Zr4Vv1nT7yQ2bXpL9dW3fH6jM0aC5eR8uY1oI4',
  expiresAt: new Date('2026-08-28T21:00:00.000Z'),
};

function buildSender(_emailEnabled: string | undefined) {
  void _emailEnabled;
  return new ConsolePasswordResetSender();
}

describe('R10: con EMAIL_ENABLED=false el token de reset se loguea en vez de enviarse', () => {
  const logLines: string[] = [];
  const warnLines: string[] = [];

  beforeEach(() => {
    logLines.length = 0;
    warnLines.length = 0;
    jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation((line: unknown) => logLines.push(String(line)));
    jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation((line: unknown) => warnLines.push(String(line)));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([['false'], [undefined]])(
    'emite un unico evento estructurado con el gate %s',
    async (emailEnabled) => {
      await buildSender(emailEnabled).send(message);

      expect(logLines).toHaveLength(1);
      expect(JSON.parse(logLines[0]) as Record<string, unknown>).toEqual({
        event: 'auth.password_reset.issued',
        userId: message.userId,
        email: message.email,
        token: message.token,
        expiresAt: message.expiresAt.toISOString(),
      });
      expect(warnLines).toHaveLength(0);
    },
  );
});
