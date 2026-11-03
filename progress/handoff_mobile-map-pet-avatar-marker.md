Worktree: /home/claude/sites/Pet-Tracker-wt-230

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

# Handoff #230 mobile-map-pet-avatar-marker

Implementador: Codex CLI.

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-230 && pwd && git branch --show-current && git log --oneline -5`.
Confirma en el reporte la ruta y la branch `feature/230-mobile-map-pet-avatar-marker`. Los
commits de arriba abajo: la enmienda de R4 tras tu primera parada
(`docs(spec): #230 R4 unmount test is born green`), el handoff `764acfe8`, la firma `ce5f89af`,
el merge de `origin/dev` `c3004d51` y las correcciones de la auditoría `020983dd`.

**Reanudación.** Tu primera sesión paró antes de implementar por la contradicción de R4 (el
`it` de desmontaje nacía verde). Está resuelta en tasks.md R4 y abajo, en §Orden y commits.
Reescribe `progress/impl_mobile-map-pet-avatar-marker.md` desde cero y conserva al principio
una sección «Parada 1» de tres líneas con el motivo y la enmienda.

## Base

- Feature: mobile-map-pet-avatar-marker (#230). Integra en `dev`, no en `main`.
- H0 (base del diff final): el commit de la enmienda de R4, el primero de `git log`.
- NO hagas `git fetch`, `git merge`, `git rebase`, `git push` ni `bun install`. El worktree ya
  tiene `.env` y `mobile-pet-tracker/node_modules`.
- Anclas de partida, medidas por el leader en `ce5f89af` desde `mobile-pet-tracker/src/` (la
  tabla «Base medida» de requirements.md):
  - B1 `grep -cF "id: 'last-position'" components/pet-map.tsx` da `1`;
  - B2 `grep -oF 'markerIcon' components/pet-map.tsx | wc -l` da `0`;
  - B3 `test -e screens/map/pet-marker-icon.tsx && echo sí || echo no` da `no`;
  - B5 `grep -cF '<PetMarkerIcon' screens/map/index.tsx` da `0`;
  - B9 `grep -cP '#230(?! R\d)' screens/map/index.tsx components/pet-map.tsx` da `0` en los dos.

  Mídelas otra vez antes del primer commit y anótalas. Si una no da la suya, PARA.

## Spec

- Aprobada con firma delegada (`ce5f89af`; correcciones de la auditoría en `020983dd`). Lee
  enteros `specs/mobile-map-pet-avatar-marker/requirements.md`, `design.md`, `tasks.md` y
  `traceability.md`.
- Sin decisiones abiertas. Si encuentras una contradicción, PARA y anótala en el reporte; no
  adaptes la spec por tu cuenta.
- Criterios de aceptación: R1 a R11. La casilla G2 de requirements.md §Aprobación es del humano:
  no la toques.
- Sin copy nuevo: el compositor no lleva texto (R1). `src/i18n/` no cambia (B8). Sin
  dependencias nuevas: `react-native-view-shot` y `expo-linear-gradient` están vetadas (B7).

## Orden y commits

Test primero, con historial rojo y después verde (C4 de CHECKPOINTS.md). El orden es el de
tasks.md: **R2, R1, R3, R4, R5, R6, R7, R8, R9, R10, R11**. Por cada R, un commit rojo (solo
tests) y después uno verde (solo producción), con los mensajes literales de tasks.md. Nada de un
commit único con todo.

- **Rojos.** Cada `it` que tasks.md dice que cae, cae por la aserción o porque el módulo aún no
  existe (R1), no por un import roto de otro fichero. Anota qué `it` cae y la aserción con su
  recibido.
- **Nacen verdes.** Los marcados «nace verde» en tasks.md van en su commit rojo junto a los que
  caen. Antes de commitear, planta su mutación (la de tasks.md), corre el fichero, anota el `it`
  que cae, revierte con `git checkout HEAD -- <ruta>` y comprueba `git diff --quiet -- <ruta>`.
  Ninguna mutación se commitea. Si la mutación no pone rojo su `it`, PARA.
- **Excepción, R4.** «#230 R4: desmontado antes del segundo frame no captura»
  nace verde, pero su mutación necesita la captura: plántala **después** del
  commit verde de R4, como dice tasks.md R4 (enmendado tras tu parada). El rojo
  de R4 lo da el primer `it`.
- **Rojo sin la llamada.** Si un rojo cae porque falta la llamada que el test
  lee (por ejemplo, `mockToDataURL.mock.calls[1]` es `undefined` antes del
  verde de R6), vale como rojo: anota el error y la línea.
- **R8 enmienda un `it` de R6.** En el commit rojo de R8, el literal de clave del primer `it` de
  R6 pasa a `'["pet-1","Luna","https://cdn.example/pets/luna.jpg"]'` y su título gana el sufijo
  ` (enmendado por #230 R8)`.
- **R11** son siete filas que nacen verdes: las seis del `it.each` y «importa solo lo suyo». Una
  mutación por fila (lista de tasks.md R11); cada una pone rojo, como mínimo, su fila. Si cae
  además otra fila, anótalo con su motivo y sigue. Si su fila no cae, PARA. Si alguna guarda cae
  sin mutación, va el commit `fix(mobile): marker composer passes the map drift guards (R11)`.
- **Cierre**: `docs(progress): trazabilidad de #230 (R1-R11)`, solo
  `specs/mobile-map-pet-avatar-marker/traceability.md` y
  `progress/impl_mobile-map-pet-avatar-marker.md`. Cada fila con su test (`archivo::nombre`) y el
  hash y mensaje de sus commits, y la línea «Mutaciones de las filas que nacen verdes» con lo
  que anotaste. No rebasees después.

## Archivos

Lista cerrada, rutas desde `mobile-pet-tracker/src/`:

- `components/pet-map.tsx` y `components/__tests__/pet-map.test.tsx` (R2);
- `screens/map/pet-marker-icon.tsx` y `screens/map/pet-marker-icon.test.tsx`, nuevos;
- `screens/map/index.tsx` y `screens/map/index.test.tsx` (R10);
- `__tests__/map-canvas-fidelity.test.ts`, solo el `describe('#230 R1, R10 y R11: compositor del marcador', …)`
  al final del fichero.

Y desde la raíz: `specs/mobile-map-pet-avatar-marker/traceability.md` y
`progress/impl_mobile-map-pet-avatar-marker.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar `backend-pet-tracker/`, `package.json`, `bun.lock`,
`app.json`, `src/i18n/`, `src/api/`, `src/theme/`, `components/pet-avatar.tsx`, ninguna otra
guarda de `src/__tests__/`, `init.sh`, `feature_list.json`, `docs/`, `progress/handoff_*.md`, el
resto de `progress/` ni el resto de `specs/`.

## Reglas críticas

- **Carta y skills.** `docs/architecture.md`, `docs/conventions.md` y `docs/ui-guidelines.md`
  mandan sobre cualquier skill. Carga, con los nombres que tú tienes:
  - `building-native-ui` (plugin expo): SVG, imágenes y estilos en línea;
  - `appllama-app-design-skill` (`.agents/skills/`), que la carta exige al cambiar una pantalla.

  No tienes equivalente de `expo-overview` ni de `expo-animation`: los frames, el plazo de
  4000 ms y la captura están escritos en la spec. Lista en el reporte cuáles cargaste.
- **Dobles.** Los de tasks.md §Dobles, tal cual: el `jest.mock('react-native-svg', …)` y el de
  `expo-image` de cada fichero, con `__esModule: true` (un spread de `requireActual` lo pierde).
  Sin `virtual: true`. No copies mocks de otros ficheros.
- **Literales a mano.** testIDs, claves, base64, tamaños y nombres de los tests van escritos a
  mano, nunca importados de producción. Las sentinelas son objetos planos: nunca `toBe` entre
  nodos del árbol.
- **Esperas.** `docs/conventions.md` §Esperas sobre el árbol renderizado: espera siempre al nodo
  que aserta el test (`findByTestId`, `waitFor` sobre el nodo), nunca a un contador de mock. En
  `pet-marker-icon.test.tsx` no hay `waitFor`: los frames y los callbacks se disparan a mano
  dentro de `act`. En `index.test.tsx` (R10), el `beforeEach` global deja la última posición en
  `pending`: cada `it` fija la suya, como dice tasks.md R10.
- **RNTL 14.** `await` en `render`, `rerender`, `fireEvent` y `act`; sin `await`, un `it`
  contamina al siguiente. Todo lo que cuelga de `map-marker-icon` lleva
  `{ includeHiddenElements: true }` en `getByTestId` y `queryByTestId`.
- **Sin reindentar.** El móvil no tiene prettier: en `index.tsx` y `pet-map.tsx` añade lo nuevo
  sin cambiar la sangría de lo que ya está.
- **`#230` en código y tests.** Siempre seguido de ` R<n>` (regla `HEX_LITERAL` de
  `design-drift` y de la guarda de hex de R11): un `#230` desnudo tumba la guarda. B9 lo mide.
