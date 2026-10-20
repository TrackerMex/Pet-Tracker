import { readFileSync, readdirSync } from 'fs';
import { join, relative } from 'path';

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


function productionTsx(directory = join(process.cwd(), 'src')): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : productionTsx(path);
    return entry.isFile() && entry.name.endsWith('.tsx') && !/\.(?:test|spec)\.tsx$/.test(entry.name)
      ? [relative(process.cwd(), path)]
      : [];
  });
}

const productionFiles = productionTsx();
const charter = readFileSync(join(process.cwd(), '..', 'docs', 'ui-guidelines.md'), 'utf8');
const normalizedCharter = charter.replace(/\s+/g, ' ');

describe('#186 R9: carta y uso compartido de los errores de campo', () => {
  it('#186 R9: la carta lista field-error-message.tsx', () => {
    const shared = charter.match(/4\. \*\*Componentes compartidos\*\*[\s\S]*?(?=\n5\.)/)?.[0];
    expect(shared).toBeDefined();
    expect(shared).toContain('`field-error-message.tsx`');
  });

  it('#186 R9: la carta trae la enmienda y su casilla', () => {
    expect(charter).toContain('## Enmienda #186 — Errores de validación de formularios');
    expect(charter).toMatch(/- \[[ xX]\] Enmienda #186 aprobada por humano/);
  });

  it('#186 R9: la carta fija las dos reglas', () => {
    expect(normalizedCharter).toContain('todo campo de texto que valide en cliente pinta su mensaje con `FieldErrorMessage`, debajo del control, y la validación se hace al pulsar enviar con reglas puras de `src/utils/`');
    expect(normalizedCharter).toContain('el texto crudo de un error del servidor no se muestra nunca en pantalla: un 400 cae en `validation.checkDetails` o en un mensaje de campo traducido');
  });

  it('#186 R9: el corolario del backend ya no cita login-error ni weight-form-error como pantallas que muestran el texto del servidor', () => {
    expect(normalizedCharter).not.toContain('Se ve en `login-error`, `register-*-error`, `weight-form-error` y `reset-error`');
  });

  it('#186 R9: solo el componente importa FieldError de heroui-native', () => {
    const importers = productionFiles.filter((file) => nativeFieldErrorImport.test(readFileSync(join(process.cwd(), file), 'utf8')));
    expect(importers.sort()).toEqual(['src/components/field-error-message.tsx']);
  });

  it('#186 R9: el escáner encuentra el universo mínimo de producción', () => {
    expect(productionFiles).toEqual(expect.arrayContaining([
      'src/components/field-error-message.tsx',
      ...accountScreens.map(([screen]) => `src/screens/${screen}/index.tsx`),
      'src/screens/add-pet/index.tsx', 'src/screens/add-reminder/index.tsx',
      'src/screens/docs-upload-form/index.tsx', 'src/screens/weight-log/index.tsx',
    ]));
    expect(productionFiles.length).toBeGreaterThanOrEqual(9);
    expect(productionFiles.every((file) => !file.includes('/__tests__/') && !/\.(?:test|spec)\.tsx$/.test(file))).toBe(true);
  });

  it('#186 R9: cada pantalla de formulario usa el componente', () => {
    for (const [screen, count] of [['add-pet', 4], ['add-reminder', 3], ['docs-upload-form', 4], ['weight-log', 4]] as const) {
      const source = readFileSync(join(process.cwd(), 'src', 'screens', screen, 'index.tsx'), 'utf8');
      expect({ screen, uses: source.split('FieldErrorMessage').length - 1 }).toEqual({ screen, uses: count });
    }
  });
});
