import { Logger } from '@nestjs/common';

export const RESEND_ENDPOINT = 'https://api.resend.com/emails';
export const RESEND_TIMEOUT_MS = 10_000;
export const RESEND_SCOPE = 'auth-email-delivery';

export const PASSWORD_RESET_SUBJECT =
  'Restablece tu contraseña de Pet Tracker';

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
        message: this.errorMessage(error),
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

    if (response.ok) return;

    this.logger.error({
      scope: RESEND_SCOPE,
      event: delivery.event,
      userId: delivery.userId,
      status: response.status,
      message: await this.providerMessage(response),
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

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown Resend failure';
  }
}
