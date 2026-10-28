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
      /file: 'src\/screens\/home\/orbit-phrase\.ts', key: '([^']+)'/g,
    )].map((match) => match[1]);
    expect(keys).toEqual([
      'home.orbitPhraseWalkMeals', 'home.orbitPhraseWalk',
      'home.orbitPhraseMeals', 'home.orbitPhraseCalm',
    ]);
  });
});

describe('#190 R12: los ficheros de la frase permanecen grep-clean', () => {
  it.each(['src/screens/home/index.tsx', 'src/screens/home/orbit-phrase.ts'])('%s no contiene escapes visuales ni emoji', (file) => {
    const source = read(file);
    expect(source).not.toMatch(/#[\da-f]{3,8}\b/i);
    expect(source).not.toMatch(/\b[\w-]+-\[[^\]\r\n]+\]/);
    expect(source).not.toMatch(/StyleSheet\.create|\b(?:elevation|shadowColor|shadowOffset|shadowOpacity|shadowRadius)\b/);
    expect(source).not.toMatch(/\p{Extended_Pictographic}/u);
  });
});

describe('#190 R14: la carta incorpora la enmienda aprobada', () => {
  it('copia el texto completo tras la Enmienda 186 y deja la casilla para el humano', () => {
    const guidelines = read('../docs/ui-guidelines.md');
    const heading = '## Enmienda #190 — Burbuja de Pingo en Inicio';
    const index = guidelines.indexOf(heading);
    expect(index).toBeGreaterThan(guidelines.indexOf('## Enmienda #186'));
    expect(guidelines.match(/^## Enmienda #190 /gm)).toHaveLength(1);
    const section = guidelines.slice(index).split('\n## ')[0].trim();
    expect(section.match(/^- \[[ xX]\] Enmienda #190 aprobada por humano$/gm)).toHaveLength(1);
    const lines = section.split('\n');
    expect(lines.at(-1)).toMatch(/^- \[[ xX]\] Enmienda #190 aprobada por humano$/);
    expect(lines.slice(0, -1).join('\n')).toBe([
      heading,
      '',
      '> Enmienda de `ui-guidelines` por `mobile-home-pingo-phrase` (#190). Directiva del humano: «el diseño final como el artifact».',
      '',
      '**Pingo flota en la burbuja de Inicio.** Con mascota seleccionada, la pose de la burbuja de Pingo de Inicio (`home-pingo`) usa `PingoFloat` (`src/components/pingo-float.tsx`) con `MOTION_PINGO_FLOAT_OFFSET_Y` (10 px) y `MOTION_PINGO_FLOAT_TIMING` (1500 ms por tramo). Con reduce motion no arranca. Esta enmienda no autoriza `PingoFloat` en ninguna otra pantalla.',
      '',
      '**Escala de radios.** Se añade `--radius-4: 4px` (`rounded-br-4`), la esquina de la «cola» de la burbuja. Un solo uso hoy.',
      '',
      '**La burbuja de Pingo.** `View` de superficie con radio 18 px (`rounded-tile`) y 4 px en la esquina inferior derecha, texto `text-15 font-semibold leading-5.25`. La frase sale de claves `home.pingoPhrase*`, en voz B.',
      '',
    ].join('\n'));
  });
});
