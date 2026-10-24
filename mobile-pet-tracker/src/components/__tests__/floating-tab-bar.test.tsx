import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { ReduceMotion } from 'react-native-reanimated';
import type { TestInstance } from 'test-renderer';

import {
  FloatingTabBar,
  TAB_INDICATOR_SPRING,
  type FloatingTabBarProps,
} from '../floating-tab-bar';
import { LanguageProvider } from '../../providers/language-provider';

const mockIsLiquidGlassAvailable = jest.fn<boolean, []>(() => false);
let mockTheme: 'light' | 'dark' = 'light';

jest.mock('uniwind', () => {
  const actual = jest.requireActual<typeof import('uniwind')>('uniwind');
  return {
    ...actual,
    useUniwind: () => ({ theme: mockTheme }),
  };
});

jest.mock('expo-glass-effect', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual('react-native');
  return {
    GlassView: (props: Record<string, unknown>) =>
      React.createElement(View, props),
    isLiquidGlassAvailable: () => mockIsLiquidGlassAvailable(),
  };
});

jest.mock('expo-blur', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual('react-native');
  return {
    BlurView: (props: Record<string, unknown>) =>
      React.createElement(View, props),
  };
});

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 34, left: 0 }),
}));

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens,
}));

jest.mock('react-native-svg', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  function Svg(props: Record<string, unknown>) { return React.createElement(View, props); }
  function Path(props: Record<string, unknown>) { return React.createElement(View, props); }
  function Circle(props: Record<string, unknown>) { return React.createElement(View, props); }
  // #206 R6: puente para reicon hasta el verde de R6
  function SvgXml(props: Record<string, unknown>) { return React.createElement(View, props); }
  return { __esModule: true, default: Svg, Svg, Path, Circle, SvgXml };
});

type TabPressEvent = Parameters<FloatingTabBarProps['navigation']['emit']>[0];

const routes = [
  { key: 'home-1', name: 'home' },
  { key: 'map-1', name: 'map' },
  { key: 'health-1', name: 'health' },
  { key: 'food-1', name: 'food' },
  { key: 'profile-1', name: 'profile' },
];
const alertsRoute = { key: 'alerts-1', name: 'alerts' };
const routesWithAlerts = [...routes, alertsRoute];
const routesAlertsFirst = [alertsRoute, ...routes];
const mockEmit = jest.fn<{ defaultPrevented: boolean }, [TabPressEvent]>();
const mockNavigate = jest.fn<void, [string]>();

function tabBarProps(
  index = 0,
  stateRoutes: FloatingTabBarProps['state']['routes'] = routes,
): FloatingTabBarProps {
  return {
    state: { index, routes: stateRoutes },
    navigation: {
      emit: mockEmit,
      navigate: mockNavigate,
    },
  };
}

async function renderTabBar(
  index = 0,
  stateRoutes: FloatingTabBarProps['state']['routes'] = routes,
) {
  return render(<FloatingTabBar {...tabBarProps(index, stateRoutes)} />, {
    wrapper: TabBarWrapper,
  });
}

function elementChild(node: TestInstance, index: number): TestInstance {
  const child = node.children[index];
  if (typeof child === 'string') throw new Error('Expected an element child');
  return child;
}

function TabBarWrapper({ children }: { children: ReactNode }) {
  return (
    <HeroUINativeProvider>
      <LanguageProvider initial="es">{children}</LanguageProvider>
    </HeroUINativeProvider>
  );
}

describe('R1: usa GlassView cuando liquid glass está disponible (y nunca junto a BlurView)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(true);
    mockTheme = 'light';
  });

  it('monta únicamente el backdrop liquid glass regular sin tintColor', async () => {
    await renderTabBar();

    expect(screen.getByTestId('tab-bar-glass')).toHaveProp(
      'glassEffectStyle',
      'regular',
    );
    expect(screen.getByTestId('tab-bar-glass')).not.toHaveProp('tintColor');
    expect(screen.queryByTestId('tab-bar-blur')).not.toBeOnTheScreen();
  });
});

