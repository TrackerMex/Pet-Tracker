Worktree: /home/claude/sites/Pet-Tracker-wt-235

# Handoff #235 mobile-profile-photo-owner-only

Implementador: Codex CLI.

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-235 && pwd && git branch --show-current && git log --oneline -3`.
Confirma en el reporte la ruta y la branch `feature/235-mobile-profile-photo-owner-only`. Los
commits de arriba abajo: el de este handoff (`docs(progress): #235 codex handoff`), el de firma
`03701fdb` (H0) y `6ad5141f` (la spec).

## Base

- Feature: mobile-profile-photo-owner-only (#235). Integra en `dev`, no en `main`.
- H0 (base del diff final): `03701fdb`, la firma delegada.
- NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install`. El worktree ya tiene
  `.env` y `mobile-pet-tracker/node_modules`.
- Los pasos de tasks.md «Paso 0» que mandan `fetch` y `merge` ya los hizo el leader: sáltalos y
  re-mide solo las anclas de partida.

## Spec

- Aprobada con firma delegada (`03701fdb`). Lee enteros
  `specs/mobile-profile-photo-owner-only/requirements.md`, `design.md`, `tasks.md` y
  `traceability.md`.
- Sin decisiones abiertas. Si encuentras una contradicción, PARA y anótala en el reporte; no
  adaptes la spec por tu cuenta.
- Criterios de aceptación: R1 a R4. La casilla del smoke es del humano y no la tocas.

## Orden y commits

Test primero, con historial rojo y después verde (C4 de CHECKPOINTS.md). Cinco commits, los
mensajes literales de tasks.md:

1. `test(mobile): #235 profile camera only for the owner (R1)`: rojo.
2. `test(mobile): #235 profile camera follows the selected pet (R3)`: rojo.
3. `feat(mobile): #235 profile camera only for the owner (R1, R3)`: verde.
4. `docs(spec): #235 traceability` con `traceability.md` rellena (hashes de 1, 2 y 3). No rebasees
   después.

Cada rojo lleva solo tests y cada verde solo `src/screens/profile/index.tsx`. Antes de cada rojo,
comprueba que los `it` nuevos fallan **por la aserción** (no por un import roto ni «Cannot find
module»). R2 y R4 nacen verdes (lista cerrada en tasks.md): no añadas más tests ni los edites. Si
otro `it` nace verde, anota «nace verde: <motivo>»; si no sabes por qué, PARA.

## Archivos

Lista cerrada:

- `mobile-pet-tracker/src/screens/profile/index.tsx` (solo en el commit 3: dos líneas añadidas y
  una quitada);
- `mobile-pet-tracker/src/screens/profile/index.test.tsx` (solo gana líneas, al final);
- `specs/mobile-profile-photo-owner-only/traceability.md`;
- `progress/impl_mobile-profile-photo-owner-only.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar `backend-pet-tracker/`, `package.json`, `bun.lock`,
`init.sh`, `feature_list.json`, `STATUS.md`, `progress/current.md`, `progress/history.md`,
`docs/`, `progress/handoff_*.md` ni otros `specs/`.

## Reglas críticas

- **Carta y skills.** `docs/architecture.md`, `docs/conventions.md` y `docs/ui-guidelines.md`
  mandan sobre cualquier skill. Carga con los nombres del catálogo de Codex
  `building-native-ui`. Lista en el reporte cuáles cargaste.
- **Literales a mano.** Los testIDs, nombres y roles de los tests son literales escritos a mano;
  nunca importados de producción.
- **Esperas.** `docs/conventions.md` §Esperas: espera siempre al nodo que aserta el test, nunca
  a un contador de mock. En el Test A de R3, espera `profile-pet-name` = `Milo` antes del `null`.
- **RNTL 14.** `await` en `render`, `renderRouter`, `fireEvent` y `act`; sin `await`, un `it`
  contamina al siguiente.
- **Mocks.** Nada de `jest.mock(…, { virtual: true })`. No cambies helpers ni `jest.mock` del
  fichero de test.
- **`#235` en código y tests.** Siempre seguido de ` R<n>` (regla `HEX_LITERAL` de
  `design-drift`): un `#235` desnudo tumba la guarda. En producción no cites `#235`.
- **Producción.** Sin `StyleSheet.create`, sin hex, sin clases `[...]`, sin copy nuevo, sin
  dependencias.
- **Jest.** Siempre desde `mobile-pet-tracker/` y con `--runTestsByPath` (los paths con
  paréntesis rompen el regex). Si una suite da timeout bajo carga, repítela sola antes de
  concluir. Un rojo conocido de flake (#200 R10 food-links, #168 R2, #152 R8) se repite solo y
  se anota.
- **Tipos y lint**, al final, con logs:
  `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > ../progress/tsc_235.log 2>&1; echo $?`
  (si el `router.d.ts` existe, PARA; nunca `rm -f`) y
  `bunx expo lint --no-cache > ../progress/lint_235.log 2>&1 && test ! -s ../progress/lint_235.log && echo LINT_OK`.
  `expo lint` puede salir 0 tras un SIGKILL: vale el log vacío. Borra esos logs antes de
  terminar; no se commitean.
- **Batería de mutaciones.** M1 a M9 de design.md, una cada vez, tras el commit verde. Planta,
  mide el ancla, corre el fichero de test, anota la orden y la salida de cada una, revierte con
  `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx` y comprueba cero
  diferencias. Ninguna se commitea.
- **Suite de guardas:** `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__`.
- **Candado de tamaño:** desde la raíz,
  `git diff --numstat 03701fdb -- mobile-pet-tracker/src/screens/profile/index.tsx` da
  `2<TAB>1`, y la del fichero de test tiene segunda columna `0`.
- **Árbol limpio, acotado:** al terminar,
  `git status --short -- mobile-pet-tracker specs` vacío.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

`progress/impl_mobile-profile-photo-owner-only.md`: salida del primer comando y de las anclas de
partida; cada commit con su hash y, en los rojos, la causa del rojo; los «nace verde»; las
mutaciones M1–M9; cifras de jest, tsc y lint; las skills cargadas; cualquier PARA.

Última acción: crear `progress/impl_mobile-profile-photo-owner-only.done` con una sola línea: la
ruta del reporte. Es el marcador que vigila el watcher; no lo commitees. Devuelve solo esa ruta.
