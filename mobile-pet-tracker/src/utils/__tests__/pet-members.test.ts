import { readFileSync } from 'fs';
import { join } from 'path';

it('R23: expo-clipboard es dependencia declarada', () => {
  const manifest = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as {
    dependencies: Record<string, string>;
  };

  expect(typeof manifest.dependencies['expo-clipboard']).toBe('string');
  expect(manifest.dependencies['expo-clipboard']).toMatch(/^~/);
});