describe('R2: fallback BlurView con tint por tema, blurMethod y overlay translúcido', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
  });

  it('usa el fallback light con intensidad y método exactos', async () => {
    await renderTabBar();

    expect(screen.getByTestId('tab-bar-blur')).toHaveProp('intensity', 80);
    expect(screen.getByTestId('tab-bar-blur')).toHaveProp(
      'blurMethod',
      'dimezisBlurViewSdk31Plus',
    );
    expect(screen.getByTestId('tab-bar-blur')).toHaveProp('tint', 'light');
    expect(screen.getByTestId('tab-bar-overlay')).toHaveProp(
      'className',
      expect.stringContaining('bg-glass-surface'),
    );
    expect(screen.queryByTestId('tab-bar-glass')).not.toBeOnTheScreen();
  });

  it('sincroniza el tint del fallback con el tema dark de la app', async () => {
    mockTheme = 'dark';

    await renderTabBar();

    expect(screen.getByTestId('tab-bar-blur')).toHaveProp('tint', 'dark');
  });
});

describe('R3: pill dimensionado y posicionado tras layout (y ausente antes)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('espera un ancho válido y usa la geometría exacta para el tab activo (enmendado por #206 R5)', async () => {
    await renderTabBar(2);

    expect(screen.queryByTestId('tab-indicator')).not.toBeOnTheScreen();

    await fireEvent(screen.getByTestId('floating-tab-bar'), 'layout', {
      nativeEvent: {
        layout: { width: 360, height: 64, x: 0, y: 0 },
      },
    });
    jest.advanceTimersByTime(300);

    const indicator = screen.getByTestId('tab-indicator');
    const style = StyleSheet.flatten(indicator.props.style);

    expect(style).toMatchObject({
      width: 66,
      left: 6,
      top: 6,
      height: 52,
      borderRadius: 999,
      backgroundColor: expect.any(String),
    });
    expect(indicator).toHaveAnimatedStyle({
      transform: [{ translateX: 140 }],
    });
  });
});

describe('R4: pill se desliza con TAB_INDICATOR_SPRING y retarget-ea en vuelo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('expone la duración y amortiguación fijadas', () => {
    expect(TAB_INDICATOR_SPRING).toMatchObject({
      duration: 250,
      dampingRatio: 1,
    });
  });

  it('retarget-ea un cambio nuevo mientras el primer desplazamiento sigue en vuelo (enmendado por #206 R5)', async () => {
    const tabBar = await renderTabBar(0);

    await fireEvent(screen.getByTestId('floating-tab-bar'), 'layout', {
      nativeEvent: {
        layout: { width: 360, height: 64, x: 0, y: 0 },
      },
    });
    jest.advanceTimersByTime(300);

    await tabBar.rerender(<FloatingTabBar {...tabBarProps(4)} />);
    jest.advanceTimersByTime(100);
    await tabBar.rerender(<FloatingTabBar {...tabBarProps(1)} />);
    jest.advanceTimersByTime(1000);

    expect(screen.getByTestId('tab-indicator')).toHaveAnimatedStyle({
      transform: [{ translateX: 70 }],
    });
  });
});

describe('R5: TAB_INDICATOR_SPRING respeta reduced motion del sistema', () => {
  it('delega la preferencia de movimiento al ajuste del sistema', () => {
    expect(TAB_INDICATOR_SPRING.reduceMotion).toBe(ReduceMotion.System);
  });
});

