import { ExecutionContext, HttpException } from '@nestjs/common';
import { InviteAcceptRateLimitGuard } from './invite-accept-rate-limit.guard';
function contextFor(id: string): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user: { id } }) }),
  } as unknown as ExecutionContext;
}
describe('#211 R10: límite de aceptación', () => {
  afterEach(() => jest.restoreAllMocks());
  it('#211 R10: deja pasar 10 peticiones del mismo usuario y la 11.ª lanza 429', () => {
    const guard = new InviteAcceptRateLimitGuard();
    const context = contextFor('a');
    for (let i = 0; i < 10; i++) expect(guard.canActivate(context)).toBe(true);
    expect(() => guard.canActivate(context)).toThrow(HttpException);
    try {
      guard.canActivate(context);
    } catch (error) {
      expect((error as HttpException).getStatus()).toBe(429);
      expect((error as HttpException).getResponse()).toEqual({
        statusCode: 429,
        message: 'Too Many Requests',
      });
    }
  });
  it('#211 R10: el contador es por usuario', () => {
    const guard = new InviteAcceptRateLimitGuard();
    for (let i = 0; i < 10; i++)
      expect(guard.canActivate(contextFor('a'))).toBe(true);
    expect(() => guard.canActivate(contextFor('a'))).toThrow(HttpException);
    expect(guard.canActivate(contextFor('b'))).toBe(true);
  });
  it('#211 R10: la ventana se reabre a los 3 600 000 ms y no antes', () => {
    const clock = jest.spyOn(Date, 'now').mockReturnValue(1000);
    const guard = new InviteAcceptRateLimitGuard();
    for (let i = 0; i < 10; i++)
      expect(guard.canActivate(contextFor('a'))).toBe(true);
    clock.mockReturnValue(1000 + 3_599_999);
    expect(() => guard.canActivate(contextFor('a'))).toThrow(HttpException);
    clock.mockReturnValue(1000 + 3_600_000);
    expect(guard.canActivate(contextFor('a'))).toBe(true);
  });
});
