import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Text } from 'react-native';

import { GlassCircle } from '../glass-circle';

describe('#195 R11: círculo de vidrio plano', () => {
  it('conserva raíz accesible, clase exacta e hijo único sin desenfoque', async () => {
    await render(<GlassCircle testID="glass" accessibilityLabel="Luna" accessibilityState={{ selected: false }} onPress={jest.fn()}><Text testID="glass-child">L</Text></GlassCircle>);
    const root = screen.getByTestId('glass');
    const child = within(root).getByTestId('glass-child');
    expect(root.props.accessibilityRole).toBe('button');
    expect(root.props.accessibilityLabel).toBe('Luna');
    expect(root.props.accessibilityState).toEqual({ selected: false });
    expect(root.props.className).toBe('size-11 items-center justify-center rounded-full bg-glass-surface-strong');
    expect(root.children).toEqual([child]);
    expect(child.children).toEqual(['L']);
    expect(readFileSync(join(__dirname, '..', 'glass-circle.tsx'), 'utf8')).not.toMatch(/BlurView|shadow|#[\da-f]{3,8}\b|CONTINUOUS_CORNER/i);
  });

  it('invoca onPress y atenúa a 0.8 al pulsar desde opacidad 1', async () => {
    const onPress = jest.fn();
    await render(<GlassCircle testID="glass" accessibilityLabel="Añadir mascota" onPress={onPress}><Text>+</Text></GlassCircle>);
    const root = screen.getByTestId('glass');
    expect(root).toHaveStyle({ opacity: 1 });
    await fireEvent.press(root);
    expect(onPress).toHaveBeenCalledTimes(1);
    await fireEvent(root, 'responderGrant', { nativeEvent: {}, persist: () => undefined });
    expect(root).toHaveStyle({ opacity: 0.8 });
  });
});
