import { readFileSync } from 'node:fs';
import { join } from 'node:path';
describe('R11: main.ts arranca con createAppLogger y configureApp', () => {
  const source = readFileSync(join(__dirname, 'main.ts'), 'utf8');
  it('R11: crea la app con logger createAppLogger(process.env.NODE_ENV)', () => {
    expect(source).toContain('logger: createAppLogger(process.env.NODE_ENV)');
  });
  it('R11: llama a configureApp(app) antes de app.listen y no llama a setGlobalPrefix', () => {
    expect(source).toContain('configureApp(app)');
    expect(source.indexOf('configureApp(app)')).toBeLessThan(
      source.indexOf('app.listen'),
    );
    expect(source).not.toContain('setGlobalPrefix');
  });
});
