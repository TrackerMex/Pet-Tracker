interface DirectoryEntry {
  name: string;
  isDirectory: () => boolean;
}

declare function require(moduleName: 'fs'): {
  readdirSync: (
    path: string,
    options: { withFileTypes: true },
  ) => DirectoryEntry[];
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

    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
      ? [path]
      : [];
  });
}

describe('#218 R3: todo BottomSheet de la app pasa el token surface', () => {
  const importers = sourceFiles()
    .filter((path) => readFileSync(path, 'utf8').includes('@expo/ui/community/bottom-sheet'))
    .map((path) => path.slice(sourceRoot.length + 1))
    .sort();

  it('#218 R3: solo Recordatorios y Vinculación montan un BottomSheet', () => {
    expect(importers).toEqual(['screens/pairing/index.tsx', 'screens/reminders/index.tsx']);
  });

  it.each(importers)('#218 R3: %s monta un BottomSheet con backgroundStyle surface', (path) => {
    const source = readFileSync(join(sourceRoot, path), 'utf8');
    expect(source.match(/<BottomSheet(?![A-Za-z])/g)).toHaveLength(1);
    expect(source.split('backgroundStyle={{ backgroundColor: surface }}')).toHaveLength(2);
    expect(source).toContain("const [surface] = useThemeColors(['surface']);");
  });
});
