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

describe('#205 R9: Registro', () => {
  it('#205 R9: Registro flota, sube a 0 ms y copia márgenes y términos', () => {
    const registro = canvas('Registro');
    expect(registro).toContain('animation: float 3s ease-in-out infinite');
    expect(registro).toContain('animation: rise 400ms ease-out both');
    expect(registro).toContain('margin-top: 18px');
    expect(registro).toContain('min-height: 44px');
    expect(registro).toContain('width: 56px');
    expect(registro).toContain('padding: 56px 20px 34px');

    const screen = source('screens/register/index.tsx');
    expect(screen).toContain('<RiseIn testID="register-body" delayMs={0} className="mt-4.5 gap-3">');
    expect(screen).toContain('min-h-11');
    expect(screen).toContain('<PingoFloat');
  });
});

describe('#205 R10: Recuperar', () => {
  it('#205 R10: Recuperar copia escena, tile y márgenes', () => {
    const recuperar = canvas('Recuperar');
    expect(recuperar).toContain('width: 168px; height: 150px');
    expect(recuperar).toContain('inset: 14px 10px 0');
    expect(recuperar).toContain('border-radius: 40px');
    expect(recuperar).toContain('right: 0; bottom: 6px; width: 52px; height: 52px; border-radius: 16px');
    expect(recuperar).toContain('rotate(6deg)');
    expect(recuperar).toContain('width: 120px');
    expect(recuperar).toContain('font-size: 28px');
    expect(recuperar).toContain('max-width: 320px');
    expect(recuperar).toContain('margin-top: 28px');
    expect(recuperar).toContain('animation: pop 400ms ease-out 300ms both');
    expect(recuperar).toContain('animation: rise 400ms ease-out both');

    const screen = source('screens/forgot/index.tsx');
    expect(screen).toContain('<RiseIn testID="forgot-scene" delayMs={0} className="mt-4 h-37.5 w-42">');
    expect(screen).toContain('h-37.5 w-42');
    expect(screen).toContain('inset-x-2.5 top-3.5 bottom-0 rounded-40');
    expect(screen).toContain('absolute bottom-1.5 right-0');
    expect(screen).toContain('text-28 leading-8.5');
    expect(screen).toContain('max-w-80');
  });
});

describe('#205 R11: RecuperarEnviado', () => {
  it('#205 R11: RecuperarEnviado dibuja la misma escena que Recuperar', () => {
    const enviado = canvas('RecuperarEnviado');
    expect(enviado).toContain('width: 168px; height: 150px');
    expect(enviado).toContain('rotate(6deg)');
    expect(enviado).toContain('width: 120px');
    expect(enviado).toContain('font-size: 28px');
    expect(enviado).toContain('max-width: 320px');
    expect(enviado).toContain('gap: 14px');

    expect(source('screens/forgot/index.tsx')).toContain('testID="forgot-actions" className="w-full gap-3.5"');
  });
});

describe('#205 R12: NuevaContrasena', () => {
  it('#205 R12: NuevaContrasena sube a 0 y 100 ms con Pingo de 72', () => {
    const nueva = canvas('NuevaContrasena');
    expect(nueva).toContain('padding: 100px 20px 34px');
    expect(nueva).toContain('width: 72px');
    expect(nueva).toContain('margin-top: 32px');
    expect(nueva).toContain('font-size: 28px; line-height: 32px');
    expect(nueva).toContain('animation: rise 400ms ease-out both');
    expect(nueva).toContain('animation: rise 400ms ease-out 100ms both');

    const screen = source('screens/reset-password/index.tsx');
    expect(screen).toContain('<RiseIn testID="reset-header" delayMs={0} className="flex-row items-center gap-3.5">');
    expect(screen).toContain('<RiseIn testID="reset-body" delayMs={100} className="mt-8 flex-1 gap-4">');
    expect(screen).toContain('paddingTop: insets.top + 56');
    expect(screen).toContain('width: 72');
    expect(screen).toContain('text-28 leading-8');
  });
});

describe('#205 R13: NuevaContrasena, éxito', () => {
  it('#205 R13: el éxito copia radio, fondo y margen del artboard', () => {
    const nueva = canvas('NuevaContrasena');
    expect(nueva).toContain('border-radius: 16px; background: var(--surface2)');
    expect(nueva).toContain('margin-top: 24px');
    expect(nueva).toContain('animation: pop 400ms ease-out 500ms both');
    expect(nueva).toContain('animation: rise 400ms ease-out both');

    const screen = source('screens/reset-password/index.tsx');
    // La cabecera del éxito repite la del formulario: dos usos con el mismo 0 ms.
    expect(screen.split('<RiseIn testID="reset-header" delayMs={0} className="flex-row items-center gap-3.5">')).toHaveLength(3);
    expect(screen).toContain('<PopIn testID="reset-success-pop" className="mt-6 w-full">');
    expect(screen).toContain('rounded-16 bg-surface-secondary px-4 py-3.5');
  });
});

