---
feature: "mobile-home-motion-foundations"
status: draft        # draft | approved
tags: [mobile, ui, motion, spec]
---

# Tareas — [[mobile-home-motion-foundations]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Un commit rojo antes de cada verde** (C4 de `CHECKPOINTS.md`). El orden de
> abajo es el orden de los commits y está pensado para que **ningún `it` nazca
> verde**:
>
> - Donde el sujeto es un fichero nuevo, el commit rojo crea ese fichero con
>   solo `export {};`. Así cada `it` falla por su cuenta, y no la suite entera
>   con `Cannot find module` y `Tests: 0 total`.
> - Donde el `it` asevera una **ausencia** que el árbol ya cumple antes de la
>   implementación (R2.3, R7.3, R8.5, R8.6) o una propiedad de ficheros ya
>   limpios (R9), su rojo es una **mutación de producción versionada en el
>   commit rojo** y revertida en el verde. Nunca se muta un doble de test.
> - R6 es un requisito de verificación, vía **(a)** de C4: sus tests se
>   escriben antes de la implementación que verifican (R5 y R7) y su verde
>   llega con el verde de R7.
>
> Ningún commit rojo puede fallar por un `ReferenceError` de un helper de test:
> todo helper nuevo va en el mismo commit que lo usa y se define antes.
>
> Todos los comandos se ejecutan desde `mobile-pet-tracker/` y **sin pipe**,
> con `; echo "exit=$?"` detrás (un pipe devuelve el código de `tail`). Ningún
> fichero de test de esta spec tiene `(tabs)` en la ruta. Si alguno lo
> tuviera, se escribiría `\(tabs\)`.
>
> Las esperas siguen `docs/conventions.md` §Tests › «Esperas sobre el árbol
> renderizado». Se espera a un texto o nodo visible (`findByTestId`, `waitFor`
> sobre `getByText`), nunca a un contador de mock.

## Arranque

Sin commit. Todo lo que no coincida **para** el trabajo y se anota en
`progress/impl_mobile-home-motion-foundations.md` con la cifra real.

1. `git rev-parse --abbrev-ref HEAD` → `feature/152-mobile-home-motion-foundations`.
2. `test -d node_modules && echo presente`. Si no sale `presente`, ejecuta
   `bun install --frozen-lockfile`. Usa `bun`/`bunx`, nunca `npm` ni `npx`.
   Esta spec no añade dependencias: `git diff --stat <HEAD del handoff> -- package.json bun.lock`
   debe quedar vacío al terminar.
3. `test ! -e .expo/types/router.d.ts && echo ausente` → `ausente`. Si existe,
   **para** y avisa. No lo borres: lo quita el humano.
4. Ejecuta las premisas P1-P10 de `requirements.md` §Premisas verificadas, una
   a una, y compara cada salida con la columna «Esperado». Si una falla,
   **para**.
5. Mide la base **sin pipe** y apunta en el reporte `Test Suites`, `Tests` y
   `exit`:

   ```bash
   bunx jest src/screens/home/index.test.tsx src/__tests__/design-drift.test.ts src/theme/__tests__/global-css.test.ts; echo "exit=$?"
   ```

   Esperado: todo verde y `exit=0`. Las cifras no se fijan aquí porque otras
   features las mueven: se miden ahora y sirven de referencia para el cierre.

## Skills para Codex

Nombres del catálogo de Codex (`.claude/agents/leader.md` §Catálogo real de
skills de Codex), no los nuestros:

- `building-native-ui`, del plugin `expo` de Codex, como sustituto de la
  guía general de UI.
- De `.agents/skills/` del repo: `animate-expo`, `animation-vocabulary`,
  `review-animations` y `emil-design-eng`.

