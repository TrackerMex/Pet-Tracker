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

describe('#205 R2: entradas de Main', () => {
  it('#205 R2: Main sube sus bloques a 0, 120, 200 y 280 ms como el artboard', () => {
    const main = canvas('Main');
    expect(main).toContain('animation: rise 400ms ease-out both');
    expect(main).toContain('animation: rise 400ms ease-out 120ms both');
    expect(main).toContain('animation: rise 400ms ease-out 200ms both');
    expect(main).toContain('animation: rise 400ms ease-out 280ms both');
    expect(main).toContain('padding: 56px 16px 34px');
    expect(main).toContain('margin-top: 24px');
    expect(main).toContain('gap: 14px');

    const welcome = source('screens/welcome/index.tsx');
    expect(welcome).toContain('<RiseIn testID="welcome-rise-scene" delayMs={0}>');
    expect(welcome).toContain('<RiseIn testID="welcome-rise-chips" delayMs={120} className="mt-6">');
    expect(welcome).toContain('<RiseIn testID="welcome-rise-heading" delayMs={200} className="mt-4.5 items-center gap-2">');
    expect(welcome).toContain('<RiseIn testID="welcome-rise-actions" delayMs={280} className="gap-3.5">');
    expect(welcome).toContain('paddingHorizontal: 16');
  });
});

describe('#205 R3: escena de Main', () => {
  it('#205 R3: la escena y Pingo miden lo que el artboard', () => {
    const main = canvas('Main');
    expect(main).toContain('height: 380px');
    expect(main).toContain('border-radius: 32px');
    expect(main).toContain('width: 220px');
    expect(main).toContain('width: 120px');
    expect(main).toContain('bottom: 30px');
    expect(main).toContain('animation: float 3s ease-in-out infinite');

    const welcome = source('screens/welcome/index.tsx');
    expect(welcome).toContain('h-95');
    expect(welcome).toContain('rounded-32');
    expect(welcome).toContain('width: 220');
    expect(welcome).toContain('w-30');
    expect(welcome).toContain('bottom-7.5');
    expect(welcome).toContain('<PingoFloat testID="welcome-pingo-float">');
  });
});

describe('#205 R4: bocadillo de Main', () => {
  it('#205 R4: el bocadillo copia posición, radios y sombra del artboard', () => {
    const main = canvas('Main');
    expect(main).toContain('top: 28px; right: 22px');
    expect(main).toContain('padding: 10px 14px');
    expect(main).toContain('border-radius: 16px 16px 4px 16px');
    expect(main).toContain('box-shadow: var(--shadow)');
    expect(main).toContain('animation: pop 400ms ease-out 600ms both');

    const welcome = source('screens/welcome/index.tsx');
    expect(welcome).toContain('className="absolute top-7 right-5.5"');
    expect(welcome).toContain('px-3.5 py-2.5');
    expect(welcome).toContain('rounded-br-4');
    expect(welcome).toContain('shadows.card');
  });
});

describe('#205 R6: marca de Main', () => {
  it('#205 R6: la marca copia tamaño, ancho y margen del artboard', () => {
    const main = canvas('Main');
    expect(main).toContain('font-size: 34px; line-height: 40px; font-weight: 900; letter-spacing: -0.5px');
    expect(main).toContain('max-width: 300px');
    expect(main).toContain('margin-top: 18px');
    expect(main).toContain('margin: 16px 0 0');

    const welcome = source('screens/welcome/index.tsx');
    expect(welcome).toContain('text-34 leading-10 font-black tracking-display');
    expect(welcome).toContain('max-w-75');
    expect(welcome).toContain('mt-4.5 items-center gap-2');
    expect(welcome).toContain('mt-4 text-center text-xs text-muted');
  });
});

describe('#205 R8: Login', () => {
  it('#205 R8: Login sube a 0, 100 y 200 ms y copia radios y márgenes', () => {
    const login = canvas('Login');
    expect(login).toContain('animation: rise 400ms ease-out both');
    expect(login).toContain('animation: rise 400ms ease-out 100ms both');
    expect(login).toContain('animation: rise 400ms ease-out 200ms both');
    expect(login).toContain('border-radius: 16px 16px 16px 4px');
    expect(login).toContain('rotate(-8deg)');
    expect(login).toContain('width: 88px');
    expect(login).toContain('padding: 56px 20px 34px');
    expect(login).toContain('margin-top: 24px');
    expect(login).toContain('gap: 14px');
    expect(login).toContain('margin-left: -10px');
    expect(login).toContain('align-items: flex-end; gap: 12px; margin-top: 8px');
    expect(login).toContain('padding: 10px 14px');
    expect(login).toContain('margin-bottom: 18px');
    expect(login).toContain('margin: 20px 0 0; font-size: 30px; line-height: 36px; font-weight: 900; letter-spacing: -0.5px');

    const screen = source('screens/login/index.tsx');
    expect(screen).toContain('<RiseIn testID="login-header" delayMs={0}>');
    expect(screen).toContain('<RiseIn testID="login-body" delayMs={100} className="mt-6 gap-4">');
    expect(screen).toContain('<RiseIn testID="login-actions" delayMs={200} className="gap-3.5">');
    expect(screen).toContain('paddingHorizontal: 20');
    expect(screen).toContain('className="-ml-2.5 flex-row"');
    expect(screen).toContain('className="mt-2 flex-row items-end gap-3"');
    expect(screen).toContain('rounded-tl-16 rounded-tr-16 rounded-br-16 rounded-bl-4');
    expect(screen).toContain('mb-4.5');
    expect(screen).toContain('px-3.5 py-2.5');
    expect(screen).toContain('className="mt-5 text-3xl font-black tracking-display text-foreground"');
  });
});
