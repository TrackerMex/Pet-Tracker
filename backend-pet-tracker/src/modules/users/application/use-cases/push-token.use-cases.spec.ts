import type { PushTokenRepository } from '@/modules/users/domain/repositories/push-token.repository';
import { DeletePushTokenUseCase } from './delete-push-token.use-case';
import { RegisterPushTokenUseCase } from './register-push-token.use-case';

const USER_ID = 'user-1';
const OTHER_USER_ID = 'user-2';
const EXPO_TOKEN = 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]';
const NOW = new Date('2026-08-07T10:00:00.000Z');

type MockOf<T> = { [K in keyof T]: jest.Mock };

function repositoryStub(): MockOf<PushTokenRepository> {
  return {
    upsert: jest.fn().mockResolvedValue({
      id: 'token-row-1',
      platform: 'ios',
      createdAt: NOW,
      lastSeenAt: NOW,
    }),
    deleteOwnedByUser: jest.fn().mockResolvedValue(undefined),
    findActiveMembersTokens: jest.fn().mockResolvedValue([]),
    deleteByToken: jest.fn().mockResolvedValue(undefined),
  };
}

describe('R3: POST /v1/me/push-tokens hace upsert idempotente por expo_token', () => {
  it('delega un upsert con el usuario autenticado, el platform del body y last_seen_at = ahora', async () => {
    const repository = repositoryStub();
    const useCase = new RegisterPushTokenUseCase(repository);

    const row = await useCase.execute(
      USER_ID,
      { expoToken: EXPO_TOKEN, platform: 'ios' },
      NOW,
    );

    expect(repository.upsert).toHaveBeenCalledTimes(1);
    expect(repository.upsert).toHaveBeenCalledWith({
      userId: USER_ID,
      expoToken: EXPO_TOKEN,
      platform: 'ios',
      lastSeenAt: NOW,
    });
    expect(row.id).toBe('token-row-1');
  });

  it('el mismo expoToken de otro usuario se reasigna sin error (D5-iv), nunca 409', async () => {
    const repository = repositoryStub();
    const useCase = new RegisterPushTokenUseCase(repository);

    await useCase.execute(
      OTHER_USER_ID,
      { expoToken: EXPO_TOKEN, platform: 'android' },
      NOW,
    );

    // El caso de uso no consulta al propietario previo ni lanza: el upsert
    // por expo_token (UNIQUE global) resuelve la reasignacion en una sentencia.
    expect(repository.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ userId: OTHER_USER_ID }),
    );
  });
});

describe('R5: DELETE /v1/me/push-tokens es 204 idempotente y solo borra la fila propia', () => {
  it('borra acotando por (expo_token, user_id) del usuario autenticado', async () => {
    const repository = repositoryStub();
    const useCase = new DeletePushTokenUseCase(repository);

    await useCase.execute(USER_ID, { expoToken: EXPO_TOKEN });

    expect(repository.deleteOwnedByUser).toHaveBeenCalledTimes(1);
    expect(repository.deleteOwnedByUser).toHaveBeenCalledWith(
      USER_ID,
      EXPO_TOKEN,
    );
  });

  it('resuelve sin lanzar aunque el token no exista o sea de otro usuario', async () => {
    const repository = repositoryStub();
    const useCase = new DeletePushTokenUseCase(repository);

    // El repositorio no informa cuantas filas borro a proposito: la respuesta
    // 204 no debe filtrar la existencia de tokens ajenos.
    await expect(
      useCase.execute(USER_ID, { expoToken: EXPO_TOKEN }),
    ).resolves.toBeUndefined();
    await expect(
      useCase.execute(USER_ID, { expoToken: EXPO_TOKEN }),
    ).resolves.toBeUndefined();
  });
});
