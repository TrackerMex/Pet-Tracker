import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RemindersModule } from '@/modules/reminders/reminders.module';
import { UsersModule } from '@/modules/users/users.module';
import { ConsolePushSender } from './console-push-sender';
import { ExpoPushSender } from './expo-push-sender';
import { NotifierConsumerService } from './notifier-consumer.service';
import { NotifierSchedulerService } from './notifier-scheduler.service';
import { PUSH_SENDER } from './push-sender';
import type { PushSender } from './push-sender';

/**
 * Worker notifier (R7-R15): consumidor de la cola `notifications` + cascara
 * de scheduling gateada por `NOTIFIER_ENABLED` (R15). Importa UsersModule
 * solo por PUSH_TOKEN_REPOSITORY (R8, R12) — mismo mecanismo por el que
 * AlertsEngineModule importa PetsModule. SQS_CLIENT lo resuelve AwsModule
 * (@Global()).
 *
 * **Unico** sitio donde se lee `PUSH_ENABLED` (R9/R11, D2): la rama vive en
 * este `useFactory` y no en la logica del consumer, que solo conoce el
 * puerto.
 */
@Module({
  imports: [ConfigModule, UsersModule, RemindersModule],
  providers: [
    {
      provide: PUSH_SENDER,
      inject: [ConfigService],
      useFactory: (config: ConfigService): PushSender =>
        config.get<string>('PUSH_ENABLED') === 'true'
          ? new ExpoPushSender()
          : new ConsolePushSender(),
    },
    NotifierConsumerService,
    NotifierSchedulerService,
  ],
  exports: [NotifierConsumerService],
})
export class NotifierModule {}
