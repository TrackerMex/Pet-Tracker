import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
export const INVITE_ACCEPT_MAX_PER_USER = 10;
export const INVITE_ACCEPT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
interface RateLimitEntry {
  count: number;
  windowStartedAt: number;
}
interface InviteRequest {
  user?: { id?: unknown };
}

// shortcut: the counter is per process; use shared storage when deploying multiple processes.
@Injectable()
export class InviteAcceptRateLimitGuard implements CanActivate {
  private readonly entries = new Map<string, RateLimitEntry>();
  canActivate(context: ExecutionContext): boolean {
    const now = Date.now();
    this.pruneExpired(now);
    const request = context.switchToHttp().getRequest<InviteRequest>();
    const id = request.user?.id;
    if (typeof id !== 'string') return true;
    return this.consume(id, INVITE_ACCEPT_MAX_PER_USER, now);
  }
  private consume(key: string, maximum: number, now: number): true {
    const current = this.entries.get(key);
    if (current === undefined) {
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
      if (now - entry.windowStartedAt >= INVITE_ACCEPT_RATE_LIMIT_WINDOW_MS)
        this.entries.delete(key);
    }
  }
}
