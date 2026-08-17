import { Module } from '@nestjs/common';
import { SUBSCRIPTION_REPOSITORY } from './domain/repositories/subscription.repository';
import { PetTrackingGuard } from './infrastructure/guards/pet-tracking.guard';
import { SubscriptionDrizzleRepository } from './infrastructure/repositories/subscription.drizzle.repository';

@Module({
  providers: [
    PetTrackingGuard,
    {
      provide: SUBSCRIPTION_REPOSITORY,
      useClass: SubscriptionDrizzleRepository,
    },
  ],
  exports: [SUBSCRIPTION_REPOSITORY, PetTrackingGuard],
})
export class SubscriptionsModule {}
