import 'reflect-metadata';
import { PATH_METADATA } from '@nestjs/common/constants';
import type { CheckHealthUseCase } from '@/modules/health/application/use-cases/check-health.use-case';
import { IS_PUBLIC_KEY } from '@/modules/auth/infrastructure/decorators/public.decorator';
import { HealthController } from './health.controller';

describe('R7: GET /v1/health sigue publico tras introducir el guard global', () => {
  it('el handler check trae la metadata @Public()', () => {
    // Object.getOwnPropertyDescriptor en vez de Prototype.check directo:
    // evita @typescript-eslint/unbound-method.
    const descriptor = Object.getOwnPropertyDescriptor(
      HealthController.prototype,
      'check',
    );

    expect(
      Reflect.getMetadata(IS_PUBLIC_KEY, descriptor?.value as object),
    ).toBe(true);
  });
});

describe('#245 R8: GET /v1/health/live es público y no consulta Postgres', () => {
  it('#245 R8: live trae @Public() y la ruta live', () => {
    const descriptor = Object.getOwnPropertyDescriptor(
      HealthController.prototype,
      'live',
    );
    expect(
      Reflect.getMetadata(IS_PUBLIC_KEY, descriptor?.value as object),
    ).toBe(true);
    expect(
      Reflect.getMetadata(PATH_METADATA, descriptor?.value as object),
    ).toBe('live');
  });
  it('#245 R8: live devuelve { status: "ok" } sin llamar al use case', () => {
    const execute = jest.fn();
    const controller = new HealthController({
      execute,
    } as unknown as CheckHealthUseCase);
    expect(controller.live()).toEqual({ status: 'ok' });
    expect(execute).not.toHaveBeenCalled();
  });
});
