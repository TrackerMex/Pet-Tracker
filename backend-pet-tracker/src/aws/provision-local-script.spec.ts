import { readFileSync } from 'fs';
import { join } from 'path';

describe('R19: provision:local invoca ts-node -r tsconfig-paths/register', () => {
  it('el script provision:local en package.json usa el flag de tsconfig-paths, no ts-node a secas', () => {
    const packageJsonPath = join(__dirname, '..', '..', 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
      scripts?: Record<string, string>;
    };

    const script = packageJson.scripts?.['provision:local'];

    expect(script).toBeDefined();
    expect(script).toMatch(/ts-node/);
    expect(script).toMatch(/-r\s+tsconfig-paths\/register/);
    expect(script).toMatch(/scripts\/provision-local\.ts/);
  });
});
