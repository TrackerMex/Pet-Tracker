import { Module } from '@nestjs/common';
import { CreateReminderUseCase } from '@/modules/reminders/application/use-cases/create-reminder.use-case';
import { UpdateReminderUseCase } from '@/modules/reminders/application/use-cases/update-reminder.use-case';
import { REMINDER_REPOSITORY } from '@/modules/reminders/domain/repositories/reminder.repository';
import {
  PetRemindersController,
  RemindersController,
} from '@/modules/reminders/infrastructure/reminders.controller';
import { RemindersDispatchService } from '@/modules/reminders/infrastructure/reminders-dispatch.service';
import { ReminderDrizzleRepository } from '@/modules/reminders/infrastructure/repositories/reminder.drizzle.repository';
import { PetsModule } from '@/modules/pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [PetRemindersController, RemindersController],
  providers: [
    CreateReminderUseCase,
    UpdateReminderUseCase,
    RemindersDispatchService,
    {
      provide: REMINDER_REPOSITORY,
      useClass: ReminderDrizzleRepository,
    },
  ],
  exports: [REMINDER_REPOSITORY],
})
export class RemindersModule {}
