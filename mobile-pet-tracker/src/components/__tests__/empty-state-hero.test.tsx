import { act, fireEvent, render, screen, within } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { getAnimatedStyle } from 'react-native-reanimated';

import { EmptyState } from '../empty-state';

let mockSemanticColors = false;

const mockUseReducedMotion = jest.fn<boolean, []>(() => false);

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: () => mockUseReducedMotion(),
}));

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => {
    if (mockSemanticColors) return tokens.map(token => `--color-${token}`);
    const colors: Record<string, string> = {
      accent: '#178255', 'accent-foreground': '#FFFFFF', lip: '#0E5E3C', 'lip-gray': '#E4E7EC',
    };
    return tokens.map((token) => colors[token] ?? '#0D1117');
  },
}));

jest.mock('react-native-svg', () => {
  const actual = jest.requireActual<typeof import('react-native-svg')>('react-native-svg');
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { ...actual, __esModule: true, G: (props: Record<string, unknown>) => React.createElement(View, { ...props, testID: props.fill ? 'probe-paw-fill' : undefined }) };
});

jest.mock('reicon-react-native', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { Plus: (props: Record<string, unknown>) => React.createElement(View, props) };
});

type ProbeOptions = {
  variant?: 'default' | 'hero';
  tone?: 'default' | 'danger';
  action?: { label: string; onPress: () => void };
  badge?: ReactNode;
  actionIcon?: ReactElement;
  body?: string;
};

async function renderProbe(options: ProbeOptions = { variant: 'hero' }) {
  return render(
    <HeroUINativeProvider>
      <EmptyState testID="home-empty" pose="talk" title="Título de prueba" body="Cuerpo de prueba." {...options} />
    </HeroUINativeProvider>,
  );
}

beforeEach(() => {
  mockSemanticColors = false;
  jest.useFakeTimers();
  mockUseReducedMotion.mockReturnValue(false);
});

it('#176 R5: compone el escenario con disco, huellas, pose y sombra de suelo', async () => {
  await renderProbe();
  expect(screen.queryByTestId('home-empty-stage')).not.toBeNull();
  const stage = screen.getByTestId('home-empty-stage');
  expect(stage.props.className).toBe('h-65 w-70 items-center justify-center');
  expect(stage.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual([
    'home-empty-stage-disc', 'home-empty-stage-paw', 'home-empty-float', 'home-empty-stage-shadow',
  ]);
  expect(screen.getByTestId('home-empty-stage-disc').props.className).toBe('absolute size-60 rounded-full bg-surface-secondary');
  const shadow = screen.getByTestId('home-empty-stage-shadow');
  expect(shadow.props.className).toBe('absolute bottom-4.5 h-3.5 w-30 rounded-full');
  expect(StyleSheet.flatten(shadow.props.style)).toEqual({ backgroundColor: 'rgba(13,17,23,0.10)' });
  expect(StyleSheet.flatten(screen.getByTestId('home-empty-stage-paw').props.style)).toMatchObject({ opacity: 0.18 });
});
afterEach(() => jest.useRealTimers());

it('#176 R1: sin variant y con default conserva el vacío sin escenario ni icono (NV)', async () => {
  for (const options of [{}, { variant: 'default' as const }]) {
    const result = await renderProbe({ ...options, action: { label: 'Acción', onPress: jest.fn() } });
    expect(screen.getByTestId('home-empty-pose')).toBeOnTheScreen();
    for (const suffix of ['stage', 'action-wrap', 'action-icon']) {
      expect(screen.queryByTestId(`home-empty-${suffix}`)).toBeNull();
    }
    await result.unmount();
  }
});

it('#176 R4: hero dibuja talk a 190×190 sin dimensiones en el estilo de flotación', async () => {
  await renderProbe();
  const pose = screen.getByTestId('home-empty-pose');
  expect(pose.props.style).toEqual({ width: 190, height: 190 });
  expect(pose.props.contentFit).toBe('contain');
  expect(pose.props.source).toEqual([
    expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-talk\.webp$/) }),
  ]);
  const floatStyle = getAnimatedStyle(screen.getByTestId('home-empty-float'));
  expect(floatStyle).not.toHaveProperty('width');
  expect(floatStyle).not.toHaveProperty('height');
});


