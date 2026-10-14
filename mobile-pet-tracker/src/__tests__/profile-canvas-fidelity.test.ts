interface DirectoryEntry {
  name: string;
  isDirectory: () => boolean;
}

declare function require(moduleName: 'fs'): {
  readdirSync: (path: string, options: { withFileTypes: true }) => DirectoryEntry[];
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const sourceRoot = join(process.cwd(), 'src');

function sourceFiles(directory: string = sourceRoot): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return entry.name === '__tests__' ? [] : sourceFiles(path);
    }
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

function filesMatching(pattern: RegExp): string[] {
  return sourceFiles()
    .filter((path) => pattern.test(readFileSync(path, 'utf8')))
    .map((path) => path.slice(sourceRoot.length + 1))
    .sort();
}

describe('#173 R4: avatars solo en Perfil', () => {
  it('limita la variante nueva al consumidor Perfil', () => {
    expect(filesMatching(/variant="avatars"/)).toEqual(['screens/profile/index.tsx']);
  });
});

describe('#173 R2: inventario de radios nuevos', () => {
  it('reserva rounded-hero al Card compartido y el skeleton de Perfil', () => {
    expect(filesMatching(/\brounded-hero\b/)).toEqual(['components/card.tsx', 'screens/profile/index.tsx']);
  });
});

describe('#173 R2.4: inventario de tamaños nuevos', () => {
  it('reserva text-26 al nombre de la mascota en Perfil', () => {
    expect(filesMatching(/\btext-26\b/)).toEqual(['screens/profile/index.tsx']);
  });
});

describe('#173 R3: Card hero y flat solo en Perfil', () => {
  it('Perfil es el único consumidor de Card hero y lo usa una vez', () => {
    expect(filesMatching(/variant="hero"/)).toEqual(['screens/profile/index.tsx']);
    const profile = readFileSync(join(sourceRoot, 'screens/profile/index.tsx'), 'utf8');
    expect(profile.match(/variant="hero"/g)).toHaveLength(1);
  });
});