El plugin `expo` de Codex no trae ninguna skill de animación. Por eso las
decisiones de movimiento (muelle o curva, duraciones, reduce motion, qué se
anima) **ya están cerradas en la spec** y mandan sobre cualquier skill. En
concreto, quedan descartadas las sugerencias de usar las animaciones
predefinidas de Reanimated (`FadeInDown`, `FadeIn`…) en vez de `homeEntering`
(ver `design.md` §Alternativas descartadas), de animar `height` o de meter
hex, `StyleSheet.create` o clases arbitrarias. La carta
`docs/ui-guidelines.md` gana siempre sobre la skill.

Di en el reporte qué skills cargaste.

## Tareas por requisito

### R1 — Las duraciones y el preset de movimiento viven en un solo sitio

- [ ] (1) **Test rojo.** Crea `src/theme/__tests__/motion.test.ts` con el
  describe `#152 R1` y sus seis `it`, y `src/theme/motion.ts` con solo
  `export {};`.
  - `bunx jest src/theme/__tests__/motion.test.ts; echo "exit=$?"` → 6 fallos
    de 6, **por aserción**. Los cinco primeros reciben `undefined`, y
    `no exporta nada más` recibe `[]`.
  - Commit: `test(mobile-home): #152 R1 red, motion constants`.
- [ ] (2) **Implementación mínima.** Escribe en `motion.ts` las ocho
  constantes de R1, con los valores literales de la tabla.
  - Mismo comando → 6 de 6 en verde.
  - Ancla: `grep -cF 'export const MOTION_' src/theme/motion.ts` → `8`.
  - Commit: `feat(mobile-home): #152 R1 motion constants in theme/motion.ts`.
- [ ] (3) **Refactor.** Ninguno previsto. Las constantes de movimiento
  anteriores no se migran (§Fuera de alcance).

### R2 — La carta apunta a `motion.ts` (enmienda A21)

- [ ] (1) **Test rojo.** Añade a `motion.test.ts` el describe `#152 R2` con
  sus tres `it`. Para que `global.css no declara tokens de movimiento` tenga
  rojo, el mismo commit añade al final de `src/theme/global.css` la línea
  `/* --motion */` (mutación versionada).
  - `bunx jest src/theme/__tests__/motion.test.ts; echo "exit=$?"` → 3 fallos
    de 9, los tres de R2 y **por aserción**. R1 sigue en verde.
  - Si cae algún otro test con la mutación de `global.css`, anota su nombre en
    el reporte. No lo arregles.
  - Commit: `test(mobile-home): #152 R2 red, charter points to motion.ts`.
- [ ] (2) **Implementación mínima.**
  - En `docs/ui-guidelines.md` sustituye la frase de §Animación y añade al
    final la sección `## Enmienda #152 — el movimiento vive en src/theme/motion.ts`
    con el contenido y la casilla **sin marcar** de R2.
  - Quita la línea `/* --motion */` de `global.css`.
  - Mismo comando → 9 de 9.
  - Anclas, desde `mobile-pet-tracker/`:
    - ``grep -cF '`src/theme/motion.ts` (enmienda A21 de #152)' ../docs/ui-guidelines.md`` → `1`
    - `grep -cF 'promueven a tokens' ../docs/ui-guidelines.md` → `0`
    - `grep -cF -- '--motion' src/theme/global.css` → `0`
    - `git diff --stat <HEAD del handoff> -- src/theme/global.css` → vacío
  - Commit: `docs(mobile-home): #152 R2 charter amendment A21 for motion.ts`.
- [ ] (3) **Refactor.** Ninguno. La casilla de la enmienda la marca el humano.

### R3 — La receta de entrada de la Home

- [ ] (1) **Test rojo.** Crea `src/screens/home/home-entrance.test.tsx` con el
  describe `#152 R3`, sus dos `it` y los dobles de las cuatro funciones de
  `react-native-reanimated` que fija R3. Crea también
  `src/screens/home/home-entrance.tsx` con solo `export {};`.
  - `bunx jest src/screens/home/home-entrance.test.tsx; echo "exit=$?"` → 2
    fallos de 2, **por excepción**: `homeEntering is not a function`. Es el
    sujeto de producción que falta, no un helper de test. Se declara aquí.
  - Commit: `test(mobile-home): #152 R3 red, home entrance recipe`.
