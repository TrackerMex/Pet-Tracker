declare const require: (moduleName: 'fs') => {
  readFileSync: (path: string, encoding: 'utf8') => string;
};

const { readFileSync } = require('fs');
const globalCss = readFileSync(`${process.cwd()}/src/theme/global.css`, 'utf8');

function extractVariant(name: 'light' | 'dark'): string {
  const marker = `@variant ${name} {`;
  const start = globalCss.indexOf(marker);

  if (start === -1) return '';

  const bodyStart = start + marker.length;
  let depth = 1;

  for (let index = bodyStart; index < globalCss.length; index += 1) {
    if (globalCss[index] === '{') depth += 1;
    if (globalCss[index] === '}') depth -= 1;
    if (depth === 0) return globalCss.slice(bodyStart, index);
  }

  return '';
}

function extractTheme(): string {
  const marker = '@theme {';
  const start = globalCss.indexOf(marker);

  if (start === -1) return '';

  const bodyStart = start + marker.length;
  let depth = 1;

  for (let index = bodyStart; index < globalCss.length; index += 1) {
    if (globalCss[index] === '{') depth += 1;
    if (globalCss[index] === '}') depth -= 1;
    if (depth === 0) return globalCss.slice(bodyStart, index);
  }

  return '';
}

function parseVariables(block: string): Record<string, string> {
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((match) => [
      match[1],
      match[2].trim(),
    ]),
  );
}

describe('R1: tokens rounded-card y text-2xs', () => {
  it('define sus valores exactos dentro de @theme', () => {
    expect(parseVariables(extractTheme())).toMatchObject({
      'radius-card': '20px',
      'text-2xs': '10px',
    });
  });
});

