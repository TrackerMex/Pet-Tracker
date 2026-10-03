Veredicto: aprobado

# review: mobile-weekly-day-row-accessible-lock (#130)

Fecha: 2026-09-28 21:50 UTC
HEAD revisado: `7a68bb1a4ff106ff5a5c405a2b13cb6cf1946b72`, branch `feature/130-mobile-weekly-day-row-accessible-lock`, worktree `/home/claude/sites/Pet-Tracker`.
Skills cargadas: `expo:expo-overview` y `expo:expo-native-ui`.

Arranque: `pwd` dio `/home/claude/sites/Pet-Tracker`, `git branch --show-current` dio la branch de #130, `git rev-parse HEAD` dio `7a68bb1a…` y `git status --short` salió vacío. No he tocado otros worktrees ni he cambiado de branch.

## init.sh (lo corrió el leader; he leído yo el log)

Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker-mobile-pet-tracker/c1edfdc1-1af4-41a9-b58e-c094475189fd/scratchpad/130_init.log`, con mtime 21:41 UTC, posterior al commit `7a68bb1a` (21:29 UTC). El log no imprime su propio `exit`. El leader informa `exit=0` y el log cierra con `✅ Todo verde. Listo para trabajar.`

```
Build                 ✅ Build exitoso (nest build + cdk synth --quiet)
Backend unit          Test Suites: 171 passed, 171 total / Tests: 1307 passed, 1307 total
Infra                 Test Suites: 2 passed, 2 total / Tests: 14 passed, 14 total
Harness (node:test)   # tests 28 / # fail 0 ; # tests 5 / # fail 0 ; …
Móvil                 Test Suites: 83 passed, 83 total / Tests: 1552 passed, 1552 total / Snapshots: 1 passed, 1 total
e2e                   Test Suites: 3 skipped, 27 passed, 27 of 30 total / Tests: 8 skipped, 389 passed, 397 total
Lint                  ✅ Lint sin errores
Typecheck             ✅ Typecheck sin errores
```

He comprobado de dónde salen las líneas `ERROR`, y todas vienen de tests que recorren a propósito un camino de error:
- Backend unit: `AlertsEngineConsumerService` («malformed message body: invalid JSON», `messageId: 'bad'`), `PositionsConsumerService` (cuerpo malformado, errores de zod) y `PollerService` («sqs unavailable», «wialon down for device-1» y «cannot resolve queue url: ECONNREFUSED»).
- e2e: el `DrizzleQueryError` de la FK `pet_users_user_id_users_id_fk` sale de `backend-pet-tracker/test/pets.e2e-spec.ts` › `si el insert de pet_users falla, la fila de pets no persiste (rollback)`. Ese test firma un token para un `ghostId` que no existe en `users` y espera `status >= 500` sin ninguna fila huérfana en `pets`.
- Hay 30 bloques `● Console` de ruido, la misma cifra que la base. El aviso `.env` desactualizado (RESEND_*, RESET_LINK_HOST) es del entorno y no tiene que ver con esta feature.

## Checklist C2: estado coherente
- [x] Solo una feature en `in_progress`: `[(130, 'mobile-weekly-day-row-accessible-lock')]`, leído de `feature_list.json` con python.
- [x] `progress/current.md` describe la sesión activa de #130: arranque, spec, espejo Notion, gate y handoff.
- [x] Codex no tocó los artefactos del leader. `git diff --name-only 6ab1d9b6..HEAD` da solo el test, `progress/impl_…md` y `traceability.md`.

## Checklist C3: arquitectura
- [x] Solo se añaden tests en la capa de presentación móvil (`src/screens/home/`). No se tocan dominio, aplicación ni infraestructura (design.md §Archivos afectados).
- [x] Ningún import nuevo. El diff del test es solo aditivo (0 líneas `-`) y no añade ningún `import`.
- [x] No aplica a contratos ni repositorios: no hay ninguno implicado.

## Checklist C4: TDD (vía b, declarada en la spec antes del handoff)

La vía b está declarada en requirements.md §Qué firma, puntos 4 y 7, y en tasks.md. R3 figura como requisito sin test, cerrado por inspección.

- [x] Cada R-id con test tiene un test que lo nombra: `describe('#130 R1: …')` y `describe('#130 R2: …')`. R3 no tiene test y está declarado así.
- [x] La historia va test primero, en 5 commits y en este orden. Los mensajes son literales al handoff y no llevan trailers:

| Commit | Mensaje | gráfica (`git rev-parse <c>:…chart.tsx`) | test (`…chart.test.tsx`) | Esperado (tasks.md) |
|---|---|---|---|---|
| base `6ab1d9b6` y `origin/main` | — | `c258abed…` | `d9687b16…` | base ✓ |
| `24321406` | `test(mobile): expose the weekly day row collapse with a versioned mutation (R1)` | `7e1055207b4c…` (P1red) | `70312d8720ab…` | ✓ ✓ |
| `f1a57a7a` | `test(mobile): lock the weekly day row out of the accessibility tree (R1)` | `c258abedde92…` | `70312d87…` | ✓ (revierte) |
| `7a7b2e6b` | `test(mobile): expose a wrapper around the weekly day columns with a versioned mutation (R2)` | `b2487b5380e8…` (P2red) | `24a5c572d5f7…` | ✓ ✓ |
| `c0601924` | `test(mobile): lock the weekly day columns as direct children of the row (R2)` | `c258abedde92…` | `24a5c572…` | ✓ (revierte) |
| `7a68bb1a` | `docs(mobile): record the weekly day row lock evidence (R3)` | `c258abed…` | `24a5c572…` | final ✓ |

- `git show 24321406` cambia el test (+14) y la gráfica (+1, `        accessible` debajo del `testID` de la fila). `f1a57a7a` solo quita esa línea.
- `git show 7a7b2e6b` cambia el test (+26) y la gráfica (+2: `        <View accessible>` encima del `days.map` y `        </View>` debajo del `))}`). `c0601924` solo quita esas dos líneas.
- [x] **Los dos rojos, reproducidos por mí sobre toda la suite móvil.** Primero `git checkout <commit> -- <gráfica> <test>` y comprobación del blob con `hash-object`. Después `bunx jest > /tmp/rv130/rXred_full.log 2>&1; echo "exit=$?"`. Por último, `git checkout HEAD --` de los dos ficheros.
  - **R1 rojo (`24321406`)**: `exit=1`, con `Test Suites: 1 failed, 82 passed, 83 total`, `Tests: 1 failed, 1550 passed, 1551 total` y `Snapshots: 1 passed, 1 total`. El único `●` es `#130 R1: … › la fila solo lleva su testID, su clase, su estilo y sus hijos`. Falla por `expect(received).toEqual(expected) // deep equality`, con `+ "accessible"` en `Received`.
  - **R2 rojo (`7a7b2e6b`)**: `exit=1`, con `Test Suites: 1 failed, 82 passed, 83 total`, `Tests: 1 failed, 1551 passed, 1552 total` y `Snapshots: 1 passed, 1 total`. El único `●` es `#130 R2: … › las siete columnas cuelgan de la fila, y la fila, de la tarjeta`. Falla por `expect(received).toEqual(expected)`: se esperaban los 7 `testID` y se recibió `[undefined]`. R1 sigue verde, porque solo hay 1 failed.
