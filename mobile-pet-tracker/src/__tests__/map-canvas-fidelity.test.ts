import { readFileSync } from 'fs';
import { join } from 'path';

type Row = {
  artboard: string;
  canvas: string;
  canvasCount: number;
  file: string;
  production: string;
  productionCount: number;
};

const occurrences = (source: string, literal: string) =>
  source.split(literal).length - 1;

const readArtboard = (name: string) =>
  readFileSync(
    join(
      process.cwd(),
      '..',
      'specs/mobile-canvas-map/canvas',
      `${name}.dc.html`,
    ),
    'utf8',
  );

const readProduction = (file: string) =>
  readFileSync(join(process.cwd(), 'src', file), 'utf8');

const checkRow = (row: Row) => {
  expect(occurrences(readArtboard(row.artboard), row.canvas)).toBe(
    row.canvasCount,
  );
  expect(occurrences(readProduction(row.file), row.production)).toBe(
    row.productionCount,
  );
};

describe('#201 R1: la pila de stats sube al entrar', () => {
  it.each<Row>([
    {
      artboard: 'Mapa',
      canvas: 'animation: rise 400ms ease-out both',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'homeEntering(0, MOTION_RISE_OFFSET_Y)',
      productionCount: 1,
    },
    {
      artboard: 'Mapa',
      canvas: 'bottom: 104px; display: flex; flex-direction: column; gap: 10px',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'className="gap-2.5"',
      productionCount: 2,
    },
  ])('#201 R1: $artboard › $canvas', checkRow);
});

describe('#201 R15: la ruta del mapa se dibuja con trazo 5', () => {
  it.each<Row>([
    {
      artboard: 'Mapa',
      canvas: 'stroke="#107148" stroke-width="5"',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'polylineWidth={5}',
      productionCount: 1,
    },
  ])('#201 R15: $artboard › $canvas', checkRow);
});

describe('#201 R2: la píldora es de cristal', () => {
  it.each<Row>([
    {
      artboard: 'Mapa',
      canvas: 'padding: 6px 14px 6px 6px',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'py-1.5 pl-1.5 pr-3.5',
      productionCount: 2,
    },
    {
      artboard: 'Mapa',
      canvas: '--glass:rgba(255,255,255,0.86)',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'bg-glass-surface-strong',
      productionCount: 1,
    },
    {
      artboard: 'Mapa',
      canvas: '--glass:rgba(255,255,255,0.86)',
      canvasCount: 1,
      file: 'theme/global.css',
      production: '--color-glass-surface-strong: rgba(255,255,255,0.86)',
      productionCount: 1,
    },
    {
      artboard: 'Mapa',
      canvas: 'width: 28px; height: 28px',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'size={28}',
      productionCount: 1,
    },
    {
      artboard: 'Mapa',
      canvas: 'font-size: 15px; font-weight: 800',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'text-15 font-extrabold',
      productionCount: 1,
    },
    {
      artboard: 'Mapa',
      canvas:
        'gap: 5px; font-size: 12px; font-weight: 700; color: var(--accent-strong)',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'gap-1.25',
      productionCount: 1,
    },
    {
      artboard: 'Mapa',
      canvas:
        'gap: 5px; font-size: 12px; font-weight: 700; color: var(--accent-strong)',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'text-xs font-bold',
      productionCount: 1,
    },
    {
      artboard: 'Mapa',
      canvas:
        'width: 7px; height: 7px; border-radius: 50%; background: var(--accent)',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'size-1.75 rounded-full',
      productionCount: 1,
    },
    {
      artboard: 'Mapa',
      canvas: 'box-shadow: var(--shadow)',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'shadows.card',
      productionCount: 2,
    },
  ])('#201 R2: $artboard › $canvas › $production', checkRow);
});

describe('#201 R4: la tarjeta de stats flota sin borde', () => {
  it.each<Row>([
    {
      artboard: 'Mapa',
      canvas:
        'border-radius: 24px; background: var(--surface); box-shadow: 0 12px 32px rgba(13,17,23,0.14); padding: 12px',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'gap-2.5 rounded-24 bg-surface p-3',
      productionCount: 2,
    },
    {
      artboard: 'Mapa',
      canvas:
        'border-radius: 24px; background: var(--surface); box-shadow: 0 12px 32px rgba(13,17,23,0.14); padding: 12px',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'shadows.floating',
      productionCount: 2,
    },
    {
      artboard: 'Mapa',
      canvas: 'grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'className="gap-2"',
      productionCount: 2,
    },
  ])('#201 R4: $artboard › $canvas › $production', checkRow);
});

