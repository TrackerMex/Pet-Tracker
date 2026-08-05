import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ZodType } from 'zod';
import { RequirePetRole } from '@/modules/pets/infrastructure/decorators/require-pet-role.decorator';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import {
  RequestPhotoUploadUrlDto,
  RequestPhotoUploadUrlSchema,
} from '../application/dto/request-photo-upload-url.dto';
import {
  PhotoUploadUrl,
  RequestPhotoUploadUrlUseCase,
} from '../application/use-cases/request-photo-upload-url.use-case';

/**
 * POST /v1/pets/:petId/photo-upload-url (R1-R5). PetAccessGuard reutilizado
 * de #5: mascota inexistente/ajena/malformada es el 404 generico del guard
 * (R4), sin membresia activa nunca llega aqui. D1: solo 'owner' (R3).
 */
@Controller('pets/:petId/photo-upload-url')
@UseGuards(PetAccessGuard)
@RequirePetRole('owner')
export class MediaController {
  constructor(
    private readonly requestPhotoUploadUrl: RequestPhotoUploadUrlUseCase,
  ) {}

  // R1: 200, no 201 — no se crea un recurso REST nuevo, se emite una URL.
  @Post()
  @HttpCode(HttpStatus.OK)
  async requestUrl(
    @Req() request: PetAccessRequest,
    @Body() body: unknown,
  ): Promise<PhotoUploadUrl> {
    // R2: ZodError -> 400 antes de invocar el use case; nada se persiste.
    parseBody<RequestPhotoUploadUrlDto>(RequestPhotoUploadUrlSchema, body);

    return this.requestPhotoUploadUrl.execute(
      request.petMembership.petId,
      request.user.id,
    );
  }
}

/** Mismo patron que pets.controller.ts / devices.controller.ts. */
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
