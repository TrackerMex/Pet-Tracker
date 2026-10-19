import { act, render, screen, within } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import { StyleSheet } from 'react-native';
import { getAnimatedStyle } from 'react-native-reanimated';

import { EmptyState } from '../empty-state';

const mockUseReducedMotion = jest.fn<boolean, []>(() => false);

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: () => mockUseReducedMotion(),
}));

type ProbeOptions = {
  variant?: 'default' | 'hero';
  action?: { label: string; onPress: () => void };
};

async function renderProbe(options: ProbeOptions = { variant: 'hero' }) {
  return render(
    <HeroUINativeProvider>
      <EmptyState testID="home-empty" pose="talk" title="Título de prueba" body="Cuerpo de prueba." {...options} />
    </HeroUINativeProvider>,
  );
}

beforeEach(() => {
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
