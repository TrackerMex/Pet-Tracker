import { readFileSync } from 'fs';
import { join } from 'path';

const STATUS_MD_PATH = join(__dirname, '..', '..', '..', 'STATUS.md');

describe('R17: STATUS.md documenta cómo arrancar y verificar LocalStack', () => {
  const content = readFileSync(STATUS_MD_PATH, 'utf-8');

  it('documenta docker compose up -d y pnpm run provision:local', () => {
    expect(content).toMatch(/docker compose up -d/);
    expect(content).toMatch(/pnpm run provision:local/);
  });

  it('documenta el comando de verificación manual con aws sqs list-queues', () => {
    expect(content).toMatch(
      /aws --endpoint-url=http:\/\/localhost:4566 sqs list-queues/,
    );
  });
});
