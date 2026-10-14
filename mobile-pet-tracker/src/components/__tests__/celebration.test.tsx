import { act, fireEvent, render, screen, within } from '@testing-library/react-native';
import { NotificationFeedbackType, notificationAsync } from 'expo-haptics';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { getAnimatedStyle } from 'react-native-reanimated';

import { Celebration } from '../celebration';
import { en, es } from '../../i18n/catalog';

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
jest.mock('react-native-svg', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  function Svg(props: Record<string, unknown>) { return React.createElement(View, props); }
  function Path(props: Record<string, unknown>) { return React.createElement(View, props); }
  return { __esModule: true, default: Svg, Svg, Path };
});
jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: readonly string[]) => tokens.map((token) => `sentinel-${token}`),
}));
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

  it('R2.4 Pingo usa celebrate y la insignia contiene el check del artboard', async () => {
    await renderProbe();
    const image = within(screen.getByTestId('probe-pingo')).getByTestId('probe-pose');
    expect(image.props.source).toEqual([require('../../../assets/images/pingo-celebrate.webp')]);
    const check = within(screen.getByTestId('probe-badge', { includeHiddenElements: true })).getByTestId('probe-check', { includeHiddenElements: true });
    expect([check.props.width, check.props.height, check.props.viewBox]).toEqual([28, 28, '0 0 24 24']);
    expect(check.children).toHaveLength(1);
    const path = check.children[0];
    expect(typeof path === 'string' ? path : path.props).toEqual(expect.objectContaining({
      d: 'M20 6 9 17l-5-5', strokeWidth: 3, stroke: 'sentinel-accent-foreground',
    }));
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

describe('#171 R14: botones con labio', () => {
  it('R14.1 el primario lleva la receta y la etiqueta del acento', async () => {
    await renderProbe();
    expect(screen.getByTestId('probe-primary').props.className).toBe('min-h-11 w-full rounded-xl bg-accent border-b-4 border-black/25');
    expect(screen.getByText('Ver en el mapa').props.className).toBe('font-bold text-accent-foreground');
  });

  it('R14.2 el secundario lleva el labio gris sin variant y su etiqueta', async () => {
    await renderProbe();
    expect(screen.getByTestId('probe-secondary').props.className).toBe('min-h-11 w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface');
    expect(screen.getByTestId('probe-secondary').props.variant).toBeUndefined();
    expect(screen.getByText('Listo').props.className).toBe('font-bold text-foreground');
  });
});

const CONFETTI = [
  [42, 'h-1.5 w-3 rounded-full bg-accent', 3008, 308],
  [9, 'h-4.5 w-2.5 rounded-xs bg-confetti-amber', 2392, 1097],
  [7, 'h-1.5 w-2 rounded-full bg-confetti-violet', 2639, 1039],
  [57, 'h-1.5 w-2 rounded-full bg-confetti-blue', 2343, 856],
  [72, 'h-1.5 w-3 rounded-full bg-confetti-rose', 2321, 869],
  [29, 'h-1.5 w-3 rounded-full bg-confetti-green', 3484, 1291],
  [76, 'h-1.5 w-2 rounded-full bg-accent', 3012, 1199],
  [6, 'h-3.5 w-2.5 rounded-xs bg-confetti-amber', 2472, 1140],
  [19, 'h-3.5 w-3 rounded-xs bg-confetti-violet', 2441, 1107],
  [73, 'h-4.5 w-2 rounded-xs bg-confetti-blue', 2570, 1396],
  [75, 'h-1.5 w-2.5 rounded-full bg-confetti-rose', 2584, 1308],
  [72, 'h-4.5 w-2 rounded-xs bg-confetti-green', 3355, 128],
  [27, 'h-3.5 w-3 rounded-xs bg-accent', 3593, 1016],
  [41, 'h-3.5 w-2.5 rounded-xs bg-confetti-amber', 3399, 953],
  [39, 'h-1.5 w-3 rounded-full bg-confetti-violet', 2568, 508],
  [11, 'h-3.5 w-3 rounded-xs bg-confetti-blue', 2814, 1176],
  [45, 'h-1.5 w-3 rounded-full bg-confetti-rose', 2789, 919],
  [15, 'h-3.5 w-2 rounded-xs bg-confetti-green', 3056, 1048],
  [20, 'h-4.5 w-2 rounded-xs bg-accent', 3063, 1001],
  [10, 'h-3.5 w-2.5 rounded-xs bg-confetti-amber', 3373, 1142],
  [91, 'h-4.5 w-2.5 rounded-xs bg-confetti-violet', 3417, 717],
  [60, 'h-3.5 w-2.5 rounded-xs bg-confetti-blue', 2391, 140],
  [91, 'h-4.5 w-2 rounded-xs bg-confetti-rose', 2333, 1360],
  [92, 'h-4.5 w-3 rounded-xs bg-confetti-green', 3525, 634],
  [58, 'h-3.5 w-3 rounded-xs bg-accent', 2990, 582],
  [3, 'h-4.5 w-2 rounded-xs bg-confetti-amber', 2927, 945],
  [15, 'h-3.5 w-2 rounded-xs bg-confetti-violet', 2320, 1011],
  [17, 'h-3.5 w-2.5 rounded-xs bg-confetti-blue', 3014, 507],
  [11, 'h-4.5 w-2.5 rounded-xs bg-confetti-rose', 3119, 340],
  [36, 'h-3.5 w-3 rounded-xs bg-confetti-green', 3081, 280],
  [93, 'h-3.5 w-3 rounded-xs bg-accent', 2934, 850],
  [30, 'h-1.5 w-2 rounded-full bg-confetti-amber', 2369, 309],
  [30, 'h-3.5 w-2 rounded-xs bg-confetti-violet', 2677, 1348],
  [77, 'h-1.5 w-2.5 rounded-full bg-confetti-blue', 2738, 373],
  [19, 'h-4.5 w-2.5 rounded-xs bg-confetti-rose', 3294, 858],
  [74, 'h-4.5 w-3 rounded-xs bg-confetti-green', 2457, 652],
] as const;

// E4: [opacidad, translateY, grados] de cada pieza a los 1500 ms.
const CONFETTI_AT_1500 = [
  [0.25, 1055.8, 418.5], [0.627, 575.7, 235.1], [0.613, 593.9, 242.1],
  [0.416, 844.2, 337.7], [0.421, 837.8, 335.2], [0.919, 204.2, 93.2],
  [0.803, 352.5, 149.9], [0.682, 505.8, 208.5], [0.645, 553.3, 226.6],
  [0.98, 127.2, 63.9], [0.876, 258.8, 114.1], [0.236, 1073.2, 425.1],
  [0.71, 470.8, 195.1], [0.645, 553.1, 226.5], [0.261, 1041.5, 413.0],
  [0.761, 405.5, 170.1], [0.54, 686.8, 277.6], [0.677, 513.0, 211.2],
  [0.64, 559.1, 228.8], [0.785, 374.4, 158.3], [0.498, 739.7, 297.8],
  [0.107, 1237.9, 488.0], [0.919, 204.2, 93.3], [0.467, 779.3, 312.9],
  [0.366, 908.9, 362.4], [0.58, 636.3, 258.3], [0.535, 693.2, 280.0],
  [0.333, 950.1, 378.1], [0.278, 1020.0, 404.8], [0.25, 1055.4, 418.3],
  [0.513, 720.8, 290.5], [0.152, 1181.1, 466.3], [0.929, 191.7, 88.5],
  [0.234, 1076.8, 426.5], [0.568, 650.8, 263.8], [0.312, 977.1, 388.4],
] as const;

function sampleConfetti(testID: string) {
  const style = getAnimatedStyle(screen.getByTestId(testID, { includeHiddenElements: true })) as unknown as {
    opacity: number;
    transform: [{ translateY: number }, { rotate: string }];
  };
  return [style.opacity, style.transform[0].translateY, Number.parseFloat(style.transform[1].rotate)];
}

function expectSamples(actual: number[][], expected: readonly (readonly number[])[], digits: number[]) {
  expect(actual).toHaveLength(expected.length);
  actual.forEach((row, i) => row.forEach((value, k) => expect(value).toBeCloseTo(expected[i][k], digits[k])));
}

// E4: [opacidad, escala] del primer tramo de cada pop.
const PINGO_POP = [[0, 0.6], [0.4157, 0.7995], [0.7422, 0.9563], [0.9555, 1.0586]];
const BADGE_POP = [[0, 0.6], [0.4884, 0.8344], [0.8438, 1.005]];

function samplePop(testID: string) {
  const style = getAnimatedStyle(screen.getByTestId(testID, { includeHiddenElements: true })) as unknown as {
    opacity: number;
    transform: { scale?: number; translateY?: number }[];
  };
  return [style.opacity, style.transform[style.transform.length - 1].scale as number];
}

async function advance(ms: number) {
  await act(async () => { jest.advanceTimersByTime(ms); });
}

function animated(testID: string) {
  return getAnimatedStyle(screen.getByTestId(testID, { includeHiddenElements: true })) as unknown as {
    opacity: number;
    transform: Record<string, number | string>[];
  };
}

describe('#171 R6: confeti', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  it('R6.1 pinta 36 piezas con la clase de su fila', async () => {
    await renderProbe();
    const layer = screen.getByTestId('probe-confetti', { includeHiddenElements: true });
    expect(layer.children).toHaveLength(36);
    expect(layer.children.map((child) => typeof child === 'string' ? child : child.props.testID))
      .toEqual(Array.from({ length: 36 }, (_, index) => `probe-confetti-${index}`));
    for (let i = 0; i < 36; i++) {
      const piece = screen.getByTestId(`probe-confetti-${i}`, { includeHiddenElements: true });
      expect(piece.children.map((child) => typeof child === 'string' ? child : child.props.className)).toEqual([CONFETTI[i][1]]);
    }
  });

  it('R6.2 cada pieza empieza arriba y transparente, en su posición', async () => {
    await renderProbe();
    for (let i = 0; i < 36; i++) {
      expect(getAnimatedStyle(screen.getByTestId(`probe-confetti-${i}`, { includeHiddenElements: true }))).toEqual({
        position: 'absolute', top: 0, left: `${CONFETTI[i][0]}%`, opacity: 0,
        transform: [{ translateY: -40 }, { rotate: '0deg' }],
      });
    }
  });

  it('R6.3 la pieza 9 sigue arriba y transparente a los 1390 ms', async () => {
    await renderProbe();
    await advance(1390);
    expect(getAnimatedStyle(screen.getByTestId('probe-confetti-9', { includeHiddenElements: true }))).toEqual({
      position: 'absolute', top: 0, left: `${CONFETTI[9][0]}%`, opacity: 0,
      transform: [{ translateY: -40 }, { rotate: '0deg' }],
    });
  });

  it('R6.4 la pieza 21 vuelve a caer desde arriba tras terminar', async () => {
    await renderProbe();
    await advance(2500);
    expect(sampleConfetti('probe-confetti-21')[1]).toBeGreaterThan(1300);
    await advance(100);
    const [, y] = sampleConfetti('probe-confetti-21');
    expect(y).toBeGreaterThan(0);
    expect(y).toBeLessThan(400);
  });

  it('R6.5 a los 1500 ms cada pieza sigue su retardo, su duración y su curva', async () => {
    await renderProbe();
    await advance(1500);
    expectSamples(Array.from({ length: 36 }, (_, i) => sampleConfetti(`probe-confetti-${i}`)), CONFETTI_AT_1500, [2, 0, 0]);
  });

  it('R6.6 a los 13830 ms las 36 piezas siguen en vuelo', async () => {
    await renderProbe();
    await advance(13830);
    for (let i = 0; i < 36; i++) expect(sampleConfetti(`probe-confetti-${i}`)[0]).toBeGreaterThan(0);
  });
});

describe('#171 R7: pop', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  it('R7.1 Pingo empieza transparente y a escala 0.6', async () => {
    await renderProbe();
    expect(getAnimatedStyle(screen.getByTestId('probe-pingo'))).toEqual({
      width: 170, height: 170, opacity: 0, transform: [{ translateY: 0 }, { scale: 0.6 }],
    });
  });

  it('R7.2 la insignia empieza transparente y a escala 0.6', async () => {
    await renderProbe();
    expect(getAnimatedStyle(screen.getByTestId('probe-badge', { includeHiddenElements: true }))).toEqual({
      position: 'absolute', right: 18, bottom: 26, opacity: 0, transform: [{ scale: 0.6 }],
    });
  });

  it('R7.3 Pingo llega a opacidad y escala 1 a los 650 ms', async () => {
    await renderProbe();
    await advance(650);
    expect(samplePop('probe-pingo')).toEqual([1, 1]);
  });

  it('R7.3 la insignia sigue en reposo a los 300 ms', async () => {
    await renderProbe();
    await advance(300);
    expect(getAnimatedStyle(screen.getByTestId('probe-badge', { includeHiddenElements: true }))).toEqual({
      position: 'absolute', right: 18, bottom: 26, opacity: 0, transform: [{ scale: 0.6 }],
    });
  });

  it('R7.3 la insignia llega a opacidad y escala 1 a los 1000 ms', async () => {
    await renderProbe();
    await advance(1000);
    expect(getAnimatedStyle(screen.getByTestId('probe-badge', { includeHiddenElements: true }))).toEqual({
      position: 'absolute', right: 18, bottom: 26, opacity: 1, transform: [{ scale: 1 }],
    });
  });

  it('R7.4 Pingo sigue el primer tramo del pop a los 0, 100, 200 y 300 ms', async () => {
    await renderProbe();
    const samples = [samplePop('probe-pingo')];
    for (let step = 0; step < 3; step++) {
      await advance(100);
      samples.push(samplePop('probe-pingo'));
    }
    expectSamples(samples, PINGO_POP, [3, 3]);
  });

  it('R7.4 la insignia sigue el primer tramo del pop a los 450, 550 y 650 ms', async () => {
    await renderProbe();
    await advance(450);
    const samples = [samplePop('probe-badge')];
    for (let step = 0; step < 2; step++) {
      await advance(100);
      samples.push(samplePop('probe-badge'));
    }
    expectSamples(samples, BADGE_POP, [3, 3]);
  });

  it.each([
    ['Pingo', 420, 540, 'probe-pingo'],
    ['la insignia', 800, 900, 'probe-badge'],
  ] as const)('R7.4 %s baja de 1.08 a 1 entre los %s y los %s ms', async (_name, first, second, id) => {
    await renderProbe();
    await advance(first);
    const [opacityA, scaleA] = samplePop(id);
    await advance(second - first);
    const [opacityB, scaleB] = samplePop(id);
    expect([opacityA, opacityB]).toEqual([1, 1]);
    for (const scale of [scaleA, scaleB]) {
      expect(scale).toBeGreaterThan(1);
      expect(scale).toBeLessThan(1.08);
    }
    expect(scaleB).toBeLessThan(scaleA);
  });
});