it('#176 R6: hero flota solo 10 px con PingoFloat en un ciclo de tres segundos', async () => {
  await renderProbe();
  const float = screen.getByTestId('home-empty-float');
  expect(within(float).getByTestId('home-empty-pose')).toBeOnTheScreen();
  expect(getAnimatedStyle(float)).toEqual({ transform: [{ translateY: 0 }] });
  for (const [elapsed, expected] of [[750, -5], [750, -10], [1500, 0]]) {
    await act(async () => { jest.advanceTimersByTime(elapsed); });
    const style = getAnimatedStyle(float) as { transform: [{ translateY: number }] };
    expect(style.transform[0].translateY).toBeCloseTo(expected, 0);
  }
  const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
  const source = readFileSync('src/components/empty-state.tsx', 'utf8');
  expect(source).toMatch(/if \(variant === 'default' && !reduceMotion\)/);
});


it('#176 R8: hero muestra el título recibido a 26 px y peso 900', async () => {
  await renderProbe();
  const title = screen.getByTestId('home-empty-title');
  expect(title.props.className).toBe('text-center text-26 font-black tracking-title text-foreground');
  expect(title).toHaveTextContent('Título de prueba');
});


it('#176 R9: hero limita el cuerpo de 15 px a 290 px', async () => {
  await renderProbe();
  const body = screen.getByTestId('home-empty-body');
  expect(body.props.className).toBe('text-center text-15 text-muted');
  expect(StyleSheet.flatten(body.props.style)).toEqual({ maxWidth: 290 });
  expect(body).toHaveTextContent('Cuerpo de prueba.');
});


it('#176 R12: envuelve la acción completa y antepone Plus sin cambiar la receta del botón', async () => {
  const onPress = jest.fn();
  await renderProbe({ variant: 'hero', action: { label: 'Acción de prueba', onPress } });
  expect(screen.queryByTestId('home-empty-action-wrap')).not.toBeNull();
  const wrap = screen.getByTestId('home-empty-action-wrap');
  expect(wrap.props.className).toBe('w-full mt-2.5');
  expect(wrap.children).toEqual([screen.getByTestId('home-empty-action')]);
  const button = screen.getByTestId('home-empty-action');
  const icon = within(button).getByTestId('home-empty-action-icon');
  const label = within(button).getByText('Acción de prueba');
  expect(button.children.slice(-2)).toEqual([icon, label]);
  expect(icon.props).toMatchObject({ size: 20, color: '#FFFFFF', style: { marginRight: 8 } });
  expect(label.props.className).toBe('text-17 font-extrabold text-accent-foreground');
  expect(label.props.children).toBe('Acción de prueba');
  const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
  expect(readFileSync('src/components/empty-state.tsx', 'utf8')).not.toMatch(/<Button[^>]*(w-full|mt-2\.5)/);
  await fireEvent.press(button);
  expect(onPress).toHaveBeenCalledTimes(1);
});


function blockStyle(suffix: string) {
  expect(screen.queryByTestId(`home-empty-${suffix}`)).not.toBeNull();
  const node = screen.getByTestId(`home-empty-${suffix}`);
  expect(node.props.style).toBeDefined();
  return getAnimatedStyle(node) as { opacity: number; transform: [{ translateY: number }] };
}

