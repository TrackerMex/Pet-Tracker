import {
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  InviteNotAcceptableError,
  AlreadyPetMemberError,
  PetInviteNotFoundError,
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
  if (error instanceof PetInviteNotFoundError) return new NotFoundException();
  if (error instanceof InviteNotAcceptableError)
    return new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      code: 'INVITE_NOT_ACCEPTABLE',
      message: 'Invite code is invalid or expired',
    });
  if (error instanceof AlreadyPetMemberError)
    return new ConflictException({
      statusCode: HttpStatus.CONFLICT,
      code: 'ALREADY_PET_MEMBER',
      message: 'User is already a member of this pet',
    });
  return error;
}