describe('#171 R17: anillo de ping', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  it('R17.1 el anillo es el primer hijo del hero, de acento y oculto a accesibilidad', async () => {
    await renderProbe();
    const first = screen.getByTestId('probe-hero').children[0];
    expect(typeof first === 'string' ? first : first.props.testID).toBe('probe-ring');
    const ring = screen.getByTestId('probe-ring', { includeHiddenElements: true });
    expect(ring.props.className).toBe('absolute inset-0 rounded-full bg-accent');
    expect(ring.props.pointerEvents).toBe('none');
    expect(ring.props.accessibilityElementsHidden).toBe(true);
    expect(ring.props.importantForAccessibility).toBe('no-hide-descendants');
  });

  it('R17.2 el anillo crece y se apaga a los 0, 550, 1100 y 2100 ms', async () => {
    await renderProbe();
    const ring = () => { const style = animated('probe-ring'); return [style.transform[0].scale as number, style.opacity]; };
    const samples = [ring()];
    for (const step of [550, 550, 1000]) {
      await advance(step);
      samples.push(ring());
    }
    expectSamples(samples, [[0.55, 0.55], [0.9092, 0.342], [1.2004, 0.1734], [1.4965, 0.002]], [3, 3]);
  });

  it('R17.3 el anillo vuelve a empezar tras 2200 ms', async () => {
    await renderProbe();
    await advance(2750);
    const style = animated('probe-ring');
    expect(style.transform[0].scale).toBeLessThan(1);
    expect(style.opacity).toBeGreaterThan(0.3);
  });
});

