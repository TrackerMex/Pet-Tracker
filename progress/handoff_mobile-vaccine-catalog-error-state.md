Worktree: /home/claude/sites/Pet-Tracker-wt-236

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

# Handoff #236 mobile-vaccine-catalog-error-state

Implementador: Codex CLI.

## Retoma tras el PARA de C4 (enmienda del leader)

El PARA de M1 venía de este handoff, no de la spec: pedía que cada mutación pusiera rojo
**solo** su fila. La regla de C4 ya está corregida abajo. M1 cumple la regla nueva: pone rojos
`#236 R3 … vacío` y `#236 R4`; que caigan también R1 y R2 es esperable, porque la mutación
pinta el aviso durante la carga.

Al retomar:

- no rehagas C1 a C3 (`1aba44d2`, `89598787`, `ab2262e4`);
- el primer comando de abajo sigue valiendo, pero ahora el log empieza por el commit de esta
  enmienda y debajo están C3, C2 y C1;
- reaplica a mano el diff de C4 que guardaste en tu reporte;
- anota M1 con la regla nueva y sigue con M2, M3, M4, el commit C4 y C5;
- conserva tu reporte y añade al final una sección «Retoma».

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-236 && pwd && git branch --show-current && git log --oneline -5`.
Confirma en el reporte la ruta y la branch `feature/236-mobile-vaccine-catalog-error-state`. Los
commits de arriba abajo: el de este handoff (`docs(progress): #236 codex handoff`), la casilla de
la enmienda `8dfcb8b2`, la firma `a96e7c8e`, el merge de `origin/dev` `b06e688f` y `3520733f`.

## Base

