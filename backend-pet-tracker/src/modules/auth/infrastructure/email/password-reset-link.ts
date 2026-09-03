export const PASSWORD_RESET_PATH = '/reset-password';

export function buildPasswordResetUrl(host: string, token: string): string {
  const normalizedHost = host.replace(/\/+$/, '');

  return `https://${normalizedHost}/pet${PASSWORD_RESET_PATH}?token=${encodeURIComponent(token)}`;
}