describe('#171 R18: flotación de Pingo', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  it('R18.1 Pingo flota desde los 600 ms: 0, -5 y -10 a los 600, 1350 y 2100 ms', async () => {
    await renderProbe();
    const samples: number[] = [];
    for (const step of [600, 750, 750]) {
      await advance(step);
      samples.push(animated('probe-pingo').transform[0].translateY as number);
    }
    [0, -5, -10].forEach((value, i) => expect(samples[i]).toBeCloseTo(value, 1));
  });

  it('R18.2 la flotación sigue en bucle: 0 a los 3600 ms y -10 a los 5100 ms', async () => {
    await renderProbe();
    await advance(3600);
    expect(animated('probe-pingo').transform[0].translateY).toBeCloseTo(0, 1);
    await advance(1500);
    expect(animated('probe-pingo').transform[0].translateY).toBeCloseTo(-10, 1);
  });
});

describe('#171 R20: maquetación del artboard', () => {
  it('R20.1 el hero mide 220 con margen superior y Pingo 170', async () => {
    await renderProbe();
    const hero = screen.getByTestId('probe-hero');
    expect(hero.props.className).toBe('mt-10 items-center justify-center');
    expect(hero.props.style).toEqual({ width: 220, height: 220 });
    expect(screen.getByTestId('probe-pose').props.style).toEqual({ width: 170, height: 170 });
  });

  it('R20.4 el título lleva el tracking y el margen del artboard', async () => {
    await renderProbe();
    expect(screen.getByTestId('probe-title').props.className).toBe('mt-2 text-center text-3xl font-black tracking-tight text-foreground');
  });

  it('R20.5 el cuerpo mide 15 px con ancho máximo de 300', async () => {
    await renderProbe();
    expect(screen.getByTestId('probe-body').props.className).toBe('max-w-75 text-center text-15 leading-5.5 text-muted');
  });

  it('R20.6 la raíz separa 14 px y deja 40 abajo', async () => {
    await renderProbe();
    const root = screen.getByTestId('probe');
    expect(root.props.className).toBe('flex-1 items-center gap-3.5 bg-surface-secondary px-6');
    expect(root.props.style).toEqual({ paddingTop: 120, paddingBottom: 64 });
  });
});

