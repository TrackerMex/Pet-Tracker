import { readFileSync } from 'fs';
import { join } from 'path';

const accountScreens = [
  ['login', 3],
  ['register', 8],
  ['forgot', 2],
  ['reset-password', 3],
] as const;

const nativeFieldErrorImport = /import\s*\{[^}]*\bFieldError\b[^}]*\}\s*from\s*['"]heroui-native['"]/;

describe('#186 R8: las pantallas de cuenta usan el componente compartido', () => {
  it('#186 R8: conserva los conteos y ninguna pantalla importa FieldError', () => {
    for (const [screen, count] of accountScreens) {
      const source = readFileSync(join(process.cwd(), 'src', 'screens', screen, 'index.tsx'), 'utf8');
      expect({ screen, uses: source.split('FieldErrorMessage').length - 1 }).toEqual({ screen, uses: count });
      expect(source).not.toMatch(nativeFieldErrorImport);
    }
  });
});
