import { Inject, Injectable } from '@nestjs/common';
import { normalizeEmail } from '@/modules/auth/domain/entities/user.entity';
import { InvalidCredentialsError } from '@/modules/auth/domain/errors/user.errors';
import { PASSWORD_HASHER } from '@/modules/auth/domain/ports/password-hasher';
import type { PasswordHasher } from '@/modules/auth/domain/ports/password-hasher';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { USER_REPOSITORY } from '@/modules/auth/domain/repositories/user.repository';
import type { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { LoginUserDto } from '../dto/login-user.dto';

export interface LoginResult {
  accessToken: string;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginUserDto): Promise<LoginResult> {
    const email = normalizeEmail(dto.email);
    const user = await this.users.findByEmail(email);

    // Mismo error para email inexistente y password incorrecto (R2): no
    // revela al cliente si el email existe.
    if (
      !user ||
      !(await this.passwordHasher.verify(dto.password, user.passwordHash))
    ) {
      throw new InvalidCredentialsError();
    }

    const accessToken = this.tokenService.sign({
      sub: user.id,
      email: user.email,
    });

    return { accessToken };
  }
}
