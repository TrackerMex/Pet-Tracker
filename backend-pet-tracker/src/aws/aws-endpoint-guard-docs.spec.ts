import { readFileSync } from 'fs';
import { join } from 'path';

const REPOSITORY_ROOT = join(__dirname, '..', '..', '..');

describe('R7: verification.md documenta la guarda', () => {
  it('incluye la feature, el error y la variable protegida', () => {
    const verification = readFileSync(
      join(REPOSITORY_ROOT, 'docs', 'verification.md'),
      'utf-8',
    );

    expect(verification).toContain('### Feature 21 — aws-mode-endpoint-guard');
    expect(verification).toContain('UnexpectedAwsEndpointError');
    expect(verification).toContain('AWS_ENDPOINT_URL');
  });
});
