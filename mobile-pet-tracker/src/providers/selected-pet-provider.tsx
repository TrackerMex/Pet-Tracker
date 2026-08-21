import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export interface SelectedPetContextValue {
  selectedPetId: string | null;
  selectPet: (id: string) => void;
}

const SelectedPetContext = createContext<SelectedPetContextValue | undefined>(
  undefined,
);

export function SelectedPetProvider({ children }: { children: ReactNode }) {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const selectPet = useCallback((id: string) => setSelectedPetId(id), []);
  const value = useMemo(
    () => ({ selectedPetId, selectPet }),
    [selectPet, selectedPetId],
  );

  return (
    <SelectedPetContext.Provider value={value}>
      {children}
    </SelectedPetContext.Provider>
  );
}

export function useSelectedPet(): SelectedPetContextValue {
  const value = useContext(SelectedPetContext);

  if (!value) {
    throw new Error('useSelectedPet must be used within a SelectedPetProvider');
  }

  return value;
}
