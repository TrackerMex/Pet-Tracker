import { generateActivationCode } from './activation-code';

describe('R4 (device-provisioning-admin #24): codigo aleatorio base32, aridad cero, 1000 sin repetir', () => {
  it('genera secretos con el formato y entropia requeridos', () => {
    const codes = Array.from({ length: 1000 }, () =>
      generateActivationCode(),
    );

    expect(generateActivationCode).toHaveLength(0);
    expect(codes.every((code) => /^PT-[0-9A-HJKMNP-TV-Z]{10}$/.test(code))).toBe(
      true,
    );
    expect(new Set(codes)).toHaveLength(1000);
  });
});
