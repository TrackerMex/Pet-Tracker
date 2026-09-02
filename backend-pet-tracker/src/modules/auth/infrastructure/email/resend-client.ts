export const RESEND_ENDPOINT = 'https://api.resend.com/emails';

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
  private inFlight: Promise<void> = Promise.resolve();

  constructor(
    private readonly apiKey: string,
    private readonly from: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  deliver(delivery: ResendDelivery): Promise<void> {
    this.inFlight = this.fetchImpl(RESEND_ENDPOINT, {
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
    }).then(() => undefined);

    return this.inFlight;
  }

  whenIdle(): Promise<void> {
    return this.inFlight;
  }
}
