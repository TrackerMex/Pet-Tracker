import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  GoneException,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ZodType } from 'zod';
import {
  RegisterUserSchema,
  RegisterUserDto,
} from '../application/dto/register-user.dto';
import {
  VerifyEmailDto,
  VerifyEmailSchema,
} from '../application/dto/verify-email.dto';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { VerifyEmailUseCase } from '../application/use-cases/verify-email.use-case';
import {
  InvalidVerificationTokenError,
  VerificationTokenExpiredError,
} from '../domain/errors/email-verification.errors';
import { EmailAlreadyRegisteredError } from '../domain/errors/user.errors';
import { toUserResponse, UserResponse } from './mappers/user-response.mapper';

export interface VerifyEmailResponse {
  verified: true;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
  ) {}

  @Post('register')
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