- [x] Ningún rojo falla por `ReferenceError` o `TypeError`, ni por mutar un doble: las dos mutaciones son de producción (la gráfica) y cada verde las revierte al blob `c258abed`.
- [x] La sonda de R1 (`accessible`) sobre el árbol final da 1 failed de 43, solo R1 y por `toEqual`. R2 sigue verde.

## Checklist C5: trazabilidad
- [x] `traceability.md` no tiene filas «pendiente». La única aparición de la palabra es la línea de la regla («el reviewer no aprueba si alguna fila queda «pendiente»»).
- [x] Hashes: R1 es `24321406…` / `f1a57a7a…`, R2 es `7a7b2e6b…` / `c0601924…` y R3 cita el verde de R2, `c0601924…`, como pide tasks.md. `git merge-base --is-ancestor <hash> HEAD` da `exit=0` en los cuatro.
- [x] Los tests citados existen y nombran su R-id. Los he visto en verde en `/tmp/rv130/head_chart.log` (`✓ la fila solo lleva su testID…` y `✓ las siete columnas cuelgan de la fila…`).
- [x] Formato de commit: `<tipo>(mobile): <desc> (R<n>)`. El tipo es `test`/`docs` y no `feat` porque no hay código de feature. Lo fija la convención de `traceability.md` aprobada, y es el mismo precedente que #74 (`5911d142`, `12afe47d`…).

