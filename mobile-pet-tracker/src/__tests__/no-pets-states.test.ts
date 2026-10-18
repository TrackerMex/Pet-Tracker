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