describe('R7: tab bar renderiza y navega', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
  });

  it('renders the five labeled tabs in the required order', async () => {
    await renderTabBar();

    expect(screen.getAllByRole('tab').map((tab) => tab.props.testID)).toEqual([
      'tab-home',
      'tab-map',
      'tab-health',
      'tab-food',
      'tab-profile',
    ]);
    for (const label of ['Inicio', 'Mapa', 'Salud', 'Nutrición', 'Perfil']) {
      expect(screen.getByText(label)).toBeVisible();
    }
    expect(screen.getByTestId('tab-home')).toHaveProp('accessibilityState', {
      selected: true,
    });
    expect(screen.getByTestId('tab-map')).toHaveProp('accessibilityState', {
      selected: false,
    });
  });

  it('emits tabPress and navigates when an inactive tab is pressed', async () => {
    await renderTabBar();

    await fireEvent.press(screen.getByTestId('tab-map'));

    expect(mockEmit).toHaveBeenCalledWith({
      type: 'tabPress',
      target: 'map-1',
      canPreventDefault: true,
    });
    expect(mockNavigate).toHaveBeenCalledWith('map');
  });

  it('does not navigate when the active tab is pressed', async () => {
    await renderTabBar();

    await fireEvent.press(screen.getByTestId('tab-home'));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('respects a prevented tabPress event', async () => {
    mockEmit.mockReturnValue({ defaultPrevented: true });
    await renderTabBar();

    await fireEvent.press(screen.getByTestId('tab-map'));

    expect(mockEmit).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('R8: tab bar flota con safe area', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
  });

  it('positions the bar twelve points above the bottom inset and inset 16 from each edge', async () => {
    await renderTabBar();

    const style = StyleSheet.flatten(
      screen.getByTestId('floating-tab-bar').props.style,
    );
    expect(style).toMatchObject({ bottom: 46, left: 16, right: 16 });
  });
});

describe('#91 R1: una ruta fuera de TABS no monta la burbuja', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('no monta la burbuja si el primer layout ocurre en alerts', async () => {
    await renderTabBar(5, routesWithAlerts);

    await fireEvent(screen.getByTestId('floating-tab-bar'), 'layout', {
      nativeEvent: {
        layout: { width: 360, height: 64, x: 0, y: 0 },
      },
    });
    jest.advanceTimersByTime(300);

    expect(screen.queryByTestId('tab-indicator')).not.toBeOnTheScreen();
  });

  it('desmonta la burbuja al navegar de health a alerts (enmendado por #206 R5)', async () => {
    const tabBar = await renderTabBar(2, routesWithAlerts);

    await fireEvent(screen.getByTestId('floating-tab-bar'), 'layout', {
      nativeEvent: {
        layout: { width: 360, height: 64, x: 0, y: 0 },
      },
    });
    jest.advanceTimersByTime(300);

    expect(screen.getByTestId('tab-indicator')).toHaveAnimatedStyle({
      transform: [{ translateX: 140 }],
    });

    await tabBar.rerender(
      <FloatingTabBar {...tabBarProps(5, routesWithAlerts)} />,
    );
    jest.advanceTimersByTime(300);

    expect(screen.queryByTestId('tab-indicator')).not.toBeOnTheScreen();
  });
});

describe('#91 R2: el primer layout coloca la burbuja por el índice de TABS', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('usa el índice de map en TABS aunque difiera de state.index (enmendado por #206 R5)', async () => {
    await renderTabBar(2, routesAlertsFirst);

    await fireEvent(screen.getByTestId('floating-tab-bar'), 'layout', {
      nativeEvent: {
        layout: { width: 360, height: 64, x: 0, y: 0 },
      },
    });
    jest.advanceTimersByTime(300);

    expect(screen.getByTestId('tab-indicator')).toHaveAnimatedStyle({
      transform: [{ translateX: 70 }],
    });
  });
});

describe('#91 R3: el cambio de ruta desliza la burbuja al índice de TABS', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('anima health a su índice en TABS aunque difiera de state.index (enmendado por #206 R5)', async () => {
    const tabBar = await renderTabBar(2, routesAlertsFirst);

    await fireEvent(screen.getByTestId('floating-tab-bar'), 'layout', {
      nativeEvent: {
        layout: { width: 360, height: 64, x: 0, y: 0 },
      },
    });
    jest.advanceTimersByTime(300);

    await tabBar.rerender(
      <FloatingTabBar {...tabBarProps(3, routesAlertsFirst)} />,
    );
    jest.advanceTimersByTime(400);

    expect(screen.getByTestId('tab-indicator')).toHaveAnimatedStyle({
      transform: [{ translateX: 140 }],
    });
  });
});

