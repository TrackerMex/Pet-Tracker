declare function require(moduleName: 'fs'): { readFileSync: (path: string, encoding: 'utf8') => string };
declare function require(moduleName: 'path'): { join: (...paths: string[]) => string };

const { readFileSync } = require('fs');
const { join } = require('path');

function canvas(artboard: string): string {
  return readFileSync(
    join(process.cwd(), '..', 'specs/mobile-canvas-account-flow/canvas', `${artboard}.dc.html`),
    'utf8',
  );
}

function source(file: string): string {
  return readFileSync(join(process.cwd(), 'src', file), 'utf8');
}

describe('#205 R1: tokens del canvas de cuenta', () => {
  it('#205 R1: global.css declara text-34, radius-32 y radius-40 una sola vez', () => {
    expect(canvas('Main')).toContain('font-size: 34px');
    expect(canvas('Main')).toContain('border-radius: 32px');
    expect(canvas('Recuperar')).toContain('border-radius: 40px');

    const css = source('theme/global.css');
    expect(css.match(/--text-34: 34px;/g)).toHaveLength(1);
    expect(css.match(/--radius-32: 32px;/g)).toHaveLength(1);
    expect(css.match(/--radius-40: 40px;/g)).toHaveLength(1);
  });
});