describe('R1: global.css define los tokens light exactos del diseño', () => {
  it('incluye el código de la app en el escaneo de utilidades de Tailwind', () => {
    expect(globalCss).toMatch(/@source\s+['"]\.\.\/['"];?/);
  });

  it('mapea la paleta Figma Make a los tokens de heroui-native', () => {
    expect(parseVariables(extractVariant('light'))).toMatchObject({
      background: '#FFFFFF',
      foreground: '#0D1117',
      surface: '#FFFFFF',
      'surface-foreground': '#0D1117',
      'surface-secondary': '#F0FBF6',
      default: '#F5F6F8',
      muted: '#667085',
      border: 'rgba(13,17,23,0.07)',
      separator: 'rgba(13,17,23,0.07)',
      accent: '#178255',
      'accent-foreground': '#FFFFFF',
      danger: '#EF4444',
      warning: '#F59E0B',
      success: '#0F9B5A',
      focus: '#178255',
      'field-radius': '0.75rem',
    });
  });

  it('no sobreescribe --radius (base de la escala rounded-* de heroui-native)', () => {
    expect(globalCss).not.toMatch(/--radius:/);
  });
});

describe('R2: global.css define la paleta dark derivada del diseño', () => {
  it.each([
    ['light', '#178255', '#FFFFFF', '#667085', '#0F9B5A', '#F59E0B', '#EF4444'],
    ['dark', '#178255', '#FFFFFF', '#9CA3AF', '#34D399', '#FBBF24', '#F87171'],
  ] as const)(
    'materializa los colores semánticos para el resolver JS en %s',
    (theme, accent, accentForeground, muted, success, warning, danger) => {
      expect(parseVariables(extractVariant(theme))).toMatchObject({
        'color-accent': accent,
        'color-accent-foreground': accentForeground,
        'color-muted': muted,
        'color-success': success,
        'color-warning': warning,
        'color-danger': danger,
      });
    },
  );

  it('usa neutros oscuros con el accent verde y sin copiar oklch del Make', () => {
    const darkVariant = extractVariant('dark');

    expect(darkVariant).not.toContain('oklch(');
    expect(parseVariables(darkVariant)).toMatchObject({
      background: '#0D1117',
      foreground: '#F7F8FA',
      surface: '#161B22',
      'surface-foreground': '#F7F8FA',
      'surface-secondary': '#12231B',
      default: '#1F242B',
      muted: '#9CA3AF',
      border: 'rgba(255,255,255,0.08)',
      separator: 'rgba(255,255,255,0.08)',
      accent: '#178255',
      'accent-foreground': '#FFFFFF',
      danger: '#F87171',
      warning: '#FBBF24',
      success: '#34D399',
      focus: '#178255',
    });
  });
});

describe('R2: tokens glass-surface y tab-pill en light y dark', () => {
  it.each([
    ['light', 'rgba(255,255,255,0.60)', 'rgba(23,130,85,0.14)'],
    ['dark', 'rgba(22,27,34,0.60)', 'rgba(23,130,85,0.22)'],
  ] as const)(
    'define los pares visual e imperativo exactos en %s',
    (theme, glassSurface, tabPill) => {
      expect(parseVariables(extractVariant(theme))).toMatchObject({
        'glass-surface': glassSurface,
        'color-glass-surface': glassSurface,
        'tab-pill': tabPill,
        'color-tab-pill': tabPill,
      });
    },
  );
});

/**
 * Contraste WCAG 2.1 sobre luminancia relativa sRGB. Fórmula y método en
 * specs/mobile-ui-legibility-polish/design.md §1; el ancla de verificación
 * (#FFFFFF sobre #2AB87C = 2,547:1) se afirma en el primer describe de #61.
 */
function channel(value: number): number {
  const ratio = value / 255;

  return ratio <= 0.04045 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const value = Number.parseInt(hex.slice(1), 16);

  return (
    0.2126 * channel((value >> 16) & 255) +
    0.7152 * channel((value >> 8) & 255) +
    0.0722 * channel(value & 255)
  );
}

function contrast(first: string, second: string): number {
  const [lighter, darker] = [luminance(first), luminance(second)].sort(
    (left, right) => right - left,
  );

  return (lighter + 0.05) / (darker + 0.05);
}

describe('#61 R2: el relleno de acento pasa AA con etiqueta blanca', () => {
  const accent = '#178255';

  it('reproduce el ancla de contraste verificada a mano', () => {
    expect(contrast('#FFFFFF', '#2AB87C')).toBeCloseTo(2.547, 3);
  });

  it.each(['light', 'dark'] as const)(
    'oscurece acento y foco sin tocar la etiqueta blanca en %s',
    (theme) => {
      expect(parseVariables(extractVariant(theme))).toMatchObject({
        accent,
        'color-accent': accent,
        focus: accent,
        'accent-foreground': '#FFFFFF',
        'color-accent-foreground': '#FFFFFF',
      });
    },
  );

  it.each([
    ['light', 'rgba(23,130,85,0.14)'],
    ['dark', 'rgba(23,130,85,0.22)'],
  ] as const)(
    'arrastra --tab-pill al valor del acento nuevo en %s',
    (theme, tabPill) => {
      expect(parseVariables(extractVariant(theme))).toMatchObject({
        'tab-pill': tabPill,
        'color-tab-pill': tabPill,
      });
    },
  );

  it('deja la etiqueta blanca sobre el relleno por encima de AA', () => {
    expect(contrast('#FFFFFF', accent)).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#FFFFFF', accent)).toBeCloseTo(4.816, 3);
  });

  it('conserva el relleno visible sobre el fondo de página en dark', () => {
    expect(contrast(accent, '#0D1117')).toBeGreaterThanOrEqual(3);
    expect(contrast(accent, '#161B22')).toBeGreaterThanOrEqual(3);
  });
});

/**
 * Superficies compuestas: heroui deriva los `*-soft` con
 * `color-mix(in oklab, var(--X) 15%, transparent)` y `--tab-pill` es el acento
 * al 14 % / 22 %, así que su hex resultante no se lee de global.css. Los
 * valores son los de specs/mobile-ui-legibility-polish/design.md §5.4.
 */
const composedSurfaces = {
  light: { accentSoft: '#DCECE6', tabPill: '#DFEEE7', warningSoft: '#FEF0DA' },
  dark: { accentSoft: '#0E2220', tabPill: '#0F2A25', warningSoft: '#383422' },
} as const;

describe('#61 R4: token accent-strong con AA como tinta en los dos temas', () => {
  it('registra el espejo --color-accent-strong para las utilidades text-*', () => {
    expect(globalCss).toMatch(
      /@theme inline\s*{[^}]*--color-accent-strong:\s*var\(--accent-strong\);/,
    );
  });

  it.each([
    ['light', '#107148'],
    ['dark', '#2AB87C'],
  ] as const)('parte la tinta del relleno en %s', (theme, accentStrong) => {
    expect(parseVariables(extractVariant(theme))).toMatchObject({
      'accent-strong': accentStrong,
      'color-accent-strong': accentStrong,
    });
  });

  it.each([
    ['light', '#107148', '#FFFFFF', '#F5F6F8', '#F0FBF6'],
    ['dark', '#2AB87C', '#161B22', '#1F242B', '#12231B'],
  ] as const)(
    'pasa AA sobre las cinco superficies de %s',
    (theme, accentStrong, surface, background, surfaceSecondary) => {
      const { accentSoft, tabPill } = composedSurfaces[theme];

      [surface, background, surfaceSecondary, accentSoft, tabPill].forEach(
        (target) => {
          expect(contrast(accentStrong, target)).toBeGreaterThanOrEqual(4.5);
        },
      );
    },
  );

  it('no degrada el tema oscuro: la tinta sigue siendo el verde de hoy', () => {
    expect(parseVariables(extractVariant('dark'))['accent-strong']).toBe(
      '#2AB87C',
    );
    expect(contrast('#2AB87C', '#161B22')).toBeCloseTo(6.792, 3);
    expect(contrast('#2AB87C', '#1F242B')).toBeCloseTo(6.128, 3);
  });
});

describe('#61 R5: token warning-strong con AA sobre surface y warning-soft', () => {
  it('registra el espejo --color-warning-strong para las utilidades text-*', () => {
    expect(globalCss).toMatch(
      /@theme inline\s*{[^}]*--color-warning-strong:\s*var\(--warning-strong\);/,
    );
  });

  it.each([
    ['light', '#92610A'],
    ['dark', '#FBBF24'],
  ] as const)('define la variante AA del ámbar en %s', (theme, strong) => {
    expect(parseVariables(extractVariant(theme))).toMatchObject({
      'warning-strong': strong,
    });
  });

  it.each([
    ['light', '#92610A', '#FFFFFF'],
    ['dark', '#FBBF24', '#161B22'],
  ] as const)(
    'pasa AA sobre bg-surface y bg-warning-soft en %s',
    (theme, strong, surface) => {
      expect(contrast(strong, surface)).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(strong, composedSurfaces[theme].warningSoft),
      ).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each([
    ['light', '#F59E0B'],
    ['dark', '#FBBF24'],
  ] as const)(
    'conserva el ámbar puro de iconos y rellenos en %s',
    (theme, warning) => {
      expect(parseVariables(extractVariant(theme))).toMatchObject({
        warning,
        'color-warning': warning,
      });
    },
  );
});

describe('#61 R6: muted light pasa AA sobre bg-default sin tocar dark', () => {
  it('sube el gris de texto claro hasta cruzar el umbral', () => {
    expect(parseVariables(extractVariant('light'))).toMatchObject({
      muted: '#667085',
      'color-muted': '#667085',
    });
    expect(contrast('#667085', '#F5F6F8')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#667085', '#F5F6F8')).toBeCloseTo(4.601, 3);
  });

  it('pasa AA también sobre surface y surface-secondary', () => {
    expect(contrast('#667085', '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#667085', '#F0FBF6')).toBeGreaterThanOrEqual(4.5);
  });

  it('no toca el gris del tema oscuro, que ya pasaba', () => {
    expect(parseVariables(extractVariant('dark'))).toMatchObject({
      muted: '#9CA3AF',
      'color-muted': '#9CA3AF',
    });
    expect(contrast('#9CA3AF', '#1F242B')).toBeGreaterThanOrEqual(4.5);
  });
});

describe('#64 R1: global.css declara la paleta pastel categórica en tema claro', () => {
  it('declara los diez tokens exactos y reusa la familia verde existente', () => {
    const light = parseVariables(extractVariant('light'));

    expect(light).toMatchObject({
      'color-category-blue': '#EFF6FF',
      'color-category-blue-strong': '#0768E0',
      'color-category-amber': '#FFF7ED',
      'color-category-amber-strong': '#A55E07',
      'color-category-green': '#F0FBF6',
      'color-category-green-strong': '#107148',
      'color-category-violet': '#F5F3FF',
      'color-category-violet-strong': '#7549F7',
      'color-category-rose': '#FFF0F3',
      'color-category-rose-strong': '#D80B34',
    });
    expect(light['color-category-green']).toBe(light['surface-secondary']);
    expect(light['color-category-green-strong']).toBe(light['accent-strong']);
  });
});

describe('#64 R2: el tema oscuro de la paleta se diseña a la profundidad de surface-secondary', () => {
  it('declara los diez tokens exactos y alinea la luminancia de las superficies', () => {
    const dark = parseVariables(extractVariant('dark'));

    expect(dark).toMatchObject({
      'color-category-blue': '#0B203A',
      'color-category-blue-strong': '#4A8DDF',
      'color-category-amber': '#271E14',
      'color-category-amber-strong': '#C17B22',
      'color-category-green': '#12231B',
      'color-category-green-strong': '#2AB87C',
      'color-category-violet': '#221C33',
      'color-category-violet-strong': '#9579E7',
      'color-category-rose': '#39131A',
      'color-category-rose-strong': '#E35E78',
    });

    for (const surface of [
      '#0B203A',
      '#271E14',
      '#12231B',
      '#221C33',
      '#39131A',
    ]) {
      expect(luminance(surface)).toBeCloseTo(luminance('#12231B'), 4);
      expect(luminance(surface)).toBeCloseTo(0.0141, 4);
    }

    expect(dark['color-category-green']).toBe(dark['surface-secondary']);
    expect(dark['color-category-green-strong']).toBe(dark['accent-strong']);
  });
});

describe('#64 R3: cada tinta categórica pasa AA sobre su superficie en los dos temas', () => {
  function categoryContrastCases(): {
    theme: 'light' | 'dark';
    slot: string;
    surfaceToken: string;
    inkToken: string;
    expected: number;
  }[] {
    return [
      {
        theme: 'light',
        slot: 'blue',
        surfaceToken: 'color-category-blue',
        inkToken: 'color-category-blue-strong',
        expected: 4.746,
      },
      {
        theme: 'light',
        slot: 'amber',
        surfaceToken: 'color-category-amber',
        inkToken: 'color-category-amber-strong',
        expected: 4.705,
      },
      {
        theme: 'light',
        slot: 'green',
        surfaceToken: 'color-category-green',
        inkToken: 'color-category-green-strong',
        expected: 5.703,
      },
      {
        theme: 'light',
        slot: 'violet',
        surfaceToken: 'color-category-violet',
        inkToken: 'color-category-violet-strong',
        expected: 4.725,
      },
      {
        theme: 'light',
        slot: 'rose',
        surfaceToken: 'color-category-rose',
        inkToken: 'color-category-rose-strong',
        expected: 4.732,
      },
      {
        theme: 'light',
        slot: 'neutral',
        surfaceToken: 'default',
        inkToken: 'muted',
        expected: 4.601,
      },
      {
        theme: 'dark',
        slot: 'blue',
        surfaceToken: 'color-category-blue',
        inkToken: 'color-category-blue-strong',
        expected: 4.810,
      },
      {
        theme: 'dark',
        slot: 'amber',
        surfaceToken: 'color-category-amber',
        inkToken: 'color-category-amber-strong',
        expected: 4.776,
      },
      {
        theme: 'dark',
        slot: 'green',
        surfaceToken: 'color-category-green',
        inkToken: 'color-category-green-strong',
        expected: 6.432,
      },
      {
        theme: 'dark',
        slot: 'violet',
        surfaceToken: 'color-category-violet',
        inkToken: 'color-category-violet-strong',
        expected: 4.811,
      },
      {
        theme: 'dark',
        slot: 'rose',
        surfaceToken: 'color-category-rose',
        inkToken: 'color-category-rose-strong',
        expected: 4.788,
      },
      {
        theme: 'dark',
        slot: 'neutral',
        surfaceToken: 'default',
        inkToken: 'muted',
        expected: 6.148,
      },
    ];
  }

  it('reproduce el ancla de contraste usada por #61', () => {
    expect(contrast('#FFFFFF', '#2AB87C')).toBeCloseTo(2.547, 3);
  });

  it.each(categoryContrastCases())(
    '$theme $slot conserva el ratio diseñado',
    ({ theme, surfaceToken, inkToken, expected }) => {
      const variables = parseVariables(extractVariant(theme));
      const ratio = contrast(variables[inkToken], variables[surfaceToken]);

      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(expected, 3);
    },
  );
});

describe('#64 R4: ninguna categoría se confunde con otra ni con un token de estado', () => {
  const themes = ['light', 'dark'] as const;
  const slots = ['blue', 'amber', 'green', 'violet', 'rose', 'neutral'] as const;
  const expectedSurfaceMinima = { light: 3.7, dark: 9.3 } as const;
  const expectedStateSurfaceMinima = {
    light: {
      blue: 9.4,
      amber: 4.9,
      green: 3.5,
      violet: 10.2,
      rose: 4.6,
      neutral: 8.5,
    },
    dark: {
      blue: 16.7,
      amber: 8.9,
      green: 3.6,
      violet: 10.2,
      rose: 9.8,
      neutral: 10.6,
    },
  } as const;

  function categoryColors(theme: 'light' | 'dark') {
    const variables = parseVariables(extractVariant(theme));

    return Object.fromEntries(
      slots.map((slot) => [
        slot,
        slot === 'neutral'
          ? { surface: variables.default, ink: variables.muted }
          : {
              surface: variables[`color-category-${slot}`],
              ink: variables[`color-category-${slot}-strong`],
            },
      ]),
    ) as Record<(typeof slots)[number], { surface: string; ink: string }>;
  }

  function composite(foreground: string, background: string): string {
    const channels = [1, 3, 5].map((offset) =>
      Math.round(
        Number.parseInt(foreground.slice(offset, offset + 2), 16) * 0.15 +
          Number.parseInt(background.slice(offset, offset + 2), 16) * 0.85,
      ),
    );

    return `#${channels.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
  }

  it.each(themes)('separa las quince parejas de superficies en %s', (theme) => {
    const palette = categoryColors(theme);
    const distances = slots.flatMap((slot, index) =>
      slots.slice(index + 1).map((other) =>
        deltaE00(palette[slot].surface, palette[other].surface),
      ),
    );

    expect(distances).toHaveLength(15);
    distances.forEach((distance) => expect(distance).toBeGreaterThanOrEqual(2.3));
    expect(Math.min(...distances)).toBeCloseTo(expectedSurfaceMinima[theme], 1);
  });

  it.each(themes)('separa superficies y tintas de los tokens de estado en %s', (theme) => {
    const variables = parseVariables(extractVariant(theme));
    const palette = categoryColors(theme);
    const stateSurfaces = [
      composedSurfaces[theme].accentSoft,
      composedSurfaces[theme].tabPill,
      composedSurfaces[theme].warningSoft,
      composite(variables.danger, variables.surface),
      composite(variables.success, variables.surface),
    ];
    const solidStateTokens = [
      'accent',
      'accent-strong',
      'success',
      'warning',
      'warning-strong',
      'danger',
    ] as const;

    for (const slot of slots) {
      const colors = [palette[slot].surface, palette[slot].ink];
      const stateSurfaceDistances = colors.flatMap((color) =>
        stateSurfaces.map((stateSurface) => deltaE00(color, stateSurface)),
      );

      stateSurfaceDistances.forEach((distance) =>
        expect(distance).toBeGreaterThanOrEqual(2.3),
      );
      expect(Math.min(...stateSurfaceDistances)).toBeCloseTo(
        expectedStateSurfaceMinima[theme][slot],
        1,
      );

      for (const color of colors) {
        for (const token of solidStateTokens) {
          if (slot === 'green' && color === palette.green.ink && token === 'accent-strong') {
            continue;
          }

          expect(deltaE00(color, variables[token])).toBeGreaterThanOrEqual(2.3);
        }
      }
    }

    expect(deltaE00(palette.green.surface, variables['surface-secondary'])).toBe(0);
    expect(deltaE00(palette.green.ink, variables['accent-strong'])).toBe(0);
  });
});