describe('#171 R8: reduce motion', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(true);
    jest.useFakeTimers();
  });
  afterEach(() => { jest.useRealTimers(); });

  it('R8.1 no monta confeti ni piezas', async () => {
    await renderProbe();
    expect(screen.queryByTestId('probe-confetti', { includeHiddenElements: true })).toBeNull();
    expect(screen.queryByTestId('probe-confetti-0', { includeHiddenElements: true })).toBeNull();
  });

  it('R8.1 los hijos directos omiten el confeti', async () => {
    await renderProbe();
    expect(screen.getByTestId('probe').children.map((child) => typeof child === 'string' ? child : child.props.testID))
      .toEqual(['probe-hero', 'probe-title', 'probe-body', 'probe-details', 'probe-actions']);
  });

  it('R8.2 Pingo empieza transparente a escala 1', async () => {
    await renderProbe();
    expect(getAnimatedStyle(screen.getByTestId('probe-pingo'))).toEqual({
      width: 170, height: 170, opacity: 0, transform: [{ translateY: 0 }, { scale: 1 }],
    });
  });

  it('R8.2 Pingo conserva el fundido a los 2000 ms', async () => {
    await renderProbe();
    await act(async () => { jest.advanceTimersByTime(2000); });
    expect(getAnimatedStyle(screen.getByTestId('probe-pingo'))).toEqual({
      width: 170, height: 170, opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }],
    });
  });

  it('R8.3 la insignia empieza transparente a escala 1', async () => {
    await renderProbe();
    expect(getAnimatedStyle(screen.getByTestId('probe-badge', { includeHiddenElements: true }))).toEqual({
      position: 'absolute', right: 18, bottom: 26, opacity: 0, transform: [{ scale: 1 }],
    });
  });

  it('R8.3 la insignia conserva el fundido retardado a los 300 y 2400 ms', async () => {
    await renderProbe();
    await act(async () => { jest.advanceTimersByTime(300); });
    expect(getAnimatedStyle(screen.getByTestId('probe-badge', { includeHiddenElements: true })).opacity).toBe(0);
    await act(async () => { jest.advanceTimersByTime(2100); });
    expect(getAnimatedStyle(screen.getByTestId('probe-badge', { includeHiddenElements: true }))).toEqual({
      position: 'absolute', right: 18, bottom: 26, opacity: 1, transform: [{ scale: 1 }],
    });
  });
});

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(() => Promise.resolve()),
  NotificationFeedbackType: { Success: 'mock-success', Error: 'mock-error' },
}));