## Checklist C6: spec aprobada
- [x] Los cuatro ficheros llevan `status: approved`. La casilla `[x] **Aprobado por humano** (fecha: 2026-09-28)` está en requirements.md.
- [x] La firma es `ceb6a51e`, que solo cambia los cuatro frontmatter y la casilla, y cita la página de Notion, `Estado del gate: Aprobado` y `page_last_edited_at` 2026-09-28T19:53:45.191Z.
- [x] Nada cambia después de la firma. `git diff --stat ceb6a51e HEAD -- specs/` da solo `traceability.md` (los hashes). El blob de requirements.md es `09ba84ba` y el de tasks.md, `deb609e7`, iguales en todos los commits desde `ceb6a51e` hasta HEAD.

## Checklist C7: sin código huérfano
- [x] N/A: esta feature no reemplaza nada existente. Solo añade dos `describe`.

## Checklist C8: UI móvil (docs/ui-guidelines.md)
- [x] **El árbol de producción no cambia.** `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` da 0 y la gráfica termina en `c258abed`, así que no hay UI nueva que evaluar: dimensiones, Skeleton, componentes compartidos, touch targets y animaciones quedan como en `origin/main`.
- [x] Grep-clean en lo que sí cambia, el test: `grep -ciE "stylesheet|text-\[10px\]"` da 0 en los dos ficheros. Tampoco hay hex: ningún `#` va sin ` R<n>` detrás, y `#68 R18` de `design-drift.test.ts` pasa en HEAD (54 passed del resto en la sonda `hexbare`, y la suite entera verde).

## Evidencia por R-id

### R1: la fila no se vuelve un nodo accesible
- Test en `weekly-activity-chart.test.tsx::#130 R1: la fila de las siete columnas no se vuelve un nodo accesible › la fila solo lleva su testID, su clase, su estilo y sus hijos`. Asevera `Object.keys(getByTestId('weekly-activity-day-row').props).sort()` `toEqual(['children', 'className', 'style', 'testID'])`, que es un literal.
- Rojo reproducido: solo R1, por `toEqual`. Sondas reproducidas: `accessible` y `hide`/`ariahidden` (abajo).

### R2: entre la tarjeta y cada columna no hay otro nodo
- Test en `weekly-activity-chart.test.tsx::#130 R2: entre la tarjeta y cada columna no hay otro nodo › las siete columnas cuelgan de la fila, y la fila, de la tarjeta`. Asevera con `toEqual` los `testID` de `row.children` contra los 7 literales del `2026-09-02` al `2026-09-08`, y con `toBe` que `row.parent?.props.testID` es `'weekly-activity-card'`.
- Rojo reproducido: solo R2, por `toEqual`. Sondas reproducidas: `wrapout` (`toBe`), `wrapin` y `extra` (`toEqual`).

### R3: cierre (por inspección)
1. Delta: la gráfica pasa de 41 a 43 (medido en HEAD: `exit=0`, `Tests: 43 passed, 43 total`). La suite pasa de 83/1550/1 a 83/1552/1 (log de init.sh). Son +0 suites y +2 tests. `origin/main` no se ha movido, así que la base vale.
2. `git diff --exit-code origin/main...HEAD` da 0 sobre la gráfica, `package.json`, `bun.lock`, `src/i18n/catalog.ts`, `src/components/card.tsx`, `src/screens/home/index.tsx`, `index.test.tsx`, `src/__tests__/design-drift.test.ts`, `src/__tests__/consistency-classnames.test.ts`, `src/providers/__tests__/language-provider.test.tsx` y `src/__tests__/ui-copy-table.ts`.
   `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` da **solo** `…/weekly-activity-chart.test.tsx | 40 ++++`.
3. Los tres `it` de `R9: cada columna se anuncia por separado` salen `✓` en HEAD. El diff del test tiene 0 líneas borradas y un único hunk (`@@ -1426,3 +1426,17 @@`) detrás del cierre de `#74 R3`: ningún `describe` de #68 ni de #74 cambia, ni tampoco sus helpers o mocks.
4. Greps de candado, re-medidos por mí:

| grep | resultado |
|---|---|
| `CONTINUOUS_CORNER` / `TABULAR_NUMS` / `radiogroup` / `Platform` | 1 / 4 / 1 / 0 |
| `stylesheet|text-[10px]` | 0 en los dos |
| `use-api` en el test | 1 |
| `useApi`/`use-api` en los bloques nuevos | 0 |
| `weekly-activity-day-row` | 3 |
| `^describe('#130 R` | 2 |
| `#130` / `#130 R[12]:` | 4 / 4 |
| `#NNN` sin ` R<n>` en los bloques nuevos | ninguno |

