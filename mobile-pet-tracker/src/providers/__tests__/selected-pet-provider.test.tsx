import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button, Text } from 'react-native';

import { SelectedPetProvider, useSelectedPet } from '../selected-pet-provider';

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
