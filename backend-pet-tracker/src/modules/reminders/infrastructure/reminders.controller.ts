import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { ZodType } from 'zod';
import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import type { CurrentUserPayload } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import {
  CreateReminderDto,
  CreateReminderSchema,
  UpdateReminderSchema,
} from '@/modules/reminders/application/dto/reminder.dto';
import type { UpdateReminderDto } from '@/modules/reminders/application/dto/reminder.dto';
import { CreateReminderUseCase } from '@/modules/reminders/application/use-cases/create-reminder.use-case';
import { DeleteReminderUseCase } from '@/modules/reminders/application/use-cases/delete-reminder.use-case';
import { ListRemindersUseCase } from '@/modules/reminders/application/use-cases/list-reminders.use-case';
import { UpdateReminderUseCase } from '@/modules/reminders/application/use-cases/update-reminder.use-case';
import {
  ReminderResponse,
  toReminderResponse,
} from '@/modules/reminders/infrastructure/mappers/reminder.mapper';
import { mapReminderError } from '@/modules/reminders/infrastructure/mappers/reminder-error.mapper';
import { RequirePetRole } from '@/modules/pets/infrastructure/decorators/require-pet-role.decorator';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';

@Controller('pets/:petId/reminders')
@UseGuards(PetAccessGuard)
export class PetRemindersController {
  constructor(
    private readonly createReminder: CreateReminderUseCase,
    private readonly listReminders: ListRemindersUseCase,
    private readonly deleteReminder: DeleteReminderUseCase,
  ) {}

  @Post()
  @RequirePetRole('owner')
  async create(
    @Req() request: PetAccessRequest,
    @Body() body: unknown,
  ): Promise<ReminderResponse> {
    const dto = parseBody<CreateReminderDto>(CreateReminderSchema, body);
    return toReminderResponse(
      await this.createReminder.execute(
        request.petMembership.petId,
        dto,
        request.user.id,
      ),
    );
  }

  @Get()
  async list(@Req() request: PetAccessRequest): Promise<ReminderResponse[]> {
    return (await this.listReminders.execute(request.petMembership.petId)).map(
      toReminderResponse,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePetRole('owner')
  async remove(
    @Req() request: PetAccessRequest,
    @Param('id') id: string,
  ): Promise<void> {
    if (!UUID_PATTERN.test(id)) throw new NotFoundException();

    try {
      await this.deleteReminder.execute(request.petMembership.petId, id);
    } catch (error) {
      throw mapReminderError(error);
    }
  }
}

@Controller('reminders')
export class RemindersController {
  constructor(private readonly updateReminder: UpdateReminderUseCase) {}

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: unknown,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ReminderResponse> {
    if (!UUID_PATTERN.test(id)) throw new NotFoundException();
    const dto = parseBody<UpdateReminderDto>(UpdateReminderSchema, body);

    try {
      return toReminderResponse(
        await this.updateReminder.execute(id, dto, user.id),
      );
    } catch (error) {
      throw mapReminderError(error);
    }
  }
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseBody<T>(schema: ZodType<T>, body: unknown): T {
  const parsed = schema.safeParse(body);
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
