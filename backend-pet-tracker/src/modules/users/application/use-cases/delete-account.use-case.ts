import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '@/modules/auth/domain/repositories/user.repository';
import type { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { PASSWORD_HASHER } from '@/modules/auth/domain/ports/password-hasher';
import type { PasswordHasher } from '@/modules/auth/domain/ports/password-hasher';
import { ACCOUNT_DELETION_REPOSITORY } from '@/modules/users/domain/repositories/account-deletion.repository';
import type { AccountDeletionRepository } from '@/modules/users/domain/repositories/account-deletion.repository';
import { PET_DATA_PURGER } from '@/modules/pets/domain/ports/pet-data-purger';
import type { PetDataPurger } from '@/modules/pets/domain/ports/pet-data-purger';

@Injectable()
export class DeleteAccountUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    @Inject(ACCOUNT_DELETION_REPOSITORY)
    private readonly accountDeletion: AccountDeletionRepository,
    @Inject(PET_DATA_PURGER) private readonly purger: PetDataPurger,
  ) {}
  execute(userId: string, password: string): Promise<void> {
    void userId;
    void password;
    return Promise.reject(new Error('Not implemented'));
  }
}
