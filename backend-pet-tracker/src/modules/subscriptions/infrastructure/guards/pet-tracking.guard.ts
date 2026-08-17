import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DEVICE_SUBSCRIPTION_REQUIRED } from '@/modules/subscriptions/domain/errors/subscription.errors';
import { SUBSCRIPTION_REPOSITORY } from '@/modules/subscriptions/domain/repositories/subscription.repository';
import type { SubscriptionRepository } from '@/modules/subscriptions/domain/repositories/subscription.repository';

interface PetTrackingRequest {
  petMembership?: { petId: string };
}

@Injectable()
export class PetTrackingGuard implements CanActivate {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptions: SubscriptionRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<PetTrackingRequest>();
    const petId = request.petMembership?.petId;

    if (!petId) {
      throw new NotFoundException();
    }

    if (!(await this.subscriptions.isPetTracked(petId))) {
      throw new HttpException(
        {
          statusCode: HttpStatus.PAYMENT_REQUIRED,
          code: DEVICE_SUBSCRIPTION_REQUIRED,
          message: 'Pet tracking requires an active device subscription',
        },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    return true;
  }
}
