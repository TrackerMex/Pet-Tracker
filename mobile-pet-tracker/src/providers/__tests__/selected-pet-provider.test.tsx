import { act, fireEvent, render, renderHook, screen } from '@testing-library/react-native';
import { Button, Text } from 'react-native';

import { useAuth } from '../auth-provider';
import { SelectedPetProvider, useSelectedPet } from '../selected-pet-provider';

jest.mock('../auth-provider', () => ({ useAuth: jest.fn() }));

const mockUseAuth = jest.mocked(useAuth);

beforeEach(() => {
  mockUseAuth.mockReturnValue({
    status: 'authenticated',
    token: 'token-a',
    signIn: jest.fn(),
    signOut: jest.fn(),
  });
});

function SelectedPetProbe() {
  const { selectedPetId, selectPet } = useSelectedPet();

  return (
    <>
      <Text testID="selected-pet">{selectedPetId ?? 'none'}</Text>
      <Button title="Select Luna" onPress={() => selectPet('pet-1')} />
    </>
  );
}

describe('R5: SelectedPetProvider expone la selección', () => {
  it('starts empty and shares a selected pet', async () => {
    await render(
      <SelectedPetProvider>
        <SelectedPetProbe />
      </SelectedPetProvider>,
    );

    expect(screen.getByTestId('selected-pet')).toHaveTextContent('none');

    await fireEvent.press(screen.getByText('Select Luna'));

    expect(screen.getByTestId('selected-pet')).toHaveTextContent('pet-1');
  });

  it('throws when the hook is used outside its provider', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(render(<SelectedPetProbe />)).rejects.toThrow(
      'useSelectedPet must be used within a SelectedPetProvider',
    );

    consoleError.mockRestore();
  });
});

describe('#95 R1: la selección pertenece a la sesión', () => {
  it('olvida la mascota al cambiar de token aunque vuelva el anterior', async () => {
    const view = await render(
      <SelectedPetProvider>
        <SelectedPetProbe />
      </SelectedPetProvider>,
    );
    const rerender = async (token: string | null) => {
      mockUseAuth.mockReturnValue({
        status: token ? 'authenticated' : 'unauthenticated',
        token,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });
      await view.rerender(
        <SelectedPetProvider>
          <SelectedPetProbe />
        </SelectedPetProvider>,
      );
    };

    await fireEvent.press(screen.getByText('Select Luna'));
    expect(screen.getByTestId('selected-pet')).toHaveTextContent('pet-1');
    await rerender(null);
    expect(screen.getByTestId('selected-pet')).toHaveTextContent('none');
    await rerender('token-a');
    expect(screen.getByTestId('selected-pet')).toHaveTextContent('none');
    await rerender('token-b');
    expect(screen.getByTestId('selected-pet')).toHaveTextContent('none');
    await fireEvent.press(screen.getByText('Select Luna'));
    expect(screen.getByTestId('selected-pet')).toHaveTextContent('pet-1');
    await rerender('token-a');
    expect(screen.getByTestId('selected-pet')).toHaveTextContent('none');
  });
});

describe('#181 R2: clearPet pertenece a la sesión', () => {
  function useSelection() {
    const value: ReturnType<typeof useSelectedPet> & { clearPet?: () => void } = useSelectedPet();
    return value;
  }

  it('R2.1: expone clearPet y borra una mascota seleccionada', async () => {
    const { result } = await renderHook(useSelection, { wrapper: SelectedPetProvider });
    expect(typeof result.current.clearPet).toBe('function');
    await act(async () => { result.current.selectPet('pet-1'); });
    expect(result.current.selectedPetId).toBe('pet-1');
    await act(async () => { result.current.clearPet?.(); });
    expect(result.current.selectedPetId ?? 'none').toBe('none');
  });

  it('R2.1: conserva la identidad de clearPet entre renders del mismo token', async () => {
    const view = await renderHook(useSelection, { wrapper: SelectedPetProvider });
    const clearPet = view.result.current.clearPet;
    expect(typeof clearPet).toBe('function');
    await act(async () => { view.result.current.selectPet('pet-1'); });
    await view.rerender(undefined);
    expect(view.result.current.clearPet).toBe(clearPet);
  });

  it('R2.1: cambiar el token reinicia la selección después de limpiar y reseleccionar', async () => {
    const view = await renderHook(useSelection, { wrapper: SelectedPetProvider });
    expect(typeof view.result.current.clearPet).toBe('function');
    await act(async () => { view.result.current.selectPet('pet-1'); });
    await act(async () => { view.result.current.clearPet?.(); });
    await act(async () => { view.result.current.selectPet('pet-2'); });
    expect(view.result.current.selectedPetId).toBe('pet-2');
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'token-b', signIn: jest.fn(), signOut: jest.fn() });
    await view.rerender(undefined);
    expect(view.result.current.selectedPetId ?? 'none').toBe('none');
  });
});
