import 'reflect-metadata';
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
