const { readFileSync, readdirSync } = jest.requireActual<typeof import('fs')>('fs');
const { join } = jest.requireActual<typeof import('path')>('path');
const sourceRoot = join(process.cwd(), 'src');
const repositoryRoot = join(process.cwd(), '..');
const readSource = (path: string) => readFileSync(join(sourceRoot, path), 'utf8');
function sourceFiles(directory = sourceRoot): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sourceFiles(path);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
  });
}
it('#180 R4.4: el ping es local y Welcome no exporta su PingRing', () => {
  expect(readSource('screens/alert-detail/ping-ring.tsx')).not.toContain('welcome');
  expect(readSource('screens/welcome/index.tsx')).not.toMatch(/export\s+(?:function\s+PingRing|\{[^}]*PingRing)/);
});
it('#180 R4.5: ping-ring.tsx no usa MOTION_PING_TIMING ni escribe 1800', () => {
  expect(readSource('screens/alert-detail/ping-ring.tsx')).not.toMatch(/MOTION_PING_TIMING|1800/);
});
it('#180 R13.2: el ping queda grep-limpio sin emoji ni escapes', () => {
  expect(readSource('screens/alert-detail/ping-ring.tsx')).not.toMatch(/\p{Extended_Pictographic}|\\u[\da-fA-F{]/u);
});

it('#180 R5.6: solo la barra de pestañas y el detalle importan expo-blur', () => {
  expect(sourceFiles().filter(path => path.endsWith('.tsx') && readFileSync(path, 'utf8').includes("from 'expo-blur'"))
    .map(path => path.slice(sourceRoot.length + 1)).sort()).toEqual(['components/floating-tab-bar.tsx', 'screens/alert-detail/index.tsx']);
});
