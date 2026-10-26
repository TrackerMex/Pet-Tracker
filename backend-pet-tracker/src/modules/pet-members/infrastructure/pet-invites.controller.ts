import { mapPetMemberError } from './mappers/pet-member-error.mapper';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
  list(@Req() request: PetAccessRequest) {
    return this.listInvites.execute(request.petMembership.petId, new Date());
  }
  @Delete(':inviteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PetAccessGuard)
  @RequirePetRole('owner')
  revoke(
    @Req() request: PetAccessRequest,
    @Param('inviteId') inviteId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.revokeInvite.execute(
      request.petMembership.petId,
      inviteId,
      user.id,
      new Date(),
    );
  }
}
@Controller('invites')
export class InvitesController {
  constructor(private readonly acceptInvite: AcceptPetInviteUseCase) {}
  @Post('accept')
  accept(
    @Body() body: { code: string },
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.acceptInvite.execute(body?.code, user.id, new Date());
  }
}
