---
feature: mobile-welcome-splash
id: 118
status: approved
tags: [harness, spec, mobile, ui]
---

# Tareas — #118 mobile-welcome-splash

Orden test-rojo → verde por requisito. Cada tarea es **dos commits como
mínimo**: `test(mobile-welcome-splash): R<n> rojo` y luego
`feat|fix(mobile-welcome-splash): R<n> verde` (C4 de `CHECKPOINTS.md`;
`docs/conventions.md` §Tests). Un `it` nuevo solo asevera nodos que la tarea
en curso o una anterior ya crea.

## 0. Antes de tocar nada (Codex)

- `git fetch origin && git rebase origin/main` sobre `feature/118-mobile-welcome-splash` — #117 toca los mismos candados; **mide cada recuento en tu árbol** antes de aplicar un delta. Los `+N` de la spec son deltas, no absolutos.
- `test ! -e mobile-pet-tracker/.expo/types/router.d.ts` antes de cada `bun run typecheck` (fichero gitignorado con rutas fantasma; si existe, avisa al humano, no lo borres tú).
- Solo `bun`/`bunx`: `bunx jest <ruta>`, `bun run typecheck`. Nunca `npx`, `npm i`.
- Rutas con paréntesis en jest van escapadas: `bunx jest 'src/app/\(auth\)'`. Los ficheros de esta feature no las llevan, pero `index.test.tsx` vive en `src/app/__tests__/`, no en `(auth)`.
- Esperas: aplica `docs/conventions.md` **§Esperas sobre el árbol renderizado** — se espera con `waitFor`/`findBy*` a lo que pinta la pantalla, nunca al contador de un mock. Aquí no hay datos remotos; `act` + `advanceTimersByTime` solo en R10.
- Reporte en `progress/impl_mobile-welcome-splash.md` (qué `it`, qué commit, desviaciones). Nada por chat.

## T1 — R1 (parte 1): catálogo y candado de longitud

1. Rojo: en `src/providers/__tests__/language-provider.test.tsx` añade `+ 8, // #118 R1` al `toHaveLength(` de `englishKeys`. Falla por 8.
2. Verde: añade las 8 claves `welcome.*` de la tabla de R1 al final de `en` y de `es` en `src/i18n/catalog.ts` (literales exactos).
3. Añade `### §2.19 — Añadidos por #118 — Bienvenida` en `specs/mobile-ui-language/design.md` con las 8 filas (formato de §2.18).

## T2 — R2: `index` redirige a `/welcome`

1. Rojo: en `src/app/__tests__/index.test.tsx` renombra el `it` a `'#118 R2: redirects an unauthenticated session to welcome'` y espera `{ href: '/welcome' }`.
2. Verde: `src/app/index.tsx` cambia `'/login'` por `'/welcome'` en el `Redirect` de `unauthenticated`. Los otros dos `it` siguen verdes.

## T3 — R3 + R4 + R5 + R9: nace la pantalla

1. Rojo: crea `src/screens/welcome/index.test.tsx` con los mocks (expo-router `router.push/replace` + `Redirect: jest.fn(() => null)`; `useAuth`; insets `{ top: 40, right: 0, bottom: 24, left: 0 }`; `reicon-react-native` con `mockIcon('icon-map' | 'icon-stethoscope' | 'icon-fork-knife')` al estilo de `src/screens/home/index.test.tsx`; `../../theme/use-theme-colors` devolviendo `['accent-strong-ink']`; wrapper `HeroUINativeProvider` + `LanguageProvider initial="es"` como `src/app/(auth)/__tests__/login.test.tsx`) y los describes `R3`, `R4`, `R5`, `R9`. Añade en `src/app/__tests__/layout.test.tsx` el `+ 1 // #118 R3` a `toHaveLength(5)` de `#95 R2` y un `describe('#118 R3: RootStack declara welcome bajo su propia guarda')` cuyo `it` comprueba que `Children.toArray(stack.children)[5]` es `Stack.Protected` y que su único hijo es `[Stack.Screen, 'welcome']`. Todo rojo (módulo inexistente / longitud 5).
2. Verde: crea `src/screens/welcome/index.tsx` con el árbol de `design.md` §1.3 **completo** (chips incluidos, CTAs con `onPress`, `Animated.View` con su estilo inline de layout pero aún sin `entranceStyle`), `src/app/welcome.tsx` delgado y el bloque `Stack.Protected` en `src/app/_layout.tsx` como sexto hijo.
3. En el **mismo commit verde**: `+ 1 // #118 R7` en los dos recuentos de `rounded-xl bg-accent` de `src/__tests__/consistency-classnames.test.ts` (se ponen rojos al nacer el CTA primario; es el candado de R7 moviéndose, no un fallo).
4. `bun run typecheck` verde (sin `router.d.ts`).

## T4 — R6: los tres chips

1. Rojo: describe `R6` con un `it` por fila 1–10 (bucle por índice sobre `getByTestId('welcome-chips').children`), un `it` de cardinalidad (fila 12) y el candado de fuente de la fila 11 (`text-accent-strong` exactamente 2 veces en `screens/welcome/index.tsx`). Si T3 ya dejó los chips exactos, estos `it` nacen verdes: en ese caso **planta y revierte** una mutación (p. ej. `size={20}`) en un commit `test(...): R6 sonda` para dejar constancia del rojo, y anótalo en el reporte.
2. Verde: ajusta lo que falte.

