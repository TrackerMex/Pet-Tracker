import { Body, Controller, Param, Post } from '@nestjs/common';
import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import type { CurrentUserPayload } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import type { CreateReminderDto } from '@/modules/reminders/application/dto/reminder.dto';
import { CreateReminderUseCase } from '@/modules/reminders/application/use-cases/create-reminder.use-case';
import {
  ReminderResponse,
  toReminderResponse,
} from '@/modules/reminders/infrastructure/mappers/reminder.mapper';

@Controller('pets/:petId/reminders')
export class PetRemindersController {
  constructor(private readonly createReminder: CreateReminderUseCase) {}

  @Post()
  async create(
    @Param('petId') petId: string,
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateReminderDto,
  ): Promise<ReminderResponse> {
    return toReminderResponse(
      await this.createReminder.execute(petId, dto, user.id),
    );
  }
}
