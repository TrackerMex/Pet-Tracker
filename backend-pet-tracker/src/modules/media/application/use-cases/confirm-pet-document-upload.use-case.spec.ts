import {
  PetDocumentNotFoundError,
  PetDocumentNotUploadedError,
} from '@/modules/media/domain/errors/pet-document.errors';
import type { PhotoStorage } from '@/modules/media/domain/ports/photo-storage';
import type { PetDocumentRepository } from '@/modules/media/domain/repositories/pet-document.repository';
import { ConfirmPetDocumentUploadUseCase } from './confirm-pet-document-upload.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const DOCUMENT_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef1';
const KEY = `pets/${PET_ID}/docs/${DOCUMENT_ID}`;

function buildDeps(uploadedAt: Date | null = null) {
  const findByIdAndPet = jest.fn().mockResolvedValue({
    id: DOCUMENT_ID,
    petId: PET_ID,
    type: 'Consulta',
    name: 'Control',
    date: '2026-10-08',
    vet: null,
    key: KEY,
    createdBy: '0198b2c3-4d5e-7a01-b234-56789abcdef2',
    uploadedAt,
  });
  const markUploaded = jest.fn().mockResolvedValue(undefined);
  const getObjectSize = jest.fn().mockResolvedValue(1024);
  const documents = {
    findByIdAndPet,
    markUploaded,
  } as unknown as PetDocumentRepository;
  const storage = { getObjectSize } as unknown as PhotoStorage;
  const useCase = new ConfirmPetDocumentUploadUseCase(documents, storage);

  return { useCase, findByIdAndPet, markUploaded, getObjectSize };
}

describe('#157 R5: ConfirmPetDocumentUploadUseCase marca subido', () => {
  it('#157 R5: pendiente cuyo objeto existe: consulta getObjectSize(key) y llama markUploaded(id)', async () => {
    const { useCase, findByIdAndPet, getObjectSize, markUploaded } =
      buildDeps();

    await expect(useCase.execute(PET_ID, DOCUMENT_ID)).resolves.toBeUndefined();
    expect(findByIdAndPet).toHaveBeenCalledWith(DOCUMENT_ID, PET_ID);
    expect(getObjectSize).toHaveBeenCalledTimes(1);
    expect(getObjectSize).toHaveBeenCalledWith(KEY);
    expect(markUploaded).toHaveBeenCalledTimes(1);
    expect(markUploaded).toHaveBeenCalledWith(DOCUMENT_ID);
  });

  it('#157 R5: ya confirmado: resuelve sin llamar a getObjectSize ni a markUploaded', async () => {
    const { useCase, getObjectSize, markUploaded } = buildDeps(new Date());

    await expect(useCase.execute(PET_ID, DOCUMENT_ID)).resolves.toBeUndefined();
    expect(getObjectSize).not.toHaveBeenCalled();
    expect(markUploaded).not.toHaveBeenCalled();
  });
});

describe('#157 R6: ConfirmPetDocumentUploadUseCase rechaza sin marcar', () => {
  it('#157 R6 (a): documentId malformado: PetDocumentNotFoundError sin consultar el repositorio', async () => {
    const { useCase, findByIdAndPet, getObjectSize, markUploaded } =
      buildDeps();

    await expect(useCase.execute(PET_ID, 'not-a-uuid')).rejects.toBeInstanceOf(
      PetDocumentNotFoundError,
    );
    expect(findByIdAndPet).not.toHaveBeenCalled();
    expect(getObjectSize).not.toHaveBeenCalled();
    expect(markUploaded).not.toHaveBeenCalled();
  });

  it('#157 R6 (b)/(c): findByIdAndPet devuelve null: PetDocumentNotFoundError sin consultar el bucket', async () => {
    const { useCase, findByIdAndPet, getObjectSize, markUploaded } =
      buildDeps();
    findByIdAndPet.mockResolvedValue(null);

    await expect(useCase.execute(PET_ID, DOCUMENT_ID)).rejects.toBeInstanceOf(
      PetDocumentNotFoundError,
    );
    expect(findByIdAndPet).toHaveBeenCalledWith(DOCUMENT_ID, PET_ID);
    expect(getObjectSize).not.toHaveBeenCalled();
    expect(markUploaded).not.toHaveBeenCalled();
  });

  it('#157 R6 (d): objeto ausente: PetDocumentNotUploadedError sin markUploaded', async () => {
    const { useCase, getObjectSize, markUploaded } = buildDeps();
    getObjectSize.mockResolvedValue(null);

    await expect(useCase.execute(PET_ID, DOCUMENT_ID)).rejects.toBeInstanceOf(
      PetDocumentNotUploadedError,
    );
    expect(markUploaded).not.toHaveBeenCalled();
  });

  it('#157 R6 (g): getObjectSize falla: propaga el mismo error sin markUploaded', async () => {
    const { useCase, getObjectSize, markUploaded } = buildDeps();
    const boom = new Error('storage unavailable');
    getObjectSize.mockRejectedValue(boom);

    await expect(useCase.execute(PET_ID, DOCUMENT_ID)).rejects.toBe(boom);
    expect(markUploaded).not.toHaveBeenCalled();
  });
});