## T5 — R7: CTA primario

1. Rojo: describe `R7` (`push('/register')` una vez, `replace` nunca, `className`, `getByText('Comenzar ahora')`). Si nace verde, misma regla de sonda que T4.
2. Verde.

## T6 — R8: CTA secundario

1. Rojo: describe `R8` (`push('/login')` una vez, `replace` nunca, `className` del botón y del label `getByText('Ya tengo una cuenta')`).
2. Verde.

## T7 — R10: entrada única y Reduce Motion

1. Rojo: describe `R10` con `jest.useFakeTimers()` en `beforeEach` y `jest.useRealTimers()` en `afterEach`; mock parcial de `react-native-reanimated` que **solo** sustituye `useReducedMotion` por `mockUseReducedMotion` (deja `withTiming` real; precedente `src/components/__tests__/floating-tab-bar.test.tsx`). Cuatro `it` de R10. Sin estilo animado, `toHaveAnimatedStyle({ opacity: 0 … })` falla.
2. Verde: `WELCOME_ENTRANCE_MS`, `WELCOME_ENTRANCE_EASING`, shared values, `useAnimatedStyle`, `useEffect` de disparo (design.md §1.5).
3. Si el estado inicial resulta inestable bajo `setUpTests`, amplía la ventana de avance, nunca cambies la aserción final; documenta en el reporte.

## T8 — R1 (parte 2): tabla de usos y pantallas escaneadas

1. Rojo: en `src/__tests__/ui-copy-table.ts` añade `R16_WELCOME` (8 filas, `file: 'src/screens/welcome/index.tsx'`) a `ALL_USES` y al array `blocks`; en `src/__tests__/ui-language.test.ts` añade `describe('#118 R1: welcome resuelve su copy por clave')` → `checkUses(R16_WELCOME)`. `SCREEN_FILES` pasa a tener una entrada más y su `toHaveLength` se pone rojo.
2. Verde: `+ 1 // #118 R1` en ese `toHaveLength`. `checkUses` debe dar 8/8 con el `map` de `WELCOME_CHIPS` (`labelKey:`) y los cinco `t('welcome.…')` directos.

## T9 — R11: drift y tinta

1. Añade `describe('#118 R11: la bienvenida no mete drift de estilo')` en `src/__tests__/design-drift.test.ts` (`featureFiles` = route + pantalla; mismo barrido que `#98 R10` + `not.toMatch(/expo-linear-gradient|expo-symbols/)`).
2. Añade la fila `[join('screens', 'welcome', 'index.tsx'), 2]` a `inkSites` y `+ 2 // #118 R11` a la suma en `src/__tests__/legibility-classnames.test.ts`.
3. Comprueba sin tocar: `count(CONTINUOUS_CORNER)`, `count(bg-accent-soft)`, `directUses` de `#62 R14` siguen verdes.

## T10 — Cierre de Codex

- `bunx jest` **sin pipe** (el exit code es el gate), `bun run typecheck`, `bun run lint`.
- `git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` vacío (R12).
- `progress/impl_mobile-welcome-splash.md` con la tabla R → `it` → commit, y la lista de ficheros tocados (debe coincidir con `design.md` §1.2).

## T12 — Ronda 2: Enmienda E1–E5 (solo tests)

Producción **no cambia**: el único fichero de código que se toca es
`mobile-pet-tracker/src/screens/welcome/index.test.tsx`. Los candados nacen
verdes porque la producción ya cumple, así que cada uno lleva su sonda de
mutación documentada en `progress/impl_mobile-welcome-splash.md` (mutación
plantada, rojo obtenido, `git checkout HEAD -- <fichero>` y
`git diff --cached --quiet` después). Un commit `test(...)` por enmienda, en
este orden:

1. E5 (R5): aserción de `welcome-hero` `props.source`. Sonda: hero con
   `logo-glow.png`.
2. E4 (R6 fila 10): `props.onClick` y `props.accessible` `toBeUndefined()`.
   Sonda: chip como `Pressable` con `onPress`.
3. E1 y E2 (R10): curva contra referencia literal en 9 puntos y candado de
   cableado de las tres regex. Sondas: `duration: 400` a mano en los dos
   `withTiming`; `Easing.linear` en la constante; quitar
   `reduceMotion: ReduceMotion.Never`.
4. E3 (R10): `alignItems: 'center', gap: 16` y `{ shouldMatchAllProps: true }`
   en las cinco llamadas a `toHaveAnimatedStyle`. Sonda: clave animada extra
   `marginTop: translateY.get()`.
5. Trazabilidad: añadir los commits de la ronda 2 a las filas de R5, R6
   (fila 10) y R10 de `traceability.md`.

Cierre igual que T10 (`bunx jest` sin pipe, typecheck, lint).

## T11 — Humano (no Codex)

- R13 S1–S8 en dev build de Android; casillas en `requirements.md`.
- Reviewer: R12 por `git diff`, sondas de la tabla de `design.md` §2.
