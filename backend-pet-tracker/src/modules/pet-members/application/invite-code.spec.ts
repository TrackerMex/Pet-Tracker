import {
  generateInviteCode,
  normalizeInviteCode,
  hashInviteCode,
} from './invite-code';

describe('#211 R2: código de invitación', () => {
  it('#211 R2: generateInviteCode da 10 caracteres del alfabeto de 30', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      const code = generateInviteCode();
      expect(code).toMatch(/^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{10}$/);
      for (const character of code) seen.add(character);
    }
    expect([...seen].sort().join('')).toBe('23456789ABCDEFGHJKMNPQRSTVWXYZ');
  });
  it('#211 R2: normalizeInviteCode acepta minúsculas, espacios y guiones', () => {
    expect(normalizeInviteCode(' abcde-fghjk ')).toBe('ABCDEFGHJK');
    expect(normalizeInviteCode('ABCDE FGHJK')).toBe('ABCDEFGHJK');
  });
  it.each([
    '',
    'ABCDEFGHJ',
    'ABCDEFGHJKM',
    'ABCDEFGHJ0',
    'ABCDEFGHJ1',
    'ABCDEFGHJO',
    'ABCDEFGHJI',
    'ABCDEFGHJL',
    'ABCDEFGHJU',
    'ABCDEFGHJ!',
  ])('#211 R2: normalizeInviteCode devuelve null para %s', (input) => {
    expect(normalizeInviteCode(input)).toBeNull();
  });
  it('#211 R2: hashInviteCode es SHA-256 hex', () => {
    expect(hashInviteCode('ABCDEFGHJK')).toBe(
      'f57cbf1e3e471b25db4b8ad0844df41b2dae9c7d1944944d128e49294d412f66',
    );
  });
});
