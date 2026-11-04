Worktree: /home/claude/sites/Pet-Tracker-wt-241
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).

# Handoff #241 mobile-health-vaccines-upcoming-past

Implementador: Codex CLI.

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-241 && pwd && git branch --show-current && git log --oneline -4`.
Confirma en el reporte la ruta y la branch `feature/241-mobile-health-vaccines-upcoming-past`.
Commits de arriba abajo: el de este handoff (`docs(progress): #241 codex handoff`), `2313669a`
(firma, H0), `74a98a5a` (spec) y `0f1ab26f` (`origin/dev`).

## Base

- Feature: mobile-health-vaccines-upcoming-past (#241). Integra en `dev`, no en `main`.
- H0 (base del diff final de producción): `2313669a`.
- NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install`. El worktree ya tiene `.env`
  y `mobile-pet-tracker/node_modules`: el paso T0 (1) de `tasks.md` ya está hecho, sáltalo.

## Spec

- Aprobada con firma delegada (`2313669a`) para R1 a R12. La casilla G2 (smoke) es del humano:
  no la tocas. La casilla de la Enmienda #241 en `specs/mobile-health/requirements.md` ya está
  marcada: no edites esa spec.
- Lee enteros `specs/mobile-health-vaccines-upcoming-past/requirements.md`, `design.md`,
  `tasks.md` y `traceability.md`. Las decisiones están cerradas (requirements §Decisiones y
  design §Alternativas). Si encuentras una contradicción, PARA y anótala; no adaptes la spec.
- Producción:
  - `src/utils/vaccine-dates.ts`: `splitVaccines` (D1).
  - `src/screens/health/index.tsx`: el código de design §Código prescrito, tal cual. Los
    atributos del `Pressable` de Pasadas van en una sola línea y en ese orden (literal 8 de
    R11).
  - `src/i18n/catalog.ts`: las dos claves de requirements §Copy nuevo. **Copy literal**: es
    `Próximas` / `Pasadas`, en `Upcoming` / `Past`. No inventes ni retoques texto.
  - Ni dependencias, ni colores nuevos, ni caja de vacío para Próximas (D5).

## Orden y commits

Test primero (C4 de `CHECKPOINTS.md`), los commits de `tasks.md` en su orden y con sus mensajes
literales en inglés, y después uno de trazabilidad. Las cifras son relativas a la línea base que
midas en T0 con la corrida de `tasks.md` T0 (3), desde `mobile-pet-tracker/`:
`bun run jest src/screens/health src/utils src/__tests__ src/providers`. Llámala `P` pasados,
0 fallidos. Cada fila de abajo es esa misma corrida.

1. T0: anclas y cuentas de requirements §Evidencia con el `node -e` de `tasks.md` T0 (2), y la
   corrida T0 (3). Sin commit.
2. `test(mobile): splitVaccines puts each vaccine on its side of today (R2)`. Rojo: `9 failed`
   (las 9 filas de `#241 R2`), `P` pasados. El rojo esperado es `splitVaccines is not a
   function`, no «Cannot find module».
3. `feat(mobile): splitVaccines partitions vaccines around today (R2)`. Verde: `P + 9`.
4. `test(mobile): splitVaccines orders both sections with an id tie-break (R3)`. Rojo:
   `1 failed` (`#241 R3`), `P + 9` pasados.
5. `feat(mobile): splitVaccines sorts upcoming ascending and past descending (R3)`. Verde:
   `P + 10`.
6. `test(mobile): copy and #227 recipe locks for the health sections (R1, R11)`. Rojo:
   `12 failed` (`#241 R1`, las 10 filas de `#241 R11: %s` y `#241 R11: inventario del fuente`),
   `P + 10` pasados.
7. Los siete rojos de pantalla, un commit por R-id, con los mensajes de `tasks.md` §R4 a R10.
   Fallidos acumulados tras cada uno: R4 → `13`, R5 → `15` (sus dos `it`), R6 → `16`,
   R7 → `21` (5 filas), R8 → `22`, R9 → `23` (solo `#241 R9: sin próximas no pinta su cabecera
   ni su lista`), R10 → `27` (4 filas). Pasados: `P + 10` en todos. El doble de iconos va en el
   commit de R5 y `expandVaccinesPast`, en el de R6, como dice `tasks.md`.
8. T-verde, un solo commit:
   `feat(mobile): split health vaccines into Upcoming and collapsed Past (R1, R4, R5, R6, R7, R8, R9, R10, R11)`.
   Lleva producción, catálogo, `ui-copy-table.ts`, §2.41 de `specs/mobile-ui-language/design.md`,
   los cuatro guards de requirements §Candados de guards y de recuento y los seis candados de
   §Candados en `screens/health/index.test.tsx`, todos sin sufijo todavía. Verde: `P + 37`
   pasados, 0 fallidos.
9. Sonda de R9 (abajo), sin commit. Después,
   `test(mobile): empty vaccines keep the empty state without sections (R9)`. Verde: `P + 38`.
10. `test(mobile): amended locks name their amendment (R12)`. Rojo: `1 failed` (`#241 R12`),
    `P + 38` pasados.
11. `test(mobile): suffix amended locks with #241 R12 (R12)`. Verde: `P + 39`, 0 fallidos.
12. `docs(spec): traceability for #241`: `traceability.md` con hashes. No rebasees después.

Antes de cada rojo comprueba que los `it` fallan **por la aserción** o por el nodo que esperan
y no existe (no por «Cannot find module», un import roto o un error de sintaxis). Si una cifra
difiere, anota la diferencia y el motivo; si no sabes el motivo, PARA.

**Regla de cierre** (requirements §Regla de cierre). Solo en T-verde: un `it` existente que
falle **solo** por las causas (a) a (d) se enmienda en ese commit, se suma a `AMENDED` en el
commit 10 y se anota en el reporte con ruta, título y causa. Si añades `n` así, las cifras desde
el commit 10 suben en `n` fallidos (commit 10) y la del commit 11 sigue en `P + 39`. Cualquier
otro rojo se reporta y no se toca.

## Archivos

Lista cerrada:

- `mobile-pet-tracker/src/utils/vaccine-dates.ts`;
- `mobile-pet-tracker/src/utils/__tests__/vaccine-dates.test.ts`;
- `mobile-pet-tracker/src/__tests__/health-vaccines-upcoming-past.test.ts` (nuevo);
- `mobile-pet-tracker/src/screens/health/index.tsx` (solo en T-verde);
- `mobile-pet-tracker/src/screens/health/index.test.tsx`;
- `mobile-pet-tracker/src/i18n/catalog.ts`;
- `mobile-pet-tracker/src/__tests__/ui-copy-table.ts`;
- `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`;
- `mobile-pet-tracker/src/__tests__/ui-language.test.ts`;
- `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`;
- otro test de `mobile-pet-tracker/src/` solo si cae bajo la Regla de cierre, anotado;
- `specs/mobile-ui-language/design.md` (solo §2.41, al final);
- `specs/mobile-health-vaccines-upcoming-past/traceability.md`;
- `progress/impl_mobile-health-vaccines-upcoming-past.md`, tu reporte.

Si necesitas otro fichero, PARA. No toques:

- `backend-pet-tracker/` ni `docs/`;
- `src/screens/reminders/` (R11 solo lo lee) ni `src/theme/`;
- `package.json`, `bun.lock`, `app.json` ni `init.sh`;
- `feature_list.json`, `STATUS.md`, `progress/current.md`, `progress/history.md` ni
  `progress/handoff_*.md`;
- `specs/mobile-health/requirements.md` ni otros `specs/` fuera de la lista.

Logs: los de `tasks.md` (`../progress/t0_mobile-health-vaccines-upcoming-past.log` y
`../progress/final_mobile-health-vaccines-upcoming-past.log`) se quedan sin commitear. Los demás
logs van a `/tmp/`.

**Sonda de R9.** Va con el commit 8 ya hecho y el `it` de vacío escrito sin commitear. La
mutación literal es la de `tasks.md` §R9 (1), en `src/screens/health/index.tsx`. Corre
`bun run jest src/screens/health` y anota que sale rojo `#241 R9: sin vacunas conserva el vacío
sin secciones`. Después revierte desde `mobile-pet-tracker/` con
`git checkout HEAD -- src/screens/health/index.tsx` y comprueba que
`git diff --quiet HEAD -- src/screens/health/index.tsx && git diff --cached --quiet` sale 0. La
sonda no se commitea.

## Reglas críticas

- **Carta y skills.** `docs/architecture.md`, `docs/conventions.md` y `docs/ui-guidelines.md`
  mandan sobre cualquier skill. Del catálogo de Codex, carga `building-native-ui`. Tu catálogo
  no tiene skill de animación, de design system ni de diseño de apps: esa guía está en la spec.
  Lista en el reporte cuáles cargaste.
- **Esperas.** `docs/conventions.md` §Esperas: cada `it` espera con `findBy…` o `waitFor` al
  nodo positivo que aserta. Por ejemplo: `findByTestId('vaccines-upcoming-list')`,
  `findByTestId('vaccines-past-toggle')`, `findByTestId('vaccines-past-list')`,
  `findByTestId('vaccines-past-count')` o `findByTestId('vaccines-empty-card')`. Nunca esperes a
  un contador de mock.
- **Literales a mano.** Los `testID`, clases, textos y el `hitSlop`
  `{ top: 6, bottom: 6, left: 6, right: 6 }` se escriben a mano en los tests, nunca importados
  de producción. Entre nodos compara `testID`, `className` o longitudes, nunca `toBe(nodo)` ni
  `toEqual(nodo)`. Los iconos del doble se buscan con `{ includeHiddenElements: true }`.
- **Relojes y zona.** El `describe` nuevo fija `jest.useFakeTimers({ now: new Date(2026, 11, 31, 12, 0) })`
  y restaura con `jest.useRealTimers()`. R10 cambia la zona con
  `process.getBuiltinModule('process')` dentro de `try`/`finally` (requirements §Convenciones).
  `process.env.TZ` a secas no cambia `Date` en jest.
- **No cambies imports, `jest.mock` ni helpers** de `screens/health/index.test.tsx` fuera de lo
  que dicen `tasks.md` y la Tabla de enmiendas (doble de iconos, `expandVaccinesPast`,
  `renderDates199`). El `describe` nuevo va al final del fichero.
- **RNTL 14.** `await` en `render`, `fireEvent` y `act`. `within(x)` no mira `x`.
- **`#241` en código, tests y comentarios.** Siempre seguido de ` R<n>`. Sin `StyleSheet` ni hex
  en tests ni fuente, sin clases `[...]` y sin copy fuera de R1.
- **Jest.**
  - Rutas por prefijo sin paréntesis.
  - Si el log dice «failed to run» o hay un SIGKILL, repite: eso cuenta 0 tests, no un verde.
  - Si un test da timeout bajo carga, repítelo solo.
  - Flakes conocidos: Salud `#168 R2`, Inicio `#152 R8` y Nutrición `#200 R9`/`R10`. Repite
    una vez y anota.
- **Tipos y lint**, al final, desde `mobile-pet-tracker/`:
  - Tipos:
    `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/tsc-241.log 2>&1; echo $?`.
    Si el `router.d.ts` existe, PARA. Nunca `rm -f`.
  - Lint:
    `bunx expo lint --no-cache > /tmp/lint-241.log 2>&1 && test ! -s /tmp/lint-241.log && echo LINT_OK`.
- **Anclas finales.** Desde `mobile-pet-tracker/src/`, mide con el `node -e` de `tasks.md` cada
  fila de la tabla de producción de requirements §Evidencia: debe dar su columna «Tras el
  cambio». Además, `grep -cF "(enmendado por #241 R12)"` imprime:
  - `6` en `screens/health/index.test.tsx`;
  - `2` en `__tests__/consistency-classnames.test.ts`;
  - `1` en `providers/__tests__/language-provider.test.tsx`;
  - `1` en `__tests__/ui-language.test.ts`;
  - más uno por cada `it` de la Regla de cierre, anotado.
- **Diff acotado, medido desde el commit de este handoff.** H0 es anterior, y el propio handoff
  aparecería en el diff.
  - `B=$(git log -1 --format=%h -- progress/handoff_mobile-health-vaccines-upcoming-past.md) && git diff --name-only $B..HEAD`
    solo lista ficheros de la lista cerrada.
  - `git log --format=%h $B..HEAD -- mobile-pet-tracker/src/screens/health/index.tsx | wc -l`
    imprime `1`: solo T-verde toca la pantalla.
- **Árbol limpio, acotado:** al terminar, `git status --short -- mobile-pet-tracker specs` vacío.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

Escribe `progress/impl_mobile-health-vaccines-upcoming-past.md` con:

- la salida del primer comando;
- T0: las cuentas de §Evidencia, `P` y los `●` del log;
- cada commit con su hash, la cifra medida y la causa del rojo;
- la sonda de R9 con su salida;
- los `it` de la Regla de cierre, si los hubo, con su causa;
- las anclas finales;
- las cifras finales de jest (con los `●` del log final), tsc y lint;
- los flakes repetidos;
- las skills cargadas;
- cualquier PARA.

Última acción: crea `progress/impl_mobile-health-vaccines-upcoming-past.done` con una sola línea,
la ruta del reporte. Es el marcador que vigila el watcher; no lo commitees. Devuelve solo esa
ruta.