const mockNotificationAsync = jest.mocked(notificationAsync);

describe('#171 R9: háptico', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  it('R9.1 al montar notifica éxito una vez sin avanzar temporizadores', async () => {
    await renderProbe();
    expect(mockNotificationAsync).toHaveBeenCalledTimes(1);
    expect(mockNotificationAsync).toHaveBeenCalledWith(NotificationFeedbackType.Success);
  });

  it('R9.2 rerenderizar con otro título no repite el háptico', async () => {
    await renderProbe();
    await screen.rerender(<HeroUINativeProvider><Celebration {...probeProps} title="Otro título" /></HeroUINativeProvider>);
    expect(mockNotificationAsync).toHaveBeenCalledTimes(1);
  });

  it('R9.3 reduce motion conserva el háptico una vez', async () => {
    mockUseReducedMotion.mockReturnValue(true);
    await renderProbe();
    expect(mockNotificationAsync).toHaveBeenCalledTimes(1);
  });
});


describe('#171 R13: solo anima transform y opacity', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  it('R13.2 conserva las claves de layout y solo anima transform y opacity a los 0 y 1200 ms', async () => {
    await renderProbe();
    const rows = [
      ['probe-pingo', ['height', 'opacity', 'transform', 'width']],
      ['probe-badge', ['bottom', 'opacity', 'position', 'right', 'transform']],
      ['probe-confetti-0', ['left', 'opacity', 'position', 'top', 'transform']],
      ['probe-ring', ['opacity', 'transform']],
    ] as const;
    for (const elapsed of [0, 1200]) {
      if (elapsed) await act(async () => { jest.advanceTimersByTime(1200); });
      for (const [id, keys] of rows) {
        expect(Object.keys(getAnimatedStyle(screen.getByTestId(id, { includeHiddenElements: true }))).sort()).toEqual(keys);
      }
    }
  });
});


