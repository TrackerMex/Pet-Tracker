import { CheckHealthUseCase } from './check-health.use-case';
import { DatabaseHealthChecker } from '../../domain/repositories/database-health-checker.repository';

function buildUseCase(checker: DatabaseHealthChecker): CheckHealthUseCase {
  return new CheckHealthUseCase(checker);
}

describe('R7: CheckHealthUseCase devuelve postgres ok cuando ping() resuelve true', () => {
  it('devuelve { postgres: "ok" }', async () => {
    const checker: DatabaseHealthChecker = { ping: jest.fn().mockResolvedValue(true) };
    const useCase = buildUseCase(checker);

    const result = await useCase.execute();

    expect(result).toEqual({ postgres: 'ok' });
  });
});

describe('R8: CheckHealthUseCase devuelve postgres error cuando la verificación falla', () => {
  it('devuelve { postgres: "error" } si ping() resuelve false', async () => {
    const checker: DatabaseHealthChecker = { ping: jest.fn().mockResolvedValue(false) };
    const useCase = buildUseCase(checker);

    const result = await useCase.execute();

    expect(result).toEqual({ postgres: 'error' });
  });

  it('devuelve { postgres: "error" } sin dejar escapar la excepción si ping() rechaza', async () => {
    const checker: DatabaseHealthChecker = {
      ping: jest.fn().mockRejectedValue(new Error('ECONNREFUSED')),
    };
    const useCase = buildUseCase(checker);

    const result = await useCase.execute();

    expect(result).toEqual({ postgres: 'error' });
  });
});
