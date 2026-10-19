import { R7_PROFILE, R8_REMINDERS } from './ui-copy-table';

declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');

const conventions = readFileSync(join(process.cwd(), '..', 'docs', 'conventions.md'), 'utf8');

describe('#181 R9: excepción A20 para los estados sin mascotas', () => {
  it('declara una sola enmienda A20 de #181', () => {
    expect(conventions.match(/enmienda A20 de #181/g) ?? []).toHaveLength(1);
  });

  it('declara la casilla de aprobación y admite la firma humana', () => {
    expect(conventions).toMatch(/- \[[ xX]\] Enmienda A20 aprobada por humano/);
  });
});

describe('#181 R8: candados agregados y de catálogo', () => {
  it('#181 R8.1: conserva las filas del catálogo y el copy de los vacíos', () => {
    for (const key of ['common.noPetsBody', 'profile.addPet']) {
      expect(R7_PROFILE).toContainEqual({ file: 'src/screens/profile/index.tsx', key });
    }
    for (const key of ['common.noPetsYet', 'common.noPetsBody', 'profile.addPet']) {
      expect(R8_REMINDERS).toContainEqual({ file: 'src/screens/reminders/index.tsx', key });
    }
    for (const name of ['profile', 'reminders']) {
      const source = readFileSync(join(process.cwd(), 'src', 'screens', name, 'index.tsx'), 'utf8');
      expect(source).toMatch(/title=\{t\('common\.noPetsYet'\)\}/);
      expect(source).toMatch(/body=\{t\('common\.noPetsBody'\)\}/);
      expect(source).toMatch(/label: t\('profile\.addPet'\)/);
    }
  });

  it('#181 R8.2: conserva los recuentos de EmptyState en Perfil y Recordatorios', () => {
    for (const [name, count] of [['profile', 1], ['reminders', 2]] as const) {
      const source = readFileSync(join(process.cwd(), 'src', 'screens', name, 'index.tsx'), 'utf8');
      expect(source.match(/<EmptyState\b/g) ?? []).toHaveLength(count);
    }
  });

  it('#181 R8.3: mantiene las tres pantallas sin drift de estilos', () => {
    for (const name of ['home', 'reminders', 'profile']) {
      const source = readFileSync(join(process.cwd(), 'src', 'screens', name, 'index.tsx'), 'utf8');
      for (const pattern of [/#\d+\b(?!\s+R\d)/, /text-accent(?![-\w])/, /\bStyleSheet\b/, /\w-\[[^\]]*\]/]) {
        expect(source).not.toMatch(pattern);
      }
    }
  });
});
