const fs = jest.requireActual<typeof import('fs')>('fs');
const { dirname, join, relative, resolve, sep } = jest.requireActual<typeof import('path')>('path');
const sourceRoot = join(process.cwd(), 'src');
const imagesRoot = join(process.cwd(), 'assets', 'images');

function sourceFiles(directory = sourceRoot): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
}

const isTestPath = (path: string) =>
  relative(sourceRoot, path).split(sep).includes('__tests__') || /\.test\./.test(path.split(sep).pop() ?? '');
const productionFiles = () => sourceFiles().filter(path => /\.(ts|tsx|js|jsx|json|css)$/.test(path) && !isTestPath(path));
const testFiles = () => sourceFiles().filter(path => /\.(ts|tsx)$/.test(path) && isTestPath(path));

it('#225 R2: las nueve poses se llaman orbit-* y todo require de imagen resuelve', () => {
  const images = fs.readdirSync(imagesRoot);
  expect(images.filter(name => /pingo/i.test(name))).toEqual([]);
  expect(images).toEqual(expect.arrayContaining([
    'orbit-celebrate.webp',
    'orbit-clipboard.webp',
    'orbit-collar.webp',
    'orbit-food.webp',
    'orbit-health.webp',
    'orbit-sleep.webp',
    'orbit-talk.webp',
    'orbit-wave.webp',
    'orbit-wave-blink.webp',
  ]));

  const requires = [...productionFiles(), ...testFiles()].flatMap(path =>
    [...fs.readFileSync(path, 'utf8').matchAll(/require\('([^']*assets\/images\/[^']+\.webp)'\)/g)]
      .map(match => ({ file: relative(sourceRoot, path), target: resolve(dirname(path), match[1]) })));
  expect(requires.length).toBeGreaterThan(0);
  expect(requires.filter(({ target }) => !fs.existsSync(target))
    .map(({ file, target }) => `${file}: ${relative(process.cwd(), target)}`)).toEqual([]);
});
