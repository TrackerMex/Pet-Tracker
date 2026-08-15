import { randomBytes } from 'node:crypto';

const ACTIVATION_CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const ACTIVATION_CODE_BODY_LENGTH = 10;

/** Secreto no derivable de identificadores enumerables del collar (R4). */
export function generateActivationCode(): string {
  const body = Array.from(
    randomBytes(ACTIVATION_CODE_BODY_LENGTH),
    (byte) => ACTIVATION_CODE_ALPHABET[byte % ACTIVATION_CODE_ALPHABET.length],
  ).join('');

  return `PT-${body}`;
}
