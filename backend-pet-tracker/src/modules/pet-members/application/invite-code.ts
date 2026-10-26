export const INVITE_CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTVWXYZ';
export const INVITE_CODE_LENGTH = 10;
export const INVITE_TTL_MS = 72 * 60 * 60 * 1000;

export function generateInviteCode(): string {
  return '';
}
export function normalizeInviteCode(input: string): string | null {
  return input;
}
export function hashInviteCode(code: string): string {
  void code;
  return '';
}