const enCatalog: Record<string, string> = en;
const esCatalog: Record<string, string> = es;
const copyRows = [
  ['addPet.celebrateTitle', '{{petName}} is home!', '¡{{petName}} ya está en casa!'],
  ['addPet.celebrateBody', "I'll help you look after {{petName}}. Pair a collar and I'll keep track of where they are.", 'Te ayudo a cuidar de {{petName}}. Vincula un collar y estaré pendiente de dónde está.'],
  ['addPet.celebratePair', 'Pair a collar', 'Vincular un collar'],
  ['addPet.celebrateLater', 'Not now', 'Ahora no'],
] as const;

describe('#171 R12: copy de la variante sin collar', () => {
  it.each(copyRows)('%s tiene su literal en los dos idiomas', (key, english, spanish) => {
    expect(enCatalog[key]).toBe(english);
    expect(esCatalog[key]).toBe(spanish);
  });

  it('addPet.celebrateTitle exclama con ¡…! en español', () => {
    expect(esCatalog['addPet.celebrateTitle']).toMatch(/^¡.*!$/);
  });

  it('addPet.celebrateTitle exclama con …! en inglés', () => {
    expect(enCatalog['addPet.celebrateTitle']).toMatch(/!$/);
  });

  it('body, pair y later no exclaman en ningún idioma', () => {
    for (const key of ['addPet.celebrateBody', 'addPet.celebratePair', 'addPet.celebrateLater']) {
      for (const catalog of [enCatalog, esCatalog]) expect(catalog[key]).not.toMatch(/[!¡]/);
    }
  });

  it('ninguna de las cuatro lleva emoji', () => {
    for (const [key] of copyRows) {
      for (const catalog of [enCatalog, esCatalog]) expect(catalog[key]).not.toMatch(/\p{Extended_Pictographic}/u);
    }
  });

  it('addPet.celebrateBody termina en punto en los dos idiomas', () => {
    expect(enCatalog['addPet.celebrateBody']).toMatch(/\.$/);
    expect(esCatalog['addPet.celebrateBody']).toMatch(/\.$/);
  });

  it('registra las cuatro claves en §2.27 de mobile-ui-language', () => {
    const doc = readFileSync(join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md'), 'utf8');
    const SECTION = [
      '### §2.27 — Añadidos por \u0023171 — Celebraciones',
      '',
      '| # | Clave | `en` | `es` | Origen |',
      '|---|---|---|---|---|',
      '| — | `addPet.celebrateTitle` | `{{petName}} is home!` | `¡{{petName}} ya está en casa!` | ← añadida por \u0023171 (R12) |',
      "| — | `addPet.celebrateBody` | `I'll help you look after {{petName}}. Pair a collar and I'll keep track of where they are.` | `Te ayudo a cuidar de {{petName}}. Vincula un collar y estaré pendiente de dónde está.` | ← añadida por \u0023171 (R12) |",
      '| — | `addPet.celebratePair` | `Pair a collar` | `Vincular un collar` | ← añadida por \u0023171 (R12) |',
      '| — | `addPet.celebrateLater` | `Not now` | `Ahora no` | ← añadida por \u0023171 (R12) |',
    ].join('\n');
    expect(doc.split(SECTION)).toHaveLength(2);
    expect(doc.indexOf(SECTION)).toBeGreaterThan(doc.indexOf('### §2.23 '));
    expect(doc.indexOf('## 3. La infraestructura')).toBeGreaterThan(doc.indexOf(SECTION));
  });
});


it('#171 R15: docs/ui-guidelines.md declara la enmienda del confeti', () => {
  const source = readFileSync(join(process.cwd(), '..', 'docs', 'ui-guidelines.md'), 'utf8');
  const amendment = "## Enmienda \u0023171 — confeti de celebración\n\nEl punto 7 solo admite como bucles los «Bucles de reposo» de Pingo. El confeti de `Celebration`\n(`src/components/celebration.tsx`) no es un bucle: es **una sola pasada** de\n24 piezas que caen con `withTiming` (`MOTION_CONFETTI_FALL_TIMING`, entre\n`MOTION_CONFETTI_MIN_MS` y `MOTION_CONFETTI_MIN_MS + MOTION_CONFETTI_SPREAD_MS`\nde duración) y se desvanecen. Las reglas son:\n\n- solo en celebraciones del tier «raro» (vincular un collar, primera mascota);\n- es decorativo: `pointerEvents=\"none\"` y oculto a la accesibilidad;\n- con reduce motion activo **no se monta**;\n- solo anima `transform` y `opacity`.";
  expect(source.split(amendment)).toHaveLength(2);
  expect(source.indexOf(amendment)).toBeGreaterThan(source.indexOf('## Checklist de autocrítica'));
  expect(source.slice(source.indexOf(amendment) + amendment.length)).toMatch(/^\n\n- \[[ xX]\] Aprobada por humano \(fecha: [^)\n]*\)(?:\n|$)/);
});