5. `test ! -e .expo/types/router.d.ts` da `exit=0`. `bunx tsc --noEmit` da `exit=0` con el log vacío. `bunx eslint` de los dos ficheros da `exit=0` con el log vacío.
6. No hay ninguna dependencia ni copy nueva: `package.json`, `bun.lock`, el catálogo y `ui-copy-table.ts` no cambian.
7. La tabla de sondas está en el reporte de Codex: 21 filas, con blob, exit, cuentas, `it`, matcher y tipo.

## Tabla de sondas: contraste del reporte con «Exigido»

Las 21 filas del reporte coinciden con la columna «Exigido» de tasks.md §Sondas, tanto en veredicto como en blob (prefijo de 8): accessible, collapse, label, arialabel, ifano, role, rolealias y rowpress dan rojo en R1 por `toEqual` (collapse y label añaden los huecos por `toBeUndefined`). hide y ariahidden dan 11: los 9 de #68 y R1 y R2 por consulta. wrapout da R2 por `toBe`. wrapin y extra dan R2 por `toEqual`. flexcol y nopad quedan verdes. colnoacc y colnorole caen en el día medido por `toBe`, colnostate en el tooltip por `toEqual`, cardacc y cardpress en la tarjeta. hexbare da 1 de 55 en `#68 R18`.

### Sondas reproducidas por mí sobre el árbol final

Una cada vez: mutación, `git hash-object`, `bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx` sin pipe y `git checkout HEAD --` de los dos ficheros. Después de cada una, `git diff --exit-code -- mobile-pet-tracker/src` dio 0 y `git status --short` salió vacío. Los logs están en `/tmp/rv130/probe_<sonda>.log`.

| Sonda | Blob | exit | Tests | Rojos y primera línea | ¿= Exigido? |
|---|---|---|---|---|---|
| `accessible` | `7e1055207b4c…` | 1 | 1 failed, 42 passed, 43 | `#130 R1` con `expect(received).toEqual`. R2 verde | ✓ |
| `hide` | `a074287002c9…` | 1 | 11 failed, 32 passed, 43 | R3 `toEqual`; R5×2, R6, R9×2 y R8×2 por `Unable to find an element with testID`; R13 `toHaveLength`; `#130 R1` y `#130 R2`, los dos con `Unable to find an element with testID: weekly-activity-day-row` (por consulta) | ✓ |
| `ariahidden` | `d01ae732ca68…` | 1 | 11 failed, 32 passed, 43 | los mismos 11 y los mismos tipos que `hide` | ✓ |
| `wrapout` | `cf839e3216dd…` | 1 | 1 failed, 42 passed, 43 | `#130 R2` con `expect(received).toBe(expected) // Object.is equality` | ✓ |
| `wrapin` | `b2487b5380e8…` | 1 | 1 failed, 42 passed, 43 | `#130 R2` con `expect(received).toEqual` | ✓ |
| `extra` | `5049a9a4831c…` | 1 | 1 failed, 42 passed, 43 | `#130 R2` con `expect(received).toEqual` | ✓ |
| `flexcol` | `99ec492be516…` | 0 | 43 passed, 43 | verde: hueco declarado (F) | ✓ |
| `nopad` | `9cb811796c24…` | 0 | 43 passed, 43 | verde: hueco declarado (F) | ✓ |
| `hexbare` (test) | `658a4ee1b7f5…` | 1 | 1 failed, 54 passed, 55 (`design-drift.test.ts`) | `#68 R18 › keeps arbitrary text, hex colors, and StyleSheet out of feature sources` con `toEqual` | ✓ |

### Candados no tautológicos
- Los esperados son literales escritos en el test: las 4 claves, los 7 `testID` y `'weekly-activity-card'`. No se importa ningún símbolo de la gráfica ni hay imports nuevos. En R2 el lado «received» sale del árbol pintado (`child.props.testID`, `row.parent`), no de `makeWeek`.
- Cada candado muere por su aserción ante la mutación de su clase (tabla de arriba), y la sonda de un requisito no dispara el otro (`accessible` solo da R1; `wrapin` y `wrapout` solo dan R2).

