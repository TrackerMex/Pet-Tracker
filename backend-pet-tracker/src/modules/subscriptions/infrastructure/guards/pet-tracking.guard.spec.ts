import {
  ExecutionContext,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionRepository } from '@/modules/subscriptions/domain/repositories/subscription.repository';
import { PetTrackingGuard } from './pet-tracking.guard';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';

function buildGuard(entitled: boolean) {
  const isPetTracked = jest.fn().mockResolvedValue(entitled);
  const guard = new PetTrackingGuard({
    isPetTracked,
  } as unknown as SubscriptionRepository);

  return { guard, isPetTracked };
}

function buildContext(withMembership = true): ExecutionContext {
  const request = withMembership
    ? { petMembership: { petId: PET_ID, role: 'owner' } }
    : {};

  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('R8 (device-subscriptions #25): PetTrackingGuard', () => {
  it('returns the exact 402 response when the pet is not tracked', async () => {
    const { guard } = buildGuard(false);

    try {
      await guard.canActivate(buildContext());
      fail('Expected PetTrackingGuard to reject the request');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(402);
      expect((error as HttpException).getResponse()).toEqual({
        statusCode: 402,
        code: 'DEVICE_SUBSCRIPTION_REQUIRED',
        message: 'Pet tracking requires an active device subscription',
      });
    }
  });

  it('allows a tracked pet', async () => {
    const { guard, isPetTracked } = buildGuard(true);

    await expect(guard.canActivate(buildContext())).resolves.toBe(true);
    expect(isPetTracked).toHaveBeenCalledWith(PET_ID);
  });

  it('fails closed with 404 before querying when membership is missing', async () => {
    const { guard, isPetTracked } = buildGuard(true);

    await expect(guard.canActivate(buildContext(false))).rejects.toThrow(
      NotFoundException,
    );
    expect(isPetTracked).not.toHaveBeenCalled();
  });
});
