import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import type { CurrentUserPayload } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import { ListPetMembersUseCase } from '@/modules/pet-members/application/use-cases/list-pet-members.use-case';
import { RemovePetMemberUseCase } from '@/modules/pet-members/application/use-cases/remove-pet-member.use-case';

@Controller('pets/:petId/members')
export class PetMembersController {
  constructor(
    private readonly listMembers: ListPetMembersUseCase,
    private readonly removeMember: RemovePetMemberUseCase,
  ) {}
  @Get()
  @UseGuards(PetAccessGuard)
  async list(@Req() request: PetAccessRequest) {
    const members = await this.listMembers.execute(request.petMembership.petId);
    return members.map((member) => ({
      ...member,
      joinedAt: member.joinedAt.toISOString(),
    }));
  }
  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PetAccessGuard)
  remove(
    @Req() request: PetAccessRequest,
    @Param('userId') targetUserId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.removeMember.execute(
      request.petMembership.petId,
      { userId: user.id, role: request.petMembership.role },
      targetUserId,
    );
  }
}
