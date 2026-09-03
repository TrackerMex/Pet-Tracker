declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');

const sourceRoot = join(process.cwd(), 'src');

function readSource(relativePath: string): string {
  return readFileSync(join(sourceRoot, relativePath), 'utf8');
}

/** Bloque JSX que abre en el `testID` dado y cierra en `closingTag`. */
function elementWithTestId(
  source: string,
  testId: string,
  closingTag: string,
): string {
  const start = source.indexOf(`testID="${testId}"`);

  expect(start).toBeGreaterThan(-1);

  const end = source.indexOf(closingTag, start);

  expect(end).toBeGreaterThan(start);

  return source.slice(start, end);
}

describe('#61 R1: la etiqueta destructiva usa el token de danger', () => {
  const deleteConfirm = elementWithTestId(
    readSource(join('screens', 'reminders', 'index.tsx')),
    'reminders-delete-confirm',
    '</Button>',
  );

  it('resuelve el Button.Label con text-danger-foreground', () => {
    expect(deleteConfirm).toContain(
      '<Button.Label className="font-bold text-danger-foreground">',
    );
  });

  it('no deja el token del acento en un botón destructivo', () => {
    expect(deleteConfirm).not.toContain('text-accent-foreground');
  });

  it('conserva variant, testID y texto del botón', () => {
    expect(deleteConfirm).toContain('variant="danger"');
    expect(deleteConfirm).toContain('bg-danger');
    expect(deleteConfirm).toContain('Delete');
  });
});

describe('#61 R3: ningún texto sobre bg-accent se compone con opacidad', () => {
  const accentCards = [
    join('app', '(tabs)', 'food.tsx'),
    join('app', '(tabs)', 'meal-schedule.tsx'),
  ];

  it.each(accentCards)('%s no compone su texto con opacidad', (path) => {
    const source = readSource(path);

    expect(source).not.toContain('opacity-70');
    expect(source).not.toContain('opacity-80');
  });

  it.each(accentCards)(
    '%s conserva las dos etiquetas de la card de acento a opacidad plena',
    (path) => {
      const source = readSource(path);

      expect(source).toContain(
        'className="text-xs font-semibold uppercase tracking-widest text-accent-foreground"',
      );
      expect(source).toContain(
        'className="font-semibold text-accent-foreground"',
      );
    },
  );
});