- **Producción.** Sin `StyleSheet.create`, sin hex, sin clases `[...]`, sin `className` en el
  compositor (solo `style` en línea), sin emoji, sin copy, sin dependencias. El color es el token
  `accent-foreground` vía `useThemeColors`.
- **Jest.** Siempre desde `mobile-pet-tracker/` y con las rutas de los ficheros (sin
  paréntesis). Si una suite da timeout bajo carga, repítela sola antes de concluir. Un rojo
  conocido de flake (Salud `#168 R2`, Inicio `#152 R8`, Nutrición `#200 R9`/`R10`) se repite una
  vez y se anota.
- **Guardas tras el verde de R10**, con log y los `●` contados:
  `bunx jest src/__tests__/map-canvas-fidelity.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/jest-virtual-mock-lock.test.ts src/__tests__/canvas-foundations.test.ts src/components/__tests__/pet-map.test.tsx src/screens/map > ../progress/jest_230_r10.log 2>&1; echo "jest=$?"`.
  Verde. Si cae una guarda existente, PARA: la spec dice que no cambian.
- **Suite de guardas completa**, antes del cierre:
  `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__ src/screens/map > ../progress/jest_230_final.log 2>&1; echo "jest=$?"`.
  Si sale con SIGKILL («failed to run»), cuenta 0 tests: repítelo. Anota el total de
  `map-canvas-fidelity.test.ts` antes y después: sube en **9**.
