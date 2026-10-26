import { createHash, randomInt } from 'node:crypto';

export const INVITE_CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTVWXYZ';
export const INVITE_CODE_LENGTH = 10;
export const INVITE_TTL_MS = 72 * 60 * 60 * 1000;

export function generateInviteCode(): string {
  return Array.from(
    { length: INVITE_CODE_LENGTH },
    () => INVITE_CODE_ALPHABET[randomInt(0, INVITE_CODE_ALPHABET.length)],
  ).join('');
}
export function normalizeInviteCode(input: string): string | null {
  const code = input.replace(/[\s-]/g, '').toUpperCase();
  return /^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{10}$/.test(code) ? code : null;
}
export function hashInviteCode(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}
