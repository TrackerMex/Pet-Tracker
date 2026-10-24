interface DirectoryEntry {
  name: string;
  isDirectory: () => boolean;
}

declare function require(moduleName: 'fs'): {
  readdirSync: (path: string, options: { withFileTypes: true }) => DirectoryEntry[];
  readFileSync: (path: string, encoding: 'utf8') => string;
};
declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const srcRoot = join(process.cwd(), 'src');

// Un mock registrado con la opcion de modo no real contamina el mapa de IDs de
// modulo que jest-resolve comparte por proceso: el siguiente test del mismo proceso
// que mockee ese modulo sin la opcion carga el real. Este candado vigila la clave en
// todos los tests de src, incluido este fichero, asi que no la escribe nunca.
// Cuenta la clave con cualquier valor, con o sin comillas, y tambien en comentarios.
// Sin cubrir: la forma abreviada de objeto y una clave calculada; si hiciera falta,
// se amplia el patron.
const virtualOption = /\bvirtual['"]?\s*:/;

// Cuatro tests que mockeaban un modulo que si existe; ruta relativa a src y especificador.
const realMocks = [
  ['screens/food/index.test.tsx', '../../theme/use-theme-colors'],
  ['screens/health/index.test.tsx', '../../theme/use-theme-colors'],
  ['screens/meal-schedule/index.test.tsx', '../../theme/use-theme-colors'],
  ['screens/profile/index.test.tsx', 'expo-image-picker'],
] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Recorrido sin exclusiones: los tests de __tests__ y de carpetas con parentesis cuentan.
function allTestFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : allTestFiles(path);
    return /\.tests\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

const mobileTests = allTestFiles(srcRoot)
  .map((path) => path.slice(srcRoot.length + 1).replace(/\\/g, '/'))
  .sort();

describe('#207 R1: los cuatro tests registran su módulo real sin la opción virtual', () => {
  it('cada uno conserva su jest.mock y no pasa la opción virtual', () => {
    const problems: string[] = [];

    for (const [file, specifier] of realMocks) {
      const source = readFileSync(join(srcRoot, file), 'utf8');
      if (virtualOption.test(source)) problems.push(`${file}: contiene la opción virtual`);
      if (!new RegExp(`jest\\.mock\\(\\s*'${escapeRegExp(specifier)}'`).test(source)) {
        problems.push(`${file}: no registra jest.mock de ${specifier}`);
      }
    }

    expect(problems).toEqual([]);
  });
});

describe('#207 R2: ningún test móvil pasa la opción virtual de jest.mock', () => {
  it('ningún test móvil pasa la opción virtual', () => {
    const violations = mobileTests
      .filter((file) => virtualOption.test(readFileSync(join(srcRoot, file), 'utf8')))
      .sort();

    expect(violations).toEqual([]);
  });

  it('el recorrido incluye al propio candado', () => {
    expect(mobileTests).toContain('__tests__/jest-virtual-mock-lock.test.ts');
  });
});
