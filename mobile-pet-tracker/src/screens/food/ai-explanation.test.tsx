import { readFileSync } from 'fs';
import { join } from 'path';
import { fireEvent, render, screen, within } from '@testing-library/react-native';
import type { TestInstance } from 'test-renderer';

import { LanguageProvider } from '../../providers/language-provider';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { AiExplanation } from './ai-explanation';

jest.mock('reicon-react-native', () => {
  const { View } = jest.requireActual('react-native');
  const icon = (testID: string) =>
    function MockIcon({ color, size, strokeWidth }: { color?: string; size?: number; strokeWidth?: number }) {
      return <View testID={testID} style={{ color }} {...{ color, size, strokeWidth }} />;
    };
  return {
    ChevronDown: icon('food-icon-chevron-down'),
    ChevronUp: icon('food-icon-chevron-up'),
  };
});

jest.mock('../../theme/use-theme-colors', () => ({
  useThemeColors: (tokens: string[]) => tokens,
}));

const SAMPLE = 'Rocky necesita **1200 kcal** al día: son 300 g de su alimento repartidos en tres comidas (08:00, 13:00 y 18:00).\nPara acompañarlo bien:\n- Mide la porción con una **taza dosificadora**, no a ojo.\n- Cuenta los **premios** dentro de los 300 g del día.\n- Suma un paseo corto por la tarde si hoy se movió poco.\nComo registraste alergias alimentarias, revisa la etiqueta de cualquier alimento nuevo antes de dárselo. Si algo te genera dudas, tu veterinario puede orientarte.'; // sintético
const SAMPLE_PLAIN = 'Rocky necesita 1200 kcal al día: son 300 g de su alimento repartidos en tres comidas (08:00, 13:00 y 18:00).\nPara acompañarlo bien:\nMide la porción con una taza dosificadora, no a ojo.\nCuenta los premios dentro de los 300 g del día.\nSuma un paseo corto por la tarde si hoy se movió poco.\nComo registraste alergias alimentarias, revisa la etiqueta de cualquier alimento nuevo antes de dárselo. Si algo te genera dudas, tu veterinario puede orientarte.'; // sintético
const OTHER_TEXT = 'Otro plan con **dos raciones**.'; // sintético
const LINE_BULLET = 'Línea\n- uno'; // sintético
const BULLET_ONLY = '- uno'; // sintético

async function mount(text = SAMPLE, language: 'es' | 'en' = 'es') {
  return await render(<LanguageProvider initial={language}><AiExplanation text={text} /></LanguageProvider>);
}

async function layout(height: number) {
  await fireEvent(screen.getByTestId('food-ai-content'), 'layout', {
    nativeEvent: { layout: { x: 0, y: 0, width: 300, height } },
  });
}

function elementChild(node: TestInstance, index: number): TestInstance {
  const child = node.children[index];
  if (typeof child === 'string' || child === undefined) throw new Error('Se esperaba un elemento');
  return child;
}

it.each([
  ['es', 'more', 'Ver más'],
  ['es', 'less', 'Ver menos'],
  ['es', 'disclaimer', 'Orientativo: no sustituye la opinión de tu veterinario.'],
  ['en', 'more', 'See more'],
  ['en', 'less', 'See less'],
  ['en', 'disclaimer', "For guidance only: it doesn't replace your vet's advice."],
] as const)('#224 R4: copy %s de %s', async (language, key, expected) => {
  await mount(SAMPLE, language);
  await layout(400);
  if (key === 'less') await fireEvent.press(screen.getByTestId('food-ai-more'));
  if (key === 'disclaimer') {
    expect(screen.getByTestId('food-ai-disclaimer').props.children).toBe(expected);
  } else {
    expect(within(screen.getByTestId('food-ai-more')).getByText(expected)).toBeOnTheScreen();
  }
});

