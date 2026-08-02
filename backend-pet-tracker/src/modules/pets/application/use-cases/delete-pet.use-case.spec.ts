import { AuditLogger } from '@/audit/audit-log.repository';
import { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { DeletePetUseCase } from './delete-pet.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';

function buildDeps(overrides?: { deleteFn?: jest.Mock }) {
  const calls: string[] = [];
  const deleteFn =
    overrides?.deleteFn ??
    jest.fn().mockImplementation(() => {
      calls.push('delete');
      return Promise.resolve();
    });
  const record = jest.fn().mockImplementation(() => {
    calls.push('record');
    return Promise.resolve();
  });
  const pets = { delete: deleteFn } as unknown as PetRepository;
  const auditLogger: AuditLogger = { record };

  return { pets, auditLogger, deleteFn, record, calls };
}

describe('R16: DeletePetUseCase borra la mascota y audita pet.delete', () => {
  it('borra por id y registra la entrada de auditoria despues', async () => {
    const { pets, auditLogger, deleteFn, record, calls } = buildDeps();
    const useCase = new DeletePetUseCase(pets, auditLogger);

    await useCase.execute(PET_ID, USER_ID);

    expect(deleteFn).toHaveBeenCalledWith(PET_ID);
    expect(record).toHaveBeenCalledWith({
      userId: USER_ID,
      action: 'pet.delete',
      entity: 'pet',
      entityId: PET_ID,
    });
    expect(calls).toEqual(['delete', 'record']);
  });

  it('no audita si el borrado falla', async () => {
    const failing = jest.fn().mockRejectedValue(new Error('db down'));
    const { pets, auditLogger, record } = buildDeps({ deleteFn: failing });
    const useCase = new DeletePetUseCase(pets, auditLogger);

    await expect(useCase.execute(PET_ID, USER_ID)).rejects.toThrow('db down');
    expect(record).not.toHaveBeenCalled();
  });
});