it('#176 R13: entra en cuatro bloques con retrasos de 0, 60, 120 y 180 ms', async () => {
  await renderProbe({ variant: 'hero', action: { label: 'Acción', onPress: jest.fn() } });
  const blocks = ['stage', 'title-enter', 'body-enter', 'action-wrap'];
  for (const suffix of blocks) {
    expect(blockStyle(suffix)).toEqual({ opacity: 0, transform: [{ translateY: 12 }] });
  }
  await act(async () => { jest.advanceTimersByTime(100); });
  expect(blockStyle('action-wrap').opacity).toBe(0);
  await act(async () => { jest.advanceTimersByTime(100); });
  const opacities = blocks.map((suffix) => blockStyle(suffix).opacity);
  expect(opacities[0]).toBeGreaterThan(opacities[1]);
  expect(opacities[1]).toBeGreaterThan(opacities[2]);
  expect(opacities[2]).toBeGreaterThanOrEqual(opacities[3]);
  expect(opacities[3]).toBeGreaterThanOrEqual(0);
  await act(async () => { jest.advanceTimersByTime(800); });
  for (const suffix of blocks) {
    expect(blockStyle(suffix)).toEqual({ opacity: 1, transform: [{ translateY: 0 }] });
  }
});


it('#176 R7: reduce motion nace en el estado final y no inicia entrada ni flotación', async () => {
  mockUseReducedMotion.mockReturnValue(true);
  await renderProbe({ variant: 'hero', action: { label: 'Acción', onPress: jest.fn() } });
  for (const suffix of ['stage', 'title-enter', 'body-enter', 'action-wrap']) {
    expect(blockStyle(suffix)).toEqual({ opacity: 1, transform: [{ translateY: 0 }] });
  }
  const float = screen.getByTestId('home-empty-float');
  expect(getAnimatedStyle(float)).toEqual({ transform: [{ translateY: 0 }] });
  for (const elapsed of [1500, 8500]) {
    await act(async () => { jest.advanceTimersByTime(elapsed); });
    expect(getAnimatedStyle(float)).toEqual({ transform: [{ translateY: 0 }] });
    for (const suffix of ['stage', 'title-enter', 'body-enter', 'action-wrap']) {
      expect(blockStyle(suffix)).toEqual({ opacity: 1, transform: [{ translateY: 0 }] });
    }
  }
});


it('#176 R14: hero ocupa el ancho útil con gap de 14 y los hijos en orden, con o sin acción', async () => {
  for (const action of [{ label: 'Acción', onPress: jest.fn() }, undefined]) {
    const result = await renderProbe({ variant: 'hero', action });
    const root = screen.getByTestId('home-empty');
    expect(root.props.className).toBe('w-full items-center gap-3.5');
    expect(root.children.map((child) => typeof child === 'string' ? child : child.props.testID)).toEqual([
      'home-empty-stage', 'home-empty-title-enter', 'home-empty-body-enter',
      ...(action ? ['home-empty-action-wrap'] : []),
    ]);
    expect(within(screen.getByTestId('home-empty-title-enter')).getByTestId('home-empty-title')).toBeOnTheScreen();
    expect(within(screen.getByTestId('home-empty-body-enter')).getByTestId('home-empty-body')).toBeOnTheScreen();
    if (!action) expect(screen.queryByTestId('home-empty-action-wrap')).toBeNull();
    await result.unmount();
  }
});

