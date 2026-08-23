---
feature: "mobile-figma-polish"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-figma-polish]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Fuente de verdad del diseño: `design-src/` en esta misma carpeta.

## Decisiones técnicas

### 1. Mapeo de tokens: shadcn (Make) → heroui-native (`src/theme/global.css`) — sirve a R1

El Make usa nombres shadcn (`--primary`, `--card`, `--muted`…); heroui-native
usa otros (`--accent`, `--surface`, `--muted` = *texto* muted). No se importa
`theme.css` tal cual: se traducen valores a los tokens que heroui-native ya
consume (visto en `node_modules/heroui-native/src/styles/theme.css`).

| Token Make (light) | Valor | Token heroui-native | Valor a definir |
|---|---|---|---|
| `--primary` | `#2AB87C` | `--accent` | `#2AB87C` |
| `--primary-foreground` | `#FFFFFF` | `--accent-foreground` | `#FFFFFF` |
| `--background` | `#FFFFFF` | `--background` | `#FFFFFF` |
| `--foreground` | `#0D1117` | `--foreground` | `#0D1117` |
| `--card` / `--card-foreground` | `#FFFFFF` / `#0D1117` | `--surface` / `--surface-foreground` | `#FFFFFF` / `#0D1117` |
| `--secondary` | `#F0FBF6` | `--surface-secondary` | `#F0FBF6` |
| `--muted` (fondo) | `#F5F6F8` | `--default` (fondos de chip/field) | `#F5F6F8` |
| `--input-background` | `#F5F6F8` | *(cubierto por `--default`; `--color-field` cae en `--default`)* | — |
| `--muted-foreground` | `#6B7280` | `--muted` | `#6B7280` |
| `--border` | `rgba(13,17,23,0.07)` | `--border` y `--separator` | `rgba(13,17,23,0.07)` |
| `--destructive` | `#EF4444` | `--danger` | `#EF4444` |
| *(chart-3 / naranjas de "días")* | `#F59E0B` | `--warning` | `#F59E0B` |
| *(verde texto de Pill "En línea")* | `#0F9B5A` | `--success` | `#0F9B5A` |
| `--ring` | `#2AB87C` | `--focus` | `#2AB87C` |
| `--radius` | `1.25rem` | `--radius` | `1.25rem` |
| — | — | `--field-radius` | `0.75rem` (evita que el derivado `radius×1.75` infle los inputs; el diseño usa `rounded-xl` ≈12px en fields) |

- `#E3F9EE` (accent suave del Make) **no necesita token propio**: heroui-native
  deriva `--color-accent-soft` como accent al 15% — sobre fondo blanco da
  ese mismo tono. Ídem `danger-soft`, `warning-soft`, `success-soft` para
  `#FEF2F2`, `#FEF3C7`/`#FFF7ED`, `#F0FBF6`.
- Todo se define en `global.css` bajo `@layer theme` con `@variant light` /
  `@variant dark`, igual que el override actual de `--accent`. Los
  componentes siguen la convención: **cero hex en componentes**, solo clases
  de token (docs/conventions.md §app móvil).

### 2. Dark mode derivado, no copiado — sirve a R2

El bloque `.dark` del Make es el dark por defecto de shadcn en `oklch`
(neutros sin el verde, `--primary` blanco): autogenerado, no diseñado.
**Recomendación**: derivar el dark de la paleta light del diseño, manteniendo
el patrón actual de la app (mismo archivo, variant `dark`):

| Token | Valor dark propuesto | Racional |
|---|---|---|
| `--background` | `#0D1117` | El foreground light del diseño como fondo |
| `--foreground` | `#F7F8FA` | Neutro claro |
| `--surface` / `--surface-foreground` | `#161B22` / `#F7F8FA` | Card elevada sobre el fondo |
| `--surface-secondary` | `#12231B` | El verde suave `#F0FBF6` oscurecido |
| `--default` | `#1F242B` | Fondo de fields/chips |
| `--muted` | `#9CA3AF` | Texto secundario |
| `--border` / `--separator` | `rgba(255,255,255,0.08)` | Espejo del light |
| `--accent` / `--accent-foreground` | `#2AB87C` / `#FFFFFF` | El verde funciona en ambos temas |
| `--danger` / `--warning` / `--success` | `#F87171` / `#FBBF24` / `#34D399` | Un paso más claros para contraste |
| `--focus` | `#2AB87C` | = accent |

Estos valores son propuesta para el gate; el humano puede ajustarlos en la
aprobación sin invalidar la spec (R2 exige "derivado del light del diseño",
no estos hex exactos).

### 3. Inter sin dependencias nuevas — sirve a R3