### Zona ciega buscada: una mutación que funde las columnas sin que la vea nadie
- **`wrapcard`** (mía, fuera de la tabla de la spec). En la gráfica, `    <View accessible>` va justo encima de `    <Card testID="weekly-activity-card" className="gap-2">` (el `return` del componente) y `    </View>` justo debajo de `    </Card>`. El blob es `cec8a26e4f276f0a0615702a03626d2b0f3acfcc`, y da **`exit=0`, 43 passed de 43**. En Android esto funde en un solo nodo de TalkBack toda la tarjeta, las siete columnas incluidas. No lo ven ni R1 (las claves de la fila no cambian), ni R2 (`row.parent` sigue siendo la tarjeta), ni `#74 R2` (las props de la tarjeta no cambian).
- **No es bloqueante para esta feature.** R2 fija lo que la spec aprobada promete, «todo nodo host entre la tarjeta y cada columna» (§Qué firma, punto 1, y design.md). Los ancestros de la tarjeta quedan fuera por la (D) «La gráfica es la raíz de lo que pinta este test». Codex implementó exactamente la spec firmada y los cuatro criterios de aceptación de `feature_list.json` #130 se cumplen. Pero esa (D) solo excluye la Home (`src/screens/home/index.tsx`), y este envoltorio vive **dentro de la gráfica**: la premisa «la tarjeta es la raíz de la gráfica» es cierta hoy y no tiene candado. Ver la observación 1.

## Drift contra origin/main
- `git fetch origin` dio `exit=0`. `origin/main` sigue en `3cf09ca5477534dde266da3c46810dee72dbf4bf`: `git log 3cf09ca5..origin/main` sale vacío y no hay cambios bajo `mobile-pet-tracker/src/screens/home/`. `git merge-base HEAD origin/main` es `3cf09ca5`.
- Los blobs de base en `origin/main` y en `6ab1d9b6` son la gráfica `c258abed` y el test `d9687b16`.

## Estado del árbol al terminar
`git status --short` sale vacío, y `git diff --exit-code -- mobile-pet-tracker/src` y `git diff --cached --exit-code` dan 0. HEAD sigue en `7a68bb1a`. No he hecho commits, push ni PRs. Este reporte es el único fichero nuevo y queda sin commitear para el leader.

## Observaciones (no bloqueantes)

1. **Hueco sin candado: un envoltorio accesible por encima de la tarjeta, dentro de la propia gráfica** (sonda `wrapcard`, blob `cec8a26e`, 43/43 verde). Funde las siete columnas igual que `wrapout` y `wrapin`, pero no lo ven R1, R2 ni `#74 R2`. La (D) de la spec solo aparta la Home, no el `return` de `WeeklyActivityChart`. Es candidato a **(F)**: lo registra el leader, con id asignado contra `origin/main`, junto a la (F) de forma y alineación.
2. **La (F) declarada sigue abierta, como se firmó**: `flexcol` y `nopad` salen verdes (43/43). Queda pendiente registrarla, tal como indica requirements.md §Fuera de alcance.
3. **Catálogo de Codex (deuda B5).** El reporte dice que la cabecera local de `building-native-ui` es la **v1.0.1**, pero CLAUDE.md y el handoff hablan del plugin `expo@openai-curated` **v1.0.2**. En esta feature no importa (no hay UI), pero conviene contrastar la versión en `.claude/agents/leader.md` §Catálogo real de skills de Codex.
4. **Restaurar después de `git checkout <commit> -- <ruta>`.** Esa forma **deja el cambio en el índice**, así que un `git checkout -- <ruta>` posterior restaura desde el índice y conserva la versión roja (me pasó a mí, y `git status` mostró `M ` en los dos ficheros). Lo resolví con `git checkout HEAD -- <ruta>` y verifiqué `diff` y `diff --cached` en 0. El paso 5 de tasks.md §Sondas vale para mutaciones editadas a mano, no para reproducir un rojo desde un commit. Los futuros encargos al reviewer deberían pedir `git checkout HEAD --`.
5. **La autoría git no distingue al implementador.** Los cinco commits de Codex llevan `Claude <claude@srv1178023.hstgr.cloud>`, igual que los del leader (`6ab1d9b6`). La separación «quien implementa no revisa» se apoya en el proceso y no en la historia. Lo dejo solo como nota informativa.
6. **El handoff listaba solo 3 ficheros para el diff acumulado contra `origin/main`**, pero `origin/main...HEAD` incluye también los del leader (`feature_list.json`, `progress/current.md`, el handoff y la spec). Codex lo explicó bien en su reporte (§Alcance frente a `origin/main`), y bajo `mobile-pet-tracker/` solo aparece el test.
7. **El log de init.sh no imprime su `exit`**. He aceptado el `exit=0` que informa el leader porque el log cierra con `✅ Todo verde`. El lint del backend corre con `--fix`, y el árbol quedó limpio, así que no modificó nada.
