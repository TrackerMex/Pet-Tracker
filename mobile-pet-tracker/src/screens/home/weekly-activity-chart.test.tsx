declare function require(moduleName: 'fs'): {
  existsSync: (path: string) => boolean;
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

const projectRoot = process.cwd();
const chartSourcePath = join(
  projectRoot,
  'src',
  'screens',
  'home',
  'weekly-activity-chart.tsx',
);

describe('R1: la gráfica entra por el subpath v2 y por ningún otro', () => {
  it('declara la versión exacta y transforma sus dos paquetes ESM', () => {
    const packageJson = JSON.parse(
      readFileSync(join(projectRoot, 'package.json'), 'utf8'),
    ) as {
      dependencies: Record<string, string>;
      jest: { transformIgnorePatterns: string[] };
    };
    const transformPattern = packageJson.jest.transformIgnorePatterns[0];

    expect(packageJson.dependencies['react-native-chart-kit']).toBe('7.0.4');
    expect(transformPattern).toContain('react-native-chart-kit');
    expect(transformPattern).toContain('paths-js');
  });

  it('importa la gráfica solo desde react-native-chart-kit/v2', () => {
    expect(existsSync(chartSourcePath)).toBe(true);

    if (!existsSync(chartSourcePath)) return;

    const source = readFileSync(chartSourcePath, 'utf8');

    expect(source).toContain("from 'react-native-chart-kit/v2'");
    expect(source).not.toContain("from 'react-native-chart-kit'");
    expect(source).not.toContain('react-native-chart-kit/dist');
  });

  it('pinea 7.0.4 porque la geometría del eje depende de sus constantes', () => {
    const packageJson = JSON.parse(
      readFileSync(join(projectRoot, 'package.json'), 'utf8'),
    ) as { dependencies: Record<string, string> };
    const source = readFileSync(chartSourcePath, 'utf8');

    expect(packageJson.dependencies['react-native-chart-kit']).toBe('7.0.4');
    expect(source).toContain('base padding: 18, 14, 12, 10');
    expect(source).toContain('label gap: 8');
    expect(source).toContain('text width factor: 0.56');
    expect(source).toContain('measured label height: 14');
    expect(source).toContain('band padding: 0.12, 0.08');
  });
});
