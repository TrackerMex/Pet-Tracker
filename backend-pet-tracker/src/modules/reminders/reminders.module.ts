import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreateReminderUseCase } from '@/modules/reminders/application/use-cases/create-reminder.use-case';
import { ListRemindersUseCase } from '@/modules/reminders/application/use-cases/list-reminders.use-case';
import { UpdateReminderUseCase } from '@/modules/reminders/application/use-cases/update-reminder.use-case';
import { REMINDER_REPOSITORY } from '@/modules/reminders/domain/repositories/reminder.repository';
import {
  PetRemindersController,
  RemindersController,
} from '@/modules/reminders/infrastructure/reminders.controller';
import { RemindersDispatchService } from '@/modules/reminders/infrastructure/reminders-dispatch.service';
import { RemindersSchedulerService } from '@/modules/reminders/infrastructure/reminders-scheduler.service';
import { ReminderDrizzleRepository } from '@/modules/reminders/infrastructure/repositories/reminder.drizzle.repository';
import { PetsModule } from '@/modules/pets/pets.module';

@Module({
  imports: [ConfigModule, PetsModule],
  controllers: [PetRemindersController, RemindersController],
  providers: [
    CreateReminderUseCase,
    ListRemindersUseCase,
    UpdateReminderUseCase,
    RemindersDispatchService,
    RemindersSchedulerService,
    {
      provide: REMINDER_REPOSITORY,
      useClass: ReminderDrizzleRepository,
    },
  ],
  exports: [REMINDER_REPOSITORY],
})
export class RemindersModule {}
