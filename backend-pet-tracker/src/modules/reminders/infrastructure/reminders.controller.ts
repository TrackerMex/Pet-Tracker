import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import type { CurrentUserPayload } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import {
  CreateReminderDto,
  CreateReminderSchema,
} from '@/modules/reminders/application/dto/reminder.dto';
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
    @Body() body: unknown,
  ): Promise<ReminderResponse> {
    const dto = parseBody(body);
    return toReminderResponse(
      await this.createReminder.execute(petId, dto, user.id),
    );
  }
}

function parseBody(body: unknown): CreateReminderDto {
  const parsed = CreateReminderSchema.safeParse(body);
  if (parsed.success) return parsed.data;
  throw new BadRequestException({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Validation failed',
    errors: parsed.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  });
}