describe('#91 R4: al volver de una ruta ajena la burbuja aparece ya colocada', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('reaparece en la pestaña nueva sin animarse desde una ranura invisible (enmendado por #206 R5)', async () => {
    const tabBar = await renderTabBar(1, routesWithAlerts);

    await fireEvent(screen.getByTestId('floating-tab-bar'), 'layout', {
      nativeEvent: {
        layout: { width: 360, height: 64, x: 0, y: 0 },
      },
    });
    jest.advanceTimersByTime(300);

    expect(screen.getByTestId('tab-indicator')).toHaveAnimatedStyle({
      transform: [{ translateX: 70 }],
    });

    await tabBar.rerender(
      <FloatingTabBar {...tabBarProps(5, routesWithAlerts)} />,
    );
    jest.advanceTimersByTime(300);

    expect(screen.queryByTestId('tab-indicator')).not.toBeOnTheScreen();

    await tabBar.rerender(
      <FloatingTabBar {...tabBarProps(2, routesWithAlerts)} />,
    );

    expect(screen.getByTestId('tab-indicator')).toHaveAnimatedStyle({
      transform: [{ translateX: 140 }],
    });

    jest.advanceTimersByTime(300);

    expect(screen.getByTestId('tab-indicator')).toHaveAnimatedStyle({
      transform: [{ translateX: 140 }],
    });
  });
});

describe('#91 R5: con una ruta ajena las cinco celdas quedan inactivas y siguen navegando', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
  });

  it('conserva el estado inactivo, los dos hijos y la navegación de cada pestaña (enmendado por #206 R6)', async () => {
    const tabBar = await renderTabBar(2, routesWithAlerts);
    const activeColor = screen.getByTestId('icon-tab-health', { includeHiddenElements: true }).props.stroke;
    const mutedColor = screen.getByTestId('icon-tab-map', { includeHiddenElements: true }).props.stroke;

    expect(activeColor).not.toBe(mutedColor);

    await tabBar.rerender(
      <FloatingTabBar {...tabBarProps(5, routesWithAlerts)} />,
    );

    for (const [name, label] of [
      ['home', 'Inicio'],
      ['map', 'Mapa'],
      ['health', 'Salud'],
      ['food', 'Nutrición'],
      ['profile', 'Perfil'],
    ] as const) {
      const tab = screen.getByTestId(`tab-${name}`);

      expect(tab.children).toHaveLength(2);
      expect(tab).toHaveProp('accessibilityState', { selected: false });
      expect(elementChild(tab, 0)).toHaveProp('strokeWidth', 2);
      expect(elementChild(tab, 0)).toHaveProp('stroke', mutedColor);
      expect(elementChild(tab, 1)).toHaveProp(
        'className',
        'text-2xs font-semibold text-muted',
      );
      expect(elementChild(tab, 1)).toHaveTextContent(label);
    }

    await fireEvent.press(screen.getByTestId('tab-home'));

    expect(mockEmit).toHaveBeenCalledWith({
      type: 'tabPress',
      target: 'home-1',
      canPreventDefault: true,
    });
    expect(mockNavigate).toHaveBeenCalledWith('home');
  });
});

