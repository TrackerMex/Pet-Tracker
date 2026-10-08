# review: mobile-welcome-pingo (#153)
Fecha: 2026-10-08
HEAD revisado: f8132e4f (branch feature/153-mobile-welcome-pingo, worktree /home/claude/sites/Pet-Tracker-wt-153)
H0 (handoff): c03ddc09
Revisor: reviewer (Claude). Implementó: Codex CLI.

## 0. init.sh (corrido por el leader)
- `git rev-parse --short HEAD` en el worktree = `f8132e4f`; primera línea del log `HEAD=f8132e4f start=2026-10-08T17:00:32+00:00`, última `exit=0 end=2026-10-08T17:04:59+00:00`. Coinciden.
- Conteos del log (`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/19979ce5-.../scratchpad/init-153.log`):
  - backend unit: `Test Suites: 176 passed, 176 total` / `Tests: 1348 passed, 1348 total`
  - init-env (node:test): `Test Suites: 2 passed` / `Tests: 14 passed, 14 total`
  - móvil jest: `Test Suites: 96 passed, 96 total` / `Tests: 2275 passed, 2275 total` / `Snapshots: 1 passed`
  - e2e: `Test Suites: 3 skipped, 29 passed, 29 of 32 total` / `Tests: 8 skipped, 438 passed, 446 total`
  - `✅ Lint sin errores`, `✅ Typecheck sin errores`, `✅ Todo verde`. 0 líneas `FAIL`.
  - Los 5 ficheros de test tocados salen `PASS` en el log (welcome/index.test.tsx, motion.test.ts, language-provider.test.tsx, ui-language.test.ts, design-drift.test.ts).
- No corrí init.sh ni la suite entera (instrucción del leader: máquina compartida con Backend).

## 1. Diff contra H0 (lista cerrada)
`git diff --stat c03ddc09..f8132e4f` → 15 ficheros: los 14 de la lista cerrada del handoff + `progress/handoff_mobile-welcome-pingo.md` (solo lo toca 1f18d037, commit del leader). Ninguno fuera de lista.
- `git diff --name-only c03ddc09 f8132e4f -- . ':!feature_list.json' ... ':!progress/review_mobile-welcome-pingo.md' | wc -l` → `14`.
- R13: `git diff --stat c03ddc09..f8132e4f -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/app.json` → salida vacía.
- `git merge-base --is-ancestor c03ddc09 f8132e4f` → exit 0.

## 2. Historial rojo -> verde (C4)
`git show --stat` de los 28 commits c03ddc09..f8132e4f (27 de Codex + 1f18d037 del leader):

| Tarea | Rojo (solo test) | Verde (solo impl) |
|---|---|---|
| T1 R2 | a9064d8a: index.test.tsx | 6f0e54f8: docs/ui-guidelines.md |
| T2 R4 | f7943c81: motion.test.ts (posterior a 1f18d037) | 3083d34d: motion.ts |
| T3 R3 | 3f974134: index.test.tsx | be10ffef: los dos .webp |
| T4 R1 | 1a363846: language-provider.test.tsx + index.test.tsx | be5a716e: catalog.ts + specs/mobile-ui-language/design.md |
| T5 R5 | 59b13cbf: ui-copy-table.ts + ui-language.test.ts + index.test.tsx | 2e677522: index.tsx |
| T6 R6 | 78ad2489: index.test.tsx | 69780061: index.tsx |
| T7 R7 | d6cade3d: index.test.tsx | 2caff4fe: index.tsx |
| T8 R8 | ac731b91: index.test.tsx | 4a41eabc: index.tsx |
| T8b E1 | 8b8bd35e: index.test.tsx | b273cf52: docs/ui-guidelines.md |
| T9 R9 | 5545b4ae: index.test.tsx | 9c1a1450: index.tsx |
| T10 R10 | 5cacd60a: index.test.tsx | 4c2f54af: index.tsx |
| T11 R11 | 8c48d8a8: index.test.tsx | 23be4df3: index.tsx |
| T12 R12 | cd87dcb1 (candado, nace verde por diseño) | — |
| T13 R13 | 21b60da6 (candado, nace verde por diseño) | — |
| cierre | f8132e4f: impl + traceability.md | — |

Ningún rojo mezcla implementación; ningún verde toca tests. ui-copy-table.ts (C2) es fichero de test (`src/__tests__/`), correcto en el rojo de T5.

