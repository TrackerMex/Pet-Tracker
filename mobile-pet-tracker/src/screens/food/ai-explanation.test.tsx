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
  await fireEvent(screen.getByTestId('food-ai-measure', { includeHiddenElements: true }), 'layout', {
    nativeEvent: { layout: { x: 0, y: 0, width: 300, height } },
  });
}

async function clippedLayout(height: number) {
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
] as const)('#224 R6: alto %s limita según la frontera de 122 (enmendado por #234 R4)', async (height, clamped) => {
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

describe('#234 R1: el medidor vive fuera del recorte', () => {
  it('#234 R1: food-ai-measure es hermano anterior de food-ai-body bajo la raíz gap-2', async () => {
    await mount();
    const root = screen.getByTestId('food-ai-body').parent!;
    expect(root.props.className).toBe('gap-2');
    expect(root.children.map(child => typeof child === 'string' ? child : child.props.testID))
      .toEqual(['food-ai-measure', 'food-ai-body', 'food-ai-disclaimer']);
    await layout(400);
    expect(screen.getByTestId('food-ai-body').parent!.children.map(child => typeof child === 'string' ? child : child.props.testID))
      .toEqual(['food-ai-measure', 'food-ai-body', 'food-ai-more', 'food-ai-disclaimer']);
  });

  it('#234 R1: ningún ancestro del medidor es el recorte ni su contenido', async () => {
    await mount();
    const measure = screen.getByTestId('food-ai-measure', { includeHiddenElements: true });
    const ancestors: TestInstance[] = [];
    for (let ancestor = measure.parent; ancestor !== null; ancestor = ancestor.parent) ancestors.push(ancestor);
    expect(ancestors.length).toBeGreaterThan(0);
    expect(ancestors[0].props.className).toBe('gap-2');
    const ids = ancestors.map(ancestor => ancestor.props.testID);
    expect(ids).not.toContain('food-ai-body');
    expect(ids).not.toContain('food-ai-content');
    expect(within(screen.getByTestId('food-ai-body')).queryByTestId('food-ai-measure', { includeHiddenElements: true })).toBeNull();
  });

  it('#234 R1: solo el medidor lleva onLayout', async () => {
    await mount();
    const carriers: (string | undefined)[] = [];
    function visit(node: TestInstance) {
      if (typeof node.type === 'string' && typeof node.props.onLayout === 'function') carriers.push(node.props.testID);
      node.children.forEach(child => { if (typeof child !== 'string') visit(child); });
    }
    visit(screen.getByTestId('food-ai-body').parent!);
    expect(carriers).toEqual(['food-ai-measure']);
    expect(carriers).toHaveLength(1);
    expect(screen.getByTestId('food-ai-content').props.onLayout).toBeUndefined();
    expect(screen.getByTestId('food-ai-body').props.onLayout).toBeUndefined();
  });
});

describe('#234 R5: el nodo recortado no decide', () => {
  it.each([
    ['recortado reporta 122 tras medir 400', 400, 122, true],
    ['recortado reporta 0 tras medir 400', 400, 0, true],
    ['recortado reporta 400 tras medir 400', 400, 400, true],
    ['recortado reporta 400 con medida 100', 100, 400, false],
    ['recortado reporta 400 sin medida', undefined, 400, false],
  ] as const)('#234 R5: %s', async (_scenario, measured, clipped, clamped) => {
    await mount();
    if (measured !== undefined) await layout(measured);
    await clippedLayout(clipped);
    const body = screen.getByTestId('food-ai-body');
    if (clamped) {
      expect(body.props.style).toEqual({ maxHeight: 122 });
      expect(screen.getByTestId('food-ai-fade')).toBeOnTheScreen();
      expect(screen.getByTestId('food-ai-more')).toBeOnTheScreen();
    } else {
      expect(body.props.style).toBeUndefined();
      expect(screen.queryByTestId('food-ai-fade', { includeHiddenElements: true })).toBeNull();
      expect(screen.queryByTestId('food-ai-more', { includeHiddenElements: true })).toBeNull();
    }
  });
});

describe('#234 R6: el recorte no oscila', () => {
  it('#234 R6: la secuencia que producía el parpadeo se queda quieta', async () => {
    await mount();
    const expectClamped = () => {
      expect(screen.getByTestId('food-ai-body').props.style).toEqual({ maxHeight: 122 });
      expect(screen.getByTestId('food-ai-fade')).toBeOnTheScreen();
      expect(screen.getByText('Ver más')).toBeOnTheScreen();
    };
    await layout(400);
    expectClamped();
    for (let round = 0; round < 3; round++) {
      await clippedLayout(122);
      expectClamped();
      await layout(400);
      expectClamped();
      await clippedLayout(0);
      expectClamped();
    }
  });

  it('#234 R6: expandir y contraer no dependen del nodo recortado', async () => {
    await mount();
    const expectExpanded = () => {
      expect(screen.getByText('Ver menos')).toBeOnTheScreen();
      expect(screen.getByTestId('food-ai-body').props.style).toBeUndefined();
      expect(screen.queryByTestId('food-ai-fade', { includeHiddenElements: true })).toBeNull();
    };
    await layout(400);
    await fireEvent.press(screen.getByTestId('food-ai-more'));
    expectExpanded();
    await clippedLayout(100);
    expectExpanded();
    await layout(400);
    expectExpanded();
    await fireEvent.press(screen.getByTestId('food-ai-more'));
    expect(screen.getByText('Ver más')).toBeOnTheScreen();
    expect(screen.getByTestId('food-ai-body').props.style).toEqual({ maxHeight: 122 });
    expect(screen.getByTestId('food-ai-fade')).toBeOnTheScreen();
    await clippedLayout(400);
    expect(screen.getByText('Ver más')).toBeOnTheScreen();
    expect(screen.getByTestId('food-ai-body').props.style).toEqual({ maxHeight: 122 });
    expect(screen.getByTestId('food-ai-fade')).toBeOnTheScreen();
  });

  it('#234 R6: un texto nuevo se mide otra vez en el medidor', async () => {
    await mount();
    const expectUnclamped = () => {
      expect(screen.getByTestId('food-ai-body').props.style).toBeUndefined();
      expect(screen.queryByTestId('food-ai-fade', { includeHiddenElements: true })).toBeNull();
      expect(screen.queryByTestId('food-ai-more', { includeHiddenElements: true })).toBeNull();
    };
    await layout(400);
    expect(screen.getByTestId('food-ai-body').props.style).toEqual({ maxHeight: 122 });
    expect(screen.getByTestId('food-ai-fade')).toBeOnTheScreen();
    expect(screen.getByText('Ver más')).toBeOnTheScreen();
    await screen.rerender(<LanguageProvider initial="es"><AiExplanation text={OTHER_TEXT} /></LanguageProvider>);
    await layout(100);
    expectUnclamped();
    await clippedLayout(400);
    expectUnclamped();
    await screen.rerender(<LanguageProvider initial="es"><AiExplanation text={SAMPLE} /></LanguageProvider>);
    await layout(400);
    expect(screen.getByTestId('food-ai-body').props.style).toEqual({ maxHeight: 122 });
    expect(screen.getByTestId('food-ai-fade')).toBeOnTheScreen();
    expect(screen.getByText('Ver más')).toBeOnTheScreen();
  });
});

describe('#234 R2: el medidor repite lo que se ve', () => {
  it.each([
    ['SAMPLE', SAMPLE, 6, 9],
    ['una viñeta tras una línea', LINE_BULLET, 2, 3],
    ['solo una viñeta', BULLET_ONLY, 1, 2],
  ] as const)('#234 R2: el medidor repite los bloques de %s', async (_scenario, text, blockCount, identifiedCount) => {
    await mount(text);
    const measure = screen.getByTestId('food-ai-measure', { includeHiddenElements: true });
    const content = screen.getByTestId('food-ai-content');
    expect(measure.children).toHaveLength(blockCount);
    expect(content.children).toHaveLength(blockCount);
    type Shape = string | {
      type: TestInstance['type'];
      className: string | undefined;
      backgroundColor: string | undefined;
      children: Shape[];
    };
    function shape(node: TestInstance | string, measured: boolean): Shape {
      if (typeof node === 'string') return node;
      if (measured) expect(node.props.testID).toBeUndefined();
      return {
        type: node.type,
        className: node.props.className,
        backgroundColor: node.props.style?.backgroundColor,
        children: node.children.map(child => shape(child, measured)),
      };
    }
    measure.children.forEach((child, index) => {
      expect(shape(child, true)).toEqual(shape(content.children[index], false));
    });
    expect(screen.queryAllByTestId(/^food-ai-(block|dot)-\d+$/, { includeHiddenElements: true })).toHaveLength(identifiedCount);
  });
});

describe('#234 R3: el medidor está oculto e inerte', () => {
  it('#234 R3: el medidor no se ve, no se toca y no se lee', async () => {
    await mount();
    const measure = screen.getByTestId('food-ai-measure', { includeHiddenElements: true });
    expect(measure.props.className).toBe('absolute inset-x-0 top-0 opacity-0');
    expect(measure.props.pointerEvents).toBe('none');
    expect(measure.props.accessibilityElementsHidden).toBe(true);
    expect(measure.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(measure.props.accessible).not.toBe(true);
    expect(measure.props.accessibilityLabel).toBeUndefined();
  });

  it('#234 R3: las consultas por defecto ven una sola copia del texto', async () => {
    await mount();
    expect(screen.getAllByText('Para acompañarlo bien:')).toHaveLength(1);
    expect(screen.getAllByText('Para acompañarlo bien:', { includeHiddenElements: true })).toHaveLength(2);
    expect(screen.getByTestId('food-ai-body').props.accessibilityLabel).toBe(SAMPLE_PLAIN);
  });
});
