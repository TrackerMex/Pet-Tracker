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