- [ ] (2) **Implementación mínima.** `homeEntering(delayMs, offsetY)` en
  `home-entrance.tsx`, exactamente como R3: la función devuelta empieza por
  `'worklet'` y no se llama a ninguna función de animación al crearla.
  - Mismo comando → 2 de 2.
  - Ancla: `grep -cF "'worklet'" src/screens/home/home-entrance.tsx` → `1`.
  - Commit: `feat(mobile-home): #152 R3 homeEntering worklet`.
- [ ] (3) **Refactor.** Ninguno previsto.

### R4 — `HomeEntrance` escalona por índice y respeta reduce motion

- [ ] (1) **Test rojo.** Añade a `home-entrance.test.tsx` el describe
  `#152 R4` con sus cuatro `it`.
  - Mismo comando → 4 fallos de 6, **por excepción** al renderizar un
    componente `undefined` (`Element type is invalid`). R3 sigue en verde.
  - Commit: `test(mobile-home): #152 R4 red, staggered HomeEntrance`.
- [ ] (2) **Implementación mínima.** `HomeEntrance({ index, testID, children })`
  en el mismo fichero: un `Animated.View` sin `style` ni `className` con el
  `entering` de R4 según `useReducedMotion()`.
  - Mismo comando → 6 de 6.
  - Commit: `feat(mobile-home): #152 R4 HomeEntrance wrapper`.
- [ ] (3) **Refactor.** Ninguno previsto.

### R5 — La Home envuelve cada bloque en su entrada escalonada

- [ ] (1) **Test rojo.** En `src/screens/home/index.test.tsx`:
  - añade el describe `#152 R5` con sus siete `it`;
  - mueve los cuatro tests de orden de la tabla «Candados que esta R mueve»:
    cada `testID` de bloque pasa al de su envoltorio, en el filtro y en el
    array esperado. Nada más cambia en ellos.

  Comandos:
  - `bunx jest src/screens/home/index.test.tsx -t '#152 R5'; echo "exit=$?"` →
    7 fallos:
    - `pinta los seis envoltorios como hijos directos y en orden` falla **por
      aserción**;
    - los otros seis fallan **por consulta** (`Unable to find an element with
      testID: home-entrance-…`). En los tres de ausencia, lo que no encuentra es
      su ancla positiva.
  - `bunx jest src/screens/home/index.test.tsx -t 'queda entre el resumen y la última posición|coloca la tira sobre la tarjeta del collar|coloca la rejilla entre el collar y la actividad semanal|coloca la sección entre la actividad semanal y la última posición'; echo "exit=$?"` →
    4 fallos **por aserción**, porque el filtro devuelve `[]`.

  Commit: `test(mobile-home): #152 R5 red, staggered Home blocks`.
- [ ] (2) **Implementación mínima.** Ve a R6 (1) antes de este paso.
- [ ] (3) **Refactor.** Ninguno previsto.

### R6 — La entrada se reproduce una vez por montaje (verificación, vía a)

- [ ] (1) **Test rojo.** Añade a `index.test.tsx` el describe `#152 R6` con sus
  dos `it`.
  - `bunx jest src/screens/home/index.test.tsx -t '#152 R6'; echo "exit=$?"` →
    2 fallos **por consulta** (`home-entrance-summary`).
  - Commit: `test(mobile-home): #152 R6 red, entrance plays once per mount`.
- [ ] **R5 (2) — implementación mínima.** En `src/screens/home/index.tsx`,
  importa `HomeEntrance` y envuelve cada bloque de la tabla de R5 con su
  `testID` e `index`, como hijo directo de `home-content` y solo cuando el
  bloque se pinta. `pet-hero-error` y `weekly-activity-day-map` no se tocan.
  Comandos:
  - `bunx jest src/screens/home/index.test.tsx -t '#152 R5'; echo "exit=$?"` → 7 de 7.
  - El comando de los cuatro tests de orden → 4 de 4.
  - `-t '#152 R6'` → **sigue en 2 fallos**, ahora por consulta en
    `summary-reveal`, que crea R7. Es lo esperado: no lo arregles aquí.

  Ancla: `grep -cF '<HomeEntrance' src/screens/home/index.tsx` → `6`.

  Commit: `feat(mobile-home): #152 R5 wrap Home blocks in HomeEntrance`.
