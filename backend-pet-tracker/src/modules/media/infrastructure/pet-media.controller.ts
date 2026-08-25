import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ListPetDocumentsUseCase } from '@/modules/media/application/use-cases/list-pet-documents.use-case';
import {
  PetDocumentResponse,
  toPetDocumentResponse,
} from '@/modules/media/infrastructure/mappers/pet-document.mapper';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';

@Controller('pets/:petId/media')
@UseGuards(PetAccessGuard)
export class PetMediaController {
  constructor(private readonly listPetDocuments: ListPetDocumentsUseCase) {}

  @Get()
  async list(@Req() request: PetAccessRequest): Promise<PetDocumentResponse[]> {
    return (
      await this.listPetDocuments.execute(request.petMembership.petId)
    ).map(toPetDocumentResponse);
  }
}
