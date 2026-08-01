import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailVerificationMessage } from '@/modules/auth/domain/ports/email-verification-sender';
import { ConsoleEmailVerificationSender } from './console-email-verification-sender';

const message: EmailVerificationMessage = {
  userId: '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77',
  email: 'ada@example.com',
  token: 'kQ8s0Zr4Vv1nT7yQ2bXpL9dW3fH6jM0aC5eR8uY1oI4',
  expiresAt: new Date('2026-07-31T10:00:00.000Z'),
};

function buildSender(emailEnabled: string | undefined) {
  const config = {
    get: jest.fn<string | undefined, [string]>(() => emailEnabled),
  } as unknown as ConfigService;

  return new ConsoleEmailVerificationSender(config);
}

describe('R6: con EMAIL_ENABLED=false el token se loguea en vez de enviarse por email', () => {
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

  it('escribe un log estructurado con userId, email, token y expiresAt', async () => {
    await buildSender('false').send(message);

    expect(logLines).toHaveLength(1);
    const logged = JSON.parse(logLines[0]) as Record<string, unknown>;
    expect(logged).toMatchObject({
      userId: message.userId,
      email: message.email,
      token: message.token,
      expiresAt: message.expiresAt.toISOString(),
    });
    expect(warnLines).toHaveLength(0);
  });

  it('trata EMAIL_ENABLED ausente como false (default local)', async () => {
    await buildSender(undefined).send(message);

    expect(logLines).toHaveLength(1);
    expect(warnLines).toHaveLength(0);
  });

  it('avisa cuando EMAIL_ENABLED=true porque no hay proveedor real cableado', async () => {
    await buildSender('true').send(message);

    expect(warnLines).toHaveLength(1);
    expect(logLines).toHaveLength(1);
  });
});

describe('R7: el token solo es observable en el log del servidor', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('send() no devuelve el token a quien lo invoca', async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});

    const result: void = await buildSender('false').send(message);

    expect(result).toBeUndefined();
  });
});
