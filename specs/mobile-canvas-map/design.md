---
feature: "mobile-canvas-map"
status: approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-canvas-map]]

## Premisas contrastadas

Comprobadas contra el árbol en la base `ccd5460a` (la rama mergeada con
`origin/dev` `329c613c`, que ya contiene #197, #198 y #200):

- `src/screens/map/index.tsx` importa `Text` y `View` de `react-native`: las
  clases `text-11` y `text-15` no pasan por twMerge. Solo `Button.Label` es de
  HeroUI.
- Hoy ningún `EmptyState` del mapa pasa `variant`: sin mascotas y sin rastreo
  usan la variante por defecto (hueco `items-center gap-3 py-8`). R12 y R13 los
  pasan a `hero`.
- `EmptyState` hero ya pinta escenario (`-stage`), pose, botón
  `h-14 rounded-16 bg-accent` con `chunkyLip.primary` y un `<Plus size={20} …>`
  con `testID` `${testID}-action-icon`. Desde #198 R18 ya acepta
  `badge?: ReactNode` (último hijo de `-stage`), `actionIcon?: ReactElement`
  (sustituye al `<Plus>`) y `body?: string` (sin `body` no monta `-body` ni su
  envoltorio); lo candan los seis `it` EH `#198 R18`. El mapa solo la consume.
- `EmptyState` ya interpola `${CATEGORY_SLOTS.rose.surface}` en el disco del
  tono `danger`: es el patrón que D22 copia en el mapa y que CO `#64 R9` admite
  (solo veta `(?:bg|text)-category-\$\{` y el literal fuera de la paleta).
- `Skeleton` de heroui-native 1.0.8 tiene `variant` (`'shimmer'` por defecto,
  `'pulse'`, `'none'`) y, aparte, `animation` (config o `'disable-all'`). Solo
  con `variant="pulse"` envuelve su host (`skeleton__root …`) en un
  `Animated.View` sin `className`.
- `PopIn` (`src/components/pop-in.tsx`) acepta `testID`, `className`, `style` y
  `children`.
- `bg-glass-surface-strong` existe: `rgba(255,255,255,0.86)` claro (= `--glass`
  del canvas) y `rgba(22,27,34,0.86)` oscuro. `bg-category-rose` y
  `text-category-rose-strong` existen en los dos temas.
- No hay radio 6 y `rounded-md|lg|2xl|sm` están vetados
  (`consistency-classnames`). Los radios usados (14, 16, 24, 4, `full`, `card`)
  son tokens.
- El badge de error del canvas es exclamación + círculo `r=9.5`: el mismo dibujo
  que `AlertCircle`. El collar del canvas es `stroke-width="2"`, 26 × 26.
- `#116 R2 › …la tarjeta como hijo 1` busca `stat-speed` dentro del hijo 1: no
  depende de que la tarjeta sea `Card`.
- `useShadows()` de #197 (`src/theme/shadows.ts`) devuelve `{ boxShadow: [{ offsetX, offsetY, blurRadius,
  spreadDistance, color }] }`; `card` son dos capas (1/2 y 8/24) y `floating`
  una (12/32).
- Ningún literal de copy del canvas falta en el catálogo (ver requisitos,
  párrafo de copy).

## Supuestos

Supuestos de entorno que jest no ve; cada uno tiene su smoke en
`requirements.md` § Cierre del humano:

- **Cristal sobre el mapa nativo (S2).** Sin `BlurView`, la legibilidad de la
  píldora depende solo del 0.86 de alfa sobre el `GoogleMaps.View`.
- **`boxShadow` en Android (S2, S3).** Las sombras de `useShadows` usan
  `boxShadow` de React Native (arquitectura nueva, SDK 57). Se supone que se
  pintan sobre la superficie del mapa.
- **twMerge de HeroUI (S4, S7).** El test ve la `className` que llega al host
  (prefijo BEM de HeroUI más la del autor), no qué clase gana al pintar.
  Que `rounded-14` y `bg-category-rose` ganen a las clases de la variante
  `danger-soft`, y `rounded-4` / `bg-lip-gray` a las de `Skeleton`, solo se ve en
  el dispositivo.
- **Movimiento reducido (S1).** `useReducedMotion()` lee el ajuste del sistema
  al montar.
- **TalkBack (S5).** `accessibilityRole="alert"` anuncia el error al montarse.
- **Ancho de polilínea (S10).** `GoogleMaps.View` de `expo-maps` respeta
  `width` en Android.
- **Tema de jest.** Los tests corren en tema claro; los colores esperados son
  los claros del canvas.

## Contraste con el artboard

Conversión px → clase usada en los requisitos (escala de 4 px de Tailwind v4;
los decimales son válidos en uniwind):

| Canvas | Clase | Dónde |
|---|---|---|
| 5 / 6 / 7 px | `gap-1.25` / `py-1.5 pl-1.5` / `size-1.75` | Píldora (R2) |
| 10 / 14 px | `gap-2.5` / `pr-3.5`, `py-3.5` | Pila, tarjeta (R1, R4), píldora, aviso (R2, R9) |
| 22 / 30 / 34 / 36 / 40 px | `h-5.5` / `right-7.5` / `bottom-8.5` / `right-9` / `bottom-10` | Esqueleto, badges (R10, R11, R13) |
| 50 / 52 / 56 px | `h-12.5` / `size-13` / `size-14` | Botón, badges (R7, R10, R11, R13) |
| 60 / 120 px | `pt-15` / `pb-30` | Envoltorio de Pingo (R11–R13) |
| 150 / 48 / 72 px | `w-37.5` / `w-12` / `w-18` | Esqueleto (R10) |
| radios 14 / 16 / 20 / 24 / 6 | `rounded-14` / `rounded-16` / `rounded-card` / `rounded-24` / `rounded-4` (D14) | |
| 11 / 12 / 14 / 15 / 16 / 20 px | `text-11` / `text-xs` / `text-sm` / `text-15` / `text-base` / `text-xl` | No hay `--text-16` ni `--text-20` |
| peso 600 / 700 / 800 / 900 | `font-semibold` / `font-bold` / `font-extrabold` / `font-black` | |

Cada fila de CF afirma a la vez la cuenta del literal en el artboard y la del
literal de producción, así que un cambio en cualquiera de los dos lados la pone
roja.

## Dependencias y precondiciones

- **#197, #198 y #200 ya están en la base** (`ccd5460a`, D21): `useShadows`,
  `MOTION_RISE_OFFSET_Y` / `MOTION_RISE_TIMING`, `homeEntering` con `rise`,
  danger `#D92D20`, la API de `EmptyState` de #198 R18 y las enmiendas de CC
  (`consumers` con 17 ficheros). No hay precondición de merge pendiente.
