import { ConflictException, HttpStatus } from '@nestjs/common';
import {
  PendingInvitesLimitError,
  PetMembersLimitError,
} from '@/modules/pet-members/domain/errors/pet-member.errors';

export function mapPetMemberError(error: unknown): unknown {
  if (error instanceof PendingInvitesLimitError)
    return new ConflictException({
      statusCode: HttpStatus.CONFLICT,
      code: 'PET_INVITES_LIMIT',
      message: 'Too many pending invites for this pet',
    });
  if (error instanceof PetMembersLimitError)
    return new ConflictException({
      statusCode: HttpStatus.CONFLICT,
      code: 'PET_MEMBERS_LIMIT',
      message: 'Pet member limit reached',
    });
  return error;
}
