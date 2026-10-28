const fs = jest.requireActual<typeof import('fs')>('fs');
const { join } = jest.requireActual<typeof import('path')>('path');
const imagesRoot = join(process.cwd(), 'assets', 'images');
const masterRoot = join(process.cwd(), '..', 'specs', 'mobile-orbit-activity-pose', 'design-src');

it('#225 R5: orbit-walk.webp es WebP VP8X con alfa, estático, 1024 × 1024 y como mucho 100000 bytes', () => {
  const path = join(imagesRoot, 'orbit-walk.webp');
  expect(fs.existsSync(path)).toBe(true);
  const bytes = fs.readFileSync(path);
  expect({
    riff: bytes.toString('ascii', 0, 4),
    webp: bytes.toString('ascii', 8, 12),
    chunk: bytes.toString('ascii', 12, 16),
    alpha: (bytes[20] & 0x10) !== 0,
    animated: (bytes[20] & 0x02) !== 0,
    width: bytes.readUIntLE(24, 3) + 1,
    height: bytes.readUIntLE(27, 3) + 1,
  }).toEqual({ riff: 'RIFF', webp: 'WEBP', chunk: 'VP8X', alpha: true, animated: false, width: 1024, height: 1024 });
  expect(bytes.length).toBeLessThanOrEqual(100000);
});

it('#225 R5: el maestro PNG y su prompt están congelados en la spec', () => {
  const master = join(masterRoot, 'mascot-11-walk.png');
  const prompt = join(masterRoot, 'mascot-11-walk.prompt.txt');
  expect(fs.existsSync(master)).toBe(true);
  expect(fs.existsSync(prompt)).toBe(true);
  expect(fs.readFileSync(prompt, 'utf8').trim()).not.toBe('');
  const png = fs.readFileSync(master);
  expect([...png.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  expect(png.toString('ascii', 12, 16)).toBe('IHDR');
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1024, 1024]);
});

it('#225 R1: declara home.orbitWalkLabel en los dos idiomas y su registro', () => {
  const { en, es } = jest.requireActual<{ en: Record<string, string>; es: Record<string, string> }>('../i18n/catalog');
  expect({ en: en['home.orbitWalkLabel'], es: es['home.orbitWalkLabel'] })
    .toEqual({ en: 'Orbit walking', es: 'Orbit caminando' });
  for (const catalog of [en, es]) {
    const keys = Object.keys(catalog);
    expect(keys.indexOf('home.orbitWalkLabel')).toBe(keys.indexOf('home.orbitPhraseCalm') + 1);
  }

  const table = fs.readFileSync(join(process.cwd(), 'src', '__tests__', 'ui-copy-table.ts'), 'utf8');
  const home = table.slice(table.indexOf('export const R3_HOME: UseRow[] = ['));
  expect(home.split('\n];')[0].trimEnd().split('\n').pop())
    .toBe("  { file: 'src/screens/home/index.tsx', key: 'home.orbitWalkLabel' },");

  const designPath = join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md');
  expect(fs.existsSync(designPath)).toBe(true);
  const design = fs.readFileSync(designPath, 'utf8');
  const section = design.slice(design.indexOf('### §2.39 — Añadidos por #225 — Orbit renombrado y su pose de actividad'));
  expect(section.split('\n### ')[0]).toContain('| — | `home.orbitWalkLabel` | `Orbit walking` | `Orbit caminando` | ← añadida por #225 (R1) |');
});