- FN (`src/__tests__/canvas-foundations.test.ts`) no tiene candado de
  importadores de `shadows` (`grep -cF '#197 R20'` = 0): no hay fila de FN.
- Si `dev` avanza antes del handoff, re-medir la base (`requirements.md`
  § Base medida y `tasks.md` § Cuentas) y, si aparece un inventario de
  consumidores que esta spec no lista, enmendar el inventario cerrado y reabrir
  el gate solo para esas filas.
- Ninguna dependencia nueva: `react-native-reanimated`, `react-native-svg`,
  `heroui-native`, `reicon-react-native` y `expo-maps` ya están. `expo-blur`
  está instalado y no se usa (D1); `expo-linear-gradient` está vetado.
- Ningún coste ni recurso AWS.

## Decisiones técnicas

Las decisiones de producto están en `requirements.md` § Decisiones con defecto
(D1–D22). Las de implementación:

- **Todo en línea, como hoy.** Los cuatro tiles, los once `Skeleton` y las dos
  ramas de error se escriben en línea en `map/index.tsx`. Las cuentas de CF y
  de ES (4 `<EmptyState`) dependen de eso. Un helper local movería esas cuentas
  y mezclaría dos ramas con `testID` distintos.
- **Un solo `useThemeColors` y un solo `useShadows`** en `MapScreen`. Los
  iconos reciben color de ahí; ningún hex en el fichero (R16).
- **Tono del punto en línea**: sobrescritura local `bg-accent` para la rama
  `success` del mapa (D17); `STATUS_TONE_CLASSES` no cambia porque lo comparten
  otras pantallas.
- **`EmptyState` no cambia** (R14): la API de `badge`, `actionIcon` y `body`
  opcional ya la entregó #198 R18. El mapa la consume en R11–R13.
- **El rosa por la paleta** (D22): `CATEGORY_SLOTS.rose.surface` / `.ink` en
  plantillas de `className`, como hace `empty-state.tsx`; ningún literal
  `bg-category-` / `text-category-` en el mapa, así CO `#64 R9` no se enmienda.
- **`Skeleton variant="pulse"`** (D14): la prop `animation` no acepta
  `'pulse'`; el mapa no la escribe.
- **`PetMap`**: prop opcional `polylineWidth`; sin ella no hay clave `width`,
  así que el resto de consumidores y sus tests no cambian.