- [ ] (2) **Implementación mínima de R6.** Ninguna propia. R6 pasa a verde con
  el verde de R7 (A).
- [ ] (3) **Refactor.** Ninguno. No se añade ningún `key` a los envoltorios.

### R7 — Las cifras del resumen aparecen con un fundido

- [ ] (1) **Test rojo (A).** Añade a `index.test.tsx` el describe `#152 R7` con
  sus dos primeros `it`: `envuelve la fila del resumen sin tocarla` y
  `funde sin espera ni desplazamiento`.
  - `-t '#152 R7'` → 2 fallos **por consulta** (`summary-reveal`).
  - Commit: `test(mobile-home): #152 R7 red, summary reveal fade`.
- [ ] (2) **Implementación mínima (A).** En `index.tsx`, envuelve **solo** la
  `View` con `className="flex-row"` del resumen en
  `<Animated.View testID="summary-reveal" entering={homeEntering(0, 0)}>`,
  sin `style` ni `className`. El `Skeleton` de `summary-skeleton` no se toca.
  - `bunx jest src/screens/home/index.test.tsx -t '#152 R(6|7)'; echo "exit=$?"` →
    4 de 4. R6 queda en verde aquí.
  - Anclas:
    - `grep -cF 'testID="summary-reveal"' src/screens/home/index.tsx` → `1`
    - `grep -cF 'homeEntering(0, 0)' src/screens/home/index.tsx` → `1`
  - Commit: `feat(mobile-home): #152 R7 fade in the summary row`.
- [ ] (1) **Test rojo (B), rama de ausencia.** Añade el tercer `it`,
  `no monta el fundido mientras el skeleton ocupa su sitio`. Con el árbol
  correcto nacería verde, así que el mismo commit envuelve también el
  `Skeleton` de `summary-skeleton` en un segundo
  `<Animated.View testID="summary-reveal" entering={homeEntering(0, 0)}>`
  (mutación versionada).
  - `-t '#152 R7'` → 1 fallo de 3, **por aserción**: se esperaba `null` en
    `summary-reveal`.
  - Commit: `test(mobile-home): #152 R7 red, no fade over the skeleton`.
- [ ] (2) **Implementación mínima (B).** Revierte la mutación.
  - `-t '#152 R7'` → 3 de 3.
  - Ancla: `grep -cF 'testID="summary-reveal"' src/screens/home/index.tsx` → `1`.
  - Commit: `feat(mobile-home): #152 R7 keep the skeleton without fade`.
- [ ] (3) **Refactor.** Ninguno previsto.

### R8 — La batería del collar se dibuja como barra

- [ ] (1) **Test rojo (A).** Añade a `index.test.tsx` el describe `#152 R8`
  con los `it` 1 (`it.each`, cuatro filas), 2, 3, 4 y 7.
  - `-t '#152 R8'` → 8 fallos, **por consulta** (`collar-battery-track` o
    `collar-battery-fill`).
  - Commit: `test(mobile-home): #152 R8 red, collar battery bar`.
- [ ] (2) **Implementación mínima (A).**
  - Crea `src/screens/home/collar-battery-bar.tsx` con
    `CollarBatteryBar({ pct })` como fija R8: pista, relleno, clases
    literales, valor compartido y efecto con `MOTION_FILL_TIMING`, o
    asignación directa bajo reduce motion.
  - En `index.tsx`, dentro de la fila de `collar-battery` y detrás de ese
    `Text`, pinta
    `{detail.data.pet.device.batteryPct !== null ? <CollarBatteryBar pct={detail.data.pet.device.batteryPct} /> : null}`.

  Comandos:
  - `-t '#152 R8'` → 8 de 8.
  - `bunx jest src/screens/home/index.test.tsx -t '#106'; echo "exit=$?"` →
    todo verde. Incluye `#106 R3`, cuyo `expect(mockWithTiming).not.toHaveBeenCalled()`
    exige que la barra no llame a `withTiming` bajo reduce motion.

  Ancla: `grep -cF '<CollarBatteryBar' src/screens/home/index.tsx` → `1`.

  Commit: `feat(mobile-home): #152 R8 collar battery bar`.
