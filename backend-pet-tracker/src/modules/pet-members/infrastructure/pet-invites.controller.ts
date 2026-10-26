import { InviteAcceptRateLimitGuard } from './guards/invite-accept-rate-limit.guard';
import { AcceptInviteSchema } from '@/modules/pet-members/application/dto/accept-invite.dto';
import { z, ZodType } from 'zod';
import { mapPetMemberError } from './mappers/pet-member-error.mapper';
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
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import type { CurrentUserPayload } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import { RequirePetRole } from '@/modules/pets/infrastructure/decorators/require-pet-role.decorator';
import { CreatePetInviteUseCase } from '@/modules/pet-members/application/use-cases/create-pet-invite.use-case';
import { ListPetInvitesUseCase } from '@/modules/pet-members/application/use-cases/list-pet-invites.use-case';
import { RevokePetInviteUseCase } from '@/modules/pet-members/application/use-cases/revoke-pet-invite.use-case';
import { AcceptPetInviteUseCase } from '@/modules/pet-members/application/use-cases/accept-pet-invite.use-case';

@Controller('pets/:petId/invites')
export class PetInvitesController {
  constructor(
    private readonly createInvite: CreatePetInviteUseCase,
    private readonly listInvites: ListPetInvitesUseCase,
    private readonly revokeInvite: RevokePetInviteUseCase,
  ) {}
  @Post()
  @UseGuards(PetAccessGuard)
  @RequirePetRole('owner')
  async create(
    @Req() request: PetAccessRequest,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    try {
      const { invite, code } = await this.createInvite.execute(
        request.petMembership.petId,
        user.id,
        new Date(),
      );
      return {
        id: invite.id,
        code,
        role: invite.role,
        createdAt: invite.createdAt.toISOString(),
        expiresAt: invite.expiresAt.toISOString(),
      };
    } catch (error) {
      throw mapPetMemberError(error);
    }
  }
  @Get()
  @UseGuards(PetAccessGuard)
  @RequirePetRole('owner')
  async list(@Req() request: PetAccessRequest) {
    const invites = await this.listInvites.execute(
      request.petMembership.petId,
      new Date(),
    );
    return invites.map((invite) => ({
      id: invite.id,
      role: invite.role,
      createdAt: invite.createdAt.toISOString(),
      expiresAt: invite.expiresAt.toISOString(),
    }));
  }
  @Delete(':inviteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PetAccessGuard)
  @RequirePetRole('owner')
  async revoke(
    @Req() request: PetAccessRequest,
    @Param('inviteId') inviteId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    if (!z.uuid().safeParse(inviteId).success) throw new NotFoundException();
    try {
      return await this.revokeInvite.execute(
        request.petMembership.petId,
        inviteId,
        user.id,
        new Date(),
      );
    } catch (error) {
      throw mapPetMemberError(error);
    }
  }
}
@Controller('invites')
export class InvitesController {
  constructor(private readonly acceptInvite: AcceptPetInviteUseCase) {}
  @Post('accept')
  @UseGuards(InviteAcceptRateLimitGuard)
  async accept(@Body() body: unknown, @CurrentUser() user: CurrentUserPayload) {
    const dto = parseBody(AcceptInviteSchema, body);
    try {
      return await this.acceptInvite.execute(dto.code, user.id, new Date());
    } catch (error) {
      throw mapPetMemberError(error);
    }
  }
}

function parseBody<T>(schema: ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);

  if (!result.success) {
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors: result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  return result.data;
}
