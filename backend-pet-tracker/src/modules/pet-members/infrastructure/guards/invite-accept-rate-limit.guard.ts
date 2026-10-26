import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
export const INVITE_ACCEPT_MAX_PER_USER = 10;
export const INVITE_ACCEPT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
@Injectable()
export class InviteAcceptRateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    void context;
    return true;
  }
}
