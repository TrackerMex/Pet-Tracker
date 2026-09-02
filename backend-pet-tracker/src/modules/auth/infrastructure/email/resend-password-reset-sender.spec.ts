import { PasswordResetMessage } from '@/modules/auth/domain/ports/password-reset-sender';
import {
  PASSWORD_RESET_SUBJECT,
  RESEND_ENDPOINT,
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
