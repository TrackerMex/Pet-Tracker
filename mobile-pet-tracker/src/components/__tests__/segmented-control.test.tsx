import { fireEvent, render, screen, within } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { TOUCH_SLOP } from '../../theme/touch-target';

type Props = {
  options: readonly { value: string; label: string; testID: string }[];
  value: string | null;
  onSelect: (value: string | null) => void;
  allowEmpty?: boolean;
};
const { SegmentedControl } = jest.requireActual<{
  SegmentedControl: (props: Props) => ReactElement;
}>('../segmented-control');

const options = [
  { value: 'dog', label: 'Perro', testID: 'dog' },
  { value: 'cat', label: 'Gato', testID: 'cat' },
];

describe('#191 R5: SegmentedControl', () => {
  it('aplica las recetas, esquinas y estados accesibles a cada opción', async () => {
    await render(<SegmentedControl options={options} value="dog" onSelect={jest.fn()} />);
    expect(screen.getByTestId('dog').parent!.props.className).toBe('flex-row gap-1 rounded-14 bg-default p-1');
    expect(screen.getByTestId('dog').parent!.props.style).toEqual(CONTINUOUS_CORNER);
    for (const option of options) {
      const segment = screen.getByTestId(option.testID);
      const selected = option.value === 'dog';
      expect(segment.props.className).toBe('h-9.5 flex-1 items-center justify-center rounded-10' + (selected ? ' bg-surface shadow-sm' : ''));
      expect(segment.props.style).toEqual(CONTINUOUS_CORNER);
      expect(segment.props.hitSlop).toEqual(TOUCH_SLOP);
      expect(segment.props.accessibilityRole).toBe('button');
      expect(segment.props.accessibilityState).toEqual({ selected });
      expect(within(segment).getByText(option.label).props.className).toBe(selected
        ? 'text-sm font-extrabold text-accent-strong'
        : 'text-sm font-extrabold text-muted');
    }
  });

  it('selecciona otra opción', async () => {
    const onSelect = jest.fn();
    await render(<SegmentedControl options={options} value="dog" onSelect={onSelect} />);
    await fireEvent.press(screen.getByTestId('cat'));
    expect(onSelect).toHaveBeenCalledWith('cat');
  });

  it('mantiene la selección si allowEmpty es falso', async () => {
    const onSelect = jest.fn();
    await render(<SegmentedControl options={options} value="dog" onSelect={onSelect} allowEmpty={false} />);
    await fireEvent.press(screen.getByTestId('dog'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('deselecciona con allowEmpty y admite ningún valor seleccionado', async () => {
    const onSelect = jest.fn();
    const view = await render(<SegmentedControl options={options} value="dog" onSelect={onSelect} allowEmpty />);
    await fireEvent.press(screen.getByTestId('dog'));
    expect(onSelect).toHaveBeenCalledWith(null);
    await view.rerender(<SegmentedControl options={options} value={null} onSelect={onSelect} allowEmpty />);
    for (const option of options) expect(screen.getByTestId(option.testID).props.accessibilityState).toEqual({ selected: false });
    await fireEvent.press(screen.getByTestId('cat'));
    expect(onSelect).toHaveBeenLastCalledWith('cat');
  });
});
