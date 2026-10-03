import {
  PASSWORD_RESET_PATH,
  buildPasswordResetUrl,
} from './password-reset-link';

describe('R1: buildPasswordResetUrl compone https://<host>/reset-password?token=<token>', () => {
  it.each([
    ['reset.example.test', 'plain-token', 'plain-token'],
    ['reset.example.test/', 'token+/=?', 'token%2B%2F%3D%3F'],
  ])(
    'normaliza el host %s y codifica el token',
    (host, token, encodedToken) => {
      expect(PASSWORD_RESET_PATH).toBe('/reset-password');
      expect(buildPasswordResetUrl(host, token)).toBe(
        `https://reset.example.test/reset-password?token=${encodedToken}`,
      );
    },
  );
});
