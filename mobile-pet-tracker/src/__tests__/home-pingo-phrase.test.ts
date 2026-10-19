declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');
const read = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');

describe('#190 R11: token de la cola de la burbuja', () => {
  it('declara radius-4 una sola vez con valor 4 px junto a los radios', () => {
    const css = read('src/theme/global.css');
    expect(css.match(/--radius-4\s*:/g)).toHaveLength(1);
    expect(css).toContain('--radius-4: 4px;');
    expect(css).toMatch(/--radius-tile: 18px;\s*--radius-4: 4px;/);
  });
});