- **Tipos y lint**, antes del cierre, con logs:
  `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > ../progress/tsc_230.log 2>&1; echo $?`
  (si el `router.d.ts` existe, PARA; nunca `rm -f`) y
  `bunx expo lint --no-cache > ../progress/lint_230.log 2>&1 && test ! -s ../progress/lint_230.log && echo LINT_OK`.
  `expo lint` puede salir 0 tras un SIGKILL: vale el log vacío. Borra estos logs y los de jest
  antes de terminar; no se commitean.
- **Anclas finales.** Mide B1–B9 de requirements.md §Base medida y anota cada cifra junto a la
  esperada.
- **Árbol limpio, acotado:** al terminar, `git status --short -- mobile-pet-tracker specs` vacío.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

`progress/impl_mobile-map-pet-avatar-marker.md` (va en el commit de cierre): salida del primer
comando y las anclas de partida; cada commit con su hash y, en los rojos, qué `it` cae y la
aserción con su recibido; cada mutación con la orden y el `it` que cae; las cifras de jest (R10 y
final), tsc y lint; B1–B9 finales; las skills cargadas; cualquier PARA.

Última acción: crear `progress/impl_mobile-map-pet-avatar-marker.done` con una sola línea: la
ruta del reporte. Es el marcador que vigila el leader; no lo commitees. Devuelve solo esa ruta.