Rojos según el impl (líneas `Tests:` y `exit=1`): T1 3 failed/31; T2 4 failed/12; T3 3 failed/34; T4 3 failed/37 + language-provider 1 failed/24; T5 7 failed/43 + ui-language 2 failed/30; T6 4 failed/47; T7 2 failed/49; T8 3 failed/50; T8b 1 failed/51; T9 4 failed/55; T10 3 failed/59; T11 3 failed/63. Cada verde con exit=0. `grep -E 'TypeError|ReferenceError|SyntaxError|Cannot find module'` sobre el impl solo devuelve los eslabones `! grep -qE` de las cadenas: ningún rojo cae por excepción.

**T2 contra la cadena corregida (1f18d037).** El impl (§T2 rojo, reanudación) registra exactamente 5 `error TS`, todos de `src/theme/__tests__/motion.test.ts`: (11,3) TS2305 MOTION_ENTRANCE_SCALE, (12,3) TS2305 MOTION_FLOAT_OFFSET_Y, (13,3) TS2724 MOTION_FLOAT_TIMING, (14,3) TS2305 MOTION_BLINK_INTERVAL_MS, (15,3) TS2724 MOTION_BLINK_TIMING. 3×TS2305 + 2×TS2724 = 5. Cumple. El primer intento paró sin commit (la cadena antigua no llegó a `git commit`); el rojo commiteado f7943c81 es posterior a 1f18d037.
**T6.** Los 4 `it` rojos; el primero puede caer por aserción (lo permite el handoff).

## 3. R-ids y tests (jest por fichero)
Desde `mobile-pet-tracker/`, uno a uno, `FORCE_COLOR=0 bunx jest <fichero> > <scratchpad>/j-<n>.txt 2>&1; echo exit=$?` (sin pipe). `.expo/types/router.d.ts` ausente (`test ! -e` verdadero). Ningún jest/init.sh ajeno en marcha (`pgrep -af 'jest|init.sh'` vacío).

| Fichero | exit | Tests |
|---|---|---|
| src/screens/welcome/index.test.tsx | 0 | 65 passed, 65 total |
| src/theme/__tests__/motion.test.ts | 0 | 12 passed, 12 total |
| src/providers/__tests__/language-provider.test.tsx | 0 | 24 passed, 24 total |
| src/__tests__/ui-language.test.ts | 0 | 30 passed, 30 total |
| src/__tests__/design-drift.test.ts | 0 | 62 passed, 62 total |
| src/__tests__/consistency-classnames.test.ts | 0 | 55 passed, 55 total |
| src/__tests__/legibility-classnames.test.ts | 0 | 27 passed, 27 total |

Los cinco primeros suman 65+12+24+30+62 = 193; con los dos guards, 275, igual que el cierre del impl.

R-ids nombrados (`jest --verbose`, describes `#153`): R1, R2, R3, R5, R6, R7, R8, E1, R9, R10, R11, R12, R13 en welcome/index.test.tsx; R4 en motion.test.ts; R1 además en language-provider.test.tsx, ui-language.test.ts y ui-copy-table.ts. R14 es el smoke humano (sin test, por diseño).

Guards de design.md §Guards medidos en HEAD (desde la raíz): pantalla hex 0, clase arbitraria 0, StyleSheet/sombras 0, radios/text-accent suelto 0, deps vetadas 0, `text-accent-strong` 2, rutas a login 1, `rounded-xl bg-accent` 1, `\p{Extended_Pictographic}` 0; test colocado clase arbitraria 0 y `use-api|useApi` 0; motion.ts 0. Todos igual al esperado.

## 4. Sondas obligatorias
Cada sonda sobre el árbol en verde (HEAD f8132e4f), corriendo `src/screens/welcome/index.test.tsx` entero; restauración con `git checkout HEAD -- <ruta>` y después `git diff --stat` y `git diff --cached --stat` vacíos en todas (impreso `diff=[] cached=[]`).

