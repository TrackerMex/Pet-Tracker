import { Logger } from '@nestjs/common';
import { PasswordResetMessage } from '@/modules/auth/domain/ports/password-reset-sender';
import {
  PASSWORD_RESET_SUBJECT,
  RESEND_ENDPOINT,
  RESEND_SCOPE,
  ResendClient,
} from './resend-client';
import { ResendPasswordResetSender } from './resend-password-reset-sender';

interface CapturedRequest {
  input: unknown;
  init: RequestInit | undefined;
}

function successfulFetch(calls: CapturedRequest[]): typeof fetch {
  return ((input: unknown, init?: RequestInit) => {
    calls.push({ input, init });
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 'email-r1' }),
    });
  }) as unknown as typeof fetch;
}

function rejectingFetch(error: Error): typeof fetch {
  return () => Promise.reject(error);
}

describe('R1: el emisor de reset publica el token en POST https://api.resend.com/emails', () => {
  it('envia exclusivamente from, to, subject y text con el token y su expiracion', async () => {
    const calls: CapturedRequest[] = [];
    const apiKey = 'api-key-for-r1';
    const from = 'Pet Tracker <no-reply@mail.example.test>';
    const message: PasswordResetMessage = {
      userId: '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77',
      email: 'ada@example.com',
      token: 'reset-token-r1',
      expiresAt: new Date('2026-09-02T18:30:00.000Z'),
    };
    const client = new ResendClient(apiKey, from, successfulFetch(calls));
    const sender = new ResendPasswordResetSender(client);

    await sender.send(message);
    await client.whenIdle();

    expect(calls).toHaveLength(1);
    const request = calls[0];
    expect(String(request.input)).toBe(RESEND_ENDPOINT);
    expect(request.init).toMatchObject({
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const body = JSON.parse(String(request.init?.body)) as Record<
      string,
      unknown
    >;
    expect(body).toEqual({
      from,
      to: message.email,
      subject: PASSWORD_RESET_SUBJECT,
      text: expect.any(String),
    });
    expect(body.text).toEqual(expect.stringContaining(message.token));
    expect(body.text).toEqual(
      expect.stringContaining(message.expiresAt.toISOString()),
    );
    expect(body).not.toHaveProperty('html');
    expect(body.text).not.toEqual(expect.stringContaining('http'));
  });
});

describe('R7: el emisor de reset no escribe el token ni la API key en ningun log', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registra solo metadatos seguros tanto en exito como en fallo', async () => {
    const log = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const error = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const apiKey = 'secret-api-key-r7-reset';
    const message: PasswordResetMessage = {
      userId: '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77',
      email: 'ada@example.com',
      token: 'secret-reset-token-r7',
      expiresAt: new Date('2026-09-02T18:30:00.000Z'),
    };
    const successClient = new ResendClient(
      apiKey,
      'sender@example.com',
      successfulFetch([]),
    );

    await new ResendPasswordResetSender(successClient).send(message);
    await successClient.whenIdle();

    expect(log).toHaveBeenCalledWith({
      scope: RESEND_SCOPE,
      event: 'auth.password_reset.issued',
      userId: message.userId,
      id: 'email-r1',
    });

    const failureClient = new ResendClient(
      apiKey,
      'sender@example.com',
      rejectingFetch(
        new Error(`provider echoed ${message.token} and ${apiKey}`),
      ),
    );
    await new ResendPasswordResetSender(failureClient).send(message);
    await failureClient.whenIdle();

    const serializedLogs = JSON.stringify([
      ...log.mock.calls,
      ...warn.mock.calls,
      ...error.mock.calls,
    ]);
    expect(serializedLogs).not.toContain(message.token);
    expect(serializedLogs).not.toContain(apiKey);
  });
});
