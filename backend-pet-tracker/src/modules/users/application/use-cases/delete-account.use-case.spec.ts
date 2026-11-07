import { User } from '@/modules/auth/domain/entities/user.entity';
import {
  InvalidCredentialsError,
  UserNotFoundError,
} from '@/modules/auth/domain/errors/user.errors';
import { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { PasswordHasher } from '@/modules/auth/domain/ports/password-hasher';
import { DeleteAccountUseCase } from './delete-account.use-case';

const USER_ID = 'user-1',
  HASH = 'hash',
  P1 = 'p1',
  P2 = 'p2';
function buildDeps() {
  const calls: string[] = [];
  const findById = jest.fn().mockImplementation(() => {
    calls.push('findById');
    return Promise.resolve({
      id: USER_ID,
      passwordHash: HASH,
    } as unknown as User);
  });
  const verify = jest.fn().mockImplementation(() => {
    calls.push('verify');
    return Promise.resolve(true);
  });
  const deleteAccount = jest.fn().mockImplementation(() => {
    calls.push('deleteAccount');
    return Promise.resolve([P1, P2]);
  });
  const purge = jest.fn().mockImplementation(() => {
    calls.push('purge');
    return Promise.resolve();
  });
  const useCase = new DeleteAccountUseCase(
    { findById } as unknown as UserRepository,
    { verify } as unknown as PasswordHasher,
    { deleteAccount },
    { purge },
  );
  return { useCase, calls, findById, verify, deleteAccount, purge };
}
describe('#247 R6: contraseña incorrecta rechaza con InvalidCredentialsError y no borra', () => {
  it('#247 R6: no borra ni purga con contraseña incorrecta', async () => {
    const { useCase, verify, deleteAccount, purge } = buildDeps();
    verify.mockResolvedValue(false);
    await expect(useCase.execute(USER_ID, 'secret')).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
    expect(deleteAccount).not.toHaveBeenCalled();
    expect(purge).not.toHaveBeenCalled();
  });
});
describe('#247 R7: usuario inexistente rechaza con UserNotFoundError', () => {
  it('#247 R7: no verifica, borra ni purga si falta el usuario', async () => {
    const { useCase, findById, verify, deleteAccount, purge } = buildDeps();
    findById.mockResolvedValue(null);
    await expect(useCase.execute(USER_ID, 'secret')).rejects.toBeInstanceOf(
      UserNotFoundError,
    );
    expect(verify).not.toHaveBeenCalled();
    expect(deleteAccount).not.toHaveBeenCalled();
    expect(purge).not.toHaveBeenCalled();
  });
});
describe('#247 R13: borra la cuenta y después purga las mascotas borradas', () => {
  it('#247 R13: verifica, borra y purga en ese orden', async () => {
    const { useCase, calls, verify, deleteAccount, purge } = buildDeps();
    await expect(useCase.execute(USER_ID, 'secret')).resolves.toBeUndefined();
    expect(calls).toEqual(['findById', 'verify', 'deleteAccount', 'purge']);
    expect(verify).toHaveBeenCalledWith('secret', HASH);
    expect(deleteAccount).toHaveBeenCalledWith(USER_ID);
    expect(purge).toHaveBeenCalledWith([P1, P2]);
  });
  it('#247 R13: si el borrado falla no purga', async () => {
    const { useCase, deleteAccount, purge } = buildDeps();
    const dbError = new Error('db down 247');
    deleteAccount.mockRejectedValue(dbError);
    await expect(useCase.execute(USER_ID, 'secret')).rejects.toBe(dbError);
    expect(purge).not.toHaveBeenCalled();
  });
});