describe('#198 R18: API compartida del escenario', () => {
  it('#198 R18 el badge es el último hijo del escenario', async () => {
    const base = await renderProbe();
    const count = screen.getByTestId('home-empty-stage', { includeHiddenElements: true }).children.length;
    await base.unmount();
    await renderProbe({ variant: 'hero', badge: <View testID="probe-badge" /> });
    const children = screen.getByTestId('home-empty-stage', { includeHiddenElements: true }).children.filter(child => typeof child !== 'string');
    expect(children.length).toBe(count + 1);
    expect(children.at(-1)!.props.testID).toBe('probe-badge');
  });

  it('#198 R18 sin badge el escenario no cambia', async () => {
    await renderProbe();
    const stage = screen.getByTestId('home-empty-stage', { includeHiddenElements: true });
    expect(stage.children.map(child => typeof child === 'string' ? child : child.props.testID)).toEqual(['home-empty-stage-disc', 'home-empty-stage-paw', 'home-empty-float', 'home-empty-stage-shadow']);
    expect(screen.queryByTestId('probe-badge', { includeHiddenElements: true }) === null).toBe(true);
  });

  it('#198 R18 actionIcon sustituye al «+» del hero', async () => {
    await renderProbe({ variant: 'hero', action: { label: 'Acción', onPress: jest.fn() }, actionIcon: <View testID="home-empty-action-icon" accessibilityLabel="recarga de prueba" style={{ marginRight: 3 }} /> });
    const action = screen.getByTestId('home-empty-action');
    const icon = within(action).getByTestId('home-empty-action-icon', { includeHiddenElements: true });
    expect(icon.props.accessibilityLabel).toBe('recarga de prueba');
    expect(icon.props.style).toEqual({ marginRight: 3 });
    expect(icon.props.size).toBeUndefined();
    expect(within(action).queryAllByTestId('home-empty-action-icon', { includeHiddenElements: true }).length).toBe(1);
  });

  it('#198 R18 sin actionIcon el hero conserva el «+»', async () => {
    await renderProbe({ variant: 'hero', action: { label: 'Acción', onPress: jest.fn() } });
    const icon = screen.getByTestId('home-empty-action-icon', { includeHiddenElements: true });
    expect(icon.props.size).toBe(20);
    expect(icon.props.strokeWidth).toBeUndefined();
  });

  it('#198 R18 sin body el hero no monta cuerpo', async () => {
    await renderProbe({ variant: 'hero', body: undefined });
    expect(screen.queryByTestId('home-empty-body', { includeHiddenElements: true }) === null).toBe(true);
    expect(screen.queryByTestId('home-empty-body-enter', { includeHiddenElements: true }) === null).toBe(true);
  });

  it('#198 R18 sin body la variante por defecto no monta cuerpo', async () => {
    await renderProbe({ variant: 'default', body: undefined });
    expect(screen.queryByTestId('home-empty-body', { includeHiddenElements: true }) === null).toBe(true);
    expect(screen.queryByTestId('home-empty-body-enter', { includeHiddenElements: true }) === null).toBe(true);
  });
});


describe('#198 R15: tono del escenario compartido', () => {
  beforeEach(() => { mockSemanticColors = true; mockUseReducedMotion.mockReturnValue(true); });

  it('#198 R15 tone danger pinta disco rosa, huellas danger y título de 22', async () => {
    await renderProbe({ variant: 'hero', tone: 'danger' });
    expect(screen.getByTestId('home-empty-stage-disc', { includeHiddenElements: true }).props.className).toBe('absolute size-60 rounded-full bg-category-rose');
    const paw = screen.getByTestId('home-empty-stage-paw', { includeHiddenElements: true });
    expect(within(paw).getByTestId('probe-paw-fill', { includeHiddenElements: true }).props.fill).toBe('--color-danger');
    expect(screen.getByTestId('home-empty-title').props.className).toBe('text-center text-22 font-black tracking-title text-foreground');
    expect(screen.queryByTestId('home-empty-badge', { includeHiddenElements: true }) === null).toBe(true);
  });

  it.each([undefined, 'default'] as const)('#198 R15 sin tone conserva el escenario de hoy', async tone => {
    await renderProbe({ variant: 'hero', ...(tone === undefined ? {} : { tone }) });
    expect(screen.getByTestId('home-empty-stage-disc', { includeHiddenElements: true }).props.className).toBe('absolute size-60 rounded-full bg-surface-secondary');
    const paw = screen.getByTestId('home-empty-stage-paw', { includeHiddenElements: true });
    expect(within(paw).getByTestId('probe-paw-fill', { includeHiddenElements: true }).props.fill).toBe('--color-accent');
    expect(screen.getByTestId('home-empty-title').props.className).toBe('text-center text-26 font-black tracking-title text-foreground');
    expect(screen.queryByTestId('home-empty-badge', { includeHiddenElements: true }) === null).toBe(true);
  });
});