`@expo-google-fonts/inter` **no** está en `package.json` y añadir deps está
prohibido. `expo-font ~57.0.1` **sí** está. Por tanto: descargar los `.ttf`
estáticos de Inter (400 Regular, 500 Medium, 600 SemiBold, 700 Bold,
900 Black — los pesos que usa `design-src/App.tsx`: normal/medium/semibold/
bold/black) a `mobile-pet-tracker/assets/fonts/`, cargarlos con
`useFonts`/`Font.loadAsync` en `src/app/_layout.tsx` y exponer la familia a
las clases de Tailwind/uniwind para que sea el default de los `Text`.
Funciona en Expo Go (memoria: el humano prueba solo con Expo Go).

### 4. Tab bar: la pill flotante se queda — sirve a R4

El diseño (BottomNav, `App.tsx` L753–776) usa barra anclada clásica con
`border-t` e indicador de línea. **El humano decidió en el gate
(2026-08-23) conservar la pill flotante actual**: se rechaza la barra
anclada del Make. `floating-tab-bar.tsx` solo se re-tokeniza (activo en
`accent` verde, inactivos `muted`, label 10px semibold) **manteniendo
forma/posición/sombras, API, testIDs `tab-*`, labels e iconos reicon**
(peso Filled/Outline como hoy). Cambio 100% contenido en ese archivo.

### 5. Sin gradientes ni headers hero — restricción de alcance

- Gradientes de botón del Make → sólido `bg-accent`. `expo-linear-gradient`
  no está instalado y no se añade.
- Única excepción: el degradado del área del weight-chart (R5), que
  `react-native-svg` (instalado) resuelve con `<LinearGradient>` dentro del
  propio SVG.
- Headers hero (foto 280–340px con overlay): fuera de #46 (ver
  [[requirements]] §Fuera de alcance). Las pantallas conservan su estructura
  de encabezado actual con los nuevos tokens.

### 6. Verificación de una feature de puro estilo — sirve a R12

No hay snapshot testing en la suite y añadirlo anclaría los tests al estilo
(lo contrario de lo que queremos). Mecanismo por tipo de cambio:

- **Tokens y fuentes (R1–R3)**: sí llevan TDD — son datos legibles por test
  (contenido de `global.css`, existencia de `.ttf`, registro en `_layout`).
- **Cambios de `className` (R4–R11)**: sin tests nuevos. Gate doble:
  (a) la suite existente completa verde **sin diffs en asserts** — prueba que
  la conducta no cambió; (b) smoke humano R12 lado a lado contra el Make.

## Archivos afectados

Todo en `mobile-pet-tracker/` (capa presentación; domain/application intactas):

- `src/theme/global.css` — R1, R2 (única fuente de tokens)
- `assets/fonts/Inter-{Regular,Medium,SemiBold,Bold,Black}.ttf` — R3 (nuevos)
- `src/app/_layout.tsx` — R3 (carga de fuentes)
- `src/components/floating-tab-bar.tsx` — R4
- `src/components/weight-chart.tsx` — R5
- `src/app/(tabs)/home.tsx` — R6
- `src/app/(tabs)/map.tsx` — R7
- `src/app/(tabs)/health.tsx` — R8
- `src/app/(tabs)/weight-log.tsx` — R9
- `src/app/(tabs)/profile.tsx` — R10
- `src/app/(auth)/{login,register,forgot}.tsx` — R11
- `src/theme/__tests__/` y `src/app/__tests__/` — tests nuevos de R1–R3
- **Intocables**: asserts existentes en `__tests__/`, `food.tsx` (placeholder),
  `feature_list.json` de copy/testIDs, `package.json`.

## Alternativas descartadas

- **Importar `theme.css` del Make tal cual**: los nombres shadcn
  (`--primary`, `--card`) no existen en heroui-native; duplicaría sistemas de
  tokens.
- **Copiar el bloque `.dark` oklch del Make**: dark genérico de shadcn sin el
  verde de marca; perdería identidad y contraste con el accent.
- **`@expo-google-fonts/inter`**: dep nueva — prohibido en esta feature;
  los `.ttf` estáticos dan el mismo resultado con `expo-font` ya instalado.
- **Cargar Inter por URL en runtime**: dependería de red en cada arranque en
  Expo Go; los assets locales son deterministas.
- **`expo-linear-gradient` para botones/overlays**: dep nueva; sólido accent
  es fiel al 95% del diseño.
- **Snapshot tests para el estilo**: congelarían el markup y romperían con
  cualquier ajuste visual futuro; el gate visual es el smoke humano.
- **Rehacer las pantallas con la estructura hero del Make**: excede "pulido
  visual", multiplica el riesgo sobre los tests de conducta y pide gradientes;
  va como feature aparte si el humano la quiere.
