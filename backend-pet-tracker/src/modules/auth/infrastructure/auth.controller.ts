import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  GoneException,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ZodType } from 'zod';
import {
  ForgotPasswordDto,
  ForgotPasswordSchema,
} from '@/modules/auth/application/dto/forgot-password.dto';
import {
  RegisterUserSchema,
  RegisterUserDto,
} from '@/modules/auth/application/dto/register-user.dto';
import {
  ResetPasswordDto,
  ResetPasswordSchema,
} from '@/modules/auth/application/dto/reset-password.dto';
import {
  LoginUserDto,
  LoginUserSchema,
} from '@/modules/auth/application/dto/login-user.dto';
import {
  VerifyEmailDto,
  VerifyEmailSchema,
} from '@/modules/auth/application/dto/verify-email.dto';
import { LoginUserUseCase } from '@/modules/auth/application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '@/modules/auth/application/use-cases/register-user.use-case';
import { RequestPasswordResetUseCase } from '@/modules/auth/application/use-cases/request-password-reset.use-case';
import { ResetPasswordUseCase } from '@/modules/auth/application/use-cases/reset-password.use-case';
import { VerifyEmailUseCase } from '@/modules/auth/application/use-cases/verify-email.use-case';
import {
  InvalidVerificationTokenError,
  VerificationTokenExpiredError,
} from '@/modules/auth/domain/errors/email-verification.errors';
import {
  InvalidPasswordResetTokenError,
  PasswordResetTokenExpiredError,
} from '@/modules/auth/domain/errors/password-reset.errors';
import {
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
} from '@/modules/auth/domain/errors/user.errors';
import { Public } from './decorators/public.decorator';
import { EmailRateLimitGuard } from './guards/email-rate-limit.guard';
import { toUserResponse, UserResponse } from './mappers/user-response.mapper';

export interface VerifyEmailResponse {
  verified: true;
}

export interface LoginResponse {
  // snake_case a proposito: contrato literal de auth-login-me R1/R4.
  access_token: string;
}

export interface ForgotPasswordResponse {
  requested: true;
}

export interface ResetPasswordResponse {
  reset: true;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly requestPasswordReset: RequestPasswordResetUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @Public()
  @Post('register')
  @UseGuards(EmailRateLimitGuard)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: unknown): Promise<UserResponse> {
    const dto = parseBody<RegisterUserDto>(RegisterUserSchema, body);

    try {
      return toUserResponse(await this.registerUser.execute(dto));
    } catch (error) {
      if (error instanceof EmailAlreadyRegisteredError) {
        // Mensaje generico a proposito: el detalle (que email) no vuelve al
        // cliente para no confirmar que direcciones estan registradas.
        throw new ConflictException('Email already registered');
      }
      throw error;
    }
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() body: unknown): Promise<VerifyEmailResponse> {
    const dto = parseBody<VerifyEmailDto>(VerifyEmailSchema, body);

    try {
      await this.verifyEmailUseCase.execute(dto);

      return { verified: true };
    } catch (error) {
      if (error instanceof VerificationTokenExpiredError) {
        throw new GoneException('Verification token expired');
      }
      if (error instanceof InvalidVerificationTokenError) {
        throw new BadRequestException('Invalid verification token');
      }
      throw error;
    }
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: unknown): Promise<LoginResponse> {
    const dto = parseBody<LoginUserDto>(LoginUserSchema, body);

    try {
      const { accessToken } = await this.loginUser.execute(dto);

      return { access_token: accessToken };
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        // Mismo mensaje generico para email inexistente y password
        // incorrecto (R2): no revela si el email existe.
        throw new UnauthorizedException('Invalid credentials');
      }
      throw error;
    }
  }

  @Public()
  @Post('forgot-password')
  @UseGuards(EmailRateLimitGuard)
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: unknown): Promise<ForgotPasswordResponse> {
    const dto = parseBody<ForgotPasswordDto>(ForgotPasswordSchema, body);

    await this.requestPasswordReset.execute(dto);

    return { requested: true };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: unknown): Promise<ResetPasswordResponse> {
    const dto = parseBody<ResetPasswordDto>(ResetPasswordSchema, body);

    try {
      await this.resetPasswordUseCase.execute(dto);

      return { reset: true };
    } catch (error) {
      if (error instanceof PasswordResetTokenExpiredError) {
        throw new GoneException('Password reset token expired');
      }
      if (error instanceof InvalidPasswordResetTokenError) {
        throw new BadRequestException('Invalid password reset token');
      }
      throw error;
    }
  }
}

/**
 * Validacion explicita en el borde HTTP: el ZodError se mapea a 400 con el
 * detalle por campo (docs/conventions.md §DTOs / validacion de entrada).
 */
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