it('#224 R5: SAMPLE pinta cada bloque, punto y tramo con su receta exacta', async () => {
  await mount();
  const content = screen.getByTestId('food-ai-content');
  expect(content.children).toHaveLength(6);
  const blocks = within(content).getAllByTestId(/^food-ai-block-\d+$/);
  expect(blocks.map(block => block.props.testID)).toEqual(['food-ai-block-0', 'food-ai-block-1', 'food-ai-block-2', 'food-ai-block-3', 'food-ai-block-4', 'food-ai-block-5']);
  const recipes = [
    ['Text', 'text-13 font-medium leading-body text-foreground'],
    ['Text', 'mt-2 text-13 font-medium leading-body text-foreground'],
    ['View', 'mt-1.5 flex-row gap-2'],
    ['View', 'mt-1 flex-row gap-2'],
    ['View', 'mt-1 flex-row gap-2'],
    ['Text', 'mt-2 text-13 font-medium leading-body text-foreground'],
  ];
  const expectedSegments = [ // sintético
    ['Rocky necesita ', { text: '1200 kcal', className: 'font-extrabold' }, ' al día: son 300 g de su alimento repartidos en tres comidas (08:00, 13:00 y 18:00).'],
    ['Para acompañarlo bien:'],
    ['Mide la porción con una ', { text: 'taza dosificadora', className: 'font-extrabold' }, ', no a ojo.'],
    ['Cuenta los ', { text: 'premios', className: 'font-extrabold' }, ' dentro de los 300 g del día.'],
    ['Suma un paseo corto por la tarde si hoy se movió poco.'],
    ['Como registraste alergias alimentarias, revisa la etiqueta de cualquier alimento nuevo antes de dárselo. Si algo te genera dudas, tu veterinario puede orientarte.'],
  ];
  blocks.forEach((block, index) => {
    expect(block.type).toBe(recipes[index][0]);
    expect(block.props.className).toBe(recipes[index][1]);
    let text = block;
    if (recipes[index][0] === 'View') {
      expect(block.children).toHaveLength(2);
      const dot = elementChild(block, 0);
      expect(dot.type).toBe('View');
      expect(dot.props.testID).toBe(`food-ai-dot-${index}`);
      expect(dot.props.className).toBe('mt-1.75 size-1.25 shrink-0 rounded-full');
      expect(dot).toHaveStyle({ backgroundColor: 'category-violet-strong' });
      expect(dot.children).toHaveLength(0);
      text = elementChild(block, 1);
      expect(text.type).toBe('Text');
      expect(text.props.className).toBe('flex-1 text-13 font-medium leading-body text-foreground');
    }
    expect(text.props.className).not.toContain('font-extrabold');
    expect(text.children.map(child => {
      if (typeof child === 'string') return child;
      expect(child.type).toBe('Text');
      return { text: child.children.join(''), className: child.props.className };
    })).toEqual(expectedSegments[index]);
  });
});

it('#224 R5: la viñeta usa un punto visual sin glifos en el texto', async () => {
  await mount(LINE_BULLET);
  expect(within(screen.getByTestId('food-ai-block-1')).getByText('uno')).toBeOnTheScreen();
  expect(screen.queryByText('-')).toBeNull();
  expect(screen.queryByText('•')).toBeNull();
  await screen.rerender(<LanguageProvider initial="es"><AiExplanation text={BULLET_ONLY} /></LanguageProvider>);
  expect(screen.getByTestId('food-ai-block-0').props.className).toBe('flex-row gap-2');
});

it.each([
  [undefined, false], [0, false], [122, false], [123, true], [400, true],
] as const)('#224 R6: alto %s limita según la frontera de 122', async (height, clamped) => {
  await mount();
  if (height !== undefined) await layout(height);
  const body = screen.getByTestId('food-ai-body');
  expect(body.props.className).toBe('overflow-hidden');
  if (clamped) {
    expect(body.props.style).toEqual({ maxHeight: 122 });
    expect(screen.getByTestId('food-ai-fade')).toBeOnTheScreen();
    expect(screen.getByTestId('food-ai-more')).toBeOnTheScreen();
  } else {
    expect(body.props.style).toBeUndefined();
    expect(screen.queryByTestId('food-ai-fade')).toBeNull();
    expect(screen.queryByTestId('food-ai-more')).toBeNull();
  }
});

it('#224 R6: el degradado ocupa 36 y usa el fondo violeta del tema', async () => {
  await mount();
  await layout(400);
  const fade = screen.getByTestId('food-ai-fade');
  expect(fade.props.pointerEvents).toBe('none');
  expect(fade.props.className).toBe('absolute inset-x-0 bottom-0');
  expect(fade.props.style).toEqual({ height: 36, experimental_backgroundImage: 'linear-gradient(to bottom, category-violet00 0%, category-violet 100%)' });
});

it('#224 R7: el botón alterna Ver más / Ver menos y el chevron', async () => {
  await mount();
  await layout(400);
  expect(screen.getByText('Ver más')).toBeOnTheScreen();
  expect(screen.getByTestId('food-ai-more').props.accessibilityRole).toBe('button');
  expect(screen.getByTestId('food-ai-more').props.accessibilityState.expanded).toBe(false);
  expect(screen.getByTestId('food-icon-chevron-down').props).toMatchObject({ size: 16, strokeWidth: 2.6, color: 'category-violet-strong' });
  await fireEvent.press(screen.getByTestId('food-ai-more'));
  expect(screen.getByText('Ver menos')).toBeOnTheScreen();
  expect(screen.getByTestId('food-ai-more').props.accessibilityState.expanded).toBe(true);
  expect(screen.getByTestId('food-icon-chevron-up').props).toMatchObject({ size: 16, strokeWidth: 2.6, color: 'category-violet-strong' });
  expect(screen.queryByTestId('food-icon-chevron-down')).toBeNull();
  expect(screen.getByTestId('food-ai-body').props.style).toBeUndefined();
  expect(screen.queryByTestId('food-ai-fade')).toBeNull();
  await fireEvent.press(screen.getByTestId('food-ai-more'));
  expect(screen.getByText('Ver más')).toBeOnTheScreen();
  expect(screen.getByTestId('food-ai-more').props.accessibilityState.expanded).toBe(false);
  expect(screen.getByTestId('food-ai-body').props.style).toEqual({ maxHeight: 122 });
  expect(screen.getByTestId('food-ai-fade')).toBeOnTheScreen();
  expect(screen.getByTestId('food-icon-chevron-down')).toBeOnTheScreen();
});