- **CF nuevo** (`src/__tests__/map-canvas-fidelity.test.ts`): lee los
  artboards desde `specs/mobile-canvas-map/canvas/` con `process.cwd()` y la
  fuente con `readFileSync`; un `describe` por requisito y cada fila afirma las
  dos cuentas. R16 vive en el mismo fichero.
- **Comentarios**: todo comentario nuevo cita `#201 R<n>`; `HEX_LITERAL` solo
  exime esa forma.

## Archivos afectados

Todo es capa de presentación móvil (`mobile-pet-tracker/`). Nada de
`domain/`, `application/` ni `infrastructure/`; nada de `backend-pet-tracker/`.

Producción:

| Fichero | R |
|---|---|
| `src/screens/map/index.tsx` | R1, R2, R4–R13, R15, R16 |
| `src/components/empty-state.tsx` | R16 (solo lo lee la guarda de CF; no cambia) |
| `src/components/pet-map.tsx` | R15, R16 |

Tests:

| Fichero | R |
|---|---|
| `src/screens/map/index.test.tsx` (MT) | R1–R13, R15 y filas 1–18 del inventario |
| `src/__tests__/map-canvas-fidelity.test.ts` (CF, nuevo) | R1, R2, R4–R13, R15, R16 |
| `src/components/__tests__/empty-state.test.tsx` (ES) | filas 19–20 |
| `src/components/__tests__/pet-map.test.tsx` (PM) | R15 |
| `src/__tests__/chunky-cta-canvas-fidelity.test.ts` (CC) | filas 21–24 |
| `src/__tests__/legibility-classnames.test.ts` (LG) | fila 25 |
| `src/__tests__/design-drift.test.ts` (DD) | fila 26 |
| `src/__tests__/alerts-canvas-fidelity.test.ts` (AF) | fila 27 |

CC cambia en `#177 R7.2`, `R7.3`, `R7.4`, `R7.5`, `R12.1/R12.2` y `R12.3`
(filas 21–24; los tres últimos leen la constante `consumers`).

Se citan y no cambian: `src/components/__tests__/empty-state-hero.test.tsx`
(EH, `#198 R18`, prueba de R14), `src/__tests__/consistency-classnames.test.ts`
(CO, `#64 R9`, D22) y `src/utils/category-palette.ts`.

No cambian: `src/components/empty-state.tsx`, `src/i18n/catalog.ts`,
`src/__tests__/ui-copy-table.ts`, `src/theme/global.css`,
`src/app/_layout.tsx`, `src/screens/home/**`, `package.json`.

## Alternativas descartadas

- **`BlurView` en la píldora**: sin probar sobre la superficie nativa del mapa
  (D1).
- **Componente de escena propio en el mapa** en vez de usar la API de
  `EmptyState` de #198 R18: duplicaría disco, Pingo, sombra y botón con labio
  que Inicio ya comparte.
- **Literales `bg-category-rose` / `text-category-rose-strong` en el mapa**
  enmendando CO `#64 R9`: rompería la regla de que solo la paleta nombra el
  color categórico (D22).
- **Mantener la tarjeta como `Card`** con clases de anulación (`border-0`,
  `shadow-none`): pelea con la receta del `Card` vía twMerge para quitar lo que
  el canvas no tiene (D4).
- **Receta nueva de `pop`** en `theme/motion.ts`: `PopIn` ya es el pop de la app
  (D7).
- **Token `--radius-6`** para el bloque de valor del esqueleto: un token por un
  esqueleto (D14).
- **Helper local para las dos ramas de error**: mueve las cuentas y junta dos
  ramas con consultas distintas (ver Decisiones técnicas).
- **`expo-linear-gradient`**, `StyleSheet.create` y clases arbitrarias: vetados
  por la carta.

## Riesgos

- **Inventarios que entren en `dev` después de `ccd5460a`.** Una feature
  mergeada más tarde puede dejar un candado de consumidores que el mapa
  rompa. Re-medir antes del handoff (ver Dependencias).
- **twMerge en HeroUI** con radios propios (`rounded-14`, `rounded-4`): si la
  clase de la variante gana, el smoke S4 / S7 lo ve y se resuelve con un
  `style` objeto (enmienda de R7 / R10).
- **ES `#159 R9`** pierde cuatro filas del mapa y cambia de título (fila 20):
  la intención «sin movimiento en los estados sin collar» queda revertida a
  propósito para el mapa (el canvas anima el badge y la escena); las zonas la
  conservan.
- **La base se mueve** si `dev` avanza: las cuentas de `tasks.md` se re-miden
  antes del handoff.
