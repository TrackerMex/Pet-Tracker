import { EmailVerificationMessage } from '@/modules/auth/domain/ports/email-verification-sender';
import {
  EMAIL_VERIFICATION_SUBJECT,
  RESEND_ENDPOINT,
  ResendClient,
} from './resend-client';
import { ResendEmailVerificationSender } from './resend-email-verification-sender';

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
      json: () => Promise.resolve({ id: 'email-r2' }),
    });
  }) as unknown as typeof fetch;
}

describe('R2: el emisor de verificacion publica su token en POST https://api.resend.com/emails', () => {
  it('envia exclusivamente from, to, subject y text con el token propio', async () => {
    const calls: CapturedRequest[] = [];
    const apiKey = 'api-key-for-r2';
    const from = 'Pet Tracker <no-reply@mail.example.test>';
    const message: EmailVerificationMessage = {
      userId: '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77',
      email: 'ada@example.com',
      token: 'verification-token-r2',
      expiresAt: new Date('2026-09-03T08:45:00.000Z'),
    };
    const client = new ResendClient(apiKey, from, successfulFetch(calls));
    const sender = new ResendEmailVerificationSender(client);

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
      subject: EMAIL_VERIFICATION_SUBJECT,
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
