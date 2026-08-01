import 'reflect-metadata';
import { IS_PUBLIC_KEY, Public } from './public.decorator';

// Object.getOwnPropertyDescriptor en vez de Prototype.metodo directo: evita
// @typescript-eslint/unbound-method (mismo patron que httpCodeOf() en
// auth.controller.spec.ts).
function handlerMetadata(target: object, methodName: string): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(target, methodName);

  return Reflect.getMetadata(IS_PUBLIC_KEY, descriptor?.value as object);
}

describe('R7: @Public() marca el handler con metadata IS_PUBLIC_KEY = true', () => {
  it('escribe la metadata leida por AuthGuard', () => {
    class TestController {
      @Public()
      handler() {}
    }

    expect(handlerMetadata(TestController.prototype, 'handler')).toBe(true);
  });

  it('un handler sin @Public() no trae la metadata', () => {
    class TestController {
      handler() {}
    }

    expect(
      handlerMetadata(TestController.prototype, 'handler'),
    ).toBeUndefined();
  });
});
