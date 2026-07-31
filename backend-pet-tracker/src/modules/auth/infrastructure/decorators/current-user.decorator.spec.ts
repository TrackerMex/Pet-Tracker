import 'reflect-metadata';
import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { CurrentUser } from './current-user.decorator';

/**
 * Patron estandar para testear un ParamDecorator de Nest: el decorador
 * escribe metadata en la clase via SetMetadata interno; se extrae la
 * factory real desde esa metadata y se invoca directo, sin bootstrap de
 * Nest (https://docs.nestjs.com/custom-decorators#unit-testing-custom-decorators).
 */
function getParamDecoratorFactory(decorator: () => ParameterDecorator) {
  class TestClass {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public test(@decorator() _value: unknown) {}
  }

  const args = Reflect.getMetadata(
    ROUTE_ARGS_METADATA,
    TestClass,
    'test',
  ) as Record<
    string,
    { factory: (data: unknown, ctx: ExecutionContext) => unknown }
  >;

  return args[Object.keys(args)[0]].factory;
}

function buildContext(user: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe('R8: @CurrentUser() expone { id, email } adjuntado por el guard', () => {
  it('devuelve request.user tal cual lo dejo el AuthGuard', () => {
    const factory = getParamDecoratorFactory(CurrentUser);
    const context = buildContext({ id: 'user-1', email: 'ada@example.com' });

    const result = factory(undefined, context);

    expect(result).toEqual({ id: 'user-1', email: 'ada@example.com' });
  });
});