| Sonda | Mutación | Resultado | Tipo de rojo |
|---|---|---|---|
| S1 | párrafo viejo de H0 + bloque nuevo debajo en `docs/ui-guidelines.md` | exit=1, 1 failed/65: `#153 E1 › deja en la lista solo las cinco constantes pendientes` | aserción: `toBe(2)` Expected 2, Received 3 (línea 547) |
| S2 | quita `` `MEALS_BAR_TIMING`, `` del bloque nuevo | exit=1, 1 failed/65: el mismo `it` | aserción: `toContain` (Expected substring «Las constantes anteriores a #152 (`MEALS_BAR_TIMING`…») |
| S3 | borra el bloque de la sección #152 y lo pone antes de `## Checklist de autocrítica` | exit=1, 1 failed/65: el mismo `it` | aserción: `toContain` (corta antes que la cuenta; `grep -c WELCOME_ENTRANCE_MS` en la carta mutada = 1, fuera de la sección) |
| R12-1 | `cancelAnimation,` en el import de `react-native-reanimated` | exit=1, 1 failed/65: `#153 R12 › no cancela a mano ni devuelve limpieza` | aserción: Expected 0, Received 1 |
| R12-2 | `return () => {};` al final del efecto de montaje | exit=1, 1 failed/65: el mismo `it` | aserción: Expected 0, Received 1 |
| R13 | `"lottie-react-native": "0.0.0"` en `dependencies` de package.json | exit=1, 1 failed/65: `#153 R13 › no declara Lottie, Rive ni expo-linear-gradient` | aserción: `toEqual([])` |

Las seis sondas obligatorias salen rojas por aserción, cada una solo en su `it`.

## 5. Mutaciones propias (zona ciega)
Mismo protocolo que §4 (helper de scratchpad `probe.sh`: muta, corre jest sin pipe, lista `●`, restaura con `git checkout HEAD -- <ruta>`, imprime `diff=[] cached=[]`). Las de motion.ts corren `motion.test.ts` + `welcome/index.test.tsx` (77 tests); las del catálogo corren welcome + ui-language + language-provider (119 tests); el resto, welcome (65). El `● Console` que aparece al correr varios ficheros es el `console.info` de HeroUI, no un fallo.

| Id | Mutación | Rojo (its) | Tipo |
|---|---|---|---|
| M1 | `MOTION_ENTRANCE_SCALE` 0.9 a 0.85 | R4 escala/flotación; R9 arranca al 90 % | aserción (0.9 vs 0.85; toEqual) |
| M2 | `MOTION_FLOAT_OFFSET_Y` 4 a 6 | R4; R10 sube 4 puntos | aserción |
| M3 | `MOTION_FLOAT_TIMING.duration` 1200 a 900 | R4 medio ciclo | aserción (toEqual). R10 a 2000 ms sigue en -4: lo cierra el literal de R4 |
| M4 | bezier de la flotación a (0.25, 0.1, 0.25, 1) | R4 medio ciclo | aserción |
| M5 | `MOTION_BLINK_INTERVAL_MS` 4000 a 3000 | R4 intervalo; R11 cierra los ojos a los 4 s | aserción |
| M6 | `MOTION_BLINK_TIMING.duration` 0 a 100 | R4 intervalo; R11 cierra los ojos | aserción |
| M7 | `MOTION_FLOAT_TIMING.reduceMotion` System a Never | R4 medio ciclo | aserción |
| M8 | `MOTION_BLINK_TIMING.reduceMotion` System a Never | R4 intervalo (motion.test sola, 1/12) | aserción |
| W1 | parpadeo: `withDelay(MOTION_FEEDBACK_MS * 3, …)` | R11 cierra los ojos (4300 ms sigue en 1); R11 regex | aserción |
| W2 | invierte el orden de los dos `withDelay` del `withSequence` | R11 cierra los ojos; R6 capa cerrada | aserción |
| W3 | quita `withRepeat` del parpadeo | R11 repite sin fin | aserción |
| W4 | parpadeo `withRepeat(…, -1, true)` | R10 vaivén; R11 sin fin | aserción |
| W5 | flotación `withTiming(MOTION_FLOAT_OFFSET_Y, …)` (baja) | R10 sube 4; R10 regex | aserción |
| W6 | flotación `-1, false` | R10 vaivén; R10 regex | aserción |
| W7 | saca la flotación del `if (!reduceMotion)` | R9, R10 y R11 con reduce motion | aserción (`not.toHaveBeenCalled`, toEqual) |
| W8 | `useSharedValue(MOTION_ENTRANCE_SCALE)` sin rama de reduce motion | R9 reduce motion; R9 regex; R10 reduce motion | aserción |
| **W9** | saca `pingoScale.set(withSpring(1, …))` del `if` | **ninguno: 65/65 verde** | mutante equivalente: con reduce motion la escala nace en 1 y el muelle va de 1 a 1 (y `MOTION_SETTLE_SPRING` lleva `ReduceMotion.System`). No hay comportamiento observable que perder. Observación O1, no hallazgo |
| W10 | escala con `withTiming(1, MOTION_FADE_TIMING)` | R9 regex | aserción |
| W11 | orden del transform `[scale, translateY]` | R9 ×3, R10 ×2 | aserción |
| W12 | parpadeo invertido `opacity: 1 - pingoBlink.get()` | R6 capa cerrada; R11 ×2 | aserción |
| W13 | quita `border-b-4 border-black/25` del primario | R7 labio; #118 R7 primario | aserción |
| W14 | labio también en el secundario | R7 secundario sin labio; #118 R8 | aserción |
| W15 | `border-b-2` en vez de `border-b-4` | R7; #118 R7 | aserción |
| W16 | `border-black/40` en vez de `/25` | R7; #118 R7 | aserción |
| R8a | `opacity.set(withTiming(1, …))` dentro del `if` | R8 reduce motion | aserción (`toHaveAnimatedStyle` con shouldMatchAllProps) |
| R8b | `useSharedValue(MOTION_ENTRANCE_OFFSET_Y)` sin rama | R8 reduce motion; R8 regex | aserción |
| R8c | fundido con `withSpring(1, MOTION_SETTLE_SPRING)` | R8 regex | aserción |
| R5a | bocadillo `variant="secondary"` | R5 bocadillo | aserción |
| R5c | escena `variant="surface"` | R5 escena | aserción |
| R5b | escena sin `py-6` | R5 escena | aserción |
| R5d | texto del bocadillo `text-base` | R5 bocadillo | aserción |
| R2a | borra `- **Sin emoji**, en ningún idioma.` de la carta | R2 fija las reglas | aserción |
| R2b | «guardián sereno» a «guardián alegre» en el título del punto 7 | R2 punto 7 tras el 6 | aserción (indexOf -1) |
| A1 | `accessibilityLabel="Pingo"` en `welcome-pingo-wave` | R6 it.each fila wave | aserción (`toBeUndefined`) |
| C1 | es: `¡Hola, soy Pingo! …` | R1 literal; R1 sin exclamación; R1 bocadillo es | aserción ×2 + consulta ×1 (getByText) |
| C2 | es: «Le ayudo» (usted) | R1 literal; R1 bocadillo es | aserción + consulta |
| C3 | en: `…how they're doing!` | R1 literal; R1 sin exclamación; R1 bocadillo en | aserción ×2 + consulta ×1 |
| C4 | intercambia los dos valores de `welcome.pingoGreeting` | R1 literal; R1 bocadillo es y en | aserción + consulta ×2 |
| C5 | bocadillo con `t('welcome.tagline')` | #118 R1 9 ocurrencias; #65 R18 tabla; R1 bocadillo ×2; #118 R9 ×2 | aserción ×2 (toEqual de catálogo/tabla) + consulta ×4 |
| P1 | intercambia los dos `require` de las poses | R6 it.each ×2 (testUri) | aserción |
| P2 | `splash-icon.png` copiado sobre `pingo-wave.webp` | R3 fila wave | aserción (`RIFF` vs `\x89PNG`) |
| **P3** | intercambia el **contenido** de los dos WebP | **ninguno: 65/65 verde** | zona ciega del test: R3 mira cabecera, alfa, 1024×1024 y peso, no la identidad de la pose. Observación O2 |
| **P4** | `pingo-wave.webp` copiado sobre `pingo-wave-blink.webp` | **ninguno: 65/65 verde** | misma zona ciega (O2) |

Todas las mutaciones vivas salvo W9 (equivalente) y P3/P4 (identidad de los bytes). Ningún rojo cae solo por consulta: donde hay `Unable to find` (C1-C5), el mismo mutante ya tiene rojo por aserción en otro `it`.

**Identidad de las poses (O2), comprobada a mano.** `sha256sum`:
- `mobile-pet-tracker/assets/images/pingo-wave.webp` = `66cd45cb…f306` = `/home/claude/pet-tracker-mascot/webp/pingo-wave.webp`;
- `pingo-wave-blink.webp` = `a6a44b70…8549` = `/home/claude/pet-tracker-mascot/webp/pingo-wave-blink.webp`.
Los de `webp/` son la conversión previa al handoff (mtime 2026-10-08 15:39, anterior al verde be10ffef de las 16:36), y los tamaños, 56 062 y 55 608, coinciden con la tabla de design.md §Assets. Abrí `pingo-wave-blink.webp`: ojos cerrados en arco. La regresión P3/P4 la caza el paso de R14 «cada unos 4 s cierra los ojos un instante».

## 6. Lecciones previas
- **toHaveAnimatedStyle solo mira las claves esperadas:** 4 usos en welcome/index.test.tsx, los 4 con `shouldMatchAllProps: true`. R8a (opacidad colada dentro del `if`) sale roja por esa aserción.
- **renderRouter sin await:** 0 usos de `renderRouter`; todo `renderWelcome(...)` va con `await`.
- **Doble de Reanimated sin __esModule:** el doble del test lleva `__esModule: true`.
- **Candados tautológicos:** los `it` de R4 en motion.test.ts aseveran literales (0.9, 4, 1200, bezier, 4000, 0, `ReduceMotion.System`), no símbolos importados de producción. M1-M8 los matan.
- **Cláusulas universales, un candado por rama:** «sin exclamación» rojo en es (C1) y en en (C3); R9, R10 y R11 tienen cada uno su `it` de reduce motion (W7, W8); R12 cubre las dos formas (R12-1 import de `cancelAnimation`, R12-2 `return () => {};`); R13 cubre los cuatro nombres en las dos secciones de dependencias. Sondas extra: R13b `rive-react-native` en `devDependencies`, R13c `@rive-app/react-native`, R13d `expo-linear-gradient`: las tres rojas por `toEqual([])` en el `it` de R13, restauradas con `diff=[] cached=[]`.
- **Guards de carta en tests (design-drift):** los guards de design-drift sobre el test colocado dan 0; design-drift 62/62.
- **Candado de catálogo y de inventario:** language-provider sube la longitud del catálogo en +1 (24/24); ui-copy-table.ts añade `R16_WELCOME`; ui-language.test.ts 30/30; #118 R1 (9 ocurrencias) y #65 R18 (tabla) los muerde C5.
- **Rojo por consulta en sondas:** tabla de §5, columna Tipo. Ninguna mutación queda roja solo por consulta.
- **Tipos de expo-router obsoletos:** `test ! -e mobile-pet-tracker/.expo/types/router.d.ts` verdadero.
- **Exit code tras un pipe:** jest siempre redirigido a fichero, `echo exit=$?` sin pipe.

## 7. Carta UI (C8)
Con `docs/ui-guidelines.md` en HEAD y las skills `expo:expo-overview` y `expo:expo-animation` cargadas:
- Tokens y clases: hex 0, clase arbitraria 0, StyleSheet/sombras 0, `text-accent` suelto 0 (§3). Colores solo por clases de tema y `variant` de `Card`.
- Safe areas: `paddingTop: insets.top + 12`, `paddingBottom: insets.bottom + 24` con `useSafeAreaInsets` (index.tsx:78).
- Reutilización: escena y bocadillo son `Card` (`variant="secondary"` y `variant="surface"`, index.tsx:82-83); CTAs son el `Button` de HeroUI, con su feedback de pulsación.
- Movimiento: solo `transform` (translateY, scale; translate antes que scale, W11) y `opacity`, en el hilo de UI con shared values y `.get()/.set()`; nunca `scale(0)` (arranca en 0.9); muelle para la entrada, ease-in-out (`Easing.bezier(0.37, 0, 0.63, 1)`) para la flotación; sin háptica en la entrada; sin `cancelAnimation` ni limpieza a mano (R12).
- Reduce motion: `useReducedMotion()` + `ReduceMotion.System` en las constantes; con reduce motion se queda el fundido de opacidad y caen translate, escala, flotación y parpadeo (W7, W8, R8a). La flotación en bucle es la excepción declarada en el punto 7 de la carta (R2).
- Dependencias: ninguna nueva (R13; package.json, bun.lock y app.json sin cambios contra H0).
- Accesibilidad: las dos poses son decorativas sin `accessibilityLabel` (A1 lo caza); el significado lo lleva el texto del bocadillo.
- Voz: tutea, primera persona, sin emoji, sin exclamación, termina en punto; inglés neutro.
- Skeleton de carga: N/A (pantalla sin datos remotos).

## 8. Trazabilidad (C5)
- `specs/mobile-welcome-pingo/traceability.md`: 26 hashes citados, todos ancestros de f8132e4f (`git merge-base --is-ancestor` exit 0) y con el mensaje que cita la fila.
- Única fila `pendiente`: R14 (smoke humano en dev build de Android, casilla «Smoke R14» de requirements.md §Aprobación, sin marcar). Esperado según el handoff: lo cierra el humano, no un test. La línea 27 de traceability.md («el reviewer no aprueba si alguna fila queda "pendiente"») se aplica a las filas con test; R14 no tiene test por diseño. La feature no puede pasar a `done` hasta que el humano firme R14.
- Frontmatter de traceability.md `status: draft`, igual que #152 en origin/main.
- Commits: `test(mobile-welcome): #153 R<n> red …` / `feat(mobile-welcome): #153 R<n> …`, con el R-id en el asunto. Siguen tasks.md y el handoff, no la forma `(R1, R2)` de conventions (O3).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: #153 in_progress, #152 done, #154 pending)
- [x] progress/current.md actualizado (describe #153 en implementación con Codex)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (N/A en esencia: cambio solo de presentación móvil)
- [x] repositories/contratos en domain son interfaces puras (sin cambios)
- [x] application depende de interfaces, no implementaciones (sin cambios)
- [x] infrastructure sin lógica de negocio (sin cambios; la pantalla no llama a la API, `use-api|useApi` 0)

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra (R1-R13 y E1; R14 smoke humano)
- [x] Historial de commits muestra test-primero, no todo junto (§2: rojo solo test, verde solo impl, rojos por aserción)

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" salvo R14, que firma el humano (esperado)
- [x] Commits llevan scope y R-id (formato de tasks.md; ver O3)

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved`; casillas de aprobación (2026-10-07), voz y copy (2026-10-07) y E1 (2026-10-08) marcadas; firmas 10f7e808 y 291049ae ancestros de f8132e4f; sin cambios en requirements/design/tasks después de 291049ae

## Checklist C7 — Sin código huérfano
- [x] Componentes/módulos reemplazados eliminados: `WELCOME_ENTRANCE_MS`, `WELCOME_ENTRANCE_EASING` y la imagen `welcome-hero` ya no están en index.tsx; la carta retira `WELCOME_ENTRANCE_MS` de la migración pendiente (E1)
- [x] Sus tests también eliminados (solo quedan referencias negativas en el test)
- [x] `splash-icon.png` se queda: lo usa `src/app/index.tsx`, como permite R3

## Checklist C8 — Carta UI
- [x] Tokens, safe areas, reutilización de Card/Button, movimiento en transform/opacity, reduce motion, accesibilidad y voz conforme a §7
- [x] Skeleton de carga: N/A

## Observaciones / Hallazgos
Sin hallazgos bloqueantes.
- **O1.** W9 es un mutante equivalente: con reduce motion la escala nace en 1 y el muelle va de 1 a 1. Nada que candar.
- **O2.** R3 no distingue el contenido de los dos WebP (P3 y P4 verdes). La identidad la comprobé por sha256 contra `/home/claude/pet-tracker-mascot/webp/` y la cubre el paso de R14 «cada unos 4 s cierra los ojos un instante». Si se quiere un candado, un hash por fichero en R3.
- **O3.** Los commits usan `#153 R<n>` en el asunto y no `(R1, R2)` como pide C5 de conventions. Es lo que prescribían tasks.md y el handoff; no es defecto de Codex.
- **O4.** La fila R3 de traceability.md no nombra el tercer `it` («no mete otras poses»). El test existe y pasa.
- **O5.** El log de init.sh trae «A worker process has failed to exit gracefully». Preexistente: aparece también en los logs de init de #152, #133, #81 y wt18. No bloquea.
- **O6.** R14 queda pendiente del smoke humano en dev build de Android. La feature no pasa a `done` sin esa firma.

Veredicto: APROBADO
