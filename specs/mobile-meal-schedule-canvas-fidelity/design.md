---
feature: "mobile-meal-schedule-canvas-fidelity"
status: approved
tags: [mobile, ui, spec]
---

# #179 mobile-meal-schedule-canvas-fidelity — Diseño

> Base congelada `fb5b209f` (= `origin/main` `788d1f89` + commits de harness).
> Se implementa **después** de que #173 mergee (§Dependencias D1–D11 de
> requirements.md). Los literales que mandan están en requirements.md; este
> documento explica el porqué y el reparto, sin código.

## 1. Alcance por capa

Solo presentación de `mobile-pet-tracker/`. Ni dominio, ni aplicación, ni
infraestructura: los hooks de datos de las dos pantallas, sus claves de
TanStack Query y el backend quedan intactos.

| Capa | Fichero | R |
|---|---|---|
| Tema | `src/theme/global.css` (`@theme`) | R1 |
| Carta | `docs/ui-guidelines.md` | R2 |
| i18n | `src/i18n/catalog.ts`; registro de copy en `specs/mobile-ui-language/design.md` (sección nueva tras la última §2.x; a la base, tras `§2.26`) | R3, R5 |
| Navegación | `src/app/_layout.tsx` (`title: ''` en `meal-schedule` y `meals-history`) | R4, R9 |
| Pantalla | `src/screens/meal-schedule/index.tsx` | R4–R8 |
| Pantalla | `src/screens/meals-history/index.tsx` | R9–R12 |
| Utilidad | `src/utils/month-grid.ts` (`weekdayHeaders`: `short` → `narrow`) | R10 |
| Tests | los de §Deltas de candados más un `describe('#179 Rn…')` por R | todos |

No se crea componente compartido nuevo: las filas reutilizan
`Card variant="flat"` de #173 (D5), las entradas `HomeEntrance`, el mosaico
`CATEGORY_SLOTS` y el toque `TOUCH_SLOP`. Cada pieza nueva vive en el
fichero de su pantalla (un uso, sin abstracción).

## 2. Tokens (R1)

Ocho tokens; cinco pueden haber llegado ya a `main` por #174, #175 o #178
(tabla S1–S6). Regla de mezcla del preámbulo: mismo nombre y mismo valor, se
reutiliza; mismo nombre y otro valor, H0 para (P12). Nunca se duplica una
línea en `@theme` (R1 lo asevera con «una sola vez cada uno»).

Por qué tokens y no la escala: la directiva «píxel exacto» (P1) supera la
opción (b) del explore. Radios 10/14/24 y letra 15/17/22 no existen en la
escala y los corchetes están prohibidos (carta regla 3). Alturas 39 y 54 y
tamaños 42 y 5 sí caen en el espaciado fraccional de Tailwind v4 (`h-9.75`,
`h-13.5`, `size-10.5`, `size-1.25`), así que no piden token.

## 3. Horario (`src/screens/meal-schedule/index.tsx`)

Orden de bloques dentro del `ScrollView`:

1. título en contenido `meal-schedule-heading` (R4), fuera del `View`
   interno para que salga también en carga, error y sin plan;
2. resumen `meal-schedule-summary` (R5): deja `Card variant="accent"` por un
   `View` propio con radio 24 y labio `border-b-5 border-black/25`, que
   `Card accent` no tiene. Tres columnas valor + rótulo;
3. sección de horas (R6): h2 17/800 y filas `Card variant="flat"` en
   `HomeEntrance` con `index` creciente; mosaico ámbar con `Clock`;
4. acciones (R7) en `meal-schedule-actions`: «Añadir comida» sale de
   `meal-times-section` (por eso Δ7) y «Generar plan» deja de ser primario;
5. perfil nutricional (R8): de card a h2 + píldoras con `flex-wrap`.

Colores de icono por `useThemeColors` con tokens de categoría (ámbar en el
mosaico, violeta en «Generar plan»). Pedir `'accent'` sigue prohibido por
#61 R3; la petición nueva no lo incluye.

## 4. Historial (`src/screens/meals-history/index.tsx`)

1. título en contenido (R9), mismo patrón que Horario;
2. calendario (R10): deja `Card` (Δ21) por un `View` de radio 24 con
   `style={CONTINUOUS_CORNER}`; flechas cuadradas de 40 `rounded-xl
   bg-default` con `hitSlop` y estilo función (no cuentan en el inventario
   de `style={CONTINUOUS_CORNER}`); iniciales `narrow`;
3. celdas (R11): número + punto o espaciador `size-1.25`, para que toda
   celda tenga dos hijos y el número no salte (P17); seleccionada con
   `bg-tab-pill` (P16) en lugar de `bg-accent-soft`;
4. panel del día (R12): sale del calendario, va aparte en
   `HomeEntrance index={1}`, con badge y horas en cajas `flex-wrap` de
   `min-w-20` (P6).

## 5. Dobles de test

- `HomeEntrance`: doble que registra sus props en `mockHomeEntrance` y pinta
  sus hijos, como en #175 y #178, en MST y en MHT. Entra en T0 con todos los
  `it` vivos en verde (es transparente).
- `reicon-react-native` en MST: Δ8 (fuera `ForkKnife`, dentro `Sparkles`;
  `Clock` si el doble no lo tiene). En MHT, `ChevronLeft` y `ChevronRight`
  si el doble no los tiene. Cada icono doblado es una función (`icon('…')`),
  no una clase, y el fichero pasa `tsc` y `eslint`.
- Ningún doble nuevo de `react-native-reanimated`: `HomeEntrance` ya va
  doblado y su propio candado (`home-entrance.test.tsx`) cubre reduce motion.

## 6. Coordinación

- **#173**: D1–D11. Sin #173 en `main` la spec no arranca.
- **#174, #175, #178**: tokens S1–S6 y carta S7–S11 «0 o 1».
- **#177**: caso B tal cual; caso A, H0 para (requirements §#177).
- Inventarios compartidos (`consistency-classnames`, `design-drift`,
  `ui-language`, `language-provider`, `profile-canvas-fidelity`): siempre
  H0 + delta, nunca la cifra de la base (Δ17, Δ18, Δ22–Δ35).

## 7. Alternativas descartadas

- **Escala de Tailwind para los radios** (`rounded-xl`, `rounded-3xl`): no
  da 10, 14 ni 24; la directiva pide píxel exacto.
- **Conservar `Card variant="accent"` en el resumen**: sin radio 24 ni labio.
- **Labio violeta en «Generar plan»** (`rgba(91,63,163,0.35)`): sin token;
  pediría un token de color para un solo uso (P3).
- **Píldora «Edad» desde `ageMonths`**: umbrales por especie y copy nuevo;
  queda como alternativa (b) de P5.
- **`ScrollView` horizontal para las horas del panel**: esconde horas;
  `flex-wrap` las muestra todas (P6).
- **Componente compartido de secundario chunky**: dos usos en una pantalla
  y #177 puede traer la receta global; se reevalúa en el caso A.
