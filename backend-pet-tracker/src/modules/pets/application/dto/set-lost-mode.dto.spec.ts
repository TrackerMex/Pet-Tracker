import { SetLostModeSchema } from './set-lost-mode.dto';

describe('R3: SetLostModeSchema valida enabled', () => {
  it.each([
    ['missing', {}],
    ['string', { enabled: 'true' }],
    ['null', { enabled: null }],
    ['number', { enabled: 1 }],
  ])('rejects enabled when it is %s', (_label, body) => {
    expect(SetLostModeSchema.safeParse(body).success).toBe(false);
  });

  it.each([true, false])('accepts the boolean %s', (enabled) => {
    expect(SetLostModeSchema.parse({ enabled })).toEqual({ enabled });
  });

  it('strips unknown keys', () => {
    expect(
      SetLostModeSchema.parse({ enabled: true, lostMode: false, extra: 1 }),
    ).toEqual({ enabled: true });
  });
});