- [ ] (1) **Test rojo (B), ramas de ausencia.** Añade los `it` 5
  (`no pinta la barra sin porcentaje`) y 6 (`no pinta la barra sin collar`).
  Con el árbol correcto nacerían verdes. El mismo commit versiona dos
  mutaciones en `index.tsx`:
  - (a) el condicional de la barra pasa a
    `<CollarBatteryBar pct={detail.data.pet.device.batteryPct ?? 0} />` sin
    condición;
  - (b) en la rama sin collar, junto al `Text` de `home.noCollar`, se pinta
    también `<CollarBatteryBar pct={0} />` (envuelve los dos en un fragmento).

  Comandos y ancla:
  - `-t '#152 R8'` → 2 fallos de 10, **por aserción**: se esperaba `null` en
    `collar-battery-track`. El 5 cae por (a) y el 6 por (b).
  - Si cae algún otro test del fichero con estas mutaciones, anota su nombre
    en el reporte. No lo arregles.
  - Ancla: `grep -cF '<CollarBatteryBar' src/screens/home/index.tsx` → `2`.

  Commit: `test(mobile-home): #152 R8 red, no bar without percentage or collar`.
- [ ] (2) **Implementación mínima (B).** Revierte las dos mutaciones.
  - `-t '#152 R8'` → 10 de 10.
  - Ancla: `grep -cF '<CollarBatteryBar' src/screens/home/index.tsx` → `1`.
  - Commit: `feat(mobile-home): #152 R8 bar only with a numeric percentage`.
- [ ] (3) **Refactor.** Ninguno previsto. `MEALS_BAR_TIMING` no se toca:
  migrar las constantes anteriores es deuda fuera de alcance.

### R9 — El movimiento de la Home no mete drift de estilo

- [ ] (1) **Test rojo.** En `src/__tests__/design-drift.test.ts`, añade el
  describe `#152 R9` con su `it`, con la forma de
  `#98 R10: la barra de comidas no mete drift de estilo`. Lista los cuatro
  ficheros (`theme/motion.ts`, `screens/home/home-entrance.tsx`,
  `screens/home/collar-battery-bar.tsx` y `screens/home/index.tsx`) y reutiliza
  `MEALS_BAR_STYLE_ESCAPES`, sin declarar ningún patrón.

  Los cuatro ficheros ya están limpios, así que el test nacería verde. El
  mismo commit añade como primera línea de `collar-battery-bar.tsx` el
  comentario `// #152 barra de batería del collar` (mutación versionada).
  `HEX_LITERAL` lo lee como un color hex, porque le falta ` R<n>`.
  - `bunx jest src/__tests__/design-drift.test.ts -t '#152 R9'; echo "exit=$?"` →
    1 fallo **por aserción**: `Received: ["screens/home/collar-battery-bar.tsx"]`.
  - Commit: `test(mobile-home): #152 R9 red, no style drift in Home motion`.
- [ ] (2) **Implementación mínima.** El comentario pasa a
  `// #152 R8: barra de batería del collar`.
  - Mismo comando → verde.
  - Ancla: `grep -cF "describe('#152 R9" src/__tests__/design-drift.test.ts` → `1`.
  - Commit: `fix(mobile-home): #152 R9 cite the feature with its R-id`.
- [ ] (3) **Refactor.** Ninguno.

### R10 — Smoke del humano en dev build de Android

- [ ] (1) **Test rojo.** No aplica: lo verifica el humano con §Gate humano de
  `requirements.md`, en un **dev build de Android** (nunca Expo Go).
