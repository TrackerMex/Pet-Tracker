import { Module } from '@nestjs/common';
import { CreateReminderUseCase } from '@/modules/reminders/application/use-cases/create-reminder.use-case';
import { REMINDER_REPOSITORY } from '@/modules/reminders/domain/repositories/reminder.repository';
import { PetRemindersController } from '@/modules/reminders/infrastructure/reminders.controller';
import { ReminderDrizzleRepository } from '@/modules/reminders/infrastructure/repositories/reminder.drizzle.repository';
import { PetsModule } from '@/modules/pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [PetRemindersController],
  providers: [
    CreateReminderUseCase,
    {
      provide: REMINDER_REPOSITORY,
      useClass: ReminderDrizzleRepository,
    },
  ],
  exports: [REMINDER_REPOSITORY],
})
export class RemindersModule {}
