import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Logger } from '@nestjs/common';
import { RESEND_SCOPE, ResendClient, ResendDelivery } from './resend-client';

const delivery: ResendDelivery = {
  event: 'auth.password_reset.issued',
  userId: '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77',
  to: 'ada@example.com',
  subject: 'Restablece tu contraseña',
  text: 'Token: reset-token-r5',
};

function fetchThatRejects(error: Error): typeof fetch {
  return (() => Promise.reject(error)) as unknown as typeof fetch;
}

function fetchWithResponse(
  status: number,
  payload: Record<string, unknown>,
): typeof fetch {
  return (() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(payload),
    })) as unknown as typeof fetch;
}

describe('R5: deliver resuelve antes que la respuesta del proveedor y contiene cualquier fallo', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('resuelve deliver mientras fetch sigue pendiente', async () => {
    let markFetchStarted!: () => void;
    const fetchStarted = new Promise<void>((resolve) => {
      markFetchStarted = resolve;
    });
    const pendingResponse = new Promise<Response>(() => {});
    const fetchImpl = (() => {
      markFetchStarted();
      return pendingResponse;
    }) as unknown as typeof fetch;
    const client = new ResendClient(
      'api-key-for-r5',
      'sender@example.com',
      fetchImpl,
    );

    const deliveryResult = client.deliver(delivery);
    await fetchStarted;
    const winner = await Promise.race([
      deliveryResult.then(() => 'deliver-resolved'),
      Promise.resolve().then(() => 'next-tick'),
    ]);

    expect(winner).toBe('deliver-resolved');
  });

  it('contiene un rechazo de fetch y registra el fallo', async () => {
    const error = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const client = new ResendClient(
      'api-key-for-r5',
      'sender@example.com',
      fetchThatRejects(new Error('network down')),
    );

    await expect(client.deliver(delivery)).resolves.toBeUndefined();
    await client.whenIdle();

    expect(error).toHaveBeenCalledWith({
      scope: RESEND_SCOPE,
      event: delivery.event,
      userId: delivery.userId,
      message: 'network down',
    });
  });

  it('contiene un 403 y registra status y mensaje del proveedor', async () => {
    const error = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const client = new ResendClient(
      'api-key-for-r5',
      'sender@example.com',
      fetchWithResponse(403, { message: 'domain is not verified' }),
    );

    await expect(client.deliver(delivery)).resolves.toBeUndefined();
    await client.whenIdle();

    expect(error).toHaveBeenCalledWith({
      scope: RESEND_SCOPE,
      event: delivery.event,
      userId: delivery.userId,
      status: 403,
      message: 'domain is not verified',
    });
  });
});

describe('R11: RESEND_API_KEY vive solo en el entorno, nunca en el repo', () => {
  it('declara la clave y el remitente como valores vacios en .env.example', () => {
    const envExample = readFileSync(
      resolve(process.cwd(), '../.env.example'),
      'utf8',
    );
    const lines = envExample.split(/\r?\n/);

    expect(lines).toContain('RESEND_API_KEY=');
    expect(lines).toContain('RESEND_FROM=');
  });
});
