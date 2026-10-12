import { act, fireEvent, render, screen, within } from '@testing-library/react-native';
import { NotificationFeedbackType, notificationAsync } from 'expo-haptics';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { Dimensions } from 'react-native';
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

const LEFT = [7, 48, 89, 30, 71, 12, 53, 94, 35, 76, 17, 58, 99, 40, 81, 22, 63, 4, 45, 86, 27, 68, 9, 50];
const SHAPES = ['h-1.5 w-2 rounded-full', 'h-3.5 w-2.5', 'h-4 w-3'];
const COLORS = ['bg-accent', 'bg-category-amber-strong', 'bg-category-violet-strong', 'bg-category-blue-strong', 'bg-category-rose-strong', 'bg-category-green-strong'];

describe('#171 R6: confeti', () => {
  const H = Dimensions.get('window').height;

  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  it('R6.1 pinta 24 piezas con sus formas y colores en orden', async () => {
    await renderProbe();
    const layer = screen.getByTestId('probe-confetti', { includeHiddenElements: true });
    expect(layer.children).toHaveLength(24);
    expect(layer.children.map((child) => typeof child === 'string' ? child : child.props.testID))
      .toEqual(Array.from({ length: 24 }, (_, index) => `probe-confetti-${index}`));
    for (let i = 0; i < 24; i++) {
      const piece = screen.getByTestId(`probe-confetti-${i}`, { includeHiddenElements: true });
      expect(piece.children).toHaveLength(1);
      expect(piece.children.map((child) => typeof child === 'string' ? child : child.props.className))
        .toEqual([SHAPES[Math.floor(i / 8)] + ' ' + COLORS[i % 6]]);
    }
  });

  it('R6.2 cada pieza empieza arriba y transparente, en su posición', async () => {
    await renderProbe();
    for (let i = 0; i < 24; i++) {
      expect(getAnimatedStyle(screen.getByTestId(`probe-confetti-${i}`, { includeHiddenElements: true }))).toEqual({
        position: 'absolute', top: 0, left: `${LEFT[i]}%`, opacity: 0,
        transform: [{ translateY: -40 }, { rotate: '0deg' }],
      });
    }
  });

  it('R6.3 la pieza 0 está en vuelo a los 1200 ms', async () => {
    await renderProbe();
    await act(async () => { jest.advanceTimersByTime(1200); });
    const style = getAnimatedStyle(screen.getByTestId('probe-confetti-0', { includeHiddenElements: true }));
    expect(style.opacity).toBeGreaterThan(0);
    expect(style.opacity).toBeLessThan(1);
  });

  it('R6.3 la pieza 22 conserva el retardo a los 1100 ms', async () => {
    await renderProbe();
    await act(async () => { jest.advanceTimersByTime(1100); });
    expect(getAnimatedStyle(screen.getByTestId('probe-confetti-22', { includeHiddenElements: true }))).toEqual({
      position: 'absolute', top: 0, left: '9%', opacity: 0,
      transform: [{ translateY: -40 }, { rotate: '0deg' }],
    });
  });

  it('R6.4 a los 5000 ms todas las piezas terminaron y desaparecieron', async () => {
    await renderProbe();
    await act(async () => { jest.advanceTimersByTime(5000); });
    for (let i = 0; i < 24; i++) {
      expect(getAnimatedStyle(screen.getByTestId(`probe-confetti-${i}`, { includeHiddenElements: true }))).toEqual({
        position: 'absolute', top: 0, left: `${LEFT[i]}%`, opacity: 0,
        transform: [{ translateY: H + 40 }, { rotate: '540deg' }],
      });
    }
  });
});

describe('#171 R7: pop', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  it('R7.1 Pingo empieza transparente y a escala 0.6', async () => {
    await renderProbe();
    expect(getAnimatedStyle(screen.getByTestId('probe-pingo'))).toEqual({
      width: 200, height: 200, opacity: 0, transform: [{ scale: 0.6 }],
    });
  });

  it('R7.2 la insignia empieza transparente y a escala 0.6', async () => {
    await renderProbe();
    expect(getAnimatedStyle(screen.getByTestId('probe-badge', { includeHiddenElements: true }))).toEqual({
      position: 'absolute', right: 0, bottom: 0, opacity: 0, transform: [{ scale: 0.6 }],
    });
  });

  it('R7.3 Pingo llega a opacidad y escala 1 a los 2000 ms', async () => {
    await renderProbe();
    await act(async () => { jest.advanceTimersByTime(2000); });
    expect(getAnimatedStyle(screen.getByTestId('probe-pingo'))).toEqual({
      width: 200, height: 200, opacity: 1, transform: [{ scale: 1 }],
    });
  });

  it('R7.3 la insignia sigue en reposo a los 300 ms', async () => {
    await renderProbe();
    await act(async () => { jest.advanceTimersByTime(300); });
    expect(getAnimatedStyle(screen.getByTestId('probe-badge', { includeHiddenElements: true }))).toEqual({
      position: 'absolute', right: 0, bottom: 0, opacity: 0, transform: [{ scale: 0.6 }],
    });
  });

  it('R7.3 la insignia llega a opacidad y escala 1 a los 2400 ms', async () => {
    await renderProbe();
    await act(async () => { jest.advanceTimersByTime(2400); });
    expect(getAnimatedStyle(screen.getByTestId('probe-badge', { includeHiddenElements: true }))).toEqual({
      position: 'absolute', right: 0, bottom: 0, opacity: 1, transform: [{ scale: 1 }],
    });
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
      width: 200, height: 200, opacity: 0, transform: [{ scale: 1 }],
    });
  });

  it('R8.2 Pingo conserva el fundido a los 2000 ms', async () => {
    await renderProbe();
    await act(async () => { jest.advanceTimersByTime(2000); });
    expect(getAnimatedStyle(screen.getByTestId('probe-pingo'))).toEqual({
      width: 200, height: 200, opacity: 1, transform: [{ scale: 1 }],
    });
  });

  it('R8.3 la insignia empieza transparente a escala 1', async () => {
    await renderProbe();
    expect(getAnimatedStyle(screen.getByTestId('probe-badge', { includeHiddenElements: true }))).toEqual({
      position: 'absolute', right: 0, bottom: 0, opacity: 0, transform: [{ scale: 1 }],
    });
  });

  it('R8.3 la insignia conserva el fundido retardado a los 300 y 2400 ms', async () => {
    await renderProbe();
    await act(async () => { jest.advanceTimersByTime(300); });
    expect(getAnimatedStyle(screen.getByTestId('probe-badge', { includeHiddenElements: true })).opacity).toBe(0);
    await act(async () => { jest.advanceTimersByTime(2100); });
    expect(getAnimatedStyle(screen.getByTestId('probe-badge', { includeHiddenElements: true }))).toEqual({
      position: 'absolute', right: 0, bottom: 0, opacity: 1, transform: [{ scale: 1 }],
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

  it('registra las cuatro claves en §2.24 de mobile-ui-language', () => {
    const doc = readFileSync(join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md'), 'utf8');
    const SECTION = [
      '### §2.24 — Añadidos por \u0023171 — Celebraciones',
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

