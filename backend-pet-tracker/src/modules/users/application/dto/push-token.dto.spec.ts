import {
  DeletePushTokenSchema,
  RegisterPushTokenSchema,
} from './register-push-token.dto';

const VALID_TOKEN = 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]';

describe('R4: validacion zod del body de /v1/me/push-tokens (strictObject → 400)', () => {
  it('acepta un body valido con las dos formas documentadas de token de Expo', () => {
    for (const expoToken of [VALID_TOKEN, 'ExpoPushToken[abc123]']) {
      const result = RegisterPushTokenSchema.safeParse({
        expoToken,
        platform: 'ios',
      });
      expect(result.success).toBe(true);
    }
  });

  it('rechaza el body vacio', () => {
    expect(RegisterPushTokenSchema.safeParse({}).success).toBe(false);
  });

  it('rechaza un expoToken con formato libre (nunca podria entregarse)', () => {
    for (const expoToken of [
      '',
      'not-a-token',
      'ExponentPushToken[]',
      'ExponentPushToken abc',
      'prefixExponentPushToken[abc]',
    ]) {
      const result = RegisterPushTokenSchema.safeParse({
        expoToken,
        platform: 'android',
      });
      expect(result.success).toBe(false);
    }
  });

  it('rechaza platform fuera de ios/android (D5: sin web)', () => {
    for (const platform of ['web', 'IOS', '', 'windows']) {
      const result = RegisterPushTokenSchema.safeParse({
        expoToken: VALID_TOKEN,
        platform,
      });
      expect(result.success).toBe(false);
    }
  });

  it('rechaza una clave extra — strictObject, mismo criterio que #9', () => {
    const result = RegisterPushTokenSchema.safeParse({
      expoToken: VALID_TOKEN,
      platform: 'ios',
      userId: 'someone-else',
    });
    expect(result.success).toBe(false);
  });

  it('el schema del DELETE es el mismo sin platform', () => {
    expect(DeletePushTokenSchema.safeParse({ expoToken: VALID_TOKEN }).success).toBe(
      true,
    );
    expect(
      DeletePushTokenSchema.safeParse({
        expoToken: VALID_TOKEN,
        platform: 'ios',
      }).success,
    ).toBe(false);
    expect(DeletePushTokenSchema.safeParse({ expoToken: 'nope' }).success).toBe(
      false,
    );
  });
});
