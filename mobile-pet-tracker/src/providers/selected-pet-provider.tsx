import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useAuth } from './auth-provider';

export interface SelectedPetContextValue {
  selectedPetId: string | null;
  selectPet: (id: string) => void;
}

const SelectedPetContext = createContext<SelectedPetContextValue | undefined>(
  undefined,
);

export function SelectedPetProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [selection, setSelection] = useState<{ token: string | null; petId: string | null }>({
    token: null,
    petId: null,
  });
  if (selection.token !== token) {
    setSelection({ token, petId: null });
  }
  const selectedPetId = selection.token === token ? selection.petId : null;
  const selectPet = useCallback((id: string) => setSelection({ token, petId: id }), [token]);
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