it('#224 R7: la zona táctil es de 44', async () => {
  await mount();
  await layout(400);
  const button = screen.getByTestId('food-ai-more');
  expect(button.props.hitSlop).toEqual(TOUCH_SLOP);
  expect(button.props.className).toBe('h-8 flex-row items-center gap-1 self-start');
  expect(within(button).getByText('Ver más').props.className).toBe('text-13 font-extrabold text-category-violet-strong');
});

it('#224 R7: un texto nuevo colapsa', async () => {
  await mount();
  await layout(400);
  await fireEvent.press(screen.getByTestId('food-ai-more'));
  expect(screen.getByText('Ver menos')).toBeOnTheScreen();
  await screen.rerender(<LanguageProvider initial="es"><AiExplanation text={OTHER_TEXT} /></LanguageProvider>);
  expect(screen.getByText('Ver más')).toBeOnTheScreen();
  expect(screen.getByTestId('food-ai-more').props.accessibilityState.expanded).toBe(false);
  expect(screen.getByTestId('food-ai-body').props.style).toEqual({ maxHeight: 122 });
});

it.each([
  ['es', 'sin botón', undefined, false, 'Orientativo: no sustituye la opinión de tu veterinario.'],
  ['es', 'colapsado', 400, false, 'Orientativo: no sustituye la opinión de tu veterinario.'],
  ['es', 'expandido', 400, true, 'Orientativo: no sustituye la opinión de tu veterinario.'],
  ['en', 'sin botón', undefined, false, "For guidance only: it doesn't replace your vet's advice."],
  ['en', 'colapsado', 400, false, "For guidance only: it doesn't replace your vet's advice."],
  ['en', 'expandido', 400, true, "For guidance only: it doesn't replace your vet's advice."],
] as const)('#224 R8: aviso siempre visible en %s %s', async (language, _state, height, expanded, expected) => {
  await mount(SAMPLE, language);
  if (height !== undefined) await layout(height);
  if (expanded) await fireEvent.press(screen.getByTestId('food-ai-more'));
  expect(screen.getAllByTestId('food-ai-disclaimer')).toHaveLength(1);
  const disclaimer = screen.getByTestId('food-ai-disclaimer');
  expect(disclaimer.type).toBe('Text');
  expect(disclaimer.props.className).toBe('text-11 leading-body text-muted');
  expect(disclaimer.props.children).toBe(expected);
});

it('#224 R9: la etiqueta es el texto plano completo', async () => {
  await mount();
  await layout(400);
  const body = screen.getByTestId('food-ai-body');
  expect(body.type).toBe('View');
  expect(body.props.accessible).toBe(true);
  expect(body.props.accessibilityLabel).toBe(SAMPLE_PLAIN);
});

it('#224 R9: el botón no está dentro de la unidad de lectura', async () => {
  await mount();
  await layout(400);
  expect(screen.getByTestId('food-ai-more')).toBeOnTheScreen();
  expect(within(screen.getByTestId('food-ai-body')).queryByTestId('food-ai-more')).toBeNull();
});

it('#224 R9: el recorte no cambia la etiqueta', async () => {
  await mount();
  await layout(400);
  expect(screen.getByTestId('food-ai-body').props.accessibilityLabel).toBe(SAMPLE_PLAIN);
  await fireEvent.press(screen.getByTestId('food-ai-more'));
  expect(screen.getByTestId('food-ai-body').props.accessibilityLabel).toBe(SAMPLE_PLAIN);
});

it('#224 R11: se monta solo con la prop text, sin tarjeta ni título', async () => {
  await mount();
  expect(screen.getByTestId('food-ai-body')).toBeOnTheScreen();
  expect(screen.getByTestId('food-ai-disclaimer')).toBeOnTheScreen();
  expect(screen.getByTestId('food-ai-body').parent?.props.className).toBe('gap-2');
  expect(screen.queryByTestId('food-ai-card')).toBeNull();
  expect(screen.queryByTestId('food-ai-header')).toBeNull();
  expect(screen.queryByTestId('food-ai-title')).toBeNull();
});

it('#224 R11: no importa de api/, heroui-native ni ./index', () => {
  const source = readFileSync(join(__dirname, 'ai-explanation.tsx'), 'utf8');
  expect(source.match(/from '(\.\/index|\.\.\/\.\.\/api|heroui-native)/g) ?? []).toHaveLength(0);
});
