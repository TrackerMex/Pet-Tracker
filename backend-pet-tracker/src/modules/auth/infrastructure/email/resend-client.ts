import { Logger } from '@nestjs/common';

export const RESEND_ENDPOINT = 'https://api.resend.com/emails';
export const RESEND_TIMEOUT_MS = 10_000;
export const RESEND_SCOPE = 'auth-email-delivery';

export const PASSWORD_RESET_SUBJECT =
  'Restablece tu contraseña de Pet Tracker';
export const EMAIL_VERIFICATION_SUBJECT =
  'Verifica tu email de Pet Tracker';

export interface ResendDelivery {
  event: string;
  userId: string;
  to: string;
  subject: string;
  text: string;
}

export class ResendClient {
  private readonly logger = new Logger(ResendClient.name);
  private inFlight: Promise<void> = Promise.resolve();

  constructor(
    private readonly apiKey: string,
    private readonly from: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  deliver(delivery: ResendDelivery): Promise<void> {
    const attempt = this.request(delivery).catch((error: unknown) => {
      this.logger.error({
        scope: RESEND_SCOPE,
        event: delivery.event,
        userId: delivery.userId,
        message: this.sanitize(this.errorMessage(error), delivery),
      });
    });

    this.inFlight = Promise.all([this.inFlight, attempt]).then(() => undefined);
    return Promise.resolve();
  }

  whenIdle(): Promise<void> {
    return this.inFlight;
  }

  private async request(delivery: ResendDelivery): Promise<void> {
    const response = await this.fetchImpl(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.from,
        to: delivery.to,
        subject: delivery.subject,
        text: delivery.text,
      }),
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
    });

    if (response.ok) {
      const payload = await this.responsePayload(response);
      this.logger.log({
        scope: RESEND_SCOPE,
        event: delivery.event,
        userId: delivery.userId,
        id: this.responseId(payload),
      });
      return;
    }

    this.logger.error({
      scope: RESEND_SCOPE,
      event: delivery.event,
      userId: delivery.userId,
      status: response.status,
      message: this.sanitize(
        await this.providerMessage(response),
        delivery,
      ),
    });
  }

  private async providerMessage(response: Response): Promise<string> {
    try {
      const payload: unknown = await response.json();
      if (
        typeof payload === 'object' &&
        payload !== null &&
        'message' in payload &&
        typeof payload.message === 'string'
      ) {
        return payload.message;
      }
    } catch {
      // The status remains actionable when the provider body is not JSON.
    }

    return `Resend request failed with status ${response.status}`;
  }

  private async responsePayload(response: Response): Promise<unknown> {
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }

  private responseId(payload: unknown): string | undefined {
    if (
      typeof payload === 'object' &&
      payload !== null &&
      'id' in payload &&
      typeof payload.id === 'string'
    ) {
      return payload.id;
    }
    return undefined;
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown Resend failure';
  }

  private sanitize(message: string, delivery: ResendDelivery): string {
    const token = delivery.text.split(/\r?\n\r?\n/)[1]?.trim();
    const secrets = [this.apiKey, delivery.text, token]
      .filter((value): value is string => Boolean(value))
      .sort((left, right) => right.length - left.length);

    return secrets.reduce(
      (safe, secret) => safe.replaceAll(secret, '[REDACTED]'),
      message,
    );
  }
}
