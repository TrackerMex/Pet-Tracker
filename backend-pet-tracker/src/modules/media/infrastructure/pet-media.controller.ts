import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { ZodType } from 'zod';
import {
  CreatePetDocumentDto,
  CreatePetDocumentSchema,
} from '@/modules/media/application/dto/create-pet-document.dto';
import { CreatePetDocumentUseCase } from '@/modules/media/application/use-cases/create-pet-document.use-case';
import { ListPetDocumentsUseCase } from '@/modules/media/application/use-cases/list-pet-documents.use-case';
import {
  PetDocumentResponse,
  toPetDocumentResponse,
} from '@/modules/media/infrastructure/mappers/pet-document.mapper';
import { RequirePetRole } from '@/modules/pets/infrastructure/decorators/require-pet-role.decorator';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';

@Controller('pets/:petId/media')
@UseGuards(PetAccessGuard)
export class PetMediaController {
  constructor(
    private readonly listPetDocuments: ListPetDocumentsUseCase,
    private readonly createPetDocument: CreatePetDocumentUseCase,
  ) {}

  @Get()
  async list(@Req() request: PetAccessRequest): Promise<PetDocumentResponse[]> {
    return (
      await this.listPetDocuments.execute(request.petMembership.petId)
    ).map(toPetDocumentResponse);
  }

  @Post()
  @RequirePetRole('owner')
  async create(
    @Req() request: PetAccessRequest,
    @Body() body: unknown,
  ): Promise<{
    document: PetDocumentResponse;
    uploadUrl: string;
    expiresInSeconds: number;
  }> {
    const dto = parseBody<CreatePetDocumentDto>(CreatePetDocumentSchema, body);
    const result = await this.createPetDocument.execute(
      request.petMembership.petId,
      request.user.id,
      dto,
    );

    return {
      document: toPetDocumentResponse(result.document),
      uploadUrl: result.uploadUrl,
      expiresInSeconds: result.expiresInSeconds,
    };
  }
}

function parseBody<T>(schema: ZodType<T>, body: unknown): T {
  const parsed = schema.safeParse(body);
  if (parsed.success) return parsed.data;

  throw new BadRequestException({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Validation failed',
    errors: parsed.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  });
}
