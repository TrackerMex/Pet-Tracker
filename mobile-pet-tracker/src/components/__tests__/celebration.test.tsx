import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';

import { Celebration } from '../celebration';

const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
const { join } = jest.requireActual<typeof import('path')>('path');

describe('#171 R1: la pose celebrate', () => {
  it('pingo-celebrate.webp es WebP con alfa, sin animación, 1024 × 1024 y como mucho 100000 bytes', () => {
    const bytes = readFileSync(join(process.cwd(), 'assets', 'images', 'pingo-celebrate.webp'));
    expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
    expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
    expect(bytes.toString('ascii', 12, 16)).toBe('VP8X');
    expect(bytes[20] & 0x10).not.toBe(0);
    expect(bytes[20] & 0x02).toBe(0);
    expect(bytes.readUIntLE(24, 3) + 1).toBe(1024);
    expect(bytes.readUIntLE(27, 3) + 1).toBe(1024);
    expect(bytes.length).toBeLessThanOrEqual(100000);
  });
});

const mockUseReducedMotion = jest.fn<boolean, []>(() => false);

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 }),
}));
jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual<typeof import('react-native-reanimated')>('react-native-reanimated');
  return { ...actual, __esModule: true, useReducedMotion: () => mockUseReducedMotion() };
});
jest.mock('heroui-native', () => {
  const actual = jest.requireActual<typeof import('heroui-native')>('heroui-native');
  const React = jest.requireActual<typeof import('react')>('react');
  const { Text, View } = jest.requireActual<typeof import('react-native')>('react-native');
  // #171 R14: conserva las clases declaradas, como los candados de Bienvenida.
  return {
    ...actual,
    Button: Object.assign(
      (props: Record<string, unknown> & { children?: ReactNode }) => React.createElement(View, props),
      { Label: (props: Record<string, unknown> & { children?: ReactNode }) => React.createElement(Text, props) },
    ),
  };
});

const probeProps = {
  testID: 'probe',
  title: 'Título de prueba',
  body: 'Cuerpo de prueba.',
  details: [
    { testID: 'probe-a', label: 'Modelo', value: 'TrailTag Pro' },
    { testID: 'probe-b', label: 'ESN', value: 'ESN-4242' },
  ],
  primary: { testID: 'probe-primary', label: 'Ver en el mapa', onPress: jest.fn() },
  secondary: { testID: 'probe-secondary', label: 'Listo', onPress: jest.fn() },
};

async function renderProbe(overrides: Partial<typeof probeProps> = {}) {
  await render(<HeroUINativeProvider><Celebration {...probeProps} {...overrides} /></HeroUINativeProvider>);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUseReducedMotion.mockReturnValue(false);
});

describe('#171 R2: Celebration', () => {
  it('R2.1 Celebration se exporta y no traduce', () => {
    expect(Celebration).toEqual(expect.any(Function));
    const source = readFileSync(join(process.cwd(), 'src', 'components', 'celebration.tsx'), 'utf8');
    expect(source).not.toMatch(/useTranslate|\bt\(/);
  });

  it('R2.2 el Modal cubre la pantalla con fundido y barras translúcidas', async () => {
    await renderProbe();
    expect(screen.getByTestId('probe-modal').props).toEqual(expect.objectContaining({
      visible: true, animationType: 'fade', statusBarTranslucent: true, navigationBarTranslucent: true,
    }));
  });

  it('R2.3 pinta los hijos directos en orden con detalles', async () => {
    await renderProbe();
    expect(screen.getByTestId('probe').children.map((child) => typeof child === 'string' ? child : child.props.testID))
      .toEqual(['probe-confetti', 'probe-hero', 'probe-title', 'probe-body', 'probe-details', 'probe-actions']);
  });

  it.each([[], undefined])('R2.3 sin detalles (%s) omite la capa de fichas', async (details) => {
    await renderProbe({ details });
    expect(screen.queryByTestId('probe-details')).toBeNull();
    expect(screen.getByTestId('probe').children.map((child) => typeof child === 'string' ? child : child.props.testID))
      .toEqual(['probe-confetti', 'probe-hero', 'probe-title', 'probe-body', 'probe-actions']);
  });

  it('R2.4 Pingo usa celebrate y la insignia contiene ✓', async () => {
    await renderProbe();
    const image = within(screen.getByTestId('probe-pingo')).getByTestId('probe-pose');
    expect(image.props.source).toEqual([require('../../../assets/images/pingo-celebrate.webp')]);
    expect(within(screen.getByTestId('probe-badge', { includeHiddenElements: true })).getByText('✓', { includeHiddenElements: true })).toHaveTextContent('✓');
  });

  it('R2.5 las fichas conservan orden, etiquetas y valores separados', async () => {
    await renderProbe();
    const details = screen.getByTestId('probe-details');
    expect(details.children).toHaveLength(2);
    for (const [index, id, label, value] of [[0, 'probe-a', 'Modelo', 'TrailTag Pro'], [1, 'probe-b', 'ESN', 'ESN-4242']] as const) {
      const node = within(details).getByTestId(id);
      expect(node).toHaveTextContent(value, { exact: true });
      expect(node.parent).toBe(details.children[index]);
      expect(node.parent?.children).toHaveLength(2);
      expect(within(node.parent!).getByText(label).parent).toBe(node.parent);
    }
  });

  it('R2.6 pulsar el primario llama una vez solo al primario', async () => {
    await renderProbe();
    await fireEvent.press(screen.getByTestId('probe-primary'));
    expect(probeProps.primary.onPress).toHaveBeenCalledTimes(1);
    expect(probeProps.secondary.onPress).not.toHaveBeenCalled();
  });

  it('R2.6 pulsar el secundario llama una vez solo al secundario', async () => {
    await renderProbe();
    await fireEvent.press(screen.getByTestId('probe-secondary'));
    expect(probeProps.secondary.onPress).toHaveBeenCalledTimes(1);
    expect(probeProps.primary.onPress).not.toHaveBeenCalled();
  });

  it('R2.6 atrás de Android llama una vez solo al secundario', async () => {
    await renderProbe();
    await fireEvent(screen.getByTestId('probe-modal'), 'requestClose');
    expect(probeProps.secondary.onPress).toHaveBeenCalledTimes(1);
    expect(probeProps.primary.onPress).not.toHaveBeenCalled();
  });

  it('R2.7 el confeti no intercepta pulsaciones y queda oculto a accesibilidad', async () => {
    await renderProbe();
    expect(screen.getByTestId('probe-confetti', { includeHiddenElements: true }).props).toEqual(expect.objectContaining({
      pointerEvents: 'none', importantForAccessibility: 'no-hide-descendants', accessibilityElementsHidden: true,
    }));
  });

  it('R2.7 la insignia queda oculta a accesibilidad', async () => {
    await renderProbe();
    expect(screen.getByTestId('probe-badge', { includeHiddenElements: true }).props).toEqual(expect.objectContaining({
      importantForAccessibility: 'no-hide-descendants', accessibilityElementsHidden: true,
    }));
  });
});