describe('#201 R5: los tiles llevan el rótulo arriba y la tinta del canvas', () => {
  it.each<Row>([
    {
      artboard: 'Mapa',
      canvas: 'border-radius: 14px; background: var(--default); padding: 10px 12px',
      canvasCount: 4,
      file: 'screens/map/index.tsx',
      production: 'flex-1 gap-0.5 rounded-14 bg-default px-3 py-2.5',
      productionCount: 4,
    },
    {
      artboard: 'Mapa',
      canvas: 'font-size: 11px; font-weight: 600; color: var(--muted)',
      canvasCount: 4,
      file: 'screens/map/index.tsx',
      production: 'text-11 font-semibold text-muted',
      productionCount: 4,
    },
    {
      artboard: 'Mapa',
      canvas: 'font-size: 20px; font-weight: 900; color: var(--accent-strong)',
      canvasCount: 2,
      file: 'screens/map/index.tsx',
      production: 'text-xl font-black text-accent-strong',
      productionCount: 1,
    },
    {
      artboard: 'Mapa',
      canvas: 'font-size: 16px; font-weight: 700; color: var(--muted)',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'text-base font-bold text-muted',
      productionCount: 1,
    },
  ])('#201 R5: $artboard › $canvas › $production', checkRow);
});

describe('#201 R6: el guion se lee apagado', () => {
  it.each<Row>([
    {
      artboard: 'MapaSinUbicacion',
      canvas: 'font-size: 20px; font-weight: 900; color: var(--muted)',
      canvasCount: 4,
      file: 'screens/map/index.tsx',
      production: "'text-xl font-black text-muted'",
      productionCount: 1,
    },
  ])('#201 R6: $artboard › $canvas › $production', checkRow);
});

describe('#201 R7: el botón de modo perdido es rosa con icono', () => {
  it.each<Row>([
    {
      artboard: 'Mapa',
      canvas: 'height: 50px',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'h-12.5',
      productionCount: 2,
    },
    {
      artboard: 'Mapa',
      canvas: 'border-radius: 14px; background: var(--rose); color: var(--rose-s)',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: '`h-12.5 gap-2 rounded-14 ${CATEGORY_SLOTS.rose.surface}`',
      productionCount: 1,
    },
    {
      artboard: 'Mapa',
      canvas: 'border-radius: 14px; background: var(--rose); color: var(--rose-s)',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'CATEGORY_SLOTS.rose.ink',
      productionCount: 1,
    },
    {
      artboard: 'Mapa',
      canvas: '--rose:#FFF0F3',
      canvasCount: 1,
      file: 'theme/global.css',
      production: '--color-category-rose: #FFF0F3',
      productionCount: 1,
    },
    {
      artboard: 'Mapa',
      canvas: '--rose-s:#D80B34',
      canvasCount: 1,
      file: 'theme/global.css',
      production: '--color-category-rose-strong: #D80B34',
      productionCount: 1,
    },
    {
      artboard: 'Mapa',
      canvas: 'M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: '<AlertTriangle',
      productionCount: 1,
    },
    {
      artboard: 'Mapa',
      canvas: 'stroke-width="2.2"',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'strokeWidth={2.2}',
      productionCount: 4,
    },
  ])('#201 R7: $artboard › $canvas › $production', checkRow);
});

describe('#201 R8: el error de modo perdido vive en la tarjeta', () => {
  it.each<Row>([
    {
      artboard: 'MapaModoPerdidoError',
      canvas: 'role="alert"',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'accessibilityRole="alert"',
      productionCount: 1,
    },
    {
      artboard: 'MapaModoPerdidoError',
      canvas: 'font-size: 12px; line-height: 16px; color: var(--danger)',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'text-center text-xs font-normal text-danger',
      productionCount: 1,
    },
  ])('#201 R8: $artboard › $canvas › $production', checkRow);
});

