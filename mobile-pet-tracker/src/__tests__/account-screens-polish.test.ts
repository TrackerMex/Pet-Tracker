declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');
const sourceRoot = join(process.cwd(), 'src');

const textRecipes = [
  'className="text-3xl font-black text-foreground"',
  'className="text-center text-3xl font-black text-foreground"',
  'className="flex-1 text-3xl font-black text-foreground"',
  '<Label.Text className="text-13 font-semibold text-muted">',
  '<Label>',
  '<Label className=',
  'className="text-15 font-semibold text-foreground"',
  'className="text-15 font-medium text-foreground"',
  'className="text-center text-15 font-normal text-muted"',
  'className="flex-1 text-15 font-bold text-accent-strong"',
  '<Button.Label className="text-17 font-extrabold text-accent-foreground">',
  '<Button.Label className="text-17 font-extrabold text-foreground">',
  'font-bold text-accent-foreground',
  'text-2xl',
  'text-xs',
] as const;

describe('#172 R6: recetas de texto de cuenta', () => {
  it.each([
    ['login', [1, 0, 0, 2, 2, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0]],
    ['register', [1, 0, 0, 7, 7, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0]],
    ['forgot', [0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0]],
    ['reset-password', [0, 0, 2, 2, 2, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0]],
  ] as const)('#172 R6: %s pinta títulos, etiquetas, cuerpos y CTA con su receta', (screen, counts) => {
    const source = readFileSync(join(sourceRoot, 'screens', screen, 'index.tsx'), 'utf8');
    textRecipes.forEach((literal, index) => {
      expect(source.split(literal).length - 1).toBe(counts[index]);
    });
  });
});


describe('#172 R7: enlaces de cuenta', () => {
  it('#172 R7: los enlaces de login y recuperar llevan su receta', () => {
    const login = readFileSync(join(sourceRoot, 'screens/login/index.tsx'), 'utf8');
    const forgot = readFileSync(join(sourceRoot, 'screens/forgot/index.tsx'), 'utf8');
    expect(login.match(/testID="link-forgot"\s+className="min-h-11 self-end"/g) ?? []).toHaveLength(1);
    expect(login.match(/testID="link-register"\s+className="h-13 w-full"/g) ?? []).toHaveLength(1);
    expect(forgot.match(/testID="link-login"\s+className="h-13 w-full"/g) ?? []).toHaveLength(1);
    expect(login.split('<LinkButton.Label className="text-sm font-semibold text-accent-strong">').length - 1).toBe(1);
    expect(login.split('<LinkButton.Label className="text-base font-bold text-accent-strong">').length - 1).toBe(1);
    expect(forgot.split('<LinkButton.Label className="text-base font-bold text-accent-strong">').length - 1).toBe(1);
    expect(login.split('self-center').length - 1).toBe(0);
  });
});


describe('#172 R10: bordes de error del registro', () => {
  it('#172 R10: los siete campos del registro marcan isInvalid', () => {
    const source = readFileSync(join(sourceRoot, 'screens/register/index.tsx'), 'utf8');
    expect(source.split('isInvalid={Boolean(fieldErrors.').length - 1).toBe(7);
  });
});