const ICON_SHAPES = [
  ['home', [{ d: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z' }]],
  ['map', [{ d: 'M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3z' }, { d: 'M9 3v15M15 6v15' }]],
  ['health', [{ d: 'M20.4 13.4 12 21l-8.4-7.6A5 5 0 0 1 12 6.6a5 5 0 0 1 8.4 6.8z' }, { d: 'M3.5 12h4l2-3 3 6 2-3h5.5' }]],
  ['food', [{ d: 'M7 3v18M4 3v5a3 3 0 0 0 6 0V3' }, { d: 'M18 21V3c-2.5 1-4 3.5-4 7 0 2 1.5 3 4 3' }]],
  ['profile', [{ cx: '12', cy: '8', r: '4' }, { d: 'M4 21a8 8 0 0 1 16 0' }]],
] as const;

const ARTBOARD_TABS = [
  ['Inicio', 'home', 0], ['Mapa', 'map', 1], ['Salud', 'health', 2],
  ['Nutricion', 'food', 3], ['Perfil', 'profile', 4],
] as const;

describe('canvas: barra de pestañas', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
    mockIsLiquidGlassAvailable.mockReturnValue(false);
    mockTheme = 'light';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('#206 R1: la cápsula mide 64 y la fila lleva el relleno de 6 y el hueco de 4 del canvas', async () => {
    await renderTabBar();

    expect(screen.getByTestId('tab-bar-row')).toHaveProp('className', 'flex-row gap-1 p-1.5');
    expect(screen.getByTestId('floating-tab-bar').props.className.split(' ')).toContain('h-16');
  });
  it('#206 R2: el velo del fallback es el glass .86 del canvas', async () => {
    await renderTabBar();
    expect(screen.getByTestId('tab-bar-overlay')).toHaveProp('className', 'flex-1 bg-glass-surface-strong');
  });

  it('#206 R3: la sombra es la tabBar del canvas y no la clase shadow-lg', async () => {
    await renderTabBar();
    const root = screen.getByTestId('floating-tab-bar');
    expect(root).toHaveProp('className', 'absolute h-16 overflow-hidden rounded-full border border-border');
    expect(root).toHaveStyle({
      boxShadow: [{ offsetX: 0, offsetY: 10, blurRadius: 30, spreadDistance: 0, color: 'shadow-12' }],
      bottom: 46, left: 16, right: 16,
    });
  });

  it('#206 R4: cada celda mide 52 y centra icono y etiqueta con hueco de 2', async () => {
    await renderTabBar();
    for (const name of ['home', 'map', 'health', 'food', 'profile']) {
      expect(screen.getByTestId(`tab-${name}`)).toHaveProp('className', 'h-13 flex-1 items-center justify-center gap-0.5');
    }
  });

  it('#206 R5: la píldora ocupa la celda activa de 52 con el paso de 70', async () => {
    await renderTabBar(2);
    await fireEvent(screen.getByTestId('floating-tab-bar'), 'layout', {
      nativeEvent: { layout: { width: 360, height: 64, x: 0, y: 0 } },
    });
    await act(() => { jest.advanceTimersByTime(300); });
    const indicator = screen.getByTestId('tab-indicator', { includeHiddenElements: true });
    expect(indicator).toHaveStyle({ width: 66, left: 6, top: 6, height: 52, borderRadius: 999, backgroundColor: 'tab-pill' });
    expect(StyleSheet.flatten(indicator.props.style)).not.toHaveProperty('bottom');
    expect(indicator).toHaveAnimatedStyle({
      position: 'absolute', width: 66, left: 6, top: 6, height: 52,
      borderRadius: 999, backgroundColor: 'tab-pill', transform: [{ translateX: 140 }],
    }, { shouldMatchAllProps: true });
  });

  it.each(ICON_SHAPES)('#206 R6: el icono de %s es el trazado del canvas', async (name, shapes) => {
    await renderTabBar();
    const icon = screen.getByTestId(`icon-tab-${name}`, { includeHiddenElements: true });
    for (const [key, value] of Object.entries({ width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })) {
      expect(icon).toHaveProp(key, value);
    }
    expect(icon.children).toHaveLength(shapes.length);
    shapes.forEach((shape, k) => { expect(elementChild(icon, k).props).toMatchObject(shape); });
  });

  it.each(ARTBOARD_TABS)('#206 R7: en %s la pestaña activa traza 2.4 en accent-strong y las demás 2 en muted', async (_artboard, activeName, index) => {
    await renderTabBar(index);
    for (const name of ['home', 'map', 'health', 'food', 'profile']) {
      const active = name === activeName;
      const icon = screen.getByTestId(`icon-tab-${name}`, { includeHiddenElements: true });
      expect(icon).toHaveProp('stroke', active ? 'accent-strong' : 'muted');
      expect(icon).toHaveProp('strokeWidth', active ? 2.4 : 2);
      const tab = screen.getByTestId(`tab-${name}`);
      expect(tab).toHaveProp('accessibilityState', { selected: active });
      expect(elementChild(tab, 1)).toHaveProp('className', active
        ? 'text-2xs font-semibold text-accent-strong'
        : 'text-2xs font-semibold text-muted');
    }
  });

});
