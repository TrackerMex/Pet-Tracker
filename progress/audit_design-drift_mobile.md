# Auditoría de drift del design system — mobile-pet-tracker

> Solo lectura (skill expo-design-system, references/audit.md). 2026-08-24.
> Sistema declarado: Tailwind v4 + uniwind + heroui-native. Fuente de verdad:
> `src/theme/global.css` (única entrada, correcto). Sin StyleSheet, sin
> shadows legacy, sin fontSize crudo. Estado general: **sano con drift
> localizado** (~0.9 escapes/100 SLOC sobre 3669 SLOC).

## Hallazgos por prioridad

### 1. Receta de card duplicada 11× (el escape dominante)
`rounded-[20px] border border-border bg-surface p-4 shadow-sm` repetida en
las 7 pantallas de tabs (más variantes `bg-accent p-5`, `bg-surface-secondary`,
`p-3`). `rounded-[20px]` aparece 21×. Cumple los 3 criterios de extracción
(≥2 pantallas, rol nombrable "Card", API menor que implementación).
**Fix sugerido**: token `--radius-card: 20px` en `@theme` de `global.css`
(clase `rounded-card`) + componente `src/components/card.tsx` con variantes
`surface | accent | secondary`. NO usar el `Card` de heroui como base sin
verificar su radius (bug ya visto en #46: `--radius` shadcn ≠ escala heroui).

### 2. `text-[10px]` 15× sin step tipográfico
En `floating-tab-bar.tsx` (labels de tabs) y `map.tsx` (leyendas de stats).
**Fix**: `--text-2xs: 10px` en `@theme` → clase `text-2xs`.

### 3. Convención de dimensiones (docs/conventions.md §268) incumplida en pantallas pre-#38
- `paddingTop: insets.top + 12` presente solo en home, food, meal-schedule.
  **Faltan**: `health.tsx` y `weight-log.tsx` (confían en
  `contentInsetAdjustmentBehavior="automatic"`, que en Android no hace nada)
  y `profile.tsx` (sin insets en absoluto). `map.tsx` es full-screen, exenta,
  pero tiene `top: 64` hardcodeado para el overlay (debería ser
  `insets.top + N`).
- Spinner suelto en vez de Skeleton dimensionado: `health.tsx:90`,
  `weight-log.tsx:201`, `map.tsx:144`.

### 4. Menores
- `theme/use-theme-colors.ts:19` duplica en TS los hex `#F7F8FA`/`#0D1117`
  ya definidos en `global.css` como fallback. Tolerable (es el fallback del
  helper), pero si cambia el foreground hay que tocar 2 sitios.
- `global.css` duplica cada token semántico como `--accent` y
  `--color-accent` (light y dark). Si es requisito de heroui/uniwind, ok;
  si no, un alias `var()` reduciría la superficie de mantenimiento.
- `size-[72px]` 2× (avatares) — bajo, dejar.

## Scores (escapes / 100 SLOC)

| Categoría | Escapes | Score | Lectura |
|---|---|---|---|
| Clases arbitrarias `[..]` | 34 | 0.9 | Drifting — concentrado en radius y text-2xs |
| Hex fuera de theme | 0 | 0.0 | Sano |
| fontSize / shadows legacy / StyleSheet | 0 | 0.0 | Sano |

## Contrato de componentes compartidos

| Componente | Pressed | A11y | Tokens | Notas |
|---|---|---|---|---|
| floating-tab-bar | OK | OK | `text-[10px]` escapa | — |
| pet-switcher | OK | OK | OK | — |
| weight-chart | n/a (no tappable) | n/a | OK | — |

## Orden de adopción sugerido (cuando se decida ejecutar)

1. Tokens primero: `--radius-card` + `--text-2xs` en `global.css`.
2. `card.tsx` compartido; convertir `home.tsx` completo como patrón de referencia.
3. Resto de pantallas, una por commit.
4. Safe area + Skeleton en health/weight-log/profile (cierra la convención §268).

Nada de esto bloquea #39; puede entrar como feature de limpieza o colarse
pantalla a pantalla en features futuras que ya toquen cada archivo.
