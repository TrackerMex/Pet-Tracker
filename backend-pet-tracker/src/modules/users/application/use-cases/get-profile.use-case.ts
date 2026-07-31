import { Inject, Injectable } from '@nestjs/common';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { UserNotFoundError } from '@/modules/auth/domain/errors/user.errors';
import { USER_REPOSITORY } from '@/modules/auth/domain/repositories/user.repository';
import type { UserRepository } from '@/modules/auth/domain/repositories/user.repository';

/**
 * GET /v1/me (auth-login-me R9). El domain de `users` reutiliza User/
 * UserRepository de `auth` en vez de duplicarlos (design.md, mismo
 * principio que AuditLogger compartido en src/audit/).
 */
@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this.users.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    return user;
  }
}
