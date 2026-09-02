import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import {
  EMAIL_RATE_LIMIT_WINDOW_MS,
  FORGOT_PASSWORD_MAX_PER_EMAIL,
  REGISTER_MAX_PER_IP,
  EmailRateLimitGuard,
} from './email-rate-limit.guard';

function handlerNamed(name: 'forgotPassword' | 'register'): () => void {
  const handlers = {
    forgotPassword: () => undefined,
    register: () => undefined,
  };
  return handlers[name];
}

function contextFor(
  handler: 'forgotPassword' | 'register',
  body: unknown,
  ip = '203.0.113.10',
): ExecutionContext {
  return {
    getHandler: () => handlerNamed(handler),
    switchToHttp: () =>
      ({
        getRequest: () => ({ body, ip }),
      }) as ReturnType<ExecutionContext['switchToHttp']>,
  } as unknown as ExecutionContext;
}

function captureHttpException(action: () => unknown): HttpException {
  try {
    action();
  } catch (error) {
    expect(error).toBeInstanceOf(HttpException);
    return error as HttpException;
  }

  throw new Error('Expected HttpException');
}

describe('R8: el cuarto forgot-password del mismo email en una hora responde 429', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-02T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('normaliza el email, permite tres intentos y bloquea el cuarto', () => {
    const guard = new EmailRateLimitGuard();
    const variants = [
      ' Ada@Example.COM ',
      'ada@example.com',
      'ADA@example.com',
    ];

    for (const email of variants) {
      expect(guard.canActivate(contextFor('forgotPassword', { email }))).toBe(
        true,
      );
    }

    const error = captureHttpException(() =>
      guard.canActivate(
        contextFor('forgotPassword', { email: 'ada@example.com' }),
      ),
    );

    expect(FORGOT_PASSWORD_MAX_PER_EMAIL).toBe(3);
    expect(EMAIL_RATE_LIMIT_WINDOW_MS).toBe(3_600_000);
    expect(error.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
  });

  it('deja pasar una nueva peticion cuando vence la ventana fija', () => {
    const guard = new EmailRateLimitGuard();
    const context = contextFor('forgotPassword', {
      email: 'ada@example.com',
    });

    for (let attempt = 0; attempt < FORGOT_PASSWORD_MAX_PER_EMAIL; attempt++) {
      expect(guard.canActivate(context)).toBe(true);
    }

    jest.advanceTimersByTime(EMAIL_RATE_LIMIT_WINDOW_MS + 1);

    expect(guard.canActivate(context)).toBe(true);
  });
});

describe('R9: la undecima alta desde la misma IP en una hora responde 429', () => {
  it('limita por IP aunque cada peticion use un email diferente', () => {
    const guard = new EmailRateLimitGuard();
    const ip = '203.0.113.20';

    for (let attempt = 0; attempt < REGISTER_MAX_PER_IP; attempt++) {
      expect(
        guard.canActivate(
          contextFor(
            'register',
            { email: `person-${attempt}@example.com` },
            ip,
          ),
        ),
      ).toBe(true);
    }

    const error = captureHttpException(() =>
      guard.canActivate(
        contextFor('register', { email: 'last@example.com' }, ip),
      ),
    );

    expect(REGISTER_MAX_PER_IP).toBe(10);
    expect(error.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
  });
});
