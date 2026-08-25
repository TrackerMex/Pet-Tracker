import { renderHook } from '@testing-library/react-native';
import { useIsFocused } from 'expo-router';

import type { PetsState } from '../api/pets';
import type { PetProfile } from '../api/types';
import {
  useSelectedPet,
  type SelectedPetContextValue,
} from '../providers/selected-pet-provider';
import type { ApiResult } from './use-api';
import { usePetSelection } from './use-pet-selection';

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

function makePet(id: string): PetProfile {
  return { id } as PetProfile;
}

function petsResult(
  pets: PetProfile[],
  isRefreshing = false,
): ApiResult<PetsState> {
  return {
    data: { kind: 'ok', pets },
    isRefreshing,
    refetch: jest.fn(),
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