describe('#201 R9: el aviso sin ubicación lleva icono', () => {
  it.each<Row>([
    {
      artboard: 'MapaSinUbicacion',
      canvas: 'padding: 14px 16px; border-radius: 20px',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'gap-2 px-4 py-3.5',
      productionCount: 1,
    },
    {
      artboard: 'MapaSinUbicacion',
      canvas: 'font-size: 14px; font-weight: 600',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'text-sm font-semibold text-muted',
      productionCount: 1,
    },
  ])('#201 R9: $artboard › $canvas › $production', checkRow);
});

describe('#201 R10: el esqueleto de la pila', () => {
  it.each<Row>([
    {
      artboard: 'MapaCarga',
      canvas: 'aria-busy="true"',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'accessibilityState={{ busy: true }}',
      productionCount: 1,
    },
    {
      artboard: 'MapaCarga',
      canvas: 'animation: pulse 1.4s ease-in-out infinite',
      canvasCount: 11,
      file: 'screens/map/index.tsx',
      production: 'variant="pulse"',
      productionCount: 11,
    },
    {
      artboard: 'MapaCarga',
      canvas: 'background: var(--lip-gray)',
      canvasCount: 10,
      file: 'screens/map/index.tsx',
      production: 'bg-lip-gray',
      productionCount: 10,
    },
    {
      artboard: 'MapaCarga',
      canvas: 'width: 150px; height: 12px',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'h-3 w-37.5',
      productionCount: 1,
    },
    {
      artboard: 'MapaCarga',
      canvas: 'width: 48px; height: 10px',
      canvasCount: 4,
      file: 'screens/map/index.tsx',
      production: 'h-2.5 w-12',
      productionCount: 4,
    },
    {
      artboard: 'MapaCarga',
      canvas: 'width: 72px; height: 22px',
      canvasCount: 4,
      file: 'screens/map/index.tsx',
      production: 'h-5.5 w-18',
      productionCount: 4,
    },
    {
      artboard: 'MapaCarga',
      canvas: 'width: 28px; height: 28px',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'size-7 rounded-full bg-lip-gray',
      productionCount: 1,
    },
  ])('#201 R10: $artboard › $canvas › $production', checkRow);

  it('#201 R10: los once Skeleton del mapa son pulse', () => {
    const source = readProduction('screens/map/index.tsx');
    const openings = source
      .split('<Skeleton')
      .slice(1)
      .map((chunk) => chunk.slice(0, chunk.indexOf('/>')));

    expect(openings).toHaveLength(11);
    for (const opening of openings) {
      expect(opening).toContain('variant="pulse"');
    }
    expect(source).not.toContain('animation=');
  });
});

describe('#201 R11: Pingo en las dos ramas de error', () => {
  it.each<Row>([
    {
      artboard: 'MapaError',
      canvas:
        'width: 56px; height: 56px; border-radius: 50%; background: var(--rose); color: var(--danger); border: 4px solid var(--bg)',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production:
        'size-14 items-center justify-center rounded-full border-4 border-background ${CATEGORY_SLOTS.rose.surface}',
      productionCount: 2,
    },
    {
      artboard: 'MapaError',
      canvas: 'right: 36px; bottom: 34px',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'absolute bottom-8.5 right-9',
      productionCount: 2,
    },
    {
      artboard: 'MapaError',
      canvas: 'M20 12a8 8 0 1 1-2.5-5.8',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: '<Refresh',
      productionCount: 2,
    },
    {
      artboard: 'MapaError',
      canvas: 'M12 8v5M12 16.5h.01',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: '<AlertCircle',
      productionCount: 2,
    },
    {
      artboard: 'MapaError',
      canvas: 'stroke-width="2.6"',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'strokeWidth={2.6}',
      productionCount: 2,
    },
    {
      artboard: 'MapaError',
      canvas: 'padding: 60px 24px 120px',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'bg-background px-6 pt-15 pb-30',
      productionCount: 3,
    },
    {
      artboard: 'MapaError',
      canvas: 'animation: pop 400ms ease-out 300ms both',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: '<PopIn',
      productionCount: 2,
    },
  ])('#201 R11: $artboard › $canvas › $production', checkRow);
});

describe('#201 R12: Pingo sin mascotas', () => {
  it.each<Row>([
    {
      artboard: 'MapaSinMascotas',
      canvas: 'stroke-width="2.8"',
      canvasCount: 1,
      file: 'screens/map/index.tsx',
      production: 'strokeWidth={2.8}',
      productionCount: 1,
    },
  ])('#201 R12: $artboard › $canvas › $production', checkRow);
});
