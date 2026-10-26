import { Module } from '@nestjs/common';
import { PetsModule } from '@/modules/pets/pets.module';
import { PET_MEMBER_REPOSITORY } from './domain/repositories/pet-member.repository';
import { PetMemberDrizzleRepository } from './infrastructure/repositories/pet-member.drizzle.repository';
import {
  PetInvitesController,
  InvitesController,
} from './infrastructure/pet-invites.controller';
import { PetMembersController } from './infrastructure/pet-members.controller';
import { CreatePetInviteUseCase } from './application/use-cases/create-pet-invite.use-case';
import { ListPetInvitesUseCase } from './application/use-cases/list-pet-invites.use-case';
import { RevokePetInviteUseCase } from './application/use-cases/revoke-pet-invite.use-case';
import { AcceptPetInviteUseCase } from './application/use-cases/accept-pet-invite.use-case';
import { ListPetMembersUseCase } from './application/use-cases/list-pet-members.use-case';
import { RemovePetMemberUseCase } from './application/use-cases/remove-pet-member.use-case';

@Module({
  imports: [PetsModule],
  controllers: [PetInvitesController, InvitesController, PetMembersController],
  providers: [
    CreatePetInviteUseCase,
    ListPetInvitesUseCase,
    RevokePetInviteUseCase,
    AcceptPetInviteUseCase,
    ListPetMembersUseCase,
    RemovePetMemberUseCase,
    { provide: PET_MEMBER_REPOSITORY, useClass: PetMemberDrizzleRepository },
  ],
})
export class PetMembersModule {}
