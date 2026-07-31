import { Inject, Injectable } from '@nestjs/common';
import {
  DEFAULT_TIMEZONE,
  normalizeEmail,
  User,
} from '../../domain/entities/user.entity';
import { EmailAlreadyRegisteredError } from '../../domain/errors/user.errors';
import { PASSWORD_HASHER } from '../../domain/ports/password-hasher';
import type { PasswordHasher } from '../../domain/ports/password-hasher';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { RegisterUserDto } from '../dto/register-user.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const email = normalizeEmail(dto.email);

    if (await this.users.existsByEmail(email)) {
      throw new EmailAlreadyRegisteredError(email);
    }

    return this.users.create({
      email,
      passwordHash: await this.passwordHasher.hash(dto.password),
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      country: dto.country,
      timezone: dto.timezone ?? DEFAULT_TIMEZONE,
      termsAcceptedAt: new Date(),
    });
  }
}
