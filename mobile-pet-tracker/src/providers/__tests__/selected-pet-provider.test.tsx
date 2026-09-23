import { fireEvent, render, screen } from '@testing-library/react-native';
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
