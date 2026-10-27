declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');

const FILAS = [
  {
    n: 1,
    artboard: 'Perfil',
    canvas: 'margin: 0 -20px; height: 430px',
    file: 'src/screens/profile/index.tsx',
    literal: 'variant="bleed"',
  },
  {
    n: 2,
    artboard: 'Perfil',
    canvas: 'margin: 0 -20px; height: 430px',
    file: 'src/components/pet-hero-header.tsx',
    literal: 'PET_HERO_MEDIA_HEIGHT = 430',
  },

  {
    n: 4,
    artboard: 'Perfil',
    canvas: 'height: 44px; padding: 0 16px; border-radius: 999px; background: var(--glass)',
    file: 'src/screens/profile/index.tsx',
    literal: 'h-11 flex-row items-center gap-1.5 rounded-full bg-glass-surface-strong px-4',
  },
  {
    n: 5,
    artboard: 'Perfil',
    canvas: 'stroke-width="2.6"',
    file: 'src/screens/profile/index.tsx',
    literal: 'strokeWidth={2.6}',
  },
  {
    n: 6,
    artboard: 'Perfil',
    canvas: 'border: 2px solid var(--accent); background: var(--bg)',
    file: 'src/screens/profile/index.tsx',
    literal: 'variant="glass"',
  },
  {
    n: 7,
    artboard: 'Perfil',
    canvas: 'right: 20px; bottom: 96px; width: 44px; height: 44px',
    file: 'src/screens/profile/index.tsx',
    literal: 'absolute bottom-24 right-5',
  },
  {
    n: 8,
    artboard: 'Perfil',
    canvas: 'border: 3px solid var(--bg); background: var(--accent)',
    file: 'src/screens/profile/index.tsx',
    literal: 'size-11 items-center justify-center rounded-full border-3 border-background bg-accent',
  },
  {
    n: 9,
    artboard: 'Perfil',
    canvas: 'stroke-width="2.4"',
    file: 'src/screens/profile/index.tsx',
    literal: 'strokeWidth={2.4}',
  },
  {
    n: 10,
    artboard: 'Perfil',
    canvas: 'box-shadow: 0 4px 0 var(--lip)',
    file: 'src/screens/profile/index.tsx',
    literal: 'chunkyLip.primary',
  },
  {
    n: 11,
    artboard: 'Perfil',
    canvas: 'font-size: 30px; line-height: 34px; font-weight: 900; letter-spacing: -0.5px',
    file: 'src/screens/profile/index.tsx',
    literal: 'text-3xl font-black leading-8.5 tracking-display text-foreground',
  },
  {
    n: 12,
    artboard: 'Perfil',
    canvas: 'stroke-width="2.2"',
    file: 'src/screens/profile/index.tsx',
    literal: 'strokeWidth={2.2}',
  },
  {
    n: 13,
    artboard: 'Perfil',
    canvas: 'padding: 0 20px 120px',
    file: 'src/screens/profile/index.tsx',
    literal: 'gap-3.5 px-5',
  },
  {
    n: 14,
    artboard: 'Perfil',
    canvas: 'type="checkbox"',
    file: 'src/screens/profile/index.tsx',
    literal: '<ToggleSwitch',
  },
  {
    n: 15,
    artboard: 'Perfil',
    canvas: 'Añadir mascota',
    file: 'src/i18n/catalog.ts',
    literal: "'profile.addPet': 'Añadir mascota'",
  },
  {
    n: 16,
    artboard: 'PerfilCuenta',
    canvas: 'height: 52px; border: 0; border-radius: 14px; background: var(--rose); color: var(--danger); font: 800 15px',
    file: 'src/screens/profile/index.tsx',
    literal: 'text-15 font-extrabold text-danger',
  },
  {
    n: 17,
    artboard: 'PerfilCuenta',
    canvas: 'height: 52px; border: 0; border-radius: 14px; background: var(--rose)',
    file: 'src/screens/profile/index.tsx',
    literal: 'h-13 rounded-14 ${CATEGORY_SLOTS.rose.surface}',
  },
  {
    n: 18,
    artboard: 'PerfilCuenta',
    canvas: '>Cerrar sesión<',
    file: 'src/i18n/catalog.ts',
    literal: "'profile.signOut': 'Cerrar sesión'",
  },
  {
    n: 19,
    artboard: 'PerfilCuenta',
    canvas: '--danger:#D92D20;',
    file: 'src/theme/global.css',
    literal: '--color-danger: #D92D20;',
  },
  {
    n: 20,
    artboard: 'PerfilNotificaciones',
    canvas: 'border-radius: 20px; background: var(--amber); padding: 14px',
    file: 'src/screens/profile/index.tsx',
    literal: 'items-start gap-3 rounded-card p-3.5 ${CATEGORY_SLOTS.amber.surface}',
  },
  {
    n: 21,
    artboard: 'PerfilNotificaciones',
    canvas: 'font-size: 14px; line-height: 1.45; color: var(--fg)',
    file: 'src/screens/profile/index.tsx',
    literal: 'text-sm leading-note font-normal text-foreground',
  },
  {
    n: 22,
    artboard: 'PerfilNotificaciones',
    canvas: 'height: 44px; padding: 0 18px; border: 0; border-radius: 14px; background: var(--accent); color: #FFFFFF; box-shadow: 0 4px 0 var(--lip)',
    file: 'src/screens/profile/index.tsx',
    literal: 'h-11 rounded-14 px-4.5',
  },
  {
    n: 23,
    artboard: 'PerfilNotificaciones',
    canvas: 'Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.',
    file: 'src/i18n/catalog.ts',
    literal: "'profile.notificationsBlocked': 'Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.'",
  },
  {
    n: 24,
    artboard: 'PerfilNotificaciones',
    canvas: 'Abrir configuración',
    file: 'src/i18n/catalog.ts',
    literal: "'profile.openSettings': 'Abrir configuración'",
  },
];

describe('#196 R10: fidelidad de Perfil a los artboards congelados', () => {
  it.each(FILAS)('#196 R10: fila $n — $artboard lleva el literal del canvas y producción lo cumple (enmendado por #222 R9)', ({ artboard, canvas, file, literal }) => {
    const board = readFileSync(join(process.cwd(), '..', 'specs/mobile-profile-photo-hero-canvas/canvas', `${artboard}.dc.html`), 'utf8');
    const production = readFileSync(join(process.cwd(), file), 'utf8');
    expect(board).toContain(canvas);
    expect(production).toContain(literal);
  });

  it('#196 R10: la tabla cubre los tres artboards (enmendado por #222 R9)', () => {
    expect(FILAS).toHaveLength(23);
    expect(new Set(FILAS.map((row) => row.artboard)).size).toBe(3);
  });
});