describe('#205 R16: NuevaMascota', () => {
  it('#205 R16: NuevaMascota copia cabecera, entrada y sección del artboard', () => {
    const nueva = canvas('NuevaMascota');
    expect(nueva).toContain('animation: rise 400ms ease-out both');
    expect(nueva).toContain('font-size: 16px; font-weight: 900');
    expect(nueva).toContain('width: 88px');
    expect(nueva).toContain('gap: 14px');

    const screen = source('screens/add-pet/index.tsx');
    expect(screen).toContain('<ScreenHeader testID="add-pet"');
    expect(screen).toContain('backFallback="/"');
    expect(screen).toContain('size={24}');
    expect(screen).toContain('<RiseIn testID="add-pet-intro" delayMs={0} className="flex-row items-center gap-3.5">');
    expect(screen).toContain('text-base font-black');
  });
});

describe('#205 R17: selector segmentado', () => {
  it('#205 R17: la opción seleccionada lleva la sombra segment del canvas', () => {
    expect(canvas('NuevaMascota')).toContain('box-shadow: 0 2px 6px rgba(13,17,23,0.10)');

    const selector = source('components/segmented-control.tsx');
    expect(selector).toContain('const shadows = useShadows();');
    expect(selector).toContain('style={[CONTINUOUS_CORNER, selected ? shadows.segment : null]}');
    expect(selector).not.toContain('shadow-sm');
  });
});

describe('#205 R18: NuevaMascota2', () => {
  it('#205 R18: el paso 2 sube a 0, 60, 120 y 180 ms con chips de 44', () => {
    const paso2 = canvas('NuevaMascota2');
    expect(paso2).toContain('animation: rise 400ms ease-out both');
    expect(paso2).toContain('animation: rise 400ms ease-out 60ms both');
    expect(paso2).toContain('animation: rise 400ms ease-out 120ms both');
    expect(paso2).toContain('animation: rise 400ms ease-out 180ms both');
    expect(paso2).toContain('font-size: 18px; font-weight: 900');
    expect(paso2).toContain('height: 44px; box-sizing: border-box; padding: 0 16px; border-radius: 999px; border: 1px solid var(--accent); background: var(--pill); font-weight: 700');
    expect(paso2).toContain('height: 44px; box-sizing: border-box; padding: 0 16px; border-radius: 999px; border: 1px solid var(--border); background: var(--default); font-weight: 600');

    const screen = source('screens/add-pet/index.tsx');
    expect(screen).toContain('<RiseIn testID="add-pet-rise-medical" delayMs={0} className="mt-3">');
    expect(screen).toContain('<RiseIn testID="add-pet-rise-age" delayMs={60}>');
    expect(screen).toContain('<RiseIn testID="add-pet-rise-sterilized" delayMs={120}>');
    expect(screen).toContain('<RiseIn testID="add-pet-rise-microchip" delayMs={180}>');
    expect(screen).toContain('text-lg font-black text-foreground');
    expect(screen).toContain('gap: step === 2 ? 16 : 12');
    expect(screen.split("'h-11 justify-center rounded-full border border-accent bg-tab-pill px-4'")).toHaveLength(3);
    expect(screen.split("'h-11 justify-center rounded-full border border-border bg-default px-4'")).toHaveLength(3);
    expect(screen.split("'text-sm font-bold text-foreground'")).toHaveLength(3);
    expect(screen.split("'text-sm font-semibold text-foreground'")).toHaveLength(3);
    expect(screen).not.toContain('bg-accent-soft');
  });
});

describe('#205 R19: pie fijo', () => {
  it('#205 R19: los dos pasos fijan la CTA abajo como el artboard', () => {
    expect(canvas('NuevaMascota')).toContain('padding: 16px 20px 34px');
    expect(canvas('NuevaMascota2')).toContain('padding: 16px 20px 34px');

    const screen = source('screens/add-pet/index.tsx');
    expect(screen).toContain('testID="add-pet-footer" className="bg-background px-5 pt-4"');
    expect(screen).toContain('style={{ paddingBottom: Math.max(insets.bottom, 16) }}');
    expect(screen).toContain('keyboardVerticalOffset={0}');
    expect(screen).not.toContain('headerHeight');
    expect(screen).not.toContain('HeaderHeightContext');
  });
});

describe('#205 R20: carta', () => {
  it('#205 R20: la carta registra la enmienda #205', () => {
    const guidelines = readFileSync(join(process.cwd(), '..', 'docs/ui-guidelines.md'), 'utf8');
    const start = guidelines.indexOf('## Enmienda #205');
    expect(start).toBeGreaterThanOrEqual(0);

    const rest = guidelines.slice(start);
    const next = rest.indexOf('\n## ', 1);
    const section = next === -1 ? rest : rest.slice(0, next);
    expect(section.startsWith('## Enmienda #205 — el flujo de cuenta como el canvas')).toBe(true);
    for (const literal of [
      'RiseIn',
      'PingoFloat',
      'ScreenHeader',
      'headerShown: false',
      '--radius-32',
      '--radius-40',
      '--text-34',
      'PopIn',
      'specs/mobile-canvas-account-flow/requirements.md',
    ]) {
      expect(section).toContain(literal);
    }
  });
});
