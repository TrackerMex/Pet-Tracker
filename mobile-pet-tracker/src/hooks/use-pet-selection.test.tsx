import { renderHook } from '@testing-library/react-native';
import { useIsFocused } from 'expo-router';

import type { PetProfile } from '../api/types';
import {
  useSelectedPet,
  type SelectedPetContextValue,
} from '../providers/selected-pet-provider';
import {
  usePetSelection,
  type PetSelectionSource,
} from './use-pet-selection';

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

function productionSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return entry.name === '__tests__' ? [] : productionSourceFiles(path);
    }

    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
      ? [path]
      : [];
  });
}

jest.mock('expo-router', () => ({
  useIsFocused: jest.fn(),
}));

jest.mock('../providers/selected-pet-provider', () => ({
  useSelectedPet: jest.fn(),
}));

const mockUseIsFocused = jest.mocked(useIsFocused);
const mockUseSelectedPet = jest.mocked(useSelectedPet);
const mockSelectPet = jest.fn();
const mockClearPet = jest.fn();

function makePet(id: string): PetProfile {
  return { id } as PetProfile;
}

function petsResult(
  pets: PetProfile[],
  isRefreshing = false,
): PetSelectionSource {
  return {
    data: { kind: 'ok', pets },
    isRefreshing,
  };
}

describe('R10: usePetSelection respeta el foco y la revalidación', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsFocused.mockReturnValue(true);
    mockUseSelectedPet.mockReturnValue({
      selectedPetId: 'pet-new',
      selectPet: mockSelectPet,
    } satisfies SelectedPetContextValue);
  });

  it('no pisa la selección desde una pantalla desenfocada con lista stale', async () => {
    mockUseIsFocused.mockReturnValue(false);

    await renderHook(() => usePetSelection(petsResult([makePet('pet-old')])));

    expect(mockSelectPet).not.toHaveBeenCalled();
  });

  it('no pisa la selección mientras la pantalla enfocada revalida', async () => {
    await renderHook(() =>
      usePetSelection(petsResult([makePet('pet-old')], true)),
    );

    expect(mockSelectPet).not.toHaveBeenCalled();
  });

  it('selecciona el primer pet cuando la selección no existe en la lista enfocada', async () => {
    await renderHook(() => usePetSelection(petsResult([makePet('pet-old')])));

    expect(mockSelectPet).toHaveBeenCalledTimes(1);
    expect(mockSelectPet).toHaveBeenCalledWith('pet-old');
  });

  it('conserva la selección cuando existe en la lista enfocada', async () => {
    await renderHook(() =>
      usePetSelection(
        petsResult([makePet('pet-old'), makePet('pet-new')]),
      ),
    );

    expect(mockSelectPet).not.toHaveBeenCalled();
  });
});

describe('R10: la selección automática vive solo en usePetSelection', () => {
  it('no permite copias del efecto manual fuera del hook', () => {
    const hookPath = join(sourceRoot, 'hooks', 'use-pet-selection.ts');
    const violations = productionSourceFiles(sourceRoot)
      .filter((path) => path !== hookPath)
      .filter((path) => readFileSync(path, 'utf8').includes('selectionExists'))
      .map((path) => path.slice(sourceRoot.length + 1));

    expect(violations).toEqual([]);
  });
});

describe('#87 R8: usePetSelection acepta la forma mínima y no conoce use-' + 'api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsFocused.mockReturnValue(true);
    mockUseSelectedPet.mockReturnValue({
      selectedPetId: 'pet-new',
      selectPet: mockSelectPet,
    } satisfies SelectedPetContextValue);
  });

  it('does not import the retired fetching hook', () => {
    const source = readFileSync(
      join(sourceRoot, 'hooks', 'use-pet-selection.ts'),
      'utf8',
    );

    expect(source).not.toContain(['use', 'api'].join('-'));
  });

  it('does not select while the minimal source shape is refreshing', async () => {
    await renderHook(() =>
      usePetSelection({
        data: { kind: 'ok', pets: [makePet('pet-old')] },
        isRefreshing: true,
      }),
    );

    expect(mockSelectPet).not.toHaveBeenCalled();
  });
});

describe('#181 R2: limpieza de la selección', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsFocused.mockReturnValue(true);
    mockUseSelectedPet.mockReturnValue({
      selectedPetId: 'pet-stale', selectPet: mockSelectPet, clearPet: mockClearPet,
    });
  });

  it('R2.2: limpia exactamente una vez con lista ok vacía y selección rancia', async () => {
    await renderHook(() => usePetSelection(petsResult([])));
    expect(mockClearPet).toHaveBeenCalledTimes(1);
    expect(mockSelectPet).not.toHaveBeenCalled();
  });

  it('R2.3: no limpia sin foco', async () => {
    mockUseIsFocused.mockReturnValue(false);
    await renderHook(() => usePetSelection(petsResult([])));
    expect(mockClearPet).not.toHaveBeenCalled();
    expect(mockSelectPet).not.toHaveBeenCalled();
  });

  it('R2.3: no limpia durante la revalidación', async () => {
    await renderHook(() => usePetSelection(petsResult([], true)));
    expect(mockClearPet).not.toHaveBeenCalled();
    expect(mockSelectPet).not.toHaveBeenCalled();
  });

  it('R2.3: no limpia una selección ya nula', async () => {
    mockUseSelectedPet.mockReturnValue({
      selectedPetId: null, selectPet: mockSelectPet, clearPet: mockClearPet,
    });
    await renderHook(() => usePetSelection(petsResult([])));
    expect(mockClearPet).not.toHaveBeenCalled();
    expect(mockSelectPet).not.toHaveBeenCalled();
  });

  it('R2.3: no limpia sin datos', async () => {
    await renderHook(() => usePetSelection({ data: undefined, isRefreshing: false }));
    expect(mockClearPet).not.toHaveBeenCalled();
    expect(mockSelectPet).not.toHaveBeenCalled();
  });

  it.each(['error', 'unreachable', 'missing-config', 'unauthorized'] as const)(
    'R2.3: no limpia con kind %s', async (kind) => {
      await renderHook(() => usePetSelection({ data: { kind, message: 'offline' }, isRefreshing: false }));
      expect(mockClearPet).not.toHaveBeenCalled();
      expect(mockSelectPet).not.toHaveBeenCalled();
    },
  );

  it('R2.4: solo proveedor y hook mencionan clearPet en producción', () => {
    const writers = productionSourceFiles(sourceRoot)
      .filter((path) => readFileSync(path, 'utf8').includes('clearPet'))
      .map((path) => path.slice(sourceRoot.length + 1))
      .sort();
    expect(writers).toEqual(['hooks/use-pet-selection.ts', 'providers/selected-pet-provider.tsx']);
  });
});
