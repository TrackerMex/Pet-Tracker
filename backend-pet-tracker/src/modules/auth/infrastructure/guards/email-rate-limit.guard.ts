import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { normalizeEmail } from '@/modules/auth/domain/entities/user.entity';

export const EMAIL_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
export const FORGOT_PASSWORD_MAX_PER_EMAIL = 3;
export const REGISTER_MAX_PER_IP = 10;
export const MAX_TRACKED_KEYS = 10_000;

interface RateLimitEntry {
  count: number;
  windowStartedAt: number;
}

interface EmailRequest {
  body?: {
    email?: unknown;
  };
  ip?: string;
}

@Injectable()
export class EmailRateLimitGuard implements CanActivate {
  private readonly entries = new Map<string, RateLimitEntry>();

  canActivate(context: ExecutionContext): boolean {
    const now = Date.now();
    this.pruneExpired(now);

    if (context.getHandler().name !== 'forgotPassword') {
      return true;
    }

    const request = context.switchToHttp().getRequest<EmailRequest>();
    const rawEmail = request.body?.email;
    const email =
      typeof rawEmail === 'string'
        ? normalizeEmail(rawEmail)
        : String(rawEmail);

    return this.consume(`forgot:${email}`, FORGOT_PASSWORD_MAX_PER_EMAIL, now);
  }

  private consume(key: string, maximum: number, now: number): true {
    const current = this.entries.get(key);

    if (current === undefined) {
      this.ensureCapacity();
      this.entries.set(key, { count: 1, windowStartedAt: now });
      return true;
    }

    if (current.count >= maximum) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    current.count += 1;
    return true;
  }

  private pruneExpired(now: number): void {
    for (const [key, entry] of this.entries) {
      if (now - entry.windowStartedAt >= EMAIL_RATE_LIMIT_WINDOW_MS) {
        this.entries.delete(key);
      }
    }
  }

  private ensureCapacity(): void {
    if (this.entries.size < MAX_TRACKED_KEYS) {
      return;
    }

    let oldestKey: string | undefined;
    let oldestStart = Number.POSITIVE_INFINITY;
    for (const [key, entry] of this.entries) {
      if (entry.windowStartedAt < oldestStart) {
        oldestKey = key;
        oldestStart = entry.windowStartedAt;
      }
    }

    if (oldestKey !== undefined) {
      this.entries.delete(oldestKey);
    }
  }
}