- [ ] (2) **Implementación mínima.** No aplica.
- [ ] (3) **Refactor.** No aplica. Ni Codex ni el reviewer marcan su casilla.

## Cierre (Codex)

Sin pipe, cada comando con `; echo "exit=$?"` y el resultado copiado en el
reporte.

1. `bunx jest; echo "exit=$?"` → `exit=0`. Compara `Tests` con la base del
   Arranque: la diferencia son los `it` nuevos de esta spec.
2. `bun run typecheck; echo "exit=$?"` → `exit=0`.
3. `bun run lint; echo "exit=$?"` → `exit=0`.
4. Anclas finales:
   - `grep -rlF 'entering=' src --include='*.tsx'` → exactamente
     `src/screens/home/home-entrance.tsx` y `src/screens/home/index.tsx`;
   - `git diff --stat <HEAD del handoff> -- src/i18n src/theme/global.css package.json bun.lock`
     → vacío. Esta spec no añade copy, tokens ni dependencias.
5. Rellena `specs/mobile-home-motion-foundations/traceability.md` (test y
   hashes de rojo y verde de cada R; R10 se queda `pendiente (humano)`) en
   **un único commit final**:
   `docs(mobile-home-motion-foundations): #152 traceability`.
6. Escribe `progress/impl_mobile-home-motion-foundations.md` con:
   - la base medida y las cifras finales;
   - las skills cargadas;
   - todo test que cayera de más con una mutación versionada.

## Sondas de mutación para el reviewer

Se plantan una a una en producción y se revierten con
`git checkout HEAD -- <fichero>`, comprobando después que `git diff --cached --stat`
queda vacío.

| Id | Mutación | `it` que debe caer | Rojo |
|---|---|---|---|
| M1 | `MOTION_STAGGER_MS = 60` → `50` en `motion.ts` | `declara el escalonado y el desplazamiento de la entrada`, y `escalona las entradas cada 60 ms en el orden de los bloques` | aserción |
| M2 | `ReduceMotion.Never` → `ReduceMotion.System` en el `withDelay` de la opacidad de `homeEntering` | `parte invisible y desplazada y llega opaca y en su sitio` | aserción |
| M3 | `HomeEntrance` ignora reduce motion (siempre `MOTION_ENTRANCE_OFFSET_Y`) | `bajo reduce motion conserva el fundido y el escalonado y no desplaza` | aserción |
| M4 | `index={2}` ↔ `index={3}` entre `home-entrance-quick-actions` y `home-entrance-weekly` | `escalona las entradas cada 60 ms en el orden de los bloques` | aserción |
| M5 | `key={String(detail.dataUpdatedAt)}` en `home-entrance-summary` | `no repite la entrada al volver al foco` | aserción |
| M6 | `key={selectedPetId ?? ''}` en `home-entrance-quick-actions` | `al cambiar de mascota solo repiten los bloques que se vuelven a montar` | aserción |
| M7 | `homeEntering(0, 0)` → `homeEntering(0, 12)` en `summary-reveal` | `funde sin espera ni desplazamiento` | aserción |
| M8 | `pct > 60` → `pct >= 60` en `collar-battery-bar.tsx` | `pinta 60% con bg-warning-strong` | aserción |
| M9 | `MOTION_FILL_TIMING` → `MOTION_FADE_TIMING` en `collar-battery-bar.tsx` | `llena la barra desde vacía con el preset de barra` | aserción |
| M10 | el valor compartido de la barra nace en `pct` también sin reduce motion | `llena la barra desde vacía con el preset de barra` | aserción |
| M11 | el efecto de la barra se ejecuta solo al montar (`[]` en vez de `[pct, …]`) | `anima del valor anterior al nuevo al refrescar` | aserción |

En M5 y M6, `detail` (el `useQuery` del detalle) y `selectedPetId` (de
`useSelectedPet()`) son los nombres que la base `37f6362c` ya tiene en
`src/screens/home/index.tsx`.
