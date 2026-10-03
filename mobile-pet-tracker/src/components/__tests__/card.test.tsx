import { fireEvent, render, screen } from '@testing-library/react-native';

import { Card } from '../card';

describe('R2: Card comparte recetas y comportamiento accesible', () => {
  it('usa la variante surface por defecto', async () => {
    await render(<Card testID="card" />);

    expect(screen.getByTestId('card')).toHaveProp(
      'className',
      'rounded-card border border-border bg-surface p-4 shadow-sm',
    );
  });

  it('aplica la variante accent', async () => {
    await render(<Card testID="card" variant="accent" />);

    expect(screen.getByTestId('card')).toHaveProp(
      'className',
      'rounded-card bg-accent p-5 shadow-sm',
    );
  });

  it('aplica la variante secondary sin sombra', async () => {
    await render(<Card testID="card" variant="secondary" />);

    expect(screen.getByTestId('card')).toHaveProp(
      'className',
      'rounded-card border border-border bg-surface-secondary p-4',
    );
  });

  it('fusiona className después de la variante', async () => {
    await render(<Card testID="card" className="p-3" />);

    expect(screen.getByTestId('card').props.className).toContain('p-3');
    expect(screen.getByTestId('card').props.className).not.toContain('p-4');
  });

  it('renderiza un botón y dispara onPress', async () => {
    const onPress = jest.fn();
    await render(<Card testID="card" onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button'));

    expect(screen.getByTestId('card')).toHaveProp(
      'accessibilityRole',
      'button',
    );
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('#62 R14: el Card compartido fusiona borderCurve con el style del llamador', () => {
  it('entrega un objeto plano con esquina continua', async () => {
    await render(<Card testID="card" />);

    const style = screen.getByTestId('card').props.style;

    expect(Array.isArray(style)).toBe(false);
    expect(style).toEqual({ borderCurve: 'continuous' });
  });

  it('conserva el style del llamador en el objeto plano', async () => {
    await render(<Card testID="card" style={{ top: 52 }} />);

    expect(screen.getByTestId('card').props.style).toEqual({
      borderCurve: 'continuous',
      top: 52,
    });
  });
});
