import { readFileSync } from 'fs';
import { join } from 'path';

const read = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');

describe('#195 R11: una sola resolución del copy compartido', () => {
  it('resuelve profile.addPet una vez en Inicio', () => {
    expect(read('src/screens/home/index.tsx').match(/t\('profile\.addPet'/g)).toHaveLength(1);
  });
});


describe('#195 R12: ancla única de la campana', () => {
  it('declara home-alerts-bell una sola vez en Inicio', () => {
    expect(read('src/screens/home/index.tsx').match(/testID="home-alerts-bell"/g)).toHaveLength(1);
  });
});

describe('#195 R17: contraste WCAG contra la peor foto', () => {
  type RGB = [number, number, number];
  function rgb(hex: string): RGB {
    expect(hex).toMatch(/^#[\da-f]{6}$/i);
    return [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16)) as RGB;
  }
  function blend(front: RGB, back: RGB, alpha: number): RGB {
    return front.map((channel, i) => channel * alpha + back[i] * (1 - alpha)) as RGB;
  }
  function luminance(color: RGB): number {
    const linear = color.map((channel) => {
      const s = channel / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  }
  function contrast(a: RGB, b: RGB): number {
    const [dark, light] = [luminance(a), luminance(b)].sort((x, y) => x - y);
    return (light + 0.05) / (dark + 0.05);
  }
  function fadeAlpha(d: number): number {
    if (d <= 56) return 1 - (d / 56) * 0.15;
    if (d <= 104) return 0.85 - ((d - 56) / 48) * 0.5;
    return 0.35 * (160 - d) / 56;
  }

  it.each(['light', 'dark'] as const)('mantiene referencias y suelos en %s', (theme) => {
    const css = read('src/theme/global.css');
    const block = css.split(`@variant ${theme} {`)[1].split('}')[0];
    const token = (name: string) => {
      const match = block.match(new RegExp(`--${name}:\\s*([^;]+);`));
      expect(match).not.toBeNull();
      return match![1].trim();
    };
    const background = rgb(token('background'));
    const foreground = rgb(token('foreground'));
    const muted = rgb(token('muted'));
    const photos: RGB[] = [[0, 0, 0], [255, 255, 255]];
    const dimmed = photos.map((photo) => photo.map((v) => v * (theme === 'dark' ? 0.86 : 1)) as RGB);
    const overFade = (ink: RGB, d: number) => Math.min(...dimmed.map((photo) => contrast(ink, blend(background, photo, fadeAlpha(d)))));
    const glass = token('glass-surface-strong').match(/^rgba\((\d+),(\d+),(\d+),([\d.]+)\)$/)!;
    expect(glass).not.toBeNull();
    const glassRGB: RGB = [Number(glass[1]), Number(glass[2]), Number(glass[3])];
    const overGlass = (ink: RGB) => Math.min(...dimmed.map((photo) => contrast(ink, blend(glassRGB, photo, Number(glass[4])))));
    const values = [
      overFade(muted, 26), overFade(foreground, 64),
      overFade(muted, 22), overFade(foreground, 54),
      contrast(rgb(token('accent-strong')), rgb(token('surface-secondary'))),
      contrast(rgb(token('accent')), background), contrast(rgb(token('danger')), background),
      overGlass(foreground), overGlass(muted),
    ];
    const references = theme === 'light'
      ? [4.26, 10.79, 4.36, 13.55, 5.70, 4.82, 3.76, 13.71, 3.60]
      : [6.51, 9.77, 6.67, 12.79, 6.43, 3.93, 6.84, 11.46, 4.79];
    const textFloor = theme === 'dark' ? 4.5 : 4.2;
    const floors = [textFloor, 4.5, textFloor, 4.5, 4.5, 3, 3, 4.5, 3];
    values.forEach((value, i) => {
      expect(Math.abs(value - references[i])).toBeLessThanOrEqual(0.05);
      expect(value).toBeGreaterThanOrEqual(floors[i]);
    });
  });
});

describe('#195 R19: grep-clean y cuentas conservadas', () => {
  const files = [
    'src/components/pet-hero-header.tsx',
    'src/components/pet-switcher.tsx',
    'src/components/pet-avatar.tsx',
    'src/components/ping-ring.tsx',
    'src/components/glass-circle.tsx',
    'src/screens/home/index.tsx',
    'src/screens/home/bubble-pop.tsx',
  ];
  const code = (source: string) => source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');

  it.each(files)('%s conserva tokens y primitivas permitidas', (file) => {
    const source = code(read(file));
    expect(source).not.toMatch(/#[\da-f]{3,8}\b/i);
    expect(source).not.toMatch(/[A-Za-z0-9_-]+-\[[^\]]+\]/);
    expect(source).not.toMatch(/StyleSheet\.create|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:/);
    expect(source).not.toMatch(/\bshadow-(?:sm|md|lg|xl|2xl)\b/);
    expect(source).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(source).not.toMatch(/\bBlurView\b/);
    if (file.endsWith('pet-hero-header.tsx')) expect(source).not.toMatch(/\btransparent\b/);
  });

  it.each([
    ['src/components/pet-hero-header.tsx', 'style={CONTINUOUS_CORNER}', 1],
    ['src/screens/home/index.tsx', 'style={CONTINUOUS_CORNER}', 1],
    ['src/components/pet-hero-header.tsx', 'TABULAR_NUMS', 2],
    ['src/screens/home/index.tsx', 'TABULAR_NUMS', 9],
    ['src/components/pet-hero-header.tsx', 'text-accent-strong', 1],
    ['src/screens/home/index.tsx', 'text-accent-strong', 2],
    ['src/screens/home/index.tsx', 'bg-accent-soft', 3],
    ['src/components/pet-switcher.tsx', 'bg-accent-soft', 1],
    ['src/components/pet-switcher.tsx', 'shadow-', 0],
    ['src/screens/home/index.tsx', "t('profile.addPet'", 1],
    ['src/screens/home/index.tsx', 'testID="home-alerts-bell"', 1],
  ] as const)('%s conserva %s en %s líneas', (file, literal, count) => {
    expect(read(file).split('\n').filter((line) => line.includes(literal))).toHaveLength(count);
  });

  it('mantiene cuatro tiempos propios y ocho declaraciones de tokens nuevos', () => {
    expect(read('src/theme/motion.ts').match(/^export const MOTION_HERO_/gm)).toHaveLength(4);
    expect(read('src/theme/global.css').match(/--(?:color-)?(?:scrim|photo-dim):/g)).toHaveLength(8);
  });
});

describe('#195 R20: enmienda canónica y continuación de A8', () => {
  const design = read('../specs/mobile-home-photo-hero-canvas/design.md').split('## Texto de la Enmienda #195')[1];
  const blocks = Array.from(design.matchAll(/```markdown\n([\s\S]*?)\n```/g), (match) => match[1]);
  const charter = read('../docs/ui-guidelines.md');
  const normalize = (text: string) => text.replace(/^- \[[ xX]\] Enmienda #195 aprobada por humano$/gm, '- [ ] Enmienda #195 aprobada por humano');
  const historicalA8 = "> **Enmendado por #67 (A8) — corrección de un hecho falso.** Hasta el\n> 2026-09-06 este punto decía *\"el respaldo es degradado con la inicial —el\n> patrón que ya usa `pet-avatar`—, decidido por el humano el 2026-09-04\"*.\n> Era falso de origen: `src/components/pet-avatar.tsx` pinta `blobatar(name)`\n> con `SvgXml` y nunca una inicial, y la R5 aprobada de #40 (2026-08-21)\n> sustituyó explícitamente el fallback de inicial por el blobatar. El error\n> venía de `progress/explore_design-gap-vs-make.md` y se propagó también al\n> enunciado de #67 en `feature_list.json`. Y la garantía de AA no la da el\n> degradado: la da la **banda opaca** bajo el texto (#67 R3), porque ningún\n> velo sobre una foto arbitraria llega a 4,5:1.";

  it('añade una sola sección completa y es la última cabecera de nivel dos', () => {
    expect(blocks).toHaveLength(2);
    const heading = blocks[0].split('\n')[0];
    expect(charter.split(heading)).toHaveLength(2);
    expect(charter.match(/^## .+$/gm)?.at(-1)).toBe(heading);
    expect(normalize(charter.slice(charter.indexOf(heading)).trimEnd())).toBe(normalize(blocks[0]));
  });

  it('conserva A8 entero y añade la cita nueva como párrafo aparte inmediato', () => {
    expect(charter.split(historicalA8)).toHaveLength(2);
    expect(charter).toContain(historicalA8 + '\n\n' + blocks[1] + '\n\n');
  });

  it('detecta las casillas con una expresión tolerante a la firma', () => {
    const checkbox = /- \[[ xX]\] Enmienda #195 aprobada por humano/;
    expect(read('../specs/mobile-home-photo-hero-canvas/requirements.md')).toMatch(checkbox);
    expect(charter).toMatch(checkbox);
  });
});
