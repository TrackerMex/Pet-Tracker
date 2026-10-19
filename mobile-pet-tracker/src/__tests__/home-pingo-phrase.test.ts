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

describe('#190 R13: las claves de la frase están en el inventario de Inicio', () => {
  it('registra las cuatro claves del helper una sola vez y en el orden aprobado', () => {
    const keys = [...read('src/__tests__/ui-copy-table.ts').matchAll(
      /file: 'src\/screens\/home\/pingo-phrase\.ts', key: '([^']+)'/g,
    )].map((match) => match[1]);
    expect(keys).toEqual([
      'home.pingoPhraseWalkMeals', 'home.pingoPhraseWalk',
      'home.pingoPhraseMeals', 'home.pingoPhraseCalm',
    ]);
  });
});

describe('#190 R12: los ficheros de la frase permanecen grep-clean', () => {
  it.each(['src/screens/home/index.tsx', 'src/screens/home/pingo-phrase.ts'])('%s no contiene escapes visuales ni emoji', (file) => {
    const source = read(file);
    expect(source).not.toMatch(/#[\da-f]{3,8}\b/i);
    expect(source).not.toMatch(/\b[\w-]+-\[[^\]\r\n]+\]/);
    expect(source).not.toMatch(/StyleSheet\.create|\b(?:elevation|shadowColor|shadowOffset|shadowOpacity|shadowRadius)\b/);
    expect(source).not.toMatch(/\p{Extended_Pictographic}/u);
  });
});