- Feature: mobile-vaccine-catalog-error-state (#236). Integra en `dev`, no en `main`.
- H0 (base del diff final): el commit de este handoff.
- NO hagas `git fetch`, `git merge`, `git rebase`, `git push` ni `bun install`. El worktree ya
  tiene `.env` y `mobile-pet-tracker/node_modules`.
- Anclas de partida, medidas por el leader en `8dfcb8b2` con `grep -cF` sobre
  `mobile-pet-tracker/src/screens/vaccine-create/index.tsx`: `accessibilityRole="alert"` da `1`,
  `<Button` da `1`, `{catalog.isPending ? (` da `1`, `testID="vaccine-create-catalog-error"` da
  `0`; `grep -cP '#236(?! R\d)'` da `0`. Desde la raíz,
  `grep -cF '## #236 mobile-vaccine-catalog-error-state' progress/smoke_mejoras-smoke.md` da `0`.
  Mídelas otra vez antes de C1 y anótalas. Si una no da la suya, PARA.

## Spec

- Aprobada con firma delegada (`a96e7c8e`, casilla de la enmienda de #208 en `8dfcb8b2`). Lee
  enteros `specs/mobile-vaccine-catalog-error-state/requirements.md`, `design.md`, `tasks.md` y
  `traceability.md`.
- Sin decisiones abiertas: «Decisiones cerradas por el `spec_author`» (D1 a D11) las cierra. Si
  encuentras una contradicción, PARA y anótala en el reporte; no adaptes la spec por tu cuenta.
- Criterios de aceptación: R1 a R9. La casilla de smoke de R9 (G2) es del humano: la pegas sin
  marcar y no la tocas.
- Sin copy nuevo: `health.couldNotLoadVaccines` y `common.retry`. `src/i18n/catalog.ts` no
  cambia. No inventes ningún literal.

## Orden y commits

Test primero, con historial rojo y después verde (C4 de CHECKPOINTS.md). Cinco commits, con los
mensajes literales de tasks.md §Orden de commits:

1. **C1** `test(mobile): aviso de error del catálogo de vacunas en rojo (R1,R2,R5,R6,R8)`: solo
   `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx`. Los `it` de R1 (los dos), R2,
   R5, R6 (los dos) y R8, con los nombres literales de requirements.md. Todos rojos por la
   aserción (el bloque no existe), no por un import roto; el resto del fichero, verde.
2. **C2** `test(mobile): usos de copy del aviso del catálogo en rojo (R7)`: solo
   `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` y
   `mobile-pet-tracker/src/__tests__/ui-language.test.ts`. Las dos filas literales de
   requirements.md R7, después de la de `validation.checkDetails`; el título del `it` `#208 R20`
   con ` (enmendado por #236 R7)` y `expect(R19_VACCINE_CREATE).toHaveLength(29 + 2); // #236 R7`.
   Rojo: `#208 R20 … (enmendado por #236 R7)` y
   `resuelve cada ocurrencia de la tabla contra la clave exacta`, porque el fuente aún no tiene
   esos usos. Anota cuáles caen y por qué; si cae otro `it`, PARA.
3. **C3** `feat(mobile): aviso de error del catálogo de vacunas con reintento (R1,R2,R5,R6,R7,R8)`:
   solo `mobile-pet-tracker/src/screens/vaccine-create/index.tsx`. La constante `catalogFailed`
   justo después de la línea de `entries` y el bloque literal de design.md §Decisiones técnicas,
   entre el `</Text>` de `vaccine-create-legend` y `{catalog.isPending ? (`. Sin imports nuevos.
   C1 y C2 pasan a verde. Mide la tabla «Anclas tras C3» de tasks.md y anota cada cifra.
4. **C4** `test(mobile): sin aviso con catálogo ok ni durante la carga (R3,R4)`: solo
   `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx`. Nacen verdes. Antes de
   commitear, corre las cuatro mutaciones de design.md §Pruebas de mutación de una en una:
   - planta la mutación en `catalogFailed`;
   - corre el fichero y anota la orden y qué `it` cae;
   - revierte con `git checkout HEAD -- mobile-pet-tracker/src/screens/vaccine-create/index.tsx`
     y comprueba `git diff --quiet -- mobile-pet-tracker/src/screens/vaccine-create/index.tsx`.
   Cada mutación debe poner rojo, como mínimo, los `it` de su fila de la tabla (design.md
   dice «Test que debe ponerse rojo», no «solo»). Si además cae otro `it`, anótalo con la
   aserción que cae y su motivo, y sigue. Si un `it` de la fila no cae, PARA. Ninguna se
   commitea.
5. **C5** `docs(progress): paso de smoke y trazabilidad de #236 (R9)`: solo
   `progress/smoke_mejoras-smoke.md`, `specs/mobile-vaccine-catalog-error-state/traceability.md`
   y `progress/impl_mobile-vaccine-catalog-error-state.md`.
   - Antes, los dos `grep -cF` de tasks.md §R9, desde la raíz, dan `0`.
   - Pega la sección literal de design.md §Paso de smoke al final del fichero, con una línea en
     blanco antes del `##`. Los dos `grep -cF` dan `1`.
   - traceability.md: cada fila con su test (`archivo::nombre`) y el hash y mensaje de sus
     commits. No rebasees después.

## Archivos

Lista cerrada, rutas desde la raíz:

- `mobile-pet-tracker/src/screens/vaccine-create/index.tsx` y su `index.test.tsx`;
- `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` y `mobile-pet-tracker/src/__tests__/ui-language.test.ts`,
  solo con lo de R7;
- `progress/smoke_mejoras-smoke.md`;
- `specs/mobile-vaccine-catalog-error-state/traceability.md`;
- `progress/impl_mobile-vaccine-catalog-error-state.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar `backend-pet-tracker/`, `package.json`, `bun.lock`,
`app.json`, `src/i18n/catalog.ts`, `src/api/`, `src/screens/health/`, ninguna otra guarda de
`src/__tests__/`, `init.sh`, `feature_list.json`, `docs/`, `progress/handoff_*.md`, el resto de
`progress/` ni el resto de `specs/`.

## Reglas críticas

- **Carta y skills.** `docs/architecture.md`, `docs/conventions.md` y `docs/ui-guidelines.md`
  mandan sobre cualquier skill. Carga, con los nombres que tú tienes:
  - `building-native-ui` (plugin expo): `Text` con `selectable`, `accessibilityRole="alert"`;
  - `appllama-app-design-skill` (`.agents/skills/`), que la carta exige al cambiar una pantalla.

  No hay equivalente tuyo de `expo-design-system` ni de `expo-data-fetching`: la regla de tokens
  (sin hex, sin clases `[...]`, sin `StyleSheet`) y el `refetch()` ya están en la spec. Lista en
  el reporte cuáles cargaste.
- **Literales a mano.** testIDs, textos, clases y nombres de los tests van escritos a mano,
  nunca importados de producción.
- **Dobles.** Los que ya tiene `index.test.tsx` (design.md §Tests: intención de cada doble):
  `mockCatalog`, `mockListPets`, `pending()`, `renderVaccineCreate()`, `apiUrl`, el array
  `catalog` y el `beforeEach`. No copies mocks de otros ficheros.
- **Esperas.** `docs/conventions.md` §Esperas sobre el árbol renderizado: espera siempre al nodo
  que aserta el test (`findByTestId`, `waitFor` sobre el nodo), nunca a un contador de mock.
  - R5: tras pulsar, espera a `vaccine-chip-cat-lepto` y, sobre ese nodo, asserta las llamadas,
    los cinco hijos, la selección y la ausencia del aviso (`waitFor` + `queryByTestId` `null`).
  - R6 es la única excepción, porque el árbol no gana ningún nodo al que esperar: tras cada
    pulsación, espera dentro de un `waitFor` a que `mockCatalog` tenga 2 (o 3) llamadas, y
    después asserta los nodos. La mutación `!catalog.isFetching && …` de C4 es la prueba de que
    esa espera ve el re-render: si no pone rojo el R6 «en vuelo», PARA.
- **RNTL 14.** `await` en `render`, `fireEvent` y `act`; sin `await`, un `it` contamina al
  siguiente.
- **`#236` en código y tests.** Siempre seguido de ` R<n>` (regla `HEX_LITERAL` de
  `design-drift` y `#177 R12.1`): un `#236` desnudo tumba la guarda.
- **Producción.** El bloque es literal (R8 lo lee del fuente): el `Button` sin `className`,
  `variant`, `size` ni `style`; sin `StyleSheet.create`, sin hex, sin clases `[...]`, sin copy
  nuevo, sin dependencias.
- **Jest.** Siempre desde `mobile-pet-tracker/` y con las rutas de los ficheros (sin
  paréntesis). Si una suite da timeout bajo carga, repítela sola antes de concluir. Un rojo
  conocido de flake (Salud `#168 R2`, Inicio `#152 R8`, Nutrición `#200 R9`/`R10`) se repite una
  vez y se anota.
- **Guardas tras C3**, con log y los `●` contados:
  `bunx jest src/__tests__/chunky-cta-canvas-fidelity.test.ts src/__tests__/design-drift.test.ts src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/alerts-canvas-fidelity.test.ts src/screens/vaccine-create/index.test.tsx > ../progress/jest_236_c3.log 2>&1; echo "jest=$?"`.
  Verde. Si cae una guarda, PARA: la spec dice que no cambian.
- **Suite de guardas completa**, antes de C5:
  `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__ src/screens/vaccine-create > ../progress/jest_236_final.log 2>&1; echo "jest=$?"`.
  Si sale con SIGKILL («failed to run»), cuenta 0 tests: repítelo.
- **Tipos y lint**, antes de C5, con logs:
  `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > ../progress/tsc_236.log 2>&1; echo $?`
  (si el `router.d.ts` existe, PARA; nunca `rm -f`) y
  `bunx expo lint --no-cache > ../progress/lint_236.log 2>&1 && test ! -s ../progress/lint_236.log && echo LINT_OK`.
  `expo lint` puede salir 0 tras un SIGKILL: vale el log vacío. Borra estos logs y los de jest
  antes de terminar; no se commitean.
- **Árbol limpio, acotado:** al terminar, `git status --short -- mobile-pet-tracker specs` vacío.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

`progress/impl_mobile-vaccine-catalog-error-state.md` (va en C5): salida del primer comando y las
anclas de partida; cada commit con su hash y, en los rojos, qué `it` cae y la aserción con su
recibido; las anclas tras C3; las cuatro mutaciones con su orden y el `it` que cae; las cifras de
jest (C3 y final), tsc y lint; las skills cargadas; cualquier PARA.

Última acción: crear `progress/impl_mobile-vaccine-catalog-error-state.done` con una sola línea:
la ruta del reporte. Es el marcador que vigila el leader; no lo commitees. Devuelve solo esa ruta.
